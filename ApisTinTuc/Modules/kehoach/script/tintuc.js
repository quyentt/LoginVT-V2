/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TinTuc() { };
TinTuc.prototype = {
    dtTinTuc: [],
    strTinTuc_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrHe: [],
    arrChuongTrinh: [],
    strChuyenMuc_TenBangId: '', // cache ID bảng TINTUC.CHUYENMUC (lazy load)
    dtChuyenMuc_QuickAdd: [], // cache danh sách chuyên mục hiển thị trong modal quản lý

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        var edCk = CKEDITOR.replace('editor_NoiDung', {
            filebrowserImageUploadUrl: (edu.system.rootPathUpload || '') + '/Handler/up_files_v2.ashx?outFolderPath=TinTuc/Editor/&userId=' + edu.system.userId
        });
        edCk.on('fileUploadResponse', function (evt) {
            evt.stop();
            var data = evt.data;
            var xhr = data.fileLoader.xhr;
            var response = String(xhr.responseText || '').trim();
            if (response.indexOf('Sys_error:') !== -1) {
                data.message = response;
                evt.cancel();
                return;
            }
            var fileName = response.split(',')[0].trim();
            if (!fileName) {
                data.message = 'Server không trả về tên file';
                evt.cancel();
                return;
            }
            data.url = (edu.system.rootPathUpload || '') + '/' + fileName;
        });
        edu.system.uploadAvatar(['uploadPicture_TinTuc'], "");
        me.getList_TinTuc();
        me.getList_UngDung();
        me.getList_CoCauToChuc();
        edu.system.loadToCombo_DanhMucDuLieu("TINTUC.CHUYENMUC", "dropSearch_ChuyenMuc,dropChuyenMuc");
        edu.system.loadToCombo_DanhMucDuLieu("TINTUC.PHEDUYET", "dropSearch_TinhTrang");

        $("#btnSearch").click(function (e) {
            edu.system.pageIndex_default = 1;
            me.getList_TinTuc();
        });
        $("#txtSearch_TieuDe").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                edu.system.pageIndex_default = 1;
                me.getList_TinTuc();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_TinTuc").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_TinTuc();
            }
        });
        $("[id$=chkSelectAll_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });
        $("#btnXoaTinTuc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTinTuc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tin cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TinTuc(arrChecked_Id[i]);
                }
            });            
            setTimeout(function () {
                me.getList_TinTuc();
            }, 2000);

        });
        $("#tblTinTuc").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblTinTuc");
            if (!edu.util.checkValue(strId)) {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
                return;
            }
            me.toggle_edit();
            // Lazy-load chi tiết: list không còn chứa NOIDUNG, phải gọi API riêng
            var baseData = edu.util.objGetDataInData(strId, me.dtTinTuc, "ID")[0] || {};
            me.getChiTiet_TinTuc(strId, function (detail) {
                var data = $.extend({}, baseData, detail || {});
                me.viewEdit_TinTuc(data);
                edu.system.viewFiles("txtFileDinhKem", strId, "SV_Files");
            });
        });
        $("#tblTinTuc").delegate('.btnPhamVi', 'click', function (e) {
            var strId = this.id;
            me.toggle_phamvi();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtTinTuc, "ID")[0];
                me.strTinTuc_Id = data.ID;
                me.tinTucData = data;
                me.getList_SinhVien();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        // Nút Gửi Email
        $("#tblTinTuc").delegate('.btnSendEmail', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            if (!edu.util.checkValue(strId)) {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
                return;
            }
            var baseData = edu.util.objGetDataInData(strId, me.dtTinTuc, "ID")[0] || {};
            me.strTinTuc_Id = baseData.ID || strId;
            // Fetch chi tiết để lấy NOIDUNG trước khi mở modal (template email cần)
            me.getChiTiet_TinTuc(strId, function (detail) {
                me.tinTucData = $.extend({}, baseData, detail || {});
                me.toggle_sendemail();
                me.getList_HeDaoTao_SendEmail();
                me.getList_KhoaDaoTao_SendEmail();
                me.getList_ChuongTrinhDaoTao_SendEmail();
                me.getList_LopQuanLy_SendEmail();
                me.countSinhVien_SendEmail();
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnPageSinhVien', 'click', function () {
            var page = $(this).data('page');
            edu.system.pageIndex_default = page;
            me.getList_SinhVien(page);
        });
        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            me.arrHe = $("#dropSearchModal_He_SV").val();
            if (me.arrHe.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_He_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoHe").html("Áp dụng cho hệ: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những hệ: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#btnSave_PhamVi").click(function (e) {
            var iTong = me.arrHe.length + me.arrKhoa.length + me.arrLop.length + me.arrSinhVien_Id.length + me.arrChuongTrinh.length;
            edu.system.confirm("Bạn có chắc chắn lưu " + iTong + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", iTong);
                me.arrHe.forEach(e => me.save_PhamVi(e));
                me.arrKhoa.forEach(e => me.save_PhamVi(e));
                me.arrChuongTrinh.forEach(e => me.save_PhamVi(e));
                me.arrLop.forEach(e => me.save_PhamVi(e));
                me.arrSinhVien_Id.forEach(e => me.save_PhamVi(e));
            });
        });
        $("#btnSendEmail_PhamVi").click(function (e) {
            if (!me.strTinTuc_Id) {
                edu.system.alert("Vui lòng chọn tin tức trước khi gửi email!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn gửi email thông báo tin tức này đến sinh viên trong phạm vi không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.sendEmail_ToSinhVien();
            });
        });
        
        // Tìm kiếm sinh viên
        $("#btnSearch_SinhVien_PV").click(function (e) {
            me.getList_SinhVien_PhamVi(1);
        });
        $("#txtSearch_SinhVien_PV").keypress(function (e) {
            if (e.which === 13) {
                me.getList_SinhVien_PhamVi(1);
            }
        });
        
        // Select all checkbox
        $("#chkSelectAll_SinhVien").on("click", function () {
            var checked_status = this.checked;
            $(".chkSinhVien_Item").each(function () {
                this.checked = checked_status;
            });
        });
        
        // Gửi email cho sinh viên đã chọn
        $("#btnSendEmail_Selected").click(function (e) {
            var arrChecked = [];
            $(".chkSinhVien_Item:checked").each(function () {
                arrChecked.push($(this).data('id'));
            });
            
            if (arrChecked.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 sinh viên để gửi email!");
                return;
            }
            
            edu.system.confirm("Bạn có chắc chắn gửi email đến " + arrChecked.length + " sinh viên đã chọn không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.sendEmail_ToSelectedSinhVien(arrChecked);
            });
        });
        
        // Xác nhận gửi email từ modal Send Email
        $("#btnConfirmSendEmail").click(function (e) {
            var arrChecked = [];
            $(".chkSendEmail_Item:checked").each(function () {
                arrChecked.push($(this).data('id'));
            });
            
            if (arrChecked.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 sinh viên để gửi email!");
                return;
            }
            
            edu.system.confirm("Bạn có chắc chắn gửi email đến " + arrChecked.length + " sinh viên đã chọn không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.processSendEmail_ToSelected(arrChecked);
            });
        });
        
        // Tìm kiếm sinh viên trong modal Send Email
        $("#btnSendEmail_Search").click(function (e) {
            me.getList_SinhVien_SendEmail(1);
        });
        $("#txtSendEmail_Search").keypress(function (e) {
            if (e.which === 13) {
                me.getList_SinhVien_SendEmail(1);
            }
        });
        
        // Select all checkbox trong modal Send Email
        $("#chkSendEmail_SelectAll").on("click", function () {
            var checked_status = this.checked;
            $(".chkSendEmail_Item").each(function () {
                this.checked = checked_status;
            });
            me.updateSoLuongDaChon_SendEmail();
        });
        
        // Chọn tất cả
        $("#btnSendEmail_SelectAll").click(function (e) {
            $(".chkSendEmail_Item").prop("checked", true);
            me.updateSoLuongDaChon_SendEmail();
        });
        
        // Bỏ chọn tất cả
        $("#btnSendEmail_UnselectAll").click(function (e) {
            $(".chkSendEmail_Item").prop("checked", false);
            me.updateSoLuongDaChon_SendEmail();
        });
        
        // Import Excel trong modal Send Email
        $("#btnSendEmail_ImportExcel").click(function (e) {
            me.openImportModal_SendEmail();
        });
        
        // Phân trang trong modal Send Email
        $("#tblSendEmail_SinhVien").delegate('.btnPageSendEmail', 'click', function () {
            var page = $(this).data('page');
            me.getList_SinhVien_SendEmail(page);
        });
        
        // Click vào row để toggle checkbox trong modal Send Email
        $("#tblSendEmail_SinhVien tbody").delegate('tr', 'click', function (e) {
            if ($(e.target).hasClass('chkSendEmail_Item') || 
                $(e.target).hasClass('btnPageSendEmail') ||
                $(e.target).closest('.pagination-wrapper').length > 0) {
                return;
            }
            
            var checkbox = $(this).find('.chkSendEmail_Item');
            if (checkbox.length > 0) {
                checkbox.prop('checked', !checkbox.prop('checked'));
                if (checkbox.prop('checked')) {
                    $(this).css('background-color', '#e6f7ff');
                } else {
                    $(this).css('background-color', '');
                }
                me.updateSoLuongDaChon_SendEmail();
            }
        });
        
        // Highlight row khi checkbox thay đổi trong modal Send Email
        $("#tblSendEmail_SinhVien tbody").delegate('.chkSendEmail_Item', 'change', function () {
            var row = $(this).closest('tr');
            if ($(this).prop('checked')) {
                row.css('background-color', '#e6f7ff');
            } else {
                row.css('background-color', '');
            }
            me.updateSoLuongDaChon_SendEmail();
        });
        
        // Thay đổi bộ lọc trong modal Send Email
        $('#dropSendEmail_HeDaoTao').on('select2:select select2:unselect', function (e) {
            me.getList_KhoaDaoTao_SendEmail();
            me.getList_LopQuanLy_SendEmail();
            me.countSinhVien_SendEmail();
        });
        $('#dropSendEmail_KhoaDaoTao').on('select2:select select2:unselect', function (e) {
            me.getList_ChuongTrinhDaoTao_SendEmail();
            me.getList_LopQuanLy_SendEmail();
            me.countSinhVien_SendEmail();
        });
        $('#dropSendEmail_ChuongTrinh').on('select2:select select2:unselect', function (e) {
            me.getList_LopQuanLy_SendEmail();
            me.countSinhVien_SendEmail();
        });
        $('#dropSendEmail_Lop').on('select2:select select2:unselect', function (e) {
            me.countSinhVien_SendEmail();
        });
        
        // Import Excel để chọn sinh viên
        $("#btnImportExcel_SinhVien").click(function (e) {
            me.openImportModal();
        });
        
        $("#btnDownloadTemplate_SinhVien").click(function (e) {
            me.downloadTemplate();
        });
        
        $("#btnProcessImport_SinhVien").click(function (e) {
            me.processImportExcel();
        });
        
        // Phân trang
        $("#tblSinhVien_PhamVi").delegate('.btnPageSinhVien_PV', 'click', function () {
            var page = $(this).data('page');
            me.getList_SinhVien_PhamVi(page);
        });
        
        // Click vào row để toggle checkbox
        $("#tblSinhVien_PhamVi tbody").delegate('tr', 'click', function (e) {
            // Bỏ qua nếu click vào checkbox hoặc pagination
            if ($(e.target).hasClass('chkSinhVien_Item') || 
                $(e.target).hasClass('btnPageSinhVien_PV') ||
                $(e.target).closest('.pagination-wrapper').length > 0) {
                return;
            }
            
            // Tìm checkbox trong row này
            var checkbox = $(this).find('.chkSinhVien_Item');
            if (checkbox.length > 0) {
                // Toggle checkbox
                checkbox.prop('checked', !checkbox.prop('checked'));
                
                // Thêm/xóa highlight cho row
                if (checkbox.prop('checked')) {
                    $(this).css('background-color', '#e6f7ff');
                } else {
                    $(this).css('background-color', '');
                }
            }
        });
        
        // Highlight row khi checkbox thay đổi
        $("#tblSinhVien_PhamVi tbody").delegate('.chkSinhVien_Item', 'change', function () {
            var row = $(this).closest('tr');
            if ($(this).prop('checked')) {
                row.css('background-color', '#e6f7ff');
            } else {
                row.css('background-color', '');
            }
        });
        
        // Thay đổi bộ lọc
        $('#dropSearch_HeDaoTao_PV').on('select2:select select2:unselect', function (e) {
            me.getList_KhoaDaoTao_PV();
            me.getList_LopQuanLy_PV();
        });
        $('#dropSearch_KhoaDaoTao_PV').on('select2:select select2:unselect', function (e) {
            me.getList_ChuongTrinhDaoTao_PV();
            me.getList_LopQuanLy_PV();
        });
        $('#dropSearch_ChuongTrinh_PV').on('select2:select select2:unselect', function (e) {
            me.getList_LopQuanLy_PV();
        });

        // Quick-add / Quản lý Chuyên mục ngay trong form Thêm/Sửa tin tức
        $("#btnQuickAdd_ChuyenMuc").click(function (e) {
            e.preventDefault();
            me.openQuickAdd_ChuyenMuc();
        });
        $("#btnQuickAdd_ChuyenMuc_Save").click(function (e) {
            e.preventDefault();
            me.saveQuickAdd_ChuyenMuc();
        });
        $("#btnQuickAdd_ChuyenMuc_Reset").click(function (e) {
            e.preventDefault();
            me.resetForm_QuickAdd_ChuyenMuc();
        });
        $("#btnQuickAdd_ChuyenMuc_Refresh").click(function (e) {
            e.preventDefault();
            me.getList_QuickAdd_ChuyenMuc();
        });
        $("#tblQuickAdd_ChuyenMuc").delegate('.btnQuickAdd_ChuyenMuc_Edit', 'click', function (e) {
            e.preventDefault();
            var strId = $(this).data('id');
            me.editRow_QuickAdd_ChuyenMuc(strId);
        });
        $("#tblQuickAdd_ChuyenMuc").delegate('.btnQuickAdd_ChuyenMuc_Delete', 'click', function (e) {
            e.preventDefault();
            var strId = $(this).data('id');
            var strTen = $(this).data('ten');
            me.deleteRow_QuickAdd_ChuyenMuc(strId, strTen);
        });

        $("#btnMaximize_NoiDung").click(function (e) {
            e.preventDefault();
            var $wrap = $("#wrapEditor_NoiDung");
            var $ico = $(this).find('i');
            var $lbl = $("#lblBtnMaximize_NoiDung");
            var isFull = $wrap.toggleClass('is-fullscreen').hasClass('is-fullscreen');
            $('body').toggleClass('tintuc-editor-fullscreen', isFull);
            $ico.toggleClass('fa-expand', !isFull).toggleClass('fa-compress', isFull);
            $lbl.text(isFull ? 'Thu nhỏ' : 'Phóng to');
            var ed = CKEDITOR.instances.editor_NoiDung;
            if (ed) {
                var h = isFull ? (window.innerHeight - 130) : 320;
                ed.resize('100%', h);
            }
            // Force hide select2 + datepicker khi vào fullscreen (chắc chắn ẩn, không phụ thuộc CSS cascade)
            var elems = document.querySelectorAll('.select2-container, .select2, .datepicker, .datepicker-dropdown');
            for (var i = 0; i < elems.length; i++) {
                if (isFull) {
                    if (!elems[i].hasAttribute('data-tintuc-prev-display')) {
                        elems[i].setAttribute('data-tintuc-prev-display', elems[i].style.display || '');
                    }
                    elems[i].style.display = 'none';
                } else {
                    if (elems[i].hasAttribute('data-tintuc-prev-display')) {
                        elems[i].style.display = elems[i].getAttribute('data-tintuc-prev-display');
                        elems[i].removeAttribute('data-tintuc-prev-display');
                    }
                }
            }
        });
        $(document).on('keydown.tintucFullscreen', function (e) {
            if (e.key === 'Escape' && $("#wrapEditor_NoiDung").hasClass('is-fullscreen')) {
                $("#btnMaximize_NoiDung").click();
            }
        });

        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTinTuc_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        edu.system.uploadFiles(["txtFileDinhKem"]);
         
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strTinTuc_Id = "";
        edu.util.viewValById("txtTieuDe", "");
        edu.util.viewValById("dropChuyenMuc", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayHetHan", "");
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropUngDung", "");
        //edu.util.viewValById("ckhTinUuTien", data.MA);
        var checked_status = false;
        $("#ckhTinUuTien").attr('checked', checked_status);
        $("#ckhTinUuTien").prop('checked', checked_status);
        CKEDITOR.instances['editor_NoiDung'].setData('');
        $("#srcuploadPicture_TinTuc").attr("src", edu.system.getRootPathImg(""));
        edu.system.viewFiles("txtFileDinhKem", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_TinTuc();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_phamvi: function () {
        var me = this;
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrHe = [];
        me.arrChuongTrinh = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        edu.util.toggle_overide("zone-bus", "zonePhamVi");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TinTuc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TT_BangTin/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TieuDe'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChuyenMuc_Id': edu.util.getValById('dropSearch_ChuyenMuc'),
            'strChung_UngDung_Id': edu.util.getValById('dropSearch_UngDung'),
            'dTinQuanTrong': -1,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strTrangThaiDuyet_Id': edu.util.getValById('dropSearch_TinhTrang'),
            'dHieuLuc': -1,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTinTuc = dtReRult;
                    me.genTable_TinTuc(dtReRult, data.Pager);
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
    // Lấy chi tiết 1 tin tức (đầy đủ NOIDUNG) — chỉ gọi khi user click vào Edit/Gửi Email
    // Backend proc: pkg_tintuc.LayTinTuc_BangTin_ChiTiet
    getChiTiet_TinTuc: function (strId, callback) {
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP',
            'func': 'pkg_tintuc.LayTinTuc_BangTin_ChiTiet',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': strId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var detail = null;
                    if (edu.util.checkValue(data.Data)) {
                        detail = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    if (typeof callback === 'function') callback(detail);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_TinTuc: function () {
        var me = this;
        var dTinQuanTrong = 0;
        if ($("#ckhTinUuTien").is(":checked")) dTinQuanTrong = 1;
        //--Edit
        var obj_save = {
            'action': 'TT_BangTin/ThemMoi',
            'type': 'POST',
            'strId': me.strTinTuc_Id,
            'strTieuDe': edu.util.getValById('txtTieuDe'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNoiDung': CKEDITOR.instances['editor_NoiDung'].getData(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChuyenMuc_Id': edu.util.getValById('dropChuyenMuc'),
            'strChung_UngDung_Id': edu.util.getValById('dropUngDung'),
            'dTinQuanTrong': dTinQuanTrong,
            'dHieuLuc': 1,
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayHetHan'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropDonVi'),
            'strDuongDanAnhHienThi': edu.util.getValById('uploadPicture_TinTuc'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TT_BangTin/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTinTuc_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTinTuc_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTinTuc_Id = obj_save.strId
                    }
                    edu.system.saveFiles("txtFileDinhKem", strTinTuc_Id, "SV_Files");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_TinTuc();
            },
            error: function (er) {
                edu.system.alert(obj_save.strId + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TinTuc: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TT_BangTin/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TinTuc();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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

    save_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TT_PhamVi/ThemMoi',
            'type': 'POST',
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strQLSV_TrangThai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_TinTuc();
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TinTuc: function (data, iPager) {
        var me = this;
        $("#lblTinTuc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTinTuc",

            bPaginate: {
                strFuntionName: "main_doc.TinTuc.getList_TinTuc()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TIEUDE",
                },
                {
                    "mDataProp": "CHUYENMUC_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "CHUNG_UNGDUNG_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return aData.TIEUDIEM == 1 ? "Quan trọng": "";
                    }
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhamVi" id="' + aData.ID + '" title="Chi tiết">Phạm vi</a></span>';
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-success btnSendEmail" id="' + aData.ID + '" title="Gửi email"><i class="fa fa-envelope"></i> Gửi Email</a></span>';
                    }
                },
                {
                    "mDataProp": "NGAYKETTHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    viewEdit_TinTuc: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtTieuDe", data.TIEUDE);
        edu.util.viewValById("dropChuyenMuc", data.CHUYENMUC_ID);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayHetHan", data.NGAYKETTHUC);
        edu.util.viewValById("dropDonVi", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("dropUngDung", data.CHUNG_UNGDUNG_ID);
        //edu.util.viewValById("ckhTinUuTien", data.MA);
        var checked_status = false;
        if (data.TINQUANTRONG) checked_status = true;
        me.strTinTuc_Id = data.ID;
        $("#ckhTinUuTien").attr('checked', checked_status);
        $("#ckhTinUuTien").prop('checked', checked_status);
        CKEDITOR.instances['editor_NoiDung'].setData(data.NOIDUNG);
        edu.util.viewValById("uploadPicture_TinTuc", data.DUONGDANANHHIENTHI);
        edu.util.viewValById("srcuploadPicture_TinTuc", data.DUONGDANANHHIENTHI);
        var strAnh = edu.system.getRootPathImg(data.DUONGDANANHHIENTHI);
        $("#srcuploadPicture_TinTuc").attr("src", strAnh);
    },
    viewEdit_PhamVi: function (data) {
        var me = this;
        //View - Thong tin
        me.strTinTuc_Id = data.ID;

        me.arrLop = [];
        me.arrHe = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoHe").html("");
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function (pageIndex) {
        var me = this;
        
        // Mặc định page 1 nếu không truyền
        if (!pageIndex) pageIndex = 1;

        //--Edit
        var obj_list = {
            'action': 'TT_PhamVi/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'pageIndex': pageIndex,
            'pageSize': 20, // Phân trang 20 bản ghi/trang
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult, iPager);
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
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TT_PhamVi/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        me.dtSinhVien = data; // Lưu data để dùng cho gửi email
        
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].PHANCAPAPDUNG_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].PHAMVIAPDUNG_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_TRANGTHAINGUOIHOC_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
        
        // Thêm phân trang
        if (iPager > 20) {
            var paginationHtml = '<tr><td colspan="6" class="text-center">';
            paginationHtml += '<div class="pagination-wrapper">';
            var totalPages = Math.ceil(iPager / 20);
            var currentPage = edu.system.pageIndex_default || 1;
            
            for (var p = 1; p <= totalPages; p++) {
                var activeClass = (p == currentPage) ? 'active' : '';
                paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien ' + activeClass + '" data-page="' + p + '">' + p + '</a> ';
            }
            paginationHtml += '</div></td></tr>';
            $("#tblInput_DTSV_SinhVien tbody").append(paginationHtml);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.TinTuc;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.TinTuc;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
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
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.TinTuc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropTinTuc_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinTuc.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
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
    

    /*----------------------------------------------
    --Discription: [1] Access DB UngDung
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("CMS_UngDung/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'CMS_UngDung/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'pageIndex': 1,
                'pageSize': 1000,
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] GenHTML UngDung
    --API:  
    ----------------------------------------------*/
    genCombo_UngDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MAUNGDUNG"
            },
            renderPlace: ["dropSearch_UngDung", "dropUngDung"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonVi", "dropDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    XoaTin: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TT_BangTin/Xoa_TinTuc_BangTin',
            'versionAPI': 'v1.0',            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Discription: [3] Gửi Email cho Sinh Viên
    --ULR:  Modules
    -------------------------------------------*/
    sendEmail_ToSinhVien: function () {
        var me = this;
        
        // Lấy thông tin tin tức
        var tinTucData = edu.util.objGetDataInData(me.strTinTuc_Id, me.dtTinTuc, "ID")[0];
        if (!tinTucData) {
            edu.system.alert("Không tìm thấy thông tin tin tức!");
            return;
        }
        
        // Hiển thị progress
        edu.system.alert('<div id="zoneEmailProgress"><p>Đang gửi email...</p><div id="progressBarEmail"></div></div>');
        
        // Gọi API lấy danh sách sinh viên theo phạm vi (không phân trang)
        me.getList_SinhVienForEmail(tinTucData);
    },
    
    getList_SinhVienForEmail: function (tinTucData) {
        var me = this;
        
        var obj_list = {
            'action': 'TT_PhamVi/LayDanhSachSinhVien_TheoTinTuc',
            'type': 'GET',
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 999999, // Lấy tất cả
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Data && data.Data.length > 0) {
                    var dsSinhVien = data.Data;
                    edu.system.genHTML_Progress("progressBarEmail", dsSinhVien.length);
                    
                    // Gửi email từng sinh viên
                    me.sendEmail_Batch(dsSinhVien, tinTucData, 0);
                }
                else {
                    edu.system.alert("Không có sinh viên nào trong phạm vi này!");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi khi lấy danh sách sinh viên: " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    
    sendEmail_Batch: function (dsSinhVien, tinTucData, index) {
        var me = this;
        
        if (index >= dsSinhVien.length) {
            edu.system.alert("Đã gửi email thành công đến " + dsSinhVien.length + " sinh viên!");
            return;
        }
        
        var sinhVien = dsSinhVien[index];
        
        // Kiểm tra email
        if (!sinhVien.TTLL_EMAILCANHAN) {
            // Bỏ qua sinh viên không có email
            edu.system.start_Progress("progressBarEmail", function () {
                me.sendEmail_Batch(dsSinhVien, tinTucData, index + 1);
            });
            return;
        }
        
        // Tạo nội dung email
        var mailSubject = "[THÔNG BÁO] " + tinTucData.TIEUDE;
        var strBody = me.createEmailTemplate(sinhVien, tinTucData);
        
        var obj_send = {
            'action': 'CMS_NguoiDung/SendEmail',
            'type': 'POST',
            'mailTo': sinhVien.TTLL_EMAILCANHAN,
            'mailSubject': mailSubject,
            'strBody': strBody,
            'arrFileDinhKem': [], // Có thể thêm file đính kèm nếu cần
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("Đã gửi email đến: " + sinhVien.TTLL_EMAILCANHAN);
                } else {
                    console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + data.Message);
                }
            },
            error: function (er) {
                console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + JSON.stringify(er));
            },
            complete: function () {
                // Cập nhật progress và gửi tiếp
                edu.system.start_Progress("progressBarEmail", function () {
                    me.sendEmail_Batch(dsSinhVien, tinTucData, index + 1);
                });
            },
            type: 'POST',
            action: obj_send.action,
            contentType: true,
            data: obj_send,
            fakedb: []
        }, false, false, false, null);
    },
    
    createEmailTemplate: function (sinhVien, tinTucData) {
        var me = this;
        var strIp = edu.system.rootPath;
        
        // Tạo template email
        var template = '<html><head><style>';
        template += 'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }';
        template += '.email-container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }';
        template += '.email-header { background-color: #0066cc; color: white; padding: 15px; text-align: center; }';
        template += '.email-body { padding: 20px; background-color: #f9f9f9; }';
        template += '.email-footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }';
        template += '.btn-view { display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }';
        template += '</style></head><body>';
        
        template += '<div class="email-container">';
        template += '<div class="email-header">';
        template += '<h2>THÔNG BÁO TIN TỨC</h2>';
        template += '</div>';
        
        template += '<div class="email-body">';
        template += '<p>Kính gửi: <strong>' + sinhVien.QLSV_NGUOIHOC_HODEM + ' ' + sinhVien.QLSV_NGUOIHOC_TEN + '</strong></p>';
        template += '<p>Mã sinh viên: <strong>' + sinhVien.QLSV_NGUOIHOC_MASO + '</strong></p>';
        template += '<p>Lớp: <strong>' + (sinhVien.DAOTAO_LOPQUANLY_TEN || '') + '</strong></p>';
        template += '<hr>';
        
        template += '<h3>' + tinTucData.TIEUDE + '</h3>';
        
        // Thêm ảnh nếu có
        if (tinTucData.DUONGDANANHHIENTHI) {
            template += '<p><img src="' + strIp + tinTucData.DUONGDANANHHIENTHI + '" style="max-width: 100%; height: auto;" /></p>';
        }
        
        // Nội dung tin tức
        template += '<div>' + tinTucData.NOIDUNG + '</div>';
        
        // Thông tin thêm
        if (tinTucData.NGAYBATDAU) {
            template += '<p><strong>Ngày bắt đầu:</strong> ' + tinTucData.NGAYBATDAU + '</p>';
        }
        if (tinTucData.NGAYKETTHUC) {
            template += '<p><strong>Ngày hết hạn:</strong> ' + tinTucData.NGAYKETTHUC + '</p>';
        }
        
        template += '<p><a href="' + strIp + '" class="btn-view">Xem chi tiết trên hệ thống</a></p>';
        template += '</div>';
        
        template += '<div class="email-footer">';
        template += '<p>Email này được gửi tự động từ hệ thống quản lý đào tạo.</p>';
        template += '<p>Vui lòng không trả lời email này.</p>';
        template += '<p>&copy; ' + new Date().getFullYear() + ' - Trường Đại học Công nghệ Đông Á</p>';
        template += '</div>';
        
        template += '</div>';
        template += '</body></html>';
        
        return template;
    },
    
    /*----------------------------------------------
    --Discription: [4] Functions cho modal Gửi Email với bộ lọc
    --ULR:  Modules
    ----------------------------------------------*/
    getList_HeDaoTao_PV: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao_PV);
    },
    
    getList_KhoaDaoTao_PV: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_PV"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao_PV);
    },
    
    getList_ChuongTrinhDaoTao_PV: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_PV"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao_PV);
    },
    
    getList_LopQuanLy_PV: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_PV"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_PV"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_PV"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy_PV);
    },
    
    cbGenCombo_HeDaoTao_PV: function (data) {
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
            renderPlace: ["dropSearch_HeDaoTao_PV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_PV").val("").trigger("change");
    },
    
    cbGenCombo_KhoaDaoTao_PV: function (data) {
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
            renderPlace: ["dropSearch_KhoaDaoTao_PV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_PV").val("").trigger("change");
    },
    
    cbGenCombo_ChuongTrinhDaoTao_PV: function (data) {
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
            renderPlace: ["dropSearch_ChuongTrinh_PV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_PV").val("").trigger("change");
    },
    
    cbGenCombo_LopQuanLy_PV: function (data) {
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
            renderPlace: ["dropSearch_Lop_PV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_PV").val("").trigger("change");
    },
    
    getList_SinhVien_PhamVi: function (pageIndex) {
        var me = this;
        
        if (!pageIndex) pageIndex = 1;
        
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_SinhVien_PV'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_PV'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_PV'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_PV'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_PV'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id || '',
            'pageIndex': pageIndex,
            'pageSize': 20,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data || [];
                    var iPager = data.Pager || 0;
                    me.genTable_SinhVien_PhamVi(dtResult, iPager, pageIndex);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    
    genTable_SinhVien_PhamVi: function (data, iPager, currentPage) {
        var me = this;
        
        $("#lblSinhVien_Tong").html(iPager);
        $("#tblSinhVien_PhamVi tbody").html("");
        
        if (data.length == 0) {
            $("#tblSinhVien_PhamVi tbody").html('<tr><td colspan="9" class="text-center">Không tìm thấy sinh viên nào</td></tr>');
            return;
        }
        
        for (var i = 0; i < data.length; i++) {
            var stt = (currentPage - 1) * 20 + i + 1;
            var html = "";
            html += "<tr class='row-sinhvien' style='cursor: pointer;'>";
            html += "<td class='td-center'>" + stt + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].MASO) + "</td>";
            html += "<td class='td-left'>" + edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN) + "</td>";
            html += "<td class='td-left'>" + edu.util.returnEmpty(data[i].TTLL_EMAILCANHAN) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].LOP) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].KHOADAOTAO) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].HEDAOTAO) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_TRANGTHAI) + "</td>";
            html += "<td class='td-center'><input type='checkbox' class='chkSinhVien_Item' data-id='" + data[i].ID + "' data-email='" + (data[i].TTLL_EMAILCANHAN || '') + "' /></td>";
            html += "</tr>";
            $("#tblSinhVien_PhamVi tbody").append(html);
        }
        
        // Thêm phân trang với ellipsis
        if (iPager > 20) {
            var paginationHtml = '<tr><td colspan="9" class="text-center">';
            paginationHtml += '<div class="pagination-wrapper" style="margin: 10px 0;">';
            var totalPages = Math.ceil(iPager / 20);
            
            // Nút Previous
            if (currentPage > 1) {
                paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="' + (currentPage - 1) + '" title="Trang trước"><i class="fa fa-chevron-left"></i></a> ';
            }
            
            // Logic hiển thị trang với ellipsis
            var startPage = 1;
            var endPage = totalPages;
            var maxPagesToShow = 7; // Số trang tối đa hiển thị
            
            if (totalPages > maxPagesToShow) {
                if (currentPage <= 4) {
                    // Đầu danh sách: 1 2 3 4 5 ... 100
                    endPage = 5;
                    for (var p = startPage; p <= endPage; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSinhVien_PV" data-page="' + p + '">' + p + '</a> ';
                    }
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="' + totalPages + '">' + totalPages + '</a> ';
                }
                else if (currentPage >= totalPages - 3) {
                    // Cuối danh sách: 1 ... 96 97 98 99 100
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="1">1</a> ';
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    startPage = totalPages - 4;
                    for (var p = startPage; p <= totalPages; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSinhVien_PV" data-page="' + p + '">' + p + '</a> ';
                    }
                }
                else {
                    // Giữa danh sách: 1 ... 48 49 50 51 52 ... 100
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="1">1</a> ';
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    
                    startPage = currentPage - 2;
                    endPage = currentPage + 2;
                    for (var p = startPage; p <= endPage; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSinhVien_PV" data-page="' + p + '">' + p + '</a> ';
                    }
                    
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="' + totalPages + '">' + totalPages + '</a> ';
                }
            }
            else {
                // Ít trang: Hiển thị tất cả
                for (var p = 1; p <= totalPages; p++) {
                    var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSinhVien_PV" data-page="' + p + '">' + p + '</a> ';
                }
            }
            
            // Nút Next
            if (currentPage < totalPages) {
                paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSinhVien_PV" data-page="' + (currentPage + 1) + '" title="Trang sau"><i class="fa fa-chevron-right"></i></a> ';
            }
            
            paginationHtml += '</div></td></tr>';
            $("#tblSinhVien_PhamVi tbody").append(paginationHtml);
        }
    },
    
    sendEmail_ToSelectedSinhVien: function (arrSinhVienIds) {
        var me = this;
        
        // Lấy thông tin sinh viên đã chọn
        var dsSinhVien = [];
        $(".chkSinhVien_Item:checked").each(function () {
            var email = $(this).data('email');
            if (email) {
                dsSinhVien.push({
                    ID: $(this).data('id'),
                    TTLL_EMAILCANHAN: email
                });
            }
        });
        
        if (dsSinhVien.length == 0) {
            edu.system.alert("Không có sinh viên nào có email để gửi!");
            return;
        }
        
        // Hiển thị progress
        edu.system.alert('<div id="zoneEmailProgress"><p>Đang gửi email đến ' + dsSinhVien.length + ' sinh viên...</p><div id="progressBarEmail"></div></div>');
        edu.system.genHTML_Progress("progressBarEmail", dsSinhVien.length);
        
        // Gửi email batch
        me.sendEmail_Batch_Selected(dsSinhVien, 0);
    },
    
    sendEmail_Batch_Selected: function (dsSinhVien, index) {
        var me = this;
        
        if (index >= dsSinhVien.length) {
            edu.system.alert("Đã gửi email thành công đến " + dsSinhVien.length + " sinh viên!");
            return;
        }
        
        var sinhVien = dsSinhVien[index];
        
        // Lấy thông tin tin tức
        var tinTucData = me.tinTucData;
        if (!tinTucData) {
            edu.system.alert("Không tìm thấy thông tin tin tức!");
            return;
        }
        
        // Tạo nội dung email đơn giản
        var mailSubject = "[THÔNG BÁO] " + tinTucData.TIEUDE;
        var strBody = '<html><body>';
        strBody += '<h2>THÔNG BÁO TIN TỨC</h2>';
        strBody += '<h3>' + tinTucData.TIEUDE + '</h3>';
        strBody += '<div>' + tinTucData.NOIDUNG + '</div>';
        strBody += '<p>Trân trọng!</p>';
        strBody += '</body></html>';
        
        var obj_send = {
            'action': 'CMS_NguoiDung/SendEmail',
            'type': 'POST',
            'mailTo': sinhVien.TTLL_EMAILCANHAN,
            'mailSubject': mailSubject,
            'strBody': strBody,
            'arrFileDinhKem': [],
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("Đã gửi email đến: " + sinhVien.TTLL_EMAILCANHAN);
                } else {
                    console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + data.Message);
                }
            },
            error: function (er) {
                console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + JSON.stringify(er));
            },
            complete: function () {
                // Cập nhật progress và gửi tiếp
                edu.system.start_Progress("progressBarEmail", function () {
                    me.sendEmail_Batch_Selected(dsSinhVien, index + 1);
                });
            },
            type: 'POST',
            action: obj_send.action,
            contentType: true,
            data: obj_send,
            fakedb: []
        }, false, false, false, null);
    },
    
    /*----------------------------------------------
    --Discription: [5] Import Excel để chọn sinh viên
    --ULR:  Modules
    ----------------------------------------------*/
    importExcelData: null, // Lưu data từ Excel
    dragDropInitialized: false, // Flag để chỉ setup drag & drop một lần
    importMode: 'phamvi', // 'phamvi' hoặc 'sendEmail' - để biết đang import cho modal nào
    
    openImportModal: function () {
        var me = this;
        $("#modalImportExcel_SinhVien").modal("show");
        $("#fileImportExcel_SinhVien").val("");
        $("#selectedFileName").html("");
        $("#importResult").hide();
        
        // Reset drop zone style
        $("#dropZone_ImportExcel").css({
            'border-color': '#ccc',
            'background-color': '#f9f9f9'
        });
        
        // Setup drag & drop chỉ một lần
        if (!me.dragDropInitialized) {
            me.setupDragDrop();
            me.dragDropInitialized = true;
        }
    },
    
    setupDragDrop: function() {
        var me = this;
        var dropZone = document.getElementById('dropZone_ImportExcel');
        var fileInput = document.getElementById('fileImportExcel_SinhVien');
        
        if (!dropZone || !fileInput) {
            console.log("Drop zone or file input not found");
            return;
        }
        
        // Click vào drop zone để mở file dialog
        dropZone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Khi chọn file từ dialog
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files.length > 0) {
                $("#selectedFileName").html('<i class="fa fa-file-excel-o"></i> ' + this.files[0].name);
            }
        });
        
        // Prevent default drag behaviors
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone khi drag over
        ['dragenter', 'dragover'].forEach(function(eventName) {
            dropZone.addEventListener(eventName, function() {
                $(dropZone).css({
                    'border-color': '#0066cc',
                    'background-color': '#e6f2ff'
                });
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(function(eventName) {
            dropZone.addEventListener(eventName, function() {
                $(dropZone).css({
                    'border-color': '#ccc',
                    'background-color': '#f9f9f9'
                });
            }, false);
        });
        
        // Handle dropped files - CHỈ hiển thị tên file, KHÔNG tự động xử lý
        dropZone.addEventListener('drop', function(e) {
            var dt = e.dataTransfer;
            var files = dt.files;
            
            if (files && files.length > 0) {
                // Gán file vào input
                fileInput.files = files;
                $("#selectedFileName").html('<i class="fa fa-file-excel-o"></i> ' + files[0].name);
                
                // Hiển thị thông báo
                $("#importResult").removeClass("alert-danger alert-success").addClass("alert-info")
                    .html("Đã chọn file: <strong>" + files[0].name + "</strong>. Click nút 'Xử lý Import' để tiếp tục.").show();
            }
        }, false);
    },
    
    downloadTemplate: function () {
        // Kiểm tra thư viện XLSX đã load chưa
        if (typeof XLSX === 'undefined') {
            alert("Lỗi: Thư viện XLSX chưa được load. Vui lòng tải lại trang!");
            return;
        }
        
        // Tạo file Excel mẫu (.xlsx) thay vì CSV
        var wb = XLSX.utils.book_new();
        
        // Tạo data mẫu
        var ws_data = [
            ["MaSV", "Email", "HoTen"],
            ["20233195", "20233195@eaut.edu.vn", "Nguyen Van A"],
            ["20233196", "20233196@eaut.edu.vn", "Tran Thi B"],
            ["20233197", "20233197@eaut.edu.vn", "Le Van C"]
        ];
        
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Thêm sheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, "DanhSachSinhVien");
        
        // Tải file
        XLSX.writeFile(wb, "MauImportSinhVien.xlsx");
    },
    
    processImportExcel: function () {
        var me = this;
        
        // Kiểm tra thư viện XLSX đã load chưa
        if (typeof XLSX === 'undefined') {
            $("#importResult").removeClass("alert-success alert-warning").addClass("alert-danger")
                .html("Lỗi: Thư viện XLSX chưa được load. Vui lòng tải lại trang!").show();
            return;
        }
        
        var fileInput = document.getElementById('fileImportExcel_SinhVien');
        
        if (!fileInput.files || fileInput.files.length === 0) {
            $("#importResult").removeClass("alert-success alert-danger").addClass("alert-warning").html("Vui lòng chọn file Excel hoặc CSV!").show();
            return;
        }
        
        var file = fileInput.files[0];
        var fileName = file.name.toLowerCase();
        
        // Kiểm tra định dạng file
        if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
            $("#importResult").removeClass("alert-success alert-warning").addClass("alert-danger").html("Chỉ hỗ trợ file .xlsx, .xls hoặc .csv!").show();
            return;
        }
        
        var reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                var data, workbook, jsonData;
                
                if (fileName.endsWith('.csv')) {
                    // Xử lý file CSV
                    var csvText = e.target.result;
                    workbook = XLSX.read(csvText, {type: 'string'});
                    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    jsonData = XLSX.utils.sheet_to_json(firstSheet);
                } else {
                    // Xử lý file Excel
                    data = new Uint8Array(e.target.result);
                    workbook = XLSX.read(data, {type: 'array'});
                    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    jsonData = XLSX.utils.sheet_to_json(firstSheet);
                }
                
                if (jsonData.length === 0) {
                    $("#importResult").removeClass("alert-success alert-warning").addClass("alert-danger").html("File không có dữ liệu!").show();
                    return;
                }
                
                // Lưu data
                me.importExcelData = jsonData;
                
                // Xử lý check sinh viên
                me.autoCheckSinhVienFromExcel(jsonData);
                
            } catch (error) {
                $("#importResult").removeClass("alert-success alert-warning").addClass("alert-danger").html("Lỗi đọc file: " + error.message).show();
            }
        };
        
        // Đọc file theo định dạng
        if (fileName.endsWith('.csv')) {
            reader.readAsText(file, 'UTF-8');
        } else {
            reader.readAsArrayBuffer(file);
        }
    },
    
    autoCheckSinhVienFromExcel: function (excelData) {
        var me = this;
        
        // Xác định đang ở modal nào
        var checkboxClass = me.importMode === 'sendEmail' ? '.chkSendEmail_Item' : '.chkSinhVien_Item';
        
        // Uncheck tất cả trước
        $(checkboxClass).prop("checked", false);
        
        var countChecked = 0;
        var countNotFound = 0;
        var notFoundList = [];
        
        // Duyệt qua từng dòng trong Excel
        for (var i = 0; i < excelData.length; i++) {
            var row = excelData[i];
            var email = row.Email || row.email || row.EMAIL || "";
            var maSV = row.MaSV || row.masv || row.MASV || row.MaSv || "";
            
            var found = false;
            
            // Tìm và check sinh viên trong bảng
            $(checkboxClass).each(function() {
                var checkbox = $(this);
                var checkboxEmail = checkbox.data("email") || "";
                var checkboxMaSV = checkbox.closest("tr").find("td:eq(1)").text().trim(); // Cột Mã SV
                
                // So sánh Email hoặc Mã SV
                if ((email && checkboxEmail.toLowerCase() === email.toLowerCase()) ||
                    (maSV && checkboxMaSV === maSV)) {
                    checkbox.prop("checked", true);
                    found = true;
                    countChecked++;
                    return false; // break
                }
            });
            
            if (!found) {
                countNotFound++;
                notFoundList.push(email || maSV);
            }
        }
        
        // Hiển thị kết quả
        var resultHtml = "<strong>Kết quả Import:</strong><br>";
        resultHtml += "- Đã check: <strong class='text-success'>" + countChecked + "</strong> sinh viên<br>";
        
        if (countNotFound > 0) {
            resultHtml += "- Không tìm thấy: <strong class='text-danger'>" + countNotFound + "</strong> sinh viên<br>";
            resultHtml += "<small>Danh sách không tìm thấy: " + notFoundList.slice(0, 5).join(", ");
            if (notFoundList.length > 5) {
                resultHtml += " và " + (notFoundList.length - 5) + " sinh viên khác...";
            }
            resultHtml += "</small>";
        }
        
        $("#importResult").removeClass("alert-warning alert-danger alert-info").addClass("alert-success").html(resultHtml).show();
        
        // Cập nhật số lượng đã chọn nếu đang ở modal Send Email
        if (me.importMode === 'sendEmail') {
            me.updateSoLuongDaChon_SendEmail();
        }
        
        // Tự động đóng modal sau 2 giây nếu xử lý thành công
        setTimeout(function() {
            $("#modalImportExcel_SinhVien").modal("hide");
        }, 2000);
    },
    
    /*----------------------------------------------
    --Discription: [6] Modal Gửi Email
    --ULR:  Modules
    ----------------------------------------------*/
    toggle_sendemail: function () {
        var me = this;
        // Hiển thị thông tin tin tức
        if (me.tinTucData) {
            $("#lblEmailTieuDe").html(me.tinTucData.TIEUDE || '');
            $("#lblEmailChuyenMuc").html(me.tinTucData.CHUYENMUC_TEN || '');
            $("#lblEmailNgayDang").html(me.tinTucData.NGAYBATDAU || '');
        }
        $("#lblSoLuongSinhVien").html("0");
        $("#tblSendEmail_SinhVien tbody").html('<tr><td colspan="9" class="text-center">Vui lòng chọn bộ lọc và click "Tìm kiếm"</td></tr>');
        edu.util.toggle_overide("zone-bus", "zoneSendEmail");
        // Tự động load danh sách sinh viên
        me.getList_SinhVien_SendEmail(1);
    },
    
    getList_HeDaoTao_SendEmail: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao_SendEmail);
    },
    
    getList_KhoaDaoTao_SendEmail: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSendEmail_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao_SendEmail);
    },
    
    getList_ChuongTrinhDaoTao_SendEmail: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSendEmail_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao_SendEmail);
    },
    
    getList_LopQuanLy_SendEmail: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSendEmail_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSendEmail_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSendEmail_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy_SendEmail);
    },
    
    cbGenCombo_HeDaoTao_SendEmail: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSendEmail_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSendEmail_HeDaoTao").val("").trigger("change");
    },
    
    cbGenCombo_KhoaDaoTao_SendEmail: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSendEmail_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSendEmail_KhoaDaoTao").val("").trigger("change");
    },
    
    cbGenCombo_ChuongTrinhDaoTao_SendEmail: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSendEmail_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSendEmail_ChuongTrinh").val("").trigger("change");
    },
    
    cbGenCombo_LopQuanLy_SendEmail: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSendEmail_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSendEmail_Lop").val("").trigger("change");
    },
    
    getList_SinhVien_SendEmail: function (pageIndex) {
        var me = this;
        
        if (!pageIndex) pageIndex = 1;
        
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSendEmail_Search'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSendEmail_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSendEmail_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSendEmail_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSendEmail_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id || '',
            'pageIndex': pageIndex,
            'pageSize': 20,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data || [];
                    var iPager = data.Pager || 0;
                    me.genTable_SinhVien_SendEmail(dtResult, iPager, pageIndex);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    
    genTable_SinhVien_SendEmail: function (data, iPager, currentPage) {
        var me = this;
        
        $("#tblSendEmail_SinhVien tbody").html("");
        
        if (data.length == 0) {
            $("#tblSendEmail_SinhVien tbody").html('<tr><td colspan="9" class="text-center">Không tìm thấy sinh viên nào</td></tr>');
            $("#lblSoLuongSinhVien").html("0");
            return;
        }
        
        for (var i = 0; i < data.length; i++) {
            var stt = (currentPage - 1) * 20 + i + 1;
            var html = "";
            html += "<tr class='row-sinhvien' style='cursor: pointer;'>";
            html += "<td class='td-center'>" + stt + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].MASO) + "</td>";
            html += "<td class='td-left'>" + edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN) + "</td>";
            html += "<td class='td-left'>" + edu.util.returnEmpty(data[i].TTLL_EMAILCANHAN) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].LOP) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].KHOADAOTAO) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].HEDAOTAO) + "</td>";
            html += "<td class='td-center'>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_TRANGTHAI) + "</td>";
            html += "<td class='td-center'><input type='checkbox' class='chkSendEmail_Item' data-id='" + data[i].ID + "' data-email='" + (data[i].TTLL_EMAILCANHAN || '') + "' data-maso='" + (data[i].MASO || '') + "' /></td>";
            html += "</tr>";
            $("#tblSendEmail_SinhVien tbody").append(html);
        }
        
        // Thêm phân trang
        if (iPager > 20) {
            var paginationHtml = '<tr><td colspan="9" class="text-center">';
            paginationHtml += '<div class="pagination-wrapper" style="margin: 10px 0;">';
            var totalPages = Math.ceil(iPager / 20);
            
            if (currentPage > 1) {
                paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="' + (currentPage - 1) + '" title="Trang trước"><i class="fa fa-chevron-left"></i></a> ';
            }
            
            var startPage = 1;
            var endPage = totalPages;
            var maxPagesToShow = 7;
            
            if (totalPages > maxPagesToShow) {
                if (currentPage <= 4) {
                    endPage = 5;
                    for (var p = startPage; p <= endPage; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSendEmail" data-page="' + p + '">' + p + '</a> ';
                    }
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="' + totalPages + '">' + totalPages + '</a> ';
                }
                else if (currentPage >= totalPages - 3) {
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="1">1</a> ';
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    startPage = totalPages - 4;
                    for (var p = startPage; p <= totalPages; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSendEmail" data-page="' + p + '">' + p + '</a> ';
                    }
                }
                else {
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="1">1</a> ';
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    
                    startPage = currentPage - 2;
                    endPage = currentPage + 2;
                    for (var p = startPage; p <= endPage; p++) {
                        var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                        paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSendEmail" data-page="' + p + '">' + p + '</a> ';
                    }
                    
                    paginationHtml += '<span class="btn btn-sm btn-default disabled">...</span> ';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="' + totalPages + '">' + totalPages + '</a> ';
                }
            }
            else {
                for (var p = 1; p <= totalPages; p++) {
                    var activeClass = (p == currentPage) ? 'btn-primary' : 'btn-default';
                    paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm ' + activeClass + ' btnPageSendEmail" data-page="' + p + '">' + p + '</a> ';
                }
            }
            
            if (currentPage < totalPages) {
                paginationHtml += '<a href="javascript:void(0)" class="btn btn-sm btn-default btnPageSendEmail" data-page="' + (currentPage + 1) + '" title="Trang sau"><i class="fa fa-chevron-right"></i></a> ';
            }
            
            paginationHtml += '</div></td></tr>';
            $("#tblSendEmail_SinhVien tbody").append(paginationHtml);
        }
        
        // Cập nhật số lượng đã chọn
        me.updateSoLuongDaChon_SendEmail();
    },
    
    updateSoLuongDaChon_SendEmail: function () {
        var count = $(".chkSendEmail_Item:checked").length;
        $("#lblSoLuongSinhVien").html(count);
    },
    
    openImportModal_SendEmail: function () {
        // Sử dụng lại modal import Excel hiện tại
        // Nhưng cần phân biệt là import cho modal nào
        this.importMode = 'sendEmail'; // Flag để biết đang import cho modal nào
        this.openImportModal();
    },
    
    processSendEmail_ToSelected: function (arrSinhVienIds) {
        var me = this;
        
        // Lấy thông tin sinh viên đã chọn
        var dsSinhVien = [];
        $(".chkSendEmail_Item:checked").each(function () {
            var email = $(this).data('email');
            if (email) {
                dsSinhVien.push({
                    ID: $(this).data('id'),
                    TTLL_EMAILCANHAN: email,
                    MASO: $(this).data('maso')
                });
            }
        });
        
        if (dsSinhVien.length == 0) {
            edu.system.alert("Không có sinh viên nào có email để gửi!");
            return;
        }
        
        // Hiển thị progress
        edu.system.alert('<div id="zoneEmailProgress"><p>Đang gửi email đến ' + dsSinhVien.length + ' sinh viên...</p><div id="progressBarEmail"></div></div>');
        edu.system.genHTML_Progress("progressBarEmail", dsSinhVien.length);
        
        // Gửi email batch
        me.sendEmail_Batch_Selected(dsSinhVien, 0);
    },
    
    countSinhVien_SendEmail: function () {
        // Hàm này không cần nữa vì đã có danh sách sinh viên
        // Giữ lại để tương thích với code cũ
    },
    
    processSendEmail_ToFiltered: function () {
        // Hàm này không cần nữa vì đã có danh sách sinh viên
        // Giữ lại để tương thích với code cũ
    },
    
    sendEmail_Batch_Filtered: function (dsSinhVien, index) {
        var me = this;
        
        if (index >= dsSinhVien.length) {
            edu.system.alert("Đã gửi email thành công đến " + dsSinhVien.length + " sinh viên!");
            // Đóng modal Send Email
            me.toggle_form();
            return;
        }
        
        var sinhVien = dsSinhVien[index];
        
        // Kiểm tra email
        if (!sinhVien.TTLL_EMAILCANHAN) {
            // Bỏ qua sinh viên không có email
            edu.system.start_Progress("progressBarEmail", function () {
                me.sendEmail_Batch_Filtered(dsSinhVien, index + 1);
            });
            return;
        }
        
        // Lấy thông tin tin tức
        var tinTucData = me.tinTucData;
        if (!tinTucData) {
            edu.system.alert("Không tìm thấy thông tin tin tức!");
            return;
        }
        
        // Tạo nội dung email
        var mailSubject = "[THÔNG BÁO] " + tinTucData.TIEUDE;
        var strBody = me.createEmailTemplate(sinhVien, tinTucData);
        
        var obj_send = {
            'action': 'CMS_NguoiDung/SendEmail',
            'type': 'POST',
            'mailTo': sinhVien.TTLL_EMAILCANHAN,
            'mailSubject': mailSubject,
            'strBody': strBody,
            'arrFileDinhKem': [],
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("Đã gửi email đến: " + sinhVien.TTLL_EMAILCANHAN);
                } else {
                    console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + data.Message);
                }
            },
            error: function (er) {
                console.log("Lỗi gửi email đến " + sinhVien.TTLL_EMAILCANHAN + ": " + JSON.stringify(er));
            },
            complete: function () {
                // Cập nhật progress và gửi tiếp
                edu.system.start_Progress("progressBarEmail", function () {
                    me.sendEmail_Batch_Filtered(dsSinhVien, index + 1);
                });
            },
            type: 'POST',
            action: obj_send.action,
            contentType: true,
            data: obj_send,
            fakedb: []
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Discription: [7] Quản lý Chuyên mục tin tức (thêm/sửa/xóa danh mục TINTUC.CHUYENMUC)
    ----------------------------------------------*/
    openQuickAdd_ChuyenMuc: function () {
        var me = this;
        me.resetForm_QuickAdd_ChuyenMuc();
        $("#modalQuickAdd_ChuyenMuc").modal("show");

        // lazy load ID bảng TINTUC.CHUYENMUC (chỉ gọi 1 lần rồi cache), sau đó load danh sách
        if (!me.strChuyenMuc_TenBangId) {
            me.getTenBangId_ChuyenMuc(function () {
                me.getList_QuickAdd_ChuyenMuc();
            });
        } else {
            me.getList_QuickAdd_ChuyenMuc();
        }
    },

    getTenBangId_ChuyenMuc: function (callback) {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && edu.util.checkValue(data.Data)) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var row = data.Data[i];
                        var maField = row.MADANHMUC || row.MA || '';
                        if (String(maField).toUpperCase() === 'TINTUC.CHUYENMUC') {
                            me.strChuyenMuc_TenBangId = row.ID;
                            break;
                        }
                    }
                    if (!me.strChuyenMuc_TenBangId) {
                        edu.system.alert("Chưa khai báo bảng danh mục TINTUC.CHUYENMUC trong hệ thống. Vui lòng vào Danh mục dữ liệu để tạo trước!", "w");
                        return;
                    }
                    if (typeof callback === 'function') callback();
                }
                else {
                    edu.system.alert("Không lấy được thông tin bảng danh mục: " + (data.Message || ""), "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi lấy ID bảng danh mục: " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucTenBang/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': 'TINTUC.CHUYENMUC',
                'strChung_TenDanhMuc_Cha_Id': '',
                'strNhomDanhMuc_Id': '',
                'pageIndex': 1,
                'pageSize': 20,
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    getList_QuickAdd_ChuyenMuc: function () {
        var me = this;
        if (!me.strChuyenMuc_TenBangId) {
            me.getTenBangId_ChuyenMuc(function () { me.getList_QuickAdd_ChuyenMuc(); });
            return;
        }
        $("#tblQuickAdd_ChuyenMuc tbody").html('<tr><td colspan="6" class="text-center" style="padding:20px;color:#999;"><i class="fa fa-spinner fa-spin"></i> Đang tải...</td></tr>');

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtChuyenMuc_QuickAdd = dtResult;
                    me.genTable_QuickAdd_ChuyenMuc(dtResult);
                }
                else {
                    edu.system.alert("Lỗi lấy danh sách: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi lấy danh sách chuyên mục: " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucDuLieu/LayDanhSach',
            contentType: true,
            data: {
                'strCha_Id': '',
                'strTuKhoa': '',
                'strCHUNG_TENDANHMUC_Id': me.strChuyenMuc_TenBangId,
                'strTieuChiSapXep': '',
                'pageIndex': 1,
                'pageSize': 1000,
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    genTable_QuickAdd_ChuyenMuc: function (data) {
        var $tbody = $("#tblQuickAdd_ChuyenMuc tbody");
        $tbody.html("");
        $("#lblQuickAdd_ChuyenMuc_Tong").html(data.length);

        if (!data.length) {
            $tbody.html('<tr><td colspan="6" class="text-center" style="padding:20px;color:#999;">Chưa có chuyên mục nào. Nhập thông tin bên dưới để tạo mới.</td></tr>');
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var strId = edu.util.returnEmpty(row.ID);
            var strMa = edu.util.returnEmpty(row.MA);
            var strTen = edu.util.returnEmpty(row.TEN);
            var strMoTa = edu.util.returnEmpty(row.MOTA);
            var tenEsc = String(strTen).replace(/"/g, '&quot;');
            var html = "";
            html += "<tr>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td><code>" + strMa + "</code></td>";
            html += "<td>" + strTen + "</td>";
            html += "<td style='color:#666;'>" + strMoTa + "</td>";
            html += "<td class='td-center'><a class='btn btn-xs btn-info btnQuickAdd_ChuyenMuc_Edit' data-id='" + strId + "' title='Sửa'><i class='fa fa-edit'></i></a></td>";
            html += "<td class='td-center'><a class='btn btn-xs btn-danger btnQuickAdd_ChuyenMuc_Delete' data-id='" + strId + "' data-ten=\"" + tenEsc + "\" title='Xóa'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            $tbody.append(html);
        }
    },

    editRow_QuickAdd_ChuyenMuc: function (strId) {
        var me = this;
        var row = null;
        for (var i = 0; i < me.dtChuyenMuc_QuickAdd.length; i++) {
            if (me.dtChuyenMuc_QuickAdd[i].ID === strId) {
                row = me.dtChuyenMuc_QuickAdd[i];
                break;
            }
        }
        if (!row) {
            edu.system.alert("Không tìm thấy chuyên mục để sửa!", "w");
            return;
        }
        $("#txtQuickAdd_ChuyenMuc_Id").val(row.ID);
        $("#txtQuickAdd_ChuyenMuc_Ma").val(edu.util.returnEmpty(row.MA));
        $("#txtQuickAdd_ChuyenMuc_Ten").val(edu.util.returnEmpty(row.TEN));
        $("#txtQuickAdd_ChuyenMuc_MoTa").val(edu.util.returnEmpty(row.MOTA));
        $("#lblQuickAdd_ChuyenMuc_FormTitle").html("Đang sửa: " + edu.util.returnEmpty(row.TEN));
        $("#lblQuickAdd_ChuyenMuc_BtnSave").html("Cập nhật");
        // scroll form vào tầm nhìn
        $("#modalQuickAdd_ChuyenMuc .modal-body").animate({ scrollTop: $("#modalQuickAdd_ChuyenMuc .modal-body")[0].scrollHeight }, 300);
        $("#txtQuickAdd_ChuyenMuc_Ten").focus();
    },

    resetForm_QuickAdd_ChuyenMuc: function () {
        $("#txtQuickAdd_ChuyenMuc_Id").val("");
        $("#txtQuickAdd_ChuyenMuc_Ma").val("");
        $("#txtQuickAdd_ChuyenMuc_Ten").val("");
        $("#txtQuickAdd_ChuyenMuc_MoTa").val("");
        $("#lblQuickAdd_ChuyenMuc_FormTitle").html("Thêm chuyên mục mới");
        $("#lblQuickAdd_ChuyenMuc_BtnSave").html("Thêm mới");
    },

    deleteRow_QuickAdd_ChuyenMuc: function (strId, strTen) {
        var me = this;
        edu.system.confirm("Bạn có chắc chắn muốn xóa chuyên mục \"" + strTen + "\"?");
        $("#btnYes").off('click').on('click', function () {
            $('#myModalAlert').modal('hide');
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Đã xóa chuyên mục!");
                        me.getList_QuickAdd_ChuyenMuc();
                        // nếu đang sửa đúng bản ghi vừa xóa → reset form
                        if ($("#txtQuickAdd_ChuyenMuc_Id").val() === strId) {
                            me.resetForm_QuickAdd_ChuyenMuc();
                        }
                        // reload combo bên form tin tức
                        edu.system.loadToCombo_DanhMucDuLieu("TINTUC.CHUYENMUC", "dropSearch_ChuyenMuc,dropChuyenMuc");
                    }
                    else {
                        edu.system.alert("Lỗi xóa: " + data.Message, "w");
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi xóa chuyên mục: " + JSON.stringify(er), "w");
                },
                type: 'POST',
                action: 'CMS_DanhMucDuLieu/Xoa',
                contentType: true,
                data: {
                    'strId': strId,
                    'strNguoiThucHien_Id': edu.system.userId,
                    'dTrangThai': 1
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    saveQuickAdd_ChuyenMuc: function () {
        var me = this;
        var strId = $.trim($("#txtQuickAdd_ChuyenMuc_Id").val());
        var strMa = $.trim($("#txtQuickAdd_ChuyenMuc_Ma").val());
        var strTen = $.trim($("#txtQuickAdd_ChuyenMuc_Ten").val());
        var strMoTa = $.trim($("#txtQuickAdd_ChuyenMuc_MoTa").val());

        if (!strMa) {
            edu.system.alert("Vui lòng nhập Mã!");
            $("#txtQuickAdd_ChuyenMuc_Ma").focus();
            return;
        }
        if (!strTen) {
            edu.system.alert("Vui lòng nhập Tên!");
            $("#txtQuickAdd_ChuyenMuc_Ten").focus();
            return;
        }
        if (!me.strChuyenMuc_TenBangId) {
            edu.system.alert("Chưa xác định được bảng danh mục TINTUC.CHUYENMUC. Vui lòng thử lại!", "w");
            me.getTenBangId_ChuyenMuc();
            return;
        }

        var isUpdate = !!strId;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var savedId = isUpdate ? strId : (data.Id || data.ID || '');
                    edu.system.alert(isUpdate ? "Cập nhật chuyên mục thành công!" : "Thêm chuyên mục thành công!");
                    me.resetForm_QuickAdd_ChuyenMuc();
                    me.getList_QuickAdd_ChuyenMuc();
                    // reload cả 2 combo (search + form) và auto-select bản ghi vừa lưu ở form
                    edu.system.loadToCombo_DanhMucDuLieu(
                        "TINTUC.CHUYENMUC",
                        "dropSearch_ChuyenMuc,dropChuyenMuc",
                        "",
                        function () {
                            if (savedId) {
                                $("#dropChuyenMuc").val(savedId).trigger("change");
                            }
                        }
                    );
                }
                else {
                    edu.system.alert("Lỗi lưu chuyên mục: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi lưu chuyên mục: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: isUpdate ? 'CMS_DanhMucDuLieu/CapNhat' : 'CMS_DanhMucDuLieu/ThemMoi',
            contentType: true,
            data: {
                'strMa': strMa,
                'strTen': strTen,
                'strChung_TenDanhMuc_Cha_Id': '',
                'strCHUNG_TENDANHMUC_Id': me.strChuyenMuc_TenBangId,
                'dHeSo1': 0,
                'dHeSo2': 0,
                'dHeSo3': 0,
                'strThongTin1': '',
                'strThongTin2': '',
                'strThongTin3': '',
                'strThongTin4': '',
                'strThongTin5': '',
                'strThongTin6': '',
                'strThongTin7': '',
                'strThongTin8': '',
                'strMoTa': strMoTa,
                'strId': strId,
                'dTrangThai': 1,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    },
}
