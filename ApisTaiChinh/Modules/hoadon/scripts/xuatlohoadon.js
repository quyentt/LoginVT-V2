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
function InHoaDonTuDong() { };
InHoaDonTuDong.prototype = {//1
    dtMau: '',
    strLoHoaDon_Id: '',
    dtMauIn: [],
    iSLHoaDon: 0,
    idemHoaDon: 0,
    iPhaiNop: 0,
    dtChungTu: '',
    strHDDT: '',
    dtThieu_ChuaXuat: [],   // kết quả rà soát bản ghi thiếu thông tin (tab 3)

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        edu.system.pageSize_default = 10;
        edu.extend.addNotify();
        
        //$("#MainContent").delegate("#zonetabkhoanthu", "click", function (e) {
        //    e.preventDefault();
        //    me.activeTabFun();
        //});
        me.getList_LoHoaDon();
        me.getList_DMLKT();
        me.getList_NguoiThu();
        me.getList_TrangThaiSV();

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_NutHDDT();

        $("#btnSearch").click(function (e) {
            
            me.activeTabFun();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                
                me.activeTabFun();
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
        $('#dropSearch_HocKy_IHD').on('select2:select', function (e) {
            
            var strValue = $('#dropSearch_HocKy_IHD').val();
            if (!(strValue.length > 1 || strValue[0] != "")) {
                $("#dropSearch_KyThucHien_IHD").parent().hide();
            } else {
                $("#dropSearch_KyThucHien_IHD").parent().show();
            }
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
        /*------------------------------------------
        --Discription: Action Hoa Don
        -------------------------------------------*/
        $("#btnSinhSo").click(function (e) {
            
            me.alertLuu_KhoanThu();
            me.getList_KhoanThu_ChuaXuat_PreView(edu.util.getValById("txtSearch_DT").trim());
        });
        $("#btnSinhSo_CongNo").click(function (e) {
            
            me.iPhaiNop = 1;
            me.alertLuu_KhoanThu();
            me.getList_KhoanThu_CongNo_HoaDon_PreView(edu.util.getValById("txtSearch_DT").trim());
            $("#lbTieuDeXacNhan").html("Xác nhận thông tin xuất hóa đơn phải nộp");
            $("#zoneChungTu").html("Đang tải danh sách chứng từ <b>hóa đơn phải nộp</b> trước khi sinh số tự động. Vui lòng đợi ... ");
        });
        $("#btnSinhSo_BienLai_CongNo").click(function (e) {
            
            me.iPhaiNop = 2;
            me.alertLuu_KhoanThu();
            me.getList_KhoanThu_CongNo_BienLai_PreView(edu.util.getValById("txtSearch_DT").trim());
            $("#lbTieuDeXacNhan").html("Xác nhận thông tin xuất biên lai phải nộp");
            $("#zoneChungTu").html("Đang tải danh sách chứng từ <b>biên lai phải nộp</b> trước khi sinh số tự động. Vui lòng đợi ... ");
        });
        $("#zonePreView, #zoneXuatThanhCong").delegate('.closeKhoanThu', 'click', function (e) {
            
            me.iPhaiNop = 0;
            me.showHide_Box("MainPage", "MainContent");
            $("#lbTieuDeXacNhan").html("Xác nhận thông tin xuất hóa đơn");
            $("#zoneChungTu").html("Đang tải danh sách chứng từ <b>hóa đơn</b> trước khi sinh số tự động. Vui lòng đợi ... ");
        });
        $("#MainContent").delegate('.closeKhoanThuThanhCong', 'click', function (e) {
            
            me.showHide_Box("elementKhoanThu", "mainKhoanThu");
        });
        $("#btnXacNhanSinhSo").click(function (e) {
            e.stopImmediatePropagation();
            switch (me.iPhaiNop) {
                case 0: me.save_TaoSo_HoaDon(edu.util.getValById("txtSearch_DT").trim()); break;
                case 1: me.save_TaoSo_HoaDon_PhaiNop(edu.util.getValById("txtSearch_DT").trim()); break;
                case 2: me.save_TaoSo_BienLai_PhaiNop(edu.util.getValById("txtSearch_DT").trim()); break;
            }
        });
        /*------------------------------------------
        --Discription: Action LoHoaDon
        -------------------------------------------*/
        $("#btnInTheoLo").click(function (e) {
            e.stopImmediatePropagation();
            edu.system.confirm('Sinh lô hóa đơn hơi lâu. Hãy đợi nhé ^_^');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.save_TaoLo_HoaDon();
            });
        });
        $("#MainContent").delegate('.view-lohoadon', 'click', function (e) {
            $("#btnThucHienIn").show();
            $("#DSHoaDon").html("");
            var strLoHoaDon_Id = this.id;
            var strMauIn = this.name;
            var strLoIn = this.title;
            me.dtMauIn = [];
            me.getList_HoaDonTheoLo(strLoHoaDon_Id, strMauIn);
            $("#txtLoDaChon").html("#" + strLoIn);
            var x = this.parentNode.parentNode.parentNode;
            x.classList.remove('open');
            me.strLoHoaDon_Id = strLoHoaDon_Id;
        });
        $("#MainContent").delegate('.print-lohoadon', 'click', function (e) {
            var strId = this.id;
            $("#DSHoaDon").html('');
            //Trường hợp nút in ngay trên lô sẽ tự động lấy mẫu và lo
            if (strId.length > 30) me.strLoHoaDon_Id = strId;
            $("#select" + me.strLoHoaDon_Id).addClass('label-success');
            run();

            function run() {
                if (me.dtMau.length == 0) {
                    setTimeout(function () {
                        console.log("waiting print-lohoadon");
                        run();
                    }, 1000);
                    return;
                }
                else {
                    $("#btnThucHienIn").hide();
                    me.iSLHoaDon = me.dtMau.length;
                    me.idemHoaDon = 0;
                    for (var i = 0; i < me.dtMau.length; i++) {
                        me.genMauHoaDon_DT(me.dtMau[i]);
                    }
                }
            }
        });
        $("#zoneXuatThanhCong").delegate('#btnInTheoLo_ChungTu', 'click', function (e) {
            $("#DSHoaDon").html('');
            $("#btnInTheoLo_ChungTu").hide();
            me.iSLHoaDon = me.dtChungTu.length;
            me.idemHoaDon = 0;
            for (var i = 0; i < me.dtChungTu.length; i++) {
                me.genMauChungTu_PreView(me.dtChungTu[i]);
            }
        });
        $(".closeLoHoaDonDaChon").click(function (e) {
            e.stopImmediatePropagation();
            $("#zoneHoaDon").slideDown('slow');
            $("#zoneLoDaChon").slideUp('slow');
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
            $(".ckbLKT_IHD").each(function () {
                this.checked = checked_status;
            });
        });
        
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_TCLHD", function (addKeyValue) {

            var strPhamViApDung = "";

            var strValue = $('#dropSearch_HocKy_IHD').val();
            if (strValue.length > 1 || strValue[0] != "") {
                strPhamViApDung = edu.util.getValById("dropSearch_KyThucHien_IHD");
            }
            //
            var strNguoiDangNhap_Id = edu.system.userId;
            var strMaTruong = "KCNTTTN";
            var strNguoiThucHien_Id = edu.util.getValCombo("dropSearch_NguoiThu_IHD");
            var strDAOTAO_HeDaoTao_Id = edu.util.getValCombo("dropSearch_HeDaoTao_IHD");
            var strKhoaDaoTao_Id = edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD");
            var strDaoTao_ToChucCT_Id = edu.util.getValCombo("dropSearch_ChuongTrinh_IHD");
            var strLopHoc_Id = edu.util.getValCombo("dropSearch_Lop_IHD");
            var strDAOTAO_ThoiGianDaoTao = edu.util.getValCombo("dropSearch_HocKy_IHD");
            var strKhoaQuanLy_Id = edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD");
            var strNamNhapHoc = edu.util.getValCombo("dropSearch_NamNhapHoc_IHD");
            var strTuNgay = edu.util.getValById("txtSearch_TuNgay_IHD");
            var strDenNgay = edu.util.getValById("txtSearch_DenNgay_IHD");
            var strTuSo = edu.util.getValById("txtSearch_TuSo_IHD");
            var strDenSo = edu.util.getValById("txtSearch_DenSo_IHD");
            var strTuKhoa = edu.util.getValById("txtSearch_DT").trim();
            var strTAICHINH_CacKhoanThu_Ids = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
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
            addKeyValue("strTuSo", strTuSo);
            addKeyValue("strDenSo", strDenSo);
            for (var i = 0; i < strTAICHINH_CacKhoanThu_Ids.length; i++) {
                addKeyValue("strTAICHINH_CacKhoanThu_Ids", strTAICHINH_CacKhoanThu_Ids[i]);
            }
            addKeyValue("strTrangThaiNguoiHoc_Id", strTrangThaiNguoiHoc_Id);
        });
        $("#zonePreView").delegate('.popoverKhoanThu', 'mouseenter', function (e) {
            e.preventDefault();
            var point = this;
            var strMaSV = $(point).attr("name");
            var strKhoanThu = localStorage.getItem(strMaSV);
            $(".popover").replaceWith('');
            if (!edu.util.checkValue(strKhoanThu)) return;
            $(point).popover({
                container: 'body',
                content: strKhoanThu,
                trigger: 'hover',
                html: true,
                placement: 'bottom',
            });
            $(this).popover('show');
        });
        $("#zonePreView").delegate('.popoverKhoanThu', 'click', function (e) {
            e.preventDefault();
            var strMaSV = $(this).attr("name");
            me.save_HoaDon_Nhap(strMaSV)
        });
        $("#btnCloseHoaDon").click(function () {
            $("#zoneThongTinPhieuThu").slideUp('slow');
            $("#MainContent").slideDown('slow');
        });
        $("#btnInHoaDon").click(function () {
            me.printPhieu();
        });
        $("#zonePreView").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id
            var xCheck = me.dtNutHDDT.find(e => e.ID === strId);
            if (xCheck && xCheck.THONGTIN4) edu.system.objApi["HDDT"] = xCheck.THONGTIN4;
            var strLinkAPI = edu.system.strhost + edu.system.objApi["HDDT"].replace(/api/g, ''); //$(this).attr("name");
            //edu.system.objApi["HDDT"].replace(/api/g, '') = strLinkAPI;
            var strPhuongThuc_Ma = $(this).attr("title");
            edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', 'w');
            $("#btnYes").click(function (e) {
                e.stopImmediatePropagation();
                $('#myModalAlert').modal('hide');
                me.save_LoHoaDon_HDDT(strLinkAPI, strPhuongThuc_Ma);
            });
        });


        /*------------------------------------------
        --Discription: Rà soát bản ghi thiếu thông tin (tab 3 - DS khoản đã nộp chưa xuất HĐ)
        -------------------------------------------*/
        $("#btnCheckThieu_IHD").click(function () {
            me.checkThieu_ChuaXuat();
        });
        $("#btnCheckThieu_Clear").click(function () {
            me.clearCheckThieu_ChuaXuat();
        });
        $("#btnCheckThieu_Export").click(function () {
            me.exportThieu_ChuaXuat();
        });

        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropSearch_HinhThucThu_IHD");
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
    activeTabFun: function () {
        var me = this;
        setTimeout(function () {
            var strhref = $("#zonetabkhoanthu li[class='active'] a").attr("href");
            switch (strhref) {
                case "#tab_khoanthu_congno_bienlai": me.getList_KhoanThu_CongNo_BienLai(edu.util.getValById('txtSearch_DT').trim()); break;
                case "#tab_khoanthu_congno": me.getList_KhoanThu_CongNo(edu.util.getValById('txtSearch_DT').trim()); break;
                case "#tab_khoanthu_chuaxuat": me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_DT').trim()); break;
                case "#tab_khoanthu_daxuat": me.getList_KhoanThu_DaXuat(edu.util.getValById('txtSearch_DT').trim()); break;
                case "#tab_hoadon_chuain": me.getList_HoaDon_ChuaIn(); break;
                case "#tab_hoadon_dain": me.getList_HoaDon_DaIn(); break;
            }
        }, 200);
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
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
                edu.system.alert(JSON.stringify(er));
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
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
                edu.system.alert(JSON.stringify(er));
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
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
                edu.system.alert(JSON.stringify(er));
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
    getList_NutHDDT: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'TAICHINH.NUTHDDT',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_HDDT(data.Data);
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
            renderPlace: ["dropSearch_NguoiThu_IHD"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
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
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
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
    genHTML_HDDT: function (data) {
        var me = this;
        var row = '';
        me["dtNutHDDT"] = data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA.indexOf("HDDTNHAP") == 0) continue;
            row += '<button id="' + data[i].ID + '"  title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '"  type="button" class="btn btn-default btnXuat_HDDT"><i  style="' + data[i].THONGTIN3 + '" class="' + data[i].THONGTIN1 + '"></i> ' + data[i].TEN + '</button>';
        }
        $("#btnHoaDonHDDT").before(row); 
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
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
    getList_KhoanThu_CongNo_BienLai: function (strTuKhoa) {
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_CongNo_BienLai(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(d.Message);
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
    getList_KhoanThu_CongNo_BienLai_PreView: function (strTuKhoa) {
        var me = this;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            me.showHide_Box("MainPage", "MainContent");
            return;
        }
        //Nhớ xóa
        //var aaa = localStorage.getItem("khoanthucongnopreview");
        //me.genTable_KhoanThu_CongNo_BienLai_PreView($.parseJSON(aaa));
        //return;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    //localStorage.setItem("khoanthucongnopreview", JSON.stringify(json));
                    me.genTable_KhoanThu_PreView(json);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_KhoanThu_CongNo: function (strTuKhoa) {
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_CongNo(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_KhoanThu_CongNo_HoaDon_PreView: function (strTuKhoa) {
        var me = this;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            me.showHide_Box("MainPage", "MainContent");
            return;
        }
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_PreView(json);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_KhoanThu_ChuaXuat: function (strTuKhoa) {
        // Về danh sách bình thường → tắt trạng thái "đang lọc thiếu" để không hiểu nhầm số liệu cũ
        $("#lblCheckThieu_Info").html('');
        $("#btnCheckThieu_Export, #btnCheckThieu_Clear").addClass('d-none');
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_ChuaXuat(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_KhoanThu_ChuaXuat_PreView: function (strTuKhoa, strPhuongThuc_Ma) {
        var me = this;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            me.showHide_Box("MainPage", "MainContent");
            return;
        }
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strNgayCapHoaDon': edu.util.getValById('txtNgayXuatHoaDon'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
            'strKieuXuatHoaDon': edu.util.getValCombo('dropPhươngThucXuatHoaDon_IHD'),
            'strPhuongThuc_Ma': strPhuongThuc_Ma,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    //localStorage.setItem("khoanthupreview", json.toString());
                    me.genTable_KhoanThu_PreView(json);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_KhoanThu_DaXuat: function (strTuKhoa) {
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanDaNopDaXuatHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_DaXuat(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                //edu.system.endLoading();
            },
            error: function (er) {
                //edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_SBL: function (strTuKhoa) {
        var me = this;
        //--Edit
        if (strTuKhoa === undefined) strTuKhoa= "";
        var obj_list = {
            'action': 'TC_SoBienLai/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,
            'strTuKhoa': strTuKhoa,
            'strtaichinh_hethongBL_id': '',
            'dTuKhoa_Number': -1,
            'iTinhTrang': -1,
            'strNguoiTao_Id': '',
            'strNguoiThucHien_Id': "",
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChungTu = data.Data;
                    me.genHTML_SBL(data.Data, data.Pager);
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_SHD: function (strTuKhoa) {
        var me = this;
        //--Edit
        if (strTuKhoa === undefined) strTuKhoa = "";
        var obj_list = {
            'action': 'TC_HoaDon/LayDSTaiChinh_SoHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,//Nhớ sửa
            'strTaichinh_Hoadon_Id': '',
            'dParamChuaIn': 0,
            'dChuaIn': -1,
            'dSoTien': -1,
            'strNguoiThucHien_Id': '',
            'strTuKhoa': strTuKhoa,
            'strTuNgay': '',
            'strDenNgay': '',
            'iTinhTrang': -1,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChungTu = data.Data;
                    me.genHTML_SHD(data.Data, data.Pager);
                }
                else {
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
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Khoan Thu
    --ULR: Modules
    -------------------------------------------*/
    alertLuu_KhoanThu: function () {
        var me = this;
        me.showHide_Box("MainPage", "zonePreView");
    },
    alertLuuThanhCong_KhoanThu: function (data, strNoiDung) {
        var me = this;
        if (edu.util.checkValue(strNoiDung)) strNoiDung = "chứng từ";
        var row = '';
        row += '<h3> Tổng số ' + strNoiDung + ': ' + data.TONGSOHOADON + '</h3>';
        row += '<h3> Tổng tiền ' + strNoiDung + ' cần xuất: ' + edu.util.formatCurrency(data.TONGTIEN) + '</h3>';
        row += '<h3> Tổng tiền ' + strNoiDung + ' thực xuất: ' + edu.util.formatCurrency(data.TONGTIENTHUCXUAT) + '</h3>';
        $("#zoneTongTienXuat").html(row);
        $("#lbAlertXuatThanhCong").html("Xuất " + strNoiDung + " hoàn tất");
        me.showHide_Box("MainPage", "zoneXuatThanhCong");
        $("#zoneChungTu_ChuanBiIn").html("Đang tải danh sách chứng từ trước khi in. Vui lòng đợi ...");
        $("#btnInTheoLo_ChungTu").show();
        switch (me.iPhaiNop) {
            case 0: me.getList_SHD(data.PHIENSINHSO); break;
            case 1: me.getList_SHD(data.PHIENSINHSO); break;
            case 2: me.getList_SBL(data.PHIENSINHSO); break;
        }
    },

    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbLKT_RT_All"/>';
        row += '<span><b>Tất cả</b></span>';
        row += '</div>';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-4 checkbox-inline user-check-print;">';
            row += '<input  style="float: left; margin-right: 5px" type="checkbox" id="' + dataKhoanThu[i].ID + '" class="ckbLKT_IHD" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanPhi").replaceWith(row);
    },
    genTable_KhoanThu_CongNo_BienLai: function (data, iPager) {
        var me = this;
        var strTable_Id = "tbldata_KhoanThu_CongNo_BienLai_IHD";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InHoaDonTuDong.getList_KhoanThu_CongNo_BienLai()",
                iDataRow: iPager,
            },
            colPos: {
                left: [1, 7],
                center: [0, 4, 5, 8],
                right: [6]
            },
            "aoColumns": [
                {
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
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }, {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [6]);
            $("#" + strTable_Id + " tfoot td:eq(6)").attr("style", "text-align: right")
        } else {
            $("#" + strTable_Id + " tfoot").html('');
        }
    },
    genTable_KhoanThu_CongNo: function (data, iPager) {
        var me = this;
        var strTable_Id = "tbldata_KhoanThu_CongNo_IHD";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InHoaDonTuDong.getList_KhoanThu_CongNo()",
                iDataRow: iPager,
            },
            colPos: {
                left: [1, 7],
                center: [0, 4, 5, 8],
                right: [6]
            },
            "aoColumns": [
                {
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
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }, {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [6]);
            $("#" + strTable_Id + " tfoot td:eq(6)").attr("style", "text-align: right")
        } else {
            $("#" + strTable_Id + " tfoot").html('');
        }
    },
    genTable_KhoanThu_ChuaXuat: function (data, iPager) {
        var me = this;
        var strTable_Id = "tbldata_KhoanThu_ChuaXuat_IHD";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.InHoaDonTuDong.getList_KhoanThu_ChuaXuat()",
            //    iDataRow: iPager,
            //},
            colPos: {
                left: [1, 8],
                center: [0, 8, 10 , 11],
                right: [4]
            },
            "aoColumns": [
                {
                    "mDataProp": "MASONGUOIHOC"
                },
                {
                    "mDataProp": "HOTENNGUOIHOC"
                }
                , {
                    "mDataProp": "CCCD"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "NOIDUNG"
                }
                , {
                    "mDataProp": "DIACHICOQUANCONGTAC"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [4]);
            $("#" + strTable_Id + " tfoot td:eq(4)").attr("style", "text-align: right")
        } else {
            $("#" + strTable_Id + " tfoot").html('');
        }
    },
    genTable_KhoanThu_DaXuat: function (data, iPager) {
        var me = this;
        var strTable_Id = "tbldata_KhoanThu_DaXuat_IHD"
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InHoaDonTuDong.getList_KhoanThu_DaXuat()",
                iDataRow: iPager,
            },
            colPos: {
                left: [1, 7],
                center: [0, 4, 5, 8],
                right: [6]
            },
            "aoColumns": [
                {
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
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "CHUNGTU_SO"
                }, {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [6]);
            $("#" + strTable_Id + " tfoot td:eq(6)").attr("style", "text-align: right")
        } else {
            $("#" + strTable_Id + " tfoot").html('');
        }
    },
    genTable_KhoanThu_PreView: function (data) {
        var me = this; localStorage = null
        if (!edu.util.checkValue(data)) {
            edu.system.alert("Không có dữ liệu. Vui lòng thử lại!", "w");
            me.showHide_Box("MainPage", "zonePreView");
            return;
        }
        console.log(data);
        me["dtKhoanThuHoaDon"] = data;
        console.log(me.dtKhoanThuHoaDon);
        var html = '';
        $("#zoneChungTu").html("");
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = '';
        var arrData = [data[0]];
        var strSinhVien_Id = arrData[0].QLSV_NGUOIHOC_ID;
        for (var i = 1; i < data.length; i++) {
            if (strSinhVien_Id == data[i].QLSV_NGUOIHOC_ID) {
                arrData.push(data[i]);
            } else {
                creatElementChungTu(arrData);
                if (i < data.length) {
                    arrData = [data[i]];
                    strSinhVien_Id = data[i].QLSV_NGUOIHOC_ID
                }
            }
        }
        if (arrData.length > 0) creatElementChungTu(arrData);

        function creatElementChungTu(arrKhoanThuSV) {
            var dTongTien = 0;
            var arrKhoanThu = [];

            var row = "";
            row += '<div class="pcard" style="width: 600px; float: left; padding-left: 0px; margin-top: -7px; font-size: 11px"></td>';
            row += '<table class="table table-hover tablecenter">';
            row += '<thead>';
            row += '<tr >';
            row += '<th class="td-fixed">Stt</th>';
            row += '<th class="td-center" style="width: 100px"><span class="lang" key="">Học kỳ</span></th>';
            row += '<th class="td-center" style="width: 150px"><span class="lang" key="">Khoản thu</span></th>';
            row += '<th class="td-left" style="width: 150px"><span class="lang" key="">Nội dung</span></th>';
            row += '<th class="td-right" style="width: 150px"><span class="lang" key="">Số tiền</span></th>';
            row += '<th class="td-left" style="width: 100px"><span class="lang" key="">Người tạo</span></th>';
            row += '<th class="td-center" style="width: 80px"><span class="lang" key="">Ngày tạo</span></th>';
            row += '</tr >';
            row += '</thead>';
            row += '<tbody>';
            for (var i = 0; i < arrKhoanThuSV.length; i++) {
                dTongTien += arrKhoanThuSV[i].SOTIEN;
                if (arrKhoanThu.indexOf(arrKhoanThuSV[i].TAICHINH_CACKHOANTHU_MA) == -1) arrKhoanThu.push(arrKhoanThuSV[i].TAICHINH_CACKHOANTHU_MA);

                row += '<tr>';
                row += '<td>' + (i + 1) + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(arrKhoanThuSV[i].DAOTAO_THOIGIANDAOTAO) + '</td>';
                row += '<td class="td-left">' + edu.util.returnEmpty(arrKhoanThuSV[i].TAICHINH_CACKHOANTHU_TEN) + '</td>';
                row += '<td class="td-left">' + edu.util.returnEmpty(arrKhoanThuSV[i].NOIDUNG) + '</td>';
                row += '<td class="td-right">' + edu.util.formatCurrency(arrKhoanThuSV[i].SOTIEN) + '</td>';
                row += '<td class="td-left">' + edu.util.returnEmpty(arrKhoanThuSV[i].NGUOITAO_TAIKHOAN) + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(arrKhoanThuSV[i].NGAYTAO_DD_MM_YYYY) + '</td>';
                row += '</tr>';
            }
            row += '</tbody>';
            row += '</table>';
            row += '</div>';
            //Sửa lại khoản thu nếu số tiền quá dài
            var arrHienThiKhoanThu = [];
            if (arrKhoanThu.length > 3) {
                arrHienThiKhoanThu.push(arrKhoanThu[0]);
                arrHienThiKhoanThu.push(arrKhoanThu[1]);
                arrHienThiKhoanThu.push(arrKhoanThu[2]);
                arrHienThiKhoanThu.push(" ... ");
            }
            else {
                arrHienThiKhoanThu = arrKhoanThu;
            }
            //

            html = "";
            html += '<div class="col-sm-3 popoverKhoanThu" name="' + arrKhoanThuSV[0].MASONGUOIHOC + '" title="' + arrKhoanThu.toString() + '" strid="' + arrKhoanThuSV[0].ID + '" >';
            html += '<div class="box-mini">';
            html += '<p>Sinh viên: <span class="' + iLoaiPhieu + ' pull-right">' + arrKhoanThuSV[0].HOTENNGUOIHOC + '</span></p>';
            html += '<p>Mã SV: <span class="' + iLoaiPhieu + ' pull-right">' + arrKhoanThuSV[0].MASONGUOIHOC + '</span></p>';
            html += '<p>Khoản thu: <span class="' + iLoaiPhieu + ' pull-right">' + arrHienThiKhoanThu.toString() + '</span></p>';
            html += '<p>Tổng tiền: <span class="pull-right">' + edu.util.formatCurrency(dTongTien) + '</span></p>';
            html += '</div>';
            html += '</div>';
            $("#zoneChungTu").append(html);
            try {
                localStorage.removeItem(arrKhoanThuSV[0].MASONGUOIHOC);
                localStorage.setItem(arrKhoanThuSV[0].MASONGUOIHOC, row);
            }
            catch (Ex) {

            }
        }
    },
    genHTML_SHD: function (data, iPager) {
        var me = this;
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = '';
        var html = "";

        for (var i = 0; i < data.length; i++) {
            html += '<div class="col-sm-2" id="' + data[i].ID + '">';
            html += '<div class="box-mini">';
            html += '<p>Số: <span class="pull-right underline">#' + edu.util.returnEmpty(data[i].SOHOADON) + '</span></p>';
            html += '<p>Tổng tiền: <span class="pull-right">$' + edu.util.formatCurrency(data[i].TONGTIEN) + '</span></p>';
            html += '<p>Người thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITAO_TAIKHOAN) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zoneChungTu_ChuanBiIn").html(html);
    },
    genHTML_SBL: function (data, iPager) {
        var me = this;
        var html = '';
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = '';

        for (var i = 0; i < data.length; i++) {
            html += '<div class="col-sm-2" id="' + data[i].ID + '">';
            html += '<div class="box-mini">';
            html += '<p>Số: <span class="pull-right underline">#' + edu.util.returnEmpty(data[i].SOBIENLAI) + '</span></p>';
            html += '<p>Tổng tiền: <span class="pull-right">$' + edu.util.formatCurrency(data[i].TONGTIEN) + '</span></p>';
            html += '<p>Người thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITAO_TAIKHOAN) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zoneChungTu_ChuanBiIn").html(html);
    },
    /*------------------------------------------
    --Discription: [2] ACCESS DB ==>HoaDon
    --ULR: Modules
    -------------------------------------------*/
    save_TaoSo_BienLai_PhaiNop: function (strTuKhoa) {
        var me = this;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể sinh số hóa đơn!', 'w');
            return;
        }
        var obj_save = {
            'action': 'TC_HoaDon/SinhPhieuThuTuDongTheoLo_PN',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiDangNhap_Id': edu.system.userId,
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strNgayCapHoaDon': edu.util.getValById('txtNgayXuatHoaDon'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data[0];
                    me.alertLuuThanhCong_KhoanThu(data, "biên lai phải nộp");
                    edu.extend.notifyBeginLoading('Sinh số biên lai phải nộp tự động thành công!');
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_TaoSo_HoaDon_PhaiNop: function (strTuKhoa) {
        var me = this;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể sinh số hóa đơn!', 'w');
            return;
        }
        var obj_save = {
            'action': 'TC_HoaDon/SinhHoaDonTuDongTheoLo_PN',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiDangNhap_Id': edu.system.userId,
            'strDAOTAO_THOIGIANDAOTAO_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strNgayCapHoaDon': edu.util.getValById('txtNgayXuatHoaDon'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data[0];
                    me.alertLuuThanhCong_KhoanThu(data, "hóa đơn phải nộp");
                    edu.extend.notifyBeginLoading('Sinh số hóa đơn tự động thành công!');
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_TaoSo_HoaDon: function (strTuKhoa) {
        var me = this;
        $(window).scrollTop(10);
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể sinh số hóa đơn!', 'w');
            return;
        }
        var obj_save = {
            'action': 'TC_HoaDon/SinhHoaDonTuDongTheoLo',
            'versionAPI': 'v1.0',
            'strId': '',
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strNgayCapHoaDon': edu.util.getValById('txtNgayXuatHoaDon'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strKieuXuatHoaDon': edu.util.getValCombo('dropPhươngThucXuatHoaDon_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
            'strNguoiDangNhap_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data[0];
                    me.alertLuuThanhCong_KhoanThu(data, "hóa đơn");
                    edu.extend.notifyBeginLoading('Sinh số hóa đơn tự động thành công!');
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_LoHoaDon_HDDT: function (strLinkAPI, strPhuongThuc_Ma) {
        var me = this;
        $(window).scrollTop(10);
        var strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu. Để có thể sinh số hóa đơn!', 'w');
            return;
        }
        var obj_save = {
            'strId': '',
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strNgayCapHoaDon': edu.util.getValById('txtNgayXuatHoaDon'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strKieuXuatHoaDon': edu.util.getValCombo('dropPhươngThucXuatHoaDon_IHD'),
            'strPhuongThuc_Ma': strPhuongThuc_Ma,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
            'strNguoiDangNhap_Id': edu.system.userId,
        };
        //default
        obj_save.action = 'HDDT_HoaDon/SinhHoaDonTuDongTheoLo';
        edu.system.makeRequest({
            success: function (d, s, x) {
                if (d.Success) {
                    if (d.Message != null && d.Message != "") {
                        edu.system.alert(d.Message);
                    } else {
                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công' + d.Message);
                        edu.system.alert('Thực hiện thành công: ' + d.Message);
                    }
                }
                else {
                    edu.extend.notifyBeginLoading('Có lỗi xảy ra!');
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading(JSON.stringify(er));
                edu.system.endLoading();
                edu.system.alert(JSON.stringify(er));
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null, true);
    },
    save_HoaDon_Nhap: function (strId) {
        var me = this;
        var dtKhoanThu = me.dtKhoanThuHoaDon.filter(e => e.MASONGUOIHOC == strId);

        var obj_save = {
            'action': 'TC_DaNop/ThemMoi',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': dtKhoanThu[0].QLSV_NGUOIHOC_ID,
            'strTaiChinh_CacKhoanThu_Ids': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strHinhThucThu_MA': dtKhoanThu[0].HINHTHUCTHU_MA,
            'strHinhThucThu_TEN': dtKhoanThu[0].HINHTHUCTHU_TEN,
            'strLoaiTienTe': dtKhoanThu[0].LOAITIENTE_MA,
            'strDonViTinhTen_s': dtKhoanThu[0].DONVITINH_TEN,
            'strSoLuong_s': dtKhoanThu[0].SOLUONG,
            'strDonGia_s': dtKhoanThu[0].DONGIA,
            'strTaiChinh_SoTien_TruocThue_s': dtKhoanThu[0].SOTIENTRUOCVAT,
            'strVat': dtKhoanThu[0].VAT,
            'strChietKhaus': dtKhoanThu[0].CHIETKHAU,
            'strPhanTramChietKhaus': dtKhoanThu[0].TYLECHIETKHAU,
            'strTaiChinh_SoTien_s': dtKhoanThu[0].HINHTHUCTHU_TEN,
            'strTaiChinh_NoiDung_s': dtKhoanThu[0].HINHTHUCTHU_TEN,
            'strChietKhaus': dtKhoanThu[0].HINHTHUCTHU_TEN,
            'strDaoTao_ToChucCT_Id': dtKhoanThu[0].DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strLoaiDoiTuong': '',
            'strPhuongThuc_MA': "HDDTNHAP",
            'strNgayXuatChungTu': edu.util.getValById('txtNgayXuatHoaDon'),

        };
        var strHinhThucThu = "";
        let strSoTien = "";
        let strSoTien_TruocThue = "";
        let strNoiDung = "";
        let strDonViTinh = "";
        let strSoLuong_s = "";
        let strDonGia_s = "";
        let strCacKhoanThu_Ids = "";
        let strChietKhaus = "";
        let strPhanTramChietKhaus = "";
        dtKhoanThu.forEach(rowKT => {
            var strDonVi = rowKT["DONVITINH_TEN"];
            if (!strDonVi) strDonVi = "";
            strCacKhoanThu_Ids += "," + rowKT["ID"];
            strSoTien += "," + rowKT["SOTIEN"];
            strSoTien_TruocThue += "," + rowKT["SOTIENTRUOCVAT"];
            strNoiDung += "#" + rowKT["NOIDUNG"];
            strDonViTinh += "," + strDonVi;
            strSoLuong_s += "," + rowKT["SOLUONG"];
            strDonGia_s += "," + rowKT["DONGIA"];
            strChietKhaus += "," + rowKT["CHIETKHAU"];
            strPhanTramChietKhaus += "," + rowKT["TYLECHIETKHAU"];
            if (strHinhThucThu.indexOf(rowKT.HINHTHUCTHU_TEN) == -1) {
                if (strHinhThucThu == "") strHinhThucThu = rowKT.HINHTHUCTHU_TEN;
                else strHinhThucThu += "/" + rowKT.HINHTHUCTHU_TEN;
            }
        })
        if (strSoTien != "") {
            strSoTien = strSoTien.substring(1);
        }
        if (strSoTien_TruocThue != "") {
            strSoTien_TruocThue = strSoTien_TruocThue.substring(1);
        }
        if (strNoiDung != "") {
            strNoiDung = strNoiDung.substring(1);
        }
        if (strDonViTinh != "") {
            strDonViTinh = strDonViTinh.substring(1);
        }
        if (strSoLuong_s != "") {
            strSoLuong_s = strSoLuong_s.substring(1);
        }
        if (strDonGia_s != "") {
            strDonGia_s = strDonGia_s.substring(1);
        }
        if (strCacKhoanThu_Ids != "") {
            strCacKhoanThu_Ids = strCacKhoanThu_Ids.substring(1);
        }
        if (strChietKhaus != "") {
            strChietKhaus = strChietKhaus.substring(1);
        }
        if (strPhanTramChietKhaus != "") {
            strPhanTramChietKhaus = strPhanTramChietKhaus.substring(1);
        }

        obj_save.strTaiChinh_SoTien_s = strSoTien;
        obj_save.strTaiChinh_SoTien_TruocThue_s = strSoTien_TruocThue;
        obj_save.strTaiChinh_NoiDung_s = strNoiDung;
        obj_save.strDonViTinhTen_s = strDonViTinh;
        obj_save.strSoLuong_s = strSoLuong_s;
        obj_save.strDonGia_s = strDonGia_s;
        obj_save.strTaiChinh_CacKhoanThu_Ids = strCacKhoanThu_Ids;
        obj_save.strChietKhaus = strChietKhaus;
        obj_save.strPhanTramChietKhaus = strPhanTramChietKhaus;
        obj_save.strHinhThucThu_TEN = strHinhThucThu;
        if (dtKhoanThu[0]["LAHOCVIEN"].toString() == "0") obj.strLoaiDoiTuong = "DOITUONGKHAC";
        saveHDDT_Nhap(obj_save)
        function saveHDDT_Nhap(obj_save) {
            obj_save.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        //saveNhap(obj_save, d.Data);
                        var strLink = d.Data;
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.objApi["HDDT"];
                            strLink = strLink.substring(0, strLink.length - 3) + d.Data;
                            if (strLink.indexOf('http') === -1) {
                                strLink = edu.system.strhost + strLink;
                            }
                        }
                        var win = window.open(strLink, '_blank');
                        if (win != undefined)
                            win.focus();
                        else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
                    }
                    else {
                        edu.system.alert("Lỗi: " + d.Message, "w");
                        if (d.Data) {
                            var strLink = d.Data;
                            if (strLink.indexOf('http') === -1) {
                                strLink = edu.system.objApi["HDDT"];
                                strLink = strLink.substring(0, strLink.length - 3) + d.Data;
                                if (strLink.indexOf('http') === -1) {
                                    strLink = edu.system.strhost + strLink;
                                }
                            }
                            var win = window.open(strLink, '_blank');
                            if (win != undefined)
                                win.focus();
                            else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
                        }
                        
                        //edu.extend.notifyBeginLoading(d.Message, undefined, 5000);
                    }
                },
                error: function (er) {
                    //edu.extend.notifyBeginLoading(JSON.stringify(er));
                    edu.system.endLoading();
                },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null, null, true);
        }
    },
    getList_HoaDon_ChuaIn: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSTaiChinh_SoHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTaichinh_Hoadon_Id': '',
            'iTinhTrang': -1,
            'dChuaIn': 0,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('tbldata_HoaDon_ChuaIn_IHD_input').trim(),
            'strTuNgay': '',
            'strDenNgay': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_HoaDon_ChuaIn(json, data.Pager);
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    getList_HoaDon_DaIn: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSTaiChinh_SoHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTaichinh_Hoadon_Id': '',
            'iTinhTrang': -1,
            'dChuaIn': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('tbldata_HoaDon_DaIn_IHD_input').trim(),
            'strTuNgay': '',
            'strDenNgay': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_HoaDon_DaIn(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    --Discription: [2] GEN HTML ==> Hoa Don
    --ULR: Modules
    -------------------------------------------*/
    genTable_HoaDon_ChuaIn: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HoaDon_ChuaIn_IHD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InHoaDonTuDong.getList_HoaDon_ChuaIn()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 5, 6],
                right: [3]
            },
            "aoColumns": [
                {
                    "mDataProp": "TAICHINH_HOADON_NAM"
                },
                {
                    "mDataProp": "SOHOADON"
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "NGAYCAPHOADON"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_HoaDon_DaIn: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HoaDon_DaIn_IHD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InHoaDonTuDong.getList_HoaDon_DaIn()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 5, 6],
                right: [3]
            },
            "aoColumns": [
                {
                    "mDataProp": "TAICHINH_HOADON_NAM"
                },
                {
                    "mDataProp": "SOHOADON"
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "NGAYCAPHOADON"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [3] ACCESS DB ==> Lô hóa đơn
    --ULR: Modules
    -------------------------------------------*/
    save_TaoLo_HoaDon: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_HoaDon/TaoLoHoaDonCanIn',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTAICHINH_HoaDon_Id': '',
            'dSoHoaDon_TrongLo': 100,
            'dChuaIn': 0,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_LoHoaDon();
                    edu.extend.notifyBeginLoading('Các lô hóa đơn đã sẵn sàng để in!');
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_LoHoaDon: function (data) {
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSLoHoaDon',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genTable_LoHoaDon(data);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    --Discription: [3] GEN HTML ==> Lô hóa đơn
    --ULR: Modules
    -------------------------------------------*/
    genTable_LoHoaDon: function (data) {
        var me = this;
        $("#zone_list_LoHoaDon").html('');
        for (var i = 0; i < data.length; i++) {
            var blablesuccess = "";
            if (data[i].TONGSOHOADONDAIN > 0) blablesuccess = "label-success";
            var blengthsuccess = 0;
            if (data[i].TONGSOHOADONDAIN > 0 && data[i].TONGSOHOADON > 0) {
                blengthsuccess = (data[i].TONGSOHOADONDAIN / (data[i].TONGSOHOADON * 1.0)) * 100;
            }
            var row = '';
            row += '<div class="dropdown pull-left" style="margin-bottom: 5px">';
            row += '<div class="dr-progress label-info dropdown-toggle" data-toggle="dropdown">';
            row += '<div class="dr-progress-content poiter ' + blablesuccess + '" style="width:' + blengthsuccess + '%" id="select' + data[i].ID + '">#' + data[i].TEN + '</div>';
            row += '</div>';
            row += '<ul class="dropdown-menu">';
            row += '<li><a class="label-success fa fa-eye view-lohoadon poiter" id="' + data[i].ID + '" name="' + edu.util.returnEmpty(data[i].MAUIN_MASO) + '" title="' + data[i].TEN + '"> Xem hóa đơn trong lô ' + data[i].TEN + '</a></li>';
            row += '<li><a class="label-danger fa fa-print view-lohoadon print-lohoadon poiter" id="' + data[i].ID + '" name="' + edu.util.returnEmpty(data[i].MAUIN_MASO) + '" title="' + data[i].TEN + '"> Thực hiện in hóa đơn trong lô ' + data[i].TEN + '</a></li>';
            row += '</ul>';
            row += '</div>';
            $("#zone_list_LoHoaDon").append(row);
        }
    },
    /*------------------------------------------
    --Discription: [4] ACCESS DB ==> Phieu Hoa Don
    --ULR: Modules
    -------------------------------------------*/
    save_TinhTrangHoaDon: function (strSoHoaDon_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_HoaDon/Them_TinhTrangInHoaDon',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoHoaDon_Id': strSoHoaDon_Id,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                edu.system.iSoLuong--;
            },
            error: function (er) {
                edu.system.iSoLuong--;
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_HoaDonTheoLo: function (strLoHoaDon_Id) {
        var me = this;
        var obj_list = {
            'action': 'TC_HoaDon/LayDSHoaDonTheoLo',
            'versionAPI': 'v1.0',
            'strLoHoaDon_Id': strLoHoaDon_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    if (edu.util.checkValue(data)) {
                        me.gen_HoaDonTheoLo(data);
                    }
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
                edu.system.alert(JSON.stringify(er));
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
    --Discription: [4] GEN HTML ==> Hoa don
    --ULR: Modules
    -------------------------------------------*/
    gen_HoaDonTheoLo: function (data) {
        var me = this;
        $("#zoneLoHoaDonDaChon").html('');
        for (var i = 0; i < data.length; i++) {
            var strUserClass = "";
            var strIClass = "fa fa-file-o";
            if (data[i].SOLANDAIN > 0) {
                strUserClass = "callsuccess";
                strIClass = "fa fa-file-text";
            }
            var row = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print pull-left ' + strUserClass + '"  id="divshow' + data[i].ID + '">';
            row += '<i class="' + strIClass + '" id="ishow' + data[i].ID + '"></i> ';
            row += '<span>' + data[i].SOHOADON + '</span>';
            row += '</div>';
            $("#zoneLoHoaDonDaChon").append(row);
        }
        me.dtMau = data;
        $("#zoneHoaDon").slideUp('slow');
        $("#zoneLoDaChon").slideDown('slow');
    },
    genMauHoaDon_DT: function (data) {
        var me = this;
        var strSoHoaDon_Id = data.ID;
        edu.extend.getData_Phieu(strSoHoaDon_Id, "HOADON", "DSHoaDon", main_doc.InHoaDonTuDong.onsuccess_GetPhieu, true);
    },
    genMauChungTu_PreView: function (data, strLoaiPhieu) {
        var strLoaiPhieu = "HOADON";
        switch (main_doc.InHoaDonTuDong.iPhaiNop) {
            case 0: strLoaiPhieu = "HOADON"; break;
            case 1: strLoaiPhieu = "HOADON"; break;
            case 2: strLoaiPhieu = "BIENLAI"; break;
        }
        console.log(strLoaiPhieu);
        var strChungTu_Id = data.ID;
        edu.extend.getData_Phieu(strChungTu_Id, strLoaiPhieu, "DSHoaDon", main_doc.InHoaDonTuDong.onsuccess_PreView, true);
    },
    onsuccess_GetPhieu: function (data) {
        var me = main_doc.InHoaDonTuDong;
        if (data.length != 32) {//Length == 32 tương ứng với trả không có dữ liệu trả về thì sẽ xóa nội dung trong phiếu 
            var strSoPhieuThu_id = data.CHUNGTU_ID;
            $("#divshow" + strSoPhieuThu_id).addClass('callsuccess');
            $("#ishow" + strSoPhieuThu_id).attr('class', 'fa fa-file-text');
            me.dtMauIn.push(strSoPhieuThu_id);
            //Hiển thị phần trăm hoàn thành
            var x = document.getElementById("select" + me.strLoHoaDon_Id);
            if (x != undefined) {
                x.style.width = ("" + (me.dtMauIn.length / me.iSLHoaDon) * 100 + "%");
            }
        }
        else {
            console.log(data);
            $("#DSHoaDon #zoneHoaDon" + data).replaceWith('');
        }
        main_doc.InHoaDonTuDong.printf_LoHoaDon();
    },
    onsuccess_PreView: function (data) {
        var me = main_doc.InHoaDonTuDong;
        if (data.length != 32) {//Length == 32 tương ứng với trả không có dữ liệu trả về thì sẽ xóa nội dung trong phiếu 
            var strSoPhieuThu_id = data.CHUNGTU_ID;
            $("#zoneChungTu_ChuanBiIn #" + strSoPhieuThu_id + " .box-mini").attr("style", "background-color: #00a65a")
            me.dtMauIn.push(strSoPhieuThu_id);
        }
        else {
            $("#DSHoaDon #zoneHoaDon" + data).replaceWith('');
        }
        main_doc.InHoaDonTuDong.printf_LoChungTu();
    },
    /*------------------------------------------
    --Discription: [5] GEN HTML ==> In
    --ULR: Modules
    -------------------------------------------*/
    printf_LoHoaDon: function () {
        var me = this;
        edu.system.iSoLuong--;
        me.idemHoaDon++;
        if (me.idemHoaDon == me.iSLHoaDon) {
            //edu.system.confirm("Lô hóa đơn đã sẵn sàng để in. Bạn có chắc chắn muốn in không?");
            //edu.extend.remove_PhoiIn("DSHoaDon");
            //edu.util.printHTML('DSHoaDon');
            me.printf_LoHoaDon_Print();
            //Lưu hàng loạt tình trạng hóa đơn
            var dtTemp = [];
            for (var i = 0; i < me.dtMauIn.length; i++) {
                dtTemp.push(me.dtMauIn[i]);
            }
            for (var i = 0; i < me.dtTemp.length; i++) {
                me.save_TinhTrangHoaDon(me.dtTemp[i]);
            }
            me.getList_HoaDon_ChuaIn();
            me.getList_HoaDon_DaIn();
        }
    },
    printf_LoChungTu: function () {
        var me = this;
        edu.system.iSoLuong--;
        me.idemHoaDon++;
        if (me.idemHoaDon == me.iSLHoaDon) {
            //edu.system.confirm("Lô chứng từ đã sẵn sàng để in. Bạn có chắc chắn muốn in không?");
            //$("#btnYes").click(function (e) {
            //    $('#myModalAlert').modal('hide');
            //    e.stopImmediatePropagation();
            //    edu.extend.remove_PhoiIn("DSHoaDon");
            //    //edu.util.printHTML('DSHoaDon');
            //    me.printf_LoHoaDon();
            //});
            me.printf_LoHoaDon_Print();
        }
    },


    printf_LoHoaDon_Print: function () {
        var me = this;
        //Xóa phôi in liên nếu có
        edu.extend.remove_PhoiIn("DSHoaDon");
        //Hiện thị form view hóa đơn
        $("#MainContent").slideUp('slow');
        $("#zoneXuatThanhCong").slideUp('slow');
        $("#zoneThongTinPhieuThu").slideDown('slow');
        //
        console.log(me.dtMauIn);
        var strFirtId = "";
        var i = 0;
        while (true) {
            strFirtId = $("#DSHoaDon div:eq(" + i + ")").attr("id");
            if (strFirtId.indexOf("DSHoaDon") == 0 && strFirtId.length > 39) {
                break;
            }
            i++;
        }
        me.genChonLien(strFirtId, "zoneLienHoaDon");
        //
        //Xóa trang trắng do in theo lô sinh ra
        var LienHoaDon = $("#DSHoaDon p[style = 'page-break-before: always;']");
        $(LienHoaDon[LienHoaDon.length - 1]).replaceWith('');
        me.changeWidthPrint();
    },

    changeWidthPrint: function () {
        //Thay đổi vùng in
        var lMauInPhieuThu = document.getElementById("DSHoaDon").offsetWidth;
        console.log(lMauInPhieuThu);
        if (lMauInPhieuThu > 700) lMauInPhieuThu += 240;
        else {
            lMauInPhieuThu = 1250;
        }
        var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        if (lMainPrint > lMauInPhieuThu) {
            document.getElementById('zoneThongTinPhieuThuActive').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
            document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneThongTinPhieuThuActive').style.paddingLeft = "20px";
            document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        }
        //
        //Tùy chọn in theo liên
        //edu.extend.genChonLien("DSHoaDon", "zoneLienHoaDon");
    },
    genChonLien: function (zoneMauIn, zoneTool) {
        $("#" + zoneTool).parent().show();
        var Lien = $("#" + zoneMauIn + " .pr-containt");
        if (Lien.length > 1) {
            var row = '<div id="zoneSelectedLien" class="compact-theme simple-pagination" style="float:left; width: 100%">';
            row += '<ul>';
            for (var i = 0; i < Lien.length; i++) {
                row += '<li>';
                row += '<a class="activeLien" name="' + i + '" style="cursor: pointer">' + (i + 1) + '</a>';
                row += '</li>';
            }
            row += '<li>';
            row += '<a class="activeLien" name="selectall" style="cursor: pointer">Tất cả</a>';
            row += '</li>';
            row += '</ul>';
            row += '</div>';
            $("#" + zoneTool).html(row);
            this.activeLien();
        }
        else {
            //Cẩn thận nhé
            $("#" + zoneTool).parent().hide();
        }
    },
    activeLien: function () {
        var me = this;
        $("#zoneSelectedLien").delegate("li a", "click", function (e) {
            var point = this;
            var iVitri = $(point).attr("name");
            for (var i = 0; i < me.dtMauIn.length; i++) {
                me.showLien("DSHoaDon" + me.dtMauIn[i], iVitri);
            }
        });
    },
    showLien: function (zoneMauIn, iVitri) {
        var Lien = $("#" + zoneMauIn + " .pr-containt");
        if (iVitri != "selectall") {
            console.log(Lien.length);
            for (var i = 0; i < Lien.length; i++) {
                if (i == iVitri) {
                    Lien[i].style.display = ""
                    continue;
                }
                Lien[i].style.display = "none";
            }
            $("#" + zoneMauIn + " p[style='page-break-before: always;']").hide();
        }
        else {
            for (var i = 0; i < Lien.length; i++) {
                Lien[i].style.display = "";
            }
            $("#" + zoneMauIn + " p[style='page-break-before: always;']").show();
        }
    },
    
    printPhieu: function () {
        var me = this;
        edu.util.printHTML('DSHoaDon');
        $("#zoneThongTinPhieuThu").slideUp('slow');
        $("#MainContent").slideDown('slow');
    },

    /*------------------------------------------
    --Discription: [6] Rà soát bản ghi thiếu thông tin (tab "DS khoản đã nộp chưa xuất HĐ")
    --Note: Xuất hóa đơn cần đủ CCCD + Địa chỉ. Tiện ích này quét TOÀN BỘ dữ liệu theo bộ
    --      lọc hiện tại (pageSize lớn, không phụ thuộc trang đang xem) rồi giữ lại các bản
    --      ghi trống ở cột người dùng tick, để bổ sung trước khi sinh số hàng loạt.
    -------------------------------------------*/
    _thieu_ColLabel: {
        'CCCD': 'CCCD',
        'DIACHICOQUANCONGTAC': 'Địa chỉ',
        'NOIDUNG': 'Nội dung',
        'SOTIEN': 'Số tiền',
        'LOP': 'Lớp'
    },

    checkThieu_ChuaXuat: function () {
        var me = this;
        var arrCol = [];
        $(".chkThieu_Col:checked").each(function () { arrCol.push($(this).val()); });
        if (arrCol.length === 0) {
            edu.system.alert("Vui lòng tick ít nhất 1 cột cần kiểm tra", "w");
            return;
        }
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.system.alert('Vui lòng chọn khoản thu trước khi rà soát!', 'w');
            return;
        }
        // Cùng bộ lọc với getList_KhoanThu_ChuaXuat, chỉ khác pageSize để lấy hết bản ghi
        var obj_list = {
            'action': 'TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': edu.util.getValById('txtSearch_DT').trim(),
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu_IHD'),
        };
        $("#lblCheckThieu_Info").html('<i class="fa fa-spinner fa-spin"></i> Đang quét dữ liệu...');
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (!data || !data.Success) {
                    $("#lblCheckThieu_Info").html('');
                    edu.system.alert("Không lấy được dữ liệu để rà soát: " + ((data && data.Message) || ''), "w");
                    return;
                }
                var rows = edu.util.checkValue(data.Data) ? data.Data : [];
                var isEmpty = function (v) {
                    return v === null || v === undefined || String(v).trim() === '';
                };
                var dtThieu = [];
                var dem = {};
                arrCol.forEach(function (c) { dem[c] = 0; });
                rows.forEach(function (r) {
                    var cotThieu = [];
                    arrCol.forEach(function (c) {
                        if (isEmpty(r[c])) { cotThieu.push(me._thieu_ColLabel[c] || c); dem[c]++; }
                    });
                    if (cotThieu.length) {
                        r._COTTHIEU = cotThieu.join(', ');
                        dtThieu.push(r);
                    }
                });
                me.dtThieu_ChuaXuat = dtThieu;
                me.genTable_KhoanThu_ChuaXuat(dtThieu, dtThieu.length);

                var chiTiet = arrCol.map(function (c) {
                    return (me._thieu_ColLabel[c] || c) + ': <b>' + dem[c] + '</b>';
                }).join(' · ');
                if (dtThieu.length === 0) {
                    $("#lblCheckThieu_Info").html('<span style="color:#0a7d3d;"><i class="fa fa-check-circle"></i> '
                        + 'Đã quét <b>' + rows.length + '</b> bản ghi — không có bản ghi nào thiếu thông tin.</span>');
                    $("#btnCheckThieu_Export").addClass('d-none');
                } else {
                    $("#lblCheckThieu_Info").html('<span style="color:#b32020;"><i class="fa fa-exclamation-triangle"></i> '
                        + 'Thiếu <b>' + dtThieu.length + '</b>/<b>' + rows.length + '</b> bản ghi &nbsp;(' + chiTiet + ')</span>');
                    $("#btnCheckThieu_Export").removeClass('d-none');
                }
                $("#btnCheckThieu_Clear").removeClass('d-none');
            },
            error: function (er) {
                edu.system.endLoading();
                $("#lblCheckThieu_Info").html('');
                edu.system.alert("Lỗi khi rà soát: " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Bỏ chế độ lọc thiếu, tải lại danh sách bình thường
    -------------------------------------------*/
    clearCheckThieu_ChuaXuat: function () {
        var me = this;
        me.dtThieu_ChuaXuat = [];
        $("#lblCheckThieu_Info").html('');
        $("#btnCheckThieu_Export, #btnCheckThieu_Clear").addClass('d-none');
        me.getList_KhoanThu_ChuaXuat();
    },

    /*------------------------------------------
    --Discription: Xuất danh sách thiếu ra Excel để gửi đi bổ sung.
    --Note: Trang này KHÔNG load SheetJS → tạo file .xls từ bảng HTML bằng Blob (Excel đọc được),
    --      tránh phụ thuộc CDN ngoài.
    -------------------------------------------*/
    exportThieu_ChuaXuat: function () {
        var me = this;
        var dt = me.dtThieu_ChuaXuat || [];
        if (!dt.length) {
            edu.system.alert("Không có bản ghi thiếu để xuất", "w");
            return;
        }
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var cols = [
            ['Mã số', 'MASONGUOIHOC'], ['Họ tên', 'HOTENNGUOIHOC'], ['CCCD', 'CCCD'],
            ['Số tiền', 'SOTIEN'], ['Nội dung', 'NOIDUNG'], ['Địa chỉ', 'DIACHICOQUANCONGTAC'],
            ['Lớp', 'LOP'], ['Học kỳ', 'DAOTAO_THOIGIANDAOTAO'], ['Khoản thu', 'TAICHINH_CACKHOANTHU_TEN'],
            ['Người tạo', 'NGUOITAO_TENDAYDU'], ['Ngày tạo', 'NGAYTAO_DD_MM_YYYY']
        ];
        var html = '<table border="1"><thead><tr><th>Stt</th>';
        cols.forEach(function (c) { html += '<th>' + c[0] + '</th>'; });
        html += '<th>Cột đang thiếu</th></tr></thead><tbody>';
        dt.forEach(function (r, i) {
            html += '<tr><td>' + (i + 1) + '</td>';
            cols.forEach(function (c) {
                var v = r[c[1]];
                html += '<td>' + esc(v == null ? '' : v) + '</td>';
            });
            html += '<td>' + esc(r._COTTHIEU || '') + '</td></tr>';
        });
        html += '</tbody></table>';

        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var d = new Date();
        var stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
            + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
        var fname = 'ThieuThongTin_' + dt.length + 'banghi_' + stamp + '.xls';
        // BOM để Excel đọc đúng tiếng Việt
        var blob = new Blob(['﻿<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'],
            { type: 'application/vnd.ms-excel;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }, 1000);
        edu.system.alert("Đã xuất " + dt.length + " bản ghi thiếu ra file " + fname, "s");
    }
}