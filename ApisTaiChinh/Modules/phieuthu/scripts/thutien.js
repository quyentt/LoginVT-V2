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
function PhieuThu() { };
PhieuThu.prototype = {
    strPhieuThu_Id: '',
    objHTML_HDBL: {},
    dt_ThuChung: null,
    dt_ThuRieng: null,
    dt_DuChung: null,
    dt_DuRieng: null,
    dt_HS: '',
    dtKhoanDaNop: [],
    dtKhoanPhaiNop: [],
    dtKhoanPhaiNop_Rieng: [],
    dtKhoanMien: [],
    dtKhoanDaNop_Rieng: [],
    dtKhoanDaRut: [],
    dt_DoiTuongThu: '',
    dt_TTDoiTuong: '',
    strHSSV_Id: '',
    strKhoanThu_Id: '',
    strKhoanThu_Rieng_Id: '',
    strKhoanRut_Id: '',
    bActiveRutTien: false,
    tabActive: 1,
    strHDDT: '',
    dTongDu: 0,
    strChuongTrinh_Id: '',
    // Tên người thu tiền lấy từ danh mục NTT (mã bảng danh mục = "NTT", 1 record duy nhất).
    // Dùng override cho: (1) cột "Người thu" trong bảng phiếu đã thu/hóa đơn, (2) chữ ký "Người thu tiền" ở biên lai.
    strTenNguoiThuTien_NTT: '',

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

        // Helper: init select2 cho 1 <select> nếu chưa được init.
        // Dùng chung cho MutationObserver + event delegation (nhiều layer safety).
        me._initSelect2ForPhieu = function ($sel) {
            if (typeof $.fn.select2 !== 'function') return false;
            if (!$sel || !$sel.length) return false;
            if ($sel.hasClass('select2-hidden-accessible')) return true;
            var strPlaceholder = $sel.find('option[value=""]').first().text() || 'Chọn...';
            try {
                $sel.select2({
                    width: 'auto',
                    minimumResultsForSearch: 0,
                    placeholder: strPlaceholder,
                    dropdownCssClass: 'select2-dropdown--phieuthu',
                    dropdownParent: $(document.body)
                });
                console.log('[select2] inited for:', $sel.attr('id') || $sel[0]);
                return true;
            } catch (e) { console.warn('[select2 init] fail:', e); return false; }
        };

        // LAYER 1: Event delegation — bulletproof. Khi user mousedown/focus vào bất kỳ <select> nào
        // trong #MauInPhieuThu mà chưa có select2 → init NGAY. Không phụ thuộc timing của template load.
        // Dùng $(document) để bắt được cả element được thêm sau khi trang load.
        $(document).on('mousedown focusin', '#MauInPhieuThu select:not(.select2-hidden-accessible)', function (e) {
            var $sel = $(this);
            if (me._initSelect2ForPhieu($sel)) {
                // Sau khi init, tự động mở popup select2 (thay cho native đang định mở)
                setTimeout(function () {
                    try { $sel.select2('open'); } catch (er) {}
                }, 0);
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // LAYER 2: MutationObserver — pre-init khi template render, để user click 1 phát mở popup luôn
        // (không phải chờ init lần đầu ở LAYER 1). Setup lazily (defer 500ms) để đảm bảo #MauInPhieuThu tồn tại.
        setTimeout(function () {
            var elMauInPhieuThu = document.getElementById('MauInPhieuThu');
            if (!elMauInPhieuThu || typeof MutationObserver === 'undefined') return;
            var initSelect2Timer = null;
            var observer = new MutationObserver(function () {
                clearTimeout(initSelect2Timer);
                initSelect2Timer = setTimeout(function () {
                    $('#MauInPhieuThu select').each(function () {
                        me._initSelect2ForPhieu($(this));
                    });
                }, 150);
            });
            observer.observe(elMauInPhieuThu, { childList: true, subtree: true });
        }, 500);

        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.getList_HSSV();
        me.getList_DMLKT();
        me.getList_NguoiThuTien_NTT();
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
        $('#txtTuKhoa_Search').focus();
        $("#MainContent").delegate('.detail_HoSo_PhieuThu', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_HSDoiTuong(id, point);
        });
        $("#MainContent").delegate('.trangthaiHS', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = $(this).attr("name");
            me.popover_TrangThai(id, point);
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
            var stt = document.getElementById("tbldata_NopTruoc_HDBL").getElementsByTagName('tbody')[0].rows.length + 1;
            if (this.checked) {
                var row = '';
                row += '<tr id="' + id + '" class="tr-bg">';
                row += '<td>' + stt + '</td>';
                row += '<td>' + strThoiGianDaoTao_Name + '</td>';
                row += '<td></td>';
                row += '<td>' + strKhoanThu_Name + '</td>';
                row += '<td><input id="txtNoiDung' + id + '" value ="' + strKhoanThu_Name + '(' + $("#dropSearch_HocKy_HDBL option:selected").text() + ')" style="width: 100%; text-align: left" /></td>';
                row += '<td>';
                row += '<input id="txtSoluong' + id + '" class="inputsoluong"  value="1" style="width: 50px" />';
                row += '</td>';
                row += '<td>';
                row += '<input id="txtTongTien' + id + '" class="inputsotien" value="0" style="width: 150px" />';
                row += '</td>';
                row += '<td>';
                row += '<input id="' + id + '" name="' + strThoiGianDaoTao + '" class="checkboxtien" title="null" checked="checked" type="checkbox" />';
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
            me["strNgayXuatChungTu"] = edu.util.getValById('txtNgayChungTuNoChung'),
            me.genHTML_NoiDung_BienLai('tbldata_KhoanNoChung_HDBL', true);
        });
        $("#btnAddnew_KhoanNoRieng_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanNoRieng_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me["strNgayXuatChungTu"] = edu.util.getValById('txtNgayChungTuNoRieng'),
            me.genHTML_NoiDung_BienLai('tbldata_KhoanNoRieng_HDBL', true);
        });
        $("#btnAddnew_KhoanThuaChung_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            if (me.countCheckTable('tbldata_KhoanThuaChung_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            if (parseFloat($("#lblTongTienDaChon").html().replace(/,/g, '')) > parseFloat(me.dTongDu)) {
                edu.system.confirm("Số tiền vượt mức cho phép: " + edu.util.formatCurrency(me.dTongDu) + ". Bạn có muốn tiếp tục?");
                $("#btnYes").click(function (e) {
                    me.genHTML_NoiDung_BienLai('tbldata_KhoanThuaChung_HDBL', false);
                });
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
            if (parseFloat($("#lblTongTienDaChon").html().replace(/,/g, '')) > parseFloat(me.dTongDu)) {
                edu.system.alert("Số tiền vượt mức cho phép: " + edu.util.formatCurrency(me.dTongDu), "w");
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
            me["strNgayXuatChungTu"] = edu.util.getValById('txtNgayChungTu'),
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
            if (me.countCheckTable('tbldata_ThuHo_HDBL') == 0) {
                edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu', 'w');
                return;
            }
            me.genHTML_NoiDung_BienLai('tbldata_ThuHo_HDBL', true);
        });

        $("#tbldata_KhoanNoChung_HDBL").delegate('.btnThanhToanQR', 'click', function (e) {
            var strKhoanThu_Id = this.id.replace(/lblDinhDanh/g, '');;
            var strMaDinhDanh = $(this).attr("name");
            var strSoTien = $(this).attr("sotien").replace(/,/g, '');;
            var strNoiDung = edu.system.change_alias($(this).attr("noidung"));
            console.log('https://api.vietqr.io/image/970418-' + strMaDinhDanh + '-JIzXIaG.jpg?accountName=LU%20A%20TUAN&amount=' + strSoTien + '&addInfo=' + strNoiDung + '"');
            me.alert('<img style="margin-left: 40px" src="https://api.vietqr.io/image/970418-' + strMaDinhDanh + '-JIzXIaG.jpg?accountName=LU%20A%20TUAN&amount=' + strSoTien + '&addInfo=' + strNoiDung + '"');
        });
        $("#btnCreateQR_KhoanNoChung_BLHD").click(function (e) {
            var arrChecked_Id = [];
            $('#tbldata_KhoanNoChung_HDBL tbody').find(":checkbox:checked").each(function () {
                arrChecked_Id.push(this.id);
            });
            //var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_KhoanNoChung_HDBL", "");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn khoản thu?");
                return;
            }
            if (arrChecked_Id.length > 1) {
                edu.system.alert("Mỗi lần chỉ được thanh toán 1 khoản?");
                return;
            }
            var strKhoanThu_Id = arrChecked_Id[0];
            var strMaDinhDanh = $("#lblDinhDanh" + strKhoanThu_Id).html();
            var strSoTien = $("#txtTongTien" + strKhoanThu_Id).val().replace(/,/g, '');
            var strNoiDung = $("#txtNoiDungHD" + strKhoanThu_Id).val();
            me.alert('<img style="margin-left: 40px" src="https://api.vietqr.io/image/970418-' + strMaDinhDanh + '-JIzXIaG.jpg?accountName=LU%20A%20TUAN&amount=' + strSoTien + '&addInfo=' + strNoiDung +'"');
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
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien('tbldata_KhoanThuaChung_HDBL');
        });
        $("#tbldata_KhoanThuaRieng_HDBL").delegate(".inputsotien,.inputsoluong", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
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
            $("#zoneBienLaiHoaDon").stop(true, true).slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', function () {
                main_doc.PhieuThu.changeWidthPrint();
            });
        });
        $("#zoneThongTinHSSV").delegate('.detail_KhoanRut', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").stop(true, true).slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", function () {
                main_doc.PhieuThu.genHTML_PhieuRut();
            });
        });
        $("#zoneThongTinHSSV").delegate('.detail_PhieuHoaDon', 'click', function (e) {
            e.stopImmediatePropagation();
            var strPhieuThu_Id = this.id;
            me.strPhieuThu_Id = strPhieuThu_Id;
            me.bActiveRutTien = true;
            $(".beforeActive").hide();
            $("#zoneBienLaiHoaDon").stop(true, true).slideDown();
            $("#zoneTimKiemSinhVien").slideUp();
            edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", function () {
                main_doc.PhieuThu.changeWidthPrint();
            });
        });

        /*------------------------------------------
        --Discription: [5]. Action ChiTiet KhoanThu
        --Update: nnthuong/26/07/2018
        -------------------------------------------*/
        //tab1
        $(".btnDetail_KhoanPhaiNop").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản phải nộp");
            me.getList_KhoanPhaiNop();
        });
        $(".btnDetail_KhoanDuocMien").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản được miễn");
            me.getList_KhoanDuocMien();
        });
        $(".btnDetail_KhoanDaNop").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản đã nộp");
            me.getList_KhoanDaNop();
        });
        $(".btnDetail_KhoanDaRut").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản đã rút");
            me.getList_KhoanDaRut();
        });
        $(".btnDetail_NoRiengTungKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản nợ riêng");
            me.getList_NoRiengTungKhoan();
        });
        $(".btnDetail_NoChungCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản nợ chung");
            me.getList_NoChungCacKhoan();
        });
        $(".btnDetail_DuRiengCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản dư riêng");
            me.getList_DuRiengCacKhoan();
        });
        $(".btnDetail_DuChungCacKhoan").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" dư chung");
            me.getList_DuChungCacKhoan();
        });
        $(".btnDetail_PhieuDaThu").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" phiếu đã thu");
            me.getList_PhieuDaThu();
        });
        $(".btnDetail_PhieuDaRut").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" phiếu đã rút");
            me.getList_PhieuDaRut();
        });
        $(".btnDetail_PhieuHoaDon").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" hóa đơn");
            me.getList_PhieuHoaDon();
        });
        $(".btnDetail_BaoCao").click(function () {
            console.log(11111);
            //$("#zoneBaoCao_TT button").trigger("click");
        });

        $(".btnDetail_KhoanRutRieng").click(function () {
            me.tabActive = 1;
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            $("#lblLoaiKhoanThu").html(" khoản đã rút");
            me.getList_KhoanRutRieng();
        });
        $(".btnDetail_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#myModalXemThongTinAll').modal('show');
            
            me.getList_KhoanPhaiNop();
            me.getList_KhoanDaNop();
            me.getList_KhoanDuocMien();
            me.getList_KhoanDaRut();
            me.getList_NoChungCacKhoan();
            me.getList_NoRiengTungKhoan();
            me.getList_DuChungCacKhoan();
            me.getList_DuRiengCacKhoan();
        });
        $("#btnShowHidetblChiTietKhoanPhaiNop_XemThongTinAll").click(function () {
            me.tabActive = 1;            
            $('#zoneChiTietKhoanPhaiNop_XemThongTinAll').slideToggle('slow');            
        });
        $("#btnShowHideChiTietKhoanDaNop_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#zoneChiTietKhoanDaNop_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideChiTietKhoanDuocMien_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#tblChiTietKhoanDuocMien_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideChiTietKhoanDaRut_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#tblChiTietKhoanDaRut_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideKhoanThuaChung_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#tblChiTietKhoanThuaChung_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideKhoanThuaRieng_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#zoneChiTietKhoanThuaRieng_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideChiTietKhoanPhaiNopChung_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#zoneChiTietKhoanPhaiNopChung_XemThongTinAll').slideToggle('slow');
        });
        $("#btnShowHideChiTietKhoanPhaiNopRieng_XemThongTinAll").click(function () {
            me.tabActive = 1;
            $('#zoneChiTietKhoanPhaiNopRieng_XemThongTinAll').slideToggle('slow');
        });
        //tab2
        $(".btnDetail_NoChungCacKhoan_Tab2").click(function () {
            me.tabActive = 1;
            $('a[href="#tab_1"]').tab('show');
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoChungCacKhoan();
        });
        //tab3
        $(".btnDetail_NoRiengTungKhoan_Tab3").click(function () {
            me.tabActive = 1;
            $('a[href="#tab_1"]').tab('show');
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_NoRiengTungKhoan();
        });
        //tab4
        $(".btnDetail_DuRiengCacKhoan_Tab4").click(function () {
            me.tabActive = 1;
            $('a[href="#tab_1"]').tab('show');
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuChungCacKhoan();

        });
        //tab5
        $(".btnDetail_DuChungCacKhoan_Tab5").click(function () {
            me.tabActive = 1;
            $('a[href="#tab_1"]').tab('show');
            me.showHide_Box("zoneThongTinBoSung", "zoneKhoan_ChiTiet");
            me.getList_DuRiengCacKhoan();
        });
        //#region tab8 Tài chính thu hộ
        $("#tblPhaiNopRieng").delegate(".btnEditKhoanRieng", "click", function () {
            var strId = this.id;

            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Rieng_Id = strId;

                me.viewForm_KhoanPhaiNop_Rieng(edu.util.objGetDataInData(strId, me.dtKhoanPhaiNop_Rieng, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_KhoanPhaiNop_Rieng").click(function () {
            me.save_KhoanPhaiNop_Rieng();
        });
        $("#btnDelete_KhoanPhaiNop_Rieng").click(function () {
            $('#myModalKhoanPhaiNop_Rieng').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanPhaiNop_Rieng(me.strKhoanThu_Rieng_Id);
            });
        });
        $("#tblDaNopRieng").delegate(".btnEditKhoanRieng", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Rieng_Id = strId;
                me.viewForm_KhoanDaNop_Rieng(edu.util.objGetDataInData(strId, me.dtKhoanDaNop_Rieng, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KhoanDaThu_Rieng").click(function () {
            $('#myModalKhoanDaNop_Rieng').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanDaNop_Rieng(me.strKhoanThu_Rieng_Id);
            });
        });
        $("#btnSave_KhoanDaThu_Rieng").click(function () {
            me.save_KhoanDaNop_Rieng();
        });


        $("#tblChiTietKhoan").delegate(".btnChiTietKhoanThu", "click", function () {
            var strId = this.id;
            $("#myModalChiTietKhoanThu").modal('show');
            me.getList_ChiTietKhoanPhaiNop(strId);
        });

        $("#tblChiTietKhoan").delegate(".btnChiTietKhoanMien", "click", function () {
            var strId = this.id;
            $("#myModalChiTietKhoanThu").modal('show');
            me.getList_ChiTietKhoanMien(strId);
        });
        //#endregion
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
                me.getList_KhoanRutRieng();
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
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_TrangThaiSV();

        me.getList_NutHDDT();
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
        $("#MainContent").delegate(".btnXuat_HDDT", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id
            var xCheck = me.dtNutHDDT.find(e => e.ID === strId);
            if (xCheck && xCheck.THONGTIN4) edu.system.objApi["HDDT"] = xCheck.THONGTIN4;
            var strLinkAPI = edu.system.strhost + edu.system.objApi["HDDT"].replace(/api/g, '');
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
        //Đóng hóa đơn sửa hoặc hóa đơn in
        $("#btnClose_HDBL").click(function (e) {
            e.stopImmediatePropagation();
            me.closePhieu();
        });
        setTimeout(function () {
            $('#dropSearch_HeDaoTao_PT').on('change', function (e) {
                me.getList_KhoaDaoTao();
                me.getList_ChuongTrinhDaoTao();
                me.getList_LopQuanLy();
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
        $(document).delegate(".ckbDSTrangThaiSV_HDBL_ALL", "click", function (e) {
            console.log(this.checked)
            //e.stopImmediatePropagation();
            console.log(this.checked)
           
        });
        $("#ckbDSTrangThaiSV_HDBL_ALL").click(function () {
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_HDBL").each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblChiTietKhoan").delegate(".btnEditDaNop", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Id = strId;
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

        $("#tblChiTietKhoan").delegate(".btnEditKhoanMien", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strKhoanThu_Id = strId;
                me.viewForm_KhoanMien(edu.util.objGetDataInData(strId, me.dtKhoanMien, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KhoanMien").click(function () {
            $('#myModalKhoanMien').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanMien(me.strKhoanThu_Id);
            });
        });
        $("#btnSave_KhoanMien").click(function () {
            me.save_KhoanMien();
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

        edu.system.getList_MauImport("zoneBaoCao_ThuTien", function (addKeyValue) {
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
        //$("#" + strZoneButton).delegate(".btnBaoCao_LHD", "click", function (e) {
        //    e.preventDefault();
        //    me.report($(this).attr("name"), $(this).attr("duongdan"), callback);
        //});
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropDaNop_HinhThucThu,dropDaRut_HinhThucThu,dropDaNop_HinhThucThu_Rieng,dropKhoanMien_HinhThucThu");


        $("#tblChiTietKhoan").delegate(".btnEditDaRut", "click", function () {
            var strId = this.id;
            me["bChiTietKhoan"] = "Rut";
            if (edu.util.checkValue(strId)) {
                me.strKhoanRut_Id = strId;
                me.viewForm_KhoanDaRut(edu.util.objGetDataInData(strId, me.dtKhoanDaRut, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblChiTietKhoan,#tblRutRieng").delegate(".btnEditRutRieng", "click", function () {
            var strId = this.id;
            me["bChiTietKhoan"] = "RutRieng";
            if (edu.util.checkValue(strId)) {
                me.strKhoanRut_Id = strId;
                me.viewForm_KhoanDaRut(edu.util.objGetDataInData(strId, me.dtKhoanDaRut, "ID")[0]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KhoanDaRut").click(function () {
            $('#myModalKhoanDaRut').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {     
                if (me.bChiTietKhoan == "RutRieng") me.delete_KhoanRutRieng(me.strKhoanRut_Id);
                else
                me.delete_KhoanDaRut(me.strKhoanRut_Id);
            });
        });
        $("#btnSave_KhoanDaRut").click(function () {
            if (me.bChiTietKhoan == "RutRieng") me.save_KhoanRutRieng(me.strKhoanRut_Id);
            else
            me.save_KhoanDaRut();
        });

        $("#btnAddnew_KhoanNoChung_TaoMaQRThanhToan").click(function () {
            if (me.dt_DoiTuongThu) {
                let url = edu.system.strhost;
                if(Init_API().TSV) url = Init_API().TSV;
                url += '/congthongtin/pages/thanhtoan.aspx?strMa=' + me.dt_DoiTuongThu.MASO;
                $("#modal_ThanhToan .modal-body").html('<iframe src="' + url + '" width="100%" height="1000px"></iframe >');
                $("#modal_ThanhToan").modal("show")
            }
            
        });
    },
    alert: function (content, code, title) {
        var me = edu.system;
        var alert = "";
        if (content === null || content === undefined) return;
        main();
        function main() {
            if (!title) {
                switch (code) {
                    case "w":
                        title = '<i class="fa fa-exclamation-triangle fa-notify fa-warning"> ' + edu.constant.getting("LABLE", "CODE_W") + '</i>';
                        genBox_Alert();
                        break;
                    case "h":
                        title = '<i class="fa fa-question-circle fa-notify fa-help"> ' + edu.constant.getting("LABLE", "CODE_H") + '</i>';
                        genBox_Alert();
                        break;
                    default:
                        title = '<i class="fa fa-info-circle fa-default"> ' + edu.constant.getting("LABLE", "CODE_I") + '</i>';
                        genBox_Alert();
                        break;
                }
            } else {
                title = '<i class="fa fa-info-circle fa-default"> ' + title + '</i>';
            }
        }
        function genBox_Alert() {
            if (!me.flag_alert) {

                alert += '<div id="myModalAlert" class="modal fade modal-alert" role="dialog" style=""><div class="modal-dialog">';
                alert += '<div class="modal-content"><div class="modal-header">';
                alert += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
                alert += '<h4 class="modal-title">' + title + '</h4>';
                alert += ' </div>';
                alert += '<div class="modal-body" id="alert_content">';
                alert += '</div>';
                alert += '<div class="modal-footer">';
                alert += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> ' + edu.constant.getting("BUTTON", "CLOSE") + '</button>';
                alert += '</div>';
                alert += '</div>';

                $("#alert").html(alert);
                $('#alert>#myModalAlert').modal('show');
                genContent_Alert();
                me.flag_alert = true;

                $("#btnYes").hide();

                $('#myModalAlert').on('hidden.bs.modal', function () {
                    $("#myModalAlert").remove();
                    me.flag_alert = false;
                    me.arrcheckcontent = [];
                    me.arrStt = [];
                });

            }
            else {
                genContent_Alert();
            }
        }
        function genContent_Alert() {
            var strhtmlcontent = change_alias(content);
            var iThuTu = me.arrcheckcontent.indexOf(strhtmlcontent);
            if (iThuTu == -1) {
                $('#myModalAlert #alert_content').append('<p>' + content + ' <span id="' + strhtmlcontent + '"></span></p>');
                me.arrcheckcontent.push(strhtmlcontent);
                me.arrStt.push(1);
            } else {
                var iSoLuong = me.arrStt[iThuTu] + 1;
                me.arrStt[iThuTu] = iSoLuong;
                $("#" + strhtmlcontent).html("(" + iSoLuong + ")");
            }
        }
        function change_alias(alias) {
            var str = alias;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
            str = str.replace(/ + /g, "");
            str = str.replace(/ /g, "");
            return str;
        }
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
            renderPlace: ["dropSearch_HocKy_HDBL", "dropDaNop_ThoiGian", "dropPhaiNop_ThoiGian", "dropPhaiNop_ThoiGian_Rieng", "dropDaNop_ThoiGian_Rieng", "dropDaRut_ThoiGian", "dropKhoanMien_ThoiGian"],
            type: "",
            title: "Tất cả đợt",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print;">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_HDBL" title="' + data[i].TEN + '"' + strcheck + ' />';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
        //me.getList_KhoanThu();
    },
    genHTML_HDDT: function (data) {
        var me = this;
        me["dtNutHDDT"] = data;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            // Bỏ class btn-info — global styles-content.css có rule .btn-info override mạnh (!important) gây vệt teal đậm bên trái.
            // Style outline teal đồng nhất do CSS #zoneActionHoaDon .btnXuat_HDDT .btn ở thutien.html quản lý.
            row += '<div class="btnXuat_HDDT aps-btn" id="' + data[i].ID + '" title="' + data[i].MA + '" name="' + data[i].THONGTIN2 + '">'
                + '<a title="' + data[i].TEN + '" class="btn">'
                + '<i style="' + data[i].THONGTIN3 + '" class="' + data[i].THONGTIN1 + '"></i> ' + data[i].TEN
                + '</a></div>';
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

        console.log('%c[thutien.getList_HSSV] >>> REQUEST', 'color:#2196F3;font-weight:bold', obj_list);
        console.log('[thutien.getList_HSSV] action:', obj_list.action);
        console.log('[thutien.getList_HSSV] func  :', obj_list.func);
        console.log('[thutien.getList_HSSV] payload JSON:', JSON.stringify(obj_list, null, 2));

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                console.log('%c[thutien.getList_HSSV] <<< RESPONSE', 'color:#4CAF50;font-weight:bold', data);
                console.log('[thutien.getList_HSSV] Success :', data && data.Success);
                console.log('[thutien.getList_HSSV] Message :', data && data.Message);
                console.log('[thutien.getList_HSSV] Pager   :', data && data.Pager);
                console.log('[thutien.getList_HSSV] Data.len:', data && data.Data ? data.Data.length : 0);
                if (data && data.Data && data.Data.length > 0) {
                    console.log('[thutien.getList_HSSV] Row[0]  :', data.Data[0]);
                    console.log('[thutien.getList_HSSV] Keys[0] :', Object.keys(data.Data[0]));
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
                    console.error('[thutien.getList_HSSV] FAIL:', data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                console.error('%c[thutien.getList_HSSV] !!! ERROR', 'color:#F44336;font-weight:bold', er);
                if (er && er.responseText) console.error('[thutien.getList_HSSV] responseText:', er.responseText);
                if (er && er.status) console.error('[thutien.getList_HSSV] status:', er.status, er.statusText);
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
                strFuntionName: "main_doc.PhieuThu.getList_HSSV()",
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
        var x = $("#tbldata_HSSV tbody tr");
        for (var i = 0; i < x.length; i++) {
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
        me.strHSSV_Id = me.dt_HS.find(e => e.ID == strSinhVien_id).QLSV_NGUOIHOC_ID;
        me.getDetail_DoiTuong(strSinhVien_id);
    },
    getDetail_DoiTuong: function (strId) {
        var me = this;
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (strId == me.dt_HS[i].ID) {
                me.dt_DoiTuongThu = me.dt_HS[i];
                me.viewForm_DoiTuong(me.dt_HS[i]);
                break;
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
        row += '<div style="width:668px;padding-bottom: 20px !important" class="info-user">';
        row += '<div style="width: 168px; float: left" class="user-img">';
        row += '<img style="margin: 0 auto; display: block;width: 100%" src="' + edu.system.getRootPathImg(data.ANH) + '">';
        row += '</div>';
        row += '<div style="width: 500px; float: left; margin-top: -7px" class="info-user-detail">';
        row += '<p class="pcard"><i class="fa-solid fa-laptop-binary colorcard"></i><span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.MASO) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-circle-user colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-birthday-cake colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-screen-users colorcard"></i> <span class="lang" key="">Lớp</span>: ' + edu.util.checkEmpty(data.DAOTAO_LOPQUANLY_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa-brands fa-leanpub colorcard"></i> <span class="lang" key="">Ngành</span>: ' + edu.util.checkEmpty(data.NGANHHOC_N1_TEN) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-chalkboard-user colorcard"></i> <span class="lang" key="">Khóa</span>: ' + edu.util.checkEmpty(data.KHOAHOC_N1_MA) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-graduation-cap colorcard"></i> <span class="lang" key="">Hệ</span>: ' + edu.util.checkEmpty(data.TENHEDAOTAO) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-location-dot colorcard"></i> <span class="lang" key="">Địa chỉ</span>: ' + edu.util.checkEmpty(data.TTLL_KHICANBAOTINCHOAI_ODAU) + '</p>';
        row += '<p class="pcard"><i class="fa fa-phone colorcard"></i> <span class="lang" key="">Số điện thoại</span>: ' + edu.util.checkEmpty(data.SODIENTHOAI_CANHAN) + '</p>';
        row += '<p class="pcard" style="padding-bottom: 20px !important"><i class="fa-solid fa-id-card colorcard"></i> <span class="lang" key="">CCCD</span>: ' + edu.util.checkEmpty(data.DINHDANH_CHINH_SO || data.CCCD || data.IDENTIFIER_NO) + '</p>';
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
    popover_TrangThai: function (strHS_Id, point) {
        var me = this;
        var data = null;
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (strHS_Id == me.dt_HS[i].ID)
                data = me.dt_HS[i];
        }
        if (data == null || data == undefined) data = me.dt_HS;
        var row = "";
        row += '<div style="width: 550px" class="box-TinhTrang">';
        row += '<p class="pcard"><i class="fa-solid fa-laptop-binary colorcard"></i> <span class="lang" key="">Số quyết định</span>: ' + edu.util.checkEmpty(data.QLSV_QUYETDINH_N1_SOQD) + '</p>';
        row += '<p class="pcard"><i class="fa-regular fa-calendar-day colorcard"></i> <span class="lang" key="">Ngày quyết định</span>: ' + edu.util.checkEmpty(data.QLSV_QUYETDINH_N1_NGAYQD) + '</p>';
        row += '<p class="pcard"><i class="fa-regular fa-calendar-day colorcard"></i> <span class="lang" key="">Ngày hiệu lực</span>: ' + edu.util.checkEmpty(data.QLSV_QUYETDINH_N1_NGAYHIEULUC) + '</p>';
        row += '<p class="pcard"><i class="fa-solid fa-address-card colorcard"></i> <span class="lang" key="">Nội dung</span>: ' + edu.util.checkEmpty(data.QLSV_QUYETDINH_N1_NOIDUNGQD) + '</p>';
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
        if (edu.util.checkValue(data.NIENKHOA_N1)) strHienThi += " - (" + data.NIENKHOA_N1 + ")";

        $("#txtTen_Ma_NS_SDT").html(strHienThi);
        me.strChuongTrinh_Id = data.DAOTAO_TOCHUCCHUONGTRINH_ID;
        //????????????????????????????????????????????????????
        $("#txtHoTenPTCEdit").html(strHoTen);
        $("#txtMaNCSPTCEdit").html(strMa);
        //????????????????????????????????????????????????????

        //[2]. TinhTrang — mỗi case có text fallback riêng để không phụ thuộc BE trả TEN
        // Field đúng theo response PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All là QLSV_TRANGTHAINGUOIHOC_MA/_TEN
        // (TRANGTHAINGUOIHOC_N1_MA/_TEN không tồn tại trong response -> luôn rỗng -> rơi vào default "Đang học").
        var strTrangThai_TenBE = edu.util.checkEmpty(data.QLSV_TRANGTHAINGUOIHOC_TEN);
        var strTrangThai_Ma = edu.util.returnEmpty(data.QLSV_TRANGTHAINGUOIHOC_MA);
        var colorLable = '';
        var icon = '';
        var strTrangThai_Ten = '';

        switch (strTrangThai_Ma) {
            case "CHUYENTRUONGDI":
                colorLable = 'label-danger'; icon = 'fa-sign-out'; strTrangThai_Ten = 'Chuyển trường đi'; break;
            case "NORMAL":
                colorLable = 'label-info'; icon = 'fa-users'; strTrangThai_Ten = 'Đang học'; break;
            case "CHUYENTRUONG":
                colorLable = 'label-info'; icon = 'fa-sign-in'; strTrangThai_Ten = 'Chuyển trường đến'; break;
            case "KHONGXACDINH":
                colorLable = 'label-warning'; icon = 'fa-exclamation-triangle'; strTrangThai_Ten = 'Không xác định'; break;
            case "GRADUATE":
                colorLable = 'label-success'; icon = 'fa-graduation-cap'; strTrangThai_Ten = 'Tốt nghiệp'; break;
            case "FORCEDROPOUT":
                colorLable = 'label-danger'; icon = 'fa-exclamation-triangle'; strTrangThai_Ten = 'Buộc thôi học'; break;
            case "CANHBAO":
                colorLable = 'label-warning'; icon = 'fa-exclamation-triangle'; strTrangThai_Ten = 'Cảnh báo'; break;
            case "RESERVE":
                colorLable = 'label-info'; icon = 'fa-user-secret'; strTrangThai_Ten = 'Bảo lưu'; break;
            case "DROPOUT":
                colorLable = 'label-warning'; icon = 'fa-exclamation-triangle'; strTrangThai_Ten = 'Thôi học'; break;
            case "XOATEN":
                colorLable = 'label-danger'; icon = 'fa-user-times'; strTrangThai_Ten = 'Xóa tên'; break;
            case "REPEATE":
                colorLable = 'label-warning'; icon = 'fa-exclamation-triangle'; strTrangThai_Ten = 'Học lại'; break;
            case "DUNGHOC":
                colorLable = 'label-warning'; icon = 'fa-ban'; strTrangThai_Ten = 'Đình chỉ'; break;
            default:
                colorLable = 'label-success'; icon = 'fa-graduation-cap'; strTrangThai_Ten = 'Đang học'; break;
        }
        if (!["CHUYENTRUONGDI", "NORMAL", "CHUYENTRUONG", "KHONGXACDINH", "GRADUATE", "FORCEDROPOUT", "CANHBAO", "RESERVE", "DROPOUT", "XOATEN", "REPEATE", "DUNGHOC"].includes(strTrangThai_Ma)) {
            console.warn('%c[thutien.viewForm_DoiTuong] TinhTrang MA "' + strTrangThai_Ma + '" KHÔNG khớp case nào -> rơi vào default "Đang học" (label-success). MASO=' + data.MASO, 'color:#F44336;font-weight:bold');
        }
        // Ưu tiên text từ BE nếu có (có trường hợp BE customize label), fallback hard-coded ở trên
        if (strTrangThai_TenBE && strTrangThai_TenBE.trim() !== '' && strTrangThai_TenBE !== '-') {
            strTrangThai_Ten = strTrangThai_TenBE;
        }
        displayTinhTrang(colorLable, icon, strTrangThai_Ten);

        function displayTinhTrang(colorLable, icon, strText) {
            // Không dùng replaceWith (xóa element khỏi DOM → lần chọn SV sau không render được).
            // Reset class label-*, gán class mới, đổi icon + text bằng .html() giữ id="txtTinhTrang".
            var $lbl = $("#txtTinhTrang");
            $lbl.removeClass('label-success label-info label-warning label-danger label-primary label-default')
                .addClass(colorLable)
                .attr('title', strText)
                .attr('name', data.ID)
                .html('<i class="fa ' + icon + '"></i> <span class="txtTinhTrang_Ten">' + strText + '</span>');
        }

        //[2b]. Info row: Lớp / Ngành / Khoa / Niên khóa
        $("#txtSV_Lop").text(edu.util.checkEmpty(data.DAOTAO_LOPQUANLY_N1_TEN) || '-');
        $("#txtSV_Nganh").text(edu.util.checkEmpty(data.NGANHHOC_N1_TEN) || '-');
        $("#txtSV_Khoa").text(edu.util.checkEmpty(data.KHOAHOC_N1_TEN) || '-');
        $("#txtSV_NienKhoa").text(edu.util.checkEmpty(data.NIENKHOA_N1) || '-');

        //[3]. call tinhtrangtaichinh
        me.getList_TinhTrangTaiChinh();
    },

    /*------------------------------------------
    --Discription: [3] GET DATA TinhTrangTaiChinh ==> 
    -------------------------------------------*/
    getList_TinhTrangTaiChinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTin/LayDSTinhTrangTaiChinh',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguonDuLieu_Id': ''
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinhTrangTaiChinhNoChung(data.Data.rsPhaiNopTongHopChung, "tbldata_KhoanNoChung_HDBL");
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
            colPos: { center: [0, 7] },
            aaData: data,
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
                        return '<input id="txtSoLuong' + aData.ID + '" class="inputsoluong" value="1" style="width: 50px" />';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtTongTien' + aData.TAICHINH_CACKHOANTHU_ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px" />';
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
    genTable_TinhTrangTaiChinhNoChung: function (data, strTableId) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTableId,
            colPos: { center: [0, 7] },
            aaData: data,
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
                        return '<input id="txtSoLuong' + aData.ID + '" class="inputsoluong" value="1" style="width: 50px" />';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtTongTien' + aData.TAICHINH_CACKHOANTHU_ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" name="' + aData.DAOTAO_THOIGIANDAOTAO_ID + '" id="' + aData.TAICHINH_CACKHOANTHU_ID + '" title="' + aData.HETHONGCHUNGTU_MA + '" />';
                    }
                }
                , {
                    //"mDataProp": "MATHANHTOANDINHDANH"
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDinhDanh' + aData.TAICHINH_CACKHOANTHU_ID + '" class="btnThanhToanQR" sotien="' + edu.util.formatCurrency(aData.SOTIEN) + '" noidung="' + edu.util.returnEmpty(aData.NOIDUNG) + '" name="' + edu.util.returnEmpty(aData.MATHANHTOANDINHDANH) + '"><i class="fa fa-credit-card" style="color:blue"></i> ' + edu.util.returnEmpty(aData.MATHANHTOANDINHDANH) + '</span>';
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
            row += '<div id="key_' + dataDot[i].ID + '" class="box-header with-border btnGetData">';
            row += '<h3 class="box-title">';
            row += '<a data-toggle="collapse" data-parent="#key_' + dataDot[i].ID + '" href="#qt_' + dataDot[i].ID + '" aria-expanded="true" class="collapsed">';
            row += '<span class="lang" key=""> Đợt ' + dataDot[i].TENDOT + '</span>';
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
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongNo) + '</td></tr></tfoot>';
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
            row += '<tfoot><tr style="font-weight: bold"><td>Tổng</td><td></td><td></td><td></td><td></td><td>' + edu.util.formatCurrency(iTongDu) + '</td></tr></tfoot>';
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
            var strTongThu = "Tổng tiền đã chọn: <span id='lblTongTienDaChon'>" + edu.util.formatCurrency(sum) + "</span>";
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
    getList_NguoiThuTien_NTT: function () {
        var me = this;
        // Bảng danh mục "NTT" chỉ có 1 record (MA=nguoithutien, TEN=<tên hiển thị>).
        // Cache vào strTenNguoiThuTien_NTT để render cho cả bảng phiếu và biên lai.
        edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "NTT" }, function (data) {
            if (data && data.length > 0 && data[0].TEN) {
                me.strTenNguoiThuTien_NTT = data[0].TEN;
            }
        });
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
            row += '<div class="col-lg-4 checkbox-inline user-check-print">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="ckbLKT_HDBL' + dataKhoanThu[i].ID + '" class="ckbLKT_HDBL" title="' + dataKhoanThu[i].TEN + '"' + strcheck + ' />';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanThu").html(row);
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
            renderPlace: ["dropDaNop_KhoanThu", "dropPhaiNop_KhoanThu", "dropPhaiNop_KhoanThu_Rieng", "dropDaNop_KhoanThu_Rieng", "dropDaRut_KhoanThu", "dropKhoanMien_KhoanThu"],
            type: "",
            title: "Chọn khoản thu"
        }
        edu.system.loadToCombo_data(obj);

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
                    me.genChiTietKhoanPhaiNop_XemThongTinAll(data.Data);
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblChiTietKhoan #" + e.ID).css("background-color", "orange");
                    })
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
                    me.dtKhoanMien = data.Data;
                    me.genDetail_KhoanDuocMien(data.Data);
                    me.genChiTietKhoanDuocMien_XemThongTinAll(data.Data);
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblChiTietKhoan #" + e.ID).css("background-color", "orange");
                    })
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
                    me.genChiTietKhoanDaNop_XemThongTinAll(data.Data);
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblChiTietKhoan #" + e.ID).css("background-color", "orange");
                    })
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
                    me.dtKhoanDaRut = data.Data;
                    me.genDetail_KhoanDaRut(data.Data);
                    me.genChiTietKhoanDaRut_XemThongTinAll(data.Data);
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblChiTietKhoan #" + e.ID).css("background-color", "orange");
                    })
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
    getList_KhoanRutRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTin/LayDSKhoanDaRut_Rieng',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoanDaRut = data.Data;
                    me.genDetail_KhoanRutRieng(data.Data);
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
                    me.genChiTietKhoanPhaiNopRieng_XemThongTinAll(data.Data);
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
                    me.genChiTietKhoanPhaiNopChung_XemThongTinAll(data.Data);
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
                    me.genChiTietKhoanThuaRieng_XemThongTinAll(data.Data);
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
                    me.genChiTietKhoanThuaChung_XemThongTinAll(data.Data);
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
                    me.dtKhoanDaNop_Rieng = data.Data;
                    me.genTable_KhoanThu(data.Data, "tblDaNopRieng");
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblDaNopRieng #" + e.ID).css("background-color", "orange");
                    })
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
                    me.dtKhoanPhaiNop_Rieng = data.Data;
                    me.genTable_KhoanThu(data.Data, "tblPhaiNopRieng");
                    data.Data.forEach(e => {
                        if (e.KHONGHACHTOAN == 1) $("#tblPhaiNopRieng #" + e.ID).css("background-color", "orange");
                    })
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
        me.dTongDu = dNoCo;
        var strHienThi = "Chưa xác định";
        if (edu.util.floatValid(dNoCo)) {
            if (dNoCo > 0) strHienThi = '<span style="color: #00c0ef"><i class="fa fa-bitbucket"></i> <span class="lang" key="">Tổng dư</span>: ' + edu.util.formatCurrency(dNoCo) + '</span>';
            if (dNoCo < 0) strHienThi = '<span style="color: #dd4b39"><i class="fa fa-cubes"></i> <span class="lang" key="">Tổng nợ</span>: ' + edu.util.formatCurrency(dNoCo) + '</span>';
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

    save_KhoanPhaiNop: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_PhaiNop',

            'strId': me.strKhoanThu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strPhaiNop_SoTien'),
            'strNoiDung': edu.util.getValById('strPhaiNop_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropPhaiNop_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropPhaiNop_KhoanThu'),
            'dKhongHachToan': edu.util.getValById('dropPhaiNop_KhongHachToan'),
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
        thead += '<th class="td-left">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-left">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '<th class="td-center">Chi tiết</th>';
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
                        return '<span><a class="btn btn-default btnChiTietKhoanThu" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
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
    genChiTietKhoanPhaiNop_XemThongTinAll: function (data) {
        var me = this;
        me.dtKhoanPhaiNop = data;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNop_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>'; 
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';        
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [2, 3],
                right: [4],
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
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },

    save_KhoanMien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_Mien',
            'type': 'POST',
            'strId': me.strKhoanThu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayTao': edu.util.getValById('strKhoanMien_NgayTao'),
            'dCoCapNhatChoChungTu': 1,
            'dSoTien': edu.util.getValById('strKhoanMien_SoTien'),
            'strNoiDung': edu.util.getValById('strKhoanMien_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropKhoanMien_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropKhoanMien_KhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropKhoanMien_HinhThucThu'),
            'dKhongHachToan': edu.util.getValById('dropKhoanMien_KhongHachToan'),
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
                    me.getList_KhoanDuocMien();
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
    delete_KhoanMien: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanMien/Xoa',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_KhoanDuocMien();
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
        thead += '<th class="td-left">Chính sách</th>';
        thead += '<th class="td-right">Số tiền được miễn</th>';
        thead += '<th class="td-center">Phần trăm miễn</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '<th class="td-center">Chi tiết</th>';
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
                    "mDataProp": "CHEDOCHINHSACH_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "PHANTRAMMIEN"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
                , {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietKhoanMien" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        //return '';
                        return '<span><a class="btn btn-default btnEdit btnEditKhoanMien" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    save_KhoanDaNop: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_DaNop',

            'strId': me.strKhoanThu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strDaNop_SoTien'),
            'strNgayTao': edu.util.getValById('strDaNop_NgayTao'),
            'dCoCapNhatChoChungTu': 1,
            'strNoiDung': edu.util.getValById('strDaNop_NoiDung'),
            'dKhongHachToan': edu.util.getValById('dropDaNop_KhongHachToan'),
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDaRut" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    genDetail_KhoanRutRieng: function (data) {
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditRutRieng" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
        var thead = '';
        var $table = "tblRutRieng";
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
        thead += '<th class="td-center">Sửa</th>';
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditRutRieng" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        thead += '<th class="td-right">Mã thanh toán định danh</th>';
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
                , {
                    "mDataProp": "MATHANHTOANDINHDANH"
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
    genChiTietKhoanThuaRieng_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanThuaRieng_XemThongTinAll";
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
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4], 
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
    genChiTietKhoanThuaChung_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanThuaChung_XemThongTinAll";
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
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        console.log(data);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [1, 2], 
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
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return me.strTenNguoiThuTien_NTT || edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU);
                    }
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
        thead += '<th class="td-center">Seri</th>';
        thead += '<th class="td-center">Loại khoản</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt học</th>';
        thead += '<th class="td-center">Nội dung</th>';
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
                right: [7]
            },
            "aoColumns": [
                {
                    "mDataProp": "SOPHIEUTHU"
                }
                ,
                {
                    "mDataProp": "KYHIEU"
                }
                ,
                {
                    "mDataProp": "KHOANTHU"
                }
                ,
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                ,
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                ,
                {
                    "mDataProp": "NOIDUNG"
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
                        //return '';
                        return '<a class="detail_KhoanRut" style="cursor: pointer;" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [7]);
            $('#' + $table + ' tfoot td:eq(7)').attr('style', 'text-align: right');
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
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return me.strTenNguoiThuTien_NTT || edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU);
                    }
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
    genChiTietKhoanDaNop_XemThongTinAll: function (data) {
        var me = this;
        me.dtKhoanDaNop = data;
        var thead = '';
        var $table = "tblChiTietKhoanDaNop_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';        
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
                left: [2,3],
                right: [4]
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
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDuocMien_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanDuocMien_XemThongTinAll";
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
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>';
                    }
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

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDaRut_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanDaRut_XemThongTinAll";
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
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopChung_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNopChung_XemThongTinAll";
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
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopRieng_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNopRieng_XemThongTinAll";
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
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    
    save_KhoanDaRut: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_Rut',

            'strId': me.strKhoanRut_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strDaRut_SoTien'),
            'strNgayTao': edu.util.getValById('strDaRut_NgayTao'),
            'dCoCapNhatChoChungTu': 1,
            'strNoiDung': edu.util.getValById('strDaRut_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropDaRut_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropDaRut_KhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropDaRut_HinhThucThu'),
            'dKhongHachToan': edu.util.getValById('dropDaRut_KhongHachToan'),
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
                    me.getList_KhoanDaRut();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
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
    delete_KhoanDaRut: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanRut/Xoa',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_KhoanDaRut();
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


    save_KhoanRutRieng: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_Rut_Rieng',

            'strId': me.strKhoanRut_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strDaRut_SoTien'),
            'strNgayTao': edu.util.getValById('strDaRut_NgayTao'),
            'dCoCapNhatChoChungTu': 1,
            'strNoiDung': edu.util.getValById('strDaRut_NoiDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropDaRut_ThoiGian'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropDaRut_KhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropDaRut_HinhThucThu'),
            'dKhongHachToan': edu.util.getValById('dropDaRut_KhongHachToan'),
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
                    me.getList_KhoanRutRieng();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
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
    delete_KhoanRutRieng: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_ThongTin/Xoa_TaiChinh_Rut_Rieng',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_KhoanRutRieng();
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
        edu.util.viewValById("dropDaNop_KhongHachToan", data.KHONGHACHTOAN);
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
        edu.util.viewValById("dropPhaiNop_KhongHachToan", data.KHONGHACHTOAN);
        edu.util.viewValById("strPhaiNop_NoiDung", data.NOIDUNG);
    },
    viewForm_KhoanDaRut: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanDaRut').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropDaRut_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDaRut_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strDaRut_SoTien", data.SOTIEN);
        edu.util.viewValById("strDaRut_NgayTao", data.NGAYTAO_DD_MM_YYYY);
        edu.util.viewValById("strDaRut_NoiDung", data.NOIDUNG);
        edu.util.viewValById("dropDaRut_HinhThucThu", data.HINHTHUCTHU_ID);
        edu.util.viewValById("dropDaRut_KhongHachToan", data.KHONGHACHTOAN);
    },
    viewForm_KhoanMien: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanMien').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropKhoanMien_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropKhoanMien_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strKhoanMien_SoTien", data.SOTIEN);
        edu.util.viewValById("strKhoanMien_NoiDung", data.NOIDUNG);
        edu.util.viewValById("dropKhoanMien_HinhThucThu", data.HINHTHUCTHU_ID);
        edu.util.viewValById("strKhoanMien_NgayTao", data.NGAYTAO_DD_MM_YYYY);
        edu.util.viewValById("dropKhoanMien_KhongHachToan", data.KHONGHACHTOAN);
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
        thead += '<th class="td-center td-fixed">Sửa</th>';
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
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditKhoanRieng" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
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
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return me.strTenNguoiThuTien_NTT || edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU);
                    }
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
                    "mData": "TAIKHOAN_NGUOITHU",
                    "mRender": function (nRow, aData) {
                        return me.strTenNguoiThuTien_NTT || edu.util.returnEmpty(aData.TAIKHOAN_NGUOITHU);
                    }
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
            var strNgayOverride = me._getNgayLapPhieuOverride();
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
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
                'strNgayXuatChungTu': strNgayOverride || me.strNgayXuatChungTu,
            };
            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        informSaveSuccess(data.Message);
                        var strPhieuThu_Id = data.Id;
                        me.strPhieuThu_Id = strPhieuThu_Id;
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", "MauInPhieuThu", main_doc.PhieuThu.changeWidthPrint);

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
            var strNgayOverride = me._getNgayLapPhieuOverride();
            var obj_save = {
                'action': 'TC_TaiChinh_Rut/ThemMoi',
                'versionAPI': 'v1.0',
                'strNguoiThucHien_Id': edu.system.userId,
                'strNgayChungTuRut': strNgayOverride || edu.util.getValById('txtNgayChungTu'),
                'strTaiChinh_CacKhoanThu_Ids': strTaiChinh_CacKhoanThu_Ids,
                'strTaiChinh_SoTien_s': strSoTienRut_s,
                'strTaiChinh_NoiDung_s': strNoiDungRut_s,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strCanDoiKhoanPhaiNop': arrCanDoiKhoanPhaiNop.toString(),
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
                        edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAIRUT", "MauInPhieuThu", main_doc.PhieuThu.changeWidthPrint);
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
            me._hideNgayLapPhieuEditor();
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
            strSoLuong += getSoTien(x[i].cells[4].innerHTML, 0) + ",";
            strDonGia += getSoTien(x[i].cells[5].innerHTML, 0) + ",";
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
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.PhieuThu.changeWidthPrint);

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
            me._hideNgayLapPhieuEditor();
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
            var uuid = main_doc.PhieuThu.arrDonViTinh[i];
            var strDonViTinh = $("#" + uuid).val();
            var strDonViTinhTen = "";
            if (strDonViTinh != "") strDonViTinhTen = $("#" + uuid + " option:selected").text().trim();
            arrDonViTinh.push(strDonViTinh);
            arrDonViTinhTen.push(strDonViTinhTen);
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
        save(strIds, strThoiGianDaoTaoIds, strNoiDungs, strSoLuong, strDonGia, strSoTien);

        function getSoTien(dSoTien, dRecovery) {
            //var dSoTien = $("#lbThanhTien" + strId).html();
            dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
            dSoTien = parseFloat(dSoTien);
            return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
        }

        function save(strTaiChinh_CacKhoanThu_Ids, strThoiGianDaoTaoIds, strNoiDung_s, strSoLuong_s, strDonGia_s, strSoTien_s) {
            var strHinhThucThu_TEN = $("#dropHinhThucThuPTC_PT_Edit option:selected").text();
            var tempcheck = $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("name")
            if (tempcheck != undefined && tempcheck != 'undefined' && tempcheck != 'null') {
                strHinhThucThu_TEN = tempcheck;
            }
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
                'strDonViTinhTen_s': arrDonViTinhTen.toString(),
                'strLoaiTienTe_Ids': arrLoaiTienTe.toString(),
                'strCanDoiKhoanPhaiNop': arrCanDoiKhoanPhaiNop.toString(),
                'strLoaiTienTe': strLoaiTienTeTen,
                'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
                'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTaoIds,
                'strDaoTao_ToChucCT_Id': "",
                'strHinhThucThu_Id': edu.util.getValById("dropHinhThucThuPTC_PT_Edit"),
                'strHinhThucThu_MA': $("#dropHinhThucThuPTC_PT_Edit option:selected").attr("id"),
                'strHinhThucThu_TEN': strHinhThucThu_TEN,
                'strXuatHoaDonTrucTiep': '',
                'strNguonDuLieu_Id': '',
                'dKhongSinhChungTu': 0,
                'strPhieuThuTheoPhoiSan_Id': '',
                'strPhuongThuc_MA': strPhuongThuc_Ma,
                'strNgayXuatChungTu': me._getNgayLapPhieuOverride() || me.strNgayXuatChungTu,
                'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,

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
                        edu.extend.getData_Phieu(strPhieuThu_Id, "HOADON", "MauInPhieuThu", main_doc.PhieuThu.changeWidthPrint);

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
                'strMoTa': strPhuongThucNhap,
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
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html?v=' + edu.util.uuid(), function () {
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
            me._showNgayLapPhieuEditor(me.strNgayXuatChungTu);


            $(".txtNgaySinhPTC_PT_Edit").html(edu.util.returnEmpty(data.NGAYSINH));
            $(".txtMaSoThue_PT_Edit").html(edu.util.returnEmpty(data.MASOTHUECANHAN));
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
            $("#btnHuy_HDBL").hide();
            if (document.getElementById('btnSaveHDBL') == undefined) {
                // Structure chuẩn: 1 div wrapper .aps-btn + 1 anchor .btn chứa icon+text (giống #btnXuat_HD, .btnXuat_HDDT).
                // Style chi tiết (filled xanh đậm CTA chính) do CSS #zoneActionHoaDon #btnSaveHDBL .btn ở thutien.html quản lý.
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHDBL" class="aps-btn"><a title="Xuất biên lai" class="btn btn-primary"><i class="far fa-receipt"></i> Xuất biên Lai</a></div>');
                $("#btnSaveHDBL").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_HDBL('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    });
                });
                if (bThuTien) {
                    $("#btnThuTien").show();
                    // Nút "Xem trước HĐ" (grey neutral) đặt đầu nhóm HDDT → cho user preview
                    // mẫu hóa đơn TRƯỚC KHI phát hành thật qua HDDT provider (VNPT/MISA/...).
                    var row = '<div id="btnPreviewHD" class="aps-btn"><a title="Xem trước hóa đơn (chưa phát hành)" class="btn"><i class="fal fa-eye"></i> Xem trước HĐ</a></div>';
                    row += me.strHDDT;
                    $("#zoneActionXuatHoaDon").html(row);
                    $("#btnPreviewHD").click(function (e) {
                        e.stopImmediatePropagation();
                        me.showPreviewHoaDon();
                    });
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
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
                    //var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('span')[0].innerHTML;
                    var dSoTien = x[i].parentNode.parentNode.cells[6].getElementsByTagName('input')[0].value;
                    var strSoLuong = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    idem++;
                    var rows = ''; var uuid = edu.util.uuid();
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
            console.log(me["arrDonViTinh"])
            console.log(main_doc.PhieuThu.arrDonViTinh)
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
        $("#" + zoneMauIn).load(strDuongDan + strMauXem + '.html?v=' + edu.util.uuid(), function () {
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
            $(".txtMaNCSPTC_PT_Edit").html(data.MASO);
            $(".txtHoTenPTC_PT_Edit").html(data.HODEM + " " + data.TEN);
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
            me._showNgayLapPhieuEditor(strNgayChungTu);
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
                // Structure chuẩn: 1 div wrapper .aps-btn + 1 anchor .btn chứa icon+text (giống #btnXuat_HD, .btnXuat_HDDT).
                // Style chi tiết (filled xanh đậm CTA chính) do CSS #zoneActionHoaDon #btnSaveHDBL .btn ở thutien.html quản lý.
                $("#zoneActionHoaDon").prepend('<div id="btnSaveHDBL" class="aps-btn"><a title="Xuất biên lai" class="btn btn-primary"><i class="fal fa-file-invoice"></i> Xuất biên lai</a></div>');
                $("#btnSaveHDBL").click(function (e) {
                    e.stopImmediatePropagation(); edu.system.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', 'w');
                    $("#btnYes").click(function (e) {
                        $('#myModalAlert').modal('hide');
                        me.save_HDBL('tbldataPhieuThuPopup_PT_Edit', bThuTien);
                    });
                });
                if (bThuTien) {
                    $("#btnThuTien").show();
                    // Bỏ class btn-success — global styles-content.css có rule .btn-success { background:#4d8d41 !important }
                    // đè lên bg trắng outline teal mong muốn. Style cụ thể do CSS #zoneActionHoaDon #btnXuat_HD .btn quản lý.
                    // Nút "Xem trước HĐ" đặt đầu nhóm → cho user preview mẫu hóa đơn TRƯỚC KHI phát hành thật.
                    var row = '<div id="btnPreviewHD" class="aps-btn"><a title="Xem trước hóa đơn (chưa phát hành)" class="btn"><i class="fal fa-eye"></i> Xem trước HĐ</a></div>';
                    row += '<div id="btnXuat_HD" class="aps-btn"><a title="Xuất hóa đơn" class="btn"><i class="fal fa-file-invoice"></i> Xuất hóa đơn</a></div>';
                    row += me.strHDDT;
                    $("#zoneActionXuatHoaDon").html(row);
                    $("#btnPreviewHD").click(function (e) {
                        e.stopImmediatePropagation();
                        me.showPreviewHoaDon();
                    });
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
                    var strKhoanThu = x[i].parentNode.parentNode.cells[3].innerHTML;
                    var strNoiDung = x[i].parentNode.parentNode.cells[4].getElementsByTagName('input')[0].value;
                    var dSoTien = x[i].parentNode.parentNode.cells[6].getElementsByTagName('input')[0].value;
                    var strSoLuong = x[i].parentNode.parentNode.cells[5].getElementsByTagName('input')[0].value;
                    var strCanDoiKhoanPhaiNop = 0;

                    if (dSoTien == 0) continue;
                    var strKhoanThu_Id = x[i].id;//x[i].id Do chưa có id để tạm hệ số i "Nhớ thêm"
                    if ($(x[i].parentNode.parentNode.cells[8].getElementsByTagName('input')[0]).is(':checked')) strCanDoiKhoanPhaiNop = 1;
                    idem++; var uuid = edu.util.uuid();
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
            me.tinhHeSoGiaTien('tbldataPhieuThuPopup_PT_Edit', 4, 5, 6);
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
            console.log(me["arrDonViTinh"])
            console.log(main_doc.PhieuThu.arrDonViTinh)
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
            renderPlace: main_doc.PhieuThu.arrDonViTinh,
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
    genHTML_PhieuRut: function () {
        $(".txtTenPhieuBienLai").html("BIÊN LAI RÚT TIỀN");
        main_doc.PhieuThu.changeWidthPrint();
    },
    //#region Tab8 -- Tài chính thu hộ
    viewForm_KhoanPhaiNop_Rieng: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanPhaiNop_Rieng').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropPhaiNop_KhoanThu_Rieng", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropPhaiNop_ThoiGian_Rieng", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strPhaiNop_SoTien_Rieng", data.SOTIEN);
        edu.util.viewValById("strPhaiNop_NoiDung_Rieng", data.NOIDUNG);
        edu.util.viewValById("dropPhaiNop_Rieng_KhongHachToan", data.KHONGHACHTOAN);
    },
    viewForm_KhoanDaNop_Rieng: function (data) {
        var me = this;
        //call popup --Edit
        $('#myModalKhoanDaNop_Rieng').modal('show');
        $("#btnNotifyModal").remove();
        //view data --Edit
        edu.util.viewValById("dropDaNop_KhoanThu_Rieng", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDaNop_ThoiGian_Rieng", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("strDaNop_SoTien_Rieng", data.SOTIEN);
        edu.util.viewValById("dropDaNop_Rieng_KhongHachToan", data.KHONGHACHTOAN);
        edu.util.viewValById("strDaNop_NgayTao_Rieng", data.NGAYTAO_DD_MM_YYYY);
        edu.util.viewValById("strDaNop_NoiDung_Rieng", data.NOIDUNG);
        edu.util.viewValById("dropDaNop_HinhThucThu_Rieng", data.HINHTHUCTHU_ID);
    },
    save_KhoanPhaiNop_Rieng: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin/Sua_TaiChinh_PhaiNop_Rieng',

            'strId': me.strKhoanThu_Rieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strPhaiNop_SoTien_Rieng'),
            'strNoiDung': edu.util.getValById('strPhaiNop_NoiDung_Rieng'),
            'dKhongHachToan': edu.util.getValById('dropPhaiNop_Rieng_KhongHachToan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropPhaiNop_ThoiGian_Rieng'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropPhaiNop_KhoanThu_Rieng'),
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
                    me.getList_PhaiNopRieng();
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
    delete_KhoanPhaiNop_Rieng: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanPhaiNop/Xoa_TaiChinh_PhaiNop_Rieng',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_PhaiNopRieng();
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
    delete_KhoanDaNop_Rieng: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanDaNop/Xoa_TaiChinh_DaNop_Rieng',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                    me.getList_DaNopRieng();
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
    save_KhoanDaNop_Rieng: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/EjQgHhUgKAIpKC8pHgUgDy4xHhMoJC8m',
            'func': 'pkg_taichinh_thongtin.Sua_TaiChinh_DaNop_Rieng',
            'iM': edu.system.iM,
            'strId': me.strKhoanThu_Rieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('strDaNop_SoTien_Rieng'),
            'strNgayTao': edu.util.getValById('strDaNop_NgayTao_Rieng'),
            'dKhongHachToan': edu.util.getValById('dropDaNop_Rieng_KhongHachToan'),
            'dCoCapNhatChoChungTu': 1,
            'strNoiDung': edu.util.getValById('strDaNop_NoiDung_Rieng'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropDaNop_ThoiGian_Rieng'),
            'strDaoTao_CacKhoanThu_Id': edu.util.getValById('dropDaNop_KhoanThu_Rieng'),
            'strHinhThucThu_Id': edu.util.getValById('dropDaNop_HinhThucThu_Rieng'),
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
                    me.getList_DaNopRieng();
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
    //#endregion
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
        //var strKhoIn = $("#dropKhoInPhieuThu").val() || "A5 landscape";
        //edu.extend.remove_PhoiIn("MauInPhieuThu");
        //me._printPhieuThuCustom('MauInPhieuThu', strKhoIn);
        //edu.system.switchTab('tab_1');
        //me.closePhieu();
    },
    // Custom print riêng cho phiếu thu — thay edu.util.printHTML shared vì nó không carry CSS
    // scoped #MauInPhieuThu sang popup window → khung table biến mất + họ tên wrap.
    // Inject đầy đủ CSS cho popup: border table, Times New Roman, nowrap họ tên/mã/ngày sinh.
    _printPhieuThuCustom: function (divId, strKhoIn) {
        strKhoIn = strKhoIn === 'A4 landscape' ? 'A4 landscape' : 'A5 landscape';
        var strChieuRongTrang = strKhoIn === 'A4 landscape' ? '297mm' : '210mm';
        var strChieuRongNoiDung = strKhoIn === 'A4 landscape' ? '287mm' : '200mm';
        var strLayoutA4 = strKhoIn === 'A4 landscape'
            ? '#MauInPhieuThu > .pr-containt { min-height: 200mm !important; padding: 8mm !important; display: flex !important; flex-direction: column !important; }'
                + '#MauInPhieuThu > .pr-containt > .pr-body { flex: 1 1 auto !important; }'
                + '#MauInPhieuThu > .pr-containt > .pr-footer { margin-top: auto !important; }'
            : '';
        var content = document.getElementById(divId).innerHTML;
        var w = window.open('', 'Print', 'height=800,width=1200');
        
        // CSS tập trung vào việc căn giữa và hiển thị đúng
        var css = ''
                /* Mặc định A5 ngang; người dùng có thể chọn A4 ngang tại dropdown Khổ in. */
                + '@page { size: ' + strKhoIn + '; margin: 0; }'
                + 'html, body { margin: 0; padding: 0; width: ' + strChieuRongTrang + '; }'
                + 'body { font-family: "Times New Roman", Cambria, serif; font-size: 10pt; line-height: 1.25; color: #000; padding: 5mm; background: #fff; text-align: center; }'
            + '* { font-family: "Times New Roman", Cambria, serif; box-sizing: border-box; }'
                /* Chiều rộng nội dung thay đổi theo khổ giấy được chọn, vẫn giới hạn bởi max-width.
               page-break-inside: avoid → phòng khi content vẫn hơi tràn, browser vẫn cố nén 1 trang thay vì cắt */
                + '#MauInPhieuThu { width: ' + strChieuRongNoiDung + '; max-width: 100%; margin: 0 auto; padding: 0; text-align: left; page-break-inside: avoid; break-inside: avoid; }'
            /* Bỏ `width: 100%` cho descendants → nếu template có wrapper width < 200mm, `margin: 0 auto !important` sẽ căn giữa nó trong container.
               `!important` để override inline style `margin-left: XXpx` mà template server có thể set. */
            + '#MauInPhieuThu > div, #MauInPhieuThu > table, #MauInPhieuThu > p, #MauInPhieuThu > center, #MauInPhieuThu > span, #MauInPhieuThu > h1, #MauInPhieuThu > h2, #MauInPhieuThu > h3, #MauInPhieuThu > h4 { max-width: 100%; margin: 0.02cm auto !important; padding: 0; }'
                + '#MauInPhieuThu > .pr-containt { width: 100% !important; max-width: 100% !important; }'
                + strLayoutA4
            + '#MauInPhieuThu table { border-collapse: collapse; width: 100%; margin: 1px auto; border: none; }'
            + '#MauInPhieuThu table td, #MauInPhieuThu table th { border: none; padding: 2px 4px; vertical-align: middle; font-size: 10pt; line-height: 1.5; text-align: left; }'
            + '#MauInPhieuThu table.tblHangHoa { border: 1.2px solid #000; }'
            + '#MauInPhieuThu table.tblHangHoa td, #MauInPhieuThu table.tblHangHoa th { border: 1px solid #000; padding: 2px 5px; }'
            + '#MauInPhieuThu table.tblHangHoa th { text-align: center; font-weight: bold; }'
            + '#MauInPhieuThu h1, #MauInPhieuThu h2 { font-size: 13pt; margin: 0.08cm 0; text-align: center; text-transform: uppercase; font-weight: bold; }'
            + '#MauInPhieuThu h3, #MauInPhieuThu h4 { font-size: 10.5pt; margin: 0.06cm 0; text-align: center; text-transform: uppercase; font-weight: bold; }'
            + '#MauInPhieuThu p { line-height: 1.3; margin: 0.02cm 0; font-size: 10pt; }'
            + '#MauInPhieuThu [class*="txtHoTen_BenB_"], #MauInPhieuThu [class*="txtMa_BenB_"], #MauInPhieuThu [class*="txtNgaySinh_BenB_"], #MauInPhieuThu [class*="txtMaSoThue"] { display: inline; white-space: nowrap; margin: 0; padding: 0; font-weight: bold; }'
            + '#MauInPhieuThu [class*="txtLop_BenB_"], #MauInPhieuThu [class*="txtNganh_BenB_"], #MauInPhieuThu [class*="txtKhoa_BenB_"] { display: inline; word-break: keep-all; margin: 0; padding: 0; }'
            + '#MauInPhieuThu [class*="txtTongTien"] { font-weight: bold; }'
            + '#MauInPhieuThu select { border: none; background: transparent; -webkit-appearance: none; -moz-appearance: none; appearance: none; padding: 0; font-family: inherit; font-size: inherit; color: #000; }'
            + 'table, tr, td, th { page-break-inside: avoid; }'
            + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }'
            /* Tên trường sau khi viết tắt "ĐẠI HỌC" → "ĐH": nowrap để không xuống dòng,
               cell cha auto-width, có thể giảm font 1pt nếu vẫn dài. */
            + '#MauInPhieuThu .tenTruongVietTat { white-space: nowrap !important; word-break: keep-all !important; overflow: visible !important; font-size: 8.5pt !important; letter-spacing: -0.3px; display: inline-block !important; }'
            + '#MauInPhieuThu td:has(.tenTruongVietTat), #MauInPhieuThu th:has(.tenTruongVietTat) { width: auto !important; min-width: 0 !important; max-width: none !important; white-space: nowrap !important; overflow: visible !important; }';

        // Script inline chạy trong popup: 2 nhiệm vụ
        //  (1) Detect bảng hàng hóa/khoản thu → gắn class .tblHangHoa để CSS apply border.
        //  (2) Xóa <br> đứng ngay trước value SV (họ tên/mã/ngày sinh/địa chỉ) → giữ label+value 1 dòng.
        var scriptDetect = ''
            + '<script>'
            + '(function() {'
            /* (0) Dọn <br> ở đầu #MauInPhieuThu (trước content đầu tiên) — bỏ khoảng trắng dòng đầu */
            + '  var mauIn = document.getElementById("' + divId + '");'
            + '  if (mauIn) {'
            + '    while (mauIn.firstChild) {'
            + '      var f = mauIn.firstChild;'
            + '      if (f.nodeType === 3 && !(f.textContent || "").trim()) { mauIn.removeChild(f); continue; }'
            + '      if (f.nodeName === "BR") { mauIn.removeChild(f); continue; }'
            + '      break;'
            + '    }'
            + '    if (mauIn.firstElementChild) {'
            + '      mauIn.firstElementChild.style.marginTop = "0";'
            + '      mauIn.firstElementChild.style.paddingTop = "0";'
            + '    }'
            + '  }'
            /* (1) Tag bảng hàng hóa/khoản thu.
               Heuristic: text chứa keyword + (có <th> header HOẶC có >= 3 cột).
               Bảng info đơn vị/người mua chỉ có <td> (label:value, 1-2 cột) → bị loại. */
            + '  var tables = document.querySelectorAll("#' + divId + ' table");'
            + '  for (var i = 0; i < tables.length; i++) {'
            + '    var t = tables[i];'
            + '    var probe = ((t.textContent || "").substring(0, 500)).toLowerCase();'
            + '    var matchText = /hàng hóa|dịch vụ|khoản thu|thành tiền|đơn giá|số lượng|số tiền|tt|stt/i.test(probe);'
            + '    var hasTH = t.querySelectorAll("th").length >= 2;'
            + '    var firstRow = t.rows && t.rows[0];'
            + '    var nCols = firstRow ? firstRow.cells.length : 0;'
            + '    var isDataTable = hasTH || nCols >= 3;'
            + '    if (matchText && isDataTable) {'
            + '      t.className = (t.className || "") + " tblHangHoa";'
            + '    }'
            + '  }'
            /* (2) Xóa <br> ngay trước value SV (label + value về cùng 1 dòng) */
            + '  var valSelectors = ['
            + '    "[class*=\\"txtHoTen_BenB_\\"]",'
            + '    "[class*=\\"txtMa_BenB_\\"]",'
            + '    "[class*=\\"txtNgaySinh_BenB_\\"]",'
            + '    "[class*=\\"txtDiaChi_BenB_\\"]",'
            + '    "[class*=\\"txtLop_BenB_\\"]",'
            + '    "[class*=\\"txtNganh_BenB_\\"]",'
            + '    "[class*=\\"txtKhoa_BenB_\\"]",'
            + '    "[class*=\\"txtMaSoThue_BenB_\\"]",'
            + '    ".txtHoTenPTC_PT_Edit",'
            + '    ".txtMaNCSPTC_PT_Edit",'
            + '    ".txtNgaySinhPTC_PT_Edit",'
            + '    ".txtDiaChiPTC_PT_Edit",'
            + '    ".txtLopPTC_PT_Edit",'
            + '    ".txtNganhPTC_PT_Edit",'
            + '    ".txtKhoaPTC_PT_Edit"'
            + '  ].join(",");'
            + '  var vals = document.querySelectorAll("#' + divId + ' " + valSelectors);'
            + '  vals.forEach(function(el) {'
            + '    var p = el.previousSibling;'
            /* Bỏ qua text-node whitespace */
            + '    while (p && p.nodeType === 3 && !(p.textContent || "").trim()) {'
            + '      p = p.previousSibling;'
            + '    }'
            + '    if (p && p.nodeName === "BR") {'
            + '      p.parentNode.removeChild(p);'
            + '    }'
            + '  });'
            /* (3) Đẩy ghi chú "Phải giữ biên lai" xuống thêm, cách khối chữ ký.
               Gắn class .ghiChuBienLai — CSS scoped sẽ apply margin với !important
               để đè rule "div { margin-top:0 !important }" chung. */
            + '  var mauIn2 = document.getElementById("' + divId + '");'
            + '  if (mauIn2) {'
            + '    var all = mauIn2.querySelectorAll("*");'
            + '    for (var j = 0; j < all.length; j++) {'
            + '      var e = all[j];'
            + '      if (e.children.length === 0 && /phải giữ biên lai/i.test(e.textContent || "")) {'
            /* Bắt block container (block-level ancestor). Nếu leaf là inline (span/i/b),
               đi lên đến khi gặp block (p/div/td). */
            + '        var target = e;'
            + '        while (target && target !== mauIn2) {'
            + '          var tn = target.tagName;'
            + '          if (tn === "P" || tn === "DIV" || tn === "TD" || tn === "TR" || tn === "TABLE") break;'
            + '          target = target.parentNode;'
            + '        }'
            + '        if (target && target !== mauIn2) {'
            + '          target.className = (target.className || "") + " ghiChuBienLai";'
            + '        } else {'
            + '          e.className = (e.className || "") + " ghiChuBienLai";'
            + '        }'
            + '        break;'
            + '      }'
            + '    }'
            + '  }'
            /* (4) Tên trường viết tắt: force cell cha (td/th) auto-width + nowrap.
               Cần thiết vì CSS :has() có thể không support ở popup Chrome cũ. */
            + '  var mauIn3 = document.getElementById("' + divId + '");'
            + '  if (mauIn3) {'
            + '    var vt = mauIn3.querySelectorAll(".tenTruongVietTat");'
            + '    vt.forEach(function(vel) {'
            + '      vel.style.setProperty("white-space", "nowrap", "important");'
            + '      vel.style.setProperty("word-break", "keep-all", "important");'
            + '      vel.style.setProperty("overflow", "visible", "important");'
            /* Đi lên tìm td/th cha, ép width auto + nowrap */
            + '      var pp = vel.parentNode;'
            + '      while (pp && pp !== mauIn3) {'
            + '        var pn = pp.tagName;'
            + '        if (pn === "TD" || pn === "TH") {'
            + '          pp.style.setProperty("width", "auto", "important");'
            + '          pp.style.setProperty("min-width", "0", "important");'
            + '          pp.style.setProperty("max-width", "none", "important");'
            + '          pp.style.setProperty("white-space", "nowrap", "important");'
            + '          pp.removeAttribute("width");'
            + '          break;'
            + '        }'
            + '        pp = pp.parentNode;'
            + '      }'
            + '    });'
            + '  }'
            + '})();'
            + '<\/script>';

        w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Phiếu thu tiền</title>');
        w.document.write('<style>' + css + '</style>');
        w.document.write('</head><body><div id="' + divId + '">' + content + '</div>');
        w.document.write(scriptDetect);
        w.document.write('</body></html>');
        w.document.close();
        w.focus();
        setTimeout(function () {
            try { w.print(); } catch (e) { console.log('Print error:', e); }
            setTimeout(function () {
                try { w.close(); } catch (e) { }
            }, 500);
        }, 400);
        return true;
    },
    closePhieu: function () {
        var me = this;
        me._hideNgayLapPhieuEditor();
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
    /*------------------------------------------
    --Discription: Preview hóa đơn điện tử trước khi phát hành
    -- Clone HTML mẫu phiếu (#MauInPhieuThu) vào modal + banner watermark "XEM TRƯỚC"
    -- User review; bấm "Xuất HĐ điện tử ngay" trong modal footer → trigger #btnXuat_HD thật.
    -------------------------------------------*/
    showPreviewHoaDon: function () {
        var me = this;
        var $mauInSrc = $('#MauInPhieuThu');
        if (!$mauInSrc.length || $mauInSrc.html().trim() === '') {
            edu.extend.notifyBeginLoading('Chưa có nội dung phiếu để xem trước!', 'w');
            return;
        }

        // BƯỚC 1: Lưu runtime state (value của select/input) TRƯỚC KHI clone.
        // jQuery .clone() chỉ copy HTML attributes, KHÔNG copy DOM properties (selectedIndex, .value).
        // Nên phải đọc từ DOM gốc rồi re-apply vào clone.
        var arrSelectValues = [];
        $mauInSrc.find('select').each(function () {
            arrSelectValues.push($(this).val());
        });
        var arrInputValues = [];
        $mauInSrc.find('input').each(function () {
            var type = (this.type || 'text').toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                arrInputValues.push({ checked: this.checked, value: this.value });
            } else {
                arrInputValues.push({ value: $(this).val() });
            }
        });

        // BƯỚC 2: Clone deep
        var $mauInClone = $mauInSrc.clone(true, true);

        // BƯỚC 3: Re-apply state vào clone (cùng thứ tự index như khi lưu).
        // Với select: dùng .val() để set + set attribute selected trên option (để :selected selector work).
        $mauInClone.find('select').each(function (idx) {
            var strVal = arrSelectValues[idx];
            var $sel = $(this);
            $sel.find('option').removeAttr('selected');
            if (strVal != null) {
                $sel.val(strVal);
                var $optSelected = $sel.find('option').filter(function () { return this.value === strVal; });
                if ($optSelected.length) $optSelected.attr('selected', 'selected');
            }
        });
        $mauInClone.find('input').each(function (idx) {
            var state = arrInputValues[idx];
            if (!state) return;
            var type = (this.type || 'text').toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                this.checked = state.checked;
                if (state.checked) $(this).attr('checked', 'checked'); else $(this).removeAttr('checked');
            } else {
                $(this).val(state.value).attr('value', state.value);
            }
        });

        // BƯỚC 4: Đổi id="xxx" → id="xxx_preview" tránh trùng ID với template gốc trong DOM.
        $mauInClone.find('[id]').each(function () {
            this.id = this.id + '_preview';
        });

        // BƯỚC 5: Convert <select> → <span> text tĩnh. Preview là để xem, không cho chọn nữa.
        $mauInClone.find('select').each(function () {
            var $sel = $(this);
            var $opt = $sel.find('option:selected');
            // Fallback: nếu :selected không match (edge case), lấy option đầu có attr selected
            if (!$opt.length) $opt = $sel.find('option[selected]').first();
            if (!$opt.length) $opt = $sel.find('option').first();
            var strText = ($opt.text() || '').trim();
            var strVal = $opt.val();
            var bIsPlaceholder = (!strVal || strVal === '' || /^chọn\s/i.test(strText) || /^--/.test(strText));
            var strDisplay = bIsPlaceholder ? '—' : strText;
            var strStyle = bIsPlaceholder
                ? 'color: #94a3b8; font-style: italic;'
                : 'font-weight: 600; color: #1e40af;';
            $sel.replaceWith('<span class="preview-value" style="' + strStyle + '">' + strDisplay + '</span>');
        });

        // BƯỚC 6: Convert <input type="text|number"> → text tĩnh (nội dung, số lượng, đơn giá...)
        $mauInClone.find('input').each(function () {
            var $inp = $(this);
            var type = ($inp.attr('type') || 'text').toLowerCase();
            if (type !== 'text' && type !== 'number' && type !== '') return;
            var strVal = ($inp.attr('value') || '').trim();
            $inp.replaceWith('<span>' + (strVal === '' ? '&nbsp;' : strVal) + '</span>');
        });

        // Ẩn thanh chỉnh ngày lập phiếu (chỉ dùng ở form thật để edit, không cần trong preview)
        $mauInClone.find('#zoneChinhNgayLapPhieu_preview').remove();

        // Fill nội dung phiếu vào wrapper trong modal (giữ watermark "XEM TRƯỚC" bên ngoài wrapper)
        var $target = $('#zonePreviewHoaDon_Content > div[style*="z-index: 2"]');
        $target.empty().append($mauInClone.contents());

        // Bind lại nút "Xuất HĐ điện tử ngay" — off trước để tránh double-bind khi mở modal nhiều lần.
        // Ưu tiên #btnXuat_HD (nhánh Thu tiền trước có nút này), fallback .btnXuat_HDDT đầu tiên
        // (nhánh Thu tiền khoản nợ chỉ có các nút HDDT dynamic từ BE, không có #btnXuat_HD).
        $('#btnXuatHDDT_FromPreview').off('click').on('click', function () {
            $('#modalPreviewHoaDon').modal('hide');
            setTimeout(function () {
                var $btnXuat = $('#btnXuat_HD');
                if ($btnXuat.length === 0) $btnXuat = $('.btnXuat_HDDT').first();
                if ($btnXuat.length > 0) {
                    $btnXuat.trigger('click');
                } else {
                    edu.extend.notifyBeginLoading('Không tìm thấy nút Xuất HĐ điện tử!', 'w');
                }
            }, 300);
        });

        $('#modalPreviewHoaDon').modal('show');
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
        // COMMENT: đoạn set inline style dưới đây ép #zoneActionHoaDon thành float:left / position:fixed
        // gây bug thanh nút hành động co hẹp ~200px và các nút stack dọc.
        // Việc căn giữa phiếu + bố cục thanh nút đã được xử lý bằng CSS flex trong thutien.html.
        // Giữ code để mở lại nếu cần rollback.
        // if (lMainPrint > lMauInPhieuThu) {
        //     document.getElementById('zoneBienLaiHoaDon').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
        //     document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        // }
        // else {
        //     document.getElementById('zoneBienLaiHoaDon').style.paddingLeft = "20px";
        //     document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        // }
        // Defensive: xóa mọi inline style cũ còn sót (nếu 1 nhánh code khác từng set float/position)
        var elActionHoaDon = document.getElementById('zoneActionHoaDon');
        if (elActionHoaDon) elActionHoaDon.removeAttribute('style');
        var elBienLai = document.getElementById('zoneBienLaiHoaDon');
        if (elBienLai) elBienLai.style.paddingLeft = '';
        edu.extend.genChonLien("MauInPhieuThu", "zoneLienHoaDon");

        // Init select2 cho các dropdown trên mẫu phiếu (Hình thức thu / Loại tiền tệ / Đơn vị tính).
        // Style theo mẫu "dropdown xịn" của user (ảnh tham chiếu 12/08/2026): popup rounded lớn, có ô Tìm...,
        // hover xanh nhạt, format option MÃ · TÊN nếu option value khác text.
        // - minimumResultsForSearch: 0 → luôn bật ô search (đồng bộ visual với các dropdown khác trong app).
        // - dropdownCssClass "select2-dropdown--phieuthu" để CSS scope popup, không đụng select2 khác.
        setTimeout(function () {
            if (typeof $.fn.select2 !== 'function') return;
            $('#MauInPhieuThu select').each(function () {
                if ($(this).hasClass('select2-hidden-accessible')) return;
                var $sel = $(this);
                // Dùng placeholder từ option đầu (thường là "Chọn ...") nếu có
                var strPlaceholder = $sel.find('option[value=""]').first().text() || 'Chọn...';
                $sel.select2({
                    width: 'auto',
                    minimumResultsForSearch: 0,
                    placeholder: strPlaceholder,
                    dropdownCssClass: 'select2-dropdown--phieuthu',
                    dropdownParent: $(document.body)
                });
            });
        }, 50);

        // Override chữ ký "Người thu tiền" bằng tên từ danh mục NTT (nếu có).
        // Template `Edit_DHCNTTTN_BIENLAITHU_2018.html` (load từ server) dùng class
        // `txtNguoiThu_BenA_<ID>` cho ô tên người thu. `getData_Phieu` (systemextend.js)
        // đã fill `NGUOITAO_TENDAYDU` vào đây trước; đoạn override chạy sau cùng.
        // Chạy defer để chắc chắn đã sau bước fill của getData_Phieu.
        var strTenNTT = main_doc.PhieuThu.strTenNguoiThuTien_NTT;
        if (strTenNTT) {
            setTimeout(function () {
                $('#MauInPhieuThu [class*="txtNguoiThu_BenA_"]').html(strTenNTT);
            }, 100);
        }

        // Chèn "Lớp: <tên lớp>" cùng dòng với Mã SV trên biên lai.
        // - Nguồn dữ liệu (ưu tiên): dt_DoiTuongThu.DAOTAO_LOPQUANLY_N1_TEN → element .txtLop_BenB_* / .txtLopPTC_PT_Edit đã fill sẵn.
        // - Anchor (nhiều fallback vì template mỗi trường khác nhau):
        //   (1) class .txtMa_BenB_*, (2) .txtMaNCSPTC_PT_Edit, (3) leaf element có chứa text "Mã SV".
        // Guard idempotent qua class .txtLopInline_Injected.
        setTimeout(function () {
            var $mauIn = $('#MauInPhieuThu');
            if (!$mauIn.length || $mauIn.find('.txtLopInline_Injected').length > 0) return;

            var strLop = '';
            var dt = main_doc.PhieuThu.dt_DoiTuongThu;
            if (dt && dt.DAOTAO_LOPQUANLY_N1_TEN) strLop = dt.DAOTAO_LOPQUANLY_N1_TEN;
            // Fallback 1: dt_HS (danh sách SV từ search) — thường giữ đầy đủ info học vụ.
            // dt_DoiTuongThu có thể bị override bởi API tài chính (chỉ có tổng nợ/thu, không có lớp).
            if (!strLop && dt && dt.MASO) {
                var arrHS = main_doc.PhieuThu.dt_HS;
                if (arrHS && arrHS.length) {
                    for (var i = 0; i < arrHS.length; i++) {
                        if (arrHS[i].MASO === dt.MASO && arrHS[i].DAOTAO_LOPQUANLY_N1_TEN) {
                            strLop = arrHS[i].DAOTAO_LOPQUANLY_N1_TEN;
                            break;
                        }
                    }
                }
            }
            // Fallback 2-3: đọc từ element template đã fill
            if (!strLop) {
                var $lopBenB = $mauIn.find('[class*="txtLop_BenB_"]').first();
                if ($lopBenB.length && $.trim($lopBenB.text())) strLop = $.trim($lopBenB.text());
            }
            if (!strLop) {
                var $lopEdit = $mauIn.find('.txtLopPTC_PT_Edit').first();
                if ($lopEdit.length && $.trim($lopEdit.text())) strLop = $.trim($lopEdit.text());
            }
            if (!strLop) {
                console.log('[Lớp inject] SV không có tên lớp (data source đều null). dt_DoiTuongThu =', dt);
                return;
            }
            console.log('[Lớp inject] strLop =', strLop);

            // Nếu template đã có slot "Lớp:" đang rỗng (label sẵn nhưng chưa fill) → điền vào đó, khỏi inject mới.
            // Trường hợp này gặp ở mẫu "PHIẾU THU TIỀN" của ĐHCN Đông Á: header có "Lớp:" nhưng slot value trống.
            var $lopSlot = $mauIn.find('[class*="txtLop_BenB_"], .txtLopPTC_PT_Edit').filter(function () {
                return !$.trim($(this).text());
            }).first();
            if ($lopSlot.length) {
                $lopSlot.html(strLop).addClass('txtLopInline_Injected');
                console.log('[Lớp inject] fill vào slot có sẵn:', $lopSlot.attr('class'));
                return;
            }

            // Style inline mạnh: ép trên cùng dòng, không wrap, không xuống hàng.
            var strHTML = '<span class="txtLopInline_Injected" ' +
                'style="display:inline-block !important; margin-left:30px; ' +
                'white-space:nowrap; vertical-align:baseline;">Lớp: <b>' + strLop + '</b></span>';

            // Chiến lược 1: anchor theo class đã biết
            var $anchor = $mauIn.find('[class*="txtMa_BenB_"]').first();
            if (!$anchor.length) $anchor = $mauIn.find('.txtMaNCSPTC_PT_Edit').first();
            if ($anchor.length) {
                $anchor.after(strHTML);
                console.log('[Lớp inject] via class anchor:', $anchor.attr('class'));
                return;
            }

            // Chiến lược 2: text-search — tìm leaf element chứa "Mã SV"
            var $textEl = $mauIn.find('*').filter(function () {
                return this.children.length === 0 && $(this).text().indexOf('Mã SV') !== -1;
            }).first();
            if ($textEl.length) {
                $textEl.parent().append(strHTML);
                console.log('[Lớp inject] via text search "Mã SV" in:', $textEl.prop('tagName'));
                return;
            }

            // Chiến lược 3: cuối cùng, thử tìm block cha chứa "Mã SV" (không phải leaf)
            var $anyEl = $mauIn.find(':contains("Mã SV")').last();
            if ($anyEl.length) {
                $anyEl.append(strHTML);
                console.log('[Lớp inject] via generic contains("Mã SV")');
                return;
            }
            // Debug: liệt kê một số class có prefix "txt" trong template để biết cấu trúc thực
            var arrClasses = [];
            $mauIn.find('[class^="txt"], [class*=" txt"]').each(function () {
                arrClasses.push($(this).attr('class'));
            });
            console.log('[Lớp inject] Không tìm được anchor "Mã SV". Các class txt* có trong template:', arrClasses);
        }, 300);

        // Override cho biên lai trường UTT (ĐH Công nghệ Giao thông Vận tải):
        //  (a) Địa chỉ đơn vị: BE trả sai (địa chỉ CMC Hà Nội) → hardcode lại theo địa chỉ Phú Thọ user cung cấp
        //  (b) Strip 2 dòng ghi chú cuối template ("Công ty cung cấp phần mềm CMC..." + "Phải giữ cẩn thận hóa đơn...")
        //      do user yêu cầu bỏ hẳn — không phải phần mẫu 02GTTT2/001 chuẩn.
        // Detect trường UTT dùng tên trường / mã số thuế (KHÔNG dùng "CMC" vì text CMC nằm ở dòng bị strip).
        setTimeout(function () {
            var $mauIn = $('#MauInPhieuThu');
            if (!$mauIn.length) return;
            var strAllText = ($mauIn.text() || '').toUpperCase();
            var isTruongUTT = strAllText.indexOf('GIAO THÔNG VẬN TẢI') !== -1
                           || strAllText.indexOf('2500224668') !== -1;
            if (!isTruongUTT) return;

            // (a) Override địa chỉ
            if (!$mauIn.find('.txtDiaChiUTT_Override').length) {
                var strDiaChiUTT = '278 Đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ, Việt Nam';
                var $addr = $mauIn.find('[class*="txtDiaChi_BenA_"]');
                if ($addr.length) {
                    $addr.html(strDiaChiUTT).addClass('txtDiaChiUTT_Override');
                    console.log('[UTT address override] Đã hardcode', $addr.length, 'field địa chỉ:', strDiaChiUTT);
                } else {
                    console.log('[UTT address override] Không tìm thấy .txtDiaChi_BenA_* trong template. Kiểm tra class thực tế.');
                }
            }

            // (b) Strip 2 dòng ghi chú footer CMC.
            // Dùng TreeWalker duyệt TEXT NODE (không phải element) — vì template thường có text node
            // trực tiếp trong <p>/<div> (không wrap trong span/i), khiến loop leaf-element không match.
            // Regex match cả "cung cấp phần mềm" (dòng 1) và "phải giữ cẩn thận hóa đơn" (dòng 2).
            // Tìm text node match → đi lên block cha (p/div/tr) → nếu block chỉ chứa text footer thì remove block;
            // nếu block có nội dung khác không liên quan thì chỉ remove text node đó.
            if (!$mauIn.data('utt-footer-stripped')) {
                var reFooter = /cung cấp phần mềm|phải giữ cẩn thận hóa đơn/i;
                var walker = document.createTreeWalker($mauIn[0], NodeFilter.SHOW_TEXT, null, false);
                var footerNodes = [];
                var tnode;
                while ((tnode = walker.nextNode())) {
                    if (reFooter.test(tnode.nodeValue || '')) footerNodes.push(tnode);
                }
                var removedCount = 0;
                footerNodes.forEach(function (node) {
                    // Đi lên đến block-level cha
                    var target = node.parentNode;
                    while (target && target !== $mauIn[0]) {
                        var tn = (target.tagName || '').toUpperCase();
                        if (tn === 'P' || tn === 'DIV' || tn === 'TR' || tn === 'TD') break;
                        target = target.parentNode;
                    }
                    if (!target || target === $mauIn[0]) {
                        // Không tìm được block cha → remove text node và <br> trước/sau
                        var br = node.previousSibling;
                        if (br && br.nodeName === 'BR' && br.parentNode) br.parentNode.removeChild(br);
                        if (node.parentNode) node.parentNode.removeChild(node);
                        removedCount++;
                        return;
                    }
                    // Check block cha có text nào KHÔNG khớp footer không
                    var otherText = (target.textContent || '').replace(node.nodeValue || '', '').replace(/\s+/g, ' ').trim();
                    var hasOtherContent = otherText.length > 3 && !reFooter.test(otherText);
                    if (hasOtherContent) {
                        // Block cha có content khác → chỉ remove text node + <br> siblings gần đó
                        var brPrev = node.previousSibling;
                        if (brPrev && brPrev.nodeName === 'BR' && brPrev.parentNode) brPrev.parentNode.removeChild(brPrev);
                        if (node.parentNode) node.parentNode.removeChild(node);
                    } else {
                        // Block toàn text footer → remove cả block
                        if (target.parentNode) target.parentNode.removeChild(target);
                    }
                    removedCount++;
                });
                $mauIn.data('utt-footer-stripped', true);
                console.log('[UTT footer strip] Đã xóa', removedCount, 'text node ghi chú CMC/hóa đơn cuối phiếu (tổng', footerNodes.length, 'match).');
            }
        }, 350);

        // Viết tắt "ĐẠI HỌC" → "ĐH" cho tên trường dài (VD: TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á).
        // Dùng TreeWalker để cover cả text node trực tiếp trong <td>/<div> (không wrap trong element con).
        // Chỉ apply khi text node chứa "TRƯỜNG" + "ĐẠI HỌC" và độ dài > 22 ký tự.
        setTimeout(function () {
            var mauInEl = document.getElementById('MauInPhieuThu');
            if (!mauInEl) return;
            if (mauInEl.querySelector('.tenTruongVietTat')) return; // idempotent

            var walker = document.createTreeWalker(mauInEl, NodeFilter.SHOW_TEXT, null, false);
            var textNodes = [];
            var tn;
            while ((tn = walker.nextNode())) textNodes.push(tn);

            textNodes.forEach(function (node) {
                var txt = node.nodeValue || '';
                var normalized = txt.replace(/\s+/g, ' ').trim();
                if (/TRƯỜNG\s+ĐẠI\s+HỌC/i.test(normalized) && normalized.length > 22) {
                    node.nodeValue = txt.replace(/ĐẠI\s+HỌC/gi, 'ĐH');
                    // Gắn class .tenTruongVietTat vào parent element (cần để CSS apply nowrap/font)
                    var p = node.parentNode;
                    if (p && p.nodeType === 1 && (p.className || '').indexOf('tenTruongVietTat') === -1) {
                        p.className = (p.className || '') + ' tenTruongVietTat';
                    }
                    // Đi lên tìm td/th cha, ép width auto + remove width attribute + nowrap
                    var cell = p;
                    while (cell && cell !== mauInEl) {
                        var tn2 = cell.tagName;
                        if (tn2 === 'TD' || tn2 === 'TH') {
                            cell.style.setProperty('width', 'auto', 'important');
                            cell.style.setProperty('min-width', '0', 'important');
                            cell.style.setProperty('max-width', 'none', 'important');
                            cell.style.setProperty('white-space', 'nowrap', 'important');
                            cell.style.setProperty('overflow', 'visible', 'important');
                            cell.removeAttribute('width');
                            break;
                        }
                        cell = cell.parentNode;
                    }
                    console.log('[Tên trường viết tắt] "' + normalized + '" → "' + node.nodeValue.replace(/\s+/g, ' ').trim() + '"');
                }
            });
        }, 380);
    },
    /*------------------------------------------
    --Discription: [7] 
    --ULR: Modules
    -------------------------------------------*/
    getList_ChiTietKhoanMien: function (strTaiChinh_Mien_Id) {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanMien/LayDSDienDaiChiTietMien',
            'type': 'GET',
            'strTaiChinh_Mien_Id': strTaiChinh_Mien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_ChiTietKhoanPhaiNop(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
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
    getList_ChiTietKhoanPhaiNop: function (strTaiChinh_PhaiNop_Id) {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanPhaiNop/LayDSDienDaiChiTietPhaiNop',
            'type': 'GET',
            'strTaiChinh_PhaiNop_Id': strTaiChinh_PhaiNop_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_ChiTietKhoanPhaiNop(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
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
    --Discription: Ngày lập phiếu - cho phép user chỉnh ngay trên biên lai trước khi save
    -------------------------------------------*/
    _showNgayLapPhieuEditor: function (strMacDinh) {
        var me = this;
        var $ip = $("#txtNgayLap_BienLai_Edit");
        if ($ip.length === 0) return;
        var strNgay = strMacDinh;
        if (!strNgay || strNgay.indexOf('/') === -1) {
            strNgay = edu.util.thisDay() + '/' + edu.util.thisMonth() + '/' + edu.util.thisYear();
        }
        $ip.val(strNgay);
        $("#zoneChinhNgayLapPhieu").show();
        if (!$ip.data('cleaveInited') && typeof Cleave !== 'undefined') {
            new Cleave($ip[0], { date: true, datePattern: ['d', 'm', 'Y'] });
            $ip.data('cleaveInited', true);
        }
        $ip.off('input.ngaylap change.ngaylap blur.ngaylap')
           .on('input.ngaylap change.ngaylap blur.ngaylap', function () {
               me._syncNgayLapPhieuToBienLai(this.value);
           });
        me._syncNgayLapPhieuToBienLai(strNgay);
    },
    _hideNgayLapPhieuEditor: function () {
        $("#zoneChinhNgayLapPhieu").hide();
    },
    _syncNgayLapPhieuToBienLai: function (strNgay) {
        if (!strNgay || strNgay.indexOf('/') === -1) return;
        var arr = strNgay.split('/');
        if (arr.length < 3) return;
        $(".iNgayPTC_PT_Edit").html(arr[0]);
        $(".iThangPTC_PT_Edit").html(arr[1]);
        $(".iNamPTC_PT_Edit").html(arr[2]);
    },
    _getNgayLapPhieuOverride: function () {
        var v = $("#txtNgayLap_BienLai_Edit").val();
        if (!v || v.indexOf('/') === -1) return '';
        var arr = v.split('/');
        if (arr.length < 3 || !arr[0] || !arr[1] || !arr[2]) return '';
        return v;
    },
    genTable_ChiTietKhoanPhaiNop: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChiTietKhoanThu",
            colPos: { center: [0], right: [3] },
            aaData: data,
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                }
                , {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "SOTINCHI"
                }
                , {
                    "mDataProp": "KIEUHOC_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTableId, [3]);
    },
}