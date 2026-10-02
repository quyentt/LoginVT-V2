/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LopHoc() { };
LopHoc.prototype = {
    dtLopHoc: [],
    strLopHoc_Id: '',
    dtSinhVien:[],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.pageSize_default = 10;

        me.getList_LopHoc();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_LoaiDanhSach();
        me.getList_ThoiGian();
        me.getList_ThoiGianDaoTao();
        me.getList_HocPhan();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DANHGIA", "dropSearch_KetQua");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);

        $("#btnSearch").click(function (e) {
            me.getList_LopHoc();
        });
        $("#btnSearchSinhVien").click(function (e) {
            me.getList_SinhVien();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_LopHoc();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_LopHoc").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        $("[id$=chkSelectAll_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_SinhVien" });
        });
        $("[id$=chkSelectAll_SinhVien_View]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });
        $("#btnXoaSinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("#tblLopHoc").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            edu.util.setOne_BgRow(strId, "tblLopHoc");
            me.strLopHoc_Id = strId;
            if (edu.util.checkValue(strId)) {
                me.getList_SinhVien();
                me.getList_SinhVienDaThem();
                var obj = me.dtLopHoc.find(e => e.ID === strId);
                $(".lblTenDanhSach").html(obj.TEN + " - " + edu.util.returnEmpty(obj.DAOTAO_HOCPHAN_TEN));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_Lop').on('select2:select', function (e) {
            
            var x = $(this).val();
            
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {
            
            
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            
            
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {
            
            
        });
        $('#dropLopHoc_Loai').on('select2:select', function (e) {
            me.getList_HinhThuc();
        });


        $('#dropSearch_HeDaoTao_TAODS').on('select2:select', function (e) {

            me.getList_KhoaDaoTao_TAODS();
            me.getList_ChuongTrinhDaoTao_TAODS();
            me.getList_LopQuanLy_TAODS();

        });
        $('#dropSearch_KhoaDaoTao_TAODS').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao_TAODS();
            me.getList_LopQuanLy_TAODS();

        });
        $('#dropSearch_ChuongTrinh_TAODS').on('select2:select', function (e) {
            me.getList_LopQuanLy_TAODS();
        });

        $("#DSTrangThaiSV").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnLopHoc", function (addKeyValue) {
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV');
            arrTrangThai.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e));
            var obj_list = {
                'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
                'strTrangThai_Id': edu.util.getValById('dropAAAA'),
                'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
                'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
                'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });


        $("#btnTaoNhapDiem").click(function () {
            //if (!edu.util.getValById('dropSearch_ThoiGian')) {
            //    edu.system.alert("Bạn cần chọn thời gian!");
            //    return;
            //}
            me.toggle_taodanhsach();
        });
        $("#btnSearchHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopQuanLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.getList_HocPhanCungChuongTrinh(arrChecked_Id.toString());
        });
        $("[id$=chkSelectAll_LopQuanLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopQuanLy" });
        });
        $("[id$=chkSelectAll_HocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });

        $("#btnSaveDanhSachHoc").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopQuanLy", "checkX");
            var arrChecked_Id2 = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0 || arrChecked_Id2.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (arrChecked_Id.length * arrChecked_Id2.length));
                arrChecked_Id.forEach(e => arrChecked_Id2.forEach(ele => me.save_DanhSachDiem(e, ele)));
            });
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strLopHoc_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_LopHoc();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_taodanhsach: function () {
        edu.util.toggle_overide("zone-bus", "zoneTaoDanhSachDiem");
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

    
    getList_KhoaDaoTao_TAODS: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_TAODS"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao_TAODS);
    },
    getList_ChuongTrinhDaoTao_TAODS: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_TAODS"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao_TAODS);
    },
    getList_LopQuanLy_TAODS: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_TAODS"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_TAODS"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_TAODS"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.genTable_LopQuanLy_TAODS);
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
            renderPlace: ["dropSearch_HeDaoTao", "dropSearch_HeDaoTao_TAODS"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.LopHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropSearch_ThoiGian_TAODS"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.LopHoc.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
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

    
    cbGenCombo_KhoaDaoTao_TAODS: function (data) {
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
            renderPlace: ["dropSearch_KhoaDaoTao_TAODS"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao_TAODS: function (data) {
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
            renderPlace: ["dropSearch_ChuongTrinh_TAODS"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_LopQuanLy_TAODS: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblLopQuanLy",
            bPaginate: {
                strFuntionName: "main_doc.LopHoc.getList_LopQuanLy_TAODS()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "SOLUONGTHUCTE"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_LopHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'D_Hoc/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strTrangThai_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtLopHoc = dtReRult;
                    me.genTable_LopHoc(dtReRult, data.Pager);
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
    genTable_LopHoc: function (data, iPager) {
        var me = this;
        $("#lblLopHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLopHoc",
            bPaginate: {
                strFuntionName: "main_doc.LopHoc.getList_LopHoc()",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            aaData: data,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },


    getList_HocPhanCungChuongTrinh: function (strDSLopQuanLy_Id) {
        var me = this;
        var obj_list = {
            'action': 'D_HocPhanCungChuongTrinh/LayDanhSach',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_TAODS'),
            'strDSLopQuanLy_Id': strDSLopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtLopHoc = dtReRult;
                    me.genTable_HocPhanCungChuongTrinh(dtReRult, data.Pager);
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
    genTable_HocPhanCungChuongTrinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            //bPaginate: {
            //    strFuntionName: "main_doc.LopHoc.getList_HocPhanCungChuongTrinh()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_SinhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'D_NguoiHoc/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': me.dtLopHoc.find(e => e.ID === me.strLopHoc_Id).DAOTAO_HOCPHAN_ID,
            'strDanhGia_Id': edu.util.getValById('dropSearch_KetQua'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.genTable_SinhVien(dtResult, iPager);
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
    save_SinhVien: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'D_NguoiHoc/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': obj.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': obj.NGANH_ID,
            'strDiem_DanhSachHoc_Id': me.strLopHoc_Id,
            'strQLSV_NguoiHoc_Id': strId,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienDaThem();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'D_NguoiHoc/Xoa',
            
            'strDiem_DanhSach_NguoiHoc_Id': strIds,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienDaThem();
                });
            },
            type: 'POST',
            action: obj_delete.action,            
            contentType: true,            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInput_SinhVien",
            bPaginate: {
                strFuntionName: "main_doc.LopHoc.getList_SinhVien()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 5, 6, 7, 8, 9, 10, 11],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDat": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TRANGTHAI"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "NGANH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMCHU"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_SinhVienDaThem: function () {
        var me = this;
        var obj_list = {
            'action': 'D_Hoc_NguoiHoc/LayDanhSach',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': me.strLopHoc_Id,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
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
                    me.genTable_SinhVienDaThem(dtResult, iPager);
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
    genTable_SinhVienDaThem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            colPos: {
                center: [0, 5,6,7,8,9,10,11],
            },
            aoColumns: [
                {
                    "mDataProp": "MASONGUOIHOC"
                },
                {
                    "mDat": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEMNGUOIHOC) + " " + edu.util.returnEmpty(aData.TENNGUOIHOC);
                    }
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMCHU"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
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
    getList_LoaiDanhSach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_LoaiDanhSach/LayLoaiDanhSach',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_LoaiDanhSach(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_LoaiDanhSach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDanhSach"],
            type: "",
            title: "Chọn loại danh sách"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        edu.util.viewValById("dropSearch_ThoiGian", "");

        //--Edit
        var obj_list = {
            'action': 'D_ThoiGian/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_ThoiGian(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        edu.util.viewValById("dropSearch_HocPhan", "");

        //--Edit
        var obj_list = {
            'action': 'D_HocPhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy1'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach1'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian1'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_HocPhan(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_HocPhan: function (data) {
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
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    save_DanhSachDiem: function (strDSLopQuanLy_Id, strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'D_Hoc/Tao_Diem_DanhSachHoc',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_TAODS'),
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDSLopQuanLy_Id': strDSLopQuanLy_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công!");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_SinhVienDaThem();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}