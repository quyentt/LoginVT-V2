/*----------------------------------------------
--Author: Văn Hiệp 
--Phone: 
--Date of created: 17/10/2017
--Input: 
--Output:
--API URL: TaiChinh/TC_ThuChi_HoaDon
--Note:
--Updated by:
--Date of updated:
1. getList_DoiTuongThu -> genTable_DoiTuongThu -> Chọn nếu chỉ có 1 thằng
2. Chọn đối tượng -> active_DoiTuong -> getDetail_DoiTuong -> viewForm_DoiTuong -> getList_TinhTrangTaiChinh (các khoản thu, thông tin, tổng tiền các khoản thu, thông tin đối tượng)
3. Chọn các khoản thu (không sửa) -> btnAddnewHoaDon -> edu.extend.getData_Phieu -> activeInHoaDon -> printPhieu
4. Chia nhỏ nội dung hóa đơn (chọn khoản thu cần tách(trên bảng hóa đơn) -> hiển thi popup lấy thông tin từ row gốc -> chọn các khoản cần tách -> Lấy nội dung khoản cần tách theo row gốc 
-> Chỉnh sửa nội dung số tiền trên các row -> kiểm tra số tiền đống hiển thị -> lấy thông tin các row thêm dựa vào id khoản thu và không trùng id đã nộp-> thêm vào sau dòng cần tách của bảng hóa đơn với nội dung giống hệt như load bảng);
.btnTachKhoanThu -> tachKhoan_HoaDon(hiện thị ND) -> .ckbLKT_HD(addrow) -> #btnThucHienTachKhoan -> addKhoanThuCanTach -> addThemNoiDung(vào bảng hóa đơn)
----------------------------------------------*/
function HoaDon() { };
HoaDon.prototype = {
    strHoaDon_Id: '',
    objHTML_HDBL: {},
    dtKhoanDaNopChuaXuatHoaDon: null,
    dtKhoanDaNopDaXuatHoaDon: null,
    dt_HS: '',
    dt_DoiTuongThu: '',
    strHSSV_Id: '',
    //Dành cho tách khoản thu
    strKhoanCanTach_Id: '',
    strHDDT: '',
    strHinhThucThu_Ma: '',
    strHinhThucThu_Ten: '',
    strDonViTinh_Ten: '',
    strLoaiTienTe_Ma: '',
    dtHoaDon: [],
    strChuongTrinh_Id: '',
    //data tinh hinh hoc phi sinh vien
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        edu.system.pageSize_default = 10;
        $('.dropdown-menu').on('click', function (event) {
            //event.stopImmediatePropagation();
            // The event won't be propagated up to the document NODE and 
            // therefore delegated events won't be fired
            event.stopPropagation();
        });
        edu.extend.addNotify();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.getList_DoiTuongThu();
        /*------------------------------------------
        --Discription: Initial obj HoaDon
        -------------------------------------------*/
        me.objHTML_HDBL = {
            table_id: "tbldata_HoaDon"
        };
        /*------------------------------------------
        --Discription: Action SinhVien
        -------------------------------------------*/
        $("#btnSearch").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_DoiTuongThu();
            $("#zoneTimKiemSinhVien .dropdown").removeClass('open');
            $("#advancedSearch").attr('aria-expanded', 'false');
        });
        $("#btnSeachSinhVien").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_DoiTuongThu();
        });
        $("#txtTuKhoa_Search").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                e.stopImmediatePropagation();
                me.getList_DoiTuongThu();
            }
        });
        $('#txtTuKhoa_Search').focus();
        $("#MainContent").delegate('.detail_HoSo_HoaDon', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_HSDoiTuong(id, point);
        });
        $("#MainContent").delegate('.detail_HoSo_HoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            if (this.id != me.strHSSV_Id) {
                me.active_DoiTuong(this.id);
                me.genFormHoaDon();
            }
        });
        $("#btnClose_DoiTuong").click(function (e) {
            e.stopImmediatePropagation();
            $("#zoneThongTinDoiTuong").slideUp();
            //Xoa hien thi NCS
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            });
            me.resetDoiTuongThu();
        });
        /*------------------------------------------
        --Discription: Action HoaDon
        -------------------------------------------*/
        $("#btnAddnewHoaDon").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_HoaDon') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_HoaDon('tbldata_HoaDon');
            return false;
        });
        $("#btnAddnewHoaDonQuaBank").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_HoaDon_QuaBank') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_HoaDon('tbldata_HoaDon_QuaBank');
            return false;
        });
        $("[id$=chkSelectAll_HoaDon]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_HDBL);
        });
        $("#tbldata_HoaDon").delegate(".inputsotien", "keyup", function (e) {
             me.show_TongTien('tbldata_HoaDon');
        });
        $("#zoneThongTinDoiTuong").delegate('.detail_HoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strHoaDon_Id = this.id;
            me.strHoaDon_Id = strHoaDon_Id;
            $(".beforeActive").hide();
            $("#zoneThongTinHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strHoaDon_Id, "HOADON", "MauInHoaDon", main_doc.HoaDon.changeWidthPrint);
        });
        $("#zoneThongTinDoiTuong").delegate('.btnTachKhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            me.tachKhoan_HoaDon(this);
        });
        $("#MainContent").delegate('.ckbLKT_HD', 'click', function (e) {
            e.stopImmediatePropagation();
            var id = this.id;//Khoản thu id
            var strKhoanThuGoc_Id = me.strKhoanCanTach_Id;
            var pointKhoanThuGoc = document.getElementById(strKhoanThuGoc_Id);
            var strKhoanThu_Name = this.title;
            var strHocKy = $("#txtHocKyKhoanTach" + strKhoanThuGoc_Id).html();
            var strDot = $("#txtDotKhoanTach" + strKhoanThuGoc_Id).html();
            var stt = document.getElementById("tblChiTietKhoan_TachKhoan").getElementsByTagName('tbody')[0].rows.length + 1;
            if (this.checked) {
                var row = '';
                row += '<tr id="' + id + '" class="tr-bg">';
                row += '<td>' + stt + '</td>';
                row += '<td>' + strHocKy + '</td>';
                row += '<td>' + strDot + '</td>';
                row += '<td>' + strKhoanThu_Name + '</td>';
                row += '<td><input id="txtNoiDung' + id + '" style="width: 100%; text-align: left"></td>';
                row += '<td>0</td>';
                row += '<td>';
                row += '<input id="txtTongTienKhoanTach' + id + '" class="inputsotien" value="0" style="width: 150px">';
                row += '</td>';
                row += '<td>';
                row += '<a class="btnXoaKhoanThu" id="'+ id +'">Xóa</a>';
                row += '</td>';
                row += '</tr>';
                $("#tblChiTietKhoan_TachKhoan tbody").append(row);
            } else {
                $("#tblChiTietKhoan_TachKhoan tbody #" + id).replaceWith('');
            }
        });
        $("#zoneThongTinTachKhoan").delegate('.btnXoaKhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            var strKhoanThu_Id = this.id;
            $('#DSKhoanThu input[id="' + strKhoanThu_Id + '"]').trigger("click");
            edu.system.insertSumAfterTable("tblChiTietKhoan_TachKhoan", [5, 6]);
        });
        
        $("[id$=chkSelectAll_HoaDon_QuaBank]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_HoaDon_QuaBank"});
        });

        $("#btnThucHienTachKhoan").click(function (e) {
            e.preventDefault();
            var dTongTienSau = $("#txtTongTienKhoanTach").html().replace(/,/g, '');
            dTongTienSau = parseFloat(dTongTienSau);
            if (dTongTienSau < 0) {
                edu.system.alert("Khoản thu vượt quá định mức", "w");
                //return;
            } 
            me.addKhoanThuCanTach();
        });
        $("#zoneThongTinTachKhoan").delegate('.btnCloseKhoanCanTach', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#zoneThongTinDoiTuong").slideDown('slow');
            $("#zoneThongTinTachKhoan").slideUp('slow');
        });
        $("#tblChiTietKhoan_TachKhoan").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            var dTongTienTruocTach = parseFloat($("#txtTongTienKhoanTruocTach").html().replace(/,/g,''));
            var dTongTienCanTach = 0;
            var x = $("#tblChiTietKhoan_TachKhoan .inputsotien").each(function () {
                var strTien = this.value;
                var dSoTien = parseFloat(strTien.replace(/,/g, ''));
                dTongTienCanTach += dSoTien;
            });
            setTimeout(function () {
                $("#txtTongTienKhoanTach").html(edu.util.formatCurrency(dTongTienTruocTach - dTongTienCanTach));
            }, 100);
        });
        me.eventTongTien("tbldata_HoaDon");
        $("#MainContent").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id
            var xCheck = me.dtNutHDDT.find(e => e.ID === strId);
            if (xCheck && xCheck.THONGTIN4) edu.system.objApi["HDDT"] = xCheck.THONGTIN4;
            var strLinkAPI = "1111"; //$(this).attr("name");
            //edu.system.objApi["HDDT"].replace(/api/g, '') = strLinkAPI;
            var strPhuongThuc_Ma = $(this).attr("title");
            if (strPhuongThuc_Ma.indexOf("HDDTNHAP") == 0) {
                me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit', strLinkAPI, strPhuongThuc_Ma); 
            } else {
                edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', 'w');
                $("#btnYes").click(function (e) {
                    $('#myModalAlert').modal('hide');
                    me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit', strLinkAPI, strPhuongThuc_Ma); 
                });
            }
        });
        /*------------------------------------------
        --Discription: Action Viet HoaDon
        -------------------------------------------*/
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
        /*------------------------------------------
        --Discription: Action Cac Khoan DaThu
        -------------------------------------------*/
        $("#zoneThongTinDoiTuong").delegate('.detail_KhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            $(".beforeActive").hide();
            $("#zoneThongTinHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInHoaDon', main_doc.HoaDon.changeWidthPrint);
        });
        /*------------------------------------------
        --Discription: Action Tinh Trang tai chinh
        -------------------------------------------*/
        $(".btnChiTietKhoanThu").click(function (e) {
            e.stopImmediatePropagation();
            var strzone = $(this).attr('href');
            $(".chitietkhoanthu").hide();
            $(".zoneThongTinBoSung").slideUp('slow');
            $(strzone).slideDown('slow');
            setTimeout(function () {
                me.getList_ChiTietKhoanThu(strzone);
            }, 480);
        });
        $(".refreshKhoanKhu").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var strzone = $(this).attr('href');
            me.getList_ChiTietKhoanThu(strzone);
        });
        $(".btnCloseKhoanThu").click(function (e) {
            e.stopImmediatePropagation();
            $(".chitietkhoanthu").hide();
            $(".zoneThongTinBoSung").slideDown('slow');
        });

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_TrangThaiSV();
        me.getList_DMLKT();
        me.getList_NutHDDT();
        //
        $('#dropSearch_HeDaoTao_HD').on('change', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao_HD').on('change', function (e) {
            if ($('#dropSearch_KhoaDaoTao_HD').val() != "") {
                me.getList_ChuongTrinhDaoTao();
                me.getList_LopQuanLy();
            }
        });
        $('#dropSearch_ChuongTrinh_HD').on('change', function (e) {
            if ($('#dropSearch_ChuongTrinh_HD').val() != "") {
                me.getList_LopQuanLy();
            }
        });
        me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });
    },
    /*------------------------------------------
    --Discription: Common
    -------------------------------------------*/
    resetDoiTuongThu: function () {
        var me = this;
        if (me.strHSSV_Id == '') return;
        me.strHSSV_Id = "";
        var arrTable = ["tbldata_HoaDon", "tbldata_HDDaXuat"];
        var arrSetRezo = ["txtSoHienThi_DuocMien", "txtSoHienThi_DaNop", "txtSoHienThi_NoRiengTungKhoan", "txtSoHienThi_NoChungCacKhoan"];
        var arrCheckBox = ["chkSelectAll_HoaDon"];

        for (var i = 0; i < arrTable.length; i++) {
            var x = document.getElementById(arrTable[i]);
            if (x == undefined) continue;
            x.getElementsByTagName('tbody')[0].innerHTML = "";
            x.getElementsByTagName('tfoot')[0].innerHTML = "";
        }

        for (var i = 0; i < arrSetRezo.length; i++) {
            var x = document.getElementById(arrSetRezo[i]);
            if (x == undefined) continue;
            x.innerHTML = 0;
        }

        for (var i = 0; i < arrCheckBox.length; i++) {
            var x = document.getElementById(arrCheckBox[i]);
            if (x == undefined) continue;
            x.checked = false;
        }

        $(".tong_sotienTab").html(0);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao_HD"),
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
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_HD"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_HD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinh_HD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DMLKT: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NutHDDT: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'TAICHINH.NUTHDDT',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_HDDT(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            renderPlace: ["dropSearch_HeDaoTao_HD"],
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
            renderPlace: ["dropSearch_KhoaDaoTao_HD"],
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
            renderPlace: ["dropSearch_ChuongTrinh_HD"],
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
            renderPlace: ["dropSearch_Lop_HD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_NguoiThu: function (data) {
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
            renderPlace: ["dropSearch_NguoiThu_IHD"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input type="checkbox" id="ckbDSTrangThaiSV_HD_ALL" class="ckbDSTrangThaiSV_HD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print; pull-left">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_HD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
        //me.getList_KhoanThu();
    },
    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-4 checkbox-inline user-check-print; pull-left">';
            row += '<input  style="float: left; margin-right: 5px" type="checkbox" id="' + dataKhoanThu[i].ID + '" class="ckbLKT_HD" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanCanTach").replaceWith(row);
        //me.getList_KhoanThu_ChuaXuat();
    },
    genHTML_HDDT: function (data) {
        var me = this;
        me["dtNutHDDT"] = data;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            //OLD: khối dọc 85px, icon fa-4x, màu icon lấy từ THONGTIN3 -> chữ đè lên icon, cỡ lệch nhau.
            //row += '<div class="btnXuat_HDDT" id="' + data[i].ID +'" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="' + data[i].TEN + '" class="btn" ><i style="' + data[i].THONGTIN3 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a><a class="color-active bold lbsymbolHD">' + data[i].TEN + '</a></div>';
            row += '<div class="btnXuat_HDDT" id="' + data[i].ID + '" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '">'
                + '<a title="' + data[i].TEN + '" class="btn"><i class="' + data[i].THONGTIN1 + '"></i></a>'
                + '<a class="lbsymbolHD">' + data[i].TEN + '</a></div>';
        }
        me.strHDDT = row;
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> Ho So Doi Tuong
    --ULR: Modules
    -------------------------------------------*/
    getList_DoiTuongThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
            'iM': edu.system.iM,
            'strTuKhoa': (edu.util.getValById('txtTuKhoa_Search') || '').toString().trim(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_HD'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_HD'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_HD'),
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop_HD'),
            'strStudyStatus_Ids': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_HD').toString(),
            'dIsPrimary': '',
            'dBoQuaPhamVi': 0,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        console.log('%c[xuathoadon.getList_DoiTuongThu] >>> REQUEST', 'color:#2196F3;font-weight:bold', obj_list);
        console.log('[xuathoadon.getList_DoiTuongThu] action:', obj_list.action);
        console.log('[xuathoadon.getList_DoiTuongThu] func  :', obj_list.func);
        console.log('[xuathoadon.getList_DoiTuongThu] payload JSON:', JSON.stringify(obj_list, null, 2));

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                console.log('%c[xuathoadon.getList_DoiTuongThu] <<< RESPONSE', 'color:#4CAF50;font-weight:bold', data);
                console.log('[xuathoadon.getList_DoiTuongThu] Success :', data && data.Success);
                console.log('[xuathoadon.getList_DoiTuongThu] Message :', data && data.Message);
                console.log('[xuathoadon.getList_DoiTuongThu] Pager   :', data && data.Pager);
                console.log('[xuathoadon.getList_DoiTuongThu] Data.len:', data && data.Data ? data.Data.length : 0);
                if (data && data.Data && data.Data.length > 0) {
                    console.log('[xuathoadon.getList_DoiTuongThu] Row[0]  :', data.Data[0]);
                    console.log('[xuathoadon.getList_DoiTuongThu] Keys[0] :', Object.keys(data.Data[0]));
                }
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genTable_DoiTuongThu(data.Data, data.Pager);
                    if (edu.util.checkValue(data.Data)) {
                        if (data.Pager == 1) {
                            me.active_DoiTuong(data.Data[0].ID);
                            me.genFormHoaDon();
                        }
                    }
                } else {
                    console.error('[xuathoadon.getList_DoiTuongThu] FAIL:', data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                console.error('%c[xuathoadon.getList_DoiTuongThu] !!! ERROR', 'color:#F44336;font-weight:bold', er);
                if (er && er.responseText) console.error('[xuathoadon.getList_DoiTuongThu] responseText:', er.responseText);
                if (er && er.status) console.error('[xuathoadon.getList_DoiTuongThu] status:', er.status, er.statusText);
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + (er && er.statusText ? er.statusText : 'request error'), "w");
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DoiTuong: function (strId) {
        var me = this;
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (strId == me.dt_HS[i].ID) {
                me.dt_DoiTuongThu = me.dt_HS[i];
                me.viewForm_DoiTuong(me.dt_HS[i]);
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Ho So Doi Tuong
    --ULR: Modules
    -------------------------------------------*/
    genTable_DoiTuongThu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HSSV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoaDon.getList_DoiTuongThu()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            aoColumns: [{
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);

                    var html = '<span id="sl_hoten' + aData.ID + '" class="sl_hoten bold">' + edu.util.checkEmpty(aData.HODEM) + " " + edu.util.checkEmpty(aData.TEN) + '</span><br />';
                    html += '<span id="sl_ma' + aData.ID + '" class="italic sl_ma">' + edu.util.checkEmpty(aData.MASO) + '</span>'

                    var hienthi = '<span style="padding-right: 5px !important; float: left"><img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" /></span>';
                    hienthi += html;
                    return '<a>' + hienthi + '</a>';
                }
            }]
        };
        edu.system.loadToTable_data(jsonForm);
        //Thêm class để kích hoạt các sự kiện liên quan đến đối tượng thu
        if (data.length > 0) {
            var x = $("#tbldata_HSSV tbody tr");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.add("detail_HoSo_HoaDon");
            }
            if (document.getElementById("light-paginationtbldata_HSSV") !== undefined) document.getElementById("light-paginationtbldata_HSSV").style.width = "100%";
        }
        $(".popover").replaceWith('');
        /*III. Callback*/
    },
    active_DoiTuong: function (strSinhVien_id) {
        var me = this;
        me.resetDoiTuongThu();
        if (edu.util.checkValue(strSinhVien_id) && strSinhVien_id != me.strId) {
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            })
            var point = $("#tbldata_HSSV tbody tr[id='" + strSinhVien_id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 100);
            }
        }
        me.strHSSV_Id = me.dt_HS.find(e => e.ID == strSinhVien_id).QLSV_NGUOIHOC_ID;
        me.getDetail_DoiTuong(strSinhVien_id);
    },
    popover_HSDoiTuong: function (strHS_Id, point) {
        var me = this;
        var data = null;
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (strHS_Id == me.dt_HS[i].ID)
                data = me.dt_HS[i];
        }
        if (data == null || data == undefined) data = me.dt_HS;
        var row = "";
        row += '<div style="width:668px" class="info-user">';
        row += '<div style="width: 168px; float: left" class="user-img">';
        row += '<img style="margin: 0 auto; display: block;width: 100%" src="' + edu.system.getRootPathImg(data.ANH) + '">';
        row += '</div>';
        row += '<div style="width: 480px; float: left; padding-left: 20px; margin-top: -7px" class="info-user-detail">';
        row += '<p class="pcard"><i class="fa-solid fa-laptop-binary colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.MASO) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-circle-user colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i><span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-screen-users colorcard"></i> <span class="lang" key="">Lớp</span>: ' + edu.util.checkEmpty(data.DAOTAO_LOPQUANLY_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa-brands fa-leanpub colorcard"></i> <span class="lang" key="">Ngành</span>: ' + edu.util.checkEmpty(data.NGANHHOC_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-location-dot colorcard"></i> <span class="lang" key="">Địa chỉ</span>: ' + edu.util.checkEmpty(data.TTLL_KHICANBAOTINCHOAI_ODAU) + '</p>';
        row += '<p class="pcard"><i class="fa fa-phone colorcard"></i> <span class="lang" key="">Số điện thoại</span>: ' + edu.util.checkEmpty(data.TTLL_DIENTHOAICANHAN) + '</p>';
        row += '</div>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'right',
        });
        $(point).popover('show');
    },
    viewForm_DoiTuong: function (data) {
        var me = this;
        var mlen = data.length;
        //zone Hiển thị thông tin mặc định sau khi chọn đối tượng
        var strHoTen = edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN);
        var strMa = data.MASO
        var strNgaySinh = edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM);
        var strSoDienThoai = data.TTLL_DIENTHOAICANHAN;
        me.strChuongTrinh_Id = data.DAOTAO_TOCHUCCHUONGTRINH_ID;

        var strHienThi = strHoTen;
        if (edu.util.checkValue(strMa)) strHienThi += " - " + strMa;
        //if (!edu.util.checkValue(strNgaySinh)) strHienThi += " - " + strNgaySinh;
        if (edu.util.checkValue(strSoDienThoai)) strHienThi += " - " + strSoDienThoai;
        $("#txtTen_Ma_NS_SDT").html(strHienThi);
        //
        var strTrangThai_Ten = edu.util.checkEmpty(data.QLSV_TRANGTHAINGUOIHOC_TEN);
        var strTrangThai_Ma = data.QLSV_TRANGTHAINGUOIHOC_MA;
        var strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-success"><i class="fa fa-graduation-cap"></i> ' + strTrangThai_Ten + '</span>';
        switch (strTrangThai_Ma) {
            case "CHUYENTRUONGDI":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-danger"><i class="fa fa-sign-out"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "NORMAL":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-info"><i class="fa fa-users"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "CHUYENTRUONG":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-info"><i class="fa fa-sign-in"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "KHONGXACDINH":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-warning"><i class="fa fa-exclamation-triangle"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "GRADUATE":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-success"><i class="fa fa-graduation-cap"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "FORCEDROPOUT":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-info"><i class="fa fa-exclamation-triangle"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "CANHBAO":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-warning"><i class="fa fa-exclamation-triangle"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "RESERVE":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-info"><i class="fa fa-user-secret"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "DROPOUT":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-warning"><i class="fa fa-exclamation-triangle"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "XOATEN":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-danger"><i class="fa fa-user-times"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "REPEATE":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-warning"><i class="fa fa-exclamation-triangle"></i> ' + strTrangThai_Ten + '</span>';
                break;
            case "DUNGHOC":
                strTrangThaiHienThi = '<span id="txtTinhTrang" class="trangthaiHS label label-warning"><i class="fa fa-ban"></i> ' + strTrangThai_Ten + '</span>';
                break;
        }
        $("#txtTinhTrang").replaceWith(strTrangThaiHienThi);
        me.getList_TinhTrangTaiChinh();
    },
    /*------------------------------------------
    --Discription: [2] ACCESS DB ==> Tinh Trang Tai Chinh
    -------------------------------------------*/
    getList_TinhTrangTaiChinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDanhSach',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguonDuLieu_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinhTrangTaiChinh(data.Data.rsKhoanDaNopChuaXuatHoaDon, "tbldata_HoaDon");
                    me.genTable_HoaDonDaThu(data.Data.rsKhoanDaNopDaXuatHoaDon, "tbldata_HDDaXuat");
                    me.genData_TinhTrangTaiChinh(data.Data.rsThongTin[0]);
                    me.dtKhoanDaNopChuaXuatHoaDon = data.Data.rsKhoanDaNopChuaXuatHoaDon;
                    me.dtKhoanDaNopDaXuatHoaDon = data.Data.rsKhoanDaNopDaXuatHoaDon;
                    me.dt_DoiTuongThu = data.Data.rsThongTin[0];
                    me.dtHoaDon = data.Data.rsKhoanDaNopChuaXuatHoaDon;
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
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
    --Discription: [2] GEN HTML ==> Tinh Trang Tai Chinh
    --ULR: Modules
    -------------------------------------------*/
    genHTML_NoiDung_HoaDon: function (strTableId) {
        var me = this; this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInHoaDon";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018";
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
            var data = me.dt_DoiTuongThu;
            //$(".txtDiaChiPTC_PT_Edit").html(data.aaaa);
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
            //Các thao tác chuyển sang mẫu viết phiếu
            $(".beforeActive").hide();
            $("#zoneThongTinHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnInHoaDon").hide();
            $("#btnHuyHoaDon").hide();
            $("#zoneActionXuatHoaDon").html(me.strHDDT);
            //if (document.getElementById('btnSaveHD') == undefined) {
            //    $("#zoneActionHoaDon").prepend('<div id="btnSaveHD" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Lưu hóa đơn" class="btn"><i style="color: #00a65a" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất Hóa đơn</a></div>');
                
            //    $("#btnSaveHD").click(function (e) {
            //        e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
            //        $("#btnYes").click(function (e) {
            //            $('#myModalAlert').modal('hide');
            //            me.saveHoaDon('tbldataPhieuThuPopup_PT_Edit');
            //        });
            //    });
            //}
            //Kiểm tra số lượng check box của bảng hiện tại
            var x = $('#' + strTableId + ' tbody tr td input[type="checkbox"]');
            var bcheck = false;
            var strHeThongChungTu = "";
            for (var i = 0; i < x.length; i++) {//Nếu có 1 check box dừng lại và lưu mã chứng từ để kiểm tra tất cả các mã chứng từ phải giống nhau 
                if ($(x[i]).is(':checked')) {
                    bcheck = true;
                    strHeThongChungTu = x[i].title;
                    break;
                }
            }
            //
            if (!bcheck) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu trước khi viết hóa đơn!', 'w');
                return;
            }

            //Kiểm tra hệ thống chứng từ
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    var strcheck = x[i].title;
                    if (strcheck != strHeThongChungTu) {
                        edu.extend.notifyBeginLoading('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại! ("' + strHeThongChungTu + '" : "' + strcheck + '")', 'w');
                        return;
                    }
                }
            }
            //Hiển thị tên loại phiếu trên mẫu phiếu sửa
            //switch (strHeThongChungTu) {
            //    case "TAICHINH_HETHONGPHIEUTHU": $(".txtTenPhieuBienLai_Edit").html("PHIẾU THU TIỀN"); break;
            //    case "TAICHINH_HOADON": $(".txtTenPhieuBienLai_Edit").html("HÓA ĐƠN BÁN HÀNG"); break;
            //    case "TAICHINH_HETHONGBIENLAI": $(".txtTenPhieuBienLai_Edit").html("BIÊN LAI THU TIỀN"); break;
            //    default: $(".txtTenPhieuBienLai_Edit").html("HÓA ĐƠN BÁN HÀNG"); break;
            //}
            //Các thao tác chuyển sang mẫu viết phiếu
            var idem = 0;
            var strHinhThucThu_Ma = "";
            //Lấy dữ liệu theo các check box đã chọn
            var arrcheck = [];
            var jsonHT;
            for (var i = 0; i < x.length; i++) {
                if (arrcheck.indexOf(x[i].id) != -1) continue;
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
                    var strKhoanThuGoc_Id = $(x[i]).attr("khoanthugoc_id");
                    if (strHinhThucThu_Ma == "") {
                        var strDuLieuId = strId.replace('_' + strKhoanThuGoc_Id, '');
                        jsonHT = edu.util.objGetDataInData(strDuLieuId, me.dtHoaDon, "ID")[0];

                        edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, dtDanhMuc => me.cbGenCombo_HinhThucThu(dtDanhMuc, jsonHT.HINHTHUCTHU_ID));
                        edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, dtDanhMuc => me.cbGenCombo_DonViTinh(dtDanhMuc, jsonHT.DONVITINH_ID));
                        edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, dtDanhMuc => me.cbGenCombo_LoaiTienTe(dtDanhMuc, jsonHT.LOAITIENTE_ID));

                        //strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        //me.strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        //me.strHinhThucThu_Ten = jsonHT.HINHTHUCTHU_TEN;
                        //me.strLoaiTienTe_Ma = jsonHT.LOAITIENTE_MA;
                        //me.strDonViTinh_Ten = jsonHT.DONVITINH_TEN;
                    }
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = $("#txtNoiDungHD" + strId).val();
                    //var strSoLuong = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    //var dSoTien = x[i].parentNode.parentNode.cells[5].innerHTML;
                    var dSoTien = $("#txtTongTien" + strId).val();
                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    strId = strId.replace('_' + strKhoanThuGoc_Id, '');
                    idem++;
                    var rows = '';
                    rows += '<tr id="' + strId + '" name="' + x[i].name + '" khoanthugoc_id="' + strKhoanThuGoc_Id +'">';//name: DAOTAO_THOIGIANDAOTAO_ID
                    rows += '<td>' + idem + '</td>';
                    rows += '<td>' + strKhoanThu + '</td>';
                    rows += '<td id="lbNoiDung' + strId + '">' + strNoiDung + '</td>';
                    rows += '<td>1</td>';
                    //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
                    rows += '<td id="txtTongTienThuHD' + strId  +'" name="' + dSoTien + '">' + dSoTien + '</td>';
                    rows += '<td id="lbThanhTien' + strId + '"></td>';
                    rows += '</tr>';
                    $('#tbldataPhieuThuPopup_PT_Edit tbody').append(rows);
                }
            }
            //Hiển thị tổng tiền đã chọn trên cùng bên trái
            me.tinhHeSoGiaTien('tbldataPhieuThuPopup_PT_Edit', 3, 4, 5);
            edu.system.move_ThroughInTable("tbldataPhieuThuPopup_PT_Edit");
            edu.system.insertSumAfterTable("tbldataPhieuThuPopup_PT_Edit", [3,4,5]);
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
            if (jsonHT.LOAITIENTE_MA == "USD") {
                var obj_list = {
                    'action': 'TC_ThongTinChung/DocSoThanhChu',
                    'versionAPI': 'v1.0',
                    'dSoTien': strSoTien,
                    'strLoaiTien': jsonHT.LOAITIENTE_MA,
                }
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            $(".txtSoTienPTC_PT_Edit").html(data.Data);
                        }
                        else {
                            console.log(data.Message);
                        }
                    },
                    type: "GET",
                    action: obj_list.action,
                    data: obj_list,
                    fakedb: []
                }, false, false, false, null);
            }
        }
    },
    cbGenCombo_HinhThucThu: function (data, strId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "THONGTIN1",
                avatar: "MA",
                default_val: strId
            },
            renderPlace: ["dropHinhThucThuPTC_PT_Edit"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
        if (!$("#dropHinhThucThuPTC_PT_Edit").val()) {
            var strTienMat_Id = $("#dropHinhThucThuPTC_PT_Edit #TM").val();
            $("#dropHinhThucThuPTC_PT_Edit").val(strTienMat_Id).trigger("change");
        }

    },
    cbGenCombo_LoaiTienTe: function (data, strId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA",
                default_val: strId
            },
            renderPlace: ["dropLoaiTienTePTC_PT_Edit"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
        var strDropId = $("#dropLoaiTienTePTC_PT_Edit #VND").val();
        $("#dropLoaiTienTePTC_PT_Edit").val(strDropId).trigger("change");

    },
    cbGenCombo_DonViTinh: function (data, strId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA",
                default_val: strId
            },
            renderPlace: ["dropDonViTinhPTC_PT_Edit"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
        //var strDropId = $("#dropDonViTinhPTC_PT_Edit #SINHVIEN").val();
        //$("#dropDonViTinhPTC_PT_Edit").val(strDropId).trigger("change");

    },
    genFormHoaDon: function () {
        $(".beforeActive").hide();
        $("#zoneThongTinDoiTuong").slideDown();
        $(".chitietkhoanthu").hide();
        $(".zoneThongTinBoSung").show();
    },
    genTable_TinhTrangTaiChinh: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos:{center: [0, 7, 8]},
            "aoColumns": [{
                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
            }, {
                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
            }, {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }, {
                "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtNoiDungHD' + aData.ID + '" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" class="inputnoidung" style="width: 100%"/>';
                }
                }
                , {
                "mData": "SOTIEN",
                "mRender": function (nRow, aData) {
                    return '<input id="txtTongTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"></input>';
                }
            }, {
                "mDataProp": "NGAYTAO_DD_MM_YYYY"
            }
                ,
            {
                "mData": "TACHKHOAN",
                "mRender": function (nRow, aData) {
                    return '<a class="btnTachKhoanThu" id="' + aData.ID + '" name="' + aData.DAOTAO_THOIGIANDAOTAO_ID + '" title="' + aData.HETHONGCHUNGTU_MA + '" >Tách khoản</a>';
                }
            },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" name="' + aData.DAOTAO_THOIGIANDAOTAO_ID + '" id="' + aData.ID + '" title="' + aData.HETHONGCHUNGTU_MA + '" khoanthugoc_id="' + aData.TAICHINH_CACKHOANTHU_ID + '">';
                }
            }]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTableId, [5]);
            $("#" + strTableId + " tfoot tr td:eq(5)").attr("style", "text-align: right; padding-right: 15px !important");
        } else {
            $("#" + strTableId + " tfoot").html('');
        }
    },
    genTable_HoaDonDaThu: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: { right: [6] },
            "aoColumns": [{
                "mDataProp": "CHUNGTU_SO"
            },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }, {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }, {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }, {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }, {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }, {
                    "mData": "Chitiet",
                    "mRender": function (nRow, aData) {
                        return '<a class="detail_HoaDon" style="cursor: pointer;" id="' + aData.CHUNGTU_ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTableId, [6]);
            $("#" + strTableId + " tfoot tr td:eq(6)").attr("style", "text-align: right;");
            var x = document.getElementById(strTableId).getElementsByTagName('tbody')[0].rows;
            for (var i = 0; i < x.length; i++) {
                x[i].id = '';
            }
            edu.system.collageInTable({
                strTable_Id: strTableId,
                iBatDau: 1,
                iKetThuc: 1,
                arrStr: [2, 3, 4, 5],
                arrFloat: [6]
            });
        } else {
            $("#" + strTableId + " tfoot").html('');
        }
    },
    genData_TinhTrangTaiChinh: function (data) {
        var me = this;
        var dNoCo = data.NOCO;
        var strHienThi = "Chưa xác định";
        if (edu.util.floatValid(dNoCo)) {
            if (dNoCo > 0) strHienThi = '<p style="color: #00c0ef"><i class="fa fa-bitbucket"></i> <span class="lang" key="">Tổng dư</span>: ' + edu.util.formatCurrency(dNoCo) + '</p>';
            if (dNoCo < 0) strHienThi = '<p class="color-red"><i class="fa fa-cubes"></i> <span class="lang" key="">Tổng nợ</span>: ' + edu.util.formatCurrency(dNoCo) + '</p>';
            if (dNoCo == 0) strHienThi = '<p style="color: green"><i class="fa fa-empire"></i> <span class="lang" key="">Đã hoàn thành</span></p>';
        }
        $(".noco-hoadon").html(strHienThi);

        //if (edu.util.floatValid(data.TONGKHOANPHAINOP)) {
        //    $("#txtSoHienThi_DuocMien").html(edu.util.formatCurrency(data.TONGKHOANPHAINOP));
        //} else {
        //    $("#txtSoHienThi_DuocMien").html(0);
        //}
        if (edu.util.floatValid(data.TONGKHOANDUOCMIEN)) {
            $("#txtSoHienThi_DuocMien").html(edu.util.formatCurrency(data.TONGKHOANDUOCMIEN));
        } else {
            $("#txtSoHienThi_DuocMien").html(0);
        }
        if (edu.util.floatValid(data.TONGKHOANDANOP)) {
            $("#txtSoHienThi_DaNop").html(edu.util.formatCurrency(data.TONGKHOANDANOP));
        } else {
            $("#txtSoHienThi_DaNop").html(0);
        }
        if (edu.util.floatValid(data.TONGKHOANDARUT)) {
            $("#txtSoHienThi_DaRut").html(edu.util.formatCurrency(data.TONGKHOANDARUT));
        } else {
            $("#txtSoHienThi_DaRut").html(0);
        }
        //
        if (edu.util.floatValid(data.TONGNORIENG)) {
            $("#txtSoHienThi_NoRiengTungKhoan").html(edu.util.formatCurrency(data.TONGNORIENG));
        } else {
            $("#txtSoHienThi_NoRiengTungKhoan").html(0);
        }
        if (edu.util.floatValid(data.TONGNOCHUNG)) {
            $("#txtSoHienThi_NoChungCacKhoan").html(edu.util.formatCurrency(data.TONGNOCHUNG));
        } else {
            $("#txtSoHienThi_NoChungCacKhoan").html(0);
        }
        //
        if (edu.util.floatValid(data.TONGDURIENG)) {
            $("#txtSoHienThi_DuRieng").html(edu.util.formatCurrency(data.TONGDURIENG));
            $("#txtSoHienThi_DuRieng_2").html(edu.util.formatCurrency(data.TONGDURIENG));
        } else {
            $("#txtSoHienThi_DuRieng").html(0);
            $("#txtSoHienThi_DuRieng_2").html(0);
        }
        if (edu.util.floatValid(data.TONGDUCHUNG)) {
            $("#txtSoHienThi_DuChung").html(edu.util.formatCurrency(data.TONGDUCHUNG));
            $("#txtSoHienThi_DuChung_2").html(edu.util.formatCurrency(data.TONGDUCHUNG));
        } else {
            $("#txtSoHienThi_DuChung_2").html(0);
            $("#txtSoHienThi_DuChung").html(edu.util.formatCurrency(data.TONGDUCHUNG));
        }
        //
        if (edu.util.floatValid(data.TONGTIENPHIEUTHU)) {
            $("#txtSoHienThi_PhieuDaThu").html(edu.util.formatCurrency(data.TONGTIENPHIEUTHU));
        } else {
            $("#txtSoHienThi_PhieuDaThu").html(0);
        }
        if (edu.util.floatValid(data.TONGTIENPHIEURUT)) {
            $("#txtSoHienThi_PhieuDaRut").html(edu.util.formatCurrency(data.TONGTIENPHIEURUT));
        } else {
            $("#txtSoHienThi_PhieuDaRut").html(0);
        }

        ////gen thông tin đối tượng
        //if (document.getElementById("btnInHoaDon") == undefined) {
        //    $("#txtDiaChiPTHEdit").html(data.MAUIN_DIACHI);
        //    $("#txtMaSoThuePTHEdit").html(data.MAUIN_DIACHI);
        //    $("#txtDienThoaiPTHEdit").html(data.MAUIN_DIACHI);
        //    $("#txtFaxPTHEdit").html(data.MAUIN_DIACHI);
        //    $("#txtSoTaiKhoanPTHEdit").html(data.MAUIN_DIACHI);
        //    $("#txtNganHangPTHEdit").html(data.MAUIN_DIACHI);

        //    $("#iNgayPTCEdit").html(data.MAUIN);
        //    $("#iThangPTCEdit").html(data.MAUIN);
        //    $("#iNamPTCEdit").html(data.MAUIN);

        //    $("#txtDiaChiPTCEdit").html(data.NOIOHIENNAY);
        //    $("#txtLopPTCEdit").html(data.DAOTAO_LOPQUANLY_N1_TEN);
        //    $("#txtNganhPTCEdit").html(data.NGANHHOC_N1_TEN);
        //    $("#txtBacHocPTCEdit").html(data.BACDAOTAO_N1_TEN);
        //    $("#txtKhoaPTCEdit").html(data.KHOAHOC_N1_TEN);
        //    $("#txtMaSoThuePTCEdit").html(data.MASOTHUECANHAN);
        //}
    },
    eventTongTien: function (strTableId) {
        var me = this;
        $("#MainContent").delegate('#' + strTableId + ' input[type="checkbox"]', "click", function () {
            var checked_status = $(this).is(':checked');
            if (checked_status) {
                this.parentNode.parentNode.classList.add('tr-bg');
            } else {
                this.parentNode.parentNode.classList.remove('tr-bg');
            }
            me.show_TongTien(strTableId);
        });
    },
    show_TongTien: function (strTableId) {
        setTimeout(function () {
            var sum = edu.system.countFloat(strTableId, 5, 8);
            var strTongThu = "Tổng tiền đã chọn: " + edu.util.formatCurrency(sum);
            $("#lbSoTienDaChon").html("/ " + strTongThu);
        }, 100);
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
    tachKhoan_HoaDon: function (point) {
        //Gán thông các thông tin lên trên popup bảng hiện tại. Tách khoản được thực hiện riêng biệt trên popup sau đó mới cập nhật dưới table (thực hiện như 1 giao dịch)
        //Gán id bảng cần tách vào name của nút tách khoản thu để sau khi xác nhận sẽ biết đâu là bảng cần tách
        var me = this;
        document.getElementById("btnThucHienTachKhoan").name = point.parentNode.parentNode.parentNode.parentNode.id;//gán id bảng vào nút
        var strid = point.id;
        var strKhoanThuId = point.id;
        var strHocKy_Name = point.parentNode.parentNode.cells[1].innerHTML;
        var strDot_Name = point.parentNode.parentNode.cells[2].innerHTML;
        var strKhoanThu_Name = point.parentNode.parentNode.cells[3].innerHTML;
        var strNoiDung_Name = $("#txtNoiDungHD" + strid).val();;
        var strChungTu_Ma = point.title;
        var strThoiGianGianDaoTao_Id = point.name;
        var strSoTien = $("#txtTongTien" + strid).val();
        me.strKhoanCanTach_Id = strid;

        $(".ckbLKT_HD").each(function () {
            this.checked = false;
        });
        
        var rows = '';
        rows += '<tr id="' + strid + '" class="tr-bg">';//name: DAOTAO_THOIGIANDAOTAO_ID
        rows += '<td>1</td>';
        rows += '<td id="txtHocKyKhoanTach' + strid + '">' + strHocKy_Name + '</td>';
        rows += '<td id="txtDotKhoanTach' + strid + '">' + strDot_Name + '</td>';
        rows += '<td>' + strKhoanThu_Name +'</td>';
        //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
        rows += '<td>' + strNoiDung_Name + '</td>';
        rows += '<td><span id="txtTongTienKhoanTruocTach" style="width: 150px">' + strSoTien +'</span></td>';
        rows += '<td><span id="txtTongTienKhoanTach" style="width: 150px">' + strSoTien +'</span></td>';
        rows += '<td>Gốc</td>';
        rows += '</tr>';
        $('#tblChiTietKhoan_TachKhoan tbody').html("");
        $('#tblChiTietKhoan_TachKhoan tbody').append(rows);
        $("#zoneThongTinDoiTuong").slideUp();
        $("#zoneThongTinTachKhoan").slideDown();
        edu.system.insertSumAfterTable("tblChiTietKhoan_TachKhoan", [5, 6]);
    },
    addKhoanThuCanTach: function () {
        var me = this;
        var strTable_Id = document.getElementById("btnThucHienTachKhoan").name;
        if (!edu.util.checkValue(strTable_Id)) {
            edu.system.alert("Lỗi truy cập bảng. Vui lòng gọi admin!");
            return;
        }
        //1. Lấy số tiền khoản gốc trước chuyển cập nhật vào bảng hóa đơn(dữ liệu gốc)
        //2. Lấy vị trí dòng gốc hiện tại và after sau dòng đó
        var strSoTienSauChuyen = $("#txtTongTienKhoanTach").html();
        $("#" + strTable_Id +" #txtTongTien" + me.strKhoanCanTach_Id).val(strSoTienSauChuyen);
        var pointViTri = $("#" + strTable_Id +" tbody tr[id='" + me.strKhoanCanTach_Id + "']");
        var strThoiGianDaoTao_Id = $("#" + strTable_Id +" tbody tr input[id='" + me.strKhoanCanTach_Id + "']").attr("name");
        var strChungTu_Ma = $("#" + strTable_Id +" tbody tr input[id='" + me.strKhoanCanTach_Id + "']").attr("title");
        var x = $("#tblChiTietKhoan_TachKhoan .inputsotien");
        var arrCheck = [];
        for (var i = 0; i < x.length; i++) {
            var strId = x[i].id.replace('txtTongTienKhoanTach','');
            if (strId == me.strKhoanCanTach_Id) continue;
            if (strId.length == 32 && arrCheck.indexOf(strId) == -1) {
                arrCheck.push(strId);
                addThemNoiDung(x[i]);
            }
        }
        me.show_TongTien(strTable_Id);
        $("#zoneThongTinDoiTuong").slideDown();
        $("#zoneThongTinTachKhoan").slideUp();

        function addThemNoiDung(point) {
            var strKhoanThu_Id = point.id.replace('txtTongTienKhoanTach','');
            var strHocKy_Name = point.parentNode.parentNode.cells[1].innerHTML;
            var strDot_Name = point.parentNode.parentNode.cells[2].innerHTML;
            var strKhoanThu_Name = point.parentNode.parentNode.cells[3].innerHTML;
            var strNoiDung = $("#txtNoiDung" + strKhoanThu_Id).val();
            var strTongTien_Id = $(point).val();
            if (strTongTien_Id == 0) return;
            var rows = "";
            rows += '<tr id="' + strKhoanThu_Id + '" class="tr-bg">';//name: DAOTAO_THOIGIANDAOTAO_ID
            rows += '<td></td>';
            rows += '<td>' + strHocKy_Name + '</td>';
            rows += '<td>' + strDot_Name + '</td>';
            rows += '<td>' + strKhoanThu_Name + '</td>';
            rows += '<td><input id="txtNoiDungHD' + me.strKhoanCanTach_Id + '_' + strKhoanThu_Id + '"  value="' + strNoiDung + '" class="inputnoidung" style="width: 100%"/></td>';
            rows += '<td><input id="txtTongTien' + me.strKhoanCanTach_Id + '_' + strKhoanThu_Id +'" class="inputsotien" name="' + strTongTien_Id + '" value="' + strTongTien_Id +'" style="width: 150px"></td>';
            rows += '<td></td>';
            rows += '<td></td>';
            rows += '<td><input checked="checked" id="' + me.strKhoanCanTach_Id + '_' + strKhoanThu_Id + '" name="' + strThoiGianDaoTao_Id + '" title="' + strChungTu_Ma + '" khoanthugoc_id="' + strKhoanThu_Id  +'" type="checkbox"></td>';
            rows += '</tr>';
            pointViTri.after(rows);
        }
    },
    /*------------------------------------------
   --Discription: [3] ACCESS DB && GEN HTML ==> Các khoản thu
   --ULR: Modules
   -------------------------------------------*/
    getList_ChiTietKhoanThu: function (strzone) {
        var me = this;
        switch (strzone) {
            case "#zoneChiTietDuocMien":
                getList_KhoanDuocMien();
                break;
            case "#zoneChiTietDaNop":
                getList_KhoanDaNop();
                break;
            case "#zoneTongNoRieng":
                getList_NoRiengTungKhoan();
                break;
            case "#zoneTongNoChung":
                getList_NoChungCacKhoan();
                break;
            case "#zonePhieuDaThu":
                getList_PhieuDaThu();
                break;
        }

        function getList_KhoanDuocMien() {
            //--Edit
            var obj_list = {
                'action': 'TC_ThongTinChung/LayDSKhoanMien',
                'versionAPI': 'v1.0',
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var jsonForm = {
                            strTable_Id: "tblChiTietDuocMien",
                            "aaData": data.Data,
                            colPos: {
                                left: [3, 4],
                                right:[5]
                            },
                            "aoColumns": [{
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                            }, {
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                            }, {
                                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                            }, {
                                "mData": "NOIDUNG",
                                "mRender": function (nRow, aData) {
                                    return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                                }
                            }, {
                                "mData": "SOTIEN",
                                "mRender": function (nRow, aData) {
                                    return edu.util.formatCurrency(aData.SOTIEN);
                                }
                            }
                            , {
                                "mDataProp": "NGAYTAO_DD_MM_YYYY"
                            }
                            , {
                                "mDataProp": "NGUOITAO_TENDAYDU"
                            }]
                        };
                        edu.system.loadToTable_data(jsonForm);
                        if (data.Data != null && data.Data.length > 0) {
                            edu.system.insertSumAfterTable("tblChiTietDuocMien", [5]);
                            $('#tblChiTietDuocMien tfoot td:eq(5)').attr('style', 'text-align: right');
                        }
                    } else {
                        console.log(data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                },
                type: "GET",
                versionAPI: "v1.0",
                contentType: true,
                action: obj_list.action,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }

        function getList_KhoanDaNop() {
            //--Edit
            var obj_list = {
                'action': 'TC_ThongTinChung/LayDSKhoanDaNop',
                'versionAPI': 'v1.0',
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }

            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var jsonForm = {
                            strTable_Id: "tblChiTietDaNop",
                            "aaData": data.Data,
                            colPos: {
                                left: [3, 4],
                                right: [5]
                            },
                            "aoColumns": [{
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                            }, {
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                            }, {
                                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                            }, {
                                "mData": "NOIDUNG",
                                "mRender": function (nRow, aData) {
                                    return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                                }
                            }, {
                                "mData": "SOTIEN",
                                "mRender": function (nRow, aData) {
                                    return edu.util.formatCurrency(aData.SOTIEN);
                                }
                            }
                            , {
                                "mDataProp": "NGAYTAO_DD_MM_YYYY"
                            }
                            , {
                                "mDataProp": "NGUOITAO_TENDAYDU"
                            }]
                        };
                        edu.system.loadToTable_data(jsonForm);
                        if (data.Data != null && data.Data.length > 0) {
                            edu.system.insertSumAfterTable("tblChiTietDaNop", [5]);
                            $('#tblChiTietDaNop tfoot td:eq(5)').attr('style', 'text-align: right');
                        }
                    } else {
                        console.log(data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                },
                type: "GET",
                versionAPI: "v1.0",
                contentType: true,
                action: obj_list.action,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }

        function getList_NoRiengTungKhoan() {
            //--Edit
            var obj_list = {
                'action': 'TC_ThongTinChung/LayDSKhoanNoRieng',
                'versionAPI': 'v1.0',
                'pageIndex': 1,
                'pageSize': 1000000000,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }

            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var jsonForm = {
                            strTable_Id: "tblTongNoRieng",
                            "aaData": data.Data,
                            colPos: {
                                left: [3, 4],
                                right: [5]
                            },
                            "aoColumns": [{
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                            }, {
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                            }, {
                                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                            }, {
                                "mData": "NOIDUNG",
                                "mRender": function (nRow, aData) {
                                    return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                                }
                            }, {
                                "mData": "SOTIEN",
                                "mRender": function (nRow, aData) {
                                    return edu.util.formatCurrency(aData.SOTIEN);
                                }
                            }
                            , {
                                "mDataProp": "NGAYTAO_DD_MM_YYYY"
                            }
                            , {
                                "mDataProp": "NGUOITAO_TENDAYDU"
                            }]
                        };
                        edu.system.loadToTable_data(jsonForm);
                        if (data.Data != null && data.Data.length > 0) {
                            edu.system.insertSumAfterTable("tblTongNoRieng", [5]);
                            $('#tblTongNoRieng tfoot td:eq(5)').attr('style', 'text-align: right');
                        }
                    } else {
                        console.log(data.Message);
                    }

                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                },
                type: "GET",
                versionAPI: "v1.0",
                contentType: true,
                action: obj_list.action,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }

        function getList_NoChungCacKhoan() {
            //--Edit
            var obj_list = {
                'action': 'TC_ThongTinChung/LayDSKhoanNoChung',
                'versionAPI': 'v1.0',
                'pageIndex': 1,
                'pageSize': 1000000000,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }

            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var jsonForm = {
                            strTable_Id: "tblTongNoChung",
                            "aaData": data.Data,
                            colPos: {
                                left: [3, 4],
                                right: [5]
                            },
                            "aoColumns": [{
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                            }, {
                                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                            }, {
                                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                            }, {
                                "mData": "NOIDUNG",
                                "mRender": function (nRow, aData) {
                                    return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                                }
                            }, {
                                "mData": "SOTIEN",
                                "mRender": function (nRow, aData) {
                                    return edu.util.formatCurrency(aData.SOTIEN);
                                }
                            }
                            , {
                                "mDataProp": "NGAYTAO_DD_MM_YYYY"
                            }
                            , {
                                "mDataProp": "NGUOITAO_TENDAYDU"
                            }]
                        };
                        edu.system.loadToTable_data(jsonForm);
                        if (data.Data != null && data.Data.length > 0) {
                            edu.system.insertSumAfterTable("tblTongNoChung", [5]);
                            $('#tblTongNoChung tfoot td:eq(5)').attr('style', 'text-align: right');
                        }
                    } else {
                        console.log(data.Message);
                    }

                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                },
                type: "GET",
                versionAPI: "v1.0",
                contentType: true,
                action: obj_list.action,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }

        function getList_PhieuDaThu() {
            //--Edit
            var obj_list = {
                'action': 'TC_ThongTinChung/LayDSPhieuDaThu',
                'versionAPI': 'v1.0',
                'pageIndex': 1,
                'pageSize': 1000000000,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }

            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var jsonForm = {
                            strTable_Id: "tblPhieuDaThu",
                            "aaData": data.Data,
                            colPos: {
                                right: [2]
                            },
                            "aoColumns": [{
                                "mDataProp": "SOPHIEUTHU"
                            }, {
                                "mData": "TONGTIEN",
                                "mRender": function (nRow, aData) {
                                    return edu.util.formatCurrency(aData.TONGTIEN);
                                }
                            }, {
                                "mDataProp": "NGAYTHU_DD_MM_YYYY_HHMMSS"
                            }, {
                                "mDataProp": "TENDAYDU_NGUOITHU"
                            }]
                        };
                        edu.system.loadToTable_data(jsonForm);
                        if (data.Data != null && data.Data.length > 0) {
                            edu.system.insertSumAfterTable("tblPhieuDaThu", [2]);
                            $('#tblPhieuDaThu tfoot td:eq(2)').attr('style', 'text-align: right');
                        }
                    } else {
                        console.log(data.Message);
                    }

                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                },
                type: "GET",
                versionAPI: "v1.0",
                contentType: true,
                action: obj_list.action,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }
    },
    /*------------------------------------------
   --Discription: [4] ACCESS DB ==> Viet Hoa Don
   --ULR: Modules
   -------------------------------------------*/
    save_TinhTrangHoaDon: function (strSoHoaDon_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_HoaDon/Them_TinhTrangInHoaDon',
            'versionAPI': 'v1.0',
            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoHoaDon_Id': strSoHoaDon_Id,
        };
        //default
        //edu.system.beginLoading();
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
    saveHoaDon: function (strTable_id, linkHDDT, strPhuongThuc_Ma) {
        var me = this;
        //
        var strIds = "";
        var strTAICHINH_CACKHOANTHU_Ids = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoLuong = "";
        var strDonGia = "";
        var strSoTien = "";
        var arrIdCheck = [];
        var idem = 0;
        var strLoaiTienTe = $("#dropLoaiTienTePTC_PT_Edit").val();
        var strDonViTinh = $("#dropDonViTinhPTC_PT_Edit").val();
        var strDonViTinhTen = "";
        if (strDonViTinh != "") strDonViTinhTen = $("#dropDonViTinhPTC_PT_Edit option:selected").text().trim();
        var strLoaiTienTeTen = "";
        if (strLoaiTienTe != "") strLoaiTienTeTen = $("#dropLoaiTienTePTC_PT_Edit option:selected").text().trim();
        var arrLoaiTienTe = [];
        var arrDonViTinh = [];
        var arrDonViTinhTen = [];
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
            //
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML+ "#";
            strSoLuong += getSoTien(x[i].cells[3].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strSoTien += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            //arrDonViTinh.push(me.strDonViTinh_Ten);
            arrLoaiTienTe.push(strLoaiTienTe);
            arrDonViTinh.push(strDonViTinh);
            arrDonViTinhTen.push(strDonViTinhTen);
        }
        //
        strIds = strIds.substr(0, strIds.length - 1);
        strTAICHINH_CACKHOANTHU_Ids = strTAICHINH_CACKHOANTHU_Ids.substr(0, strTAICHINH_CACKHOANTHU_Ids.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        strSoLuong = strSoLuong.substr(0, strSoLuong.length - 1);
        strDonGia = strDonGia.substr(0, strDonGia.length - 1);
        var strHinhThucThu_TEN = $("#dropHinhThucThuPTC_PT_Edit option:selected").text();
        var tempcheck = $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("name")
        if (tempcheck != undefined && tempcheck != 'undefined' && tempcheck != 'null') {
            strHinhThucThu_TEN = tempcheck;
        }
        var obj_save = {
            'action': 'TC_DaNop_HoaDon/ThemMoi',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_DaNop_Ids': strIds,
            'strTAICHINH_CACKHOANTHU_Ids': strIds,
            'strTaiChinh_SoTien_s': strSoTien,
            'strTaiChinh_NoiDung_s': strNoiDungs,
            'strDonGia_s': strDonGia,
            'strSoLuong_s': strSoLuong,
            'strDonViTinhTen_s': arrDonViTinhTen.toString(),
            'strLoaiTienTe': me.strLoaiTienTe_Ma,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
            'strTaiChinh_CacKhoanThu_Ids': strIds,
            'strHinhThucThu_MA': $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("id"),
            'strHinhThucThu_TEN': strHinhThucThu_TEN,
            'strPhuongThuc_MA': strPhuongThuc_Ma,
            
            'strDonViTinh_Ids': arrDonViTinh.toString(),
            'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
            'strXuatHoaDonTrucTiep': '',
            'strNguonDuLieu_Id': '',
            'dKhongSinhChungTu': 0,
            'strPhieuThuTheoPhoiSan_Id': '',
        };
        
        if (linkHDDT != "" && linkHDDT != undefined) {
            if (strPhuongThuc_Ma.indexOf("HDDTNHAP") == 0) {
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
            obj_save.strTAICHINH_CACKHOANTHU_Ids = strTAICHINH_CACKHOANTHU_Ids;
            
            //default
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
           
            obj_save.action = 'HDDT_HoaDon/ThemMoi';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        informSaveSuccess(d.Id);
                        me.strHoaDon_Id = d.Id;
                        edu.extend.getData_Phieu(d.Id, "HOADON", "MauInHoaDon", main_doc.HoaDon.changeWidthPrint);
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
            obj_save.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        var strLink = d.Data;
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.objApi["HDDT"];
                            strLink = strLink.substring(0, strLink.length - 3) + d.Data;;
                            if (strLink.indexOf('http') === -1) {
                                strLink = edu.system.strhost + strLink;
                            }
                        }
                        var win = window.open(strLink, '_blank');
                        if (win != undefined)
                            win.focus();
                        else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
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
            me.getList_TinhTrangTaiChinh();

            $("#btnInHoaDon").show();
            $("#btnHuyHoaDon").show();
            $("#btnSaveHD").replaceWith('');
            $(".btnXuat_HDDT").remove();
        }
    },
    delete_HD: function (strSo_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_HoaDon/HuyHoaDon',
            'versionAPI': 'v1.0',
            'strHoaDon_Id': strSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
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
        $("#zoneThongTinDoiTuong").slideDown('slow');
        $("#top_notifications_HoaDon").hide();
        $(".btnXuat_HDDT").remove();
    },
    changeWidthPrint: function () {
        //Layout do CSS lo: phôi in canh giữa (.aps-hd-phoi) + action bar cố định đáy (.aps-hd-actionbar).
        //OLD: tự tính paddingLeft cho #zoneThongTinHoaDon và ghi đè .style của #zoneActionHoaDon
        //     (float:left / position:fixed) -> đè lên CSS mới làm các nút văng lung tung.
        //var lMauInPhieuThu = document.getElementById("MauInHoaDon").offsetWidth;
        //console.log(lMauInPhieuThu);
        //if (lMauInPhieuThu > 700) lMauInPhieuThu += 240;
        //else {
        //    lMauInPhieuThu = 1250;
        //}
        //var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        //if (lMainPrint > lMauInPhieuThu) {
        //    document.getElementById('zoneThongTinHoaDon').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
        //    document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        //}
        //else {
        //    document.getElementById('zoneThongTinHoaDon').style.paddingLeft = "20px";
        //    document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        //}
        if (!document.getElementById("MauInHoaDon")) return;
        edu.extend.genChonLien("MauInHoaDon", "zoneLienHoaDon");
    },
    countCheckTable: function (strTable_Id) {
        var iCountCheck = 0;
        var x = $('#' + strTable_Id + ' tbody tr td input[type="checkbox"]');
        for (var i = 0; i < x.length; i++) {
            if (x[i].checked === true) {
                iCountCheck++;
            }
        }
        return iCountCheck;
    }
}