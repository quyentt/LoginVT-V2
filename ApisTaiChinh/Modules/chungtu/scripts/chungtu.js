/*----------------------------------------------
--Author: Văn Hiệp 
--Phone: 
--Date of created: 17/10/2017
--Input: 
--Output:
--API URL: TaiChinh/TC_ThuChi_PhieuThu
--Note:
--Updated by:
--Date of updated:
0. He, Khoa, Nganh, Lop
1. getList_DoiTuongThu -> genTable_DoiTuongThu -> Chọn nếu chỉ có 1 thằng -> getDetail_DoiTuong -> getList_TinhTrangTaiChinh -> getList_ChiTietKhoanThu
2. Chọn đối tượng -> active_DoiTuong -> getDetail_DoiTuong -> viewForm_DoiTuong -> getList_TinhTrangTaiChinh (các khoản thu, thông tin, tổng tiền các khoản thu, thông tin đối tượng)
3. Chọn các khoản thu (không sửa) -> btnAddnewHoaDon -> edu.extend.getData_Phieu -> activeInHoaDon -> printPhieu
----------------------------------------------*/
function ChungTu() { };
ChungTu.prototype = {
    strChungTu_Id: '',
    dt_ThuChung: null,
    dt_ThuRieng: null,
    dt_DuChung: null,
    dt_DuRieng: null,
    dt_HS: '',
    dt_DoiTuongThu: '',
    dt_TTDoiTuong: '',
    strDoiTuong_Id: '',
    bActiveRutTien: false,
    strKhoanCanTach_Id: '',
    tabActive: 1,
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
        edu.extend.addNotify();
        //var x = "111111."
        //console.log(x[x.length -1]);
        //test Nhớ comment lại
        //me.getList_DoiTuong_Test();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.getList_DoiTuong();
        me.getList_DMLKT();
        
        /*------------------------------------------
        --Discription: Action HoSo_SinhVien
        -------------------------------------------*/
        //Remove dropdown trên thanh tìm kiếm sinh viên
        $("#btnSearch_CT").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_DoiTuong();
            $("#zoneTimKiemDoiTuong .dropdown").removeClass('open');
            $("#advancedSearch").attr('aria-expanded', 'false');
        });
        //Đây là nút nho nhỏ hiển thị khi focus vào txtTuKhoa_Search
        $("#btnSeachDoiTuong").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_DoiTuong();
        });
        $("#txtTuKhoa_Search").keypress(function (e) {
            e.stopImmediatePropagation();
            if (e.which == 13) {
                e.preventDefault();
                me.getList_DoiTuong();
            }
        });
        $('#txtTuKhoa_Search').focus();
        $("#MainContent").delegate('.detail_HoSo_DoiTuong', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_HSDoiTuong(id, point);
        });
        $("#MainContent").delegate('.detail_HoSo_DoiTuong', 'click', function (e) {
            e.stopImmediatePropagation();
            if (this.id != me.strDoiTuong_Id) {
                me.active_DoiTuong(this.id);
            }
        });
        //Đóng toàn bộ thông tin đối tượng thu
        $("#btnClose_DoiTuong_CT").click(function () {
            $("#zoneThongTinDoiTuong").slideUp();
            //Xoa hien thi NCS
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            });
            me.reset_DoiTuong();
        });
        $(".btnClose").click(function () {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab1");
        });
        /*------------------------------------------
        --Discription: [6]. Action BienLaiHoaDon (BLHD)
        -------------------------------------------*/
        $("#btnAddnew_PhieuThu").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_PhieuThu') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_ChungTu('tbldata_PhieuThu');
        });
        $("#btnAddnew_BienLai").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_BienLai') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_ChungTu('tbldata_BienLai');
        });
        $("#btnAddnew_HoaDon").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_HoaDon') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_ChungTu('tbldata_HoaDon');
        });
        $("#btnAddnew_HoaDon_DaNop").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_HoaDon_DaNop') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_ChungTu('tbldata_HoaDon_DaNop');
        });
        //Khi thay đổi giá trị tiền trong hóa đơn thì sẽ cập nhật lại thông tin tổng tiền hiển thị lại tổng tiền
        $("#tbldata_PhieuThu").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tbldata_PhieuThu");
        });
        $("#tbldata_BienLai").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tbldata_BienLai");
        });
        $("#tbldata_HoaDon").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, true);
            if (!check) return;
            me.show_TongTien('tbldata_HoaDon');
        });
        $("#tbldata_HoaDon_DaNop").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, true);
            if (!check) return;
            me.show_TongTien('tbldata_HoaDon_DaNop');
        });
        //Zone tách khoản 
        $("#MainContent").delegate('.ckbLKT_CT', 'click', function (e) {
            e.stopImmediatePropagation();
            var id = this.id.replace(/ckbLKT_CT/g, '');//Khoản thu id
            var strKhoanThuGoc_Id = me.strKhoanCanTach_Id;
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
                row += '<td style="text-align: left">' + strKhoanThu_Name + '</td>';
                row += '<td><input id="txtNoiDung' + id + '" class="inputnoidung" style="width: 100%; text-align: left"></td>';
                row += '<td>0</td>';
                row += '<td>';
                row += '<input id="txtTongTienKhoanTach' + id + '" class="inputsotien" value="0" style="width: 150px">';
                row += '</td>';
                row += '<td>';
                row += '<a class="btnXoaKhoanThu" id="' + id + '">Xóa</a>';
                row += '</td>';
                row += '</tr>';
                $("#tblChiTietKhoan_TachKhoan tbody").append(row);
            } else {
                $("#tblChiTietKhoan_TachKhoan tbody #" + id).replaceWith('');
            }
        });
        $("#zoneThongTinTachKhoan").delegate('.btnCloseKhoanCanTach', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#zoneThongTinDoiTuong").slideDown('slow');
            $("#zoneThongTinTachKhoan").slideUp('slow');
        });
        $("#zoneThongTinDoiTuong").delegate('.btnTachKhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            me.tachKhoan_HoaDon(this);
        });
        $("#tblChiTietKhoan_TachKhoan").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            var dTongTienTruocTach = parseFloat($("#txtTongTienKhoanTruocTach").html().replace(/,/g, ''));
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
        $("#btnThucHienTachKhoan").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var dTongTienSau = $("#txtTongTienKhoanTach").html().replace(/,/g, '');
            dTongTienSau = parseFloat(dTongTienSau);
            if (dTongTienSau < 0) {
                edu.system.alert("Khoản thu vượt quá định mức", "w");
                //return;
            } 
            me.addKhoanThuCanTach();
        });
        //check all table
        $("[id$=chkSelectAll_PhieuThu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_PhieuThu" });
        });
        $("[id$=chkSelectAll_BienLai]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_BienLai" });
        });
        $("[id$=chkSelectAll_HoaDon]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_HoaDon" });
        });
        $("[id$=chkSelectAll_HoaDon_DaNop]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_HoaDon_DaNop" });
        });
        /*------------------------------------------
        --Discription: Action xxx 
        -------------------------------------------*/
        //Lưu lựa chọn là thông tin phiếu thu hoặc rút
        //Hiện thị vùng hóa đơn
        //Hiển thị xem hóa đơn
        //Lấy thông tin phiếu
        //Hiển thị nút in
        $("#zoneThongTinDoiTuong").delegate('.detail_KhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            var strChungTu_Id = this.id;
            me.strChungTu_Id = strChungTu_Id;
            me.bActiveRutTien = false;
            $(".beforeActive").hide();
            $("#zoneChungTu").slideDown();
            $("#zoneTimKiemDoiTuong").slideUp();
            edu.extend.getData_Phieu(strChungTu_Id, "BIENLAI", 'MauIn_ChungTu', main_doc.ChungTu.changeWidthPrint);
        });
        $("#zoneThongTinDoiTuong").delegate('.detail_KhoanRut', 'click', function (e) {
            e.stopImmediatePropagation();
            var strChungTu_Id = this.id;
            me.strChungTu_Id = strChungTu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneChungTu").slideDown();
            $("#zoneTimKiemDoiTuong").slideUp();
            edu.extend.getData_Phieu(strChungTu_Id, "BIENLAI", "MauIn_ChungTu", main_doc.ChungTu.genHTML_PhieuRut);
        });
        $("#zoneThongTinDoiTuong").delegate('.detail_PhieuHoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strChungTu_Id = this.id;
            me.strChungTu_Id = strChungTu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneChungTu").slideDown();
            $("#zoneTimKiemDoiTuong").slideUp();
            edu.extend.getData_Phieu(strChungTu_Id, "HOADON", "MauIn_ChungTu", main_doc.ChungTu.changeWidthPrint);
        });

        /*------------------------------------------
        --Discription: [5]. Action ChiTiet KhoanThu
        --Update: nnthuong/26/07/2018
        -------------------------------------------*/
        //tab1
        $(".btnDetail_KhoanPhaiNop").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_KhoanPhaiNop();
        });
        $(".btnDetail_KhoanDuocMien").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_KhoanDuocMien();
        });
        $(".btnDetail_KhoanDaNop").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_KhoanDaNop();
        });
        $(".btnDetail_KhoanDaRut").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_KhoanDaRut();
        });
        $(".btnDetail_NoRiengTungKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoRiengTungKhoan();
        });
        $(".btnDetail_NoChungCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoChungCacKhoan();
        });
        $(".btnDetail_DuRiengCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuRiengCacKhoan();
        });
        $(".btnDetail_DuChungCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuChungCacKhoan();
        });
        $(".btnDetail_PhieuDaThu").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_PhieuDaThu();
        });
        $(".btnDetail_PhieuDaRut").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_PhieuDaRut();
        });
        $(".btnDetail_PhieuHoaDon").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_PhieuHoaDon();
        });
        //tab2
        $(".btnDetail_NoChungCacKhoan_Tab2").click(function () {
            me.tabActive = 2;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoChungCacKhoan();
        });
        //tab3
        $(".btnDetail_NoRiengTungKhoan_Tab3").click(function () {
            me.tabActive = 3;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoRiengTungKhoan();
        });
        //tab4
        $(".btnDetail_DuRiengCacKhoan_Tab4").click(function () {
            me.tabActive = 4;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuChungCacKhoan();
           
        });
        //tab5
        $(".btnDetail_DuChungCacKhoan_Tab5").click(function () {
            me.tabActive = 5;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuRiengCacKhoan();
        });
        /*------------------------------------------
        --Discription: Action HoaDon
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: 
        -------------------------------------------*/
        $(".tablinks").click(function (e) {
            var strZoneId = $(this).attr('name');
            $(".zoneThongTinBoSung").slideUp();
            $("#" + strZoneId).slideDown('slow');
            //$(".chitietkhoanthu").hide();
            setTimeout(function () {
                var table_id = $(".tab-pane.active table");
                //Không tìm thấy đối tượng
                if (table_id.length == 0) return;
                table_id = table_id.attr("id");
                me.show_TongTien(table_id);
            }, 100);
        });
        $('.dropdown-menu').on('click', function (event) {
            event.stopImmediatePropagation();
            // The event won't be propagated up to the document NODE and 
            // therefore delegated events won't be fired
            event.stopPropagation();
        });
        /*------------------------------------------
        --Discription: Action 
        -------------------------------------------*/
        me.eventTongTien("tbldata_PhieuThu");
        me.eventTongTien("tbldata_BienLai");
        me.eventTongTien("tbldata_HoaDon");
        me.eventTongTien("tbldata_HoaDon_DaNop");
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_TrangThaiSV();
        me.getList_NutHDDT();
        // Xem trước (không auto-print): mở popup A5 landscape để user kiểm tra layout trước khi in thật
        $("#btnPreview_ChungTu").click(function (e) {
            e.stopImmediatePropagation();
            edu.extend.remove_PhoiIn("MauIn_ChungTu");
            me._printChungTuCustom('MauIn_ChungTu', false); // false = KHÔNG auto print
        });
        $("#btnIn_ChungTu").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnHuy_ChungTu").click(function (e) {
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn hủy chứng từ không!', 'w');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_BL(me.strChungTu_Id);
            });
            return false;
        });
        $("#MainContent").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id
            var xCheck = me.dtNutHDDT.find(e => e.ID === strId);
            if (xCheck && xCheck.THONGTIN4) edu.system.objApi["HDDT"] = xCheck.THONGTIN4;
            var strLinkAPI = edu.system.strhost + edu.system.objApi["HDDT"].replace(/api/g, ''); //$(this).attr("name");
            //edu.system.objApi["HDDT"].replace(/api/g, '') = strLinkAPI;
            var strPhuongThuc_Ma = $(this).attr("title");
            if (strPhuongThuc_Ma.indexOf("HDDTNHAP") == 0) {
                me.save_ChungTu('tbldataPhieuThuPopup_PT_Edit', "HDDTNHAP", strLinkAPI, strPhuongThuc_Ma);
            } else {
                edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', 'w');
                $("#btnYes").click(function (e) {
                    $('#myModalAlert').modal('hide');
                    me.save_ChungTu('tbldataPhieuThuPopup_PT_Edit', "HDDT", strLinkAPI, strPhuongThuc_Ma);
                });
            }
        });
        //Đóng hóa đơn sửa hoặc hóa đơn in
        $("#btnClose_ChungTu").click(function (e) {
            e.stopImmediatePropagation();
            me.closePhieu();
        });

        $('#dropSearch_HeDaoTao_CT').on('change', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao_CT').on('change', function (e) {
            if ($('#dropSearch_KhoaDaoTao_CT').val() != "") {
                me.getList_ChuongTrinhDaoTao();
                me.getList_LopQuanLy();
            }
        });
        $('#dropSearch_ChuongTrinh_CT').on('change', function (e) {
            if ($('#dropSearch_ChuongTrinh_CT').val() != "") {
                me.getList_LopQuanLy();
            }
        });
        //$('#dropSearch_HocKy_CT').on('change', function (e) {
        //    var id = this.id;
        //    if (id == "") {
        //        $("#zoneDSKhoanThu").hide();
        //    } else {

        //        $("#zoneDSKhoanThu").show();
        //    }
        //});
        //
        //me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_CT_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_CT").each(function () {
                this.checked = checked_status;
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp('slow');
        $("#" + id).slideDown('slow');
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
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao_CT"),
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
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_CT"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_CT"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_CT"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinh_CT"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
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
            error: function (er) {},
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
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
            renderPlace: ["dropSearch_HeDaoTao_CT"],
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
            renderPlace: ["dropSearch_KhoaDaoTao_CT"],
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
            renderPlace: ["dropSearch_ChuongTrinh_CT"],
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
            renderPlace: ["dropSearch_Lop_CT"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_CT"],
            type: "",
            title: "Tất cả đợt",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_CT_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print;">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_CT" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_CT").html(row);
        //me.getList_KhoanThu();
    },
    genHTML_HDDT: function (data) {
        var me = this;
        me["dtNutHDDT"] = data;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            // Structure inline horizontal (icon + text 1 dòng) — CSS scoped
            // #zoneActionXuatHoaDon .btnXuat_HDDT ở chungtu.html style teal solid đồng bộ với HDDT Nháp.
            // Giữ id/title/name trên div wrapper vì handler .btnXuat_HDDT click đọc các attr này.
            row += '<div class="btnXuat_HDDT aps-btn" id="' + data[i].ID + '" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '">'
                + '<a title="' + data[i].TEN + '" class="btn"><i class="' + data[i].THONGTIN1 + '"></i> ' + data[i].TEN + '</a>'
                + '</div>';
        }
        me.strHDDT = row;
    },
    /*------------------------------------------
    --Discription: [1] HoSoSinhVien
    --ULR: Modules
    -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
            'iM': edu.system.iM,
            'strTuKhoa': (edu.util.getValById('txtTuKhoa_Search') || '').toString().trim(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_CT'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_CT'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_CT'),
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop_CT'),
            'strStudyStatus_Ids': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_CT').toString(),
            'dIsPrimary': '',
            'dBoQuaPhamVi': 0,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        console.log('%c[chungtu.getList_DoiTuong] >>> REQUEST', 'color:#2196F3;font-weight:bold', obj_list);
        console.log('[chungtu.getList_DoiTuong] action:', obj_list.action);
        console.log('[chungtu.getList_DoiTuong] func  :', obj_list.func);
        console.log('[chungtu.getList_DoiTuong] payload JSON:', JSON.stringify(obj_list, null, 2));

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                console.log('%c[chungtu.getList_DoiTuong] <<< RESPONSE', 'color:#4CAF50;font-weight:bold', data);
                console.log('[chungtu.getList_DoiTuong] Success :', data && data.Success);
                console.log('[chungtu.getList_DoiTuong] Message :', data && data.Message);
                console.log('[chungtu.getList_DoiTuong] Pager   :', data && data.Pager);
                console.log('[chungtu.getList_DoiTuong] Data.len:', data && data.Data ? data.Data.length : 0);
                if (data && data.Data && data.Data.length > 0) {
                    console.log('[chungtu.getList_DoiTuong] Row[0]  :', data.Data[0]);
                    console.log('[chungtu.getList_DoiTuong] Keys[0] :', Object.keys(data.Data[0]));
                }
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genTable_DoiTuong(data.Data, data.Pager);
                    if (edu.util.checkValue(data.Data)) {
                        if (data.Pager == 1) {
                            me.active_DoiTuong(data.Data[0].ID);
                        }
                    }
                }
                else {
                    console.error('[chungtu.getList_DoiTuong] FAIL:', data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                console.error('%c[chungtu.getList_DoiTuong] !!! ERROR', 'color:#F44336;font-weight:bold', er);
                if (er && er.responseText) console.error('[chungtu.getList_DoiTuong] responseText:', er.responseText);
                if (er && er.status) console.error('[chungtu.getList_DoiTuong] status:', er.status, er.statusText);
                edu.system.endLoading();
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DoiTuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_DoiTuong_CT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChungTu.getList_DoiTuong()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            colPos: {
                left: [2]
            },
            aoColumns: [
                {
                    "mData": "HinhAnh",
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        var html = '<span><img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" /></span>';
                        return '<a>' + html + '</a>';
                    }
                }
                ,
                {
                    "mData": "ThongTin",
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.checkEmpty(aData.HODEM) + " " + edu.util.checkEmpty(aData.TEN);
                        var strMaSo = edu.util.checkEmpty(aData.MASO);
                        var html = '';
                        html += '<a class="color-default">';
                        html += '<span id="sl_hoten' + aData.ID + '" class="sl_hoten bold">' + strHoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '" class="italic sl_ma">' + strMaSo + '</span>';
                        html += '<span class="italic sl_lop">Lớp: ' + edu.util.checkEmpty(aData.DAOTAO_LOPQUANLY_N1_TEN) + '</span>';
                        html += '</a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var x = $("#tbldata_DoiTuong_CT tbody tr");
        for (var i = 0; i < x.length ; i++) {
            x[i].classList.add("detail_HoSo_DoiTuong");
        }
        if (document.getElementById("light-paginationtbldata_DoiTuong_CT") != undefined) document.getElementById("light-paginationtbldata_DoiTuong_CT").style.width = "100%";
        $(".popover").replaceWith('');
        /*III. Callback*/
        //Thêm trigger nhớ xóa
        //me.triggerDoiTuong();
    },
    /*------------------------------------------
    --Discription: [2] DoiTuong
    --ULR: Modules
    -------------------------------------------*/
    reset_DoiTuong: function () {
        var me = this;
        if (me.strDoiTuong_Id == '') return;
        me.strDoiTuong_Id = "";
        var arrId = ["txtTen_Ma_NS_SDT_CT", "lbSoTienDaChon_CT"];
        var arrTable = ["tbldata_PhieuThu", "tbldata_BienLai", "tbldata_HoaDon"];
        var arrSetRezo = ["txtSoHienThi_PhaiNop", "txtSoHienThi_KhoanDuocMien", "txtSoHienThi_DaNop", "txtSoHienThi_DaRut", "txtSoHienThi_NoRiengTungKhoan", "txtSoHienThi_NoChungCacKhoan", "txtSoHienThi_DuRieng", "txtSoHienThi_DuChung"];
        var arrCheckBox = ["chkSelectAll_PhieuThu", "chkSelectAll_BienLai", "chkSelectAll_HoaDon"];

        for (var i = 0; i < arrId.length; i++) {
            var x = document.getElementById(arrId[i]);
            if (x != undefined) x.innerHTML = "";
        }

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
        $(".noco-phieuthu").html('');
    },
    active_DoiTuong: function (strDoiTuong_Id) {
        //Xóa thông tin đối tượng
        var me = this;
        me.reset_DoiTuong();
        if (edu.util.checkValue(strDoiTuong_Id) && strDoiTuong_Id != me.strId) {
            //Ẩn active tất cả các đối tượng
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            })
            //Active sinh viên trong list SV bên trái
            var point = $("#tbldata_DoiTuong_CT tbody tr[id='" + strDoiTuong_Id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 200);
            }
        }
        me.strDoiTuong_Id = me.dt_HS.find(e => e.ID == strDoiTuong_Id).QLSV_NGUOIHOC_ID;
        me.getDetail_DoiTuong(strDoiTuong_Id);
        me.showFormChungTu();
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
        row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
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
        //[1][2][3]
        //[1]. Hoten - MaSo - DienThoai
        var strHoTen = edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN);
        var strMa = data.MASO
        var strSoDienThoai = data.TTLL_DIENTHOAICANHAN;
        var strHienThi = '<span class="bold">' + strHoTen.toUpperCase() + '</span>';

        if (edu.util.checkValue(strMa)) strHienThi += " - " + strMa;
        if (edu.util.checkValue(strSoDienThoai)) strHienThi += " - " + strSoDienThoai;

        $("#txtTen_Ma_NS_SDT_CT").html(strHienThi);

        me.strChuongTrinh_Id = data.DAOTAO_TOCHUCCHUONGTRINH_ID;
        //[2]. TinhTrang
        var strTrangThai_Ten = edu.util.checkEmpty(data.QLSV_TRANGTHAINGUOIHOC_TEN);
        var strTrangThai_Ma = edu.util.returnEmpty(data.QLSV_TRANGTHAINGUOIHOC_MA);
        var strTrangThaiHienThi = '';
        var colorLable = '';
        var icon = '';
        
        switch (strTrangThai_Ma) {
            case "CHUYENTRUONGDI":
                colorLable = 'label-danger';
                icon = 'fa-sign-out';
                displayTinhTrang(colorLable, icon);
                break;
            case "NORMAL":
                colorLable = 'label-info';
                icon = 'fa-users';
                displayTinhTrang(colorLable, icon);
                break;
            case "CHUYENTRUONG":
                colorLable = 'label-info';
                icon = 'fa-sign-in';
                displayTinhTrang(colorLable, icon);
                break;
            case "KHONGXACDINH":
                colorLable = 'label-warning';
                icon = 'fa-exclamation-triangle';
                displayTinhTrang(colorLable, icon);
                break;
            case "GRADUATE":
                colorLable = 'label-success';
                icon = 'fa-graduation-cap';
                displayTinhTrang(colorLable, icon);
                break;
            case "FORCEDROPOUT":
                colorLable = 'label-info';
                icon = 'fa-exclamation-triangle';
                displayTinhTrang(colorLable, icon);
                break;
            case "CANHBAO":
                colorLable = 'label-warning';
                icon = 'fa-exclamation-triangle';
                displayTinhTrang(colorLable, icon);
                break;
            case "RESERVE":
                colorLable = 'label-info';
                icon = 'fa-user-secret';
                displayTinhTrang(colorLable, icon);
                break;
            case "DROPOUT":
                colorLable = 'label-warning';
                icon = 'fa-exclamation-triangle';
                displayTinhTrang(colorLable, icon);
                break;
            case "XOATEN":
                colorLable = 'label-danger';
                icon = 'fa-user-times';
                displayTinhTrang(colorLable, icon);
                break;
            case "REPEATE":
                colorLable = 'label-warning';
                icon = 'fa-exclamation-triangle';
                displayTinhTrang(colorLable, icon);
                break;
            case "DUNGHOC":
                colorLable = 'label-warning';
                icon = 'fa-ban';
                displayTinhTrang(colorLable, icon);
                break;
            default:
                colorLable = 'label-success';
                icon = 'fa-graduation-cap';
                displayTinhTrang(colorLable, icon);
                break;
        }
        function displayTinhTrang(colorLable, icon) {
            strTrangThaiHienThi = '<a id="txtTinhTrang" class="label ' + colorLable + ' trangthaiHS" title="' + strTrangThai_Ten + '"><i class="fa ' + icon + '"></i> ' + strTrangThai_Ten + '</a>';
        }
        $("#txtTinhTrang").replaceWith(strTrangThaiHienThi);

        //[3]. call tinhtrangtaichinh
        me.getList_TinhTrangTaiChinh();
    },

    /*------------------------------------------
    --Discription: [3] GET DATA TinhTrangTaiChinh ==> 
    -------------------------------------------*/
    getList_TinhTrangTaiChinh: function() {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDanhSach',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguonDuLieu_Id': ''
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinhTrangTaiChinh_PhieuThu(data.Data.rsKhoanDaNopChuaXuatPhieuThu, "tbldata_PhieuThu");
                    me.genTable_TinhTrangTaiChinh_PhieuThu(data.Data.rsKhoanDaNopChuaXuatBienLai, "tbldata_BienLai");
                    me.genTable_TinhTrangTaiChinh_HoaDon(data.Data.rsKhoanDaNopChuaXuatHoaDon, "tbldata_HoaDon");
                    me.genHTML_TongCacKhoanThu(data.Data.rsThongTin[0]);
                    me.dtHoaDon = data.Data.rsKhoanDaNopChuaXuatHoaDon;
                    me.dt_DoiTuongThu = data.Data.rsThongTin[0];
                    me["dtTaiChinh"] = data.Data;
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
    --Discription: [3] Generating html TinhTrangTaiChinh
    --ULR: Modules
    -------------------------------------------*/
    genTable_TinhTrangTaiChinh_PhieuThu: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: {
                center: [0, 6, 7, 8]
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
                        return '<input id="txtNoiDungHD' + aData.ID + '" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" class="inputnoidung" style="width: 100%"/>';
                }
            }, {
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
    genTable_TinhTrangTaiChinh_HoaDon: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: { center: [0, 7,8] },
            "aoColumns": [{
                "mDataProp": "DAOTAO_THOIGIANDAOTAO"
            }, {
                "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
            }, {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }, {
                "mData": "NOIDUNG",
                "mRender": function (nRow, aData) {
                    return '<input id="txtNoiDungHD' + aData.ID + '" value="' + aData.NOIDUNG + '" class="inputnoidung" style="width: 100%"/>';
                }
            }, {
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
    
    /*------------------------------------------
   --Discription: [4] Generating html TinhTrangTaiChinh
   --ULR: Modules
   -------------------------------------------*/
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
        rows += '<td>' + strKhoanThu_Name + '</td>';
        //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
        rows += '<td>' + strNoiDung_Name + '</td>';
        rows += '<td><span id="txtTongTienKhoanTruocTach" style="width: 150px">' + strSoTien + '</span></td>';
        rows += '<td><span id="txtTongTienKhoanTach" style="width: 150px">' + strSoTien + '</span></td>';
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
        $("#" + strTable_Id + " #txtTongTien" + me.strKhoanCanTach_Id).val(strSoTienSauChuyen);
        var pointViTri = $("#" + strTable_Id + " tbody tr[id='" + me.strKhoanCanTach_Id + "']");
        var strThoiGianDaoTao_Id = $("#" + strTable_Id + " tbody tr input[id='" + me.strKhoanCanTach_Id + "']").attr("name");
        var strChungTu_Ma = $("#" + strTable_Id + " tbody tr input[id='" + me.strKhoanCanTach_Id + "']").attr("title");
        var x = $("#tblChiTietKhoan_TachKhoan .inputsotien");
        var arrCheck = [];
        for (var i = 0; i < x.length; i++) {
            var strId = x[i].id.replace('txtTongTienKhoanTach', '');
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
            var strKhoanThu_Id = point.id.replace('txtTongTienKhoanTach', '');
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
            rows += '<td><input id="txtTongTien' + me.strKhoanCanTach_Id + '_' + strKhoanThu_Id + '" class="inputsotien" name="' + strTongTien_Id + '" value="' + strTongTien_Id + '" style="width: 150px"></td>';
            rows += '<td></td>';
            rows += '<td></td>';
            rows += '<td><input checked="checked" id="' + me.strKhoanCanTach_Id + '_' + strKhoanThu_Id + '" name="' + strThoiGianDaoTao_Id + '" title="' + strChungTu_Ma + '" khoanthugoc_id="' + strKhoanThu_Id + '" type="checkbox"></td>';
            rows += '</tr>';
            pointViTri.after(rows);
        }
    },
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
            var sum = edu.system.countFloat(strTableId, 5, 8);
            var strTongThu = "Tổng tiền đã chọn: " + edu.util.formatCurrency(sum);
            $("#lbSoTienDaChon_CT").html("/ " + strTongThu);
            edu.system.insertSumAfterTable(strTableId, [5]);
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
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
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
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="ckbLKT_CT' + dataKhoanThu[i].ID + '" class="ckbLKT_CT" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanThu").html(row);
        //me.getList_KhoanThu();
    },
    getList_KhoanPhaiNop: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanPhaiNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDuocMien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanMien',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaNop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaRut: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaRut',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoRiengTungKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuRiengCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuDaThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSPhieuDaThu',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuDaRut: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSPhieuDaRut',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuHoaDon: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSPhieuHoaDon',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
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
        var strHienThi = "Chưa xác định";
        if (edu.util.floatValid(dNoCo)) {
            if (dNoCo > 0) strHienThi = '<span style="color: #00c0ef"><i class="fa fa-bitbucket"></i> <span class="lang" key="">Tổng dư</span>: ' + edu.util.formatCurrency(dNoCo) + '</span>';
            if (dNoCo < 0) strHienThi = '<span class="color-red"><i class="fa fa-cubes"></i> <span class="lang" key="">Tổng nợ</span>: ' + edu.util.formatCurrency(dNoCo) + '</span>';
            if (dNoCo == 0) strHienThi = '<span style="color: green"><i class="fa fa-empire"></i> <span class="lang" key="">Đã hoàn thành</span></span>';
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
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "CHUNGTU_SO"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
                , {
                    "mDataProp": "NGUOITAO_TENDAYDU"
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
                right: [2]
            },
            "aoColumns": [
                {
                    "mDataProp": "SOPHIEUTHU"
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mDataProp": "NGAYTHU_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "TAIKHOAN_NGUOITHU"
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
                right: [2]
            },
            "aoColumns": [
                {
                    "mDataProp": "SOPHIEUTHU"
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mDataProp": "NGAYTHU_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "TAIKHOAN_NGUOIRUT"
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
                right: [2]
            },
            "aoColumns": [
                {
                    "mDataProp": "SOHOADON"
                }
                , {
                    "mData": "TONGTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGTIEN);
                    }
                }
                , {
                    "mDataProp": "NGAYTHU_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "TAIKHOAN_NGUOITHU"
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
    --Discription: [6] ACCESS DB ==>HoaDonBienLai
    --ULR: Modules
    -------------------------------------------*/

    save_ChungTu: function (strTable_id, strTable_Id_Loai, linkHDDT, strPhuongThuc_Ma) {
        var me = this;
        //
        var strIds = "";
        var strTAICHINH_CACKHOANTHU_Ids = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoTien = "";
        var arrIdCheck = [];
        var strSoLuong = "";
        var strDonGia = "";
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
            //
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML.replace(/&amp;/g, '&') + "#";
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
        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }
        //Nếu chuyển qua lại giữa các loại phiếu
        switch (strTable_Id_Loai) {
            case "tbldata_PhieuThu": save_PhieuThu(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien); break;
            case "tbldata_BienLai": save_BienLai(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien); break;
            case "tbldata_HoaDon": save_HoaDon(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien); break;
            case "HDDT": saveHDDT(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien); break;
            case "HDDTNHAP": saveHDDT_Nhap(strIds, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDungs, strSoTien); break;
        }

        function save_PhieuThu(strTaiChinh_DaNop_Ids, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var obj_save = {
                'action': 'TC_DaNop_PhieuThu/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_DaNop_Ids': strTaiChinh_DaNop_Ids,
                'strTAICHINH_CACKHOANTHU_Ids': strTAICHINH_CACKHOANTHU_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strChungTu_Id = data.Id;
                        me.strChungTu_Id = strChungTu_Id;
                        edu.extend.getData_Phieu(strChungTu_Id, "BIENLAI", "MauIn_ChungTu", main_doc.ChungTu.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
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

        function save_BienLai(strTaiChinh_DaNop_Ids, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var obj_save = {
                'action': 'TC_DaNop_PhieuThu/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_DaNop_Ids': strTaiChinh_DaNop_Ids,
                'strTAICHINH_CACKHOANTHU_Ids': strTAICHINH_CACKHOANTHU_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strChungTu_Id = data.Id;
                        me.strChungTu_Id = strChungTu_Id;
                        edu.extend.getData_Phieu(strChungTu_Id, "BIENLAI", "MauIn_ChungTu", main_doc.ChungTu.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
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
        
        function save_HoaDon(strTaiChinh_DaNop_Ids, strTAICHINH_CACKHOANTHU_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoTien_s) {
            var strVAT = null;
            var strSoTienTruocThue = [];
            var arrDaNop = [strTaiChinh_DaNop_Ids]
            if (strTaiChinh_DaNop_Ids) arrDaNop = strTaiChinh_DaNop_Ids.split(',');
            arrDaNop.forEach(e => {
                var aDN = me.dtHoaDon.find(el => e == el.ID);
                if (!strVAT) {
                    if (strVAT != aDN.VAT) {
                        edu.system.alert("Không suất được các khoản có VAT khác nhau");
                        return;
                    }
                }
                strSoTienTruocThue.push(aDN.SOTIENTRUOCVAT);
            })
            var obj_save = {
                'action': 'TC_DaNop_HoaDon/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_DaNop_Ids': strTaiChinh_DaNop_Ids,
                'strTAICHINH_CACKHOANTHU_Ids': strTAICHINH_CACKHOANTHU_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strTaiChinh_SoTien_TruocThue_s': strSoTienTruocThue.toString(),
                'strVat': strVAT,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var strChungTu_Id = data.Id;
                        me.strChungTu_Id = strChungTu_Id;
                        edu.extend.getData_Phieu(strChungTu_Id, "HOADON", "MauIn_ChungTu", main_doc.ChungTu.changeWidthPrint);
                        informSaveSuccess(data.Message);
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
            var strVAT = null;
            var strSoTienTruocThue = [];
            var arrDaNop = [strTaiChinh_DaNop_Ids]
            if (strTaiChinh_DaNop_Ids) arrDaNop = strTaiChinh_DaNop_Ids.split(',');
            arrDaNop.forEach(e => {
                var aDN = me.dtHoaDon.find(el => e == el.ID);
                if (!strVAT) {
                    if (strVAT != aDN.VAT) {
                        edu.system.alert("Không suất được các khoản có VAT khác nhau");
                        return;
                    }
                }
                strSoTienTruocThue.push(aDN.SOTIENTRUOCVAT);
            })
            var obj_save = {
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_DaNop_Ids,
                'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_MA': me.strHinhThucThu_Ma,
                'strHinhThucThu_TEN': me.strHinhThucThu_Ten,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strTaiChinh_SoTien_TruocThue_s': strSoTienTruocThue.toString(),
                'strVat': strVAT,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strPhuongThuc_MA': strPhuongThuc_Ma,
                'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            };
            obj_save.action = 'HDDT_HoaDon/ThemMoi';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        informSaveSuccess(d.Id);
                        me.strChungTu_Id = d.Id;
                        edu.extend.getData_Phieu(d.Id, "HOADON", "MauIn_ChungTu", main_doc.ChungTu.changeWidthPrint);
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
            var strVAT = null;
            var strSoTienTruocThue = [];
            var arrDaNop = [strTaiChinh_DaNop_Ids]
            if (strTaiChinh_DaNop_Ids) arrDaNop = strTaiChinh_DaNop_Ids.split(',');
            arrDaNop.forEach(e => {
                var aDN = me.dtHoaDon.find(el => e == el.ID);
                if (!strVAT) {
                    if (strVAT != aDN.VAT) {
                        edu.system.alert("Không suất được các khoản có VAT khác nhau");
                        return;
                    }
                }
                strSoTienTruocThue.push(aDN.SOTIENTRUOCVAT);
            })
            var obj_save = {
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_DaNop_Ids,
                'strQLSV_NguoiHoc_Id': me.strDoiTuong_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_MA': me.strHinhThucThu_Ma,
                'strHinhThucThu_TEN': me.strHinhThucThu_Ten,
                'strTaiChinh_SoTien_TruocThue_s': strSoTienTruocThue.toString(),
                'strVat': strVAT,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia,
                'strSoLuong_s': strSoLuong,
                'strDonViTinhTen_s': arrDonViTinh.toString(),
                'strLoaiTienTe': me.strLoaiTienTe_Ma,
                'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
                'strPhuongThuc_MA': strPhuongThuc_Ma
            };
            obj_save.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        var strLink = d.Data;
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.objApi["HDDT"];
                            console.log(strLink);
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

        function informSaveSuccess(data) {
            me.getList_TinhTrangTaiChinh();
            $("#lbSoTienDaChon_CT").html('');
            //Hiển thị lại lưu biên lai
            $("#btnIn_ChungTu").show();
            $("#btnHuy_ChungTu").show();
            $("#btnSave_ChungTu").replaceWith('');
            $(".btnXuat_HDDT").remove();
        }
    },
    delete_BL: function (strChungTu_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_SoBienLai/HuyBienLai',
            'versionAPI': 'v1.0',
            'strBienLai_Id': strChungTu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_TinhTrangTaiChinh();
                    me.closePhieu();
                    edu.extend.notifyBeginLoading('Xóa biên lai thành công!');
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
    --Discription: [6] GEN HTML ==> HoaDonBien Lai
    --ULR: Modules
    -------------------------------------------*/
    genHTML_NoiDung_ChungTu: function (strTableId) {
        var me = this; this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauIn_ChungTu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "";
        switch (strTableId) {
            case "tbldata_PhieuThu":
            case "tbldata_BienLai":
                strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018"; break;
            case "tbldata_HoaDon":
            case "tbldata_HoaDon_DaNop":
                strMauXem = "Edit_DHCNTTTN_HOADON_2018"; break;
            default: strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018"; break;
        }
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html', function () {
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
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, me.cbGenCombo_HinhThucThu);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, me.cbGenCombo_LoaiTienTe);
            //$(".txtDiaChiPTC_PT_Edit").html(data.aaaa);
            $(".txtMaNCSPTC_PT_Edit").html(data.MASO);
            $(".txtHoTenPTC_PT_Edit").html(data.HODEM + " " + data.TEN);
            $(".iNgayPTC_PT_Edit").html(edu.util.thisDay());
            $(".iThangPTC_PT_Edit").html(edu.util.thisMonth());
            $(".iNamPTC_PT_Edit").html(edu.util.thisYear());
            try {
                if (me.strNgayXuatChungTu && me.strNgayXuatChungTu.indexOf("/")) {
                    var arrNgayThangPT = me.strNgayXuatChungTu.split("/")
                    $(".iNgayPTC_PT_Edit").html(arrNgayThangPT[0]);
                    $(".iThangPTC_PT_Edit").html(arrNgayThangPT[1]);
                    $(".iNamPTC_PT_Edit").html(arrNgayThangPT[2]);
                }
            } catch{

            }
            $(".txtNgaySinhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGAYSINH));
            $(".txtMaSoThue_PT_Edit").html(edu.util.returnEmpty(data.MASOTHUECANHAN));
            $(".txtDiaChiPTC_PT_Edit").html(edu.util.returnEmpty(data.NOIOHIENNAY));
            $(".txtLopPTC_PT_Edit").html(edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGANHHOC_N1_TEN));
            $(".txtKhoaPTC_PT_Edit").html(edu.util.returnEmpty(data.KHOAHOC_N1_TEN));
            //Các thao tác chuyển sang mẫu viết phiếu
            $(".beforeActive").hide();
            $("#zoneChungTu").slideDown();
            $("#zoneTimKiemDoiTuong").slideUp();
            $("#btnIn_ChungTu").hide();
            $("#btnHuy_ChungTu").hide();
            if (strTableId == "tbldata_HoaDon") {
                $("#zoneActionXuatHoaDon").html(me.strHDDT);
            }
            if (document.getElementById('btnSave_ChungTu') == undefined) {
                // Structure inline horizontal đồng bộ với các nút khác trong action bar.
                // CSS scoped #zoneActionChungTu .btn-primary sẽ style xanh dương CTA solid.
                $("#zoneActionChungTu").prepend('<div id="btnSave_ChungTu" class="aps-btn" name="' + strTableId + '"><a title="Xuất chứng từ" class="btn btn-primary"><i class="fa fa-save"></i> Xuất <span class="lbLoaiChungTu">biên lai</span></a></div>');
                
                $("#btnSave_ChungTu").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_ChungTu('tbldataPhieuThuPopup_PT_Edit', strTableId);
                    });
                });
            }
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
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu trước khi viết phiếu!', 'w');
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
            //var strLoaiChungTu = "";
            //switch (strHeThongChungTu) {
            //    case "TAICHINH_HETHONGPHIEUTHU": strLoaiChungTu = "phiếu thu tiền"; break;
            //    case "TAICHINH_HOADON": strLoaiChungTu = "hóa đơn bán hàng"; break;
            //    case "TAICHINH_HETHONGBIENLAI": strLoaiChungTu = "biên lai thu tiền"; break;
            //    case "TAICHINH_HETHONGPHIEUTHURUT": strLoaiChungTu = "biên lai rút tiền"; break;
            //    default: (bThuTien) ? strLoaiChungTu = "biên lai thu tiền" : strLoaiChungTu = "biên lai rút tiền"; break;
            //}
            //$(".txtTenPhieuBienLai_Edit").html(strLoaiChungTu);
            var strLoaiChungTu = "";
            switch (strTableId) {
                case "tbldata_PhieuThu": strLoaiChungTu = "phiếu thu"; break;
                case "tbldata_BienLai": strLoaiChungTu = "biên lai"; break;
                case "tbldata_HoaDon": strLoaiChungTu = "hóa đơn"; break;
                case "tbldata_HoaDon_DaNop": strLoaiChungTu = "hóa đơn"; break;
                default: strMauXem = "chứng từ"; break;
            }
            $(".lbLoaiChungTu").html(strLoaiChungTu);
            //Các thao tác chuyển sang mẫu viết phiếu
            var idem = 0;
            var strHinhThucThu_Ma = "";
            //Lấy dữ liệu theo các check box đã chọn
            var arrcheck = [];
            for (var i = 0; i < x.length; i++) {
                if (arrcheck.indexOf(x[i].id) != -1) continue;
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
                    var strKhoanThuGoc_Id = $(x[i]).attr("khoanthugoc_id");
                    if (strHinhThucThu_Ma == "") {
                        var strDuLieuId = strId.replace('_' + strKhoanThuGoc_Id, '');
                        var jsonHT = me.dtHoaDon.find(e => e.ID == strDuLieuId);// edu.util.objGetDataInData(strDuLieuId, , "ID")[0];
                        if (!jsonHT) jsonHT = me.dtTaiChinh.rsKhoanDaNopChuaXuatBienLai.find(e => e.ID == strDuLieuId);
                        if (!jsonHT) jsonHT = me.dtTaiChinh.rsKhoanDaNopChuaXuatPhieuThu.find(e => e.ID == strDuLieuId);
                        strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        me.strHinhThucThu_Ma = jsonHT.HINHTHUCTHU_MA;
                        me.strHinhThucThu_Ten = jsonHT.HINHTHUCTHU_TEN;
                        me.strLoaiTienTe_Ma = jsonHT.LOAITIENTE_MA;
                        me.strDonViTinh_Ten = jsonHT.DONVITINH_TEN;
                    }
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
                    var dSoTien = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    strId = strId.replace('_' + strKhoanThuGoc_Id, '');
                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    idem++;
                    var rows = '';
                    rows += '<tr id="' + strId + '" name="' + x[i].name + '" khoanthugoc_id="' + strKhoanThuGoc_Id +'">';//name: DAOTAO_THOIGIANDAOTAO_ID
                    rows += '<td>' + idem + '</td>';
                    rows += '<td>' + strKhoanThu + '</td>';
                    rows += '<td id="lbNoiDung' + strId + '">' + strNoiDung + '</td>';
                    rows += '<td>1</td>';
                    //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
                    rows += '<td class="btnEdit_HDBL" name="' + dSoTien + '">' + dSoTien + '</td>';
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
                $("#btnClose_ChungTu").trigger('click');
                return;
            }
            $(".txtTongTien_PT_Edit").html(x);
            x = x.replace(/,/g, '');
            var strSoTien = to_vietnamese(x) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            $(".txtSoTienPTC_PT_Edit").html(strSoTien);
        }
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
            renderPlace: ["dropHinhThucThuPTC_PT_Edit"],
            type: "",
        }
        edu.system.loadToCombo_data(obj);
        if (!$("#dropHinhThucThuPTC_PT_Edit").val()) {
            var strTienMat_Id = $("#dropHinhThucThuPTC_PT_Edit #TM").val();
            $("#dropHinhThucThuPTC_PT_Edit").val(strTienMat_Id).trigger("change");
        }

    },
    cbGenCombo_LoaiTienTe: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropLoaiTienTePTC_PT_Edit"],
            type: "",
        }
        edu.system.loadToCombo_data(obj);
        var strDropId = $("#dropLoaiTienTePTC_PT_Edit #VND").val();
        $("#dropLoaiTienTePTC_PT_Edit").val(strDropId).trigger("change");

    },
    cbGenCombo_DonViTinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropDonViTinhPTC_PT_Edit"],
            type: "",
        }
        edu.system.loadToCombo_data(obj);
        //var strDropId = $("#dropDonViTinhPTC_PT_Edit #SINHVIEN").val();
        //$("#dropDonViTinhPTC_PT_Edit").val(strDropId).trigger("change");

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

    /*------------------------------------------
  --Discription: [6] xemlai
  --ULR: Modules
  -------------------------------------------*/
    showFormChungTu: function () {
        var me = this;
        me.showHide_Box("beforeActive", "zoneThongTinDoiTuong");
        me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab1");
        edu.system.switchTab("tab_1");
        me.tabActive = 1;
    },
    quickSelectAll_Phieu: function (strTable_id) {
        var me = this;
        //Khi sinh viên được chọn có khoản nợ sẽ tự động nhảy vào tab thu và chọn tất cả
        //Vòng lặp cho đến khi bảng có giá trị nào đó
        var x = document.getElementById(strTable_id).getElementsByTagName('tbody')[0].rows;
        if (x == undefined || x.length < 1) {
            setTimeout(function () {
                me.quickSelectAll_Phieu();
            }, 50);
            return;
        }
        //Set all checkbox trong bảng
        var listData = $("#" + strTable_id);
        listData.find('input:checkbox').each(function () {
            $(this).attr('checked', "true");
            $(this).prop('checked', "true");
            edu.util.setAll_BgRow(strTable_id);
        });
        me.show_TongTien(strTable_id);
        //trigger thu tiền đối tượng nhớ xóa
        //me.triggerThuTien(strTable_id);
},
    /*------------------------------------------
    --Discription: [7] 
    --ULR: Modules
    -------------------------------------------*/
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauIn_ChungTu");
        me._printChungTuCustom('MauIn_ChungTu');
        edu.system.switchTab('tab_1');
        me.closePhieu();
    },
    // Custom print A5 landscape cho chứng từ / hóa đơn.
    // Param autoPrint: true (default) → tự gọi w.print(); false → chỉ mở popup preview, user tự Ctrl+P.
    // Copy pattern _printPhieuThuCustom bên thutien.js: inject full CSS + script detect bảng hàng hóa.
    _printChungTuCustom: function (divId, autoPrint) {
        if (autoPrint === undefined) autoPrint = true;
        var content = document.getElementById(divId).innerHTML;
        var w = window.open('', 'Print', 'height=800,width=1200');
        var css = ''
            + '@page { size: A5 landscape; margin: 0; }'
            + 'html, body { margin: 0; padding: 0; width: 100%; }'
            + 'body { font-family: "Times New Roman", Cambria, serif; font-size: 10pt; line-height: 1.45; color: #000; padding: 0.4cm 0.7cm; width: 100%; background: #fff; text-align: center; }'
            + '* { font-family: "Times New Roman", Cambria, serif; box-sizing: border-box; }'
            + '#' + divId + ' { width: 100%; max-width: 100%; margin: 0 auto; padding: 0; text-align: left; }'
            + '#' + divId + ' > div, #' + divId + ' > table, #' + divId + ' > p, #' + divId + ' > center, #' + divId + ' > span, #' + divId + ' > h1, #' + divId + ' > h2, #' + divId + ' > h3, #' + divId + ' > h4 { width: 100%; max-width: 100%; margin: 0.02cm auto; padding: 0; }'
            /* Default: mọi table KHÔNG có viền — bảng info đơn vị/người mua trong sạch */
            + '#' + divId + ' table { border-collapse: collapse; width: 100%; margin: 1px auto; border: none; }'
            + '#' + divId + ' table td, #' + divId + ' table th { border: none; padding: 2px 4px; vertical-align: middle; font-size: 10pt; line-height: 1.5; text-align: left; }'
            /* CHỈ bảng hàng hóa/khoản thu (JS gắn class .tblHangHoa) mới có viền */
            + '#' + divId + ' table.tblHangHoa { border: 1.2px solid #000; }'
            + '#' + divId + ' table.tblHangHoa td, #' + divId + ' table.tblHangHoa th { border: 1px solid #000; padding: 2px 5px; }'
            + '#' + divId + ' table.tblHangHoa th { text-align: center; font-weight: bold; }'
            + '#' + divId + ' h1, #' + divId + ' h2 { font-size: 13pt; margin: 0.08cm 0; text-align: center; text-transform: uppercase; font-weight: bold; }'
            + '#' + divId + ' h3, #' + divId + ' h4 { font-size: 10.5pt; margin: 0.06cm 0; text-align: center; text-transform: uppercase; font-weight: bold; }'
            + '#' + divId + ' p { line-height: 1.55; margin: 0.04cm 0; font-size: 10pt; }'
            + '#' + divId + ' [class*="txtHoTen_BenB_"], #' + divId + ' [class*="txtMa_BenB_"], #' + divId + ' [class*="txtNgaySinh_BenB_"], #' + divId + ' [class*="txtMaSoThue"] { display: inline; white-space: nowrap; margin: 0; padding: 0; font-weight: bold; }'
            + '#' + divId + ' [class*="txtLop_BenB_"], #' + divId + ' [class*="txtNganh_BenB_"], #' + divId + ' [class*="txtKhoa_BenB_"] { display: inline; word-break: keep-all; margin: 0; padding: 0; }'
            + '#' + divId + ' [class*="txtTongTien"] { font-weight: bold; }'
            + '#' + divId + ' select { border: none; background: transparent; -webkit-appearance: none; -moz-appearance: none; appearance: none; padding: 0; font-family: inherit; font-size: inherit; color: #000; }'
            + 'table, tr, td, th { page-break-inside: avoid; }'
            + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }';

        // Script inline: detect bảng hàng hóa + dọn <br> đầu template
        var scriptDetect = ''
            + '<script>'
            + '(function() {'
            /* (0) Dọn <br> ở đầu — bỏ khoảng trắng dòng đầu */
            + '  var mauIn = document.getElementById("' + divId + '");'
            + '  if (mauIn) {'
            + '    while (mauIn.firstChild) {'
            + '      var f = mauIn.firstChild;'
            + '      if (f.nodeType === 3 && !(f.textContent || "").trim()) { mauIn.removeChild(f); continue; }'
            + '      if (f.nodeName === "BR") { mauIn.removeChild(f); continue; }'
            + '      break;'
            + '    }'
            + '  }'
            /* (1) Tag bảng hàng hóa/khoản thu — có <th> header hoặc >= 3 cột + text keyword */
            + '  var tables = document.querySelectorAll("#' + divId + ' table");'
            + '  for (var i = 0; i < tables.length; i++) {'
            + '    var t = tables[i];'
            + '    var probe = ((t.textContent || "").substring(0, 500)).toLowerCase();'
            + '    var matchText = /hàng hóa|dịch vụ|khoản thu|thành tiền|đơn giá|số lượng|số tiền|tt|stt/i.test(probe);'
            + '    var hasTH = t.querySelectorAll("th").length >= 2;'
            + '    var firstRow = t.rows && t.rows[0];'
            + '    var nCols = firstRow ? firstRow.cells.length : 0;'
            + '    if (matchText && (hasTH || nCols >= 3)) {'
            + '      t.className = (t.className || "") + " tblHangHoa";'
            + '    }'
            + '  }'
            /* (2) Xóa <br> ngay trước value SV (label + value cùng dòng) */
            + '  var valSel = \'[class*="txtHoTen_BenB_"],[class*="txtMa_BenB_"],[class*="txtNgaySinh_BenB_"],[class*="txtDiaChi_BenB_"],[class*="txtLop_BenB_"],[class*="txtNganh_BenB_"],[class*="txtKhoa_BenB_"],[class*="txtMaSoThue_BenB_"]\';'
            + '  var vals = document.querySelectorAll("#' + divId + ' " + valSel);'
            + '  vals.forEach(function(el) {'
            + '    var p = el.previousSibling;'
            + '    while (p && p.nodeType === 3 && !(p.textContent || "").trim()) { p = p.previousSibling; }'
            + '    if (p && p.nodeName === "BR") { p.parentNode.removeChild(p); }'
            + '  });'
            + '})();'
            + '<\/script>';

        w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>In chứng từ</title>');
        w.document.write('<style>' + css + '</style>');
        w.document.write('</head><body><div id="' + divId + '">' + content + '</div>');
        w.document.write(scriptDetect);
        w.document.write('</body></html>');
        w.document.close();
        w.focus();
        if (autoPrint) {
            setTimeout(function () {
                try { w.print(); } catch (e) { console.log('Print error:', e); }
                setTimeout(function () {
                    try { w.close(); } catch (e) { }
                }, 500);
            }, 400);
        }
        return true;
    },
    closePhieu: function () {
        var me = this;
        $("#zoneChungTu").slideUp('slow');
        $("#zoneTimKiemDoiTuong").slideDown('slow');
        $("#zoneThongTinDoiTuong").slideDown('slow');
        $("#zoneKhoan_ChiTiet").slideUp();
        $("#top_notifications_PhieuThu").hide();
        $("#btnIn_ChungTu").show();
        $("#btnHuy_ChungTu").show();
        $("#btnSave_ChungTu").replaceWith('');
        me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab1");
        $(".btnXuat_HDDT").remove();
    },
    //check_UserTaoPhieu(data) {
    //    if(typeof(data))
    //    if(edu.system.userId == data[0].)
    //},
    countCheckTable: function (strTable_Id) {
        var iCountCheck = 0;
        var x = $('#' + strTable_Id + ' tbody tr td input[type="checkbox"]');
        for (var i = 0; i < x.length; i++) {
            if (x[i].checked == true) {
                iCountCheck++;
            }
        }
        return iCountCheck;
    },
    changeWidthPrint: function () {
        //Thay đổi vùng in
        var lMauIn_ChungTu = document.getElementById("MauIn_ChungTu").offsetWidth;
        if (lMauIn_ChungTu > 700) lMauIn_ChungTu += 240;
        else {
            lMauIn_ChungTu = 1250;
        }
        var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        // COMMENT: đoạn set inline style dưới đây ép #zoneActionChungTu thành float:left / position:fixed
        // → phá layout flex của #zoneActionChungTu (5 nút không xếp 1 hàng, nút phân tán khắp trang).
        // CSS scoped `#zoneActionChungTu { display:flex; width:100% }` trong chungtu.html đã lo layout đúng,
        // giữ padding-left cho #zoneChungTu để center hóa đơn preview. Giữ code cũ dạng comment để mở lại nếu cần.
        if (lMainPrint > lMauIn_ChungTu) {
            document.getElementById('zoneChungTu').style.paddingLeft = (lMainPrint - lMauIn_ChungTu) / 2 + "px";
            // document.getElementById('zoneActionChungTu').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneChungTu').style.paddingLeft = "20px";
            // document.getElementById('zoneActionChungTu').style = "position: fixed; right: 10px !important";
        }
        edu.extend.genChonLien("MauIn_ChungTu", "zoneLienHoaDon");
    }
}