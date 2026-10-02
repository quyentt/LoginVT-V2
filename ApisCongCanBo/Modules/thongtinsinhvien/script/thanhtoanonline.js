function thanhtoanonline() { };

thanhtoanonline.prototype = {
    dtThanhToan: [],
    strMaSinhVien: '',
    strSinhVienId: '',
    MaDonHang_Gui_NganHang: '',
    strCreatedDate: '',
    strKhongChoPhepSuaSoTien: '',
    strMaGiaoDich: '',
    init: function () {
        var me = this;
        me.eventTongTien("tblThanhToan");
        $("#tblThanhToan").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tblThanhToan");
        });
        $("[id$=chkSelectAll_ThanhToan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThanhToan" });
        });
        $("#btnThucHienThanhToan").click(function () {

            if (edu.util.getValById("drpNganHang") == "" || edu.util.getValById("drpNganHang") == undefined) {
                edu.system.alert("Vui lòng chọn ngân hàng để thanh toán");
                return;
            }

            var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhToan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn khoản cần thanh toán");
                return;
            }
            if ("#BIDV#SHB#VTB#VIB".indexOf(edu.util.getValById("drpNganHang")) != -1) {
                me.save_ThanhToanDonHang(arrChecked_Id.toString());
                return;
            }

            edu.system.confirm("Bạn có chắc chắn thanh toán?");
            function getSoTien(dSoTien, dRecovery) {
                //var dSoTien = $("#lbThanhTien" + strId).html();
                dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
                dSoTien = parseFloat(dSoTien);
                return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
            }
            $("#btnYes").click(function (e) {
                me.strErr = "";
                var DonHangChiTietIds = "";
                var SoTiens = "";
                var NoiDungs = me.strMaSinhVien + "_" + edu.util.getValById("drpNganHang") + "_";
                var strclientIP = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtThanhToan, "ID");
                    DonHangChiTietIds += arrChecked_Id[i] + "|";
                    // NoiDungs += dt[0].NOIDUNG + "^";  
                    SoTiens += getSoTien(edu.util.getValById("txtSoTien" + arrChecked_Id[i]), 0) + "|";

                }

                if (arrChecked_Id.length > 0) {
                    DonHangChiTietIds = DonHangChiTietIds.substr(0, DonHangChiTietIds.length - 1);
                    SoTiens = SoTiens.substr(0, SoTiens.length - 1);
                    NoiDungs += DonHangChiTietIds + "^";
                    NoiDungs = NoiDungs.substr(0, NoiDungs.length - 1);
                }

                me.ThucHienThanhToan(DonHangChiTietIds, SoTiens, NoiDungs);
            });
        });
        me.page_load();
        $("#btnSearch").click(function () {
            if (edu.util.getValById("txtSearch_TuKhoa") == "") {
                edu.system.alert("Bạn chưa nhập mã sinh viên");
                return;
            }
            me.getList_HSSV();
        });

    },

    page_load: function () {
        var me = this;
        edu.system.page_load();
        
        me.getList_CauHinhThanhToan();
        me.getList_drpNganHang();
    },
    ThucHienThanhToan: function (DonHangChiTietIds, SoTiens, NoiDungs) {

        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'CTT_ThongTinKetNoi/KetNoiVNPAY',
            'versionAPI': "v1.0",
            'DonHangChiTietIds': DonHangChiTietIds,
            'SoTiens': SoTiens,
            'NoiDungs': NoiDungs,
            'vnp_TmnCode': edu.util.getValById("drpNganHang"),
            'MaDonHang_Gui_NganHang': me.MaDonHang_Gui_NganHang,
            'CreatedDate': me.strCreatedDate,


        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    window.location.replace(data.Data);

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

    getList_tblThanhToan: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'CTT_HocPhi/VanTin',
            'versionAPI': "v1.0",
            'ServiceId': "VNPAY_ONLINE",
            'MaNganHang': "VNPAY",
            'MaSinhVien': me.strSinhVienId,
            'ChuKy': "",
        };
        var obj_list = {
            'action': 'TC_TCThanhToan/LayThongTinTaiChinh',
            'type': 'GET',
            'strMaSinhVien': me.strSinhVienId,
            'strMaNganHang': "VNPAY",
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtThanhToan = data.Data.rsChiTiet;
                    edu.util.viewHTMLById("lblHoTen1", data.Data.rsSinhVien[0].HOVATEN);
                    edu.util.viewHTMLById("lblMaSinhVien", data.Data.rsSinhVien[0].MASINHVIEN);
                    edu.util.viewHTMLById("lblNgaySinh", data.Data.rsSinhVien[0].NGAYSINH);
                    edu.util.viewHTMLById("lblLopQuanLy", data.Data.rsSinhVien[0].LOP);
                    edu.util.viewHTMLById("lblNganh", data.Data.rsSinhVien[0].NGANH);
                    edu.util.viewHTMLById("lblKhoa", data.Data.rsSinhVien[0].KHOADAOTAO);
                    me.MaDonHang_Gui_NganHang = data.Data.rs[0].MADONHANG_GUI_NGANHANG;
                    me.strCreatedDate = data.Data.rs[0].NGAYTAODONHANG;
                    me.strMaSinhVien = data.Data.rsSinhVien[0].MASINHVIEN;
                    me.genTable_tblThanhToan(data.Data.rsChiTiet);

                    me["dtVanTin"] = data.Data;
                }
                else {
                    me.dtThanhToan = null;
                    edu.util.viewHTMLById("lblHoTen1", "");
                    edu.util.viewHTMLById("lblMaSinhVien", "");
                    edu.util.viewHTMLById("lblNgaySinh", "");
                    edu.util.viewHTMLById("lblLopQuanLy", "");
                    edu.util.viewHTMLById("lblNganh", "");
                    edu.util.viewHTMLById("lblKhoa", "");
                    me.MaDonHang_Gui_NganHang = null;
                    me.strCreatedDate = "";
                    me.strMaSinhVien = "";
                    me.genTable_tblThanhToan(null);

                    me["dtVanTin"] = null;
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
    genTable_tblThanhToan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThanhToan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 4],
            },
            aoColumns: [
                {
                    "mRender": function (nrow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em><span id="lblNoiDung' + aData.ID + '">' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<input type="text" disabled id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"  />';

                        if (me.strKhongChoPhepSuaSoTien == "0")
                            strHTML = '<input type="text"  id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"  />';
                        return strHTML;
                    }
                },
                {
                    "mData": "GHICHU",
                    "mRender": function (nrow, aData) {
                        return '<em class="show-in-mobi">Ghi chú:</em><span>' + edu.util.returnEmpty(aData.GHICHU) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox"  name="' + aData.ID + '" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblThanhToan", [2]);


        $("#tblThanhToan" + " tfoot tr td:eq(2)").attr("style", "text-align: center; font-size: 20px; padding-right: 20px");
        setTimeout(() => {
            if (Array.isArray(data)) {
                data.forEach(e => {
                    if (e.BATBUOC == 1) {
                        var x = $("#tblThanhToan #checkX" + e.ID);
                        if (x.length > 0) {
                            $(x).prop('checked', true);
                            $(x).prop('disabled', true);
                            $("#chkSelectAll_ThanhToan").hide();
                        }
                    }
                });
            }
        }, 500);  
        var sum = edu.system.countFloat("tblThanhToan", 2, 4);
        var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
        $("#lbSoTienDaChon").html(strTongThu);


        /*III. Callback*/
    },
    show_TongTien: function (strTableId) {
        //Tìm tất cả checkbox đang check trong bảng loại bỏ phần dư thừa rồi cộng lại để hiện tổng trên cùng cạnh sinh viên
        setTimeout(function () {
            var sum = edu.system.countFloat(strTableId, 2);
            edu.system.insertSumAfterTable(strTableId, [2]);
        }, 100);
    },
    getList_drpNganHang: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'VNPAY.NGANHANG',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpNganHang(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpNganHang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "THONGTIN1",
                code: "THONGTIN2",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["drpNganHang"],
            type: "",
            title: "Chọn ngân hàng"
        };
        edu.system.loadToCombo_data(obj);


        if (data.length == 1) {
            $("#drpNganHang").val(data[0].MA).trigger("change");
        }
    },
    getList_CauHinhThanhToan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'VNPAY.CAUHINHTHANHTOAN',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strKhongChoPhepSuaSoTien = "1";

                    if (data.Data.length > 0) {
                        var dt = edu.util.objGetDataInData("KHONGCHOPHEPSUASOTIEN", data.Data, "MA");
                        if (dt.length > 0)
                            me.strKhongChoPhepSuaSoTien = dt[0].THONGTIN1;
                    }
                    me.getList_tblThanhToan();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },

    save_ThanhToanDonHang: function (strThanhToan_DonHang_CT_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_TCThanhToan/XacNhanThanhToanDonHang',
            'type': 'POST',
            'strThanhToan_DonHang_CT_Id': strThanhToan_DonHang_CT_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj_notify = {
                    //    type: "s",
                    //    content: "Thêm mới thành công!",
                    //}
                    //edu.system.alertOnModal(obj_notify);
                    me.strMaGiaoDich = data.Data;
                    me.getList_QRCode(data.Data);
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
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
    getList_QRCode: function (code) {
        var me = this;
        var strMaSinhVien = me.dtVanTin.rs[0].MASINHVIEN;
        var strHoTen = me.dtVanTin.rs[0].HOVATEN;
        var strTkAo = me.dtVanTin.rs[0].TKAO;
        var dSoTien = 0;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhToan", "checkX");
        arrChecked_Id.forEach(e => {
            dSoTien += parseFloat(me.dtThanhToan.find(ele => ele.ID == e).SOTIEN);
        })
        var serviceId = $("#drpNganHang option:selected").attr("name");
        var strName = $("#drpNganHang").val();
        var obj_notify = {};
        var strVal = {};
        console.log(arrChecked_Id[0]);
        console.log(me.dtVanTin.rsChiTiet);

        var strNoiDung = me.dtVanTin.rsChiTiet.find(e => e.ID == arrChecked_Id[0]).NOIDUNG;
        strNoiDung = edu.system.change_alias(strNoiDung);
        var dateServer = edu.util.getServerTime();
        var date = new Date(dateServer);
        var year = date.getFullYear();
        var month = edu.util.addZeroToDate(date.getMonth() + 1);
        var day = edu.util.addZeroToDate(date.getDate());
        var hour = edu.util.addZeroToDate(date.getHours());
        var minute = edu.util.addZeroToDate(date.getMinutes());
        var second = edu.util.addZeroToDate(date.getSeconds());
        switch (strName) {
            case "BIDV": strVal = {
                "serviceId": serviceId,
                "code": code,
                "name": strMaSinhVien + " " + strHoTen,
                "amount": dSoTien.toString(),
                "description": strNoiDung.replace(/_/g, ' ')
            }; break;
            case "VTB": strVal = {
                "requestId": edu.util.uuid(),
                "providerId": "DHLAMNGHIEP",
                "merchantId": "0500465853",
                "clientDt": year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + ".632Z",
                "channel": "internal",
                "version": "0.0.1",
                "language": "en",
                "clientIP": "",
                "signature": "JcJg4S7qF8G3B9OlJQoZsGx8dtyPDmsYKNub6hCZFh51tnnRG+1Up/R0mtmGWoOxsqGTdIWSdGwiqxrOvsRPH62Elz9JAYDT1RHphlemrmxcy+4YWihPYOEGIhn8kfCq+LiMKatort3xPDT6G4DTsVmnY29MyIkA/vgDe8br39v7kN6n7URuMWJzsEiO4xjmPk8ZUmobkTJrkxPgLAX+K9MTZ9xCg2iQNj3QInG/fzEo/3J+VhlN4uGl3wdgaaUontRc40GfqGFtyuS+gPsH84kyeMF8L3FRKyQ1WnqyhLsuM4hY2dd1H3g7kWghzXOPhrkYLUxQEB0gS0m8Sh3FNA==",
                "data": {
                    "merchantName": "DHLAMNGHIEP",
                    "terminalId": "TDHLAMNGHIEP",
                    "productId": "",
                    "orderId": code,
                    "amount": dSoTien,
                    "payMethod": "QR",
                    "transactionDate": year + month + day + hour + minute + second,
                    "currencyCode": "VND",
                    "remark": strNoiDung,
                    "transTime": year + month + day + hour + minute + second,
                    "imageSize": "200"
                }
            }; break;
            default: strVal = {
                "strMaSinhVien": strMaSinhVien,
                "strHoVaTen": strHoTen,
                "strMaDonHang": code,
                "strNoiDung": strNoiDung,
                "strTaiKhoanAo": strTkAo,
                "strSoTien": dSoTien.toString()
            }; break;
        }



        //--Edit
        var obj_save = {
            'action': 'CTT_' + strName + 'Payment/VanTinQRCode',
            'type': 'POST',
            'strKey': '',
            'strVal': JSON.stringify(strVal),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //return;
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Success) {
                        me.getList_tblThanhToan();
                        var strQRData = "";
                        var iBase64 = true;
                        switch (strName) {
                            case "BIDV": {
                                var obj = JSON.parse(data.Data);
                                if (obj.errorCode) {
                                    if (obj.errorCode == "000") {
                                        strQRData = obj.vietQRImage;

                                    } else {
                                        edu.system.alert("Lỗi :" + obj.errorCode + " : " + obj.errorDesc);
                                        return;
                                    }
                                } else {
                                    if (obj.msg.header.errorCode == "000") {
                                        strQRData = obj.msg.body.vietQRImage;

                                    } else {
                                        edu.system.alert("Lỗi :" + obj.msg.header.errorCode + " : " + obj.msg.header.errorDesc);
                                        return;
                                    }
                                }

                            }; break;
                            case "VTB": {
                                //iBase64 = false;
                                var obj = JSON.parse(data.Data);

                                if (obj.status.statusCode == "00") {
                                    strQRData = obj.data.qrData;


                                } else {
                                    edu.system.alert("Lỗi :" + obj.status.statusCode + " : " + obj.status.statusDesc);
                                    return;
                                }
                            }; break;
                            case "VIB": {
                                //iBase64 = false;
                                var obj = JSON.parse(data.Data);

                                if (obj.Result.statusCode == "000000") {
                                    strQRData = obj.Result.DATA.qrImage;


                                } else {
                                    edu.system.alert("Lỗi :" + obj.status.statusCode + " : " + obj.status.statusDesc);
                                    return;
                                }
                            }; break;
                            default: strQRData = data.Data;
                        }
                        if (strQRData) {

                            edu.system.alert('<p class="italic" style="color: blue; margin-bottom: unset">' + code + " - " + edu.util.formatCurrency(dSoTien) + '</p><p class="italic" style="color: blue; margin-bottom: unset">' + strMaSinhVien + " - " + strHoTen + '</p><img src="data:image/png;base64, ' + strQRData + '" alt="Red dot" />');
                            setTimeout(function () {
                                me.getList_CheckThanhToan(code);
                            }, 10000)
                        }
                        else edu.system.alert("Không lấy được mã QR");
                    } else {
                        edu.system.alert(data.Message);
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
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
    getList_CheckThanhToan: function (strMaDonHangTongHop) {
        var me = this;

        if (!main_doc.thanhtoanonline || strMaDonHangTongHop != me.strMaGiaoDich) return;
        //--Edit
        var obj_list = {
            'action': 'TC_TCThanhToan/KiemTraGachNoTheoDonHang',
            'type': 'GET',
            'strMaDonHangTongHop': strMaDonHangTongHop,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        $("#alert_content").html("");
                        edu.system.alert('<span class="italic" style="color: green; font-size: 40px">Thanh toán thành công</span>');
                        me.strMaGiaoDich = "";
                        me.getList_tblThanhToan();

                    } else {
                        setTimeout(function () {
                            me.getList_CheckThanhToan(strMaDonHangTongHop);
                        }, 3000);
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    eventTongTien: function (strTableId) {
        var me = this;
        // Hiển thị tổng tiền sau khi click mỗi checkbox trong table
        // Thêm màu nền khi chọn và bỏ chọn

        $("#Maininfo").delegate('#' + strTableId + ' input[type="checkbox"]', "click", function () {
            var checked_status = $(this).is(':checked');

            if (checked_status) {
                this.parentNode.parentNode.classList.add('tr-bg');
            }
            else {
                this.parentNode.parentNode.classList.remove('tr-bg');
            }

            var sum = edu.system.countFloat(strTableId, 2, 4);
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienDaChon").html(strTongThu);

            me.show_TongTien(strTableId);
        });
    },
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000

        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];

                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    console.log(dtResult);
                    me.strSinhVienId = "";
                    me.strMaSinhVien = dtResult[0].MASO;
                    if (dtResult.length == 1) {
                        me.strSinhVienId = dtResult[0].ID;
                        me.strMaSinhVien = dtResult[0].MASO;
                    }
                    me.getList_CauHinhThanhToan();
                    me.getList_drpNganHang();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}

