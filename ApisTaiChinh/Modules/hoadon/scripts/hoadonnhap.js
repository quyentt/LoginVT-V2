/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function HoaDonNhap() { };
HoaDonNhap.prototype = {
    dtMau: '',
    dtChungTu: '',
    strMau_Id: '',
    strSo_Id: '',
    dtMauIn: [],
    idemHoaDon: 0,
    iSLHoaDon: 0,
    strLoaiHoaDon: '',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        
        edu.system.pageSize_default = 24;
        edu.extend.addNotify();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.getList_HDN();
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnSearch_HoaDon").click(function () {
            var strTuKhoa = edu.util.getValById('txtKeyword_Search_HoaDon').trim();
            edu.system.pageIndex_default = 1;
            me.getList_HDN(strTuKhoa);
        });
        $("#txtKeyword_Search_HoaDon").keypress(function (e) {
            if (e.which === 13) {
                var strTuKhoa = edu.util.getValById('txtKeyword_Search_HoaDon').trim();
                edu.system.pageIndex_default = 1;
                me.getList_HDN(strTuKhoa);
            }
        });
        $('.rdLoaiPhieu_HoaDon').on('change', function (e) {
            e.stopImmediatePropagation();
            edu.system.pageIndex_default = 1;
            me.getList_HDN();
        });
        $("#MainContent").delegate('.viewchungtu', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#btnHuyHoaDon").show();
            me.strSo_Id = this.id;
            $("#MauInHoaDon").html('<iframe src="'+ $(this).attr("name") +'" width="100%" height="600px"></iframe >');
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
        });
        
        $("#btnXuat_HD").click(function (e) {
            var json = edu.util.objGetDataInData(me.strSo_Id, me.dtChungTu, "ID")[0];
            if (json.PHANLOAI == "CHUATHU") {
                me.getList_HDN_ChuaThu(me.strSo_Id, json.MOTA, json.PHANLOAI);
            }
            else{
                me.getList_HDN_DaThu(me.strSo_Id, json.MOTA, json.PHANLOAI);
            }
            return false;
        });
        $("#btnCloseHoaDon").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#zoneThongTinPhieuThu").slideUp('slow');
            $("#MainContent").slideDown('slow');
            return false;
        });
        $("#btnHuyHoaDon").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn hủy bản nháp không!');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_HDN();
            });
            return false;
        });
        me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });

    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    saveHDDT: function (data, strPhuongThuc_MA, strLoai) {
        var me = this;
        var strTaiChinh_CacKhoanThu_Ids = [];
        var strSoTien_s = [];
        var strNoiDung_s = "";
        var strDonGia_s = [];
        var strSoLuong_s = [];
        var arrDonViTinh = [];
        var arrDonViTinhTen = [];
        var arrLoaiTienTe = [];
        for (var i = 0; i < data.length; i++) {
            strTaiChinh_CacKhoanThu_Ids.push(data[i].TAICHINH_CACKHOANTHU_ID);
            strSoTien_s.push(data[i].SOTIEN);
            strDonGia_s.push(data[i].DONGIA);
            strSoLuong_s.push(data[i].SOLUONG);
            arrDonViTinh.push(data[i].DONVITINH_ID);
            arrDonViTinhTen.push(data[i].DONVITINH_TEN);
            arrLoaiTienTe.push(data[i].LOAITIENTE_ID);
            //strNoiDung_s.push(data[i].NOIDUNG);
            strNoiDung_s += "#" + data[i].NOIDUNG;
        }
        if (strNoiDung_s != "") strNoiDung_s = strNoiDung_s.substring(1); 
        linkHDDT = edu.system.strhost +  edu.system.objApi["HDDT"].replace(/api/g, '');
        var strLoaiDoiTuong = "";
        if (strPhuongThuc_MA.indexOf("DOITUONGKHAC")) {
            strPhuongThuc_MA = strPhuongThuc_MA.substring(0, strPhuongThuc_MA.indexOf("$"));
            strLoaiDoiTuong = "DOITUONGKHAC";
        }
        
        var obj_save = {
            'action': 'TC_DaNop/ThemMoi',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids.toString(),
            'strTaiChinh_SoTien_s': strSoTien_s.toString(),
            'strTaiChinh_NoiDung_s': strNoiDung_s,
            'strDonGia_s': strDonGia_s.toString(),
            'strSoLuong_s': strSoLuong_s.toString(),
            'strDonViTinh_Ids': arrDonViTinh.toString(),
            'strDonViTinhTen_s': arrDonViTinhTen.toString(),
            'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
            'strCanDoiKhoanPhaiNop': '',
            'strLoaiTienTe': data[0].LOAITIENTE_MA,
            'strQLSV_NguoiHoc_Id': data[0].QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': data[0].DAOTAO_THOIGIANDAOTAO_ID,
            'strDaoTao_ToChucCT_Id': "",
            'strHinhThucThu_Id': data[0].HINHTHUCTHU_ID,
            'strHinhThucThu_MA': data[0].HINHTHUCTHU_MA,
            'strHinhThucThu_TEN': data[0].HINHTHUCTHU_TEN,
            'strXuatHoaDonTrucTiep': '',
            'strNguonDuLieu_Id': '',
            'dKhongSinhChungTu': 0,
            'strPhieuThuTheoPhoiSan_Id': '',
            'strPhuongThuc_MA': strPhuongThuc_MA,
            'strLoaiDoiTuong': strLoaiDoiTuong,
            'strNhap_HoTenNguoiMuaHang': data[0].NHAP_HOTENNGUOIMUAHANG,
            'bTenNguoiThu': true,
        };
        if (strLoaiDoiTuong != "DOITUONGKHAC") obj_save.bTenNguoiThu = false;

        if (strLoai == "CHUATHU") save_ThuTien(); else saveHDDT();
        function save_ThuTien() {
            obj_save.acaction = 'TC_DaNop/ThemMoi';
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        if (linkHDDT != "" && linkHDDT != undefined) {
                            var strIDS = data.Message;
                            obj_save.strTaiChinh_CacKhoanThu_Ids = strIDS;
                            saveHDDT(obj_save);
                        } else {
                            informSaveSuccess(data.Message);
                        }
                    }
                    else {
                        edu.system.alert("Lỗi: " + data.Message, "w");
                        edu.extend.notifyBeginLoading(data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.extend.notifyBeginLoading(JSON.stringify(er));
                    edu.system.endLoading();
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

        function saveHDDT(obj_save) {
            obj_save.action = 'HDDT_HoaDon/ThemMoi';
            edu.system.makeRequest({
                success: function (d) {
                    if (d.Success) {
                        var strPhieuThu_Id = d.Id;
                        me.updateHDDT();
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON");
                        informSaveSuccess(d.Message);
                    }
                    else {
                        edu.system.alert("Lỗi: " + d.Message, "w");
                        informSaveSuccess(d.Message);
                    }
                },
                error: function (er) {
                    edu.extend.notifyBeginLoading(JSON.stringify(er));
                    edu.system.endLoading();
                },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null, linkHDDT, true);
        }

        function informSaveSuccess(data) {
            $("#zoneThongTinPhieuThu").slideUp('slow');
            $("#MainContent").slideDown('slow');
            $("#MauInHoaDon").html("");
        }
    },

    updateHDDT: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_HoaDonNhap/CapNhat',
            'versionAPI': 'v1.0',
            'strId': me.strSo_Id,
            'strQLSV_NguoiHoc_Id': '',
            'strMoTa': '',
            'dDaXuatChinhThuc': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xuất hóa đơn thành công");
                    me.getList_HDN();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message );
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " : " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HDN: function (strTuKhoa) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TC_HoaDonNhap/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_Id': '',
            'dDaXuatChinhThuc': 0,
            'strNguoiThucHien_Id': '',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChungTu = data.Data;
                    me.genHTML_HDN(data.Data, data.Pager);
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
    getList_HDN_ChuaThu: function (strTaiChinh_HoaDonNhap_Id, strPhuongThuc_MA, strLoai) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TC_HoaDonNhap_ChuaThu/LayDanhSach',
            'strTaiChinh_HoaDonNhap_Id': strTaiChinh_HoaDonNhap_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.saveHDDT(data.Data, strPhuongThuc_MA, strLoai);
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
    getList_HDN_DaThu: function (strTaiChinh_HoaDonNhap_Id, strPhuongThuc_MA, strLoai) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TC_HoaDonNhap_DaThu/LayDanhSach',
            'strTaiChinh_HoaDonNhap_Id': strTaiChinh_HoaDonNhap_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.saveHDDT(data.Data, strPhuongThuc_MA, strLoai);
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
    delete_HDN: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_HoaDonNhap/Xoa',
            'versionAPI': 'v1.0',
            'strIds': me.strSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_HDN();
                    $("#zoneThongTinPhieuThu").slideUp('slow');
                    $("#MainContent").slideDown('slow');

                    edu.extend.notifyBeginLoading('Xóa nháp thành công');
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
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] ACTION HTML ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    genHTML_HDN: function (data, iPager) {
        var me = this;
        me.beginLoadPag('zonePhieuThu_HoaDon', 'main_doc.HeThongHoaDon.getList_HDN()', iPager)
        if (data === null || data === undefined || data.length === 0) {
            return;
        }
        var html = '';
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = 'viewchungtu';
        var strTongTien = 0;
        if (data.length > 0) {
            strTongTien = edu.util.formatCurrency(data[0].TONGTIENDAXUATHOADON);
        }
        $("#txtTongTien").html(strTongTien);

        for (var i = 0; i < data.length; i++) {
            html += '<div class="col-sm-2 ' + iLoaiChungTu + '" id="' + data[i].ID + '" name="' + edu.system.objApi["HDDT"].replace(/api/g, '') + "\\" + data[i].DUONGDANFILEHOADON + '">';
            html += '<div class="box-mini">';
            html += '<p>Họ tên: <span class="' + iLoaiPhieu + ' pull-right underline">#' + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_TEN) + '</span></p>';
            html += '<p>Tổng tiền: <span class="' + iLoaiPhieu + ' pull-right">' + edu.util.formatCurrency(data[i].SOTIEN) + '</span></p>';
            html += '<p>Người tạo: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITA_TENDAYDU) + '</span></p>';
            html += '<p>Ngày tạo: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zonePhieuThu_HoaDon").html(html);
        $(".popover").replaceWith('');
    },
    popover_HDN: function (strHS_Id, point) {
        var me = this;
        var data = null;
        for (var i = 0; i < me.dtChungTu.length; i++) {
            if (strHS_Id === me.dtChungTu[i].ID)
                data = me.dtChungTu[i];
        }
        var row = "";
        row += '<div class="pcard" style="width: 330px; float: left; padding-left: 0px; margin-top: -7px; font-size: 18px"></td>';
        row += '<table>';
        row += '<tbody>';
        row += '<tr>';
        row += '<td><i class="fa fa-empire colorcard"></i> <span class="lang" key="">Số</span></td><td>: ' + edu.util.checkEmpty(data.SOHOADON) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa fa-star colorcard"></i> <span class="lang" key="">Năm</span></td><td>: ' + edu.util.checkEmpty(data.TAICHINH_HOADON_NAM) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa fa-expeditedssl colorcard"></i> <span class="lang" key="">Tổng tiền tiền</span></td><td>: ' + edu.util.formatCurrency(data.TONGTIEN) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa fa-users colorcard"></i> <span class="lang" key="">Người cập nhật</span></td><td>: ' + edu.util.checkEmpty(data.NGUOICUOI_TENDAYDU) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa fa-users colorcard"></i> <span class="lang" key="">Ngày cập nhật</span></td><td>: ' + edu.util.checkEmpty(data.NGAYCUOI_DD_MM_YYYY_HHMMSS) + '</td>';
        row += '</tr>';
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'top',
        });
        $(point).popover('show');
    },
    /*------------------------------------------
	--Discription: [3] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    beginLoadPag: function (strzoneId, strFuntionName, iDataRow) {
        //Dữ liệu null
        if (edu.util.checkValue(iDataRow) && iDataRow > 0) {
            //Trước đó chưa hiển thị phân trang thì sẽ hiển thị phân trang
            if (document.getElementsByClassName("zone-pag-footer" + strzoneId).length === 0) {
                edu.system.pagInfoRender(strzoneId);
                //Thay đổi sang ô tìm kiếm
                //edu.system.insertFilterToTable(strzoneId, strFuntionName);
                //Tùy chọn thay đổi change
                edu.system.insertChangLenghtToTable([[24, 30, 50, 100, 200, -1], [24, 30, 50, 100, 200, 'Tất cả']], strzoneId);
                //Tùy chọn Cập nhật lại PageSizechange
                $("#dropPageSizechange" + strzoneId).val(edu.system.pageSize_default).trigger('change');
                //Tạo dải phân cách giữa 2 thằng sau sẽ xóa
                $(".zone-pag-clear" + strzoneId).replaceWith('');
                $("#" + strzoneId).before('<div class="zone-pag-clear' + strzoneId + '" style="clear: both;"></div>');
            }
            edu.system.pagButtonRender(strFuntionName, strzoneId, iDataRow);
        } else {
            $(".zone-pag-footer" + strzoneId).replaceWith('');
            $(".change-" + strzoneId).html('');
            $(".light-pagination" + strzoneId).remove();
            $("#" + strzoneId).html("Không tìm thấy dữ liệu");
        }
    },
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauInHoaDon");
        var mywindow = window.open('', 'Print', 'height=600,width=800');
        mywindow.document.write("http://localhost:51952\HDDTFILE\60d38ce2207643ad975c0c71b9531ec3.pdf");

        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();
        $("#zoneThongTinPhieuThu").slideUp('slow');
        $("#MainContent").slideDown('slow');
    },
    changeWidthPrint: function () {
        //Thay đổi vùng in
        var lMauInPhieuThu = document.getElementById("MauInHoaDon").offsetWidth;
        if (lMauInPhieuThu > 700) lMauInPhieuThu += 240;
        else {
            lMauInPhieuThu = 1250;
        }
        var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        if (lMainPrint > lMauInPhieuThu) {
            document.getElementById('zoneThongTinPhieuThu').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
            document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneThongTinPhieuThu').style.paddingLeft = "20px";
            document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        }
        //
        //Tùy chọn in theo liên
        edu.extend.genChonLien("MauInHoaDon", "zoneLienHoaDon");
    },
    //
    /*------------------------------------------
	--Discription: [3] ACTION HTML ==> In nhiều hóa đơn 1 lúc
	--Author:  
	-------------------------------------------*/
    genMauHoaDon_DT: function (data) {
        var me = this;
        var strSoHoaDon_Id = data.ID;
        edu.extend.getData_Phieu(strSoHoaDon_Id, "HOADON", "MauInHoaDon", main_doc.HeThongHoaDon.onsuccess_GetPhieu, true);
    },
    onsuccess_GetPhieu: function (data) {
        var me = main_doc.HeThongHoaDon;
        if (data.length != 32) {//Length == 32 tương ứng với trả không có dữ liệu trả về thì sẽ xóa nội dung trong phiếu 
            var strSoPhieuThu_id = data.CHUNGTU_ID;
            $("#divshow" + strSoPhieuThu_id).addClass('callsuccess');
            $("#ishow" + strSoPhieuThu_id).attr('class', 'fa fa-file-text');
            me.dtMauIn.push(strSoPhieuThu_id);
        }
        else {
            $("#DSHoaDon #zoneHoaDon" + data).replaceWith('');
        }
        main_doc.HeThongHoaDon.printf_LoHoaDon();
    },
    printf_LoHoaDon: function () {
        var me = this;
        edu.system.iSoLuong--;
        me.idemHoaDon++;
        //var iper = Math.round((((me.idemHoaDon / me.iSLHoaDon) * 100)), 0);
        //document.getElementById("percentInDS").style.width = iper + "%";
        edu.system.start_Progress("zonepercentInDSA", me.idemHoaDon);

        if (me.idemHoaDon == me.iSLHoaDon) {
            //Tắt ẩn hiện trạng thái in liên
            //$("#zonepercentInDS").hide();
            //document.getElementById("percentInDS").style.width = "0%";
            //edu.system.endLoading();
            //Xóa phôi in liên nếu có
            edu.extend.remove_PhoiIn("MauInHoaDon");
            //Hiện thị form view hóa đơn
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
            //
            me.genChonLien("MauInHoaDon" + me.dtMauIn[0], "zoneLienHoaDon");
            //
            $("MauInHoaDon").html("");
            //Xóa trang trắng do in theo lô sinh ra
            var LienHoaDon = $("#MauInHoaDon p[style = 'page-break-before: always;']");
            $(LienHoaDon[LienHoaDon.length -1]).replaceWith('');
        }
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
                me.showLien("MauInHoaDon" + me.dtMauIn[i], iVitri);
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
    }
}