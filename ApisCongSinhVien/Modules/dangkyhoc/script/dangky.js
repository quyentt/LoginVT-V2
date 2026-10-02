/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 31/05/2018 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DangKy() { };
DangKy.prototype = {
    strSinhVien_Id: '',
    dtLopHocPhan: [],
    dtKetQuaDK: [],
    dtKeHoach: [],
    objDoiLichHoc: '',
    arrHPDaDangKy: [],
    strHocPhan_Id: '',
    dtTinhTrangTaiChinh: [],
    iSoGiayCho: 0,
    strLopHocPhan_Id: '',
    bDKDon: true,
    strMaNhomLop: '',
    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        //Test
        //$("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(""));
        me.strSinhVien_Id = edu.system.userId;//'1dcef415c29c4598b6286eae7fe1ff19';
        //Switch ENd Test
        //me.getDetail_HS();
        //
        me.getList_ChuongTrinh();
        $("#zoneKeHoach").delegate('.btnSelectInList', 'click', function (e) {
            var strId = this.id;
            var point = this; e.preventDefault();
            var x = $("#zoneKeHoach .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-dachon-primary");
            }
            point.classList.add("btn-dachon-primary");
            setTimeout(function () {
                me.getList_HocPhan();
                //12 me.getList_KetQuaDangKy();
                //12 me.getList_TinhTrangTaiChinh();
                me.showThoiGianDangKy(me.dtKeHoach.find(e => e.ID === strId));
            }, 500);
        });
        $("#zoneChuongTrinh").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            var x = $("#zoneChuongTrinh .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-dachon-primary");
            }
            point.classList.add("btn-dachon-primary");
            setTimeout(function () {
                me.getList_KeHoach();
            }, 500);
        });
        $("#zoneDSHocPhan").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            var x = $("#zoneDSHocPhan .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-dachon-primary");
                x[i].classList.remove("active");
            }
            point.classList.add("active");
            point.classList.add("btn-dachon-primary");
            me.strHocPhan_Id = this.id;
            setTimeout(function () {
                $("#DSThuHoc").html("");
                $("#DSGiangVien").html("");
                me.getList_LopHocPhan(true);
                me.getList_ThuHoc();
                me.getList_GiangVien();
            }, 500);
        });
        $("#zoneDangKy").delegate('.btnChonHocPhan', 'click', function (e) {
            me.bDKDon = true;
            me.strLopHocPhan_Id = this.id;
            me.toggle_chonmon();
            me.loadMonTheoNhom(this.id);
        });
        $("#zoneDangKy").delegate('.btnDangKyHocPhan', 'click', function (e) {
            me.bDKDon = false;
            var strLopHocPhan_Id = this.id;
            var strtenhocphan = $("#lblTenLop" + strLopHocPhan_Id).html();
            me.strLopHocPhan_Id = strLopHocPhan_Id;
            $('#modal-class-registration').modal('show');
            $("#lblTenLopDangKy").html(strtenhocphan);
            $("#alert_dangky").html("");
        });
        $("#btnDangKyLopHocPhanDaChon").click(function (e) {
            var strLopHocPhan_Id = me.strLopHocPhan_Id;
            if (me.bDKDon) {
                var arrLopHocPhan = [];
                arrLopHocPhan.push(strLopHocPhan_Id);
                try {
                    var strMaNhom = me.dtLopHocPhan.rs.find(ele => ele.ID === strLopHocPhan_Id).MANHOMLOP;
                    var xNhom = $("#zoneThuocTinh .filterNhomLopHocPhan .btnChonNhomLopHocPhan");
                    for (var i = 0; i < xNhom.length; i++) {
                        if (strMaNhom == $(xNhom[i]).attr("title")) arrLopHocPhan.push(xNhom[i].id);
                    }
                } catch (Ex) {

                }
                strLopHocPhan_Id = arrLopHocPhan.toString();
            }
            me.save_KeHoachDangKy(strLopHocPhan_Id);
            //if (me.iSoGiayCho) {
            //    $("#alert_dangky").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
            //    edu.system.genHTML_Progress("alertprogessbar", me.iSoGiayCho);
            //    edu.system.beginLoadings();
            //    runAA(0, strLopHocPhan_Id);
            //} else {
            //    me.save_KeHoachDangKy(strLopHocPhan_Id);
            //}
        });

        $("#modal-choose-2").delegate('#btnDangKyNhomLop', 'click', function (e) {
            var strLopChinh_Id = $("#btnChonLopAll .btnChonHocPhan").attr("id");
            var strtenhocphan = $("#lblTenLop" + strLopChinh_Id).html();

            me.strLopHocPhan_Id = strLopChinh_Id ;
            $('#modal-class-registration').modal('show');
            $("#lblTenLopDangKy").html(strtenhocphan);
            $("#alert_dangky").html("");
        });
        $("#zoneTHTL").delegate('.btnChonNhomLopHocPhan', 'click', function (e) {
            var strThuocTinhId = $(this).attr("name");
            var strId = this.id;
            var point = document.getElementById("NhomLopHocPhan" + strId).cloneNode(true);
            point.style.width = '99%';
            var x = document.getElementById("btnChonThuocTinh" + strThuocTinhId);
            x.innerHTML = "";
            x.insertBefore(point, x.childNodes[0]);
        });
        $("#zoneketquahocphan").delegate('.btnHuyHocPhan', 'click', function (e) {
            var strLopHocPhan_Id = this.id;
            var strtenhocphan = $("#lblTenLop" + strLopHocPhan_Id).html();
            me.strLopHocPhan_Id = strLopHocPhan_Id;
            $("#lblLopHuy").html(strtenhocphan);
            $('#modal-cancel').modal('show');
            //edu.system.confirm("Bạn có chắc chắn muốn hủy đăng ký lớp học phần: <br/> <span style='color: red'>" + strtenhocphan + "</span>?");
            //$("#btnYes").click(function (e) {
            //    me.delete_KeHoachDangKy(strLopHocPhan_Id);
            //});
        });
        $("#btnHuyLopHocPhan").click(function (e) {
            me.delete_KeHoachDangKy(me.strLopHocPhan_Id);
        });

        $("#zoneketquahocphan").delegate('.btnDoiLich', 'click', function (e) {
            var strId = this.id;
            me.getList_DoiLich(strId);
        });
        $("#zoneDoiLichDangKy").delegate('.btnDoiNhomLopHocPhan', 'click', function (e) {
            var strId = this.id;
            var strtenhocphan = $("#lblTenLop" + strId).html();
            edu.system.confirm("Bạn có chắc chắn muốn đổi lớp học phần: <br/> <span style='color: red'>" + edu.util.returnEmpty(me.objDoiLichHoc.DANGKY_LOPHOCPHAN_TEN) + "</span> sang lớp học phần <span style='color: red'>" + strtenhocphan+ "</span>?");
            $("#btnYes").click(function (e) {
                me.save_DoiLich(strId);
            });
        });

        $(".btnClose").click(function () {
            me.toggle_hocphan();
        });
       
        
        
        $("#zoneLopHocPhan,#zoneKetQuaDangKy,#zoneDoiLichDangKy,#zoneTHTL,#zoneThuocTinh").delegate('.btnChiTietLopHocPhan', 'click', function (e) {
            $('#myModalChiTietLich').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = $(this).attr("name");
            $("#lblChiTietHocPhan").html(strTenLop);
            me.getList_LichTuanTheoLopHocPhan(strTenLop_Id);
        });
        $("#zoneLopHocPhan,#zoneKetQuaDangKy").delegate('.btnChiTietDiemDanh', 'click', function (e) {
            $('#diem_danh').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $(".zoomfileLabel").html(strTenLop);
            me.getList_DiemDanh(strTenLop_Id);
        });
        $("#zoneLopHocPhan,#zoneKetQuaDangKy").delegate('.btnChiTietDiemQuaTrinh', 'click', function (e) {
            $('#diem_qua_trinh').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $(".zoomfileLabel").html(strTenLop);
            me.getList_DiemQuaTrinh(strTenLop_Id);
        });
        $("#zoneThuocTinh").delegate('.filterNhomLopHocPhan', 'click', function (e) {
            $("#zoneTHTL .zoneNhomLopHocPhan").slideUp();
            var strId = $(this).attr("name");
            setTimeout(function () {
                $("#zoneTHTL .zone" + strId).slideDown();
                $("#zoneTHTL").focus();
            }, 400);
        });
        $("#btnChonLopAll").click(function () {
            $("#zoneTHTL .zoneNhomLopHocPhan").slideDown();
            $("#zoneTHTL").focus();
        });
        
        $("#DSPhuongAn").delegate('.btnPhuongAn', 'click', function (e) {
            var strId = this.id;
            var strName = $(this).attr("name");
            $("#zoomfileLabel_PhuongAn").html(strName);
            $("#phuongan_dangky").modal("show");
            me.getList_PhuongAn(strId);
        });

        function runAA(idem, strLopHocPhan_Id) {
            if (idem == 10) {
                //$("#myModalAlert #alert_content").html("Đăng ký thành công");
                me.toggle_hocphan();
                edu.system.endLoadings();
                me.save_KeHoachDangKy(strLopHocPhan_Id);
                return;
            }; 
            if (idem == undefined) return;
            idem++;
            edu.system.start_Progress("alertprogessbar");
            setTimeout(function () { runAA(idem, strLopHocPhan_Id)}, 200);
        }
        $("#btnViewDaDangKy").click(function () {
            me.toggle_ketqua();
        });
        $(".btnViewTaiChinh").click(function () {
            me.getList_TinhTrangTaiChinh();
        });

        $("#btnSearch").click(function () {
            me.getList_LopHocPhan();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_DangKyHoc", function (addKeyValue) {
            var obj_save = {
                'strThuHoc': edu.extend.getCheckedCheckBoxByClassName('ckbDSTH').toString(),
                'strNhanSu_HoSoNhanSu_v2_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSGV').toString(),
                'dChiLayCacLopKhongTrung': $('#dLocTrung').is(":checked") ? 1 : 0,
                'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
                'strMaNhomLop': edu.util.getValById('txtAAAA'),
                'dLaLopHocPhanChinh': 1,
                'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
                'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
                'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
                'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
                'strNguoiThucHien_Id': edu.system.userId,
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });

        $("#txtSearch_HocPhan").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            $("#zoneDSHocPhan li").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });

        $('#zoneketquahocphan').on('shown.bs.modal', function (e) {
            $('#zonemasonrybq').masonry();
        });
    },

    toggle_hocphan: function () {
        edu.util.toggle_overide("zone-bus", "zonehocphan");
    },
    toggle_chonmon: function () {
        //edu.util.toggle_overide("zone-bus", "zonechonmonhocphan");
        $("#modal-choose-2").modal("show");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zonedetailhocphan");
    },
    toggle_ketqua: function () {

        //this.genList_KetQuaDangKy(this.dtKetQuaDK);//11
        this.getList_KetQuaDangKy();//11

        $("#zoneketquahocphan").modal("show");
    },
    highlightDaDangKy: function () {
        var $el = $("#btnViewDaDangKy");
        $el.removeClass("highlight-dadangky");
        setTimeout(function () { $el.addClass("highlight-dadangky"); }, 50);
    },
    /*------------------------------------------
	--Discription: Xem ho so sinh vien
	-------------------------------------------*/

    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TS_DKH_CHUNG1_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'PKG_DANGKYHOC_CHUNG1.LayDSChuongTrinh',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    me.genList_ChuongTrinh(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_ChuongTrinh: function (data) {
        var me = this;
        var row = '';
        var check = "btn-dachon-primary";
        for (var i = 0; i < data.length; i++) {
            row += '<a id="' + data[i].DAOTAO_TOCHUCCHUONGTRINH_ID + '" class="' + check + ' btnSelectInList" style="cursor: pointer">' + edu.util.returnEmpty(data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN) + '</a>';
            check = "";
        }

        $("#zoneChuongTrinh").html(row);
        $("#lblTenSinhVien").html(edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_TEN));
        $("#lblMaSo").html(edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_MASO));
        $("#lblSoTaiKhoan").html(edu.util.returnEmpty(data[0].TAIKHOAN));
        $("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(data[0].QLSV_NGUOIHOC_ANH));
        me.getList_KeHoach();
    },
    
    getList_KeHoach: function () {
        var me = this;
        
        //--Edit
        var obj_save = {
            'action': 'NS_DKH_CHUNG2_MH/DSA4BRIKJAkuICIpBSAvJgo4CS4i',
            'func': 'pkg_dangkyhoc_chung2.LayDSKeHoachDangKyHoc',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    me.genList_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_KeHoach: function (data) {
        var me = this;
        me.dtKeHoach = data;
        var row = '';
        if (data.length > 0) {
            row += '<a id="' + data[0].ID + '" class="btn-dachon-primary btnSelectInList" style="cursor: pointer">' + data[0].MAKEHOACH + ' - ' + data[0].TENKEHOACH + '</a>';

            for (var i = 1; i < data.length; i++) {
                row += '<a id="' + data[i].ID + '" class="btnSelectInList">' + data[i].MAKEHOACH + ' - ' + data[i].TENKEHOACH + '</a>';
            }
        }
        row += '<span  id="zoneThoiGian"></span>';
        $("#zoneKeHoach").html(row);
        if (data.length > 0) me.showThoiGianDangKy(data[0]);
        me.getList_HocPhan();
        //12 me.getList_KetQuaDangKy();
        //12 me.getList_TinhTrangTaiChinh();
    },
    showThoiGianDangKy: function (data) {
        var me = this;
        var fmtNgay = function (s) {
            s = (s == null ? '' : String(s));
            if (/^\d{8}$/.test(s)) return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
            return s;
        };
        var pad2 = function (v) { v = (v == null ? '' : String(v)); return v === '' ? '' : (v.length < 2 ? '0' + v : v); };
        var ghepGioPhut = function (gio, phut, mac_dinh) {
            var g = pad2(gio), p = pad2(phut);
            if (g === '' && p === '') return mac_dinh || '';
            return (g || '00') + ':' + (p || '00');
        };
        var pick = function (a, b) { return (a != null && a !== '') ? a : b; };
        var batDau = fmtNgay(data.NGAYBATDAU);
        var gpBatDau = ghepGioPhut(
            pick(data.GIODANGKYTRONGNGAYDAU, data.NGAYBATDAU_GIO),
            pick(data.PHUTDANGKYTRONGNGAYDAU, data.NGAYBATDAU_PHUT),
            '00:00'
        );
        var ketThuc = fmtNgay(data.NGAYKETTHUC);
        var gpKetThuc = ghepGioPhut(
            pick(data.GIOKETTHUCTRONGNGAYCUOI, data.NGAYKETTHUC_GIO),
            pick(data.PHUTKETTHUCTRONGNGAYCUOI, data.NGAYKETTHUC_PHUT),
            '23:59'
        );
        var html = "<b>Thời gian đăng ký học phần:</b> "
            + batDau + (gpBatDau ? ' ' + gpBatDau : '')
            + ' - '
            + ketThuc + (gpKetThuc ? ' ' + gpKetThuc : '');
        if (data.THONGTINTHOIGIANRUTHP) html += '<br/><b>Thời gian chỉ rút học phần:</b> ' + data.THONGTINTHOIGIANRUTHP;
        $("#zoneThoiGian").html(html);
        $("#lblSoTinDaDangKy").html(edu.util.returnEmpty(data.SOTINCHIDADANGKY));
        $("#lblSoTinToiDa").html(edu.util.returnEmpty(data.SOTINCHITOIDACHUONGTRINH));
        $("#lblSoTinToiThieu").html(edu.util.returnEmpty(data.SOTINCHITOITHIEUCHUONGTRINH));
        if (data.SOGIAYCHO) me.iSoGiayCho = parseInt(data.SOGIAYCHO);
    },
    
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'XLHV_DKH_CHUNG3_MH/DSA4BRIJLiIRKSAvBSAvJhUuAik0IgPP',
            'func': 'pkg_dangkyhoc_chung3.LayDSHocPhanDangToChuc',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    me.genList_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_HocPhan: function (data) {
        var me = this;
        var row = '';
        me.arrHPDaDangKy = [];
        var check = data.find(e => e.DADANGKY === 0);
        if (check != undefined) check = check.DAOTAO_HOCPHAN_ID;
        if (me.strHocPhan_Id != "") check = me.strHocPhan_Id;
        for (var i = 0; i < data.length; i++) {
            var btnClass = '';
            var lblIcon = '';
            if (data[i].DADANGKY > 0) {
                me.arrHPDaDangKy.push(data[i].DAOTAO_HOCPHAN_ID);
                lblIcon = ' <i class="fa fa-check-circle"></i>';
            }
            if (data[i].DAOTAO_HOCPHAN_ID === check) btnClass = 'btn-dachon-primary active';
            row += '<li id="' + data[i].DAOTAO_HOCPHAN_ID + '" class="' + btnClass + ' btnSelectInList"><a href="#"><i class="fal fa-angle-right"></i> <span>' + data[i].DAOTAO_HOCPHAN_MA + ' - ' + data[i].DAOTAO_HOCPHAN_TEN + ' </span>' + lblIcon +'</a></li>';
        }
        $("#zoneDSHocPhan").html(row);
        $("#DSThuHoc").html("");
        $("#DSGiangVien").html("");
        me.getList_LopHocPhan();
        me.getList_ThuHoc();
        me.getList_GiangVien();
    },
    getIdByZone: function (strZone) {
        var arrKetQua =[];
        var x = $("#" + strZone + " .btn-dachon-primary");
        for (var i = 0; i < x.length; i++) {
            arrKetQua.push(x[i].id);
        }
        //x.forEach(element => strKetQua.push(element.id));
        return arrKetQua.toString(); 
    },
    
    getList_LopHocPhan: function (bCheckOfset) {
        var me = this;
        var strTemp = me.getIdByZone("zoneDSHocPhan");
        if (!strTemp) {
            me.genList_LopHocPhan([]);
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'TN_DKH_CHUNG4_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP',
            'func': 'pkg_dangkyhoc_chung4.LayDSLopHocPhanDangToChuc',
            'iM': edu.system.iM,
            'strThuHoc': edu.extend.getCheckedCheckBoxByClassName('ckbDSTH').toString(),
            'strNhanSu_HoSoNhanSu_v2_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSGV').toString(),
            'dChiLayCacLopKhongTrung': $('#dLocTrung').is(":checked")? 1: 0,
            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': edu.util.getValById('txtAAAA'),
            'dLaLopHocPhanChinh': 1,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLopHocPhan = data.Data;
                    me.genList_LopHocPhan(data.Data.rs, data.Pager, bCheckOfset);//11
                    me.genList_PhuongAn(data.Data.rsNhomKiemSoat, data.Pager);//11
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_LopHocPhan: function (data, iPager, bCheckOfset) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var classDangKy = '';
            var lblDangKy = 'Đăng ký';
            var lblChonThem = 'Chọn thêm ';
            var lblSoLuong = edu.util.returnEmpty(aData.SOLOPTHUOCCUNGNHOM - 1);
            var checkDangKy = me.arrHPDaDangKy.find(e => e === aData.DAOTAO_HOCPHAN_ID);
            if (checkDangKy) {
                classDangKy = '1';
                lblDangKy = "Đã đăng ký HP";
                lblChonThem = 'Đủ ';
                lblSoLuong++;
            }
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}

            row += '<div class="col-12 col-md-4 classroom-section-item">';
            row += '<div class="box-classroom-section box-shadow box-hocphan" id="zoneChon' + aData.ID +'">';
            row += '<div class="lable">';
            row += '<a href="#" title="' + edu.util.returnEmpty(aData.TENLOP) + '" id="lblTenLop' + aData.ID + '">';
            row += edu.util.returnEmpty(aData.TENLOP);
            row += '</a>';
            row += '<a class="btn btn-close-1"><i class="fal fa-times"></i></a>';
            row += '</div>';
            row += '<div class="classroom-detail">';
            row += '<ul class="classroom-detail-list">';
            row += '<li>Lý thuyết</li>';
            row += '<li>Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</li>';
            row += '<li>Tổng số: ' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</li>';
            row += '<li>Đã đăng ký: ' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</li>';
            row += '</ul>';
            row += '</div>';
            row += '<div class="classroom-button d-flex justify-content-between">';
            row += '<div class="price"><b>' + edu.util.returnEmpty(aData.PHISAUKHITRUMIEN) + '</b> đ</div>';
            row += '<div class="btn-group">';
            row += '<a class="btn btn-view-detail btnChiTietLopHocPhan" name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '">';
            row += 'Xem chi tiết';
            row += '</a>';
            aData.SOLOPTHUOCCUNGNHOM == 1 ?
                row += '<a class="btn btn-regis' + classDangKy + ' btnDangKyHocPhan' + classDangKy + '"  id="' + aData.ID + '">' + lblDangKy + '</a>' :
                row += '<a class="btn btn-choose-2' + classDangKy + ' btnChonHocPhan' + classDangKy + '" id="' + aData.ID + '">' + lblChonThem + lblSoLuong + ' lớp</a>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            //if (aData.SOLOPTHUOCCUNGNHOM > 1) {
            //    me.getNhom_LopHocPhan(aData.MANHOMLOP, aData.DAOTAO_HOCPHAN_ID);
            //}
        }
        $("#zoneLopHocPhan").html(row);
        if (data.length && bCheckOfset) {
            var el = document.getElementById("zoneLopHocPhan");
            if (el && typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    },

    genList_PhuongAn: function (data, iPager, bCheckOfset) {
        var me = this;
        var row = '';
        data.forEach(e => {
            row += '<div class="filter-plan-reg-item pointer btnPhuongAn" id="' + e.ID + '" name="' + e.TENNHOM + '">';
            row += '<a class="btn">';
            row += '<span>' + e.TENNHOM +'</span>';
            row += '<i class="fal fa-arrow-right"></i>';
            row += '</a>';
            row += '</div>';
        })
        $("#DSPhuongAn").html(row);
    },
    loadMonTheoNhom: function (strId) {
        var me = this;
        var aDataLopHocPhan = me.dtLopHocPhan.rs.find(e => e.ID === strId);
        me.strMaNhomLop = aDataLopHocPhan.MANHOMLOP;
        $("#lblHocPhanDaChon").html(aDataLopHocPhan.TENLOP);
        var html = '';
        $("#zoneThuocTinh").html('<div class="col-12 col-md-4 classroom-section-item classroom-section-choose-2" id="btnChonLopAll"></div>');
        var point = document.getElementById("zoneChon" + strId).cloneNode(true);
        //point.style.width = '99%';
        var x = document.getElementById("btnChonLopAll");
        x.innerHTML = "";
        x.insertBefore(point, x.childNodes[0]);

        me.getList_NhomLopHocPhan(aDataLopHocPhan.MANHOMLOP, aDataLopHocPhan.DAOTAO_HOCPHAN_ID);
    },


    save_KeHoachDangKy: function (strDangKy_LopHocPhan_Ids) {
        var me = this;
        me.strHocPhan_Id = me.getIdByZone("zoneDSHocPhan");
        var strCheck = strDangKy_LopHocPhan_Ids;
        if (strCheck.indexOf(',')) strCheck = strDangKy_LopHocPhan_Ids.split(',')[0];
        var aJson = me.dtLopHocPhan.rs.find(e => e.ID === strCheck);
        if (!aJson) {
            edu.system.alert("Lớp học phần không đúng học phần. Hãy chọn lại học phần!");
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyMH/DangKyHocTrucTiep',


            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': edu.util.getValById('txtAAAA'),
            'dLaLopHocPhanChinh': 1,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': aJson.DAOTAO_CHUONGTRINH_ID,
            'strDangKy_KeHoachDangKy_Id': aJson.DANGKY_KEHOACHDANGKY_ID,
            'strDaoTao_HocPhan_Id': aJson.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_LopHocPhan_Ids': strDangKy_LopHocPhan_Ids,
        };
        //var strMaHoa = edu.system.atob(JSON.stringify(obj_save), "chaolong");
        //console.log(strMaHoa)
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Đăng ký thành công!");
                        me.getList_KetQuaDangKy();
                        me.getList_HocPhan();
                        me.getList_TinhTrangTaiChinh();
                        me.highlightDaDangKy();
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(obj_save.action + " (er): " + JSON.stringify(data.Message));
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: { strVal: edu.system.atob(JSON.stringify(obj_save), "chaolong") },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachDangKy: function (strId) {
        var me = this;
        var temp = me.dtKetQuaDK.find(e => e.ID === strId);
        if (temp.MANHOMLOP) {
            var arrLop = [];
            me.dtKetQuaDK.filter(e => e.MANHOMLOP === temp.MANHOMLOP).forEach(ele => arrLop.push(ele.DANGKY_LOPHOCPHAN_ID));
            strId = arrLop.toString();
        } else {
            strId = temp.DANGKY_LOPHOCPHAN_ID;
        }
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyMH/ThucHienHuyDangKyHoc',
            
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDangKy_KeHoachDangKy_Id': temp.DANGKY_KEHOACHDANGKY_ID,
            'strDaoTao_HocPhan_Id': temp.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_LopHocPhan_Ids': strId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Hủy thành công!");
                    me.getList_KetQuaDangKy();
                    me.getList_HocPhan();
                    me.getList_TinhTrangTaiChinh();
                    me.highlightDaDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                };
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: { strVal: edu.system.atob(JSON.stringify(obj_save), "chaolong") },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NhomLopHocPhan: function (strMaNhomLop, strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP',
            'func': 'pkg_dangkyhoc_chung.LayDSLopHocPhanDangToChuc',
            'iM': edu.system.iM,
            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': strMaNhomLop,
            'dLaLopHocPhanChinh': -1,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_NhomLopHocPhan(data.Data, strMaNhomLop);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    fixThuocTinhTen: function (s) {
        if (!s) return '';
        var map = {
            'thuc hanh': 'Thực hành',
            'ly thuyet': 'Lý thuyết',
            'thao luan': 'Thảo luận',
            'bai tap': 'Bài tập',
            'thuc tap': 'Thực tập',
            'thi nghiem': 'Thí nghiệm',
            'do an': 'Đồ án'
        };
        var key = String(s).toLowerCase().trim();
        return map[key] || s;
    },
    genList_NhomLopHocPhan: function (data, strMaNhomLop) {
        var me = this;
        var dataThuocTinh = data.rsThuocTinhLopHocPhan.filter(e => e.LOPHOCPHANCHINH !== 1 && e.MANHOMLOP === strMaNhomLop);
        //$("#zoneThuocTinh").html("");
        dataThuocTinh.forEach((e, index) => {
            $("#zoneThuocTinh").append(
                '<div id="btnChonThuocTinh' + e.THUOCTINHLOP_ID + '" name="' + e.THUOCTINHLOP_ID + '" class="col-12 col-md-4 classroom-section-item filterNhomLopHocPhan">'
                + '<div class="gallery" style="text-align:center">'
                + '<div class="desc">Chọn lớp ' + me.fixThuocTinhTen(e.THUOCTINHLOP_TEN) + '</div>'
                + '</div>'
                + '</div>'
            );

        });
        var row = '';
        $("#zoneTHTL").html("");
        for (var i = 0; i < data.rs.length; i++) {
            var aData = data.rs[i];
            if (aData.LOPHOCPHANCHINH === 1) continue;
            row += '<div class="col-12 col-md-3 classroom-section-item box-hocphan zoneNhomLopHocPhan zone' + aData.THUOCTINHLOP_ID + '" id="NhomLopHocPhan' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '">';
            row += '<div class="box-classroom-section box-shadow">';
            row += '<div class="lable">';
            row += '<a href="#" title="' + edu.util.returnEmpty(aData.TENLOP) + '"  id="lblTenLop' + aData.ID + '">';
            row += edu.util.returnEmpty(aData.TENLOP);
            row += '</a>';
            row += '<i class="fas fa-check-circle"></i>';
            row += '</div>';
            row += '<div class="classroom-detail">';
            row += '<ul class="classroom-detail-list">';
            row += '<li>' + me.fixThuocTinhTen(edu.util.returnEmpty(aData.THUOCTINHLOP_TEN)) +'</li>';
            row += '<li>Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</li>';
            row += '<li>Tổng số: ' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</li>';
            row += '<li>Đã đăng ký: ' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</li>';
            row += '</ul>';
            row += '</div>';
            row += '<div class="classroom-button d-flex justify-content-between flex-wrap" style="gap: 6px; row-gap: 8px;">';
            row += '<div class="price" style="white-space: nowrap;"><b>' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + '</b> đ</div>';
            row += '<div class="btn-group" style="flex-wrap: nowrap;">';
            row += '<a class="btn btn-view-detail btnChiTietLopHocPhan"  name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '">';
            row += 'Xem';
            row += '</a>';
            row += '<a class="btn btn-practice btnChonNhomLopHocPhan" style="white-space: nowrap;" id="' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '" title="' + edu.util.returnEmpty(aData.MANHOMLOP) +'">';
            row += 'Chọn lớp ' + me.fixThuocTinhTen(aData.THUOCTINHLOP_TEN);
            row += '</a>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneTHTL").html(row);
        //auto chọn lớp
        dataThuocTinh.forEach(e => {
            var x = data.rs.find(ele => e.THUOCTINHLOP_ID === ele.THUOCTINHLOP_ID && ele.SOTHUCTEDANGKYHOC < ele.SOLUONGDUKIENHOC);
            if (x) $("#zoneTHTL #" + x.ID).trigger("click");
        });
        $("#btnDangKyNhomLop").focus();
    },
    
    getList_KetQuaDangKy: function (bLoad) {
        var me = this;

        var obj_save = {
            'action': 'XLHV_DKH_CHUNG6_MH/DSA4CiQ1EDQgBSAvJgo4DS4xCS4iESkgLwPP',
            'func': 'PKG_DANGKYHOC_CHUNG6.LayKetQuaDangKyLopHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKetQuaDK = data.Data;
                    $("#lblSoNguoiDangKy").html(edu.util.returnZero(data.Data.length));
                    if (data.Data.length > 0) {
                        $("#lblSoTinDaDangKy").html(edu.util.returnEmpty(data.Data[0].SOTINCHIDADANGKY));
                    }
                    var row = "";
                    me.dtKetQuaDK.forEach(e => {
                        row += '<li>';
                        row += '<p>';
                        row += edu.util.returnEmpty(e.DANGKY_LOPHOCPHAN_TEN) + '<span class="price">' + edu.util.formatCurrency(e.PHISAUKHITRUMIEN) + ' đ</span>';
                        row += '</p>';
                        row += '<p>-<span class="text-t">T' + edu.util.returnEmpty(e.THUHOC_TIETHOC) + '</span></p>';
                        row += '</li>';
                    });
                    $("#zoneDaDangKy").html(row);
                    me.genList_KetQuaDangKy(data.Data);//11
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    genList_KetQuaDangKy: function (data) {
        var me = this;

        //data.sort((a, b) => {
        //    if (a.DAOTAO_HOCPHAN_TEN < b.DAOTAO_HOCPHAN_TEN) return true;
        //    else if (a.DAOTAO_HOCPHAN_TEN === b.DAOTAO_HOCPHAN_TEN) {
        //        if (a.DANGKY_LOPHOCPHAN_TEN > b.DANGKY_LOPHOCPHAN_TEN) return true;
        //    }
        //    return false;
        //});

        var row = '';
        var tempHocPhan = "";
        var mau = '';
        row += '<div id="zonemasonrybq">';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}
            if (aData.DAOTAO_HOCPHAN_ID !== tempHocPhan) {
                tempHocPhan = aData.DAOTAO_HOCPHAN_ID;
                mau ? mau = '' : mau = 'background-color: #63e55c';
                row += '<div class="subject-item">';
                row += '<h4>Môn ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</h4>';
            }

            row += '<div class="classroom-section-item">';
            row += '<div class="box-classroom-section box-shadow">';
            row += '<div class="lable">';
            row += '<a href="#" id="lblTenLop' + aData.ID + '" name="' + aData.DANGKY_LOPHOCPHAN_ID + '"  title="' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '" class="btnChiTietLopHocPhan" style="cursor: pointer" >';
            row += edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN);
            row += '</a>';
            row += '</div>';
            row += '<div class="classroom-detail d-flex ">';
            row += '<div class="classroom-detail-sum">';
            row += '<p class= "' + edu.util.returnEmpty(aData.MANHOMLOP) + '">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</p>';
            row += '<p>Tổng số: ' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</p>';
            row += '<p>Đã đăng ký: ' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</p>';
            row += '</div>';
            row += '<div class="classroom-day">';
            row += '<p>' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' - ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p>';
            row += '<p>Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</p>';
            row += '<p></p>';
            row += '</div>';
            row += '</div>';
            row += '<div class="classroom-button d-flex justify-content-between">';
            row += '<div class="price"><b>' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + '</b> đ</div>';
            row += '<div class="btn-group">';
            row += '<button class="btn btn-view-detail btnDoiLich"  id="' + aData.ID + '" >';
            row += 'Đổi lịch';
            row += '</button>';
            row += '<button class="btn btn-cancel btnHuyHocPhan"  id="' + aData.ID + '">';
            row += 'Hủy';
            row += '</button>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            
            if (i == data.length - 1 || aData.DAOTAO_HOCPHAN_ID != data[i + 1].DAOTAO_HOCPHAN_ID) row += '</div>';
            
        }
        row += '</div>';
        $("#zoneKetQuaDangKy").html(row);
        //$('#zonemasonrybq').masonry();
        //$('#zoneKetQuaDangKy').masonry({
        //    // options
        //    itemSelector: '.subject-item'
        //});
        //setTimeout(function () {
        //    data.filter(e => e.MANHOMLOP !== null).forEach(ele => {
        //        let arrX = $("#zoneKetQuaDangKy ." + ele.MANHOMLOP);
        //        let maxHeight = 0;
        //        for (var i = 0; i < arrX.length; i++) {
        //            let h = arrX[i].offsetHeight;
        //            if (h > maxHeight) maxHeight = h;
        //        }
        //        for (var i = 0; i < arrX.length; i++) {
        //            arrX[i].style.height = maxHeight + 'px';
        //        }
        //    })
        //}, 500);
        
    },
    
    getList_DoiLich: function (strId) {
        var me = this;
        let temp = me.dtKetQuaDK.find(e => e.ID === strId);
        me.objDoiLichHoc = temp;

        var obj_save = {
            'action': 'TS_DKH_CHUNG7_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP',
            'func': 'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanDangToChuc',
            'iM': edu.system.iM,
            'strThuocTinhLop_Id': temp.THUOCTINHLOP_ID,
            'strMaNhomLop': temp.MANHOMLOP,
            'dLaLopHocPhanChinh': temp.LOPHOCPHANCHINH === null ? -1 : temp.LOPHOCPHANCHINH,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDangKy_KeHoachDangKy_Id': temp.DANGKY_KEHOACHDANGKY_ID,
            'strDaoTao_HocPhan_Id': temp.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_DoiLich(data.Data);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_DoiLich: function (data) {
        var me = this;
        var row = '';
        $("#zoneDoiLichDangKy").html("");
        var idem = 0;
        for (var i = 0; i < data.rs.length; i++) {
            var aData = data.rs[i];
            if (aData.ID === me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID) continue;
            if (aData.SOLOPTHUOCCUNGNHOM > 1 && aData.LOPHOCPHANCHINH == 1) continue;
            idem++;

            row += '<div class="col-12 col-md-4 classroom-section-item">';
            row += '<div class="box-classroom-section box-shadow">';
            row += '<div class="lable">';
            row += '<a href="#" title="' + edu.util.returnEmpty(aData.TENLOP) + '" id="lblTenLop' + aData.ID + '">';
            row += edu.util.returnEmpty(aData.TENLOP);
            row += '</a>';
            row += '</div>';
            row += '<div class="classroom-detail d-flex">';
            row += '<div class="classroom-detail-sum">';
            row += '<p>' + me.fixThuocTinhTen(edu.util.returnEmpty(aData.THUOCTINHLOP_TEN)) + '</p>';
            row += '<p>Tổng số: ' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</p>';
            row += '<p>Đã đăng ký: ' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</p>';
            row += '</div>';
            row += '<div class="classroom-day">';
            row += '<p>' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' - ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p>';
            row += '<p>Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</p>';
            row += '<p>' + edu.util.returnEmpty(aData.GIANGVIEN) + '</p>';
            row += '</div>';
            row += '</div>';
            row += '<div class="classroom-button d-flex justify-content-between flex-wrap" style="gap: 6px; row-gap: 8px;">';
            row += '<div class="price" style="white-space: nowrap;"><b>' + edu.util.returnEmpty(aData.PHISAUKHITRUMIEN) + '</b> đ</div>';
            row += '<div class="btn-group" style="flex-wrap: nowrap;">';
            row += '<a class="btn btn-view-detail btnChiTietLopHocPhan" name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '">';
            row += 'Xem chi tiết';
            row += '</button>';
            row += '<a class="btn btn-practice btnDoiNhomLopHocPhan" style="white-space: nowrap;" id="' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '">';
            row += 'Đổi lớp ' + me.fixThuocTinhTen(aData.THUOCTINHLOP_TEN);
            row += '</a>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row +='</div>';
        }
        if (idem > 0) {
            $('#modal-change-calendar').modal('show');
            $("#zoneDoiLichDangKy").html(row);
        } else {
            edu.system.alert("Không có lớp để đổi");
        }
    },
    save_DoiLich: function (strId) {
        var me = this;
        var strDangKy_LopHocPhan_Cu_Ids = "";
        var strDangKy_LopHocPhan_Moi_Ids = "";
        if (me.objDoiLichHoc.MANHOMLOP === null) {
            strDangKy_LopHocPhan_Cu_Ids = me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID;
            strDangKy_LopHocPhan_Moi_Ids = strId;
        } else {
            let arrLopCu = [];
            let arrLopMoi = [];
            var tempData = me.dtKetQuaDK.filter(e => e.MANHOMLOP === me.objDoiLichHoc.MANHOMLOP);
            if (tempData != undefined);
            tempData.forEach(e => {
                if (e.DANGKY_LOPHOCPHAN_ID === me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID) {
                    arrLopCu.push(me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID);
                    arrLopMoi.push(strId);
                } else {
                    arrLopCu.push(me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID);
                    arrLopMoi.push(me.objDoiLichHoc.DANGKY_LOPHOCPHAN_ID);
                }
            });
            strDangKy_LopHocPhan_Cu_Ids = arrLopCu.toString();
            strDangKy_LopHocPhan_Moi_Ids = arrLopMoi.toString();
        }
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyMH/ThucHienDoiLichDangKyHoc',

            
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.objDoiLichHoc.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDangKy_KeHoachDangKy_Id': me.objDoiLichHoc.DANGKY_KEHOACHDANGKY_ID,
            'strDaoTao_HocPhan_Id': me.objDoiLichHoc.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_LopHocPhan_Cu_Ids': strDangKy_LopHocPhan_Cu_Ids,
            'strDangKy_LopHocPhan_Moi_Ids': strDangKy_LopHocPhan_Moi_Ids,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đổi lịch thành công!");
                    $("#zoneDoiLichDangKy").html("");
                    me.getList_KetQuaDangKy(true);
                    me.getList_TinhTrangTaiChinh();
                    me.highlightDaDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: { strVal: edu.system.atob(JSON.stringify(obj_save), "chaolong") },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_GiangVien: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'XLHV_DKH_CHUNG6_MH/DSA4BiggLyYXKCQvFSkkLgkuIhEpIC8P',
            'func': 'PKG_DANGKYHOC_CHUNG6.LayGiangVienTheoHocPhan',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_GiangVien(data.Data);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    genList_GiangVien: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            //row += '<div class="col-lg-12 checkbox-inline user-check-print">';
            //row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSGV" title="' + data[i].TEN + '" />';
            //row += '<span><p>' + edu.util.returnEmpty(data[i].MASO) + ' - ' + edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN) + '</p></span>';
            //row += '</div>';

            row += '<div class="form-check">';
            row += '<input class="form-check-input ckbDSGV" type="checkbox" value="" id="' + data[i].ID + '" style="cursor: pointer">';
            row += '<label class="form-check-label" for="' + data[i].ID + '"  style="cursor: pointer">';
            row += edu.util.returnEmpty(data[i].MASO) + ' - ' + edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN);
            row += '</label>';
            row += '</div>';
        }
        $("#DSGiangVien").html(row);
    },
    
    getList_ThuHoc: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'XLHV_DKH_CHUNG6_MH/DSA4FSk0CS4iFSkkLgkuIhEpIC8P',
            'func': 'PKG_DANGKYHOC_CHUNG6.LayThuHocTheoHocPhan',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_ThuHoc(data.Data);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    genList_ThuHoc: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            //row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            //row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].THUHOC + '" class="ckbDSTH" title="' + data[i].THUHOC + '" />';
            //row += '<span><p>' + edu.util.returnEmpty(data[i].THUHOC) + '</p></span>';
            //row += '</div>';
            row += '<div class="form-check ">';
            row += '<input class="form-check-input ckbDSTH" type="checkbox" value="" id="' + data[i].THUHOC + '"  style="cursor: pointer">';
            row += '<label class="form-check-label" for="' + data[i].THUHOC + '" style="cursor: pointer">';
            row += edu.util.returnEmpty(data[i].THUHOC);
            row += '</label>';
            row += '</div>';
        }
        $("#DSThuHoc").html(row);
    },
    
    getList_TinhTrangTaiChinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIVKC8pFTMgLyYVICgCKSgvKQUKCQPP',
            'func': 'pkg_taichinh_thongtin.LayDSTinhTrangTaiChinhDKH',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data);
                    edu.util.viewHTMLById("lblSoDuTaiKhoan", edu.util.formatCurrency(data.Id));
                    me.dtTinhTrangTaiChinh = data.Data;
                    var sum = 0;
                    me.dtTinhTrangTaiChinh.rsConPhaiNopTrongDotDK.forEach(e => {
                        sum += edu.util.returnZero(e.SOTIEN);
                    });
                    edu.util.viewHTMLById("lblSoDuPhatSinh", edu.util.formatCurrency(sum));

                    var row = "";
                    me.dtTinhTrangTaiChinh.rsConPhaiNopHienTai.forEach(e => {
                        row += '<tr>';
                        row += '<td>' + edu.util.formatCurrency(e.SOTIEN) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.NOIDUNG) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.DAOTAO_THOIGIANDAOTAO) + '</td>';
                        row += '</tr>';
                    });
                    $("#tableKhoanConNo tbody").html(row);

                    row = "";
                    me.dtTinhTrangTaiChinh.rsConDuHienTai.forEach(e => {
                        row += '<tr>';
                        row += '<td>' + edu.util.formatCurrency(e.SOTIEN) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.NOIDUNG) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.DAOTAO_THOIGIANDAOTAO) + '</td>';
                        row += '</tr>';
                    });
                    $("#tableKhoanConDu tbody").html(row);
                    
                    row = "";
                    me.dtTinhTrangTaiChinh.rsConPhaiNopTrongDotDK.forEach(e => {
                        var temp = e.DACHUYENKETOAN;
                        temp = temp ? "Đã chuyển": "";
                        row += '<tr>';
                        row += '<td>' + edu.util.returnEmpty(e.DANGKY_LOPHOCPHAN_TEN) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_MA) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.TAICHINH_CACKHOANTHU_TEN) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.SOTINCHI) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.KIEUHOC_TEN) + '</td>';
                        row += '<td>' + edu.util.formatCurrency(e.SOTIEN) + '</td>';
                        row += '<td>' + edu.util.returnEmpty(e.PHAMTRAMMIEN) + '</td>';
                        row += '<td>' + edu.util.formatCurrency(e.SOTIENDUOCMIEN) + '</td>';
                        row += '<td>' + edu.util.formatCurrency(e.SOTIENPHAINOP) + '</td>';
                        row += '<td>' + temp + '</td>';
                        row += '</tr>';
                    });
                    $("#tblSoDuPhatSinh tbody").html(row);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    getList_LichTuanTheoLopHocPhan: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'TS_DKH_CHUNG7_MH/DSA4DSgiKRU0IC8VKSQuDS4xCS4iESkgLwPP',
            'func': 'PKG_DANGKYHOC_CHUNG7.LayLichTuanTheoLopHocPhan',
            'iM': edu.system.iM,
            'strKhoaKiemTraDuLieu': edu.util.uuid(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichTuanTheoLopHocPhan(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_LichTuanTheoLopHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichHoc",
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    //"mDataProp": "BUOIHOC",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Buổi học:</em><span>' + edu.util.returnEmpty(aData.BUOIHOC) + '</span>';
                    }
               
                },
                {
                    //"mDataProp": "NGAYBATDAU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày bắt đầu:</em><span>' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</span>';
                    }
                },
                {
                    //"mDataProp": "NGAYKETTHUC"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày kết thúc:</em><span>' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</span>';
                    }
                },
                {
                    //"mDataProp": "THUHOC"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thứ học:</em><span>' + edu.util.returnEmpty(aData.THUHOC) + '</span>';
                    }
                },
                {
                    //"mDataProp": "SOTIET"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tiết:</em><span>' + edu.util.returnEmpty(aData.SOTIET) + '</span>';
                    }
                },
                {
                    //"mDataProp": "TIETBATDAU"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Tiết bắt đầu:</em><span>' + edu.util.returnEmpty(aData.TIETBATDAU) + '</span>';
                    }
                },
                {
                    //"mDataProp": "TIETKETTHUC"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Tiết kết thúc:</em><span>' + edu.util.returnEmpty(aData.TIETKETTHUC) + '</span>';
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Giờ, phút bắt đầu:</em><span>' + edu.util.returnEmpty(aData.GIOBATDAU) + ":" + edu.util.returnEmpty(aData.PHUTBATDAU) + '</span>';
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Giờ, phút kết thúc:</em><span>' + edu.util.returnEmpty(aData.GIOKETTHUC) + ":" + edu.util.returnEmpty(aData.PHUTKETTHUC) + '</span>';
                    }
                },
                {
                    //"mDataProp": "PHONGHOC_TEN"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Phòng học:</em><span>' + edu.util.returnEmpty(aData.PHONGHOC_TEN) + '</span>';
                    }
                },
                {
                    //"mDataProp": "GIANGVIEN"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Giảng viên:</em><span>' + edu.util.returnEmpty(aData.GIANGVIEN) + '</span>';
                    }
                },
                {
                    //"mDataProp": "THUOCTINH_TEN"
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thuộc tính:</em><span>' + edu.util.returnEmpty(aData.THUOCTINH_TEN) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_DiemDanh: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAUgLykP',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemDanh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemDanh(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemDanh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemDanh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4],
            },
            aoColumns: [

                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày học:</em><span>' + edu.util.returnEmpty(aData.NGAYGHINHAN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + edu.util.returnEmpty(aData.TIETBATDAU) + ' <i class="fas fa-arrow-right"></i> ' + edu.util.returnEmpty(aData.TIETKETTHUC) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Trạng thái:</em><span>' + edu.util.returnEmpty(aData.KIEUCHUYENCAN_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tiết:</em><span>' + edu.util.returnEmpty(aData.SOLUONG) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length > 0) {
            $("#zoomTinhTrangLabel").html(data[0].TINHTRANGDUYETDKTHI_TEN);
        }
        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_DiemQuaTrinh: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLBA0IBUzKC8p',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemQuaTrinh(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemQuaTrinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemQuaTrinh",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại điểm:</em><span>' + edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kết quả:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_PhuongAn: function (strTKB_NhomKiemSoat_Id) {
        var me = this;
        var obj_save = {
            'action': 'TS_DKH_CHUNG7_MH/DSA4BRINLjEJLiIRKSAvFSkkLg8pLiwKEgPP',
            'func': 'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanTheoNhomKS',
            'iM': edu.system.iM,
            'strTKB_NhomKiemSoat_Id': strTKB_NhomKiemSoat_Id,
            'strNguoiThucHien_ID': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_PhuongAn(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_PhuongAn: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhuongAnDangKy",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "SODUKIEN"
                },
                {
                    "mDataProp": "SODADANGKY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },
}