/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LopHocPhan() { };
LopHocPhan.prototype = {
    dtLopHocPhan: [],
    strLopHocPhan_Id: '',
    dtSinhVien: [],
    arrSinhVien_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.pageSize_default = 10;

        $(".scroll-top-mirror").each(function () {
            var $mirror = $(this);
            var $bottom = $mirror.next(".scroll-table-x");
            if (!$bottom.length) return;
            $mirror.on("scroll", function () { $bottom.scrollLeft($mirror.scrollLeft()); });
            $bottom.on("scroll", function () { $mirror.scrollLeft($bottom.scrollLeft()); });
        });

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_HinhThucHoc();
        console.log(123342342342342342);

        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            //me.getList_KhoaToChuc();
            me.getList_HocPhan();
            //me.getList_LopHocPhan();
            me.getList_KeHoach();
            me.resetCombobox(this);
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            ////me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {

            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop').on('select2:select', function (e) {

            var x = $(this).val();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $("#dropLopCuoi").on("select2:select", function () {
            me.getList_DangKyHocKQ();
        });

        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            //me.getList_LopHocPhan();
        });
        $('#dropSearch_LoaiLop').select2({ minimumResultsForSearch: Infinity });
        $('#dropSearch_LoaiLop').on('change', function () {
            me._refilterActiveTable();
        });
        $("#btnSearch").click(function (e) {
            me.clearFindInTable();
            me.invalidateFindCache();
            me.getList_LopHocPhan();
        });
        $("#btnSearchChiTiet").click(function (e) {
            me.clearFindInTable();
            me.invalidateFindCache();
            me.getList_LopHocPhanChiTiet();
        });

        $("#dChuaNop, #dDaChuyenKeToan").on("change", function () {
            if (me.getActiveFindTableId() !== "tblLopHocPhanChiTiet") return;
            me.clearFindInTable();
            me.invalidateFindCache();
            me.getList_LopHocPhanChiTiet();
        });

        $("#btnSearchCanBoDangKy").click(function (e) {
            me.clearFindInTable();
            me.invalidateFindCache();
            me.getList_CanBoChiTiet();
        });
        $("#btnSearchChiTietRut").click(function (e) {
            me.clearFindInTable();
            me.invalidateFindCache();
            me.getList_LopHocPhanRut();
        });

        $("#btnDSKhongDangKy").click(function (e) {
            e.preventDefault();
            var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
            if (!strKeHoach_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch đăng ký?");
                return;
            }
            $('#myModal_khongdangky').modal('show');
            me.getList_KhongDangKy(strKeHoach_Id);
        });
        $("#btnXuatExcel_KhongDangKy").click(function (e) {
            e.preventDefault();
            me.exportExcel_KhongDangKy();
        });

        // Filter / paging cho modal "Danh sách không đăng ký"
        var _debounceKDK = null;
        $('#txtSearch_KhongDangKy').on('input', function () {
            if (_debounceKDK) clearTimeout(_debounceKDK);
            _debounceKDK = setTimeout(function () {
                if (!me.dtKhongDangKy_Raw) return;
                edu.system.pageIndex_default = 1;
                me.render_KhongDangKy();
            }, 250);
        });
        $('#dropFilter_KDK_TrangThai, #dropFilter_KDK_ChuongTrinh, #dropFilter_KDK_LopQuanLy, #dropFilter_KDK_KhoaHoc')
            .on('change', function () {
                if (me._suppressKDKFilter) return;
                if (!me.dtKhongDangKy_Raw) return;
                edu.system.pageIndex_default = 1;
                me.render_KhongDangKy();
            });
        $('#btnResetFilter_KDK').click(function (e) {
            e.preventDefault();
            me._suppressKDKFilter = true;
            $('#txtSearch_KhongDangKy').val('');
            $('#dropFilter_KDK_TrangThai, #dropFilter_KDK_ChuongTrinh, #dropFilter_KDK_LopQuanLy, #dropFilter_KDK_KhoaHoc')
                .val('').trigger('change');
            me._suppressKDKFilter = false;
            if (me.dtKhongDangKy_Raw) {
                edu.system.pageIndex_default = 1;
                me.render_KhongDangKy();
            }
        });

        // Filter cho modal "Danh sách sinh viên" (tblQuanSoLop)
        var _debounceQSL = null;
        $('#txtSearch_QuanSoLop').on('input', function () {
            if (_debounceQSL) clearTimeout(_debounceQSL);
            _debounceQSL = setTimeout(function () {
                if (!me.dtQuanSoLop_Raw) return;
                me.render_QuanSoLop();
            }, 250);
        });
        $('#dropFilter_QSL_TrangThai, #dropFilter_QSL_ChuongTrinh, #dropFilter_QSL_LopHoc, #dropFilter_QSL_KhoaHoc, #dropFilter_QSL_KhoaQuanLy, #dropFilter_QSL_HeDaoTao')
            .on('change', function () {
                if (me._suppressQSLFilter) return;
                if (!me.dtQuanSoLop_Raw) return;
                me.render_QuanSoLop();
            });
        $('#btnResetFilter_QuanSoLop').click(function (e) {
            e.preventDefault();
            me._suppressQSLFilter = true;
            $('#txtSearch_QuanSoLop').val('');
            $('#dropFilter_QSL_TrangThai, #dropFilter_QSL_ChuongTrinh, #dropFilter_QSL_LopHoc, #dropFilter_QSL_KhoaHoc, #dropFilter_QSL_KhoaQuanLy, #dropFilter_QSL_HeDaoTao')
                .val('').trigger('change');
            me._suppressQSLFilter = false;
            if (me.dtQuanSoLop_Raw) {
                me.render_QuanSoLop();
            }
        });

        $("#tblLopHocPhan").delegate('.btnDetail', 'click', function (e) {
            $('#myModalPhamVi').modal('show');
            me.getList_PhamVi(this.id);
        });
        $("#tblLopHocPhan").delegate('.btnSinhVien', 'click', function (e) {
            $('#myModal').modal('show');
            me["strDSSVLopHocPhan_Id"] = this.id;
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#tblLopHocPhan").delegate('.btnDonLop', 'click', function (e) {
            me.toggle_edit();
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            var strHocPhan_Id = me.dtLopHocPhan.find(e => e.ID == strId).DAOTAO_HOCPHAN_ID
            var strTenDanhSach = $(this).attr("name");
            me.getList_DangKyHoc(strId);
            me.getList_LopHocPhan(strId);
            me.cbGenCombo_LopHocPhan(me.dtLopHocPhan.filter(e => e.ID != strId && e.DAOTAO_HOCPHAN_ID == strHocPhan_Id));
            $(".lblTenDanhSach").html(strTenDanhSach);
        });

        $("#tblLopHocPhan").delegate('.btnDonNhomLop', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zoneEditNhom");
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            //var strHocPhan_Id = me.dtLopHocPhan.find(e => e.ID == strId).DAOTAO_HOCPHAN_ID
            var strTenDanhSach = $(this).attr("name");
            me.getList_DangKyHoc(strId);
            $(".lblTenDanhSach").html(strTenDanhSach);
        });

        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });

        $("[id$=chkSelectAll_PhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhamVi" });
        });
        $("[id$=chkSelectAll_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#btnSave_LopHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrSinhVien_Id = arrChecked_Id;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        $("#btnThietLapLopRieng").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_1" type="radio" name="ThietLapLopRieng" value="1">';
            html += '<label for="ThietLapLopRieng_1"> Là lớp riêng</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_0" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapLopRieng_0"> Không phải lớp riêng</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Chọn thiết lập lớp riêng? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapLopRieng(arrChecked_Id[i], dLopRieng);
                }
            });
        });
        $("#btnThietLapKhongTinhPhi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongTinhPhi_0" type="radio" name="ThietLapKhongTinhPhi" value="1">';
            html += '<label for="ThietLapKhongTinhPhi_0"> Lớp không tính phí</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_1" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapLopRieng_1"> Lớp tính phí</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Chọn Thiết đặt lớp không tín phí? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapKhongTinhPhi(arrChecked_Id[i], dLopRieng);
                }
            });
        });
        $("#btnThietLapKhongToChucThi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongToChucThi_1" type="radio" name="ThietLapLopRieng" value="1">';
            html += '<label for="ThietLapKhongToChucThi_1"> Lớp không tổ chức thi</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongToChucThi_0" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapKhongToChucThi_0"> Lớp tổ chức thi</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Thiết đặt lớp không tổ chức thi? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapKhongToChucThi(arrChecked_Id[i], dLopRieng);
                }
            });
        });
        $("#btnThuocTinhKLGD").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp học phần?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhan || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length === 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            me["dtThuocTinhKLGD"] = arrSelected;
            $('#dropPhanLoaiCachTinh').val('').trigger('change');
            $('#chkSelectAll_ThuocTinhKLGD').prop('checked', false);
            me.genTable_ThuocTinhKLGD(arrSelected);
            $('#myModalThuocTinhKLGD').modal('show');
        });

        $("#chkSelectAll_ThuocTinhKLGD").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThuocTinhKLGD" });
        });

        $("#btnSave_ThuocTinhKLGD").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThuocTinhKLGD", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng?");
                return;
            }
            var strPhanLoai = edu.util.getValById('dropPhanLoaiCachTinh');
            if (!strPhanLoai) {
                edu.system.alert("Vui lòng chọn thuộc tính?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu thuộc tính cho " + arrChecked_Id.length + " lớp đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(function (strId) {
                    me.save_ThuocTinhKLGD(strId, strPhanLoai);
                });
            });
        });

        $("#btnDelete_ThuocTinhKLGD").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThuocTinhKLGD", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng?");
                return;
            }
            var strPhanLoai = edu.util.getValById('dropPhanLoaiCachTinh');
            if (!strPhanLoai) {
                edu.system.alert("Vui lòng chọn thuộc tính cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa thuộc tính khỏi " + arrChecked_Id.length + " lớp đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(function (strId) {
                    me.delete_ThuocTinhKLGD(strId, strPhanLoai);
                });
            });
        });

        $("#btnThietLapCheDoTinhPhi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp học phần?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhan || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length === 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            me["dtCheDoTinhPhi_LopHP"] = arrSelected;
            $('#dropCheDoTinhPhi_LopHP').val('').trigger('change');
            $('#dropKieuHoc_LopHP').val('').trigger('change');
            $('#chkSelectAll_CheDoTinhPhi_LopHP').prop('checked', false);
            me.genTable_CheDoTinhPhi_LopHP(arrSelected);
            $('#myModalCheDoTinhPhi_LopHP').modal('show');
        });

        $("#chkSelectAll_CheDoTinhPhi_LopHP").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCheDoTinhPhi_LopHP" });
        });

        $("#btnSave_CheDoTinhPhi_LopHP").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCheDoTinhPhi_LopHP", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng?");
                return;
            }
            var strCheDo = edu.util.getValById('dropCheDoTinhPhi_LopHP');
            if (!strCheDo) {
                edu.system.alert("Vui lòng chọn chế độ tính phí?");
                return;
            }
            var strKieuHoc = edu.util.getValById('dropKieuHoc_LopHP');
            if (!strKieuHoc) {
                edu.system.alert("Vui lòng chọn kiểu học?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu chế độ tính phí cho " + arrChecked_Id.length + " lớp đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(function (strId) {
                    me.save_CheDoTinhPhi_LopHP(strId, strCheDo, strKieuHoc);
                });
            });
        });

        $("#btnDelete_CheDoTinhPhi_LopHP").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCheDoTinhPhi_LopHP", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa chế độ tính phí khỏi " + arrChecked_Id.length + " lớp đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(function (strId) {
                    var rec = (me.dtCheDoTinhPhi_LopHP || []).find(function (r) { return r.ID == strId; });
                    var strRecordId = rec ? (rec.CHEDOTINHPHI_ID || '') : '';
                    if (!strRecordId) {
                        edu.system.start_Progress("zoneprocessXXXX");
                        return;
                    }
                    me.delete_CheDoTinhPhi_LopHP(strRecordId);
                });
            });
        });

        $("#btnHuyPhiTinChi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp học phần?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhan || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length === 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            me["dtHuyPhiTinChi"] = arrSelected;
            me.genTable_HuyPhiTinChi(arrSelected);
            $('#myModalHuyPhiTinChi').modal('show');
        });

        $("#btnThucHien_HuyPhiTinChi").click(function (e) {
            var arrLop = me.dtHuyPhiTinChi || [];
            if (arrLop.length == 0) {
                edu.system.alert("Không có lớp nào để hủy phí?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn hủy phí tín chỉ cho " + arrLop.length + " lớp đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrLop.length);
                arrLop.forEach(function (rec) {
                    me.huyPhiTinChiTheoLop(rec.ID);
                });
            });
        });

        $("#btnSave_CheDoTinhPhi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CheDoTinhPhi(arrChecked_Id[i]);
                }
            });
        });

        $("#DSTrangThaiSV").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropSearch_KieuHoc");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.NGUOIHOC.CHEDOTINHPHI", "dropCheDoTinhPhi");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.NGUOIHOC.CHEDOTINHPHI", "dropCheDoTinhPhi_LopHP");
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropKieuHoc_LopHP");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.XACNHAN.KETQUA", "dropSearch_HanhDong");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.LOPHOCPHAN.PHANLOAI", "dropPhanLoaiCachTinh");
        edu.system.getList_MauImport("zonebtnBaoCao_LopHocPhan", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strDaoTao_KhoaDaoTao_Id", edu.util.getValById("dropSearch_KhoaDaoTao"));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById("dropSearch_ChuongTrinh"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValById("dropSearch_HeDaoTao"));
            addKeyValue("strDaoTao_KhoaQuanLy_Id", edu.util.getValById("dropSearch_KhoaQuanLy"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strTKB_HinhThucHoc_Id", edu.util.getValById("dropSearch_HinhThucHoc"));
            addKeyValue("strKieuHoc_Id", edu.util.getValById("dropSearch_KieuHoc"));
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch"));
            addKeyValue("dChiLayCacLopChuaPhanCong", $('#dChuaPhanCong').is(":checked") ? 1 : 0);
            addKeyValue("dSoDaDangTuSo", edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1);
            addKeyValue("dSoDaDangDenSo", edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet2", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV');
            arrTrangThai.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e));
        });


        $("#btnDeleteLopHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrSinhVien_Id = arrChecked_Id;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopHocPhan(arrChecked_Id[i]);
                }
            });

        });
        $("#btnDeleteLopHocPhanDangChon").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrSinhVien_Id = arrChecked_Id;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopHocPhanDangChon(arrChecked_Id[i]);
                }
            });

        });

        $("#btnThucHienDonNhom").click(function (e) {
            e.preventDefault();
            console.log(11111);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVienNhom", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            console.log(arrChecked_Id);
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            var strNguonDuLieu_Id = edu.util.uuid();
            me["strNguonDuLieu_Id"] = strNguonDuLieu_Id;
            arrChecked_Id.forEach(e => me.save_DonLopNhom(e, strNguonDuLieu_Id));
        });
        $("#btnChonLopNhom").click(function (e) {
            me.dtDonNhomLop.rsLopBanDau.forEach(e => me.getList_DonLopNhom_LopMoi(e));
        });
        $("#btnDSSinhVienNhom").click(function (e) {
            $('#myModalNhom').modal('show');
            me.getList_DonLopNhom_SV();
        });
        $("#btnSave_DonLopNhom").click(function (e) {
            var arrChecked_Id = [];
            var strLopCu_Id = [];
            var strLopMoi_Id = [];
            var check = true;
            me.dtDonNhomLop.rsLopBanDau.forEach(e => {
                var temp = edu.util.getValById("dropLopMoi" + e.ID);
                if (!temp) {
                    check = false;
                    return;
                } else {
                    strLopCu_Id.push(e.ID);
                    strLopMoi_Id.push(temp);
                }
            })
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            if (check) {
                edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.save_DonLopNhom_DuLieu(strLopCu_Id.toString(), strLopMoi_Id.toString());
                });
            }
            
        });
        $("#btnTaoDSNhapDiem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            arrChecked_Id.forEach(e => me.saveTaoDanhSachNhapDiem(e));

        });

        $("#btnThucHienRutHocPhan").click(function (e) {
            e.preventDefault();
            var srcTbl = null;
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            if (arrChecked_Id.length > 0) srcTbl = "tblLopHocPhanChiTiet";
            else {
                arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet2", "checkX");
                if (arrChecked_Id.length > 0) srcTbl = "tblLopHocPhanChiTiet2";
            }
            if (!srcTbl) {
                edu.system.alert("Vui lòng chọn bản ghi ở bảng 'Đăng ký chi tiết' hoặc 'Rút đăng ký'?");
                return;
            }
            var arrData = srcTbl === "tblLopHocPhanChiTiet2" ? (me.dtLopHocPhanChiTiet2 || []) : (me.dtLopHocPhanChiTiet || []);
            var arrSelected = arrChecked_Id
                .map(function (id) { return arrData.find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length == 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            me["srcTbl_RutHocPhan"] = srcTbl;
            me["dtRutHocPhan"] = arrSelected;
            $('#txtRutHocPhan_MoTaChung').val('');
            $('#chkSelectAll_RutHocPhan').prop('checked', false);
            $('#lblRutHocPhan_Tong').text(arrSelected.length);
            edu.util.toggle_overide("zone-bus", "zoneRutHocPhan");
            me.genTable_RutHocPhan(arrSelected);
        });

        $(".btnCloseRutHocPhan").click(function (e) {
            e.preventDefault();
            edu.util.toggle_overide("zone-bus", "zonebatdau");
        });

        $("#btnTongHopCongNo").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một bản ghi ở danh sách chi tiết?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhanChiTiet || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r && r.QLSV_NGUOIHOC_ID; });
            if (arrSelected.length == 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn tổng hợp công nợ cho " + arrSelected.length + " bản ghi đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSelected.length);
                var i = 0;
                var runNext = function () {
                    if (i >= arrSelected.length) return;
                    var rec = arrSelected[i++];
                    me.tongHopCongNoSinhVien(rec.QLSV_NGUOIHOC_ID, runNext);
                };
                runNext();
            });
        });

        $("#btnCanBangNo").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một bản ghi ở danh sách chi tiết?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhanChiTiet || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length == 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn cân bằng nợ cho " + arrSelected.length + " bản ghi đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSelected.length);
                arrSelected.forEach(function (rec) {
                    me.canBangNo(rec);
                });
            });
        });

        $("#btnHuyCanBangNo").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một bản ghi ở danh sách chi tiết?");
                return;
            }
            var arrSelected = arrChecked_Id
                .map(function (id) { return (me.dtLopHocPhanChiTiet || []).find(function (r) { return r.ID == id; }); })
                .filter(function (r) { return !!r; });
            if (arrSelected.length == 0) {
                edu.system.alert("Không tìm thấy dữ liệu các dòng đã chọn?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn hủy cân bằng nợ cho " + arrSelected.length + " bản ghi đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSelected.length);
                arrSelected.forEach(function (rec) {
                    me.huyCanBangNo(rec);
                });
            });
        });

        $("#chkSelectAll_RutHocPhan").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblRutHocPhan" });
        });

        $("#btnFillPhanTram_All").click(function (e) {
            e.preventDefault();
            var raw = $('#txtRutHocPhan_FillPhanTram').val();
            if (raw === '' || raw == null) {
                edu.system.alert("Vui lòng nhập giá trị % cần điền.");
                return;
            }
            var v = parseFloat(raw);
            if (isNaN(v) || v < 0 || v > 100) {
                edu.system.alert("Giá trị % phải trong khoảng 0 - 100.");
                return;
            }
            $('#tblRutHocPhan tbody input[id^="txtPhanTram"]').val(v);
        });

        $("#btnFillPhanTram_Checked").click(function (e) {
            e.preventDefault();
            var raw = $('#txtRutHocPhan_FillPhanTram').val();
            if (raw === '' || raw == null) {
                edu.system.alert("Vui lòng nhập giá trị % cần điền.");
                return;
            }
            var v = parseFloat(raw);
            if (isNaN(v) || v < 0 || v > 100) {
                edu.system.alert("Giá trị % phải trong khoảng 0 - 100.");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblRutHocPhan", "checkX");
            if (arrChecked_Id.length === 0) {
                edu.system.alert("Chưa có dòng nào được tick ở cột 'Chọn'.");
                return;
            }
            arrChecked_Id.forEach(function (id) {
                $('#txtPhanTram' + id).val(v);
            });
        });

        $("#btnThucHien_RutHocPhan").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblRutHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng?");
                return;
            }
            var strMoTa = $('#txtRutHocPhan_MoTaChung').val() || '';
            edu.system.confirm("Thực hiện rút học phần cho " + arrChecked_Id.length + " dòng đã chọn?");
            $("#btnYes").click(function () {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(function (strId) {
                    var raw = $('#txtPhanTram' + strId).val();
                    var dPhanTram = parseFloat(raw == null || raw === '' ? '0' : raw);
                    if (isNaN(dPhanTram)) dPhanTram = 0;
                    me.thucHienRutHocPhan(me.srcTbl_RutHocPhan, strId, dPhanTram, strMoTa);
                });
                edu.util.toggle_overide("zone-bus", "zonebatdau");
            });
        });

        // Find-in-table widget bindings
        $("#txtFindInTable").on("input", function () {
            me.runFindInTable($(this).val());
        });
        $("#txtFindInTable").on("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (e.shiftKey) me.prevFindMatch(); else me.nextFindMatch();
            } else if (e.key === "Escape") {
                e.preventDefault();
                me.clearFindInTable();
            }
        });
        $("#btnFindInTablePrev").click(function (e) { e.preventDefault(); me.prevFindMatch(); });
        $("#btnFindInTableNext").click(function (e) { e.preventDefault(); me.nextFindMatch(); });
        $("#btnFindInTableClear").click(function (e) { e.preventDefault(); me.clearFindInTable(); });
        me.updateFindCounter();
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_LopHocPhan();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },

    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
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
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
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
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao(dtReRult);
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
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
                    me.cbGenCombo_HocPhan(dtResult, iPager);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex':1,
            'pageSize': 10000,
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
                    me.cbGenCombo_KeHoach(dtResult, iPager);
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
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: "",
                //mRender: function (nRow, aData) {
                //    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                //}
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhan: function (findOverride) {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhan").parent().show().prev(".scroll-top-mirror").show();
        findOverride = findOverride || {};
        var bLoaiLop = !!me._getSelectedLoaiLop();

        //--Edit
        var obj_save = {
            'action': 'DKH_BaoCao_MH/DSA4BRINLjEJLiIRKSAvESkgLxUzIC8m',
            'func': 'pkg_dangkyhoc_baocao.LayDSLopHocPhanPhanTrang',
            'iM': edu.system.iM,
            'strTuKhoa': (findOverride.keyword != null ? findOverride.keyword : edu.util.getValById('txtSearch')),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': (findOverride.pageIndex != null ? findOverride.pageIndex : (bLoaiLop ? 1 : edu.system.pageIndex_default)),
            'pageSize': (findOverride.pageSize != null ? findOverride.pageSize : (bLoaiLop ? 100000 : edu.system.pageSize_default)),
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')): -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,
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
                    me.dtLopHocPhan = dtResult;
                    if (findOverride.onlyFetch && typeof findOverride.onSuccess === 'function') {
                        findOverride.onSuccess(dtResult, iPager);
                    } else {
                        me.genTable_LopHocPhan(dtResult, iPager);
                    }
                }
                else {
                    if (findOverride.onError) findOverride.onError(data);
                    else edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {
                if (findOverride.onError) findOverride.onError(er);
                else edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        me._rawByTable = me._rawByTable || {};
        me._rawByTable['tblLopHocPhan'] = { data: data || [], iPager: iPager };
        me._rebuildLoaiLopOptions(data || [], 'tblLopHocPhan');
        var displayData = me._filterDataByLoaiLop(data || [], 'tblLopHocPhan');
        var hasLoaiLop = me._getSelectedLoaiLop().length > 0;
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhan()",
                iDataRow: hasLoaiLop ? displayData.length : iPager
            },
            aaData: displayData,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "LOAILOP"
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "THONGTINPHANBO"
                },
                {
                    "mDataProp": "MAGV"
                },
                {
                    "mDataProp": "CHUCDANH"
                },
                {
                    "mDataProp": "TENGV" 
                },
                {
                    "mDataProp": "CHUONGTRINHMOLOP"
                },
                {
                    //"mDataProp": "PHIPHAINOP",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.PHIPHAINOP);
                        //return '<p>Từ ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' đến ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p><p>Thứ ' + edu.util.returnEmpty(aData.THUHOC) + ', ' + edu.util.returnEmpty(aData.PHONGHOC) + '</p>';
                    }
                },
                {
                    //"mDataProp": "PHIDANOP",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.PHIDANOP);
                        //return '<p>Từ ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' đến ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p><p>Thứ ' + edu.util.returnEmpty(aData.THUHOC) + ', ' + edu.util.returnEmpty(aData.PHONGHOC) + '</p>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THOIGIANCHITIET);
                        //return '<p>Từ ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' đến ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p><p>Thứ ' + edu.util.returnEmpty(aData.THUHOC) + ', ' + edu.util.returnEmpty(aData.PHONGHOC) + '</p>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.HINHTHUCHOC_TEN);
                        var ma = edu.util.returnEmpty(aData.HINHTHUCHOC_MA);
                        return ma ? ten + ' - ' + ma : ten;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.SOSVDADANGKY) return '<span><a class="btn btn-default btnSinhVien" id="' + aData.ID + '"  title="Số sinh viên đã đăng ký">' + aData.SOSVDADANGKY + '</a></span>';
                        return "";
                    }
                },
                {
                    "mDataProp": "SOLUONGDUKIENHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HOCPHITINHRIENG ? 'Lớp riêng': '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KHONGTINHPHI ? 'Không tính phí' : '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KHONGTOCHUCTHI ? 'Không tổ chức thi' : '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.PHANLOAICACHTINH_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CHEDOTINHPHI_TEN);
                    }
                },
                /* Ẩn theo yêu cầu (dùng cho tra cứu):*/
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDonLop" id="' + aData.ID + '" name="' + aData.TENLOP  +'" title="Dồn lớp">Dồn lớp</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDonNhomLop" id="' + aData.ID + '" name="' + aData.TENLOP + '" title="Dồn">Dồn nhóm</a></span>';
                    }
                },
                /* */
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.refreshFindInTable();
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhanChiTiet: function (findOverride) {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet").parent().show().prev(".scroll-top-mirror").show();
        findOverride = findOverride || {};
        var bChuaNop = $('#dChuaNop').is(':checked');
        var bDaChuyenKeToan = $('#dDaChuyenKeToan').is(':checked');
        var bLoaiLop = !!me._getSelectedLoaiLop();
        var bClientFilter = bChuaNop || bDaChuyenKeToan || bLoaiLop;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP',
            'func': 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc',
            'iM': edu.system.iM,
            'strTuKhoa': (findOverride.keyword != null ? findOverride.keyword : edu.util.getValById('txtSearch')),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': bClientFilter ? 1 : (findOverride.pageIndex != null ? findOverride.pageIndex : edu.system.pageIndex_default),
            'pageSize': bClientFilter ? 100000 : (findOverride.pageSize != null ? findOverride.pageSize : edu.system.pageSize_default),
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),
            'strHanhDong_XacNhan_Id': edu.system.getValById('dropSearch_HanhDong'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,
            
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    if (bClientFilter) {
                        dtResult = dtResult.filter(function (r) {
                            if (bChuaNop) {
                                var v = r.SOTIENDANOP != null ? r.SOTIENDANOP : r.TONGSOTIENDANOP;
                                if ((parseFloat(v) || 0) !== 0) return false;
                            }
                            if (bDaChuyenKeToan) {
                                if (!r.DACHUYENKETOAN || parseInt(r.DACHUYENKETOAN) === 0) return false;
                            }
                            return true;
                        });
                        iPager = dtResult.length;
                    }
                    if (findOverride.onlyFetch && typeof findOverride.onSuccess === 'function') {
                        findOverride.onSuccess(dtResult, iPager);
                    } else {
                        me.genTable_LopHocPhanChiTiet(dtResult, iPager);
                    }
                }
                else {
                    if (findOverride.onError) findOverride.onError(data);
                    else edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {
                if (findOverride.onError) findOverride.onError(er);
                else edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_CanBoChiTiet: function () {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet").parent().show().prev(".scroll-top-mirror").show();
        var bLoaiLop = !!me._getSelectedLoaiLop();
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu',
            'func': 'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': bLoaiLop ? 1 : edu.system.pageIndex_default,
            'pageSize': bLoaiLop ? 100000 : edu.system.pageSize_default,
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,

            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    me.genTable_LopHocPhanChiTiet(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhanChiTiet: function (data, iPager) {
        var me = this;
        me.dtLopHocPhanChiTiet = data || [];
        me._rawByTable = me._rawByTable || {};
        me._rawByTable['tblLopHocPhanChiTiet'] = { data: data || [], iPager: iPager };
        me._rebuildLoaiLopOptions(data || [], 'tblLopHocPhanChiTiet');
        var displayData = me._filterDataByLoaiLop(data || [], 'tblLopHocPhanChiTiet');
        var hasLoaiLop = me._getSelectedLoaiLop().length > 0;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanChiTiet",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanChiTiet()",
                iDataRow: hasLoaiLop ? displayData.length : iPager
            },
            aaData: displayData,
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
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "LOPRIENG"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN1);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN2);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = aData.SOTIENDANOP != null ? aData.SOTIENDANOP : aData.TONGSOTIENDANOP;
                        return edu.util.formatCurrency(v);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGNO);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGDU);
                    }
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DACHUYENKETOAN ? "Đã chuyển" : "Chưa chuyển";
                    }
                },
                {
                    "mDataProp": "HANHDONG_XACNHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.refreshFindInTable();
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhanRut: function (findOverride) {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet2").parent().show().prev(".scroll-top-mirror").show();
        findOverride = findOverride || {};
        var bLoaiLop = !!me._getSelectedLoaiLop();
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRITNDUFIC8mCjgJLiIP',
            'func': 'pkg_dangkyhoc_thongtin2.LayDSRutDangKyHoc',
            'iM': edu.system.iM,
            'strTuKhoa': (findOverride.keyword != null ? findOverride.keyword : edu.util.getValById('txtSearch')),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': (findOverride.pageIndex != null ? findOverride.pageIndex : (bLoaiLop ? 1 : edu.system.pageIndex_default)),
            'pageSize': (findOverride.pageSize != null ? findOverride.pageSize : (bLoaiLop ? 100000 : edu.system.pageSize_default)),


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,

            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    if (findOverride.onlyFetch && typeof findOverride.onSuccess === 'function') {
                        findOverride.onSuccess(dtResult, iPager);
                    } else {
                        me.genTable_LopHocPhanRut(dtResult, iPager);
                    }
                }
                else {
                    if (findOverride.onError) findOverride.onError(data);
                    else edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                if (findOverride.onError) findOverride.onError(er);
                else edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhanRut: function (data, iPager) {
        var me = this;
        me.dtLopHocPhanChiTiet2 = data || [];
        me._rawByTable = me._rawByTable || {};
        me._rawByTable['tblLopHocPhanChiTiet2'] = { data: data || [], iPager: iPager };
        me._rebuildLoaiLopOptions(data || [], 'tblLopHocPhanChiTiet2');
        var displayData = me._filterDataByLoaiLop(data || [], 'tblLopHocPhanChiTiet2');
        var hasLoaiLop = me._getSelectedLoaiLop().length > 0;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanChiTiet2",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanRut()",
                iDataRow: hasLoaiLop ? displayData.length : iPager
            },
            aaData: displayData,
            colPos: {
                center: [0],
            },
            aoColumns: [

                {
                    "mDataProp": "NGUOIRUT_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYRUT_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "PHANTRAMPHITINH"
                },
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
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "LOPRIENG"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },

                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.refreshFindInTable();
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhamVi: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhamVi = dtReRult;
                    me.genTable_PhamVi(dtReRult, data.Pager);
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
    genTable_PhamVi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhamVi",

            //bPaginate: {
            //    strFuntionName: "main_doc.PhanCongLop.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "PHANCAPAPDUNG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_QuanSoTheoLop: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': me.strDSSVLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    me.dtQuanSoLop_Raw = dtReRult;
                    me._suppressQSLFilter = true;
                    $('#txtSearch_QuanSoLop').val('');
                    me._populateFilters_QuanSoLop(dtReRult);
                    me._suppressQSLFilter = false;
                    me.render_QuanSoLop();
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
    _populateFilters_QuanSoLop: function (data) {
        var makeDistinct = function (field) {
            var set = {};
            (data || []).forEach(function (r) {
                var v = r[field];
                if (v != null && v !== '') set[v] = true;
            });
            return Object.keys(set).sort(function (a, b) {
                return a.localeCompare(b, 'vi');
            }).map(function (v) { return { ID: v, TEN: v }; });
        };
        var pushToCombo = function (arr, place, title) {
            edu.system.loadToCombo_data({
                data: arr,
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                renderPlace: [place],
                type: "",
                title: title
            });
            $('#' + place).val('').trigger('change');
        };
        pushToCombo(makeDistinct('QLSV_TRANGTHAINGUOIHOC_TEN'),
                    'dropFilter_QSL_TrangThai', '-- Tất cả tình trạng --');
        pushToCombo(makeDistinct('DAOTAO_CHUONGTRINH_TEN'),
                    'dropFilter_QSL_ChuongTrinh', '-- Tất cả chương trình --');
        pushToCombo(makeDistinct('DAOTAO_LOPQUANLY_TEN'),
                    'dropFilter_QSL_LopHoc', '-- Tất cả lớp học --');
        pushToCombo(makeDistinct('DAOTAO_KHOADAOTAO_TEN'),
                    'dropFilter_QSL_KhoaHoc', '-- Tất cả khóa học --');
        pushToCombo(makeDistinct('KHOAQUANLY_TEN'),
                    'dropFilter_QSL_KhoaQuanLy', '-- Tất cả khoa quản lý --');
        pushToCombo(makeDistinct('DAOTAO_HEDAOTAO_TEN'),
                    'dropFilter_QSL_HeDaoTao', '-- Tất cả hệ đào tạo --');
    },
    _applyFilter_QuanSoLop: function () {
        var me = this;
        var raw = me.dtQuanSoLop_Raw || [];
        var kw = ($('#txtSearch_QuanSoLop').val() || '').trim().toLowerCase();
        var trangThai = $('#dropFilter_QSL_TrangThai').val() || '';
        var chuongTrinh = $('#dropFilter_QSL_ChuongTrinh').val() || '';
        var lopHoc = $('#dropFilter_QSL_LopHoc').val() || '';
        var khoaHoc = $('#dropFilter_QSL_KhoaHoc').val() || '';
        var khoaQuanLy = $('#dropFilter_QSL_KhoaQuanLy').val() || '';
        var heDaoTao = $('#dropFilter_QSL_HeDaoTao').val() || '';

        me.dtQuanSoLop = raw.filter(function (r) {
            if (trangThai && (r.QLSV_TRANGTHAINGUOIHOC_TEN || '') !== trangThai) return false;
            if (chuongTrinh && (r.DAOTAO_CHUONGTRINH_TEN || '') !== chuongTrinh) return false;
            if (lopHoc && (r.DAOTAO_LOPQUANLY_TEN || '') !== lopHoc) return false;
            if (khoaHoc && (r.DAOTAO_KHOADAOTAO_TEN || '') !== khoaHoc) return false;
            if (khoaQuanLy && (r.KHOAQUANLY_TEN || '') !== khoaQuanLy) return false;
            if (heDaoTao && (r.DAOTAO_HEDAOTAO_TEN || '') !== heDaoTao) return false;
            if (kw) {
                var maso = String(r.QLSV_NGUOIHOC_MASO || '').toLowerCase();
                var full = ((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || ''))
                                .trim().toLowerCase();
                if (maso.indexOf(kw) === -1 && full.indexOf(kw) === -1) return false;
            }
            return true;
        });
    },
    render_QuanSoLop: function () {
        var me = this;
        me._applyFilter_QuanSoLop();
        var data = me.dtQuanSoLop || [];
        $('#lblTong_QuanSoLop').text(data.length > 0
            ? 'Tổng: ' + data.length + ' bản ghi'
            : 'Không có dữ liệu phù hợp');
        me.genTable_QuanSoTheoLop(data);
    },
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 12],
                right: [10]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGSOTIENDANOP);
                    }
                },
                {
                    "mDataProp": "CHEDOTINHPHI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: Danh sách không đăng ký (kế thừa từ kehoachdangky)
    --Input: strDangKy_KeHoachDangKy_Id lấy từ dropSearch_KeHoach
    --Cache toàn bộ data (dtKhongDangKy_Raw) để filter + paginate client-side
    -------------------------------------------*/
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
                    var dtReRult = data.Data || [];
                    me.dtKhongDangKy_Raw = dtReRult;
                    me._suppressKDKFilter = true;
                    $('#txtSearch_KhongDangKy').val('');
                    me._populateFilters_KhongDangKy(dtReRult);
                    me._suppressKDKFilter = false;
                    edu.system.pageIndex_default = 1;
                    me.render_KhongDangKy();
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    _populateFilters_KhongDangKy: function (data) {
        var makeDistinct = function (field) {
            var set = {};
            (data || []).forEach(function (r) {
                var v = r[field];
                if (v != null && v !== '') set[v] = true;
            });
            return Object.keys(set).sort(function (a, b) {
                return a.localeCompare(b, 'vi');
            }).map(function (v) { return { ID: v, TEN: v }; });
        };
        var pushToCombo = function (arr, place, title) {
            edu.system.loadToCombo_data({
                data: arr,
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                renderPlace: [place],
                type: "",
                title: title
            });
            $('#' + place).val('').trigger('change');
        };
        pushToCombo(makeDistinct('QLSV_TRANGTHAI_TEN'),
                    'dropFilter_KDK_TrangThai', '-- Tất cả trạng thái --');
        pushToCombo(makeDistinct('DAOTAO_TOCHUCCHUONGTRINH_TEN'),
                    'dropFilter_KDK_ChuongTrinh', '-- Tất cả chương trình --');
        pushToCombo(makeDistinct('DAOTAO_LOPQUANLY_TEN'),
                    'dropFilter_KDK_LopQuanLy', '-- Tất cả lớp quản lý --');
        pushToCombo(makeDistinct('DAOTAO_KHOADAOTAO_TEN'),
                    'dropFilter_KDK_KhoaHoc', '-- Tất cả khóa học --');
    },

    _applyFilter_KhongDangKy: function () {
        var me = this;
        var raw = me.dtKhongDangKy_Raw || [];
        var kw = ($('#txtSearch_KhongDangKy').val() || '').trim().toLowerCase();
        var trangThai = $('#dropFilter_KDK_TrangThai').val() || '';
        var chuongTrinh = $('#dropFilter_KDK_ChuongTrinh').val() || '';
        var lopQuanLy = $('#dropFilter_KDK_LopQuanLy').val() || '';
        var khoaHoc = $('#dropFilter_KDK_KhoaHoc').val() || '';

        me.dtKhongDangKy = raw.filter(function (r) {
            if (trangThai && (r.QLSV_TRANGTHAI_TEN || '') !== trangThai) return false;
            if (chuongTrinh && (r.DAOTAO_TOCHUCCHUONGTRINH_TEN || '') !== chuongTrinh) return false;
            if (lopQuanLy && (r.DAOTAO_LOPQUANLY_TEN || '') !== lopQuanLy) return false;
            if (khoaHoc && (r.DAOTAO_KHOADAOTAO_TEN || '') !== khoaHoc) return false;
            if (kw) {
                var maso = String(r.QLSV_NGUOIHOC_MASO || '').toLowerCase();
                var full = ((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || ''))
                                .trim().toLowerCase();
                if (maso.indexOf(kw) === -1 && full.indexOf(kw) === -1) return false;
            }
            return true;
        });
    },

    render_KhongDangKy: function () {
        var me = this;
        me._applyFilter_KhongDangKy();
        var data = me.dtKhongDangKy || [];
        var pageSize = parseInt(edu.system.pageSize_default) || 10;
        var totalRows = data.length;
        var totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
        var pageIndex = parseInt(edu.system.pageIndex_default) || 1;
        if (pageIndex > totalPages) pageIndex = totalPages;
        if (pageIndex < 1) pageIndex = 1;
        edu.system.pageIndex_default = pageIndex;
        var start = (pageIndex - 1) * pageSize;
        var pageData = data.slice(start, start + pageSize);

        $('#lblTong_KhongDangKy').text(totalRows > 0
            ? 'Tổng: ' + totalRows + ' bản ghi'
            : 'Không có dữ liệu phù hợp');

        var jsonForm = {
            strTable_Id: "tblKhongDangKy",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.render_KhongDangKy()",
                iDataRow: totalRows
            },
            aaData: pageData,
            colPos: {
                center: [0],
                right: [5]
            },
            aoColumns: [
                { "mDataProp": "QLSV_NGUOIHOC_MASO" },
                { "mDataProp": "QLSV_NGUOIHOC_HODEM" },
                { "mDataProp": "QLSV_NGUOIHOC_TEN" },
                { "mDataProp": "QLSV_TRANGTHAI_TEN" },
                {
                    mRender: function (nRow, aData) {
                        return edu.util.formatCurrency(aData.TONGNOPHI);
                    }
                },
                { "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN" },
                { "mDataProp": "DAOTAO_LOPQUANLY_TEN" },
                { "mDataProp": "DAOTAO_KHOADAOTAO_TEN" }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

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

        ws['!cols'] = headers.map(function (h, idx) {
            var maxLen = (h || '').length;
            dataRows.forEach(function (r) {
                var l = String(r[idx] == null ? '' : r[idx]).length;
                if (l > maxLen) maxLen = l;
            });
            return { wch: Math.min(maxLen + 2, 40) };
        });

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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    save_SinhVien: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_DangKy/ThucHienDonLopDangKyHoc',
            'type': 'POST',
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strDangKy_LopHocPhan_Cu_Ids': obj.DANGKY_LOPHOCPHAN_ID,
            'strDangKy_LopHocPhan_Moi_Ids': edu.util.getValById("dropLopCuoi"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    $("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    $("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKyHoc();
                    me.getList_DangKyHocKQ();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DangKyHoc: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize':1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_DangKyHoc(dtReRult, data.Pager);
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
    genTable_DangKyHoc: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0,8],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "SOLUONGDUKIENHOC"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        var jsonForm = {
            strTable_Id: "tblSinhVienNhom",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_DangKyHocKQ: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById("dropLopCuoi"),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DangKyHocKQ(dtReRult, data.Pager);
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
    genTable_DangKyHocKQ: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVienKQ",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.arrSinhVien_Id.forEach(e => {
            $("#tblSinhVienKQ #" + e).attr("style", "background-color: pink");
        });
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_LopHocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENLOP",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopCuoi"],
            type: "",
            title: "Chọn lớp cuối",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.LopHocPhan.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },

    delete_LopHocPhan: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_DangKy/ThucHienHuyDangKyHocHocPhan',
            'type': 'POST',
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': obj.DANGKY_KEHOACHDANGKY_ID,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKyHoc();
                    me.getList_DangKyHocKQ();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_LopHocPhanDangChon: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_TrucTiep_MH/FSk0IgkoJC8JNDgFIC8mCjgJLiINLjECKS4v',
            'func': 'pkg_dangkyhoc_tructiep.ThucHienHuyDangKyHocLopChon',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': obj.DANGKY_KEHOACHDANGKY_ID,
            'strDangKy_LopHocPhan_Chon_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
                //me.getList_DangKyHoc();
                //me.getList_DangKyHocKQ();
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKyHoc();
                    me.getList_DangKyHocKQ();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    save_ThietLapLopRieng: function (strDaoTao_LopHocPhan_Id, dLopRieng) {
        var me = this;
        var obj_save = {
            'action': 'DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng',
            'type': 'POST',
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dLopRieng': dLopRieng,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                me.getList_LopHocPhan();
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DangKyHoc();
                //});
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_ThietLapKhongTinhPhi: function (strDaoTao_LopHocPhan_Id, dKhongTinhPhi) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUoLykRKSgP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongTinhPhi',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dKhongTinhPhi': dKhongTinhPhi,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                me.getList_LopHocPhan();
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DangKyHoc();
                //});
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_ThietLapKhongToChucThi: function (strDaoTao_LopHocPhan_Id, dKhongToChucThi) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUuAik0IhUpKAPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongToChucThi',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dKhongToChucThi': dKhongToChucThi,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                me.getList_LopHocPhan();
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DangKyHoc();
                //});
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_ThuocTinhKLGD: function (data) {
        var jsonForm = {
            strTable_Id: "tblThuocTinhKLGD",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                { "mDataProp": "MALOP" },
                { "mDataProp": "TENLOP" },
                { "mDataProp": "LOAILOP" },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    save_ThuocTinhKLGD: function (strDaoTao_LopHocPhan_Id, strPhanLoaiCachTinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHhEpIC8NLiAoHg0uMQkx',
            'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_PhanLoai_LopHp',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strPhanLoaiCachTinh_Id': strPhanLoaiCachTinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    $('#myModalThuocTinhKLGD').modal('hide');
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_ThuocTinhKLGD: function (strDaoTao_LopHocPhan_Id, strPhanLoaiCachTinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeESkgLw0uICgeDS4xCTFw',
            'func': 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_PhanLoai_LopHp1',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strPhanLoaiCachTinh_Id': strPhanLoaiCachTinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    $('#myModalThuocTinhKLGD').modal('hide');
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_CheDoTinhPhi_LopHP: function (data) {
        var jsonForm = {
            strTable_Id: "tblCheDoTinhPhi_LopHP",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                { "mDataProp": "MALOP" },
                { "mDataProp": "TENLOP" },
                { "mDataProp": "LOAILOP" },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CHEDOTINHPHI_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    save_CheDoTinhPhi_LopHP: function (strDangKy_LopHocPhan_Id, strCheDoTinhPhi_Id, strKieuHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/ETMeBSAvJgo4Hg0uMQkxHgIpJAUuESkoHggvMgPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_LopHp_CheDoPhi_Ins',
            'iM': edu.system.iM,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strHieuLuc': '1',
            'strCheDoTinhPhi_Id': strCheDoTinhPhi_Id,
            'strKieuHoc_Id': strKieuHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    $('#myModalCheDoTinhPhi_LopHP').modal('hide');
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_CheDoTinhPhi_LopHP: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/ETMeBSAvJgo4Hg0uMQkxHgIpJAUuESkoHgUkLQPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_LopHp_CheDoPhi_Del',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    $('#myModalCheDoTinhPhi_LopHP').modal('hide');
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_HuyPhiTinChi: function (data) {
        var jsonForm = {
            strTable_Id: "tblHuyPhiTinChi",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                { "mDataProp": "MALOP" },
                { "mDataProp": "TENLOP" },
                { "mDataProp": "LOAILOP" }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    huyPhiTinChiTheoLop: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSk0IgkoJC8JNDgRKSgVKC8CKSgVKSQuDS4x',
            'func': 'PKG_DANGKYHOC_THONGTIN2.ThucHienHuyPhiTinChiTheoLop',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    $('#myModalHuyPhiTinChi').modal('hide');
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_DonLopNhom: function (strId, strNguonDuLieu_Id) {
        var me = this;
        var aData = me.dtSinhVien.find(e => e.ID == strId)
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/Them_DangKy_DonLop_LichSu',
            'type': 'POST',
            'strDangKy_LopHocPhan_Id': aData.DANGKY_LOPHOCPHAN_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DonLopNhom(strNguonDuLieu_Id);
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DonLopNhom: function (strNguonDuLieu_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayThongTinChuanBiDonLop',
            'type': 'POST',
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDonNhomLop"] = dtReRult;
                    me.genTable_DonNhomLop(dtReRult.rsLopBanDau, data.Pager);
                    me.genCombo_DonNhomLop(dtReRult.rsLopMoi);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DonNhomLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThongTinDonLop",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "HINHTHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropLopMoi' + aData.ID + '" class="select-opt" style="width:100% !important"></select>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        $(".select-opt").select2();
        /*III. Callback*/
    },
    genCombo_DonNhomLop: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENLOP",
            },
            renderPlace: ["dropLopCuoiNhom"],
            title: "Chọn lớp"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DonLopNhom_LopMoi: function (aData) {
        var me = this;
        var strId = edu.util.getValById("dropLopCuoiNhom")
        //var aData = me.dtDonNhomLop.rsLopMoi.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayDSLopMoiTheo',
            'type': 'POST',
            'strDangKy_LopHocPhan_Moi_Id': strId,
            'strIdHinhThucHoc': aData.IDHINHTHUCHOC,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //var arrPlace = [];
                    //me.dtDonNhomLop.rsLopBanDau.forEach(e => arrPlace.push("dropLopMoi" + e.ID));
                    var obj = {
                        data: dtReRult,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENLOP",
                            selectFirst: true
                        },
                        renderPlace: ["dropLopMoi" + aData.ID],
                        title: "Chọn lớp"
                    };
                    edu.system.loadToCombo_data(obj);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DonLopNhom_SV: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayDSDuLieuDonLop',
            'type': 'POST',
            'strNguonDuLieu_Id': me.strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DonLopNhom_SV(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DonLopNhom_SV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLopNhom",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_DonLopNhom_DuLieu: function (strId, strDangKy_LopHocPhan_Moi_Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_TrucTiep/ThucHienDonLopDangKyHocNhom',
            'type': 'POST',
            'strNguonDuLieu_Id': me.strNguonDuLieu_Id,
            'strDangKy_LopHocPhan_Cu_Ids': strId,
            'strDangKy_LopHocPhan_Moi_Ids': strDangKy_LopHocPhan_Moi_Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    //me.getList_DonLopNhom(strNguonDuLieu_Id);
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_RutHocPhan: function (data) {
        var jsonForm = {
            strTable_Id: "tblRutHocPhan",
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + ' ' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var ten = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                        var ma = edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                        return ma ? ten + ' (' + ma + ')' : ten;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="number" min="0" max="100" step="0.01" value="0" id="txtPhanTram' + aData.ID + '" class="form-control" style="height: 28px; padding: 2px 6px;" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    thucHienRutHocPhan: function (srcTbl, strId, dPhanTramTinhPhi, strMoTa) {
        var me = this;
        var arrData = srcTbl === "tblLopHocPhanChiTiet2" ? (me.dtLopHocPhanChiTiet2 || []) : (me.dtLopHocPhanChiTiet || []);
        var rec = arrData.find(function (r) { return r.ID == strId; });
        if (!rec) {
            edu.system.alert("Không tìm thấy bản ghi: " + strId, "w");
            return;
        }
        var obj_save = {
            'action': 'DKH_RutHocPhan_MH/FSk0IgkoJC8TNDUP',
            'func': 'PKG_DANGKYHOC_RUTHOCPHAN.ThucHienRut',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': rec.DANGKY_KEHOACHDANGKY_ID,
            'strDaoTao_HocPhan_Id': rec.DAOTAO_HOCPHAN_ID,
            'strQLSV_NguoiHoc_Id': rec.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': rec.DAOTAO_THOIGIANDAOTAO_ID,
            'dPhanTramTinhPhi': dPhanTramTinhPhi,
            'strMoTa': strMoTa,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    if (srcTbl === "tblLopHocPhanChiTiet2") me.getList_LopHocPhanRut();
                    else me.getList_LopHocPhanChiTiet();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    tongHopCongNoSinhVien: function (strQLSV_NguoiHoc_Id, onDone) {
        var me = this;
        var obj_save = {
            'action': 'TC_NguoiHoc/TongHopDuNoSinhVien',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tổng hợp công nợ thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhanChiTiet();
                });
                if (typeof onDone === 'function') onDone();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    canBangNo: function (rec) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSkkLB4VFR4ZICIPKSAvHhUVHgIVHhUC',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Them_TT_XacNhan_TT_CT_TC',
            'iM': edu.system.iM,
            'strDangKy_LopHocPhan_Id': rec.DANGKY_LOPHOCPHAN_ID,
            'strKieuHoc_Id': rec.KIEUHOC_ID,
            'strTaiChinh_CacKhoanThu_Id': rec.TAICHINH_CACKHOANTHU_ID,
            'strQLSV_NguoiHoc_Id': rec.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': rec.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cân bằng nợ thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhanChiTiet();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    huyCanBangNo: function (rec) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/GS4gHhUVHhkgIg8pIC8eFRUeAhUeFQIP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.Xoa_TT_XacNhan_TT_CT_TC',
            'iM': edu.system.iM,
            'strDangKy_LopHocPhan_Id': rec.DANGKY_LOPHOCPHAN_ID,
            'strKieuHoc_Id': rec.KIEUHOC_ID,
            'strTaiChinh_CacKhoanThu_Id': rec.TAICHINH_CACKHOANTHU_ID,
            'strQLSV_NguoiHoc_Id': rec.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': rec.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Hủy cân bằng nợ thành công", "s");
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhanChiTiet();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    saveTaoDanhSachNhapDiem: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'D_PhanQuyen_MH/FSAuBTQNKCQ0DykgMQUoJCwP',
            'func': 'pkg_diem_phanquyen.TaoDuLieuNhapDiem',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_HinhThucHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP',
            'func': 'pkg_dangkyhoc_chung.LayDSHinhThucHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HinhThucHoc(dtReRult, data.Pager);
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
    genCombo_HinhThucHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAHINHTHUCHOC",
                code: "MA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TENHINHTHUCHOC) + " - " + edu.util.returnEmpty(aData.MAHINHTHUCHOC)
                }
            },
            renderPlace: ["dropSearch_HinhThucHoc"],
            title: "Chọn hình thức học"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_CheDoTinhPhi: function (strDangKy_SinhVien_Lop_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/AikkBS4VKC8pFSgkLwIpLhIXFSkkLg0uMQkR',
            'func': 'PKG_DANGKYHOC_THONGTIN2.CheDoTinhTienChoSVTheoLopHP',
            'iM': edu.system.iM,
            'strDangKy_SinhVien_Lop_Id': strDangKy_SinhVien_Lop_Id,
            'strCheDoTinhPhi_Id': edu.system.getValById('dropCheDoTinhPhi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Find-in-table widget (Ctrl+F-style)
    --Fetch toàn bộ data 1 lần vào cache, sau đó filter
    --client-side theo MỌI field (giống Ctrl+F của browser).
    -------------------------------------------*/
    findState: {
        keyword: '', matches: [], currentIdx: -1,
        active: false,
        cache: null, cacheTableId: null, cacheLoading: false
    },
    _findDebounce: null,
    FIND_FETCH_PAGE_SIZE: 100000,

    getActiveFindTableId: function () {
        var ids = ['tblLopHocPhan', 'tblLopHocPhanChiTiet', 'tblLopHocPhanChiTiet2'];
        for (var i = 0; i < ids.length; i++) {
            var $tbl = $('#' + ids[i]);
            if ($tbl.length && $tbl.closest('.tblHidden').is(':visible')) {
                return ids[i];
            }
        }
        return null;
    },

    _callFindFetch: function (tableId, override) {
        var me = this;
        if (tableId === 'tblLopHocPhan') me.getList_LopHocPhan(override);
        else if (tableId === 'tblLopHocPhanChiTiet') me.getList_LopHocPhanChiTiet(override);
        else if (tableId === 'tblLopHocPhanChiTiet2') me.getList_LopHocPhanRut(override);
    },

    _renderFiltered: function (tableId, data) {
        var me = this;
        var iPager = data.length;
        if (tableId === 'tblLopHocPhan') {
            me.dtLopHocPhan = data;
            me.genTable_LopHocPhan(data, iPager);
        } else if (tableId === 'tblLopHocPhanChiTiet') {
            me.genTable_LopHocPhanChiTiet(data, iPager);
        } else if (tableId === 'tblLopHocPhanChiTiet2') {
            me.genTable_LopHocPhanRut(data, iPager);
        }
    },

    _recordMatchesKeyword: function (record, kwLower) {
        if (!record) return false;
        for (var k in record) {
            if (!Object.prototype.hasOwnProperty.call(record, k)) continue;
            var v = record[k];
            if (v == null) continue;
            if (String(v).toLowerCase().indexOf(kwLower) !== -1) return true;
        }
        return false;
    },

    invalidateFindCache: function () {
        var me = this;
        me.findState.cache = null;
        me.findState.cacheTableId = null;
        me.findState.cacheLoading = false;
    },

    runFindInTable: function (keyword) {
        var me = this;
        var kw = (keyword || '').trim();
        me.findState.keyword = kw;
        if (me._findDebounce) clearTimeout(me._findDebounce);
        me._findDebounce = setTimeout(function () {
            me._doFind();
        }, 300);
    },

    _doFind: function () {
        var me = this;
        var tableId = me.getActiveFindTableId();
        if (!tableId) { me.updateFindCounter(); return; }
        var kw = me.findState.keyword;
        if (!kw) {
            if (me.findState.active) {
                me.findState.active = false;
                me._callFindFetch(tableId, null);
            } else {
                me.scanRenderedMatches();
            }
            return;
        }
        if (me.findState.cache && me.findState.cacheTableId === tableId) {
            me._applyClientFilter(tableId, kw);
            return;
        }
        if (me.findState.cacheLoading) return;
        me._loadFindCache(tableId, function () {
            if (me.findState.keyword) me._applyClientFilter(tableId, me.findState.keyword);
        });
    },

    _loadFindCache: function (tableId, cb) {
        var me = this;
        me.findState.cacheLoading = true;
        me.findState.cacheTableId = tableId;
        $('#lblFindInTableCounter').text('...').removeClass('has-match no-match');
        me._callFindFetch(tableId, {
            keyword: '',
            pageIndex: 1,
            pageSize: me.FIND_FETCH_PAGE_SIZE,
            onlyFetch: true,
            onSuccess: function (data) {
                me.findState.cache = data || [];
                me.findState.cacheLoading = false;
                cb && cb();
            },
            onError: function () {
                me.findState.cache = null;
                me.findState.cacheLoading = false;
                me.updateFindCounter();
            }
        });
    },

    _applyClientFilter: function (tableId, kw) {
        var me = this;
        var kwLower = kw.toLowerCase();
        var filtered = (me.findState.cache || []).filter(function (r) {
            return me._recordMatchesKeyword(r, kwLower);
        });
        me.findState.active = true;
        me._renderFiltered(tableId, filtered);
        // scanRenderedMatches sẽ được gọi từ refreshFindInTable sau khi render
    },

    scanRenderedMatches: function () {
        var me = this;
        me.clearFindHighlight();
        me.findState.matches = [];
        me.findState.currentIdx = -1;
        var kw = (me.findState.keyword || '').toLowerCase();
        var tableId = me.getActiveFindTableId();
        if (!tableId || !kw) { me.updateFindCounter(); return; }
        $('#' + tableId + ' tbody tr').each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(kw) !== -1) {
                $(this).addClass('find-match');
                me.findState.matches.push(this);
            }
        });
        if (me.findState.matches.length > 0) {
            me.gotoFindMatch(0);
        } else {
            me.updateFindCounter();
        }
    },

    gotoFindMatch: function (idx) {
        var me = this;
        var n = me.findState.matches.length;
        if (n === 0) {
            me.findState.currentIdx = -1;
            me.updateFindCounter();
            return;
        }
        if (me.findState.currentIdx >= 0 && me.findState.matches[me.findState.currentIdx]) {
            $(me.findState.matches[me.findState.currentIdx]).removeClass('find-match-current');
        }
        var newIdx = ((idx % n) + n) % n;
        me.findState.currentIdx = newIdx;
        var $tr = $(me.findState.matches[newIdx]);
        $tr.addClass('find-match-current');
        var el = $tr.get(0);
        if (el && el.scrollIntoView) {
            try { el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); }
            catch (e) { el.scrollIntoView(); }
        }
        me.updateFindCounter();
    },

    nextFindMatch: function () {
        var me = this;
        if (me.findState.matches.length === 0) return;
        me.gotoFindMatch(me.findState.currentIdx + 1);
    },

    prevFindMatch: function () {
        var me = this;
        if (me.findState.matches.length === 0) return;
        me.gotoFindMatch(me.findState.currentIdx - 1);
    },

    clearFindHighlight: function () {
        $('#tblLopHocPhan tbody tr, #tblLopHocPhanChiTiet tbody tr, #tblLopHocPhanChiTiet2 tbody tr')
            .removeClass('find-match find-match-current');
    },

    clearFindInTable: function () {
        var me = this;
        if (me._findDebounce) { clearTimeout(me._findDebounce); me._findDebounce = null; }
        var wasActive = me.findState.active;
        me.clearFindHighlight();
        me.findState.keyword = '';
        me.findState.matches = [];
        me.findState.currentIdx = -1;
        me.findState.active = false;
        $('#txtFindInTable').val('');
        me.updateFindCounter();
        if (wasActive) {
            var tableId = me.getActiveFindTableId();
            me._callFindFetch(tableId, null);
        }
    },

    updateFindCounter: function () {
        var me = this;
        var $lbl = $('#lblFindInTableCounter');
        var n = me.findState.matches.length;
        var cur = me.findState.currentIdx >= 0 ? (me.findState.currentIdx + 1) : 0;
        $lbl.removeClass('has-match no-match');
        if (!me.findState.keyword) {
            $lbl.text('0/0');
        } else if (n === 0) {
            $lbl.text('0/0').addClass('no-match');
        } else {
            $lbl.text(cur + '/' + n).addClass('has-match');
        }
        var disabled = n === 0;
        $('#btnFindInTablePrev, #btnFindInTableNext').toggleClass('disabled', disabled);
    },

    refreshFindInTable: function () {
        var me = this;
        if (me.findState && me.findState.keyword) {
            me.scanRenderedMatches();
        } else {
            me.updateFindCounter();
        }
    },

    /*------------------------------------------
    --Discription: Lọc theo "Loại lớp" (client-side)
    --Dropdown multi-select build từ distinct value của
    --LOAILOP (tblLopHocPhan) hoặc LOPRIENG (chi tiết/rút).
    -------------------------------------------*/
    _rawByTable: null,
    _lastDropdownTableId: null,
    _suppressLoaiLopChange: false,

    _loaiLopFieldFor: function (tableId) {
        if (tableId === 'tblLopHocPhan') return 'LOAILOP';
        if (tableId === 'tblLopHocPhanChiTiet' || tableId === 'tblLopHocPhanChiTiet2') return 'LOPRIENG';
        return null;
    },

    _getSelectedLoaiLop: function () {
        return $('#dropSearch_LoaiLop').val() || '';
    },

    _isLopRiengRecord: function (r, tableId) {
        if (!r) return false;
        if (tableId === 'tblLopHocPhan' && r.HOCPHITINHRIENG != null) {
            return !!r.HOCPHITINHRIENG;
        }
        var field = (tableId === 'tblLopHocPhan') ? 'LOAILOP' : 'LOPRIENG';
        var v = r[field];
        if (v == null || v === '') return false;
        var s = String(v).toLowerCase();
        if (s.indexOf('rieng') !== -1) return true;
        if (s.indexOf('riêng') !== -1) return true;
        if (typeof s.normalize === 'function') {
            var sNoAccent = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
            if (sNoAccent.indexOf('rieng') !== -1) return true;
        }
        return false;
    },

    _filterDataByLoaiLop: function (data, tableId) {
        var me = this;
        var sel = me._getSelectedLoaiLop();
        if (!sel) return data || [];
        return (data || []).filter(function (r) {
            var isRieng = me._isLopRiengRecord(r, tableId);
            if (sel === 'rieng') return isRieng;
            if (sel === 'thuong') return !isRieng;
            return true;
        });
    },

    _rebuildLoaiLopOptions: function (data, tableId) {
        // Options are static (Tất cả / Chỉ lớp riêng / Chỉ lớp thường)
        // No rebuild needed; kept as no-op so genTable_* calls remain valid.
    },

    _refilterActiveTable: function () {
        var me = this;
        var tableId = me.getActiveFindTableId();
        if (!tableId) return;
        me.clearFindInTable();
        me.invalidateFindCache();
        if (tableId === 'tblLopHocPhan') me.getList_LopHocPhan();
        else if (tableId === 'tblLopHocPhanChiTiet') me.getList_LopHocPhanChiTiet();
        else if (tableId === 'tblLopHocPhanChiTiet2') me.getList_LopHocPhanRut();
    },
}