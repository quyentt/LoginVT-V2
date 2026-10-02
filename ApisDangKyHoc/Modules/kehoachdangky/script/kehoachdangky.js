/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: DangKyHoc/DKH_KeHoachDangKy
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoachDangKy() { };
KeHoachDangKy.prototype = {
    strKeHoachDangKy_Id: '',
    dtKeHoachDangKy: '',
    arrNhanSu_Id: [],

    init: function () {
        var me = main_doc.KeHoachDangKy;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_KeHoachDangKy();
        me.getList_ThoiGianDaoTao_S();
        me.getList_HeDaoTao();
        /*------------------------------------------
        --Discription: 
        -------------------------------------------*/
        me.toggle_detail("zonebatdau");
        $("#btnAddnew").click(function () {
            me.rewrite();
            me.toggle_detail("zoneEdit");
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-content", "zonebatdau");
        });
        $("#btnSave").click(function () {
            me.save_KeHoachDangKy();
        });
        $(".btnSearch_KHDK").click(function () {
            me.getList_KeHoachDangKy("", edu.util.getValById("dropSearch_CheDoDangKy"), edu.util.getValById("txtSearch_TuKhoa"));
        });
        $("#btnSearch_KHDK").click(function () {
            me.getList_KeHoachDangKy();
        });
        $("#btnPhanCong").click(function () {
            $("#myModalPCNhomKiemSoat").modal("show");
            //edu.system.confirm("Bạn có chắc chắn muốn phân công không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhanCong();
            //});
            $("#tblPCNhomKiemSoat tbody").html("");
            $("#dropSearch_HeDaoTao_PCNKS").val("").trigger("change");
        });
        $("#btnSave_PCNhomKiemSoat").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPCNhomKiemSoat", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalPCNhomKiemSoat").modal("hide");
            //edu.system.alert('<div id="zoneprocessXXXX"></div>');
            //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhanCong(arrChecked_Id[i]);
            }
        });
        $("#btnPhanCongCT").click(function () {
            $("#myModalPCChuongTrinh").modal("show");

            $("#tblPCChuongTrinh tbody").html("");
            $("#dropSearch_HeDaoTao_PCChuongTrinh").val("").trigger("change");
            $("#dropSearch_KhoaDaoTao_PCChuongTrinh").val("").trigger("change");
            //edu.system.confirm("Bạn có chắc chắn muốn phân công không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhanCongCT();
            //});
        });
        $("#btnSave_PCChuongTrinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPCChuongTrinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalPCChuongTrinh").modal("hide");
            //edu.system.alert('<div id="zoneprocessXXXX"></div>');
            //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhanCongCT(arrChecked_Id[i]);
            }
        });
        $("#btnPhanCongKH").click(function () {
            $("#myModalPCKhoaHoc").modal("show");
            $("#tblPCKhoaHoc tbody").html("");
            $("#dropSearch_HeDaoTao_PCKhoaHoc").val("").trigger("change"); 
            //edu.system.confirm("Bạn có chắc chắn muốn phân công không?"); 
            //$("#btnYes").click(function (e) {
            //    me.save_PhanCongKH();
            //});
        });
        $("#btnSave_PCKhoaHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPCKhoaHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalPCKhoaHoc").modal("hide");
            //edu.system.alert('<div id="zoneprocessXXXX"></div>');
            //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhanCongKH(arrChecked_Id[i]);
            }
        });
        $("#btnChuyenDuLieu").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.save_ChuyenDuLieu();
            });
        });
        $("#tblKHDK").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKHDK");
            me.strKeHoachDangKy_Id = strId;
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_KeHoachDangKy(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKHDK").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblKHDK");
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachDangKy(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneEdit").delegate('.btnSelectInList', 'click', function (e) {
            var point = this; e.preventDefault();
            if (point.classList.contains("btn-white")) {
                point.classList.remove("btn-white");
                point.classList.add("btn-primary");
            }
            else {
                point.classList.remove("btn-primary");
                point.classList.add("btn-white");
            }
        });
        me.arrValid_KeHoachDangKy = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropKhenThuong", "THONGTIN1": "EM" }
        ];
        $("#dropThoiGian_Nam").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#dropThoiGian_Ky").on("select2:select", function () {
            me.getList_DotHoc();
        });
        
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.getList_NamHoc();
        me.getList_ThoiGianDaoTao();
        me.getList_DotHoc();
        //load
        me.getList_KeHoachDangKy();
        edu.system.loadToRadio_DMDL("DANGKY.MOHINH", "divMoHinh", 12);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DIEMCHU", "dropMucDiem");
        edu.system.loadToCheckBox_DMDL("KHDT.DIEM.KIEUHOC", "divKieuDangKy", 12);
        edu.system.loadToCheckBox_DMDL("DANGKY.KIEUHOCLAI.PHANLOAI", "divLyDoHocLai", 12);
        edu.system.loadToRadio_DMDL("DANGKY.CHEDO", "divCheDoDangKy", 12);
        edu.system.loadToRadio_DMDL("DANGKY.QUYDINHVETINCHITOIDA", "divCachTinhTinChiToiDa", 12);
        edu.system.loadToRadio_DMDL("DANGKY.QUYDINHVETINCHITOIDA.PHAMVI", "divCachTinhTinChiToiDaPV", 12);
        edu.system.loadToRadio_DMDL("DANGKY.PHAMVIKIEMTRATRUNGTHOIGIAN", "divKiemTranTrungThoiGian");
        edu.system.loadToRadio_DMDL("DANGKY.TOHOPQUYDINH", "divDKTheoToHopQuyDinh");
        edu.system.loadToRadio_DMDL("DANGKY.QUYDINHVENANGDIEM", "divQuyDinhNangDiem", 12);
        edu.system.loadToRadio_DMDL("DANGKY.QUYDINHKIEMTRAHOCPHI", "divQuyDinhKiemTraTaiChinh", 12);
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.PHANLOAIDOT", "dropPhanLoaiDot");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.MOHINHUTDANGKYNGUYENVONG", "dropMucUuTienNguyenVong");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.SOTINCHI.KHOIKT.TUCHON", "dropTuyChonKTVuot");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.QUYDINH.LOP.XULYDACTHU", "", "", me.cbLoad_XuLyDacThu);
        me.getList_NguyenVongUuTien();
        //edu.system.loadToList_DanhMucDuLieu("DKH.QDTCTD", "divQD_TCCT", 12);
        //edu.system.loadToList_DanhMucDuLieu("DKH.QDDKND", "divNangDiem", 12);
        //edu.system.loadToList_DanhMucDuLieu("DKH.KTTL", "divTrungLich", 12);
        //edu.system.loadToList_DanhMucDuLieu("DKH.KTHP", "divKTTC", 12);
        //edu.system.loadToList_DanhMucDuLieu("DKH.QDTOHOPDK", "divDKTheoToHopQuyDinh", 12);
        //edu.system.loadToList_DanhMucDuLieu("DKH.TTSV", "divTrangThaiSinhVien");
        //edu.system.loadToList_DanhMucDuLieu("DKH.CHEDODANGKY", "divCheDoDangKy");

        //$(document).on('show.bs.modal', '.modal', function () {
        //    var zIndex = 1040 + (10 * $('.modal:visible').length);
        //    $(this).css('z-index', zIndex);
        //    setTimeout(function () {
        //        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        //    }, 0);
        //});
        //$(document).on('hidden.bs.modal', '.modal', function () {
        //    if ($('.modal:visible').length) {
        //        $(document.body).addClass('modal-open');
        //    }
        //});

        $("#tblKHDK").delegate('.btnThietDatXuLyLHP', 'click', function (e) {
            e.stopPropagation();
            me.strKeHoachDangKy_Id = this.id;
            me.openModal_XuLyLHP(this.id);
        });
        $("#btnAddXuLyLHP").click(function () {
            me.openModal_ChonLHP();
        });
        $("#chkSelectAll_XuLyLHP").on('change', function () {
            $("#tblXuLyLHP tbody .chkRow_XuLyLHP").prop('checked', this.checked);
            var checked = this.checked;
            for (var i = 0; i < me.dtXuLyLHP_All.length; i++) me.dtXuLyLHP_All[i]._selected = checked;
            $("#tblXuLyLHP tbody .chkRow_XuLyLHP").prop('checked', checked);
        });
        $("#tblXuLyLHP").delegate('.chkRow_XuLyLHP', 'change', function () {
            var idx = parseInt($(this).closest('tr').attr('data-idx'));
            if (!isNaN(idx)) me.dtXuLyLHP_All[idx]._selected = this.checked;
            me.syncSelectAll_XuLyLHP();
        });
        $("#tblXuLyLHP").delegate('.dropXuLyDacThu', 'change', function () {
            var idx = parseInt($(this).closest('tr').attr('data-idx'));
            if (!isNaN(idx)) me.dtXuLyLHP_All[idx].XULYDACTHU_ID = $(this).val();
        });
        $("#btnApDungTatCa").click(function () {
            var bulkVal = $("#dropBulkXuLyDacThu").val() || '';
            if (!bulkVal) {
                edu.system.alert("Vui lòng chọn xử lý đặc thù trước khi áp dụng!");
                return;
            }
            var $rows = $("#tblXuLyLHP tbody tr");
            if ($rows.length === 0) {
                edu.system.alert("Chưa có lớp học phần nào trong bảng!");
                return;
            }
            var $picked = $rows.has('.chkRow_XuLyLHP:checked');
            var $target = $picked.length ? $picked : $rows;
            $target.find('.dropXuLyDacThu').val(bulkVal);
            var data = me.dtXuLyLHP_All || [];
            if (data.length === 0) {
                edu.system.alert("Chưa có lớp học phần nào trong bảng!");
                return;
            }
            var hasPicked = data.some(function (d) { return d._selected; });
            var changed = 0;
            for (var i = 0; i < data.length; i++) {
                if (!hasPicked || data[i]._selected) {
                    data[i].XULYDACTHU_ID = bulkVal;
                    changed++;
                }
            }
            me.renderPage_XuLyLHP();
            edu.system.alert("Đã áp dụng cho " + changed + " dòng.");
        });
        $("#dropPageSize_XuLyLHP").on('change', function () {
            me.pageSize_XuLyLHP = parseInt($(this).val()) || 20;
            me.pageIndex_XuLyLHP = 1;
            me.renderPage_XuLyLHP();
        });
        $("#pager_XuLyLHP").delegate('.btnPage_XuLyLHP', 'click', function () {
            var p = parseInt($(this).attr('data-page'));
            if (!isNaN(p)) {
                me.pageIndex_XuLyLHP = p;
                me.renderPage_XuLyLHP();
            }
        });
        $("#tblChonLHP").delegate('.chkChonLHP', 'change', function () {
            var $tr = $(this).closest('tr');
            var lhpId = $tr.attr('data-id') || '';
            if (this.checked) {
                me.addRow_XuLyLHP({
                    TENLOP: $tr.attr('data-tenlop') || '',
                    MALOP: $tr.attr('data-malop') || '',
                    DANGKY_LOPHOCPHAN_ID: lhpId
                });
                $tr.addClass('row-selected');
            }
            else {
                var foundIdx = -1, foundSaved = false;
                for (var i = 0; i < me.dtXuLyLHP_All.length; i++) {
                    if (me.dtXuLyLHP_All[i].DANGKY_LOPHOCPHAN_ID === lhpId) {
                        foundIdx = i;
                        foundSaved = !!me.dtXuLyLHP_All[i].ID;
                        break;
                    }
                }
                if (foundSaved) {
                    this.checked = true;
                    edu.system.alert("Dòng này đã lưu trong DB. Hãy dùng nút xóa trong bảng bên dưới để xóa.");
                    return;
                }
                if (foundIdx >= 0) {
                    me.dtXuLyLHP_All.splice(foundIdx, 1);
                    me.renderPage_XuLyLHP();
                }
                $tr.removeClass('row-selected');
            }
            me.syncHeaderCheckbox_ChonLHP();
        });
        $("#txtSearch_ChonLHP").on('input', function () {
            me.filter_ChonLHP();
        });
        $("#dropLaLopRieng").on('change', function () {
            me.filter_ChonLHP();
        });
        $("#chkSelectAll_ChonLHP").on('change', function () {
            me.toggleSelectAll_ChonLHP(this.checked);
        });
        $("#chkSelectAll_ChonLHP").on('change', function () {
            me.toggleSelectAll_ChonLHP(this.checked);
        });
        $("#dropPageSize_ChonLHP").on('change', function () {
            me.pageSize_ChonLHP = parseInt($(this).val()) || 20;
            me.pageIndex_ChonLHP = 1;
            me.renderPage_ChonLHP();
        });
        $("#pager_ChonLHP").delegate('.btnPage_ChonLHP', 'click', function () {
            var p = parseInt($(this).attr('data-page'));
            if (!isNaN(p)) {
                me.pageIndex_ChonLHP = p;
                me.renderPage_ChonLHP();
            }
        });
        $("#btnSave_ChonLHP").click(function () {
            $("#myModalChonLHP").modal("hide");
        });
        $("#btnDeleteSelected_XuLyLHP").click(function () {
            me.deleteSelected_XuLyLHP();
        });
        $("#btnSave_XuLyLHP").click(function () {
            me.save_XuLyLHP();
        });
        $("#tblKHDK").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this.id);
        });
        $("#tblKHDK").delegate('.btnDetailKhongDangKy', 'click', function (e) {
            $('#myModal_khongdangky').modal('show');
            me.getList_KhongDangKy(this.id);
        });

        // Xuất Excel DS không đăng ký — click nút hoặc Ctrl+G khi modal đang mở
        $("#btnXuatExcel_KhongDangKy").click(function (e) {
            if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
            me.exportExcel_KhongDangKy();
        });
        $(document).off('keydown.khdk_export').on('keydown.khdk_export', function (e) {
            if (!$('#myModal_khongdangky').hasClass('in') && !$('#myModal_khongdangky').is(':visible')) return;
            if (/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) return;
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me.exportExcel_KhongDangKy();
            }
        });

        $("#zoneEdit").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });

        $("#tblKHDK").delegate(".btnPhanQuyen", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            
            me.strKeHoachDangKy_Id = strId;
            me.toggle_detail("zonePhanQuyen");
            me.getList_ThanhVien();
        });
        $(".btnSearchTTS_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_TTS_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        $("#btnSavePhanQuyen").click(function () {
            $("#tblInput_TTS_ThanhVien tbody tr").each(function () {
                var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                me.save_ThanhVien(strNhanSu_Id);
            });
        });

        $("#btnDelete_KeHoach").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoachDangKy(me.strKeHoachDangKy_Id);
            });
        });

        $('#dropSearch_HeDaoTao_PCNKS').on('select2:select', function () {
            me.getList_KhoaDaoTao($('#dropSearch_HeDaoTao_PCNKS').val());
        });
        $('#dropSearch_HeDaoTao_PCChuongTrinh').on('select2:select', function () {
            me.getList_KhoaDaoTao($('#dropSearch_HeDaoTao_PCChuongTrinh').val());
            $("#tblPCChuongTrinh tbody").html("");
        });
        $('#dropSearch_HeDaoTao_PCKhoaHoc').on('select2:select', function () {
            me.getList_KhoaDaoTao($('#dropSearch_HeDaoTao_PCKhoaHoc').val());
        });
        $('#dropSearch_KhoaDaoTao_PCChuongTrinh').on('select2:select', function () {
            me.getList_ChuongTrinh();
        });
    },
    toggle_detail: function (strZone) {
        edu.util.toggle_overide("zone-content", strZone);
    },
    rewrite: function () {
        var me = this;
        me.strKeHoachDangKy_Id = "";
        edu.util.resetValById("txtTenKeHoach");
        edu.util.resetValById("txtMaKeHoach");
        edu.util.resetValById("dropThoiGian_Dot");
        edu.util.resetValById("txtBD_Ngay");
        edu.util.resetValById("txtBD_Gio");
        edu.util.resetValById("txtBD_Phut");
        edu.util.resetValById("txtKT_Ngay");
        edu.util.resetValById("txtKT_Gio");
        edu.util.resetValById("txtKT_Phut");
        edu.util.resetValById("txtNoToiDa");
        edu.util.resetValById("txtSoNgayRutHP");
        edu.util.resetValById("txtNgayBDRutHP");
        edu.util.resetValById("txtSoGiayCho");
        edu.util.resetValById("dropPhanLoaiDot");
        edu.util.resetValById("txtSoTCToiDa");
        edu.util.resetValById("txtSoTCToiThieu");
        edu.util.resetValById("txtSoTCToiDaN2");
        edu.util.resetValById("txtSoTCToiThieuN2");
        edu.util.resetValById("txtTyLeVuot");
        edu.util.resetValById("dropMucDiem");
        edu.util.resetValById("divMoHinh");
        edu.util.resetValById("divDenHan");
        edu.util.resetValById("divTrangThaiSinhVien");
        edu.util.resetValById("divKieuDangKy");
        edu.util.resetValById("divLyDoHocLai");
        edu.util.resetValById("divNguyenVongUuTien");
        edu.util.resetValById("dropMucUuTienNguyenVong");
        edu.util.resetValById("divCheDoDangKy");
        edu.util.resetValById("divHienThiThongTinGiangVien");
        edu.util.resetValById("divKiemTraTinhTrangTaiChinh");
        edu.util.resetValById("divQuyDinhKiemTraTaiChinh");
        edu.util.resetValById("divQDHuyHocPhan");
        edu.util.resetValById("divQDCoVanDangKyChoSV");
        edu.util.resetValById("divKTTCTD");
        edu.util.resetValById("divKTTCTT");
        edu.util.resetValById("divCachTinhTinChiToiDa");
        edu.util.resetValById("divCachTinhTinChiToiDaPV");
        edu.util.resetValById("divKiemTraTrungLich");
        edu.util.resetValById("divKiemTraTrungLop");
        edu.util.resetValById("divKiemTranTrungThoiGian");
        edu.util.resetValById("divDKTheoToHopQuyDinh");
        edu.util.resetValById("divDKMR");
        edu.util.resetValById("divDKHPTD");
        edu.util.resetValById("divDoiHocPhan");
        edu.util.resetValById("divDKMotLanTrongKy");
        edu.util.resetValById("divKRDKTQ");
        edu.util.resetValById("divHDHT");
        //edu.util.resetValById("divDangKyNhieuLanTrongDot");
        edu.util.resetValById("divQuyDinhNangDiem");
        edu.util.resetValById("divQuyDinhKiemTraTaiChinh");
        edu.util.resetValById("dropTuyChonKTVuot");
        $("#zonedkmr input[type=checkbox]").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        edu.util.resetValById("txtNgayBatDauXN");
        edu.util.resetValById("txtNgayKetThucXN");
    },
    
    save_PhanCong: function (strViApDung_Id) {
        var me =this;

        //--Edit
        //var obj_save = {
        //    'action': 'DKH_KeHoachDangKy/PhanCongTheoNhomKiemSoat',
        //    'type': 'POST',
        //    'strChucNang_Id': edu.system.strChucNang_Id,
        //    'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};
        var obj_save = {
            'action': 'DKH_ThongTin_MH/ESkgLwIuLyYVKSQuDykuLAooJCwSLiA1',
            'func': 'pkg_dangkyhoc_thongtin.PhanCongTheoNhomKiemSoat',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strViApDung_Id': strViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanCongKH: function (strViApDung_Id) {
        var me = this;

        //--Edit
        
        var obj_save = {
            'action': 'DKH_ThongTin_MH/ESkgLwIuLyYVNAUuLyYVKSQuCikuIAUgLhUgLgPP',
            'func': 'pkg_dangkyhoc_thongtin.PhanCongTuDongTheoKhoaDaoTao',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strViApDung_Id': strViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanCongCT: function (strViApDung_Id) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin_MH/ESkgLwIuLyYVNAUuLyYVKSQuAik0Li8mFTMoLykP',
            'func': 'pkg_dangkyhoc_thongtin.PhanCongTuDongTheoChuongTrinh',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strViApDung_Id': strViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuyenDuLieu: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_KeHoachDangKy/ChuyenDuLieuTKBSangDKH',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_KeHoachDangKy: function () {
        var me = main_doc.KeHoachDangKy;
        var MHDK_val = edu.util.getValCheckBoxByDiv("divMoHinh");//Kiểu radio
        var DenHan_val = edu.util.getValCheckBoxByDiv("divDenHan");//Kiểu radio
        var KDK_val = edu.util.getValCheckBoxByDiv("divKieuDangKy");//Kiểu check box
        var LDHL_val = edu.util.getValCheckBoxByDiv("divLyDoHocLai");//Kiểu check box
        var NVUT_val = edu.util.getValCheckBoxByDiv("divNguyenVongUuTien");//Kiểu check box
        var QDGV_val = $('input[name="QDGV"]:checked').val();//Radio chọn có/không
        var CheDoDangKy_val = edu.util.getValCheckBoxByDiv("divCheDoDangKy");//Kiểu radio
        var TrangThaiSinhVien_val = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString();//Kiểu check box
        var KiemTraTinhTrangTaiChinh_val = $('input[name="KiemTraTaiChinh"]:checked').val();//Radio chọn có/không
        var ChoPhepNguocHocHuyHocPhan_val = $('input[name="QDRHP"]:checked').val();//Radio chọn có/không
        var CovanDangKy_val = $('input[name="CVDK"]:checked').val();//Radio chọn có/không
        var KiemTraTinChiToiDa_val = $('input[name="QDTCTD"]:checked').val();//Radio chọn có/không
        var KiemTraTinChiToiThieu_val = $('input[name="QDTCTT"]:checked').val();//Radio chọn có/không
        var CachTinhTinChiToiDa_val = edu.util.getValCheckBoxByDiv("divCachTinhTinChiToiDa");//Kiểu radio
        var CachTinhTinChiToiDaPV_val = edu.util.getValCheckBoxByDiv("divCachTinhTinChiToiDaPV");//Kiểu radio
        var KTTLich_val = $('input[name="KTTLich"]:checked').val();//Radio chọn có/không
        var KTTLop_val = $('input[name="KTTLop"]:checked').val();//Radio chọn có/không
        var KiemTraTrungThoiGian_val = edu.util.getValCheckBoxByDiv("divKiemTranTrungThoiGian");//Kiểu radio
        var KiemTraToHopDangKy_val = edu.util.getValCheckBoxByDiv("divDKTheoToHopQuyDinh");//Kiểu radio
        var KiemTraDangKyMoRong_val = $('input[name="DKMR"]:checked').val();//Radio chọn có/không
        var QuyDinhDangKyHPTuongDuong_val = $('input[name="DKHPTD"]:checked').val();//Radio chọn có/không
        var QuyDinhDoiLopHocPhan_val = $('input[name="DHP"]:checked').val();//Radio chọn có/không
        var QuyDinhDangKyMotLan_val = $('input[name="DKML"]:checked').val();//Radio chọn có/không
        var QuyDinhRangBuocHocPhan_val = $('input[name="KTDKTQ"]:checked').val();//Radio chọn có/không
        var QDND_val = edu.util.getValCheckBoxByDiv("divQuyDinhNangDiem");//Kiểu radio
        var QuyDinhKiemTraTaiChinh_val = edu.util.getValCheckBoxByDiv("divQuyDinhKiemTraTaiChinh");//Kiểu radio
        var QuyDinhDangKyNhieuLan_val = $('input[name="DangKyNhieuLanTrongDot"]:checked').val();//Radio chọn có/không


        var HDHT = $('input[name="HDHT"]:checked').val();//Radio chọn có/không
        var HienThiDonGia = $('input[name="HienThiDonGia"]:checked').val();//Radio chọn có/không
        var TuDongTinhTien = $('input[name="TuDongTinhTien"]:checked').val();//Radio chọn có/không
        var TuDongTinhPhi = $('input[name="TuDongTinhPhi"]:checked').val();//Radio chọn có/không
        

        //Kiểm tra Mô hình 
        //if (MHDK_val == "") {
        //    edu.system.alert("Chọn 1 trong các mô hình đăng ký");
        //    return;
        //}
        //// Kiểm tra trạng thái sinh viên
        //if (TrangThaiSinhVien_val == "") {
        //    edu.system.alert("Chọn 1 hoặc nhiều trong các trạng thái sinh viên");
        //    return;
        //}
        //// Kiểm tra kiểu đăng ký
        //if (KDK_val == "") {
        //    edu.system.alert("Chọn 1 hoặc nhiều trong các kiểu đăng ký");
        //    return;
        //}
        //// Kiểm tra quy định giảng viên
        //if (QDGV_val == "") {
        //    edu.system.alert("Chọn quy định về giảng viên");
        //    return;
        //}
        //// Kiểm tra chế độ  đăng ký
        //if (CheDoDangKy_val == "") {
        //    edu.system.alert("Chọn 1 trong các chế độ đăng ký");
        //    return;
        //}
        //// Kiểm tra tình trạng tài chính
        //if (KiemTraTinhTrangTaiChinh_val == "") {
        //    edu.system.alert("Chọn kiểm tra tình trạng tài chính");
        //    return;
        //}
        //// Kiểm tra quy định về hủy rú học phần
        //if (ChoPhepNguocHocHuyHocPhan_val == "") {
        //    edu.system.alert("Chọn quy định về hủy rút học phần");
        //    return;
        //}
        //// Kiểm tra quy định về cố vấn đăng ký cho sinh viên
        //if (CovanDangKy_val == "") {
        //    edu.system.alert("Chọn quy định về cố vấn đăng ký cho sinh viên");
        //    return;
        //}
        //// Kiểm tra số tín chỉ tối đa
        //if (KiemTraTinChiToiDa_val == "") {
        //    edu.system.alert("Chọn kiểm tra tín chỉ tối đa");
        //    return;
        //}
        //// Kiểm tra số tín chỉ tối thiểu
        //if (KiemTraTinChiToiThieu_val == "") {
        //    edu.system.alert("Chọn kiểm tra tín chỉ tối thiểu");
        //    return;
        //}
        //// Kiểm tra quy định số tín chỉ tối đa
        //if (CachTinhTinChiToiDa_val == "") {
        //    edu.system.alert("Chọn kiểm tra tín chỉ tối thiểu");
        //    return;
        //}
        //// Kiểm tra quy định trùng lịch học
        //if (KTTLich_val == "") {
        //    edu.system.alert("Chọn kiểm tra trùng lịch");
        //    return;
        //}
        //// Kiểm tra quy định trùng lớp học
        //if (KTTLop_val == "") {
        //    edu.system.alert("Chọn kiểm tra trùng lớp");
        //    return;
        //}
        //// Kiểm tra phạm vi kiểm tra trùng lịch
        //if (KiemTraTrungThoiGian_val == "") {
        //    edu.system.alert("Chọn phạm vi kiểm tra trùng lịch");
        //    return;
        //}
        //// Kiểm tra tổ hợp đăng ký
        //if (KiemTraToHopDangKy_val == "") {
        //    edu.system.alert("Chọn kiểm tra tổ hợp đăng ký");
        //    return;
        //}
        //// Kiểm tra quy định đăng ký mở rộng
        //if (KiemTraDangKyMoRong_val == "") {
        //    edu.system.alert("Chọn kiểm tra quy định đăng ký mở rộng");
        //    return;
        //}
        //// Kiểm tra quy định đăng ký học phần tương đương
        //if (QuyDinhDangKyHPTuongDuong_val == "") {
        //    edu.system.alert("Chọn kiểm tra quy định đăng ký học phần tương đương");
        //    return;
        //}
        //// Kiểm tra quy định đổi lớp học phần
        //if (QuyDinhDoiLopHocPhan_val == "") {
        //    edu.system.alert("Chọn kiểm tra quy định đổi lớp học phần");
        //    return;
        //}
        //// Kiểm tra đăng ký một lần trong kỳ
        //if (QuyDinhDangKyMotLan_val == "") {
        //    edu.system.alert("Chọn kiểm tra quy định đăng ký 1 lần trong kỳ");
        //    return;
        //}
        //// Kiểm tra đăng ký nhiều lần trong kỳ
        //if (QuyDinhDangKyNhieuLan_val == "") {
        //    edu.system.alert("Chọn kiểm tra quy định đăng ký nhiều lần trong kỳ");
        //    return;
        //}
        //// Kiểm tra điều kiện tiên quyết học phần
        //if (QuyDinhRangBuocHocPhan_val == "") {
        //    edu.system.alert("Chọn kiểm tra điều kiện tiên quyết học phần");
        //    return;
        //}
        //// Kiểm tra quy định nâng điểm
        //if (QDND_val == "") {
        //    edu.system.alert("Chọn kiểm tra điều kiện tiên quyết học phần");
        //    return;
        //}


        //--Edit
        var obj_save = {
            'action': 'NS_DKH_CHUNG2_MH/FSkkLB4FIC8mCjgeCiQJLiAiKQUgLyYKOAPP',
            'func': 'pkg_dangkyhoc_chung2.Them_DangKy_KeHoachDangKy',
            'iM': edu.system.iM,
            'strId': '',
            'strTenKeHoach': edu.util.getValById("txtTenKeHoach"),
            'strMaKeHoach': edu.util.getValById("txtMaKeHoach"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strMoHinhDangKy_Id': MHDK_val,
            'strTrangThai_Id': CheDoDangKy_val,
            'strKieuHoc_Ids': KDK_val,
            'dHienThiThongTinGiangVien': QDGV_val ? QDGV_val : undefined,
            'dHieuLuc': DenHan_val ? DenHan_val: undefined,
            'dSoTinChiToiDaN2': edu.util.getValById("txtSoTCToiDaN2") ? edu.util.getValById("txtSoTCToiDaN2"): undefined,
            'dSoTinChiToiThieuN2': edu.util.getValById("txtSoTCToiThieuN2") ? edu.util.getValById("txtSoTCToiThieuN2"): undefined,
            'strTrangThaiSinhVien_Ids': TrangThaiSinhVien_val,
            'strQuyDinhKiemTraHocPhi_Id': QuyDinhKiemTraTaiChinh_val,
            'dChoPhepNguocHocHuyHocPhan': ChoPhepNguocHocHuyHocPhan_val ? ChoPhepNguocHocHuyHocPhan_val: undefined,
            'dKhongChoPhepCoVanDangKy': CovanDangKy_val ? CovanDangKy_val: undefined,
            'dKiemTraSoTinChiToiDa': KiemTraTinChiToiDa_val ? KiemTraTinChiToiDa_val: undefined,
            'dKiemTraSoTinChiToiThieu': KiemTraTinChiToiThieu_val ? KiemTraTinChiToiThieu_val: undefined,
            'strQuyDinhTinChiToiDa_Id': CachTinhTinChiToiDa_val,
            'dKiemTraTrungLich': KTTLich_val ? KTTLich_val: undefined,
            'dKiemTraTrungLopKhongXep': KTTLop_val ? KTTLop_val: undefined,
            'strKiemTraTrungThoiGian_Id': KiemTraTrungThoiGian_val,
            'strDangKyTheoToHopQuyDinh_Id': KiemTraToHopDangKy_val,
            'dChoPhepDangKyMoRong': KiemTraDangKyMoRong_val ? KiemTraDangKyMoRong_val: undefined,
            'dChoPhepDangKyHPTuongDuong': QuyDinhDangKyHPTuongDuong_val ? QuyDinhDangKyHPTuongDuong_val: undefined,
            'dKhongChoPhepDoiLopHocPhan': QuyDinhDoiLopHocPhan_val ? QuyDinhDoiLopHocPhan_val: undefined,
            'dChiDangKyMotLanTrongKy': QuyDinhDangKyMotLan_val ? QuyDinhDangKyMotLan_val: undefined,
            'dKiemTraRangBuocHocPhan': QuyDinhRangBuocHocPhan_val ? QuyDinhRangBuocHocPhan_val: undefined,
            'strQuyDinhDangKyNangDiem_Id': QDND_val,
            
            'dGioDangKyTrongNgayDau': edu.util.getValById("txtBD_Gio") ? edu.util.getValById("txtBD_Gio"): undefined,
            'dGioKetThucTrongNgayCuoi': edu.util.getValById("txtKT_Gio")? edu.util.getValById("txtKT_Gio"): undefined,
            'strNgayBatDau': edu.util.getValById("txtBD_Ngay"),
            'strNgayKetThuc': edu.util.getValById("txtKT_Ngay"),
            'dSoHocPhiNoToiDaChoPhep': edu.util.getValById("txtNoToiDa")? edu.util.getValById("txtNoToiDa"): undefined,
            'dSoTinChiToiDa': edu.util.getValById("txtSoTCToiDa") ? edu.util.getValById("txtSoTCToiDa"): undefined,
            'dSoTinChiToiThieu': edu.util.getValById("txtSoTCToiThieu") ? edu.util.getValById("txtSoTCToiThieu"): undefined,
            'strNamHoc_Id': edu.util.getValById("dropThoiGian_Nam"),
            'strHocKy_Id': edu.util.getValById("dropThoiGian_Ky"),
            'strDotHoc_Id': edu.util.getValById("dropThoiGian_Dot"),
            'dPhanTramDangKyMoRong': edu.util.getValById("txtTyLeVuot") ? edu.util.getValById("txtTyLeVuot"): undefined,
            'dPhutDangKyTrongNgayDau': edu.util.getValById("txtBD_Phut")? edu.util.getValById("txtBD_Phut"): undefined,
            'dPhutKetThucTrongNgayCuoi': edu.util.getValById("txtKT_Phut")? edu.util.getValById("txtKT_Phut"): undefined,
            'dSoNgayDuocPhepRutHocPhan': edu.util.getValById("txtSoNgayRutHP") ? edu.util.getValById("txtSoNgayRutHP") : undefined,
            'strNgayBatDauTinhRutHP': edu.util.getValById("txtNgayBDRutHP"),
            'dKiemTraTaiChinh': KiemTraTinhTrangTaiChinh_val ? KiemTraTinhTrangTaiChinh_val: undefined,
            'strMucDiemChuHe4_NangDiem': edu.util.getValById("dropMucDiem"),
            'strNguoiThucHien_Id': edu.system.userId,
            'dSoGiayCho': edu.util.getValById('txtSoGiayCho') ? edu.util.getValById('txtSoGiayCho'): undefined,
            'strPhanLoaiDotDangKy_Id': edu.util.getValById('dropPhanLoaiDot'),
            'dHienThiDonGiaHocPhi': HienThiDonGia ? HienThiDonGia : undefined,
            'dTinhPhiTuDong': TuDongTinhTien ? TuDongTinhTien: undefined,
            'dTinhPhiTuDongKhiXacNhan': TuDongTinhPhi,
            'dKiemTraDinhHuongHocTap': HDHT,
            'strQuyDinhTCToiDa_PhamVi_Id': CachTinhTinChiToiDaPV_val,

            'strMoHinhUuTienDaDKNV_Id': edu.util.getValById('dropMucUuTienNguyenVong'),
            'strDSNguyenVongLuaChon_Id': NVUT_val,
            'strKTDangKySoTinCuaKhoiTC_Id': edu.util.getValById('dropTuyChonKTVuot'),
            'strKieuHocLai_PhanLoai_Id': LDHL_val,
            'dApDungLuuBangTamTaiChinh': $("#chkTinhTaiChinh").is(':checked') ? 1 : undefined,
            'dApDungLuuBangTamLHocPhan': $("#chkTinhLopHocPhan").is(':checked') ? 1 : undefined,
            'dApDungLuuBangTamHocPhan': $("#chkTinhHocPhan").is(':checked') ? 1 : undefined,
            'strNgayBatDauXacNhan': edu.system.getValById('txtNgayBatDauXN'),
            'strNgayKetThucXacNhan': edu.system.getValById('txtNgayKetThucXN'),
        };
        if (me.strKeHoachDangKy_Id != "") {
            obj_save.action = 'NS_DKH_CHUNG2_MH/EjQgHgUgLyYKOB4KJAkuICIpBSAvJgo4';
            obj_save.func = 'pkg_dangkyhoc_chung2.Sua_DangKy_KeHoachDangKy';

            obj_save.strId = me.strKeHoachDangKy_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KeHoachDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoachDangKy: function () {
        var me = main_doc.KeHoachDangKy;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKeHoachDangKy = dtResult;
                    me.genTable_KeHoachDangKy(dtResult, iPager);
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
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_KeHoachDangKy: function (strId) {
        var me = this;
        me.viewForm_KeHoachDangKy(me.dtKeHoachDangKy.find(element => element.ID === strId));
    },
    delete_KeHoachDangKy: function (Ids) {
        var me = main_doc.KeHoachDangKy;
        //--Edit
        var obj_delete = {
            'action': 'DKH_KeHoachDangKy/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_KeHoachDangKy();
                me.toggle_detail("zonebatdau");
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

    /*----------------------------------------------
    --Date of created: 2
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    genTable_KeHoachDangKy: function (data, iPager) {
        var me = main_doc.KeHoachDangKy;
        var jsonForm = {
            strTable_Id: "tblKHDK",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_KeHoachDangKy()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit"></i></a></span>';
                    }
                },
                {
                "mDataProp": "MAKEHOACH"
            },
            {
                "mDataProp": "TENKEHOACH"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnThietDatXuLyLHP" id="' + aData.ID + '" title="Thiết đặt thêm xử lý lớp HP"><i class="fa fa-cog"></i></a></span>';
                }
            },
            {
                "mDataProp": "NGAYBATDAU"
            },
            {
                "mDataProp": "GIODANGKYTRONGNGAYDAU"
            },
            {
                "mDataProp": "PHUTDANGKYTRONGNGAYDAU"
            },
            {
                "mDataProp": "NGAYKETTHUC"
            },
            {
                "mDataProp": "GIOKETTHUCTRONGNGAYCUOI"
            },
            {
                "mDataProp": "PHUTKETTHUCTRONGNGAYCUOI"
            },
            {
                "mDataProp": "TRANGTHAI_TEN"
            },
            {
                "mDataProp": "MOHINHDANGKY_TEN"
            },
            {
                "mDataProp": "SOLUONGDUKIEN"
            },
            {
                "mData": "SOLUONGDADANGKY",
                "mRender": function (nRow, aData) {
                    return edu.util.returnEmpty(aData.SOLUONGDADANGKY) + '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye"></i></a></span>';
                }
                },
                {
                    "mData": "SoLuongKhongDangKy",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONGKHONGDANGKY) + '<span><a class="btn btn-default btnDetailKhongDangKy" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye"></i></a></span>';
                    }
                },
            {
                "mDataProp": "TYLE"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnPhanQuyen" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit"></i></a></span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_KeHoachDangKy: function (data) {
        var me = main_doc.KeHoachDangKy;
        //call popup --Edit
        $("#DSTrangThaiSV input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divKieuDangKy input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divLyDoHocLai input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divMoHinh input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        edu.util.toggle_overide("zone-content", "zoneEdit");
        //view data --Edit
        edu.util.viewValById("txtTenKeHoach", data.TENKEHOACH);
        edu.util.viewValById("txtMaKeHoach", data.MAKEHOACH);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropThoiGian_Nam", data.DAOTAO_THOIGIANDAOTAO_NAM_ID);
        me.getList_ThoiGianDaoTao();
        edu.util.viewValById("dropThoiGian_Ky", data.DAOTAO_THOIGIANDAOTAO_KY_ID);
        me.getList_DotHoc();
        edu.util.viewValById("dropThoiGian_Dot", data.DAOTAO_THOIGIANDAOTAO_DOT_ID);
        edu.util.viewValById("txtBD_Ngay", data.NGAYBATDAU);
        edu.util.viewValById("txtBD_Gio", data.GIODANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtBD_Phut", data.PHUTDANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtKT_Ngay", data.NGAYKETTHUC);
        edu.util.viewValById("txtKT_Gio", data.GIOKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtKT_Phut", data.PHUTKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtNoToiDa", data.SOHOCPHINOTOIDACHOPHEP);
        edu.util.viewValById("txtSoNgayRutHP", data.SONGAYDUOCPHEPRUTHOCPHAN);
        edu.util.viewValById("txtNgayBDRutHP", data.NGAYBATDAUTINHRUTHOCPHAN);
        edu.util.viewValById("txtSoTCToiDa", data.SOTINCHITOIDA);
        edu.util.viewValById("txtSoTCToiThieu", data.SOTINCHITOITHIEU);
        edu.util.viewValById("txtSoTCToiDaN2", data.SOTINCHITOIDAN2);
        edu.util.viewValById("txtSoTCToiThieuN2", data.SOTINCHITOITHIEUN2);
        edu.util.viewValById("txtTyLeVuot", data.PHANTRAMDANGKYVUOTQUYDINH);
        edu.util.viewValById("txtSoGiayCho", data.SOGIAYCHO);
        edu.util.viewValById("dropPhanLoaiDot", data.PHANLOAIDOTDANGKY_ID);
        edu.util.viewValById("dropMucDiem", data.MUCDIEMCHUHE4_NANGDIEM);
        edu.util.viewValById("divMoHinh", data.MOHINHDANGKY_ID);
        edu.util.viewValById("dropTuyChonKTVuot", data.KIEMTRADANGKYSOTINCUAKHOITC_ID );
        edu.util.viewValById("dropMucUuTienNguyenVong", data.MOHINHUUTIENDADKNGUYENVONG_ID);
        $("#divMoHinh #" + data.MOHINHDANGKY_ID).each(function () {
            $(this).attr('checked', true);
            $(this).prop('checked', true);
        });
        $("#divDenHan #" + data.HIEULUC).trigger("click");
        //$("#strTrangThaiSinhVien_Ids #" + data.TRANGTHAISINHVIEN_IDS).attr("checked", "checked");
        $("#divHienThiThongTinGiangVien #QDGV_" + data.HIENTHITHONGTINGIANGVIEN).trigger("click");
        $("#divCachTinhTinChiToiDa #" + data.QUYDINHTINCHITOIDA_ID).trigger("click");
        $("#divCachTinhTinChiToiDaPV #" + data.QUYDINHTINCHITOIDA_PHAMVI_ID).trigger("click");
        //$("#divKTdivCachTinhTinChiToiDaTCTD #" + data.QUYDINHTINCHITOIDA_ID).attr("checked", "checked");
        $("#divQuyDinhNangDiem #" + data.QUYDINHDANGKYNANGDIEM_ID).trigger("click");
        $("#divDKTheoToHopQuyDinh #" + data.DANGKYTHEOTOHOPQUYDINH_ID).trigger("click");
        $("#divKiemTranTrungThoiGian #" + data.KIEMTRATRUNGTHOIGIAN_ID).trigger("click");
        //$("#divCheDoDangKy #" + data.TRANGTHAI_ID).attr("checked", "checked");

        UpdateCheck("#divCheDoDangKy", data.TRANGTHAI_ID);
        console.log(data.KIEMTRATAICHINH);
        console.log($("#divKiemTraTinhTrangTaiChinh #KTTC_" + data.KIEMTRATAICHINH))
        $("#divKiemTraTinhTrangTaiChinh #KTTC_" + data.KIEMTRATAICHINH).trigger("click");
        $("#divHienThiDonGia #HienThiDonGia_" + data.HIENTHIDONGIAHOCPHI).trigger("click");
        $("#divTuDongTinhTien #TuDongTinhTien_" + data.TINHPHITUDONG).trigger("click");
        $("#divTuDongTinhPhi #TuDongTinhPhi_" + data.TINHPHITUDONGKHIXACNHAN).trigger("click");
        if (data.KIEUHOC_IDS) $("#divKieuDangKy #" + data.KIEUHOC_IDS.replace(/,/g, ",#")).each(function () {
            $(this).attr('checked', true);
            $(this).prop('checked', true);
        });
        if (data.KIEUHOCLAI_PHANLOAI_ID) $("#divLyDoHocLai #" + data.KIEUHOCLAI_PHANLOAI_ID.replace(/,/g, ",#")).each(function () {
            $(this).attr('checked', true);
            $(this).prop('checked', true);
        });
        if (data.TRANGTHAISINHVIEN_IDS) {
            if (data.TRANGTHAISINHVIEN_IDS.indexOf(',') != -1) {
                data.TRANGTHAISINHVIEN_IDS.split(',').forEach(e => {
                    console.log(("#DSTrangThaiSV #" + e))
                    $("#DSTrangThaiSV #" + e).each(function () {
                        $(this).attr('checked', true);
                        $(this).prop('checked', true);
                    });
                });
            } else {
                $("#DSTrangThaiSV #" + data.TRANGTHAISINHVIEN_IDS.replace(/,/g, ",#")).each(function () {
                    $(this).attr('checked', true);
                    $(this).prop('checked', true);
                });
            }
        }

        if (data.DSNGUYENVONGLUACHON_ID) $("#divNguyenVongUuTien #" + data.DSNGUYENVONGLUACHON_ID.replace(/,/g, ",#")).each(function () {
            $(this).attr('checked', true);
            $(this).prop('checked', true);
        });
        $("#divQDHuyHocPhan #QDHuyHocPhan_" + data.CHOPHEPNGUOCHOCHUYHOCPHAN).trigger("click");
        $("#divQDCoVanDangKyChoSV #CoVanDangKy_" + data.KHONGCHOPHEPCOVANDANGKY).trigger("click");
        $("#divKTTCTD #TCTD_" + data.KIEMTRASOTINCHITOIDA).trigger("click");
        $("#divKTTCTT #TCTT_" + data.KIEMTRASOTINCHITOITHIEU).trigger("click");
        $("#divKiemTraTrungLich #KTTrungLich_" + data.KIEMTRATRUNGLICH).trigger("click");
        $("#divKiemTraTrungLop #KTTrungLop_" + data.KIEMTRATRUNGLOPKHONGXEP).trigger("click");
        $("#divDKMR #DKMR_" + data.CHOPHEPDANGKYNGOAICHUONGTRINH).trigger("click");
        $("#divDKHPTD #DKHPTD_" + data.CHOPHEPDANGKYHPTUONGDUONG).trigger("click");
        $("#divDoiHocPhan #DoiHocPhan_" + data.KHONGCHOPHEPDOILOPHOCPHAN).trigger("click");
        $("#divDKMotLanTrongKy #DKMotLanTrongKy_" + data.CHIDANGKYMOTLANTRONGKY).trigger("click");
        //$("#divDangKyNhieuLanTrongDot #DKMotLanTrongKyDangKyNhieuLanTrongDot_" + data.CHIDANGKYMOTLANTRONGKY).attr("checked", "checked");
        $("#divKRDKTQ #KRDKTQ_" + data.KIEMTRARANGBUOCHOCPHAN).trigger("click");
        $("#divHDHT #HDHT_" + data.KIEMTRADINHHUONGHOCTAP).trigger("click");
        $("#divQuyDinhKiemTraTaiChinh #" + data.QUYDINHKIEMTRAHOCPHI_ID).trigger("click");


        $("#chkTinhHocPhan").prop("checked", data.APDUNGLUUBANGTAMHOCPHAN);
        $("#chkTinhTaiChinh").prop("checked", data.APDUNGLUUBANGTAMTAICHINH);
        $("#chkTinhLopHocPhan").prop("checked", data.APDUNGLUUBANGTAMLOPHOCPHAN);
        edu.util.viewValById("txtNgayBatDauXN", data.NGAYBATDAUXACNHAN);
        edu.util.viewValById("txtNgayKetThucXN", data.NGAYKETTHUCXACNHAN);

        function UpdateCheck(strZoneId, strKetQua) {
            $(strZoneId + " input").each(function () {
                $(this).attr('checked', false);
                $(this).prop('checked', false);
            });
            setTimeout(function () {
                $(strZoneId + " #" + strKetQua).attr("checked", true);
                $(strZoneId + " #" + strKetQua).prop("checked", true);
            }, 200);
        }
    },

    /*----------------------------------------------
    --Date of created: 2
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    getList_NamHoc: function () {
        var me = main_doc.KeHoachDangKy;

        //--Edit
        var obj_list = {
            'action': 'KHCT_NamHoc/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'strCanBoNhapDeTai_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_NamHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert("KHCT_NamHoc/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_NamHoc/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NamHoc: function (data) {
        var me = main_doc.KeHoachDangKy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                order: "unorder"
            },
            renderPlace: ["dropThoiGian_Nam"],
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo HocKy
    ----------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = main_doc.KeHoachDangKy;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',
            

            'strTuKhoa':"",
            'strDAOTAO_NAM_Id': edu.util.getValById("dropThoiGian_Nam"),
            'strNguoiThucHien_Id': "",
            'pageIndex':1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    dtResult = dtResult.filter(e => e.HOCKY && !e.THANG && !e.DOTHOC);
                    me.genCombo_ThoiGianDaoTao(dtResult, iPager);
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
            async: false,
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachDangKy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOCKY",
                code: "HOCKY",
                order: "unorder"
            },
            renderPlace: ["dropThoiGian_Ky"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/
    getList_DotHoc: function () {
        var me = main_doc.KeHoachDangKy;

        //--Edit
        var obj_list = {
            'action': 'KHCT_DotHoc/LayDanhSach_RutGon',
            
            
            'strDaoTao_HocKy_Id': edu.util.getValById("dropThoiGian_Ky"),
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_DotHoc(dtResult, iPager);
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
            async: false,
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DotHoc: function (data) {
        var me = main_doc.KeHoachDangKy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOTHOC",
                code: "DOTHOC",
                order: "unorder"
            },
            renderPlace: ["dropThoiGian_Dot"],
            title: "Chọn đợt học"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianDaoTao_S: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachDangKy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoachDangKy.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;" />';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-4 checkbox-inline user-check-print">';
            row += '<input type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },

    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/

    getList_QuanSoTheoLop: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDSNguoiHocDangKy_KeHoach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult);
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

    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/

    getList_KhongDangKy: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_BaoCao/LayDSKhongDangKy',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongDangKy = dtReRult;
                    me.genTable_KhongDangKy(dtReRult);
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

    genTable_KhongDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKhongDangKy",
            aaData: data,
            colPos: {
                center: [0],
                right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAI_TEN"
                },
                {
                    //"mDataProp": "TONGNOPHI",
                    mRender: function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGNOPHI)
                    }
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: Xuất Excel danh sách "Không đăng ký" đang hiển thị
    --Nguồn: me.dtKhongDangKy (đã cache khi mở modal)
    --Lib: XLSX-JS-STYLE load lazy từ CDN trong kehoachdangky.html
    -------------------------------------------*/
    exportExcel_KhongDangKy: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert('Thư viện Excel chưa load xong. Vui lòng thử lại sau vài giây.', 'w');
            return;
        }
        var data = me.dtKhongDangKy || [];
        if (!data.length) {
            edu.system.alert('Không có dữ liệu để xuất.', 'w');
            return;
        }
        var v = edu.util.returnEmpty;
        var headers = [
            'STT', 'Mã số sinh viên', 'Họ đệm', 'Tên', 'Trạng thái',
            'Nợ phí', 'Chương trình', 'Lớp quản lý', 'Khóa học'
        ];
        var dataRows = data.map(function (e, i) {
            return [
                i + 1,
                v(e.QLSV_NGUOIHOC_MASO),
                v(e.QLSV_NGUOIHOC_HODEM),
                v(e.QLSV_NGUOIHOC_TEN),
                v(e.QLSV_TRANGTHAI_TEN),
                Number(e.TONGNOPHI) || 0,
                v(e.DAOTAO_TOCHUCCHUONGTRINH_TEN),
                v(e.DAOTAO_LOPQUANLY_TEN),
                v(e.DAOTAO_KHOADAOTAO_TEN)
            ];
        });
        var aoa = [headers].concat(dataRows);
        var ws = XLSX.utils.aoa_to_sheet(aoa);

        // Auto-width
        ws['!cols'] = headers.map(function (h, idx) {
            var maxLen = (h || '').length;
            dataRows.forEach(function (r) {
                var l = String(r[idx] == null ? '' : r[idx]).length;
                if (l > maxLen) maxLen = l;
            });
            return { wch: Math.min(maxLen + 2, 40) };
        });

        // Styling (bản community sẽ bỏ qua không lỗi)
        var headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { patternType: "solid", fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "999999" } },
                bottom: { style: "thin", color: { rgb: "999999" } },
                left: { style: "thin", color: { rgb: "999999" } },
                right: { style: "thin", color: { rgb: "999999" } }
            }
        };
        var thinBorder = {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } }
        };
        var nCols = headers.length;
        for (var hc = 0; hc < nCols; hc++) {
            var addrH = XLSX.utils.encode_cell({ r: 0, c: hc });
            if (!ws[addrH]) ws[addrH] = { v: '', t: 's' };
            ws[addrH].s = headerStyle;
        }
        ws['!views'] = [{ state: 'frozen', ySplit: 1 }];
        ws['!rows'] = [{ hpt: 26 }];
        for (var i = 0; i < dataRows.length; i++) {
            for (var cc = 0; cc < nCols; cc++) {
                var addr = XLSX.utils.encode_cell({ r: i + 1, c: cc });
                if (!ws[addr]) ws[addr] = { v: '', t: 's' };
                ws[addr].s = { border: thinBorder, alignment: { vertical: 'center', wrapText: true } };
            }
        }

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Không đăng ký');

        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                    + '_' + pad(now.getHours()) + pad(now.getMinutes());
        XLSX.writeFile(wb, 'DSKhongDangKy_' + stamp + '.xlsx');
    },

    /*------------------------------------------
    --Discription: [2] AccessDB _ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_KeHoach_NhanSu/Them_DangKy_KeHoach_NhanSu',
            'type': 'POST',

            'strId': $("#rm_row" + strNhanSu_Id).attr("name"),
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'dKhongKiemTraSoTinChiToiDa': edu.util.getValById('txtTinChiToiDa_' + strNhanSu_Id),
            'dKhongKiemTraSTCToiThieu': edu.util.getValById('txtTinChiToiThieu_' + strNhanSu_Id),
            'dKhongKiemTraTTHocPhi': edu.util.getValById('txtHocPhan_' + strNhanSu_Id),
            'dKhongKiemTraSiSo': edu.util.getValById('txtSiSoToiDa_' + strNhanSu_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_KeHoach_NhanSu/Sua_DangKy_KeHoach_NhanSu';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoach_NhanSu/LayDSDangKy_KeHoach_NhanSu',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'DKH_KeHoach_NhanSu/Xoa_DangKy_KeHoach_NhanSu',
            
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: "DKH_KeHoach_NhanSu/Xoa_DangKy_KeHoach_NhanSu: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "DKH_KeHoach_NhanSu/Xoa_DangKy_KeHoach_NhanSu (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_TTS_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strNhanSu_Id = data[i].NGUOIDUNG_ID;
            var html = "";
            html += "<tr id='rm_row" + data[i].NGUOIDUNG_ID + "' name='" + data[i].ID +"'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_TAIKHOAN + "</span></td>";
            html += "<td><input class='form-control' id='txtTinChiToiDa_" + strNhanSu_Id + "' value='" + edu.util.returnEmpty(data[i].KHONGKIEMTRASOTINCHITOIDA) + "' ></input></td>";
            html += "<td><input class='form-control' id='txtTinChiToiThieu_" + strNhanSu_Id + "' value='" + edu.util.returnEmpty(data[i].KHONGKIEMTRASOTINCHITOITHIEU) + "'></input></td>";
            html += "<td><input class='form-control' id='txtHocPhan_" + strNhanSu_Id + "' value='" + edu.util.returnEmpty(data[i].KHONGKIEMTRATINHTRANGHOCPHI) + "'></input></td>";
            html += "<td><input class='form-control' id='txtSiSoToiDa_" + strNhanSu_Id + "' value='" + edu.util.returnEmpty(data[i].KHONGKIEMTRASISOTOIDA) + "'></input></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TTS_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        console.log(1111111);
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name=''>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><input class='form-control' id='txtTinChiToiDa_" + strNhanSu_Id + "'></input></td>";
        html += "<td><input class='form-control' id='txtTinChiToiThieu_" + strNhanSu_Id + "'></input></td>";
        html += "<td><input class='form-control' id='txtHocPhan_" + strNhanSu_Id + "'></input></td>";
        html += "<td><input class='form-control' id='txtSiSoToiDa_" + strNhanSu_Id + "'></input></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TTS_ThanhVien tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_TTS_ThanhVien tbody").html("");
            $("#tblInput_TTS_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    getList_NguyenVongUuTien: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayDSKeHoachDKNV',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NguyenVongUuTien(dtReRult);
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
    genTable_NguyenVongUuTien: function (data, iPager) {
        var me = this;
        var zone_id = "divNguyenVongUuTien";
        var jsonResult = data.Data;
        if (edu.util.checkValue(jsonResult)) {
            //zone_id 
            var row = '';
            //call
            if (typeof callback === "function") {
                callback(jsonResult);
                return;
            }
            if (type == undefined) {
                type = 12 / (jsonResult.length);
            }
            if (typeof (type) == 'object' && type.length == jsonResult.length) {
                for (var i = 0; i < jsonResult.length; i++) {
                    row += '<div class="col-sm-' + type[i] + '"><input id="' + jsonResult[i].ID + '" type="checkbox" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
                }
                $("#" + zone_id).html(row);
                return;
            }
            for (var i = 0; i < jsonResult.length; i++) {
                row += '<div class="col-sm-' + type + '"><input id="' + jsonResult[i].ID + '" type="checkbox" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
            }
            $("#" + zone_id).html(row);
        }
        /*III. Callback*/
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
            renderPlace: ["dropSearch_HeDaoTao_PCKhoaHoc", "dropSearch_HeDaoTao_PCChuongTrinh", "dropSearch_HeDaoTao_PCNKS"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KhoaDaoTao: function (strDaoTao_HeDaoTao_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRIKKS4gBSAuFSAu',
            'func': 'PKG_DANGKYHOC_THONGTIN2.LayDSKhoaDaoTao',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENKHOA",
                            code: "", 
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KhoaDaoTao_PCChuongTrinh"],
                        type: "",
                        title: "Chọn khóa đào tạo",
                    });

                    var jsonForm = {
                        strTable_Id: "tblPCNhomKiemSoat",
                        aaData: data.Data,
                        colPos: {
                            center: [0,3],
                            //right: [5]
                        },
                        aoColumns: [
                            {
                                "mDataProp": "MAKHOA"
                            },
                            {
                                "mDataProp": "TENKHOA"
                            }
                            , {
                                "mRender": function (nRow, aData) {
                                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                                }
                            }
                        ]
                    };
                    edu.system.loadToTable_data(jsonForm);
                    jsonForm.strTable_Id = "tblPCKhoaHoc"
                    edu.system.loadToTable_data(jsonForm);
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
    getList_ChuongTrinh: function (strDaoTao_HeDaoTao_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.LayDSChuongTrinh',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropSearch_HeDaoTao_PCChuongTrinh'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropSearch_KhoaDaoTao_PCChuongTrinh'),
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var jsonForm = {
                        strTable_Id: "tblPCChuongTrinh",
                        aaData: data.Data,
                        colPos: {
                            center: [0, 3],
                            //right: [5]
                        },
                        aoColumns: [
                            {
                                "mDataProp": "MACHUONGTRINH"
                            },
                            {
                                "mDataProp": "TENCHUONGTRINH"
                            }
                            , {
                                "mRender": function (nRow, aData) {
                                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                                }
                            }
                        ]
                    };
                    edu.system.loadToTable_data(jsonForm);
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

    dtXuLyDacThu: [],
    cbLoad_XuLyDacThu: function (data) {
        main_doc.KeHoachDangKy.dtXuLyDacThu = edu.util.checkValue(data) ? data : [];
    },
    genOptions_XuLyDacThu: function (selectedId) {
        var me = main_doc.KeHoachDangKy;
        var options = '<option value="">-- Chọn --</option>';
        var arr = me.dtXuLyDacThu || [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var id = item.ID || item.MA || '';
            var ten = item.TEN || item.TENDANHMUC || '';
            var sel = (selectedId && String(selectedId) == String(id)) ? ' selected' : '';
            options += '<option value="' + id + '"' + sel + '>' + ten + '</option>';
        }
        return options;
    },
    dtXuLyLHP_All: [],
    pageIndex_XuLyLHP: 1,
    pageSize_XuLyLHP: 20,
    openModal_XuLyLHP: function (strId) {
        var me = this;
        me.dtXuLyLHP_All = [];
        me.pageIndex_XuLyLHP = 1;
        me.pageSize_XuLyLHP = parseInt($("#dropPageSize_XuLyLHP").val()) || 20;
        $("#tblXuLyLHP tbody").html("");
        $("#dropBulkXuLyDacThu").html(me.genOptions_XuLyDacThu(""));
        $("#chkSelectAll_XuLyLHP").prop('checked', false);
        $("#chkSelectAll_XuLyLHP").prop({ checked: false, indeterminate: false });
        $("#myModalXuLyLHP").modal("show");
        me.getList_XuLyLHP();
    },
    openModal_ChonLHP: function () {
        var me = this;
        $("#txtSearch_ChonLHP").val("");
        $("#dropLaLopRieng").val("");
        $("#chkSelectAll_ChonLHP").prop('checked', false);
        $("#tblChonLHP tbody").html("");
        $("#myModalChonLHP").modal("show");
        me.getList_PhanCongLHP();
    },
    syncHeaderCheckbox_ChonLHP: function () {
        var me = this;
        var existingIds = {};
        $("#tblXuLyLHP tbody tr").each(function () {
            var id = $(this).attr("data-lhp-id");
            if (id) existingIds[id] = true;
        });
        for (var k = 0; k < me.dtXuLyLHP_All.length; k++) {
            var did = me.dtXuLyLHP_All[k].DANGKY_LOPHOCPHAN_ID;
            if (did) existingIds[did] = true;
        }
        var arr = me.dtChonLHP_Filtered || [];
        if (arr.length === 0) {
            $("#chkSelectAll_ChonLHP").prop({ checked: false, indeterminate: false });
            return;
        }
        var selectedCount = 0;
        for (var i = 0; i < arr.length; i++) {
            if (existingIds[arr[i].ID]) selectedCount++;
        }
        var $hdr = $("#chkSelectAll_ChonLHP");
        if (selectedCount === 0) {
            $hdr.prop({ checked: false, indeterminate: false });
        } else if (selectedCount === arr.length) {
            $hdr.prop({ checked: true, indeterminate: false });
        } else {
            $hdr.prop({ checked: false, indeterminate: true });
        }
    },
    toggleSelectAll_ChonLHP: function (checked) {
        var me = this;
        var existingIds = {};
        $("#tblXuLyLHP tbody tr").each(function () {
            var id = $(this).attr("data-lhp-id");
            if (id) existingIds[id] = $(this);
        });
        var arr = me.dtChonLHP_Filtered || [];
        var addCount = 0, blockedSaved = 0;
        for (var i = 0; i < arr.length; i++) {
            var row = arr[i];
            var lhpId = row.ID;
            if (!lhpId) continue;
            if (checked) {
                if (existingIds[lhpId]) continue;
                me.addRow_XuLyLHP({
                    TENLOP: row.TENLOP,
                    MALOP: row.MALOP,
                    DANGKY_LOPHOCPHAN_ID: lhpId
                });
                addCount++;
            }
            else {
                var $existing = existingIds[lhpId];
                if (!$existing) continue;
                if ($existing.attr("data-id")) {
                    blockedSaved++;
                    continue;
                }
                $existing.remove();
            }
        }
        if (!checked) me.reindexRows_XuLyLHP();
        var existingMap = {};
        for (var i = 0; i < me.dtXuLyLHP_All.length; i++) {
            var d = me.dtXuLyLHP_All[i];
            if (d.DANGKY_LOPHOCPHAN_ID) existingMap[d.DANGKY_LOPHOCPHAN_ID] = i;
        }
        var arr = me.dtChonLHP_Filtered || [];
        var blockedSaved = 0;
        var idsToRemove = {};
        for (var j = 0; j < arr.length; j++) {
            var row = arr[j];
            var lhpId = row.ID;
            if (!lhpId) continue;
            if (checked) {
                if (existingMap.hasOwnProperty(lhpId)) continue;
                me.dtXuLyLHP_All.push({
                    ID: '',
                    DANGKY_LOPHOCPHAN_ID: lhpId,
                    TENLOP: row.TENLOP,
                    MALOP: row.MALOP,
                    XULYDACTHU_ID: '',
                    _selected: false
                });
            }
            else {
                if (!existingMap.hasOwnProperty(lhpId)) continue;
                if (me.dtXuLyLHP_All[existingMap[lhpId]].ID) {
                    blockedSaved++;
                    continue;
                }
                idsToRemove[lhpId] = true;
            }
        }
        if (!checked && Object.keys(idsToRemove).length) {
            me.dtXuLyLHP_All = me.dtXuLyLHP_All.filter(function (d) {
                return !(idsToRemove[d.DANGKY_LOPHOCPHAN_ID] && !d.ID);
            });
        }
        me.renderPage_XuLyLHP();
        me.renderPage_ChonLHP();
        if (blockedSaved > 0) {
            edu.system.alert("Có " + blockedSaved + " lớp đã lưu trước đó nên không thể bỏ chọn ở đây. Hãy dùng nút xóa trong bảng bên dưới.");
        }
    },
    getList_PhanCongLHP: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/ETMeBSAvJgo4HhEpIC8CLi8mHg0JER4GJDUDOAPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_PhanCong_LHP_GetBy',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strLaLopRieng': $("#dropLaLopRieng").val() || '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTroDangNhap_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    //console.log("[DEBUG] Pr_DangKy_PhanCong_LHP_GetBy first row:", arr[0], "total:", arr.length);
                    me.genTable_ChonLHP(arr);
                }
                else {
                    me.genTable_ChonLHP([]);
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                me.genTable_ChonLHP([]);
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    dtChonLHP_All: [],
    dtChonLHP_Filtered: [],
    pageIndex_ChonLHP: 1,
    pageSize_ChonLHP: 10,
    genTable_ChonLHP: function (data) {
        var me = this;
        me.dtChonLHP_All = (data || []).map(function (row) {
            return {
                ID: row.DANGKY_LOPHOCPHAN_ID || row.LOPHOCPHAN_ID || row.ID || '',
                TENLOP: row.DANGKY_LOPHOCPHAN_TEN || row.LOPHOCPHAN_TEN || row.TENLOP || '',
                MALOP: row.DANGKY_LOPHOCPHAN_MA || row.LOPHOCPHAN_MA || row.MALOP || '',
                LALOPRIENG: (
                    row.LOPRIENG == 1 || row.LOPRIENG === '1' ||
                    row.LopRieng == 1 || row.LopRieng === '1' ||
                    row.LALOPRIENG == 1 || row.LALOPRIENG === '1' ||
                    row.LA_LOP_RIENG == 1 || row.LA_LOP_RIENG === '1'
                ) ? 1 : 0
            };
        });
        me.pageIndex_ChonLHP = 1;
        me.pageSize_ChonLHP = parseInt($("#dropPageSize_ChonLHP").val()) || 10;
        me.filter_ChonLHP();
    },
    filter_ChonLHP: function () {
        var me = this;
        var kw = ($("#txtSearch_ChonLHP").val() || '').toLowerCase().trim();
        var laRiengFilter = $("#dropLaLopRieng").val() || '';
        me.dtChonLHP_Filtered = me.dtChonLHP_All.filter(function (row) {
            if (kw) {
                var hit = (row.TENLOP || '').toLowerCase().indexOf(kw) !== -1
                    || (row.MALOP || '').toLowerCase().indexOf(kw) !== -1;
                if (!hit) return false;
            }
            if (laRiengFilter === '1' && row.LALOPRIENG != 1) return false;
            if (laRiengFilter === '0' && row.LALOPRIENG == 1) return false;
            return true;
        });
        me.pageIndex_ChonLHP = 1;
        me.renderPage_ChonLHP();
    },
    renderPage_ChonLHP: function () {
        var me = this;
        var $tbody = $("#tblChonLHP tbody");
        var data = me.dtChonLHP_Filtered || [];
        var total = data.length;
        var pageSize = me.pageSize_ChonLHP;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (me.pageIndex_ChonLHP > totalPages) me.pageIndex_ChonLHP = totalPages;
        if (me.pageIndex_ChonLHP < 1) me.pageIndex_ChonLHP = 1;
        var start = (me.pageIndex_ChonLHP - 1) * pageSize;
        var end = Math.min(start + pageSize, total);

        $tbody.html("");
        if (total == 0) {
            $tbody.html('<tr><td colspan="5" class="td-center">Không có dữ liệu</td></tr>');
            $("#lblPageInfo_ChonLHP").text("");
            $("#pager_ChonLHP").html("");
            return;
        }
        var existingIds = {};
        for (var k = 0; k < me.dtXuLyLHP_All.length; k++) {
            var did = me.dtXuLyLHP_All[k].DANGKY_LOPHOCPHAN_ID;
            if (did) existingIds[did] = true;
        }
        var html = '';
        for (var i = start; i < end; i++) {
            var row = data[i];
            var id = row.ID;
            var tenLop = row.TENLOP;
            var maLop = row.MALOP;
            var laLopRieng = row.LALOPRIENG == 1;
            var already = existingIds[id];
            var chk = '<input type="checkbox" class="chkChonLHP" style="width:15px; height:15px; cursor:pointer;"'
                + (already ? ' checked' : '') + ' />';
            var badgeRieng = laLopRieng
                ? '<span class="badge" style="background:#3380db; color:#fff;font-weight:400; padding:4px 10px; border-radius:10px;">Có</span>'
                : '<span class="badge" style="background:#e1e1e1; color:#222;font-weight:400; padding:4px 10px; border-radius:10px;">Không</span>';
            html += "<tr data-id='" + id + "' data-tenlop='" + String(tenLop).replace(/'/g, "&#39;") + "' data-malop='" + String(maLop).replace(/'/g, "&#39;") + "'" + (already ? " class='row-selected'" : "") + ">";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'>" + tenLop + "</td>";
            html += "<td class='td-left'>" + maLop + "</td>";
            html += "<td class='td-center'>" + badgeRieng + "</td>";
            html += "<td class='td-center'>" + chk + "</td>";
            html += "</tr>";
        }
        $tbody.html(html);
        $("#lblPageInfo_ChonLHP").text("(" + (start + 1) + "–" + end + " / " + total + ")");
        me.renderPager_ChonLHP(totalPages);
        me.syncHeaderCheckbox_ChonLHP();
    },
    renderPager_ChonLHP: function (totalPages) {
        var me = this;
        var cur = me.pageIndex_ChonLHP;
        var $pager = $("#pager_ChonLHP");
        var html = '';
        var btn = function (label, page, disabled, active) {
            var cls = 'btn btn-sm btnPage_ChonLHP ' + (active ? 'btn-primary' : 'btn-default');
            return '<button type="button" class="' + cls + '" data-page="' + page + '"' + (disabled ? ' disabled' : '') + ' style="min-width:34px">' + label + '</button>';
        };
        html += btn('«', 1, cur == 1, false);
        html += btn('‹', cur - 1, cur == 1, false);
        var from = Math.max(1, cur - 2);
        var to = Math.min(totalPages, cur + 2);
        if (from > 1) {
            html += btn(1, 1, false, cur == 1);
            if (from > 2) html += '<span style="padding:0 6px; line-height:30px;">…</span>';
        }
        for (var p = from; p <= to; p++) {
            html += btn(p, p, false, p == cur);
        }
        if (to < totalPages) {
            if (to < totalPages - 1) html += '<span style="padding:0 6px; line-height:30px;">…</span>';
            html += btn(totalPages, totalPages, false, cur == totalPages);
        }
        html += btn('›', cur + 1, cur == totalPages, false);
        html += btn('»', totalPages, cur == totalPages, false);
        $pager.html(html);
    },
    getList_XuLyLHP: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/ETMeBQoeCikeDS4xCTEeBSAiFSk0HgYkNQM4',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DK_Kh_LopHp_DacThu_GetBy',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strXuLyDacThu_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTroDangNhap_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtXuLyLHP_All = arr.map(function (r) {
                        return {
                            ID: r.ID || '',
                            DANGKY_LOPHOCPHAN_ID: r.DANGKY_LOPHOCPHAN_ID || r.LOPHOCPHAN_ID || '',
                            TENLOP: r.TENLOP || r.DANGKY_LOPHOCPHAN_TEN || r.LOPHOCPHAN_TEN || '',
                            MALOP: r.MALOP || r.DANGKY_LOPHOCPHAN_MA || r.LOPHOCPHAN_MA || '',
                            XULYDACTHU_ID: r.XULYDACTHU_ID || r.QUYDINHLOPXULYDACTHU_ID || '',
                            _selected: false
                        };
                    });
                    me.pageIndex_XuLyLHP = 1;
                    me.renderPage_XuLyLHP();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    addRow_XuLyLHP: function (data) {
        var me = this;
        data = data || {};
        var lhpId = data.DANGKY_LOPHOCPHAN_ID || "";
        for (var i = 0; i < me.dtXuLyLHP_All.length; i++) {
            if (lhpId && me.dtXuLyLHP_All[i].DANGKY_LOPHOCPHAN_ID === lhpId) return;
        }
        me.dtXuLyLHP_All.push({
            ID: data.ID || '',
            DANGKY_LOPHOCPHAN_ID: lhpId,
            TENLOP: data.TENLOP || data.DANGKY_LOPHOCPHAN_TEN || data.LOPHOCPHAN_TEN || '',
            MALOP: data.MALOP || data.DANGKY_LOPHOCPHAN_MA || data.LOPHOCPHAN_MA || '',
            XULYDACTHU_ID: data.XULYDACTHU_ID || data.QUYDINHLOPXULYDACTHU_ID || '',
            _selected: false
        });
        me.renderPage_XuLyLHP();
    },
    renderPage_XuLyLHP: function () {
        var me = this;
        var $tbody = $("#tblXuLyLHP tbody");
        var data = me.dtXuLyLHP_All || [];
        var total = data.length;
        var pageSize = me.pageSize_XuLyLHP || 20;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (me.pageIndex_XuLyLHP > totalPages) me.pageIndex_XuLyLHP = totalPages;
        if (me.pageIndex_XuLyLHP < 1) me.pageIndex_XuLyLHP = 1;
        var start = (me.pageIndex_XuLyLHP - 1) * pageSize;
        var end = Math.min(start + pageSize, total);
        $tbody.html("");
        if (total === 0) {
            $("#lblPageInfo_XuLyLHP").text("");
            $("#pager_XuLyLHP").html("");
            me.syncSelectAll_XuLyLHP();
            return;
        }
        var html = '';
        for (var i = start; i < end; i++) {
            var d = data[i];
            html += "<tr data-idx='" + i + "' data-id='" + (d.ID || "") + "' data-lhp-id='" + (d.DANGKY_LOPHOCPHAN_ID || "") + "'>";
            html += "<td class='td-center'><input type='checkbox' class='chkRow_XuLyLHP'" + (d._selected ? " checked" : "") + " /> <span class='rowStt' style='margin-left:4px;'>" + (i + 1) + "</span></td>";
            html += "<td><input type='text' class='form-control txtTenLop' value=\"" + String(d.TENLOP || '').replace(/"/g, '&quot;') + "\" readonly /></td>";
            html += "<td><input type='text' class='form-control txtMaLop' value=\"" + String(d.MALOP || '').replace(/"/g, '&quot;') + "\" readonly /></td>";
            html += "<td><select class='form-control dropXuLyDacThu'>" + me.genOptions_XuLyDacThu(d.XULYDACTHU_ID) + "</select></td>";
            html += "</tr>";
        }
        $tbody.html(html);
        $("#lblPageInfo_XuLyLHP").text("(" + (start + 1) + "–" + end + " / " + total + ")");
        me.renderPager_XuLyLHP(totalPages);
        me.syncSelectAll_XuLyLHP();
    },
    renderPager_XuLyLHP: function (totalPages) {
        var me = this;
        var cur = me.pageIndex_XuLyLHP;
        var $pager = $("#pager_XuLyLHP");
        var html = '';
        var btn = function (label, page, disabled, active) {
            var cls = 'btn btn-sm btnPage_XuLyLHP ' + (active ? 'btn-primary' : 'btn-default');
            return '<button type="button" class="' + cls + '" data-page="' + page + '"' + (disabled ? ' disabled' : '') + ' style="min-width:34px">' + label + '</button>';
        };
        html += btn('«', 1, cur == 1, false);
        html += btn('‹', cur - 1, cur == 1, false);
        var from = Math.max(1, cur - 2);
        var to = Math.min(totalPages, cur + 2);
        if (from > 1) {
            html += btn(1, 1, false, cur == 1);
            if (from > 2) html += '<span style="padding:0 6px; line-height:30px;">…</span>';
        }
        for (var p = from; p <= to; p++) {
            html += btn(p, p, false, p == cur);
        }
        if (to < totalPages) {
            if (to < totalPages - 1) html += '<span style="padding:0 6px; line-height:30px;">…</span>';
            html += btn(totalPages, totalPages, false, cur == totalPages);
        }
        html += btn('›', cur + 1, cur == totalPages, false);
        html += btn('»', totalPages, cur == totalPages, false);
        $pager.html(html);
    },
    syncSelectAll_XuLyLHP: function () {
        var me = this;
        var data = me.dtXuLyLHP_All || [];
        var selCnt = 0;
        for (var i = 0; i < data.length; i++) if (data[i]._selected) selCnt++;
        var $h = $("#chkSelectAll_XuLyLHP");
        if (data.length === 0) { $h.prop({ checked: false, indeterminate: false }); return; }
        if (selCnt === 0) $h.prop({ checked: false, indeterminate: false });
        else if (selCnt === data.length) $h.prop({ checked: true, indeterminate: false });
        else $h.prop({ checked: false, indeterminate: true });
    },
    reindexRows_XuLyLHP: function () {
        $("#tblXuLyLHP tbody tr").each(function () {
            var idx = parseInt($(this).attr("data-idx"));
            if (!isNaN(idx)) $(this).find(".rowStt").text(idx + 1);
        });
    },
    deleteSelected_XuLyLHP: function () {
        var me = this;
        var data = me.dtXuLyLHP_All || [];
        var savedIds = [];
        var unsavedIds = {};
        for (var i = 0; i < data.length; i++) {
            if (!data[i]._selected) continue;
            if (data[i].ID) savedIds.push(data[i].ID);
            else if (data[i].DANGKY_LOPHOCPHAN_ID) unsavedIds[data[i].DANGKY_LOPHOCPHAN_ID] = true;
        }
        var totalSel = savedIds.length + Object.keys(unsavedIds).length;
        if (totalSel == 0) {
            edu.system.alert("Vui lòng tick chọn ít nhất một dòng!");
            return;
        }
        edu.system.confirm("Bạn có chắc chắn muốn xóa " + totalSel + " dòng đã chọn?");
        $("#btnYes").click(function () {
            if (Object.keys(unsavedIds).length) {
                me.dtXuLyLHP_All = me.dtXuLyLHP_All.filter(function (d) {
                    return !(unsavedIds[d.DANGKY_LOPHOCPHAN_ID] && !d.ID);
                });
            }
            if (savedIds.length == 0) {
                me.renderPage_XuLyLHP();
                edu.system.afterComfirm({ content: "Đã xóa " + totalSel + " dòng!", code: "" });
                return;
            }
            me._delCount = 0;
            me._delTotal = savedIds.length;
            me._delFailed = 0;
            for (var j = 0; j < savedIds.length; j++) {
                me.delete_XuLyLHP(savedIds[j], null, true);
            }
        });
    },
    delete_XuLyLHP: function (strId, idx, isBulk) {
        var me = this;
        var obj_delete = {
            'action': 'DKH_ThongTin2_MH/ETMeBSAvJgo4HgoJHg0uMQkxHgUgIhUpNB4FJC0P',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Del',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTroDangNhap_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        var onDone = function (success, message) {
            if (!isBulk) return;
            if (!success) me._delFailed++;
            me._delCount++;
            if (success) {
                me.dtXuLyLHP_All = me.dtXuLyLHP_All.filter(function (d) { return d.ID !== strId; });
            }
            if (me._delCount >= me._delTotal) {
                me.renderPage_XuLyLHP();
                var ok = me._delTotal - me._delFailed;
                if (me._delFailed == 0) {
                    edu.system.afterComfirm({ content: "Đã xóa " + ok + " dòng!", code: "" });
                } else {
                    edu.system.afterComfirm({ content: "Xóa " + ok + "/" + me._delTotal + " dòng. " + me._delFailed + " dòng lỗi.", code: "w" });
                }
            }
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (isBulk) {
                        onDone(true);
                        return;
                    }
                    if (typeof idx === 'number' && idx >= 0 && idx < me.dtXuLyLHP_All.length) {
                        me.dtXuLyLHP_All.splice(idx, 1);
                        me.renderPage_XuLyLHP();
                    }
                    edu.system.afterComfirm({
                        content: "Xóa thành công!",
                        code: ""
                    });
                }
                else {
                    if (isBulk) { onDone(false); return; }
                    edu.system.afterComfirm({
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    });
                }
            },
            error: function (er) {
                if (isBulk) { onDone(false); return; }
                edu.system.afterComfirm({
                    content: obj_delete.action + " (er): " + JSON.stringify(er),
                    code: "w"
                });
            },
            type: "POST",
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },
    save_XuLyLHP: function () {
        var me = this;
        var data = me.dtXuLyLHP_All || [];
        var arrRow = [];
        var hasInvalid = false;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (!d.DANGKY_LOPHOCPHAN_ID) continue;
            if (!d.XULYDACTHU_ID) { hasInvalid = true; continue; }
            arrRow.push({ rowId: d.ID || '', lhpId: d.DANGKY_LOPHOCPHAN_ID, xuLyId: d.XULYDACTHU_ID });
        }
        if (hasInvalid) {
            edu.system.alert("Vui lòng chọn xử lý đặc thù cho tất cả lớp học phần!");
            return;
        }
        if (arrRow.length == 0) {
            edu.system.alert("Vui lòng thêm ít nhất một lớp học phần!");
            return;
        }
        var arrNew = arrRow.filter(function (r) { return !r.rowId; });
        if (arrNew.length == 0) {
            edu.system.alert("Không có dòng mới để lưu. Các dòng đã lưu trước đó không thay đổi.");
            return;
        }
        me._saveCount = 0;
        me._saveTotal = arrNew.length;
        me._saveFailed = 0;
        me._saveLastError = '';
        for (var i = 0; i < arrNew.length; i++) {
            me.insert_XuLyLHP(arrNew[i]);
        }
    },
    insert_XuLyLHP: function (row) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/ETMeBSAvJgo4HgoJHg0uMQkxHgUgIhUpNB4ILzIP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Ins',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strDangKy_LopHocPhan_Id': row.lhpId,
            'strHieuLuc': '1',
            'strXuLyDacThu_Id': row.xuLyId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTroDangNhap_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        var onDone = function (success, message) {
            me._saveCount++;
            if (!success) {
                me._saveFailed++;
                if (message) me._saveLastError = message;
            }
            if (me._saveCount < me._saveTotal) return;
            var ok = me._saveTotal - me._saveFailed;
            if (me._saveFailed === 0) {
                edu.system.alert("Lưu thiết đặt xử lý lớp HP thành công! (" + ok + " dòng)");
                $("#myModalXuLyLHP").modal("hide");
                me.getList_XuLyLHP();
            } else if (ok === 0) {
                edu.system.alert("Lưu thất bại " + me._saveFailed + " dòng. " + me._saveLastError);
            } else {
                edu.system.alert("Lưu " + ok + "/" + me._saveTotal + " dòng. " + me._saveFailed + " dòng lỗi: " + me._saveLastError);
                me.getList_XuLyLHP();
            }
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) onDone(true);
                else onDone(false, data.Message || '');
            },
            error: function (er) {
                onDone(false, JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
};