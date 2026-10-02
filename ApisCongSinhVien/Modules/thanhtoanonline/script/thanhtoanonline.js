function thanhtoanonline() { };

thanhtoanonline.prototype = {
    dtThanhToan: [],
    strMaSinhVien: '',
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
            let pointST = this;
            let strSoTien = pointST.value;
            if (strSoTien.indexOf(".") != -1) pointST.value = strSoTien.substring(0, strSoTien.indexOf("."));
            me.show_TongTien("tblThanhToan");
            //var sum = edu.system.countFloat("tblThanhToan", 3, 5);
        });

        $("#tblThanhToan").delegate(".checkchange", "click", function (e) {
            var sum = edu.system.countFloat("tblThanhToan", 3, 6);
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienDaChon").html(strTongThu);
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
            var strNganHang = edu.util.getValById("drpNganHang");
            if ("#BIDV#SHB#VTB#VIB#VTB2#VCB".indexOf(strNganHang) != -1) {
                me.save_ThanhToanDonHang(arrChecked_Id);
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
                var NoiDungs = me.strMaSinhVien + "_" + edu.util.getValById("drpNganHang")+ "_"; 
                var strclientIP = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtThanhToan, "ID");
                    DonHangChiTietIds += arrChecked_Id[i] + "|";                   
                   // NoiDungs += dt[0].NOIDUNG + "^";  
                    SoTiens += getSoTien(edu.util.getValById("txtSoTien" + arrChecked_Id[i]),0) + "|";                                     
                    
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

        $("#btnAdd_NopTruoc").click(function () {
            $("#modalKhoanNopTruoc").modal("show")
        });
        $("#btnSave_KhoanNopTruoc").click(function () {
            me.save_KhoanNopTruoc();
        });
        $("#btnDelete_NopTruoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhToan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhoanNopTruoc(arrChecked_Id[i]);
                }
            });
        }); 
        $("#modalKhoanNopTruoc").delegate(".inputsotien", "keyup", function (e) {
            let temp = $(this).val();
            $(this).val(edu.util.formatCurrencyV2(temp));
        });

        $("#tblThanhToan").delegate(".btnChiTiet", "click", function () {
            var strId = this.id;
            me["strXacNhanChiTiet_Id"] = strId;
            var x = $("#tblThanhToan #checkX" + strId);
            if (x.length > 0) {
                $(x).prop('checked', true);
                $(x).prop('disabled', true);
            }
            me.getList_XacNhanChiTiet(strId);
            $("#modalXacNhanChiTiet").modal("show");
        });
        $("#tblXacNhanChiTiet").delegate(".checkchange", "click", function (e) {
            var sum = edu.system.countFloat("tblXacNhanChiTiet", 5, 8);
            //edu.system.insertSumAfterTable("tblXacNhanChiTiet", [5]);
            var strTongThu = "Tổng tiền đã chọn: <span>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienXacNhanChiTiet").html(strTongThu);
        });
        $("#btnSave_XacNhanChiTiet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXacNhanChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            me.save_ThanhToanChiTiet(arrChecked_Id);
        });

        $('#drpNganHang').on('change', function () {
            if (!edu.util.getValById('drpNganHang')) return;
            me.getList_tblThanhToan();
        });
    },
   
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNganHang();
        me.getList_KhoanNopTruoc();
        //me.getList_CauHinhThanhToan();
        //me.getList_drpNganHang();
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
            'vnp_TmnCode': edu.util.getValById("drpNganHang") ,
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
            'MaSinhVien': edu.system.userId,
            'ChuKy': "",
        };
        var strMaNganHang = edu.util.getValById('drpNganHang');
    
        switch (strMaNganHang) {
            case "VCB": strMaNganHang = "VCB_ONLINE"; break;
            case "BIDV": strMaNganHang = "BIDV_ONLINE"; break;
            case "SHB": strMaNganHang = "SHB"; break;
            case "VTB": strMaNganHang = "VTB_ONLINE"; break;
            case "VIB": strMaNganHang = "VIB_ONLINE"; break;
            default: strMaNganHang = "VNPAY"; break;
        }
        var obj_save = {
            'action': 'TC_ThanhToan_MH/DSA4FSkuLyYVKC8VICgCKSgvKQPP',
            'func': 'pkg_thanhtoan.LayThongTinTaiChinh',
            'iM': edu.system.iM,
            'strMaSinhVien': edu.system.userId,
            'strMaNganHang': strMaNganHang,
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
                    edu.system.alert(" : " + data.Message, "w");
                 
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            authen: true,
            data: obj_save,
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
            bHiddenOrder: true,
            colPos: {
                center: [0, 1, 2, 3, 5],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">STT:</em><span>' + (nRow + 1) + '</span>';
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        return '<em class="show-in-mobi">Nội dung:</em><span id="lblNoiDung' + aData.ID + '">' + edu.util.returnEmpty(aData.NOIDUNG) + '</span>';
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<em class="show-in-mobi">Số tiền:</em><input type="text" disabled id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px;text-align: right"  />';

                        if (aData.DUOCSUASOTIENCHITIET == 1)
                            strHTML = '<em class="show-in-mobi">Số tiền:</em><input type="text"  id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"  />';
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
                    "mData": "GHICHU",
                    "mRender": function (nrow, aData) {
                        return '<span><a class="btn btn-default btnChiTiet" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Chọn:</em><input class="checkchange" type="checkbox"  name="' + aData.ID + '" checked="checked" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);

        $("#tblThanhToan tfoot").html("");
        edu.system.insertSumAfterTable("tblThanhToan", [3]);
      
        
        $("#tblThanhToan" + " tfoot tr td:eq(3)").attr("style", "text-align: center; font-size: 20px; padding-right: 20px");
        $("#tblThanhToan" + " tfoot tr td:eq(0)").attr("style", "display: none");
        data.forEach(e => {
            if (e.BATBUOC == 1) {

                var x = $("#tblThanhToan #checkX" + e.ID);

                $(x).attr('checked', true);
                $(x).prop('checked', true);
                $(x).attr('disabled', true);
                $("#chkSelectAll_ThanhToan").hide();
            }
        });
        setTimeout(function () {
            var sum = edu.system.countFloat("tblThanhToan", 3, 6);
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienDaChon").html(strTongThu);
        }, 200);

       
        /*III. Callback*/
    },
    show_TongTien: function (strTableId) {
        //Tìm tất cả checkbox đang check trong bảng loại bỏ phần dư thừa rồi cộng lại để hiện tổng trên cùng cạnh sinh viên
        setTimeout(function () {
            var sum = edu.system.countFloat(strTableId,3,6);                     
            edu.system.insertSumAfterTable(strTableId, [3]);
            $("#tblThanhToan" + " tfoot tr td:eq(3)").attr("style", "text-align: center; font-size: 20px; padding-right: 20px");
            $("#tblThanhToan" + " tfoot tr td:eq(0)").attr("style", "display: none");
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienDaChon").html(strTongThu);
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
        if (data.length && data[0].HESO1) {
            data.sort(function (a, b) {
                return Number(a.HESO1) - Number(b.HESO1);
            });
        }
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
            title: false
        };
        edu.system.loadToCombo_data(obj);


        if (data.length > 0) {
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

    save_ThanhToanDonHang: function (arrDonHang) {
        var me = this;
        var obj_notify = {};
        let strThanhToan_DonHang_CT_Id = [];
        let dTongTien = 0;
        arrDonHang.forEach(e => {
            let dSoTien = getSoTien(edu.util.getValById("txtSoTien" + e), 0);
            dTongTien += dSoTien;
            strThanhToan_DonHang_CT_Id.push(e + "#" + dSoTien);
        })
        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }
        //--Edit
        var obj_save = {
            'action': 'TC_TCThanhToan/XacNhanThanhToanDonHang',
            'type': 'POST',
            'strThanhToan_DonHang_CT_Id': strThanhToan_DonHang_CT_Id.toString("_"),
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
                    me.getList_QRCode(data.Data, dTongTien);
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
    save_ThanhToanChiTiet: function (arrChecked_Id) {
        var me = this;
        var obj_notify = {};
        let strThanhToan_DonHang_CT_Id = me.strXacNhanChiTiet_Id;
        let dTongTien = 0;
        arrChecked_Id.forEach(e => {
            dTongTien += me.dtXacNhanChiTiet.find(ele => ele.ID == e).SOTIEN;
        })
        strThanhToan_DonHang_CT_Id += "#" + dTongTien + "#" + arrChecked_Id.toString();
        $("#tblThanhToan #txtSoTien" + me.strXacNhanChiTiet_Id).val(edu.util.formatCurrency(dTongTien));
        var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(dTongTien) + "</span>";
        $("#lbSoTienDaChon").html(strTongThu);
        me.show_TongTien("tblThanhToan");
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
                    me.getList_QRCode(data.Data, dTongTien);
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
    getList_QRCode: function (code, dSoTien) {
        var me = this;
        var strMaSinhVien = me.dtVanTin.rs[0].MASINHVIEN;
        var strHoTen = me.dtVanTin.rs[0].HOVATEN;
        var strTkAo = me.dtVanTin.rs[0].TKAO;
        //var dSoTien = 0;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhToan", "checkX");
        //arrChecked_Id.forEach(e => {
        //    dSoTien += parseFloat(me.dtThanhToan.find(ele => ele.ID == e).SOTIEN);
        //})
        var serviceId = $("#drpNganHang option:selected").attr("name");
        var strName = $("#drpNganHang").val();
        if (strName.indexOf("_") != -1) strName = strName.split('_')[0];
        var obj_notify = {};
        var strVal = {};
        console.log(arrChecked_Id[0]);
        console.log(me.dtVanTin.rsChiTiet);

        //var strNoiDung = me.dtVanTin.rsChiTiet.find(e => e.ID == arrChecked_Id[0]).NOIDUNG; 
        var strNoiDung = me.dtVanTin.rs[0].NOIDUNG;
        if (!strNoiDung) strNoiDung = me.dtVanTin.rsChiTiet.find(e => e.ID == arrChecked_Id[0]).NOIDUNG;

        strNoiDung = edu.system.change_alias(strNoiDung);
        var dateServer = edu.util.getServerTime();
        var date = new Date(dateServer);
        var year = date.getFullYear();
        var month = edu.util.addZeroToDate(date.getMonth() + 1);
        var day = edu.util.addZeroToDate(date.getDate());
        var hour = edu.util.addZeroToDate(date.getHours());
        var minute = edu.util.addZeroToDate(date.getMinutes());
        var second = edu.util.addZeroToDate(date.getSeconds());
        var strNoiDung2 = strMaSinhVien + " " + edu.system.change_alias(strHoTen)
        switch (strName) {
            case "BIDV": strVal = {
                "serviceId": serviceId,
                "code": code,
                "name": strMaSinhVien + " " + strHoTen,
                "amount": dSoTien.toString(),
                "description": strNoiDung.replace(/_/g, ' ')
            }; break;
            case "VTB": {
                strVal = {
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
                        "amount": "" + dSoTien,
                        "payMethod": "QR",
                        "transactionDate": "" + (year + 1).toString() + month.toString() + day.toString() + hour.toString() + minute.toString() + second.toString(),
                        "currencyCode": "VND",
                        "remark": strNoiDung,
                        "transTime": "" + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString() + second.toString(),
                        "imageSize": "200"
                    }
                };
            } break;

            case "VTB2": strVal = {
                "requestId": edu.util.uuid(),
                "providerId": "",
                "merchantId": "",
                "clientDt": year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + ".632Z",
                "channel": "internal",
                "version": "0.0.1",
                "language": "en",
                "clientIP": "",
                "signature": "JcJg4S7qF8G3B9OlJQoZsGx8dtyPDmsYKNub6hCZFh51tnnRG+1Up/R0mtmGWoOxsqGTdIWSdGwiqxrOvsRPH62Elz9JAYDT1RHphlemrmxcy+4YWihPYOEGIhn8kfCq+LiMKatort3xPDT6G4DTsVmnY29MyIkA/vgDe8br39v7kN6n7URuMWJzsEiO4xjmPk8ZUmobkTJrkxPgLAX+K9MTZ9xCg2iQNj3QInG/fzEo/3J+VhlN4uGl3wdgaaUontRc40GfqGFtyuS+gPsH84kyeMF8L3FRKyQ1WnqyhLsuM4hY2dd1H3g7kWghzXOPhrkYLUxQEB0gS0m8Sh3FNA==",
                "data": {
                    "accountNumber": edu.util.returnEmpty(serviceId) + code,
                    "amount": "" + dSoTien,
                    "storeLabel": code,
                    "referenceLabel": code,
                    "customerLabel": code,
                    "msgId": code,
                    "purposeOfTrans": strNoiDung2.substring(0, 70),
                    "terminalLabel": "1"
                }
            }; break;
            default: strVal = {
                "strMaSinhVien": strMaSinhVien,
                "strHoVaTen": strHoTen,
                "strMaDonHang": code,
                "strNoiDung": strNoiDung,
                "strNoiDung2": strNoiDung2,
                "strTaiKhoanAo": strTkAo,
                "strSoTien": dSoTien.toString()
            }; break;
        }


         
        //--Edit
        var obj_save = {
            'action': 'CTT_' + strName +'Payment/VanTinQRCode',
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
                        //me.getList_tblThanhToan();
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
                            case "VTB2": {
                                //iBase64 = false;
                                var obj = data.Data;
                                strQRData = obj;
                            }; break;
                            case "VIB": {
                                //iBase64 = false;
                                var obj = JSON.parse(data.Data);

                                if (obj.Result.STATUSCODE == "000000") {
                                    strQRData = obj.Result.DATA.qrImage;
                                } else {
                                    edu.system.alert("Lỗi :" + obj.status.STATUSCODE);
                                    return;
                                }
                            }; break;
                            default: strQRData = data.Data;
                        }
                        if (strQRData) {

                            edu.system.alert('<p class="italic" style="color: blue; margin-bottom: unset">' + code + " - " + edu.util.formatCurrency(dSoTien) + '</p><p class="italic" style="color: blue; margin-bottom: unset">' + strMaSinhVien + " - " + strHoTen + '</p><img src="data:image/png;base64, ' + strQRData + '" alt="Red dot"  style="max-width: 365px;"  />');
                            setTimeout(function () {
                                me.getList_CheckThanhToan(code);
                            }, 30000)
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
                        }, 10000);
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

            var sum = edu.system.countFloat(strTableId, 3, 6);
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
            $("#lbSoTienDaChon").html( strTongThu);
            
            me.show_TongTien(strTableId);
        });
    },


    getList_KhoanNopTruoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThanhToan_NopTruoc_MH/DSA4BRIKKS4gLw8uMRUzNC4i',
            'func': 'PKG_THANHTOAN_NOPTRUOC.LayDSKhoanNopTruoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDetail_KhoanNopTruoc(data.Data);
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
    genDetail_KhoanNopTruoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectFirst: true,
            },
            renderPlace: ["dropKhoanNopTruoc"],
            title: "Chọn khoản"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) $("#zonebtnNopTruoc").show();
    },
    save_KhoanNopTruoc: function (strDaoTao_ThoiGian_KH_Id) {
        var me = this;
        var aData = me["dtVanTin"].rsSinhVien[0];
        var obj_save = {
            'action': 'TC_ThanhToan_NopTruoc_MH/FSkkLB4VICgCKSgvKR4RKSAoDy4xHg8uMRUzNC4i',
            'func': 'PKG_THANHTOAN_NOPTRUOC.Them_TaiChinh_PhaiNop_NopTruoc',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aData.ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'dSoTien': edu.system.getValById('txtSoTienNopTruoc'),
            'strNoiDung': edu.system.getValById('txtNoiDungNopTruoc'),
            'strTaiChinh_CacKhoanThu_Id': edu.system.getValById('dropKhoanNopTruoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#modalKhoanNopTruoc").modal("hide");
                    me.getList_tblThanhToan();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhoanNopTruoc: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_ThanhToan_NopTruoc_MH/GS4gHg8uMRUzNC4iHgUuLwkgLyYeAikoFSgkNQPP',
            'func': 'PKG_THANHTOAN_NOPTRUOC.Xoa_NopTruoc_DonHang_ChiTiet',
            'iM': edu.system.iM,
            'strDonHang_ChiTiet_Id': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_tblThanhToan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_XacNhanChiTiet: function (strTT_DonHang_ChiTiet_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThanhToan_NopTruoc_MH/DSA4AikoFSgkNQ8uKAU0LyYVKSAvKRUuIC8P',
            'func': 'PKG_THANHTOAN_NOPTRUOC.LayChiTietNoiDungThanhToan',
            'iM': edu.system.iM,
            'strTT_DonHang_ChiTiet_Id': strTT_DonHang_ChiTiet_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me["dtXacNhanChiTiet"] = data.Data;
                    me.genTable_XacNhanChiTiet(data.Data);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_XacNhanChiTiet: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblXacNhanChiTiet",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_DMDonGia()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDatap": "DAOTAO_HOCPHAN_TEN - DAOTAO_HOCPHAN_MA",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDatap": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "THOIGIAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="checkchange" id="checkX' + aData.ID + '" checked="checked" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var sum = edu.system.countFloat("tblXacNhanChiTiet", 5, 8);
        //edu.system.insertSumAfterTable("tblXacNhanChiTiet", [5]);
        var strTongThu = "Tổng tiền đã chọn: <span>" + edu.util.formatCurrency(sum) + "</span>";
        $("#lbSoTienXacNhanChiTiet").html(strTongThu);
        /*III. Callback*/
    },
}

