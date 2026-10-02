/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThucThiQuyetDinh() { };
ThucThiQuyetDinh.prototype = {
    dtQuyetDinh: [],
    strQuyetDinh_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    strSinhVien_Id: '',
    strSinhVien_QuyetDinh: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);

        me.getList_QuyetDinh();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiQuyetDinh();

        $("#btnSearch").click(function (e) {
            me.getList_QuyetDinh();
        });
        $("#txtSearch_QD").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuyetDinh();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnCloseQuyetDinh").click(function () {
            me.toggle_edit();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_QuyetDinh").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_QuyetDinh();
            }
        });
        $("[id$=chkSelectAll_QuyetDinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuyetDinh" });
        });
        $("#btnXoaQuyetDinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyetDinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyetDinh(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_QuyetDinh();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblQuyetDinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblQuyetDinh");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID")[0];
                me.viewEdit_QuyetDinh(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('#dropSearch_HeDaoTao_QD,#dropHeDaoTao_CL,#dropHeDaoTao_CCT').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao(edu.util.getValCombo(this.id));
            me.getList_ChuongTrinhDaoTao("");
            me.getList_LopQuanLy("", "");
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QD,#dropKhoaDaoTao_CL,#dropKhoaDaoTao_CCT').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao(edu.util.getValCombo(this.id));
            me.getList_LopQuanLy(edu.util.getValCombo(this.id), "");
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QD,#dropChuongTrinh_CL,#dropChuongTrinh_CCT').on('select2:select', function (e) {
            
            me.getList_LopQuanLy("", edu.util.getValCombo(this.id));
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_QD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QD").each(function () {
                this.checked = checked_status;
            });
        });
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnThucThi', 'click', function () {
            var id = this.id;
            var strSinhVien_QuyetDinh = edu.util.cutPrefixId(/remove_nhansu/g, id);
            me.toggle_QuyetDinh();
            var objSinhVien = edu.util.objGetOneDataInData(strSinhVien_QuyetDinh, me.dtSinhVien, "ID");
            me.strSinhVien_Id = objSinhVien.QLSV_NGUOIHOC_ID;
            me.strSinhVien_QuyetDinh = strSinhVien_QuyetDinh;
            $("#lblThongTin").html(objSinhVien.QLSV_NGUOIHOC_HODEM + " " + objSinhVien.QLSV_NGUOIHOC_TEN + " - " + objSinhVien.QLSV_NGUOIHOC_MASO);
            $("#lblChuongTrinhHienTai").html(objSinhVien.DAOTAO_TOCHUCCHUONGTRINH_TEN);
            $("#lblLopHienTai").html(objSinhVien.DAOTAO_LOPQUANLY_TEN);
            $("#lblTrangThaiHienTai").html(objSinhVien.TRANGTHAINGUOIHOC_TEN);
            me.getList_LopHienTai(objSinhVien.QLSV_NGUOIHOC_ID);
            // ẨN: getList_ChuongTrinhHienTai - dành cho khối Chuyển chương trình (giữ để mở lại khi cần)
            // me.getList_ChuongTrinhHienTai(objSinhVien.QLSV_NGUOIHOC_ID);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var strSinhVien_QuyetDinh = edu.util.cutPrefixId(/remove_nhansu/g, this.id);
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_SinhVien_QuyetDinh(strSinhVien_QuyetDinh);
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.LQD", "dropQuyetDinh_Loai");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.CQD", "dropQuyetDinh_Cap");
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtQuyetDinh_So", "THONGTIN1": "EM" },
        ];
        me.autoWithDiv("zoneTTQD", "zoneChuyenLop");
        /* ẨN: autoWithDiv cho 2 khối đã ẩn (giữ để mở lại khi cần)
        me.autoWithDiv("zoneChuyenTrangThai", "zoneChuyenChuongTrinh");
        */
        $("#btnChuyenLop").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn chuyển lớp không?", "w");
            $("#btnYes").click(function (e) {
                me.save_ChuyenLop();
            });
        });
        /* ẨN: handler btnChuyenChuongTrinh - khối Chuyển chương trình đã ẩn (giữ để mở lại khi cần)
        $("#btnChuyenChuongTrinh").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn chuyển chương trình không?", "w");
            $("#btnYes").click(function (e) {
                me.save_ChuyenChuongTrinh();
            });
        });
        */
        /* ẨN: handler btnChuyenTrangThai - khối Chuyển trạng thái đã ẩn, quy về Chuyển lớp (giữ để mở lại khi cần)
        $("#btnChuyenTrangThai").click(function () {
            console.log(12111);
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái không?", "w");
            $("#btnYes").click(function (e) {
                console.log(2222222);
                me.save_ChuyenTrangThai();
            });
        });
        */
        $("#btnDelete_ThucThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien_QuyetDinh(arrChecked_Id[i]);
                }
            });
        });
        $("#btnThucThi_DanhSach").click(function () {
            // Cho phép chạy lại: nhặt cả checkTT (chưa thực thi) và checkX (đã thực thi)
            var arrChecked_TT = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkTT");
            var arrChecked_X = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            var arrChecked_Id = arrChecked_TT.slice();
            for (var i = 0; i < arrChecked_X.length; i++) {
                var strThucThi_Id = arrChecked_X[i];
                var svRecord = null;
                for (var j = 0; j < me.dtSinhVien.length; j++) {
                    if (me.dtSinhVien[j].QLSV_QUYETDINH_THUCTHI_ID == strThucThi_Id) {
                        svRecord = me.dtSinhVien[j];
                        break;
                    }
                }
                if (svRecord && arrChecked_Id.indexOf(svRecord.ID) == -1) {
                    arrChecked_Id.push(svRecord.ID);
                }
            }
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên cần thực thi?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực thi cho " + arrChecked_Id.length + " sinh viên đã chọn?", "w");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessTT"></div>');
                edu.system.genHTML_Progress("zoneprocessTT", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThucThi_MH(arrChecked_Id[i]);
                }
            });
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strQuyetDinh_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        var arrId = ["txtQuyetDinh_Ten", "dropQuyetDinh_Loai", "txtQuyetDinh_So",
            "txtQuyetDinh_Ngay", "txtQuyetDinh_NgayHieuLuc", "txtQuyetDinh_NgayKetThuc",
            "dropThoiGianDaoTao_QD", "txQuyetDinh_MoTa", "dropQuyetDinh_Cap",
            "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtQuyetDinh_File", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuyetDinh();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },

    toggle_QuyetDinh: function () {
        edu.util.toggle_overide("zone-bus", "zoneQuyetDinh");
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
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
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var objList = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
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
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
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
            renderPlace: ["dropSearch_HeDaoTao_QD", "dropHeDaoTao_CL", "dropHeDaoTao_CCT"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_QD", "dropKhoaDaoTao_CL", "dropKhoaDaoTao_CCT"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_QD", "dropChuongTrinh_CL", "dropChuongTrinh_CCT"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_QD", "dropLopQuanLy_CL", "dropLopMoiKhongThuc_CCT", "dropLopMoi_CCT"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QD").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ThucThiQuyetDinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QD"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropThoiGianDaoTao_QD"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.ThucThiQuyetDinh.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_QD_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_QD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_QD").html(row);
        main_doc.ThucThiQuyetDinh.genCombo_TrangThai(data);
    },
    genCombo_TrangThai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropTrangThaiMoi", "dropTrangThaiMoi_CL"],
            title: "Chọn trạng thái mới"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearch_NamNhapHoc_QD"],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_QD"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
    },
    getList_MauImport: function () {
        var me = this;
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
    },
    getList_QuyetDinh: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_QD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_QD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_QD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_QD"),
            'strTrangThaiNguoiHoc_Id': "",
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh_QD'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_ThoiGianDaoTao_QD'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuyetDinh = dtReRult;
                    me.genTable_QuyetDinh(dtReRult, data.Pager);
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
    save_QuyetDinh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh/ThemMoi',            

            'strId': me.strQuyetDinh_Id,
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Loai'),
            'strSoQuyetDinh': edu.util.getValById('txtQuyetDinh_So'),
            'strNgayQuyetDinh': edu.util.getValById('txtQuyetDinh_Ngay'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Cap'),
            'strNgayHieuLuc': edu.util.getValById('txtQuyetDinh_NgayHieuLuc'),
            'strNguyenNhan_LyDo': edu.util.getValById('txQuyetDinh_MoTa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_QD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'SV_QuyetDinh/CapNhat'
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyetDinh_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strQuyetDinh_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strQuyetDinh_Id = obj_save.strId
                    }
                    edu.system.saveFiles("txtQuyetDinh_File", strQuyetDinh_Id, "SV_Files");
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strQuyetDinh_Id);
                        }
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }                
                me.getList_QuyetDinh();
            },
            error: function (er) {
                edu.system.alert("SV_QuyetDinh/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyetDinh: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_QuyetDinh/Xoa',            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_QuyetDinh();
                }
                else {
                    obj = {
                        content: "SV_QuyetDinh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
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
    genTable_QuyetDinh: function (data, iPager) {
        var me = this;
        $("#lblQuyetDinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",

            bPaginate: {
                strFuntionName: "main_doc.ThucThiQuyetDinh.getList_QuyetDinh()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                },
                {
                    "mDataProp": "SOQUYETDINH",
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "CAPQUYETDINH_TEN"
                },
                {
                    "mDataProp": "NGUYENNHAN_LYDO"
                },
                {
                    "mData": "SOLUONG",

                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONG);
                    }
                },
                {
                    "mData": "KHOAQUANLY_TEN",
                    "mRender": function (nRow, aData) {
                        return '<div id="lblFile' + aData.ID + '"></div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.SOLUONG > 0)
                            return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-cutlery color-active"></i></a></span>';
                        return "";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            edu.system.viewFiles("lblFile" + data[i].ID, data[i].ID, "SV_Files");
        }
    },
    viewEdit_QuyetDinh: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropQuyetDinh_Loai", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("dropQuyetDinh_Cap", data.CAPQUYETDINH_ID);
        edu.util.viewValById("dropThoiGianDaoTao_QD", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtQuyetDinh_So", data.SOQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_Ngay", data.NGAYQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_NgayHieuLuc", data.NGAYHIEULUC);
        edu.util.viewValById("txQuyetDinh_MoTa", data.NGUYENNHAN_LYDO);
        edu.util.viewHTMLById("lblQuyetDinh_Loai", data.LOAIQUYETDINH_TEN);
        edu.util.viewHTMLById("lblQuyetDinh_Cap", data.CAPQUYETDINH_TEN);
        edu.util.viewHTMLById("lblThoiGianDaoTao_QD", data.DAOTAO_THOIGIANDAOTAO_NAM + "_" + (data.DAOTAO_THOIGIANDAOTAO_NAM + 1) + "_" + data.DAOTAO_THOIGIANDAOTAO_KY + "," + data.DAOTAO_THOIGIANDAOTAO_DOT);
        edu.util.viewHTMLById("lblQuyetDinh_So", data.SOQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_Ngay", data.NGAYQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_NgayHieuLuc", data.NGAYHIEULUC);
        edu.util.viewHTMLById("lblQuyetDinh_MoTa", data.NGUYENNHAN_LYDO);
        edu.system.viewFiles("txtQuyetDinh_File", data.ID, "SV_Files");
        me.strQuyetDinh_Id = data.ID;
        me.getList_SinhVien();
    },
    getList_SinhVien: function () {
        var me = main_doc.ThucThiQuyetDinh;
        var obj_list = {
            'action': 'SV_QuyetDinh_NguoiHoc/LayDanhSach',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': "",
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
                    me.dtSinhVien = dtResult;
                    me.genTable_SinhVien(dtResult);
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_QuyetDinh_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        var obj_save = {
            'action': 'SV_QuyetDinh_NguoiHoc/ThemMoi',

            'strId': "",
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_QuyetDinh_Id': strQLSV_QuyetDinh_Id,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ToChucCT_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien_QuyetDinh: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'SV_QuyetDinh_ThucThi/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);                
            },
            type: 'POST',
            action: obj_delete.action,   
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ThucThi_MH: function (strId) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strId, me.dtSinhVien, "ID");
        if (!aData) return;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKR4VKTQiFSko',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh_ThucThi',
            'iM': edu.system.iM,

            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ToChucCT_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strTrack_Id': edu.util.returnEmpty(aData.TRACK_ID),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessTT", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        //var jsonForm = {
        //    strTable_Id: "tblInput_DTSV_SinhVien",
        //    aaData: data,
        //    bPaginate: {
        //        strFuntionName: "main_doc.QuyetDinh.getList_QuyetDinh()",
        //        iDataRow: 1,
        //        bFilter: true
        //    },
        //    colPos: {
        //        center: [0, 5, 6],
        //        //right: [5]
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "MA1"
        //        },
        //        {
        //            "mDataProp": "QLSV_NGUOIHOC_MASO"
        //        },
        //        {
        //            //"mDataProp": "PHANLOAI_TEN",
        //            "mRender": function (nRow, aData) {
        //                return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
        //            }
        //        },
        //        {
        //            "mDataProp": "DAOTAO_LOPQUANLY_TEN"
        //        },
        //        {
        //            "mDataProp": "NHOMLOP_TEN"
        //        },
        //        {
        //            "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
        //        },
        //        {
        //            "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
        //        },
        //        {
        //            "mRender": function (nRow, aData) {
        //                return aData.QLSV_QUYETDINH_THUCTHI_ID? "Đã thực thi": "";
        //            }
        //        }
        //        , {
        //            "mRender": function (nRow, aData) {
        //                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
        //            }
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);

        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].SINHVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_MASO + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM + " " + data[i].QLSV_NGUOIHOC_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_LOPQUANLY_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHOMLOP_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_KHOADAOTAO_TEN + "</span></td>";
            if (data[i].QLSV_QUYETDINH_THUCTHI_ID == null) {
                html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' class='btnThucThi poiter'><i class='fa fa-cutlery'></i></a></td>";
                html += "<td></td>";
                html += '<td class="td-center"><input type="checkbox" id="checkTT' + data[i].ID + '"/></td>';
            } else {
                html += "<td></td>";
                html += "<td class='td-center'><a id='remove_nhansu" + data[i].QLSV_QUYETDINH_THUCTHI_ID + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].QLSV_QUYETDINH_THUCTHI_ID + '"/></td>';
            }
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].SINHVIEN_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.ThucThiQuyetDinh;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + edu.system.util(aData.NHOMLOP_TEN) + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnThucThi poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    
    autoWithDiv: function (divA, divB) {
        var iHeightA = $("#" + divA).height();
        var iHeightB = $("#" + divB).height();
        if (iHeightA > iHeightB) {
            $("#" + divB).attr("style", "height: " + (iHeightA + 20) + "px");
        } else {
            $("#" + divA).attr("style", "height: " + (iHeightB + 20) + "px");
        }
    },
    getList_LopHienTai: function (strNguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo_ThongTinHienTai/LayDSLopHienTai',

            'strNguoiHoc_Id': strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genCombo_LopHienTai(dtResult, iPager);
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
    genCombo_LopHienTai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_LOPQUANLY_ID",
                parentId: "",
                name: "DAOTAO_LOPQUANLY_TEN",
                selectOne: true
            },
            renderPlace: ["dropLopHienTai_CL"],
            title: "Chọn lớp hiện tại"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_ChuyenLop: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_ThucThi/ThucThi_ChuyenLop',

            'strId': "",
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopQuanLy_Cu_Id': edu.util.getValById("dropLopHienTai_CL"),
            'strDaoTao_LopQuanLy_Moi_Id': edu.util.getValById("dropLopQuanLy_CL"),
            'strTrangThaiNguoiHoc_Moi_Id': edu.util.getValById("dropTrangThaiMoi_CL"),
            'strTo_Moi_Id': edu.util.getValById("txtTo_CL"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                    me.toggle_edit();
                    me.getList_SinhVien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /* ẨN: các hàm hỗ trợ khối "Chuyển chương trình học" - giữ code để mở lại khi cần
    getList_ChuongTrinhHienTai: function (strNguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo_ThongTinHienTai/LayDSChuongTrinhHocHienTai',

            'strNguoiHoc_Id': strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genCombo_ChuongTrinhHienTai(dtResult, iPager);
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
    genCombo_ChuongTrinhHienTai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_CHUONGTRINH_TEN",
                selectOne: true
            },
            renderPlace: ["dropChuongTrinhHienTai_CCT"],
            title: "Chọn chương trình hiện tại"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_ChuyenChuongTrinh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_ThucThi/ThucThi_ChuyenChuongTrinhHoc',

            'strId': "",
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ToChucCT_Cu_Id': edu.util.getValById("dropChuongTrinhHienTai_CCT"),
            'strDaoTao_ToChucCT_Moi_Id': edu.util.getValById("dropChuongTrinh_CCT"),
            'strDaoTao_LopQuanLy_Moi_Id': (edu.util.getValById("dropLopMoi_CCT") != "") ? edu.util.getValById("dropLopMoi_CCT") : edu.util.getValById("dropLopMoiKhongThuc_CCT"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.toggle_edit();
                    me.getList_SinhVien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    */
    /* ẨN: save_ChuyenTrangThai - khối Chuyển trạng thái đã ẩn, quy về Chuyển lớp (giữ để mở lại khi cần)
    save_ChuyenTrangThai: function () {
        var me = this;
        var aData = edu.util.objGetOneDataInData(me.strSinhVien_QuyetDinh, me.dtSinhVien, "ID");
        var obj_save = {
            'action': 'SV_QuyetDinh_ThucThi/ThucThi_ChuyenTrangThai',

            'strId': "",
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopQuanLy_Cu_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ToChucCT_Cu_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTrangThaiNguoiHoc_Cu_Id': aData.TRANGTHAINGUOIHOC_ID,
            'strTrangThaiNguoiHoc_Moi_Id': edu.util.getValById("dropTrangThaiMoi"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.toggle_edit();
                    me.getList_SinhVien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    */

    getList_LoaiQuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiQuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiQuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyetDinh_Loai", "dropSearch_QuyetDinh_QD"],
            type: "",
            title: "Chọn loại quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },
}