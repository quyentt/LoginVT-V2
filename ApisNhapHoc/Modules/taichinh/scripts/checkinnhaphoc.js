/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 03/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function CheckInNhapHoc() { };
CheckInNhapHoc.prototype = {
    dtNguoiHoc: [],
    dtKhoanThu: [],
    dtKhoanDaThu: [],
    dtNguoiHoc_Print: [],
    strNguoiHoc_Id: '',
    iTinhTrangNhapHoc: 1,//[0-chua nhap, 1- da nhap, -1 toan bo]
    strKeHoach_Id: '',
    strPhieuThu_Id: '',
    obj_ThuTien: {},
    strHinhThucThu_Ma: '',
    strHinhThucThu_Ten: '',
    strDonViTinh_Ten: '',
    strLoaiTienTe_Ma: '',
    dtHoaDon: [],
    strHDDT: '',
    strHoaDon_Id: '',
    strDiaChiNguoiMua: '',

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
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus", "zoneInput_ThuTien");
            me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
        });
        /*------------------------------------------
        --Discription: [2] Action NguoiHoc_TTTS
        -------------------------------------------*/
        $("#tblThuTien").delegate(".btnSelect_NguoiHoc_ThuTien", "click", function () {
            var strNguoiHoc_Id = this.id;

            edu.util.resetAll_BgRow("tblThuTien");
            edu.util.setOne_BgRow(strNguoiHoc_Id);
            me.showHide_Box("zone-box", "zoneDetail_TTTS");
            me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.reset_NguoiHoc_TTTS();
                me.strNguoiHoc_Id = strNguoiHoc_Id;
                console.log(2222);
                me.dtNguoiHoc_Print = me.dtNguoiHoc.find(e => e.ID === strNguoiHoc_Id);
                me.checkCondition_ThuTien(me.dtNguoiHoc_Print);
            }
        });
        $("#tblThuTien").delegate('.btnPopover_NguoiHoc_ThuTien', 'mouseenter', function () {
            var id = this.id;
            var data = me.dtNguoiHoc;
            var obj = this;
            edu.extend.popover_NguoiHoc_TTTS(id, data, obj);
        });
        $("#btnSave_ThuTien").click(function () {
            if (edu.util.checkValue(me.strNguoiHoc_Id)) {
                me.save_ThuTien();
            }
            else {
                edu.system.alert("Vui lòng chọn Người học cần thu tiền!");
            }
        });
        //timkiem nguoihoc_ttts
        $('#dropKeHoachNhapHoc_ThuTien').on('select2:select', function () {
            var id = $(this).find('option:selected').val();
            var strTuKhoa = "";
            if (edu.util.checkValue(id)) {
                me.strKeHoach_Id = id;
                strTuKhoa = edu.util.getValById("txtTimKiem_ThuTien");
            }
            else {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $('.rdThuTien').on('change', function () {
            me.reset_NguoiHoc_TTTS();
            me.iTinhTrangNhapHoc = $('input[name="rdThuTien"]:checked').val();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuTien");
            var strTuKhoa = edu.util.getValById("txtTimKiem_ThuTien");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $("#txtTimKiem_ThuTien").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuTien");
                var strTuKhoa = edu.util.getValById("txtTimKiem_ThuTien");
                if (!edu.util.checkValue(me.strKeHoach_Id)) {
                    me.strKeHoach_Id = "xxx";
                }
                //1. call nguoihoc_ttts
                me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
            }
        });
        $("#btnDel_Keyword_ThuTien").click(function () {
            edu.util.viewValById("txtTimKiem_ThuTien", "");
            $("#txtTimKiem_ThuTien").focus();
        });
        $("#btnSearch_NguoiHoc_ThuTien").click(function () {
            me.reset_NguoiHoc_TTTS();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuTien");
            var strTuKhoa = edu.util.getValById("txtTimKiem_ThuTien");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            //1. call nguoihoc_ttts
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);

        });
        /*------------------------------------------
        --Discription: [3] Action PhieuThu
        -------------------------------------------*/
        $("#btnClose_HoaDon").click(function () {
            me.showHide_Box("zone-box", "zoneDetail_TTTS");
            me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
            me.getList_PhieuThu(me.strNguoiHoc_Id, "", "");
            me.getList_PhieuThu_Huy(me.strNguoiHoc_Id, "", "");
            me.getList_KhoanNhapHoc(me.strNguoiHoc_Id, "", "");
        });
        $("#btnPrint_HoaDon").click(function () {
            edu.util.printHTML('print_hoadon');
            me.showHide_Box("zone-box", "zoneDetail_TTTS");
            me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
        });
        $("#btnCancle_HoaDon").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn hủy phiếu thu?");
            $("#btnYes").click(function (e) {
                me.delete_PhieuThu(me.strPhieuThu_Id);
            });
        });
        $("#listPhieuThu_ThuTien").delegate(".btnDetail_PhieuThu", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/detail_phieuthu/g, strId);
            console.log("detail_phieuthu: " + strId);
            if (edu.util.checkValue(strId)) {
                me.strPhieuThu_Id = strId;
                me.showHide_Box("zone-box", "zoneList_PhieuDaThu");
                me.showHide_Box("zone-action", "zoneAction_Phieu");
                $("#btnCancle_HoaDon").show();
                me.getDetail_NguoiHoc_PhieuThu(me.strPhieuThu_Id, "PHIEU_THU");
            }
        });
        $("#listPhieuThu_ThuTien").delegate(".btnEdit_PhieuThu", "click", function () {
            var strId = this.id;//
            strId = edu.util.cutPrefixId(/edit_phieuthu/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strPhieuThu_Id = strId;
                me.showHide_Box("zone-bus", "zoneEdit_PhieuDaThu");
                me.showHide_Box("zone-action", "zoneAction_Edit_PhieuDaThu");
                me.getList_KhoanDaThu_Rut(me.strPhieuThu_Id, "PHIEU_SUA");
            }
            else {
                edu.system.alert("Vui lòng chọn Phiếu cần chỉnh sửa!");
            }
        });
        $("#btnSave_Edit_PhieuDaThu").click(function () {
            if (edu.util.checkValue(me.strPhieuThu_Id)) {
                me.edit_PhieuThu();
            }
            else {
                edu.system.alert("Vui lòng chọn Phiếu cần chỉnh sửa!");
            }
        });
        $("#listPhieuThu_Huy_ThuTien").delegate(".btnDetail_PhieuHuy", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/detail_phieuhuy/g, strId);
            console.log("detail_phieuhuy: " + strId);
            if (edu.util.checkValue(strId)) {
                me.strPhieuThu_Id = strId;
                me.showHide_Box("zone-box", "zoneList_PhieuDaThu");
                me.showHide_Box("zone-action", "zoneAction_Phieu");
                $("#btnCancle_HoaDon").hide();
                me.getList_KhoanDaThu_Rut(me.strPhieuThu_Id, "PHIEU_HUY");
            }
        });
        /*------------------------------------------
        --Discription: [3] Action HoaDon
        -------------------------------------------*/

        $("#chkSelectAll_PhieuXuatHoaDon").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblEdit_PhieuXuatHoaDon" });
        });

        $("#btnAddnewHoaDon").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblEdit_PhieuXuatHoaDon", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.genHTML_NoiDung_HoaDon('tblEdit_PhieuXuatHoaDon');
            return false;
        });
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.NUTHDDT", "", "", me.genHTML_HDDT);
        $("#zoneThongTinHoaDon").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strLinkAPI = "1111"; //$(this).attr("name");
            var strPhuongThuc_Ma = $(this).attr("title");
            if (strPhuongThuc_Ma == "HDDTNHAP") {
                me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit', strLinkAPI, strPhuongThuc_Ma);
            } else {
                edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', 'w');
                $("#btnYes").click(function (e) {
                    $('#myModalAlert').modal('hide');
                    me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit', strLinkAPI, strPhuongThuc_Ma);
                });
            }
        });
        $("#btnInHoaDon").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnCloseHoaDon").click(function (e) {
            e.stopImmediatePropagation();
            $(".beforeActive").hide();
            me.closePhieu();
        });
        $("#btnHuyHoaDon").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn hủy hóa đơn không!');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_HD(me.strHoaDon_Id);
            });
            return false;
        });
        $("#btnSave_HoaDon").click(function (e) {
            me.getList_KhoanDaThu_XuatHoaDon(me.strPhieuThu_Id);
        });


        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropHinhThucThu_Edit", "", me.cbGenCombo_HinhThucThu);
        edu.system.getList_MauImport("zonebtnTT", function (addKeyValue) {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc_ThuHoSo", "checkX");
            var obj_list = {
                'strTaiChinh_KeHoach_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            };
            //arrChecked_Id.forEach(e => {
            //    addKeyValue('strQLSV_NguoiHoc_Id', e);
            //})
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            if (me.strNguoiHoc_Id) addKeyValue('strQLSV_NguoiHoc_Id', me.strNguoiHoc_Id);
            addKeyValue('strPhieuThu_Id', me.strPhieuThu_Id);
        });

        $("#btnCheckInNhapHoc").click(function (e) {
            me.save_TiepNhan();
        });

        $("#btnPrint_TT").click(function (e) {
            var content = document.getElementById('tblQRNhapHoc').innerHTML;
            var mywindow = window.open('', 'Print', 'height=600,width=800');

            mywindow.document.write('<html><head><title>Print</title><link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Extended+Text&display=swap" rel="stylesheet"><style>@media print{@page{margin:0}body{margin:1.0cm}}</style>');
            mywindow.document.write('</head><body>');
            mywindow.document.write(content);
            mywindow.document.write('</body></html>');

            setTimeout(function () {
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
            }, 2000);
            setTimeout(function () {
                console.log(111111);
                mywindow.close();//chrome bị lỗi phải comment lại
            }, 3000);
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.CheckInNhapHoc;
        me.showHide_Box("zone-box", "zoneDetail_TTTS");
        me.showHide_Box("zone-bus", "zoneInput_ThuTien");
        me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
        $("#txtTimKiem_ThuTien").focus();

        return new Promise(function (resolve, reject) {
            edu.system.beginLoading();
            //obj, resolve, reject, callback
            var obj = {
                strNguoiDung_Id: edu.system.userId
            };
            // Dùng hàm mới PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (local, không phụ thuộc edu.extend
            // vì Core/systemextend.js bản cũ vẫn gọi pkg_nhaphoc_thongtin — trang này ép dùng bản mới)
            me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");
        }).then(function (data) {
            me.genCombo_KeHoachNhapHoc(data);
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuTien");
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
    reset_NguoiHoc_TTTS: function () {
        var me = this;
        me.strNguoiHoc_Id = "";
        me.strPhieuThu_Id = "";
        me.dtKhoanThu = [];
        me.dtKhoanDaThu = [];
        console.log(11111);
        me.dtNguoiHoc_Print = [];
        me.genList_PhieuPhu([]);
        me.genTable_KhoanNhapHoc([]);

        edu.util.resetHTMLById("lblHoTen_ThuTien");
        edu.util.resetHTMLById("lblMaSoSV_ThuTien");
        edu.util.resetHTMLById("lblNgaySinh_ThuTien");
        edu.util.resetHTMLById("lblSoDienThoai_ThuTien");
        edu.util.resetHTMLById("lblQueQuan_ThuTien");
        edu.util.resetHTMLById("lblNganhNhapHoc_ThuTien");
        edu.util.resetHTMLById("lblNganhLop_ThuTien");

        edu.util.resetHTMLById("lblSoBaoDanh_ThuTien");
        edu.util.resetHTMLById("lblTongDiem_ThuTien");
        edu.util.resetHTMLById("lblDoiTuong_ThuTien");
        edu.util.resetHTMLById("lblPhanTramMienGiam_ThuTien");
        edu.util.resetHTMLById("lblNganhTrungTuyen_ThuTien");
        edu.util.resetHTMLById("lblKhuVuc_ThuTien");
    },
    checkCondition_ThuTien: function (data) {
        var me = this;
        var strMoHinhThuTien = edu.util.returnEmpty(data.MOHINHNHAPHOC_MA);
        var iDaNhapHoc = edu.util.returnEmpty(data.DANHAPHOC);
        var strNguoiHoc_Id = data.ID;

        me.genDetail_NguoiHoc_TTTS(data);
        me.getList_KhoanNhapHoc(strNguoiHoc_Id, "", "");
        me.getList_PhieuThu(strNguoiHoc_Id, "", "");
        me.getList_PhieuThu_Huy(me.strNguoiHoc_Id, "", "");
    },
    /*------------------------------------------
    --Discription: [2] ACESS DB ==> NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    save_ThuTien: function (obj) {
        var me = this;
        //1. get value
        var txtKhoanThu_SoTien = "";
        var strKhoanThu_SoTien = "";
        var arrKhoanThu_SoTien = [];
        var arrKhoanThu_Id = [];
        var countValid = 0;

        //1. process to get val
        for (var i = 0; i < me.dtKhoanThu.length; i++) {
            //1.
            txtKhoanThu_SoTien = "txtKhoanThu_SoTien" + me.dtKhoanThu[i].TAICHINH_CACKHOANTHU_ID;

            strKhoanThu_SoTien = edu.util.convertStrToNum(edu.util.getValById(txtKhoanThu_SoTien));

            arrKhoanThu_SoTien.push(strKhoanThu_SoTien);
            arrKhoanThu_Id.push(me.dtKhoanThu[i].TAICHINH_CACKHOANTHU_ID);

            if (strKhoanThu_SoTien == 0) {
                countValid++;
            }
        }
        //2. check input
        if (countValid == arrKhoanThu_SoTien.length) {
            edu.system.alert("Dữ liệu không hợp lệ!");
            return false;
        }
        //2. Migrate: pkg_nhaphoc_thongtin.NhapHoc_ThuTien → PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4VKTQVKCQv',
            'func': 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_TTTS_Id': me.strNguoiHoc_Id,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            'strTAICHINH_CacKhoanThu_Ids': arrKhoanThu_Id.toString(),
            'strTAICHINH_SoTien_s': arrKhoanThu_SoTien.toString(),
            'strHinhThucThu_Id': edu.util.getValById('dropHinhThucThu'),
            'strNgayThuTien': edu.util.getValById('txtNgayThu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //1. delete search text box value
                    edu.util.viewValById("txtTimKiem_ThuTien", "");
                    //2.
                    return new Promise(function (resolve, reject) {
                        me.getList_PhieuThu(me.strNguoiHoc_Id, resolve, reject);
                    }).then(function () {
                        return new Promise(function (resolve, reject) {
                            me.getList_KhoanNhapHoc(me.strNguoiHoc_Id, resolve, reject);
                        }).then(function () {
                            //3. Thu tien thanh cong --> load phieu in
                            var arrMessage = edu.util.convertStrToArr(data.Message, ",");
                            var strPhieu_Id = arrMessage[0];
                            me.strPhieuThu_Id = strPhieu_Id;
                            var strPhieu_So = arrMessage[1];
                            me.showHide_Box("zone-box", "zoneList_PhieuDaThu");
                            me.showHide_Box("zone-action", "zoneAction_Phieu");
                            me.showHide_Box("zone-bus", "zoneInput_ThuTien");
                            me.getDetail_NguoiHoc_PhieuThu(strPhieu_Id);
                        });
                    });
                }
                else {
                    var obj = {
                        content: "PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                var obj = {
                    content: "PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien (er): " + data.Message,
                    code: "w",
                }
                edu.system.afterComfirm(obj);
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
    getList_KhoanNhapHoc: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_TTTS_Id = strNguoiHoc_Id;
        // Migrate: pkg_nhaphoc_thongtin.LayDSCacKhoanNhapHoc → PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIKKS4gLw8pIDEJLiIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc',
            'iM': edu.system.iM,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            'strQLSV_NguoiHoc_TTTS_Id': strQLSV_NguoiHoc_TTTS_Id
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.dtKhoanThu = data.Data;
                        me.genTable_KhoanNhapHoc(data.Data);
                    }
                    else {
                        me.genTable_KhoanNhapHoc([{}]);
                    }
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert("PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc (er): " + JSON.stringify(er), "w");
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
    save_ThuTienThuCong: function (strNguoiHoc_Id) {

    },
    save_ThuTienTuDong: function (data) {
        var me = this;
        me.genDetail_NguoiHoc_TTTS(data);
        me.getListFake_PhieuThu(data.ID);
        me.getListFake_KhoanThu(data.ID);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ==> Phieu
    --Author: 
    -------------------------------------------*/
    edit_PhieuThu: function () {
        var me = this;
        //1. get value
        var txtKhoanThu_SoTien = "";
        var strKhoanThu_SoTien = "";
        var arrKhoanThu_SoTien = [];
        var arrKhoanThu_Id = [];
        var countValid = 0;

        //1. process to get val
        for (var i = 0; i < me.dtKhoanDaThu.length; i++) {
            //1.
            txtKhoanThu_SoTien = "txtKhoanThu_SoTien_Edit" + me.dtKhoanDaThu[i].TAICHINH_CACKHOANTHU_ID;
            strKhoanThu_SoTien = edu.util.convertStrToNum(edu.util.getValById(txtKhoanThu_SoTien));
            arrKhoanThu_SoTien.push(strKhoanThu_SoTien);
            arrKhoanThu_Id.push(me.dtKhoanDaThu[i].TAICHINH_CACKHOANTHU_ID);
        }
        //2. Migrate: pkg_nhaphoc_thongtin.NhapHoc_SuaPhieuThu → PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4SNCARKSgkNBUpNAPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu',
            'iM': edu.system.iM,
            'strPhieuThu_Rut_Id': me.strPhieuThu_Id,
            'strTAICHINH_CacKhoanThu_Ids': arrKhoanThu_Id.toString(),
            'strTAICHINH_SoTien_s': arrKhoanThu_SoTien.toString(),
            'strHinhThucThu_Ids': edu.util.getValById('dropHinhThucThu_Edit'),
            'strNgayTao': edu.util.getValById('txtNgayTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //1. delete search text box value
                    edu.util.viewValById("txtTimKiem_ThuTien", "");
                    //2.
                    return new Promise(function (resolve, reject) {
                        me.getList_PhieuThu(me.strNguoiHoc_Id, resolve, reject);
                    }).then(function () {
                        return new Promise(function (resolve, reject) {
                            me.getList_KhoanNhapHoc(me.strNguoiHoc_Id, resolve, reject);
                        }).then(function () {
                            //3. Chinh sua phieu thu thanh cong --> load phieu in
                            me.showHide_Box("zone-box", "zoneList_PhieuDaThu");
                            me.showHide_Box("zone-action", "zoneAction_Phieu");
                            me.showHide_Box("zone-bus", "zoneInput_ThuTien");
                            me.getList_KhoanDaThu_Rut(me.strPhieuThu_Id);
                        });
                    });
                }
                else {
                    var obj = {
                        content: "PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                var obj = {
                    content: "PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu (er): " + data.Message,
                    code: "w",
                }
                edu.system.afterComfirm(obj);
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
    getList_PhieuThu: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genList_PhieuPhu(data.Data);
                    }
                    else {
                        me.genList_PhieuPhu([]);
                    }
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert("NH_Phieu.LayDSPhieuThuNhaphoc: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_Phieu.LayDSPhieuThuNhaphoc (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'TC_PhieuThu/LayDSPhieuThuNhaphoc',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQlsv_Nguoihoc_Id': strQLSV_NguoiHoc_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhieuThu: function (strPhieu_Id) {
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
                        content: "Hủy phiếu thu thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                }
                else {
                    edu.system.alert("NH_Phieu.HuyPhieuNhapHoc: " + data.Message);
                }
                edu.system.endLoading();
                //me.checkCondition_ThuTien(me.dtNguoiHoc_Print);
                me.showHide_Box("zone-box", "zoneDetail_TTTS");
                me.showHide_Box("zone-action", "zoneAction_Save_ThuTien");
                //me.getList_KhoanNhapHoc(me.strNguoiHoc_Id);
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_Phieu.HuyPhieuNhapHoc (er): " + JSON.stringify(er));
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
    getDetail_NguoiHoc_PhieuThu: function (strPhieuThu_Id) {
        var me = this;
        // Migrate: pkg_nhaphoc_thongtin.LayTTQLSV_NguoiHoc_TTTS → PKG_CORE_NhapHoc_ThuTien.LayTTQLSV_NguoiHoc_TTTS
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4FRUQDRIXHg8mNC4oCS4iHhUVFRIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayTTQLSV_NguoiHoc_TTTS',
            'iM': edu.system.iM,
            'strId': me.strNguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiHoc_Print = data.Data[0];
                    me.getList_KhoanDaThu_Rut(strPhieuThu_Id);
                    edu.util.viewHTMLById("lblNganhLop_ThuTien", data.Data[0].DAOTAO_LOPQUANLY_TEN);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
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
    getList_KhoanDaThu_Rut: function (strPhieuThu_Id, strLoaiPhieu) {
        var me = this;
        var strPhieuThu_Rut_Id = strPhieuThu_Id;
        // Migrate: pkg_nhaphoc_thongtin.LayDSKhoanDaThuNhapHoc → PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc
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
                    edu.system.alert("PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc: " + data.Message, "w");
                    edu.system.endLoading();
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc (er): " + JSON.stringify(er), "w");
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
    getList_PhieuThu_Huy: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genList_PhieuThu_Huy(data.Data);
                    }
                    else {
                        me.genList_PhieuThu_Huy([]);
                    }
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert("NH_Phieu.LayDSPhieuThuNhaphoc_Huy: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_Phieu.LayDSPhieuThuNhaphoc_Huy (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'TC_PhieuThu/LayDSPhieuThuNhaphoc_Huy',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> KeHoachNhapHoc
    --Discription:
    -------------------------------------------*/
    // Copy từ taichinhnew.js — dùng PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp).
    // Trước đó gọi qua edu.extend.getList_KeHoachNhapHoc_NhanSu, nhưng Core/systemextend.js bản cũ
    // vẫn trỏ về pkg_nhaphoc_thongtin (API cũ) — trang này ép dùng bản mới không phụ thuộc load thứ tự.
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (typeof resolve === "function") resolve(arr);
                    if (typeof callback === "function") callback(arr, data.Pager);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },
    // Copy từ taichinhnew.js:1864 — dùng PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS.
    // Cùng lý do như getList_KeHoachNhapHoc_NhanSu: tự gọi trực tiếp, không phụ thuộc edu.extend.
    getList_NguoiHoc_TTTS: function (iTinhTrangNhapHoc, strKeHoach_Id, strTuKhoa, callback) {
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
            'iM': edu.system.iM,
            'dDaNhapHoc': iTinhTrangNhapHoc,
            'strTaiChinh_KeHoach_Id': strKeHoach_Id,
            'strNguoiThucHien_Id': '',
            'strTuKhoa': strTuKhoa,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (typeof callback === "function") callback(arr, data.Pager || 0);
                } else {
                    edu.system.alert(data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [],
        }, false, false, false, null);
    },
    genCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropKeHoachNhapHoc_ThuTien"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] GEN HTML ==> NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    cbGenTable_NguoiHoc_TTTS: function (data, iPager) {
        var me = main_doc.CheckInNhapHoc;
        me.dtNguoiHoc = data;
        if (edu.util.checkValue(data)) {
            edu.util.viewHTMLById("lblTongDaThuTien_ThuTien", data[0].SODATHUTIEN);
        }
        me.checkAuto_Select_NguoiHoc_TTTS(me.dtNguoiHoc);
        var strTuKhoa = edu.util.getValById("txtTimKiem_ThuTien");
        var jsonForm = {
            strTable_Id: "tblThuTien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CheckInNhapHoc.getList_NguoiHoc_TTTS(main_doc.CheckInNhapHoc.iTinhTrangNhapHoc,main_doc.CheckInNhapHoc.strKeHoach_Id, '" + strTuKhoa + "',main_doc.CheckInNhapHoc.cbGenTable_NguoiHoc_TTTS)",
                iDataRow: iPager,
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiHoc_ThuTien"],
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
                        html += '<span><a id="' + aData.ID + '" class="btnSelect_NguoiHoc_ThuTien" href="#">Chọn</a></span>';
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
        edu.system.endLoading();
    },
    checkAuto_Select_NguoiHoc_TTTS: function (data) {
        var me = this;
        if (data.length == 1) {//only one record
            edu.util.resetAll_BgRow("tblThuTien");
            edu.util.setOne_BgRow(strNguoiHoc_Id);
            var strNguoiHoc_Id = data[0].ID;

            me.reset_NguoiHoc_TTTS();
            me.strNguoiHoc_Id = strNguoiHoc_Id;
            console.log(strNguoiHoc_Id);
            console.log(me.dtNguoiHoc);
            console.log("3333");
            me.dtNguoiHoc_Print = me.dtNguoiHoc.find(e => e.ID === strNguoiHoc_Id);
            me.checkCondition_ThuTien(me.dtNguoiHoc_Print);
            //return new Promise(function (resolve, reject) {
            //    me.getDetail_NguoiHoc_TTTS(strNguoiHoc_Id, main_doc.CheckInNhapHoc.dtNguoiHoc, resolve, reject);

            //}).then(function (data) {
            //    me.dtNguoiHoc_Print = data;
            //    me.checkCondition_ThuTien(data);
            //});
        }
    },
    getDetail_NguoiHoc_TTTS: function (strNguoiHoc_Id, data, resolve, reject) {
        var me = this;
        var count = 0;
        var checkdata = false;
        for (var i = 0; i < data.length; i++) {
            count++;
            if (strNguoiHoc_Id == data[i].ID) {
                checkdata = true;
                resolve(data[i]);
            }
        }
        if (count == data.length) {
            if (checkdata == false) {
                resolve([]);
            }
        }
    },
    genDetail_NguoiHoc_TTTS: function (data) {
        var me = this;
        //1. id gen place
        var strHoTen = edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN);
        var strMaSo = edu.util.returnEmpty(data.MASO);
        var strNgaySinh = edu.util.returnEmpty(data.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data.NGAYSINH_NAM);
        var strSoDienThoai = edu.util.returnEmpty(data.SODIENTHOAICANHAN);
        var strQueQuan = edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);
        var strNganhNhapHoc = edu.util.returnEmpty(data.DAOTAO_NGANHNHAPHOC);
        var strSoBaoDanh = edu.util.returnEmpty(data.SOBAODANH);
        var dTongDiem = edu.util.returnZero(data.DIEMTS_TONGDIEM).toFixed(2);
        var strDoiTuong = edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);
        var strPhanTramMienGiam = edu.util.returnZero(data.PHANTRAMMIENGIAM);
        var strNganhHoc = edu.util.returnEmpty(data.NGANHHOC_TEN);
        var strKhuVuc = edu.util.returnEmpty(data.KHUVUC_TEN);
        var dTongDaThuTien = edu.util.returnEmpty(data.SODATHUTIEN);
        var strDAOTAO_LOPQUANLY_TEN = edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN);
        //3. fill data into place
        me.strNguoiHoc_Id = data.ID;
        edu.util.viewHTMLById("lblHoTen_ThuTien", strHoTen.toUpperCase());
        edu.util.viewHTMLById("lblMaSoSV_ThuTien", strMaSo);
        edu.util.viewHTMLById("lblNgaySinh_ThuTien", strNgaySinh);
        edu.util.viewHTMLById("lblSoDienThoai_ThuTien", strSoDienThoai);
        edu.util.viewHTMLById("lblQueQuan_ThuTien", strQueQuan);
        edu.util.viewHTMLById("lblNganhNhapHoc_ThuTien", strNganhNhapHoc);
        edu.util.viewHTMLById("lblNganhLop_ThuTien", strDAOTAO_LOPQUANLY_TEN);
        edu.util.viewHTMLById("lblSoBaoDanh_ThuTien", strSoBaoDanh);
        edu.util.viewHTMLById("lblTongDiem_ThuTien", dTongDiem);
        edu.util.viewHTMLById("lblDoiTuong_ThuTien", strDoiTuong);
        edu.util.viewHTMLById("lblPhanTramMienGiam_ThuTien", strPhanTramMienGiam);
        edu.util.viewHTMLById("lblNganhTrungTuyen_ThuTien", strNganhHoc);
        edu.util.viewHTMLById("lblCMT", edu.util.returnEmpty(data.CMTND_SO));
        edu.util.viewHTMLById("lblKhuVuc_ThuTien", strKhuVuc);
        //4. Tong da thu tien
        edu.util.viewHTMLById("lblTongDaThuTien_ThuTien", dTongDaThuTien);
    },
    genTable_KhoanNhapHoc: function (data) {
        var me = this;
        var dTongiDinhMuc_Chung = 0;
        var dTongDinhMuc = 0;
        var dTongDaThu = 0;
        var dTongCanThu = 0;
        var jsonForm = {
            strTable_Id: "tblKhoanNhapHoc_ThuTien",
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 0,
            },
            bHiddenHeader: true,
            sort: true,
            colPos: {
                left: [1],
                right: [2, 3, 4, 5],
                center: [0, 6]
            },
            aoColumns: [
                {//Ten Khoan Thu
                    "mRender": function (nRow, aData) {
                        var strKhoanThu_Ten = aData.TAICHINH_CACKHOANTHU_TEN;
                        return '<span id="txtKhoanThu_Ten' + aData.TAICHINH_CACKHOANTHU_ID + '">' + strKhoanThu_Ten + '</span>';
                    }
                }
                , {//so tien dinh muc chung
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc_Chung = edu.util.returnZero(aData.SOTIENDINHMUC_CHUNG);
                        dTongiDinhMuc_Chung += dSoTienDinhMuc_Chung;
                        return '<span>' + edu.util.formatCurrency(dSoTienDinhMuc_Chung) + '</span>';
                    }
                }
                , {//So tien thuc thu (dinh muc) 
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        dTongDinhMuc += dSoTienDinhMuc;
                        return '<span>' + edu.util.formatCurrency(dSoTienDinhMuc) + '</span>';
                    }
                }
                , {//so tien da thu
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        var dSoTienDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        dTongDaThu += dSoTienDaThu;
                        if (dSoTienDaThu > dSoTienDinhMuc) {
                            return '<span class="color-warning">' + edu.util.formatCurrency(dSoTienDaThu) + '</span>';
                        }
                        else {
                            return '<span>' + edu.util.formatCurrency(dSoTienDaThu) + '</span>';
                        }
                    }
                }
                , {// input so tien can thu
                    "mRender": function (nRow, aData) {
                        var strId = aData.TAICHINH_CACKHOANTHU_ID;
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        var dSoTienDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        var dSoTienThu = dSoTienDinhMuc - dSoTienDaThu;
                        if (dSoTienThu < 0) {
                            dSoTienThu = 0;
                        }
                        //onblur="main_doc.CheckInNhapHoc.checkValid_ThuTien(' + dSoTienThu + ",\'" + strId + "\'" + ')";
                        var html = '<input type="text" id="txtKhoanThu_SoTien' + strId + '" value="' + edu.util.formatCurrency(dSoTienThu) +
                            '" onblur="main_doc.CheckInNhapHoc.sumTienCanNop_ThuTien()" class="form-control td-right" data-ax5formatter="money" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //return '<a class="ponter btn btn-default btn-circle" id="btlHistory_ThuTien' + aData.ID + '"><i class="fa fa-eye color-active"></i></a>';
                        return "vnđ";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //sum footer
        edu.util.viewHTMLById("lblTongDinhMuc_Chung_ThuTien", edu.util.formatCurrency(dTongiDinhMuc_Chung));
        edu.util.viewHTMLById("lblTongDinhMuc_ThuTien", edu.util.formatCurrency(dTongDinhMuc));
        edu.util.viewHTMLById("lblTongDaThuThu_ThuTien", edu.util.formatCurrency(dTongDaThu));
        me.sumTienCanNop_ThuTien();
        //edu.util.viewHTMLById("lblTongCanThu_ThuTien", edu.util.formatCurrency(dTongDinhMuc - dTongDaThu));
        edu.system.page_load();
    },
    sumTienCanNop_ThuTien: function (id) {
        var me = this;
        var txtKhoanThu_SoTien = "";
        var dKhoanThu_SoTien = 0;
        var dTongTienCanThu = 0;
        for (var i = 0; i < me.dtKhoanThu.length; i++) {
            txtKhoanThu_SoTien = "txtKhoanThu_SoTien" + me.dtKhoanThu[i].TAICHINH_CACKHOANTHU_ID;
            dKhoanThu_SoTien = edu.util.convertStrToNum(edu.util.getValById(txtKhoanThu_SoTien));
            dTongTienCanThu += parseFloat(dKhoanThu_SoTien);
        }
        edu.util.viewHTMLById("lblTongCanThu_ThuTien", edu.util.formatCurrency(dTongTienCanThu));
    },
    checkValid_ThuTien: function (dSoTienThu, id) {
        //hien tai chua dung
        var dSoTien = 0;
        var $txtSoTien = "txtKhoanThu_SoTien" + id;

        dSoTien = edu.util.convertStrToNum(edu.util.getValById($txtSoTien));
        if (dSoTien > dSoTienThu) {
            $($txtSoTien).val(dSoTienThu);
        }
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ==> Phieu
    --Author: 
    -------------------------------------------*/
    genList_PhieuPhu: function (data) {
        var me = this;
        var html = '';
        //1. Chung nhan da thu tien 
        $("#zoneSign_DaThuTien").html('');
        if (data.length > 0) {
            $("#zoneSign_DaThuTien").html('<span class="label label-danger"><i class="fa fa-forumbee"></i> Đã thu</span>');
        }
        else {
            $("#zoneSign_DaThuTien").html('<span class="label label-default"><i class="fa fa-forumbee"></i> Chưa thu</span>');
        }
        //2. danh sach phieu thu
        var $phieuthu = "#listPhieuThu_ThuTien";
        $($phieuthu).html('');
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i])) {
                html += '<a href="#" class="btnDetail_PhieuThu" id="detail_phieuthu' + data[i].ID + '" title="Chi tiết/ In phiếu"> ';
                html += '<small class="bold" style="border-bottom:3px solid #f1f1f1; padding-bottom:4px">#' + data[i].SOPHIEUTHU + ' </small>';
                html += '</a>';
                html += '<a href="#" class="btn btn-default btnEdit_PhieuThu" id="edit_phieuthu' + data[i].ID + '"> ';
                html += '<i class="fa fa-pencil color-active"></i>';
                html += '</a>';
            }
        }
        if (data.length == 0) {
            html = '<a href="#">#</a>';
        }
        $($phieuthu).html(html);
    },
    genList_PhieuThu_Huy: function (data) {
        var me = this;
        var html = '';
        //2. danh sach phieu thu
        var $phieuthu = "#listPhieuThu_Huy_ThuTien";
        $($phieuthu).html('');
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i])) {
                html += '<a href="#" class="btnDetail_PhieuHuy" id="detail_phieuhuy' + data[i].ID + '" title="Chi tiết/In phiếu"> ';
                html += '<small class="bold">#' + data[i].SOPHIEUTHU + '</small>';
                html += '</a>';
            }
        }
        if (data.length == 0) {
            html = '<a href="#">#</a>';
        }
        $($phieuthu).html(html);
    },
    genDetail_PhieuThu: function (data) {
        var me = this;

        var dataPhieuIn = me.dtNguoiHoc_Print;
        if (data.length > 0 && dataPhieuIn != undefined) {
            console.log(data[0].MAUIN_MASO);
            if (data[0].MAUIN_MASO && data[0].MAUIN_MASO.indexOf("BAOCAO_") == 0) {
                console.log(1111111111);
                var strDuongDan = edu.system.dtMauBaoCao.find(e => data[0].MAUIN_MASO == e.MAUIMPORT_MA);
                if (strDuongDan) strDuongDan = strDuongDan.MAUIMPORT_DUONGDAN;
                edu.system.report(data[0].MAUIN_MASO, strDuongDan, function (addKeyValue) {
                    addKeyValue('strQLSV_NguoiHoc_Id', me.strNguoiHoc_Id)
                    addKeyValue('strTaiChinh_KeHoach_Id', edu.util.getValById('dropKeHoachNhapHoc_ThuTien'))
                }, "", { "XEMFILE": "pdf" })
                $("#print_hoadon").html("");
                return;
            }
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
        edu.extend.genData_PhieuThu(data, [dataPhieuIn], "print_hoadon", "", objKhoanThu => {
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

    ////////
    genFormEdit_PhieuDaThu: function (data) {
        var me = this;
        if (data.length > 0) {
            $("#lblEdit_PhieuDaThu").html("#" + data[0].SOCHUNGTU);
            edu.util.viewValById("dropHinhThucThu_Edit", data[0].HINHTHUCTHU_ID);
            edu.util.viewValById("txtNgayTao", data[0].NGAYTAO_DD_MM_YYYY);
        }
        var dTongSoTienDaThu = 0;
        var dTongTienDieuChinh = 0;
        var jsonForm = {
            strTable_Id: "tblEdit_PhieuDaThu",
            aaData: data,
            bHiddenHeader: true,
            sort: true,
            colPos: {
                left: [1],
                right: [2, 3, 4],
                center: [0]
            },
            aoColumns: [
                {//Ten Khoan Thu
                    "mRender": function (nRow, aData) {
                        var strKhoanThu_Ten = aData.NOIDUNG;
                        return '<span>' + strKhoanThu_Ten + '</span>';
                    }
                }
                , {//so tien da thu
                    "mRender": function (nRow, aData) {
                        var dSoDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        dTongSoTienDaThu += dSoDaThu;
                        return '<span>' + edu.util.formatCurrency(dSoDaThu) + '</span>';
                    }
                }
                , {// so tien dieu chinh
                    "mRender": function (nRow, aData) {
                        var strId = aData.TAICHINH_CACKHOANTHU_ID;
                        var dSoDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        dTongTienDieuChinh += dSoDaThu;
                        var html = '<input type="text" id="txtKhoanThu_SoTien_Edit' + strId + '" value="' + edu.util.formatCurrency(dSoDaThu) +
                            '" onblur="main_doc.CheckInNhapHoc.sumEdit_SoTien_PhieuDaThu()" class="form-control td-right" data-ax5formatter="money" />';
                        return html;
                    }
                }, {//so tien da thu
                    "mRender": function (nRow, aData) {
                        return '<span>vnđ</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //sum footer
        edu.util.viewHTMLById("lblTongDaThu_ThuTien", edu.util.formatCurrency(dTongSoTienDaThu));
        edu.util.viewHTMLById("lblTongSua_ThuTien", edu.util.formatCurrency(dTongTienDieuChinh));

    },
    sumEdit_SoTien_PhieuDaThu: function () {
        var me = this;
        var txtKhoanThu_SoTien = "";
        var dKhoanThu_SoTien = 0;
        var dTongTien_DieuChinh = 0;
        for (var i = 0; i < me.dtKhoanDaThu.length; i++) {
            txtKhoanThu_SoTien = "txtKhoanThu_SoTien_Edit" + me.dtKhoanDaThu[i].TAICHINH_CACKHOANTHU_ID;
            dKhoanThu_SoTien = edu.util.convertStrToNum(edu.util.getValById(txtKhoanThu_SoTien));
            dTongTien_DieuChinh += parseFloat(dKhoanThu_SoTien);
        }
        edu.util.viewHTMLById("lblTongSua_ThuTien", edu.util.formatCurrency(dTongTien_DieuChinh));
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ==> Phieu Xuat Hoa Don
    --Author: 
    -------------------------------------------*/
    getList_KhoanDaThu_XuatHoaDon: function (strPhieuThu_Id) {
        var me = this;
        // Migrate: pkg_nhaphoc_thongtin.LayDSKhoanDaThuNhapHoc → PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKKS4gLwUgFSk0DykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc',
            'iM': edu.system.iM,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            'strPhieuThu_Rut_Id': strPhieuThu_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHoaDon = data.Data;
                    if (data.Data.length > 0) {
                        me.showHide_Box("zone-bus", "zoneEdit_PhieuXuatHoaDon");
                        $("#zoneList_PhieuDaThu").slideUp();
                        $("#zoneAction_Phieu").slideUp();
                    }
                    me.genTable_XuatHoaDon(data.Data);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc (er): " + JSON.stringify(er), "w");
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
    saveHoaDon: function (strTable_id, linkHDDT, strPhuongThuc_Ma) {
        var me = this;
        var strIds = "";
        var strTAICHINH_CACKHOANTHU_Ids = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoLuong = "";
        var strDonGia = "";
        var strSoTien = "";
        var arrIdCheck = [];
        var arrDonViTinh = [];
        var idem = 0;
        //Lấy dữ liệu theo các check box đã chọn
        var x = document.getElementById(strTable_id).getElementsByTagName('tbody')[0].rows;
        for (var i = 0; i < x.length; i++) {
            var strId = x[i].id;
            if (!edu.util.checkValue(strId)) {
                console.log("Có vấn đề");
                console.log(x[i]);
                continue;
            }
            strIds += strId + ",";
            strTAICHINH_CACKHOANTHU_Ids += $(x[i]).attr('khoanthugoc_id') + ",";
            //
            var strcheck = strId + strTAICHINH_CACKHOANTHU_Ids;
            if (arrIdCheck.indexOf(strcheck) != -1) return;
            else {
                arrIdCheck.push(strcheck);
            }
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML + "#";
            strSoLuong += getSoTien(x[i].cells[3].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strSoTien += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            arrDonViTinh.push(me.strDonViTinh_Ten);
        }
        strIds = strIds.substr(0, strIds.length - 1);
        strTAICHINH_CACKHOANTHU_Ids = strTAICHINH_CACKHOANTHU_Ids.substr(0, strTAICHINH_CACKHOANTHU_Ids.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        strSoLuong = strSoLuong.substr(0, strSoLuong.length - 1);
        strDonGia = strDonGia.substr(0, strDonGia.length - 1);

        if (linkHDDT != "" && linkHDDT != undefined) {
            if (strPhuongThuc_Ma == "HDDTNHAP") {
                saveHDDT_Nhap(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien);
            }
            else {
                saveHDDT(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien);
            }
        } else {
            save_HoaDon(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien);
        }
        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save_HoaDon(strTaiChinh_DaNop_Ids, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var obj_save = {
                'action': 'TC_DaNop_HoaDon/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_DaNop_Ids': strTaiChinh_DaNop_Ids,
                'strTAICHINH_CACKHOANTHU_Ids': strTAICHINH_CACKHOANTHU_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
            };
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Id);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message, "w");
                        edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        }
        function saveHDDT(strTaiChinh_DaNop_Ids, strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var obj_save = {
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_DaNop_Ids,
                'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_MA': me.strHinhThucThu_Ma,
                'strHinhThucThu_TEN': me.strHinhThucThu_Ten,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strPhuongThuc_MA': strPhuongThuc_Ma,
                'strDiaChiNguoiMua': me.strDiaChiNguoiMua,
            };
            obj_save.action = 'HDDT_HoaDon/ThemMoi';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        informSaveSuccess(d.Id);
                        me.strHoaDon_Id = d.Id;
                        edu.extend.getData_Phieu(d.Id, "HOADON", "MauInHoaDon", main_doc.CheckInNhapHoc.changeWidthPrint);
                        edu.extend.notifyBeginLoading('Sinh hóa đơn thành công', 'notifications_HoaDon');
                    }
                    else {
                        edu.system.alert("Lỗi: " + d.Message, "w");
                        edu.extend.notifyBeginLoading(d.Message, undefined, 5000);
                        edu.extend.notifyBeginLoading(d.Message, 'notifications_HoaDon');
                        me.closePhieu();
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
        function saveHDDT_Nhap(strTaiChinh_DaNop_Ids, strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var obj_save = {
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_DaNop_Ids,
                'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_MA': me.strHinhThucThu_Ma,
                'strHinhThucThu_TEN': me.strHinhThucThu_Ten,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strPhuongThuc_MA': strPhuongThuc_Ma,
                'strDiaChiNguoiMua': me.strDiaChiNguoiMua,
            };
            obj_save.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        var strLink = edu.system.objApi["HDDT"];
                        strLink = strLink.substring(0, strLink.length - 3);
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.strhost + strLink;
                        }
                        var win = window.open(strLink + d.Data, '_blank');
                        win.focus();
                    }
                    else {
                        edu.system.alert("Lỗi: " + d.Message, "w");
                        edu.extend.notifyBeginLoading(d.Message, undefined, 5000);
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
        function informSaveSuccess(strHoaDon_Id) {
            $("#btnInHoaDon").show();
            $("#btnHuyHoaDon").show();
            $("#btnSaveHD").replaceWith('');
            $(".btnXuat_HDDT").remove();
        }
    },
    delete_HD: function (strSo_Id) {
        var me = this;
        var obj_delete = {
            'action': 'TC_HoaDon/HuyHoaDon',
            'versionAPI': 'v1.0',
            'strHoaDon_Id': strSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_TinhTrangTaiChinh();
                    me.closePhieu();
                    edu.extend.notifyBeginLoading('Xóa hóa đơn thành công!');
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
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
    genTable_XuatHoaDon: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblEdit_PhieuXuatHoaDon",
            colPos: { center: [0, 5] },
            aaData: data,
            "aoColumns": [
                {
                    "mDataProp": "NOIDUNG"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtNoiDungHD' + aData.ID + '" value="' + aData.NOIDUNG + '" class="form-control" />';
                    }
                }
                , {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoLuong' + aData.ID + '" value="1" class="form-control" />';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtTongTien' + aData.ID + '" value="' + aData.SOTIENDATHU + '" class="form-control" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" checked="checked"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genHTML_NoiDung_HoaDon: function (strTableId) {
        var me = this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInHoaDon";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_HOADON_2018";
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html?v=2', function () {
            if (document.getElementById(zoneMauIn).innerHTML == "" && document.getElementById(zoneMauIn).innerHTML.length == 0) {
                edu.extend.notifyBeginLoading("Không thể load phiếu sửa!. Vui lòng gọi GM", "w");
            }
            else {
                loadPhieu();
            }
            me.changeWidthPrint();
        });
        function loadPhieu() {
            //Hiển thị thông tin đối tượng thu
            var data = me.dtNguoiHoc_Print;
            $(".txtMaNCSPTC_PT_Edit").html(data.MASO);
            $(".txtHoTenPTC_PT_Edit").html(data.HODEM + " " + data.TEN);
            $(".iNgayPTC_PT_Edit").html(edu.util.thisDay());
            $(".iThangPTC_PT_Edit").html(edu.util.thisMonth());
            $(".iNamPTC_PT_Edit").html(edu.util.thisYear());
            $(".txtNgaySinhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGAYSINH));
            $(".txtMaSoThue_PT_Edit").html(edu.util.returnEmpty(data.MASOTHUECANHAN));
            $(".txtDiaChiPTC_PT_Edit").html(edu.util.returnEmpty(data.NOIOHIENNAY));
            $(".txtLopPTC_PT_Edit").html(edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGANHHOC_N1_TEN));
            $(".txtKhoaPTC_PT_Edit").html(edu.util.returnEmpty(data.KHOAHOC_N1_TEN));
            me.strDiaChiNguoiMua = data.NOIOHIENNAY;
            //Các thao tác chuyển sang mẫu viết phiếu
            $(".beforeActive").hide();
            $("#zoneThongTinHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnInHoaDon").hide();
            $("#btnHuyHoaDon").hide();
            $("#zoneActionXuatHoaDon").html(me.strHDDT);
            if (document.getElementById('btnSaveHD') == undefined) {
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHD" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Lưu hóa đơn" class="btn"><i style="color: #00a65a" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất Hóa đơn</a></div>');

                $("#btnSaveHD").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit');
                    });
                });
            }
            //Kiểm tra số lượng check box của bảng hiện tại
            var x = $('#' + strTableId + ' tbody tr td input[type="checkbox"]');
            var idem = 0;
            var strHinhThucThu_Ma = "";
            //Lấy dữ liệu theo các check box đã chọn
            var arrcheck = [];
            console.log(x);
            for (var i = 0; i < x.length; i++) {
                //if (arrcheck.indexOf(x[i].id) != -1) continue;
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id.replace("checkX", "");
                    console.log(strId);
                    var jsonHT = edu.util.objGetDataInData(strId, me.dtHoaDon, "ID")[0];
                    if (strHinhThucThu_Ma == "") {
                        strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        me.strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        me.strHinhThucThu_Ten = jsonHT.HINHTHUCTHU_TEN;
                        me.strLoaiTienTe_Ma = jsonHT.LOAITIENTE_MA;
                        me.strDonViTinh_Ten = jsonHT.DONVITINH_TEN;
                    }
                    var strKhoanThu = x[i].parentNode.parentNode.cells[1].innerHTML;
                    var strNoiDung = $("#txtNoiDungHD" + strId).val();
                    var strSoLuong = $("#txtSoLuong" + strId).val();
                    var dSoTien = $("#txtTongTien" + strId).val();
                    if (dSoTien == 0) continue;
                    idem++;
                    var rows = '';
                    rows += '<tr id="' + strId + '" name="' + jsonHT.DAOTAO_THOIGIANDAOTAO_ID + '" khoanthugoc_id="' + jsonHT.TAICHINH_CACKHOANTHU_ID + '">';//name: DAOTAO_THOIGIANDAOTAO_ID
                    rows += '<td>' + idem + '</td>';
                    rows += '<td>' + strKhoanThu + '</td>';
                    rows += '<td id="lbNoiDung' + strId + '">' + strNoiDung + '</td>';
                    rows += '<td>' + strSoLuong + '</td>';
                    rows += '<td id="txtTongTienThuHD' + strId + '" name="' + dSoTien + '">' + dSoTien + '</td>';
                    rows += '<td id="lbThanhTien' + strId + '"></td>';
                    rows += '</tr>';
                    $('#tbldataPhieuThuPopup_PT_Edit tbody').append(rows);
                }
            }
            //Hiển thị tổng tiền đã chọn trên cùng bên trái
            me.tinhHeSoGiaTien('tbldataPhieuThuPopup_PT_Edit', 3, 4, 5);
            edu.system.move_ThroughInTable("tbldataPhieuThuPopup_PT_Edit");
            edu.system.insertSumAfterTable("tbldataPhieuThuPopup_PT_Edit", [3, 4, 5]);
            var x = $("#tbldataPhieuThuPopup_PT_Edit tfoot td:eq(5)").html();//Lấy tổng tiền từ cuối bảng
            if (x == 0 || x == '0' || x == undefined) {
                $("#btnClose_HDBL").trigger('click');
                return;
            }
            $(".txtTongTien_PT_Edit").html(x);
            x = x.replace(/,/g, '');
            var strSoTien = to_vietnamese(x) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            $(".txtSoTienPTC_PT_Edit").html(strSoTien);
        }
    },
    /*------------------------------------------
   --Discription: [4] GEN HTML ==> Viet Hoa Don
   --ULR: Modules
   -------------------------------------------*/
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauInHoaDon");
        edu.util.printHTML('MauInHoaDon');
        $("#zoneThongTinHoaDon").slideUp('slow');
        $("#zoneTimKiemSinhVien").slideDown('slow');
        $("#zoneThongTinDoiTuong").slideDown('slow');
        me.save_TinhTrangHoaDon(me.strHoaDon_Id);
        me.strHoaDon_Id = "";
    },
    closePhieu: function () {
        var me = this;
        $("#zoneThongTinHoaDon").slideUp('slow');
        $("#zoneTimKiemSinhVien").slideDown('slow');
        $(".btnXuat_HDDT").remove();
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
            document.getElementById('zoneThongTinHoaDon').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
            document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneThongTinHoaDon').style.paddingLeft = "20px";
            document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        }
        edu.extend.genChonLien("MauInHoaDon", "zoneLienHoaDon");
    },
    genHTML_HDDT: function (data) {
        var me = main_doc.CheckInNhapHoc;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="btnXuat_HDDT" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="' + data[i].TEN + '" class="btn" ><i style="' + data[i].THONGTIN3 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a><a class="color-active bold lbsymbolHD">' + data[i].TEN + '</a></div>';
        }
        me.strHDDT = row;
    },
    tinhHeSoGiaTien: function (strTable_Id, iColHeSo, iColGiaTien, iColHienThi) {
        var me = this;
        var x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
        for (var i = 0; i < x.length; i++) {
            var dHeSo = x[i].cells[iColHeSo].innerHTML;
            var dGiaTien = x[i].cells[iColGiaTien].innerHTML;
            dHeSo = dHeSo.replace(/ /g, "").replace(/,/g, "");
            dGiaTien = dGiaTien.replace(/ /g, "").replace(/,/g, "");
            //
            dHeSo = parseFloat(dHeSo);
            if (edu.util.floatValid(dHeSo)) {
                dHeSo = dHeSo;
            }
            dGiaTien = parseFloat(dGiaTien);
            if (edu.util.floatValid(dGiaTien)) {
                dGiaTien = dGiaTien;
            }
            x[i].cells[iColHienThi].innerHTML = edu.util.formatCurrency(dGiaTien * dHeSo);
        }
    },
    save_TinhTrangHoaDon: function (strSoHoaDon_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_HoaDon/Them_TinhTrangInHoaDon',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoHoaDon_Id': strSoHoaDon_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
            },
            error: function (er) {
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    cbGenCombo_HinhThucThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropHinhThucThu"],
            type: "",
        };
        edu.system.loadToCombo_data(obj);
        var strTienMat_Id = $("#dropHinhThucThu #TM").val();
        $("#dropHinhThucThu").val(strTienMat_Id).trigger("change");

    },
    printHTML: function (divId) {
        ////Get the HTML of div
        //var divElements = document.getElementById(divId).innerHTML;
        ////Get the HTML of whole page
        //var oldPage = document.body.innerHTML;

        ////Reset the page's HTML with div's HTML only
        //document.body.innerHTML = "<html><head><title></title></head><body>" + divElements + "</body>";
        ////Print Page
        //window.print();

        ////Restore orignal HTML
        //document.body.innerHTML = oldPage;

        //the second print
        var content = document.getElementById(divId).innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=960');

        mywindow.document.write('<html><head><title>Print</title><style>@media print{@page{margin:0}body{margin:1.0cm}}</style>');
        mywindow.document.write('</head><body>');
        mywindow.document.write(content);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        
        setTimeout(function () {
            console.log(111111);
            mywindow.close();//chrome bị lỗi phải comment lại
        }, 3000);
        return true;
    },

    save_TiepNhan: function (obj) {
        var me = this;
        //2.
        var obj_save = {
            'action': 'NH_QuayNhapHoc/ThucHienTiepNhanNhapHoc',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuTien'),
            'strQLSV_NguoiHoc_TTTS_Id': me.strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //1. delete search text box value
                    var dtTiepNhan = data.Data.rsTiepNhan;
                    if (dtTiepNhan.length) {
                        //edu.system.alert('Tiếp nhận thành công<br/><span class="italic" style="color: green; font-size: 40px">' + dtTiepNhan[0].MATIEPNHAN + " : " + dtTiepNhan[0].NGAYTAO_DD_MM_YYYY + '</span>')
                        $("#lblTiepNhapTT").html(dtTiepNhan[0].MATIEPNHAN + " : " + dtTiepNhan[0].NGAYTAO_DD_MM_YYYY);
                        $("#lblThuTuTT").html(edu.util.returnEmpty(dtTiepNhan[0].MATIEPNHAN));
                        $("#lblHoTenTT").html(edu.util.returnEmpty(data.Data.rsSinhVien[0].HOVATEN));
                        $("#lblQRTT").html('<img src="https://api.vietqr.io/image/970418-' + data.Data.rs[0].MADINHDANHTONG + '-JIzXIaG.jpg?accountName=TRUONG%20DAI%20HOC%20CMC&amount=' + data.Data.rs[0].SOTIENPHAINOP + '&addInfo=' + data.Data.rsSinhVien[0].MASINHVIEN + '" style="width:80px" />');
                        $("#lblMaSVTT").html(edu.util.returnEmpty("<img alt='Barcode Generator TEC - IT' src = 'https://barcode.tec-it.com/barcode.ashx?data=" + data.Data.rsSinhVien[0].MASINHVIEN + "&code=Code39'  style='height: 40px' />"));
                        $("#lblSoTienTT").html(edu.util.formatCurrency(edu.util.returnEmpty(dtTiepNhan[0].TONGSOTENDANOP)));
                        $("#lblKetQuaTT").html(edu.util.returnEmpty(dtTiepNhan[0].TINHTRANGTHANHTOAN));
                        $("#myModalThanhToan").modal("show");
                        
                    }

                    //console.log($("#zonebtnTT a[name=PhieuNhapHoc_CMC_CheckIn_01]"));
                    //$("#zonebtnTT a[name=PhieuNhapHoc_CMC_CheckIn_01]").trigger("click");
                }
                else {
                    var obj = {
                        content: "" + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                var obj = {
                    content: data.Message,
                    code: "w",
                }
                edu.system.afterComfirm(obj);
                //edu.system.endLoading();
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}