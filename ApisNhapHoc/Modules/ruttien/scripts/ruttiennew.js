/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 05/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function RutTien() { };
RutTien.prototype = {
    dtNguoiHoc: [],
    dtNguoiHoc_Print: [],
    dtKhoanRut: [],
    dtPhieuThu: [],
    dtPhieuRut: [],
    iTinhTrangNhapHoc: 1,//(0-chua nhap, 1- da nhap, -1 toan bo)
    strNguoiHoc_Id: '',
    strKeHoach_Id: '',
    strPhieuRut_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action PhieuThu
        -------------------------------------------*/
        $("#listPhieuThu_RutTien").delegate(".btnSelect_PhieuThu_RutTien", "click", function () {
            var strPhieuThu_Id = this.id;
            strPhieuThu_Id = edu.util.cutPrefixId(/phieuthu_id/g, strPhieuThu_Id);
            if (edu.util.checkValue(strPhieuThu_Id)) {
                me.showHide_Box("zone-bus", "zoneInput_RutTien");
                me.getList_KhoanDaThu_Rut(strPhieuThu_Id, "PHIEUTHU");
            }
        });
        $("#listPhieuThu_RutTien").delegate(".btnPopover_PhieuThu_RutTien", "mouseenter", function () {
            var id = this.id;
            id = edu.util.cutPrefixId(/phieuthu_id/g, id);
            var data = me.dtPhieuThu;
            var obj = this
            me.popover_PhieuThu_PhieuRut(id, data, obj);
        });
        /*------------------------------------------
        --Discription: [2] Action PhieuRut
        -------------------------------------------*/
        $("#listPhieuRut_RutTien").delegate(".btnSelect_PhieuRut_RutTien", "click", function () {
            var strPhieuRut_Id = this.id;
            strPhieuRut_Id = edu.util.cutPrefixId(/phieurut_id/g, strPhieuRut_Id);
            if (edu.util.checkValue(strPhieuRut_Id)) {
                //zone
                me.strPhieuRut_Id = strPhieuRut_Id;
                me.showHide_Box("zone-box", "zoneHoaDon_PhieuRut");
                me.showHide_Box("zone-action", "zoneAction_HoaDon_RutTien");
                me.getList_KhoanDaThu_Rut(strPhieuRut_Id, "RUTTIEN");
            }
        });
        $("#listPhieuRut_RutTien").delegate(".btnPopover_PhieuRut_RutTien", "mouseenter", function () {
            var id = this.id;
            id = edu.util.cutPrefixId(/phieurut_id/g, id);
            var data = me.dtPhieuRut;
            var obj = this
            me.popover_PhieuThu_PhieuRut(id, data, obj);
        });
        $("#btnSave_RutTien").click(function () {
            if (edu.util.checkValue(me.strNguoiHoc_Id)) {
                me.save_RutTien();
            }
            else {
                edu.system.alert("Vui lòng chọn Người học cần rút tiền!");
            }
        });
        $("#btnPrint_HoaDon_RutTien").click(function () {
            edu.util.printHTML('print_hoadon_ruttien');
        });
        $("#btnCancle_HoaDon_RutTien").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn hủy phiếu thu?");
            $("#btnYes").click(function (e) {
                me.delete_PhieuRut(me.strPhieuRut_Id);
            });
        });
        $("#btnClose_RutTien").click(function () {
            me.showHide_Box("zone-bus", "zoneList_PhieuThu_RutTien");
        });
        $("#btnClose_HoaDon_RutTien").click(function () {
            me.showHide_Box("zone-box", "zoneDetail_TTTS_PhieuRut");
            me.showHide_Box("zone-action", "zoneAction_RutTien");
            me.getList_PhieuThu(me.strNguoiHoc_Id, "", "");
            me.getList_RutTien(me.strNguoiHoc_Id, "", "");
        });
        /*------------------------------------------
        --Discription: [2] Action NguoiHoc_TTTS
        -------------------------------------------*/
        $("#tblNguoiHoc_RutTien").delegate(".btnPopover_NguoiHoc_RutTien", "mouseenter", function () {
            var id = this.id;
            var data = me.dtNguoiHoc;
            var obj = this
            edu.extend.popover_NguoiHoc_TTTS(id, data, obj);
        });
        $("#tblNguoiHoc_RutTien").delegate(".btnSelect_NguoiHoc_RutTien", "click", function () {
            var strNguoiHoc_Id = this.id;
            me.reset_NguoiHoc_RutTien();
            
            edu.util.resetAll_BgRow("tblNguoiHoc_RutTien");
            edu.util.setOne_BgRow(strNguoiHoc_Id);

            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.strNguoiHoc_Id = strNguoiHoc_Id
                var dtNguoiHoc = me.getDetail_NguoiHoc_TTTS(me.strNguoiHoc_Id, me.dtNguoiHoc);
                me.dtNguoiHoc_Print = dtNguoiHoc;
                me.genDetail_NguoiHoc_TTTS(dtNguoiHoc);
                me.getList_RutTien(me.strNguoiHoc_Id, "", "");
                me.getList_PhieuThu(me.strNguoiHoc_Id, "", "");
            }
        });
        //timkiem nguoihoc_ttts
        $('#dropKeHoachNhapHoc_RutTien').on('select2:select', function () {
            var id = $(this).find('option:selected').val();
            var strTuKhoa = "";
            if (edu.util.checkValue(id)) {
                me.strKeHoach_Id = id;
                strTuKhoa = edu.util.getValById("txtKeyword_RutTien");
            }
            else {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $('.rdRutTien').on('change', function () {
            me.reset_NguoiHoc_RutTien();
            me.iTinhTrangNhapHoc = $('input[name="rdRutTien"]:checked').val();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_RutTien");
            var strTuKhoa = edu.util.getValById("txtKeyword_RutTien");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $("#txtKeyword_RutTien").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_RutTien");
                var strTuKhoa = edu.util.getValById("txtKeyword_RutTien");
                if (!edu.util.checkValue(me.strKeHoach_Id)) {
                    me.strKeHoach_Id = "xxx";
                }
                //1. call nguoihoc_ttts
                me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
            }
        });
        $("#btnDel_Keyword_RutTien").click(function () {
            edu.util.viewValById("txtKeyword_RutTien", "");
            $("#txtKeyword_RutTien").focus();
        });
        $("#btnSearch_NguoiHoc_RutTien").click(function () {
            me.reset_NguoiHoc_RutTien();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_RutTien");
            var strTuKhoa = edu.util.getValById("txtKeyword_RutTien");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
    },
    /*------------------------------------------
    --Discription: Common function
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.RutTien;
        me.showHide_Box("zone-box", "zoneDetail_TTTS_PhieuRut");
        me.showHide_Box("zone-action", "zoneAction_RutTien");
        me.showHide_Box("zone-bus", "zoneList_PhieuThu_RutTien");

        $("#txtKeyword_RutTien").focus();
        return new Promise(function (resolve, reject) {
            edu.system.beginLoading();
            //obj, resolve, reject, callback
            var obj = {
                strNguoiDung_Id: edu.system.userId
            };
            me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");
        }).then(function (data) {
            me.genCombo_KeHoachNhapHoc(data);
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_RutTien");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
        });
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    reset_NguoiHoc_RutTien: function () {
        var me = this;
        me.dtNguoiHoc_Print = [];
        me.dtKhoanRut = [];
        me.dtPhieuThu = [];
        me.dtPhieuRut = [];
        me.strNguoiHoc_Id = "";        
        me.genList_PhieuPhu([]);
        me.genList_PhieuRut([]);

        edu.util.resetHTMLById("lblHoTen_RutTien");
        edu.util.resetHTMLById("lblNgaySinh_RutTien");
        edu.util.resetHTMLById("lblSoBaoDanh_RutTien");
        edu.util.resetHTMLById("lblSoDienThoai_RutTien");
        edu.util.resetHTMLById("lblQueQuan_RutTien");
        edu.util.resetHTMLById("lblKhuVuc_RutTien");
        edu.util.resetHTMLById("lblDoiTuong_RutTien");
        edu.util.resetHTMLById("lblPhanTramMienGiam_RutTien");
        edu.util.resetHTMLById("lblNganhHoc_RutTien");
    },
    open_modal: function () {
        $("#myModal_ChiTietLop").modal("show");
    },
    /*------------------------------------------
    --Discription: [2] NH_NguoiHoc_TTTS
    --Discription: 
    -------------------------------------------*/
    getList_RutTien: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        me.genList_PhieuRut(dtResult);
                        me.dtPhieuRut = dtResult;
                    }
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi_er: " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'TC_PhieuThu/LayDSPhieuRutNhaphoc',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_RutTien: function () {
        var me = this;
        var obj_notify = {};

        //1. get value
        var $txtTienRut = "";
        var dSoTien_Rut = "";
        var arrSoTien_Rut = [];
        var arrKhoanRut = [];
        for (var i = 0; i < me.dtKhoanRut.length; i++) {
            $txtTienRut = "txtSoTien_RutTien" + me.dtKhoanRut[i].TAICHINH_CACKHOANTHU_ID;
            valTienRut = edu.util.getValById($txtTienRut);
            
            dSoTien_Rut = edu.util.convertStrToNum(valTienRut);
            arrSoTien_Rut.push(dSoTien_Rut);
            arrKhoanRut.push(me.dtKhoanRut[i].TAICHINH_CACKHOANTHU_ID);
        }
        //2.
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4TNDUVKCQv',
            'func': 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_RutTien',
            'iM': edu.system.iM,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_RutTien'),
            'strQLSV_NguoiHoc_TTTS_Id': me.strNguoiHoc_Id,
            'strTAICHINH_CacKhoanRut_Ids': arrKhoanRut.toString(),
            'strTAICHINH_SoTienRut_s': arrSoTien_Rut.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    return new Promise(function (resolve, reject) {
                        me.getList_PhieuThu(me.strNguoiHoc_Id, resolve, reject);
                    }).then(function () {
                        return new Promise(function (resolve, reject) {
                            me.getList_RutTien(me.strNguoiHoc_Id, resolve, reject);
                        }).then(function () {
                            //Rut tien thanh cong --> load phieu in
                            var arrMessage = edu.util.convertStrToArr(data.Message, ",");
                            console.log("arrMessage: " + arrMessage);
                            var strPhieu_Id = arrMessage[0];
                            var strPhieu_So = arrMessage[1];
                            me.showHide_Box("zone-box", "zoneHoaDon_PhieuRut");
                            me.showHide_Box("zone-action", "zoneAction_HoaDon_RutTien");
                            me.getList_KhoanDaThu_Rut(strPhieu_Id, "RUTTIEN");
                        });
                    });
                }
                else {
                    edu.system.alert( data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert( er);
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
    },
    delete_PhieuRut: function (strPhieu_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'TC_PhieuThu/HuyPhieuNhapHoc',
            'versionAPI': 'v1.0',

            'strPhieu_Id': strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strPhieuThu_Id = "";
                    var obj = {
                        content: "Hủy phiếu rút thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert( JSON.stringify(er));
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
    /*------------------------------------------
    --Discription: [3] ACESS DB ==> Phieu
    --Author: 
    -------------------------------------------*/
    getList_PhieuThu: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genList_PhieuPhu(data.Data);
                        me.dtPhieuThu = data.Data;
                    }
                    else {
                        me.genList_PhieuPhu([]);
                    }
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert( data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'TC_PhieuThu/LayDSPhieuThuNhaphoc',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoanDaThu_Rut: function (strPhieuThu_Id, strLoaiPhieu) {
        var me = this;
        var strPhieuThu_Rut_Id = strPhieuThu_Id;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKKS4gLwUgFSk0DykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc',
            'iM': edu.system.iM,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            'strPhieuThu_Rut_Id': strPhieuThu_Rut_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        switch (strLoaiPhieu) {
                            case "PHIEU_SUA":
                                me.genFormEdit_PhieuDaThu(data.Data);
                                break;
                            default:
                                me.genDetail_PhieuThu(data.Data);
                                break;
                        }
                        me.dtKhoanDaThu = data.Data;
                    }
                    else {
                        switch (strLoaiPhieu) {
                            case "PHIEU_SUA":
                                me.genFormEdit_PhieuDaThu([{}]);
                                break;
                            default:
                                me.genDetail_PhieuThu([{}]);
                                break;
                        }
                        me.dtKhoanDaThu = [];
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                    edu.system.endLoading();
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> KeHoachNhapHoc
    --Discription: 
    -------------------------------------------*/
    genCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_RutTien"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] Gen html NH_NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    getDetail_NguoiHoc_TTTS: function (strNguoiHoc_Id, data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            if (strNguoiHoc_Id == data[i].ID) {
                return data[i];
            }
        }
    },
    genDetail_NguoiHoc_TTTS: function (data) {
        var me = this;
        //1. id gen place
        var strHoTen            = edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN);
        var strNgaySinh         = edu.util.returnEmpty(data.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data.NGAYSINH_NAM);
        var strSoBaoDanh        = edu.util.returnEmpty(data.SOBAODANH);
        var strSoDienThoai      = edu.util.returnEmpty(data.SODIENTHOAICANHAN);
        var strQueQuan          = edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);
        var strKhuVuc           = edu.util.returnEmpty(data.KHUVUC_TEN);
        var strDoiTuong         = edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);
        var strPhanTramMienGiam = edu.util.returnZero(data.PHANTRAMMIENGIAM);
        var strNganhHoc         = edu.util.returnEmpty(data.NGANHHOC_TEN);
        //3. fill data into place
        edu.util.viewHTMLById("lblHoTen_RutTien", strHoTen.toUpperCase());
        edu.util.viewHTMLById("lblNgaySinh_RutTien", strNgaySinh);
        edu.util.viewHTMLById("lblSoBaoDanh_RutTien", strSoBaoDanh);
        edu.util.viewHTMLById("lblSoDienThoai_RutTien", strSoDienThoai);
        edu.util.viewHTMLById("lblQueQuan_RutTien", strQueQuan);
        edu.util.viewHTMLById("lblKhuVuc_RutTien", strKhuVuc);
        edu.util.viewHTMLById("lblDoiTuong_RutTien", strDoiTuong);
        edu.util.viewHTMLById("lblPhanTramMienGiam_RutTien", strPhanTramMienGiam);
        edu.util.viewHTMLById("lblCMT", edu.util.returnEmpty(data.CMTND_SO));
        edu.util.viewHTMLById("lblNganhHoc_RutTien", strNganhHoc);
    },
    cbGenTable_NguoiHoc_TTTS: function (data, iPager) {
        //(0-chua nhap, 1- da nhap, -1 toan bo)
        var me = main_doc.RutTien;
        me.dtNguoiHoc = data;
        var strTuKhoa = edu.util.getValById("txtKeyword_RutTien");
        var jsonForm = {
            strTable_Id: "tblNguoiHoc_RutTien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.RutTien.getList_NguoiHoc_TTTS('" + me.iTinhTrangNhapHoc + "', '" + me.strKeHoach_Id + "', '" + strTuKhoa + "',main_doc.RutTien.cbGenTable_NguoiHoc_TTTS)",
                iDataRow: iPager,
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiHoc_RutTien"],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<img src="' + edu.system.getRootPathImg(aData.ANH) + '" class="table-img" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoDem = edu.util.returnEmpty(aData.HODEM);
                        var strTen = edu.util.returnEmpty(aData.TEN);
                        var strFullName = strHoDem + " " + strTen;
                        var strSoBaoDanh = edu.util.returnEmpty(aData.SOBAODANH);
                        var html = '';
                        html = '<span class="td-middle">' + strFullName + '</span><br />';
                        html += '<span class="td-middle td-font">' + strSoBaoDanh + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //condition: 0- chua nhap hoc || 1 - da nhap hoc
                        var html = '';
                        var iDaNhapHoc = aData.DANHAPHOC;
                        html += '<span><a id="' + aData.ID + '" class="btnSelect_NguoiHoc_RutTien" href="#">Chọn</a></span>';
                        if (iDaNhapHoc == 1) {
                            html += '<br /><span><a><i class="fa fa-tag"></i></a></span>'
                        }
                        else {
                            //nothing
                        }
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ==> PhieuThuRut
    --Author: 
    -------------------------------------------*/
    genTable_PhieuThu_RutTien: function (data) {
        var me = main_doc.RutTien;
        var dTongTien_DaThu = 0;
        var dTongTien_DaRut = 0;
        var jsonForm = {
            strTable_Id: "tblPhieuThu_RutTien",
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 0,
            },
            bHiddenHeader: true,
            sort: true,
            colPos: {
                left: [1],
                right: [2, 3, 4],
                center: [0, 5]
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                 , {
                     "mRender": function (nRow, aData) {
                         var dSoTien_DaThu = edu.util.returnZero(aData.SOTIENDATHU);
                         dTongTien_DaThu += dSoTien_DaThu;
                         return '<span>' + edu.util.formatCurrency(dSoTien_DaThu) + '</span>';
                     }
                 }, {
                     "mRender": function (nRow, aData) {
                         var dSoTien_DaRut = edu.util.returnZero(aData.SOTIENDARUT);
                         dTongTien_DaRut += dSoTien_DaRut;
                         return '<span>' + edu.util.formatCurrency(dSoTien_DaRut) + '</span>';
                     }
                 }
                 , {
                     "mRender": function (nRow, aData) {
                         var dSoTien_DaThu = edu.util.returnZero(aData.SOTIENDATHU);
                         var dSoTien_DaRut = edu.util.returnZero(aData.SOTIENDARUT);
                         var dSoTien_DuocRut = dSoTien_DaThu - dSoTien_DaRut;
                         var value_DuocRut = "";
                         if (dSoTien_DuocRut == 0) {
                             value_DuocRut = 0;
                         }
                         var strId = aData.TAICHINH_CACKHOANTHU_ID;
                         return '<input type="text" id="txtSoTien_RutTien' + strId + '" class="form-control td-right" onblur="main_doc.RutTien.checkValid_RutTien(' + dSoTien_DuocRut + ",\'" + strId + "\'" + ')" value="' + value_DuocRut + '" data-ax5formatter="money" placeholder="Nhập số tiền rút"/>';
                     }
                 }, {
                     "mRender": function (nRow, aData) {
                         return '<a class="ponter btn btn-default btn-circle" id="btlHistory_RutTien' + aData.ID + '"><i class="fa fa-eye color-active"></i></a>';
                     }
                 }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.page_load();
        //footer ====> sum
        $("#lblTongTien_DaThu").html(edu.util.formatCurrency(dTongTien_DaThu));
        $("#lblTongTien_DaRut").html(edu.util.formatCurrency(dTongTien_DaRut));
        $("#lblTongTien_DuocRut").html(edu.util.formatCurrency(dTongTien_DaThu - dTongTien_DaRut));
    },
    popover_PhieuThu_PhieuRut: function (id, data, obj) {
        //1.processing
        var strSoPhieu_Thu = "";
        var strNguoiThu = "";
        var strNgayThu = "";

        for (var i = 0; i < data.length; i++) {
            if (id == data[i].ID) {
                strSoPhieu_Thu = edu.util.returnEmpty(data[i].SOPHIEUTHU);
                strNguoiThu = edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU);
                strNgayThu = edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS);
            }
        }
        //2. load to popover
        var objdata = {
            obj: obj,
            title: "<a><span class='bold'><i class='fa fa-info-circle'></i> Người thu</span></a>",
            content: function () {
                var html_popover = '';
                html_popover += '<span>' + strNguoiThu + '</span><br />';
                html_popover += '<span>' + strNgayThu + '</span>';
                return html_popover;
            },
            event: 'hover',
            place: 'right',
        };
        edu.system.loadToPopover_data(objdata);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ==> PhieuThu
    --Author: 
    -------------------------------------------*/
    genList_PhieuPhu: function (data) {
        var me = this;
        var html = '';
        var $phieuthu = "#listPhieuThu_RutTien";
        $($phieuthu).html('');
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i])) {
                html += '<small class="label label-success poiter btnSelect_PhieuThu_RutTien btnPopover_PhieuThu_RutTien" id="phieuthu_id' + data[i].ID + '">#' + data[i].SOPHIEUTHU + '</small>';
            }
        }
        if (data.length == 0) {
            html = "<a>#</a>";
        }
        $($phieuthu).html(html);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ==> PhieuRut
    --Author: 
    -------------------------------------------*/
    genList_PhieuRut: function (data) {
        var me = this;
        var html = '';
        var $phieuthu = "#listPhieuRut_RutTien";
        $($phieuthu).html('');
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i])) {
                html += '<small class="label label-info poiter btnPopover_PhieuRut_RutTien btnSelect_PhieuRut_RutTien" id="phieurut_id' + data[i].ID + '">#' + data[i].SOPHIEUTHU + '</small>';
            }
        }
        if (data.length == 0) {
            html = "<a>#</a>";
        }
        $($phieuthu).html(html);
    },
    genDetail_PhieuRut: function (data) {
        var me = this;
        var dataPhieuIn = me.dtNguoiHoc_Print;
        if (data.length > 0 && dataPhieuIn != undefined) {
            data[0]["SOPHIEUTHU"] = data[0]["SOCHUNGTU"];
            dataPhieuIn["HOKHAUTHUONGTRU"] = edu.util.returnEmpty(dataPhieuIn.HOKHAU_PHUONGXA_TEN) + ", " + edu.util.returnEmpty(dataPhieuIn.HOKHAU_QUANHUYEN_TEN) + ", " + edu.util.returnEmpty(dataPhieuIn.HOKHAU_TINHTHANH_TEN);
            dataPhieuIn["NGAYSINH"] = edu.util.returnEmpty(dataPhieuIn.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(dataPhieuIn.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(dataPhieuIn.NGAYSINH_NAM);
            dataPhieuIn["DAOTAO_LOPQUANLY_N1_TEN"] = dataPhieuIn.DAOTAO_LOPQUANLY_TEN;
            dataPhieuIn["NGANHHOC_N1_TEN"] = dataPhieuIn.DAOTAO_NGANHNHAPHOC;
            dataPhieuIn["KHOAHOC_N1_TEN"] = dataPhieuIn.DAOTAO_KHOADAOTAO_TEN;
        }
        dataPhieuIn["MAUIN_MASO"] = data[0].MAUIN_MASO;
        console.log(dataPhieuIn.DAOTAO_LOPQUANLY_TEN);
        console.log(dataPhieuIn);
        edu.extend.genData_PhieuThu(data, [dataPhieuIn], "print_hoadon_ruttien", "", objKhoanThu => {
            var strMauIn_MaSo = data[0].MAUIN_MASO;
            var strIDMoRong = objKhoanThu.CHUNGTU_ID;
            var strDiaChi = dataPhieuIn.HOKHAU_TINHTHANH_TEN;
            if (dataPhieuIn.HOKHAU_QUANHUYEN_TEN) strDiaChi = dataPhieuIn.HOKHAU_QUANHUYEN_TEN + ", " + strDiaChi;
            if (dataPhieuIn.HOKHAU_PHUONGXA_TEN) strDiaChi = dataPhieuIn.HOKHAU_PHUONGXA_TEN + ", " + strDiaChi;
            $(".txtDiaChi_BenB_" + strIDMoRong).html(strDiaChi);
            switch (strMauIn_MaSo) {
                case "CKVINHPHUC_BIENLAITHU": {
                    $(".txtDonVi_BenB_" + strIDMoRong).parent().parent().remove();
                    $(".txtMaSoThue_BenB_" + strIDMoRong).parent().parent().remove();
                } break;
                case "DHNONGLAM_TN_BIENLAI": {
                    $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_TEN));
                } break;
                case "DHTL_PHIEUTHU_NHAPHOC_2018":
                case "DHTLCS2_PHIEUTHU_NHAPHOC_2018":
                case "DHCNTTTN_PHIEUTHU_NHAPHOC_2018":
                default: break;
            }
        });
        return;
    },
    checkValid_RutTien: function (dSoTien_DuocRut, id) {
        var dSoTien = 0;
        var $txtSoTien = "txtSoTien_RutTien" + id;
        var valSoTien = edu.util.getValById($txtSoTien);
        dSoTien = edu.util.convertStrToNum(valSoTien);
        
        if (dSoTien > dSoTien_DuocRut) {
            $($txtSoTien).val(dSoTien_DuocRut);
        }
    },

    getList_KeHoachNhapHoc: function (obj, callback) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc',
            'iM': edu.system.iM,
            'strDAOTAO_KhoaDaoTao_Id': obj.strKhoaDaoTao_Id,
            'strMoHinhNhapHoc_Id': obj.strMHNhapHoc_Id,
            'strMoHinhApDungPhieuThu_Id': obj.strMHApDungPhieuThu_Id,
            'strTAICHINH_HeThongPhieu_Id': obj.strHeThongThu_Id,
            'strMoHinhApDungPhieuRut_Id': obj.strMHApDungPhieuRut_Id,
            'strTAICHINH_HeThongRut_Id': obj.strHeThongRut_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': obj.strTuKhoa,
            'pageIndex': 1,
            'pageSize': 1000000,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        var iPager = data.Pager;
                        callback(dtResult, iPager);
                    }
                    else {
                        callback([], 0);
                    }
                }
                else {
                    edu.system.alert("Error NH_KeHoachNhapHoc.LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Error NH_KeHoachNhapHoc.LayDanhSach(er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var me = this;
        //--lay danh sach ke hoach cho tung NguoiDung_Id duoc phan quyen
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        if (typeof callback === "function") {
                            callback([]);
                        }
                    }
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
        }, false, false, false, null);
    },
    getList_NguoiHoc_TTTS: function (iTinhTrangNhapHoc, strKeHoach_Id, strTuKhoa, callback) {
        var me = this;
        var iDaNhapHoc = iTinhTrangNhapHoc;
        var strTAICHINH_KeHoach_Id = strKeHoach_Id;
        var strNguoiThucHien_Id = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;

        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
            'iM': edu.system.iM,
            'dDaNhapHoc': iDaNhapHoc,
            'strTaiChinh_KeHoach_Id': strTAICHINH_KeHoach_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        var iPager = data.Pager;
                        callback(dtResult, iPager);
                    }
                    else {
                        callback([], 0);
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                //edu.system.alert("Lỗi_er (NguoiHoc_TTTS.LayDanhSach_NguoiHoc): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}