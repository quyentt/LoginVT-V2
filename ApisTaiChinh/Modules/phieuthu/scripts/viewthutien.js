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
function ViewPhieuThu() { };
ViewPhieuThu.prototype = {
    strPhieuThu_Id: '',
    objHTML_HDBL: {},
    dt_ThuChung: null,
    dt_ThuRieng: null,
    dt_DuChung: null,
    dt_DuRieng: null,
    dt_HS: '',
    dt_DoiTuongThu: '',
    dt_TTDoiTuong: '',
    strHSSV_Id: '',
    bActiveRutTien: false,
    tabActive: 1,
    strHDDT : '',

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
        document.getElementById("txtTuKhoa_Search").onfocus = function () {
            $("#btnSeachSinhVien").show();
        };
        document.getElementById("txtTuKhoa_Search").onblur = function () {
            setTimeout(function () {
                $("#btnSeachSinhVien").hide();
            }, 500);
        };
        $('#txtTuKhoa_Search').focus();
        $("#MainContent").delegate('.detail_HoSo_PhieuThu', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_HSDoiTuong(id, point);
        });
        $("#MainContent").delegate('.detail_HoSo_PhieuThu', 'click', function (e) {
            e.stopImmediatePropagation();
            if (this.id != me.strHSSV_Id) {
                me.active_DoiTuong(this.id);
                me.showFormPhieuThu();
            }
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
                row += '<input id="txtSoluong' + id + '" class="inputsoluong"  value="1" style="width: 50px">';
                row += '</td>';
                row +='<td>';
                row +='<input id="txtTongTien'+ id +'" class="inputsotien" value="0" style="width: 150px">';
                row +='</td>';
                row +='<td>';
                row += '<input id="' + id + '" name="' + strThoiGianDaoTao + '" title="null" checked="checked" type="checkbox" />';
                row += '</td>';
                row += '</tr>';
                $("#tbldata_NopTruoc_HDBL tbody").append(row);
                $("#tab_6").show();
            } else {
                $("#tbldata_NopTruoc_HDBL tbody #" + id).replaceWith('');
            }
            //edu.system.switchTab('tab_1');
        });
        //Đóng toàn bộ thông tin đối tượng thu
        $("#btnClose_HSSV").click(function () {
            $("#zoneThongTinHSSV").slideUp();
            //$("#zoneThongTinMacDinh").slideDown('slow');
            //Xoa hien thi NCS
            $(".activeSelect").each(function () {
                this.classList.remove('activeSelect');
            });
            me.reset_DoiTuong();
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
            if (me.countCheckTable('tbldata_NopTruoc_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai_DongTruoc('tbldata_NopTruoc_HDBL', true);
        });
        $("#btnAddnew_ThuHo_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_ThuHo_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
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
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
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
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.ViewPhieuThu.changeWidthPrint);
        });
        $("#zoneThongTinHSSV").delegate('.detail_KhoanRut', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", main_doc.ViewPhieuThu.genHTML_PhieuRut);
        });
        $("#zoneThongTinHSSV").delegate('.detail_PhieuHoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.ViewPhieuThu.changeWidthPrint);
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
            if (strZoneId == "zoneThongTinBoSungTab8") {
                me.getList_DaNopRieng();
                me.getList_PhaiNopRieng();
                me.getList_HoaDonRieng();
                me.getList_PhieuThuRieng();
            }
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

        me.getList_NutHDDT();
        $("#btnIn_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        //$("#btnHuy_HDBL").click(function (e) {
        //    e.stopImmediatePropagation();
        //    edu.system.confirm('Bạn có chắc chắn muốn hủy biên lai không!', 'w');
        //    $("#btnYes").click(function (e) {
        //        $('#myModalAlert').modal('hide');
        //        me.delete_BL(me.strPhieuThu_Id);
        //    });
        //    return false;
        //});
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
                var id = this.id;
                if (id == "") {
                    $("#zoneDSKhoanThu").hide();
                } else {

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
            renderPlace: ["dropSearch_Lop_PT"],
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
            renderPlace: ["dropSearch_HocKy_HDBL"],
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
    genHTML_HDDT: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="btnXuat_HDDT" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="' + data[i].TEN + '" class="btn" ><i style="' + data[i].THONGTIN3 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a><a class="color-active bold lbsymbolHD">' + data[i].TEN + '</a></div>';
        }
        me.strHDDT = row;
    },
    /*------------------------------------------
    --Discription: [1] HoSoSinhVien
    --ULR: Modules
    -------------------------------------------*/
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
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

        console.log('%c[getList_HSSV] >>> REQUEST', 'color:#2196F3;font-weight:bold', obj_list);
        console.log('[getList_HSSV] action:', obj_list.action);
        console.log('[getList_HSSV] func  :', obj_list.func);
        console.log('[getList_HSSV] payload JSON:', JSON.stringify(obj_list, null, 2));

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                console.log('%c[getList_HSSV] <<< RESPONSE', 'color:#4CAF50;font-weight:bold', data);
                console.log('[getList_HSSV] Success :', data && data.Success);
                console.log('[getList_HSSV] Message :', data && data.Message);
                console.log('[getList_HSSV] Pager   :', data && data.Pager);
                console.log('[getList_HSSV] Data.len:', data && data.Data ? data.Data.length : 0);
                if (data && data.Data && data.Data.length > 0) {
                    console.log('[getList_HSSV] Row[0]  :', data.Data[0]);
                    console.log('[getList_HSSV] Keys[0] :', Object.keys(data.Data[0]));
                }
                if (data.Success) {
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
                    console.error('[getList_HSSV] FAIL:', data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                console.error('%c[getList_HSSV] !!! ERROR', 'color:#F44336;font-weight:bold', er);
                if (er && er.responseText) console.error('[getList_HSSV] responseText:', er.responseText);
                if (er && er.status) console.error('[getList_HSSV] status:', er.status, er.statusText);
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
                strFuntionName: "main_doc.ViewPhieuThu.getList_HSSV()",
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
                        html += '<span id="sl_hoten' + aData.ID + '" class="">' + strHoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '" class="italic">' + strMaSo + '</span><br />';
                        html += '<span class="italic">Lớp: ' + edu.util.checkEmpty(aData.DAOTAO_LOPQUANLY_N1_TEN) + '</span>';
                        html += '</a>';
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
        var strHoTen = edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN);
        var strMa = data.MASO
        var strSoDienThoai = data.TTLL_DIENTHOAICANHAN;
        var strHienThi = '<span class="bold">' + strHoTen.toUpperCase() + '</span>';

        if (edu.util.checkValue(strMa)) strHienThi += " - " + strMa;
        if (edu.util.checkValue(strSoDienThoai)) strHienThi += " - " + strSoDienThoai;

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
                    me.dt_DoiTuongThu = data.Data.rsThongTin[0];

                    //if (data.Data.rsPhaiNopTongHopChung != null && data.Data.rsPhaiNopTongHopChung.length > 0) {
                    //    edu.system.switchTab("tab_2");
                    //    me.tabActive = 2;
                    //    me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab2");
                    //    me.quickSelectAll_Phieu('tbldata_KhoanNoChung_HDBL');
                    //}
                    //else {
                    //    if (data.Data.rsKhoanPhaiNop_ThuHo != null && data.Data.rsKhoanPhaiNop_ThuHo.length > 0) {
                    //        edu.system.switchTab("tab_7");
                    //        me.tabActive = 7;
                    //        me.showHide_Box("zoneThongTinBoSung", "zoneThongTinBoSungTab7");
                    //        me.quickSelectAll_Phieu('tbldata_ThuHo_HDBL');
                    //    }
                    //}

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
                        return '<input id="txtNoiDungHD' + aData.TAICHINH_CACKHOANTHU_ID + '" value="' + aData.NOIDUNG + '" class="inputnoidung" style="width: 100%"/>';
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
                        return '<input id="txtTongTien' + aData.TAICHINH_CACKHOANTHU_ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"></input>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" name="' + aData.DAOTAO_THOIGIANDAOTAO_ID + '" id="' + aData.TAICHINH_CACKHOANTHU_ID + '" title="' + aData.HETHONGCHUNGTU_MA + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {
            edu.system.insertSumAfterTable(strTableId, [6]);
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
            var sum = edu.system.countFloat(strTableId, 6, 7, 5);
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
            row += '<input type="checkbox" id="ckbLKT_HDBL' + dataKhoanThu[i].ID + '" class="ckbLKT_HDBL" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
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
    getList_DaNopRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaNopRieng',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_KhoanThu(data.Data, "tblDaNopRieng");
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhaiNopRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanPhaiNopRieng',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_KhoanThu(data.Data, "tblPhaiNopRieng");
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_HoaDonRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSPhieuHoaDonRieng',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_HoaDon(data.Data, "tblHoaDonRieng", "detail_PhieuHoaDon");
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_PhieuThuRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSPhieuDaThuRieng',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_Phieu(data.Data, "tblPhieuThuRieng", "detail_KhoanThu");
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
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

    genTable_KhoanThu: function (data, strTable_Id) {
        var me = this;
        var thead = '';
        //1. thead
        $("#" + strTable_Id + " thead").html('');
        $("#" + strTable_Id + " tbody").html('');
        $("#" + strTable_Id + " tfoot").html('');
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
        $("#" + strTable_Id + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: strTable_Id,
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
            edu.system.insertSumAfterTable(strTable_Id, [5]);
            $('#' + strTable_Id + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genTable_Phieu: function (data, strTable_Id, strClassPhieu) {
        var me = this;
        var thead = '';
        //1. thead
        $("#" + strTable_Id + " thead").html('');
        $("#" + strTable_Id + " tbody").html('');
        $("#" + strTable_Id + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Số phiếu</th>';
        thead += '<th class="td-right"><span class="lang" key="">Tổng tiền</span></th>';
        thead += '<th class="td-center">Ngày thu</th>';
        thead += '<th class="td-center">Người thu</th>';
        thead += '<th class="td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#" + strTable_Id + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: strTable_Id,
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
                        return '<a class="' + strClassPhieu + '" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [2]);
            $('#' + strTable_Id + ' tfoot td:eq(2)').attr('style', 'text-align: right');
        }
    },
    genTable_HoaDon: function (data, strTable_Id, strClassPhieu) {
        var me = this;
        var thead = '';
        //1. thead
        $("#" + strTable_Id + " thead").html('');
        $("#" + strTable_Id + " tbody").html('');
        $("#" + strTable_Id + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Số phiếu</th>';
        thead += '<th class="td-right"><span class="lang" key="">Tổng tiền</span></th>';
        thead += '<th class="td-center">Ngày thu</th>';
        thead += '<th class="td-center">Người thu</th>';
        thead += '<th class="td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#" + strTable_Id + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: strTable_Id,
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
                        return '<a class="' + strClassPhieu + '" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable(strTable_Id, [2]);
            $('#' + strTable_Id + ' tfoot td:eq(2)').attr('style', 'text-align: right');
        }
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
        var strDonViTinh = "";
        var strLoaiTienTe = $("#dropLoaiTienTePTC_PT_Edit").val();
        var strDonViTinh = $("#dropDonViTinhPTC_PT_Edit").val();
        var arrLoaiTienTe = [];
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
            strThoiGianDaoTaoIds += $(x[i]).attr('name') + ",";
            strNoiDungs += x[i].cells[2].innerHTML.replace(/&amp;/g, '&') + "#";
            strSoLuong += getSoTien(x[i].cells[3].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strSoTien += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
            arrLoaiTienTe.push(strLoaiTienTe);
            arrDonViTinh.push(strDonViTinh);
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
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", main_doc.ViewPhieuThu.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
                    }
                    else {
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

        function save_PhieuRut(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDungRut_s, strSoLuong_s, strDonGia_s, strSoTienRut_s) {
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
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAIRUT", "MauInPhieuThu", main_doc.ViewPhieuThu.changeWidthPrint);
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
            $(".btnXuat_HDDT").remove();
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
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strXuatHoaDonTrucTiep': 1,//Xuất hóa đơn trực tiếp vẫn dùng hàm
                'strNguonDuLieu_Id': ''
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strPhieuThu_Id = data.Id;
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.ViewPhieuThu.changeWidthPrint);

                        edu.extend.notifyBeginLoading('Thực hiện thu tiền thành công', 'notifications_PhieuThu');
                    }
                    else {
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
            $(".btnXuat_HDDT").remove();
            //Reset nợ
            $("#tbldata_NopTruoc_HDBL tbody").html('');
            $(".ckbLKT_HDBL").attr('checked', false);
            $(".lbLoaiChungTu").html("hóa đơn");
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
        var strMauXem="Edit_DHCNTTTN_BIENLAITHU_2018";
        if (bThuTien == false) {
            strMauXem = "Edit_DHCNTTTN_BIENLAIRUT_2018";
        }
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
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, me.cbGenCombo_HinhThucThu);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, me.cbGenCombo_LoaiTienTe);
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
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnIn_HDBL").hide();
            $("#btnThuTien").show();
            $("#btnHuy_HDBL").hide();
            if (document.getElementById('btnSaveHDBL') == undefined) {
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHDBL" style="width:85px; text-align:center; background-color: #fff; border-bottom: 1px solid #f1f1f1"><a title="Xuất biên lai" class="btn"><i style="color: #00a65a" class="fa fa-save fa-4x"></i></a><a class="color-active bold lbsymbolHD">Xuất biên Lai</a></div>');
                $("#btnSaveHDBL").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_HDBL('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    });
                });
                if (bThuTien) {
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
            var arrcheck = [];
            for (var i = 0; i < x.length; i++) {
                if (arrcheck.indexOf(x[i].id) != -1) continue;
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
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
                    rows += '<td>' + strSoLuong + '</td>';
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
    genHTML_NoiDung_BienLai_DongTruoc: function (strTableId, bThuTien) {
        var me = this; this;
        //Load thông tin phiếu sửa mặc định toàn bộ
        var zoneMauIn = "MauInPhieuThu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        var strMauXem = "Edit_DHCNTTTN_BIENLAITHU_2018";
        if (bThuTien == false) strMauXem = "Edit_DHCNTTTN_BIENLAIRUT_2018"
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
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.HTTHU" }, me.cbGenCombo_HinhThucThu);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "TAICHINH.DVT" }, me.cbGenCombo_DonViTinh);
            edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.LTT" }, me.cbGenCombo_LoaiTienTe);
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
            $("#zoneBienLaiHoaDon").slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            $("#btnIn_HDBL").hide();
            $("#btnThuTien").show();
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
                default: (bThuTien) ? strLoaiChungTu = "CHỨNG TỪ ĐỂ IN" : strLoaiChungTu = "biên lai rút tiền"; break;
            }
            $(".txtTenPhieuBienLai_Edit").html(strLoaiChungTu);
            $(".lbLoaiChungTu").html(strLoaiChungTu);
            //Các thao tác chuyển sang mẫu viết phiếu
            var idem = 0;
            //Lấy dữ liệu theo các check box đã chọn
            var arrcheck = [];
            for (var i = 0; i < x.length; i++) {
                if (arrcheck.indexOf(x[i].id) != -1) continue;
                arrcheck.push(x[i].id);
                if ($(x[i]).is(':checked')) {
                    var strId = x[i].id;
                    console.log(x[i]);
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
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
                    rows += '<td>' + strSoLuong + '</td>';
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
        var strDropId = $("#dropDonViTinhPTC_PT_Edit #SINHVIEN").val();
        $("#dropDonViTinhPTC_PT_Edit").val(strDropId).trigger("change");

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
    genHTML_PhieuRut: function(){
        $(".txtTenPhieuBienLai").html("BIÊN LAI RÚT TIỀN");
        main_doc.ViewPhieuThu.changeWidthPrint();
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
        $("#zoneActionXuatHoaDon").html('');
        $("#top_notifications_PhieuThu").hide();
        $("#notifications_PhieuThu").hide();
        $("#btnIn_HDBL").show();
        $("#btnThuTien").hide();
        $("#btnHuy_HDBL").show();
        $("#btnSaveHDBL").replaceWith('');
        $(".btnXuat_HDDT").remove();
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
        //Thay đổi vùng in
        var lMauInPhieuThu = document.getElementById("MauInPhieuThu").offsetWidth;
        console.log(lMauInPhieuThu);
        if (lMauInPhieuThu > 700) lMauInPhieuThu += 240;
        else {
            lMauInPhieuThu = 1250;
        }
        var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        if (lMainPrint > lMauInPhieuThu) {
            document.getElementById('zoneBienLaiHoaDon').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
            document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneBienLaiHoaDon').style.paddingLeft = "20px";
            document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        }
        edu.extend.genChonLien("MauInPhieuThu", "zoneLienHoaDon");
    }
}