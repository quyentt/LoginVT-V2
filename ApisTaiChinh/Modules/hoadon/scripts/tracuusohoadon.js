/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function HeThongHoaDon() { };
HeThongHoaDon.prototype = {
    dtMau: '',
    dtChungTu: '',
    strMau_Id: '',
    strSo_Id: '',
    dtMauIn: [],
    idemHoaDon: 0,
    iSLHoaDon: 0,

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
        me.getList_HD();
        //me.getList_SHD();
        me.getList_NguoiThu();
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnSearch_HoaDon").click(function () {
            var strTuKhoa = edu.util.getValById('txtKeyword_Search_HoaDon').trim();
            edu.system.pageIndex_default = 1;
            me.getList_SHD(strTuKhoa);
        });
        $("#txtKeyword_Search_HoaDon").keypress(function (e) {
            if (e.which === 13) {
                var strTuKhoa = edu.util.getValById('txtKeyword_Search_HoaDon').trim();
                edu.system.pageIndex_default = 1;
                me.getList_SHD(strTuKhoa);
            }
        });
        $('.rdLoaiPhieu_HoaDon').on('change', function (e) {
            e.stopImmediatePropagation();
            edu.system.pageIndex_default = 1;
            me.getList_SHD();
        });
        $("#MainContent").delegate('.viewchungtu, .viewchungtu_DaSua', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#btnHuyHoaDon").show();
            me.strSo_Id = this.id;
            edu.extend.getData_Phieu(this.id, "HOADON", 'MauInHoaDon', main_doc.HeThongHoaDon.changeWidthPrint);
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
            //var aData = edu.util.objGetOneDataInData(me.strSo_Id, me.dtChungTu, "ID");
            //console.log(aData);
            //if (aData.length != 0) {
            //    if ((aData.DUONGDANFILEHOADON === null /*|| aData.DUONGDANFILETONGHOP === null*/) && aData.TRACSECTION_ID !== null) {
            //        me.getFilesPath(aData);
            //    }
            //    //else {
            //    //    me.getFilesPath(aData);
            //    //}
            //}
        });
        $("#MainContent").delegate('.viewchungtu_DaXoa', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#btnHuyHoaDon").hide();
            me.strSo_Id = this.id;
            edu.extend.getData_Phieu(this.id, "HOADON", 'MauInHoaDon', main_doc.HeThongHoaDon.changeWidthPrint);
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
        });
        //$("#MainContent").delegate('.viewchungtu_DaXoa', 'click', function (e) {
        //    e.stopImmediatePropagation();
        //    edu.system.alert('Bạn không thể xem hóa đơn đã xóa!');
        //});

        $("#MainContent").delegate('.viewchungtu, .viewchungtu_DaSua, .viewchungtu_DaXoa', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_SHD(id, point);
        });
        //
        //$('#dropMau_HoaDon').on('select2:select', function () {
        //    var id = edu.util.getValCombo("dropMau_HoaDon");
        //    me.strMau_Id = id;
        //    if (edu.util.checkValue(id)) me.getList_SHD();
        //    me.genHTML_TinhTrangMau(id);
        //});
        $("#btnInHoaDon").click(function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            me.printPhieu();
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
            edu.system.confirm('Bạn có chắc chắn muốn hủy hóa đơn không!');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_HD();
            });
            return false;
        });
        me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });
        //In Toàn bộ hóa đơn đang hiển thị
        $("#btnSearch_InDS").click(function (e) {
            var arrHDDT = [];
            var arrHD = [];
            var arrSoChuaCoFile = [];
            var arrChuaCo = [];
            for (var i = 0; i < me.dtChungTu.length; i++) {
                //console.log(me.dtChungTu[i].DUONGDANFILEHOADON);
                if (edu.util.checkValue(me.dtChungTu[i].DUONGDANFILEHOADON)) {
                    //edu.system.confirm('Số phiếu sẽ in: ' + me.dtChungTu.length);
                    arrHDDT.push(me.dtChungTu[i].DUONGDANFILEHOADON);
                } else {
                    if (me.dtChungTu[i].LAHOADONDIENTU == 1) {
                        arrSoChuaCoFile.push(me.dtChungTu[i].SOHOADON);
                        arrChuaCo.push(me.dtChungTu[i]);
                    } else {
                        arrHD.push(me.dtChungTu[i]);
                    }
                    
                    //me.genMauHoaDon_DT(me.dtChungTu[i]);
                }
            }
            edu.system.confirm('Số hóa đơn điện tử sẽ in: ' + arrHDDT.length);
            edu.system.confirm('Số hóa đơn điện tử chưa có file: ' + arrSoChuaCoFile.toString());
            edu.system.confirm('Số hóa đơn tự in: ' + arrHD.length);
            edu.system.confirm('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChuaCo.length);
            arrChuaCo.forEach(e => me.save_GetFiles(e))
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                e.preventDefault();
                $("MauInHoaDon").html("");
                //var dtTemp = [];
                //for (var i = 0; i < me.dtChungTu.length; i++) {
                //    dtTemp.push(me.dtChungTu[i]);
                //}
                //if (dtTemp.length == 0) {
                //    edu.system.alert("Hãy ấn F5 để load lại trang!", "w");
                //    return;
                //}
                me.idemHoaDon = 0;
                me.iSLHoaDon = me.dtChungTu.length;
                
                if (arrHD.length > 0) {
                    edu.system.genHTML_Progress("zonepercentInDSA", arrHD.length);
                    me.iSLHoaDon = arrHD.length;
                    for (var i = 0; i < arrHD.length; i++) {
                        me.genMauHoaDon_DT(arrHD[i]);
                    }

                }
                if (arrHDDT.length > 0) {
                    me.getServerPath(function (aPath) {
                        me.getList_HDDT(arrHDDT, aPath);
                    });
                }
                //$("#zonepercentInDS").show();
                //document.getElementById("percentInDS").style.width = "0%";
                //edu.system.fixThreading(dtTemp, me.genMauHoaDon_DT);
                return false;
            });
            
        });

        $("#btnSearch_SendEmail").click(function (e) {
            var arrSendEmail = [];
            var arrNoEmail = [];
            for (var i = 0; i < me.dtChungTu.length; i++) {
                if (edu.util.checkValue(me.dtChungTu[i].EMAIL) && validateEmail(me.dtChungTu[i].EMAIL)) {
                    arrSendEmail.push(me.dtChungTu[i]);
                } else {
                    arrNoEmail.push(me.dtChungTu[i].SOHOADON);
                }
            }
            if (arrSendEmail.length > 0) {

                edu.system.confirm('Số phiếu sẽ gửi: ' + arrSendEmail.length);
                if (arrNoEmail.length > 0) {
                    edu.system.alert("Số phiếu sai email: " + arrNoEmail.length + ". " + arrNoEmail.toString());
                }

                var row = '';
                row += '<div class="col-sm-12">';
                row += '<div class="col-sm-4">- Tiêu đề: </div><div class="col-sm-8"><input class="form-control" id="txtTieuDe" /></div>';
                row += '<div class="col-sm-4">- Nội dung: </div><div class="col-sm-8"><input class="form-control" id="txtNoiDung" /></div></div>';
                row += '<div class="col-sm-4">- Files: </div><div class="col-sm-8">Hệ thống tự đính kèm</div>';
                row += '</div><div class="clear"></div>';
                edu.system.alert(row);
                $("#btnYes").click(function (e) {
                    e.preventDefault();
                    var strTieuDe = $("#txtTieuDe").val();
                    var strNoiDung = $("#txtNoiDung").val();
                    me.getServerPath(function (aPath) {
                        edu.system.genHTML_Progress("zonepercentInDSA", arrSendEmail.length);
                        $('#myModalAlert #alert_content').html("");
                        for (var i = 0; i < arrSendEmail.length; i++) {
                            //var emailGui = arrSendEmail[i].EMAIL;
                            console.log(arrSendEmail[i]);
                            me.getFilesPath(arrSendEmail[i], function (strDuongDan, strDuongDanTongHop, emailSend) {
                                me.sendEmail(emailSend/*"vanhieptn95@gmail.com"*/, strTieuDe, strNoiDung, [aPath + "\\" + strDuongDan, aPath + "\\" + strDuongDanTongHop]);
                            });
                        }
                    });
                });
            } else {
                edu.system.alert("Không tìm thấy email nào có thể gửi");
            }

        });
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        $("#btnSearch_Sync").click(function () {
            me.getList_HoaDonChuaSinh(strTuKhoa);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_TCHD", function (addKeyValue) {
            var obj_list = {
                'action': 'TC_HoaDon/LayDSTaiChinh_SoHoaDon',
                'versionAPI': 'v1.0',
                'pageIndex': edu.system.pageIndex_default,
                'pageSize': edu.system.pageSize_default,
                'strTuNgay': edu.util.getValById('txtKeyword_Search_TuNgay'),
                'strDenNgay': edu.util.getValById('txtKeyword_Search_DenNgay'),
                'dSoTien': edu.util.getValById('txtKeyword_Search_SoTien') ? edu.util.getValById('txtKeyword_Search_SoTien') : -1,
                'strTaichinh_Hoadon_Id': me.strMau_Id,
                'dChuaIn': -1,
                'dTinhTrang': $('input[name="rdLoaiPhieu_HoaDon"]:checked').val(),
                'strNguoiThucHien_Id': '',
                'strNguoiThu_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
                'strTuKhoa': edu.util.getValById('txtKeyword_Search_HoaDon').trim(),
            };
            for(var x in obj_list){
                addKeyValue(x, obj_list[x]);
            }
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
	--Discription: [1] ACESSS DB ==> HoaDon
	--Author:  
	-------------------------------------------*/
    getList_HD: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_HoaDon/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 100000,
            'strTuKhoa': '',
            'strLoaiHoaDon_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMau = data.Data;
                    me.cbGenCombo_HD(data.Data);
                    if (data.Data.length > 0) me.genHTML_TinhTrangMau();
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> BienLai
	--Author:
	-------------------------------------------*/
    getList_NguoiThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiDungDaThuTien/LayDanhSach',
            'versionAPI': 'v1.0',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiThu(json);
                } else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
                edu.system.alert(JSON.stringify(er));
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
    cbGenCombo_NguoiThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NguoiThu_IHD"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_HD: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "KYHIEU",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropMau_HoaDon"],
            type: "",
            title: "Tất cả",
        };
        edu.system.loadToCombo_data(obj);
    },
    getDataHoaDon: function (strMau_Id) {
        var me = this;
        for (var i = 0; i < me.dtMau.length; i++) {
            if (strMau_Id === me.dtMau[i].ID) return me.dtMau[i];
        }
        return undefined;
    },
    genHTML_TinhTrangMau: function (strMau_Id) {
        var me = this;
        var dDaDung = 0;
        var dDaHuy = 0;
        var dTongSo = 0;
        if (strMau_Id == undefined || strMau_Id == "") {
            for (var i = 0; i < me.dtMau.length; i++) {
                dDaDung += me.dtMau[i].SODADUNG;
                dDaHuy += me.dtMau[i].SODAHUY;
            }
        } else {
            var data = me.getDataHoaDon(strMau_Id);
            if (data !== undefined) {
                dDaDung = data.SODADUNG;
                dDaHuy = data.SODAHUY;
            }
        }
        dTongSo = dDaDung + dDaHuy;
        if (dTongSo !== undefined) {
            $("#lbpPhieuDaDung")[0].style.width = dDaDung * 100.0 / dTongSo + '%';
            $("#lbPhieuDaDung").html('<b>' + dDaDung + '</b> /' + dTongSo);

            $("#lbpPhieuDaSua")[0].style.width = 0 * 100.0 / dTongSo + '%';
            $("#lbPhieuDaSua").html('<b>' + 0 + '</b> /' + dTongSo);

            $("#lbpPhieuDaHuy")[0].style.width = dDaHuy * 100.0 / dTongSo + '%';
            $("#lbPhieuDaHuy").html('<b>' + dDaHuy + '</b> /' + dTongSo);
        }
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    getList_SHD: function (strTuKhoa) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_HoaDon/LayDSTaiChinh_SoHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTuNgay': edu.util.getValById('txtKeyword_Search_TuNgay'),
            'strDenNgay': edu.util.getValById('txtKeyword_Search_DenNgay'),
            'dSoTien': edu.util.getValById('txtKeyword_Search_SoTien') ? edu.util.getValById('txtKeyword_Search_SoTien'): -1,
            'strTaichinh_Hoadon_Id': me.strMau_Id,
            'dChuaIn': -1,
            'dTinhTrang': $('input[name="rdLoaiPhieu_HoaDon"]:checked').val(),
            'strNguoiThucHien_Id': '',
            'strNguoiThu_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuKhoa': edu.util.getValById('txtKeyword_Search_HoaDon').trim(),
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChungTu = data.Data;
                    me.genHTML_SHD(data.Data, data.Pager);
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
    getList_HDDT: function (arrHDDT, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_HoaDon/InNhieuHoaDon',
            'arrHDDT': arrHDDT,
            'strPath': strPath
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Id)
                    if (edu.util.checkValue(data.Id)) {
                        var strLink = edu.system.objApi["HDDT"];
                        strLink = strLink.substring(0, strLink.length - 3)
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.strhost + strLink;
                        }
                        var win = window.open(strLink + data.Id, '_blank');
                        if (win == undefined) {
                            edu.system.alert("Hãy cho phép mở tab mới trên trình duyệt của bạn!", "w");
                        } else {
                            win.focus();
                        }
                    }
                    if (data.Message != "") {
                        edu.system.alert("HDDT Lỗi: " + data.Message, "w");

                    }
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
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_HD: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_HoaDon/HuyHoaDon',
            'versionAPI': 'v1.0',
            'strHoaDon_Id': me.strSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_SHD();
                    me.getList_HD();
                    $("#zoneThongTinPhieuThu").slideUp('slow');
                    $("#MainContent").slideDown('slow');

                    edu.extend.notifyBeginLoading('Xóa chứng từ thành công');
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
    genHTML_SHD: function (data, iPager) {
        var me = this;
        me.beginLoadPag('zonePhieuThu_HoaDon', 'main_doc.HeThongHoaDon.getList_SHD()', iPager)
        if (data === null || data === undefined || data.length === 0) {
            return;
        }
        var html = '';
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = '';
        var strTongTien = 0;
        if (data.length > 0) {
            strTongTien = edu.util.formatCurrency(data[0].TONGTIENDAXUATHOADON);
        }
        $("#txtTongTien").html(strTongTien);

        for (var i = 0; i < data.length; i++) {
            iTinhTrang = data[i].TINHTRANG;

            switch (iTinhTrang) {
                case 1:
                    iLoaiPhieu = "color-active";
                    iLoaiChungTu = "viewchungtu";
                    break;
                case -1:
                    iLoaiPhieu = "color-danger";
                    iLoaiChungTu = "viewchungtu_DaXoa";
                    break;
                case 2:
                    iLoaiPhieu = "color-warning";
                    iLoaiChungTu = "viewchungtu_DaSua";
                    break;
                default:
                    break;
            }
            html += '<div class="col-sm-2 ' + iLoaiChungTu + '" id="' + data[i].ID + '">';
            html += '<div class="box-mini">';
            html += '<p>Số: <span class="' + iLoaiPhieu + ' pull-right underline">#' + edu.util.returnEmpty(data[i].SOHOADON) + '</span></p>';
            html += '<p>Tổng tiền: <span class="' + iLoaiPhieu + ' pull-right">' + edu.util.formatCurrency(data[i].TONGTIEN) + '</span></p>';
            html += '<p>Người thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITAO_TAIKHOAN) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span></p>';
            html += '<p>Người mua: <span class="pull-right">' + edu.util.returnEmpty(data[i].MASONGUOIMUAHANG) + " " + edu.util.returnEmpty(data[i].HOTENNGUOIMUAHANG) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zonePhieuThu_HoaDon").html(html);
        $(".popover").replaceWith('');
    },
    popover_SHD: function (strHS_Id, point) {
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
    cbGenCombo_KeHoachNhanSu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NGUOIDUNG_TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhanSu_TCPT"],
            type: "",
            title: "Chọn nhân sự",
        };
        edu.system.loadToCombo_data(obj);
    },
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
            $("#" + strzoneId).html('<div class="no-data-bienlai"> Không tìm thấy dữ liệu </div>');
        }
    },
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauInHoaDon");
        edu.util.printHTML('MauInHoaDon');
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
        edu.system.start_Progress("zonepercentInDSA");

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
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    getServerPath: function (callback) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HDDT_HoaDon/GetServerPath'
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    callback(data.Data);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
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
    sendEmail: function (mailTo, mailSubject, strBody, arrFileDinhKem) {
        var obj_list = {
            'action': 'CMS_NguoiDung/SendEmail',
            'mailTo': mailTo,
            'mailSubject': mailSubject,
            'strBody': strBody,
            'arrFileDinhKem': arrFileDinhKem,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã gửi email");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
            },
            complete: function () {
                edu.system.start_Progress("zonepercentInDSA", function () {
                });
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    getFilesPath: function (aData, callback) {
        var me = this;
        console.log("get data file get");
        if ((aData.DUONGDANFILEHOADON !== null && aData.DUONGDANFILETONGHOP !== null) || aData.TRACSECTION_ID === null) {
            if (typeof (callback) == "function") callback(aData.DUONGDANFILEHOADON, aData.DUONGDANFILETONGHOP, aData.EMAIL);
            return;
        }
        console.log("get data file getFilesPath");
        //--Edit
        var obj_list = {
            'action': 'HDDT_HoaDon/GetFiles',
            'transectionId': aData.TRACSECTION_ID,
            'strDuongDanFile': aData.DUONGDANFILEHOADON,
            'strDuongDanFileTongHop': aData.DUONGDANFILETONGHOP,
            'strSoHoaDon': aData.SOHOADON
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(aData.EMAIL);
                    me.save_DuongDanFiles(aData.ID, data.Data[0], data.Data[1], callback);
                    if (typeof (callback) == "function") callback(data.Data[0], data.Data[1], aData.EMAIL);
                    else {
                        var zoneMauIn = "MauInHoaDon";
                        var strLink = edu.system.objApi["HDDT"];
                        strLink = strLink.substring(0, strLink.length - 3);
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.strhost + strLink;
                        }
                        $("#" + zoneMauIn).html('<iframe src="' + strLink + data.Data[0] + '" width="800px" height="600px"></iframe>');
                    }
                }
                else {
                    //edu.system.alert("Lỗi: " + data.Message, "w");
                }
                //edu.system.endLoading();
            },
            error: function (er) {
                //edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    save_DuongDanFiles: function (strId, strDuongDanFileHoaDon, strDuongDanFileTongHop) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDuongDanFileHoaDon': strDuongDanFileHoaDon,
            'strDuongDanFileTongHop': strDuongDanFileTongHop,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_QuyDoiGioChuan/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (!edu.util.checkValue(obj_save.strId)) {
                    //    obj_notify = {
                    //        type: "s",
                    //        content: "Thêm mới thành công!",
                    //    }
                    //    edu.system.alertOnModal(obj_notify);
                    //}
                    //else {
                    //    obj_notify = {
                    //        type: "i",
                    //        content: "Cập nhật thành công!",
                    //    }
                    //    edu.system.alertOnModal(obj_notify);
                    //}
                    //me.getList_QuyDoiGio();
                }
                else {
                    //obj_notify = {
                    //    type: "w",
                    //    content: obj_save.action + " (er): " + data.Message,
                    //}
                    //edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                //edu.system.alertOnModal(obj_notify);
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
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    getList_HoaDonChuaSinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_HoaDonChuaSinh/LayDanhSach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        edu.system.alert('<div id="zoneprocessXXXX"></div>');
                        edu.system.genHTML_Progress("zoneprocessXXXX", data.Data.length);
                        data.Data.forEach(e => { me.getFiles_HoaDonChuaSinh(e); });
                        
                    } else {
                        edu.system.alert("Đã đồng bộ ", "w");
                    }
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
    getFiles_HoaDonChuaSinh: function (aData) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HDDT_HoaDon/GetFiles',
            'transectionId': aData.TRANSACTIONID,
            'strDuongDanFile': "",
            'strDuongDanFileTongHop': "",
            'strSoHoaDon': ""
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.save_HoaDonChuaSinh(aData, data.Data);
                }
                else {
                    //edu.system.alert("Lỗi: " + data.Message, "w");
                }
                //edu.system.endLoading();
            },
            error: function (er) {
                //edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    save_HoaDonChuaSinh: function (aData, dtHoaDon) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_HoaDonChuaSinh/CapNhatThongTinHoaDon',
            'type': 'POST',
            'strId': aData.ID,
            'str_PhatHanh_invoiceNo': dtHoaDon[2],
            'strDuongDanFileHoaDon': dtHoaDon[0],
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_QuyDoiGioChuan/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(dtHoaDon[2]);
                }
                else {
                    //obj_notify = {
                    //    type: "w",
                    //    content: obj_save.action + " (er): " + data.Message,
                    //}
                    //edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                //edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_TangThem();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_GetFiles: function (aData, dtHoaDon) {
        var me = this;
        getFilesPath(aData);
        function getFilesPath(aData, callback, zoneMauIn) {
            var me = this;
            //if (aData.DUONGDANFILEHOADON) {
            //    if (typeof (callback) == "function") callback(aData.DUONGDANFILEHOADON, aData.DUONGDANFILETONGHOP);
            //    return;
            //}
            //--Edit
            var obj_list = {
                'action': 'HDDT_HoaDon/GetFiles',
                'transectionId': aData.TRACSECTION_ID,
                'strDuongDanFile': aData.DUONGDANFILEHOADON,
                'strDuongDanFileTongHop': aData.DUONGDANFILETONGHOP,
                'strPhuongThuc_MA': aData.PHATHANH_RESERVATIONCODE,
                'strSoHoaDon': aData.SOHOADON
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        console.log(aData.EMAIL);
                        if (data.Data[0]) {
                            edu.system.alert("Lấy file thành công");
                            save_DuongDanFiles(aData.ID, data.Data[0], data.Data[1], callback);
                        } else {
                            edu.system.alert("Lấy file không thành công");
                        }
                        
                    }
                    else {
                        //edu.system.alert("Lỗi: " + data.Message, "w");
                    }
                    //edu.system.endLoading();
                },
                error: function (er) {
                    //edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
                },
                type: "GET",
                complete: function () {
                    edu.system.start_Progress("zoneprocessXXXX", function () {
                        setTimeout(function () {
                            me.getList_SHD();
                        }, 2000);
                    });
                },
                action: obj_list.action,
                versionAPI: obj_list.versionAPI,
                contentType: true,
                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        }

        function save_DuongDanFiles(strId, strDuongDanFileHoaDon, strDuongDanFileTongHop) {
            var me = this;
            var obj_notify = {};
            //--Edit
            var obj_save = {
                'action': 'TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT',

                'strId': strId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strDuongDanFileHoaDon': strDuongDanFileHoaDon,
                'strDuongDanFileTongHop': strDuongDanFileTongHop,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            //if (edu.util.checkValue(obj_save.strId)) {
            //    obj_save.action = 'NS_HeSo_QuyDoiGioChuan/CapNhat';
            //}
            //default
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        //if (!edu.util.checkValue(obj_save.strId)) {
                        //    obj_notify = {
                        //        type: "s",
                        //        content: "Thêm mới thành công!",
                        //    }
                        //    edu.system.alertOnModal(obj_notify);
                        //}
                        //else {
                        //    obj_notify = {
                        //        type: "i",
                        //        content: "Cập nhật thành công!",
                        //    }
                        //    edu.system.alertOnModal(obj_notify);
                        //}
                        //me.getList_QuyDoiGio();
                    }
                    else {
                        //obj_notify = {
                        //    type: "w",
                        //    content: obj_save.action + " (er): " + data.Message,
                        //}
                        //edu.system.alertOnModal(obj_notify);
                    }
                },
                error: function (er) {
                    //edu.system.alertOnModal(obj_notify);
                },
                type: "POST",
                action: obj_save.action,

                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
}