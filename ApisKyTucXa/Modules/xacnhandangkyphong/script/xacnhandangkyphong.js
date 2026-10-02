
function XacNhanDangKy() { };
XacNhanDangKy.prototype = {
    Id: '',
    dtToaNha: [],
    dtPhong: [],
    strPhong_Id: '',
    strPhong_Ten: '',
    arrSinhVien_Id: [],
    dtDoiTuongDangKy: [],
    strNguoiO_Id: '',
    strDoiTuongDangKy_id: "",
    strDoiTuong_PhongDK_id: "",
    dtKhoanThu: [],
    dtHinhThuc: [],
    dtMienGiam: [],
    strTaiChinh_CacKhoanThu_Id: '',
    strHopDong_Id: '',
    bFullPhong: true,

    strMaTinhChatPhong: '',
    strTinhTrangHopDong: '',

    init: function () {
        var me = this;
        me.page_load();

        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_toanha();
        });

        $(".btnCloseSelectNguoiO").click(function () {
            me.toggle_phong_dadangky();
        });
        $("#zoneBox_ToaNha").delegate(".btnView", "click", function () {
            var strId = this.id;
            strToaNha_Id = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_phong();
                edu.util.objGetDataInData(strToaNha_Id, me.dtToaNha, "ID", me.getList_PhongDangKy);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            me.getList_Phong();
        });
        $("#zoneBox_ThongTinDangKy").delegate(".btnView", "click", function () {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_phong();
                edu.util.objGetDataInData(strToaNha_Id, me.dtToaNha, "ID", me.getList_PhongDangKy);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_ToaNha").delegate(".btnViewAll", "click", function () {
            var strId = this.id;
            me.getList_TimPhong();
            me.toggle_phong();
        });
        /*------------------------------------------
        --Action: DangKy phong
        -------------------------------------------*/
        $("#zoneDangKy_Phong").delegate(".box-room", "mouseenter", function () {
            var strPhong_Ma = this.id;
            $("#view_phong" + strPhong_Ma).addClass("hide");
            $("#select_phong" + strPhong_Ma).removeClass("hide");
        });
        $("#zoneDangKy_Phong").delegate(".box-room", "mouseleave", function () {
            var strPhong_Ma = this.id;
            $("#view_phong" + strPhong_Ma).removeClass("hide");
            $("#select_phong" + strPhong_Ma).addClass("hide");
        });
        $("#zoneDangKy_Phong").delegate(".btnRegister", "click", function () {
            var strId = this.id;
            me.strPhong_Id = strId;
            strPhong_Id = edu.util.cutPrefixId(/register/g, strId);
            if (edu.util.checkValue(strPhong_Id)) {
                me.getDetail_PhongDangKy(strPhong_Id);
                me.toggle_phongdangky();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnAddNew_NguoiO").click(function () {
            me.toggle_phong_dangkynguoio();
            edu.extend.genModal_NguoiO();
            edu.extend.getList_NguoiO("SEARCH");
        });
        $("#selectnguoio").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            var strHoTen = this.title;
            me.addHTMLinto_tblSinhVien(strNhanSu_Id, strHoTen);
        });

        $("#selectnguoio").delegate('.btnSelectDT', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            var strHoTen = this.title;
            edu.extend.save_DTDT(strNhanSu_Id);
            me.addHTMLinto_tblSinhVien(strNhanSu_Id, strHoTen);
        });
        $("#selectnguoio").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblSinhVien(strNhanSu_Id);
        });
        $("#selectnguoio").delegate('.btnDelete', 'click', function () {
            var strNhanSu_Id = this.id;
            //var strNhanSu_Id = edu.util.cutPrefixId(/delete_tcqt_SinhVien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#dadangky").delegate('.btnEditHoSoNguoiO', 'click', function () {
            var strNguoiO_Id = this.id;
            //var strNguoiO_Ten = this.title;
            me.strNguoiO_Id = strNguoiO_Id;
            me.toggle_phong_edithosonguoio();
            me.getDetail_NO(strNguoiO_Id);
        });
        $("#dadangky").delegate('.btnEditHopDong', 'click', function () {
            var strNguoiO_Id = this.id;
            var strNguoiO_Ten = this.title;
            me.toggle_phong_edithopdongnguoio();
            edu.util.objGetDataInData(strNguoiO_Id, me.dtDoiTuongDangKy, "KTX_DOITUONGOKYTUCXA_ID", me.viewDetail_DangKyPhong);
        });
        $("#dadangky").delegate('.btnAcceptNguoiO ', 'click', function () {
            var strId = this.id;
            var strNguoiO_Id = $(this).attr("name");
            var confirm = 'Bạn có chắc chắn muốn xếp vào phòng không?';

            edu.system.confirm(confirm, "q");
            $("#btnYes").click(function (e) {
                //me.save_DangKy(strNguoiO_Id);
                me.delete_DangKy(strId, strNguoiO_Id);
            });
        });

        $("#btnSearchDangKy_Phong").click(function () {
            me.getList_ToaNhaDangKy();
            me.toggle_toanha();
        });
        $("#txtSearch_DangKy_Phong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.toggle_phong();
                me.getList_TimPhong();
            }
        });
        $("#btnKhoiTao_Update").click(function () {
            me.CapNhat_NO();
        });
        /*------------------------------------------
        --Discription: [2] Action Hop dong
        --Order:
        -------------------------------------------*/
        $("#btnDangKy_Save").click(function () {
            me.save_HopDong();
        });
        /*------------------------------------------
        --Discription: [2] Action Report
        --Order:
        -------------------------------------------*/
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
        $("#edithopdong").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        // Tính tiền
        $("#btnXepPhongDangKy_TinhTien").click(function () {
            var dSoThang = edu.util.getValById("txtHopDong_SoThang");
            me.save_HopDong_TinhTien(dSoThang);
        });
        $("#txtHopDong_NgayKy").blur(function () {
            edu.util.viewValById("txtHopDong_NgayVao", edu.util.getValById("txtHopDong_NgayKy"));
        })
        $("#txtHopDong_NgayKetThuc").blur(function () {
            edu.util.viewValById("txtHopDong_NgayRa", edu.util.getValById("txtHopDong_NgayKetThuc"));
        })
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTHD", "", "", me.loadHopDong);
        me.toggle_toanha();
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropSearch_DangKy_Phong_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.LOP", "dropNO_LopDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KHOADAOTAO", "dropNO_KhoaDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropNO_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropNO_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUOCTICH", "dropNO_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropNO_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.TCP0, "dropSearch_DangKy_Phong_TinhChat");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LP00, "dropSearch_DangKy_Phong_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNO_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TRINHDO", "dropNO_TrinhDoDT");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.DIDT", "dropNO_DienDT");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.NGAN", "dropNO_NganhDT");
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.KTX.DVT0,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.getList_HinhThuc);

        me.getList_ToaNhaDangKy();
    },

    toggle_phongdangky: function () {
        edu.util.toggle_overide("zone-dangky", "zoneNguoiO");
    },
    toggle_toanha: function () {
        edu.util.toggle_overide("zone-dangky", "zone_dangky_toanha");
    },
    toggle_phong: function () {
        edu.util.toggle_overide("zone-dangky", "zone_dangky_phong");
    },
    toggle_phong_dadangky: function () {
        edu.util.toggle_overide("zone-nguoio", "dadangky");
    },
    toggle_phong_dangkynguoio: function () {
        edu.util.toggle_overide("zone-nguoio", "selectnguoio");
    },
    toggle_phong_edithosonguoio: function () {
        edu.util.toggle_overide("zone-nguoio", "edithoso");
    },
    toggle_phong_edithopdongnguoio: function () {
        edu.util.toggle_overide("zone-nguoio", "edithopdong");
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
    /*----------------------------------------------
    --Date of created: 
    --Discription:
    ----------------------------------------------*/
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
                    me.dtToaNha = dtResult;
                    me.getList_Phong();
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
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
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
                    me.dtPhong = dtResult;
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
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
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    addHTMLinto_tblSinhVien: function (strNhanSu_Id, strHoTen) {
        var me = main_doc.XacNhanDangKy;
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
        }
        //Cảnh bảo người dùng
        var strCanhBao = '';
        if (this.bFullPhong) strCanhBao += '- Số người trong tròng đã full.<br/>';
        if (this.strMaTinhChatPhong != -1 && $("#slnhansu" + strNhanSu_Id).attr("name") != this.strMaTinhChatPhong) strCanhBao += '- Giới tính không phù hợp.<br/>';
        if (strCanhBao != '') {
            strCanhBao = '<div class="cl-warning">Cảnh báo: ' + strCanhBao;
            strCanhBao += '</div>';

            strCanhBao += '<div class="clear"></div>';
        }
        var confirm = strCanhBao + 'Bạn có chắc chắn muốn thêm <i class="cl-danger">' + strHoTen + '</i> vào đăng ký phòng <i class="cl-danger">' + me.strPhong_Ten + '</i> không?';
        confirm += '<div class="clear"></div>';
        confirm += '<table>';
        confirm += '<tbody>';
        confirm += '<tr>';
        confirm += '<td>Ngày vào KTX:</td>';
        confirm += '<td>  <input id="txtNgayVao" class="form-control input-datepicker"  placeholder="dd/mm/yyyy"/> </td>';
        confirm += '<td>Ngày ra KTX:</td>';
        confirm += '<td>  <input id="txtNgayRa" class="form-control input-datepicker" placeholder="dd/mm/yyyy"/> </td>';
        confirm += '</tr>';
        confirm += '</tbody>';
        confirm += '</table>';
        confirm += '<div class="clear"></div>';
        confirm += '<i>*Chú ý: Ngày vào KTX là bắt buộc</i>';
        confirm += '<div class="clear"></div>';
        edu.system.confirm(confirm, "q");
        $("#txtNgayVao,#txtNgayRa").attr("placeholder", "dd/mm/yyyy");
        $("#btnYes").click(function (e) {
            var strNgayVao = $("#txtNgayVao").val();
            var strNgayRa = $("#txtNgayRa").val();
            if (strNgayVao == "") {
                e.stopImmediatePropagation();
                $("#lblConfirmContent").html('<i class="cl-danger">Vui lòng nhập ngày vào!</i>');
                return;
            } else {
                console.log(edu.util.dateCompare(strNgayRa, edu.util.dateToday()));
                if (edu.util.dateCompare(strNgayVao, edu.util.dateToday()) == 1) {
                    $("#lblConfirmContent").html('<i class="cl-danger">Ngày vào phải nhỏ hơn hoặc bằng ngày hiện tại!</i>');
                    return;
                }
                else if (strNgayRa != "" && edu.util.dateCompare(strNgayRa, edu.util.dateToday()) == -1) {
                    $("#lblConfirmContent").html('<i class="cl-danger">Ngày ra phải lớn hơn ngày hiện tại!</i>');
                    return;
                }
            }
            me.arrSinhVien_Id.push(strNhanSu_Id);
        });
    },
    removeHTMLoff_tblSinhVien: function (strNhanSu_Id) {
        var me = main_doc.DeTaiSinhVien;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length == 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> ToaNhaPhanCongDangKy
    --Author: 
	-------------------------------------------*/
    getList_ToaNhaDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_DangKy_Phong_LoaiDoiTuong"),
            'strTangThu_Id': "",
            'strLoaiPhong_Id': edu.util.getValById("dropSearch_DangKy_Phong_Loai"),
            'strTinhChat_Id': edu.util.getValById("dropSearch_DangKy_Phong_TinhChat"),
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
                    me.dtToaNha = dtResult;
                    me.genBox_ToaNhaDangKy(dtResult, iPager);
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
    genBox_ToaNhaDangKy: function (data, iPager) {
        var me = this;
        var html = '';
        var strToaNha_Id = "";
        var strToaNha_Ten = "";
        var iToaNha_SoPhong = 0;
        var iToaNha_SoPhongConTrong = 0;
        var iToaNha_SoChoTrong = 0;
        var iTongSoToaNha = 0;
        var iTongSoPhong = 0;
        var iSoSVCHoXacNhan = 130;
        var iTongSoChoTrong = 0;

        html = '';
        $("#zoneBox_ToaNha").html(html);
        for (var i = 0; i < data.length; i++) {
            console.log(i);
            strToaNha_Id = edu.util.returnEmpty(data[i].ID);
            if (strToaNha_Id == "") continue;
            console.log(i);
            strToaNha_Ten = edu.util.returnEmpty(data[i].TEN);
            iToaNha_SoPhong = edu.util.returnEmpty(data[i].TONGSOPHONG);
            iToaNha_SoPhongConTrong = edu.util.returnEmpty(data[i].SOPHONGTRONG);
            iToaNha_SoChoTrong = edu.util.returnEmpty(data[i].TONGSOCHOTRONG);
            iTongSoToaNha += 1;
            iTongSoPhong += iToaNha_SoPhong;
            //iTongSoPhongConTrong += iToaNha_SoPhongConTrong;
            iTongSoChoTrong += iToaNha_SoChoTrong;


            html += '<div class="col-sm-3 col-xs-6 poiter btnView" id="view_' + strToaNha_Id + '">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<h4>' + strToaNha_Ten + '</h4>';
            html += '<p>Số phòng: ' + iToaNha_SoPhong + '</p>';
            //html += '<p>Số SV chờ xếp phòng: ' + iSoSVCHoXacNhan + '</p>';
            //html += '<p>Số chỗ trống: ' + iToaNha_SoChoTrong + '</p>';
            html += '</div>';
            html += '<div class="icon">';
            html += '<i class="fa fa-building cl-rosybrown"></i>';
            html += '</div>';
            html += '<div class="small-box-footer">';
            html += '<a class="cl-active">Xem phòng</a>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        var row = "";
        row += '<div class="clear"></div>';
        row += '<div class="box-header with-border">';
        row += '<div class="col-sm-3 col-xs-6 poiter btnViewAll" >';
        row += '<div class="small-box">';
        row += '<div class="inner">';
        row += '<p>Tổng số tòa nhà: ' + iTongSoToaNha + '</p>';
        row += '<p>Tổng số phòng: ' + iTongSoPhong + '</p>';
        html += '<p>Số SV chờ xếp phòng: ' + iSoSVCHoXacNhan + '</p>';
        //row += '<p>Tổng số chỗ trống: ' + iTongSoChoTrong + '</p>';
        row += '</div>';
        row += '<div class="small-box-footer">';
        row += '<a class="cl-active">Xem tất cả phòng</a>';
        row += '</div>';
        row += '</div>';
        row += '</div>';
        row += '</div>';
        row += html;
        //html += '<div class="icon">';
        //html += '<i class="fa fa-building cl-rosybrown"></i>';
        //html += '</div>';
        $("#zoneBox_ToaNha").html(row);

    },
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> PhanCongPhongDangKy
    --Author: 
	-------------------------------------------*/
    getList_PhongDangKy: function (dtToaNha) {
        var me = main_doc.XacNhanDangKy;

        var strToaNha_Id = dtToaNha[0].ID;
        var strToaNha_Tang = dtToaNha[0].SOTANG;
        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': '',
            'strPhanLoaiDoiTuong_Id': '',
            'strKTX_ToaNha_Id': strToaNha_Id,
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
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
                    me.dtPhong = dtResult;
                    me.genBox_PhongDangKy(strToaNha_Tang, dtResult, iPager);
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
    getList_TimPhong: function () {
        var me = main_doc.XacNhanDangKy;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DangKy_Phong_TuKhoa"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_DangKy_Phong_LoaiDoiTuong"),
            'strKTX_ToaNha_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': edu.util.getValById("dropSearch_DangKy_Phong_Loai"),
            'strTinhChat_Id': edu.util.getValById("dropSearch_DangKy_Phong_TinhChat"),
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
                    me.dtPhong = dtResult;
                    var strTangSo = 0;
                    for (var i = 0; i < dtResult.length; i++) {
                        var x = dtResult[i].TANGTHU_TEN;
                        if (!edu.util.intValid(x)) continue;
                        x = parseInt(x);
                        if (strTangSo < x) strTangSo = x;
                    }
                    me.genBox_PhongDangKy(strTangSo, dtResult, dtResult.length);
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
    getDetail_PhongDangKy: function (strPhong_Id) {
        var me = main_doc.XacNhanDangKy;
        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayChiTiet',
            

            'strId': strPhong_Id,
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
                    me.genPhongO(dtResult);
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
    confirm_Register: function (data) {
        var me = main_doc.XacNhanDangKy;
        var strPhong_Ma = data[0].MA;
        var strPhong_Id = data[0].ID;
        edu.system.confirm('Bạn có chắc chắn muốn đăng ký phòng <i class="cl-danger">' + strPhong_Ma + '</i> không?', "q");
        $("#btnYes").click(function (e) {
            me.save_DangKy(strPhong_Id);
        });
    },
    confirm_Cancel: function (data) {
        var me = main_doc.XacNhanDangKy;
        var strPhongDaDangKy_Id = data[0].ID;
        edu.system.confirm('Bạn có chắc chắn muốn hủy phòng không?', "q");
        $("#btnYes").click(function (e) {
            me.delete_DangKy(strPhongDaDangKy_Id);
        });
    },
    genBox_PhongDangKy: function (strSoTang, dtPhong, iSoPhong, strToaNha) {
        var me = this;
        var html = '';
        var html_total = '';
        $("#lblDangKy_Phong_Tong").html(iSoPhong);
        $("#zoneDangKy_Phong").html(html);
        //gen
        console.log(strSoTang);
        for (var f = 1; f <= strSoTang; f++) {
            html = '';
            html += '<div class="row">';

            html += '<div class="pull-left box-floor">';
            html += '<a class="poiter" >';
            html += '<div class="floor">';
            html += '<span>Tầng ' + f + '</span>';
            html += '<div class="clear"> </div>';
            //html += '<span>Trống ' + iSoChoConTrong + '</span> chỗ:';
            //html += '<div class="clear"> </div>';
            //html += '<span>Trống ' + iSoPhongConTrong + '</span> phòng:';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            for (var r = 0; r < dtPhong.length; r++) {
                if (dtPhong[r].TANGTHU_TEN == f) {
                    var strClassTinhChat = "fa-street-view";
                    switch (dtPhong[r].TINHCHAT_TEN) {
                        case "Nam": strClassTinhChat = "fa-male"; break;
                        case "Nữ": strClassTinhChat = "fa-female"; break;
                    }
                    if (dtPhong[r].SONGUOIDANGOPHONG >= dtPhong[r].SOSINHVIENTOIDA) {
                        html += '<div id="' + dtPhong[r].ID + '" class="pull-left box-room btnRegister" style="color:red">';

                        html += '<a id="' + dtPhong[r].ID + '" class="poiter">';
                        html += '<div class="room bg-default" style="color:red">';
                        html += '<i class="fa fa-building-o"> ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                        html += '<i class="fa ' + strClassTinhChat + '" style="color:red"> ' + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + ' </i>';
                        html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng"; '</p>';
                        html += '</div>';
                        html += '</a>';

                        html += '<a id="' + dtPhong[r].ID + '" class="poiter hide">';
                        html += '<div class="room bg-default" style="color:red">';
                        html += '<i class="fa fa-building-o"> ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                        html += '<i class="fa ' + strClassTinhChat + '" style="color:red"> ' + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + '</i>';
                        html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng"; '</p>';
                        html += '</div>';
                        html += '</a>';
                        html += '</div>';
                    }
                    else {
                        html += '<div id="' + dtPhong[r].ID + '" class="pull-left box-room btnRegister">';

                        html += '<a id="view_phong' + dtPhong[r].ID + '" class="poiter">';
                        html += '<div class="room bg-default">';
                        html += '<i class="fa fa-building-o"> ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                        html += '<i class="fa ' + strClassTinhChat + '" > ' + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + ' </i>';
                        html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng"; '</p>';
                        html += '</div>';
                        html += '</a>';

                        html += '<a id="select_phong' + dtPhong[r].ID + '" class="poiter hide">';
                        html += '<div class="room bg-default" >';
                        html += '<i class="fa fa-building-o"> ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                        html += '<i class="fa ' + strClassTinhChat + '" > ' + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + '</i>';
                        html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng"; '</p>';
                        html += '</div>';
                        html += '</a>';

                        html += '</div>';
                    }
                }
            }
            html += '</div>';
            html_total += html;
        }
        //bind
        $("#zoneDangKy_Phong").html(html_total);
    },

    /*------------------------------------------
    --Discription: [2]  AcessDB and GenHTML ==> Phong O
    --Author: 
    -------------------------------------------*/
    genPhongO: function (data) {
        var me = main_doc.XacNhanDangKy;
        if (data.length == 0) return;
       // me.strPhong_Id = data[0].ID;
        me.strPhong_Ten = data[0].TEN;
        me.strToaNha_Id = data[0].ID;
        me.strToaNha_Ten = data[0].TEN;
        edu.util.viewHTMLById("lblToaNha", data[0].KTX_TOANHA_TEN);
        edu.util.viewHTMLById("lblTenPhong", data[0].KTX_TOANHA_TEN + " - " + data[0].TEN);
        edu.util.viewHTMLById("lblTinhChat", data[0].TINHCHAT_TEN);
        edu.util.viewHTMLById("lblSoNguoiDangO", data[0].SONGUOIDANGOPHONG + "/" + data[0].SOSINHVIENTOIDA);
        edu.util.viewHTMLById("lblSoDienGanNhat", data[0].CHISODIENCUOICUNG);
        edu.util.viewHTMLById("lblSoNuocGanNhat", data[0].CHISONUOCCUOICUNG);
        edu.util.viewHTMLById("lblNgaySoDienGanNhat", data[0].NGAYCHISODIENCUOICUNG);
        edu.util.viewHTMLById("lblNgaySoNuocGanNhat", data[0].NGAYCHISONUOCCUOICUNG);
        edu.util.viewHTMLById("lblLoaiPhongO", data[0].LOAIPHONG_TEN);
        edu.util.viewHTMLById("lblDienTichSuDung", data[0].DIENTICHSUDUNG);
        edu.util.viewHTMLById("lblTangThu", data[0].TANGTHU_TEN);
        edu.util.viewHTMLById("lblSoGiuong", data[0].SOGIUONG);
        edu.util.viewHTMLById("lblTinhTrangPhongO", data[0].TINHTRANG_TEN);
        edu.util.viewHTMLById("lblBaoPhong", data[0].BAOPHONG);
        edu.util.viewHTMLById("lblDonGiaCaPhong", data[0].DONGIACAPHONG);
        edu.util.viewHTMLById("lblDonGiaPhongTungNguoi", data[0].DONGIATUNGNGUOI);
        me.genSoLuongNguoi(data[0].SONGUOIDANGOPHONG, data[0].SOSINHVIENTOIDA);
        me.strMaTinhChatPhong = data[0].TINHCHAT_MA;
        me.getList_DangKy();
    },
    genSoLuongNguoi: function (iSoNguoiDangO, iTongSo) {
        var me = this;
        //Check xem phòng đã full chưa
        if (iSoNguoiDangO < iTongSo) this.bFullPhong = false;
        else this.bFullPhong = true;
        $("#txtSoNguoiDangO").html('<input type="text" class="knob" value="' + (iSoNguoiDangO * 100 / iTongSo) + '" data-width="50" data-height="50" data-fgColor="#3c8dbc">');

        $(".knob").knob({
            draw: function () {

                // "tron" case
                if (this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = true;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
        $("#txtSoNguoiDangO input").replaceWith('<label type="text" class="knob" value="80%" data-width="50" data-height="50" data-fgcolor="#3c8dbc" style="width: 29px; height: 16px; position: absolute; vertical-align: middle; margin-top: 16px; margin-left: -39px; border: 0px none; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; font: bold 10px Arial; text-align: center; color: rgb(60, 141, 188); padding: 0px; -moz-appearance: none; font-size: 14px">' + iSoNguoiDangO + '/' + iTongSo + '</label >');
    },
    /*------------------------------------------
    --Discription: [1] AcessDB DangKy
    -------------------------------------------*/
    save_DangKy: function (strDoiTuongO_Id) {
        var me = main_doc.XacNhanDangKy;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DaXepPhong/ThemMoi',
            

            'strId': '',
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': strDoiTuongO_Id,
            'strNgayVao': edu.util.dateToday(),
            'strNgayRa': "",
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
                    me.getDetail_PhongDangKy(me.strPhong_Id);
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
    getList_DangKy: function () {
        var me = main_doc.XacNhanDangKy;
        //--Edit
        
        var obj_list = {
            'action': 'KTX_DangKyPhong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_Phong_Id': "",
            'strKTX_DoiTuongOKyTucXa_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
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
                    me.genList_DangKy(dtResult, iPager);
                    me.dtDoiTuongDangKy = dtResult;
                }
                else {
                    edu.system.alert("KTX_DangKyPhong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_DangKyPhong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_DangKy: function (Ids, strNguoiO_Id) {
        var me = main_doc.XacNhanDangKy;
        //--Edit
        var obj_delete = {
            'action': 'KTX_DangKyPhong/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xếp phòng thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.save_DangKy(strNguoiO_Id);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1]  GenHTML ==> DangKy
    --Author: 
	-------------------------------------------*/
    viewForm_DangKy: function (data) {
        var me = main_doc.XacNhanDangKy;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropDangKy_KhoanThu", data.DangKy_ID);
        edu.util.viewValById("txtDangKy_NgayApDung", data.NAMPHONGDangKy);
        edu.util.viewValById("dropDangKy_DonViTinh", data.NOIPHONGDangKy);
        edu.util.viewValById("txtDangKy_DonGia", data.THUTU);
        edu.util.viewValById("dropDangKy_LuyKe", data.MOTA);
    },
    genList_DangKy: function (json, iPager) {
        var me = this;
        var row = "";
        if (json.length == 0) return;
        for (var i = 0; i < json.length; i++) {
            var data = json[i];
            row += '<div class="col-sm-6">';
            row += '<div class="box-mini" style="height: 160px;">';
            row += '<div style="width: 160px; float: left">';
            row += '<img style="margin: 0 auto; display: block; height: 150px" src="' + edu.system.getRootPathImg(data.ANH) + '">';
            row += '</div>';
            row += '<div style="width: 280px; float: left; padding-left: 3px; margin-top: -7px">';
            row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.NGUOITHUCHIEN_ID) + '</p>';
            row += '<p class="pcard"><i class="fa fa-users colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.NGUOITHUCHIEN_TENDAYDU) +  '</p>';
            //row += '<p class="pcard"><i class="fa fa-users colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_TEN) + '</p>';
            //row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_NGAYSINH) + '</p>';
            //row += '<p class="pcard"><i class="fa fa-sign-in colorcard"></i> <span class="lang" key="">Ngày vào</span>: ' + edu.util.checkEmpty(data.NGAYVAO) + '</p>';
            //row += '<p class="pcard"><i class="fa fa-sign-out colorcard"></i> <span class="lang" key="">Ngày ra</span>: ' + edu.util.checkEmpty(data.NGAYRA) + '</p>';
            row += '<p class="pcard"><i class="fa fa-mobile colorcard"></i> <span class="lang" key="">Điện thoại</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_DIENTHOAI) + '</p>';
            row += '</div>';
            row += '</div>';

            row += '<div class="small-box-footer">';
            row += '<a id="' + data.ID + '" name="' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_ID)+'" title="' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_TEN) + '" class="btn btn btn-primary btnAcceptNguoiO  poiter pull-right" style="margin-right: 6px"><i class="fa fa-plus"></i> Xác nhận</a>';
            row += '<a id="' + data.KTX_DOITUONGOKYTUCXA_ID + '" title="' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_TEN) + '" class="btn btn-default btnEditHoSoNguoiO poiter"><i class="fa fa-universal-access"></i> Sửa hồ sơ</a>';
            if (!edu.util.checkValue(data.KTX_HOPDONG_ID))
                row += '<a id="' + data.KTX_DOITUONGOKYTUCXA_ID + '" title="' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_TEN) + '" class="btn btn-default btnEditHopDong poiter"><i class="fa fa-pencil"></i> Tạo hợp đồng</a>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneHoSo").html(row);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSo
    -------------------------------------------*/
    CapNhat_NO: function () {
        var me = main_doc.XacNhanDangKy;
        var obj_save = {
            'action': 'KTX_DoiTuongOKyTucXa/CapNhat',
            

            'strId': me.strNguoiO_Id,
            'strAnh': edu.util.getValById('txtNO_Anh'),
            'strHoDem': edu.util.getValById('txtNO_Ho'),
            'strTen': edu.util.getValById('txtNO_Ten'),
            'strNgaySinh': edu.util.getValById('txtNO_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNO_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNO_NamSinh'),
            'strEmail_CaNhan': edu.util.getValById('txtNO_Email'),
            'strSDT_CaNhan': edu.util.getValById('txtNO_DienThoaiCaNhan'),
            'strGioiTinh_Id': edu.util.getValById('dropNO_GioiTinh'),
            'strMaSo': edu.util.getValById('txtNO_MaSo'),
            'strCanCuoc_So': edu.util.getValById('txtNO_SoCanCuoc'),
            'strDiaChiLienHe': edu.util.getValById('txtNO_DiaChiLienHe'),
            'strGhiChu': edu.util.getValById('txtNO_GhiChu'),
            'strSoHoChieu': edu.util.getValById('txtNO_SoHoChieu'),
            'strThoiHanViSa': edu.util.getValById('txtNO_HanViSa'),
            'strTrinhDoDaoTao_Id': edu.util.getValById('dropNO_TrinhDoDT'),
            'strDienDaoTao_Id': edu.util.getValById('dropNO_DienDT'),
            'strNganhDaoTao_Id': edu.util.getValById('dropNO_NganhDT'),
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
                    edu.system.alert("Cập nhật thành công!");
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
    getDetail_NO: function (strId) {
        var me = main_doc.XacNhanDangKy;

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
    /*------------------------------------------
    --Discription: [1] GenHTML HoSo
    --ULR:  Modules
    -------------------------------------------*/
    viewForm_NO: function (data) {
        var me = main_doc.XacNhanDangKy;
        //anh
        edu.util.viewValById("txtNO_Anh", data.ANH);
        $(".lblHoTenNguoiO").html(data.HODEM + " " + data.TEN);
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
        //edu.util.viewValById("txtNO_QDDT_So", data.TINHTRANGNHANSU_ID);
        //edu.util.viewValById("txtNO_QDDT_NgayDen", data.TINHTRANGNHANSU_ID);
        //edu.util.viewValById("txtNO_QDDT_NgayDi", data.TINHTRANGNHANSU_ID);
        //edu.util.viewValById("txtNO_QDDT_NgayKy", data.TINHTRANGNHANSU_ID);
        //edu.util.viewValById("txtNO_QDGH_So", data.TINHTRANGNHANSU_ID);
        //edu.util.viewValById("txtNO_QDGH_NgayKy", data.TINHTRANGNHANSU_ID);
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
            'strKTX_Phong_Id': me.strDoiTuong_PhongDK_id,
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
        //
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
    getList_HinhThuc: function (data) {
        var me = main_doc.XacNhanDangKy;
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
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong
    --ULR: Modules
    -------------------------------------------*/
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
    viewDetail_DangKyPhong: function (data) {
        var me = main_doc.XacNhanDangKy;
        var strDoiTuong_Id = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_ID);
        var strDoiTuong_PhongDK_Id = edu.util.returnEmpty(data[0].KTX_PHONG_ID);
        var strDoiTuong_Ten = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_TEN);
        var strDoiTuong_MaSo = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_MASO);
        var strDoiTuong_PhongDK = edu.util.returnEmpty(data[0].KTX_PHONG_MA);

        me.strDoiTuongDangKy_id = strDoiTuong_Id;
        me.strDoiTuong_PhongDK_id = strDoiTuong_PhongDK_Id;

        edu.util.viewHTMLById("lblHopDong_NguoiDangKy", strDoiTuong_Ten);
        edu.util.viewHTMLById("lblHopDong_MaSo", strDoiTuong_MaSo);
        edu.util.viewHTMLById("lblHopDong_PhongDangKy", strDoiTuong_PhongDK);
        edu.util.viewValById("txtHopDong_NgayVao", data[0].NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayRa", data[0].NGAYRA);
    },
    genTable_ChinhSach: function (data) {
        var me = main_doc.XacNhanDangKy;
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
            addClass: [[2, "hopdong-soluong"], [3, "hopdong-hinhthucthu"]],
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
        var me = main_doc.XacNhanDangKy;
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
        var me = main_doc.XacNhanDangKy;
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
        --Discription: [1] AcessDB HopDong_TinhTien
        --ULR: Modules
        -------------------------------------------*/
    save_HopDong_TinhTien: function (dSoThang) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi',
            

            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strKTX_Phong_Id': me.strDoiTuong_PhongDK_id,
            'dSoThang': dSoThang
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data[0].TONGTIEN);
                    edu.util.viewValById("txtHopDong_TongTien", data.Data[0].TONGTIEN);
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
};