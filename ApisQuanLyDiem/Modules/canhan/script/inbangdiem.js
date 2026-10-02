/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function InBangDiem() { };
InBangDiem.prototype = {
    dtQuyetDinh: [],
    strQuyetDinh_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    strPhamViMa: '',
    strSinhVien_Id: '',
    strDaoTao_LopQuanLy_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHAMVITONGHOPDIEM", "", "", function (data) {
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "MA",
                    avatar: "MA"
                },
                renderPlace: ["dropPhanViTongHop"],
                type: "",
                title: "Chọn phạm vi",
            }
            edu.system.loadToCombo_data(obj);
        });

        //me.getList_SinhVien();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_LoaiXet();
        me.getList_KeHoach();
        me.getList_ThoiGianDaoTao();
        me.getList_NamNhapHoc();
        //me.getList_HinhThuc();
        //me.getList_LoaiQuyetDinh();
        me.getList_KhoaQuanLy();
        $("#btnSearch").click(function (e) {
            me.getList_SinhVien();
        });
        $("#txtSearch_QD").keypress(function (e) {
            if (e.which === 13) {
                me.getList_SinhVien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
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
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#tblSinhVien").delegate('.btnEdit', 'click', function (e) {
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
        $("#tblSinhVien").delegate('.btnViewBangDiem', 'click', function (e) {
            var strId = this.id;
            $("#myModal_Diem").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $("#lblSinhVienDiem").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_KetQuaHocTap(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnViewBangDiemTheoKhoi', 'click', function (e) {
            var strId = this.id;
            $("#myModal_TichLuyTheoKhoi").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            console.log('[ChungChi] === CLICK btnViewBangDiemTheoKhoi ===');
            console.log('[ChungChi] Row selected:', data);
            console.log('[ChungChi] QLSV_NGUOIHOC_ID:', data.QLSV_NGUOIHOC_ID);
            console.log('[ChungChi] DAOTAO_TOCHUCCHUONGTRINH_ID:', data.DAOTAO_TOCHUCCHUONGTRINH_ID);
            console.log('[ChungChi] DAOTAO_CHUONGTRINH_ID:', data.DAOTAO_CHUONGTRINH_ID);
            $("#lblSinhVienDiem2").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_TichLuyTheoKhoi(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);
            me.getList_HocPhanChuaQua(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);
            me.getList_KetQuaChungChi(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblDiemSinhVien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            $("#myModal").modal("show");
            me.getList_DiemThanhPhan(strId);
            
        });
        $("#tblSinhVien").delegate('.btnViewKetQuaDangKy', 'click', function (e) {
            var strId = this.id;
            $("#myModal_KetQuaDangKy").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            $("#lblSinhVienDiem3").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_ThoiGianDangKy(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnViewKetQuaDangKyCaLop', 'click', function (e) {
            var strId = this.id;
            $("#modal_ketquadkcalop").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            //me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            $("#lblLopKetQua").html('Lớp ' + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_KHOADAOTAO_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_CHUONGTRINH_TEN))
            me.getList_KetQuaHocKy(data);
            $("#lblHocKyKetQua").html("");

        });
        $("#tblSinhVien").delegate('.btnDiemKetThuc', 'click', function (e) {
            var strId = this.id;
            $("#modal_diemketthuc").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            $("#lblSinhVienDiem4").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_DiemKetThuc(data);

        });
        $('#dropSearch_HeDaoTao_QD').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_ThoiGianDangKy').on('select2:select', function (e) {
            me.getList_KetQuaDangKy(me.strSinhVien_Id);
        });
        $('#dropSearch_LoaiXet').on('select2:select', function (e) {
            me.getList_KeHoach();
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_QD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QD").each(function () {
                this.checked = checked_status;
            });
        });
        
        $("#dropPhanViTongHop").on("select2:select", function () {
            var strMa = $("#dropPhanViTongHop option:selected").attr("id");
            me.strPhamViMa = strMa;
            edu.util.toggle_overide("zonePhamVi", "zone_" + strMa);
        });
        edu.system.getList_MauImport("zonebtnSVQD", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_QD'),
                'strNamNhapHoc': edu.util.getValById('txtAAAA'),
                'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
                'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
                'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
                'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
                'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
                'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
            };
            addKeyValue("strPhamViTongHopDiem_Id", edu.util.getValById('dropPhanViTongHop'));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo('dropPhanViTongHop_' + main_doc.InBangDiem.strPhamViMa));
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            arrChecked_Id.forEach(e => {
                addKeyValue('strQlsv_NguoiHoc_Id', e);
            })
        });
        $("#tblHocKy_KetQua").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblHocKy_KetQua");
            if (edu.util.checkValue(strId)) {
                me.strDaoTao_ThoiGianDaoTao_Id = strId;
                //var data = edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID")[0];
                //me.viewEdit_QuyetDinh(data);
                me.getList_HocPhanDangKy();
                $("#lblHocKyKetQua").html($("#tblHocKy_KetQua tbody tr[id=" + strId + "] td:eq(1)").html());
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });


        $("#tblLop_KetQua").delegate('.btnDSBuoiHoc', 'click', function (e) {
            var strId = this.id;
            
        });
        $("#btnSave_DiemKetThuc").click(function () {
            var arrChecked_Id = [];
            var arrXoa = [];
            var x = $("#tblDiemKetThuc .select-opt");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != $(x[i]).attr("name")) arrChecked_Id.push(x[i].id.split('_')[1]);
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.save_DiemKetThuc(e));
        });
        $('#dropSearch_KhoaQuanLy_QD').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            setTimeout(function () {
                me.getList_LopQuanLy();
            }, 100);
            
            me.resetCombobox(this);
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
            "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy", "dropHinhThuc"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtQuyetDinh_File", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_SinhVien();
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValCombo("dropSearch_KhoaQuanLy_QD"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            strDaoTao_KhoaQuanLy_Id: edu.util.getValCombo("dropSearch_KhoaQuanLy_QD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_QD"),
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
            renderPlace: ["dropSearch_HeDaoTao_QD"],
            type: "",
            title: "Tất cả hệ đào tạo",
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
            renderPlace: ["dropSearch_KhoaDaoTao_QD"],
            type: "",
            title: "Tất cả khóa đào tạo",
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
            renderPlace: ["dropSearch_ChuongTrinh_QD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
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
            renderPlace: ["dropSearch_Lop_QD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QD").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.InBangDiem;
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
            title: "Tất cả học kỳ",
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
            renderPlace: ["dropThoiGianDaoTao_QD", "dropPhanViTongHop_HOCKY", "dropPhanViTongHop_NHIEUKY", "dropPhanViTongHop_DOTHOC"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },

    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.InBangDiem.dtTrangThai = data;
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
            renderPlace: ["dropSearch_NamNhapHoc_QD", "dropPhanViTongHop_NAMHOC"],
            type: "",
            title: "Tất cả năm nhập học",
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
            title: "Tất cả khoa quản lý",
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

    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'D_BaoCao/LayDanhSachHoSoNhieuNganh',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
            'strNguoiThucHien_Id': edu.system.userId,
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
    genTable_QuyetDinh: function (data, iPager) {
        var me = this;
        $("#lblSinhVien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            bPaginate: {
                strFuntionName: "main_doc.InBangDiem.getList_SinhVien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 9, 10, 15],
                right: [11]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewBangDiem" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewBangDiemTheoKhoi" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewKetQuaDangKy" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewKetQuaDangKyCaLop" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDiemKetThuc" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    //"mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGNOPHI);
                    }
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
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }, {
                    "mDataProp": "DTBTICHLUYHE4TOANKHOA"
                },
                {
                    "mDataProp": "DTBTICHLUYHE10TOANKHOA"
                },
                {
                    "mDataProp": "SOTCTICHLUYTOANKHOA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_QuyetDinh: function (data) {
        var me = this;
        $("#lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN));
        me.strQuyetDinh_Id = data.QLSV_NGUOIHOC_ID;
        me.getList_DiemSinhVien();
    },

    getList_DiemSinhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'D_BaoCao/LayDSDiemKetThucCaNhan',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strQuyetDinh_Id,
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
                    me["dtDiemSinhVien"] = dtResult;
                    me.genTable_DiemSinhVien(dtResult);
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
    genTable_DiemSinhVien: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemSinhVien",
           
            aaData: data,
            colPos: {
                center: [0, 5, 3, 4, 6, 7, 8, 9,10],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN",
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTC",
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },


    getList_DiemThanhPhan: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var aData = me.dtDiemSinhVien.find(e => e.ID == strDaoTao_HocPhan_Id)
        var obj_list = {
            'action': 'D_BaoCao/LayDSDiemThanhPhanCaNhan',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strQuyetDinh_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'dLanHoc': aData.LANHOC,
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
                    me.genTable_DiemThanhPhan(dtResult);
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
    genTable_DiemThanhPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThanhPhan",

            aaData: data,
            colPos: {
                center: [0, 2, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DIEM",
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_LoaiXet: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_KeHoach/LayDSPhanLoaiXetTheoND1',
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiXet(json);
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
    cbGenCombo_LoaiXet: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiXet"],
            type: "",
            title: "Chọn loại xét",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_LoaiXet'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoach(json);
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
    cbGenCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoachXet"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KetQuaHocTap: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/KetQuaHocTapCaNhan',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
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
                    me["dtKetQua"] = dtResult;
                    var arrThanhPhan = [];
                    me.dtKetQua.rsDiemThanhPhan.forEach(element => {
                        if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
                    });
                    me.genHtml_BangDiem();
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_BangDiem: function () {
        var me = this;
        var data = me.dtKetQua.rsDiemKetThucHocPhan;

        var arrHocKy = [];
        data.forEach(element => {
            var strHocKy = element.NAMHOC + "_" + element.HOCKY;
            if (arrHocKy.indexOf(strHocKy) === -1) arrHocKy.push(strHocKy);
        });

        var htmlBangDiem = "";
        var check = true;
        arrHocKy.forEach(element => {
            var strNamHoc = element.substring(0, element.lastIndexOf('_'));
            var strHocKy = element.substring(element.lastIndexOf('_') + 1);
            var jsonDiem = data.filter(element => element.NAMHOC === strNamHoc && element.HOCKY == strHocKy);

            htmlBangDiem += '<a class="color-active poiter" data-toggle="collapse" data-target="#hocky_' + element + '"> + Năm học ' + strNamHoc + ' - Học kỳ ' + strHocKy + '</a><br />';
            htmlBangDiem += '<div id="hocky_' + element + '" class="collapse ';
            htmlBangDiem += check ? "in" : 'in'; check = false;
            htmlBangDiem += '">';
            htmlBangDiem += '<div class="zone-content scroll-table-x">';
            htmlBangDiem += '<table class="table">';
            htmlBangDiem += '<thead>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<th class="td-center td-fixed">Stt</th>';
            htmlBangDiem += '<th class="td-left">Mã học phần</th>';
            htmlBangDiem += '<th class="td-left">Tên học phần</th>';
            htmlBangDiem += '<th class="td-center">Số tín chỉ</th>';
            htmlBangDiem += '<th class="td-center">Lần học</th>';
            htmlBangDiem += '<th class="td-center">Lần thi</th>';
            htmlBangDiem += '<th class="td-center">Điểm hệ 10</th>';
            htmlBangDiem += '<th class="td-center">Điểm hệ 4</th>';
            htmlBangDiem += '<th class="td-center">Điểm chữ</th>';
            htmlBangDiem += '<th class="td-center">Đánh giá</th>';
            htmlBangDiem += '<th class="td-center">Ghi chú</th>';
            //htmlBangDiem += '<th class="td-center">Chi tiết</th>';
            htmlBangDiem += '</tr>';
            htmlBangDiem += '</thead>';
            htmlBangDiem += '<tbody>';

            for (var i = 0; i < jsonDiem.length; i++) {
                htmlBangDiem += '<tr>';
                htmlBangDiem += '<td class="td-center td-fixed">' + (i + 1) + '</td>';
                htmlBangDiem += '<td class="td-left">' + edu.util.returnEmpty(jsonDiem[i].DAOTAO_HOCPHAN_MA) + '</td>';
                htmlBangDiem += '<td class="td-left">' + edu.util.returnEmpty(jsonDiem[i].DAOTAO_HOCPHAN_TEN) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].DAOTAO_HOCPHAN_HOCTRINH) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].LANHOC) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].LANTHI) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].DIEM) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].DIEMQUYDOI) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].DIEMQUYDOI_TEN) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].DANHGIA_TEN) + '</td>';
                htmlBangDiem += '<td class="td-center">' + edu.util.returnEmpty(jsonDiem[i].GHICHU) + '</td>';
                //htmlBangDiem += '<td class="td-center"><span><a class="btn btn-default btnXemDiemThanhPhan" id="' + jsonDiem[i].ID + '" title="Chi tiết"> Chi tiết</a></span></td>';
                htmlBangDiem += '</tr>';
            }

            htmlBangDiem += '</tbody>';
            htmlBangDiem += '</table>';



            htmlBangDiem += '<table class="table table-noborder">';
            htmlBangDiem += '<tbody>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Tổng số tín chỉ:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            var temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            //console.log(temp);
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Điểm trung bình hệ 10:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            //temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null);
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Điểm trung bình hệ 4:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Tổng số tín chỉ tích lũy:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Điểm trung bình tích lũy hệ 10:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            //temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null);
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<td class="td-right italic" colspan="5">Điểm trung bình tĩnh lũy hệ 4:</td>';

            htmlBangDiem += '<td class="td-right italic">';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            htmlBangDiem += temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '</td>';

            htmlBangDiem += '</tr>';
            htmlBangDiem += '</tbody>';

            htmlBangDiem += '</table>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';

        });
        $("#zone_bangdiem").html(htmlBangDiem);
    },

    getList_TichLuyTheoKhoi: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayKetQuaTichLuyTheoKhoi',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_TongHopDiem(dtResult.rsTongHop);
                    me.genTable_TongHopDiemHP(dtResult.rsChiTiet);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TongHopDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiem",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MAKHOI"
                },
                {
                    "mDataProp": "TENKHOI"
                },
                {
                    "mDataProp": "TONGSOTINCHICUAKHOI"
                },
                {
                    "mDataProp": "SOBATBUOC"
                },
                {
                    "mDataProp": "SODATICHLUY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return parseInt(edu.util.returnZero(aData.SOBATBUOC)) - parseInt(edu.util.returnZero(aData.SODATICHLUY));
                    }
                },
                {
                    "mDataProp": "SOTINCHINO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblTongHopDiem", [5,3,4, 6, 7])
    },
    genTable_TongHopDiemHP: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiemHP",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MAKHOI"
                },
                {
                    "mDataProp": "TENKHOI",
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KETQUA == 1 ? "Hoàn thành": "";
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return aData.HOCPHANTHUA == 1 ? "Thừa " + edu.util.returnEmpty(aData.HOCPHANTHUA_LOAIXULY) : "";
                    }
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.actionRowSpan("tblTongHopDiemHP", [1, [2]])
    },
    
    getList_HocPhanChuaQua: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSHocPhanChuHoanThanh',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_HocPhanChuaQua(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HocPhanChuaQua: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanChuaQua",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "THOIGIAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQuaChungChi: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSKetQuaChungChi',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        console.log('[ChungChi] === REQUEST ===');
        console.log('[ChungChi] Action:', obj_list.action);
        console.log('[ChungChi] Params:', JSON.parse(JSON.stringify(obj_list)));

        edu.system.makeRequest({
            success: function (data) {
                console.log('[ChungChi] === RESPONSE ===');
                console.log('[ChungChi] Full data:', data);
                console.log('[ChungChi] Success:', data.Success);
                console.log('[ChungChi] Message:', data.Message);
                console.log('[ChungChi] Data:', data.Data);
                console.log('[ChungChi] Data length:', data.Data ? data.Data.length : 'null/undefined');
                if (data.Data && data.Data.length > 0) {
                    console.log('[ChungChi] First row keys:', Object.keys(data.Data[0]));
                    console.log('[ChungChi] First row:', data.Data[0]);
                }
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_KetQuaChungChi(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                console.log('[ChungChi] === ERROR ===');
                console.log('[ChungChi] Error:', er);
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KetQuaChungChi: function (data) {
        var me = this;
        console.log('[ChungChi] === genTable ===');
        console.log('[ChungChi] Rows to render:', data ? data.length : 0, data);
        var jsonForm = {
            strTable_Id: "tblKetQuaChungChi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_KetQuaDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayKetQuaDangKyHocCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDangKy'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_KetQuaDangKy(dtResult.rsKetQuaDangKy);
                    me.genTable_LichSuDangKy(dtResult.rsLichSuDangKy);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KetQuaDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaDangKy",

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAMOLOPHP_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "THONGTINGIANGVIEN",
                    //mRender: function (nRow, aData) {
                    //    return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO)
                    //}
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //edu.system.insertSumAfterTable("tblKetQuaDangKy", [3])
        var arrHocPhan = [];
        var iTongTinChi = 0;
        data.forEach(e => { if (arrHocPhan.indexOf(e.DAOTAO_HOCPHAN_MA) == -1) { arrHocPhan.push(e.DAOTAO_HOCPHAN_MA); iTongTinChi += e.DAOTAO_HOCPHAN_HOCTRINH } })
        $("#tblKetQuaDangKy tfoot").html('<tr><td></td><td></td><td></td><td></td><td>' + iTongTinChi + '</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'); 
    },
    genTable_LichSuDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "THOIGIANTHUCHIEN"
                },
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_ThoiGianDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSThoiGianLichHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDangKy(json);
                    me.getList_KetQuaDangKy(strQLSV_NguoiHoc_Id)
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
    cbGenCombo_ThoiGianDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_ThoiGianDangKy"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_KetQuaHocKy: function (aData) {
        var me = this;
        me.strDaoTao_LopQuanLy_Id = aData.DAOTAO_LOPQUANLY_ID;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSThoiGianDKTheoLopQL',
            'type': 'GET',
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KetQuaHocKy(json)
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
    genTable_KetQuaHocKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocKy_KetQua",
            aaData: data,
            colPos: {
                center: [0, 1]
            },
            arrClassName: ["btnEdit"],
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length > 0) {
            $("#tblHocKy_KetQua tbody tr[id=" + data[0].ID + "]").trigger("click");
        }
    },


    getList_HocPhanDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSHocPhanDKTheoLop',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
            'strDaoTao_LopQuanLy_Id': me.strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtHocPhanDangKy"] = json;
                    me.genTable_HocPhanDangKy(json);
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
    genTable_HocPhanDangKy: function (data) {
        var me = this;
        var html = '';
        html += '<th class="text-center fw-normal border-left bg-white">Học đi</th>';
        html += '<th class="text-center fw-normal border-left bg-white">Học lại</th>';
        html += '<th class="text-center fw-normal border-left bg-white">Học nâng điểm</th>';
        data.forEach(e => html += '<th class="text-center fw-normal border-left bg-white" style="width: 70px">' + edu.util.returnEmpty(e.TEN) + '</th>');
        $("#tblLop_KetQua thead tr:eq(1)").html(html);
        document.getElementById("lblHocPhanDangKy_KetQua").colSpan = data.length;
        me.getList_NguoiHocTheoLop();
        //var jsonForm = {
        //    strTable_Id: "tblHocKy_KetQua",
        //    aaData: data,
        //    colPos: {
        //        center: [0, 1]
        //    },
        //    arrClassName: ["btnEdit"],
        //    aoColumns: [
        //        {
        //            "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);
        //if (data.length > 0) {
        //    $("#tblHocKy_KetQua tbody tr[id=" + data[0].ID + "]").trigger("click");
        //}
    },

    getList_NguoiHocTheoLop: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSNguoiHocTheoLopQL',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
            'strDaoTao_LopQuanLy_Id': me.strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtNguoiHocTheoLop"] = json;
                    me.genTable_NguoiHocTheoLop(json)
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
    genTable_NguoiHocTheoLop: function (data) {
        var me = this;
        //var jsonForm = {
        //    strTable_Id: "tblLop_KetQua",

        //    aaData: data,
        //    colPos: {
        //        center: [0, 3, 4, 5,6,7,8],
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "QLSV_NGUOIHOC_MASO"
        //        },
        //        {
        //            "mDataP": "TEN",
        //            "mRender": function (nRow, aData) {
        //                return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + ' - ' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
        //            }
        //        },
        //        {
        //            "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
        //        },
        //        {
        //            "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
        //        },
        //        {
        //            "mDataProp": "TONGNOPHI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCDI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCLAI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCNANGDIEM"
        //        }
        //    ]
        //};
        //me.dtHocPhanDangKy.forEach((e, index) => {
        //    jsonForm.aoColumns.push(
        //        {
        //            "mRender": function (nRow, aData) {
        //                var iThuTu = edu.system.icolumn++;
        //                return '<span style="width: 70px" id="lblketqua_' + aData.ID + '_' + main_doc.InBangDiem.dtHocPhanDangKy[iThuTu].ID + '"></span>';
        //            }
        //        });
        //    jsonForm.colPos.center.push(9 + index);
        //});
        //edu.system.loadToTable_data(jsonForm);
        var html = '';
        data.forEach((e, index) => {
            html += '<tr>';
            html += '<td class="text-center" scope="row">' + (index + 1) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_MASO) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_HODEM) + ' - ' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_TEN) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_NGAYSINH) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_TRANGTHAINGUOIHOC_TEN) + '</td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.TONGNOPHI) + '</td>';
            html += '<td class="text-center border-left" id="chuyencan' + e.ID + '"></td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCDI) + '</td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCLAI) + '</td>';
            html += '<td   class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCNANGDIEM) + '</td>';
            me.dtHocPhanDangKy.forEach((ele, index) => {
                html += '<td  class="text-center border-left sv' + e.ID + '" style="width: 70px"><span style="width: 70px;" class="btnDSBuoiHoc" id="lblketqua_' + e.ID + '_' + ele.ID + '"></span></td>';
            });
            html += '</tr>';
        });
        $("#tblLop_KetQua tbody").html(html);
        edu.system.genHTML_Progress("zoneprocessDiem", (data.length * me.dtHocPhanDangKy.length));
        data.forEach(e => {
            me.dtHocPhanDangKy.forEach(ele => me.getList_KetQua(e, ele.ID, ele.TEN));
        });
    },
    getList_KetQua: function (objHang, strTenCot_Id, strTenCot) {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/KiemTraNguoiHocDangKyHocPhan',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': objHang.ID,
            'strDaoTao_HocPhan_Id': strTenCot_Id,
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    if (dtResult.length > 0) {
                        for (var i = 0; i < dtResult.length; i++) {
                            var strKetQua = ""
                            if (dtResult[i].KETQUA == 1) {
                                strKetQua = 'X';
                                var point = $("#lblketqua_" + objHang.ID + '_' + strTenCot_Id);
                                if ((dtResult[i].SOTIETVANGMAT + dtResult[i].SOBUOIVANGMAT) > 0) {
                                    strKetQua += '(' + edu.util.returnEmpty(dtResult[i].SOTIETVANGMAT) + '/' + edu.util.returnEmpty(dtResult[i].SOBUOIVANGMAT) + ')';
                                    if (dtResult[i].TYLEVANG) strKetQua += ' + ' + edu.util.returnEmpty(dtResult[i].TYLEVANG);
                                    point.attr("tietvang", edu.util.returnEmpty(dtResult[i].SOTIETVANGMAT))
                                    point.attr("buoivang", edu.util.returnEmpty(dtResult[i].SOBUOIVANGMAT))
                                    point.css('color', 'orange')
                                }
                                point.html(strKetQua);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessDiem", function () {
                    main_doc.InBangDiem.dtNguoiHocTheoLop.forEach(e => {
                        var iTietVang = 0;
                        var iBuoiVang = 0;
                        main_doc.InBangDiem.dtHocPhanDangKy.forEach(ele => {
                            var pointSV = $('#lblketqua_' + e.ID + '_' + ele.ID);
                            if ($(pointSV).attr("tietvang")) {
                                iTietVang += parseInt($(pointSV).attr("tietvang"));
                                iBuoiVang += parseInt($(pointSV).attr("buoivang"));
                            }
                        })
                        //var pointNH = $(".sv" + e.ID);
                        //console.log(pointNH)
                        //var iTietVang = 0;
                        //var iBuoiVang = 0;
                        //pointNH.each(function () {
                        //    //var pointSV = this;
                        //    console.log(this.id)
                        //    console.log($(this).attr("tietvang"))
                        //    if ($(this).attr("tietvang")) {
                        //        iTietVang += parseInt($(this).attr("tietvang"));
                        //        iBuoiVang += parseInt($(this).attr("buoivang"));
                        //    }
                        //});
                        if (iTietVang + iBuoiVang) {
                            $("#chuyencan" + e.ID).html("" + iTietVang + '/' + iBuoiVang);
                        }
                    });
                    
                });
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_DiemKetThuc: function (aData) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAokNRUpNCIJLiIRKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemKetThucHocPhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtDiemKetThuc"] = json;
                    me.genTable_DiemKetThuc(json)
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemKetThuc: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemKetThuc",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + ' - ' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropKhongTinh_' + aData.ID + '" name="' + edu.util.returnEmpty(aData.KHONGTINHDIEM) + '" class="select-opt" style="width: 100%"><option value="0">Tính điểm</option><option value="1">Không tính điểm</option></select>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => $("#dropKhongTinh_" + e.ID).val(e.KHONGTINHDIEM).trigger("change"))
    },

    save_DiemKetThuc: function (strId) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'D_TongHop_XuLy_MH/GTQNOAopLi8mFSgvKQUoJCwP',
            'func': 'pkg_diem_tonghop_xuly.XuLyKhongTinhDiem',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'dKhongTinhDiem': edu.util.getValById('dropKhongTinh_' + strId),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert("Không thành công: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DiemKetThuc();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
}