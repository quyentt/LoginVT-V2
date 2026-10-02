/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function DangKyNguoiO() { };
DangKyNguoiO.prototype = {
    dt_NO: [],
    strNguoiO_Id: '',
    dtKhoanThu: [],
    dtHinhThuc: [],
    dtMienGiam: [],
    dtDoiTuongDangKy: [],
    strDoiTuongDangKy_id: "",
    strDoiTuong_PhongDK_id: "",
    strTaiChinh_CacKhoanThu_Id: '',
    strHopDong_Id: '',
    strTinhTrangHopDong_Id: "",


    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        //$("#zoneKhoiTao_Action").delegate('.btnClose', 'click', function () {
        //    me.toggle_batdau();
        //});
        //$(".btnClose").click(function () {
        //    me.toggle_batdau();
        //});
        //$("#addHoSoDaoTao").click(function () {
        //    me.toggle_hosodaotao();
        //});
        //$("#addHoSoKhac").click(function () {
        //    me.toggle_hosokhac();
        //});
        /*------------------------------------------
       --Discription: [1] Action HoSo NhanSu
       --Order: 
       -------------------------------------------*/
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Save', 'click', function () {
            var strPhong_Id = edu.util.getValById("dropHoSo_Phong");
            var strNgayVao = edu.util.getValById("txtHoSo_NgayVao");
            if (!edu.util.checkValue(strPhong_Id) || !edu.util.checkValue(strNgayVao)) {
                edu.system.confirm('Không thể xếp phòng do không chọn phòng hoặc ngày vào. Bạn có muốn tiếp tục thêm hồ sơ không? ');
                var strHoSo_Id = this.id;
                $("#btnYes").click(function (e) {
                    if (!edu.util.checkValue(me.strNguoiO_Id))
                        me.save_NO();
                    else me.CapNhat_NO();
                });
            }
            else {
                if (!edu.util.checkValue(me.strNguoiO_Id))
                    me.save_NO();
                else me.CapNhat_NO();
            }
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Rewrite', 'click', function () {
            me.rewrite();
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Add', 'click', function () {
            me.save_NO();
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Update', 'click', function () {
            var valid = edu.util.validInputForm(me.arrValid_NO);
            if (valid) {
                me.CapNhat_NO();
            }
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Delete', 'click', function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_NO();
            });
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Addnew', 'click', function () {
            me.rewrite();
            me.action_addnew();
            edu.util.setOne_BgRow("xx", "tblKhoiTao_NhanSu");
        });
        $("#btnDangKy_Save").click(function () {
            me.save_HopDong();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        
        $(".btnHopDong_BaoCao").click(function () {
            if (me.strHopDong_Id == "") {
                return;
            }
            var dTongTien = edu.util.getValById("txtHopDong_TongTien").replace(/,/g, '');
            var strSoTien = to_vietnamese(dTongTien);
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            var strReportCode = this.name;
            var strHopDong_Id = me.strHopDong_Id;
            edu.system.report(strReportCode, "", function (addKeyValue) {
                addKeyValue("strHopDong_Id", strHopDong_Id);
                addKeyValue("strSoTienBangChu", strSoTien);
            });
        });
        $("#zoneHopDong").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        
        $(".btnHopDong_TinhTien").click(function () {
            var dSoThang = $("#txtHopDong_SoThang".val());
            me.save_HopDong_TinhTien(dSoThang);
        });
        
        $("#txtHopDong_NgayKy").blur(function () {
            edu.util.viewValById("txtHopDong_NgayVao", edu.util.getValById("txtHopDong_NgayKy"));
        })
        $("#txtHopDong_NgayKetThuc").blur(function () {
            edu.util.viewValById("txtHopDong_NgayRa", edu.util.getValById("txtHopDong_NgayKetThuc"));
        })
        $("#dropHopDong_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });
        $("#dropSearch_ToaNha").on("select2:select", function () {
            me.getList_Phong2();
        });
        $("#dropSearch_Phong").on("select2:select", function () {
            me.getList_DangKyPhong();
        });
        $("#dropHoSo_ToaNha").on("select2:select", function () {
            me.getList_Phong3();
        });
        /*------------------------------------------
       --Discription: [2] Action HoSo NhanSu
       --Order: 
       -------------------------------------------*/
        //$("#tblKhoiTao_NhanSu").delegate('.btnDetail', 'click', function (e) {
        //    me.rewrite();
        //    me.action_update();
        //    var strId = this.id;
        //    edu.util.viewHTMLById("lblForm_KhoiTao_NO", '<i class="fa fa-pencil"></i> Chỉnh sửa');
        //    me.strNguoiO_Id = edu.util.cutPrefixId(/view_/g, strId);
        //    edu.util.setOne_BgRow(me.strNguoiO_Id, "tblKhoiTao_NhanSu");
        //    me.getDetail_NO(me.strNguoiO_Id);
        //    me.toggle_hosoedit();
        //});
        //$(".btnExtend_Search").click(function () {
        //    edu.util.toggle("box-sub-search");
        //});
        //$("#txtSearch_KhoiTao_TuKhoa").keypress(function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        me.getList_NO();
        //    }
        //});
        //$(".btnSearchKhoiTao_NhanSu").click(function () {
        //    me.getList_NO();
        //});
        /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        //$("#dropSearch_KhoiTao_CCTC").on("select2:select", function () {
        //    var strCha_Id = $(this).find('option:selected').val();
        //    if (edu.util.checkValue(strCha_Id)) {
        //        edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
        //    }
        //    else {
        //        me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
        //    }
        //});
        //$("#dropSearch_KhoiTao_LoaiDoiTuong").on("select2:select", function () {
        //    me.getList_NO();
        //});
        /*------------------------------------------
        --Discription: [2] Action Ho So Dao Tao
        --Order:
        -------------------------------------------*/
        //$("#txtSearch_DaoTao_TuKhoa").keypress(function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        me.getList_DTDT();
        //    }
        //});
        //$(".btnSearchDaoTao_Phong").click(function () {
        //    me.getList_DTDT();
        //});
        //$("#zoneHoSoDaoTao").delegate('.btnAddHoSoDaoTao', 'click', function () {
        //    edu.system.confirm('Bạn có chắc chắn thêm hồ sơ <i class="cl-danger">' + this.title + '</i> từ đào tạo không?');
        //    var strHoSo_Id = this.id;
        //    $("#btnYes").click(function (e) {
        //        me.save_DTDT(strHoSo_Id);
        //    });
        //});
    },
    page_load: function () {
        var me = main_doc.DangKyNguoiO;
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTHD", "", "", me.loadHopDong);
        me.arrValid_NO = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            //{ "MA": "txtNO_Ho", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Ten", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Email", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_CoCauToChuc", "THONGTIN1": "EM" },
            { "MA": "txtNO_MaSo", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_TinhTrangNhanSu", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_LoaiDoiTuong", "THONGTIN1": "EM" }
        ];
        me.action_addnew();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("KTX.LOP", "dropNO_LopDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KHOADAOTAO", "dropNO_KhoaDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropNO_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropNO_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUOCTICH", "dropNO_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropNO_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNO_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TRINHDO", "dropNO_TrinhDoDT");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.DIDT", "dropNO_DienDT");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.NGAN", "dropNO_NganhDT");
        me.getList_ToaNha();
        me.getList_Phong();
        edu.system.uploadAvatar(['txtNO_Anh']);
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_DapAn = [
            { "MA": "txtHopDong_So", "THONGTIN1": "EM" }
            //{ "MA": "dropHopDong_TinhTrang", "THONGTIN1": "EM" }
        ];
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.KTX.DVT0,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.getList_HinhThuc);
        ////load
        //setTimeout(function () {
        //    me.getList_DangKyPhong();
        //}, 500);
    },
    toggle_batdau: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_hosodaotao: function () {
        edu.util.toggle_overide("zone-bus", "zoneHoSoDaoTao");
    },
    toggle_hosokhac: function () {
        var me = this;
        console.log(11111);
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        me.action_addnew();
        me.rewrite();
    },
    toggle_hosoedit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        me.action_update();
    },
    toggle_hopdong: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneHopDong");
    },
    rewrite: function () {
        var me = main_doc.DangKyNguoiO;
        var strAnh = edu.system.getRootPathImg("");
        $("#srctxtNO_Anh").attr("src", strAnh);
        me.strId = "";
        var arrId = ["txtNO_Ho", "txtNO_Ten", "txtNO_BiDanh", "txtNO_NgaySinh", "txtNO_ThangSinh",
            "txtNO_NamSinh", "txtNO_Email", "txtNO_DienThoaiCaNhan", "dropNO_GioiTinh", "dropNO_QuocTich",
            "dropNO_CoCauToChuc", "txtNO_MaSo", "dropNO_TinhTrangNhanSu", "dropNO_LoaiDoiTuong", "dropNO_LoaiGiangVien",
            "txtNO_SoCanCuoc", "txtNO_SoCanCuoc", "txtNO_DiaChiLienHe", "txtNO_GhiChu", "txtNO_SoHoChieu",
            "txtNO_HanViSa", "dropNO_TrinhDoDT", "dropNO_DienDT", "dropNO_NganhDT", "txtNO_QDDT_So",
            "txtNO_QDDT_NgayDen", "txtNO_QDDT_NgayDi", "txtNO_QDDT_NgayKy", "txtNO_QDGH_So", "txtNO_QDGH_NgayKy",
            "dropNO_QuocTich", "dropNO_DanToc", "dropNO_KhoaDaoTao", "dropNO_LopDaoTao", "dropNO_TonGiao",
            "txtNO_QueQuan", "txtNO_HoKhauThuongTru", "txtNO_ThoiGianDen", "txtNO_ThoiGianDi", "txtNO_SDTGiaDinh", "dropNO_LoaiDoiTuong", "dropHoSo_Phong", "dropHoSo_ToaNha"];
        edu.util.resetValByArrId(arrId);
    },
    action_addnew: function () {
        edu.util.viewHTMLById("lblForm_KhoiTao_NO", '<i class="fa fa-pencil"></i> Đăng ký người ở');
        var html = '';
        html += '<a id="btnKhoiTao_Save" class="btn btn-success" style="margin:3px"><i class="	fa fa-file-text-o"></i><span class="lang" key=""> Tạo hợp đồng</span></a>';
        $("#zoneKhoiTao_Action").html(html);
        $("#zoneDangKyPhong").show();
    },
    action_update: function () {
        var html = '';
        html += '<a id="btnKhoiTao_Delete" class="btn btn-default" style="margin:3px"><i class="fa fa-trash"></i><span class="lang" key=""> Xóa</span></a>';
        html += '<a class="btn btn-default btnClose" href="#" title = "Close"> <i class="fa fa-times"></i> Đóng</a>';
        html += '<a id="btnKhoiTao_Update" class="btn btn-warning" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Lưu</span></a>';
        $("#zoneKhoiTao_Action").html(html);
    },
    loadHopDong: function (data) {
        var me = main_doc.ChuaCoHopDong;
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA == "1") {
                me.strTinhTrangHopDong_Id = data[i].ID;
                break;
            }
        }
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    save_NO: function () {
        var me = main_doc.DangKyNguoiO;
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa/ThemMoi',
            

            'strId': '',
            'strMaSo': edu.util.getValById('txtNO_MaSo'),
            'strHoDem': edu.util.getValById('txtNO_HoDem'),
            'strTen': edu.util.getValById('txtNO_Ten'),
            'strNgaySinh': edu.util.getValById('txtNO_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNO_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNO_NamSinh'),
            'strGioiTinh_Id': edu.util.getValById('dropNO_GioiTinh'),
            'strSDT_CaNhan': edu.util.getValById('txtNO_DienThoaiCaNhan'),
            'strEmail_CaNhan': edu.util.getValById('txtNO_Email'),
            'strCanCuoc_So': edu.util.getValById('txtNO_SoCanCuoc'),
            'strDiaChiLienHe': edu.util.getValById('txtNO_DiaChiLienHe'),
            'strGhiChu': edu.util.getValById('txtNO_GhiChu'),
            'strSoHoChieu': edu.util.getValById('txtNO_SoHoChieu'),
            'strThoiHanViSa': edu.util.getValById('txtNO_HanViSa'),
            'strTrinhDoDaoTao_Id': edu.util.getValById('dropNO_TrinhDoDT'),
            'strDienDaoTao_Id': edu.util.getValById('dropNO_DienDT'),
            'strNganhDaoTao_Id': edu.util.getValById('dropNO_NganhDT'),
            'strAnhCaNhan': edu.util.getValById('txtNO_AnhCaNhan'),
            'strQuocTich_Id': edu.util.getValById('dropNO_QuocTich'),
            'strDanToc_Id': edu.util.getValById('dropNO_DanToc'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropNO_KhoaDaoTao'),
            'strLopQuanLy_Id': edu.util.getValById('dropNO_LopDaoTao'),
            'strTonGiao_Id': edu.util.getValById('dropNO_TonGiao'),
            'strSoTaiKhoanCaNhan': edu.util.getValById('txtNO_SoTaiKhoan'),
            'strQueQuan': edu.util.getValById('txtNO_QueQuan'),
            'strHoKhauThuongTru': edu.util.getValById('txtNO_HoKhauThuongTru'),
            'strThoiGianDen': edu.util.getValById('txtNO_ThoiGianDen'),
            'strThoiGianDi': edu.util.getValById('txtNO_ThoiGianDi'),
            'strSDT_GiaDinh': edu.util.getValById('txtNO_SDTGiaDinh'),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropNO_LoaiDoiTuong'),

            //'strQuyetDinhDaoTao_So': edu.util.getValById('txtNO_QDDT_So'),
            //'strQuyetDinhDaoTao_NgayDen': edu.util.getValById('txtNO_QDDT_NgayDen'),
            //'strQuyetDinhDaoTao_NgayDi': edu.util.getValById('txtNO_QDDT_NgayDi'),
            //'strQuyetDinhDaoTao_NgayKy': edu.util.getValById('txtNO_QDDT_NgayKy'),
            //'strQuyetDinhGiaHan_So': edu.util.getValById('txtNO_QDGH_So'),
            //'strQuyetDinhGiaHan_NgayKy': edu.util.getValById('txtNO_QDGH_NgayKy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_NO();
                    var strDoiTuong_id = data.Id;
                    var strPhong_Id = edu.util.getValById("dropHoSo_Phong");
                    var strNgayVao = edu.util.getValById("txtHoSo_NgayVao");
                    var strNgayRa = edu.util.getValById("txtHoSo_NgayRa");
                    if (edu.util.checkValue(strDoiTuong_id) && edu.util.checkValue(strPhong_Id) && edu.util.checkValue(strNgayVao)) {
                        edu.system.confirm('Thêm hồ sơ thành công. Bạn có chắc chắn muốn xếp phòng không?');
                        me.strNguoiO_Id = data.Id;
                        $("#btnYes").click(function (e) {
                            me.save_DangKy(strDoiTuong_id, strPhong_Id, strNgayVao, strNgayRa);
                        });
                    }
                    else {
                        me.strNguoiO_Id = data.Id;
                        obj = {
                            title: "",
                            content: "Thêm hồ sơ thành công!",
                            code: ""
                        };
                        edu.system.afterComfirm(obj);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    CapNhat_NO: function () {
        var me = main_doc.DangKyNguoiO;
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa/CapNhat',
            

            'strId': me.strNguoiO_Id,
            'strMaSo': edu.util.getValById('txtNO_MaSo'),
            'strHoDem': edu.util.getValById('txtNO_HoDem'),
            'strTen': edu.util.getValById('txtNO_Ten'),
            'strNgaySinh': edu.util.getValById('txtNO_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNO_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNO_NamSinh'),
            'strGioiTinh_Id': edu.util.getValById('dropNO_GioiTinh'),
            'strSDT_CaNhan': edu.util.getValById('txtNO_DienThoaiCaNhan'),
            'strEmail_CaNhan': edu.util.getValById('txtNO_Email'),
            'strCanCuoc_So': edu.util.getValById('txtNO_SoCanCuoc'),
            'strDiaChiLienHe': edu.util.getValById('txtNO_DiaChiLienHe'),
            'strGhiChu': edu.util.getValById('txtNO_GhiChu'),
            'strSoHoChieu': edu.util.getValById('txtNO_SoHoChieu'),
            'strThoiHanViSa': edu.util.getValById('txtNO_HanViSa'),
            'strTrinhDoDaoTao_Id': edu.util.getValById('dropNO_TrinhDoDT'),
            'strDienDaoTao_Id': edu.util.getValById('dropNO_DienDT'),
            'strNganhDaoTao_Id': edu.util.getValById('dropNO_NganhDT'),
            'strAnhCaNhan': edu.util.getValById('txtNO_AnhCaNhan'),
            'strQuocTich_Id': edu.util.getValById('dropNO_QuocTich'),
            'strDanToc_Id': edu.util.getValById('dropNO_DanToc'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropNO_KhoaDaoTao'),
            'strLopQuanLy_Id': edu.util.getValById('dropNO_LopDaoTao'),
            'strTonGiao_Id': edu.util.getValById('dropNO_TonGiao'),
            'strSoTaiKhoanCaNhan': edu.util.getValById('txtNO_SoTaiKhoan'),
            'strQueQuan': edu.util.getValById('txtNO_QueQuan'),
            'strHoKhauThuongTru': edu.util.getValById('txtNO_HoKhauThuongTru'),
            'strThoiGianDen': edu.util.getValById('txtNO_ThoiGianDen'),
            'strThoiGianDi': edu.util.getValById('txtNO_ThoiGianDi'),
            'strSDT_GiaDinh': edu.util.getValById('txtNO_SDTGiaDinh'),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropNO_LoaiDoiTuong'),

            //'strQuyetDinhDaoTao_So': edu.util.getValById('txtNO_QDDT_So'),
            //'strQuyetDinhDaoTao_NgayDen': edu.util.getValById('txtNO_QDDT_NgayDen'),
            //'strQuyetDinhDaoTao_NgayDi': edu.util.getValById('txtNO_QDDT_NgayDi'),
            //'strQuyetDinhDaoTao_NgayKy': edu.util.getValById('txtNO_QDDT_NgayKy'),
            //'strQuyetDinhGiaHan_So': edu.util.getValById('txtNO_QDGH_So'),
            //'strQuyetDinhGiaHan_NgayKy': edu.util.getValById('txtNO_QDGH_NgayKy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong_id = me.strNguoiO_Id;
                    var strPhong_Id = edu.util.getValById("dropHoSo_Phong");
                    var strNgayVao = edu.util.getValById("txtHoSo_NgayVao");
                    var strNgayRa = edu.util.getValById("txtHoSo_NgayRa");
                    if (edu.util.checkValue(strDoiTuong_id) && edu.util.checkValue(strPhong_Id) && edu.util.checkValue(strNgayVao)) {
                        edu.system.confirm('Cập nhật thành công. Bạn có chắc chắn muốn xếp phòng không?');
                        $("#btnYes").click(function (e) {
                            me.save_DangKy(strDoiTuong_id, strPhong_Id, strNgayVao, strNgayRa);
                        });
                    }
                    else {
                        obj = {
                            title: "",
                            content: "Cập nhật thành công!",
                            code: ""
                        };
                        edu.system.afterComfirm(obj);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NO: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongOKyTucXa/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_KhoiTao_TuKhoa"),
            'strTinhTrangHopDong_Id': edu.util.getValById("dropSearch_KhoiTao_TinhTrangHopDong"),
            'dBiKyLuat': edu.util.getValById("dropSearch_KhoiTao_KyLuat"),
            'strNgayVao_TuNgay': edu.util.getValById("txtSearch_KhoiTao_NgayVao_TuNgay"),
            'strNgayVao_DenNgay': edu.util.getValById("txtSearch_NgayVao_DenNgay"),
            'strNgayRa_TuNgay': edu.util.getValById("txtSearch_NgayRa_TuNgay"),
            'strNgayRa_DenNgay': edu.util.getValById("txtSearch_NgayRa_DenNgay"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearchHoSo_ToaNha"),
            'strLopQuanLy_Id': '',
            'strKTX_Phong_Id': edu.util.getValById("dropSearchHoSo_Phong"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_KhoiTao_LoaiDoiTuong"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_KhoaDT"),
            'dDoiTuongConDangOKTX': edu.util.getValById("dropSearch_TinhTrang"),
            'strGioiTinh_Id': edu.util.getValById("dropSearch_KhoiTao_GioiTinh"),
            'strTrinhDoDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_TDDT"),
            'strDienDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_DienDT"),
            'strNganhDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_NganhDT"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNgayKiemTra': '',
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dt_NO = dtResult;
                    }
                    me.genTable_NO(dtResult, iPager);
                    if (dtResult.length == 0) {
                        me.toggle_hosodaotao();
                        $("#txtSearch_DaoTao_TuKhoa").val(edu.util.getValById("txtSearch_KhoiTao_TuKhoa"));
                        me.getList_DTDT();
                    }
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_NO: function (strId) {
        var me = main_doc.DangKyNguoiO;

        //view data --Edit
        var obj_detail = {
            'action': 'KTX_DoiTuongOKyTucXa/LayChiTiet',
            
            'strId': strId
        }
        if (strId.length != 32) return;
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewForm_NO(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    delete_NO: function (strId) {
        var me = main_doc.DangKyNguoiO;
        //--Edit
        var obj_delete = {
            'action': 'KTX_DoiTuongOKyTucXa/Xoa',
            
            'strIds': me.strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    if (me.strId == strId) {
                        $(".btnClose").trigger("click");
                    }
                    edu.system.afterComfirm(obj);
                    //me.getList_NO();
                }
                else {
                    edu.system.alert("SV_HoSo/Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("SV_HoSo/Xoa (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_NO: function (data, iPager) {
        edu.util.viewHTMLById("lblHSLL_NhanSu_Tong", iPager);
        var me = main_doc.DangKyNguoiO;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DangKyNguoiO.getList_NO()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11]
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_TOANHA_TEN"
                }
                , {
                    "mDataProp": "KTX_PHONG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        return strHoTen;
                    }
                }
                , {
                    "mDataProp": "MASO"
                }
                , {
                    "mDataProp": "GIOITINH_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH);
                        return strHoTen;
                    }
                }
                , {
                    "mDataProp": "KHOAHOC"
                }
                , {
                    "mDataProp": "LOPQUANLY"
                }
                , {
                    "mDataProp": "DANTOC_TEN"
                }
                , {
                    "mDataProp": "HOKHAUTHUONGTRU"
                }
                , {
                    "mDataProp": "TINHTRANGKYLUAT"
                }
                , {
                    "mDataProp": "TINHTRANGHOPDONG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    viewForm_NO: function (data) {
        var me = main_doc.DangKyNguoiO;
        me.rewrite();
        //anh
        edu.util.viewValById("txtNO_Anh", data.ANH);
        var strAnh = edu.system.getRootPathImg(data.ANH);
        $("#srctxtNO_Anh").attr("src", strAnh);
        //
        me.strId = data.ID;
        edu.util.viewValById("txtNO_Ho", data.HODEM);
        edu.util.viewValById("txtNO_Ten", data.TEN);
        edu.util.viewValById("txtNO_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNO_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNO_NamSinh", data.NAMSINH);
        edu.util.viewValById("dropNO_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("txtNO_Email", data.EMAIL_CANHAN);
        edu.util.viewValById("txtNO_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNO_MaSo", data.MASO);
        edu.util.viewValById("txtNO_SoCanCuoc", data.CANCUOC_SO);
        edu.util.viewValById("txtNO_DiaChiLienHe", data.DIACHILIENHE);
        edu.util.viewValById("txtNO_GhiChu", data.GHICHU);
        edu.util.viewValById("txtNO_SoHoChieu", data.SOHOCHIEU);
        edu.util.viewValById("txtNO_HanViSa", data.THOIHANVISA);
        edu.util.viewValById("dropNO_TrinhDoDT", data.TRINHDODAOTAO_ID);
        edu.util.viewValById("dropNO_DienDT", data.DIENDAOTAO_ID);
        edu.util.viewValById("dropNO_NganhDT", data.NGANHDAOTAO_ID);
        edu.util.viewValById("dropNO_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropNO_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropNO_KhoaDaoTao", data.KHOADAOTAO_ID);
        edu.util.viewValById("dropNO_LopDaoTao", data.LOPQUANLY_ID);
        edu.util.viewValById("dropNO_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("txtNO_SoTaiKhoan", data.SOTAIKHOANCANHAN1);
        edu.util.viewValById("txtNO_QueQuan", data.QUEQUAN);
        edu.util.viewValById("txtNO_HoKhauThuongTru", data.HOKHAUTHUONGTRU);
        edu.util.viewValById("txtNO_ThoiGianDen", data.THOIGIANDEN);
        edu.util.viewValById("txtNO_ThoiGianDi", data.THOIGIANDI);
        edu.util.viewValById("txtNO_SDTGiaDinh", data.SDT_GIADINH);
        edu.util.viewValById("dropNO_LoaiDoiTuong", data.PHANLOAIDOITUONG_ID);
        if (edu.util.checkValue(data.KTX_PHONG_TEN)) {
            $("#zoneDangKyPhong").hide();
            $("#btnKhoiTao_Update span").html(" Lưu")
        }
        else {
            $("#zoneDangKyPhong").show();
            $("#btnKhoiTao_Update span").html(" Tạo hợp đồng")
        }
    },
    /*------------------------------------------
    --Discription: Access Doi Tuong DaoTao
    --ULR: Modules
    -------------------------------------------*/
    getList_DTDT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongDaoTao/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DaoTao_TuKhoa"),
            'strGioiTinh': '-1',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genList_DTDT(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DTDT: function (strDoiTuongDaoTao_Id) {
        var me = main_doc.DangKyNguoiO;
        var obj_save = {
            'action': 'KTX_DoiTuongDaoTao/ThemMoi',
            

            'strNguoiHoc_Id': strDoiTuongDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Thêm hồ sơ thành công!</i>',
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_NO();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Gen Doi Tuong DaoTao
    --ULR: Modules
    -------------------------------------------*/
    genList_DTDT: function (json) {
        var me = this;
        var row = "";
        for (var i = 0; i < json.length; i++) {
            var data = json[i];
            row += '<div class="col-sm-6">';
            row += '<div class="box-mini" style="height: 160px;">';
            row += '<div style="width: 160px; float: left">';
            row += '<img style="margin: 0 auto; display: block; height: 150px" src="' + edu.system.getRootPathImg(data.ANH) + '">';
            row += '</div>';
            row += '<div style="width: 280px; float: left; padding-left: 3px; margin-top: -7px">';
            row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.MASV) + '</p>';
            row += '<p class="pcard"><i class="fa fa-users colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
            row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH) + '</p>';
            row += '<p class="pcard"><i class="fa fa-folder-open colorcard"></i> <span class="lang" key="">Khóa</span>: ' + edu.util.checkEmpty(data.KHOAHOC_TEN) + '</p>';
            row += '<p class="pcard"><i class="fa fa-server colorcard"></i> <span class="lang" key="">Lớp</span>: ' + edu.util.checkEmpty(data.LOPQUANLY_TEN) + '</p>';
            row += '<p class="pcard"><i class="fa fa-graduation-cap colorcard"></i> <span class="lang" key="">Tình trạng</span>: ' + edu.util.checkEmpty(data.TINHTRANG) + '</p>';
            row += '</div>';
            row += '</div>';

            row += '<div class="small-box-footer">';
            row += '<a id="' + data.ID + '" title="' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '" class="btn btn-primary btnAddHoSoDaoTao poiter"><i class="fa fa-plus"></i> Thêm hồ sơ</a>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneHoSo").html(row);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_Phong
    -------------------------------------------*/
    getList_ToaNha: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genCombo_ToaNha(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ToaNha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN"
            },
            renderPlace: ["dropHoSo_ToaNha", "dropSearchHoSo_ToaNha"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropHoSo_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

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
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Phong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.KTX_TOANHA_TEN + " - " + aData.TEN
                }
            },
            renderPlace: ["dropHoSo_Phong", "dropSearchHoSo_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB DangKy
    -------------------------------------------*/
    save_DangKy: function (strDoiTuongO_Id, strPhong_Id, strNgayVao, strNgayRa) {
        var me = main_doc.DangKyNguoiO;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DaXepPhong/ThemMoi',
            

            'strId': '',
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_Phong_Id': strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': strDoiTuongO_Id,
            'strNgayVao': strNgayVao,
            'strNgayRa': strNgayRa,
            'strKTX_DangKy_Id': "",
            'strKTX_HopDong_Id': "",
            'strMoTa': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Đăng ký thành công!</i>',
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.toggle_hopdong();
                    me.getList_DangKyPhong(data.Id);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    swithHopDongMoi: function () {
        var me = this;
        me.strHopDong_Id = '';
        $("#btnDangKy_Save").show();
        $(".btnHopDong_BaoCao").hide();
    },
    swithInHopDong: function () {
        $("#btnDangKy_Save").hide();
        $(".btnHopDong_BaoCao").show();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong
    --ULR: Modules
    -------------------------------------------*/
    save_HopDong: function () {
        var me = this;
        //get value to save
        var strKhoanThu = "";
        var arrKhoanThu = [];
        var arrMienGiam = [];

        var arrCS_SoLuong = [];
        var arrCS_HinhThuc = [];
        var strCS_SoLuong = "";
        var strCS_HinhThuc = "";

        var arrMG_PhanTram = [];
        var arrMG_HinhThuc = [];
        var strMG_PhanTram = "";
        var strMG_HinhThuc = "";

        for (var i = 0; i < me.dtKhoanThu.length; i++) {
            strKhoanThu = me.dtKhoanThu[i].ID;
            strCS_SoLuong = $("#txtCS_SoLuong" + strKhoanThu).val();
            strCS_HinhThuc = $("#dropCS_HinhThuc" + strKhoanThu).val();

            arrKhoanThu.push(strKhoanThu);
            arrCS_SoLuong.push(strCS_SoLuong);
            arrCS_HinhThuc.push(strCS_HinhThuc);
        }
        for (var i = 0; i < me.dtMienGiam.length; i++) {
            strKhoanThu = me.dtMienGiam[i].ID;
            strMG_PhanTram = $("#txtMG_PhanTram" + strKhoanThu).val();
            strMG_HinhThuc = $("#dropMG_HinhThuc" + strKhoanThu).val();
            arrMienGiam.push(strKhoanThu);
            arrMG_PhanTram.push(strMG_PhanTram);
            arrMG_HinhThuc.push(strMG_HinhThuc);
        }
        //--Edit
        var obj_save = {
            'action': 'KTX_HopDong/ThemMoi',
            

            'strId': "",
            'strSoHopDong': edu.util.getValById("txtHopDong_So"),
            'strNgayKyHopDong': edu.util.getValById("txtHopDong_NgayKy"),
            'strNgayKetThucHopDong': edu.util.getValById("txtHopDong_NgayKetThuc"),
            'strTinhTrang_Id': me.strTinhTrangHopDong_Id,
            'strKTX_Phong_Id': edu.util.getValById("dropHopDong_Phong"),
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strNgayVao': edu.util.getValById("txtHopDong_NgayVao"),
            'strNgayRa': edu.util.getValById("txtHopDong_NgayRa"),
            'dSoThang': edu.util.getValById("txtHopDong_SoThang"),
            'dTongTienThue': edu.util.getValById("txtHopDong_TongTien").replace(/,/g, ""),
            'dGiaThue_Thang': edu.util.getValById("txtHopDong_SoTien_Thang").replace(/,/g, ""),
            'dSoChoThue': edu.util.getValById("txtHopDong_SoChoThue"),
            'dBaoPhong': edu.util.getValById("dropHopDong_BaoPhong"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTaiChinh_CacKhoanThu_Id': me.strTaiChinh_CacKhoanThu_Id,
            'strHopDong_MG_PhanTrams': arrMG_PhanTram.toString().replace(/,/g, "#"),
            'strHopDong_MG_KhoanThu_Ids': arrMienGiam.toString().replace(/,/g, "#"),
            'strHopDong_MG_HinhThuc_Ids': arrMG_HinhThuc.toString().replace(/,/g, "#"),
            'strHopDong_CS_SoLuongs': arrCS_SoLuong.toString().replace(/,/g, "#"),
            'strHopDong_CS_KhoanThu_Ids': arrKhoanThu.toString().replace(/,/g, "#"),
            'strHopDong_CS_HinhThuc_Ids': arrCS_HinhThuc.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đăng ký thành công!");
                    if (data.Id != "") {
                        me.strHopDong_Id = data.Id;
                        me.swithInHopDong();
                    }
                }
                else {
                    edu.system.alert("KTX_HopDong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_HopDong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HopDong: function (strId) {
        var me = main_doc.DaCoHopDong;

        //view data --Edit
        var obj_detail = {
            'action': 'KTX_HopDong/LayChiTiet',
            
            'strId': strId
        }
        if (strId.length != 32) return;
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewDetail_HopDong(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                    
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    viewDetail_HopDong: function (data) {
        var me = main_doc.DaCoHopDong;
        me.strHopDong_Id = data.ID;
        me.strDoiTuong_PhongDK_id = data.KTX_PHONG_ID;
        me.strDoiTuongDangKy_id = data.KTX_DOITUONGOKYTUCXA_ID;
        edu.util.viewHTMLById("lblHopDong_NguoiDangKy", data.KTX_DOITUONGOKYTUCXA_HODEM + " " + data.KTX_DOITUONGOKYTUCXA_TEN);
        edu.util.viewHTMLById("lblHopDong_MaSo", data.KTX_DOITUONGOKYTUCXA_MASO);
        edu.util.viewHTMLById("lblHopDong_PhongDangKy", data.KTX_PHONG_TEN);
        edu.util.viewHTMLById("lblHopDong_ToaNhaDangKy", data.KTX_TOANHA_TEN);

        edu.util.viewValById("txtHopDong_So", data.SOHOPDONG);
        edu.util.viewValById("dropHopDong_TinhTrang", data.TINHTRANG_ID);
        edu.util.viewValById("txtHopDong_NgayKy", data.NGAYKYHOPDONG);
        edu.util.viewValById("txtHopDong_NgayKetThuc", data.NGAYKETTHUCHOPDONG);
        edu.util.viewValById("txtHopDong_TongTien", edu.util.formatCurrency(data.TONGTIENTHUE));
        edu.util.viewValById("dropHopDong_BaoPhong", data.BAOPHONG);
        edu.util.viewValById("txtHopDong_SoThang", data.SOTHANG);
        edu.util.viewValById("txtHopDong_SoTien_Thang", edu.util.formatCurrency(data.GIATHUE_THANG));
        edu.util.viewValById("txtHopDong_SoChoThue", data.SOCHOTHUE);
        edu.util.viewValById("txtHopDong_NgayVao", data.NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayRa", data.NGAYRA);
        edu.util.viewHTMLById("lblHopDong_ToaNha", data.KTX_TOANHA_TEN);
        edu.util.viewHTMLById("lblHopDong_Phong", data.KTX_PHONG_TEN);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DangKyPhong
    --ULR: Modules
    -------------------------------------------*/
    getList_DangKyPhong: function (strId)
    {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_DaXepPhong/LayChiTiet',
            'strId': strId,
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
                    me.viewDetail_DangKyPhong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DangKyPhong: function (data, iPager) {
        var me = main_doc.DangKyNguoiO;

        $("#lblDangKy_DoiTuong_SoLuong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDangKy_DoiTuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DangKyNguoiO.getList_DangKyPhong()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            orowid: {
                id: 'KTX_DOITUONGOKYTUCXA_ID',
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_MASO) + "</span><br />";
                        html += '<span> Phòng: ' + edu.util.returnEmpty(aData.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(aData.KTX_PHONG_TEN) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.KTX_DOITUONGOKYTUCXA_ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewDetail_DangKyPhong: function (data) {
        var me = main_doc.DangKyNguoiO;
        var strDoiTuong_Id = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_ID);
        var strDoiTuong_PhongDK_Id = edu.util.returnEmpty(data[0].KTX_PHONG_ID);
        var strDoiTuong_ToaNhaDK_Id = edu.util.returnEmpty(data[0].KTX_TOANHA_ID);
        var strDoiTuong_Ten = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_TEN);
        var strDoiTuong_MaSo = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_MASO);
        var strDoiTuong_PhongDK = edu.util.returnEmpty(data[0].KTX_PHONG_MA);
        var strDoiTuong_ToaNhaDK = edu.util.returnEmpty(data[0].KTX_TOANHA_MA);

        me.strDoiTuongDangKy_id = strDoiTuong_Id;
        me.strDoiTuong_PhongDK_id = strDoiTuong_PhongDK_Id;
        me.strDoiTuong_ToaNhaDK_id = strDoiTuong_ToaNhaDK_Id;

        edu.util.viewHTMLById("lblHopDong_NguoiDangKy", strDoiTuong_Ten);
        edu.util.viewHTMLById("lblHopDong_MaSo", strDoiTuong_MaSo);
        edu.util.viewValById("txtHopDong_NgayVao", data[0].NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayRa", data[0].NGAYRA);
        edu.util.viewValById("txtHopDong_NgayKy", data[0].NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayKetThuc", data[0].NGAYRA);
        edu.util.viewValById("dropHopDong_ToaNha", data[0].KTX_TOANHA_ID);
        edu.util.viewValById("dropHopDong_Phong", data[0].KTX_PHONG_ID);

    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong_TinhTien
    --ULR: Modules
    -------------------------------------------*/
    save_HopDong_TinhTien: function (dSoThang) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi',
            

            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strKTX_Phong_Id': edu.util.getValById("dropHopDong_Phong"),
            'dSoThang': dSoThang
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert("KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong
    --ULR: Modules
    -------------------------------------------*/
    getList_HinhThuc: function (data) {
        var me = main_doc.DangKyNguoiO;
        me.dtHinhThuc = data;
        me.getList_KhoanThu();
    },
    getList_KhoanThu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhomCacKhoanThu_Id': "",
            'strNguoiThucHien_Id': "",
            'strcanboquanly_id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    me.dtResult = [];
                    me.dtMienGiam = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    for (var i = 0; i < dtResult.length; i++) {
                        if (dtResult[i].NHOMCACKHOANTHU_MA == "KTX") {
                            me.dtKhoanThu.push(dtResult[i]);
                        } else {
                            if (dtResult[i].NHOMCACKHOANTHU_MA == "MienGiamKTX") {
                                me.dtMienGiam.push(dtResult[i]);
                                if (dtResult[i].MA == "KTXMG.TIENPHONG") me.strTaiChinh_CacKhoanThu_Id = dtResult[i].ID;
                            }
                        }
                    }
                    me.genTable_ChinhSach(me.dtKhoanThu, iPager);
                    me.genTable_MienGiam(me.dtMienGiam, iPager);
                }
                else {
                    edu.system.alert("TC_KhoanThu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TC_KhoanThu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChinhSach: function (data) {
        var me = main_doc.DangKyNguoiO;
        var arrVaiTro_Id = [];
        var html = "";
        var jsonForm = {
            strTable_Id: "tblHopDong_ChinhSach",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0],
                left: [1],
                fix: [0]
            },
            orowid: {
                id: 'ID',
                prefixId: 'rm_row'
            },
            addClass: [[1, "hopdong-soluong"], [2, "hopdong-hinhthucthu"]],
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = ""
                        html += '<input type="text" id="txtCS_SoLuong' + aData.ID + '" class="form-control" placeholder="Số lượng ưu đãi"/>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = ""
                        html += '<select id="dropCS_HinhThuc' + aData.ID + '" class="select-opt"></select>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        //5. create data danhmucvaitro and bind agaist
        var placeRender = "";
        for (var i = 0; i < data.length; i++) {
            placeRender = "dropCS_HinhThuc" + data[i].ID;
            me.genCombo_HinhThuc(placeRender);
        }
        me.genCombo_HinhThuc("dropMG_HinhThucMienGiam");
        $(".select-opt").select2();
    },
    genTable_MienGiam: function (data, iPager) {
        var me = main_doc.DangKyNguoiO;
        var arrVaiTro_Id = [];
        var html = "";
        var jsonForm = {
            strTable_Id: "tblHopDong_MienGiam",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0],
                left: [1],
                fix: [0]
            },
            orowid: {
                id: 'ID',
                prefixId: 'rm_row'
            },
            addClass: [[2, "hopdong-soluong"], [3, "hopdong-hinhthucthu"]],
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = ""
                        html += '<input type="text" id="txtMG_PhanTram' + aData.ID + '" class="form-control" placeholder="Phần trăm miễn giảm" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = ""
                        html += '<select id="dropMG_HinhThuc' + aData.ID + '" class="select-opt"></select>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        //5. create data danhmucvaitro and bind agaist
        var placeRender = "";
        for (var i = 0; i < data.length; i++) {
            placeRender = "dropMG_HinhThuc" + data[i].ID;
            me.genCombo_HinhThuc(placeRender);
        }
        $(".select-opt").select2();
    },

    genCombo_HinhThuc: function (placeRender) {
        var me = main_doc.DangKyNguoiO;
        var obj = {
            data: me.dtHinhThuc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: [placeRender],
            title: ""
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_Phong
    -------------------------------------------*/
    genCombo_Phong2: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.KTX_TOANHA_TEN + " - " + aData.TEN
                }
            },
            renderPlace: ["dropSearch_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_Phong2: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

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
                    me.genCombo_Phong2(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_Phong3: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropHoSo_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

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
                    me.genCombo_Phong3(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Phong3: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.KTX_TOANHA_TEN + " - " + aData.TEN
                }
            },
            renderPlace: ["dropHoSo_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },

}