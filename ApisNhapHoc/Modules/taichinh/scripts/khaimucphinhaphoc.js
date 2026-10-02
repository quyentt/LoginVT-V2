function KhaiMucPhi() { }
KhaiMucPhi.prototype = {

    /* --------- STATE --------- */
    strKeHoachNhapHoc_Id: '',       // KH đang được xem (từ dropdown)
    dtKeHoach: [],                  // danh sách kế hoạch nhập học
    dtNhomDinhMuc: [],              // danh sách nhóm định mức của KH đang xem
    dtDM_DonViTien: [],             // Cache DM đơn vị tính (TAICHINH.DVT)
    dtDM_KieuTuDong: [],            // Cache DM kiểu tự động sinh phải thu

    // State cho modal khoản thu (dùng khi Thêm mới khoản thu cần biết đang xem nhóm nào)
    strNhomId_KhoanThu: '',
    strKeHoachId_KhoanThu: '',
    dtKhoanThu: [],
    dtLoaiKhoan: [],                // danh sách khoản thu chung để chọn thêm
    dtCoSoDaoTao: [],               // danh sách cơ sở đào tạo (cache để lookup tên trong bảng)
    bLoadedCombo_KhoanThu: false,   // flag đã load combo lookup cho form khoản thu chưa

    // State cho modal ngành đầu ra
    strNhomId_NganhDauRa: '',
    strKeHoachId_NganhDauRa: '',
    dtNganhDauRa: [],
    dtKeHoachDauRa: [],             // danh sách chương trình đầu ra để chọn thêm
    _pageThemNganh: 1,              // trang hiện tại của bảng chọn ngành (client-side paging)
    _pageSizeThemNganh: 20,         // số dòng / trang
    _selectedIds_ThemNganh: {},     // Set ID đã tick — giữ state qua các trang
    _pageNganh: 1,                  // trang hiện tại của bảng ngành đã cấu hình
    _pageSizeNganh: 20,
    _selectedIds_Nganh: {},         // Set ID đã tick trong bảng ngành đã cấu hình

    /* Helper: lấy label "TEN (MA)" cho 1 nhóm theo ID — dùng cho title modal.
       Convention chung: modal đang xem phải chỉ rõ đang xem nhóm nào cả tên lẫn mã. */
    _getNhomLabel: function (strNhomId) {
        var me = this;
        if (!strNhomId) return '';
        var found = null;
        (me.dtNhomDinhMuc || []).some(function (r) {
            var id = r.ID || r.NH_CAUHINH_TC_NHOM_ID;
            if (id === strNhomId) { found = r; return true; }
            return false;
        });
        if (!found) return strNhomId;
        var ten = found.TEN_NHOM || found.TEN || '';
        var ma = found.MA_NHOM || found.MA || '';
        if (ten && ma) return ten + ' (' + ma + ')';
        return ten || ma || strNhomId;
    },

    /* Helper: format số VN cho tổng (giữ nguyên nếu không phải số) */
    _fmtNumVN: function (v) {
        if (v === '' || v == null || isNaN(v)) return '';
        return Number(v).toLocaleString('vi-VN');
    },

    /* Helper: gộp "TEN (MA)" — dùng cho ngành đào tạo / tuyển sinh / chương trình */
    _mergeTenMa: function (ten, ma) {
        ten = ten || ''; ma = ma || '';
        if (ten && ma) return ten + ' (' + ma + ')';
        return ten || ma;
    },

    /* Helper case-insensitive pick — match key bỏ qua hoa/thường/underscore/khoảng trắng.
       Dùng cho các field mà BE có thể trả về nhiều biến thể casing:
       'TongSoTienDaNop' matches 'TONG_SO_TIEN_DA_NOP', 'tongsotiendanop', 'Tong_SoTien_DaNop'... */
    _pickCI: function (row) {
        if (!row) return '';
        var normKeyMap = {};
        for (var k in row) {
            if (Object.prototype.hasOwnProperty.call(row, k)) {
                normKeyMap[String(k).toLowerCase().replace(/[_\-\s]/g, '')] = row[k];
            }
        }
        for (var i = 1; i < arguments.length; i++) {
            var target = String(arguments[i]).toLowerCase().replace(/[_\-\s]/g, '');
            var v = normKeyMap[target];
            if (v != null && v !== '') return v;
        }
        return '';
    },

    // State cho modal cấu hình đầu vào (SV/đối tượng)
    strNhomId_DauVao: '',
    strKeHoachId_DauVao: '',
    dtDauVao: [],
    bLoadedCombo_DoiTuong: false,   // flag đã load combo QLSV.DOITUONG chưa

    // State cho modal "Mức phí đã gán cho thí sinh"
    // Đổi từ server-side paging → load all + client-side filter/paging để hỗ trợ lọc range tổng phí.
    //   dtMucPhiDaGan_All   : raw toàn bộ rows từ API (chỉ đổi khi dropDaNhapHoc đổi hoặc reload)
    //   _filtered_MucPhiDaGan: sau khi apply filter keyword + tiền range
    //   dtMucPhiDaGan       : slice trang hiện tại (dùng để render)
    _pageIndex_MucPhiDaGan: 1,
    _pageSize_MucPhiDaGan: 50,
    _total_MucPhiDaGan: 0,
    dtMucPhiDaGan: [],
    dtMucPhiDaGan_All: [],
    _filtered_MucPhiDaGan: [],
    // Set ID (Core_Person_Intake_Id) đã tick — giữ qua các trang khi paging client-side
    _selectedIds_MucPhiDaGan: {},

    // State cho modal "Danh sách nhập học & thu tiền"
    // Chuyển sang load-all-once + client-side filter/paging (giống MucPhiDaGan)
    // để sum "toàn bộ" bản ghi không sai khi paging server-side (BE không trả aggregate).
    _pageIndex_DSNHTT: 1,
    _pageSize_DSNHTT: 50,
    _total_DSNHTT: 0,
    dtDSNHTT: [],              // slice trang hiện tại (để render)
    dtDSNHTT_All: [],          // raw toàn bộ từ API (chỉ fetch lại khi mở modal / refresh)
    _filtered_DSNHTT: [],      // sau khi apply filter keyword + tình trạng nhập học
    _sumTongPhaiNop_DSNHTT: 0, // sum trên _filtered_DSNHTT — hiển thị ở top row
    _sumDaNop_DSNHTT: 0,

    /* --------- INIT --------- */
    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        me.bindEvent();
    },

    page_load: function () {
        this.getList_KeHoachNhapHoc();
        this.preload_DMs();
        this.applyPreselect_FromSession();
    },

    /*
     * Handshake với trang 'Kế hoạch tuyển sinh (new)' bên module trungtuyen:
     * Khi user click Xem cột 'Khai mức phí' ở đó → set sessionStorage.KHTSN_preselect_KHNH_Id
     * rồi navigate sang đây. Ở đây poll đợi combo KHNH nạp xong → set giá trị + click Xem.
     */
    applyPreselect_FromSession: function () {
        var preselectId = sessionStorage.getItem('KHTSN_preselect_KHNH_Id');
        if (!preselectId) return;
        sessionStorage.removeItem('KHTSN_preselect_KHNH_Id');
        var tries = 0;
        var timer = setInterval(function () {
            tries++;
            var $drop = $("#dropKeHoachNhapHoc_HSNH");
            if ($drop.find('option[value="' + preselectId + '"]').length > 0) {
                clearInterval(timer);
                $drop.val(preselectId).trigger('change.select2');
                $("#btnXem_HSNH").trigger("click");
            } else if (tries > 25) { // ~5s
                clearInterval(timer);
            }
        }, 200);
    },

    /* Preload 2 DM để render tên trong bảng khoản thu (API list chỉ trả mã) */
    preload_DMs: function () {
        var me = this;
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "TAICHINH.DVT", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) { me.dtDM_DonViTien = data || []; }
        );
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NHAPHOC_CAUHINH_TC.KIEUTUDONG.PHAINOP", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) { me.dtDM_KieuTuDong = data || []; }
        );
    },

    bindEvent: function () {
        var me = this;

        // ============ Fix stacked modal z-index (BS3 không auto adjust) ============
        // ⚠ App dùng Bootstrap 3.3.7 (indexi.aspx:1332) → class visible là `.in`, KHÔNG phải `.show`.
        //   Selector `.modal.show` fail → count=0 → return sớm → bug: modal con bị backdrop đè.
        // ⚠ BASE = 10055 (KHÔNG phải 1050 default BS3) vì indexi.aspx reskin CSS ép
        //   .modal.in{z-index:10055!important} + .modal-backdrop.in{z-index:10050!important}.
        // Inline style.setProperty(...,'important') thắng CSS !important theo CSS spec → OK.
        $(document).off('shown.bs.modal.kmpStack').on('shown.bs.modal.kmpStack', '.modal', function () {
            var $this = $(this);
            var isAlert = $this.attr('id') === 'myModalAlert'
                       || $this.hasClass('modal-alert')
                       || $this.hasClass('modal-confirm');
            // BS3 dùng `.in`, BS5 dùng `.show` — match cả 2 cho tương thích ngược
            var $modals = $('.modal.in, .modal.show');
            var count = $modals.length;
            var zIndex;
            if (isAlert) {
                // Alert/confirm luôn trên cùng, bất kể level
                zIndex = 999999;
            } else if (count <= 1) {
                return; // modal đầu tiên, không cần fix (CSS reskin đã set 10055)
            } else {
                zIndex = 10055 + 30 * (count - 1);
            }
            $this[0].style.setProperty('z-index', zIndex, 'important');
            var $backdrops = $('.modal-backdrop');
            var $lastBackdrop = $backdrops.last();
            if ($lastBackdrop.length) {
                $lastBackdrop[0].style.setProperty('z-index', zIndex - 5, 'important');
            }
        });

        // Reload danh sách kế hoạch khi gõ từ khóa (debounce nhẹ)
        var tmoTuKhoa = null;
        $("#txtKeyword_HSNH").off("keyup").on("keyup", function () {
            clearTimeout(tmoTuKhoa);
            tmoTuKhoa = setTimeout(function () { me.getList_KeHoachNhapHoc(); }, 400);
        });

        // Nút Xem: load nhóm định mức theo KH đã chọn
        $("#btnXem_HSNH").off("click").on("click", function () {
            var strId = edu.util.getValById('dropKeHoachNhapHoc_HSNH');
            if (!strId) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học.", "w");
                return;
            }
            me.strKeHoachNhapHoc_Id = strId;
            me.getList_NhomDinhMuc();
        });

        // Auto-load danh sách nhóm khi user chọn Kế hoạch nhập học (không phải bấm Xem)
        $("#dropKeHoachNhapHoc_HSNH").off("change.autoLoad").on("change.autoLoad", function () {
            var strId = $(this).val();
            if (!strId) return;
            me.strKeHoachNhapHoc_Id = strId;
            me.getList_NhomDinhMuc();
        });

        // Nút Tải lại
        $("#btnRefresh_HSNH").off("click").on("click", function () {
            me.getList_KeHoachNhapHoc();
            if (me.strKeHoachNhapHoc_Id) me.getList_NhomDinhMuc();
        });

        // Nút Thêm nhóm — mở modal ở chế độ Thêm mới
        $("#btnAdd_NhomDinhMuc_HSNH").off("click").on("click", function () {
            if (!me.strKeHoachNhapHoc_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học và bấm Xem trước.", "w");
                return;
            }
            me.openModal_Nhom_Add();
        });

        // Nút "Tạo mức phí nhập học cho kế hoạch"
        // Luồng: lấy DS thí sinh của KH → duyệt tuần tự Gen_TaiChinh_PhaiNop_Intake
        $("#btnGenMucPhi_HSNH").off("click").on("click", function () {
            if (!me.strKeHoachNhapHoc_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học và bấm Xem trước.", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn tạo mức phí nhập học cho toàn bộ thí sinh của kế hoạch này?");
            $("#btnYes").off("click.genMucPhi").on("click.genMucPhi", function () {
                me.taoMucPhi_ChoKeHoach();
            });
        });

        // Nút "Xem mức phí đã gán cho thí sinh"
        $("#btnXemMucPhiDaGan_HSNH").off("click").on("click", function () {
            if (!me.strKeHoachNhapHoc_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học và bấm Xem trước.", "w");
                return;
            }
            me.openModal_MucPhiDaGan();
        });

        // ----- Modal "Danh sách nhập học & thu tiền" -----
        // Nút mở modal
        $("#btnDSNhapHocThuTien_HSNH").off("click").on("click", function () {
            if (!me.strKeHoachNhapHoc_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học và bấm Xem trước.", "w");
                return;
            }
            me.openModal_DSNHTT();
        });
        // Filter: nút Tìm — client-side (chỉ apply filter, không reload API)
        $("#btnLoc_DSNHTT_HSNH").off("click").on("click", function () {
            me._applyFilter_DSNHTT();
        });
        // Filter: keyword Enter/debounce — client-side
        var tmoKw_DSNHTT = null;
        $("#txtTuKhoa_DSNHTT_HSNH").off("keypress input").on("keypress", function (e) {
            if (e.which === 13) {
                e.preventDefault();
                clearTimeout(tmoKw_DSNHTT);
                me._applyFilter_DSNHTT();
            }
        }).on("input", function () {
            clearTimeout(tmoKw_DSNHTT);
            tmoKw_DSNHTT = setTimeout(function () { me._applyFilter_DSNHTT(); }, 300);
        });
        // Filter: đổi tình trạng nhập học — client-side
        $("#dropDaNhapHoc_DSNHTT_HSNH").off("change").on("change", function () {
            me._applyFilter_DSNHTT();
        });
        // Đổi page size — value="-1" nghĩa "Tất cả" → render lại slice, KHÔNG reload API
        $("#pgSize_DSNHTT").off("change").on("change", function () {
            var v = parseInt($(this).val(), 10);
            me._pageSize_DSNHTT = (v === -1) ? 999999 : (v || 50);
            me._pageIndex_DSNHTT = 1;
            me._renderCurrentPage_DSNHTT();
        });
        // Click page — client-side, chỉ re-slice
        $("#paging_DSNHTT_HSNH").off("click", ".page-link").on("click", ".page-link", function (e) {
            e.preventDefault();
            var t = parseInt($(this).attr("data-page"), 10);
            if (isNaN(t) || t < 1) return;
            me._pageIndex_DSNHTT = t;
            me._renderCurrentPage_DSNHTT();
        });
        // Nút Xuất Excel + Ctrl+G khi modal đang mở
        $("#btnXuatExcel_DSNHTT_HSNH").off("click").on("click", function (e) {
            if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
            me._xuatExcel_DSNHTT();
        });
        $(document).off('keydown.dsnhtt_export').on('keydown.dsnhtt_export', function (e) {
            var $m = $('#modalDSNHTT_HSNH');
            if (!$m.hasClass('in') && !$m.is(':visible')) return;
            if (/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) return;
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me._xuatExcel_DSNHTT();
            }
        });

        // Sync scroll-x giả trên đầu bảng ↔ scroll dưới
        var syncingDSNHTT = false;
        $("#scrollTop_DSNHTT_HSNH").off("scroll.dsnhtt").on("scroll.dsnhtt", function () {
            if (syncingDSNHTT) return;
            syncingDSNHTT = true;
            $("#scrollBottom_DSNHTT_HSNH").scrollLeft($(this).scrollLeft());
            syncingDSNHTT = false;
        });
        $("#scrollBottom_DSNHTT_HSNH").off("scroll.dsnhtt").on("scroll.dsnhtt", function () {
            if (syncingDSNHTT) return;
            syncingDSNHTT = true;
            $("#scrollTop_DSNHTT_HSNH").scrollLeft($(this).scrollLeft());
            syncingDSNHTT = false;
        });

        // Filter modal Mức phí đã gán
        // Sau khi chuyển sang load-all + client-side filter:
        //  - Keyword + range tổng phí: chỉ gọi _applyFilter_MucPhiDaGan (instant, không reload server)
        //  - dDaNhapHoc đổi: reload server (server-side param, không rõ field FE để lọc)
        //  - Đổi pgSize / click page: chỉ render lại slice, không reload
        $("#btnLoc_MucPhiDaGan_HSNH").off("click").on("click", function () {
            me._applyFilter_MucPhiDaGan();
        });
        var tmoKw_MPDG = null;
        $("#txtTuKhoa_MucPhiDaGan_HSNH").off("keypress input").on("keypress", function (e) {
            if (e.which === 13) {
                e.preventDefault();
                clearTimeout(tmoKw_MPDG);
                me._applyFilter_MucPhiDaGan();
            }
        }).on("input", function () {
            clearTimeout(tmoKw_MPDG);
            tmoKw_MPDG = setTimeout(function () { me._applyFilter_MucPhiDaGan(); }, 300);
        });
        $("#dropDaNhapHoc_MucPhiDaGan_HSNH").off("change").on("change", function () {
            me._pageIndex_MucPhiDaGan = 1;
            me.getList_MucPhiDaGan();
        });
        $("#pgSize_MucPhiDaGan").off("change").on("change", function () {
            var _v = parseInt($(this).val(), 10);
            me._pageSize_MucPhiDaGan = (_v === -1) ? 999999 : (_v || 50);
            me._pageIndex_MucPhiDaGan = 1;
            me._renderCurrentPage_MucPhiDaGan();
        });
        $("#paging_MucPhiDaGan_HSNH").off("click", ".page-link").on("click", ".page-link", function (e) {
            e.preventDefault();
            var t = parseInt($(this).attr("data-page"), 10);
            if (isNaN(t) || t < 1) return;
            me._pageIndex_MucPhiDaGan = t;
            me._renderCurrentPage_MucPhiDaGan();
        });
        // Filter range tổng phí — instant debounced + format thousand sep khi blur
        var tmoTien_MPDG = null;
        $("#txtTongTu_MucPhiDaGan_HSNH, #txtTongDen_MucPhiDaGan_HSNH")
            .off("input.locTien blur.locTien")
            .on("input.locTien", function () {
                clearTimeout(tmoTien_MPDG);
                tmoTien_MPDG = setTimeout(function () { me._applyFilter_MucPhiDaGan(); }, 300);
            })
            .on("blur.locTien", function () {
                var n = me._parseTien_MucPhi($(this).val());
                if (n === null) { $(this).val(''); return; }
                $(this).val(n.toLocaleString('vi-VN'));
            });
        $("#btnLocTien_MucPhiDaGan_HSNH").off("click").on("click", function () {
            clearTimeout(tmoTien_MPDG);
            me._applyFilter_MucPhiDaGan();
        });
        $("#btnResetTien_MucPhiDaGan_HSNH").off("click").on("click", function () {
            $("#txtTongTu_MucPhiDaGan_HSNH").val('');
            $("#txtTongDen_MucPhiDaGan_HSNH").val('');
            me._applyFilter_MucPhiDaGan();
        });

        // Nút Sửa cột Tổng phí → mở modal chi tiết PhaiNop
        $("#tblMucPhiDaGan_HSNH").off("click", ".btnSua_MucPhi_Row").on("click", ".btnSua_MucPhi_Row", function () {
            var strIntakeId = $(this).attr("data-id");
            var strHoTen = $(this).attr("data-hoten") || '';
            var strMa = $(this).attr("data-ma") || '';
            me.xem_ChiTiet_PhaiNop(strIntakeId, strHoTen, strMa);
        });

        // Sync scroll-x giả trên đầu bảng ↔ scroll dưới của bảng (bảng rộng 2200px)
        // Dùng flag `syncing` để tránh loop khi setScrollLeft trigger event.
        var syncingMPDG = false;
        $("#scrollTop_MucPhiDaGan_HSNH").off("scroll.mpdg").on("scroll.mpdg", function () {
            if (syncingMPDG) return;
            syncingMPDG = true;
            $("#scrollBottom_MucPhiDaGan_HSNH").scrollLeft($(this).scrollLeft());
            syncingMPDG = false;
        });
        $("#scrollBottom_MucPhiDaGan_HSNH").off("scroll.mpdg").on("scroll.mpdg", function () {
            if (syncingMPDG) return;
            syncingMPDG = true;
            $("#scrollTop_MucPhiDaGan_HSNH").scrollLeft($(this).scrollLeft());
            syncingMPDG = false;
        });

        // Nút Xuất excel: build từ _filtered_MucPhiDaGan (toàn bộ list đang lọc, không chỉ trang hiện tại)
        $("#btnXuatExcel_MucPhiDaGan_HSNH").off("click").on("click", function (e) {
            if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
            me._xuatExcel_MucPhiDaGan();
        });
        // Hotkey Ctrl+G (hoặc Cmd+G Mac) — chỉ trigger khi modal đang mở + focus không nằm ở input
        $(document).off('keydown.mpdg_export').on('keydown.mpdg_export', function (e) {
            var $m = $('#modalMucPhiDaGan_HSNH');
            if (!$m.hasClass('in') && !$m.is(':visible')) return;
            if (/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) return;
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me._xuatExcel_MucPhiDaGan();
            }
        });

        // Nút Lưu trong modal nhóm
        $("#btnSave_Nhom_HSNH").off("click").on("click", function () {
            me.save_Nhom();
        });

        // Nút Xóa trong modal nhóm
        $("#btnDelete_Nhom_HSNH").off("click").on("click", function () {
            me.delete_Nhom();
        });

        // ----- Modal Cấu hình khoản thu -----
        // Nút "+ Thêm mới khoản thu"
        $("#btnAdd_KhoanThu_HSNH").off("click").on("click", function () {
            if (!me.strNhomId_KhoanThu) {
                edu.system.alert("Không xác định được nhóm.", "w");
                return;
            }
            me.openModal_KhoanThu_Add();
        });

        // Nút "Chi tiết" từng khoản thu → mở modal Edit (dùng data đã có, chưa có API LayTT)
        $("#tblKhoanThu_HSNH")
            .off("click", ".lnkChiTiet_KhoanThu")
            .on("click", ".lnkChiTiet_KhoanThu", function () {
                var strId = $(this).attr("data-id");
                var row = (me.dtKhoanThu || []).find(function (x) {
                    return (x.ID || x.NH_CAUHINH_TC_ID) === strId;
                });
                if (!row) { edu.system.alert("Không tìm thấy khoản thu.", "w"); return; }
                me.openModal_KhoanThu_Edit(row);
            });

        // Nút Lưu / Xóa trong modal khoản thu
        $("#btnSave_KhoanThu_HSNH").off("click").on("click", function () {
            me.save_KhoanThu();
        });
        $("#btnDelete_KhoanThu_HSNH").off("click").on("click", function () {
            me.delete_KhoanThu();
        });

        // ----- Modal Ngành đầu ra -----
        // Nút "+ Thêm ngành" → mở modal chọn từ danh sách kế hoạch đầu ra
        $("#btnAdd_NganhDauRa_HSNH").off("click").on("click", function () {
            if (!me.strNhomId_NganhDauRa) {
                edu.system.alert("Không xác định được nhóm.", "w");
                return;
            }
            me.openModal_ThemNganhDauRa();
        });

        // Filter ds chương trình đầu ra trong modal Thêm
        $("#btnLoc_ThemNganhDauRa_HSNH").off("click").on("click", function () {
            me._pageThemNganh = 1;
            me.getList_KeHoachDauRa();
        });
        var tmoLoc = null;
        $("#txtTuKhoa_ThemNganhDauRa_HSNH").off("keyup").on("keyup", function () {
            clearTimeout(tmoLoc);
            tmoLoc = setTimeout(function () {
                me._pageThemNganh = 1;
                me.getList_KeHoachDauRa();
            }, 400);
        });

        // Select all trong modal Thêm — apply cho TOÀN BỘ arr (all pages), không chỉ page hiện tại
        $("#chkSelectAll_ThemNganhDauRa_HSNH").off("change").on("change", function () {
            var bCheck = $(this).is(":checked");
            me._selectedIds_ThemNganh = {};
            if (bCheck) {
                (me.dtKeHoachDauRa || []).forEach(function (r) {
                    var id = r.ID || r.NH_KEHOACH_DAURA_ID || '';
                    if (id) me._selectedIds_ThemNganh[id] = true;
                });
            }
            me.genTable_KeHoachDauRa(me.dtKeHoachDauRa);
        });

        // Row checkbox: update state _selectedIds (giữ tick qua các trang)
        $("#tblThemNganhDauRa_HSNH").off("change", ".chkThemNganhDauRa_HSNH")
            .on("change", ".chkThemNganhDauRa_HSNH", function () {
                var id = $(this).attr("data-id");
                if (!id) return;
                if ($(this).is(":checked")) me._selectedIds_ThemNganh[id] = true;
                else delete me._selectedIds_ThemNganh[id];
                $("#pgChecked_ThemNganh").text(Object.keys(me._selectedIds_ThemNganh).length);
                me._syncHeaderChk_ThemNganh();
            });

        // Pagination click
        $("#paging_ThemNganhDauRa_HSNH").off("click", ".page-link")
            .on("click", ".page-link", function (e) {
                e.preventDefault();
                var target = parseInt($(this).attr("data-page"), 10);
                if (isNaN(target)) return;
                me._pageThemNganh = target;
                me.genTable_KeHoachDauRa(me.dtKeHoachDauRa);
            });

        // Đổi page size — value="-1" = "Tất cả" → dùng 999999
        $("#pgSize_ThemNganh").off("change").on("change", function () {
            var _v = parseInt($(this).val(), 10);
            me._pageSizeThemNganh = (_v === -1) ? 999999 : (_v || 20);
            me._pageThemNganh = 1;
            me.genTable_KeHoachDauRa(me.dtKeHoachDauRa);
        });

        // Nút Lưu trong modal Thêm — duyệt state _selectedIds, call API Thêm
        $("#btnSave_ThemNganhDauRa_HSNH").off("click").on("click", function () {
            var arrIds = Object.keys(me._selectedIds_ThemNganh || {});
            if (arrIds.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất một chương trình đầu ra.", "w");
                return;
            }
            me.save_ThemNganhDauRa(arrIds);
        });

        // ----- Modal Cấu hình đầu vào (SV / đối tượng) -----
        // Nút "Thêm mới người học" (chưa có API bạn cấp)
        $("#btnAdd_NguoiHoc_DauVao_HSNH").off("click").on("click", function () {
            edu.system.alert("Chức năng Thêm mới người học sẽ làm khi có API.", "i");
        });

        // Nút "Thêm mới đối tượng" → mở modal chọn đối tượng
        $("#btnAdd_DoiTuong_DauVao_HSNH").off("click").on("click", function () {
            if (!me.strNhomId_DauVao) { edu.system.alert("Không xác định được nhóm.", "w"); return; }
            me.openModal_ThemDoiTuong();
        });

        // Nút Lưu trong modal Thêm đối tượng
        $("#btnSave_ThemDoiTuong_HSNH").off("click").on("click", function () {
            me.save_ThemDoiTuong();
        });

        // Chọn tất cả checkbox
        $("#chkSelectAll_DauVao_HSNH").off("change").on("change", function () {
            var bCheck = $(this).is(":checked");
            $("#tblDauVao_HSNH tbody input.chkDauVao_HSNH").prop("checked", bCheck);
        });

        // Xóa mục đã chọn
        $("#btnDelete_DauVao_HSNH").off("click").on("click", function () {
            var arrIds = [];
            $("#tblDauVao_HSNH tbody input.chkDauVao_HSNH:checked").each(function () {
                arrIds.push($(this).attr("data-id"));
            });
            if (arrIds.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng để xóa.", "w");
                return;
            }
            var fnXoa = function () { me.delete_DauVao(arrIds); };
            if (typeof edu.system.confirm === "function") {
                edu.system.confirm("Bạn có chắc chắn muốn xóa " + arrIds.length + " dòng đã chọn?");
                $("#btnYes").off("click.deldauvao").on("click.deldauvao", fnXoa);
            } else if (window.confirm("Bạn có chắc chắn muốn xóa " + arrIds.length + " dòng đã chọn?")) {
                fnXoa();
            }
        });

        // Chọn tất cả checkbox ngành đầu ra — TOÀN BỘ arr (all pages)
        $("#chkSelectAll_NganhDauRa_HSNH").off("change").on("change", function () {
            var bCheck = $(this).is(":checked");
            me._selectedIds_Nganh = {};
            if (bCheck) {
                (me.dtNganhDauRa || []).forEach(function (r) {
                    var id = r.ID || r.NH_CAUHINH_TC_NHOM_DAURA_ID || '';
                    if (id) me._selectedIds_Nganh[id] = true;
                });
            }
            me.genTable_NganhDauRa(me.dtNganhDauRa);
        });

        // Row checkbox: update state (giữ qua trang)
        $("#tblNganhDauRa_HSNH").off("change", ".chkNganhDauRa_HSNH")
            .on("change", ".chkNganhDauRa_HSNH", function () {
                var id = $(this).attr("data-id");
                if (!id) return;
                if ($(this).is(":checked")) me._selectedIds_Nganh[id] = true;
                else delete me._selectedIds_Nganh[id];
                $("#pgChecked_Nganh").text(Object.keys(me._selectedIds_Nganh).length);
                me._syncHeaderChk_Nganh();
            });

        // Pagination click
        $("#paging_NganhDauRa_HSNH").off("click", ".page-link")
            .on("click", ".page-link", function (e) {
                e.preventDefault();
                var target = parseInt($(this).attr("data-page"), 10);
                if (isNaN(target)) return;
                me._pageNganh = target;
                me.genTable_NganhDauRa(me.dtNganhDauRa);
            });

        // Đổi page size — value="-1" = "Tất cả" → dùng 999999
        $("#pgSize_Nganh").off("change").on("change", function () {
            var _v = parseInt($(this).val(), 10);
            me._pageSizeNganh = (_v === -1) ? 999999 : (_v || 20);
            me._pageNganh = 1;
            me.genTable_NganhDauRa(me.dtNganhDauRa);
        });

        // Xóa các ngành đã tick (bulk delete) — đọc từ state _selectedIds_Nganh
        $("#btnDelete_NganhDauRa_HSNH").off("click").on("click", function () {
            var arrIds = Object.keys(me._selectedIds_Nganh || {});
            if (arrIds.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất một dòng để xóa.", "w");
                return;
            }
            var fnXoa = function () { me.delete_NganhDauRa(arrIds); };
            if (typeof edu.system.confirm === "function") {
                edu.system.confirm("Bạn có chắc chắn muốn xóa " + arrIds.length + " ngành đã chọn?");
                $("#btnYes").off("click.delnganh").on("click.delnganh", fnXoa);
            } else if (window.confirm("Bạn có chắc chắn muốn xóa " + arrIds.length + " ngành đã chọn?")) {
                fnXoa();
            }
        });

        // ----- Các link Xem/Chi tiết trong bảng nhóm -----
        $("#tbldata_HSNH")
            .off("click", ".lnkXemKhoanThu")
            .on("click", ".lnkXemKhoanThu", function () {
                me.xem_CauHinh_KhoanThu($(this).attr("data-id"), $(this).attr("data-kehoach-id"));
            });

        $("#tbldata_HSNH")
            .off("click", ".lnkXemNganh")
            .on("click", ".lnkXemNganh", function () {
                me.xem_CauHinh_NganhDauRa($(this).attr("data-id"), $(this).attr("data-kehoach-id"));
            });

        $("#tbldata_HSNH")
            .off("click", ".lnkXemDauVao")
            .on("click", ".lnkXemDauVao", function () {
                me.xem_CauHinh_DauVao($(this).attr("data-id"), $(this).attr("data-kehoach-id"));
            });

        $("#tbldata_HSNH")
            .off("click", ".lnkChiTietNhom")
            .on("click", ".lnkChiTietNhom", function () {
                me.xem_ChiTiet_Nhom($(this).attr("data-id"));
            });
    },

    /* -----------------------------------------------------------------
       [1] LayDS Kế hoạch nhập học
       PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhapHoc_By
       ----------------------------------------------------------------- */
    getList_KeHoachNhapHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeCiQJLiAiKR4PKSAxCS4iHgM4',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhapHoc_By',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtKeyword_HSNH'),
            'strTS_KH_TuyenSinh_Id': '',
            'strTS_KH_TuyenSinh_Dot_Id': '',
            'strNhapHoc_Type_Code': '',
            'strStatus_Code': '',
            'dIs_Active': 1,
            'strVaiTro_NhapHoc_Code': '',
            'dChi_KhiLa_Manager': '',
            'dChi_KhiLa_Approver': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoach = data.Data || [];
                    me.genDropdown_KeHoach(me.dtKeHoach);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    genDropdown_KeHoach: function (arr) {
        var $drop = $("#dropKeHoachNhapHoc_HSNH");
        $drop.empty();
        $drop.append('<option value="">Chọn kế hoạch nhập học</option>');
        (arr || []).forEach(function (r) {
            var strId = r.ID || r.NH_KEHOACH_NHAPHOC_ID || '';
            var strTen = r.TEN || r.TEN_KEHOACH || r.NH_KEHOACH_NHAPHOC_TEN || '';
            $drop.append('<option value="' + strId + '">' + strTen + '</option>');
        });
        if (this.strKeHoachNhapHoc_Id) $drop.val(this.strKeHoachNhapHoc_Id);
    },

    /* -----------------------------------------------------------------
       [2] LayDS Nhóm định mức theo kế hoạch
       PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC_Nhom
       ----------------------------------------------------------------- */
    getList_NhomDinhMuc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDykgMQkuIh4CIDQJKC8pHhUCHg8pLiwP',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC_Nhom',
            'iM': edu.system.iM,
            'strNH_KeHoach_NhapHoc_Id': me.strKeHoachNhapHoc_Id,
            'strTuKhoa': '',
            'dIs_Default': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNhomDinhMuc = data.Data || [];
                    me.genTable_NhomDinhMuc(me.dtNhomDinhMuc);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    genTable_NhomDinhMuc: function (arr) {
        var $tbody = $("#tbldata_HSNH tbody");
        $tbody.empty();
        $("#lblTong_NhomDinhMuc").text(arr ? arr.length : 0);

        if (!arr || arr.length === 0) {
            $tbody.append(
                '<tr><td colspan="10">'
                + '<div class="kmp-empty-state">'
                + '<i class="fa-solid fa-inbox"></i>'
                + '<p>Chưa có nhóm định mức nào — bấm <b>Thêm nhóm</b> để tạo mới</p>'
                + '</div>'
                + '</td></tr>'
            );
            return;
        }

        var html = '';
        arr.forEach(function (r, i) {
            var strId = r.ID || r.NH_CAUHINH_TC_NHOM_ID || '';
            var strKeHoachIdRow = r.NH_KEHOACH_NHAPHOC_ID || '';
            var strMa = r.MA_NHOM || r.MA || '';
            var strTen = r.TEN_NHOM || r.TEN || '';
            var strGhiChu = r.GHICHU || r.GHI_CHU || '';
            var strNgayTao = r.NGAYTAO_DD_MM_YYYY_HHMMSS || r.NGAY_TAO || '';
            var strNguoiTao = r.NGUOITAO_TENDAYDU || r.NGUOI_TAO || '';

            var strDataAttrs = 'data-id="' + strId + '" data-kehoach-id="' + strKeHoachIdRow + '"';

            html += '<tr id="row_nhom_' + strId + '" ' + strDataAttrs + '>';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + strMa + '</td>';
            html += '<td class="td-left">' + strTen + '</td>';
            html += '<td class="td-left">' + strGhiChu + '</td>';
            html += '<td class="td-center"><a class="kmp-link-xem lnkXemKhoanThu" ' + strDataAttrs + '><i class="fa fa-eye"></i> Xem</a></td>';
            html += '<td class="td-center"><a class="kmp-link-xem lnkXemNganh" ' + strDataAttrs + '><i class="fa fa-eye"></i> Xem</a></td>';
            html += '<td class="td-center"><a class="kmp-link-xem lnkXemDauVao" ' + strDataAttrs + '><i class="fa fa-eye"></i> Xem</a></td>';
            html += '<td class="td-center">' + strNgayTao + '</td>';
            html += '<td class="td-left">' + strNguoiTao + '</td>';
            html += '<td class="td-center"><a class="kmp-link-xem lnkChiTietNhom" ' + strDataAttrs + '><i class="fa-solid fa-pen-to-square"></i> Chi tiết</a></td>';
            html += '</tr>';
        });
        $tbody.append(html);
    },

    /* -----------------------------------------------------------------
       [3] Xem cấu hình các khoản thu của nhóm → mở modal chuyên
       PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC
       ----------------------------------------------------------------- */
    xem_CauHinh_KhoanThu: function (strNhomId, strKeHoachIdRow) {
        var me = this;
        me.strNhomId_KhoanThu = strNhomId;
        me.strKeHoachId_KhoanThu = strKeHoachIdRow;

        // Gắn tên+mã nhóm vào TITLE (badge) + sub-title bên trong
        var strLabel = me._getNhomLabel(strNhomId);
        $("#titleNhom_KhoanThu").text(strLabel);
        $("#lblNhomInfo_KhoanThu").text("Nhóm: " + strLabel);

        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDykgMQkuIh4CIDQJKC8pHhUC',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC',
            'iM': edu.system.iM,
            'strNH_CauHinh_TC_Nhom_Id': strNhomId,
            'strNH_KeHoach_NhapHoc_Id': strKeHoachIdRow,
            'strTaiChinh_CacKhoanThu_Id': '',
            'dBat_Buoc': '',
            'dIs_Active': 1,
            'dChi_Ban_Ghi_HienTai': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoanThu = data.Data || [];
                    me.genTable_KhoanThu(me.dtKhoanThu);
                    $("#modalKhoanThu_HSNH").modal("show");
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* Render bảng khoản thu — cột đúng theo Excel + dòng SUM cho "Định mức thu" */
    genTable_KhoanThu: function (arr) {
        var me = this;
        var $tbody = $("#tblKhoanThu_HSNH tbody");
        var $tfoot = $("#tfootSum_KhoanThu_HSNH");
        $tbody.empty();

        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="14" class="td-center italic color-666">Chưa có khoản thu nào trong nhóm.</td></tr>');
            $tfoot.hide();
            return;
        }
        // Helper: lookup TEN từ cache DM theo MA
        var lookupDM = function (dmArr, code) {
            if (!code) return '';
            if (!dmArr || !dmArr.length) return code;
            for (var j = 0; j < dmArr.length; j++) {
                if (dmArr[j].MA === code) return dmArr[j].TEN || code;
            }
            return code;
        };
        // Lookup tên Cơ sở đào tạo theo ID (cache dtCoSoDaoTao dùng field ID)
        var lookupCSD = function (id) {
            if (!id) return '<span class="italic color-999">Tất cả cơ sở</span>';
            var arr = me.dtCoSoDaoTao || [];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].ID === id) return arr[j].TEN || id;
            }
            return id;
        };

        var html = '';
        arr.forEach(function (r, i) {
            var strId = r.ID || r.NH_CAUHINH_TC_ID || '';
            var strTen = r.TEN_HIEN_THI || r.TEN || '';
            var strMa = r.KHOANTHU_MA || r.MA || '';
            var strNhomTen = r.NHOM_TEN || '';
            var strDinhMuc = r.SO_TIEN_DINH_MUC != null ? r.SO_TIEN_DINH_MUC : '';
            // API trả DON_VI_TIEN_ID chứa mã (VD "DOT"), TEN=null → lookup từ DM
            var strDonVi = lookupDM(me.dtDM_DonViTien, r.DON_VI_TIEN_ID || r.DON_VI_TIEN_MA);
            var iBatBuoc = Number(r.BAT_BUOC || 0);
            var iTuDongSinh = Number(r.TU_DONG_SINH_PHAITHU || 0);
            var strThuTu = r.THU_TU_HIEN_THI != null ? r.THU_TU_HIEN_THI : '';
            // API trả KIEU_TU_DONG_SINH_PHAITHU_ID chứa mã (VD "DINHMUC"), TEN=null → lookup từ DM
            var strKieuTuDong = lookupDM(me.dtDM_KieuTuDong, r.KIEU_TU_DONG_SINH_PHAITHU_ID || r.KIEU_SINH_PHAITHU_ID);
            var iChoPhepMienGiam = Number(r.CHO_PHEP_MIEN_GIAM || 0);
            var strGhiChu = r.GHICHU || r.GHI_CHU || '';
            // Cơ sở đào tạo: backend trả NHAPHOC_COSO_TEN / NHAPHOC_COSO_ID (khớp cột DB)
            var strCSDTen = r.NHAPHOC_COSO_TEN || r.COSODAOTAO_TEN
                          || lookupCSD(r.NHAPHOC_COSO_ID || r.DAOTAO_COSODAOTAO_ID || r.COSODAOTAO_ID || '');

            // format số tiền có dấu phân cách hàng nghìn
            var strDinhMucFmt = strDinhMuc;
            if (strDinhMuc !== '' && !isNaN(strDinhMuc)) {
                strDinhMucFmt = Number(strDinhMuc).toLocaleString('vi-VN');
            }

            html += '<tr id="row_khoanthu_' + strId + '" data-id="' + strId + '">';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + strTen + '</td>';
            html += '<td class="td-left">' + strMa + '</td>';
            html += '<td class="td-left">' + strNhomTen + '</td>';
            html += '<td class="td-left">' + strCSDTen + '</td>';
            html += '<td class="td-right">' + strDinhMucFmt + '</td>';
            html += '<td class="td-center">' + strDonVi + '</td>';
            html += '<td class="td-center">' + (iBatBuoc === 1 ? '<span class="label label-danger">Bắt buộc</span>' : '') + '</td>';
            html += '<td class="td-center">' + (iTuDongSinh === 1 ? '<span class="label label-info">Tự động sinh phải thu</span>' : '') + '</td>';
            html += '<td class="td-center">' + strThuTu + '</td>';
            html += '<td class="td-left">' + strKieuTuDong + '</td>';
            html += '<td class="td-center">' + (iChoPhepMienGiam === 1 ? '<span class="label label-success">Cho phép áp dụng miễn giảm</span>' : '') + '</td>';
            html += '<td class="td-left">' + strGhiChu + '</td>';
            html += '<td class="td-center"><a class="kmp-link-xem lnkChiTiet_KhoanThu" data-id="' + strId + '"><i class="fa fa-pencil"></i> Chi tiết</a></td>';
            html += '</tr>';
        });
        $tbody.append(html);

        // Sum "Định mức thu" (SO_TIEN_DINH_MUC) — dòng tổng ở tfoot
        var sumDinhMuc = 0;
        arr.forEach(function (r) {
            var v = r.SO_TIEN_DINH_MUC;
            if (v !== '' && v != null && !isNaN(v)) sumDinhMuc += Number(v);
        });
        $("#sumDinhMuc_KhoanThu").text(me._fmtNumVN(sumDinhMuc));
        $tfoot.show();
    },

    /* -----------------------------------------------------------------
       [4] Xem cấu hình ngành đầu ra nhận mức theo nhóm → modal chuyên
       PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DauRa
       ----------------------------------------------------------------- */
    xem_CauHinh_NganhDauRa: function (strNhomId, strKeHoachIdRow) {
        var me = this;
        me.strNhomId_NganhDauRa = strNhomId;
        me.strKeHoachId_NganhDauRa = strKeHoachIdRow;
        // Reset state phân trang + selection mỗi lần mở modal cấu hình
        me._pageNganh = 1;
        var _vN = parseInt($("#pgSize_Nganh").val(), 10);
        me._pageSizeNganh = (_vN === -1) ? 999999 : (_vN || 20);
        me._selectedIds_Nganh = {};
        $("#chkSelectAll_NganhDauRa_HSNH").prop('checked', false).prop('indeterminate', false);

        // Tên+mã nhóm — gắn vào TITLE (badge) + sub-title
        var strLabel = me._getNhomLabel(strNhomId);
        $("#titleNhom_NganhDauRa").text(strLabel);
        $("#lblNhomInfo_NganhDauRa").text("Nhóm: " + strLabel);

        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeAiA0CSgvKR4VAh4PKS4sHgUgNBMg',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DauRa',
            'iM': edu.system.iM,
            'strNH_CauHinh_TC_Nhom_Id': strNhomId,
            'strNH_KeHoach_NhapHoc_Id': strKeHoachIdRow,
            'strNH_KeHoach_DauRa_Id': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNganhDauRa = data.Data || [];
                    me.genTable_NganhDauRa(me.dtNganhDauRa);
                    $("#chkSelectAll_NganhDauRa_HSNH").prop("checked", false);
                    $("#modalNganhDauRa_HSNH").modal("show");
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* Render bảng ngành đầu ra — cột đúng theo Excel + client-side pagination */
    genTable_NganhDauRa: function (arr) {
        var me = this;
        var $tbody = $("#tblNganhDauRa_HSNH tbody");
        var $paging = $("#paging_NganhDauRa_HSNH");
        $tbody.empty();

        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="9" class="td-center italic color-666">Chưa có ngành đầu ra nào.</td></tr>');
            $paging.hide();
            me._syncHeaderChk_Nganh();
            return;
        }

        var pageSize = me._pageSizeNganh || 20;
        var totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
        if (!me._pageNganh || me._pageNganh > totalPages) me._pageNganh = totalPages;
        if (me._pageNganh < 1) me._pageNganh = 1;
        var page = me._pageNganh;
        var startIdx = (page - 1) * pageSize;
        var endIdx = Math.min(startIdx + pageSize, arr.length);

        var html = '';
        for (var i = startIdx; i < endIdx; i++) {
            var r = arr[i];
            var strId = r.ID || r.NH_CAUHINH_TC_NHOM_DAURA_ID || '';
            var strHe = r.TENHEDAOTAO || r.TEN_HEDAOTAO || r.TEN_HE_DAOTAO || '';
            var strKhoa = r.TENKHOA || r.TEN_KHOA || '';
            var strMaNganhDT = r.MA_NGANH_DT || r.NGANH_DT_MA || r.MANGANH_DT || '';
            var strMaNganhTS = r.MA_NGANH_TS || r.NGANH_TS_MA || r.MANGANH_TS || '';
            var strNganhDT = me._mergeTenMa(r.TEN_NGANH_DT || r.TEN_NGANHDT || r.NGANH_DT_TEN || '', strMaNganhDT);
            var strNganhTS = me._mergeTenMa(r.TEN_NGANH_TS || r.TEN_NGANHTS || r.NGANH_TS_TEN || '', strMaNganhTS);
            var strKhoaQL = r.TEN_KHOAQUANLY || r.TENKHOAQUANLY || '';
            var strTenCT = r.TENCHUONGTRINH || r.TEN_CHUONGTRINH || '';
            var strMaCT = r.MACHUONGTRINH || r.MA_CHUONGTRINH || '';
            var strChuongTrinh = me._mergeTenMa(strTenCT, strMaCT);
            var strGhiChu = r.GHICHU || r.GHI_CHU || '';
            var checked = me._selectedIds_Nganh[strId] ? ' checked' : '';

            html += '<tr id="row_nganhdaura_' + strId + '" data-id="' + strId + '">';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + strHe + '</td>';
            html += '<td class="td-left">' + strKhoa + '</td>';
            html += '<td class="td-left">' + strNganhDT + '</td>';
            html += '<td class="td-left">' + strNganhTS + '</td>';
            html += '<td class="td-left">' + strKhoaQL + '</td>';
            html += '<td class="td-left">' + strChuongTrinh + '</td>';
            html += '<td class="td-left">' + strGhiChu + '</td>';
            html += '<td class="td-center"><input type="checkbox" class="chkNganhDauRa_HSNH" data-id="' + strId + '"' + checked + ' /></td>';
            html += '</tr>';
        }
        $tbody.append(html);

        $("#pgCur_Nganh").text(page);
        $("#pgTotal_Nganh").text(totalPages);
        $("#pgSum_Nganh").text(arr.length);
        $("#pgChecked_Nganh").text(Object.keys(me._selectedIds_Nganh).length);
        $paging.css('display', 'flex');
        me._renderPagingBtns_Nganh(page, totalPages);
        me._syncHeaderChk_Nganh();
    },

    _renderPagingBtns_Nganh: function (page, totalPages) {
        var $ul = $("#pgList_Nganh");
        $ul.empty();
        var add = function (label, target, disabled, active) {
            var cls = 'page-item';
            if (disabled) cls += ' disabled';
            if (active) cls += ' active';
            $ul.append('<li class="' + cls + '"><a class="page-link" href="javascript:;" data-page="' + target + '">' + label + '</a></li>');
        };
        add('«', 1, page === 1, false);
        add('‹', Math.max(1, page - 1), page === 1, false);
        var winSize = 5;
        var startP = Math.max(1, page - Math.floor(winSize / 2));
        var endP = Math.min(totalPages, startP + winSize - 1);
        startP = Math.max(1, endP - winSize + 1);
        for (var p = startP; p <= endP; p++) add(String(p), p, false, p === page);
        add('›', Math.min(totalPages, page + 1), page === totalPages, false);
        add('»', totalPages, page === totalPages, false);
    },

    _syncHeaderChk_Nganh: function () {
        var me = this;
        var arr = me.dtNganhDauRa || [];
        var $chk = $("#chkSelectAll_NganhDauRa_HSNH");
        if (arr.length === 0) {
            $chk.prop('checked', false).prop('indeterminate', false);
            return;
        }
        var checkedCount = Object.keys(me._selectedIds_Nganh).length;
        $chk.prop('checked', checkedCount === arr.length);
        $chk.prop('indeterminate', checkedCount > 0 && checkedCount < arr.length);
    },

    /* -----------------------------------------------------------------
       [5] Xem cấu hình đầu vào (SV/đối tượng) → modal chuyên
       PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DT
       ----------------------------------------------------------------- */
    xem_CauHinh_DauVao: function (strNhomId, strKeHoachIdRow) {
        var me = this;
        me.strNhomId_DauVao = strNhomId;
        me.strKeHoachId_DauVao = strKeHoachIdRow;

        // Tên+mã nhóm — gắn vào TITLE (badge) + sub-title
        var strLabel = me._getNhomLabel(strNhomId);
        $("#titleNhom_DauVao").text(strLabel);
        $("#lblNhomInfo_DauVao").text("Nhóm: " + strLabel);

        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeAiA0CSgvKR4VAh4PKS4sHgUV',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DT',
            'iM': edu.system.iM,
            'strNH_CauHinh_TC_Nhom_Id': strNhomId,
            'strNH_KeHoach_NhapHoc_Id': strKeHoachIdRow,
            'strCore_Person_Id': '',
            'strDoi_Tuong_ApDung_Id': '',
            'strLoai_ApDung': '',
            'dIs_Active': 1,
            'dChi_Ban_Ghi_HienTai': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDauVao = data.Data || [];
                    me.genTable_DauVao(me.dtDauVao);
                    $("#chkSelectAll_DauVao_HSNH").prop("checked", false);
                    $("#modalDauVao_HSNH").modal("show");
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* Render bảng đầu vào — cột đúng theo Excel */
    genTable_DauVao: function (arr) {
        var $tbody = $("#tblDauVao_HSNH tbody");
        $tbody.empty();

        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="8" class="td-center italic color-666">Chưa có cấu hình đầu vào nào.</td></tr>');
            return;
        }

        var html = '';
        arr.forEach(function (r, i) {
            var strId = r.ID || r.NH_CAUHINH_TC_NHOM_DT_ID || '';
            var strMaSo = r.SV_MASO || r.MASO || '';
            var strHoTen = r.SV_HOTEN || r.HOTEN || '';
            var strDoiTuong = r.DOI_TUONG_TEN || r.DOITUONG_TEN || '';
            var strGhiChu = r.GHICHU || r.GHI_CHU || r.GhiChu || '';
            var iIsActive = Number(r.IS_ACTIVE || 0);
            var iIsCurrent = Number(r.IS_CURRENT || 0);

            html += '<tr data-id="' + strId + '">';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + strMaSo + '</td>';
            html += '<td class="td-left">' + strHoTen + '</td>';
            html += '<td class="td-left">' + strDoiTuong + '</td>';
            html += '<td class="td-left">' + strGhiChu + '</td>';
            html += '<td class="td-center">' + (iIsActive === 1
                ? '<span class="label label-success">Hiệu lực</span>'
                : '<span class="label label-default">Ngừng</span>') + '</td>';
            html += '<td class="td-center">' + (iIsCurrent === 1
                ? '<span class="label label-info">Đang dùng</span>'
                : '') + '</td>';
            html += '<td class="td-center"><input type="checkbox" class="chkDauVao_HSNH" data-id="' + strId + '" /></td>';
            html += '</tr>';
        });
        $tbody.append(html);
    },

    /* =================================================================
       ĐẦU VÀO — Xóa nhiều bản ghi
       PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DT
       ================================================================= */
    delete_DauVao: function (arrIds) {
        var me = this;
        if (!arrIds || arrIds.length === 0) return;

        var iDone = 0, iOk = 0, iFail = 0;
        var arrFailMsg = [];
        var iTotal = arrIds.length;

        arrIds.forEach(function (strId) {
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/GS4gHg8JHgIgNAkoLykeFQIeDykuLB4FFQPP',
                'func': 'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DT',
                'iM': edu.system.iM,
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    iDone++;
                    if (data.Success) { iOk++; }
                    else { iFail++; arrFailMsg.push(strId + ": " + (data.Message || '')); }
                    if (iDone === iTotal) me._onDone_Xoa_DauVao(iOk, iFail, arrFailMsg);
                },
                error: function (er) {
                    iDone++; iFail++;
                    arrFailMsg.push(strId + ": " + JSON.stringify(er));
                    if (iDone === iTotal) me._onDone_Xoa_DauVao(iOk, iFail, arrFailMsg);
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        });
    },

    _onDone_Xoa_DauVao: function (iOk, iFail, arrFailMsg) {
        var me = this;
        var strMsg = "Đã xóa " + iOk + " dòng thành công.";
        if (iFail > 0) {
            strMsg += " Thất bại " + iFail + " dòng.";
            if (arrFailMsg.length) console.warn("Xóa cấu hình đầu vào — chi tiết lỗi:", arrFailMsg);
        }
        edu.system.alert(strMsg, iFail > 0 ? "w" : "");
        me.xem_CauHinh_DauVao(me.strNhomId_DauVao, me.strKeHoachId_DauVao);
    },

    /* -----------------------------------------------------------------
       [6] Xem chi tiết 1 nhóm → mở form edit
       PKG_CORE_NHAPHOC.LayTT_NhapHoc_CauHinh_TC_Nhom
       ----------------------------------------------------------------- */
    xem_ChiTiet_Nhom: function (strNhomId) {
        var me = this;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4FRUeDykgMQkuIh4CIDQJKC8pHhUCHg8pLiwP',
            'func': 'PKG_CORE_NHAPHOC.LayTT_NhapHoc_CauHinh_TC_Nhom',
            'iM': edu.system.iM,
            'strId': strNhomId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = data.Data || [];
                    var r = Array.isArray(arr) ? arr[0] : arr;
                    if (!r) { edu.system.alert("Không tìm thấy dữ liệu nhóm.", "w"); return; }
                    // Force gán ID gốc để không phụ thuộc field naming của API response
                    // (đảm bảo save_Nhom đi đúng nhánh SUA, không phải THEM)
                    r.__forcedId = strNhomId;
                    me.openModal_Nhom_Edit(r);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* -----------------------------------------------------------------
       [7] Mở modal Thêm mới nhóm
       ----------------------------------------------------------------- */
    openModal_Nhom_Add: function () {
        $("#modalNhom_HSNH_Title").text("Thêm mới nhóm");
        $("#hdId_Nhom_HSNH").val("");
        $("#hdKeHoachId_Nhom_HSNH").val(this.strKeHoachNhapHoc_Id);
        $("#txtMa_Nhom_HSNH").val("");
        $("#txtTen_Nhom_HSNH").val("");
        $("#txtPriority_Nhom_HSNH").val(100);
        $("#chkHieuLuc_Nhom_HSNH").prop("checked", true);
        $("#txtGhiChu_Nhom_HSNH").val("");
        $("#zoneDelete_Nhom_HSNH").hide();
        $("#modalNhom_HSNH").modal("show");
    },

    /* -----------------------------------------------------------------
       [8] Mở modal Xem & chỉnh sửa nhóm (đổ dữ liệu)
       ----------------------------------------------------------------- */
    openModal_Nhom_Edit: function (r) {
        // Ưu tiên ID force từ caller (xem_ChiTiet_Nhom truyền vào), rồi mới fallback field response
        var strId = r.__forcedId || r.ID || r.Id || r.id
                 || r.NH_CAUHINH_TC_NHOM_ID || r.Nh_Cauhinh_Tc_Nhom_Id || '';
        var strKeHoachId = r.NH_KEHOACH_NHAPHOC_ID || r.Nh_Kehoach_Nhaphoc_Id
                        || this.strKeHoachNhapHoc_Id || '';
        var strMa = r.MA_NHOM || r.Ma_Nhom || r.MA || '';
        var strTen = r.TEN_NHOM || r.Ten_Nhom || r.TEN || '';
        var iPriority = (r.PRIORITY_NO !== undefined && r.PRIORITY_NO !== null) ? r.PRIORITY_NO
                      : (r.Priority_No !== undefined && r.Priority_No !== null) ? r.Priority_No
                      : 100;
        var iIsDefault = (r.IS_DEFAULT !== undefined && r.IS_DEFAULT !== null) ? Number(r.IS_DEFAULT)
                       : (r.Is_Default !== undefined && r.Is_Default !== null) ? Number(r.Is_Default)
                       : 1;
        var strGhiChu = r.GHICHU || r.GhiChu || r.GHI_CHU || '';

        $("#modalNhom_HSNH_Title").text("Xem và chỉnh sửa nhóm");
        $("#hdId_Nhom_HSNH").val(strId);
        $("#hdKeHoachId_Nhom_HSNH").val(strKeHoachId);
        $("#txtMa_Nhom_HSNH").val(strMa);
        $("#txtTen_Nhom_HSNH").val(strTen);
        $("#txtPriority_Nhom_HSNH").val(iPriority);
        $("#chkHieuLuc_Nhom_HSNH").prop("checked", iIsDefault === 1);
        $("#txtGhiChu_Nhom_HSNH").val(strGhiChu);
        $("#zoneDelete_Nhom_HSNH").show();
        $("#modalNhom_HSNH").modal("show");
    },

    /* -----------------------------------------------------------------
       [9] Lưu (Thêm mới hoặc Cập nhật) nhóm
       PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC_Nhom / Sua_NhapHoc_CauHinh_TC_Nhom
       ----------------------------------------------------------------- */
    save_Nhom: function () {
        var me = this;
        var strId = edu.util.getValById('hdId_Nhom_HSNH');
        var strMa = edu.util.getValById('txtMa_Nhom_HSNH');
        var strTen = edu.util.getValById('txtTen_Nhom_HSNH');
        var strPriority = edu.util.getValById('txtPriority_Nhom_HSNH');
        var iIsDefault = $("#chkHieuLuc_Nhom_HSNH").is(":checked") ? 1 : 0;
        var strGhiChu = edu.util.getValById('txtGhiChu_Nhom_HSNH');

        if (!strMa || !strMa.trim()) { edu.system.alert("Vui lòng nhập Mã nhóm.", "w"); return; }
        if (!strTen || !strTen.trim()) { edu.system.alert("Vui lòng nhập Tên nhóm.", "w"); return; }

        var obj_save;
        if (!strId) {
            // Thêm mới
            obj_save = {
                'action': 'SV_Core_NhapHoc_MH/FSkkLB4PKSAxCS4iHgIgNAkoLykeFQIeDykuLAPP',
                'func': 'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC_Nhom',
                'iM': edu.system.iM,
                'strNH_KeHoach_NhapHoc_Id': edu.util.getValById('hdKeHoachId_Nhom_HSNH') || me.strKeHoachNhapHoc_Id,
                'strMa_Nhom': strMa,
                'strTen_Nhom': strTen,
                'dIs_Default': iIsDefault,
                'dPriority_No': strPriority || 100,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
        } else {
            // Cập nhật
            obj_save = {
                'action': 'SV_Core_NhapHoc_MH/EjQgHg8pIDEJLiIeAiA0CSgvKR4VAh4PKS4s',
                'func': 'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC_Nhom',
                'iM': edu.system.iM,
                'strId': strId,
                'strMa_Nhom': strMa,
                'strTen_Nhom': strTen,
                'dIs_Default': iIsDefault,
                'dPriority_No': strPriority || 100,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(strId ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    $("#modalNhom_HSNH").modal("hide");
                    me.getList_NhomDinhMuc();
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* -----------------------------------------------------------------
       [10] Xóa nhóm
       PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC_Nhom
       ----------------------------------------------------------------- */
    delete_Nhom: function () {
        var me = this;
        var strId = edu.util.getValById('hdId_Nhom_HSNH');
        if (!strId) { edu.system.alert("Không xác định được nhóm cần xóa.", "w"); return; }

        var fnXoa = function () {
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/GS4gHg8pIDEJLiIeAiA0CSgvKR4VAh4PKS4s',
                'func': 'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC_Nhom',
                'iM': edu.system.iM,
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Xóa nhóm thành công!");
                        $("#modalNhom_HSNH").modal("hide");
                        me.getList_NhomDinhMuc();
                    } else {
                        edu.system.alert(data.Message, "s");
                    }
                },
                error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        };

        // Xác nhận trước khi xóa
        if (typeof edu.system.confirm === "function") {
            edu.system.confirm("Bạn có chắc chắn muốn xóa nhóm này?");
            $("#btnYes").off("click.delnhom").on("click.delnhom", fnXoa);
        } else if (window.confirm("Bạn có chắc chắn muốn xóa nhóm này?")) {
            fnXoa();
        }
    },

    /* -----------------------------------------------------------------
       Modal xem chung — tự động render cột theo field trả về
       ----------------------------------------------------------------- */
    showModal_Xem: function (strTitle, strSubTitle, arr) {
        $("#modalXem_HSNH_Title").text(strTitle);
        $("#modalXem_HSNH_SubTitle").text(strSubTitle + " — Tổng số bản ghi: " + (arr ? arr.length : 0));

        var $thead = $("#tbldata_XemChiTiet_HSNH thead");
        var $tbody = $("#tbldata_XemChiTiet_HSNH tbody");
        $thead.empty();
        $tbody.empty();

        if (!arr || arr.length === 0) {
            $thead.append('<tr><th class="td-center">Dữ liệu</th></tr>');
            $tbody.append('<tr><td class="td-center italic color-666">Không có dữ liệu.</td></tr>');
        } else {
            var keys = Object.keys(arr[0]);
            var htmlHead = '<tr><th class="td-center" style="width:40px">STT</th>';
            keys.forEach(function (k) { htmlHead += '<th class="td-center">' + k + '</th>'; });
            htmlHead += '</tr>';
            $thead.append(htmlHead);

            var htmlBody = '';
            arr.forEach(function (r, i) {
                htmlBody += '<tr><td class="td-center">' + (i + 1) + '</td>';
                keys.forEach(function (k) {
                    var v = r[k];
                    if (v === null || v === undefined) v = '';
                    htmlBody += '<td class="td-left">' + v + '</td>';
                });
                htmlBody += '</tr>';
            });
            $tbody.append(htmlBody);
        }
        $("#modalXem_HSNH").modal("show");
    },

    /* =================================================================
       KHOẢN THU — Add / Edit / Delete
       ================================================================= */

    /* Load 3 combo lookup cho form (chỉ load 1 lần) */
    loadCombos_KhoanThu: function (cb) {
        var me = this;
        if (me.bLoadedCombo_KhoanThu) { if (cb) cb(); return; }

        // Đơn vị tính + Kiểu tự động sinh phải thu
        // Gọi trực tiếp getList_DanhMucDulieu + loadToCombo_data để kiểm soát placeholder,
        // tránh loadToCombo_DanhMucDuLieu echo mã DM thô ra text placeholder.
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "TAICHINH.DVT", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                edu.system.loadToCombo_data({
                    data: data || [],
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropDonVi_KhoanThu_HSNH"],
                    title: "Chọn đơn vị tính",
                    default_val: ""
                });
            }
        );
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NHAPHOC_CAUHINH_TC.KIEUTUDONG.PHAINOP", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                edu.system.loadToCombo_data({
                    data: data || [],
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropKieuTuDong_KhoanThu_HSNH"],
                    title: "Chọn kiểu tự động sinh phải thu",
                    default_val: ""
                });
            }
        );

        // Cơ sở đào tạo — dùng helper edu.system.getList_CoSoDaoTao đã có
        edu.system.getList_CoSoDaoTao(
            { strTuKhoa: "", strDaoTao_LoaiCoSo_Id: "", pageIndex: 1, pageSize: 10000 },
            "", "",
            function (data) {
                me.dtCoSoDaoTao = data || [];
                edu.system.loadToCombo_data({
                    data: me.dtCoSoDaoTao,
                    renderInfor: { id: "ID", parentId: "", name: "TEN", code: "" },
                    renderPlace: ["dropCoSoDaoTao_KhoanThu_HSNH"],
                    title: "Áp dụng cho tất cả cơ sở",
                    default_val: ""
                });
                // Re-render bảng khoản thu nếu đã có data để hiển thị tên CSD
                if (me.dtKhoanThu && me.dtKhoanThu.length) me.genTable_KhoanThu(me.dtKhoanThu);
            }
        );

        // Danh sách khoản thu (TC_KhoanThu/LayDanhSach)
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': '',
            'strNhomCacKhoanThu_Id': '',
            'pageIndex': 1,
            'pageSize': 1000,
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLoaiKhoan = data.Data || [];
                    edu.system.loadToCombo_data({
                        data: me.dtLoaiKhoan,
                        renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                        renderPlace: ["dropKhoanThu_KhoanThu_HSNH"],
                        type: "",
                        title: "Chọn khoản thu"
                    });
                    me.bLoadedCombo_KhoanThu = true;
                    if (cb) cb();
                } else {
                    edu.system.alert("Load khoản thu: " + data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },

    /* Mở modal Thêm mới khoản thu */
    openModal_KhoanThu_Add: function () {
        var me = this;
        me.loadCombos_KhoanThu(function () {
            $("#modalKhoanThuEdit_HSNH_Title").text("Thêm mới khoản thu");
            $("#hdId_KhoanThu_HSNH").val("");
            edu.util.viewValById("dropKhoanThu_KhoanThu_HSNH", "");
            $("#txtTenHienThi_KhoanThu_HSNH").val("");
            $("#txtDinhMuc_KhoanThu_HSNH").val("");
            edu.util.viewValById("dropDonVi_KhoanThu_HSNH", "");
            $("#chkBatBuoc_KhoanThu_HSNH").prop("checked", false);
            $("#chkTuDongSinh_KhoanThu_HSNH").prop("checked", true);
            $("#txtThuTu_KhoanThu_HSNH").val(0);
            edu.util.viewValById("dropKieuTuDong_KhoanThu_HSNH", "");
            $("#chkChoPhepMienGiam_KhoanThu_HSNH").prop("checked", false);
            edu.util.viewValById("dropCoSoDaoTao_KhoanThu_HSNH", "");
            $("#txtGhiChu_KhoanThu_HSNH").val("");
            $("#zoneDelete_KhoanThu_HSNH").hide();
            // Khi thêm mới cho phép chọn khoản thu
            $("#dropKhoanThu_KhoanThu_HSNH").prop("disabled", false).trigger("change.select2");
            $("#modalKhoanThuEdit_HSNH").modal("show");
        });
    },

    /* Mở modal Sửa (dùng row đã có, chưa có API LayTT khoản thu) */
    openModal_KhoanThu_Edit: function (r) {
        var me = this;
        me.loadCombos_KhoanThu(function () {
            $("#modalKhoanThuEdit_HSNH_Title").text("Xem và chỉnh sửa khoản thu");
            // Fallback nhiều biến thể naming để không mất ID → tránh save gửi rỗng → THEM thay vì SUA
            var strId = r.ID || r.Id || r.id
                     || r.NH_CAUHINH_TC_ID || r.Nh_Cauhinh_Tc_Id || '';
            $("#hdId_KhoanThu_HSNH").val(strId);
            edu.util.viewValById("dropKhoanThu_KhoanThu_HSNH",
                r.TAICHINH_CACKHOANTHU_ID || r.KHOANTHU_ID || '');
            $("#txtTenHienThi_KhoanThu_HSNH").val(r.TEN_HIEN_THI || '');
            $("#txtDinhMuc_KhoanThu_HSNH").val(r.SO_TIEN_DINH_MUC != null ? r.SO_TIEN_DINH_MUC : '');
            edu.util.viewValById("dropDonVi_KhoanThu_HSNH", r.DON_VI_TIEN_ID || r.DON_VI_TIEN_MA || '');
            $("#chkBatBuoc_KhoanThu_HSNH").prop("checked", Number(r.BAT_BUOC || 0) === 1);
            $("#chkTuDongSinh_KhoanThu_HSNH").prop("checked", Number(r.TU_DONG_SINH_PHAITHU || 0) === 1);
            $("#txtThuTu_KhoanThu_HSNH").val(r.THU_TU_HIEN_THI != null ? r.THU_TU_HIEN_THI : 0);
            edu.util.viewValById("dropKieuTuDong_KhoanThu_HSNH", r.KIEU_TU_DONG_SINH_PHAITHU_ID || r.KIEU_SINH_PHAITHU_ID || '');
            $("#chkChoPhepMienGiam_KhoanThu_HSNH").prop("checked", Number(r.CHO_PHEP_MIEN_GIAM || 0) === 1);
            // Backend trả field NHAPHOC_COSO_ID (khớp cột DB NHAPHOC_COSO_ID)
            edu.util.viewValById("dropCoSoDaoTao_KhoanThu_HSNH",
                r.NHAPHOC_COSO_ID || r.DAOTAO_COSODAOTAO_ID || r.COSODAOTAO_ID || '');
            $("#txtGhiChu_KhoanThu_HSNH").val(r.GHICHU || r.GHI_CHU || '');
            $("#zoneDelete_KhoanThu_HSNH").show();
            // Ở chế độ sửa, khoản thu gốc không cho đổi (hoặc để đổi được cũng ok — Sua có param strTaiChinh_CacKhoanThu_Id)
            $("#modalKhoanThuEdit_HSNH").modal("show");
        });
    },

    /* Lưu (Thêm hoặc Sửa) khoản thu */
    save_KhoanThu: function () {
        var me = this;
        var strId = edu.util.getValById('hdId_KhoanThu_HSNH');
        var strKhoanThuId = edu.util.getValById('dropKhoanThu_KhoanThu_HSNH');
        var strTenHienThi = edu.util.getValById('txtTenHienThi_KhoanThu_HSNH');
        var strDinhMuc = edu.util.getValById('txtDinhMuc_KhoanThu_HSNH');
        var strDonViId = edu.util.getValById('dropDonVi_KhoanThu_HSNH');
        var iBatBuoc = $("#chkBatBuoc_KhoanThu_HSNH").is(":checked") ? 1 : 0;
        var iTuDongSinh = $("#chkTuDongSinh_KhoanThu_HSNH").is(":checked") ? 1 : 0;
        var strThuTu = edu.util.getValById('txtThuTu_KhoanThu_HSNH');
        var strKieuTuDongId = edu.util.getValById('dropKieuTuDong_KhoanThu_HSNH');
        var iChoPhepMienGiam = $("#chkChoPhepMienGiam_KhoanThu_HSNH").is(":checked") ? 1 : 0;
        var strCoSoDaoTaoId = edu.util.getValById('dropCoSoDaoTao_KhoanThu_HSNH');
        var strGhiChu = edu.util.getValById('txtGhiChu_KhoanThu_HSNH');

        if (!strKhoanThuId) { edu.system.alert("Vui lòng chọn khoản thu.", "w"); return; }
        if (strDinhMuc === '' || isNaN(Number(strDinhMuc))) {
            edu.system.alert("Vui lòng nhập Định mức thu hợp lệ.", "w"); return;
        }

        var obj_save;
        if (!strId) {
            // Thêm
            obj_save = {
                'action': 'SV_Core_NhapHoc_MH/FSkkLB4PKSAxCS4iHgIgNAkoLykeFQIP',
                'func': 'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC',
                'iM': edu.system.iM,
                'strNH_CauHinh_TC_Nhom_Id': me.strNhomId_KhoanThu,
                'strTaiChinh_CacKhoanThu_Id': strKhoanThuId,
                'strTen_KhoanThu_HienThi': strTenHienThi,
                'dSo_Tien_Dinh_Muc': Number(strDinhMuc),
                'strDon_Vi_Tien_Id': strDonViId,
                'dBat_Buoc': iBatBuoc,
                'dCho_Phep_Mien_Giam': iChoPhepMienGiam,
                'dTu_Dong_Sinh_PhaiThu': iTuDongSinh,
                'strKieu_Sinh_PhaiThu_Id': strKieuTuDongId,
                'dThu_Tu_Hien_Thi': Number(strThuTu || 0),
                'strDaoTao_CoSoDaoTao_Id': strCoSoDaoTaoId,
                'strNhapHoc_CoSo_Id': strCoSoDaoTaoId,
                'strNhaphoc_Coso_Id': strCoSoDaoTaoId,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
        } else {
            // Sửa
            obj_save = {
                'action': 'SV_Core_NhapHoc_MH/EjQgHg8pIDEJLiIeAiA0CSgvKR4VAgPP',
                'func': 'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC',
                'iM': edu.system.iM,
                'strId': strId,
                'strTaiChinh_CacKhoanThu_Id': strKhoanThuId,
                'strTen_KhoanThu_HienThi': strTenHienThi,
                'dSo_Tien_Dinh_Muc': Number(strDinhMuc),
                'strDon_Vi_Tien_Id': strDonViId,
                'dBat_Buoc': iBatBuoc,
                'dCho_Phep_Mien_Giam': iChoPhepMienGiam,
                'dTu_Dong_Sinh_PhaiThu': iTuDongSinh,
                'strKieu_Sinh_PhaiThu_Id': strKieuTuDongId,
                'dThu_Tu_Hien_Thi': Number(strThuTu || 0),
                'strDaoTao_CoSoDaoTao_Id': strCoSoDaoTaoId,
                'strNhapHoc_CoSo_Id': strCoSoDaoTaoId,
                'strNhaphoc_Coso_Id': strCoSoDaoTaoId,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(strId ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    $("#modalKhoanThuEdit_HSNH").modal("hide");
                    // Reload bảng khoản thu của nhóm hiện tại
                    me.xem_CauHinh_KhoanThu(me.strNhomId_KhoanThu, me.strKeHoachId_KhoanThu);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* Xóa khoản thu */
    delete_KhoanThu: function () {
        var me = this;
        var strId = edu.util.getValById('hdId_KhoanThu_HSNH');
        if (!strId) { edu.system.alert("Không xác định được khoản thu cần xóa.", "w"); return; }

        var fnXoa = function () {
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/GS4gHg8pIDEJLiIeAiA0CSgvKR4VAgPP',
                'func': 'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC',
                'iM': edu.system.iM,
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Xóa khoản thu thành công!");
                        $("#modalKhoanThuEdit_HSNH").modal("hide");
                        me.xem_CauHinh_KhoanThu(me.strNhomId_KhoanThu, me.strKeHoachId_KhoanThu);
                    } else {
                        edu.system.alert(data.Message, "s");
                    }
                },
                error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        };

        if (typeof edu.system.confirm === "function") {
            edu.system.confirm("Bạn có chắc chắn muốn xóa khoản thu này?");
            $("#btnYes").off("click.delkhoanthu").on("click.delkhoanthu", fnXoa);
        } else if (window.confirm("Bạn có chắc chắn muốn xóa khoản thu này?")) {
            fnXoa();
        }
    },

    /* =================================================================
       NGÀNH ĐẦU RA — Xóa nhiều bản ghi
       PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DauRa
       ================================================================= */
    delete_NganhDauRa: function (arrIds) {
        var me = this;
        if (!arrIds || arrIds.length === 0) return;

        var iDone = 0, iOk = 0, iFail = 0;
        var arrFailMsg = [];
        var iTotal = arrIds.length;

        arrIds.forEach(function (strId) {
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/GS4gHg8JHgIgNAkoLykeFQIeDykuLB4FIDQTIAPP',
                'func': 'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DauRa',
                'iM': edu.system.iM,
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    iDone++;
                    if (data.Success) { iOk++; }
                    else { iFail++; arrFailMsg.push(strId + ": " + (data.Message || '')); }
                    if (iDone === iTotal) me._onDone_Xoa_NganhDauRa(iOk, iFail, arrFailMsg);
                },
                error: function (er) {
                    iDone++; iFail++;
                    arrFailMsg.push(strId + ": " + JSON.stringify(er));
                    if (iDone === iTotal) me._onDone_Xoa_NganhDauRa(iOk, iFail, arrFailMsg);
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        });
    },

    _onDone_Xoa_NganhDauRa: function (iOk, iFail, arrFailMsg) {
        var me = this;
        var strMsg = "Đã xóa " + iOk + " dòng thành công.";
        if (iFail > 0) {
            strMsg += " Thất bại " + iFail + " dòng.";
            if (arrFailMsg.length) console.warn("Xóa ngành đầu ra — chi tiết lỗi:", arrFailMsg);
        }
        edu.system.alert(strMsg, iFail > 0 ? "w" : "");
        // Reload lại bảng ngành đầu ra
        me.xem_CauHinh_NganhDauRa(me.strNhomId_NganhDauRa, me.strKeHoachId_NganhDauRa);
    },

    /* =================================================================
       THÊM NGÀNH ĐẦU RA VÀO NHÓM
       (1) Mở modal + load danh sách chương trình đầu ra của kế hoạch
       (2) User tick chọn → Lưu → duyệt từng bản ghi call Them_NH_CauHinh_TC_Nhom_DauRa
       ================================================================= */

    openModal_ThemNganhDauRa: function () {
        var me = this;
        // Tên+mã nhóm — gắn vào TITLE (badge) + sub-title
        var strLabel = me._getNhomLabel(me.strNhomId_NganhDauRa);
        $("#titleNhom_ThemNganhDauRa").text(strLabel);
        $("#lblNhomInfo_ThemNganhDauRa").text("Thêm ngành vào nhóm: " + strLabel);
        $("#txtTuKhoa_ThemNganhDauRa_HSNH").val("");
        $("#chkSelectAll_ThemNganhDauRa_HSNH").prop("checked", false).prop("indeterminate", false);
        // Reset state phân trang + selection mỗi lần mở modal
        me._pageThemNganh = 1;
        var _vTN = parseInt($("#pgSize_ThemNganh").val(), 10);
        me._pageSizeThemNganh = (_vTN === -1) ? 999999 : (_vTN || 20);
        me._selectedIds_ThemNganh = {};
        me.getList_KeHoachDauRa();
        $("#modalThemNganhDauRa_HSNH").modal("show");
    },

    /* Load DS chương trình đầu ra theo kế hoạch nhập học của nhóm hiện tại */
    getList_KeHoachDauRa: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeCiQJLiAiKR4FIDQTIAPP',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_DauRa',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtTuKhoa_ThemNganhDauRa_HSNH'),
            'strNH_KeHoach_NhapHoc_Id': me.strKeHoachId_NganhDauRa,
            'strDaoTao_HeDaoTao_Id': '',
            'strDaoTao_KhoaDaoTao_Id': '',
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_Nganh_DT_Id': '',
            'strDaoTao_Nganh_TS_Id': '',
            'strDauRa_Status_Code': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoachDauRa = data.Data || [];
                    me.genTable_KeHoachDauRa(me.dtKeHoachDauRa);
                    $("#chkSelectAll_ThemNganhDauRa_HSNH").prop("checked", false);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* Render bảng chương trình đầu ra để chọn — cột đúng theo Excel
       Client-side pagination + giữ state checkbox qua các trang */
    genTable_KeHoachDauRa: function (arr) {
        var me = this;
        var $tbody = $("#tblThemNganhDauRa_HSNH tbody");
        var $paging = $("#paging_ThemNganhDauRa_HSNH");
        $tbody.empty();

        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="9" class="td-center italic color-666">Không có chương trình đầu ra nào.</td></tr>');
            $paging.hide();
            me._syncHeaderChk_ThemNganh();
            return;
        }

        var pageSize = me._pageSizeThemNganh || 20;
        var totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
        if (!me._pageThemNganh || me._pageThemNganh > totalPages) me._pageThemNganh = totalPages;
        if (me._pageThemNganh < 1) me._pageThemNganh = 1;
        var page = me._pageThemNganh;
        var startIdx = (page - 1) * pageSize;
        var endIdx = Math.min(startIdx + pageSize, arr.length);

        var html = '';
        for (var i = startIdx; i < endIdx; i++) {
            var r = arr[i];
            var strId = r.ID || r.NH_KEHOACH_DAURA_ID || '';
            var strHe = r.HEDAOTAO_TEN || r.TENHEDAOTAO || '';
            var strKhoa = r.KHOADAOTAO_TEN || r.TENKHOA || '';
            var strMaNganhDT = r.NGANH_DT_MA || r.MA_NGANH_DT || '';
            var strMaNganhTS = r.NGANH_TS_MA || r.MA_NGANH_TS || '';
            var strNganhDT = me._mergeTenMa(r.NGANH_DT_TEN || r.TEN_NGANH_DT || '', strMaNganhDT);
            var strNganhTS = me._mergeTenMa(r.NGANH_TS_TEN || r.TEN_NGANH_TS || '', strMaNganhTS);
            var strKhoaQL = r.KHOAQUANLY_TEN || r.TEN_KHOAQUANLY || '';
            var strTenCT = r.CHUONGTRINH_TEN || r.TENCHUONGTRINH || '';
            var strMaCT = r.CHUONGTRINH_MA || r.MACHUONGTRINH || '';
            var strChuongTrinh = me._mergeTenMa(strTenCT, strMaCT);
            var strGhiChu = r.GHICHU || r.GHI_CHU || '';
            var checked = me._selectedIds_ThemNganh[strId] ? ' checked' : '';

            html += '<tr data-id="' + strId + '">';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + strHe + '</td>';
            html += '<td class="td-left">' + strKhoa + '</td>';
            html += '<td class="td-left">' + strNganhDT + '</td>';
            html += '<td class="td-left">' + strNganhTS + '</td>';
            html += '<td class="td-left">' + strKhoaQL + '</td>';
            html += '<td class="td-left">' + strChuongTrinh + '</td>';
            html += '<td class="td-left">' + strGhiChu + '</td>';
            html += '<td class="td-center"><input type="checkbox" class="chkThemNganhDauRa_HSNH" data-id="' + strId + '"' + checked + ' /></td>';
            html += '</tr>';
        }
        $tbody.append(html);

        $("#pgCur_ThemNganh").text(page);
        $("#pgTotal_ThemNganh").text(totalPages);
        $("#pgSum_ThemNganh").text(arr.length);
        $("#pgChecked_ThemNganh").text(Object.keys(me._selectedIds_ThemNganh).length);
        $paging.css('display', 'flex');
        me._renderPagingBtns_ThemNganh(page, totalPages);
        me._syncHeaderChk_ThemNganh();
    },

    _renderPagingBtns_ThemNganh: function (page, totalPages) {
        var $ul = $("#pgList_ThemNganh");
        $ul.empty();
        var add = function (label, target, disabled, active) {
            var cls = 'page-item';
            if (disabled) cls += ' disabled';
            if (active) cls += ' active';
            $ul.append('<li class="' + cls + '"><a class="page-link" href="javascript:;" data-page="' + target + '">' + label + '</a></li>');
        };
        add('«', 1, page === 1, false);
        add('‹', Math.max(1, page - 1), page === 1, false);
        var winSize = 5;
        var startP = Math.max(1, page - Math.floor(winSize / 2));
        var endP = Math.min(totalPages, startP + winSize - 1);
        startP = Math.max(1, endP - winSize + 1);
        for (var p = startP; p <= endP; p++) add(String(p), p, false, p === page);
        add('›', Math.min(totalPages, page + 1), page === totalPages, false);
        add('»', totalPages, page === totalPages, false);
    },

    // Đồng bộ header checkbox theo state _selectedIds (không chỉ page hiện tại)
    _syncHeaderChk_ThemNganh: function () {
        var me = this;
        var arr = me.dtKeHoachDauRa || [];
        var $chk = $("#chkSelectAll_ThemNganhDauRa_HSNH");
        if (arr.length === 0) {
            $chk.prop('checked', false).prop('indeterminate', false);
            return;
        }
        var checkedCount = Object.keys(me._selectedIds_ThemNganh).length;
        $chk.prop('checked', checkedCount === arr.length);
        $chk.prop('indeterminate', checkedCount > 0 && checkedCount < arr.length);
    },

    /* Duyệt từng bản ghi tick → call Them_NH_CauHinh_TC_Nhom_DauRa */
    save_ThemNganhDauRa: function (arrKeHoachDauRaIds) {
        var me = this;
        if (!arrKeHoachDauRaIds || arrKeHoachDauRaIds.length === 0) return;

        var iDone = 0, iOk = 0, iFail = 0;
        var arrFailMsg = [];
        var iTotal = arrKeHoachDauRaIds.length;

        arrKeHoachDauRaIds.forEach(function (strDauRaId) {
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/FSkkLB4PCR4CIDQJKC8pHhUCHg8pLiweBSA0EyAP',
                'func': 'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DauRa',
                'iM': edu.system.iM,
                'strNH_CauHinh_TC_Nhom_Id': me.strNhomId_NganhDauRa,
                'strNH_KeHoach_DauRa_Id': strDauRaId,
                'strGhiChu': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    iDone++;
                    if (data.Success) { iOk++; }
                    else { iFail++; arrFailMsg.push(strDauRaId + ": " + (data.Message || '')); }
                    if (iDone === iTotal) me._onDone_Them_NganhDauRa(iOk, iFail, arrFailMsg);
                },
                error: function (er) {
                    iDone++; iFail++;
                    arrFailMsg.push(strDauRaId + ": " + JSON.stringify(er));
                    if (iDone === iTotal) me._onDone_Them_NganhDauRa(iOk, iFail, arrFailMsg);
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        });
    },

    _onDone_Them_NganhDauRa: function (iOk, iFail, arrFailMsg) {
        var me = this;
        var strMsg = "Đã thêm " + iOk + " ngành thành công.";
        if (iFail > 0) {
            strMsg += " Thất bại " + iFail + " dòng.";
            if (arrFailMsg.length) console.warn("Thêm ngành đầu ra — chi tiết lỗi:", arrFailMsg);
        }
        edu.system.alert(strMsg, iFail > 0 ? "w" : "");
        $("#modalThemNganhDauRa_HSNH").modal("hide");
        // Reload bảng ngành đầu ra của nhóm
        me.xem_CauHinh_NganhDauRa(me.strNhomId_NganhDauRa, me.strKeHoachId_NganhDauRa);
    },

    /* =================================================================
       THÊM MỚI ĐỐI TƯỢNG vào nhóm đầu vào
       (dropdown QLSV.DOITUONG + ghi chú)
       PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DT
       ================================================================= */

    openModal_ThemDoiTuong: function () {
        var me = this;
        // Load combo QLSV.DOITUONG 1 lần
        if (!me.bLoadedCombo_DoiTuong) {
            try {
                edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG",
                    "dropDoiTuong_ThemDT_HSNH", "Chọn đối tượng");
                me.bLoadedCombo_DoiTuong = true;
            } catch (e) { console.warn("loadToCombo_DanhMucDuLieu QLSV.DOITUONG", e); }
        }
        edu.util.viewValById("dropDoiTuong_ThemDT_HSNH", "");
        $("#txtGhiChu_ThemDT_HSNH").val("");
        $("#modalThemDoiTuong_HSNH").modal("show");
    },

    save_ThemDoiTuong: function () {
        var me = this;
        var strDoiTuongId = edu.util.getValById('dropDoiTuong_ThemDT_HSNH');
        var strGhiChu = edu.util.getValById('txtGhiChu_ThemDT_HSNH');
        if (!strDoiTuongId) {
            edu.system.alert("Vui lòng chọn đối tượng.", "w");
            return;
        }
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/FSkkLB4PCR4CIDQJKC8pHhUCHg8pLiweBRUP',
            'func': 'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DT',
            'iM': edu.system.iM,
            'strNH_CauHinh_TC_Nhom_Id': me.strNhomId_DauVao,
            'strCore_Person_Id': '',
            'strDoi_Tuong_ApDung_Id': strDoiTuongId,
            'strGhiChu': strGhiChu,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm đối tượng thành công!");
                    $("#modalThemDoiTuong_HSNH").modal("hide");
                    me.xem_CauHinh_DauVao(me.strNhomId_DauVao, me.strKeHoachId_DauVao);
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    /* =================================================================
       TẠO MỨC PHÍ NHẬP HỌC CHO KẾ HOẠCH
       Bước 1: LayDSQLSV_NguoiHoc_TTTS — lấy toàn bộ thí sinh của KH
       Bước 2: Duyệt tuần tự → Gen_TaiChinh_PhaiNop_Intake cho từng bản ghi
       ================================================================= */

    taoMucPhi_ChoKeHoach: function () {
        var me = this;
        me._openModalProgress_GenMucPhi();
        me._setStatus_GenMucPhi("Đang tải danh sách thí sinh...");
        me._load_DSNguoiHoc_ForGen(function (arr) {
            if (!arr || arr.length === 0) {
                me._setStatus_GenMucPhi("Không có thí sinh nào để xử lý.");
                me._enableClose_GenMucPhi();
                return;
            }
            me._gen_MucPhi_Sequential(arr);
        });
    },

    /* Load all — dùng pageSize lớn để lấy 1 phát toàn bộ */
    _load_DSNguoiHoc_ForGen: function (callback) {
        var me = this;
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTaiChinh_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dDaNhapHoc': 0,
            'pageIndex': 1,
            'pageSize': 100000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    callback(arr);
                } else {
                    me._setStatus_GenMucPhi("Lỗi tải danh sách: " + (data.Message || ''));
                    me._enableClose_GenMucPhi();
                }
            },
            error: function (er) {
                me._setStatus_GenMucPhi("Lỗi tải danh sách (ex): " + JSON.stringify(er));
                me._enableClose_GenMucPhi();
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /* Duyệt tuần tự — mỗi bản ghi call Gen_TaiChinh_PhaiNop_Intake
       Sequential (không parallel) để tránh quá tải backend + giữ thứ tự log */
    _gen_MucPhi_Sequential: function (arr) {
        var me = this;
        var iTotal = arr.length;
        var iOk = 0, iFail = 0, iIdx = 0;
        $("#lblTotal_GenMucPhi_HSNH").text(iTotal);
        me._setStatus_GenMucPhi("Đang xử lý 0/" + iTotal + "...");

        var doNext = function () {
            if (iIdx >= iTotal) {
                me._setStatus_GenMucPhi("Hoàn tất: " + iOk + " thành công, " + iFail + " lỗi (tổng " + iTotal + ")");
                me._updateBar_GenMucPhi(100);
                me._enableClose_GenMucPhi();
                // Summary alert — user không phải nhìn kỹ trong progress modal mới biết kết quả
                var strSummary = "Đã hoàn tất tạo phí nhập học!"
                    + "\n• Tổng: " + iTotal + " thí sinh"
                    + "\n• Thành công: " + iOk
                    + "\n• Lỗi: " + iFail;
                if (iFail > 0) strSummary += "\n\n(Xem chi tiết lỗi trong log dưới progress modal)";
                setTimeout(function () {
                    edu.system.alert(strSummary, iFail > 0 ? 'w' : '');
                }, 300);
                return;
            }
            var row = arr[iIdx];
            var strPersonIntakeId = row.ID || row.CORE_PERSON_INTAKE_ID || row.Core_Person_Intake_Id || '';
            var strHoTen = ((row.HODEM || '') + ' ' + (row.TEN || '')).trim()
                        || row.HOTEN || row.HO_TEN || row.SOBAODANH || strPersonIntakeId;

            if (!strPersonIntakeId) {
                iFail++;
                me._appendLog_GenMucPhi((iIdx + 1) + '. ' + strHoTen + ' — bỏ qua: không có ID', true);
                iIdx++;
                me._updateProgress_GenMucPhi(iIdx, iTotal, iOk, iFail);
                doNext();
                return;
            }

            var obj_save = {
                'action': 'SV_CORE_NhapHoc_ThuTien_MH/BiQvHhUgKAIpKC8pHhEpICgPLjEeCC81ICok',
                'func': 'PKG_CORE_NhapHoc_ThuTien.Gen_TaiChinh_PhaiNop_Intake',
                'iM': edu.system.iM,
                'strCore_Person_Intake_Id': strPersonIntakeId,
                'dChayThu': 0,
                'dGhiLog': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNangThucHien_Id': edu.system.strChucNang_Id || ''
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        iOk++;
                        me._appendLog_GenMucPhi((iIdx + 1) + '. ' + strHoTen + ' — OK' + (data.Message ? ': ' + data.Message : ''), false);
                    } else {
                        iFail++;
                        me._appendLog_GenMucPhi((iIdx + 1) + '. ' + strHoTen + ' — LỖI: ' + (data.Message || ''), true);
                    }
                    iIdx++;
                    me._updateProgress_GenMucPhi(iIdx, iTotal, iOk, iFail);
                    doNext();
                },
                error: function (er) {
                    iFail++;
                    me._appendLog_GenMucPhi((iIdx + 1) + '. ' + strHoTen + ' — EX: ' + JSON.stringify(er), true);
                    iIdx++;
                    me._updateProgress_GenMucPhi(iIdx, iTotal, iOk, iFail);
                    doNext();
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        };
        doNext();
    },

    /* ---- Progress modal helpers ---- */
    _openModalProgress_GenMucPhi: function () {
        // Reset UI
        $("#lblTotal_GenMucPhi_HSNH").text('0');
        $("#lblOk_GenMucPhi_HSNH").text('0');
        $("#lblFail_GenMucPhi_HSNH").text('0');
        $("#zoneLog_GenMucPhi_HSNH").empty().hide();
        this._updateBar_GenMucPhi(0);
        // Disable close controls trong khi chạy
        $("#btnCloseX_GenMucPhi_HSNH").prop('disabled', true);
        $("#btnDong_GenMucPhi_HSNH").css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $("#modalGenMucPhi_HSNH").modal("show");
    },

    _setStatus_GenMucPhi: function (msg) {
        $("#lblStatus_GenMucPhi_HSNH").text(msg);
    },

    _updateProgress_GenMucPhi: function (iDone, iTotal, iOk, iFail) {
        var pct = iTotal > 0 ? Math.round(iDone * 100 / iTotal) : 0;
        this._updateBar_GenMucPhi(pct);
        $("#lblOk_GenMucPhi_HSNH").text(iOk);
        $("#lblFail_GenMucPhi_HSNH").text(iFail);
        this._setStatus_GenMucPhi("Đang xử lý " + iDone + "/" + iTotal + "...");
    },

    _updateBar_GenMucPhi: function (pct) {
        var $bar = $("#barGenMucPhi_HSNH");
        $bar.css('width', pct + '%').text(pct + '%');
    },

    _appendLog_GenMucPhi: function (msg, isError) {
        var $zone = $("#zoneLog_GenMucPhi_HSNH");
        if (!$zone.is(':visible')) $zone.show();
        var color = isError ? '#b91c1c' : '#475569';
        var esc = String(msg).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        $zone.append('<div style="color:' + color + '; padding:2px 0;">' + esc + '</div>');
        $zone.scrollTop($zone[0].scrollHeight);
    },

    _enableClose_GenMucPhi: function () {
        var me = this;
        $("#btnCloseX_GenMucPhi_HSNH").prop('disabled', false);
        $("#btnDong_GenMucPhi_HSNH").css({ 'pointer-events': 'auto', 'opacity': '1' });
        // Dừng animation của progress-bar khi hoàn tất
        $("#barGenMucPhi_HSNH").removeClass('progress-bar-animated');
        // Reload bảng nhóm định mức để user thấy dữ liệu mới (nếu có ảnh hưởng)
        if (me.strKeHoachNhapHoc_Id) me.getList_NhomDinhMuc();
        // Nếu luồng vừa chạy là "Tạo phí cho các dòng đã chọn" trong modal MucPhiDaGan
        // → reload lại list đó luôn để user thấy tổng phí cập nhật, clear selection.
        if (me._genFrom_MucPhiDaGan) {
            me._genFrom_MucPhiDaGan = false;
            me._selectedIds_MucPhiDaGan = {};
            $("#lblSelected_MucPhiDaGan_HSNH").text('0');
            if ($("#modalMucPhiDaGan_HSNH").hasClass('in') || $("#modalMucPhiDaGan_HSNH").hasClass('show')) {
                me.getList_MucPhiDaGan();
            }
        }
    },

    /* =================================================================
       XEM MỨC PHÍ ĐÃ GÁN CHO THÍ SINH
       PKG_CORE_NhapHoc_ThuTien.LayDSMucPhiDaGanNhapHoc
       ================================================================= */

    openModal_MucPhiDaGan: function () {
        var me = this;
        // Reset filter + cache mỗi lần mở
        $("#txtTuKhoa_MucPhiDaGan_HSNH").val('');
        $("#dropDaNhapHoc_MucPhiDaGan_HSNH").val('0');
        $("#txtTongTu_MucPhiDaGan_HSNH").val('');
        $("#txtTongDen_MucPhiDaGan_HSNH").val('');
        me._pageIndex_MucPhiDaGan = 1;
        var _vMP = parseInt($("#pgSize_MucPhiDaGan").val(), 10);
        me._pageSize_MucPhiDaGan = (_vMP === -1) ? 999999 : (_vMP || 50);
        me.dtMucPhiDaGan_All = [];
        me._filtered_MucPhiDaGan = [];
        me.dtMucPhiDaGan = [];
        me._total_MucPhiDaGan = 0;
        me._selectedIds_MucPhiDaGan = {};
        $("#chkSelectAll_MucPhiDaGan_HSNH").prop('checked', false).prop('indeterminate', false);
        $("#lblSelected_MucPhiDaGan_HSNH").text('0');
        $("#modalMucPhiDaGan_HSNH").modal("show");
        me.getList_MucPhiDaGan();
    },

    /*
     * Load ALL rows 1 phát (pageSize=100000) → cache vào dtMucPhiDaGan_All.
     * Keyword + range tổng phí: lọc CLIENT-side qua _applyFilter_MucPhiDaGan (instant).
     * dDaNhapHoc: giữ server-side (không rõ field FE để lọc), đổi giá trị → gọi lại hàm này.
     * Precedent: _load_DSNguoiHoc_ForGen cũng dùng pageSize=100000 cho cùng KH.
     */
    getList_MucPhiDaGan: function () {
        var me = this;
        var $tbody = $("#tblMucPhiDaGan_HSNH tbody");
        $tbody.html('<tr><td colspan="13" class="td-center italic color-666 py-3">Đang tải dữ liệu...</td></tr>');
        // Reset sums về 0 khi bắt đầu load (tfoot luôn hiển thị)
        $("#sumTongPhi_MucPhiDaGan").text('0');
        $("#sumTongDaNop_MucPhiDaGan").text('0');
        $("#paging_MucPhiDaGan_HSNH").attr('style', 'gap:10px; display:none;');

        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIMNCIRKSgFIAYgLw8pIDEJLiIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSMucPhiDaGanNhapHoc',
            'iM': edu.system.iM,
            'strTuKhoa': '',                          // Load tất cả — keyword lọc client-side
            'strTaiChinh_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dDaNhapHoc': parseInt($("#dropDaNhapHoc_MucPhiDaGan_HSNH").val(), 10) || 0,
            'pageIndex': 1,
            'pageSize': 100000                        // Tải hết 1 phát
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMucPhiDaGan_All = edu.util.checkValue(data.Data) ? data.Data : [];
                    me._pageIndex_MucPhiDaGan = 1;
                    me._applyFilter_MucPhiDaGan();
                } else {
                    edu.system.alert(data.Message || "LayDSMucPhiDaGanNhapHoc: lỗi", "w");
                }
            },
            error: function (er) {
                edu.system.alert("LayDSMucPhiDaGanNhapHoc (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*
     * Apply filter client-side (keyword + range tổng phí) → set _filtered_MucPhiDaGan,
     * reset về trang 1, gọi renderCurrentPage.
     * Được trigger bởi: input keyword, thay đổi ô Từ/Đến, nút Lọc/Xóa, sau khi load xong.
     */
    /* Parse chuỗi tiền do user gõ (cho phép '.', ',', space) → số nguyên hoặc null.
       Dùng type="text" + inputmode="numeric" để cho phép gõ "17.690.000" tự nhiên
       (type="number" bị lỗi locale VN: "." bị hiểu là dấu thập phân). */
    _parseTien_MucPhi: function (s) {
        if (s == null) return null;
        var digits = String(s).replace(/[^0-9]/g, '');
        if (!digits) return null;
        var n = Number(digits);
        return isNaN(n) ? null : n;
    },

    _applyFilter_MucPhiDaGan: function () {
        var me = this;
        var arr = me.dtMucPhiDaGan_All || [];

        var strKw = String($("#txtTuKhoa_MucPhiDaGan_HSNH").val() || '').trim().toLowerCase();
        var nTu = me._parseTien_MucPhi($("#txtTongTu_MucPhiDaGan_HSNH").val());
        var nDen = me._parseTien_MucPhi($("#txtTongDen_MucPhiDaGan_HSNH").val());

        var pick = function (row) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (row[k] != null && row[k] !== '') return row[k];
            }
            return '';
        };

        var filtered = arr.filter(function (r) {
            // Range tổng phí
            if (nTu !== null || nDen !== null) {
                var vTong = pick(r, 'TONGMUCPHI', 'TongMucPhi', 'TONG_MUC_PHI');
                var nTong = (vTong === '' || vTong == null || isNaN(vTong)) ? 0 : Number(vTong);
                if (nTu !== null && nTong < nTu) return false;
                if (nDen !== null && nTong > nDen) return false;
            }
            // Keyword: search trên các cột hiển thị chính (giữ đồng bộ placeholder)
            if (strKw) {
                var s1 = String(pick(r, 'IDENTIFIER_NO', 'Identifier_No', 'CCCD') || '').toLowerCase();
                var s2 = String(pick(r, 'CURRENT_EMPLOYEE_CODE', 'Current_Employee_Code', 'MASO', 'MA_SO') || '').toLowerCase();
                var s3 = String(pick(r, 'FULL_NAME', 'Full_Name', 'HOTEN', 'HO_TEN') || '').toLowerCase();
                var s4 = String(pick(r, 'DAOTAO_NGANH_TS_TEN', 'DaoTao_Nganh_TS_Ten', 'NGANH_TS_TEN', 'TEN_NGANH_TS') || '').toLowerCase();
                var s5 = String(pick(r, 'TENCHUONGTRINH', 'TenChuongTrinh', 'TEN_CHUONGTRINH') || '').toLowerCase();
                var hit = s1.indexOf(strKw) >= 0
                       || s2.indexOf(strKw) >= 0
                       || s3.indexOf(strKw) >= 0
                       || s4.indexOf(strKw) >= 0
                       || s5.indexOf(strKw) >= 0;
                if (!hit) return false;
            }
            return true;
        });

        me._filtered_MucPhiDaGan = filtered;
        me._total_MucPhiDaGan = filtered.length;
        me._pageIndex_MucPhiDaGan = 1;
        me._renderCurrentPage_MucPhiDaGan();
    },

    /* Sync header checkbox theo state _selectedIds (không chỉ page hiện tại — dựa trên toàn bộ filtered) */
    _syncHeaderChk_MucPhiDaGan: function () {
        var me = this;
        var arr = me._filtered_MucPhiDaGan || [];
        var $chk = $("#chkSelectAll_MucPhiDaGan_HSNH");
        if (arr.length === 0) {
            $chk.prop('checked', false).prop('indeterminate', false);
            return;
        }
        var checkedCount = Object.keys(me._selectedIds_MucPhiDaGan).length;
        $chk.prop('checked', checkedCount === arr.length);
        $chk.prop('indeterminate', checkedCount > 0 && checkedCount < arr.length);
    },

    /* Update badge "Đã chọn: X" */
    _updateCount_MucPhiDaGan: function () {
        var n = Object.keys(this._selectedIds_MucPhiDaGan || {}).length;
        $("#lblSelected_MucPhiDaGan_HSNH").text(n);
    },

    /* Slice _filtered theo trang hiện tại → set dtMucPhiDaGan → genTable + renderPaging */
    _renderCurrentPage_MucPhiDaGan: function () {
        var me = this;
        var arr = me._filtered_MucPhiDaGan || [];
        var pageSize = me._pageSize_MucPhiDaGan || 50;
        var totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
        if (me._pageIndex_MucPhiDaGan > totalPages) me._pageIndex_MucPhiDaGan = totalPages;
        if (me._pageIndex_MucPhiDaGan < 1) me._pageIndex_MucPhiDaGan = 1;
        var startIdx = (me._pageIndex_MucPhiDaGan - 1) * pageSize;
        var endIdx = Math.min(startIdx + pageSize, arr.length);
        me.dtMucPhiDaGan = arr.slice(startIdx, endIdx);
        me.genTable_MucPhiDaGan(me.dtMucPhiDaGan);
        me._renderPaging_MucPhiDaGan();
    },

    /* Render bảng — tolerant về field name (viết hoa / gạch dưới đều nhận) */
    genTable_MucPhiDaGan: function (arr) {
        var me = this;
        var $tbody = $("#tblMucPhiDaGan_HSNH tbody");
        $tbody.empty();
        $("#lblTong_MucPhiDaGan_HSNH").text(me._total_MucPhiDaGan || 0);

        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="13" class="td-center italic color-666 py-3">Không tìm thấy dữ liệu</td></tr>');
            $("#sumTongPhi_MucPhiDaGan").text('0');
            $("#sumTongDaNop_MucPhiDaGan").text('0');
            return;
        }

        // Debug 1 lần / phiên: log các key của row đầu để confirm tên field "TongSoTienDaNop"
        // và auto-detect nếu alias hiện tại không khớp. Chỉ log khi chưa dump lần nào để
        // tránh spam console khi user paging/filter.
        if (!me._dumpedKeys_MucPhiDaGan) {
            me._dumpedKeys_MucPhiDaGan = true;
            var keys0 = Object.keys(arr[0] || {});
            try { console.log('[MucPhiDaGan] row keys:', keys0); } catch (e) {}
            // Auto-detect field TongSoTienDaNop nếu tất cả alias hard-coded fail
            var hits = keys0.filter(function (k) {
                var kn = String(k).toLowerCase().replace(/[_\-\s]/g, '');
                return kn.indexOf('danop') >= 0 || kn.indexOf('dathu') >= 0 || kn.indexOf('thutien') >= 0;
            });
            if (hits.length) {
                try { console.log('[MucPhiDaGan] candidates cho "đã nộp":', hits); } catch (e) {}
                me._extraAlias_TongDaNop = hits;   // fallback list dùng bên dưới
            }
        }

        // Helper get first non-empty
        var pick = function (row) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (row[k] != null && row[k] !== '') return row[k];
            }
            return '';
        };
        var fmtNum = function (v) {
            if (v === '' || v == null || isNaN(v)) return v || '';
            return Number(v).toLocaleString('vi-VN');
        };
        var esc = function (v) {
            return String(v == null ? '' : v).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };

        var stt_start = ((me._pageIndex_MucPhiDaGan || 1) - 1) * (me._pageSize_MucPhiDaGan || 50);
        var html = '';
        arr.forEach(function (r, i) {
            var strId = pick(r, 'ID', 'CORE_PERSON_INTAKE_ID', 'Core_Person_Intake_Id');
            var strCCCD = pick(r, 'IDENTIFIER_NO', 'Identifier_No', 'CCCD');
            var strMa = pick(r, 'CURRENT_EMPLOYEE_CODE', 'Current_Employee_Code', 'MASO', 'MA_SO');
            var strHoTen = pick(r, 'FULL_NAME', 'Full_Name', 'HOTEN', 'HO_TEN');
            var strGioiTinh = pick(r, 'GENDER_TEN', 'Gender_Ten', 'GIOITINH_TEN');
            var strNgaySinh = pick(r, 'DATE_OF_BIRTH', 'Date_Of_Birth', 'NGAYSINH');
            var strNganh = pick(r, 'DAOTAO_NGANH_TS_TEN', 'DaoTao_Nganh_TS_Ten', 'NGANH_TS_TEN', 'TEN_NGANH_TS');
            var strTenCT = pick(r, 'TENCHUONGTRINH', 'TenChuongTrinh', 'TEN_CHUONGTRINH');
            var strMaCT = pick(r, 'MACHUONGTRINH', 'MaChuongTrinh', 'MA_CHUONGTRINH');
            var strCT = strTenCT + (strMaCT ? ' (' + strMaCT + ')' : '');
            var strLop = pick(r, 'LOPQUANLY_TEN', 'LopQuanLy_Ten', 'LOP_QUANLY_TEN');
            var strThongTin = pick(r, 'THONGTINMUCPHI', 'ThongTinMucPhi', 'THONG_TIN_MUC_PHI');
            var strTong = pick(r, 'TONGMUCPHI', 'TongMucPhi', 'TONG_MUC_PHI');
            var strTongDaNop = me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu');
            if ((strTongDaNop === '' || strTongDaNop == null) && me._extraAlias_TongDaNop) {
                for (var _i = 0; _i < me._extraAlias_TongDaNop.length; _i++) {
                    var _k = me._extraAlias_TongDaNop[_i];
                    if (r[_k] != null && r[_k] !== '') { strTongDaNop = r[_k]; break; }
                }
            }
            var strGhiChu = pick(r, 'GHICHU', 'GhiChu', 'GHI_CHU');

            var dataAttrs = 'data-id="' + esc(strId)
                          + '" data-hoten="' + esc(strHoTen)
                          + '" data-ma="' + esc(strMa) + '"';

            html += '<tr data-id="' + esc(strId) + '">';
            html += '<td class="td-center">' + (stt_start + i + 1) + '</td>';
            html += '<td class="td-left">' + esc(strCCCD) + '</td>';
            html += '<td class="td-left">' + esc(strMa) + '</td>';
            html += '<td class="td-left">' + esc(strHoTen) + '</td>';
            html += '<td class="td-center">' + esc(strGioiTinh) + '</td>';
            html += '<td class="td-center">' + esc(strNgaySinh) + '</td>';
            html += '<td class="td-left">' + esc(strNganh) + '</td>';
            html += '<td class="td-left">' + esc(strCT) + '</td>';
            html += '<td class="td-left">' + esc(strLop) + '</td>';
            html += '<td class="td-left">' + esc(strThongTin) + '</td>';
            html += '<td class="td-right">'
                +    '<span style="font-weight:600;">' + esc(fmtNum(strTong)) + '</span>'
                +    '&nbsp;&nbsp;<a class="kmp-link-xem btnSua_MucPhi_Row" ' + dataAttrs + '>'
                +      '<i class="fa fa-pencil"></i> Sửa'
                +    '</a>'
                + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(strTongDaNop)) + '</td>';
            html += '<td class="td-left">' + esc(strGhiChu) + '</td>';
            html += '</tr>';
        });
        $tbody.append(html);

        // Đồng bộ width scroll-top với scrollWidth thực tế của bảng (an toàn hơn hardcode 2200px)
        setTimeout(function () {
            var w = $("#tblMucPhiDaGan_HSNH")[0].scrollWidth;
            $("#scrollTop_MucPhiDaGan_HSNH .kmp-scroll-top-inner").css("width", w + "px");
        }, 0);

        // Sum "Tổng phí phải nộp" + "Tổng phí đã nộp" trên TOÀN BỘ bộ lọc
        var sumTong = 0, sumDaNop = 0;
        var arrSum = me._filtered_MucPhiDaGan && me._filtered_MucPhiDaGan.length ? me._filtered_MucPhiDaGan : arr;
        arrSum.forEach(function (r) {
            var v = pick(r, 'TONGMUCPHI', 'TongMucPhi', 'TONG_MUC_PHI');
            if (v !== '' && v != null && !isNaN(v)) sumTong += Number(v);
            var v2 = me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu');
            if ((v2 === '' || v2 == null) && me._extraAlias_TongDaNop) {
                for (var _k = 0; _k < me._extraAlias_TongDaNop.length; _k++) {
                    var _key = me._extraAlias_TongDaNop[_k];
                    if (r[_key] != null && r[_key] !== '') { v2 = r[_key]; break; }
                }
            }
            if (v2 !== '' && v2 != null && !isNaN(v2)) sumDaNop += Number(v2);
        });
        $("#sumTongPhi_MucPhiDaGan").text(me._fmtNumVN(sumTong));
        $("#sumTongDaNop_MucPhiDaGan").text(me._fmtNumVN(sumDaNop));
    },

    /* Server-side pagination — render nút phân trang */
    _renderPaging_MucPhiDaGan: function () {
        var me = this;
        var total = me._total_MucPhiDaGan || 0;
        var pageSize = me._pageSize_MucPhiDaGan || 50;
        var page = me._pageIndex_MucPhiDaGan || 1;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (page > totalPages) { page = totalPages; me._pageIndex_MucPhiDaGan = page; }

        $("#pgCur_MucPhiDaGan").text(page);
        $("#pgTotal_MucPhiDaGan").text(totalPages);
        $("#pgSum_MucPhiDaGan").text(total);
        $("#paging_MucPhiDaGan_HSNH").attr('style', 'gap:10px; display:flex;');

        var $ul = $("#pgList_MucPhiDaGan");
        $ul.empty();
        var add = function (label, target, disabled, active) {
            var cls = 'page-item';
            if (disabled) cls += ' disabled';
            if (active) cls += ' active';
            $ul.append('<li class="' + cls + '"><a class="page-link" href="javascript:;" data-page="' + target + '">' + label + '</a></li>');
        };
        add('«', 1, page === 1, false);
        add('‹', Math.max(1, page - 1), page === 1, false);
        var winSize = 5;
        var startP = Math.max(1, page - Math.floor(winSize / 2));
        var endP = Math.min(totalPages, startP + winSize - 1);
        startP = Math.max(1, endP - winSize + 1);
        for (var p = startP; p <= endP; p++) add(String(p), p, false, p === page);
        add('›', Math.min(totalPages, page + 1), page === totalPages, false);
        add('»', totalPages, page === totalPages, false);
    },

    /* Xuất Excel: toàn bộ list đang lọc (_filtered_MucPhiDaGan), không giới hạn theo trang.
       Lib: XLSX (SheetJS) — load lazy từ 3 CDN fallback trong khaimucphinhaphoc.html. */
    _xuatExcel_MucPhiDaGan: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel (XLSX) chưa được nạp.", "w");
            return;
        }
        var arr = (me._filtered_MucPhiDaGan && me._filtered_MucPhiDaGan.length)
                    ? me._filtered_MucPhiDaGan
                    : (me.dtMucPhiDaGan_All || []);
        if (!arr || arr.length === 0) {
            edu.system.alert("Không có dữ liệu để xuất.", "w");
            return;
        }
        var pick = function (row) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (row[k] != null && row[k] !== '') return row[k];
            }
            return '';
        };
        var toNum = function (v) {
            if (v === '' || v == null || isNaN(v)) return '';
            return Number(v);
        };

        var header = [
            'STT', 'CCCD', 'Mã số', 'Họ tên', 'Giới tính', 'Ngày sinh',
            'Ngành nhập học', 'Chương trình nhập học', 'Lớp chính thức',
            'Thông tin mức phí nhập học',
            'Tổng phí phải nộp', 'Tổng phí đã nộp',
            'Ghi chú'
        ];
        var aoa = [header];
        arr.forEach(function (r, i) {
            var strTenCT = pick(r, 'TENCHUONGTRINH', 'TenChuongTrinh', 'TEN_CHUONGTRINH');
            var strMaCT = pick(r, 'MACHUONGTRINH', 'MaChuongTrinh', 'MA_CHUONGTRINH');
            aoa.push([
                i + 1,
                pick(r, 'IDENTIFIER_NO', 'Identifier_No', 'CCCD'),
                pick(r, 'CURRENT_EMPLOYEE_CODE', 'Current_Employee_Code', 'MASO', 'MA_SO'),
                pick(r, 'FULL_NAME', 'Full_Name', 'HOTEN', 'HO_TEN'),
                pick(r, 'GENDER_TEN', 'Gender_Ten', 'GIOITINH_TEN'),
                pick(r, 'DATE_OF_BIRTH', 'Date_Of_Birth', 'NGAYSINH'),
                pick(r, 'DAOTAO_NGANH_TS_TEN', 'DaoTao_Nganh_TS_Ten', 'NGANH_TS_TEN', 'TEN_NGANH_TS'),
                strTenCT + (strMaCT ? ' (' + strMaCT + ')' : ''),
                pick(r, 'LOPQUANLY_TEN', 'LopQuanLy_Ten', 'LOP_QUANLY_TEN'),
                pick(r, 'THONGTINMUCPHI', 'ThongTinMucPhi', 'THONG_TIN_MUC_PHI'),
                toNum(pick(r, 'TONGMUCPHI', 'TongMucPhi', 'TONG_MUC_PHI')),
                toNum(me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu')),
                pick(r, 'GHICHU', 'GhiChu', 'GHI_CHU')
            ]);
        });

        var ws = XLSX.utils.aoa_to_sheet(aoa);
        // Set column widths (approximate)
        ws['!cols'] = [
            { wch: 5 }, { wch: 14 }, { wch: 12 }, { wch: 26 }, { wch: 10 }, { wch: 12 },
            { wch: 28 }, { wch: 34 }, { wch: 18 }, { wch: 36 },
            { wch: 16 }, { wch: 16 }, { wch: 24 }
        ];
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'MucPhiDaGan');

        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                  + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
        var fname = 'MucPhiDaGan_' + arr.length + 'rec_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
    },

    /* =================================================================
       CHI TIẾT các khoản phải nộp của 1 thí sinh (khi bấm "Sửa" trên Tổng phí)
       PKG_CORE_NhapHoc_ThuTien.LayDS_PhaiNop_TheoIntake
       ================================================================= */

    xem_ChiTiet_PhaiNop: function (strIntakeId, strHoTen, strMa) {
        var me = this;
        if (!strIntakeId) { edu.system.alert("Không xác định được thí sinh.", "w"); return; }
        var lbl = strHoTen || '';
        if (strMa) lbl += (lbl ? ' — ' : '') + 'Mã: ' + strMa;
        $("#lblSVInfo_PhaiNop_HSNH").text(lbl);
        $("#tblPhaiNop_ChiTiet_HSNH tbody").html(
            '<tr><td colspan="8" class="td-center italic color-666 py-3">Đang tải...</td></tr>'
        );
        $("#modalPhaiNop_ChiTiet_HSNH").modal("show");

        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIeESkgKA8uMR4VKSQuCC81ICok',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDS_PhaiNop_TheoIntake',
            'iM': edu.system.iM,
            'strCore_Person_Intake_Id': strIntakeId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_PhaiNop_ChiTiet(arr);
                } else {
                    edu.system.alert(data.Message || "LayDS_PhaiNop_TheoIntake: lỗi", "w");
                    $("#tblPhaiNop_ChiTiet_HSNH tbody").html(
                        '<tr><td colspan="8" class="td-center italic color-666 py-3">Lỗi tải dữ liệu</td></tr>'
                    );
                }
            },
            error: function (er) {
                edu.system.alert("LayDS_PhaiNop_TheoIntake (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save
        }, false, false, false, null);
    },

    genTable_PhaiNop_ChiTiet: function (arr) {
        var me = this;
        var $tbody = $("#tblPhaiNop_ChiTiet_HSNH tbody");
        $tbody.empty();
        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="8" class="td-center italic color-666 py-3">Chưa có khoản phải nộp nào</td></tr>');
            return;
        }
        var pick = function (row) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (row[k] != null && row[k] !== '') return row[k];
            }
            return '';
        };
        var fmtNum = function (v) {
            if (v === '' || v == null || isNaN(v)) return v || '';
            return Number(v).toLocaleString('vi-VN');
        };
        var esc = function (v) {
            return String(v == null ? '' : v).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };

        // Lookup đơn vị tính từ cache DM (dtDM_DonViTien) nếu chỉ trả về MA
        var lookupDM = function (code) {
            if (!code) return '';
            var dmArr = me.dtDM_DonViTien || [];
            for (var j = 0; j < dmArr.length; j++) {
                if (dmArr[j].MA === code) return dmArr[j].TEN || code;
            }
            return code;
        };

        var html = '';
        arr.forEach(function (r, i) {
            var strTen = pick(r, 'TEN_KHOAN', 'KHOAN_TEN', 'KHOANTHU_TEN', 'TEN_HIEN_THI', 'TEN');
            var strMa = pick(r, 'MA_KHOAN', 'KHOAN_MA', 'KHOANTHU_MA', 'MA');
            var vPhaiNop = pick(r, 'SO_TIEN_PHAI_NOP', 'SO_TIEN_PHAINOP', 'PHAI_NOP', 'SO_TIEN', 'SO_TIEN_DINH_MUC');
            var vDaNop = pick(r, 'SO_TIEN_DA_NOP', 'DA_NOP', 'SO_DA_NOP');
            var vConLai = pick(r, 'SO_TIEN_CON_NOP', 'CON_PHAI_NOP', 'SO_CON_NOP', 'CON_LAI');
            if ((vConLai === '' || vConLai == null) && vPhaiNop !== '' && vDaNop !== '') {
                var n1 = Number(vPhaiNop) || 0;
                var n2 = Number(vDaNop) || 0;
                vConLai = n1 - n2;
            }
            var strDVMa = pick(r, 'DON_VI_TIEN_MA', 'DON_VI_TIEN_ID', 'DVT_MA', 'DVT');
            var strDV = lookupDM(strDVMa) || pick(r, 'DON_VI_TIEN_TEN', 'DVT_TEN') || strDVMa;
            var strGhiChu = pick(r, 'GHICHU', 'GHI_CHU');

            html += '<tr>';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td class="td-left">' + esc(strTen) + '</td>';
            html += '<td class="td-left">' + esc(strMa) + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(vPhaiNop)) + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(vDaNop)) + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(vConLai)) + '</td>';
            html += '<td class="td-center">' + esc(strDV) + '</td>';
            html += '<td class="td-left">' + esc(strGhiChu) + '</td>';
            html += '</tr>';
        });
        $tbody.append(html);
    },

    /* -----------------------------------------------------------------
       [Đông Á] Danh sách nhập học & thu tiền
       PKG_CORE_NhapHoc_ThuTien.LayDSThiSinhNhapHoc
       Load-all-once + client-side filter/paging (sum "toàn bộ" chính xác).
       ----------------------------------------------------------------- */
    openModal_DSNHTT: function () {
        var me = this;
        me._pageIndex_DSNHTT = 1;
        $("#txtTuKhoa_DSNHTT_HSNH").val('');
        $("#dropDaNhapHoc_DSNHTT_HSNH").val('0');
        // Nếu _pageSize là mock "Tất cả" (>= 999999) → chọn option value="-1", ngược lại giữ nguyên
        $("#pgSize_DSNHTT").val(me._pageSize_DSNHTT >= 100000 ? '-1' : String(me._pageSize_DSNHTT));
        $("#lblTong_DSNHTT_HSNH").text('0');
        $("#tblDSNHTT_HSNH tbody").html(
            '<tr><td colspan="12" class="td-center italic color-666 py-3">Đang tải dữ liệu...</td></tr>'
        );
        $("#paging_DSNHTT_HSNH").attr('style', 'gap:10px; display:none;');
        $("#modalDSNHTT_HSNH").modal("show");
        me.getList_DSNHTT();
    },

    /* Load TOÀN BỘ 1 lần (pageSize=100000, dDaNhapHoc=0 để lấy hết) → cache dtDSNHTT_All.
       Sau đó filter client-side (keyword + tình trạng). Filter/paging về sau chỉ dùng cache. */
    getList_DSNHTT: function () {
        var me = this;
        var $tbody = $("#tblDSNHTT_HSNH tbody");
        $tbody.html('<tr><td colspan="12" class="td-center italic color-666 py-3">Đang tải dữ liệu...</td></tr>');
        $("#paging_DSNHTT_HSNH").attr('style', 'gap:10px; display:none;');

        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIVKSgSKC8pDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSThiSinhNhapHoc',
            'iM': edu.system.iM,
            'strTuKhoa': '',                                       // Load tất cả — keyword lọc client-side
            'strTaiChinh_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dDaNhapHoc': 0,                                        // Load tất cả — tình trạng lọc client-side
            'pageIndex': 1,
            'pageSize': 100000                                      // Tải hết 1 phát
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDSNHTT_All = edu.util.checkValue(data.Data) ? data.Data : [];
                    me._pageIndex_DSNHTT = 1;
                    me._applyFilter_DSNHTT();
                } else {
                    edu.system.alert(data.Message || "LayDSThiSinhNhapHoc: lỗi", "w");
                    $tbody.html('<tr><td colspan="12" class="td-center italic color-666 py-3">Lỗi tải dữ liệu</td></tr>');
                }
            },
            error: function (er) {
                edu.system.alert("LayDSThiSinhNhapHoc (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /* Apply filter client-side (keyword + dDaNhapHoc) → _filtered_DSNHTT + sum toàn bộ → render page 1 */
    _applyFilter_DSNHTT: function () {
        var me = this;
        var arr = me.dtDSNHTT_All || [];
        var strKw = String($("#txtTuKhoa_DSNHTT_HSNH").val() || '').trim().toLowerCase();
        var iDaNH = parseInt($("#dropDaNhapHoc_DSNHTT_HSNH").val(), 10) || 0;

        var filtered = arr.filter(function (r) {
            // Filter tình trạng "Đã nhập học" (1 = chỉ đã nhập học, 0 = tất cả)
            if (iDaNH === 1) {
                var iCreated = Number(me._pickCI(r, 'IsStudyCreated', 'DaNhapHoc', 'IsNhapHoc') || 0);
                if (iCreated !== 1) return false;
            }
            // Filter keyword: CCCD / Mã số / Họ tên
            if (strKw) {
                var s1 = String(me._pickCI(r, 'IdentifierNo', 'CCCD') || '').toLowerCase();
                var s2 = String(me._pickCI(r, 'CurrentEmployeeCode', 'MaSo') || '').toLowerCase();
                var s3 = String(me._pickCI(r, 'FullName', 'HoTen') || '').toLowerCase();
                if (s1.indexOf(strKw) < 0 && s2.indexOf(strKw) < 0 && s3.indexOf(strKw) < 0) return false;
            }
            return true;
        });

        me._filtered_DSNHTT = filtered;
        me._total_DSNHTT = filtered.length;
        $("#lblTong_DSNHTT_HSNH").text(me._total_DSNHTT);

        // Compute sum TOÀN BỘ filtered (không phải chỉ trang hiện tại) — user yêu cầu sum chuẩn
        var sumTong = 0, sumDaNop = 0;
        filtered.forEach(function (r) {
            var v = me._pickCI(r, 'TONGMUCPHI', 'TongMucPhi', 'TongPhaiNop', 'TongTienPhaiNop');
            if (v !== '' && v != null && !isNaN(v)) sumTong += Number(v);
            var v2 = me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu');
            if (v2 !== '' && v2 != null && !isNaN(v2)) sumDaNop += Number(v2);
        });
        me._sumTongPhaiNop_DSNHTT = sumTong;
        me._sumDaNop_DSNHTT = sumDaNop;

        me._pageIndex_DSNHTT = 1;
        me._renderCurrentPage_DSNHTT();
    },

    /* Slice _filtered theo trang hiện tại → render + update paging + update top sum row */
    _renderCurrentPage_DSNHTT: function () {
        var me = this;
        var arr = me._filtered_DSNHTT || [];
        var pageSize = me._pageSize_DSNHTT || 50;
        var totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
        if (me._pageIndex_DSNHTT > totalPages) me._pageIndex_DSNHTT = totalPages;
        var start = (me._pageIndex_DSNHTT - 1) * pageSize;
        var slice = arr.slice(start, start + pageSize);
        me.dtDSNHTT = slice;
        me.genTable_DSNHTT(slice);
        me._renderPaging_DSNHTT();
    },

    genTable_DSNHTT: function (arr) {
        var me = this;
        var $tbody = $("#tblDSNHTT_HSNH tbody");
        $tbody.empty();
        if (!arr || arr.length === 0) {
            $tbody.append('<tr><td colspan="13" class="td-center italic color-666 py-3">Không có dữ liệu</td></tr>');
            $("#sumTongPhaiNop_DSNHTT").text('0');
            $("#sumDaNop_DSNHTT").text('0');
            return;
        }
        // Debug 1 lần: dump keys row đầu để confirm tên field trong response
        if (!me._dumpedKeys_DSNHTT) {
            me._dumpedKeys_DSNHTT = true;
            try { console.log('[DSNHTT] row keys:', Object.keys(arr[0] || {})); } catch (e) {}
        }
        var pick = function (row) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (row[k] != null && row[k] !== '') return row[k];
            }
            return '';
        };
        var fmtNum = function (v) {
            if (v === '' || v == null || isNaN(v)) return v || '';
            return Number(v).toLocaleString('vi-VN');
        };
        var esc = function (v) {
            return String(v == null ? '' : v).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };

        var pageSize = this._pageSize_DSNHTT || 50;
        var pageIdx = this._pageIndex_DSNHTT || 1;
        var sttBase = (pageIdx - 1) * pageSize;

        var html = '';
        arr.forEach(function (r, i) {
            var strCCCD = me._pickCI(r, 'IdentifierNo', 'CCCD');
            var strMaSo = me._pickCI(r, 'CurrentEmployeeCode', 'MaSo');
            var strHoTen = me._pickCI(r, 'FullName', 'HoTen');
            var strSDT = me._pickCI(r, 'SoDienThoaiCaNhan', 'SoDienThoai', 'DienThoaiCaNhan', 'DienThoai', 'Phone', 'Mobile');
            var strGT = me._pickCI(r, 'GenderTen', 'GioiTinhTen', 'GioiTinh', 'Gender');
            var strNgSinh = me._pickCI(r, 'DateOfBirth', 'NgaySinhStr', 'NgaySinh');
            var strNganh = me._pickCI(r, 'DaoTaoNganhTsTen', 'NganhTsTen', 'TenNganhTs', 'NganhTen');
            var strCT = me._pickCI(r, 'TenChuongTrinh', 'TenCT', 'ChuongTrinhTen', 'DaoTaoToChucChuongTrinhTen');
            var strLop = me._pickCI(r, 'LopQuanLyTen', 'TenLop', 'LopTen', 'LopCtTen', 'LopChinhThucTen');
            // ẨN cột "Đã nhập học" — giữ biến để dễ mở lại sau
            // var iDaNH = Number(me._pickCI(r, 'DaNhapHoc', 'IsNhapHoc', 'IsStudyCreated') || 0);
            var vTongPhaiNop = me._pickCI(r, 'TONGMUCPHI', 'TongMucPhi', 'TongPhaiNop', 'TongTienPhaiNop');
            var vDaNop = me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu');
            var vNgayNop = me._pickCI(r, 'NgayNop', 'NgayThuTien', 'NgayThu', 'NgayNopGanNhat', 'NgayNopCuoi');
            // ẨN cột "Còn phải nộp" — giữ compute để dễ mở lại sau
            // var vConNop = me._pickCI(r, 'TongConNop', 'ConPhaiNop', 'ConLai', 'TongTienConNop');
            // if ((vConNop === '' || vConNop == null) && vTongPhaiNop !== '' && vDaNop !== '') {
            //     vConNop = (Number(vTongPhaiNop) || 0) - (Number(vDaNop) || 0);
            // }

            html += '<tr>';
            html += '<td class="td-center">' + (sttBase + i + 1) + '</td>';
            html += '<td class="td-left">' + esc(strCCCD) + '</td>';
            html += '<td class="td-left">' + esc(strMaSo) + '</td>';
            html += '<td class="td-left">' + esc(strHoTen) + '</td>';
            html += '<td class="td-left">' + esc(strSDT) + '</td>';
            html += '<td class="td-center">' + esc(strGT) + '</td>';
            html += '<td class="td-center">' + esc(strNgSinh) + '</td>';
            html += '<td class="td-left">' + esc(strNganh) + '</td>';
            html += '<td class="td-left">' + esc(strCT) + '</td>';
            html += '<td class="td-left">' + esc(strLop) + '</td>';
            // ẨN cột "Đã nhập học"
            // html += '<td class="td-center">'
            //      + (iDaNH === 1
            //         ? '<span class="label" style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:3px;">Đã nhập học</span>'
            //         : '<span class="label" style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:3px;">Chưa</span>')
            //      + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(vTongPhaiNop)) + '</td>';
            html += '<td class="td-right">' + esc(fmtNum(vDaNop)) + '</td>';
            // ẨN cột "Còn phải nộp"
            // html += '<td class="td-right">' + esc(fmtNum(vConNop)) + '</td>';
            html += '<td class="td-center">' + esc(vNgayNop) + '</td>';
            html += '</tr>';
        });
        $tbody.append(html);
        // Sum row ở đầu bảng — lấy từ state đã compute trên TOÀN BỘ _filtered (không theo trang)
        $("#sumTongPhaiNop_DSNHTT").text(me._fmtNumVN(me._sumTongPhaiNop_DSNHTT || 0));
        $("#sumDaNop_DSNHTT").text(me._fmtNumVN(me._sumDaNop_DSNHTT || 0));
        // Label sum row: luôn là "toàn bộ" vì sum tính trên full filtered
        $("#tblDSNHTT_HSNH thead tr.kmp-sum-row-top th:first-child").text('Tổng cộng (toàn bộ)');
    },

    _renderPaging_DSNHTT: function () {
        var me = this;
        var total = me._total_DSNHTT || 0;
        var pageSize = me._pageSize_DSNHTT || 50;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        var cur = me._pageIndex_DSNHTT || 1;
        if (cur > totalPages) cur = totalPages;

        $("#pgCur_DSNHTT").text(cur);
        $("#pgTotal_DSNHTT").text(totalPages);
        $("#pgSum_DSNHTT").text(total);

        // Show/hide
        if (total <= 0) {
            $("#paging_DSNHTT_HSNH").attr('style', 'gap:10px; display:none;');
            return;
        }
        $("#paging_DSNHTT_HSNH").attr('style', 'gap:10px; display:flex;');

        // Build page list: window ±2 around current
        var $ul = $("#pgList_DSNHTT");
        $ul.empty();
        var addLi = function (label, page, disabled, active) {
            var cls = 'page-item';
            if (disabled) cls += ' disabled';
            if (active) cls += ' active';
            $ul.append('<li class="' + cls + '"><a class="page-link" href="#" data-page="' + page + '">' + label + '</a></li>');
        };
        addLi('«', 1, cur === 1, false);
        addLi('‹', Math.max(1, cur - 1), cur === 1, false);
        var from = Math.max(1, cur - 2), to = Math.min(totalPages, cur + 2);
        if (from > 1) { addLi('1', 1, false, false); if (from > 2) addLi('…', from - 1, true, false); }
        for (var p = from; p <= to; p++) addLi(String(p), p, false, p === cur);
        if (to < totalPages) {
            if (to < totalPages - 1) addLi('…', to + 1, true, false);
            addLi(String(totalPages), totalPages, false, false);
        }
        addLi('›', Math.min(totalPages, cur + 1), cur === totalPages, false);
        addLi('»', totalPages, cur === totalPages, false);
    },

    /* Xuất Excel: dùng cache _filtered_DSNHTT (đã filter client-side). Không fetch lại API. */
    _xuatExcel_DSNHTT: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel (XLSX) chưa được nạp.", "w");
            return;
        }
        var arr = (me._filtered_DSNHTT && me._filtered_DSNHTT.length)
                    ? me._filtered_DSNHTT
                    : (me.dtDSNHTT_All || []);
        if (!arr || arr.length === 0) {
            edu.system.alert("Không có dữ liệu để xuất.", "w");
            return;
        }
        var toNum = function (v) {
            if (v === '' || v == null || isNaN(v)) return '';
            return Number(v);
        };

        var header = [
            'STT', 'CCCD', 'Mã số', 'Họ tên', 'Số điện thoại', 'Giới tính', 'Ngày sinh',
            'Ngành nhập học', 'Chương trình nhập học', 'Lớp chính thức',
            // 'Đã nhập học',   // ẨN: mở lại nếu cần
            'Tổng phải nộp', 'Đã nộp',
            // 'Còn phải nộp',  // ẨN: sẽ mở lại khi có info miễn giảm
            'Ngày nộp'
        ];
        var aoa = [header];
        arr.forEach(function (r, i) {
            var vTong = me._pickCI(r, 'TONGMUCPHI', 'TongMucPhi', 'TongPhaiNop', 'TongTienPhaiNop');
            var vDaNop = me._pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu');
            var vNgayNop = me._pickCI(r, 'NgayNop', 'NgayThuTien', 'NgayThu', 'NgayNopGanNhat', 'NgayNopCuoi');
            // ẨN — giữ compute
            // var vConNop = me._pickCI(r, 'TongConNop', 'ConPhaiNop', 'ConLai', 'TongTienConNop');
            // if ((vConNop === '' || vConNop == null) && vTong !== '' && vDaNop !== '') {
            //     vConNop = (Number(vTong) || 0) - (Number(vDaNop) || 0);
            // }
            // var iDaNH = Number(me._pickCI(r, 'DaNhapHoc', 'IsNhapHoc', 'IsStudyCreated') || 0);
            aoa.push([
                i + 1,
                me._pickCI(r, 'IdentifierNo', 'CCCD'),
                me._pickCI(r, 'CurrentEmployeeCode', 'MaSo'),
                me._pickCI(r, 'FullName', 'HoTen'),
                me._pickCI(r, 'SoDienThoaiCaNhan', 'SoDienThoai', 'DienThoaiCaNhan', 'DienThoai', 'Phone', 'Mobile'),
                me._pickCI(r, 'GenderTen', 'GioiTinhTen', 'GioiTinh', 'Gender'),
                me._pickCI(r, 'DateOfBirth', 'NgaySinhStr', 'NgaySinh'),
                me._pickCI(r, 'DaoTaoNganhTsTen', 'NganhTsTen', 'TenNganhTs', 'NganhTen'),
                me._pickCI(r, 'TenChuongTrinh', 'TenCT', 'ChuongTrinhTen', 'DaoTaoToChucChuongTrinhTen'),
                me._pickCI(r, 'LopQuanLyTen', 'TenLop', 'LopTen', 'LopCtTen', 'LopChinhThucTen'),
                // iDaNH === 1 ? 'Đã nhập học' : 'Chưa',   // ẨN
                toNum(vTong),
                toNum(vDaNop),
                // , toNum(vConNop)  // ẨN
                vNgayNop
            ]);
        });

        var ws = XLSX.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 5 }, { wch: 14 }, { wch: 12 }, { wch: 26 }, { wch: 14 }, { wch: 10 }, { wch: 12 },
            { wch: 28 }, { wch: 34 }, { wch: 18 },
            { wch: 16 }, { wch: 16 }, { wch: 14 }
        ];
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DSNhapHocThuTien');

        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                  + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
        var fname = 'DSNhapHocThuTien_' + arr.length + 'rec_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
    }
};