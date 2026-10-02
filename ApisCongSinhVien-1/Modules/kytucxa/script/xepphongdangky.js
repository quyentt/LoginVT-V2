/*----------------------------------------------
--Updated by: 
--Date of created: 
----------------------------------------------*/
function XepPhongDangKy() { };
XepPhongDangKy.prototype = {
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
    dtPhongAll: [],
    strKeHoachDangKy_Id: '',

    init: function () {
        var me = this;
        console.log(123434556)
        me.page_load();
        $("#zoneKeHoach").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            var x = $("#zoneKeHoach .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-primary");
            }
            point.classList.add("btn-primary");
            me.strKeHoachDangKy_Id = this.id;
            setTimeout(function () {
                me.getList_ToaNhaDangKy();
                me.getList_PhongAll();
            }, 500);
        });
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_toanha();
        });
        
        $("#zoneBox_ToaNha").delegate(".btnView", "click", function () {
            var strId = this.id;
            strToaNha_Id = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_phong();
                me.getList_PhongDangKy(me.dtToaNha.find(e => e.ID == strToaNha_Id));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_ThongTinDangKy").delegate(".btnView", "click", function () {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_phong();
                me.getList_PhongDangKy(me.dtToaNha.find(e => e.ID == strToaNha_Id));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#zoneBox_ToaNha").delegate(".btnViewAll", "click", function () {
        //    var strId = this.id;
        //    me.getList_TimPhong();
        //    me.toggle_phong();
        //});
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
            strPhong_Id= edu.util.cutPrefixId(/register/g, strId);
            if (edu.util.checkValue(strPhong_Id)) {
                me.getDetail_PhongDangKy(strPhong_Id);
                me.toggle_phongdangky();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnTimPhong").click(function () {
            doiphong();
        });
        $("#txtSearch_Phong").keypress(function (e) {
            if (e.which === 13) {
                doiphong();
            }
        });
        $("#btnSearchDangKy_Phong").click(function () {
            me.getList_ToaNhaDangKy();
            me.toggle_toanha();
        });
        $("#btnDangKyPhongO").click(function () {
            me.save_DangKy(edu.system.userId);
        });
        $("#txtSearch_DangKy_Phong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.toggle_phong();
                me.getList_TimPhong();
            }
        });

        $("#zoneBtnDangKy").delegate("#btnDangKyPhongO", "click", function () {
            me.save_DangKy(edu.system.userId);
        });
        $("#zoneBtnDangKy").delegate("#btnHuyDangKyPhongO", "click", function () {
            edu.system.confirm("Bạn có muốn xác nhận hủy đăng ký không?");
            $("#btnYes").click(function (e) {
                me.delete_DangKy(me.dtDaDangKyHienTai.find(e => e.KTX_DOITUONGOKYTUCXA_ID === edu.system.userId).ID);
            });
        });
        /*------------------------------------------
        --Discription: [2] Action Hop dong
        --Order:
        -------------------------------------------*/
        $("#btnDangKy_Save").click(function () {
            me.save_HopDong();
        });

        function doiphong() {
            var strMa = edu.util.getValById("txtSearch_Phong");
            var obj = me.dtPhongAll.find(e => e.MA.replace(/ |_|-/g, '').toLowerCase() == strMa.replace(/ |_|-/g, '').toLowerCase());
            if (obj != undefined) {
                me.getDetail_PhongDangKy(obj.ID);
                me.toggle_phongdangky();
            }
        }
    },
    page_load: function () {
        var me = this;
        me.getList_KeHoach();
        //edu.system.loadToCombo_DanhMucDuLieu("KTX.TCP0", "dropSearch_DangKy_Phong_TinhChat");
        //edu.system.loadToCombo_DanhMucDuLieu("KTX.LP00", "dropSearch_DangKy_Phong_Loai");
        //me.getList_PhongAll();
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
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> ToaNhaPhanCongDangKy
    --Author: nnthuong
	-------------------------------------------*/
    getList_ToaNhaDangKy: function () {
        var me = this;
        if (me.dtToaNha.length > 0) return;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDSToaNhaTheoKeHoach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strKTX_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strKTX_DoiTuongOKTX_Id': edu.system.userId,
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
        var iTongSoPhongConTrong = 0;
        var iTongSoChoTrong = 0;

        html = '';
        $("#zoneBox_ToaNha").html(html);
        for (var i = 0; i < data.length; i++) {
            strToaNha_Id = edu.util.returnEmpty(data[i].ID);
            if (strToaNha_Id == "") continue;
            strToaNha_Ten = edu.util.returnEmpty(data[i].TEN);
            iToaNha_SoPhong = edu.util.returnEmpty(data[i].TONGSOPHONG);
            iToaNha_SoPhongConTrong = edu.util.returnEmpty(data[i].SOPHONGTRONG);
            iToaNha_SoChoTrong = edu.util.returnEmpty(data[i].TONGSOCHOTRONG);
            iTongSoToaNha += 1;
            iTongSoPhong += iToaNha_SoPhong;
            iTongSoPhongConTrong += iToaNha_SoPhongConTrong;
            iTongSoChoTrong += iToaNha_SoChoTrong;


            html += '<div class="col-sm-3 col-xs-6 poiter btnView" id="view_' + strToaNha_Id + '">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<h4>' + strToaNha_Ten + '</h4>';
            html += '<p>Số phòng: ' + iToaNha_SoPhong + '</p>';
            html += '<p>Số phòng còn trống: ' + iToaNha_SoPhongConTrong + '</p>';
            html += '<p>Số chỗ trống: ' + iToaNha_SoChoTrong + '</p>';
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
        row += '<div id="zonePhongDaDangKy">';
        
        row += '</div>';
        row += html;
        //html += '<div class="icon">';
        //html += '<i class="fa fa-building cl-rosybrown"></i>';
        //html += '</div>';
        $("#zoneBox_ToaNha").html(row);
        me.getList_DaDangKy();
    },
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> PhanCongPhongDangKy
    --Author: nnthuong
	-------------------------------------------*/
    getList_PhongDangKy: function (dtToaNha) {
        var me = this;
        var strToaNha_Id = dtToaNha.ID;
        var strToaNha_Tang = dtToaNha.SOTANG;
        me.dtPhong = me.dtPhongAll.filter(e => e.KTX_TOANHA_ID === strToaNha_Id);
        me.genBox_PhongDangKy(strToaNha_Tang, me.dtPhong, 0);
        return;
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

    getList_PhongAll: function (dtToaNha) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDSPhongTheoKeHoach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strKTX_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strKTX_DoiTuongOKTX_Id': edu.system.userId,
            'strKTX_ToaNha_Id': edu.util.getValById('dropAAAA'),
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
                    me.dtPhongAll = dtResult;
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
        var me = this;
        
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
        var me = this;
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
            var iSoChoConTrong = 0;
            var iSoPhongConTrong = 0;
            for (var r = 0; r < dtPhong.length; r++) {
                if (dtPhong[r].TANGTHU_TEN == f) {
                    if ((dtPhong[r].SOSINHVIENTOIDA - dtPhong[r].SONGUOIDANGOPHONG) >= 0) {
                        iSoChoConTrong += dtPhong[r].SOSINHVIENTOIDA - dtPhong[r].SONGUOIDANGOPHONG;
                        iSoPhongConTrong += 1
                    }
                }
            }
            html += '<div class="row">';

            html += '<div class="pull-left box-floor">';
            html += '<a class="poiter" >';
            html += '<div class="floor">';
            html += '<span>Tầng ' + f + '</span>';
            html += '<div class="clear"> </div>';
            html += '<span>Trống ' + iSoChoConTrong + '</span> chỗ:';
            html += '<div class="clear"> </div>';
            html += '<span>Trống ' + iSoPhongConTrong + '</span> phòng:';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            for (var r = 0; r < dtPhong.length; r++) {
                if (dtPhong[r].TANGTHU_TEN == f) {
                    var strClassTinhChat = "fa-street-view";
                    var strGioiTinh = "";
                    switch (dtPhong[r].TINHCHAT_TEN) {
                        case "Nam": strClassTinhChat = "fa-male"; strGioiTinh = "Nam"; break;
                        case "Nữ": strClassTinhChat = "fa-female"; strGioiTinh = "Nữ"; break;
                    }
                    var strTrangThai = "";
                    var strBaoPhong = "";
                    if (dtPhong[r].SONGUOIDANGOPHONG >= dtPhong[r].SOSINHVIENTOIDA) {
                        strTrangThai = 'style="color:red"';
                    }
                    if (dtPhong[r].BAOPHONG == 1) {
                        strTrangThai = 'style="color: orange"';
                        strBaoPhong = "; Đã bao";
                    }
                    html += '<div id="' + dtPhong[r].ID + '" class="pull-left box-room btnRegister" ' + strTrangThai +'>';

                    html += '<a id="' + dtPhong[r].ID + '" class="poiter">';
                    html += '<div class="room bg-default" ' + strTrangThai +'>';
                    html += '<i class="fa fa-building-o"> ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                    html += '<i class="fa ' + strClassTinhChat + '" ' + strTrangThai + '> ' + strGioiTinh + " " + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + strBaoPhong + ' </i>';
                    html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng</p>";
                    html += '</div>';
                    html += '</a>';

                    html += '<a id="' + dtPhong[r].ID + '" class="poiter hide">';
                    html += '<div class="room bg-default" ' + strTrangThai +'>';
                    html += '<span id="register' + dtPhong[r].ID + '"><i><u class="cl-lightcoral">Đăng ký</u></i></span><br />';
                    html += '<i class="fa ' + strClassTinhChat + '" ' + strTrangThai + '> ' + strGioiTinh + " "  + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + strBaoPhong + '</i>';
                    html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng</p>";
                    html += '</div>';
                    html += '</a>';
                    html += '</div>';
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
    --Author: vanhiep
    -------------------------------------------*/
    genPhongO: function (data) {
        var me = this;
        me.strPhong_Id = data[0].ID;
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
    save_DangKy: function (strDoiTuongO_Id, strNgayVao, strNgayRa) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DangKyPhong/ThemMoi',
            

            'strId': '',
            'strKTX_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': strDoiTuongO_Id,
            'strNgayVao': strNgayVao,
            'strNgayRa': strNgayRa,
            'strKTX_DangKy_Id': "",
            'strKTX_HopDong_Id': "",
            'strMoTa': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.arrSinhVien_Id.push(strDoiTuongO_Id);
                    me.getDetail_PhongDangKy(me.strPhong_Id);
                }
                else {
                    edu.system.alert('<i class="cl-danger">' + data.Message + '</i>', 'w');
                    $("#btnYes").show();
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
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KTX_DaXepPhong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DangKy_TuKhoa"),
            'strKTX_DangKy_Id': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': "",
            'strKTX_HopDong_Id': "",
            'strNguoiThucHien_Id': "",
            'dDaLapHopDong': "-1",
            'strTinhTrangHopDong_Id': "",
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
                    me.getList_DaDangKyBtn();
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
    delete_DangKy: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_DangKyPhong/Xoa',
            'type': 'POST',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: "Hủy phòng thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getDetail_PhongDangKy(me.strPhong_Id);
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

    getList_DaDangKyBtn: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_DangKyPhong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKTX_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genBtn_DangKy(dtResult);
                    me["dtDaDangKyHienTai"] = dtResult;
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
    /*------------------------------------------
	--Discription: [1]  GenHTML ==> DangKy
    --Author: nnthuong
	-------------------------------------------*/
    viewForm_DangKy: function (data) {
        var me = this;
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
        for (var i = 0; i < json.length; i++) {
            var data = json[i];
            row += '<div class="col-sm-6">';
            row += '<div class="box-mini" style="height: 160px;">';
            row += '<div style="width: 160px; float: left">';
            row += '<img style="margin: 0 auto; display: block; height: 150px" src="' + edu.system.getRootPathImg(data.ANH) + '">';
            row += '</div>';
            row += '<div style="width: 280px; float: left; padding-left: 3px; margin-top: -7px">';
            row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_MASO) + '</p>';
            row += '<p class="pcard"><i class="fa fa-users colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_TEN) + '</p>';
            row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_NGAYSINH) + '</p>';
            row += '<p class="pcard"><i class="fa fa-sign-in colorcard"></i> <span class="lang" key="">Ngày vào</span>: ' + edu.util.checkEmpty(data.NGAYVAO) + '</p>';
            //row += '<p class="pcard"><i class="fa fa-sign-out colorcard"></i> <span class="lang" key="">Ngày ra</span>: ' + edu.util.checkEmpty(data.NGAYRA) + '</p>';
            row += '<p class="pcard"><i class="fa fa-mobile colorcard"></i> <span class="lang" key="">Điện thoại</span>: ' + edu.util.checkEmpty(data.KTX_DOITUONGOKYTUCXA_DIENTHOAI) + '</p>';
            row += '</div>';
            row += '</div>';
            
            row += '</div>';
        }
        $("#zoneHoSo").html(row);
    },
    genBtn_DangKy: function (data) {
        var me = this;
        var htmlGiaHan = '<a id="btnDangKyPhongO" style="font-size: 50px;width: 100%;" class="btn btn-success">Gia hạn</a>';
        var htmlDangKy = '<a id="btnDangKyPhongO" style="font-size: 50px;width: 100%;" class="btn btn-success">Đăng ký</a>';
        var htmlHuyDangKy = '<a id="btnHuyDangKyPhongO" style="font-size: 50px;width: 100%;" class="btn btn-danger">Hủy đăng ký</a>';
        var htmlHienThi = "";
        console.log("data" + data.length)
        console.log(me.dtDoiTuongDangKy.find(e => e.KTX_DOITUONGOKYTUCXA_ID === edu.system.userId))
        if (me.dtDoiTuongDangKy.find(e => e.KTX_DOITUONGOKYTUCXA_ID === edu.system.userId)) {
            console.log(data.find(e => e.KTX_DOITUONGOKYTUCXA_ID === edu.system.userId))
            htmlHienThi = data.find(e => e.KTX_DOITUONGOKYTUCXA_ID === edu.system.userId) ? htmlHuyDangKy : htmlGiaHan;
            console.log(htmlHienThi)
        } else {
            htmlHienThi = htmlDangKy;
        }
        $("#zoneBtnDangKy").html(htmlHienThi);
    },
    
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_KeHoachDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': '',
            'strLoaiKeHoach_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
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
                    me.genList_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    genList_KeHoach: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<a id="' + data[i].ID + '" class="btn btnSelectInList">' + edu.util.returnEmpty(data[i].TENKEHOACH) + '(' + edu.util.returnEmpty(data[i].NGAYVAO) + '-' + edu.util.returnEmpty(data[i].NGAYRA) +')</a>';
        }
        $("#zoneKeHoach").html(row);
        if (data.length === 1) {
            $("#zoneKeHoach #" + data[0].ID).trigger("click");
        }
    },
    getIdByZone: function (strZone) {
        var arrKetQua = [];
        var x = $("#" + strZone + " .btn-primary");
        for (var i = 0; i < x.length; i++) {
            arrKetQua.push(x[i].id);
        }
        //x.forEach(element => strKetQua.push(element.id));
        return arrKetQua.toString();
    },

    getList_DaDangKy: function () {
        var me = this;

        var obj_list = {
            'action': 'KTX_DangKyPhong/LayDanhSach',


            'strTuKhoa': '',
            'strKTX_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strKTX_Phong_Id': '',
            'strKTX_DoiTuongOKyTucXa_Id': edu.system.userId,
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
                    me.genBox_DaDangKy(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genBox_DaDangKy: function (dtPhong) {
        var me = this;
        var html = '';

        for (var r = 0; r < dtPhong.length; r++) {
            if (dtPhong[r].TANGTHU_TEN == f) {
                var strClassTinhChat = "fa-street-view";
                var strGioiTinh = "";
                switch (dtPhong[r].TINHCHAT_TEN) {
                    case "Nam": strClassTinhChat = "fa-male"; strGioiTinh = "Nam"; break;
                    case "Nữ": strClassTinhChat = "fa-female"; strGioiTinh = "Nữ"; break;
                }
                var strTrangThai = "";
                var strBaoPhong = "";
                if (dtPhong[r].SONGUOIDANGOPHONG >= dtPhong[r].SOSINHVIENTOIDA) {
                    strTrangThai = 'style="color:red"';
                }
                if (dtPhong[r].BAOPHONG == 1) {
                    strTrangThai = 'style="color: orange"';
                    strBaoPhong = "; Đã bao";
                }
                html += '<div id="' + dtPhong[r].ID + '" class="pull-left box-room btnRegister" ' + strTrangThai + '>';

                html += '<a id="' + dtPhong[r].ID + '" class="poiter">';
                html += '<div class="room bg-default" ' + strTrangThai + '>';
                html += '<i class="fa fa-building-o"> Đã đăng ký: ' + dtPhong[r].KTX_TOANHA_TEN + " - " + dtPhong[r].TEN + '</i><br />';
                html += '<i class="fa ' + strClassTinhChat + '" ' + strTrangThai + '> ' + strGioiTinh + " " + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + strBaoPhong + ' </i>';
                html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng</p>";
                html += '</div>';
                html += '</a>';

                html += '<a id="' + dtPhong[r].ID + '" class="poiter hide">';
                html += '<div class="room bg-default" ' + strTrangThai + '>';
                html += '<span id="register' + dtPhong[r].ID + '"><i><u class="cl-lightcoral">Đăng ký</u></i></span><br />';
                html += '<i class="fa ' + strClassTinhChat + '" ' + strTrangThai + '> ' + strGioiTinh + " " + dtPhong[r].SONGUOIDANGOPHONG + '/' + dtPhong[r].SOSINHVIENTOIDA + strBaoPhong + '</i>';
                html += '<p>$: ' + edu.util.formatCurrency(edu.util.returnEmpty(dtPhong[r].DONGIAPHONGTUNGNGUOI)) + "/Tháng</p>";
                html += '</div>';
                html += '</a>';
                html += '</div>';
            }
        }
        $("#zonePhongDaDangKy").html(html);
    },
};