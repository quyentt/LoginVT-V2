function tracuuthongtinnoptienvnpay() { };
tracuuthongtinnoptienvnpay.prototype = {
    dtLichSuThanhToanOnline: [],
    dtChiTietLichSuThanhToanOnline: [],
    strHangDoiGuiEmail_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnSearch_ThongTinThanhToanGuiVNPay").click(function () {

            me.getListLichSuThanhToanOnline();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getListLichSuThanhToanOnline();
            }
        });
        $("#tblLichSuThanhToanOnline").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strKyThi_Id = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtLichSuThanhToanOnline, "ID");
            if (dt.length > 0) {
                me.dtChiTietLichSuThanhToanOnline = dt;
                me.toggle_edit();
                
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $(".btn_ThucHienGachNo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLichSuThanhToanOnline", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn giao dịch gạch nợ");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện gạch nợ?");
            $("#btnYes").click(function (e) {
                me.strErr = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtLichSuThanhToanOnline, "ID");
                    var strBodyText = "";
                    strBodyText = '{ "ServiceId": "", "NoiDungThanhToan_TongHop":' +
                        '{' +
                        '       "MaSinhVien": "' + dt[0].MASINHVIEN + '", ' +
                        '       "MaDonHang_Gui_NganHang": "' + dt[0].MADONHANG_GUI_NGANHANG + '",' +
                        '       "KenhGiaoDich": "VNPAY_ONLINE",' +
                        '       "ChungTuThanhToan_NganHang": "' + dt[0].TXNREF + '",' +
                        '       "SoTienThanhToan": "' + dt[0].SOTIENVNPAY + '",' +
                        '       "TaiKhoan": "' + dt[0].NGANHANG+'",' +
                        '       "NgayThanhToan": null ' +
                        '},' +
                        ' "NoiDungThanhToan_ChiTiet": [{' +
                        '"                              ThuTu": null,' +
                        '"                              Id": null,' +
                        '"                              NoiDung": null,' +
                        '"                              SoTien": null' +
                        '}], "ChuKy": ""'+
                        '}';
                    console.log(strBodyText);
                   // strBodyText='{"ServiceId":"","NoiDungThanhToan_TongHop":{"MaSinhVien":"18405103010013","MaDonHang_Gui_NganHang":"b688bce4082442598594119d8cf27439_5","KenhGiaoDich":"VNPAY_ONLINE","ChungTuThanhToan_NganHang":"13501326","SoTienThanhToan":"225000","TaiKhoan":"NCB","NgayThanhToan":null},"NoiDungThanhToan_ChiTiet":[{"ThuTu":null,"Id":null,"NoiDung":null,"SoTien":null}],"ChuKy":""}';
                    me.ThucHienGachNoRetrivie(strBodyText);
                }

            });
            setTimeout(function () {
                me.getListLichSuThanhToanOnline();
            }, 2000);
        });


    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        console.log(me.dtChiTietLichSuThanhToanOnline);
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        edu.util.viewHTMLById("lblMaSinhVien", me.dtChiTietLichSuThanhToanOnline[0].MASINHVIEN);
        edu.util.viewHTMLById("lblHovaTenSinhVien", me.dtChiTietLichSuThanhToanOnline[0].HOVATENSINHVIEN);
        edu.util.viewHTMLById("lblLop", me.dtChiTietLichSuThanhToanOnline[0].LOP);
        edu.util.viewHTMLById("lblNganh", me.dtChiTietLichSuThanhToanOnline[0].NGANHDAOTAO);
        edu.util.viewHTMLById("lblKhoa", me.dtChiTietLichSuThanhToanOnline[0].KHOADAOTAO);
        edu.util.viewHTMLById("lblMaGiaoDichGuiVNPay", me.dtChiTietLichSuThanhToanOnline[0].MADONHANG_GUI_NGANHANG);        
        edu.util.viewHTMLById("lblSoTienGuiSangVNPay", edu.util.formatCurrency(me.dtChiTietLichSuThanhToanOnline[0].SOTIENPHAINOP));
        edu.util.viewHTMLById("lblNgayGuiVNPAY", me.dtChiTietLichSuThanhToanOnline[0].NGAYTAODH_DD_MM_YYYY_HHMMSS);
        edu.util.viewHTMLById("lblMaGiaoDichNhanTuVNPAY", me.dtChiTietLichSuThanhToanOnline[0].VNP_TRANSACTIONNO);
        edu.util.viewHTMLById("lblSoTienNhanTuVNPay", edu.util.formatCurrency(me.dtChiTietLichSuThanhToanOnline[0].SOTIENVNPAY));  
        edu.util.viewHTMLById("lblTrangThaiGiaoDichNhanTuVNPay", me.dtChiTietLichSuThanhToanOnline[0].TRANSACTIONSTATUS);
        edu.util.viewHTMLById("lblThongTinGiaoDichNhanTuVNPay", me.dtChiTietLichSuThanhToanOnline[0].VNP_MESSAGE);
    },
    rewrite: function () {
        var me = this;
        edu.util.viewHTMLById("lblMaSinhVien", "");
        edu.util.viewHTMLById("lblHovaTenSinhVien", "");
        edu.util.viewHTMLById("lblLop", "");
        edu.util.viewHTMLById("lblNganh", "");
        edu.util.viewHTMLById("lblKhoa", "");
        edu.util.viewHTMLById("lblMaGiaoDichGuiVNPay", "");
        edu.util.viewHTMLById("lblSoTienGuiSangVNPay", "");
        edu.util.viewHTMLById("lblNgayGuiVNPAY", "");
        edu.util.viewHTMLById("lblMaGiaoDichNhanTuVNPAY", "");
        edu.util.viewHTMLById("lblSoTienNhanTuVNPay", "");
        edu.util.viewHTMLById("lblTrangThaiGiaoDichNhanTuVNPay", "");
        edu.util.viewHTMLById("lblThongTinGiaoDichNhanTuVNPay", "");
    },


    getListLichSuThanhToanOnline: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_TraCuuHocPhi/LayDS_LichSuThanhToanOnline',
            'versionAPI': 'v1.0',
            'strNganHangId': "",
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strTuNgay': edu.util.getValById("txtTuNgay"),
            'strDenNgay': edu.util.getValById("txtDenNgay"),
            'strUserId': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLichSuThanhToanOnline = data.Data;
                    
                    me.genTableLichSuThanhToanOnline(data.Data, data.Pager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTableLichSuThanhToanOnline: function (data, iPager) {
        var me = this;
        $("#lblThongTinThanhToanGuiVNPay_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLichSuThanhToanOnline",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.tracuuthongtinnoptienVNPay.getListLichSuThanhToanOnline()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 2, 6],
                left: [1] 
            },
            aoColumns: [
                {
                    "mDataProp": "MASINHVIEN"
                },
                { 
                      "mRender": function (nRow, aData) {
                          return '<span><a class="btn btnEdit" style="font-size: 18px;" id="' + aData.ID + '" title="' + aData.HOVATENSINHVIEN + '"> ' + aData.HOVATENSINHVIEN + '</a></span>';
                    }
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "NGANHDAOTAO"
                },
                {
                    "mDataProp": "KHOADAOTAO"
                }, 
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENPHAINOP);
                    } 
                },
                {
                    "mDataProp": "NGAYTAODH_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "TRANSACTIONSTATUS"
                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    ThucHienGachNoRetrivie: function (strBodyText) {
        var me = this;
        var obj_save = {
            'action': 'CTT_HocPhi/ThucHienGachNo',
            'versionAPI': 'v1.0',            
            'bodyText': strBodyText
        };


        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    //me.getListLichSuThanhToanOnline();

                }
                else {

                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

}