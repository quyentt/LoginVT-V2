/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function KhoiTao() { };
KhoiTao.prototype = {
    dt_NO: [],
    strNguoiO_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $("#zoneKhoiTao_Action").delegate('.btnClose', 'click', function () {
            me.toggle_batdau();
            me.getList_NO();
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#addHoSoDaoTao").click(function () {
            me.toggle_hosodaotao();
        });
        $("#addHoSoKhac").click(function () {
            me.toggle_hosokhac();
        });
        /*------------------------------------------
        --Action: Chuyển phòng
        -------------------------------------------*/
        $("#btnHoSo_ChuyenPhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            me.popupChuyenPhong();
        });
        $("#btnSave_ChuyenPhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            var strPhongChuyenDen = edu.util.getValById("dropHS_PhongChuyenDen");
            if (!edu.util.checkValue(strPhongChuyenDen)) {
                obj = {
                    title: "",
                    content: '<i class="cl-warning">Vui lòng chọn phòng cần chuyển?!</i>',
                    code: ""
                };
                edu.system.alertOnModal(obj);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var strDaXepPhong_Id = $("#checkHS" + arrChecked_Id[i]).attr("name");
                if (edu.util.checkValue(strDaXepPhong_Id)) {
                    me.save_ChuyenPhong(strDaXepPhong_Id);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-warning">Đối tượng gặp lỗi. Vui lòng liên hệ admin?!</i>',
                        code: ""
                    };
                    edu.system.alertOnModal(obj);
                }
            }
        });
        /*------------------------------------------
        --Action: Gia hạn hợp đồng
        -------------------------------------------*/
        $("#btnHoSo_GiaHanHopDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.popupGiaHan();
        });
        $("#btnSave_GiaHan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            var dBaoPhong = 0;
            if ($('#chkBaoPhong').is(":checked")) dBaoPhong = 1;

            for (var i = 0; i < arrChecked_Id.length; i++) {
                var strPhongDaO_Id = edu.util.objGetDataInData(arrChecked_Id[i], me.dt_NO, "ID")[0].KTX_DANHSACHDAXEPPHONG_ID;
                if (edu.util.checkValue(strPhongDaO_Id)) {
                    me.save_GiaHanHopDong(strPhongDaO_Id, dBaoPhong);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-warning">Không tìm được đối tượng. Vui lòng liên hệ admin?!</i>',
                        code: "",
                        prePos: "#myModalGiaHan #notify"
                    };
                    edu.system.alertOnModal(obj);
                }
            }
        });
        /*------------------------------------------
        --Action: KyLuat
        -------------------------------------------*/
        $("#btnHoSo_KyLuat").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.popupKyLuat();
        });
        $("#btnSave_KyLuat").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần kỷ luật?");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var strDoiTuong_Id = arrChecked_Id[i];
                if (edu.util.checkValue(strDoiTuong_Id)) {
                    me.save_KyLuat(strDoiTuong_Id);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-warning">Lỗi tìm đối tượng. Vui lòng liên hệ admin?!</i>',
                        code: "",
                        prePos: "#myModalKyLuat #notify"
                    };
                    edu.system.alertOnModal(obj);
                }
            }
        });

        /*------------------------------------------
        --Action: Cham dut hop dong
        -------------------------------------------*/
        $("#btnHoSo_ChamDutHopDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.popupChamDutHopDong();
        });
        $("#btnSave_ChamDutHopDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần kỷ luật?");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var strDoiTuong_Id = arrChecked_Id[i];
                if (edu.util.checkValue(strDoiTuong_Id)) {

                    var strHopDong_Id = $("#checkHS" + strDoiTuong_Id).attr("hopdong_id");
                    me.save_ChamDutHopDong(strHopDong_Id);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-warning">Lỗi tìm đối tượng. Vui lòng liên hệ admin?!</i>',
                        code: "",
                        prePos: "#myModalKyLuat #notify"
                    };
                    edu.system.alertOnModal(obj);
                }
            }
        });
        /*------------------------------------------
        --Action: In hồ sơ
        -------------------------------------------*/
        $("#btnHoSo_InDanhSachNguoiO").click(function () {
            edu.system.report("DoiTuongOKyTucXa", "", function (addKeyValue) {
                addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_KhoiTao_TuKhoa"));
                addKeyValue("strTinhTrangHopDong_Id", edu.util.getValById("dropSearch_KhoiTao_TinhTrangHopDong"));
                addKeyValue("dBiKyLuat", edu.util.getValById("dropSearch_KhoiTao_KyLuat"));
                addKeyValue("strNgayVao_TuNgay", edu.util.getValById("txtSearch_KhoiTao_NgayVao_TuNgay"));
                addKeyValue("strNgayVao_DenNgay", edu.util.getValById("txtSearch_NgayVao_DenNgay"));
                addKeyValue("strNgayRa_TuNgay", edu.util.getValById("txtSearch_NgayRa_TuNgay"));
                addKeyValue("strNgayRa_DenNgay", edu.util.getValById("txtSearch_NgayRa_DenNgay"));
                addKeyValue("strKTX_ToaNha_Id", edu.util.getValById("dropSearchHoSo_ToaNha"));
                addKeyValue("strLopQuanLy_Id", "");
                addKeyValue("strKTX_Phong_Id", edu.util.getValById("dropSearchHoSo_Phong"));
                addKeyValue("strPhanLoaiDoiTuong_Id", edu.util.getValById("dropSearch_KhoiTao_LoaiDoiTuong"));
                addKeyValue("strKhoaDaoTao_Id", edu.util.getValById("dropSearch_KhoiTao_KhoaDT"));
                addKeyValue("dDoiTuongConDangOKTX", edu.util.getValById("dropSearch_TinhTrang"));
                addKeyValue("strGioiTinh_Id", edu.util.getValById("dropSearch_KhoiTao_GioiTinh"));
                addKeyValue("strTrinhDoDaoTao_Id", edu.util.getValById("dropSearch_KhoiTao_TDDT"));
                addKeyValue("strDienDaoTao_Id", edu.util.getValById("dropSearch_KhoiTao_DienDT"));
                addKeyValue("strNganhDaoTao_Id", edu.util.getValById("dropSearch_KhoiTao_NganhDT"));
                addKeyValue("strNgayKiemTra", edu.util.getValById("dropSearchHoSo_NgayKiemTra"));
                addKeyValue("strNamNhapHoc", edu.util.getValById("dropSearch_NamNhapHoc"));
            });
        });
        /*------------------------------------------
       --Discription: [1] Action HoSo NhanSu
       --Order: 
       -------------------------------------------*/
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Save', 'click', function () {
            me.save_NO();
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Rewrite', 'click', function () {
            me.rewrite();
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Update', 'click', function () {
            var valid = edu.util.validInputForm(me.arrValid_NO);
            if (valid) {
                me.CapNhat_NO();
            }
        });
        //$("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Delete', 'click', function () {
        //    edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
        //    $("#btnYes").click(function (e) {
        //        me.delete_NO();
        //    });
        //});
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Addnew', 'click', function () {
            me.rewrite();
            me.action_addnew();
            edu.util.setOne_BgRow("xx", "tblKhoiTao_NhanSu");
        });
        /*------------------------------------------
       --Discription: [2] Action HoSo NhanSu
       --Order: 
       -------------------------------------------*/
        $("#tblKhoiTao_NhanSu").delegate('.btnDetail', 'click', function (e) {
            me.rewrite();
            me.action_update();
            var strId = this.id;
            edu.util.viewHTMLById("lblForm_KhoiTao_NO", '<i class="fa fa-pencil"></i> Chỉnh sửa');
            me.strNguoiO_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNguoiO_Id, "tblKhoiTao_NhanSu");
            me.getDetail_NO(me.strNguoiO_Id);
            me.toggle_hosoedit();
        });
        $("#tblKhoiTao_NhanSu").delegate('.btnDetailKyLuat', 'click', function (e) {
            me.getList_KyLuat(this);
        });
        $("#tblKhoiTao_NhanSu").delegate('.btnDetailChuyenPhong', 'click', function (e) {
            me.getList_DaO(this);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_KhoiTao_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NO();
            }
        });
        $(".btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_NO();
        });
        $("[id$=chkSelectAll_NhanSu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoiTao_NhanSu" });
        });
        /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_KhoiTao_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        $("#dropSearch_KhoiTao_LoaiDoiTuong").on("select2:select", function () {
            me.getList_NO();
        });
        $("#dropSearchHoSo_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });
        /*------------------------------------------
        --Discription: [2] Action Ho So Dao Tao
        --Order:
        -------------------------------------------*/
        $("#txtSearch_DaoTao_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DTDT();
            }
        });
        $(".btnSearchDaoTao_Phong").click(function () {
            me.getList_DTDT();
        });
        $("#zoneHoSoDaoTao").delegate('.btnAddHoSoDaoTao', 'click', function () {
            edu.system.confirm('Bạn có chắc chắn thêm hồ sơ <i class="cl-danger">' + this.title + '</i> từ đào tạo không?');
            var strHoSo_Id = this.id;
            $("#btnYes").click(function (e) {
                me.save_DTDT(strHoSo_Id);
            });
        });
        $(".btnHopDong_BaoCao").click(function () {
            var strReportCode = this.name;
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiTao_NhanSu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var arrHopDongId = [];
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var strHopDong_Id = $("#checkHS" + arrChecked_Id[i]).attr("hopdong_id");
                if (edu.util.checkValue(strHopDong_Id)) {
                    arrHopDongId.push(strHopDong_Id);
                }
                
            }
            edu.system.report(strReportCode, "", function (addKeyValue) {
                addKeyValue("strHopDong_Id", arrHopDongId.toString());
            });
        });
    },
    page_load: function () {
        var me = main_doc.KhoiTao;
        edu.util.focus("txtSearch_KhoiTao_TuKhoa");
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
        me.getList_NO();
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTHD", "dropSearch_KhoiTao_TinhTrangHopDong");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.LOP", "dropNO_LopDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KHOADAOTAO", "dropNO_KhoaDaoTao,dropSearch_KhoiTao_KhoaDT");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropNO_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropNO_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUOCTICH", "dropNO_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropNO_LoaiDoiTuong,dropSearch_KhoiTao_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNO_GioiTinh,dropSearch_KhoiTao_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TRINHDO", "dropNO_TrinhDoDT,dropSearch_KhoiTao_TDDT");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.DIDT", "dropNO_DienDT,dropSearch_KhoiTao_DienDT");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.NGAN", "dropNO_NganhDT,dropSearch_KhoiTao_NganhDT");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KYLUAT.LOAIVYPHAM", "dropHS_LoaiViPham");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KYLUAT.HINHTHUCXULY", "dropHS_HinhThucXuLy");
        me.getList_ToaNha();
        me.getList_Phong();
        me.getList_ChuyenPhong();
        edu.system.uploadAvatar(['txtNO_Anh']);
        me.getList_NamNhapHoc();
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
    rewrite: function () {
        var me = main_doc.KhoiTao;
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
        edu.util.viewHTMLById("lblForm_KhoiTao_NO", '<i class="fa fa-pencil"></i> Thêm mới đối tượng ngoài đào tạo');
        var html = '';
        html += '<a id="btnKhoiTao_Rewrite" class="btn btn-default" style="margin:3px"><i class="fa fa-refresh"></i><span class="lang" key=""> Viết lại</span></a>';
        html += '<a class="btn btn-default btnClose" href="#" title = "Close"> <i class="fa fa-times"></i> Đóng</a>';
        html += '<a id="btnKhoiTao_Save" class="btn btn-success" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Tạo hợp đồng</span></a>';
        $("#zoneKhoiTao_Action").html(html);
        $("#zoneDangKyPhong").show();
    },
    action_update: function () {
        var html = '';
        //html += '<a id="btnKhoiTao_Delete" class="btn btn-default" style="margin:3px"><i class="fa fa-trash"></i><span class="lang" key=""> Xóa</span></a>';
        html += '<a class="btn btn-default btnClose" href="#" title = "Close"> <i class="fa fa-times"></i> Đóng</a>';
        html += '<a id="btnKhoiTao_Update" class="submit btn btn-primary" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Lưu</span></a>';
        $("#zoneKhoiTao_Action").html(html);
    },
    popupChuyenPhong: function () {
        $("#btnNotifyModal").remove();
        $("#myModalChuyenPhong").modal("show");
    },
    popupGiaHan: function () {
        $("#btnNotifyModal").remove();
        $("#myModalGiaHan").modal("show");
    },
    popupChamDutHopDong: function () {
        $("#btnNotifyModal").remove();
        $("#myModalChamDutHopDong").modal("show");
    },
    popupKyLuat: function () {
        $("#btnNotifyModal").remove();
        $("#myModalKyLuat").modal("show");
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    save_NO: function () {
        var me = main_doc.KhoiTao;
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa/ThemMoi',
            

            'strId': '',
            'strMaSo': edu.util.getValById('txtNO_MaSo'),
            'strHoDem': edu.util.getValById('txtNO_Ho'),
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
                    me.getList_NO();
                    var strDoiTuong_id = data.Id;
                    var strPhong_Id = edu.util.getValById("dropHoSo_Phong");
                    var strNgayVao = edu.util.getValById("txtHoSo_NgayVao");
                    var strNgayRa = edu.util.getValById("txtHoSo_NgayRa");
                    if (edu.util.checkValue(strDoiTuong_id) && edu.util.checkValue(strPhong_Id) && edu.util.checkValue(strNgayVao)) {
                        edu.system.confirm('Thêm hồ sơ thành công. Bạn có chắc chắn muốn xếp phòng không?');
                        var strHoSo_Id = this.id;
                        $("#btnYes").click(function (e) {
                            me.save_DangKy(strDoiTuong_id, strPhong_Id, strNgayVao, strNgayRa);
                        });
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
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
        var me = main_doc.KhoiTao;
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa/CapNhat',
            

            'strId': me.strNguoiO_Id,
            'strMaSo': edu.util.getValById('txtNO_MaSo'),
            'strHoDem': edu.util.getValById('txtNO_Ho'),
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
                        var strHoSo_Id = this.id;
                        $("#btnYes").click(function (e) {
                            me.save_DangKy(strDoiTuong_id, strPhong_Id, strNgayVao, strNgayRa);
                        });
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
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
            'strNgayKiemTra': edu.util.getValById("dropSearchHoSo_NgayKiemTra"),
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc'),
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
                    //if (dtResult.length == 0) {
                    //    edu.system.confirm('Không tìm thấy người ở. Bạn có muốn thêm từ đào tạo không?');
                    //    $("#btnYes").click(function (e) {
                    //        me.toggle_hosodaotao();
                    //        $("#txtSearch_DaoTao_TuKhoa").val(edu.util.getValById("txtSearch_KhoiTao_TuKhoa"));
                    //        me.getList_DTDT();
                    //    });
                    //}
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
        var me = main_doc.KhoiTao;

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
        var me = main_doc.KhoiTao;
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
                    me.getList_NO();
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
        var me = main_doc.KhoiTao;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoiTao.getList_NO()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
                    "mDataProp": "LOPQUANLY"
                }
                , {
                    "mDataProp": "DANTOC_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (aData.BIKYLUAT != "KHONGBI")
                            return '<span><a class="btn btn-default btnDetailKyLuat" id="' + aData.ID + '" title="Xem tất cả kỷ luật từ trước tới nay">Xem kỷ luật</span>';
                        else return "";
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetailChuyenPhong" id="' + aData.ID + '" title="Xem quá trình">Xem quá trình</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '" name="' + aData.KTX_DANHSACHDAXEPPHONG_ID + '" hopdong_id="' + aData.KTX_HOPDONG_ID + '">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    viewForm_NO: function (data) {
        var me = main_doc.KhoiTao;
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
            $("#btnKhoiTao_Update span").html("Cập nhật")
        }
        else {
            $("#zoneDangKyPhong").show();
            $("#btnKhoiTao_Update span").html("Cập nhật")
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
            'pageSize': 10
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
        var me = main_doc.KhoiTao;
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
                    me.getList_NO();
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
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearchHoSo_ToaNha"),
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
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    getList_ChuyenPhong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': "",
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
                    me.genCombo_ChuyenPhong(dtResult, iPager);
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
    genCombo_ChuyenPhong: function (data) {
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
            renderPlace: ["dropHS_PhongChuyenDen", "dropHS_GiaHan_PhongChuyenDen"],
            title: "Chọn phòng chuyển đến"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB DangKy
    -------------------------------------------*/
    save_DangKy: function (strDoiTuongO_Id, strPhong_Id, strNgayVao, strNgayRa) {
        var me = main_doc.KhoiTao;
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
                        code: "",
                    };
                    edu.system.afterComfirm(obj);
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

    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    save_ChuyenPhong: function (strKTX_DanhSachDaXepPhong_Id) {
        var me = main_doc.KhoiTao;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DaXepPhong/ChuyenPhongOKTX',

            'strNgayVao': edu.util.getValById("strHoSo_NgayChuyenPhong"),
            'strKTX_Phong_ChuyenDen_Id': edu.util.getValById("dropHS_PhongChuyenDen"),
            'strKTX_DanhSachDaXepPhong_Id': strKTX_DanhSachDaXepPhong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Chuyển phòng thành công!</i>',
                        code: "",
                        prePos: "#myModalChuyenPhong #notify"
                    };
                    $("#myModalChuyenPhong").modal('hide');
                    edu.system.alert("Chuyển phòng thành công!");
                    me.getList_NO();
                }
                else {
                    obj = {
                        type: "w",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                        prePos: "#myModalChuyenPhong #notify"
                    };
                    edu.system.alertOnModal(obj);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er.Message,
                    prePos: "#myModalChuyenPhong #notify"
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
    /*------------------------------------------
    --Discription: [1] AcessDB Gia hạn hợp đồng
    -------------------------------------------*/
    save_GiaHanHopDong: function (strKTX_DanhSachDaXepPhong_Id, dBaoPhong) {
        var me = main_doc.KhoiTao;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_GiaHanHopDong/GiaHanHopDong',

            'strNgayBatDau': edu.util.getValById("strHoSo_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("strHoSo_NgayGiaHan"),
            'strKTX_DanhSachDaXepPhong_Id': strKTX_DanhSachDaXepPhong_Id,
            'dBaoPhong': dBaoPhong,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKTX_ChuyenSangPhongMoi_Id': edu.util.getValById("dropHS_GiaHan_PhongChuyenDen"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Gia hạn thành công!</i>',
                        code: "",
                        prePos: "#myModalGiaHan #notify"
                    };
                    $("#myModalGiaHan").modal('hide');
                    edu.system.alert("Gia hạn thành công!");
                    //edu.system.alertOnModal(obj);
                }
                else {
                    obj = {
                        type: "w",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                        prePos: "#myModalGiaHan #notify"
                    };
                    edu.system.alertOnModal(obj);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er.Message,
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
    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    save_ChamDutHopDong: function (strHopDong_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_HopDong/ChamDutHopDong',

            'strNgayKetThucHopHong': edu.util.getValById("strHoSo_NgayKetThuc"),
            'strKTX_HopDong_Id': strHopDong_Id,
            'strLyDo': edu.util.getValById("strHoSo_LyDo"),
            'strMoTa': edu.util.getValById("strHoSo_MoTa"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Chấm dứt hợp đồng thành công!</i>',
                        code: "",
                        prePos: "#myModalChamDutHopDong #notify"
                    };
                    $("#myModalChamDutHopDong").modal('hide');
                    edu.system.alert("Chấm dứt hợp đồng thành công!");
                    //edu.system.alertOnModal(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                        code: "",
                        prePos: "#myModalChamDutHopDong #notify"
                    };
                    edu.system.alertOnModal(obj);
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

    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    save_KyLuat: function (strKTX_DoiTuongOKyTucXa_Id) {
        var me = main_doc.KhoiTao;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa_ViPham/ThemMoi',

            'strKTX_DoiTuongOKyTucXa_Id': strKTX_DoiTuongOKyTucXa_Id,
            'strHinhThucXuLy_Id': edu.util.getValById("dropHS_HinhThucXuLy"),
            'strLoaiViPham_Id': edu.util.getValById("dropHS_LoaiViPham"),
            'strMoTa': edu.util.getValById("strHoSo_MoTa"),
            'strNgayApDung': edu.util.getValById("strHoSo_NgayApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Lưu kỷ luật thành công!</i>',
                        code: "",
                        prePos: "#myModalKyLuat #notify"
                    };
                    $("#myModalKyLuat").modal('hide');
                    edu.system.alert("Lưu kỷ luật thành công!");
                    //edu.system.alertOnModal(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                        code: "",
                        prePos: "#myModalKyLuat #notify"
                    };
                    edu.system.alertOnModal(obj);
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
    getList_KyLuat: function (point) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongOKyTucXa_ViPham/LayDanhSach',
            

            'strTuKhoa': "",
            'strHinhThucXuLy_Id': '',
            'strLoaiViPham_Id': '',
            'strKTX_DoiTuongOKyTucXa_Id': point.id,
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
                    me.genList_KyLuat(dtResult, point);
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
    /*------------------------------------------
    --Discription: Gen Ky Luat
    --ULR: Modules
    -------------------------------------------*/
    genList_KyLuat: function (json, point) {
        var me = this;
        var row = "";
        row += '<div class="pcard" style="width: 600px !important; float: left; padding-left: 0px; margin-top: -7px; font-size: 11px"></td>';
        row += '<table class="table table-hover tablecenter">';
        row += '<thead>';
        row += '<tr >';
        row += '<th class="td-fixed">Stt</th>';
        row += '<th class="td-center" style="width: 170px"><span class="lang" key="">Loại vi phạm</span></th>';
        row += '<th class="td-center" style="width: 220px"><span class="lang" key="">Hình thức xử lý</span></th>';
        row += '<th class="td-left" style="width: 150px"><span class="lang" key="">Cán bộ tạo</span></th>';
        row += '<th class="td-right" style="width: 150px"><span class="lang" key="">Ngày tạo</span></th>';
        row += '</tr >';
        row += '</thead>';
        row += '<tbody>';
        for (var i = 0; i < json.length; i++) {

            row += '<tr>';
            row += '<td>' + (i + 1) + '</td>';
            row += '<td class="td-center">' + edu.util.returnEmpty(json[i].LOAIVIPHAM_TEN) + '</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].HINHTHUCXULY_TEN) + '</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].NGUOITHUCHIEN_TENDAYDU) + '</td>';
            row += '<td class="td-right">' + edu.util.returnEmpty(json[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            row += '</tr>';
        }
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'bottom',
        });
        $(point).popover('show');
    },

    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    getList_DaO: function (point) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_QuaTrinhOKTX/LayDanhSach',
            
            
            'strKTX_DoiTuongOKyTucXa_Id': point.id,
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
                    me.genList_DaO(dtResult, point);
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
    /*------------------------------------------
    --Discription: Gen ChuyenPhong
    --ULR: Modules
    -------------------------------------------*/
    genList_DaO: function (json, point) {
        var me = this;
        var row = "";
        row += '<div class="pcard" id="pcard' + point.id +'" style="width: 500px !important; float: left; padding-left: 0px; margin-top: -7px; font-size: 11px"></td>';
        row += '<table class="table table-hover tablecenter">';
        row += '<thead>';
        row += '<tr >';
        row += '<th class="td-fixed">Stt</th>';
        row += '<th class="td-center" style="width: 120px"><span class="lang" key="">Phòng</span></th>';
        row += '<th class="td-center" style="width: 120px"><span class="lang" key="">Ngày vào</span></th>';
        row += '<th class="td-left" style="width: 120px"><span class="lang" key="">Ngày ra</span></th>';
        row += '<th class="td-right" style="width: 120px"><span class="lang" key="">Cán bộ tạo</span></th>';
        row += '</tr >';
        row += '</thead>';
        row += '<tbody>';
        for (var i = 0; i < json.length; i++) {

            row += '<tr>';
            row += '<td>' + (i + 1) + '</td>';
            row += '<td class="td-center">' + edu.util.returnEmpty(json[i].KTX_TOANHA_TEN) + ' - ' + edu.util.returnEmpty(json[i].KTX_PHONG_TEN) +'</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].NGAYVAO) + '</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].NGAYRA) + '</td>';
            row += '<td class="td-right">' + edu.util.returnEmpty(json[i].NGUOITHUCHIEN_TENDAYDU) + '</td>';
            row += '</tr>';
        }
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'bottom',
        });
        $(point).popover('show');
        setTimeout(function () {
            $(point).popover('destroy')
        }, 10000);
    },

    /*------------------------------------------
    --Discription: Gen ChuyenPhong
    --ULR: Modules
    -------------------------------------------*/

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
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
}