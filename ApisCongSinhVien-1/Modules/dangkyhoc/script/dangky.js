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

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        //Test
        $("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(""));
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
                x[i].classList.remove("btn-primary");
            }
            point.classList.add("btn-primary");
            setTimeout(function () {
                me.getList_HocPhan();
                me.getList_KetQuaDangKy();
                me.getList_TinhTrangTaiChinh();
                me.showThoiGianDangKy(me.dtKeHoach.find(e => e.ID === strId));
            }, 500);
        });
        $("#zoneChuongTrinh").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            var x = $("#zoneChuongTrinh .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-primary");
            }
            point.classList.add("btn-primary");
            setTimeout(function () {
                me.getList_KeHoach();
            }, 500);
        });
        $("#zoneDSHocPhan").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            var x = $("#zoneDSHocPhan .btnSelectInList");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("btn-primary");
            }
            point.classList.add("btn-primary");
            me.strHocPhan_Id = this.id;
            setTimeout(function () {
                $("#DSThuHoc").html("");
                $("#DSGiangVien").html("");
                me.getList_LopHocPhan();
                me.getList_ThuHoc();
                me.getList_GiangVien();
            }, 500);
        });
        $("#zoneDangKy").delegate('.btnChonHocPhan', 'click', function (e) {
            me.toggle_chonmon();
            me.loadMonTheoNhom(this.id);
        });
        $("#zoneDangKy").delegate('.btnDangKyHocPhan', 'click', function (e) {
            var strLopHocPhan_Id = this.id;
            var strtenhocphan = $("#lblTenLop" + strLopHocPhan_Id).html(); //this.parentNode.parentNode.getElementsByClassName("tenhocphan")[0].innerHTML;
            edu.system.confirm("Bạn có chắc chắn muốn đăng ký lớp học phần: <br/> <span style='color: red'>" + strtenhocphan + "</span>?");
            $("#btnYes").click(function (e) {
                if (me.iSoGiayCho) {
                    $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                    edu.system.genHTML_Progress("alertprogessbar", me.iSoGiayCho);
                    edu.system.beginLoadings();
                    runAA(0, strLopHocPhan_Id);
                } else {
                    me.toggle_hocphan();
                    me.save_KeHoachDangKy(strLopHocPhan_Id);
                }
            });
        });
        $("#zonechonmonhocphan").delegate('#btnDangKyNhomLop', 'click', function (e) {
            var strLopChinh_Id = $("#btnChonLopAll .btnChonHocPhan").attr("id");
            var strtenhocphan = $("#lblTenLop" + strLopChinh_Id).html();
            edu.system.confirm("Bạn có chắc chắn muốn đăng ký lớp học phần: <br/> <span style='color: red'>" + strtenhocphan + "</span>?");
            $("#btnYes").click(function (e) {
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                $("#btnYes").hide();
                edu.system.genHTML_Progress("alertprogessbar", 10);
                edu.system.beginLoadings();
                var arrLopHocPhan = [];
                arrLopHocPhan.push(strLopChinh_Id);
                var xNhom = $("#zoneThuocTinh .filterNhomLopHocPhan .btnChonNhomLopHocPhan");
                for (var i = 0; i < xNhom.length; i++) {
                    arrLopHocPhan.push(xNhom[i].id);
                }
                runAA(0, arrLopHocPhan.toString());
            });
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
            edu.system.confirm("Bạn có chắc chắn muốn hủy đăng ký lớp học phần: <br/> <span style='color: red'>" + strtenhocphan + "</span>?");
            $("#btnYes").click(function (e) {
                me.delete_KeHoachDangKy(strLopHocPhan_Id);
            });
        });

        $("#zoneketquahocphan").delegate('.btnDoiLich', 'click', function (e) {
            var strId = this.id;
            me.getList_DoiLich(strId);
        });
        $("#zoneDoiLichDangKy").delegate('.btnDoiNhomLopHocPhan', 'click', function (e) {

            $('#myModal').modal('hide');
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
        $("#zonehocphan").delegate('#btnViewDaDangKy', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_KetQuaDangKy(id, point);
        });
        $("#zonehocphan").delegate('#btnViewSoDu', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_TinhTrangTaiChinh(id, point);
        });

        $("#zonehocphan").delegate('#btnViewDuPhatSinh', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_KhoanTienConPhaiNop(id, point);
        });
        $("#zonehocphan,#zoneKetQuaDangKy").delegate('.btnChiTietLopHocPhan', 'click', function (e) {
            $('#myModalChiTietLich').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = $(this).attr("name");
            $("#lblChiTietHocPhan").html(strTenLop);
            me.getList_LichTuanTheoLopHocPhan(strTenLop_Id);
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


        $("#btnSearch").click(function () {
            me.getList_LopHocPhan();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_DangKyHoc", function (addKeyValue) {
            var obj_list = {
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
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });
    },

    toggle_hocphan: function () {
        edu.util.toggle_overide("zone-bus", "zonehocphan");
    },
    toggle_chonmon: function () {
        edu.util.toggle_overide("zone-bus", "zonechonmonhocphan");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zonedetailhocphan");
    },
    toggle_ketqua: function () {
        edu.util.toggle_overide("zone-bus", "zoneketquahocphan");
        this.genList_KetQuaDangKy(this.dtKetQuaDK);//11
    },
    
    popover_KetQuaDangKy: function (strId, point) {
        var me = this;
        var row = "";
        row += '<div >';
        row += '<div >';
        row += '<table>';
        row += '<tbody>';
        me.dtKetQuaDK.sort((a, b) => {
            if (a.DANGKY_LOPHOCPHAN_TEN > b.DANGKY_LOPHOCPHAN_TEN) return true;
            return false;
        });

        me.dtKetQuaDK.forEach(e => {
            row += '<tr>';
            row += '<td class="viewDaDangKy" style="font-weight: bold; overflow: initial">' + edu.util.returnEmpty(e.DANGKY_LOPHOCPHAN_TEN) + '</td>';
            row += '<td style="color: red">' + edu.util.formatCurrency(e.PHISAUKHITRUMIEN) + 'đ</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td>' + edu.util.returnEmpty(e.NGAYBATDAU) + ' - ' + edu.util.returnEmpty(e.NGAYKETTHUC) + '</td>';
            row += '<td>T' + edu.util.returnEmpty(e.THUHOC_TIETHOC) + '</td>';
            row += '</tr>'; 
        });
        
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
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
	--Discription: Xem ho so sinh vien
	-------------------------------------------*/
    viewForm_HS: function (data) {
        var strAnh = edu.system.getRootPathImg(data.ANH);
        $("#lblTenPhong").html(edu.util.returnEmpty(data.MASO));

    },

    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSChuongTrinh',
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
    genList_ChuongTrinh: function (data) {
        var me = this;
        var row = '';
        var check = " btn-primary";
        for (var i = 0; i < data.length; i++) {
            row += '<a id="' + data[i].DAOTAO_TOCHUCCHUONGTRINH_ID + '" class="btn ' + check + ' btnSelectInList">' + edu.util.returnEmpty(data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN) + '</a>';
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
        var obj_list = {
            'action': 'DKH_Chung/LayDSKeHoachDangKyHoc',
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
                    me.dtKeHoach = dtResult;
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
        if (data.length > 0) {
            row += '<a id="' + data[0].ID + '" class="btn btn-primary btnSelectInList">' + data[0].MAKEHOACH + ' - ' + data[0].TENKEHOACH + '</a>';
            me.showThoiGianDangKy(data[0]);

            for (var i = 1; i < data.length; i++) {
                row += '<a id="' + data[i].ID + '" class="btn btnSelectInList">' + data[i].MAKEHOACH + ' - ' + data[i].TENKEHOACH + '</a>';
            }
        }
        $("#zoneKeHoach").html(row);
        me.getList_HocPhan();
        me.getList_KetQuaDangKy();
        me.getList_TinhTrangTaiChinh();
    },
    showThoiGianDangKy: function (data) {
        var me = this;
        $("#zoneThoiGian").html(" " + edu.util.returnEmpty(data.NGAYBATDAU) + " " + edu.util.returnEmpty(data.GIODANGKYTRONGNGAYDAU) + ":" + edu.util.returnEmpty(data.PHUTDANGKYTRONGNGAYDAU) + " - "
            + edu.util.returnEmpty(data.NGAYKETTHUC) + " " + edu.util.returnEmpty(data.GIOKETTHUCTRONGNGAYCUOI) + ":" + edu.util.returnEmpty(data.PHUTKETTHUCTRONGNGAYCUOI));
        $("#lblSoTinDaDangKy").html(edu.util.returnEmpty(data.SOTINCHIDADANGKY));
        $("#lblSoTinToiDa").html(edu.util.returnEmpty(data.SOTINCHITOIDACHUONGTRINH));
        $("#lblSoTinToiThieu").html(edu.util.returnEmpty(data.SOTINCHITOITHIEUCHUONGTRINH));
        if (data.SOGIAYCHO) me.iSoGiayCho = parseInt(data.SOGIAYCHO);
    },
    
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSHocPhanDangToChuc',
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
    genList_HocPhan: function (data) {
        var me = this;
        var row = '';
        me.arrHPDaDangKy = [];
        var check = data.find(e => e.DADANGKY === 0);
        if (check != undefined) check = check.DAOTAO_HOCPHAN_ID;
        if (me.strHocPhan_Id != "") check = me.strHocPhan_Id;
        for (var i = 0; i < data.length; i++) {
            var btnClass = 'btn-white';
            var lblIcon = '';
            if (data[i].DADANGKY > 0) {
                me.arrHPDaDangKy.push(data[i].DAOTAO_HOCPHAN_ID);
                lblIcon = ' <i class="fa fa-check-circle"></i>';
            }
            if (data[i].DAOTAO_HOCPHAN_ID === check) btnClass = 'btn-primary';
            row += '<a id="' + data[i].DAOTAO_HOCPHAN_ID + '" class="btn ' + btnClass + ' btnSelectInList">' + data[i].DAOTAO_HOCPHAN_MA + ' - ' + data[i].DAOTAO_HOCPHAN_TEN + lblIcon + '</a>';
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
        var x = $("#" + strZone + " .btn-primary");
        for (var i = 0; i < x.length; i++) {
            arrKetQua.push(x[i].id);
        }
        //x.forEach(element => strKetQua.push(element.id));
        return arrKetQua.toString(); 
    },
    
    getList_LopHocPhan: function () {
        var me = this;
        var strTemp = me.getIdByZone("zoneDSHocPhan");
        if (!strTemp) {
            me.genList_LopHocPhan([]);
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSLopHocPhanDangToChuc',
            'type': 'GET',
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
                    me.genList_LopHocPhan(data.Data.rs, data.Pager);//11
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_LopHocPhan: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var classDangKy = '';
            var lblDangKy = 'Đăng ký';
            var lblChonThem = 'Chọn thêm ';
            var checkDangKy = me.arrHPDaDangKy.find(e => e === aData.DAOTAO_HOCPHAN_ID);
            if (checkDangKy) {
                classDangKy = '1';
                lblDangKy = "Đã đăng ký HP";
                lblChonThem = 'Đủ ';
            }
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}
            row += '<div class=" col-lg-3">';
            row += '<div class="box-hocphan" id="zoneChon' + aData.ID +'">';
            row += '<table class="table" style="text-align: center;">';
            row += '<tbody>';
            row += '<tr>';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: right">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '" class="btnChiTietLopHocPhan poiter">Xem chi tiết</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            aData.SOLOPTHUOCCUNGNHOM == 1 ? row += '<td rowspan="2" id="' + aData.ID + '" class="btnDangKyHocPhan' + classDangKy + ' poiter" style="background-color: #4e8d42' + classDangKy + '">' + lblDangKy +'</td>'
                : row += '<td rowspan="2" style="background-color: yellow' + classDangKy + '" id="' + aData.ID + '" class="btnChonHocPhan' + classDangKy + ' poiter">'+ lblChonThem + edu.util.returnEmpty(aData.SOLOPTHUOCCUNGNHOM)  +'</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="3" style="">' + edu.util.returnEmpty(aData.PHISAUKHITRUMIEN) + ' VND</td>';
            row += '</tr>';
            row += '</tbody>';
            row += '</table>';
            row += '</div>';
            row += '</div>';

            //if (aData.SOLOPTHUOCCUNGNHOM > 1) {
            //    me.getNhom_LopHocPhan(aData.MANHOMLOP, aData.DAOTAO_HOCPHAN_ID);
            //}
        }
        $("#zoneLopHocPhan").html(row);
        $("#zoneLopHocPhan").focus();
    },
    loadMonTheoNhom: function (strId) {
        var me = this;
        var aDataLopHocPhan = me.dtLopHocPhan.rs.find(e => e.ID === strId);
        $("#lblHocPhanDaChon").html(aDataLopHocPhan.TENLOP);
        me.getList_NhomLopHocPhan(aDataLopHocPhan.MANHOMLOP, aDataLopHocPhan.DAOTAO_HOCPHAN_ID);
        var point = document.getElementById("zoneChon" + strId).cloneNode(true);
        point.style.width = '99%';
        var x = document.getElementById("btnChonLopAll");
        x.innerHTML = "";
        x.insertBefore(point, x.childNodes[0]);
        
    },


    save_KeHoachDangKy: function (strDangKy_LopHocPhan_Ids) {
        var me = this;
        me.strHocPhan_Id = me.getIdByZone("zoneDSHocPhan");
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKy/DangKyHocTrucTiep',


            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': edu.util.getValById('txtAAAA'),
            'dLaLopHocPhanChinh': 1,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_LopHocPhan_Ids': strDangKy_LopHocPhan_Ids,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Đăng ký thành công!");
                        me.getList_KetQuaDangKy();
                        me.getList_HocPhan();
                        //me.getList_TinhTrangTaiChinh();
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

            data: obj_save,
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
            'action': 'DKH_DangKy/ThucHienHuyDangKyHoc',
            
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

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NhomLopHocPhan: function (strMaNhomLop, strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayDSLopHocPhanDangToChuc',
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
    genList_NhomLopHocPhan: function (data, strMaNhomLop) {
        var me = this;
        var dataThuocTinh = data.rsThuocTinhLopHocPhan.filter(e => e.LOPHOCPHANCHINH !== 1 && e.MANHOMLOP === strMaNhomLop);
        $("#zoneThuocTinh").html("");
        dataThuocTinh.forEach((e, index) => {
            $("#zoneThuocTinh").append('<div id="btnChonThuocTinh' + e.THUOCTINHLOP_ID + '" name="' + e.THUOCTINHLOP_ID +'" class="col-lg-3 filterNhomLopHocPhan">'
                + '<div class="gallery" style="text-align:center">'
                + '<div class="desc">Chọn lớp ' + e.THUOCTINHLOP_TEN + '(text ở trung tâm nhé)</div>'
                + '</div>'
                + '</div>');
            
            if (index === 2) $("#zoneThuocTinh").append('<div class="clear"></div>');
            if (index === 6) $("#zoneThuocTinh").append('<div class="clear"></div>');
        });
        var row = '';
        $("#zoneTHTL").html("");
        for (var i = 0; i < data.rs.length; i++) {
            var aData = data.rs[i];
            if (aData.LOPHOCPHANCHINH === 1) continue;
            row += '<div class="box-hocphan zoneNhomLopHocPhan zone' + aData.THUOCTINHLOP_ID + '" id="NhomLopHocPhan' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '">';
            row += '<table class="table" style="text-align: center;">';
            row += '<tbody>';
            row += '<tr>';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: right">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" style="">Xem chi tiết</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2" style="background-color: yellowgreen" id="' + aData.ID +'" name="' + aData.THUOCTINHLOP_ID +'" class="btnChonNhomLopHocPhan">Chọn lớp ' + aData.THUOCTINHLOP_TEN + '</td>'
            row += '</tr>';
            row += '<tr>';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="3" style="">' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + ' VND</td>';
            row += '</tr>';
            row += '</tbody>';
            row += '</table>';
            row += '</div>';
        }
        $("#zoneTHTL").html(row);
        //for (let i = 0; i < dataThuocTinh.length; i++) {
        //    for (let j = 0; j < data.rs.length; j++) {
        //        let aData = data.rs[j];
        //        if (aData.THUOCTINHLOP_ID === dataThuocTinh[i].THUOCTINHLOP_ID && aData.SOLUONGDUKIENHOC < aData.SOTHUCTEDANGKYHOC) {
        //            console.log(aData.ID)
        //            $("#zoneTHTL #" + aData.ID).trigger("click");
        //            break;
        //        }
        //    }
        //}
        dataThuocTinh.forEach(e => {
            var x = data.rs.find(ele => e.THUOCTINHLOP_ID === ele.THUOCTINHLOP_ID && aData.SOTHUCTEDANGKYHOC < aData.SOLUONGDUKIENHOC);
            if (x) $("#zoneTHTL #" + x.ID).trigger("click");
        });

        $("#btnDangKyNhomLop").focus();
    },
    
    getList_KetQuaDangKy: function (bLoad) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayKetQuaDangKyLopHocPhan',
            'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,

            //'action': 'DKH_Chung/LayKetQuaDangKyLopHocPhan',
            //'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            //'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            //'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            //'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            //'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKetQuaDK = data.Data;
                    $("#lblSoNguoiDangKy").html(edu.util.returnZero(data.Data.length));
                    if (data.Data.length > 0) {
                        $("#lblSoTinDaDangKy").html(edu.util.returnEmpty(data.Data[0].SOTINCHIDADANGKY));
                    }

                    //me.genList_KetQuaDangKy(true);
                    //if (bLoad) me.genList_KetQuaDangKy(data.Data);//11
                    me.genList_KetQuaDangKy(data.Data);//11
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
    genList_KetQuaDangKy: function (data) {
        var me = this;

        data.sort((a, b) => {
            if (a.DAOTAO_HOCPHAN_TEN < b.DAOTAO_HOCPHAN_TEN) return true;
            else if (a.DAOTAO_HOCPHAN_TEN === b.DAOTAO_HOCPHAN_TEN) {
                if (a.DANGKY_LOPHOCPHAN_TEN > b.DANGKY_LOPHOCPHAN_TEN) return true;
            }
            return false;
        });

        var row = '';
        var tempHocPhan = "";
        var mau = '';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}
            if (aData.DAOTAO_HOCPHAN_ID !== tempHocPhan) {
                tempHocPhan = aData.DAOTAO_HOCPHAN_ID;
                row += '<div class="clear" ></div>';
                console.log(mau);
                mau ? mau = '' : mau = 'background-color: #63e55c';
                console.log(mau);
            }
            row += '<div class=" col-sm-3">';
            row += '<div class="box-hocphan" id="zoneChon' + aData.ID + '" style="width: 99%; ' + mau +'">';
            row += '<table class="table " style="text-align: center;">';
            row += '<tbody>';
            row += '<tr>';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '" name="' + aData.DANGKY_LOPHOCPHAN_ID +'"  title="' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '" class="btnChiTietLopHocPhan poiter"><a href="#">' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '</a></td>';
            row += '<td style="width: 80px;" class= "' + edu.util.returnEmpty(aData.MANHOMLOP) + '">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: right">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" id="' + aData.ID + '" class="btnDoiLich poiter" rowspan="3" style=""> Đổi lịch</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2" id="' + aData.ID + '" class="btnHuyHocPhan poiter" style="background-color: red"> Hủy</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="3" style="">' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + ' VND</td>';
            row += '</tr>';
            row += '</tbody>';
            row += '</table>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneKetQuaDangKy").html(row);
        setTimeout(function () {
            data.filter(e => e.MANHOMLOP !== null).forEach(ele => {
                let arrX = $("#zoneKetQuaDangKy ." + ele.MANHOMLOP);
                let maxHeight = 0;
                for (var i = 0; i < arrX.length; i++) {
                    let h = arrX[i].offsetHeight;
                    if (h > maxHeight) maxHeight = h;
                }
                for (var i = 0; i < arrX.length; i++) {
                    arrX[i].style.height = maxHeight + 'px';
                }
            })
        }, 500);
        
    },
    
    getList_DoiLich: function (strId) {
        var me = this;
        let temp = me.dtKetQuaDK.find(e => e.ID === strId);
        me.objDoiLichHoc = temp;
         
        var obj_list = {
            'action': 'DKH_Chung/LayDSLopHocPhanDangToChuc',
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
            row += '<div class="col-lg-3">';
            row += '<div class="box-hocphan">';
            row += '<table class="table" style="text-align: center;">';
            row += '<tbody>';
            row += '<tr>';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: right">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" style="">Xem chi tiết</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2" style="background-color: yellowgreen" id="' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '" class="btnDoiNhomLopHocPhan">Đổi lớp ' + aData.THUOCTINHLOP_TEN + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr>';
            row += '<td colspan="3" style="">' + edu.util.returnEmpty(aData.PHISAUKHITRUMIEN) + ' VND</td>';
            row += '</tr>';
            row += '</tbody>';
            row += '</table>';
            row += '</div>';
            row += '</div>';
            if (i !== 0 && i % 4 === 0) {
                row += '<div class="clear"></div>';
            }
        }
        if (idem > 0) {
            $('#myModal').modal('show');
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
            'action': 'DKH_DangKy/ThucHienDoiLichDangKyHoc',

            
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

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_GiangVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayGiangVienTheoHocPhan',
            'type': 'GET',
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
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_GiangVien: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-lg-12 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSGV" title="' + data[i].TEN + '" />';
            row += '<span><p>' + edu.util.returnEmpty(data[i].MASO) + ' - ' + edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN) + '</p></span>';
            row += '</div>';
        }
        $("#DSGiangVien").html(row);
    },
    
    getList_ThuHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayThuHocTheoHocPhan',
            'type': 'GET',
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
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_ThuHoc: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].THUHOC + '" class="ckbDSTH" title="' + data[i].THUHOC + '" />';
            row += '<span><p>' + edu.util.returnEmpty(data[i].THUHOC) + '</p></span>';
            row += '</div>';
        }
        $("#DSThuHoc").html(row);
    },
    
    getList_TinhTrangTaiChinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_TinhTrangTaiChinh/LayDanhSach',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    popover_TinhTrangTaiChinh: function (strId, point) {
        var me = this;
        var row = "";
        row += '<div>';
        row += 'Khoản còn nợ';
        row += '<div>';
        row += '<table  class="table table-hover table-bordered">';
        row += '<thead>';
        row += '<tr>';
        row += '<th>Số tiền</th>';
        row += '<th>Nội dung</th>';
        row += '<th>Thời gian</th>';
        row += '</tr>';
        row += '</thead>';
        row += '<tbody>';
        console.log(me.dtTinhTrangTaiChinh);
        console.log(me.dtTinhTrangTaiChinh.rsConPhaiNopHienTai);
        me.dtTinhTrangTaiChinh.rsConPhaiNopHienTai.forEach(e => {
            row += '<tr>';
            row += '<td>' + edu.util.formatCurrency(e.SOTIEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(e.NOIDUNG) + '</td>';
            row += '<td>' + edu.util.returnEmpty(e.DAOTAO_THOIGIANDAOTAO) + '</td>';
            row += '</tr>';
        });

        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        row += '</div>';

        row += '<div>';
        row += 'Khoản còn dư';
        row += '<div>';
        row += '<table  class="table table-hover table-bordered">';
        row += '<tbody>';

        me.dtTinhTrangTaiChinh.rsConDuHienTai.forEach(e => {
            row += '<tr>';
            row += '<td>' + edu.util.formatCurrency(e.SOTIEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(e.NOIDUNG) + '</td>';
            row += '<td>' + edu.util.returnEmpty(e.DAOTAO_THOIGIANDAOTAO) + '</td>';
            row += '</tr>';
        });

        row += '</tbody>';
        row += '</table>';
        row += '</div>';
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

    popover_KhoanTienConPhaiNop: function (strId, point) {
        var me = this;
        var row = "";
        row += '<div>';
        row += '<div>';
        row += '<table class="table table-hover table-bordered">';
        row += '<thead>';
        row += '<tr>';
        row += '<th>Tên lớp</th>';
        row += '<th>Học phần</th>';
        row += '<th>Loại khoản</th>';
        row += '<th>Số tín chỉ</th>';
        row += '<th>Kiểu học</th>';
        row += '<th>Số tiền phải nộp ban đầu</th>';
        row += '<th>Phần trăm được miễn</th>';
        row += '<th>Số được miễn</th>';
        row += '<th>Số còn phải nộp</th>';
        row += '<th>Đã chuyến kế toán</th>';
        row += '</tr>';
        row += '</thead>';
        row += '<tbody>';

        me.dtTinhTrangTaiChinh.rsConPhaiNopTrongDotDK.forEach(e => {
            var temp = "";
            if (temp > 0) temp = "Đã chuyển kế toán";
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

        row += '</tbody>';
        row += '</table>';
        row += '</div>';
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
    
    getList_LichTuanTheoLopHocPhan: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_list = {
            'action': 'DKH_LichTuanTheoLopHocPhan/LayLichTuanTheoLopHocPhan',
            'type': 'GET',
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
                    "mDataProp": "BUOIHOC"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "THUHOC"
                },
                {
                    "mDataProp": "SOTIET"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
                },
                {
                    "mDataProp": "PHONGHOC_TEN"
                },
                {
                    "mDataProp": "GIANGVIEN"
                },
                {
                    "mDataProp": "THUOCTINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },
}