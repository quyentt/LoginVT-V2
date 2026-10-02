/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
/*
1. getList_KhoanThu -> genTable_KhoanThu
2. alertLuu_KhoanThu -> save_TaoSo_HoaDon -> alertLuuThanhCong_KhoanThu -> getList_HoaDon_ChuaIn
3. save_TaoLo_HoaDon -> getList_LoHoaDon -> genTable_LoHoaDon
4. getTemplatePhieu -> getList_HoaDonTheoLo -> fixThreading -> genMauHoaDon_DT -> getData_HoaDon_DT -> genData_HoaDon_DT -> printf_LoHoaDon -> save_TinhTrangHoaDon
*/
function RutTien() {};
RutTien.prototype = {
    dt_DoiTuong: null,
    arr_DoiTuong_ID: [],
    dt_DoiTuongThu: null,
    iSLPHieu: 0,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        edu.extend.addNotify();
        //me.getList_KhoanThu_ChuaXuat();

        me.getList_DMLKT();
        me.getList_TrangThaiSV();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        //me.getList_NguoiThu();
        me.getList_ThoiGianDaoTao();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        //me.genHTML_NoiDung_BienLai();


        $("#btnSearch_RT").click(function (e) {
            
            me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_RT'));
        });
        $("#txtSearch_RT").keypress(function (e) {
            if (e.which === 13) {
                
                me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_RT'));
            }
        });

        $('#dropSearch_HeDaoTao_RT').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao_RT').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_ChuongTrinh_RT').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
        });
        $('#dropSearch_HocKy_RT').on('select2:select', function (e) {
            
            var strValue = this.value;
            if (!edu.util.checkValue(strValue)) {
                $("#dropSearch_KyThucHien_RT").parent().hide();
            } else {
                $("#dropSearch_KyThucHien_RT").parent().show();
            }
        });

        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            me.resetCombobox(this);
        });

        $("#btnTaoBienLai").click(function (e) {
            e.stopImmediatePropagation();
            me.getDetail_KhoanThu_DoiTuong();
            $("#btnIn_TheoLo").hide();
        });
        $(".btnClose").click(function (e) {
            e.stopImmediatePropagation();
            $("#MainContent").slideDown('slow');
            $('#zoneBienLai').slideUp('slow');
        });
        $("#zoneBienLai").delegate("#btnThu_TheoLo", "click", function (e) {
            e.stopImmediatePropagation();
            me.iSLPHieu = me.arr_DoiTuong_ID.length;
            $("#DSPhieuRut").html("");
            $("#MauInPhieuThu").html("");
            for (var i = 0; i < me.arr_DoiTuong_ID.length; i++) {
                main_doc.RutTien.save_HDBL(me.arr_DoiTuong_ID[i]);
            }
        });
        $("#btnIn_TheoLo").click(function (e) {
            e.stopImmediatePropagation();
            edu.extend.remove_PhoiIn("DSPhieuRut");
            edu.util.printHTML('DSPhieuRut');
        });

        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbLKT_RT").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate("#chkSelectAll_RutTien", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            console.log(checked_status);
            $("#tbldata_KTCX_RT input").each(function () {
                this.checked = checked_status;
            });
        });


        $("#zoneBienLai").delegate(".detail-hs", "click", function (e) {
            e.stopImmediatePropagation();
            var pointer = this;
            $("#tblNguoiHoc_RutTien .tr-bg").removeClass("tr-bg");
            setTimeout(function () {
                console.log
                $(pointer).addClass("tr-bg");
            }, 200);
            //Sau khi đã thực hiện in thì sẽ hiện lại phiếu
            if (edu.util.checkValue(this.id)) {
                var strPhieuThu_Id = this.id;
                edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAIRUT", "MauInPhieuThu");
                return;
            }
            me.genHTML_NoiDung_BienLai($(this).attr("name"));
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_RT", function (addKeyValue) {
            var strNguoiDangNhap_Id = edu.system.userId;
            var strMaTruong = "KCNTTTN";
            var strNguoiThucHien_Id = '';
            var strDAOTAO_HeDaoTao_Id = edu.util.getValById("dropSearch_HeDaoTao_RT");
            var strKhoaDaoTao_Id = edu.util.getValById("dropSearch_KhoaDaoTao_RT");
            var strDaoTao_ToChucCT_Id = edu.util.getValById("dropSearch_ChuongTrinh_RT");
            var strLopHoc_Id = edu.util.getValById("dropSearch_Lop_RT");
            var strDAOTAO_ThoiGianDaoTao = edu.util.getValById("dropSearch_HocKy_RT");
            var strKhoaQuanLy_Id = edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD");
            var strNamNhapHoc = edu.util.getValCombo("dropSearch_NamNhapHoc_IHD");
            var strPhamViApDung = (edu.util.getValById("dropSearch_HocKy_RT") == "") ? "" : edu.util.getValById("dropSearch_KyThucHien_RT");
            var strTuNgay = edu.util.getValById("txtSearch_TuNgay_RT");
            var strDenNgay = edu.util.getValById("txtSearch_DenNgay_RT");
            var strTuKhoa = edu.util.getValById("txtSearch_RT");
            var strTAICHINH_CacKhoanThu_Ids = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_RT');
            var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
            if (strTAICHINH_CacKhoanThu_Ids.length == 0) {
                edu.system.alert('Vui lòng chọn khoản thu!', 'w');
                return false;
            }
            if (strTrangThaiNguoiHoc_Id === '') {
                edu.system.alert('Vui lòng chọn trạng thái!', 'w');
                return false;
            }
            //
            addKeyValue("strMaTruong", strMaTruong);
            addKeyValue("strNguoiDangNhap_Id", strNguoiDangNhap_Id);
            addKeyValue("strNguoiThucHien_Id", strNguoiThucHien_Id);
            addKeyValue("strHeDaoTao_Id", strDAOTAO_HeDaoTao_Id);
            addKeyValue("strKhoaDaoTao_Id", strKhoaDaoTao_Id);
            addKeyValue("strChuongTrinh_Id", strDaoTao_ToChucCT_Id);
            addKeyValue("strLopQuanLy_Id", strLopHoc_Id);
            addKeyValue("strThoiGianDaoTao_Id", strDAOTAO_ThoiGianDaoTao);
            addKeyValue("strPhamViApDung", strPhamViApDung);
            addKeyValue("strTuNgay", strTuNgay);
            addKeyValue("strDenNgay", strDenNgay);
            addKeyValue("strTuKhoa", strTuKhoa);
            addKeyValue("strKhoaQuanLy_Id", strKhoaQuanLy_Id);
            addKeyValue("strNamNhapHoc", strNamNhapHoc);
            for (var i = 0; i < strTAICHINH_CacKhoanThu_Ids.length; i++) {
                addKeyValue("strTAICHINH_CacKhoanThu_Ids", strTAICHINH_CacKhoanThu_Ids[i]);
            }
            addKeyValue("strTrangThaiNguoiHoc_Id", strTrangThaiNguoiHoc_Id);
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();

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
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao_RT"),
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
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_RT"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_RT"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_RT"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinh_RT"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
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
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
                } else {
                    console.log(data.Message);
                }
            },
            error: function (er) {},
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
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
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
            renderPlace: ["dropSearch_HeDaoTao_RT"],
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
            renderPlace: ["dropSearch_KhoaDaoTao_RT"],
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
            renderPlace: ["dropSearch_ChuongTrinh_RT"],
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
            renderPlace: ["dropSearch_Lop_RT"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearch_HocKy_RT"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearch_NguoiThu_RT"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print;">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
        //me.getList_KhoanThu();
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
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_DMLKT(json);
                } else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoanThu_ChuaXuat: function (strTuKhoa) {
        var me = this;
        //var datatest = localStorage.getItem('dt_DoiTuongDuTien');
        //if (datatest !== undefined) {
        //    me.genTable_KhoanThu_ChuaXuat(JSON.parse(datatest));
        //    me.dt_DoiTuong = JSON.parse(datatest);
        //    //console.log(me.dt_DoiTuong);
        //    return;
        //}
        strTuKhoa = edu.util.getValById('txtSearch_RT');
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_RT').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu === '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var obj_list = {
            'action': 'TC_NguoiHoc_DuTien/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao_RT"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao_RT"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinh_RT"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_Lop_RT"),
            'strTuKhoa': edu.util.getValById("txtSearch_RT"),
            'strNguoiDung_Id': edu.util.getValById("dropSearch_NguoiThu_RT"),
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_ChuaXuat(json, data.Pager);
                    me.dt_DoiTuong = json;
                    //localStorage.setItem('dt_DoiTuongDuTien', JSON.stringify(json));
                } else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null)
    },
    getDetail_KhoanThu_DoiTuong: function () {
        var arrMaDT = [];
        var arrDTThu = [];
        var me = this;
        //Lấy danh sách sinh viên id và các khoản thu của sinh viên đó
        var x = $("#tbldata_KTCX_RT tbody input[id!='']");
        for (var i = 0; i < x.length; i++) {
            if (x[i].checked) {
                if (arrMaDT.indexOf(x[i].name) === -1) {
                    arrMaDT.push(x[i].name);
                }
                if (x[i].id != undefined) {
                    var dt = edu.util.objGetOneDataInData(x[i].id, me.dt_DoiTuong, "ID");
                    if (dt.length != 0) {
                        arrDTThu.push(dt);
                    }
                }
            }
        };
        if (arrMaDT.length == 0) {
            edu.extend.notifyBeginLoading("Không có sinh viên nào được chọn!");
            return;
        }
        //Lấy danh sách khoản thu trùng với người học
        //for (var i = 0; i < arrMaDT.length; i++) {
        //    for (var j = 0; j < me.dt_DoiTuong.length; j++) {
        //        if (arrMaDT[i] == me.dt_DoiTuong[j].QLSV_NGUOIHOC_ID) {
        //            arrDTThu.push(me.dt_DoiTuong[j]);
        //        }
        //    }
        //}
        //Gán dữ liệu đã hoàn thành
        me.arr_DoiTuong_ID = arrMaDT;
        me.dt_DoiTuongThu = arrDTThu;
        me.genList_DoiTuong_KhoanThu();
        //Thực hiện chuyển form sau khi tất cả mọi thứ 0k
        $("#MainContent").slideUp('slow');
        $('#zoneBienLai').slideDown('slow');
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Khoan Thu
    --ULR: Modules
    -------------------------------------------*/
    genList_DoiTuong_KhoanThu: function () {
        var me = this;
        var dTongTienLanRut = 0.0;
        $("#tblNguoiHoc_RutTien tbody").html('');
        for (var i = 0; i < me.arr_DoiTuong_ID.length; i++) {
            var strDT_ID = me.arr_DoiTuong_ID[i];
            var dTongTien = 0.0;
            var dt = null;
            for (var j = 0; j < me.dt_DoiTuongThu.length; j++) {
                if (strDT_ID == me.dt_DoiTuongThu[j].QLSV_NGUOIHOC_ID) {
                    dt = me.dt_DoiTuongThu[j];
                    console.log($("#txtSoTien" + dt.ID).val());
                    dTongTien += parseFloat($("#txtSoTien" + dt.ID).val()); //me.dt_DoiTuongThu[j].SOTIEN;
                }
            }
            if (dt === null) continue;
            dTongTienLanRut += dTongTien;
            var row = '';
            row += '<tr class="tr-pointer detail-hs" name="' + dt.QLSV_NGUOIHOC_ID + '">';
            row += '<td class="td-middle" >';
            row += '<span class="">' + dt.HOTENNGUOIHOC + '</span> <br />';
            row += '<span class="td-font masonguoihoc">' + dt.MASONGUOIHOC + '</span>';
            row += '</td >';
            row += '<td class="td-middle">';
            row += '<span class="">Tổng: ' + edu.util.formatCurrency(dTongTien) + '</span><br />';
            row += '<span class="td-font">Số: <span id="lbSBL' + dt.QLSV_NGUOIHOC_ID + '"></span></span>';
            row += '</td>';
            row += '</tr>';
            $("#tblNguoiHoc_RutTien tbody").append(row);
        }
    },
    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbLKT_RT_All" checked="checked"/>';
        row += '<span><b>Tất cả</b></span>';
        row += '</div>';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-4 checkbox-inline user-check-print">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + dataKhoanThu[i].ID + '" class="ckbLKT_RT" title="' + dataKhoanThu[i].TEN + '"' + strcheck + ' checked="checked"/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanPhi").replaceWith(row);
        //me.getList_KhoanThu_ChuaXuat();
    },
    genTable_KhoanThu_ChuaXuat: function (data, iPager) {
        var me = this;
        var strTable_Id = "tbldata_KTCX_RT";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1],
                center: [0, 4, 8],
                right: [7]
            },
            bPaginate: {
                strFuntionName: "main_doc.RutTien.getList_KhoanThu_ChuaXuat()",
                iDataRow: iPager
            },
            "aoColumns": [{
                    "mDataProp": "MASONGUOIHOC"
                },
                {
                    "mDataProp": "HOTENNGUOIHOC"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }, {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input type="text" class="form-control" id="txtSoTien' + aData.ID + '" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" />';
                    }
                }, {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="' + aData.ID + '" name="' + aData.QLSV_NGUOIHOC_ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //if (data !== undefined && data.length > 0) {
        //    edu.system.insertSumAfterTable(strTable_Id, [7]);
        //    $("#" + strTable_Id + " tfoot tr td:eq(7)").attr("style", "text-align: right;");
        //    var x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
        //    for (var i = 0; i < x.length; i++) {
        //        x[i].id = '';
        //    }
        //    edu.system.collageInTable({
        //        strTable_Id: strTable_Id,
        //        iBatDau: 1,
        //        iKetThuc: 1,
        //        arrStr: [2, 3, 4, 5, 6],
        //        arrFloat: [],
        //        iInputCheck: [8],
        //    });
        //} else {
        //    $("#" + strTable_Id + " tfoot").html('');
        //}
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    save_HDBL: function (strMaSinhVien) {
        var me = main_doc.RutTien;
        var strIds = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoTien = "";
        var x = me.dt_DoiTuongThu;
        for (var i = 0; i < x.length; i++) {
            if (strMaSinhVien == x[i].QLSV_NGUOIHOC_ID) {
                if (x[i].SOTIEN == 0) continue;
                strIds += x[i].TAICHINH_CACKHOANTHU_ID + ",";
                strThoiGianDaoTaoIds += x[i].DAOTAO_THOIGIANDAOTAO_ID + ",";
                strNoiDungs += x[i].TAICHINH_CACKHOANTHU_TEN + "#";
                strSoTien += $("#txtSoTien" + x[i].ID).val() + ",";
            }
        }
        strIds = strIds.substr(0, strIds.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        save_PhieuRut(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoTien);

        function getSoTien(strId, dRecovery) {
            var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save_PhieuRut(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDungRut_s, strSoTienRut_s) {
            var obj_save = {
                'action': 'TC_TaiChinh_Rut/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTienRut_s,
                'strTaiChinh_NoiDung_s': strNoiDungRut_s,
                'strQLSV_NguoiHoc_Id': strMaSinhVien,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThanhToanPTCEdit"),
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
                'strCANBOTHUCHIENRUT_Id': edu.system.userId,
                'strNGAYTHUCHIENRUT': "",
                'strCHUNGTURUT_Id': "",
                'strLOAITIENTE_Id': "",
                'dTYGIAQUYDOI': -1,
                'strNgayChungTuRut': edu.util.getValById('txtNgayChungTu'),
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var strPhieuThu_Id = data.Id;
                        var strMauSo = data.Message;
                        $("#tblNguoiHoc_RutTien tr[name='" + strMaSinhVien + "']").attr("id", strPhieuThu_Id);
                        $("#tblNguoiHoc_RutTien tr[name='" + strMaSinhVien + "']").addClass("callsuccess");
                        //$("#lbSBL" + strMaSinhVien).html(strMauSo);
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAIRUT", "DSPhieuRut", main_doc.RutTien.genHTML_RutThanhCong, true);
                    }
                    else {
                        edu.extend.notifyBeginLoading(data.Message);
                        edu.system.iSoLuong--;
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.iSoLuong--;
                    edu.system.endLoading();
                    edu.extend.notifyBeginLoading(JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        
    },

    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Khoan Thu
    --ULR: Modules
    -------------------------------------------*/
    genHTML_NoiDung_BienLai: function (strMaSoNguoiRut) {
        var me = this;
        var arrDoiTuong = [];
        //Lấy thông tin phiếu người rút
        for (var i = 0; i < me.dt_DoiTuong.length; i++) {
            if (strMaSoNguoiRut === me.dt_DoiTuong[i].QLSV_NGUOIHOC_ID) arrDoiTuong.push(me.dt_DoiTuong[i]);
        }
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInPhieuThu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_BIENLAIRUT_2018";
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html', function () {
            if (document.getElementById(zoneMauIn).innerHTML === "" && document.getElementById(zoneMauIn).innerHTML.length === 0) {
                edu.extend.notifyBeginLoading("Không thể load phiếu sửa!. Vui lòng gọi GM", "w");
            } else {
                loadPhieu();
            }
        });

        function loadPhieu() {
            //Hiển thị thông tin đối tượng thu
            var data = arrDoiTuong[0];
            //$(".txtDiaChiPTC_PT_Edit").html(data.aaaa);
            $(".txtMaNCSPTC_PT_Edit").html(data.MASONGUOIHOC);
            $(".txtHoTenPTC_PT_Edit").html(data.HOTENNGUOIHOC);
            $(".iNgayPTC_PT_Edit").html(edu.util.thisDay());
            $(".iThangPTC_PT_Edit").html(edu.util.thisMonth());
            $(".iNamPTC_PT_Edit").html(edu.util.thisYear());
            $(".txtNgaySinhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGAYSINH));
            $(".txtMaSoThue_PT_Edit").html(edu.util.returnEmpty(data.MASOTHUECANHAN));
            $(".txtDiaChiPTC_PT_Edit").html(edu.util.returnEmpty(data.NOIOHIENNAY));
            $(".txtLopPTC_PT_Edit").html(edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGANHHOC_N1_TEN));
            $(".txtKhoaPTC_PT_Edit").html(edu.util.returnEmpty(data.KHOAHOC_N1_TEN));

            for (i = 1; i < arrDoiTuong.length; i++) {
                if (arrDoiTuong[0].HETHONGCHUNGTU_MA !== arrDoiTuong[i].HETHONGCHUNGTU_MA) {
                    edu.extend.notifyBeginLoading('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại!', 'w');
                    return;
                }
            }
            var idem = 0;
            //Lấy dữ liệu theo các check box đã chọn
            for (i = 0; i < arrDoiTuong.length; i++) {
                var rows = '';
                rows += '<tr>'; //name: DAOTAO_THOIGIANDAOTAO_ID
                rows += '<td>' + (i + 1) + '</td>';
                rows += '<td>' + arrDoiTuong[i].TAICHINH_CACKHOANTHU_TEN + '</td>';
                rows += '<td>' + arrDoiTuong[i].TAICHINH_CACKHOANTHU_TEN + '</td>';
                rows += '<td>1</td>';
                //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
                rows += '<td>' + edu.util.formatCurrency(arrDoiTuong[i].SOTIEN) + '</td>';
                rows += '<td>' + edu.util.formatCurrency(arrDoiTuong[i].SOTIEN) + '</td>';
                rows += '</tr>';
                $('#tbldataPhieuThuPopup_PT_Edit tbody').append(rows);
            }
            //Hiển thị tổng tiền đã chọn trên cùng bên trái
            //me.tinhHeSoGiaTien('tbldataPhieuThuPopup_PT_Edit', 3, 4, 5);
            edu.system.move_ThroughInTable("tbldataPhieuThuPopup_PT_Edit");
            edu.system.insertSumAfterTable("tbldataPhieuThuPopup_PT_Edit", [3, 4, 5]);
            var x = $("#tbldataPhieuThuPopup_PT_Edit tfoot td:eq(5)").html(); //Lấy tổng tiền từ cuối bảng
            $(".txtTongTien_PT_Edit").html(x);
            x = x.replace(/,/g, '');
            var strSoTien = to_vietnamese(x) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            $(".txtSoTienPTC_PT_Edit").html(strSoTien);
        }
    },
    genHTML_RutThanhCong: function () {
        var me = main_doc.RutTien;
        edu.system.iSoLuong--;
        me.iSLPHieu--;
        console.log(me.iSLPHieu);
        if (me.iSLPHieu <= 0) {
            edu.system.confirm("Lô hóa đơn đã sẵn sàng để in. Bạn có chắc chắn muốn in không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                e.stopImmediatePropagation();
                edu.extend.remove_PhoiIn("DSPhieuRut");
                edu.util.printHTML('DSPhieuRut');
            });
            $("#btnIn_TheoLo").show();
            me.getList_KhoanThu_ChuaXuat();
        }
    },
}