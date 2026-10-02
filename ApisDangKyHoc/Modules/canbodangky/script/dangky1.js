/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 31/05/2018 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DangKy() { }
DangKy.prototype = {
    strSinhVien_Id: '',
    dtLopHocPhan: [],
    dtKeHoach: [],
    dtKetQuaDK: [],
    objDoiLichHoc: '',
    arrHPDaDangKy: [],
    strHocPhan_Id: '',
    dtTinhTrangTaiChinh: [],
    bSinhVien: false,
    arrSinhVien_Id: [],
    dtSinhVien: [],
    iSoGiayCho: 0,

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        //Test
        $("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(""));
        if (me.bSinhVien) {
            me.strSinhVien_Id = edu.system.userId;//'1dcef415c29c4598b6286eae7fe1ff19';
            me.getList_ChuongTrinh();
            //edu.system.getList_MauImport("zonebtnBaoCao_DangKyHoc", function (addKeyValue) {
            //    var obj_list = {
            //        'strThuHoc': edu.extend.getCheckedCheckBoxByClassName('ckbDSTH').toString(),
            //        'strNhanSu_HoSoNhanSu_v2_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSGV').toString(),
            //        'dChiLayCacLopKhongTrung': $('#dLocTrung').is(":checked") ? 1 : 0,
            //        'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            //        'strMaNhomLop': edu.util.getValById('txtAAAA'),
            //        'dLaLopHocPhanChinh': 1,
            //        'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            //        'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            //        'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            //        'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            //        'strNguoiThucHien_Id': edu.system.userId,
            //    };
            //    for (variable in obj_list) {
            //        addKeyValue(variable, obj_list[variable]);
            //    }
            //});

        } else {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            $("#btnSearchSinhVien").click(function (e) {
                me.getList_HSSV();
            });
            $("#btnSearch_Import").click(function (e) {
                me.getList_HSSV(1);
            });
            $("#txtSearch_TuKhoa").keypress(function (e) {
                if (e.which === 13) {
                    me.getList_HSSV();
                }
            });
            $(".btnCloseSinhVien").click(function (e) {
                edu.util.toggle_overide("zone-bus", "zonebatdau");
            });
            $("#btnAddnew").click(function (e) {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần đăng ký?");
                    return;
                }
                me.arrSinhVien_Id = arrChecked_Id;
                me.strSinhVien_Id = arrChecked_Id[0].substring(0, 32);
                me.toggle_hocphan();
                me.getList_ChuongTrinh();
            });

            $("#chkSelectAll_SinhVien").on("click", function () {
                edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
            });

            $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
                me.getList_KhoaDaoTao();
                me.getList_ChuongTrinhDaoTao();
                me.getList_DinhHuong();
                //me.getList_LopQuanLy();
                //me.getList_HSSV();
            });
            $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {

                me.getList_ChuongTrinhDaoTao();
                me.getList_LopQuanLy();
                me.getList_HSSV();
                me.getList_DinhHuong();
            });
            $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {

                me.getList_LopQuanLy();
                me.getList_HSSV();
                me.getList_DinhHuong();
                me.getList_NhomDinhHuong();
            });
            $('#dropSearch_DinhHuong').on('select2:select', function (e) {
                
                me.getList_NhomDinhHuong();
                me.getList_HSSV();
            });
            $('#dropSearch_Lop').on('select2:select', function (e) {
                me.getList_HSSV();
            });

            $("#tblSinhVien").delegate('.btnViewDK', 'click', function (e) {
                var strId = this.id;
                me.arrSinhVien_Id = [];
                me.strSinhVien_Id = strId;
                me.toggle_hocphan();
                me.getList_ChuongTrinh();
            });
        }
        $("#DSPhuongAn").delegate('.btnPhuongAn', 'click', function (e) {
            var strId = this.id;
            var strName = $(this).attr("name");
            $("#zoomfileLabel_PhuongAn").html(strName);
            $("#phuongan_dangky").modal("show");
            me.getList_PhuongAn(strId);
        });
        //Switch ENd Test
        //me.getDetail_HS();
        //
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
                me.toggle_hocphan();
                me.save_KeHoachDangKy(strLopHocPhan_Id);
                //if (me.iSoGiayCho) {
                //    $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                //    $("#btnYes").hide();
                //    edu.system.genHTML_Progress("alertprogessbar", me.iSoGiayCho);
                //    edu.system.beginLoadings();
                //    runAA(0, strLopHocPhan_Id);
                //} else {
                    

                //}
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
            edu.system.confirm("Bạn có chắc chắn muốn đổi lớp học phần: <br/> <span style='color: red'>" + edu.util.returnEmpty(me.objDoiLichHoc.DANGKY_LOPHOCPHAN_TEN) + "</span> sang lớp học phần <span style='color: red'>" + strtenhocphan + "</span>?");
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
        $("#zonehocphan,#zoneKetQuaDangKy,#zoneDoiLichDangKy").delegate('.btnChiTietLopHocPhan', 'click', function (e) {
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
            if (idem == me.iSoGiayCho) {
                //$("#myModalAlert #alert_content").html("Đăng ký thành công");
                me.toggle_hocphan();
                edu.system.endLoadings();
                me.save_KeHoachDangKy(strLopHocPhan_Id);
                $("#alertprogessbar").hide();
                return;
            };
            if (idem == undefined) return;
            idem++;
            edu.system.start_Progress("alertprogessbar");
            setTimeout(function () { runAA(idem, strLopHocPhan_Id) }, 1000);
        }
        $("#btnViewDaDangKy").click(function () {
            me.toggle_ketqua();
        });


        $("#btnSearch").click(function () {
            me.getList_LopHocPhan();
        });


        $("#DSTrangThaiSV_LHD").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {

            var checked_status = this.checked;
            console.log(checked_status);
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);

        //edu.system.getList_MauImport("zonebtnDN");
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


        $("#btnDelete_Import").click(function () {
            me.delete_Import();
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
        var arrKetQua = [];
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


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLopHocPhan = data.Data;
                    me.genList_LopHocPhan(data.Data.rs, data.Pager);//11
                    me.genList_PhuongAn(data.Data.rsNhomKiemSoat, data.Pager);//11
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
            if (checkDangKy && edu.util.getArrCheckedIds("tblSinhVien", "checkX").length == 1) {
                classDangKy = '1';
                lblDangKy = "Đã đăng ký HP";
                lblChonThem = 'Đủ ';
            }
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}
            row += '<div class="item-hocphan col-lg-3">';
            row += '<div class="box-hocphan" id="zoneChon' + aData.ID + '">';
            row += '<table class="table" style="text-align: center;">';
            row += '<tbody>';
            row += '<tr class="name-hocphan">';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr class="day-hocphan">';
            row += '<td height="10" style="text-align: left"><span>Ngày:</span>' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" ><div name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '" class="btnChiTietLopHocPhan btn poiter">Xem chi tiết</div></td>';
            row += '</tr>';
            row += '<tr class="thu-hocphan">';
            row += '<td colspan="2" style=""><span>Thứ:</span>' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="gv-hocphan">';
            row += '<td colspan="2" style=""><span>Giảng viên:</span>' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr class="tongso-hocphan">';
            // row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td colspan="2" style=""><span>Tổng số:</span>' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            aData.SOLOPTHUOCCUNGNHOM == 1 ? row += '<td rowspan="2"><div id="' + aData.ID + '" class="btnDangKyHocPhan' + classDangKy + ' poiter" style="background-color: #fa0000' + classDangKy + '">' + lblDangKy + '</div></td>'
               : row += '<td rowspan="2" style="background-color: yellow' + classDangKy + '" id="' + aData.ID + '" class="btnChonHocPhan' + classDangKy + ' poiter">' + lblChonThem + edu.util.returnEmpty(aData.SOLOPTHUOCCUNGNHOM) + '</td>';
            row += '</tr>';
            row += '<tr class="dangky-hocphan">';
            // row += '<td style="text-align: left"><span>Đã đăng ký:</span></td>';
            row += '<td colspan="2" style=""><span>Đã đăng ký:</span>' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="phi-hocphan">';
            row += '<td colspan="3" style="">' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + ' VND</td>';
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
    genList_PhuongAn: function (data, iPager, bCheckOfset) {
        var me = this;
        var row = '';
        data.forEach(e => {
            row += '<div class="filter-plan-reg-item pointer btnPhuongAn" id="' + e.ID + '" name="' + e.TENNHOM + '">';
            row += '<a class="btn">';
            row += '<span>' + e.TENNHOM + '</span>';
            row += '<i class="fal fa-arrow-right"></i>';
            row += '</a>';
            row += '</div>';
        })
        $("#DSPhuongAn").html(row);
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
        //console.log(me.getIdByZone("zoneChuongTrinh"))
        //return;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyMH/DangKyHocTrucTiep',


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
        if (me.bSinhVien || me.arrSinhVien_Id.length == 0) {
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        if (edu.util.checkValue(data.Id)) {
                            edu.system.alert("Đăng ký thành công!");
                            me.getList_KetQuaDangKy();
                            me.getList_HocPhan();
                            //me.getList_TinhTrangTaiChinh();
                        } else {

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
        } else {
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", me.arrSinhVien_Id.length);
            me.arrSinhVien_Id.forEach(e => {
                var obj_Clone = { ...obj_save };
                obj_Clone.strQLSV_NguoiHoc_Id = e.substring(0,32);
                obj_Clone.strDaoTao_ChuongTrinh_Id = e.substring(33);
                console.log(obj_Clone);
                edu.system.makeRequest({
                    success: function (data) {
                        var strMessage = "";
                        if (data.Success) {
                            if (edu.util.checkValue(data.Id)) {
                                //edu.system.alert("Đăng ký thành công!");
                                strMessage = "Đăng ký thành công!";
                               
                                //me.getList_TinhTrangTaiChinh();
                            }
                        }
                        else {
                            //obj_notify = {
                            //    type: "w",
                            //    content: obj_save.action + " (er): " + data.Message,
                            //};
                            //edu.system.alert(obj_save.action + " (er): " + JSON.stringify(data.Message));
                            strMessage = data.Message;
                        }
                        $("#tblSinhVien #lblKetQuaDangKy" + e).html(strMessage);
                        edu.system.alert($("#tblSinhVien tbody tr[id=" + e.substring(0, 32) + "] td:eq(2)").html() + " : " + strMessage);
                    },
                    error: function (er) {

                        //obj_notify = {
                        //    type: "s",
                        //    content: obj_save.action + " (er): " + er,
                        //}
                        edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
                    },
                    type: "POST",
                    action: obj_Clone.action,
                    complete: function () {
                        edu.system.start_Progress("zoneprocessXXXX", function () {
                            me.getList_KetQuaDangKy();
                            me.getList_HocPhan();
                            //edu.util.toggle_overide("zone-bus", "zonebatdau");
                        });
                    },
                    contentType: true,
                    //async: false,
                    data: { strVal: edu.system.atob(JSON.stringify(obj_Clone), "chaolong") },
                    fakedb: [
                    ]
                }, false, false, false, null);
            });
        }
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
                  
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                me.getList_KetQuaDangKy();
                me.getList_HocPhan();

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
            $("#zoneThuocTinh").append('<div id="btnChonThuocTinh' + e.THUOCTINHLOP_ID + '" name="' + e.THUOCTINHLOP_ID + '" class="col-lg-3 filterNhomLopHocPhan">'
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
            row += '<tr class="name-hocphan">';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr class="day-hocphan">';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" style="">Xem chi tiết</td>';
            row += '</tr>';
            row += '<tr class="thu-hocphan">';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="giangvien-hocphan">';
            row += '<td colspan="2" style="">Giảng viên:' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr class="tongso-hocphan">';
            // row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td colspan="2" style="">Tổng số:' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2"><div class="style="background-color: yellowgreen" id="' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '" class="btnChonNhomLopHocPhan">Chọn lớp ' + aData.THUOCTINHLOP_TEN + '</div></td>'
            row += '</tr>';
            row += '<tr class="dangky-hocphan">';
            // row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td colspan="2" style="">Đã đăng ký:' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
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
            row += '<div class="col-sm-3 item-hocphan">';
            row += '<div class="box-hocphan" id="zoneChon' + aData.ID + '" style="width: 99%; ' + mau + '">';
            row += '<table class="table " style="text-align: center;">';
            row += '<tbody>';
            row += '<tr  class="name-hocphan">';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '" name="' + aData.DANGKY_LOPHOCPHAN_ID + '"  title="' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '" class="btnChiTietLopHocPhan poiter"><a href="#">' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '</a></td>';
            row += '<td style="width: 80px;" class= "' + edu.util.returnEmpty(aData.MANHOMLOP) + '">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr  class="doilich-hocphan">';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" id="' + aData.ID + '" class="btnDoiLich poiter" rowspan="3" style=""> Đổi lịch</td>';
            row += '</tr>';
            row += '<tr class="day-gv-hocphan">';
            row += '<td colspan="2" style="" class="day-hocphan">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="gv-hocphan">';
            row += '<td colspan="2" style=""> Giảng viên: ' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr class="tongso-hocphan">';
            // row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td colspan="2" style="">Tổng số:' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2" id="' + aData.ID + '" class="btnHuyHocPhan poiter" style="background-color: red"> Hủy</td>';
            row += '</tr>';
            row += '<tr class="dangky-hocphan">';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="phi-hocphan">';
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
            row += '<div class="col-lg-3 item-hocphan">';
            row += '<div class="box-hocphan">';
            row += '<table class="table" style="text-align: center;">';
            row += '<tbody>';
            row += '<tr class="name-hocphan">';
            row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
            row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
            row += '</tr>';
            row += '<tr class="day-hocphan">';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
            row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
            row += '<td height="10" rowspan="3" name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '" class="btnChiTietLopHocPhan poiter">Xem chi tiết</td>';
            row += '</tr>';
            row += '<tr class="thu-hocphan">';
            row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="gv-hocphan">';
            row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
            row += '</tr>';
            row += '<tr class="tongso-hocphan">';
            row += '<td style=" text-align: left">Tổng số:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
            row += '<td rowspan="2" style="background-color: yellowgreen" id="' + aData.ID + '" name="' + aData.THUOCTINHLOP_ID + '" class="btnDoiNhomLopHocPhan">Đổi lớp ' + aData.THUOCTINHLOP_TEN + '</td>';
            row += '</tr>';
            row += '<tr class="dangky-hocphan">';
            row += '<td style="text-align: left">Đã đăng ký:</td>';
            row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
            row += '</tr>';
            row += '<tr class="phi-hocphan">';
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
        var obj_list = {
            'action': 'TC_ThongTin/LayDSTinhTrangTaiChinhDKH',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
            'action': 'DKH_Chung/LayLichTuanTheoLopHocPhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strKhoaKiemTraDuLieu': edu.util.uuid(),
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
                }, {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIOBATDAU) + ":" + edu.util.returnEmpty(aData.PHUTBATDAU);
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIOKETTHUC) + ":" + edu.util.returnEmpty(aData.PHUTKETTHUC);
                    }
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
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
            renderPlace: ["dropSearch_HeDaoTao"],
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
    
    getList_HSSV: function (dLocTheoDuLieuImport) {
        var me = this;
        if (!dLocTheoDuLieuImport) dLocTheoDuLieuImport = -1;
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
            'func': 'pkg_hosohocvien.LayDanhSachHoSo',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_Lop"),
            'dLocTheoDuLieuImport': dLocTheoDuLieuImport,
            'strDaoTao_CT_DinhHuong_Id': edu.util.getValById('dropSearch_DinhHuong'),
            'strDaoTao_CT_DH_Nhom_Id': edu.util.getValById('dropSearch_NhomDinhHuong'),
            'strQLSV_TrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default

        };
        console.log(obj_save)
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
                    me.genTable_HSSV(dtResult, iPager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HSSV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DangKy.getList_HSSV()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mData": "MASO",

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewDK poiter" id="' + aData.ID + '" title="Sửa">' + aData.MASO + '</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "NGANH"
                },
                {
                    "mDataProp": "DAOTAO_CT_DINHHUONG_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CT_DH_NHOM_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TRANGTHAI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + "_" + aData.NGANH_ID + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblKetQuaDangKy' + aData.ID + '"></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.DangKy.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
        main_doc.DangKy.getList_HSSV();
    },
    getList_PhuongAn: function (strTKB_NhomKiemSoat_Id) {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayDSLopHocPhanTheoNhomKS',
            'type': 'GET',
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

    delete_Import: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'DKH_Import/Xoa_DangKy_NguoiHoc_Import',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
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

            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_KhongDangKy();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_DinhHuong: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_DinhHuong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DinhHuong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_DinhHuong"],
            title: "Chọn định hướng"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_NhomDinhHuong: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP',
            'func': 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_CT_DinhHuong_Id': edu.util.getValById('dropSearch_DinhHuong'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_NhomDinhHuong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NhomDinhHuong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_NhomDinhHuong"],
            title: "Chọn nhóm định hướng"
        };
        edu.system.loadToCombo_data(obj);
    },
}