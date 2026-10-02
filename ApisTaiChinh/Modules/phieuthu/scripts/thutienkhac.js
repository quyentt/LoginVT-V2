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
function PhieuThuKhac() { };
PhieuThuKhac.prototype = {
    strPhieuThu_Id: '',
    objHTML_HDBL: {},
    dt_ThuChung: null,
    dt_ThuRieng: null,
    dt_DuChung: null,
    dt_DuRieng: null,
    dt_HS: '',
    dtKhoanDaNop: [],
    dtKhoanPhaiNop: [],
    dt_DoiTuongThu: '',
    dt_TTDoiTuong: '',
    strHSSV_Id: '',
    strKhoanThu_Id: '',
    bActiveRutTien: false,
    tabActive: 1,
    dtLoaiPhanBo: [],

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
        //me.getList_HSSV_Test();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.getList_HSSV();
        me.getList_DMLKT();
        $(".btnClose").click(function () {
            if (me.tabActive == 1) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab1");
            }
            else if (me.tabActive == 2) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab2");
            }
            else if (me.tabActive == 3) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab3");
            }
            else if (me.tabActive == 4) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab4");
            }
            else if (me.tabActive == 5) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab5");
            }
            else if (me.tabActive == 6) {
                me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab6");
            }
        });
        
        /*------------------------------------------
        --Discription: Initial obj HoaDonBienLai
        -------------------------------------------*/
        me.objHTML_HDBL = {
            table_id: "tbldata_KhoanNoChung_HDBL",
            prefix_id: "chkSelect_HDBL",
            regexp: /chkSelect_HDBL/g,
            chkOne: "chkSelectOne_HDBL",
            btn_edit: "btnEditRole_HDBL",
            btn_save_id: "btnSave",
            btn_save_tl: "Lưu",
        };
        /*------------------------------------------
        --Discription: Action HoSo_SinhVien
        -------------------------------------------*/
        me.getList_NutHDDT();
        //Remove dropdown trên thanh tìm kiếm sinh viên
        $("#btnSearch").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_HSSV();
            $("#zoneTimKiemSinhVien .dropdown").removeClass('open');
            $("#advancedSearch").attr('aria-expanded', 'false');
        });
        //Đây là nút nho nhỏ hiển thị khi focus vào txtTuKhoa_Search
        $("#btnSeachSinhVien").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.getList_HSSV();
        });
        $("#txtTuKhoa_Search").keypress(function (e) {
            e.stopImmediatePropagation();
            if (e.which == 13) {
                e.preventDefault();
                me.getList_HSSV();
            }
        });
        $('#txtTuKhoa_Search').focus();
        $("#MainContent").delegate('.detail_HoSo_PhieuThu', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_HSDoiTuong(id, point);
        });
        $("#MainContent").delegate('.detail_HoSo_PhieuThu', 'click', function (e) {
            e.stopImmediatePropagation();
            me.active_DoiTuong(this.id);
            me.showFormPhieuThu();
            //edu.system.switchTab('tab_1');
        });
        $("#MainContent").delegate('.ckbLKT_HDBL', 'click', function (e) {
            e.stopImmediatePropagation();
            var strThoiGianDaoTao = edu.util.getValById('dropSearch_HocKy_HDBL');
            if (!edu.util.checkValue(strThoiGianDaoTao)) {
                this.checked = false;
                edu.system.alert('Vui lòng chọn học kỳ trước khi thao tác!', 'w');
                return;
            }
            var strThoiGianDaoTao_Name = $("#dropSearch_HocKy_HDBL option:selected").text();
            var id = this.id.replace(/ckbLKT_HDBL/g, '');
            var strKhoanThu_Name = this.title;
            var stt= document.getElementById("tbldata_NopTruoc_HDBL").getElementsByTagName('tbody')[0].rows.length + 1;
            if (this.checked) {
                var row = '';
                row +='<tr id="'+ id +'" class="tr-bg">';
                row += '<td>' + stt + '</td>';
                row += '<td>' + strThoiGianDaoTao_Name + '</td>';
                row += '<td></td>';
                row += '<td>' + strKhoanThu_Name + '</td>';
                row += '<td><input id="txtNoiDung' + id + '" style="width: 100%; text-align: left"></td>';
                row += '<td>';
                row += '<input id="txtSoluong' + id + '" class="inputsoluong"  value="1" style="width: 50px" />';
                row += '</td>';
                row +='<td>';
                row +='<input id="txtTongTien'+ id +'" class="inputsotien" value="0" style="width: 150px" />';
                row +='</td>';
                row +='<td>';
                row += '<input id="' + id + '" name="' + strThoiGianDaoTao + '"  class="checkboxtien" title="null" checked="checked" type="checkbox" />';
                row += '</td>';
                row += '<td>';
                row += '<input type="checkbox" checked="checked" />';
                row += '</td>';
                row += '</tr>';
                $("#tbldata_NopTruoc_HDBL tbody").append(row);
                $("#tab_6").show();
            } else {
                //$("#tbldata_NopTruoc_HDBL tbody #" + id).replaceWith('');
            }
            //edu.system.switchTab('tab_1');
        });
        $("#MainContent").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id
            var xCheck = me.dtNutHDDT.find(e => e.ID === strId);
            if (xCheck && xCheck.THONGTIN4) edu.system.objApi["HDDT"] = xCheck.THONGTIN4;
            var strLinkAPI = edu.system.strhost + edu.system.objApi["HDDT"].replace(/api/g, ''); //$(this).attr("name");
            var strPhuongThucNhap = $(this).attr("name");
            var strPhuongThuc_Ma = $(this).attr("title");
            if (strPhuongThuc_Ma.indexOf("HDDTNHAP") == 0) {
                me.save_ThuTien('tbldataPhieuThuPopup_PT_Edit', 0, strLinkAPI, strPhuongThuc_Ma, strPhuongThucNhap);
            } else {
                edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', 'w');
                $("#btnYes").click(function (e) {
                    $('#myModalAlert').modal('hide');
                    me.save_ThuTien('tbldataPhieuThuPopup_PT_Edit', 0, strLinkAPI, strPhuongThuc_Ma);
                });
            }
        });
        //Đóng toàn bộ thông tin đối tượng thu
        $(".btnClose_HSSV").click(function () {
            $("#zoneThongTinHSSV").slideUp();
            //$("#zoneThongTinMacDinh").slideDown('slow');
            //Xoa hien thi NCS
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            });
            me.reset_DoiTuong();
            $("#tblHienThiDoiTuong").html("Thêm mới đối tượng xuất hóa đơn");
            $("#btnUpdate_DoiTuongThu").hide();
            $("#btnSave_delete").hide();
            $("#btnSave_DoiTuongThu").show();
            edu.util.viewValById("txtHoTenDT", "");
            edu.util.viewValById("txtMaDT", "");
            edu.util.viewValById("txtSoDienThoaiDT", "");
            edu.util.viewValById("txtEmailDT", "");
            edu.util.viewValById("txtDiaChiDT", "");
            edu.util.viewValById("txtMaSoThueDT", "");
            edu.util.viewValById("txtMaSoThueCQ", "");
            edu.util.viewValById("dropDangHocVien", "");
            edu.util.viewValById("txtCoQuanDT", "");
            edu.util.viewValById("dropLopHocVien", "");
            edu.util.viewValById("txtDiaCoQuanDT", "");
            edu.util.viewValById("txtSoTaiKhoan", "");
            edu.util.viewValById("dropThuocNganHang", "");
            edu.util.viewValById("txtChiNhanh", "");
            edu.util.viewValById("txtCCCD", "");
            edu.util.viewValById("txtMaQNHS", "");
            me.strHSSV_Id = "";
            $("#zoneThemDoiTuongXuatHoaDon").slideDown();
        });
        /*------------------------------------------
        --Discription: [6]. Action BienLaiHoaDon (BLHD)
        -------------------------------------------*/
        $("#btnAddnew_KhoanNoChung_BLHD").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanNoChung_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai('tbldata_KhoanNoChung_HDBL', true);
        });
        $("#btnAddnew_KhoanNoRieng_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanNoRieng_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai('tbldata_KhoanNoRieng_HDBL', true);
        });
        $("#btnAddnew_KhoanThuaChung_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanThuaChung_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai('tbldata_KhoanThuaChung_HDBL', false);
        });
        $("#btnAddnew_KhoanThuaRieng_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanThuaRieng_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai('tbldata_KhoanThuaRieng_HDBL', false);
        });
        $("#btnAddnew_NopTruoc_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            //if (me.countCheckTable('tbldata_NopTruoc_HDBL') == 0) {
            //    edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
            //    return;
            //}
            me.genHTML_NoiDung_BienLai_DongTruoc('tbldata_NopTruoc_HDBL', true);
        });

        $("#btnAddnew_RutTien_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_NopTruoc_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai_DongTruoc('tbldata_NopTruoc_HDBL', false);
        });
        $("#btnAddnew_ThuHo_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            //if (me.countCheckTable('tbldata_ThuHo_HDBL') == 0) {
            //    edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
            //    return;
            //}
            me.genHTML_NoiDung_BienLai('tbldata_ThuHo_HDBL', true);
        });
        //Khi thay đổi giá trị tiền trong hóa đơn thì sẽ cập nhật lại thông tin tổng tiền hiển thị lại tổng tiền
        $("#tbldata_KhoanNoChung_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tbldata_KhoanNoChung_HDBL");
        });
        $("#tbldata_KhoanNoRieng_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tbldata_KhoanNoRieng_HDBL");
        });
        $("#tbldata_KhoanThuaChung_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, true);
            if (!check) return;
            me.show_TongTien('tbldata_KhoanThuaChung_HDBL');
        });
        $("#tbldata_KhoanThuaRieng_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, true);
            if (!check) return;
            me.show_TongTien('tbldata_KhoanThuaRieng_HDBL');
        });
        $("#tbldata_NopTruoc_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            //var check = edu.system.checkSoTienInput(this, false);
            //if (!check) return;
            me.show_TongTien("tbldata_NopTruoc_HDBL");
        });
        $("#tbldata_ThuHo_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tbldata_ThuHo_HDBL");
        });
        //check all table
        $("[id$=chkSelectAll_KhoanNoChung_BLHD]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_HDBL);
        });
        $("[id$=chkSelectAll_KhoanNoRieng_HDBL]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_KhoanNoRieng_HDBL" });
        });
        $("[id$=chkSelectAll_KhoanThuaChung_HDBL]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_KhoanThuaChung_HDBL" });
        });
        $("[id$=chkSelectAll_KhoanThuaRieng_HDBL]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_KhoanThuaRieng_HDBL" });
        });
        $("[id$=chkSelectAll_NopTruoc_HDBL]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_NopTruoc_HDBL" });
        });
        $("[id$=chkSelectAll_ThuHo_BLHD]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_ThuHo_HDBL" });
        });
        /*------------------------------------------
        --Discription: Action xxx 
        -------------------------------------------*/
        //Lưu lựa chọn là thông tin phiếu thu hoặc rút
        //Hiện thị vùng hóa đơn
        //Hiển thị xem hóa đơn
        //Lấy thông tin phiếu
        //Hiển thị nút in
        $("#zoneThongTinHSSV").delegate('.detail_KhoanThu', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = false;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThuKhac.changeWidthPrint);
        });
        $("#zoneThongTinHSSV").delegate('.detail_KhoanRut', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", main_doc.PhieuThuKhac.genHTML_PhieuRut);
        });
        $("#zoneThongTinHSSV").delegate('.detail_PhieuHoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.PhieuThuKhac.changeWidthPrint);
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
            var strZonesecond = '';
            $(".zoneThongTinBoSung").slideUp();
            $("#" + strZoneId).slideDown('slow');
            if (strZoneId == "zoneThongTinBoSungTab6") me.tabActive = 6;
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
        me.eventTongTien("tbldata_KhoanNoChung_HDBL");
        me.eventTongTien("tbldata_KhoanNoRieng_HDBL");
        me.eventTongTien("tbldata_KhoanThuaChung_HDBL");
        me.eventTongTien("tbldata_KhoanThuaRieng_HDBL");
        me.eventTongTien("tbldata_NopTruoc_HDBL");
        me.eventTongTien("tbldata_ThuHo_HDBL");
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_TrangThaiSV();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.DHV", "dropDangHocVien", "Chọn dạng học viên");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TNH", "dropThuocNganHang");
        $("#btnIn_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnHuy_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn hủy biên lai không!', 'w');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_BL(me.strPhieuThu_Id);
            });
            return false;
        });
        $("#MainContent").delegate("#btnThuTien", "click", function (e) {
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn thu tiền không!', 'w');
            $("#btnYes").click(function (e) {
                //$('#myModalAlert').modal('hide');
                $('#myModalAlert #alert_content').html("");
                me.save_ThuTien('tbldataPhieuThuPopup_PT_Edit');
            });
        });
        //Đóng hóa đơn sửa hoặc hóa đơn in
        $("#btnClose_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            me.closePhieu();
        });
        setTimeout(function () {
            $('#dropSearch_HeDaoTao_PT').on('change', function (e) {
                me.getList_KhoaDaoTao();
            });
            $('#dropSearch_KhoaDaoTao_PT').on('change', function (e) {
                me.getList_ChuongTrinhDaoTao();
                me.getList_LopQuanLy();
            });
            $('#dropSearch_ChuongTrinh_PT').on('change', function (e) {
                me.getList_LopQuanLy();
            });
            $('#dropSearch_HocKy_HDBL').on('change', function (e) {
                var id = $("#dropSearch_HocKy_HDBL").val();
                if (id == "") {
                    $("#zoneDSKhoanThu").hide();
                } else {
                    localStorage.setItem("strHocKy_Id", id);
                    $("#zoneDSKhoanThu").show();
                }
            });
        }, 2000);
        //
        me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_HDBL_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_HDBL").each(function () {
                this.checked = checked_status;
            });
        });
        //Hóa đơn khác
        $("#MainContent").delegate('.btnEditHoSo', 'click', function (e) {
            e.stopImmediatePropagation();
            var strDoiTuongThu_Id = this.id;
            $(".beforeActive").slideUp();
            $("#zoneThemDoiTuongXuatHoaDon").slideDown();
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            })
            var point = $("#tbldata_HSSV tbody tr[id='" + strDoiTuongThu_Id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 100);
            }
            me.strHSSV_Id = strDoiTuongThu_Id;
            $("#tblHienThiDoiTuong").html("Sửa đối tượng thu");
            $("#btnUpdate_DoiTuongThu").show();
            $("#btnSave_delete").show();
            $("#btnSave_DoiTuongThu").hide();
            me.getDetail_DoiTuongThu_Edit(strDoiTuongThu_Id);
        });
        $("#MainContent").delegate('.btnEditHoSo', 'click', function (e) {
            e.stopImmediatePropagation();
            var strDoiTuongThu_Id = this.id;
            $(".beforeActive").slideUp();
            $("#zoneThemDoiTuongXuatHoaDon").slideDown();
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            })
            var point = $("#tbldata_HSSV tbody tr[id='" + strDoiTuongThu_Id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 100);
            }
            me.strHSSV_Id = strDoiTuongThu_Id;
            $("#tblHienThiDoiTuong").html("Sửa đối tượng thu");
            $("#btnUpdate_DoiTuongThu").show();
            $("#btnSave_delete").show();
            $("#btnSave_DoiTuongThu").hide();
            me.getDetail_DoiTuongThu_Edit(strDoiTuongThu_Id);
        });
        $("#btnSave_delete").click(function (e) {
            me.delete_DoiTuongThu();
        });
        $("#MainContent").delegate('#btnSave_DoiTuongThu', 'click', function (e) {
            me.save_DoiTuongThu();
        });
        $("#MainContent").delegate('#btnUpdate_DoiTuongThu', 'click', function (e) {
            me.save_DoiTuongThu();
        });


        $('#dropSearch_LoaiTinh_HDBL').on('select2:select', function () {
            var id = $("#dropSearch_LoaiTinh_HDBL").val();
            localStorage.setItem("strLoaiTinh_Id", id);
            switch (id) {
                case "DONGIARATIEN": $("#lblLoaiTinh").html("Số tiền"); break;
                case "TIENRADONGIA": $("#lblLoaiTinh").html("Thành tiền"); break;
            }
        });
        var strLoaiTinh_Id = localStorage.getItem("strLoaiTinh_Id");
        $('#dropSearch_LoaiTinh_HDBL').val(strLoaiTinh_Id).trigger("change");
        switch (strLoaiTinh_Id) {
            case "DONGIARATIEN": $("#lblLoaiTinh").html("Số tiền"); break;
            case "TIENRADONGIA": $("#lblLoaiTinh").html("Thành tiền"); break;
        }

        $("#tblChiTietKhoan").delegate(".btnEditDaNop", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Id = strId;
                $("#zonePhanBo").slideUp();
                me.viewForm_KhoanDaNop(edu.util.objGetDataInData(strId, me.dtKhoanDaNop, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KhoanDaThu").click(function () {
            $('#myModalKhoanDaNop').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanDaNop(me.strKhoanThu_Id);
            });
        });
        $("#btnSave_KhoanDaThu").click(function () {
            me.save_KhoanDaNop();
        });


        $("#tblChiTietKhoan").delegate(".btnEditPhaiNop", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Id = strId;
                me.viewForm_KhoanPhaiNop(edu.util.objGetDataInData(strId, me.dtKhoanPhaiNop, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KhoanPhaiNop").click(function () {
            $('#myModalKhoanPhaiNop').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanPhaiNop(me.strKhoanThu_Id);
            });
        });
        $("#btnSave_KhoanPhaiNop").click(function () {
            me.save_KhoanPhaiNop();
        });
        edu.system.getList_MauImport("zoneBaoCao_TT", function (addKeyValue) {
            var obj_list = {
                'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_PT'),
                'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_PT'),
                'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_PT'),
                'strLopHoc_Id': edu.util.getValById('dropSearch_Lop_PT'),
                'strTuKhoa': edu.util.getValById('txtTuKhoa_Search').trim(),
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_HDBL').toString(),
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropDaNop_HinhThucThu");


        $("#btnPhanBo").click(function () {
            $("#zonePhanBo").slideDown();
            me.getList_HopDong();
        });

        $('#dropHopDong').on('select2:select', function () {
            me.getList_LoaiPhanBo();
        });

        $("#btnSave_PhanBo").click(function () {
            me.dtLoaiPhanBo.forEach(e => {
                me.save_LoaiPhanBo(e.QLSV_NGUOIHOC_ID);
            });
        });
        
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.HOPDONG.PHANLOAI", "dropSearch_PhamVi");
        $('#dropSearch_PhamVi').on('select2:select', function () {
            var value = $('#dropSearch_PhamVi').val().toLowerCase();
            $("#tblPhanBo tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }).css("color", "red");
        });
        $("#btnApSoTien").click(function () {
            var strSoTien = $("#txtSoTien_PV").val();
            $("#tblPhanBo .apsotien").each(function () {
                if ($(this).is(":visible")) {
                    $(this).val(strSoTien);
                }
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
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao_PT"),
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
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_PT"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_PT"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_PT"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinh_PT"),
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
    genHTML_HDDT: function (data) {
        var me = this;
        me["dtNutHDDT"] = data;
        var defaultIcons = ['fa fa-file-text-o', 'fa fa-cloud-upload', 'fa fa-file-o', 'fa fa-paper-plane', 'fa fa-share-square-o'];
        var row = '';
        for (var i = 0; i < data.length; i++) {
            var iconClass = data[i].THONGTIN1 && data[i].THONGTIN1.trim() ? data[i].THONGTIN1 : defaultIcons[i % defaultIcons.length];
            row += '<div class="btnXuat_HDDT" id="' + data[i].ID + '" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="' + data[i].TEN + '" class="btn" ><i style="' + data[i].THONGTIN3 + '" class="' + iconClass + ' fa-4x"></i></a><a class="color-active bold lbsymbolHD">' + data[i].TEN + '</a></div>';
        }
        me.strHDDT = row;
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
            renderPlace: ["dropSearch_HeDaoTao_PT"],
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
            renderPlace: ["dropSearch_KhoaDaoTao_PT"],
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
            renderPlace: ["dropSearch_ChuongTrinh_PT"],
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
            renderPlace: ["dropSearch_Lop_PT", "dropLopHocVien"],
            type: "",
            title: "Lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var strHocKy_Id = localStorage.getItem("strHocKy_Id");
        if (strHocKy_Id == undefined) strHocKy_Id = "";
        else {
            $("#zoneDSKhoanThu").show();
        }
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: "",
                default_val: strHocKy_Id
            },
            renderPlace: ["dropSearch_HocKy_HDBL", "dropDaNop_ThoiGian", "dropPhaiNop_ThoiGian"],
            type: "",
            title: "Tất cả đợt",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_HDBL_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print;">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_HDBL" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
        //me.getList_KhoanThu();
    },
    /*------------------------------------------
    --Discription: [1] HoSoSinhVien
    --ULR: Modules
    -------------------------------------------*/
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0eBS4oFSAi',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All_DoiTac',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtTuKhoa_Search').trim(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_PT'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_PT'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_PT'),
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop_PT'),
            'strStudyStatus_Ids': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_HDBL').toString(),
            'dIsPrimary': '',
            'dBoQuaPhamVi': 0,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        console.log('%c[thutienkhac.getList_HSSV] >>> REQUEST', 'color:#2196F3;font-weight:bold', obj_list);
        console.log('[thutienkhac.getList_HSSV] action:', obj_list.action);
        console.log('[thutienkhac.getList_HSSV] func  :', obj_list.func);
        console.log('[thutienkhac.getList_HSSV] payload JSON:', JSON.stringify(obj_list, null, 2));

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                console.log('%c[thutienkhac.getList_HSSV] <<< RESPONSE', 'color:#4CAF50;font-weight:bold', data);
                console.log('[thutienkhac.getList_HSSV] Success :', data && data.Success);
                console.log('[thutienkhac.getList_HSSV] Message :', data && data.Message);
                console.log('[thutienkhac.getList_HSSV] Pager   :', data && data.Pager);
                console.log('[thutienkhac.getList_HSSV] Data.len:', data && data.Data ? data.Data.length : 0);
                if (data && data.Data && data.Data.length > 0) {
                    console.log('[thutienkhac.getList_HSSV] Row[0]  :', data.Data[0]);
                    console.log('[thutienkhac.getList_HSSV] Keys[0] :', Object.keys(data.Data[0]));
                }
                if (data.Success) {
                    if (data.Data && data.Data.length) {
                        for (var i = 0; i < data.Data.length; i++) {
                            var r = data.Data[i];
                            r.TENDOITUONG = r.TENDOITUONG || r.FULL_NAME || r.QLSV_NGUOIHOC_TEN || r.TEN || '';
                            r.MASODOITUONG = r.MASODOITUONG || r.MASO || r.MA_NGUOIHOC_CHINH || r.QLSV_NGUOIHOC_MASO || '';
                        }
                    }
                    me.dt_HS = data.Data;
                    me.genTable_HSSV(data.Data, data.Pager);
                    if (edu.util.checkValue(data.Data)) {
                        if (data.Pager == 1) {
                            me.active_DoiTuong(data.Data[0].ID);
                            me.showFormPhieuThu();
                        }
                    }
                }
                else {
                    console.error('[thutienkhac.getList_HSSV] FAIL:', data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                console.error('%c[thutienkhac.getList_HSSV] !!! ERROR', 'color:#F44336;font-weight:bold', er);
                if (er && er.responseText) console.error('[thutienkhac.getList_HSSV] responseText:', er.responseText);
                if (er && er.status) console.error('[thutienkhac.getList_HSSV] status:', er.status, er.statusText);
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
    genTable_HSSV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HSSV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhieuThuKhac.getList_HSSV()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            colPos: {
                left: [1, 2]
            },
            aoColumns: [{
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    var strNhanSu_Avatar = "Upload/Avatar/no-avatar.png";

                    var html = '<span id="sl_hoten' + aData.ID + '">' + edu.util.checkEmpty(aData.TENDOITUONG) + '</span><br />';
                    html += '<span id="sl_ma' + aData.ID + '">' + edu.util.checkEmpty(aData.MASODOITUONG) + '</span>'

                    var hienthi = '<span style="padding-right: 5px !important; float: left"><img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" /></span>';
                    hienthi += html;
                    return '<a>' + hienthi + '</a>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<a class="btn btn-default btn-circle btnEditHoSo" id="' + aData.ID + '" href="#" title="View"><i class="fa fa-edit color-active"></i></a>';
                    return html;
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var x = $("#tbldata_HSSV tbody tr");
        for (var i = 0; i < x.length ; i++) {
            x[i].classList.add("detail_HoSo_PhieuThu");
        }
        if (document.getElementById("light-paginationtbldata_HSSV") != undefined) document.getElementById("light-paginationtbldata_HSSV").style.width = "100%";
        $(".popover").replaceWith('');
        /*III. Callback*/
        //Thêm trigger nhớ xóa
        //me.triggerDoiTuong();
    },

    save_DoiTuongThu: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThongTin_MH/FSkkLB4FLigVNC4vJgopICIP',
            'func': 'pkg_taichinh_thongtin.Them_DoiTuongKhac',
            'iM': edu.system.iM,
            'strTenDoiTuong': edu.util.getValById("txtHoTenDT"),
            'strMaDoiTuong': edu.util.getValById("txtMaDT"),
            'strSoDienThoai': edu.util.getValById("txtSoDienThoaiDT"),
            'strDiaChiEmail': edu.util.getValById("txtEmailDT"),
            'strDiaChiLienLac': edu.util.getValById("txtDiaChiDT"),
            'strCoQuanCongTac': edu.util.getValById("txtCoQuanDT"),
            'strDiaChiCoQuanCongTac': edu.util.getValById("txtDiaCoQuanDT"),
            'strMaSoThueCaNhan': edu.util.getValById("txtMaSoThueDT"),
            'strMaSoThueCoQuan': edu.util.getValById("txtMaSoThueCQ"),
            'strLaHocVien_DoiTuong_Id': edu.util.getValById("dropDangHocVien"),
            'strLaHocVien_Lop_Id': edu.util.getValCombo("dropLopHocVien"),
            'strNganHang_SoTaiKhoan': edu.util.getValById('txtSoTaiKhoan'),
            'strNganHang_ThuocNganHang_Id': edu.util.getValById('dropThuocNganHang'),
            'strNganHang_ThongTinChiNhanh': edu.util.getValById('txtChiNhanh'),
            'strMaQuanHeNganSach': edu.system.getValById('txtMaQNHS'),
            'strCCCD': edu.system.getValById('txtCCCD'),
            'strId': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (me.strHSSV_Id != "") {
            obj_save.action = 'TC_ThongTin_MH/EjQgHgUuKBU0Li8mCikgIgPP';
            obj_save.func = 'pkg_taichinh_thongtin.Sua_DoiTuongKhac';
            obj_save.strId = me.strHSSV_Id;
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strHSSV_Id != "") {
                        edu.extend.notifyBeginLoading("Cập nhật thành công ", "w");
                    }
                    else {
                        edu.extend.notifyBeginLoading("Thêm mới thành công ", "w");
                    }
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
                me.getList_HSSV();
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
    },
    delete_DoiTuongThu: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_DoiTuongKhac/Xoa',
            'versionAPI': 'v1.0',
            'strIds': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.extend.notifyBeginLoading("Xóa đối tượng thu thành công ", "w");
                    me.getList_HSSV();
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
    --Discription: [2] DoiTuong
    --ULR: Modules
    -------------------------------------------*/
    reset_DoiTuong: function () {
        var me = this;
        if (me.strHSSV_Id == '') return;
        me.strHSSV_Id = "";
        var arrId = ["txtTen_Ma_NS_SDT", "lbSoTienDaChon", "txtHoTenPTCEdit", "txtMaNCSPTCEdit", "txtLopPTCEdit", "txtNganhPTCEdit", "txtBacHocPTCEdit", "txtKhoaPTCEdit", "txtDiaChiPTHEdit", "txtMaSoThuePTHEdit", "txtDienThoaiPTHEdit", "txtFaxPTHEdit", "txtSoTaiKhoanPTHEdit", "txtNganHangPTHEdit", "txtMauSoEdit",
                "txtKiHieuPTHEdit", "txtSoPTHEdit", "iNgayPTCEdit", "iThangPTCEdit", "iNamPTCEdit", "txtHoTenPTCEdit", "txtMaNCSPTCEdit", "txtDiaChiPTCEdit", "txtLopPTCEdit"
            , "txtNganhPTCEdit", "txtBacHocPTCEdit", "txtKhoaPTCEdit", "txtMaSoThuePTCEdit", "txtMauSoEdit", "txtSoPTHEdit"];
        var arrTable = ["tbldata_KhoanNoChung_HDBL", "tbldata_KhoanNoRieng_HDBL", "tbldata_KhoanThuaChung_HDBL", "tbldata_KhoanThuaRieng_HDBL", "tbldataPhieuThuPopup"];
        var arrSetRezo = ["txtSoHienThi_PhaiNop", "txtSoHienThi_KhoanDuocMien", "txtSoHienThi_DaNop", "txtSoHienThi_DaRut", "txtSoHienThi_NoRiengTungKhoan", "txtSoHienThi_NoChungCacKhoan", "txtSoHienThi_DuRieng", "txtSoHienThi_DuChung"];
        var arrCheckBox = ["chkSelectAll_KhoanNoChung_BLHD", "chkSelectAll_KhoanNoRieng_HDBL", "chkSelectAll_KhoanThuaChung_HDBL", "chkSelectAll_KhoanThuaRieng_HDBL"];
        var arrInput = ["txtDiaChiPTCEdit", "txtMaSoThuePTCEdit"];
        var dropBox = ["dropHinhThucThuPTC_PT_Edit"];

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

        for (var i = 0; i < arrInput.length; i++) {
            var x = document.getElementById(arrInput[i]);
            if (x == undefined) continue;
            x.value = "";
        }

        for (var i = 0; i < dropBox.length; i++) {
            $("#" + dropBox[i]).val('').trigger('change');
        }

        $(".tong_sotienTab").html(0);
        $(".noco-phieuthu").html('');
    },
    active_DoiTuong: function (strSinhVien_id) {
        //Xóa thông tin đối tượng
        var me = this;
        me.reset_DoiTuong();
        if (edu.util.checkValue(strSinhVien_id) && strSinhVien_id != me.strId) {
            //Ẩn active tất cả các đối tượng
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            })
            //Active sinh viên trong list SV bên trái
            var point = $("#tbldata_HSSV tbody tr[id='" + strSinhVien_id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 200);
            }
        }
        me.strHSSV_Id = strSinhVien_id;
        me.getDetail_DoiTuong(strSinhVien_id);
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
    getDetail_DoiTuongThu_Edit: function (strId) {
        var me = this;
        console.log('%c[getDetail_DoiTuongThu_Edit] >>> START', 'color:#FF9800;font-weight:bold', { strId: strId, dt_HS_len: me.dt_HS && me.dt_HS.length });
        var bFound = false;
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (strId == me.dt_HS[i].ID) {
                bFound = true;
                var row = me.dt_HS[i];
                console.log('[getDetail_DoiTuongThu_Edit] MATCH idx=' + i + ' row=', row);
                console.log('[getDetail_DoiTuongThu_Edit] Field code đang đọc vs value:', {
                    TENDOITUONG: row.TENDOITUONG,
                    MASODOITUONG: row.MASODOITUONG,
                    SODIENTHOAI: row.SODIENTHOAI,
                    DIACHIEMAIL: row.DIACHIEMAIL,
                    DIACHILIENLAC: row.DIACHILIENLAC,
                    COQUANCONGTAC: row.COQUANCONGTAC,
                    DIACHICOQUANCONGTAC: row.DIACHICOQUANCONGTAC,
                    MASOTHUECANHAN: row.MASOTHUECANHAN,
                    MASOTHUECOQUAN: row.MASOTHUECOQUAN,
                    LAHOCVIEN_DOITUONG_ID: row.LAHOCVIEN_DOITUONG_ID,
                    LAHOCVIEN_LOP_ID: row.LAHOCVIEN_LOP_ID,
                    NGANHANG_THONGTINCHINHANH: row.NGANHANG_THONGTINCHINHANH,
                    NGANHANG_THUOCNGANHANG_ID: row.NGANHANG_THUOCNGANHANG_ID,
                    NGANHANG_SOTAIKHOAN: row.NGANHANG_SOTAIKHOAN,
                    CCCD: row.CCCD,
                    MAQUANHENGANSACH: row.MAQUANHENGANSACH
                });
                console.log('[getDetail_DoiTuongThu_Edit] Field API thực có:', {
                    SODIENTHOAI_CANHAN: row.SODIENTHOAI_CANHAN,
                    SODIENTHOAI_GIADINH: row.SODIENTHOAI_GIADINH,
                    EMAIL_CANHAN: row.EMAIL_CANHAN,
                    DINHDANH_CHINH_SO: row.DINHDANH_CHINH_SO,
                    DINHDANH_CHINH_LOAI: row.DINHDANH_CHINH_LOAI
                });

                var strLop = me.dt_HS[i].LAHOCVIEN_LOP_ID;
                if (!strLop) strLop = [""];else
                if (strLop.indexOf(',') !== -1) strLop = me.dt_HS[i].LAHOCVIEN_LOP_ID.split(',');
                edu.util.viewValById("txtHoTenDT", me.dt_HS[i].TENDOITUONG);
                edu.util.viewValById("txtMaDT", me.dt_HS[i].MASODOITUONG);
                edu.util.viewValById("txtSoDienThoaiDT", me.dt_HS[i].SODIENTHOAI);
                edu.util.viewValById("txtEmailDT", me.dt_HS[i].DIACHIEMAIL);
                edu.util.viewValById("txtDiaChiDT", me.dt_HS[i].DIACHILIENLAC);
                edu.util.viewValById("txtCoQuanDT", me.dt_HS[i].COQUANCONGTAC);
                edu.util.viewValById("txtDiaCoQuanDT", me.dt_HS[i].DIACHICOQUANCONGTAC);
                edu.util.viewValById("txtMaSoThueDT", me.dt_HS[i].MASOTHUECANHAN);
                edu.util.viewValById("txtMaSoThueCQ", me.dt_HS[i].MASOTHUECOQUAN);
                edu.util.viewValById("dropDangHocVien", me.dt_HS[i].LAHOCVIEN_DOITUONG_ID);
                edu.util.viewValById("dropLopHocVien", strLop);
                edu.util.viewValById("txtChiNhanh", me.dt_HS[i].NGANHANG_THONGTINCHINHANH);
                edu.util.viewValById("dropThuocNganHang", me.dt_HS[i].NGANHANG_THUOCNGANHANG_ID);
                edu.util.viewValById("txtSoTaiKhoan", me.dt_HS[i].NGANHANG_SOTAIKHOAN);
                edu.util.viewValById("txtCCCD", me.dt_HS[i].CCCD);
                edu.util.viewValById("txtMaQNHS", me.dt_HS[i].MAQUANHENGANSACH);

                setTimeout(function () {
                    console.log('[getDetail_DoiTuongThu_Edit] Giá trị INPUT sau khi set:', {
                        txtHoTenDT: $('#txtHoTenDT').val(),
                        txtMaDT: $('#txtMaDT').val(),
                        txtSoDienThoaiDT: $('#txtSoDienThoaiDT').val(),
                        txtEmailDT: $('#txtEmailDT').val(),
                        txtDiaChiDT: $('#txtDiaChiDT').val(),
                        txtCoQuanDT: $('#txtCoQuanDT').val(),
                        txtDiaCoQuanDT: $('#txtDiaCoQuanDT').val(),
                        txtMaSoThueDT: $('#txtMaSoThueDT').val(),
                        txtMaSoThueCQ: $('#txtMaSoThueCQ').val(),
                        txtChiNhanh: $('#txtChiNhanh').val(),
                        txtSoTaiKhoan: $('#txtSoTaiKhoan').val(),
                        txtCCCD: $('#txtCCCD').val(),
                        txtMaQNHS: $('#txtMaQNHS').val()
                    });
                }, 50);
            }
        }
        if (!bFound) console.warn('[getDetail_DoiTuongThu_Edit] KHÔNG tìm thấy row có ID = ' + strId + ' trong dt_HS');
        console.log('%c[getDetail_DoiTuongThu_Edit] <<< END', 'color:#FF9800;font-weight:bold');
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
        row += '<div style="width: 550px">';
        row += '<div style="width: 200px; float: left">';
        row += '<img style="margin: 0 auto; display: block" src="' + edu.system.getRootPathImg(data.ANH) + '">';
        row += '</div>';
        row += '<div style="width: 330px; float: left; padding-left: 20px; margin-top: -7px">';
        row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.MASO) + '</p>';
        row += '<p class="pcard"><i class="fa fa-users colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Lớp</span>: ' + edu.util.checkEmpty(data.DAOTAO_LOPQUANLY_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-sitemap colorcard"></i> <span class="lang" key="">Ngành</span>: ' + edu.util.checkEmpty(data.NGANHHOC_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-envelope-o colorcard"></i> <span class="lang" key="">Địa chỉ</span>: ' + edu.util.checkEmpty(data.TTLL_KHICANBAOTINCHOAI_ODAU) + '</p>';
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
        var strHoTen = edu.util.checkEmpty(data.TENDOITUONG);
        var strMa = data.MASODOITUONG
        //var strSoDienThoai = data.TTLL_DIENTHOAICANHAN;
        var strHienThi = '<span class="bold">' + strHoTen.toUpperCase() + '</span>';

        if (edu.util.checkValue(strMa)) strHienThi += " - " + strMa;
        //if (edu.util.checkValue(strSoDienThoai)) strHienThi += " - " + strSoDienThoai;

        $("#txtTen_Ma_NS_SDT").html(strHienThi);

        //????????????????????????????????????????????????????
        $("#txtHoTenPTCEdit").html(strHoTen);
        $("#txtMaNCSPTCEdit").html(strMa);
        //????????????????????????????????????????????????????

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
                icon = 'fa-snowflake-o';
                displayTinhTrang(colorLable, icon);
                break;
        }
        function displayTinhTrang(colorLable, icon) {
            strTrangThaiHienThi = '<a id="txtTinhTrang" class="label ' + colorLable + ' trangthaiHS" title="' + strTrangThai_Ten + '"><i class="fa ' + icon + '"></i> ' + strTrangThai_Ten + '</a>';
        }
        //$("#txtTinhTrang").replaceWith(strTrangThaiHienThi);

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
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguonDuLieu_Id': ''
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinhTrangTaiChinh(data.Data.rsPhaiNopTongHopChung, "tbldata_KhoanNoChung_HDBL");
                    me.genTable_TinhTrangTaiChinh(data.Data.rsPhaiNopRieng, "tbldata_KhoanNoRieng_HDBL");
                    me.genTable_TinhTrangTaiChinh(data.Data.rsDuThuaChung, "tbldata_KhoanThuaChung_HDBL");
                    me.genTable_TinhTrangTaiChinh(data.Data.rsDuThuaRieng, "tbldata_KhoanThuaRieng_HDBL");
                    me.genTable_TinhTrangTaiChinh(data.Data.rsKhoanPhaiNop_ThuHo, "tbldata_ThuHo_HDBL");

                    me.genHTML_TongCacKhoanThu(data.Data.rsThongTin[0]);

                    //me.dt_ThuRieng = data.Data.rsPhaiNopRieng;
                    //me.dt_ThuChung = data.Data.rsPhaiNopTongHopChung;
                    //me.dt_DuRieng = data.Data.rsDuThuaRieng;
                    //me.dt_DuChung = data.Data.rsDuThuaChung;
                    //me.dt_DoiTuongThu = data.Data.rsThongTin[0];

                    if (data.Data.rsPhaiNopTongHopChung != null && data.Data.rsPhaiNopTongHopChung.length > 0) {
                        edu.system.switchTab("tab_2");
                        me.tabActive = 2;
                        me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab2");
                        me.quickSelectAll_Phieu('tbldata_KhoanNoChung_HDBL');
                    }
                    else {
                        if (data.Data.rsKhoanPhaiNop_ThuHo != null && data.Data.rsKhoanPhaiNop_ThuHo.length > 0) {
                            edu.system.switchTab("tab_7");
                            me.tabActive = 7;
                            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab7");
                            me.quickSelectAll_Phieu('tbldata_ThuHo_HDBL');
                        }
                    }

                    me.genTable_TheoDot(data.Data.rsDotCongNo, data.Data.rsTongHopNoTheoDot, data.Data.rsTongHopDuTheoDot);
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
                        return '<input id="txtNoiDungHD' + aData.TAICHINH_CACKHOANTHU_ID + '" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" class="inputnoidung" style="width: 100%" />';
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
            row += '<div id="key_'+ dataDot[i].ID +'" class="box-header with-border btnGetData">';
            row += '<h3 class="box-title">';
            row += '<a data-toggle="collapse" data-parent="#key_' + dataDot[i].ID + '" href="#qt_' + dataDot[i].ID +'" aria-expanded="true" class="collapsed">';
            row += '<span class="lang" key=""> Đợt ' + dataDot[i].TENDOT +'</span>';
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
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongNo) +'</td></tr></tfoot>';
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
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongDu) +'</td></tr></tfoot>';
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
            switch ($("#dropSearch_LoaiTinh_HDBL").val()) {
                case "TIENRADONGIA": var sum = edu.system.countFloat(strTableId, 6, 7); break;
                default : var sum = edu.system.countFloat(strTableId, 6, 7, 5); break;
            }
            
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
                    me.cbGenCombo_KhoanThu(data);
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
    cbGenCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropDaNop_KhoanThu", "dropPhaiNop_KhoanThu"],
            type: "",
            title: "Chọn khoản thu"
        }
        edu.system.loadToCombo_data(obj);

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
    save_KhoanPhaiNop: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KhoanPhaiNop/CapNhat',

            'strId': me.strKhoanThu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strPhaiNop_SoTien'),
            'strNoiDung': edu.util.getValById('strPhaiNop_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropPhaiNop_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropPhaiNop_KhoanThu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "i",
                        content: "Cập nhật thành công!",
                    };
                    edu.system.alertOnModal(obj_notify);
                    me.getList_KhoanPhaiNop();
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
    delete_KhoanPhaiNop: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanPhaiNop/Xoa',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_KhoanPhaiNop();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoanPhaiNop: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanPhaiNop',
            'versionAPI': 'v1.0',
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
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    save_KhoanDaNop: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KhoanDaNop/CapNhat',

            'strId': me.strKhoanThu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strDaNop_SoTien'),
            'strNgayTao': edu.util.getValById('strDaNop_NgayTao'),
            'dCoCapNhatChoChungTu': 1,
            'strNoiDung': edu.util.getValById('strDaNop_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropDaNop_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropDaNop_KhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropDaNop_HinhThucThu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "i",
                        content: "Cập nhật thành công!",
                    };
                    edu.system.alertOnModal(obj_notify);
                    me.getList_KhoanDaNop();
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
    delete_KhoanDaNop: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanDaNop/Xoa',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_KhoanDaNop();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoanDaNop: function () {
        var me = this;
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
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
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
        me.dtKhoanPhaiNop = data;
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
        thead += '<th class="td-center td-fixed">Sửa</th>';
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditPhaiNop" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        me.dtKhoanDaNop = data;
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
        thead += '<th class="td-center td-fixed">Sửa</th>';
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDaNop" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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

    viewForm_KhoanDaNop: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanDaNop').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropDaNop_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDaNop_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strDaNop_SoTien", data.SOTIEN);
        edu.util.viewValById("strDaNop_NgayTao", data.NGAYTAO_DD_MM_YYYY);
        edu.util.viewValById("strDaNop_NoiDung", data.NOIDUNG);
        edu.util.viewValById("dropDaNop_HinhThucThu", data.HINHTHUCTHU_ID);
    },
    viewForm_KhoanPhaiNop: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanPhaiNop').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropPhaiNop_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropPhaiNop_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strPhaiNop_SoTien", data.SOTIEN);
        edu.util.viewValById("strPhaiNop_NoiDung", data.NOIDUNG);
    },
    /*------------------------------------------
    --Discription: [6] ACCESS DB ==>HoaDonBienLai
    --ULR: Modules
    -------------------------------------------*/
    save_HDBL: function (strTable_id, bThu) {
        var me = this;
        //
        //
        var strIds = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoLuong = "";
        var strDonGia = "";
        var strSoTien = "";
        var strLoaiTienTe = $("#dropLoaiTienTePTC_PT_Edit").val();
        var strDonViTinh = $("#dropDonViTinhPTC_PT_Edit").val();
        var arrLoaiTienTe = [];
        var arrDonViTinh = [];
        var arrDonViTinhTen = [];
        var arrCanDoiKhoanPhaiNop = [];
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
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML.replace(/&amp;/g, '&') + "#";
            strSoLuong += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            console.log(x[i].cells[6].innerHTML);
            strSoTien += getSoTien(x[i].cells[6].innerHTML, 0) + ",";
            arrLoaiTienTe.push(strLoaiTienTe);
            arrDonViTinh.push(strDonViTinh);
            if (x[i].cells[7] != undefined) arrCanDoiKhoanPhaiNop.push(x[i].cells[7].innerHTML);
        }
        if (strSoTien == 0) {
            edu.extend.notifyBeginLoading('Tổng các khoản chọn phải lớn 0!', 'w');
            $("#zoneBienLaiHoaDon").slideUp('slow');
            $("#zoneTimKiemSinhVien").slideDown('slow');
            $("#zoneThongTinHSSV").slideDown('slow');
            return;
        }
        //
        strIds = strIds.substr(0, strIds.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoLuong = strSoLuong.substr(0, strSoLuong.length - 1);
        strDonGia = strDonGia.substr(0, strDonGia.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        //Nếu chuyển qua lại giữa phiếu thu và phiếu rút
        if (bThu == true) {
            save_PhieuThu(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoLuong, strDonGia, strSoTien);
        }
        else {
            save_PhieuRut(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoLuong, strDonGia, strSoTien);
        }

        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save_PhieuThu(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoLuong_s, strDonGia_s, strSoTien_s) {
            var obj_save = {
                'action': 'TC_DaNop/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia_s,
                'strSoLuong_s': strSoLuong_s,
                'strDonViTinh_Ids': arrDonViTinh.toString(),
                'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strPhieuThu_Id = data.Id;
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", main_doc.PhieuThuKhac.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
                    }
                    else {
                        //edu.system.alert("Lỗi: " + data.Message, "w");
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

        function save_PhieuRut(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDungRut_s, strSoLuong, strDonGia, strSoTienRut_s) { 
            var obj_save = {
                'action': 'TC_TaiChinh_Rut/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTienRut_s,
                'strTaiChinh_NoiDung_s': strNoiDungRut_s,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
                'strCANBOTHUCHIENRUT_Id': edu.system.userId,
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.extend.notifyBeginLoading("Lưu thành công.");
                        informSaveSuccess(data.Message);
                        var strPhieuThu_Id = data.Id;
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAIRUT", "MauInPhieuThu", main_doc.PhieuThuKhac.changeWidthPrint);
                        edu.extend.notifyBeginLoading('Thực hiện rút tiền thành công', 'notifications_PhieuThu');
                    }
                    else {
                        edu.extend.notifyBeginLoading(data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) {
                    edu.system.endLoading();
                    edu.extend.notifyBeginLoading(JSON.stringify(er));
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

        function informSaveSuccess(data) {
            me.getList_TinhTrangTaiChinh();
            $("#lbSoTienDaChon").html('');
            //Hiển thị lại lưu biên lai
            $("#btnIn_HDBL").show();
            $("#btnHuy_HDBL").show();
            $("#btnThuTien").hide();
            $("#btnSaveHDBL").replaceWith('');
            $("#btnXuat_HD").replaceWith('');

        }
    },
    save_HD: function (strTable_id, bThu) {
        var me = this;
        var strIds = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoLuong = "";
        var strDonGia = "";
        var strSoTien = "";
        var strLoaiTienTe = $("#dropLoaiTienTePTC_PT_Edit").val();
        var strDonViTinh = $("#dropDonViTinhPTC_PT_Edit").val();
        var arrLoaiTienTe = [];
        var arrDonViTinh = [];
        var arrCanDoiKhoanPhaiNop = [];
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
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML.replace(/&amp;/g, '&') + "#";
            strSoLuong += getSoTien(x[i].cells[3].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strSoTien += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            arrLoaiTienTe.push(strLoaiTienTe);
            arrDonViTinh.push(strDonViTinh);
            if (x[i].cells[6] != undefined) arrCanDoiKhoanPhaiNop.push(x[i].cells[6].innerHTML);
        }
        if (strSoTien == 0) {
            edu.extend.notifyBeginLoading('Tổng các khoản chọn phải lớn 0!', 'w');
            $("#zoneBienLaiHoaDon").slideUp('slow');
            $("#zoneTimKiemSinhVien").slideDown('slow');
            $("#zoneThongTinHSSV").slideDown('slow');
            return;
        }
        //
        strIds = strIds.substr(0, strIds.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoLuong = strSoLuong.substr(0, strSoLuong.length - 1);
        strDonGia = strDonGia.substr(0, strDonGia.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        //Nếu chuyển qua lại giữa phiếu thu và phiếu rút
        save_HoaDon(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoLuong, strDonGia, strSoTien);

        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save_HoaDon(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoLuong_s, strDonGia_s, strSoTien_s) {
            var obj_save = {
                'action': 'TC_DaNop/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia_s,
                'strSoLuong_s': strSoLuong_s,
                'strDonViTinh_Ids': arrDonViTinh.toString(),
                'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
                'strCanDoiKhoanPhaiNop': arrCanDoiKhoanPhaiNop.toString(),
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strXuatHoaDonTrucTiep': 1,//Xuất hóa đơn trực tiếp vẫn dùng hàm
                'strNguonDuLieu_Id':''
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strPhieuThu_Id = data.Id;
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.PhieuThuKhac.changeWidthPrint);

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

        function informSaveSuccess(data) {
            me.getList_TinhTrangTaiChinh();
            $("#lbSoTienDaChon").html('');
            //Hiển thị lại lưu biên lai
            $("#btnIn_HDBL").show();
            $("#btnHuy_HDBL").show();
            $("#btnThuTien").hide();
            $("#btnSaveHDBL").replaceWith('');
            $("#btnXuat_HD").replaceWith('');
            //Reset nợ
            $("#tbldata_NopTruoc_HDBL tbody").html('');
            $(".ckbLKT_HDBL").attr('checked', false);
            $(".lbLoaiChungTu").html("hóa đơn");
        }
    },
    save_ThuTien: function (strTable_id, bThu, linkHDDT, strPhuongThuc_Ma, strPhuongThucNhap) {
        var me = this;
        var strIds = "";
        var strThoiGianDaoTaoIds = "";
        var strNoiDungs = "";
        var strSoLuong = "";
        var strDonGia = "";
        var strSoTien = "";
        var strLoaiTienTe = $("#dropLoaiTienTePTC_PT_Edit").val();
        var strDonViTinh = $("#dropDonViTinhPTC_PT_Edit").val();
        var strDonViTinhTen = "";
        if (strDonViTinh != "") strDonViTinhTen = $("#dropDonViTinhPTC_PT_Edit option:selected").text().trim();
        var strLoaiTienTeTen = "";
        if (strLoaiTienTe != "") strLoaiTienTeTen = $("#dropLoaiTienTePTC_PT_Edit option:selected").text().trim();
        var arrLoaiTienTe = [];
        var arrDonViTinh = [];
        var arrDonViTinhTen = [];
        var arrCanDoiKhoanPhaiNop = [];
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
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML.replace(/&amp;/g, '&') + "#";
            strSoLuong += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            strSoTien += getSoTien(x[i].cells[6].innerHTML, 0) + ",";
            arrLoaiTienTe.push(strLoaiTienTe);
            var uuid = main_doc.PhieuThuKhac.arrDonViTinh[i];
            var strDonViTinh = $("#" + uuid).val();
            var strDonViTinhTen = "";
            if (strDonViTinh != "") strDonViTinhTen = $("#" + uuid + " option:selected").text().trim();
            arrDonViTinh.push(strDonViTinh);
            arrDonViTinhTen.push(strDonViTinhTen);
            if (x[i].cells[7] != undefined) arrCanDoiKhoanPhaiNop.push(x[i].cells[7].innerHTML);
        }
        //if (strSoTien == 0) {
        //    edu.extend.notifyBeginLoading('Tổng các khoản chọn phải lớn 0!', 'w');
        //    $("#zoneBienLaiHoaDon").slideUp('slow');
        //    $("#zoneTimKiemSinhVien").slideDown('slow');
        //    $("#zoneThongTinHSSV").slideDown('slow');
        //    return;
        //}
        //
        strIds = strIds.substr(0, strIds.length - 1);
        strThoiGianDaoTaoIds = strThoiGianDaoTaoIds.substr(0, strThoiGianDaoTaoIds.length - 1);
        strNoiDungs = strNoiDungs.substr(0, strNoiDungs.length - 1);
        strSoLuong = strSoLuong.substr(0, strSoLuong.length - 1);
        strDonGia = strDonGia.substr(0, strDonGia.length - 1);
        strSoTien = strSoTien.substr(0, strSoTien.length - 1);
        //Nếu chuyển qua lại giữa phiếu thu và phiếu rút
        save(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoLuong, strDonGia, strSoTien);

        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoLuong_s, strDonGia_s, strSoTien_s) {
            var aNguoiHoc = me.dt_HS.find(e => e.ID === me.strHSSV_Id);
            var strHinhThucThu_TEN = $("#dropHinhThucThuPTC_PT_Edit option:selected").text();
            var tempcheck = $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("name")
            if (tempcheck != undefined && tempcheck != 'undefined' && tempcheck != 'null') {
                strHinhThucThu_TEN = tempcheck;
            }
            var obj_save = {
                'action': 'TC_DaNop/ThemMoi',
                'versionAPI': 'v1.0',
                'strLoaiDoiTuong': "DOITUONGKHAC",
                'strPhuongThuc_MA': strPhuongThuc_Ma,
                'strNguoiThucHien_Id': edu.system.userId,
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTien_s,
                'strTaiChinh_NoiDung_s': strNoiDung_s,
                'strDonGia_s': strDonGia_s,
                'strSoLuong_s': strSoLuong_s,
                'strDonViTinh_Ids': arrDonViTinh.toString(),
                'strDonViTinhTen_s': arrDonViTinhTen.toString(),
                'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
                'strLoaiTienTe': strLoaiTienTeTen,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strCanDoiKhoanPhaiNop': arrCanDoiKhoanPhaiNop.toString(),
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strHinhThucThu_MA': $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("id"),
                'strHinhThucThu_TEN': strHinhThucThu_TEN,
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
                'dKhongSinhChungTu': 0,
                'strPhieuThuTheoPhoiSan_Id': '',
                'strTenNguoiThu': $("#strTenNguoiThu").val(),
                //'strNhap_HoTenNguoiMuaHang': $("#strTenNguoiThu").val(),
                //'bTenNguoiThu': true,
                'strNganHang_SoTaiKhoan': aNguoiHoc.NGANHANG_SOTAIKHOAN,
                'strNganHang_ThuocNganHang_Id': aNguoiHoc.NGANHANG_THUOCNGANHANG_ID,
                'strNganHang_ThuocNganHang_Ten': aNguoiHoc.NGANHANG_THUOCNGANHANG_TEN,
                'strNganHang_ThongTinChiNhanh': aNguoiHoc.NGANHANG_THONGTINCHINHANH,
                'strNgayXuatChungTu': edu.util.getValById('txtNgayChungTu'),
                'bSoLuong': !$('#checkSoLuong').is(":checked"),

            };
            if (linkHDDT != "" && linkHDDT != undefined && strPhuongThuc_Ma.indexOf("HDDTNHAP") == 0) {
                saveHDDT_Nhap(obj_save);
                return;
            }
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
                            //edu.system.alert("Lỗi: " + data.Message, "w");
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
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.PhieuThuKhac.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
                        informSaveSuccess(d.Message);
                    }
                    else {
                        edu.system.alert("Lỗi: " + d.Message, "w");
                        edu.extend.notifyBeginLoading(d.Message, undefined, 5000);
                        informSaveSuccess(d.Message);
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

        function saveHDDT_Nhap(obj_save) {
            obj_save.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            edu.system.makeRequest({
                success: function (d, s, x) {
                    if (d.Success) {
                        saveNhap(obj_save, d.Data);
                        var strLink = d.Data;
                        if (strLink.indexOf('http') === -1) {
                            strLink = edu.system.objApi["HDDT"];
                            strLink = strLink.substring(0, strLink.length - 3) + d.Data;
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
            edu.system.alert('Thực hiện thu tiền thành công', "w");
            me.closePhieu();
        }

        function saveNhap(obj, strDuongDanFileHoaDon) {
            var me = this;
            var obj_save = {
                'action': 'TC_HoaDonNhap/ThemMoi',
                'versionAPI': 'v1.0',

                'strId': "",
                'strQLSV_NguoiHoc_Id': obj.strQLSV_NguoiHoc_Id,
                'strDuongDanFileHoaDon': strDuongDanFileHoaDon,
                'strMoTa': strPhuongThucNhap + "$DOITUONGKHAC",
                'dDaXuatChinhThuc': 0,
                'strNguoiThucHien_Id': edu.system.userId
            };
            //default
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        obj.strTaiChinh_HoaDonNhap_Id = data.Id;
                        saveNhap_ChuaThu(obj);
                        edu.system.alert("Thêm bản nháp thành công");
                    }
                    else {
                        edu.system.alert(data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
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
        function saveNhap_ChuaThu(obj) {
            var obj_save = obj;
            //obj_save["strNhap_HoTenNguoiMuaHang"] = obj.
            obj_save.action = 'TC_HoaDonNhap_ChuaThu/ThemMoi';
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                    }
                    else {
                        edu.system.alert(data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
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
        function informSaveSuccess(data) {
            me.getList_TinhTrangTaiChinh();
            edu.system.alert('Thực hiện thu tiền thành công', "w");
            me.closePhieu();
        }
    },
    delete_BL: function (strPhieuThu_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_SoBienLai/HuyBienLai',
            'versionAPI': 'v1.0',
            'strBienLai_Id': strPhieuThu_Id,
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
    genHTML_NoiDung_BienLai: function (strTableId, bThuTien) {
        var me = this; this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInPhieuThu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018";
        if (bThuTien == false) {
            strMauXem = "Edit_DHCNTTTN_BIENLAIRUT_2018";
        }
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html?v=4', function () {
            if (document.getElementById(zoneMauIn).innerHTML == "" && document.getElementById(zoneMauIn).innerHTML.length == 0) {
                edu.extend.notifyBeginLoading("Không thể load phiếu sửa!. Vui lòng gọi GM", "w");
            }
            else {
                loadPhieu();
            }
            me.changeWidthPrint();
            $("#dropLoaiTienTePTC_PT_Edit").change(function () {
                console.log(111111);
                var strSoTien = $("#tbldataPhieuThuPopup_PT_Edit tfoot tr td:eq(5)").html();
                var strLoaiTien = $("#dropLoaiTienTePTC_PT_Edit option:selected").text().trim();
                if (strLoaiTien == "") return;
                if (strLoaiTien == "VND") strLoaiTien = "đồng";
                var obj_list = {
                    'action': 'TC_ThongTinChung/DocSoThanhChu',
                    'versionAPI': 'v1.0',
                    'dSoTien': strSoTien.replace(/,/g, ''),
                    'strLoaiTien': strLoaiTien,
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
            });
        });

        function loadPhieu() {
            //Hiển thị thông tin đối tượng thu
            var data = me.dt_DoiTuongThu;
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, me.cbGenCombo_HinhThucThu);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, me.cbGenCombo_LoaiTienTe);

            //$(".txtDiaChiPTC_PT_Edit").html(data.aaaa);
            $(".txtMaNCSPTC_PT_Edit").html(data.MASO);
            console.log(data);
            $(".txtHoTenPTC_PT_Edit").html(edu.util.returnEmpty(data.FULL_NAME));
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
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnIn_HDBL").hide();
            $("#btnThuTien").show();
            $("#btnHuy_HDBL").hide();
            if (document.getElementById('btnSaveHDBL') == undefined) {
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHDBL" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Xuất biên lai" class="btn"><i style="color: #00a65a" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất <span class="lbLoaiChungTu">Biên Lai</span></a></div>');
                $("#btnSaveHDBL").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_HDBL('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    });
                });
                if (bThuTien) {
                    $("#btnThuTien").show();
                    var row = '';
                    row += me.strHDDT;
                    $("#zoneActionXuatHoaDon").html(row);
                    //$("#btnXuat_HD").click(function (e) {
                    //    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn không!', 'w');
                    //    $("#btnYes").click(function (e) {
                    //        $('#myModalAlert').modal('hide');
                    //        me.save_HD('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    //    });
                    //});
                }
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
            var strLoaiChungTu = "";
            switch (strHeThongChungTu) {
                case "TAICHINH_HETHONGPHIEUTHU": strLoaiChungTu = "phiếu thu tiền"; break;
                case "TAICHINH_HOADON": strLoaiChungTu = "hóa đơn bán hàng"; break;
                case "TAICHINH_HETHONGBIENLAI": strLoaiChungTu = "CHỨNG TỪ ĐỂ IN"; break;
                case "TAICHINH_HETHONGPHIEUTHURUT": strLoaiChungTu = "biên lai rút tiền"; break;
                default: (bThuTien) ? strLoaiChungTu = "CHỨNG TỪ ĐỂ IN" : strLoaiChungTu = "biên lai rút tiền"; break;
            }
            $(".txtTenPhieuBienLai_Edit").html(strLoaiChungTu);
            $(".lbLoaiChungTu").html(strLoaiChungTu);
            //Các thao tác chuyển sang mẫu viết phiếu
            var idem = 0;
            //Lấy dữ liệu theo các check box đã chọn
            var arrDonViTinh = [];
            var arrcheck = [];
            console.log(arrDonViTinh)
            for (var i = 0; i < x.length; i++) {
                if (arrcheck.indexOf(x[i].id) != -1) continue;
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
                    var uuid = edu.util.uuid();
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
                    //var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('span')[0].innerHTML;
                    var dSoTien = x[i].parentNode.parentNode.cells[6].getElementsByTagName('input')[0].value;
                    var strSoLuong = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    idem++;
                    var rows = '';
                    rows += '<tr id="' + strId + '" name="' + x[i].name + '">';//name: DAOTAO_THOIGIANDAOTAO_ID
                    rows += '<td>' + idem + '</td>';
                    rows += '<td>' + strKhoanThu + '</td>';
                    rows += '<td id="lbNoiDung' + strId + '">' + strNoiDung + '</td>';
                    rows += '<td><select id="dropDonViTinh' + uuid + '" class="select-opt" style="width: 100% !important"></select></td>';
                    rows += '<td>' + strSoLuong + '</td>';
                    //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
                    rows += '<td class="btnEdit_HDBL" name="' + dSoTien + '">' + dSoTien + '</td>';
                    rows += '<td id="lbThanhTien' + strId + '"></td>';
                    rows += '</tr>';
                    $('#tbldataPhieuThuPopup_PT_Edit tbody').append(rows);
                    arrDonViTinh.push("dropDonViTinh" + uuid);
                }
            }
            console.log(arrDonViTinh)
            //Hiển thị tổng tiền đã chọn trên cùng bên trái
            me.tinhHeSoGiaTien('tbldataPhieuThuPopup_PT_Edit', 4, 5, 6);
            edu.system.move_ThroughInTable("tbldataPhieuThuPopup_PT_Edit");
            edu.system.insertSumAfterTable("tbldataPhieuThuPopup_PT_Edit", [4, 5, 6]);
            var x = $("#tbldataPhieuThuPopup_PT_Edit tfoot td:eq(6)").html();//Lấy tổng tiền từ cuối bảng
            console.log(x)
            if (x == 0 || x == '0' || x == undefined) {
                $("#btnClose_HDBL").trigger('click');
                return;
            }
            $(".txtTongTien_PT_Edit").html(x);
            x = x.replace(/,/g, '');
            var strSoTien = to_vietnamese(x) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            $(".txtSoTienPTC_PT_Edit").html(strSoTien);
            me["arrDonViTinh"] = arrDonViTinh;
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
        }
    },
    genHTML_NoiDung_BienLai_DongTruoc: function (strTableId, bThuTien) {
        var me = this; this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInPhieuThu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018";
        if (bThuTien == false) strMauXem = "Edit_DHCNTTTN_BIENLAIRUT_2018"
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html?v=4', function () {
            if (document.getElementById(zoneMauIn).innerHTML == "" && document.getElementById(zoneMauIn).innerHTML.length == 0) {
                edu.extend.notifyBeginLoading("Không thể load phiếu sửa!. Vui lòng gọi GM", "w");
            }
            else {
                loadPhieu();
            }
            me.changeWidthPrint();
            $("#dropLoaiTienTePTC_PT_Edit").change(function () {
                console.log(111111);
                var strSoTien = $("#tbldataPhieuThuPopup_PT_Edit tfoot tr td:eq(5)").html();
                var strLoaiTien = $("#dropLoaiTienTePTC_PT_Edit option:selected").text().trim();
                if (strLoaiTien == "") return;
                if (strLoaiTien == "VND") strLoaiTien = "đồng";
                var obj_list = {
                    'action': 'TC_ThongTinChung/DocSoThanhChu',
                    'versionAPI': 'v1.0',
                    'dSoTien': strSoTien.replace(/,/g, ''),
                    'strLoaiTien': strLoaiTien,
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
            });
        });

        function loadPhieu() {
            //Hiển thị thông tin đối tượng thu
            var data = me.dt_DoiTuongThu;
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, me.cbGenCombo_HinhThucThu);
            //edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, me.cbGenCombo_LoaiTienTe);
            var strNgayChungTu = edu.util.getValById("txtNgayChungTu");
            //$(".txtDiaChiPTC_PT_Edit").html(data.aaaa);
            $(".txtMaNCSPTC_PT_Edit").html(data.MASO); $(".txtHoTenPTC_PT_Edit").html(edu.util.returnEmpty(data.FULL_NAME));
            if (strNgayChungTu) {
                var arrChungTu = strNgayChungTu.split('/');
                $(".iNgayPTC_PT_Edit").html(arrChungTu[0]);
                $(".iThangPTC_PT_Edit").html(arrChungTu[1]);
                $(".iNamPTC_PT_Edit").html(arrChungTu[2]);
            } else {
                $(".iNgayPTC_PT_Edit").html(edu.util.thisDay());
                $(".iThangPTC_PT_Edit").html(edu.util.thisMonth());
                $(".iNamPTC_PT_Edit").html(edu.util.thisYear());
            }
            $(".txtNgaySinhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGAYSINH));
            $(".txtMaSoThue_PT_Edit").html(edu.util.returnEmpty(data.MASOTHUECANHAN));
            console.log(data);
            console.log(edu.util.returnEmpty(data.NOIOHIENNAY));
            $(".txtDiaChiPTC_PT_Edit").html(edu.util.returnEmpty(data.NOIOHIENNAY));
            $(".txtLopPTC_PT_Edit").html(edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGANHHOC_N1_TEN));
            $(".txtKhoaPTC_PT_Edit").html(edu.util.returnEmpty(data.KHOAHOC_N1_TEN));
            //Các thao tác chuyển sang mẫu viết phiếu
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnIn_HDBL").hide();
            //$("#btnThuTien").show();
            $("#btnHuy_HDBL").hide();
            if (document.getElementById('btnSaveHDBL') == undefined) {
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHDBL" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Xuất biên lai" class="btn"><i style="color: #00a65a" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất biên lai</a></div>');
                $("#btnSaveHDBL").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_HDBL('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    });
                });
                if (bThuTien) {
                    $("#btnThuTien").show();
                    var row = '<div id="btnXuat_HD" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Xuất hóa đơn" class="btn" ><i style="color: red" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất hóa đơn</a></div>';
                    row += me.strHDDT;
                    $("#zoneActionXuatHoaDon").html(row);
                    $("#btnXuat_HD").click(function (e) {
                        e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn xuất hóa đơn không!', 'w');
                        $("#btnYes").click(function (e) {
                            $('#myModalAlert').modal('hide');
                            me.save_HD('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                        });
                    });
                }
            }
            //Kiểm tra số lượng check box của bảng hiện tại
            var x = $('#' + strTableId + ' tbody tr td input[class="checkboxtien"]');
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
            var strLoaiChungTu = "";
            switch (strHeThongChungTu) {
                case "TAICHINH_HETHONGPHIEUTHU": strLoaiChungTu = "phiếu thu tiền"; break;
                case "TAICHINH_HOADON": strLoaiChungTu = "hóa đơn bán hàng"; break;
                case "TAICHINH_HETHONGBIENLAI": strLoaiChungTu = "CHỨNG TỪ ĐỂ IN"; break;
                case "TAICHINH_HETHONGPHIEUTHURUT": strLoaiChungTu = "biên lai rút tiền"; break;
                default: (bThuTien) ? strLoaiChungTu = "CHỨNG TỪ ĐỂ IN" : strLoaiChungTu = "biên lai rút tiền"; break;
            }
            $(".txtTenPhieuBienLai_Edit").html(strLoaiChungTu);
            $(".lbLoaiChungTu").html(strLoaiChungTu);
            //Các thao tác chuyển sang mẫu viết phiếu
            var idem = 0;
            //Lấy dữ liệu theo các check box đã chọn
            var arrcheck = []; var arrDonViTinh = [];
            for (var i = 0; i < x.length; i++) {
                //if (arrcheck.indexOf(x[i].id) != -1) continue;
                //arrcheck.push(x[i].id);
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
                    var uuid = edu.util.uuid();
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
                    var dSoTien = x[i].parentNode.parentNode.cells[6].getElementsByTagName('input')[0].value;
                    var strSoLuong = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    var strCanDoiKhoanPhaiNop = 0;

                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    if ($(x[i].parentNode.parentNode.cells[8].getElementsByTagName('input')[0]).is(':checked')) strCanDoiKhoanPhaiNop = 1;
                    idem++;
                    var rows = '';
                    rows += '<tr id="' + strId + '" name="' + x[i].name + '">';//name: DAOTAO_THOIGIANDAOTAO_ID
                    rows += '<td>' + idem + '</td>';
                    rows += '<td>' + strKhoanThu + '</td>';
                    rows += '<td id="lbNoiDung' + strId + '">' + strNoiDung + '</td>';
                    rows += '<td><select id="dropDonViTinh' + uuid + '" class="select-opt" style="width: 100% !important"></select></td>';
                    rows += '<td>' + strSoLuong + '</td>';
                    //rows += '<td class="btnEdit_HDBL"><input id="inptblHeSo' + strKhoanThu_Id + '" value="1"></td>';
                    rows += '<td class="btnEdit_HDBL" name="' + dSoTien + '">' + dSoTien + '</td>';
                    rows += '<td id="lbThanhTien' + strId + '"></td>';
                    rows += '<td style="display: none">' + strCanDoiKhoanPhaiNop + '</td>';
                    rows += '</tr>';
                    $('#tbldataPhieuThuPopup_PT_Edit tbody').append(rows);
                    arrDonViTinh.push("dropDonViTinh" + uuid);
                }
            }
            //Hiển thị tổng tiền đã chọn trên cùng bên trái
            me.tinhHeSoGiaTienDongTruoc('tbldataPhieuThuPopup_PT_Edit', 4, 5, 6);
            edu.system.move_ThroughInTable("tbldataPhieuThuPopup_PT_Edit");
            edu.system.insertSumAfterTable("tbldataPhieuThuPopup_PT_Edit", [4, 5, 6]);
            var x = $("#tbldataPhieuThuPopup_PT_Edit tfoot td:eq(6)").html();//Lấy tổng tiền từ cuối bảng
            console.log(x);
            if (x == 0 || x == '0' || x == undefined) {
                $("#btnClose_HDBL").trigger('click');
                return;
            }
            $(".txtTongTien_PT_Edit").html(x);
            x = x.replace(/,/g, '');
            var strSoTien = to_vietnamese(x) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            $(".txtSoTienPTC_PT_Edit").html(strSoTien);
            me["arrDonViTinh"] = arrDonViTinh;
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
        }
    },
    cbGenCombo_HinhThucThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "THONGTIN1",
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
    tinhHeSoGiaTienDongTruoc: function (strTable_Id, iColHeSo, iColGiaTien, iColHienThi) {
        var me = this;
        var x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
        for (var i = 0; i < x.length; i++) {
            var dHeSo = x[i].cells[iColHeSo].innerHTML;
            var dGiaTien = x[i].cells[iColGiaTien].innerHTML;
            dHeSo = dHeSo.replace(/ /g, "").replace(/,/g, "");
            dGiaTien = dGiaTien.replace(/ /g, "").replace(/,/g, "");
            //
            if (dHeSo != "") {
                dHeSo = parseFloat(dHeSo);
                if (edu.util.floatValid(dHeSo)) {
                    dHeSo = dHeSo;
                }
            }
            dGiaTien = parseFloat(dGiaTien);
            if (edu.util.floatValid(dGiaTien)) {
                dGiaTien = dGiaTien;
            }
            switch ($("#dropSearch_LoaiTinh_HDBL").val()) {
                case "TIENRADONGIA":
                    x[i].cells[iColHienThi].innerHTML = edu.util.formatCurrency(dGiaTien);
                    if (dHeSo != "") {
                        dDonGia = Math.floor((dGiaTien / dHeSo) * 100) / 100;
                        x[i].cells[iColGiaTien].innerHTML = edu.util.formatCurrency(dDonGia);
                    }
                    break;

                default:
                    x[i].cells[iColHienThi].innerHTML = edu.util.formatCurrency(dGiaTien * dHeSo);
                    break;
            }
            ;
        }
    },
    genHTML_PhieuRut: function(){
        $(".txtTenPhieuBienLai").html("BIÊN LAI RÚT TIỀN");
        main_doc.PhieuThuKhac.changeWidthPrint();
    },
    /*------------------------------------------
  --Discription: [6] xemlai
  --ULR: Modules
  -------------------------------------------*/
    showFormPhieuThu: function () {
        var me = this;
        me.showHide_Box("beforeActive", "zoneThongTinHSSV");
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
            renderPlace: main_doc.PhieuThuKhac.arrDonViTinh,
            type: "",
        }
        edu.system.loadToCombo_data(obj);
        //var strDropId = $("#dropDonViTinhPTC_PT_Edit #SINHVIEN").val();
        //$("#dropDonViTinhPTC_PT_Edit").val(strDropId).trigger("change");

    },
    /*------------------------------------------
    --Discription: [7] 
    --ULR: Modules
    -------------------------------------------*/
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauInPhieuThu");
        edu.util.printHTML('MauInPhieuThu');
        edu.system.switchTab('tab_1');
        me.closePhieu();
    },
    closePhieu: function () {
        var me = this;
        $("#zoneBienLaiHoaDon").slideUp('slow');
        $("#zoneTimKiemSinhVien").slideDown('slow');
        $("#zoneThongTinHSSV").slideDown('slow');
        $("#zoneKhoan_ChiTiet").slideUp();
        $("#top_notifications_PhieuThu").hide();
        $("#notifications_PhieuThu").hide();
        $("#btnIn_HDBL").show();
        $("#btnThuTien").hide();
        $("#btnHuy_HDBL").show();
        $("#zoneActionXuatHoaDon").html('');
        $("#btnSaveHDBL").replaceWith('');
        if (me.tabActive == 1) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab1");
        }
        else if (me.tabActive == 2) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab2");
        }
        else if (me.tabActive == 3) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab3");
        }
        else if (me.tabActive == 4) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab4");
        }
        else if (me.tabActive == 5) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab5");
        }
        else if (me.tabActive == 6) {
            me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab6");
        }
        //Reset nợ
        $("#tbldata_NopTruoc_HDBL tfoot").html('');
        $("#tbldata_NopTruoc_HDBL tbody").html('');
        var x = document.getElementsByClassName("ckbLKT_HDBL");
        for (var i = 0; i < x.length; i++) {
            x[i].checked = false;
        }
    },
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
        // Preview đã được center bằng CSS (.preview-area).
        // Action bar đã sticky ở đáy - không cần position:fixed nữa.
        document.getElementById('zoneBienLaiHoaDon').style.paddingLeft = "20px";
        edu.extend.genChonLien("MauInPhieuThu", "zoneLienHoaDon");
    },


    getList_HopDong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc_QuanLy/LayDSHopDong',
            'type': 'GET',
            'strQLSV_NguoiHoc_DoiTac_Id': me.strHSSV_Id,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_HopDong(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {},
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_HopDong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "SOHOPDONG",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropHopDong"],
            type: "",
            title: "Chọn hợp đồng"
        }
        edu.system.loadToCombo_data(obj);

    },


    save_LoaiPhanBo: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_DaNop_PhanBo/ThemMoi',
            'type': 'POST',
            'strQLSV_NguoiHoc_DoiTac_Id': me.strHSSV_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strTaiChinh_DaNop_Id': me.strKhoanThu_Id,
            'dSoTien': edu.util.getValById('txtSoTien' + strQLSV_NguoiHoc_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHopDong_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strHopDong_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strHopDong_Id = obj_save.strId;
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_HopDong();
            },
            error: function (er) {
                edu.system.alert("XLHV_HopDong/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_LoaiPhanBo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc_QuanLy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_DoiTac_Id': me.strHSSV_Id,
            'dHieuLuc': 1,
            'strTaiChinh_NguoiHoc_HD_Id': edu.util.getValById('dropHopDong'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtLoaiPhanBo = data.Data;
                    me.genTable_LoaiPhanBo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LoaiPhanBo: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanBo",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "TONGTIENDAPHANBO"
                },
                {
                    "mData": "HIEULUC",
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtSoTien' + aData.QLSV_NGUOIHOC_ID + '" class="form-control apsotien" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}