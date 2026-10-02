/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 14/05/2018
--Input: 
--Output:
--API URL: 
--Note:
----------------------------------------------*/
function TinhHinhHocPhi() { };
TinhHinhHocPhi.prototype = {
    strUser_Id: '',
    strHSSV_Id: '',
    dtTinhTrangTaiChinh: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial this
        -------------------------------------------*/
        $(".btnDetail_KhoanPhaiNop").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản phải nộp");
            $("#finance_detail").modal("show");
            me.getList_KhoanPhaiNop();
        });
        $(".btnDetail_KhoanDuocMien").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản được miễn");
            $("#finance_detail").modal("show");
            me.getList_KhoanDuocMien();
        });
        $(".btnDetail_KhoanDaNop").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản đã nộp");
            $("#finance_detail").modal("show");
            me.getList_KhoanDaNop();
        });
        $(".btnDetail_KhoanDaRut").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản đã rút");
            $("#finance_detail").modal("show");
            me.getList_KhoanDaRut();
        });
        $(".btnDetail_NoRiengTungKhoan").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản nợ riêng");
            $("#finance_detail").modal("show");
            me.getList_NoRiengTungKhoan();
        });
        $(".btnDetail_NoChungCacKhoan").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản nợ chung");
            $("#finance_detail").modal("show");
            me.getList_NoChungCacKhoan();
        });
        $(".btnDetail_DuRiengCacKhoan").click(function () {
            $("#lblLoaiKhoanThu").html(" khoản dư riêng");
            $("#finance_detail").modal("show");
            me.getList_DuRiengCacKhoan();
        });
        $(".btnDetail_DuChungCacKhoan").click(function () {
            $("#lblLoaiKhoanThu").html(" dư chung");
            $("#finance_detail").modal("show");
            me.getList_DuChungCacKhoan();
        });
        $(".btnDetail_PhieuDaThu").click(function () {
            $("#lblLoaiKhoanThu").html(" phiếu đã thu");
            $("#finance_detail").modal("show");
            me.getList_PhieuDaThu();
        });
        $(".btnDetail_PhieuDaRut").click(function () {
            $("#lblLoaiKhoanThu").html(" phiếu đã rút");
            $("#finance_detail").modal("show");
            me.getList_PhieuDaRut();
        });
        $(".btnDetail_PhieuHoaDon").click(function () {
            $("#lblLoaiKhoanThu").html(" hóa đơn");
            $("#finance_detail").modal("show");
            me.getList_PhieuHoaDon();
        });
        
        $("#tblChiTietKhoan").delegate('.detail_PhieuHoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu");
        });
        
        me.strUser_Id = edu.system.userId;
        me.strHSSV_Id = edu.system.userId;
        me.getDetail_DoiTuong();
        me.getList_TinhTrangTaiChinh();
    },
    getDetail_DoiTuong: function (strId) {
        var me = this;

        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP',
            'func': 'pkg_hosohocvien.LayThongTinChiTietHoSo',
            'iM': edu.system.iM,
            'strId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.viewForm_DoiTuong(data.Data[0]);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    viewForm_DoiTuong: function (data) {
        var me = this;
        
        var strHoTen = edu.util.checkEmpty(data.HODEM) +  " " + edu.util.checkEmpty(data.TEN);
        var strMa = edu.util.checkEmpty(data.MASO);
        var strSoDienThoai = edu.util.checkEmpty(data.TTLL_DIENTHOAICANHAN);
        $("#lblHoTen").html(strHoTen);
        $("#lblMaSV").html(strMa);
        $("#lblSDT").html(strSoDienThoai);
        
        //[2]. TinhTrang
        var strTrangThai_Ten = edu.util.returnEmpty(data.TRANGTHAINGUOIHOC_N1_TEN);
        var strTrangThai_Ma = edu.util.returnEmpty(data.TRANGTHAINGUOIHOC_N1_MA);
        var colorLable = '';

        switch (strTrangThai_Ma) {
            case "CHUYENTRUONGDI":
            case "CHUYENTRUONG":
            case "KHONGXACDINH":
            case "FORCEDROPOUT":
            case "CANHBAO":
            case "DROPOUT":
            case "XOATEN":
            case "DUNGHOC":
                colorLable = 'debt';
                break;
            case "NORMAL":
            case "RESERVE":
            case "REPEATE":
                colorLable = 'residual';
                break;
            case "GRADUATE":
            default:
                colorLable = 'complate';
                break;
        }
        document.getElementById("lblTinhTrang").classList.add(colorLable);
        if (strTrangThai_Ten) $("#lblTinhTrang").html(strTrangThai_Ten);
        else $("#lblTinhTrang").remove();
    },

    /*------------------------------------------
    --Discription: [3] GET DATA TinhTrangTaiChinh ==> 
    -------------------------------------------*/
    getList_TinhTrangTaiChinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIVKC8pFTMgLyYVICgCKSgvKQPP',
            'func': 'pkg_taichinh_thongtin.LayDSTinhTrangTaiChinh',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguonDuLieu_Id': ''
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtTinhTrangTaiChinh = data.Data;
                    me.genHTML_TongCacKhoanThu(data.Data.rsThongTin[0]);
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
    /*------------------------------------------
    --Discription: [3] Generating html TinhTrangTaiChinh
    --ULR: Modules
    -------------------------------------------*/
    genTable_TinhTrangTaiChinh: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: { center: [0, 7] },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoLuong' + aData.ID + '" class="inputsoluong" value="1" style="width: 50px"></input>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoTien' + aData.ID + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"></input>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" name="' + aData.DAOTAO_THOIGIANDAOTAO_ID + '" id="' + aData.TAICHINH_CACKHOANTHU_ID + '" title="' + aData.HETHONGCHUNGTU_MA + '">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTableId, [5]);
            $("#" + strTableId + " tfoot tr td:eq(6)").attr("style", "text-align: right; font-size: 20px; padding-right: 20px");
        } else {
            $("#" + strTableId + " tfoot").html('');
        }
    },

    genTable_TheoDot: function (dataDot, dataNo, dataDu) {
        var me = this;
        for (var i = 0; i < dataDot.length; i++) {
            var arrDot_No = edu.util.objGetDataInData(dataDot[i].ID, dataNo, "TAICHINH_DOTCONGNO_ID");
            var arrDot_Du = edu.util.objGetDataInData(dataDot[i].ID, dataDu, "TAICHINH_DOTCONGNO_ID");
            var iTongNo = 0;
            var iTongDu = 0;
            for (var j = 0; j < arrDot_No.length; j++) {
                iTongNo += parseFloat(arrDot_No[i].SOTIEN);
            }
            for (var j = 0; j < arrDot_Du.length; j++) {
                iTongDu += parseFloat(arrDot_Du[i].SOTIEN);
            }
            var row = "";
            row += '<div class="panel">';
            row += '<div id="key_' + dataDot[i].ID + '" class="box-header with-border btnGetData">';
            row += '<h3 class="box-title">';
            row += '<a data-toggle="collapse" data-parent="#key_' + dataDot[i].ID + '" href="#qt_' + dataDot[i].ID + '" aria-expanded="true" class="collapsed">';
            row += '<span class="lang" key=""> Đợt ' + dataDot[i].TENDOT + '</span>';
            row += '</a>';
            row += '</h3>';
            row += '</div';
            row += '<div id="qt_' + dataDot[i].ID + '" class="panel-collapse collapse in" aria-expanded="true">';
            row += '<div class="box-body">';
            row += '<div style="color: red">Nợ theo đợt</div>';
            row += '<div class="zone-content scroll-table-x bg-none">';
            row += '<table id="tblNo_' + dataDot[i].ID + '" class="table table-hover table-bordered">';
            row += '<thead>';
            row += '<tr>';
            row += '<th class="td-fixed td-center">Stt</th>';
            row += '<th class="td-center">Học kỳ</th>';
            row += '<th class="td-center">Đợt</th>';
            row += '<th class="td-center">Khoản nợ</th>';
            row += '<th class="td-center">Nội dung</th>';
            row += '<th class="td-center">Số tiền</th>';
            row += '</tr>';
            row += '</thead>';
            row += '<tbody></tbody>';
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongNo) + '</td></tr></tfoot>';
            row += '</table>';
            row += '</div>';
            row += '<div style="color: green">Dư theo đợt</div>';
            row += '<div class="zone-content scroll-table-x bg-none">';
            row += '<table id="tblDu_' + dataDot[i].ID + '" class="table table-hover table-bordered">';
            row += '<thead>';
            row += '<tr>';
            row += '<th class="td-fixed td-center">Stt</th>';
            row += '<th class="td-center">Học kỳ</th>';
            row += '<th class="td-center">Đợt</th>';
            row += '<th class="td-center">Khoản nợ</th>';
            row += '<th class="td-center">Nội dung</th>';
            row += '<th class="td-center">Số tiền</th>';
            row += '</tr>';
            row += '</thead>';
            row += '<tbody></tbody>';
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongDu) + '</td></tr></tfoot>';
            row += '</table>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            $("#tab_8").html(row);
            GenData('tblNo_' + dataDot[i].ID, arrDot_No);
            GenData('tblDu_' + dataDot[i].ID, arrDot_Du);
        }
        function GenData(strTableId, data) {

            var jsonForm = {
                strTable_Id: strTableId,
                aaData: data,
                "aoColumns": [
                    {
                        "mDataProp": "DAOTAO_THOIGIANDAOTAO_HOCKY"
                    }
                    , {
                        "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                    }
                    , {
                        "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                    }
                    , {
                        "mDataProp": "NOIDUNG",
                    }
                    , {
                        "mData": "SOTIEN",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIEN);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
    },

    /*------------------------------------------
   --Discription: [4] Generating html TinhTrangTaiChinh
   --ULR: Modules
   -------------------------------------------*/
    eventTongTien: function (strTableId) {
        var me = this;
        // Hiển thị tổng tiền sau khi click mỗi checkbox trong table
        // Thêm màu nền khi chọn và bỏ chọn
        $("#MainContent").delegate('#' + strTableId + ' input[type="checkbox"]', "click", function () {
            var checked_status = $(this).is(':checked');
            if (checked_status) {
                this.parentNode.parentNode.classList.add('tr-bg');
            }
            else {
                this.parentNode.parentNode.classList.remove('tr-bg');
            }
            me.show_TongTien(strTableId);
        });
    },
    show_TongTien: function (strTableId) {
        //Tìm tất cả checkbox đang check trong bảng loại bỏ phần dư thừa rồi cộng lại để hiện tổng trên cùng cạnh sinh viên
        setTimeout(function () {
            var sum = edu.system.countFloat(strTableId, 6, 7, 5);
            var strTongThu = "Tổng tiền đã chọn: " + edu.util.formatCurrency(sum);
            $("#lbSoTienDaChon").html("/ " + strTongThu);
            edu.system.insertSumAfterTable(strTableId, [6]);
        }, 100);
    },
    /*------------------------------------------
    --Discription: [5] ACCESS DATA ==> ChiTiet KhoanThu
    --ULR: Modules
    --Update: nnthuong/26/07/2018
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            'iM': edu.system.iM,
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
                    var data = data.Data;
                    me.genList_DMLKT(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ChiTietKhoanThu: function (strzone) {
        var me = this;
        switch (strzone) {
            case "#zoneChiTietPhaiNop": getList_KhoanPhaiNop(); break;
            case "#zoneChiTietDuocMien": getList_KhoanDuocMien(); break;
            case "#zoneChiTietDaNop": getList_KhoanDaNop(); break;
            case "#zoneChiTietDaRut": getList_KhoanDaRut(); break;
            case "#zoneTongNoRieng": getList_NoRiengTungKhoan(); break;
            case "#zoneTongNoChung": getList_NoChungCacKhoan(); break;
            case "#zoneTongDuRieng": getList_DuRiengCacKhoan(); break;
            case "#zoneTongDuChung": getList_DuChungCacKhoan(); break;
            case "#zonePhieuDaThu": getList_PhieuDaThu(); break;
            case "#zonePhieuDaRut": getList_PhieuDaRut(); break;
        }
    },

    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-4 checkbox-inline user-check-print; pull-left">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="ckbLKT_HDBL' + dataKhoanThu[i].ID + '" class="ckbLKT_HDBL" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanThu").html(row);
        //me.getList_KhoanThu();
    },
    getList_KhoanPhaiNop: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLxEpICgPLjEP',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanPhaiNop',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_KhoanPhaiNop(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDuocMien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLwwoJC8P',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanMien',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_KhoanDuocMien(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaNop: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLwUgDy4x',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanDaNop',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_KhoanDaNop(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaRut: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLwUgEzQ1',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanDaRut',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_KhoanDaRut(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoRiengTungKhoan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLw8uEygkLyYP',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanNoRieng',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_NoRiengTungKhoan(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLw8uAik0LyYP',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanNoChung',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_NoChungCacKhoan(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuRiengCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLwU0EygkLyYP',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanDuRieng',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_DuRiengCacKhoan(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIKKS4gLwU0Aik0LyYP',
            'func': 'pkg_taichinh_thongtin.LayDSKhoanDuChung',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_DuChungCacKhoan(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuDaThu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIRKSgkNAUgFSk0',
            'func': 'pkg_taichinh_thongtin.LayDSPhieuDaThu',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_PhieuDaThu(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuDaRut: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIRKSgkNAUgEzQ1',
            'func': 'pkg_taichinh_thongtin.LayDSPhieuDaRut',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_PhieuDaRut(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuHoaDon: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIRKSgkNAkuIAUuLwPP',
            'func': 'pkg_taichinh_thongtin.LayDSPhieuHoaDon',
            'iM': edu.system.iM,
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_PhieuHoaDon(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [5] GEN HTML ==> ChiTiet KhoanThu
    --ULR: Modules
    --Update: nnthuong/26/07/2018
    -------------------------------------------*/
    genHTML_TongCacKhoanThu: function (data) {
        var me = this;
        var dNoCo = data.NOCO;
        var strHienThi = "";
        if (edu.util.floatValid(dNoCo)) {
            if (dNoCo > 0) strHienThi = '<p class="finance-startus residual"> Tổng dư: ' + edu.util.formatCurrency(dNoCo) + ' đ</p>';
            if (dNoCo < 0) strHienThi = '<p class="finance-startus debt"> Tổng nợ: ' + edu.util.formatCurrency(dNoCo) + ' đ</p>';
            if (dNoCo == 0 && !data.TONGKHOANPHAINOP) strHienThi = '<p class="finance-startus complate"> Đã hoàn thành</p>';
        }
        //[A] Tinh trang chung
        $(".noco-phieuthu").html(strHienThi);

        //[B] Tong cac khoan
        //1. TongTien_KhoanPhaiNop
        if (edu.util.floatValid(data.TONGKHOANPHAINOP)) {
            $(".txtTongTien_KhoanPhaiNop").html(edu.util.formatCurrency(data.TONGKHOANPHAINOP));
        } else {
            $(".txtTongTien_KhoanPhaiNop").html(0);
        }
        //2. TongTien_KhoanDuocMien
        if (edu.util.floatValid(data.TONGKHOANDUOCMIEN)) {
            $(".txtTongTien_KhoanDuocMien").html(edu.util.formatCurrency(data.TONGKHOANDUOCMIEN));
        } else {
            $(".txtTongTien_KhoanDuocMien").html(0);
        }
        //3. TongTien_KhoanDaNop
        if (edu.util.floatValid(data.TONGKHOANDANOP)) {
            $(".txtTongTien_KhoanDaNop").html(edu.util.formatCurrency(data.TONGKHOANDANOP));
        } else {
            $(".txtTongTien_KhoanDaNop").html(0);
        }
        //4. TongTien_KhoanDaRut
        if (edu.util.floatValid(data.TONGKHOANDARUT)) {
            $(".txtTongTien_KhoanDaRut").html(edu.util.formatCurrency(data.TONGKHOANDARUT));
        } else {
            $(".txtTongTien_KhoanDaRut").html(0);
        }
        //5. TongTien_NoRiengTungKhoan
        if (edu.util.floatValid(data.TONGNORIENG)) {
            $(".txtTongTien_NoRiengTungKhoan").html(edu.util.formatCurrency(data.TONGNORIENG));
        } else {
            $(".txtTongTien_NoRiengTungKhoan").html(0);
        }
        //6. TongTien_NoChungCacKhoan
        if (edu.util.floatValid(data.TONGNOCHUNG)) {
            $(".txtTongTien_NoChungCacKhoan").html(edu.util.formatCurrency(data.TONGNOCHUNG));
        } else {
            $(".txtTongTien_NoChungCacKhoan").html(0);
        }
        //7. TongTien_DuRieng
        if (edu.util.floatValid(data.TONGDURIENG)) {
            $(".txtTongTien_DuRieng").html(edu.util.formatCurrency(data.TONGDURIENG));
        } else {
            $(".txtTongTien_DuRieng").html(0);
        }
        //8. TongTien_DuChung
        if (edu.util.floatValid(data.TONGDUCHUNG)) {
            $(".txtTongTien_DuChung").html(edu.util.formatCurrency(data.TONGDUCHUNG));
        } else {
            $(".txtTongTien_DuChung").html(edu.util.formatCurrency(data.TONGDUCHUNG));
        }
        //9. TongTien_PhieuDaThu
        if (edu.util.floatValid(data.TONGTIENPHIEUTHU)) {
            $(".txtTongTien_PhieuDaThu").html(edu.util.formatCurrency(data.TONGTIENPHIEUTHU));
        } else {
            $(".txtTongTien_PhieuDaThu").html(0);
        }
        //10. TongTien_PhieuDaRut
        if (edu.util.floatValid(data.TONGTIENPHIEURUT)) {
            $(".txtTongTien_PhieuDaRut").html(edu.util.formatCurrency(data.TONGTIENPHIEURUT));
        } else {
            $(".txtTongTien_PhieuDaRut").html(0);
        }
        //10. TongTien_PhieuHoaDon
        if (edu.util.floatValid(data.TONGTIENHOADON)) {
            $(".txtTongTien_PhieuHoaDon").html(edu.util.formatCurrency(data.TONGTIENHOADON));
        } else {
            $(".txtTongTien_PhieuHoaDon").html(0);
        }

    },
    genDetail_KhoanPhaiNop: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5],
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_KhoanDuocMien: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền được miễn</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);

        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_KhoanDaNop: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Số chứng từ</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);

        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Chứng từ:</em> <span>' + edu.util.returnEmpty(aData.CHUNGTU_SO) + '</span>';
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_KhoanDaRut: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_NoRiengTungKhoan: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_NoChungCacKhoan: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },

            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_DuRiengCacKhoan: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },

            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_DuChungCacKhoan: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Học kỳ:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO) + '</span>';
                    }
                }
                , {
                    "mData": "DAOTAO_THOIGIANDAOTAO_DOT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đợt:</em> <span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + '</span>';
                    }
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại khoản:</em> <span>' + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + '</span>';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em> <span>' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mData": "NGAYTAO_DD_MM_YYYY",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày tạo:</em> <span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                }
                , {
                    "mData": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người tạo:</em> <span>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genDetail_PhieuDaThu: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Số phiếu</th>';
        thead += '<th class="td-right"><span class="lang" key="">Tổng tiền</span></th>';
        thead += '<th class="td-center">Ngày thu</th>';
        thead += '<th class="td-center">Người thu</th>';
        thead += '<th class="td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                center: [0, 1, 3, 4,5],
                right: [2]
            },
            "aoColumns": [
                {
                    "mData": "SOPHIEUTHU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số phiếu:</em> <span>' + edu.util.returnEmpty(aData.SOPHIEUTHU) + '</span>';
                    }
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mData": "NGAYTHU_DD_MM_YYYY_HHMMSS",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày thu:</em> <span>' + edu.util.returnEmpty(aData.NGAYTHU_DD_MM_YYYY_HHMMSS) + '</span>';
                    }
                }
                , {
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người thu:</em> <span>' + edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU) + '</span>';
                    }
                }
                , {
                    "mData": "Chitiet",
                    "mRender": function (nRow, aData) {
                        return '<a class="detail_KhoanThu" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [2]);
            $('#' + $table + ' tfoot td:eq(2)').attr('style', 'text-align: right');
        }
    },
    genDetail_PhieuDaRut: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Số phiếu</th>';
        thead += '<th class="td-right"><span class="lang" key="">Tổng tiền</span></th>';
        thead += '<th class="td-center">Ngày thu</th>';
        thead += '<th class="td-center">Người thu</th>';
        thead += '<th class="td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                center: [0, 1, 3, 4, 5],
                right: [2]
            },
            "aoColumns": [
                {
                    "mData": "SOPHIEUTHU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số phiếu:</em> <span>' + edu.util.returnEmpty(aData.SOPHIEUTHU) + '</span>';
                    }
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mData": "NGAYTHU_DD_MM_YYYY_HHMMSS",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày thu:</em> <span>' + edu.util.returnEmpty(aData.NGAYTHU_DD_MM_YYYY_HHMMSS) + '</span>';
                    }
                }
                , {
                    "mData": "TAIKHOAN_NGUOIRUT",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người rút:</em> <span>' + edu.util.returnEmpty(aData.TAIKHOAN_NGUOIRUT) + '</span>';
                    }
                }
                , {
                    "mData": "Chitiet",
                    "mRender": function (nRow, aData) {
                        return '<a class="detail_KhoanRut" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [2]);
            $('#' + $table + ' tfoot td:eq(2)').attr('style', 'text-align: right');
        }
    },
    genDetail_PhieuHoaDon: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoan";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Số phiếu</th>';
        thead += '<th class="td-right"><span class="lang" key="">Tổng tiền</span></th>';
        thead += '<th class="td-center">Ngày thu</th>';
        thead += '<th class="td-center">Người thu</th>';
        thead += '<th class="td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                center: [0, 1, 3, 4, 5],
                right: [2]
            },
            "aoColumns": [
                {
                    "mData": "SOPHIEUTHU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số phiếu:</em> <span>' + edu.util.returnEmpty(aData.SOPHIEUTHU) + '</span>';
                    }
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mData": "NGAYTHU_DD_MM_YYYY_HHMMSS",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày thu:</em> <span>' + edu.util.returnEmpty(aData.NGAYTHU_DD_MM_YYYY_HHMMSS) + '</span>';
                    }
                }
                , {
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người thu:</em> <span>' + edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU) + '</span>';
                    }
                }
                , {
                    "mData": "Chitiet",
                    "mRender": function (nRow, aData) {
                        return '<a class="detail_PhieuHoaDon" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [2]);
            $('#' + $table + ' tfoot td:eq(2)').attr('style', 'text-align: right');
        }
    },
    showTongTien: function (strTable_id, arrCol) {
        var x = document.getElementById(strTable_id).rows;
        for (var i = 0; i < arrCol.length; i++) {
            for (var j = 1; j < x.length; j++) {
                var pointTemp = x[j].cells[arrCol[i]];
                var strTemp = pointTemp.innerHTML;
                pointTemp.style = "text-align: right;";
                pointTemp.innerHTML = '<span style="padding-right: 35%">' + strTemp + '</span>';
            }
        }
    },

    /*------------------------------------------
    --Discription: [7] 
    --ULR: Modules
    -------------------------------------------*/
    getList_ChiTietKhoanMien: function (strTaiChinh_Mien_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIFKCQvBSAoAikoFSgkNQwoJC8P',
            'func': 'pkg_taichinh_thongtin.LayDSDienDaiChiTietMien',
            'iM': edu.system.iM,
            'strTaiChinh_Mien_Id': strTaiChinh_Mien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_ChiTietKhoanPhaiNop(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_ChiTietKhoanPhaiNop: function (strTaiChinh_PhaiNop_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThongTin_MH/DSA4BRIFKCQvBSAoAikoFSgkNREpICgPLjEP',
            'func': 'pkg_taichinh_thongtin.LayDSDienDaiChiTietPhaiNop',
            'iM': edu.system.iM,
            'strTaiChinh_PhaiNop_Id': strTaiChinh_PhaiNop_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_ChiTietKhoanPhaiNop(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_ChiTietKhoanPhaiNop: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChiTietKhoanThu",
            colPos: { center: [0], right: [3] },
            aaData: data,
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                }
                , {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "SOTINCHI"
                }
                , {
                    "mDataProp": "KIEUHOC_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTableId, [3]);
    },
}