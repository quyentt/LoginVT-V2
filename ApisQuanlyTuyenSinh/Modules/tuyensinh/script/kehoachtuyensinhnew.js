/*----------------------------------------------
--Author:
--Date of created: 06/05/2026
--Note: Kế hoạch tuyển sinh (giao diện mới)
----------------------------------------------*/
/* Log chạy nền đã TẮT theo yêu cầu 11/09/2026.
   Bật lại: đổi kqdkNoLog( thành console.log( ở dòng cần xem.
   Hai hàm chẩn đoán gọi tay (_dumpList / _dumpEdit) vẫn in bình thường. */
function kqdkNoLog() { }
function KeHoachTuyenSinhNew() { };
KeHoachTuyenSinhNew.prototype = {
    dtLoaiTuyenSinh: [],
    dtPhuongAnTuyenSinh: [],
    dtTinhTrangKeHoach: [],
    dtKeHoachTuyenSinh: [],
    dtCoCauToChuc: [],
    strKeHoachTuyenSinh_Id: '',
    dtChiTiet: null,
    dtKieuDot: [],
    dtTinhTrangDot: [],
    dtDotTuyenSinh: [],
    strDot_Id: '',
    dtChiTietDot: null,
    dtPhanCongNhanSu: [],
    strPhanCong_Id: '',
    dtChiTietPhanCong: null,
    dtVaiTro_PhanCong: [],
    dtKeHoachDauRa: [],
    strDauRa_Id: '',
    strDot_Id_ForDauRa: '',   // Đợt ID nếu Kế hoạch đầu ra được mở từ context Đợt tuyển sinh
    dtChiTietDauRa: null,
    dtHeDaoTao_DR: [],
    dtKhoaDaoTao_DR: [],
    dtChuongTrinh_DR: [],
    dtLoaiDauRa: [],
    dtKieuHocTap: [],
    dtTrangThaiDauRa: [],

    // Kết quả đăng ký (Import trúng tuyển)
    strDot_Id_ForKQ: '',   // Đợt ID khi mở KQĐK từ bảng đợt (context Đợt); rỗng nếu mở từ bảng KH
    _importCancelled: false,
    _khaiDMLoaded: false,  // danh mục form khai đã nạp lần đầu chưa (lazy)
    dtKQDK_HoSo: [],       // cache raw danh sách hồ sơ để filter local + export Excel
    _kqViewData: [],       // data đang view (raw hoặc đã filter) — nguồn cho phân trang FE
    _kqPageIdx: 1,         // trang hiện tại (1-based)
    _kqPageSize: 50,       // số dòng / trang (đồng bộ với #ddlKQDK_PageSize)
    _diffResult: null,     // { both, onlyFile, onlySys, noCCCD, dupFile, dupSys, fileTotal, sysTotal }
    strSuaHoSo_Id: '',     // ID hồ sơ đang sửa qua form Khai (chế độ Sửa)

    init: function () {
        var me = this;
        edu.system.page_load();

        /*------------------------------------------
        -- Load combo filter + danh sách kế hoạch
        -------------------------------------------*/
        me.getList_LoaiTuyenSinh();
        me.getList_PhuongAnTuyenSinh();
        me.getList_TinhTrangKeHoach();
        me.getList_KieuDot();
        me.getList_TinhTrangDot();
        me.getList_VaiTro_PhanCong();
        me.getList_LoaiDauRa();
        me.getList_KieuHocTap();
        me.getList_TrangThaiDauRa();
        me.getList_CoCauToChuc();
        me.getList_KeHoachTuyenSinh();

        /*------------------------------------------
        -- Action
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_KeHoachTuyenSinh();
        });

        $("#txtSearch_TuKhoa, #txtSearch_NamTuyenSinh, #txtSearch_NamHoc, #txtSearch_HocKy")
            .keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    me.getList_KeHoachTuyenSinh();
                }
            });

        $("#tblKHtyensinh").delegate(".btnDetail", "click", function () {
            var strId = $(this).attr('data-id');
            if (edu.util.checkValue(strId)) {
                me.strKeHoachTuyenSinh_Id = strId;
                me.getDetail_KeHoachTuyenSinh(strId);
                // Chế độ Xem-sửa: hiện nút Xóa, đổi title, khóa ô Mã
                $('#chi-tiet .modal-header .title').html('<i class="fa-regular fa-pen-to-square"></i> Xem - sửa kế hoạch tuyển sinh');
                $('#btnDelete_KH').removeClass('d-none');
                me._khoaMaKeHoach(true);
            }
        });

        // Click "Thêm mới" main page → mở #chi-tiet ở chế độ Thêm mới
        $("#btnAddKeHoach").click(function () {
            me.strKeHoachTuyenSinh_Id = '';
            me.rewrite_KeHoach();
        });

        // Đọc data-id từ event.relatedTarget (Bootstrap 5) để tránh race với click handler riêng.
        // Trước đây dùng delegate("click") set ID + on("show.bs.modal") load → thứ tự không đảm bảo,
        // lần mở đầu tiên hay bị empty vì show.bs.modal fire trước.
        $("#dot-tuyen-sinh").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            if ($btn.length && $btn.attr('data-id')) {
                me.strKeHoachTuyenSinh_Id = $btn.attr('data-id');
            }
            me.getList_DotTuyenSinh();
        });

        $("#phan-cong-nhan-su").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            if ($btn.length && $btn.attr('data-id')) {
                me.strKeHoachTuyenSinh_Id = $btn.attr('data-id');
            }
            me.getList_PhanCongNhanSu();
        });

        $("#ke-hoach-dau-ra").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            if ($btn.length && $btn.attr('data-id')) {
                var strId = $btn.attr('data-id');
                // Context detection: nếu nút "Xem" nằm trong modal #dot-tuyen-sinh
                // thì data-id là Đợt ID, KH TS ID đã set từ click trước đó — không ghi đè.
                var isDotContext = $btn.closest('#dot-tuyen-sinh').length > 0;
                if (isDotContext) {
                    // Mức đợt: cho phép thêm mới đầu ra
                    me.strDot_Id_ForDauRa = strId;
                    $("#btnAddKeHoachDauRa").removeClass('d-none');
                } else {
                    // Mức KH tuyển sinh: chỉ cho xem + sửa, KHÔNG cho thêm
                    // (đầu ra phải thêm từ đợt cụ thể)
                    me.strKeHoachTuyenSinh_Id = strId;
                    me.strDot_Id_ForDauRa = '';
                    $("#btnAddKeHoachDauRa").addClass('d-none');
                }
            }
            me.getList_KeHoachDauRa();
        });

        // Modal Thêm mới kế hoạch đầu ra: cascading Hệ → Khóa → Chương trình
        $("#them-moi-dau-ra").on('show.bs.modal', function () {
            me.rewrite_DauRa();
            me.getList_HeDaoTao_DR();
        });
        $("#ddlDR_HeDaoTao").on('change', function () {
            $("#ddlDR_KhoaDaoTao").html('<option value="">Chọn khóa đào tạo</option>');
            $("#tblChuongTrinhDauRa tbody").html("");
            if ($(this).val()) me.getList_KhoaDaoTao_DR();
        });
        $("#ddlDR_KhoaDaoTao").on('change', function () {
            $("#tblChuongTrinhDauRa tbody").html("");
            if ($(this).val()) me.getList_ChuongTrinh_DR();
        });
        $("#chkDR_SelectAll").click(function () {
            var checked = $(this).is(':checked');
            $('#tblChuongTrinhDauRa tbody .ct-select').prop('checked', checked);
        });

        // Arrow-key + Enter navigation cho 3 cột input chỉ tiêu (Excel-like grid)
        $("#tblChuongTrinhDauRa").on('keydown', 'tbody input[type="number"]', function (e) {
            var key = e.which || e.keyCode;
            // 37=Left, 38=Up, 39=Right, 40=Down, 13=Enter
            if ([37, 38, 39, 40, 13].indexOf(key) === -1) return;

            var $this = $(this);
            var $row = $this.closest('tr');
            var $allRows = $row.parent().children('tr');
            var rowIdx = $allRows.index($row);
            var colInputs = ['ct-chitieu', 'ct-chitieu-toida', 'ct-chitieu-toithieu'];
            var colIdx = -1;
            for (var c = 0; c < colInputs.length; c++) {
                if ($this.hasClass(colInputs[c])) { colIdx = c; break; }
            }
            if (colIdx === -1) return;

            var newRowIdx = rowIdx;
            var newColIdx = colIdx;

            if (key === 38) {                              // Up
                newRowIdx--;
            } else if (key === 40 || key === 13) {         // Down / Enter
                newRowIdx++;
            } else if (key === 37) {                       // Left
                newColIdx--;
                if (newColIdx < 0) { newColIdx = colInputs.length - 1; newRowIdx--; }
            } else if (key === 39) {                       // Right
                newColIdx++;
                if (newColIdx >= colInputs.length) { newColIdx = 0; newRowIdx++; }
            }

            if (newRowIdx < 0 || newRowIdx >= $allRows.length) return;

            e.preventDefault();
            var $target = $allRows.eq(newRowIdx).find('.' + colInputs[newColIdx]);
            if ($target.length) {
                $target.focus().select();
            }
        });

        $("#btnSaveDauRa").click(function () {
            me.save_DauRa();
        });

        $("#btnUpdate_DauRa").click(function () {
            me.update_DauRa();
        });
        $("#btnDelete_DauRa").click(function () {
            if (!edu.util.checkValue(me.strDauRa_Id)) {
                edu.system.alert("Chưa chọn đầu ra để xóa", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa đầu ra này không?");
            $("#btnYes").off("click").on("click", function () {
                me.delete_DauRa();
            });
        });

        // Modal Xem-sửa đầu ra: đọc data-id từ event.relatedTarget thay vì click delegate
        // để tránh race với stacked modal #ke-hoach-dau-ra.
        $("#xem-sua-dau-ra").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            var strId = $btn.length ? $btn.attr('data-id') : '';
            if (strId) {
                me.strDauRa_Id = strId;
                me.getDetail_DauRa(strId);
            }
        });

        // Modal Xem-sửa phân công: đọc data-id từ event.relatedTarget (cùng pattern Đầu ra)
        $("#xem-sua-phancong").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            var strId = $btn.length ? $btn.attr('data-id') : '';
            if (strId) {
                me.strPhanCong_Id = strId;
                me.getDetail_PhanCong(strId);
            }
        });

        $("#btnUpdate_PhanCong").click(function () {
            me.update_PhanCong();
        });

        $("#btnDelete_PhanCong").click(function () {
            if (!edu.util.checkValue(me.strPhanCong_Id)) {
                edu.system.alert("Chưa chọn phân công để xóa", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa phân công này không?");
            $("#btnYes").off("click").on("click", function () {
                me.delete_PhanCong();
            });
        });

        // Modal Thêm mới phân công nhân sự — reset form mỗi lần mở (trừ khi reopen từ picker)
        $("#them-moi-nhansu").on('show.bs.modal', function () {
            if (me._skipResetPhanCong) {
                me._skipResetPhanCong = false;
                return;
            }
            me.rewrite_PhanCong();
        });

        // Picker shared toàn hệ thống: edu.extend.genModal_NhanSu(callback) + getList_NhanSu()
        // Pattern an toàn cho stacked modal: hide parent #them-moi-nhansu khi mở picker,
        // show lại khi picker đóng. Tránh xung đột backdrop của Bootstrap 5 với modal-fullscreen.
        $("#btnChonNhanSu").click(function () {
            // Hide parent modal trước (giữ DOM/data nguyên vẹn)
            $('#them-moi-nhansu').modal('hide');

            var pickerHandled = false;
            edu.extend.genModal_NhanSu(function (arrChecked_Id) {
                pickerHandled = true;  // → khỏi cần xử lý "hidden" để tránh double-show parent
                var dt = edu.extend.dtNhanSu || [];
                var arrPersons = [];
                if (arrChecked_Id && arrChecked_Id.length) {
                    // Loại ID đã có trong bảng để tránh trùng
                    var existing = {};
                    $("#tblNhanSuDaChon tbody tr").each(function () {
                        existing[$(this).attr('data-person-id')] = true;
                    });
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        var id = arrChecked_Id[i];
                        if (existing[id]) continue;
                        var ns = dt.find ? dt.find(function (e) { return e.ID == id; }) : null;
                        if (!ns) continue;
                        arrPersons.push({
                            ID: ns.ID,
                            FULL_NAME: ns.HOTEN || '',
                            current_employee_code: ns.MASO || ''
                        });
                    }
                }
                // Reopen parent (skip rewrite để giữ table + form chung user đã khai)
                // Append NS rows SAU khi modal show xong.
                me._skipResetPhanCong = true;
                setTimeout(function () {
                    $('#them-moi-nhansu').modal('show');
                    if (arrPersons.length) me.addNhanSu_PhanCong(arrPersons);
                }, 200);
            });
            // Nếu user đóng picker mà không chọn → reopen parent, cũng skip rewrite
            $('#modal_nhansu').one('hidden.bs.modal', function () {
                if (!pickerHandled) {
                    me._skipResetPhanCong = true;
                    setTimeout(function () { $('#them-moi-nhansu').modal('show'); }, 50);
                }
            });

            // Wire nút "Thêm từng đơn vị": chọn CCTC ở dropdown → add toàn bộ NS thuộc các đơn vị đó
            $("#modal_nhansu").off('click.addCCTC', '#btnAdd_TungDonVi')
                .on('click.addCCTC', '#btnAdd_TungDonVi', function () {
                    var arrCCTC = $("#dropSearchModal_CCTC_NS").val();
                    if (!arrCCTC || !arrCCTC.length) {
                        edu.system.alert("Vui lòng chọn đơn vị từ dropdown trước", "w");
                        return;
                    }
                    var obj_req = {
                        action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
                        func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
                        iM: edu.system.iM,
                        strTuKhoa: '',
                        strDaoTao_CoCauToChuc_Id: arrCCTC.toString(),
                        strChucVu_Id: '',
                        strTinhTrangNhanSu_Id: '',
                        dLaCanBoNgoaiTruong: 0,
                        pageIndex: 1,
                        pageSize: 100000,
                        strNguoiThucHien_Id: edu.system.userId,
                        strVaiTroDangNhap_Id: edu.system.strVaiTro_Id || '',
                        strChucNangHeThong_Id: edu.system.strChucNang_Id || ''
                    };
                    edu.system.makeRequest({
                        success: function (data) {
                            if (!data.Success) {
                                edu.system.alert(data.Message || "Lỗi khi lấy DS nhân sự", "w");
                                return;
                            }
                            var arrNS = edu.util.checkValue(data.Data) ? data.Data : [];
                            // Loại trùng với NS đã có trong bảng parent
                            var existing = {};
                            $("#tblNhanSuDaChon tbody tr").each(function () {
                                existing[$(this).attr('data-person-id')] = true;
                            });
                            var arrPersons = [];
                            for (var i = 0; i < arrNS.length; i++) {
                                var ns = arrNS[i];
                                if (!ns || !ns.ID || existing[ns.ID]) continue;
                                existing[ns.ID] = true;
                                arrPersons.push({
                                    ID: ns.ID,
                                    FULL_NAME: ns.HOTEN || '',
                                    current_employee_code: ns.MASO || ''
                                });
                            }
                            // Đóng picker, reopen parent
                            pickerHandled = true;
                            $("#modal_nhansu").modal("hide");
                            me._skipResetPhanCong = true;
                            setTimeout(function () {
                                $('#them-moi-nhansu').modal('show');
                                if (arrPersons.length) {
                                    me.addNhanSu_PhanCong(arrPersons);
                                    edu.system.alert("Đã thêm " + arrPersons.length + " nhân sự từ " + arrCCTC.length + " đơn vị", "s");
                                } else {
                                    edu.system.alert("Không có nhân sự mới (có thể đã trùng hoặc đơn vị rỗng)", "i");
                                }
                            }, 200);
                        },
                        error: function (er) {
                            edu.system.alert("LayDSNhanSu (ex): " + JSON.stringify(er), "w");
                        },
                        type: 'POST',
                        contentType: true,
                        action: obj_req.action,
                        data: obj_req,
                        fakedb: []
                    }, false, false, false, null);
                });

            // Default filter: cán bộ trong trường
            $('#dropSearchModal_CB_NS').val('0');
            edu.extend.getList_NhanSu();
        });

        // Master checkbox "Chọn all"
        $("#chkPC_SelectAll").click(function () {
            var checked = $(this).is(':checked');
            $('#tblNhanSuDaChon tbody .pc-select').prop('checked', checked);
        });

        $("#btnSavePhanCong").click(function () {
            me.save_PhanCong();
        });

        // Modal đợt: reset form rồi check trigger có data-id (Chi tiết) → fetch detail.
        // Dùng event.relatedTarget thay vì click delegate riêng để tránh race với stacked modal.
        $("#them-moi-dot").on('show.bs.modal', function (event) {
            me.rewrite_Dot();
            var $btn = $(event.relatedTarget);
            var strId = $btn.length ? $btn.attr('data-id') : '';
            if (strId && $btn.hasClass('btnDetailDot')) {
                me.strDot_Id = strId;
                me.getDetail_Dot(strId);
            }
        });

        $("#btnSaveDot").click(function () {
            me.save_Dot();
        });

        /*------------------------------------------
        -- Khai danh mục hồ sơ giấy tờ (cột "Khai" ở bảng Các đợt tuyển sinh).
        -- data-id ở đây là ID ĐỢT — đúng thứ 3 proc QuyDinhHoSo cần.
        -------------------------------------------*/
        $("#khai-danh-muc-ho-so").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            var strId = $btn.length ? $btn.attr('data-id') : '';
            if (strId) me.strQDHS_Dot_Id = strId;
            $('#lblQDHS_Dot').text($btn.length ? ($btn.attr('data-ten') || '') : '');
            $('#tblQuyDinhHoSo tbody').html('');
            $('#lblQDHS_Tong').text('0');
            // Phải có 2 danh mục rồi mới dựng được dropdown của từng dòng
            me._qdhsEnsureDM(function () { me.getList_QuyDinhHoSo(); });
        });
        $("#btnQDHS_ThemDong").click(function () {
            me.addRow_QuyDinhHoSo();
        });
        $("#btnQDHS_Luu").click(function () {
            me.save_QuyDinhHoSo();
        });
        $("#tblQuyDinhHoSo").on('click', '.qdhs-xoa', function () {
            me.xoaDong_QuyDinhHoSo($(this).closest('tr'));
        });

        $("#btnDelete_Dot").click(function () {
            if (!edu.util.checkValue(me.strDot_Id)) {
                edu.system.alert("Chưa chọn đợt để xóa", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa đợt này không?");
            $("#btnYes").off("click").on("click", function () {
                me.delete_Dot();
            });
        });

        $("#btnUpdate_KH").click(function () {
            me.save_KeHoachTuyenSinh();
        });

        $("#btnDelete_KH").click(function () {
            if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
                edu.system.alert("Chưa chọn kế hoạch để xóa", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa kế hoạch này không?");
            $("#btnYes").off("click").on("click", function () {
                me.delete_KeHoachTuyenSinh();
            });
        });

        /*------------------------------------------
        -- Modal "Kết quả đăng ký" — Import trúng tuyển + Khai trực tiếp
        -- Context detection giống #ke-hoach-dau-ra:
        --   - Mở từ modal #dot-tuyen-sinh → data-id là Đợt ID, giữ nguyên KH ID
        --   - Mở từ table chính        → data-id là KH ID
        -------------------------------------------*/
        $("#ket-qua-dk").on('show.bs.modal', function (event) {
            var $btn = $(event.relatedTarget);
            me.resetKQDK_View();
            // Mở modal từ ngoài vào → chưa có danh sách nào để lùi về.
            // Chỉ openSuaHoSo (bấm nút Sửa trên dòng) mới bật cờ này lên.
            me._kqdkVaoTuList = false;

            // 1) Context KH/Đợt — chỉ set khi nút mang data-id (nút Xem trong row).
            //    Nút footer modal Đợt KHÔNG có data-id → giữ nguyên context KH đã có,
            //    reset đợt vì scope là toàn bộ KH.
            if ($btn.length) {
                var strId = $btn.attr('data-id');
                if (strId) {
                    var isDotContext = $btn.closest('#dot-tuyen-sinh').length > 0;
                    if (isDotContext) {
                        me.strDot_Id_ForKQ = strId;
                    } else {
                        me.strKeHoachTuyenSinh_Id = strId;
                        me.strDot_Id_ForKQ = '';
                    }
                } else if ($btn.closest('#dot-tuyen-sinh').length > 0) {
                    me.strDot_Id_ForKQ = '';
                }
            }

            // 2) Chọn screen theo data-open-mode:
            //    'import' → Import Excel
            //    'khai'   → Form Khai trực tiếp
            //    default  → Danh sách hồ sơ (khi bấm "Xem" từ row Kết quả đăng ký)
            var mode = $btn.length ? $btn.attr('data-open-mode') : '';
            $('#kqdk_list, #kqdk_import, #kqdk_khai').addClass('d-none');
            if (mode === 'import') {
                $('#kqdk_import').removeClass('d-none');
                // Load combo Đợt tuyển sinh — dùng cache dtDotTuyenSinh (đã load ở modal Đợt).
                // Auto-preselect nếu mở từ context Đợt (button "Import trúng tuyển" ở modal Đợt).
                var $selDot = $('#ddlImportTT_Dot');
                $selDot.empty().append('<option value="">-- Chọn đợt --</option>');
                (me.dtDotTuyenSinh || []).forEach(function (d) {
                    var id = d.ID || d.Id || d.id || '';
                    var ma = d.MA || d.Ma || '';
                    var ten = d.TEN || d.Ten || '';
                    if (id) $selDot.append('<option value="' + id + '">' + (ma ? '[' + ma + '] ' : '') + ten + '</option>');
                });
                if (me.strDot_Id_ForKQ) $selDot.val(me.strDot_Id_ForKQ);
                // Load DS Cơ sở đào tạo cho batch Import Excel — reuse cache + proc business
                // giống dropdown "Đọc từ API". Xem loadCoSoDaoTao_ToSelect.
                me.loadCoSoDaoTao_ToSelect('#ddlImportTT_CoSoDaoTao');
            } else if (mode === 'khai') {
                $('#kqdk_khai').removeClass('d-none');
                me._exitSuaMode();   // ensure Thêm mới mode, banner ẩn, save btn "Lưu hồ sơ"
                /* ⚠ PHẢI xoá trắng form. _exitSuaMode chỉ tắt cờ sửa / ẩn banner / đổi nhãn nút,
                   KHÔNG đụng tới dữ liệu đang nằm trên các ô. Thiếu dòng này thì: xem hồ sơ
                   người A → đóng → bấm "Khai trực tiếp hồ sơ" là cả form vẫn đầy thông tin của
                   A, khai mới thành sửa nhầm người (khách báo 22/09/2026). */
                me.resetKhai_HoSo();
                me.initKhai_DanhMuc();
                // Đợt tuyển sinh: load từ cache dtDotTuyenSinh; auto-select nếu chỉ 1 đợt
                // hoặc preselect nếu context Đợt đã có (mở từ row Đợt).
                // _ensureDotTuyenSinh: cache đợt có thể rỗng nếu user vào thẳng từ bảng KH
                // (chưa mở modal "Các đợt tuyển sinh") → tự nạp theo KH hiện tại.
                me._ensureDotTuyenSinh(function () {
                    me._loadDotToKhai();
                    // Nguyện vọng đầu ra + Phương thức tuyển sinh đều phụ thuộc KH+Đợt → refresh mỗi lần mở
                    me._loadNguyenVongDauRa();
                    me._loadPhuongThucTuyenSinh();
                });
            } else {
                $('#kqdk_list').removeClass('d-none');
                // Preload các DM cần lookup cho list (Giới tính) — chạy 1 lần
                me._preloadDMForList();
                me.loadKQDK_List();
            }
            // Cho thấy đang làm việc trên kế hoạch/hệ nào — vẽ ngay, rồi vẽ lại sau khi
            // cache đợt nạp xong (dropdown Đợt nạp async).
            me._veBadgeKeHoach();
            setTimeout(function () { me._veBadgeKeHoach(); }, 700);
        });

        // Toolbar list: search / reload / export / select all
        $('#btnKQDK_Search').click(function () { me.filterKQDK_HoSo(); });
        $('#txtKQDK_Search').on('keypress', function (e) {
            if (e.which === 13) { e.preventDefault(); me.filterKQDK_HoSo(); }
        });
        $('#btnKQDK_Reload').click(function () {
            $('#txtKQDK_Search').val('');
            me._kqFilters = {};
            me._kqSort = null;
            me.loadKQDK_List();
        });

        /*---- Bộ lọc kiểu Excel trên tiêu đề cột (chế độ Gọn) ----*/
        $('#tblKQDK_HoSo').on('click', '.kqdk-th-loc', function (e) {
            e.stopPropagation();
            var key = $(this).attr('data-key');
            // Bấm lại đúng cột đang mở → đóng lại
            if ($('#kqdk_filter_pop').length && $('#kqdk_filter_pop').data('key') === key) {
                me._kqDongFilter();
                return;
            }
            me._kqMoFilter(key, this);
        });
        // Bấm ra ngoài thì đóng popup; bấm bên trong thì không
        $(document).on('mousedown.kqfilter', function (e) {
            if ($(e.target).closest('#kqdk_filter_pop, .kqdk-th-loc').length) return;
            me._kqDongFilter();
        });
        $(document).on('keydown.kqfilter', function (e) {
            if (e.which === 27) me._kqDongFilter();
        });

        $(document).on('input', '#kqdk_f_tim', function () {
            var kw = ($(this).val() || '').toLowerCase().trim();
            var $pop = $('#kqdk_filter_pop');
            var soHien = 0;
            $pop.find('.kqdk-f-list .kqdk-f-item').each(function () {
                var v = (($(this).attr('data-v') || '') + '').toLowerCase();
                var khop = !kw || v.indexOf(kw) >= 0;
                $(this).toggle(khop);
                if (khop) soHien++;
            });
            /* Đổi luôn nhãn + số đếm của ô "(Chọn tất cả)" cho khớp phạm vi đang thấy.
               Không đổi thì nó vẫn ghi 127 trong khi chỉ còn 1 dòng hiện, người dùng
               tưởng bấm Đồng ý là lọc cả 127. */
            var $all = $pop.find('#kqdk_f_all').closest('.kqdk-f-item');
            $all.find('.kqdk-f-txt').html('<b>' + (kw ? '(Chọn tất cả kết quả tìm)' : '(Chọn tất cả)') + '</b>');
            $all.find('.kqdk-f-dem').text(soHien);
            me._kqDongBoTickAll($pop);
        });
        $(document).on('change', '#kqdk_f_all', function () {
            var bat = $(this).is(':checked');
            // Chỉ tick các dòng đang hiện — đúng kiểu Excel khi đang gõ tìm
            $('#kqdk_filter_pop .kqdk-f-list .kqdk-f-item:visible .kqdk-f-cb').prop('checked', bat);
        });
        $(document).on('change', '#kqdk_filter_pop .kqdk-f-cb', function () {
            me._kqDongBoTickAll($('#kqdk_filter_pop'));
        });
        $(document).on('click', '#kqdk_filter_pop .kqdk-f-sbtn', function () {
            var $pop = $('#kqdk_filter_pop');
            me._kqSort = { key: $pop.data('key'), dir: $(this).attr('data-dir') };
            me._kqDongFilter();
            me._kqApplyAllFilters();
        });
        $(document).on('click', '#kqdk_filter_pop .kqdk-f-clear', function (e) {
            e.preventDefault();
            delete me._kqFilters[$('#kqdk_filter_pop').data('key')];
            me._kqDongFilter();
            me._kqApplyAllFilters();
        });
        $(document).on('click', '#kqdk_filter_pop .kqdk-f-cancel', function () { me._kqDongFilter(); });
        $(document).on('click', '#kqdk_filter_pop .kqdk-f-ok', function () {
            var $pop = $('#kqdk_filter_pop');
            var key = $pop.data('key');
            var dsGiaTri = $pop.data('giatri') || [];
            /* ⚠ Gõ tìm thì các dòng KHÔNG khớp chỉ bị ẩn đi chứ VẪN CÒN TICK.
               Nếu vơ hết ô đang tick (kể cả dòng ẩn) thì số lượng bằng đúng cả danh sách
               → rơi vào nhánh "chọn hết = bỏ lọc" → bấm Đồng ý xong bảng y nguyên,
               đúng hiện tượng khách báo 29/09/2026. Bỏ tick "(Chọn tất cả)" cũng không ăn
               thua vì nó cũng chỉ bỏ tick các dòng ĐANG HIỆN.
               → Đang gõ tìm thì chỉ tính các dòng ĐANG HIỆN, giống Excel. */
            var $items = $pop.find('.kqdk-f-list .kqdk-f-item');
            var $hien = $items.filter(':visible');
            var dangTim = $hien.length !== $items.length;
            var chon = [];
            ($.trim($pop.find('#kqdk_f_tim').val() || '') ? $hien : $items)
                .find('.kqdk-f-cb:checked').each(function () {
                    var idx = parseInt($(this).attr('data-idx'), 10);
                    if (!isNaN(idx)) chon.push(dsGiaTri[idx]);
                });
            if (!chon.length) {
                edu.system.alert('Phải chọn ít nhất 1 giá trị, nếu không bảng sẽ trống trơn.', 'w');
                return;
            }
            // Chọn hết = không lọc gì → bỏ luôn cho thanh chip khỏi rác.
            // Đang gõ tìm thì KHÔNG áp luật này: chọn hết kết quả tìm vẫn là một bộ lọc thật.
            if (!dangTim && chon.length === dsGiaTri.length) delete me._kqFilters[key];
            else me._kqFilters[key] = chon;
            me._kqDongFilter();
            me._kqApplyAllFilters();
        });
        // Thanh chip: bỏ lọc 1 cột / bỏ sắp xếp / xóa hết
        $(document).on('click', '#kqdk_chip_loc .kqdk-chip-x', function () {
            var k = $(this).attr('data-key');
            if (k === '__sort') me._kqSort = null;
            else delete me._kqFilters[k];
            me._kqApplyAllFilters();
        });
        $(document).on('click', '#btnKQDK_XoaHetLoc', function (e) {
            e.preventDefault();
            me._kqFilters = {};
            me._kqSort = null;
            $('#txtKQDK_Search').val('');
            me._kqApplyAllFilters();
        });
        $('#btnKQDK_Export').click(function () { me.exportKQDK_Excel(); });
        // Trang quá nhiều dòng thì không tự nạp chi tiết — bấm tay để chạy
        $(document).on('click', '#btnKQDK_NapChiTiet', function (e) {
            e.preventDefault();
            var cu = me._CT_MAX_ROWS;
            me._CT_MAX_ROWS = 100000;          // cho phép đúng lượt bấm này
            me._ensureChiTietForRows(me._kqTrangHienTai(), function (coMoi) {
                me._CT_MAX_ROWS = cu;
                if (coMoi) me._kqRenderPage();
            });
        });
        $('#btnKQDK_AutoClass').click(function () { me.kqdk_PhanLopTuDong_Selected(); });
        /* ⚠ Phải bind DELEGATE qua bảng, KHÔNG bind thẳng vào #chkKQDK_All.
           Đổi chế độ xem Gọn/Đầy đủ là _kqApplyTableMode thay nguyên <thead> bằng
           .html(...) → ô tick cũ bị vứt đi kèm luôn handler, ô tick mới sinh ra không
           có ai nghe → bấm "check all" không ăn gì. Bảng #tblKQDK_HoSo là thẻ tĩnh
           trong HTML (chỉ thead/tbody bị thay ruột) nên bám vào nó là chắc. */
        $('#tblKQDK_HoSo').on('click', '#chkKQDK_All', function () {
            $('#tblKQDK_HoSo tbody .kqdk-sel').prop('checked', $(this).is(':checked'));
        });
        // Bỏ tick 1 dòng thì ô "check all" phải nhả ra, tick đủ cả trang thì tự bật —
        // không có cái này người dùng thấy ô tổng vẫn xanh dù đã bỏ bớt dòng.
        $('#tblKQDK_HoSo').on('change', 'tbody .kqdk-sel', function () {
            var $all = $('#tblKQDK_HoSo tbody .kqdk-sel');
            var soChon = $all.filter(':checked').length;
            $('#chkKQDK_All')
                .prop('checked', soChon > 0 && soChon === $all.length)
                .prop('indeterminate', soChon > 0 && soChon < $all.length);
        });

        // Phân trang FE cho bảng Kết quả đăng ký (data đã cache đầy đủ ở _kqViewData)
        $('#ddlKQDK_PageSize').on('change', function () {
            me._kqPageSize = parseInt($(this).val(), 10) || 50;
            me._kqPageIdx = 1;
            me._kqRenderPage();
        });
        $('#btnKQDK_PageFirst').click(function () { me._kqGoPage(1); });
        $('#btnKQDK_PagePrev').click(function () { me._kqGoPage(me._kqPageIdx - 1); });
        $('#btnKQDK_PageNext').click(function () { me._kqGoPage(me._kqPageIdx + 1); });
        $('#btnKQDK_PageLast').click(function () {
            var total = (me._kqViewData || []).length;
            var pages = Math.max(1, Math.ceil(total / me._kqPageSize));
            me._kqGoPage(pages);
        });
        $('#txtKQDK_PageJump').on('change keypress', function (e) {
            if (e.type === 'keypress' && e.which !== 13) return;
            if (e.type === 'keypress') e.preventDefault();
            var p = parseInt($(this).val(), 10);
            if (!isNaN(p)) me._kqGoPage(p);
        });

        // Delegate: nút Sửa / Xóa trên từng row hồ sơ
        $('#tblKQDK_HoSo').on('click', '.btnSuaHoSo', function () {
            me.openSuaHoSo($(this).attr('data-id'));
        });
        // Bấm vào dòng → mở form hồ sơ. Bỏ qua click lên nút/checkbox/link để không
        // vừa xóa vừa mở, và bỏ qua khi user đang bôi đen để copy chữ.
        $('#tblKQDK_HoSo').on('click', 'tbody tr', function (ev) {
            if ($(ev.target).closest('a,button,input,label,select').length) return;
            var sel = window.getSelection && window.getSelection();
            if (sel && String(sel).length > 0) return;
            var id = $(this).attr('data-id');
            if (edu.util.checkValue(id)) me.openSuaHoSo(id);
        });
        $('#tblKQDK_HoSo').on('click', '.btnXoaHoSo', function () {
            var id = $(this).attr('data-id');
            if (!edu.util.checkValue(id)) return;
            edu.system.confirm("Bạn có chắc chắn xóa hồ sơ này không?");
            $("#btnYes").off("click").on("click", function () {
                me.deleteHoSo_TS(id);
            });
        });

        // Click tab bar (style aps-sv-tab): toggle class active + hiện panel tương ứng
        $('#kqdkKhaiTabs').on('click', '.aps-sv-tab', function () {
            // data-panels: 1 tab có thể gom nhiều panel (chế độ Gộp nhóm)
            var ds = $(this).attr('data-panels') || $(this).attr('data-target') || '';
            $('#kqdkKhaiTabs .aps-sv-tab').removeClass('active');
            $(this).addClass('active');
            $('#kqdk_khai .aps-sv-panel').removeClass('active');
            ds.split(',').forEach(function (p) {
                if (p) $('#' + p.trim()).addClass('active');
            });
        });

        // Tabs Prev/Next dựa vào class active của .aps-sv-tab
        $("#btnKhaiPrev").click(function () {
            var $tabs = $('#kqdkKhaiTabs .aps-sv-tab');
            var i = $tabs.index($tabs.filter('.active'));
            if (i > 0) $tabs.eq(i - 1).trigger('click');
        });
        $("#btnKhaiNext").click(function () {
            var $tabs = $('#kqdkKhaiTabs .aps-sv-tab');
            var i = $tabs.index($tabs.filter('.active'));
            if (i < $tabs.length - 1) $tabs.eq(i + 1).trigger('click');
        });

        $("#btnKhaiReset").click(function () {
            me.resetKhai_HoSo();
        });
        $("#btnKhaiSave").click(function () {
            me.saveKhai_HoSo();
        });

        // Đổi nguyện vọng đầu vào (mở picker → xác nhận CT học qua PKG_CORE_TS_HOSO.XacNhanChonChuongTrinhHoc)
        $("#btnKhaiDoiNVDauVao").click(function () {
            me.openChonNVDauVao();
        });
        $("#tblChonNVDV").on('click', '.btn-chon-nvdv', function () {
            var $tr = $(this).closest('tr');
            me.confirmChonNVDauVao({
                ChuongTrinh_Id: $tr.data('ct-id') || '',
                TenHT: $tr.data('ten-ht') || ''
            });
        });

        // Cascade: chọn Đợt tuyển sinh → cập nhật context + reload NV đầu ra & Phương thức
        // (2 dropdown này lọc theo KH + Đợt hiện tại). Reset luôn Lớp dự kiến vì NV đầu ra đổi.
        $("#ddlKQ_DotTuyenSinh").off('change.dotkq').on('change.dotkq', function () {
            me.strDot_Id_ForKQ = $(this).val() || '';
            me._loadNguyenVongDauRa();
            me._loadPhuongThucTuyenSinh();
            $('#ddlKQ_LopDuKien').html('<option value="">-- Chọn nguyện vọng đầu ra trước --</option>')
                .prop('disabled', true).val('');
            // Tab 8 lấy danh mục hồ sơ theo QUY ĐỊNH của đợt (mỗi đợt = một hệ), nên đổi đợt
            // là phải nạp lại đúng bộ quy định của hệ mới — bỏ cache rồi vẽ lại.
            me._dtQuyDinhHS = null;
            me._dtQuyDinhHS_Dot = '';
            // Cả khi KHAI MỚI (chưa có strSuaHoSo_Id): chọn đợt xong là lưới phải hiện ra
            // để cán bộ ghim luôn giấy tờ thí sinh mang tới.
            me._loadHoSoDM_ForEdit(me.strSuaHoSo_Id || '');
            me._veBadgeKeHoach();
        });

        // Cascade: chọn Nguyện vọng đầu ra → load Lớp dự kiến theo Đầu ra đó
        $("#ddlKQ_NguyenVongDauRa").off('change.lopdukien').on('change.lopdukien', function () {
            me._loadLopDuKien($(this).val());
        });

        // Nút Đóng ở header modal Kết quả đăng ký.
        // Luồng người dùng: DS kế hoạch → Kết quả đăng ký (danh sách) → bấm Sửa → form hồ sơ.
        // Ở form hồ sơ bấm Đóng thì phải lùi 1 bước về DANH SÁCH, không nhảy thẳng ra
        // ngoài danh sách kế hoạch. Chỉ đóng hẳn modal khi đang đứng ở danh sách
        // (hoặc khi vào thẳng form Khai/Import từ modal Đợt — lúc đó không có DS để lùi).
        $("#btnKQDK_Close").click(function () {
            var dangOFormKhai = !$('#kqdk_khai').hasClass('d-none');
            if (dangOFormKhai && me._kqdkVaoTuList) {
                me._exitSuaMode();
                me._kqdkVaoTuList = false;
                $('#kqdk_khai, #kqdk_import').addClass('d-none');
                $('#kqdk_list').removeClass('d-none');
                return;
            }
            $('#ket-qua-dk').modal('hide');
        });

        // Reset chế độ Sửa mỗi khi đóng modal Kết quả đăng ký (banner ẩn, nút Save về nhãn gốc)
        $("#ket-qua-dk").on('hidden.bs.modal', function () {
            me._exitSuaMode();
            me._kqdkVaoTuList = false;
            // Dọn luôn form khai: đóng modal là không còn ai đọc dữ liệu trên đó nữa, để lại
            // chỉ tổ lần sau mở lên thấy thông tin của người cũ.
            me.resetKhai_HoSo();
        });

        // Tự tính tổng điểm khi user nhập điểm môn/UT
        $("#kqdk_tab_xettuyen").on('input', '.kq-diem, .kq-diem-ut', function () {
            me.tinhTongDiem_Khai();
        });

        // Nhắc khai thiếu/lệch ở tab Xuất hóa đơn — vẽ lại mỗi khi user gõ/chọn.
        // Bind ở #kqdk_khai (không phải #kqdk_tab_hoadon) để chế độ "Một trang" /
        // "Gộp nhóm" dời panel đi đâu thì handler vẫn bắt được.
        $("#kqdk_khai").on('input change',
            '#ddlKQ_HD_DoiTuong, #txtKQ_HD_NguoiMua, #txtKQ_HD_TenDonVi, #txtKQ_HD_MST,'
            + ' #txtKQ_HD_MaQHNS, #txtKQ_HD_SDT, #txtKQ_HD_DiaChi, #txtKQ_HD_Email',
            function () { me._veCanhBaoHoaDon(); });
        // Bấm sang tab nào cũng soát lại — người dùng hay khai tab khác rồi mới quay về
        $("#kqdkKhaiTabs").on('click', '.aps-sv-tab', function () {
            setTimeout(function () { me._veCanhBaoHoaDon(); }, 0);
        });

        $("#fileImportTT").on('change', function () {
            var f = this.files && this.files[0];
            if (!f) {
                $("#lblImportFileInfo").text('');
                $("#btnStartImportTT").prop('disabled', true);
                return;
            }
            $("#lblImportFileInfo").text('Đã chọn: ' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)');
            $("#btnStartImportTT").prop('disabled', false);
            $("#tblImportTT_Log tbody").html('');
        });

        $("#btnStartImportTT").click(function () {
            me.startImport_TrungTuyen();
        });
        $("#btnCancelImportTT").click(function () {
            me._importCancelled = true;
        });
        $("#btnDownloadMauTT").click(function () {
            me.downloadMauImport_TrungTuyen();
        });

        // Panel lỗi Import Excel (giống docAPI): show/hide + tải Excel lỗi
        $("#btnImportTT_ShowErrors").click(function (e) {
            e.preventDefault();
            me.renderImportTT_ErrorsPanel();
            $('#importTT_ErrorsPanel').removeClass('d-none');
        });
        $("#btnImportTT_HideErrors").click(function (e) {
            e.preventDefault();
            $('#importTT_ErrorsPanel').addClass('d-none');
        });
        $("#btnImportTT_ExportErrors").click(function (e) {
            e.preventDefault();
            me.exportImportTT_ErrorsToExcel();
        });

        // Đối chiếu file Excel với DS hệ thống (dùng CCCD làm key)
        $("#fileDiff").on('change', function () {
            var f = this.files && this.files[0];
            if (!f) {
                $('#lblDiff_FileInfo').text('');
                $('#btnDiff_Compare').prop('disabled', true);
                return;
            }
            $('#lblDiff_FileInfo').text('Đã chọn: ' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)');
            $('#btnDiff_Compare').prop('disabled', false);
        });
        $("#btnDiff_Compare").click(function () { me._diffCompareFileVsSystem(); });
        $("#btnDiff_ToggleHelp").click(function (e) { e.preventDefault(); $('#diffHelp').toggleClass('d-none'); });
        $("#importTT_DiffPanel").on('click', '.btnDiff_Export', function () {
            me._diffExportCategory($(this).attr('data-cat'));
        });

        // Đọc dữ liệu từ nguồn API (mapping cột API ↔ trường thông tin, lưu localStorage)
        me.initDocAPI_Bindings();

        // Các mục khai không dùng tới → đóng sẵn, tích ô mới sổ ra
        me._initSectionToggle();

        // Ô lịch hiện theo ngôn ngữ trình duyệt → in lại ngày theo dd/mm/yyyy cho chắc
        me._bindNgayHienThi('txtKQ_NgaySinh', 'lblKQ_NgaySinh_VN');
        me._bindNgayHienThi('txtKQ_NgayCapCCCD', 'lblKQ_NgayCapCCCD_VN');

        /*---- Tra cứu người học toàn hệ thống ----*/
        $('#btnTraCuuNguoiHoc').click(function () {
            // Danh mục Giới tính — hồ sơ tuyển sinh chỉ trả Id, cần bảng tra để ra chữ.
            // Hàm tự chặn gọi lại lần 2 nên bấm bao nhiêu lần cũng chỉ nạp một lượt.
            me._preloadDMForList();
            $('#tra-cuu-nguoi-hoc').modal('show');
            setTimeout(function () { $('#txtTraCuu_TuKhoa').focus(); }, 350);
        });
        $('#btnTraCuu_Tim').click(function () { me.traCuu_Tim(); });
        $('#txtTraCuu_TuKhoa').on('keypress', function (e) {
            if (e.which === 13) { e.preventDefault(); me.traCuu_Tim(); }
        });
        $('#btnTraCuu_Xoa').click(function () {
            $('#txtTraCuu_TuKhoa').val('');
            $('#txtTraCuu_NgaySinh').val('');
            $('#lblTraCuu_Tong').text('');
            me._tcDS = [];
            $('#tcPagerWrap').addClass('d-none');
            $('#tblTraCuu tbody').html('<tr><td colspan="10" class="text-center text-muted" style="padding:26px;">'
                + 'Nhập họ tên hoặc số CCCD rồi bấm <b>Tra cứu</b>.</td></tr>');
            $('#txtTraCuu_TuKhoa').focus();
        });
        /*---- Phân trang bảng tra cứu (cắt tại chỗ, không hỏi lại hệ thống) ----*/
        $('#ddlTraCuu_PageSize').on('change', function () {
            me._tcPageIdx = 1;
            me._tcVeTrang();
        });
        $('#btnTraCuu_First').click(function () { me._tcPageIdx = 1; me._tcVeTrang(); });
        $('#btnTraCuu_Prev').click(function () { me._tcPageIdx = (me._tcPageIdx || 1) - 1; me._tcVeTrang(); });
        $('#btnTraCuu_Next').click(function () { me._tcPageIdx = (me._tcPageIdx || 1) + 1; me._tcVeTrang(); });
        $('#btnTraCuu_Last').click(function () {
            var size = parseInt($('#ddlTraCuu_PageSize').val(), 10) || 50;
            me._tcPageIdx = Math.max(1, Math.ceil((me._tcDS || []).length / size));
            me._tcVeTrang();
        });

        $('#tblTraCuu').on('click', '.tc-mo-hoso', function () {
            me.traCuu_MoHoSo($(this).attr('data-hoso'), $(this).attr('data-kh'), $(this).attr('data-dot'));
        });

        edu.system.getList_MauImport("zonebtnBaoCao_KHTS", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
                'strLoai_TuyenSinh_Id': edu.system.getValById('ddlLoaiNguonTuyenSinh'),
                'strTs_PhuongAn_TuyenSinh_Id': edu.system.getValById('ddlPhuongAnTuyenSinh'),
                'strNam_TuyenSinh': edu.system.getValById('txtSearch_NamTuyenSinh'),
                'strNam_Hoc': edu.system.getValById('txtSearch_NamHoc'),
                'strHoc_Ky': edu.system.getValById('txtSearch_HocKy'),
                'strPlan_Status_Code': edu.system.getValById('ddlTinhTrangKeHoach'),
                'dIs_Active': edu.system.getValById('ddlConHieuLuc'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var chon = me._kqLayIdDaTick();
            addKeyValue("strSinhVienID", chon.person.join(','));
            addKeyValue("strHoSoID", chon.hoso.join(','));
        });

        edu.system.getList_MauImport("zonebtnBaoCao_KHTS2", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
                'strLoai_TuyenSinh_Id': edu.system.getValById('ddlLoaiNguonTuyenSinh'),
                'strTs_PhuongAn_TuyenSinh_Id': edu.system.getValById('ddlPhuongAnTuyenSinh'),
                'strNam_TuyenSinh': edu.system.getValById('txtSearch_NamTuyenSinh'),
                'strNam_Hoc': edu.system.getValById('txtSearch_NamHoc'),
                'strHoc_Ky': edu.system.getValById('txtSearch_HocKy'),
                'strPlan_Status_Code': edu.system.getValById('ddlTinhTrangKeHoach'),
                'dIs_Active': edu.system.getValById('ddlConHieuLuc'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var chon2 = me._kqLayIdDaTick();
            addKeyValue("strSinhVienID", chon2.person.join(','));
            addKeyValue("strHoSoID", chon2.hoso.join(','));
        });
    },

    /*==========================================================================
    == TRA CỨU NGƯỜI HỌC TOÀN HỆ THỐNG  (sếp Khoa 23/09/2026)
    == "tìm 1 học sinh bất kỳ, chỉ biết họ tên / ngày sinh / số CCCD, mà không
    ==  biết nó đang ở năm nào, hệ nào... lần vết học sinh mà không biết cháu nó
    ==  đang học ở đâu thì chết"
    ==
    == Ô "Tìm nhanh" ở bảng Kết quả đăng ký KHÔNG làm được việc này: nó lọc trên
    == đám dòng đã tải của MỘT kế hoạch + MỘT đợt. Ở đây hỏi thẳng xuống hệ thống.
    ==
    == 3 API, đã đo bằng console 23/09/2026 (đừng nghi lại, đã chạy thật):
    ==   LayDS_HoSo_TS         bỏ trống kế hoạch + đợt → 48 dòng cho từ khóa "Nguyễn"
    ==                         → tìm được toàn hệ thống. Tìm bằng CCCD cũng ra.
    ==   LayDSNguoiHoc_All     dBoQuaPhamVi=1 → bỏ giới hạn phạm vi theo quyền.
    ==                         Trả sẵn hệ / khóa / ngành / lớp / trạng thái.
    ==   Pr_Ts_Kh_Dau_Ra_Get_Ds bỏ trống kế hoạch → 92 dòng đầu ra của TẤT CẢ kế hoạch,
    ==                         mỗi dòng có TS_KEHOACH_TUYENSINH_TEN + ..._DOT_TEN.
    ==
    == ⚠ Vì sao phải có bước đầu ra: response hồ sơ tuyển sinh KHÔNG có kế hoạch,
    ==   KHÔNG có đợt, KHÔNG có năm — chỉ có NGUYENVONG_DAURA_ID. Bản chi tiết
    ==   LayTT_HoSo_TS (42 cột) cũng không có. Nên "đang ở đâu" chỉ suy ra được
    ==   bằng cách tra ngược nguyện vọng đầu ra → (kế hoạch, đợt, hệ, ngành).
    ==   Nếu sau này BE bổ sung 2 cột đó vào LayDS_HoSo_TS thì bỏ được _tcEnsureDauRa.
    ==========================================================================*/
    _TC_ACT: {
        HoSo: { action: 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP', func: 'PKG_CORE_TS_HOSO.LayDS_HoSo_TS' },
        NguoiHoc: { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All' },
        DauRa: { action: 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP', func: 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds' }
    },

    _tcDauRaMap: null,      // DAURA_ID → { khTen, dotTen, khId, dotId, heTen, khoaTen, nganhTen }
    _tcDangChay: false,
    _tcDS: [],              // toàn bộ kết quả đang giữ, để cắt trang tại chỗ
    _tcPageIdx: 1,
    _tcInfoMap: {},         // personId → { cccd, gioiTinh, dienThoai } tra bổ sung từ hồ sơ TS

    /*------------------------------------------
    -- Map nguyện vọng đầu ra → kế hoạch/đợt/hệ/ngành. Một lần cho cả phiên
    -- (92 dòng, không đáng để gọi lại mỗi lần tra).
    -------------------------------------------*/
    _tcEnsureDauRa: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (me._tcDauRaMap) { xong(); return; }
        var A = me._TC_ACT.DauRa;
        edu.system.makeRequest({
            success: function (data) {
                var map = {};
                var rows = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i] || {};
                    var id = r.ID || r.Id;
                    if (!id) continue;
                    map[id] = {
                        khId: r.TS_KEHOACH_TUYENSINH_ID || '',
                        khTen: r.TS_KEHOACH_TUYENSINH_TEN || '',
                        dotId: r.TS_KEHOACH_TUYENSINH_DOT_ID || '',
                        dotTen: r.TS_KEHOACH_TUYENSINH_DOT_TEN || '',
                        heTen: r.DAOTAO_HEDAOTAO_TEN || '',
                        khoaTen: r.DAOTAO_KHOADAOTAO_TEN || '',
                        nganhTen: r.DAOTAO_NGANH_TS_TEN || r.DAOTAO_NGANH_DT_TEN || r.TEN || ''
                    };
                }
                me._tcDauRaMap = map;
                xong();
            },
            // Hỏng thì vẫn tra cứu được, chỉ là cột "Đang ở đâu" thiếu kế hoạch/đợt
            error: function () { me._tcDauRaMap = {}; xong(); },
            type: 'POST', contentType: true, action: A.action,
            data: {
                'action': A.action, 'func': A.func, 'iM': edu.system.iM,
                'strTuKhoa': '', 'strTs_Kh_TuyenSinh_Id': '', 'strTs_Kh_TuyenSinh_Dot_Id': '',
                'strTs_Kh_Dot_PhuongThuc_Id': '', 'strOutput_Status_Code': '',
                'dIs_Public': '', 'dIs_Active': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Các biến thể hoa/thường của từ khóa.
    -- ⚠ `LayDS_HoSo_TS` so khớp CÓ PHÂN BIỆT HOA THƯỜNG (đo 23/09/2026: gõ "tạ thị út"
    --   ra 0 dòng, gõ "Tạ Thị Út" ra đúng hồ sơ; còn "Nguyễn" ra 48 dòng vì trùng đúng
    --   kiểu chữ đang lưu). `LayDSNguoiHoc_All` thì không phân biệt — nên tìm theo tên
    --   chỉ ra người học mà mất hồ sơ tuyển sinh, đúng hiện tượng sếp Khoa gặp.
    --   Chữa tạm ở FE bằng cách thử lần lượt vài kiểu viết; gốc rễ là proc nên dùng
    --   UPPER() cả hai vế — đã ghi vào danh sách báo BE.
    -------------------------------------------*/
    _tcBienThe: function (kw) {
        var out = [];
        var them = function (s) {
            s = $.trim(s || '');
            if (s && out.indexOf(s) < 0) out.push(s);
        };
        them(kw);
        // Kiểu lưu phổ biến nhất trong CSDL: viết hoa chữ đầu mỗi từ ("Tạ Thị Út")
        them(String(kw).toLowerCase().replace(/(^|\s)(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }));
        them(String(kw).toUpperCase());
        them(String(kw).toLowerCase());
        return out;
    },

    /*------------------------------------------
    -- Tìm hồ sơ tuyển sinh, thử lần lượt các kiểu viết cho tới khi ra dữ liệu.
    -- Dừng ngay ở kiểu đầu tiên có kết quả nên bình thường chỉ tốn 1 request;
    -- chỉ khi gõ sai kiểu chữ mới phải thử thêm.
    -------------------------------------------*/
    _tcTimHoSo: function (kw, chung, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var A = me._TC_ACT.HoSo;
        var dsKw = me._tcBienThe(kw);
        var i = 0;

        var thu = function () {
            if (i >= dsKw.length) { cb([]); return; }
            var k = dsKw[i++];
            edu.system.makeRequest({
                success: function (d) {
                    var rows = (d && d.Success && edu.util.checkValue(d.Data)) ? d.Data : [];
                    if (rows.length || i >= dsKw.length) { cb(rows); return; }
                    thu();
                },
                error: function () { if (i >= dsKw.length) { cb([]); return; } thu(); },
                type: 'POST', contentType: true, action: A.action,
                data: $.extend({}, chung, {
                    'action': A.action, 'func': A.func,
                    'strTuKhoa': k,
                    'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                    'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                    'strHanhDong_Code': 'XEM',
                    // Để TRỐNG kế hoạch + đợt = tìm toàn hệ thống (đã đo, không phải đoán)
                    'strHoSo_KH_TS_Id': '', 'strHoSo_KH_TS_Dot_Id': '', 'strHoSo_KH_Dot_PT_Id': '',
                    'strNguyenVong_DauRa_Id': '', 'strHoSo_KetQuaCode': '',
                    'strHoSo_TuNgay': '', 'strHoSo_DenNgay': ''
                }),
                fakedb: []
            }, false, false, false, null);
        };
        thu();
    },

    traCuu_Tim: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var kw = $.trim($('#txtTraCuu_TuKhoa').val() || '');
        if (kw.length < 2) {
            edu.system.alert('Nhập ít nhất 2 ký tự (họ tên hoặc số CCCD) rồi tra cứu.', 'w');
            return;
        }
        if (me._tcDangChay) return;
        me._tcDangChay = true;

        $('#lblTraCuu_Tong').text('');
        $('#tblTraCuu tbody').html('<tr><td colspan="10" class="text-center text-muted" style="padding:26px;">'
            + '<i class="fa-light fa-spinner fa-spin"></i> Đang tìm trên toàn hệ thống…</td></tr>');

        var ketQua = { ts: null, nh: null, lop: null };
        var xong = function () {
            if (ketQua.ts === null || ketQua.nh === null || ketQua.lop === null) return;
            me._tcDangChay = false;
            // Gộp người học tìm theo từ khóa + người học của lớp khớp mã, bỏ trùng
            var daCo = {}, nh = [];
            ketQua.nh.concat(ketQua.lop).forEach(function (r) {
                var k = (r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '') + '|'
                    + (r.STUDY_ID || r.TRACK_ID || r.DAOTAO_LOPQUANLY_ID || '');
                if (daCo[k]) return;
                daCo[k] = 1;
                nh.push(r);
            });
            me._tcRender(ketQua.ts, nh, kw);
        };

        // Nạp map đầu ra trước (cache) rồi mới bắn 2 nguồn — cần map ngay lúc dựng bảng
        me._tcEnsureDauRa(function () {
            var chung = {
                'iM': edu.system.iM,
                'strTuKhoa': kw,
                'strNguoiThucHien_Id': edu.system.userId,
                'pageIndex': 1,
                'pageSize': 200
            };

            me._tcTimHoSo(kw, chung, function (rows) { ketQua.ts = rows; xong(); });
            /* Người học: hỏi CẢ HAI nguồn rồi gộp.
               `LayDSNguoiHoc_All` tìm tốt theo CCCD nhưng hay trượt khi tìm theo họ tên
               tiếng Việt; proc "Quản lý toàn bộ" thì ngược lại. Thiếu một trong hai là
               có người tra tên không ra dù đang học (khách báo 24/09/2026: "Cà Văn Đạt"). */
            var nhXong = { a: null, b: null };
            var gopNH = function () {
                if (nhXong.a === null || nhXong.b === null) return;
                ketQua.nh = nhXong.a.concat(nhXong.b);
                xong();
            };
            me._tcTimNguoiHoc({ 'strTuKhoa': kw }, function (rows) { nhXong.a = rows; gopNH(); });
            me._tcGoiQLTB({ 'strTuKhoa': kw }, function (rows) { nhXong.b = rows; gopNH(); });
            // Gõ mã lớp → liệt kê cả lớp. Nguồn người học không tìm theo mã lớp bằng
            // từ khóa được, phải đổi mã lớp → Id lớp rồi mới lọc (xem _tcTimTheoLop).
            me._tcTimTheoLop(kw, function (rows) { ketQua.lop = rows; xong(); });
        });
    },

    /*------------------------------------------
    -- Một lời gọi LayDSNguoiHoc_All. `extra` ghi đè phần lọc (từ khóa hoặc Id lớp).
    -------------------------------------------*/
    _tcTimNguoiHoc: function (extra, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var B = me._TC_ACT.NguoiHoc;
        edu.system.makeRequest({
            success: function (d) { cb((d && d.Success && edu.util.checkValue(d.Data)) ? d.Data : []); },
            error: function () { cb([]); },
            type: 'POST', contentType: true, action: B.action,
            data: $.extend({
                'action': B.action, 'func': B.func, 'iM': edu.system.iM,
                'strTuKhoa': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'pageIndex': 1, 'pageSize': 200,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id || '',
                'strHanhDong_Code': '',
                'strDaoTao_HeDaoTao_Id': '', 'strDaoTao_KhoaDaoTao_Id': '', 'strDaoTao_ChuongTrinh_Id': '',
                'strDaoTao_KhoaQuanLy_Id': '', 'strDaoTao_LopQuanLy_Id': '', 'strStudyStatus_Ids': '',
                'dIsPrimary': '',
                // Bỏ giới hạn phạm vi theo quyền — mục đích của màn này là tìm toàn trường
                'dBoQuaPhamVi': 1
            }, extra || {}),
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Lấy danh sách người học của MỘT lớp.
    -- Dùng `pkg_hosohocvien.LayDanhSachHoSoNhieuNganh` — đây là proc của màn "Quản lý
    -- toàn bộ" bên Sinh viên, đã đo 24/09/2026: lọc theo `strLopQuanLy_Id` CHẠY ĐÚNG
    -- (lớp 66CCK2_VLVH sĩ số 2 → trả đúng 2 dòng), trong khi `LayDSNguoiHoc_All` phớt lờ.
    -- Response tên cột khác → đổi ngay về đúng dạng mà _tcRender đang đọc, để không phải
    -- rẽ nhánh riêng cho nguồn này ở chỗ dựng bảng.
    -- ⚠ Proc này KHÔNG trả CCCD và điện thoại → 2 cột đó để trống với dòng tìm theo lớp.
    -------------------------------------------*/
    _tcTimTheoLop_Goi: function (lopId, cb) {
        main_doc.KeHoachTuyenSinhNew._tcGoiQLTB({ 'strLopQuanLy_Id': lopId }, cb);
    },

    /*------------------------------------------
    -- Gọi proc "Quản lý toàn bộ" — dùng cho CẢ tra theo lớp lẫn tra theo từ khóa.
    -- ⚠ Vì sao phải thêm nguồn này cho tra theo từ khóa: `LayDSNguoiHoc_All` tìm theo
    --   HỌ TÊN tiếng Việt rất hay trượt — gõ "Cà Văn Đạt" ra 0 dòng trong khi em đó
    --   đang học lớp 66CĐL1 (khách báo 24/09/2026). Proc này là proc của màn Quản lý
    --   toàn bộ, tìm theo tên chạy đúng.
    -------------------------------------------*/
    _tcGoiQLTB: function (loc, cb) {
        var A = 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP';
        edu.system.makeRequest({
            success: function (d) {
                var rows = (d && d.Success && edu.util.checkValue(d.Data)) ? d.Data : [];
                cb(rows.map(function (r) {
                    return {
                        PERSON_ID: r.QLSV_NGUOIHOC_ID || '',
                        STUDY_ID: r.ID || '',
                        FULL_NAME: ((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || '')).trim(),
                        NGAYSINH: r.QLSV_NGUOIHOC_NGAYSINH || '',
                        MASO: r.QLSV_NGUOIHOC_MASO || '',
                        DAOTAO_HEDAOTAO_TEN: r.DAOTAO_HEDAOTAO_TEN || '',
                        DAOTAO_KHOADAOTAO_TEN: r.DAOTAO_KHOADAOTAO_TEN || '',
                        DAOTAO_CHUONGTRINH_TEN: r.DAOTAO_CHUONGTRINH_TEN || '',
                        DAOTAO_LOPQUANLY_ID: r.DAOTAO_LOPQUANLY_ID || '',
                        DAOTAO_LOPQUANLY_TEN: r.DAOTAO_LOPQUANLY_MA || r.DAOTAO_LOPQUANLY_TEN || '',
                        QLSV_TRANGTHAINGUOIHOC_TEN: r.QLSV_TRANGTHAINGUOIHOC_TEN || ''
                    };
                }));
            },
            error: function () { cb([]); },
            type: 'POST', contentType: true, action: A,
            data: $.extend({
                'action': A, 'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh', 'iM': edu.system.iM,
                'strTuKhoa': '', 'strKhoaQuanLy_Id': '', 'strHeDaoTao_Id': '', 'strKhoaDaoTao_Id': '',
                'strChuongTrinh_Id': '', 'strLopQuanLy_Id': '', 'strNamNhapHoc': '',
                'strTrangThaiNguoiHoc_Id': '', 'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiTao_Id': '', 'strNgayBatDau': '', 'strNgayKetThuc': '',
                'strNguoiThucHien_Id': edu.system.userId, 'pageIndex': 1, 'pageSize': 500
            }, loc || {}),
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Tra theo LỚP QUẢN LÝ (sếp Khoa 24/09/2026: gõ "66CCK2_VLVH" phải ra cả lớp).
    -- Nguồn người học chỉ lọc lớp bằng Id, không nhận mã lớp qua từ khóa — nên phải
    -- đối chiếu mã/tên lớp trong danh mục lớp (đã có sẵn bộ nhớ tạm _lopQLMap dùng
    -- chung với cột "Mã lớp QL" của bảng danh sách) để ra Id rồi mới hỏi.
    -- Giới hạn 3 lớp khớp nhất: gõ "66" mà khớp 50 lớp thì bắn 50 request là treo màn.
    -------------------------------------------*/
    _tcTimTheoLop: function (kw, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Mã lớp không có dấu cách — gõ họ tên thì khỏi mất công tra danh mục lớp
        if (/\s/.test(kw)) { cb([]); return; }

        me._ensureLopQLLookup(function () {
            var k = String(kw).toLowerCase();
            var map = me._lopQLMap || {};
            var ids = [];
            for (var id in map) {
                if (!map.hasOwnProperty(id)) continue;
                var o = map[id] || {};
                var ma = String(o.ma || '').toLowerCase();
                var ten = String(o.ten || '').toLowerCase();
                if (ma === k || ten === k) { ids.unshift(id); continue; }   // khớp đúng lên đầu
                if (ma.indexOf(k) >= 0 || ten.indexOf(k) >= 0) ids.push(id);
            }
            ids = ids.slice(0, 3);
            if (!ids.length) { cb([]); return; }

            var con = ids.length, gom = [];
            ids.forEach(function (id) {
                me._tcTimTheoLop_Goi(id, function (rows) {
                    /* ⚠ VẪN SOÁT LẠI. Đo 24/09/2026: `LayDSNguoiHoc_All` nhận
                       strDaoTao_LopQuanLy_Id / strLopQuanLy_Id nhưng KHÔNG lọc — trả nguyên
                       một trang 50 người chẳng ai thuộc lớp (khách báo "tìm ra mà lớp quản
                       lý không hiển thị"). Đổi sang proc bên dưới thì lọc đúng, nhưng giữ
                       bước soát này để nếu proc đổi tính nết thì ra 0 dòng, chứ không đổ
                       danh sách rác cho người dùng tin nhầm. */
                    var dung = (rows || []).filter(function (r) {
                        var lid = r.DAOTAO_LOPQUANLY_ID || r.LOPQUANLY_ID || '';
                        return String(lid) === String(id);
                    });
                    if ((rows || []).length && !dung.length) {
                        console.log('[TraCuu] proc bỏ qua bộ lọc lớp: hỏi lớp ' + id
                            + ' nhưng ' + rows.length + ' dòng trả về không dòng nào thuộc lớp đó → bỏ hết.');
                    }
                    gom = gom.concat(dung);
                    if (--con === 0) cb(gom);
                });
            });
        });
    },

    /*------------------------------------------
    -- Gộp 2 nguồn thành 1 bảng. Mỗi bản ghi = 1 dòng, KHÔNG gộp theo người:
    -- một em nộp 2 nguyện vọng, hoặc học 2 ngành, thì phải thấy đủ cả 2 chỗ —
    -- gộp lại là giấu mất đúng thứ sếp cần nhìn.
    -------------------------------------------*/
    _tcRender: function (rowsTS, rowsNH, kw, daDoLop) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var pick = me._kqPick;
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var map = me._tcDauRaMap || {};

        // Lọc thêm theo ngày sinh nếu có nhập (2 nguồn trả dd/mm/yyyy, ô lọc là ISO)
        var ngayLoc = me._ngaySinhToUI($('#txtTraCuu_NgaySinh').val() || '');
        var hopNgay = function (ns) {
            if (!ngayLoc) return true;
            return me._ngaySinhToUI(ns) === ngayLoc;
        };

        var ds = [];

        /* Lớp quản lý theo NGƯỜI, gom từ nguồn người học.
           Hồ sơ tuyển sinh không có lớp — lớp chỉ sinh ra sau khi phân lớp bên người học.
           Nên dòng Tuyển sinh phải tra chéo sang đây mới biết em đó đã có lớp hay chưa,
           thay vì hiển thị trống làm sếp tưởng chưa phân lớp. */
        var lopTheoNguoi = {};
        (rowsNH || []).forEach(function (r) {
            var pid = r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '';
            var lop = r.DAOTAO_LOPQUANLY_TEN || r.LOPQUANLY_TEN || r.DAOTAO_LOPQUANLY_N1_TEN
                || r.DAOTAO_LOPQUANLY_MA || r.LOPQUANLY_MA || '';
            if (pid && lop && !lopTheoNguoi[pid]) lopTheoNguoi[pid] = lop;
        });

        /* ⚠ Tra theo HỌ TÊN thì nguồn người học hay trả 0 dòng (Phan Bá Tước: bảng
           danh sách có lớp 66CCK2_VLVH mà tra cứu ra rỗng — khách báo 24/09/2026).
           Bảng danh sách không gặp lỗi đó vì nó hỏi bằng SỐ CCCD.
           Nên lấy thêm lớp từ đúng cơ chế bảng danh sách đang dùng (_lopSVMap, hỏi theo
           CCCD, có nhớ tạm) rồi mới kết luận "chưa phân lớp". */
        var lopTuCache = function (pid) {
            var o = pid ? (me._lopSVMap || {})[pid] : null;
            return o ? (o.ma || o.ten || '') : '';
        };

        (rowsTS || []).forEach(function (r) {
            var ns = pick(r, ['COREPERSON_NGAYSINH']);
            if (!hopNgay(ns)) return;
            var dr = map[pick(r, ['NGUYENVONG_DAURA_ID'])] || {};
            ds.push({
                loai: 'TS',
                personId: pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']),
                hoTen: pick(r, ['COREPERSON_HOTEN']),
                ngaySinh: ns,
                gioiTinh: me._kqLookupById(pick(r, ['COREPERSON_GIOITINH_ID']), 'ddlKQ_GioiTinh'),
                cccd: pick(r, ['PERSONIDEN_SOCCCD']),
                dienThoai: pick(r, ['PERSONCONTACT_DIENTHOAI']),
                hosoId: pick(r, ['HOSO_ID']),
                khId: dr.khId || '', dotId: dr.dotId || '',
                lop: lopTheoNguoi[pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])]
                    || lopTuCache(pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])) || '',
                noi: dr.khTen
                    ? ('<b>Tuyển sinh</b><br/><span class="tc-phu">' + esc(dr.khTen)
                        + (dr.dotTen ? ' — đợt ' + esc(dr.dotTen) : '') + '</span>'
                        + ((dr.heTen || dr.nganhTen)
                            ? '<br/><span class="tc-phu">' + esc(dr.heTen)
                            + (dr.nganhTen ? ' • ' + esc(dr.nganhTen) : '') + '</span>' : ''))
                    : '<b>Tuyển sinh</b><br/><span class="tc-phu">chưa xác định được kế hoạch/đợt</span>',
                trangThai: [pick(r, ['HOSO_KETQUA']), pick(r, ['HOSO_STATUS'])]
                    .filter(function (x) { return !!x; })
                    .map(function (x) { return me._tcTenTrangThai(x); }).join('<br/>')
            });
        });

        (rowsNH || []).forEach(function (r) {
            var ns = r.NGAYSINH || r.DATE_OF_BIRTH || r.QLSV_NGUOIHOC_NGAYSINH || '';
            if (!hopNgay(ns)) return;
            var he = r.DAOTAO_HEDAOTAO_TEN || r.TENHEDAOTAO || '';
            var khoa = r.DAOTAO_KHOADAOTAO_TEN || r.KHOAHOC_N1_TEN || '';
            var lop = r.DAOTAO_LOPQUANLY_TEN || r.LOPQUANLY_TEN || '';
            var nganh = r.DAOTAO_CHUONGTRINH_TEN || r.NGANHHOC_N1_TEN || r.TENCHUONGTRINH || '';
            var coHoc = !!(he || khoa || lop || nganh);
            ds.push({
                loai: 'NH',
                chuaGan: !coHoc,          // dòng "rỗng ruột" — dùng để lọc bớt ở dưới
                personId: r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '',
                hoTen: r.FULL_NAME || ((r.HODEM || '') + ' ' + (r.TEN || '')).trim(),
                ngaySinh: ns,
                gioiTinh: r.GIOITINH_TEN || '',
                cccd: r.DINHDANH_CHINH_SO || '',
                dienThoai: r.SODIENTHOAI_CANHAN || r.SODIENTHOAI_GIADINH || '',
                maSV: r.MASO || r.MA_NGUOIHOC_CHINH || r.QLSV_NGUOIHOC_MASO || '',
                lop: lop || lopTuCache(r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || ''),
                noi: coHoc
                    // Lớp đã có cột riêng → bỏ khỏi đây cho khỏi lặp hai chỗ
                    ? ('<b>Đang học</b><br/><span class="tc-phu">' + esc(he)
                        + (khoa ? ' • khóa ' + esc(khoa) : '') + '</span>'
                        + (nganh ? '<br/><span class="tc-phu">' + esc(nganh) + '</span>' : ''))
                    // HASSTUDY=0 + hệ/khóa/lớp đều rỗng: đã tiếp nhận nhưng chưa phân lớp.
                    // Phải nói rõ, không được hiển thị như "đang học" — sếp sẽ tìm nhầm chỗ.
                    : '<b>Hồ sơ người học</b><br/><span class="tc-phu">chưa gắn quá trình học (chưa phân lớp)</span>',
                trangThai: r.QLSV_TRANGTHAINGUOIHOC_TEN || r.STUDY_STATUS_TEN || ''
            });
        });

        /* Bỏ dòng "hồ sơ người học chưa gắn quá trình học" khi người đó ĐÃ có dòng khác
           (sếp Khoa 23/09/2026: "cái hồ sơ nào chưa được gắn á không hiển thị cho tôi").
           Dòng đó không nói thêm được gì ngoài dòng tuyển sinh đã có — chỉ làm rối bảng.
           ⚠ Vẫn GIỮ nếu người đó không còn dòng nào khác: ẩn nốt là tra tên ra "không tìm
           thấy" trong khi hệ thống có hồ sơ — đúng kiểu mất dấu mà màn này sinh ra để chống. */
        var khoaNguoi = function (x) {
            return x.personId || x.cccd || (String(x.hoTen || '') + '|' + String(x.ngaySinh || ''));
        };
        var coDongThat = {};
        ds.forEach(function (x) { if (!x.chuaGan) coDongThat[khoaNguoi(x)] = true; });
        var soAn = 0;
        ds = ds.filter(function (x) {
            if (x.chuaGan && coDongThat[khoaNguoi(x)]) { soAn++; return false; }
            return true;
        });

        // Cùng một người thì các dòng đứng liền nhau cho dễ đọc
        ds.sort(function (a, b) {
            var n = String(a.hoTen || '').localeCompare(String(b.hoTen || ''), 'vi');
            if (n !== 0) return n;
            return (a.loai === b.loai) ? 0 : (a.loai === 'TS' ? -1 : 1);
        });

        var soTS = ds.filter(function (x) { return x.loai === 'TS'; }).length;
        var soNH = ds.length - soTS;
        $('#lblTraCuu_Tong').text(ds.length
            ? (ds.length + ' kết quả — ' + soTS + ' hồ sơ tuyển sinh, ' + soNH + ' người học'
                + (soAn ? ' (ẩn ' + soAn + ' dòng chưa gắn quá trình học)' : ''))
            : '');

        if (!ds.length) {
            me._tcDS = [];
            $('#tcPagerWrap').addClass('d-none');
            $('#tblTraCuu tbody').html('<tr><td colspan="10" class="text-center text-muted" style="padding:26px;">'
                + 'Không tìm thấy ai khớp với <b>' + esc(kw) + '</b>'
                + (ngayLoc ? ' và ngày sinh <b>' + esc(ngayLoc) + '</b>' : '') + '.'
                + '<br/><span style="font-size:12.5px;">Thử bỏ bớt dấu, nhập họ tên ngắn hơn, hoặc tra bằng số CCCD.</span>'
                + '</td></tr>');
            return;
        }

        // Giữ lại cả danh sách rồi cắt trang — dữ liệu đã nằm trong bộ nhớ nên lật trang
        // không phải hỏi lại hệ thống.
        me._tcDS = ds;
        if (!daDoLop) me._tcPageIdx = 1;   // tra mới thì về trang 1; vẽ lại sau khi dò lớp thì giữ nguyên trang
        me._tcVeTrang();

        /* Dò lớp cho những dòng còn trống, bằng đúng hàm bảng danh sách đang dùng
           (hỏi theo CCCD, chỉ hỏi cho hồ sơ đã tạo hồ sơ học tập, có nhớ tạm).
           Xong thì vẽ lại MỘT lần — cờ daDoLop chặn lặp vô tận, vì lượt vẽ thứ hai
           mọi id đã nằm trong bộ nhớ tạm nên _ensureLopForRows trả về "không có gì mới". */
        if (!daDoLop && (rowsTS || []).length) {
            me._ensureLopForRows(rowsTS, function (coMoi) {
                if (coMoi) me._tcRender(rowsTS, rowsNH, kw, true);
            });
        }
    },

    /*------------------------------------------
    -- Mã trạng thái hồ sơ tuyển sinh → chữ đọc được.
    -- Hồ sơ tuyển sinh trả về mã kỹ thuật (TRUNGTUYEN, DA_TIEPNHAN), còn bên người học
    -- trả sẵn chữ tiếng Việt ("Đang học") — nên cùng một cột mà hai dòng trông khác hẳn.
    -- Mã lạ thì GIỮ NGUYÊN, không đoán bừa ra chữ.
    -------------------------------------------*/
    _TC_TRANGTHAI: {
        'TRUNGTUYEN': 'Trúng tuyển',
        'KHONGTRUNGTUYEN': 'Không trúng tuyển',
        'CHOXETTUYEN': 'Chờ xét tuyển',
        'DA_TIEPNHAN': 'Đã tiếp nhận',
        'CHUA_TIEPNHAN': 'Chưa tiếp nhận',
        'DA_NOPHOSO': 'Đã nộp hồ sơ',
        'MOI': 'Mới tạo',
        'HUY': 'Đã hủy'
    },

    _tcTenTrangThai: function (ma) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var k = String(ma || '').trim().toUpperCase();
        return me._TC_TRANGTHAI[k] || ma || '';
    },

    /*------------------------------------------
    -- Vẽ đúng một trang của kết quả tra cứu + cập nhật thanh phân trang.
    -------------------------------------------*/
    _tcVeTrang: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };

        /* ẨN HẲN em không có hồ sơ tuyển sinh (sếp Khoa chốt 24/09/2026: "ẩn luôn sinh
           viên đó á, đỡ nhiều cái rác").
           ⚠ Chỉ ẩn khi ĐÃ TRA XONG và biết chắc là không có. Dòng chưa tra xong vẫn giữ,
           nếu không thì mới mở ra bảng đã nhấp nháy mất dòng rồi lại hiện lại. */
        var soAnTS = 0;
        var ds = (me._tcDS || []).filter(function (x) {
            if (x.loai === 'TS' || x.hosoId) return true;
            var bs = x.personId ? me._tcInfoMap[x.personId] : null;
            if (bs && !bs.hosoId) { soAnTS++; return false; }
            return true;
        });

        // Nhãn tổng phải đếm theo những gì ĐANG hiện, không thì số không khớp bảng
        var soTS = ds.filter(function (x) { return x.loai === 'TS'; }).length;
        $('#lblTraCuu_Tong').text(ds.length
            ? (ds.length + ' kết quả — ' + soTS + ' hồ sơ tuyển sinh, ' + (ds.length - soTS) + ' người học'
                + (soAnTS ? ' (ẩn ' + soAnTS + ' em không có hồ sơ tuyển sinh)' : ''))
            : (soAnTS ? ('Không có kết quả nào — đã ẩn ' + soAnTS + ' em không có hồ sơ tuyển sinh') : ''));
        // Ẩn hết sạch thì phải báo, không thì bảng trắng trơn không rõ vì sao
        if (!ds.length) {
            $('#tcPagerWrap').addClass('d-none');
            $('#tblTraCuu tbody').html('<tr><td colspan="10" class="text-center text-muted" style="padding:26px;">'
                + (soAnTS
                    ? ('Tìm thấy ' + soAnTS + ' em nhưng <b>không em nào có hồ sơ tuyển sinh</b> nên đã ẩn hết.')
                    : 'Không có kết quả.')
                + '</td></tr>');
            return;
        }

        var size = parseInt($('#ddlTraCuu_PageSize').val(), 10) || 50;
        var tong = ds.length;
        var soTrang = Math.max(1, Math.ceil(tong / size));

        if (!me._tcPageIdx || me._tcPageIdx < 1) me._tcPageIdx = 1;
        if (me._tcPageIdx > soTrang) me._tcPageIdx = soTrang;
        var trang = me._tcPageIdx;
        var dau = (trang - 1) * size;
        var cuoi = Math.min(dau + size, tong);

        $('#tcPagerWrap').removeClass('d-none');
        $('#lblTraCuu_Page').text(trang);
        $('#lblTraCuu_PageTotal').text(soTrang);
        $('#lblTraCuu_Range').text('Dòng ' + (dau + 1) + '–' + cuoi + ' / ' + tong);
        $('#btnTraCuu_First, #btnTraCuu_Prev').prop('disabled', trang <= 1);
        $('#btnTraCuu_Next, #btnTraCuu_Last').prop('disabled', trang >= soTrang);

        var trongTrang = ds.slice(dau, cuoi);

        var html = '';
        trongTrang.forEach(function (x, j) {
            var i = dau + j;   // STT chạy theo cả danh sách, không reset mỗi trang
            // Thông tin tra bổ sung (CCCD / giới tính / điện thoại) cho dòng tìm theo lớp
            var bs = x.personId ? (me._tcInfoMap[x.personId] || null) : null;
            if (bs) {
                if (!x.cccd) x.cccd = bs.cccd || '';
                if (!x.gioiTinh) x.gioiTinh = bs.gioiTinh || '';
                if (!x.dienThoai) x.dienThoai = bs.dienThoai || '';
                if (!x.hosoId) { x.hosoId = bs.hosoId || ''; x.khId = bs.khId || ''; x.dotId = bs.dotId || ''; }
            }
            var badge = (x.loai === 'TS')
                ? '<span class="tc-cham tc-cham-ts"></span>'
                : '<span class="tc-cham tc-cham-nh"></span>';
            html += '<tr>'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td>' + badge + '<b>' + esc(x.hoTen) + '</b>'
                + (x.maSV ? '<br/><span class="tc-phu">Mã SV: ' + esc(x.maSV) + '</span>' : '') + '</td>'
                + '<td class="td-center">' + esc(x.ngaySinh) + '</td>'
                + '<td class="td-center">' + esc(x.gioiTinh) + '</td>'
                + '<td class="td-center">' + esc(x.cccd) + '</td>'
                + '<td class="td-center">' + esc(x.dienThoai) + '</td>'
                + '<td>' + x.noi + '</td>'
                // Chưa có lớp thì nói thẳng "Chưa phân lớp" chứ không để ô trống —
                // trống dễ bị hiểu là hệ thống chưa lấy được dữ liệu.
                + '<td class="td-center">' + (x.lop
                    ? ('<b>' + esc(x.lop) + '</b>')
                    : '<span class="tc-phu">Chưa phân lớp</span>') + '</td>'
                + '<td class="td-center"><span class="tc-phu">' + (x.trangThai || '') + '</span></td>'
                // Mở được hồ sơ tuyển sinh thì cho nút, bất kể dòng đến từ nguồn nào —
                // dòng tìm theo lớp lấy Id hồ sơ qua bước tra bổ sung (_tcBoSungThongTin).
                + '<td class="td-center">'
                + ((x.hosoId && x.khId)
                    ? ('<button type="button" class="btn btn-sm btn-primary tc-mo-hoso" data-hoso="' + esc(x.hosoId)
                        + '" data-kh="' + esc(x.khId) + '" data-dot="' + esc(x.dotId) + '">Mở hồ sơ</button>')
                    /* Không tra ra hồ sơ tuyển sinh thì ĐỂ TRỐNG hẳn (sếp Khoa chốt
                       24/09/2026: "không có thì thôi, đỡ nhiều cái rác"). Chỉ giữ vòng
                       xoay trong lúc đang tra, để không bị hiểu nhầm là đã tra xong. */
                    : ((x.personId && !(x.personId in me._tcInfoMap))
                        ? '<i class="fa-light fa-spinner fa-spin tc-phu" title="Đang tra hồ sơ tuyển sinh…"></i>'
                        : ''))
                + '</td>'
                + '</tr>';
        });
        $('#tblTraCuu tbody').html(html);

        // Dòng nào còn thiếu CCCD/giới tính/SĐT thì tra bổ sung — CHỈ cho trang đang xem
        me._tcBoSungThongTin(trongTrang);
    },

    /*------------------------------------------
    -- Tra bổ sung CCCD / giới tính / điện thoại cho các dòng tìm THEO LỚP.
    -- Proc lớp (`LayDanhSachHoSoNhieuNganh`) không trả 3 trường này, còn nguồn hồ sơ
    -- tuyển sinh thì có đủ — nên hỏi thêm theo họ tên rồi khớp lại bằng Id người.
    --
    -- Chỉ hỏi cho các dòng ĐANG HIỂN THỊ trên trang, tối đa 6 lượt song song, có nhớ tạm:
    -- lớp 40 người mà hỏi hết một lúc là nghẽn, lật trang qua lại cũng không hỏi lại.
    -- Cùng cách làm với cột SĐT/Mã lớp của bảng Kết quả đăng ký.
    -------------------------------------------*/
    _tcBoSungThongTin: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var can = [];
        (rows || []).forEach(function (x) {
            if (x.loai === 'TS') return;                             // dòng TS vốn đã có hồ sơ
            if (x.hosoId) return;                                    // đã biết hồ sơ rồi
            if (!x.personId || !x.hoTen) return;
            if (x.personId in me._tcInfoMap) return;                 // đã hỏi rồi (kể cả không ra)
            if (can.some(function (y) { return y.personId === x.personId; })) return;
            can.push(x);
        });
        if (!can.length) return;

        var i = 0, dangChay = 0, MAX = 6;
        var tiep = function () {
            while (dangChay < MAX && i < can.length) {
                var x = can[i++];
                dangChay++;
                (function (item) {
                    var ketThuc = function () {
                        dangChay--;
                        if (i < can.length) { tiep(); return; }
                        // Vẽ lại dù có tìm ra hay không: phải đổi "đang tra…" thành kết quả
                        // thật, không thì dòng nào không tra ra sẽ quay mãi.
                        if (dangChay === 0) me._tcVeTrang();
                    };
                    me._tcTimHoSo(item.hoTen, {
                        'iM': edu.system.iM, 'strTuKhoa': item.hoTen,
                        'strNguoiThucHien_Id': edu.system.userId,
                        'pageIndex': 1, 'pageSize': 50
                    }, function (rs) {
                        var pick = me._kqPick;
                        // Khớp theo Id người cho chắc; không có thì đành khớp họ tên + ngày sinh
                        var hit = (rs || []).filter(function (r) {
                            return String(pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])) === String(item.personId);
                        })[0];
                        if (!hit) {
                            hit = (rs || []).filter(function (r) {
                                return String(pick(r, ['COREPERSON_HOTEN']) || '').trim() === String(item.hoTen).trim()
                                    && me._ngaySinhToUI(pick(r, ['COREPERSON_NGAYSINH'])) === me._ngaySinhToUI(item.ngaySinh);
                            })[0];
                        }
                        /* Tiện thể giữ luôn Id hồ sơ tuyển sinh + kế hoạch/đợt của em đó.
                           Nhờ vậy dòng tìm theo LỚP cũng bấm được "Mở hồ sơ" — trước đây
                           nút chỉ hiện ở dòng tuyển sinh, vì dòng người học không mang
                           theo Id hồ sơ (sếp Khoa hỏi 24/09/2026 "sao không có thao tác mở"). */
                        var dr = hit ? ((me._tcDauRaMap || {})[pick(hit, ['NGUYENVONG_DAURA_ID'])] || {}) : {};
                        me._tcInfoMap[item.personId] = hit ? {
                            cccd: pick(hit, ['PERSONIDEN_SOCCCD']) || '',
                            gioiTinh: me._kqLookupById(pick(hit, ['COREPERSON_GIOITINH_ID']), 'ddlKQ_GioiTinh'),
                            dienThoai: pick(hit, ['PERSONCONTACT_DIENTHOAI']) || '',
                            hosoId: pick(hit, ['HOSO_ID']) || '',
                            khId: dr.khId || '',
                            dotId: dr.dotId || ''
                            // Không tra được cũng ghi nhớ, để lần lật trang sau khỏi hỏi lại
                        } : { cccd: '', gioiTinh: '', dienThoai: '', hosoId: '', khId: '', dotId: '' };
                        ketThuc();
                    });
                })(x);
            }
        };
        tiep();
    },

    /*------------------------------------------
    -- Mở thẳng hồ sơ tuyển sinh tìm được: đặt lại context kế hoạch + đợt, mở modal
    -- Kết quả đăng ký rồi để loadKQDK_List bật form Sửa khi danh sách về.
    -- Phải chờ modal tra cứu ĐÓNG HẲN mới mở modal kia — mở chồng thì Bootstrap
    -- gỡ mất lớp nền và màn hình khóa cứng.
    -------------------------------------------*/
    traCuu_MoHoSo: function (hosoId, khId, dotId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(hosoId) || !edu.util.checkValue(khId)) return;
        me.strKeHoachTuyenSinh_Id = khId;
        me.strDot_Id_ForKQ = dotId || '';
        me._traCuu_MoHoSoId = hosoId;
        $('#tra-cuu-nguoi-hoc').one('hidden.bs.modal', function () {
            $('#ket-qua-dk').modal('show');
        });
        $('#tra-cuu-nguoi-hoc').modal('hide');
    },

    /*==========================================================================
    == MỤC KHAI ĐÓNG/MỞ  (yêu cầu khách hàng 23/09/2026)
    == "cho ẩn cái này đi, khi nào cần đánh dấu tích vào nó sổ ra, vì hiện tại
    ==  bên em không dùng cái này" — trường không dùng khối Xét tuyển.
    ==
    == Cách khai: thêm data-an-mac-dinh="1" + data-sec-key="<khóa>" vào thẻ
    == .aps-sv-section trong HTML là xong, KHÔNG phải sửa hàm này.
    ==
    == ⚠ Chỉ ẨN chứ không xóa field: dữ liệu cũ của hồ sơ vẫn nạp vào ô bình thường
    ==   và vẫn được gửi đi khi lưu. Nếu sau này muốn "đóng mục = không gửi dữ liệu"
    ==   thì phải sửa thêm ở hàm ghép payload, đừng tưởng ẩn là tự khỏi gửi.
    == Trạng thái tích nhớ trong localStorage theo từng máy (mỗi cán bộ một kiểu dùng).
    ==========================================================================*/
    _KQ_SEC_LS: 'kqdk_section_mo',

    _secDocTrangThai: function () {
        try { return JSON.parse(localStorage.getItem(main_doc.KeHoachTuyenSinhNew._KQ_SEC_LS) || '{}') || {}; }
        catch (e) { return {}; }
    },

    _secGhiTrangThai: function (key, mo) {
        var me = main_doc.KeHoachTuyenSinhNew;
        try {
            var m = me._secDocTrangThai();
            m[key] = !!mo;
            localStorage.setItem(me._KQ_SEC_LS, JSON.stringify(m));
        } catch (e) { }
    },

    /*------------------------------------------
    -- Đóng/mở phần thân của 1 mục. Thân = mọi thẻ con TRỪ dòng tiêu đề,
    -- nên mục có nhiều khối (grid + ghi chú + bảng) vẫn ẩn/hiện trọn vẹn.
    -------------------------------------------*/
    _secApDung: function ($sec, mo) {
        $sec.children().not('.aps-sv-section-title').toggle(!!mo);
        $sec.toggleClass('kqdk-sec-dong', !mo);
        $sec.find('> .aps-sv-section-title .kqdk-sec-toggle input').prop('checked', !!mo);
    },

    _initSectionToggle: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._secBound) return;
        me._secBound = true;

        var luu = me._secDocTrangThai();
        $('#kqdk_khai .aps-sv-section[data-an-mac-dinh="1"]').each(function (i) {
            var $sec = $(this);
            var $title = $sec.children('.aps-sv-section-title').first();
            if (!$title.length || $title.find('.kqdk-sec-toggle').length) return;

            var key = $sec.attr('data-sec-key') || ('sec' + i);
            $sec.attr('data-sec-key', key);

            var $lb = $('<label class="kqdk-sec-toggle" title="Tích để mở mục này ra nhập">'
                + '<input type="checkbox"><span>Nhập mục này</span></label>');
            $title.append($lb);

            me._secApDung($sec, !!luu[key]);

            $lb.find('input').on('change', function () {
                var mo = $(this).is(':checked');
                me._secApDung($sec, mo);
                me._secGhiTrangThai(key, mo);
            });
        });
    },

    /*------------------------------------------
    -- Mở mục chứa field (nếu đang đóng) rồi mới focus.
    -- Cần cho luồng validate: nhảy tới một ô nằm trong mục đang đóng thì người dùng
    -- chỉ thấy thông báo mà không thấy ô nào sáng lên, tưởng hệ thống báo bậy.
    -------------------------------------------*/
    _secMoTheoField: function (fieldId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sec = $('#' + fieldId).closest('.aps-sv-section.kqdk-sec-dong');
        if (!$sec.length) return;
        me._secApDung($sec, true);
        me._secGhiTrangThai($sec.attr('data-sec-key') || '', true);
    },

    /*------------------------------------------
    -- Mở những mục đang đóng NHƯNG hồ sơ này có dữ liệu ở trong.
    -- Nếu không có bước này: hồ sơ cũ đã nhập điểm xét tuyển, mở ra thấy mục đóng im,
    -- người dùng tưởng mất dữ liệu — hoặc tệ hơn là nhập lại chồng lên.
    -- Chỉ mở TẠM cho hồ sơ đang xem, KHÔNG ghi vào localStorage (mặc định vẫn là đóng).
    -- Ô điểm mặc định "0"/"0.00" không tính là có dữ liệu.
    -------------------------------------------*/
    _secMoNeuCoDuLieu: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        $('#kqdk_khai .aps-sv-section.kqdk-sec-dong').each(function () {
            var $sec = $(this), co = false;
            $sec.find('input, select, textarea').each(function () {
                var v = $.trim(String($(this).val() == null ? '' : $(this).val()));
                if (v === '' || v === '0' || v === '0.0' || v === '0.00') return;
                co = true;
                return false;
            });
            if (co) me._secApDung($sec, true);
        });
    },

    /*------------------------------------------
    -- Gom Id của các dòng ĐANG TICK ở bảng Kết quả đăng ký (#tblKQDK_HoSo).
    -- Trả 2 danh sách vì mỗi dòng có 2 khóa khác nhau và mỗi báo cáo cần một kiểu:
    --   person : COREPERSON_ID  — "sinh viên" / người học
    --   hoso   : HOSO_ID        — bản ghi hồ sơ tuyển sinh
    -- Ưu tiên đọc từ _kqViewData theo data-kq-idx (đủ cột nhất), thiếu mới lùi về
    -- thuộc tính data-* trên <tr> — cùng cách kqdk_PhanLopTuDong_Selected đang làm.
    -- Không tick dòng nào → 2 mảng rỗng, KHÔNG chặn: báo cáo chạy theo bộ lọc như cũ.
    -------------------------------------------*/
    _kqLayIdDaTick: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var kq = { person: [], hoso: [] };
        $('#tblKQDK_HoSo tbody .kqdk-sel:checked').each(function () {
            var $tr = $(this).closest('tr');
            var idx = parseInt($tr.attr('data-kq-idx'), 10);
            var row = (!isNaN(idx) && me._kqViewData && me._kqViewData[idx]) ? me._kqViewData[idx] : null;

            var pid = row ? me._kqPick(row, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID',
                'Core_Person_Id', 'PERSON_ID', 'Person_Id']) : '';
            if (!pid) pid = $tr.attr('data-core-person-id') || '';

            var hid = row ? me._kqPick(row, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']) : '';
            if (!hid) hid = $tr.attr('data-id') || '';

            // Lọc trùng: cùng một người có thể có nhiều dòng hồ sơ
            if (pid && kq.person.indexOf(pid) < 0) kq.person.push(pid);
            if (hid && kq.hoso.indexOf(hid) < 0) kq.hoso.push(hid);
        });
        return kq;
    },

    /*==========================================================================
    == BẢNG CỘT FILE IMPORT TRÚNG TUYỂN — nguồn duy nhất cho:
    ==   1) Header file Excel mẫu (dùng NHÃN TIẾNG VIỆT, không phải tên param)
    ==   2) Dòng dữ liệu ví dụ
    ==   3) Map ngược nhãn → tên param khi đọc file (_normalizeImportRow)
    == Lý do: trước đây header là tên param API (strCorePerson_HoTen,
    == dCorePerson_NgayS, GENDER_NAM_ID...) — người nhập liệu không hiểu.
    ==   l  = nhãn hiển thị trên file Excel
    ==   p  = tên param của PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS
    ==   vd = giá trị ví dụ
    ==   an = true → vẫn nhận nếu file có cột này, nhưng KHÔNG đưa vào file mẫu
    ==        (field kỹ thuật / FE tự suy ra) cho file gọn, dễ nhìn.
    ==========================================================================*/
    _IMPORT_COLS: [
        // --- Thông tin cá nhân ---
        { l: 'Họ và tên', p: 'strCorePerson_HoTen', vd: 'Nguyễn Văn A' },
        { l: 'Họ', p: 'strCorePerson_Ho', vd: 'Nguyễn' },
        { l: 'Tên đệm', p: 'strCorePerson_Dem', vd: 'Văn' },
        { l: 'Tên', p: 'strCorePerson_Ten', vd: 'A' },
        { l: 'Ngày sinh (dd/mm/yyyy)', p: 'strCorePerson_NgaySinh', vd: '15/03/2007' },
        // 3 cột số dưới đây FE tự tách từ "Ngày sinh" → không bắt người dùng nhập
        { l: 'Ngày sinh - Ngày (số)', p: 'dCorePerson_NgayS', vd: '', an: true },
        { l: 'Ngày sinh - Tháng (số)', p: 'dCorePerson_ThangS', vd: '', an: true },
        { l: 'Ngày sinh - Năm (số)', p: 'dCorePerson_NamS', vd: '', an: true },
        { l: 'Giới tính (Nam/Nữ)', p: 'strCorePerson_GioiTinh_Ma', vd: 'Nam' },
        { l: 'Dân tộc', p: 'strPersonProfile_DanToc_Ma', vd: 'Kinh' },
        { l: 'Tôn giáo', p: 'strPersonProfile_TonGiao_Ma', vd: 'Không' },
        { l: 'Quốc tịch', p: 'strPersonProfile_QuocTich_Ma', vd: 'Việt Nam' },
        { l: 'Điện thoại', p: 'strPersonContact_DienThoai', vd: '0912345678' },
        { l: 'Email', p: 'strPersonContact_Email', vd: 'nguyenvana@example.com' },
        // --- CCCD ---
        { l: 'Số CCCD', p: 'strPersonIden_SoCCCD', vd: '012345678901' },
        { l: 'Ngày cấp CCCD (dd/mm/yyyy)', p: 'strPersonIden_NgayCap', vd: '01/01/2022' },
        { l: 'Nơi cấp CCCD', p: 'strPersonIden_NoiCap', vd: 'Cục Cảnh sát QLHC về TTXH' },
        // --- Nơi sinh / Hộ khẩu ---
        { l: 'Nơi sinh - Tỉnh/Thành phố', p: 'strPersonAddr_NS_Tinh_Ma', vd: 'Hà Nội' },
        { l: 'Nơi sinh - Xã/Phường', p: 'strPersonAddr_NS_Xa_Ma', vd: 'Phường Dịch Vọng' },
        { l: 'Nơi sinh - Chi tiết', p: 'strPersonAddr_NoiSinh', vd: 'Số 12, Ngõ 45' },
        { l: 'Hộ khẩu - Tỉnh/Thành phố', p: 'strPersonAddr_HK_Tinh_Ma', vd: 'Hà Nội' },
        { l: 'Hộ khẩu - Xã/Phường', p: 'strPersonAddr_HK_Xa_Ma', vd: 'Phường Dịch Vọng' },
        { l: 'Hộ khẩu - Số nhà/Thôn/Xóm', p: 'strPersonAddr_HK_SoNha', vd: 'Số 12, Ngõ 45, Thôn Đông' },
        // --- Trường lớp 12 ---
        { l: 'Trường lớp 12 - Tỉnh/Thành phố', p: 'strPersonEdu_Tinh_Ma', vd: 'Hà Nội' },
        { l: 'Trường lớp 12 - Mã/Tên trường', p: 'strPersonEdu_TruongMaTen', vd: '12345 - THPT Chu Văn An' },
        { l: 'Học lực lớp 12', p: 'strPersonEdu_HocLuc', vd: 'Giỏi' },
        { l: 'Hạnh kiểm lớp 12', p: 'strPersonEdu_HanhKiem', vd: 'Tốt' },
        // --- Gia đình ---
        { l: 'Bố - Họ tên', p: 'strPersonFam_Bo_HoTen', vd: 'Nguyễn Văn B' },
        { l: 'Bố - Năm sinh', p: 'dPersonFam_Bo_NamSinh', vd: 1975 },
        { l: 'Bố - Nơi ở', p: 'strPersonFam_Bo_NoiO', vd: 'Hà Nội' },
        { l: 'Bố - Điện thoại', p: 'strPersonFam_Bo_SDT', vd: '0912111111' },
        { l: 'Mẹ - Họ tên', p: 'strPersonFam_Me_HoTen', vd: 'Trần Thị C' },
        { l: 'Mẹ - Năm sinh', p: 'dPersonFam_Me_NamSinh', vd: 1978 },
        { l: 'Mẹ - Nơi ở', p: 'strPersonFam_Me_NoiO', vd: 'Hà Nội' },
        { l: 'Mẹ - Điện thoại', p: 'strPersonFam_Me_SDT', vd: '0913222222' },
        // --- Xét tuyển ---
        { l: 'Phương thức tuyển sinh', p: 'strHoSo_KH_Dot_PT_Ma', vd: 'Xét điểm thi THPT' },
        { l: 'Đối tượng tuyển sinh', p: 'strHoSo_DoiTuong_TS_Ma', vd: 'Thí sinh phổ thông' },
        { l: 'Đối tượng ưu tiên (nhiều giá trị cách nhau dấu phẩy)', p: 'strHoSo_DoiTuong_UT_Mas', vd: '' },
        { l: 'Khu vực ưu tiên', p: 'strHoSo_KhuVuc_UT_Ma', vd: 'KV1' },
        { l: 'Tổ hợp môn', p: 'strXetTuyen_TohopMon_Ma', vd: 'A00' },
        { l: 'Tên tổ hợp môn', p: 'strXetTuyen_TohopMon_Ten', vd: 'Toán - Lý - Hóa' },
        { l: 'Tổ hợp môn - Code', p: 'strXetTuyen_TohopMon_Code', vd: '', an: true },
        { l: 'Điểm ưu tiên', p: 'dXetTuyen_DiemUuTien', vd: 1.0 },
        { l: 'Tổng điểm môn', p: 'dXetTuyen_DiemTongMon', vd: 24.5 },
        { l: 'Tổng điểm xét tuyển', p: 'dXetTuyen_DiemTongXT', vd: 25.5 },
        { l: 'Điểm từng môn (Mã~Điểm~1~STT~Tên, cách nhau dấu |)', p: 'strXT_Mon_Data', vd: 'TOAN~8.0~1~1~Toan|LY~7.5~1~2~Vat ly|HOA~9.0~1~3~Hoa hoc' },
        // --- Hồ sơ / Trúng tuyển ---
        { l: 'Mã hồ sơ', p: 'strHoSo_MaHoSo', vd: 'TS2026001234' },
        { l: 'Số báo danh', p: 'strHoSo_SoBaoDanh', vd: 'SBD001234' },
        { l: 'Mã ngành trúng tuyển', p: 'strMaNganhTrungTuyen', vd: '7480201' },
        { l: 'Mã chương trình đào tạo', p: 'strMaCTDT', vd: '' },
        { l: 'Số quyết định trúng tuyển', p: 'strKetQua_QuyetDinh_Ma', vd: '' },
        { l: 'Mã số sinh viên (nếu có)', p: 'strMaSo', vd: '' },
        { l: 'Lớp dự kiến', p: 'strDaoTao_LopQuanLy_DuKien', vd: '' },
        { l: 'Cơ sở đào tạo (để trống = lấy theo lựa chọn ở form)', p: 'strDaoTao_CoSoDaoTao', vd: '' },
        { l: 'Số tiền nộp trước', p: 'strSoTienNopTruoc', vd: 5000000 },
        { l: 'Mã đợt nhập học', p: 'strIntake_IntakeCode', vd: '' },
        { l: 'Loại đợt nhập học', p: 'strIntake_IntakeTypeCode', vd: '' },
        { l: 'Mã lô import', p: 'strHoSo_Import_Batch_Ma', vd: '', an: true },
        // --- Xuất hóa đơn ---
        { l: 'Hóa đơn - Đối tượng', p: 'strPersonInvoice_TypeLoai', vd: '' },
        { l: 'Hóa đơn - Người mua', p: 'strPersonInvoice_NguoiMua', vd: 'Nguyễn Văn A' },
        { l: 'Hóa đơn - Tên đơn vị', p: 'strPersonInvoice_TenDonVi', vd: '' },
        { l: 'Hóa đơn - Mã số thuế', p: 'strPersonInvoice_MST', vd: '' },
        { l: 'Hóa đơn - Mã quan hệ ngân sách', p: 'strPersonInvoice_MaQHNS', vd: '' },
        { l: 'Hóa đơn - Điện thoại', p: 'strPersonInvoice_SDT', vd: '' },
        { l: 'Hóa đơn - Địa chỉ', p: 'strPersonInvoice_DiaChi', vd: '' },
        { l: 'Hóa đơn - Email', p: 'strPersonInvoice_Email', vd: '' },
        // --- Ngân hàng ---
        { l: 'Ngân hàng - Loại tài khoản', p: 'strPersonBank_HinhThucTT', vd: '' },
        { l: 'Ngân hàng - Tên ngân hàng', p: 'strPersonBank_TenNganHang', vd: 'Vietcombank' },
        { l: 'Ngân hàng - Số tài khoản', p: 'strPersonBank_SoTaiKhoan', vd: '' },
        { l: 'Ngân hàng - Chủ tài khoản', p: 'strPersonBank_ChuTaiKhoan', vd: '' },
        { l: 'Ngân hàng - Ghi chú', p: 'strPersonBank_GhiChu', vd: '' },
        // --- Kỹ thuật (không đưa vào file mẫu) ---
        { l: 'Dữ liệu mở rộng - Cá nhân (JSON)', p: 'strExtra_Person_Data', vd: '', an: true },
        { l: 'Dữ liệu mở rộng - Hồ sơ (JSON)', p: 'strExtra_HoSo_Data', vd: '', an: true },
        { l: 'Dữ liệu mở rộng - Nhập học (JSON)', p: 'strExtra_Intake_Data', vd: '', an: true }
    ],

    /*------------------------------------------
    -- Chuẩn hoá tên cột: bỏ dấu cách thừa, thường hoá → so khớp không phân biệt hoa/thường.
    -------------------------------------------*/
    _normHeader: function (s) {
        return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
    },

    /*------------------------------------------
    -- Bảng tra: nhãn tiếng Việt HOẶC tên param → tên param.
    -- Nhận cả 2 để file mẫu cũ (header là tên param) vẫn import được bình thường.
    -------------------------------------------*/
    _getImportHeaderMap: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._importHeaderMap) return me._importHeaderMap;
        var map = {};
        me._IMPORT_COLS.forEach(function (c) {
            map[me._normHeader(c.l)] = c.p;
            map[me._normHeader(c.p)] = c.p;
        });
        me._importHeaderMap = map;
        return map;
    },

    /*------------------------------------------
    -- Đổi key của 1 dòng Excel từ nhãn tiếng Việt sang tên param API.
    -- Cột lạ (không có trong bảng) giữ nguyên key để không mất dữ liệu.
    -------------------------------------------*/
    _normalizeImportRow: function (row) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var map = me._getImportHeaderMap();
        var out = {};
        for (var k in row) {
            if (!Object.prototype.hasOwnProperty.call(row, k)) continue;
            var p = map[me._normHeader(k)];
            out[p || k] = row[k];
        }
        return out;
    },

    /*------------------------------------------
    -- Tải file Excel mẫu cho Import trúng tuyển.
    -- Header dùng NHÃN TIẾNG VIỆT (xem _IMPORT_COLS) để người nhập liệu đọc hiểu ngay;
    -- lúc import FE tự map ngược về tên param API.
    -- Các cột đánh dấu an:true không xuất ra file mẫu (field kỹ thuật / FE tự suy ra).
    -------------------------------------------*/
    downloadMauImport_TrungTuyen: function () {
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        var me = main_doc.KeHoachTuyenSinhNew;
        var cols = me._IMPORT_COLS.filter(function (c) { return !c.an; });
        var headers = cols.map(function (c) { return c.l; });
        var sampleRow = cols.map(function (c) { return c.vd === undefined ? '' : c.vd; });
        var ws_data = [headers, sampleRow];
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        // Độ rộng cột theo độ dài nhãn (nhãn tiếng Việt dài hơn tên param)
        ws['!cols'] = headers.map(function (h) {
            return { wch: Math.max(16, Math.min(46, h.length + 4)) };
        });
        ws['!freeze'] = { xSplit: 0, ySplit: 1 };
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DuLieuTrungTuyen');
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var fname = 'Mau_Import_TrungTuyen_' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '.xlsx';
        XLSX.writeFile(wb, fname);
    },

    /* ===== Bản cũ (header = tên param API) — giữ lại phòng khi cần đối chiếu =====
    _downloadMauImport_TrungTuyen_Old: function () {
        var headers = [
            'strCorePerson_HoTen', 'strCorePerson_Ho', 'strCorePerson_Dem', 'strCorePerson_Ten',
            'strCorePerson_NgaySinh', 'dCorePerson_NgayS', 'dCorePerson_ThangS', 'dCorePerson_NamS',
            'strCorePerson_GioiTinh_Ma', 'strMaSo', 'strDaoTao_LopQuanLy_DuKien',
            'strPersonProfile_DanToc_Ma', 'strPersonProfile_TonGiao_Ma', 'strPersonProfile_QuocTich_Ma',
            'strPersonContact_DienThoai', 'strPersonContact_Email',
            'strPersonIden_SoCCCD', 'strPersonIden_NgayCap', 'strPersonIden_NoiCap',
            'strPersonAddr_NS_Tinh_Ma', 'strPersonAddr_NS_Xa_Ma', 'strPersonAddr_NoiSinh',
            'strPersonAddr_HK_Tinh_Ma', 'strPersonAddr_HK_Xa_Ma', 'strPersonAddr_HK_SoNha',
            'strPersonEdu_Tinh_Ma', 'strPersonEdu_TruongMaTen', 'strPersonEdu_HocLuc', 'strPersonEdu_HanhKiem',
            'strPersonFam_Bo_HoTen', 'dPersonFam_Bo_NamSinh', 'strPersonFam_Bo_NoiO', 'strPersonFam_Bo_SDT',
            'strPersonFam_Me_HoTen', 'dPersonFam_Me_NamSinh', 'strPersonFam_Me_NoiO', 'strPersonFam_Me_SDT',
            'strHoSo_KH_Dot_PT_Ma', 'strHoSo_DoiTuong_TS_Ma', 'strHoSo_DoiTuong_UT_Mas', 'strHoSo_KhuVuc_UT_Ma',
            'strHoSo_MaHoSo', 'strHoSo_SoBaoDanh', 'strHoSo_Import_Batch_Ma',
            'strMaNganhTrungTuyen', 'strMaCTDT',
            'strXetTuyen_TohopMon_Ma', 'strXetTuyen_TohopMon_Code', 'strXetTuyen_TohopMon_Ten',
            'dXetTuyen_DiemUuTien', 'dXetTuyen_DiemTongMon', 'dXetTuyen_DiemTongXT', 'strXT_Mon_Data',
            'strKetQua_QuyetDinh_Ma', 'strIntake_IntakeCode', 'strIntake_IntakeTypeCode',
            'strPersonInvoice_TypeLoai', 'strPersonInvoice_NguoiMua', 'strPersonInvoice_TenDonVi',
            'strPersonInvoice_MST', 'strPersonInvoice_MaQHNS', 'strPersonInvoice_SDT',
            'strPersonInvoice_DiaChi', 'strPersonInvoice_Email',
            'strPersonBank_HinhThucTT', 'strPersonBank_TenNganHang', 'strPersonBank_SoTaiKhoan',
            'strPersonBank_ChuTaiKhoan', 'strPersonBank_GhiChu',
            'strDaoTao_CoSoDaoTao', 'strSoTienNopTruoc',
            'strExtra_Person_Data', 'strExtra_HoSo_Data', 'strExtra_Intake_Data'
        ];
        // Dòng ví dụ — dùng VD sếp cung cấp ở signature Toad (mã theo convention BE Import).
        var sample = {
            strCorePerson_HoTen: 'Nguyễn Văn A',
            strCorePerson_Ho: 'Nguyễn', strCorePerson_Dem: 'Văn', strCorePerson_Ten: 'A',
            // ⚠ Ngày sinh: BE expect yyyy-mm-dd (Oracle native). FE không tự transform (yêu cầu sếp 09/08/2026).
            strCorePerson_NgaySinh: '2007-03-15',
            dCorePerson_NgayS: 15, dCorePerson_ThangS: 3, dCorePerson_NamS: 2007,
            strCorePerson_GioiTinh_Ma: 'GENDER_NAM_ID', strMaSo: '',
            strDaoTao_LopQuanLy_DuKien: '',
            strPersonProfile_DanToc_Ma: 'DT_KINH_ID', strPersonProfile_TonGiao_Ma: 'TG_KHONG_ID',
            strPersonProfile_QuocTich_Ma: 'QT_VN_ID',
            strPersonContact_DienThoai: '0912345678', strPersonContact_Email: 'nva@example.com',
            strPersonIden_SoCCCD: '012345678901',
            strPersonIden_NgayCap: '01/01/2022',
            strPersonIden_NoiCap: 'Cục Cảnh sát QLHC về TTXH',
            strPersonAddr_NS_Tinh_Ma: 'Hà Nội', strPersonAddr_NS_Xa_Ma: 'Hà Nội', strPersonAddr_NoiSinh: 'Hà Nội',
            strPersonAddr_HK_Tinh_Ma: 'TINH_HN_ID', strPersonAddr_HK_Xa_Ma: 'XA_XX_ID',
            strPersonAddr_HK_SoNha: 'Số 12, Ngõ 45, Thôn Đông',
            strPersonEdu_Tinh_Ma: 'TINH_HN_ID', strPersonEdu_TruongMaTen: '12345 - THPT Chu Văn An',
            strPersonEdu_HocLuc: 'GIOI', strPersonEdu_HanhKiem: 'TOT',
            strPersonFam_Bo_HoTen: 'Nguyễn Văn B', dPersonFam_Bo_NamSinh: 1975,
            strPersonFam_Bo_NoiO: 'Hà Nội', strPersonFam_Bo_SDT: '0912111111',
            strPersonFam_Me_HoTen: 'Trần Thị C', dPersonFam_Me_NamSinh: 1978,
            strPersonFam_Me_NoiO: 'Hà Nội', strPersonFam_Me_SDT: '0913222222',
            strHoSo_KH_Dot_PT_Ma: 'PT_DIEM_THI_ID',
            strHoSo_DoiTuong_TS_Ma: 'DT_DUTHI_THUONG_ID',
            strHoSo_DoiTuong_UT_Mas: 'UT_06_ID',
            strHoSo_KhuVuc_UT_Ma: 'KV1_ID',
            strHoSo_MaHoSo: 'TS2026001234', strHoSo_SoBaoDanh: 'SBD001234',
            strHoSo_Import_Batch_Ma: 'BATCH_20260901_001',
            strMaNganhTrungTuyen: '', strMaCTDT: '',
            strXetTuyen_TohopMon_Ma: 'TOHOP_A00_ID',
            strXetTuyen_TohopMon_Code: 'A00', strXetTuyen_TohopMon_Ten: 'Toán - Lý - Hóa',
            dXetTuyen_DiemUuTien: 1.0, dXetTuyen_DiemTongMon: 24.5, dXetTuyen_DiemTongXT: 25.5,
            strXT_Mon_Data: 'TOAN~8.0~1~1~Toan|LY~7.5~1~2~Vat ly|HOA~9.0~1~3~Hoa hoc',
            strKetQua_QuyetDinh_Ma: 'QD_TRUNGTUYEN_2026_ID',
            strIntake_IntakeCode: 'TS2026_D1_CQ', strIntake_IntakeTypeCode: 'CHINHQUY',
            strPersonInvoice_TypeLoai: 'CN', strPersonInvoice_NguoiMua: 'Nguyễn Văn A', strPersonInvoice_TenDonVi: '',
            strPersonInvoice_MST: '', strPersonInvoice_MaQHNS: '', strPersonInvoice_SDT: '0912345678',
            strPersonInvoice_DiaChi: 'Hà Nội', strPersonInvoice_Email: 'nva@example.com',
            strPersonBank_HinhThucTT: 'CK', strPersonBank_TenNganHang: 'Vietcombank',
            strPersonBank_SoTaiKhoan: '1012345678', strPersonBank_ChuTaiKhoan: 'Nguyễn Văn A',
            strPersonBank_GhiChu: '',
            strDaoTao_CoSoDaoTao: '',   // để trống → dùng dropdown ở modal; điền nếu muốn override per record
            strSoTienNopTruoc: '5000000',   // VD: 'Số tiền nộp trước (đăng ký giữ chỗ)'
            strExtra_Person_Data: '', strExtra_HoSo_Data: '', strExtra_Intake_Data: ''
        };
        var sampleRow = headers.map(function (h) {
            return sample[h] === undefined ? '' : sample[h];
        });
        var ws_data = [headers, sampleRow];
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        // Auto column width: header length
        ws['!cols'] = headers.map(function (h) {
            return { wch: Math.max(14, Math.min(32, h.length + 2)) };
        });
        // Freeze row 1 (header)
        ws['!freeze'] = { xSplit: 0, ySplit: 1 };
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DuLieuTrungTuyen');
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var fname = 'Mau_Import_TrungTuyen_' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '.xlsx';
        XLSX.writeFile(wb, fname);
    },
    ===== hết bản cũ ===== */

    /*------------------------------------------
    -- Reset trạng thái nội bộ modal #ket-qua-dk (Import counters, file, log).
    -- Visibility screen do handler show.bs.modal quyết định theo data-open-mode.
    -------------------------------------------*/
    resetKQDK_View: function () {
        // reset import state
        $('#fileImportTT').val('').prop('disabled', false);
        $('#lblImportFileInfo').text('');
        $('#tblImportTT_Log tbody').html('');
        $('#importProgressWrap').addClass('d-none');
        $('#btnStartImportTT').prop('disabled', true);
        $('#btnCancelImportTT').addClass('d-none');
        $('#lblImportProgress').text('0 / 0');
        $('#lblImportOK, #lblImportErr').text('0');
        $('#importProgressBar').css({ width: '0%', background: '#17a2b8' }).text('0%');
        $('#importTT_FinishBanner').remove();
        // reset panel đối chiếu file
        $('#fileDiff').val('');
        $('#lblDiff_FileInfo').text('');
        $('#btnDiff_Compare').prop('disabled', true);
        $('#diffResultWrap').addClass('d-none');
        this._diffResult = null;
        // reset error panel state
        this._importTT_Errors = [];
        $('#importTT_ErrorsPanel').addClass('d-none');
        $('#btnImportTT_ShowErrors').addClass('d-none');
        $('#lblImportTT_ErrCount').text('0');
    },

    /*------------------------------------------
    -- Import trúng tuyển: parse Excel/CSV (SheetJS) → chạy tuần tự
    -- Origin: PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS
    -- Guard: cần strKeHoachTuyenSinh_Id + XLSX đã load + có file
    -------------------------------------------*/
    startImport_TrungTuyen: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Chưa xác định kế hoạch tuyển sinh (mở lại từ danh sách kế hoạch/đợt)", "w");
            return;
        }
        // Đợt lấy từ dropdown modal — bắt buộc phải chọn (giống bên "Đọc từ API")
        var strDotId = $('#ddlImportTT_Dot').val() || me.strDot_Id_ForKQ || '';
        if (!strDotId) {
            edu.system.alert("Vui lòng chọn Đợt tuyển sinh trước khi import", "w");
            return;
        }
        me.strDot_Id_ForKQ = strDotId;   // sync context để _buildImportPayload dùng
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện đọc Excel chưa load xong, vui lòng thử lại sau 1-2 giây", "w");
            return;
        }
        var el = $('#fileImportTT')[0];
        var f = el && el.files && el.files[0];
        if (!f) {
            edu.system.alert("Vui lòng chọn file", "w");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var rows = [];
            try {
                var wb = XLSX.read(e.target.result, { type: 'array', cellDates: true, cellNF: false });
                var ws = wb.Sheets[wb.SheetNames[0]];
                rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
            } catch (ex) {
                edu.system.alert("Không đọc được file: " + (ex && ex.message ? ex.message : ex), "w");
                return;
            }
            if (!rows.length) {
                edu.system.alert("File không có dữ liệu (hàng 1 phải là header)", "w");
                return;
            }

            // Áp dụng giới hạn số bản ghi (giống bên docAPI): "Chỉ nhập N" hoặc "Toàn bộ"
            var limitMode = $('input[name="importTT_LimitMode"]:checked').val() || 'custom';
            var totalRaw = rows.length;
            if (limitMode === 'custom') {
                var lim = parseInt($('#txtImportTT_Limit').val(), 10);
                if (isNaN(lim) || lim < 1) lim = 100;
                if (lim < totalRaw) rows = rows.slice(0, lim);
            }
            if (rows.length < totalRaw) {
                kqdkNoLog('[Import TT] Giới hạn: chỉ nhập ' + rows.length + '/' + totalRaw + ' dòng đầu');
            }

            me._importCancelled = false;
            me._importTT_Errors = [];   // reset error log tổng hợp trước batch mới
            $('#btnStartImportTT').prop('disabled', true);
            $('#btnCancelImportTT').removeClass('d-none');
            $('#fileImportTT').prop('disabled', true);
            $('#importProgressWrap').removeClass('d-none');
            $('#importProgressBar').css('background', '#17a2b8');   // reset màu về default
            $('#importTT_FinishBanner').remove();                    // xóa banner batch cũ
            $('#importTT_ErrorsPanel').addClass('d-none');
            $('#btnImportTT_ShowErrors').addClass('d-none');
            $('#lblImportTT_ErrCount').text('0');
            $('#tblImportTT_Log tbody').html('');
            me._runImport(rows);
        };
        reader.onerror = function () {
            edu.system.alert("Lỗi đọc file", "w");
        };
        reader.readAsArrayBuffer(f);
    },

    /*------------------------------------------
    -- Chạy PARALLEL với concurrency limit = _IMPORT_CONCURRENCY (mặc định 5).
    -- Giữ tối đa N request đồng thời in-flight; khi 1 xong → kick request kế tiếp.
    -- Nhanh ~5× so với tuần tự cũ. Cancel: khi flag on, không dispatch thêm; chờ in-flight xong rồi finish.
    -------------------------------------------*/
    _IMPORT_CONCURRENCY: 5,

    _runImport: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var total = rows.length;
        var nextDispatch = 0;   // index dòng kế tiếp sẽ dispatch
        var done = 0;           // số dòng đã hoàn tất (bao gồm cả lỗi)
        var inFlight = 0;       // số request đang chạy
        var ok = 0, err = 0;
        var finished = false;
        var $bar = $('#importProgressBar');
        var CONC = me._IMPORT_CONCURRENCY || 5;

        var updateProgress = function () {
            var pct = total ? Math.round((done / total) * 100) : 0;
            $bar.css('width', pct + '%').text(pct + '%');
            $('#lblImportProgress').text(done + ' / ' + total);
            $('#lblImportOK').text(ok);
            $('#lblImportErr').text(err);
        };

        var finish = function () {
            if (finished) return;
            finished = true;
            $('#btnStartImportTT').prop('disabled', false);
            $('#btnCancelImportTT').addClass('d-none');
            $('#fileImportTT').prop('disabled', false);

            // ⚠ KHÔNG dùng edu.system.alert ở đây:
            // - Batch dài (3K+ rec) hay bị network chập chờn → window 'offline'/'online' bắn
            //   edu.system.alert lên cùng modal #myModalAlert (append content).
            // - Khi user đóng modal alert stack đó, BS3 gỡ body.modal-open → modal #ket-qua-dk
            //   phía dưới bị mất backdrop/scroll lock → user thấy như "tự đóng".
            // → Hiển thị inline banner ngay dưới progress để tránh stack + user vẫn thấy summary.
            var isCancel = me._importCancelled;
            var isAllOk = (err === 0 && !isCancel);
            var color, icon, label;
            if (isCancel) {
                color = '#f59e0b'; icon = 'fa-ban'; label = 'Đã dừng';
            } else if (isAllOk) {
                color = '#10b981'; icon = 'fa-circle-check'; label = 'Hoàn tất — tất cả thành công';
            } else if (ok === 0) {
                color = '#dc2626'; icon = 'fa-circle-xmark'; label = 'Hoàn tất — TẤT CẢ LỖI';
            } else {
                color = '#f59e0b'; icon = 'fa-triangle-exclamation'; label = 'Hoàn tất — có lỗi';
            }
            // Đổi màu progress bar theo outcome (visual signal)
            $bar.css('background', color);
            // Banner summary (thay cho edu.system.alert)
            var $b = $('#importTT_FinishBanner');
            if (!$b.length) {
                $('#importProgressWrap').after('<div id="importTT_FinishBanner" class="mt-10"></div>');
                $b = $('#importTT_FinishBanner');
            }
            $b.css({
                padding: '10px 14px', 'border-radius': '6px',
                'border-left': '4px solid ' + color,
                background: color + '1a',   // hex + alpha 10%
                'font-size': '14px'
            }).html(
                '<i class="fa-solid ' + icon + '" style="color:' + color + ';"></i> '
                + '<b>' + label + ':</b> đã xử lý <b>' + done + '/' + total + '</b> '
                + '(<span class="color-success">OK: ' + ok + '</span>, '
                + '<span class="color-red">Lỗi: ' + err + '</span>)'
            );
            // Nếu có lỗi → auto-mở panel chi tiết để user thấy ngay
            if (err > 0) {
                me.renderImportTT_ErrorsPanel();
                $('#importTT_ErrorsPanel').removeClass('d-none');
            }
            kqdkNoLog('[Import TT] Finish:', { done: done, total: total, ok: ok, err: err, cancelled: isCancel });
        };

        // Cơ sở đào tạo mặc định cho batch (dropdown trong modal) — dùng làm ctx.CoSo.
        // Nếu row Excel có value strDaoTao_CoSoDaoTao → value trong file ưu tiên (ghi đè ctx).
        var strCoSo_Default = edu.system.getValById('ddlImportTT_CoSoDaoTao') || '';
        var strDotId_Batch = $('#ddlImportTT_Dot').val() || me.strDot_Id_ForKQ || '';

        var onComplete = function () {
            inFlight--;
            done++;
            updateProgress();
            // Đã xong tất cả (kể cả pending in-flight) → finish
            if (done >= total) { finish(); return; }
            // Đã cancel + không còn in-flight → finish
            if (me._importCancelled && inFlight === 0) { finish(); return; }
            // Còn chỗ + còn dòng → kick tiếp
            kickNext();
        };

        var kickNext = function () {
            while (!me._importCancelled && inFlight < CONC && nextDispatch < total) {
                var myIdx = nextDispatch++;
                inFlight++;
                var rowNo = myIdx + 2;   // hàng 1 = header
                // Header file mẫu là NHÃN TIẾNG VIỆT → đổi về tên param API trước khi build payload.
                // File cũ (header = tên param) vẫn chạy vì bảng tra nhận cả 2 dạng.
                var row = me._normalizeImportRow(rows[myIdx]);
                var rowCoSo = row['strDaoTao_CoSoDaoTao'];
                var ctxCoSo = (rowCoSo && String(rowCoSo).trim()) ? String(rowCoSo).trim() : strCoSo_Default;
                var payload = me._buildImportPayload(row, rowNo, { Dot: strDotId_Batch, CoSo: ctxCoSo });
                (function (rowNo, row) {
                    edu.system.makeRequest({
                        success: function (data) {
                            if (data && data.Success) {
                                ok++;
                                me._appendLog(rowNo, row, 'ok', 'Thành công');
                            } else {
                                err++;
                                me._appendLog(rowNo, row, 'err', (data && data.Message) || 'Lỗi không xác định');
                            }
                            onComplete();
                        },
                        error: function (er) {
                            err++;
                            var msg = 'HTTP lỗi';
                            if (er && er.statusText) msg = 'HTTP ' + (er.status || '') + ' ' + er.statusText;
                            else if (er) { try { msg = JSON.stringify(er); } catch (e) { } }
                            me._appendLog(rowNo, row, 'http', msg);
                            onComplete();
                        },
                        type: 'POST',
                        contentType: true,
                        action: payload.action,
                        data: payload,
                        fakedb: []
                    }, false, false, false, null);
                })(rowNo, row);
            }
            // Không dispatch được thêm + không còn in-flight → hoàn tất (case cancel ngay đầu)
            if (inFlight === 0 && (me._importCancelled || nextDispatch >= total)) {
                if (done >= total || me._importCancelled) finish();
            }
        };

        updateProgress();
        kickNext();
    },

    /*------------------------------------------
    -- Ghép payload gọi Them_HoSo_TS
    -- - Base: context (KH_TS_Id, Dot_Id) + user info + hành động THEM
    -- - File pass-through: header Excel = tên param API. Field không có trong file → ''
    -- - dHoSo_Import_Row_No: chỉ số hàng trong file (để backend log lại)
    -------------------------------------------*/
    _buildImportPayload: function (row, rowNo, ctx) {
        var me = main_doc.KeHoachTuyenSinhNew;
        ctx = ctx || {};
        // ⚠ Signature khớp 100% với PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS (khác với PKG_CORE_TS_HOSO
        // dùng cho form Khai trực tiếp). Convention:
        //   - Field lấy TỪ FILE (user điền tên/mã): dùng hậu tố _Ma / _Mas — BE tự tra cứu ra ID
        //   - Field CONTEXT lấy từ FORM (dropdown chọn): dùng hậu tố _Id — BE lấy trực tiếp
        //     (KH_TS_Id, KH_TS_Dot_Id — luôn override từ modal)
        //   - Không có strNguyenVong_DauRa_Id ở IMPORT (bị comment); thay bằng strMaNganhTrungTuyen + strMaCTDT
        // ctx.KH / ctx.Dot / ctx.CoSo: override context (dùng khi call từ "Đọc từ API")
        var payload = {
            'action': 'SV_Core_TS_HoSo_Import_MH/FSkkLB4JLhIuHhUS',
            'func': 'PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'THEM',
            // Context (lấy từ form/dropdown → dùng _Id)
            'strHoSo_KH_TS_Id': ctx.KH || me.strKeHoachTuyenSinh_Id || '',
            'strHoSo_KH_TS_Dot_Id': ctx.Dot || me.strDot_Id_ForKQ || '',
            // Cơ sở đào tạo — ƯU TIÊN row (mapping từ cosonhaphoc CMC) > ctx (dropdown modal)
            'strDaoTao_CoSoDaoTao': (row && row.strDaoTao_CoSoDaoTao && String(row.strDaoTao_CoSoDaoTao).trim())
                ? String(row.strDaoTao_CoSoDaoTao).trim()
                : (ctx.CoSo || ''),
            'dHoSo_Import_Row_No': rowNo
        };
        // Các field pass-through từ file — tên khớp param IMPORT proc (dùng _Ma / _Mas).
        // KHÔNG include: strHoSo_KH_TS_Id, strHoSo_KH_TS_Dot_Id, strDaoTao_CoSoDaoTao, dHoSo_Import_Row_No
        // (đã set ở context, không cho file ghi đè).
        var apiFields = [
            'strCorePerson_HoTen', 'strCorePerson_Ho', 'strCorePerson_Dem', 'strCorePerson_Ten',
            'strCorePerson_NgaySinh', 'dCorePerson_NgayS', 'dCorePerson_ThangS', 'dCorePerson_NamS',
            'strCorePerson_GioiTinh_Ma', 'strMaSo', 'strDaoTao_LopQuanLy_DuKien',
            'strPersonProfile_DanToc_Ma', 'strPersonProfile_TonGiao_Ma', 'strPersonProfile_QuocTich_Ma',
            'strPersonContact_DienThoai', 'strPersonContact_Email',
            'strPersonIden_SoCCCD', 'strPersonIden_NgayCap', 'strPersonIden_NoiCap',
            'strPersonAddr_NS_Tinh_Ma', 'strPersonAddr_NS_Xa_Ma', 'strPersonAddr_NoiSinh',
            'strPersonAddr_HK_Tinh_Ma', 'strPersonAddr_HK_Xa_Ma', 'strPersonAddr_HK_SoNha',
            'strPersonEdu_Tinh_Ma', 'strPersonEdu_TruongMaTen', 'strPersonEdu_HocLuc', 'strPersonEdu_HanhKiem',
            'strPersonFam_Bo_HoTen', 'dPersonFam_Bo_NamSinh', 'strPersonFam_Bo_NoiO', 'strPersonFam_Bo_SDT',
            'strPersonFam_Me_HoTen', 'dPersonFam_Me_NamSinh', 'strPersonFam_Me_NoiO', 'strPersonFam_Me_SDT',
            'strHoSo_KH_Dot_PT_Ma', 'strHoSo_DoiTuong_TS_Ma', 'strHoSo_DoiTuong_UT_Mas', 'strHoSo_KhuVuc_UT_Ma',
            'strHoSo_MaHoSo', 'strHoSo_SoBaoDanh', 'strHoSo_Import_Batch_Ma',
            // 2 field IMPORT-only (thay cho strNguyenVong_DauRa_Id đã bị comment ở IMPORT proc):
            'strMaNganhTrungTuyen', 'strMaCTDT',
            'strXetTuyen_TohopMon_Ma', 'strXetTuyen_TohopMon_Code', 'strXetTuyen_TohopMon_Ten',
            'dXetTuyen_DiemUuTien', 'dXetTuyen_DiemTongMon', 'dXetTuyen_DiemTongXT', 'strXT_Mon_Data',
            'strKetQua_QuyetDinh_Ma', 'strIntake_IntakeCode', 'strIntake_IntakeTypeCode',
            'strPersonInvoice_TypeLoai', 'strPersonInvoice_NguoiMua', 'strPersonInvoice_TenDonVi',
            'strPersonInvoice_MST', 'strPersonInvoice_MaQHNS', 'strPersonInvoice_SDT',
            'strPersonInvoice_DiaChi', 'strPersonInvoice_Email',
            'strPersonBank_HinhThucTT', 'strPersonBank_TenNganHang', 'strPersonBank_SoTaiKhoan',
            'strPersonBank_ChuTaiKhoan', 'strPersonBank_GhiChu',
            // Số tiền nộp trước (đăng ký giữ chỗ) — param VARCHAR2 của IMPORT proc (thêm 06/08/2026);
            // pass-through từ row (map từ tc_lpgd / noptientruoc).
            'strSoTienNopTruoc',
            'strExtra_Person_Data', 'strExtra_HoSo_Data', 'strExtra_Intake_Data'
        ];
        // Convention: prefix 'd' → Oracle NUMBER, phải gửi null (không phải '') khi rỗng
        // để tránh PLS-00306 "wrong number or types of arguments".
        for (var i = 0; i < apiFields.length; i++) {
            var f = apiFields[i];
            var v = row[f];
            var isNumParam = f.charAt(0) === 'd';
            if (v === undefined || v === null || v === '') {
                payload[f] = isNumParam ? null : '';
            } else if (isNumParam) {
                var n = Number(v);
                payload[f] = isNaN(n) ? null : n;
            } else {
                payload[f] = typeof v === 'string' ? v : String(v);
            }
        }

        // ⚠ Ngày sinh — signature BE có 4 param riêng cho ngày sinh (xác nhận qua C# entity
        // Core_TS_HoSo_Import_MHEntity 09/08/2026):
        //   strCorePerson_NgaySinh (string dd/mm/yyyy) + dCorePerson_NgayS/ThangS/NamS (number).
        // BE validator strict: `Ngay sinh phai theo dinh dang dd/mm/yyyy (VD: 15/03/2007)`.
        // → Bắt buộc convert ở FE:
        //   - Nếu API trả ISO yyyy-mm-dd → convert dd/mm/yyyy + fill 3 số
        //   - Nếu đã dd/mm/yyyy (Excel người dùng nhập tay) → chỉ fill 3 số nếu chưa có
        // Fill đủ 3 field số cho khớp schema BE explicit — trước đây để trống là phí.
        var ns = payload.strCorePerson_NgaySinh;
        if (typeof ns === 'string' && ns) {
            var mISO = ns.match(/^(\d{4})-(\d{2})-(\d{2})/);       // yyyy-mm-dd (ISO)
            var mVN = ns.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);    // dd/mm/yyyy
            if (mISO) {
                payload.strCorePerson_NgaySinh = mISO[3] + '/' + mISO[2] + '/' + mISO[1];
                if (payload.dCorePerson_NgayS == null) payload.dCorePerson_NgayS = parseInt(mISO[3], 10);
                if (payload.dCorePerson_ThangS == null) payload.dCorePerson_ThangS = parseInt(mISO[2], 10);
                if (payload.dCorePerson_NamS == null) payload.dCorePerson_NamS = parseInt(mISO[1], 10);
            } else if (mVN) {
                if (payload.dCorePerson_NgayS == null) payload.dCorePerson_NgayS = parseInt(mVN[1], 10);
                if (payload.dCorePerson_ThangS == null) payload.dCorePerson_ThangS = parseInt(mVN[2], 10);
                if (payload.dCorePerson_NamS == null) payload.dCorePerson_NamS = parseInt(mVN[3], 10);
            }
        }

        return payload;
    },

    /*------------------------------------------
    -- Log 1 row vào bảng tiến trình. Dùng prepend để row mới nổi lên đầu.
    -- Escape HTML bằng $('<div>').text().html() để tránh XSS từ file người dùng.
    -- Nếu kind='err' → push thêm vào _importTT_Errors để render panel tổng hợp + export Excel.
    -- kind: 'ok' | 'err' | 'cancel' | 'http' (HTTP error, phân biệt với BE reject)
    -------------------------------------------*/
    _appendLog: function (rowNo, row, kind, msg) {
        var me = this;
        var icon = kind === 'ok'
            ? '<i class="fa-solid fa-check color-success"></i>'
            : (kind === 'cancel'
                ? '<i class="fa-solid fa-ban" style="color:#999;"></i>'
                : '<i class="fa-solid fa-xmark color-red"></i>');
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var maHS = row.strHoSo_MaHoSo || row.strHoSo_SoBaoDanh || '';
        var cccd = row.strPersonIden_SoCCCD || '';
        var hoTen = row.strCorePerson_HoTen || '';
        // Gộp Mã HS + CCCD vào 1 cell: dòng 1 = mã HS đậm, dòng 2 = CCCD nhỏ xám (dễ copy check)
        var idCell = esc(maHS)
            + (cccd ? '<br><span style="font-size:11px; color:#64748b;">CCCD: ' + esc(cccd) + '</span>' : '');
        var html = '<tr>'
            + '<td class="td-center td-fix">' + rowNo + '</td>'
            + '<td class="td-left">' + idCell + '</td>'
            + '<td class="td-left">' + esc(hoTen) + '</td>'
            + '<td class="td-center">' + icon + '</td>'
            + '<td class="td-left">' + esc(msg) + '</td>'
            + '</tr>';
        $('#tblImportTT_Log tbody').prepend(html);
        // Track lỗi tổng hợp cho panel + export Excel (chỉ 'err' và 'http', không 'cancel')
        if (kind === 'err' || kind === 'http') {
            if (!me._importTT_Errors) me._importTT_Errors = [];
            me._importTT_Errors.push({
                row: rowNo,
                maHS: maHS || '',
                cccd: cccd || '',
                hoTen: hoTen || '',
                type: kind === 'http' ? 'HTTP' : 'BE',
                msg: msg || '',
                raw: row   // full row từ Excel để export debug
            });
            $('#lblImportTT_ErrCount').text(me._importTT_Errors.length);
            $('#btnImportTT_ShowErrors').removeClass('d-none');
        }
    },

    /*------------------------------------------
    -- Render danh sách lỗi Import Excel vào panel #importTT_ErrorsPanel (giống docAPI).
    -------------------------------------------*/
    renderImportTT_ErrorsPanel: function () {
        var me = this;
        var errs = me._importTT_Errors || [];
        $('#lblImportTT_ErrCount').text(errs.length);
        var $tbody = $('#tblImportTT_Errors tbody');
        if (!errs.length) {
            $tbody.html('<tr><td colspan="5" class="td-center text-muted" style="padding:12px;">Chưa có lỗi nào</td></tr>');
            return;
        }
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var html = errs.map(function (e) {
            var typeColor = e.type === 'HTTP' ? '#7c2d12' : '#991b1b';
            var typeBg = e.type === 'HTTP' ? '#fed7aa' : '#fecaca';
            // Gộp Mã HS + CCCD (dễ copy check khi lỗi)
            var idCell = esc(e.maHS)
                + (e.cccd ? '<br><span style="font-size:11px; color:#64748b;">CCCD: ' + esc(e.cccd) + '</span>' : '');
            return '<tr>'
                + '<td class="td-center">' + e.row + '</td>'
                + '<td>' + idCell + '</td>'
                + '<td>' + esc(e.hoTen) + '</td>'
                + '<td class="td-center"><span style="background:' + typeBg + ';color:' + typeColor + ';padding:2px 8px;border-radius:10px;font-weight:600;font-size:11px;">' + e.type + '</span></td>'
                + '<td>' + esc(e.msg) + '</td>'
                + '</tr>';
        }).join('');
        $tbody.html(html);
    },

    /*------------------------------------------
    -- Export danh sách row lỗi Import Excel ra file Excel để gửi BE dev debug.
    -- 2 sheet: TomTat + FullData (giống docAPI_ExportErrorsToExcel).
    -------------------------------------------*/
    exportImportTT_ErrorsToExcel: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        var errs = me._importTT_Errors || [];
        if (!errs.length) {
            edu.system.alert("Chưa có lỗi nào để xuất.", "w");
            return;
        }

        // --- Sheet 1: Tóm tắt ---
        var sheet1Aoa = [['STT', 'Hàng Excel', 'Mã HS/SBD', 'Họ tên', 'Loại lỗi', 'Chi tiết lỗi']];
        errs.forEach(function (e, i) {
            sheet1Aoa.push([i + 1, e.row, e.maHS || '', e.hoTen || '', e.type || '', e.msg || '']);
        });
        var ws1 = XLSX.utils.aoa_to_sheet(sheet1Aoa);
        ws1['!cols'] = [{ wch: 6 }, { wch: 10 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 80 }];
        ws1['!freeze'] = { xSplit: 0, ySplit: 1 };

        // --- Sheet 2: Full data (info lỗi + toàn bộ column raw từ Excel gốc) ---
        var headerSet = {};
        var rowHeaders = [];
        errs.forEach(function (e) {
            Object.keys(e.raw || {}).forEach(function (k) {
                if (!headerSet[k]) { headerSet[k] = 1; rowHeaders.push(k); }
            });
        });
        var sheet2Headers = ['Hàng Excel', 'Mã HS/SBD', 'Họ tên', 'Loại lỗi', 'Chi tiết lỗi'].concat(rowHeaders);
        var sheet2Aoa = [sheet2Headers];
        errs.forEach(function (e) {
            var rec = e.raw || {};
            var row = [e.row, e.maHS || '', e.hoTen || '', e.type || '', e.msg || ''];
            rowHeaders.forEach(function (h) {
                var v = rec[h];
                if (v == null) row.push('');
                else if (typeof v === 'object') row.push(JSON.stringify(v));
                else row.push(v);
            });
            sheet2Aoa.push(row);
        });
        var ws2 = XLSX.utils.aoa_to_sheet(sheet2Aoa);
        ws2['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 60 }]
            .concat(rowHeaders.map(function (h) { return { wch: Math.max(12, Math.min(30, h.length + 2)) }; }));
        ws2['!freeze'] = { xSplit: 5, ySplit: 1 };

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'Loi_TomTat');
        XLSX.utils.book_append_sheet(wb, ws2, 'Loi_FullData');

        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
        var fname = 'LoiImportExcel_' + errs.length + 'loi_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
        edu.system.alert("Đã xuất " + errs.length + " row lỗi ra file " + fname
            + "\n\nSheet 1: Tóm tắt lỗi\nSheet 2: Full data (row Excel gốc) để BE debug", "s");
    },

    /*------------------------------------------
    -- === Đối chiếu file Excel vs DS hệ thống (dùng CCCD làm key) ===
    -- Use case: sau import → biết row nào chưa vào hệ thống → xuất Excel import lại.
    -- Normalize CCCD: strip mọi ký tự không phải digit; length < 9 coi như không hợp lệ.
    -- Trả { key, corrupt }: corrupt=true khi phát hiện scientific notation (Excel bôi corrupt).
    -------------------------------------------*/
    _diffNormalizeCCCD: function (v) {
        if (v == null) return { key: '', corrupt: false };
        var s = String(v).trim();
        if (!s) return { key: '', corrupt: false };
        var corrupt = /[eE][+\-]?\d+$/.test(s);   // 1.23E+11 → Excel format Number quá dài
        s = s.replace(/[^\d]/g, '');
        if (s.length < 9) return { key: '', corrupt: corrupt };   // CCCD hợp lệ 9-12 số
        return { key: s, corrupt: corrupt };
    },

    /*------------------------------------------
    -- Đọc file Excel + so sánh với me.dtKQDK_HoSo (cache list hệ thống).
    -- Phân 6 nhóm: both / onlyFile / onlySys / noCCCD / dupFile / dupSys.
    -- Dup rows vẫn được xếp vào both/onlyFile theo lookup, đồng thời liệt kê ở dupFile/dupSys.
    -------------------------------------------*/
    _diffCompareFileVsSystem: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        var el = $('#fileDiff')[0];
        var f = el && el.files && el.files[0];
        if (!f) { edu.system.alert("Vui lòng chọn file để so sánh", "w"); return; }
        var sysList = me.dtKQDK_HoSo || [];
        if (!sysList.length) {
            edu.system.alert("Danh sách hệ thống rỗng — chuyển sang tab 'Kết quả đăng ký' để load dữ liệu trước, rồi quay lại đây.", "w");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var fileRows = [];
            try {
                var wb = XLSX.read(e.target.result, { type: 'array', cellDates: true, cellNF: false });
                var ws = wb.Sheets[wb.SheetNames[0]];
                fileRows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
            } catch (ex) {
                edu.system.alert("Không đọc được file: " + (ex && ex.message ? ex.message : ex), "w");
                return;
            }
            if (!fileRows.length) { edu.system.alert("File không có dữ liệu (hàng 1 phải là header)", "w"); return; }
            // Header file mẫu là nhãn tiếng Việt ("Số CCCD"...) → đổi về tên param để so khớp.
            // File cũ (header = tên param) không bị ảnh hưởng.
            fileRows = fileRows.map(function (r) { return me._normalizeImportRow(r); });

            // Build map hệ thống: normalized CCCD → array records (chuẩn detect trùng)
            var sysMap = {};
            for (var i = 0; i < sysList.length; i++) {
                var kSys = me._diffNormalizeCCCD(sysList[i]['PERSONIDEN_SOCCCD']).key;
                if (!kSys) continue;
                (sysMap[kSys] = sysMap[kSys] || []).push(sysList[i]);
            }

            // Build map file + gom noCCCD
            var fileMap = {};
            var noCCCD = [];
            for (var j = 0; j < fileRows.length; j++) {
                var norm = me._diffNormalizeCCCD(fileRows[j]['strPersonIden_SoCCCD']);
                if (!norm.key) {
                    var row = fileRows[j];
                    if (norm.corrupt) row.__diff_note = 'CCCD bị Excel format thành scientific notation';
                    noCCCD.push(row);
                    continue;
                }
                (fileMap[norm.key] = fileMap[norm.key] || []).push(fileRows[j]);
            }

            // Categorize file → both / onlyFile / dupFile
            var both = [], onlyFile = [], dupFile = [];
            for (var kf in fileMap) {
                var rowsF = fileMap[kf];
                if (rowsF.length > 1) { for (var a = 0; a < rowsF.length; a++) dupFile.push(rowsF[a]); }
                if (sysMap[kf]) { for (var b = 0; b < rowsF.length; b++) both.push(rowsF[b]); }
                else { for (var c = 0; c < rowsF.length; c++) onlyFile.push(rowsF[c]); }
            }

            // Categorize sys → onlySys / dupSys
            var onlySys = [], dupSys = [];
            for (var ks in sysMap) {
                var rowsS = sysMap[ks];
                if (rowsS.length > 1) { for (var d = 0; d < rowsS.length; d++) dupSys.push(rowsS[d]); }
                if (!fileMap[ks]) { for (var e2 = 0; e2 < rowsS.length; e2++) onlySys.push(rowsS[e2]); }
            }

            me._diffResult = {
                both: both, onlyFile: onlyFile, onlySys: onlySys,
                noCCCD: noCCCD, dupFile: dupFile, dupSys: dupSys,
                fileTotal: fileRows.length, sysTotal: sysList.length
            };
            me._diffRenderResult();
            kqdkNoLog('[Diff] Kết quả:', me._diffResult);
        };
        reader.onerror = function () { edu.system.alert("Lỗi đọc file", "w"); };
        reader.readAsArrayBuffer(f);
    },

    /*------------------------------------------
    -- Update counters + enable/disable nút Xuất Excel theo từng nhóm.
    -------------------------------------------*/
    _diffRenderResult: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var r = me._diffResult;
        if (!r) return;
        $('#lblDiff_TotalFile').text(r.fileTotal);
        $('#lblDiff_TotalSys').text(r.sysTotal);
        $('#lblDiff_Both').text(r.both.length);
        $('#lblDiff_OnlyFile').text(r.onlyFile.length);
        $('#lblDiff_OnlySys').text(r.onlySys.length);
        $('#lblDiff_NoCCCD').text(r.noCCCD.length);
        $('#lblDiff_DupFile').text(r.dupFile.length);
        $('#lblDiff_DupSys').text(r.dupSys.length);
        $('#diffResultWrap').removeClass('d-none');
        $('.btnDiff_Export[data-cat="both"]').prop('disabled', !r.both.length);
        $('.btnDiff_Export[data-cat="onlyFile"]').prop('disabled', !r.onlyFile.length);
        $('.btnDiff_Export[data-cat="onlySys"]').prop('disabled', !r.onlySys.length);
        $('.btnDiff_Export[data-cat="noCCCD"]').prop('disabled', !r.noCCCD.length);
        $('.btnDiff_Export[data-cat="dupFile"]').prop('disabled', !r.dupFile.length);
        $('.btnDiff_Export[data-cat="dupSys"]').prop('disabled', !r.dupSys.length);
    },

    /*------------------------------------------
    -- Xuất 1 nhóm ra Excel. Header = union tất cả keys của rows trong nhóm (bảo toàn nguyên
    -- cột file gốc → import lại được ngay). onlySys/dupSys có schema từ API (COREPERSON_*),
    -- các nhóm còn lại có schema từ file Excel (strCorePerson_*, strPersonIden_*, ...).
    -------------------------------------------*/
    _diffExportCategory: function (cat) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        if (!me._diffResult) return;
        var rows = me._diffResult[cat] || [];
        if (!rows.length) { edu.system.alert("Nhóm này không có bản ghi", "w"); return; }

        // Union keys → giữ thứ tự xuất hiện đầu tiên (bảo toàn cấu trúc file gốc)
        var keys = [];
        var seen = {};
        for (var i = 0; i < rows.length; i++) {
            for (var k in rows[i]) {
                if (rows[i].hasOwnProperty(k) && !seen[k]) { seen[k] = true; keys.push(k); }
            }
        }
        var aoa = [keys];
        for (var i2 = 0; i2 < rows.length; i2++) {
            var line = [];
            for (var j = 0; j < keys.length; j++) {
                var v = rows[i2][keys[j]];
                line.push(v == null ? '' : v);
            }
            aoa.push(line);
        }
        var ws = XLSX.utils.aoa_to_sheet(aoa);
        ws['!cols'] = keys.map(function (h) { return { wch: Math.max(14, Math.min(32, (h || '').length + 2)) }; });
        ws['!freeze'] = { xSplit: 0, ySplit: 1 };
        var wb = XLSX.utils.book_new();
        var meta = {
            both: { sheet: 'Co_Ca_Hai', label: 'Co trong ca hai' },
            onlyFile: { sheet: 'Chi_Trong_File', label: 'Chi trong file' },
            onlySys: { sheet: 'Chi_Trong_HeThong', label: 'Chi trong he thong' },
            noCCCD: { sheet: 'Khong_Co_CCCD', label: 'Khong co CCCD' },
            dupFile: { sheet: 'Trung_Trong_File', label: 'Trung trong file' },
            dupSys: { sheet: 'Trung_Trong_HeThong', label: 'Trung trong he thong' }
        }[cat] || { sheet: 'Data', label: 'data' };
        XLSX.utils.book_append_sheet(wb, ws, meta.sheet);
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes());
        var fname = 'DoiChieu_' + meta.sheet + '_' + rows.length + 'rec_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
        edu.system.alert("Đã xuất " + rows.length + " bản ghi nhóm '" + meta.label + "' ra file " + fname, "s");
    },

    /*------------------------------------------
    -- Convert ngày sinh: BE store ISO "yyyy-mm-dd" hoặc "dd/mm/yyyy" ↔ UI dd/mm/yyyy.
    -- Vì input type=text (cũ là type=date bị browser mangle theo locale US → dd/mm ↔ mm/dd).
    -------------------------------------------*/
    _ngaySinhToUI: function (s) {
        if (!s) return '';
        var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return m[3] + '/' + m[2] + '/' + m[1];
        // Đã dd/mm/yyyy — giữ nguyên
        return String(s).replace(/^(\d{2})\/(\d{2})\/(\d{4}).*$/, '$1/$2/$3');
    },
    _ngaySinhToISO: function (s) {
        if (!s) return '';
        var m = String(s).trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
        // BE hay trả kèm giờ ("2007-03-15T00:00:00" / "2007-03-15 00:00:00") — cắt lấy
        // 10 ký tự đầu, chứ trả nguyên chuỗi thì input type=date từ chối và để trống.
        var mISO = String(s).trim().match(/^(\d{4}-\d{2}-\d{2})/);
        if (mISO) return mISO[1];
        return s;
    },

    /*------------------------------------------
    -- Set value cho <select> với retry (chờ DM populate xong) + fallback lookup theo TEN.
    -- Cần thiết vì initKhai_DanhMuc load DM async — nếu set value ngay sẽ trượt.
    -- View LayDS_HoSo_TS đôi khi chỉ trả field _TEN mà không có _ID (VD Giới tính) →
    -- fallback tra option.text để tìm value tương ứng.
    -- Retry tối đa 30 lần × 150ms = ~4.5s.
    -------------------------------------------*/
    _setSelectByIdOrText: function (selector, id, text, maxTry) {
        var $s = $(selector);
        if (!$s.length) return;
        var esc = function (s) { return String(s).replace(/"/g, '\\"'); };
        var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); };
        var clean = function (s) { return norm(s).replace(/[()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim(); };
        var tries = 0;
        var max = maxTry || 30;
        var doSet = function () {
            // 1) Tìm theo ID
            if (id && String(id).trim() !== '') {
                var escId = esc(String(id).trim());
                if ($s.find('option[value="' + escId + '"]').length) {
                    $s.val(String(id).trim()).trigger('change').trigger('change.select2');
                    return true;
                }
            }
            // 2) Tìm theo Tên (chính xác hoặc sau khi chuẩn hóa khoảng trắng / dấu ngoặc)
            if (text && String(text).trim() !== '') {
                var t = norm(text);
                var tClean = clean(text);
                var found = null;
                $s.find('option').each(function () {
                    var val = $(this).val();
                    if (!val) return;
                    var optText = norm($(this).text());
                    var optClean = clean($(this).text());
                    if (optText === t || optClean === tClean
                        || (tClean.length >= 4 && (optClean.indexOf(tClean) >= 0 || tClean.indexOf(optClean) >= 0))) {
                        found = val;
                        return false;
                    }
                });
                if (found) {
                    $s.val(found).trigger('change').trigger('change.select2');
                    return true;
                }
            }
            return false;
        };
        var run = function () {
            if (doSet()) return;
            if (++tries >= max) return;
            setTimeout(run, 150);
        };
        run();
    },

    /*------------------------------------------
    -- Mở form Khai (6 tab) ở chế độ SỬA — reuse #kqdk_khai để user có UX nhất quán.
    -- Populate các field có trong cache dtKQDK_HoSo. Các field khác để trống (backend
    -- chưa có API get_by_id trả full data — nếu có, gọi trước rồi populate đầy đủ).
    -- API Sua_HoSo_TS chỉ update 9 field cơ bản → hiển thị banner cảnh báo.
    -- Flag _suaMode giúp saveKhai_HoSo dispatch sang Sua_HoSo_TS thay vì Them_HoSo_TS.
    -------------------------------------------*/
    openSuaHoSo: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(strId)) return;
        var pick = me._kqPick;
        var d = null;
        for (var i = 0; i < (me.dtKQDK_HoSo || []).length; i++) {
            var r = me.dtKQDK_HoSo[i];
            var rid = pick(r, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']);
            if (rid === strId) { d = r; break; }
        }
        if (!d) {
            edu.system.alert("Không tìm thấy hồ sơ trong cache — vui lòng Tải lại danh sách", "w");
            return;
        }

        me.strSuaHoSo_Id = strId;
        me._suaMode = true;
        // Vào form Sửa TỪ danh sách → nút Đóng ở header phải quay về danh sách,
        // không đóng hẳn modal (xem binding #btnKQDK_Close).
        me._kqdkVaoTuList = true;
        // Core_Person_Id — dùng cho tab 7 (ghi nhận nguồn khai thác) lúc bấm Cập nhật
        me.strSuaHoSo_CorePersonId = pick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'PERSON_ID', 'Person_Id']);

        // Reset form + init DM (lazy, chỉ chạy lần đầu)
        me.resetKhai_HoSo();
        me.initKhai_DanhMuc();

        // Đợt tuyển sinh của hồ sơ — nạp _ensureKQDK_DauRaMap trước để suy ngược đợt từ nguyện vọng đầu ra
        me._ensureKQDK_DauRaMap(function () {
            var dotId = pick(d, ['HOSO_KH_TS_DOT_ID', 'HoSo_KH_TS_Dot_Id', 'KH_TS_DOT_ID',
                'TS_KH_TUYENSINH_DOT_ID', 'DOT_ID'])
                || me._kqPickFuzzy(d, /DOT.*_ID$/i);
            var dotTen = pick(d, ['HOSO_KH_TS_DOT_TEN', 'DOT_TEN', 'TEN_DOT']);
            if (!dotId) {
                var nvId = pick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']);
                var dr = nvId ? ((me._kqDauRaMap || {})[nvId] || null) : null;
                if (dr && dr.dotId) {
                    dotId = dr.dotId;
                    if (!dotTen) dotTen = dr.dotTen || '';
                }
            }
            if (dotId) me.strDot_Id_ForKQ = dotId;

            me._ensureDotTuyenSinh(function () {
                me._loadDotToKhai();                      // đổ option + preselect theo strDot_Id_ForKQ
                me._setSelectByIdOrText('#ddlKQ_DotTuyenSinh', dotId, dotTen);   // bảo hiểm + fallback theo tên
                me._loadNguyenVongDauRa();
                me._loadPhuongThucTuyenSinh();
                // Tab 1 + 2 — nạp Giới tính/Dân tộc/Tôn giáo/Điện thoại/Email/CCCD
                // (view LayDS_HoSo_TS không trả, hoặc bị danh mục nạp lại làm mất lựa chọn)
                me._loadPersonExtras_ForEdit(me.strSuaHoSo_CorePersonId, d);
                // Tab 3 + 5 — lấy chi tiết đầy đủ theo Id thay vì đọc cache list (view list
                // chỉ có ~20 cột nên Xét tuyển / Gia đình luôn trống dù DB có dữ liệu).
                me._loadHoSoDetail_ForEdit(strId);
                // Tab 6 — cụm "Thông tin thanh toán" (PERSON_BANK), trước giờ không ai đọc lên
                me._loadBank_ForEdit(me.strSuaHoSo_CorePersonId);
                // Tab 5 — bố/mẹ (PERSON_FAMILY)
                me._loadFamily_ForEdit(me.strSuaHoSo_CorePersonId);
                // Tab 6 — nạp thông tin hóa đơn đã lưu (PERSON_INVOICE_INFO)
                me._loadPersonInvoice(me.strSuaHoSo_CorePersonId);
                // Tab 7 — nạp danh mục rồi bind nguồn khai thác đã ghi nhận (nếu có)
                me._loadNguonKhaiThac(function () {
                    me._loadHoSoDoiTacTS(me.strSuaHoSo_CorePersonId);
                });
                // Tab 8 — danh mục hồ sơ (TS_HOSO). Phải gọi SAU khi strDot_Id_ForKQ
                // đã set ở trên, vì LayDSTS_HoSo lọc theo Id đợt tuyển sinh.
                me._loadHoSoDM_ForEdit(strId);
                me._veBadgeKeHoach();
                // Các mục đang đóng mà hồ sơ này có dữ liệu thì bung ra cho thấy.
                // Đợi các nhánh nạp async (dropdown retry tới ~1.8s) xong mới soát.
                setTimeout(function () { me._secMoNeuCoDuLieu(); }, 1200);
                setTimeout(function () { me._secMoNeuCoDuLieu(); }, 2400);
            });
        });

        // Chuyển sang screen Khai
        $('#kqdk_list, #kqdk_import').addClass('d-none');
        $('#kqdk_khai').removeClass('d-none');

        // Hiện banner + đổi nhãn nút Save + hiện nút Đổi nguyện vọng đầu vào (chỉ có ý nghĩa khi hồ sơ đã tồn tại)
        $('#kqdk_khai_edit_banner').removeClass('d-none');
        $('#btnKhaiSave').html('<i class="fa-light fa-floppy-disk"></i> Cập nhật hồ sơ');
        $('#btnKhaiDoiNVDauVao').removeClass('d-none');

        // Ô ngày sinh là input type=date → chỉ nhận ISO yyyy-mm-dd. Đưa dd/mm/yyyy vào
        // là trình duyệt lặng lẽ để trống, form Sửa sẽ mất ngày sinh.
        var ngaySinh = me._ngaySinhToISO(pick(d, ['COREPERSON_NGAYSINH', 'CorePerson_NgaySinh']));

        // Populate các field có từ cache
        $('#txtKQ_HoTen').val(pick(d, ['COREPERSON_HOTEN']));
        // .val() không phát sự kiện input → phải tự gọi, không thì hồ sơ chưa có
        // thông tin hóa đơn sẽ để trống ô Họ tên người mua.
        // _loadPersonInvoice chạy sau sẽ ghi đè bằng tên đã lưu (nếu có).
        me._autoFillHoaDonTen();
        // .trigger('change') để dòng "Ngày đã chọn: dd/mm/yyyy" dưới ô lịch cập nhật theo
        $('#txtKQ_NgaySinh').val(ngaySinh).trigger('change');
        $('#txtKQ_DienThoai').val(pick(d, ['PERSONCONTACT_DIENTHOAI']));
        $('#txtKQ_Email').val(pick(d, ['PERSONCONTACT_EMAIL']));
        $('#txtKQ_SoCCCD').val(pick(d, ['PERSONIDEN_SOCCCD']));
        $('#txtKQ_MaHoSo').val(pick(d, ['HOSO_MAHOSO']));
        $('#txtKQ_SBD').val(pick(d, ['HOSO_SOBAODANH']));
        $('#txtKQ_ToHopMa').val(pick(d, ['XETTUYEN_TOHOPMON_CODE']));
        $('#txtKQ_TongDiemXT').val(pick(d, ['XETTUYEN_DIEMTONGXT']));

        // Set dropdown value với retry (chờ DM populate xong) + fallback lookup theo TEN nếu view chỉ trả TEN
        // Lưu ý (14/08/2026): view LayDS_HoSo_TS hiện KHÔNG có field CSDT (đã verify qua console) → dropdown
        // CSDT luôn trống khi mở form Sửa. Cần BE bổ sung DAOTAO_COSODAOTAO_ID vào response.
        me._setSelectByIdOrText('#ddlKQ_GioiTinh',
            pick(d, ['COREPERSON_GIOITINH_ID', 'GIOITINH_ID']),
            pick(d, ['COREPERSON_GIOITINH_TEN', 'GIOITINH_TEN', 'CorePerson_GioiTinh_Ten']));
        me._setSelectByIdOrText('#ddlKQ_NguyenVongDauRa',
            pick(d, ['NGUYENVONG_DAURA_ID']),
            '');
        me._setSelectByIdOrText('#ddlKQ_CoSoDaoTao',
            pick(d, ['DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID', 'HOSO_DAOTAO_COSODAOTAO_ID']),
            pick(d, ['DAOTAO_COSODAOTAO_TEN', 'COSODAOTAO_TEN']));
        /* Lớp dự kiến đầu ra: options chỉ nạp XONG sau khi chọn Nguyện vọng đầu ra
           (_loadLopDuKien chạy theo cascade), nên _setSelectByIdOrText phải có retry —
           hàm này tự thử lại tới ~3,7 giây nên đặt ở đây là đủ.
           Dò rộng tên cột vì response hồ sơ mỗi bản một kiểu, có bản chưa trả cột này. */
        me._setSelectByIdOrText('#ddlKQ_LopDuKien',
            me._pickLoose(d, ['DAOTAO_LOPQUANLY_ID_DK', 'DAOTAO_LOPQUANLY_DUKIEN_ID',
                'LOPQUANLY_DUKIEN_ID', 'DAOTAO_LOPQUANLY_DUKIEN']),
            me._pickLoose(d, ['DAOTAO_LOPQUANLY_DUKIEN_MA', 'LOPQUANLY_DUKIEN_MA',
                'DAOTAO_LOPQUANLY_DUKIEN_TEN', 'LOPQUANLY_DUKIEN_TEN']));

        // Về tab 1
        $('#kqdkKhaiTabs .aps-sv-tab').first().trigger('click');
    },

    /*------------------------------------------
    -- Reset _suaMode + hide banner + restore save button label
    -------------------------------------------*/
    _exitSuaMode: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._suaMode = false;
        me.strSuaHoSo_Id = '';
        me._isSavingKhai = false;
        me._isSavingSua = false;
        $('#kqdk_khai_edit_banner').addClass('d-none');
        $('#kqdk_khai_luu_canhbao').addClass('d-none');
        $('#btnKhaiSave').prop('disabled', false).removeClass('disabled').html('<i class="fa-solid fa-floppy-disk"></i><span> Lưu hồ sơ</span>');
        $('#btnKhaiDoiNVDauVao').addClass('d-none');
    },

    /*------------------------------------------
    -- Mở modal picker "Chọn nguyện vọng đầu vào" — reuse list Kế hoạch đầu ra
    -- của KH+Đợt hiện tại (Pr_Ts_Kh_Dau_Ra_Get_Ds).
    -- Cache CorePerson_Id + họ tên vào me._chonNVDV_ctx để bước xác nhận không phải
    -- tra lại cache. Nếu KH_Id rỗng hoặc chưa vào chế độ sửa → cảnh báo và dừng.
    -------------------------------------------*/
    openChonNVDauVao: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!me._suaMode || !edu.util.checkValue(me.strSuaHoSo_Id)) {
            edu.system.alert("Chỉ đổi nguyện vọng khi đang mở hồ sơ ở chế độ Sửa.", "w");
            return;
        }
        var pick = me._kqPick;
        var d = null;
        for (var i = 0; i < (me.dtKQDK_HoSo || []).length; i++) {
            var r = me.dtKQDK_HoSo[i];
            var rid = pick(r, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']);
            if (rid === me.strSuaHoSo_Id) { d = r; break; }
        }
        if (!d) {
            edu.system.alert("Không tìm thấy hồ sơ trong cache — vui lòng Tải lại danh sách", "w");
            return;
        }
        var personId = pick(d, ['COREPERSON_ID', 'HOSO_COREPERSON_ID', 'CorePerson_Id', 'CorePersonId']);
        // INTAKE_Id lấy từ hồ sơ thí sinh (không phải từ item picker) — field trong view: CORE_PERSON_INTAKE_ID
        var intakeId = pick(d, ['CORE_PERSON_INTAKE_ID', 'COREPERSON_INTAKE_ID', 'CorePerson_Intake_Id', 'INTAKE_ID']);
        var hoTen = pick(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen']);
        var maHS = pick(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo']);
        me._chonNVDV_ctx = { CorePerson_Id: personId, Intake_Id: intakeId, HoTen: hoTen };
        $('#lblChonNVDV_HoSo').text(hoTen ? (hoTen + (maHS ? ' — ' + maHS : '')) : (maHS || ''));

        // Render skeleton "đang tải..." rồi call API
        var $tb = $('#tblChonNVDV tbody');
        $tb.html('<tr><td colspan="8" class="text-center text-muted" style="padding:20px;"><i class="fa-light fa-spinner fa-spin"></i> Đang tải danh sách nguyện vọng...</td></tr>');
        $('#lblChonNVDV_Empty').addClass('d-none');

        // Reuse pattern _loadNguyenVongDauRa nhưng render bảng
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': me.strDot_Id_ForKQ || '',
            'strTs_Kh_Dot_PhuongThuc_Id': '',
            'strOutput_Status_Code': '',
            'dIs_Public': '',
            'dIs_Active': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                // Enrich MA_CHUONGTRINH (qua KHCT_ToChucChuongTrinh/LayDanhSach) và MA_NGANH_TS
                // (qua DM TUYENSINH.NGANHNGHE). Chạy song song → render khi cả 2 xong.
                var remaining = 2;
                var afterAll = function () {
                    if (--remaining === 0) me._renderChonNVDauVao(rows);
                };
                me._ensureCTMaLookup(rows, afterAll);
                me._ensureNganhMaLookup(afterAll);
            },
            error: function () {
                $tb.html('<tr><td colspan="8" class="text-center text-danger" style="padding:20px;">Lỗi tải danh sách nguyện vọng.</td></tr>');
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);

        $('#modal-chon-nvdv').modal('show');
    },

    /*------------------------------------------
    -- Lazy-cache map { CT_ID: MACHUONGTRINH } bằng KHCT_ToChucChuongTrinh/LayDanhSach.
    -- API cần {He_Id, Khoa_Id} → gom unique pair từ rows đầu ra rồi batch song song.
    -- Cache tồn tại suốt session (me._ctMaLookup) — mở picker lần sau chỉ gọi cho CT mới.
    -- Silent-fail: lỗi cũng gọi cb() để render vẫn chạy (chỉ mất mã).
    -------------------------------------------*/
    _ensureCTMaLookup: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._ctMaLookup = me._ctMaLookup || {};
        var pick = function () {
            for (var k = 0; k < arguments.length; k++) {
                var v = arguments[k];
                if (v != null && String(v).trim() !== '') return String(v).trim();
            }
            return '';
        };
        var pairs = {};
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            var ctId = pick(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
            if (!ctId || me._ctMaLookup.hasOwnProperty(ctId)) continue;
            var heId = pick(r.DAOTAO_HEDAOTAO_ID);
            var khoaId = pick(r.DAOTAO_KHOADAOTAO_ID);
            pairs[heId + '|' + khoaId] = { heId: heId, khoaId: khoaId };
        }
        var keys = Object.keys(pairs);
        if (!keys.length) { if (cb) cb(); return; }
        var remaining = keys.length;
        var done = function () { if (--remaining === 0 && cb) cb(); };
        keys.forEach(function (k) {
            var p = pairs[k];
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success && data.Data && data.Data.length) {
                        for (var i = 0; i < data.Data.length; i++) {
                            var c = data.Data[i];
                            if (c.ID) me._ctMaLookup[c.ID] = c.MACHUONGTRINH || '';
                        }
                    }
                    done();
                },
                error: function () { done(); },
                type: 'GET',
                action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
                contentType: true,
                data: {
                    'strTuKhoa': '',
                    'strDaoTao_KhoaDaoTao_Id': p.khoaId,
                    'strDaoTao_HeDaoTao_Id': p.heId,
                    'strDaoTao_N_CN_Id': '',
                    'strDaoTao_KhoaQuanLy_Id': '',
                    'strDaoTao_ToChucCT_Cha_Id': '',
                    'strNguoiThucHien_Id': '',
                    'pageIndex': 1,
                    'pageSize': 100000
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Load toàn bộ đầu ra của KH hiện tại (Pr_Ts_Kh_Dau_Ra_Get_Ds) và build map:
    --   _kqDauRaMap[DauRa_ID] = { nganhId, nganhTen, ctTen, heTen, khoaTen, ... }
    -- Dùng để enrich cột "Mã ngành" trong bảng KQĐK (response chính không có NGÀNH).
    -- Cache theo KH_ID hiện tại — đổi KH sẽ reload.
    -------------------------------------------*/
    _ensureKQDK_DauRaMap: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var khId = me.strKeHoachTuyenSinh_Id || '';
        if (me._kqDauRaMap && me._kqDauRaMapKH === khId) { if (cb) cb(); return; }
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_Kh_TuyenSinh_Id': khId,
            'strTs_Kh_TuyenSinh_Dot_Id': '',
            'strTs_Kh_Dot_PhuongThuc_Id': '',
            'strOutput_Status_Code': '',
            'dIs_Public': '',
            'dIs_Active': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                var map = {};
                var rows = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    var id = r.ID || r.Id || r.TS_KH_DAU_RA_ID;
                    if (!id) continue;
                    map[id] = {
                        // Kế hoạch + đợt của chính nguyện vọng này. Bắt buộc phải giữ:
                        // response hồ sơ (cả list lẫn detail) KHÔNG có 2 khóa này, đây là
                        // đường duy nhất suy ra được đợt của một hồ sơ.
                        khId: r.TS_KEHOACH_TUYENSINH_ID || '',
                        khTen: r.TS_KEHOACH_TUYENSINH_TEN || '',
                        dotId: r.TS_KEHOACH_TUYENSINH_DOT_ID || '',
                        dotTen: r.TS_KEHOACH_TUYENSINH_DOT_TEN || '',
                        // Tên + mã của chính nguyện vọng đầu ra — file xuất cần cột này
                        ten: r.TEN_HIENTHI || r.TEN || '',
                        ma: r.MA_HIENTHI || r.MA || '',
                        nganhId: r.DAOTAO_NGANH_TS_ID || r.DAOTAO_NGANH_DT_ID || '',
                        nganhTen: r.DAOTAO_NGANH_TS_TEN || r.DAOTAO_NGANH_DT_TEN || '',
                        ctTen: r.DAOTAO_TOCHUCCHUONGTRINH_TEN || '',
                        ctId: r.DAOTAO_TOCHUCCHUONGTRINH_ID || '',
                        heTen: r.DAOTAO_HEDAOTAO_TEN || '',
                        khoaTen: r.DAOTAO_KHOADAOTAO_TEN || ''
                    };
                }
                me._kqDauRaMap = map;
                me._kqDauRaMapKH = khId;
                if (cb) cb();
            },
            error: function () {
                me._kqDauRaMap = {};
                me._kqDauRaMapKH = khId;
                if (cb) cb();
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Lazy-cache map { NganhTS_ID: MA_NGANH } bằng DM TUYENSINH.NGANHNGHE.
    -- Endpoint: CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM (mỗi record có ID/MA/TEN).
    -- Gọi 1 lần cho toàn session (me._nganhMaLookup) — không phụ thuộc rows.
    -------------------------------------------*/
    _ensureNganhMaLookup: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._nganhMaLookup) { if (cb) cb(); return; }
        edu.system.makeRequest({
            success: function (data) {
                var mapId = {}, mapTen = {};
                if (data && data.Success && data.Data && data.Data.length) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var r = data.Data[i];
                        if (r.ID) mapId[r.ID] = r.MA || '';
                        // Fallback lookup by TEN (lowercase trim) — vì ID có thể không match giữa
                        // TS_KH_DAU_RA (DAOTAO_NGANH_TS_ID/DT_ID) và DM TUYENSINH.NGANHNGHE.ID
                        if (r.TEN) mapTen[String(r.TEN).trim().toLowerCase()] = r.MA || '';
                    }
                }
                me._nganhMaLookup = mapId;
                me._nganhMaLookupByTen = mapTen;
                if (cb) cb();
            },
            error: function () {
                me._nganhMaLookup = {};
                me._nganhMaLookupByTen = {};
                if (cb) cb();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            contentType: true,
            data: {
                'strMaBangDanhMuc': 'TUYENSINH.NGANHNGHE',
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng picker. Mỗi tr lưu 2 giá trị quan trọng qua data-*:
    --   data-ct-id     = DAOTAO_TOCHUCCHUONGTRINH_ID (ParamDaoTao_ChuongTrinh_Id)
    --   data-intake-id = INTAKE_ID / CORE_PERSON_INTAKE_ID (ParamINTAKE_Id)
    -- Nếu 1 trong 2 field rỗng thì nút Chọn vẫn hiện — bước confirm sẽ validate và
    -- báo lỗi cụ thể (theo spec "3 trường khác rỗng mới call").
    -------------------------------------------*/
    _renderChonNVDauVao: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tb = $('#tblChonNVDV tbody');
        $tb.empty();
        if (!rows || !rows.length) {
            $('#lblChonNVDV_Empty').removeClass('d-none');
            return;
        }
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var pick = function () {
            for (var k = 0; k < arguments.length; k++) {
                var v = arguments[k];
                if (v != null && String(v).trim() !== '') return String(v).trim();
            }
            return '';
        };
        // Mã CT lookup từ me._ctMaLookup (KHCT_ToChucChuongTrinh/LayDanhSach).
        // Mã Ngành TS lookup từ me._nganhMaLookup (DM TUYENSINH.NGANHNGHE) — fallback by TEN nếu ID không match.
        var ctMaMap = me._ctMaLookup || {};
        var nganhMaMap = me._nganhMaLookup || {};
        var nganhMaMapByTen = me._nganhMaLookupByTen || {};
        var lookupNganhMa = function (id, ten) {
            return nganhMaMap[id]
                || (ten ? nganhMaMapByTen[String(ten).trim().toLowerCase()] : '')
                || '';
        };
        var fmt = function (ten, ma) {
            if (ten && ma && ten !== ma) return ten + ' (' + ma + ')';
            return ten || ma || '';
        };
        var html = '';
        for (var i = 0; i < rows.length; i++) {
            var d = rows[i];
            var ma = pick(d.MA_HIENTHI, d.MA);
            var ten = pick(d.TEN_HIENTHI, d.TEN);
            var he = pick(d.DAOTAO_HEDAOTAO_TEN);
            var khoa = pick(d.DAOTAO_KHOADAOTAO_TEN);
            var ctTen = pick(d.DAOTAO_TOCHUCCHUONGTRINH_TEN);
            var ctId = pick(d.DAOTAO_TOCHUCCHUONGTRINH_ID);
            var ctMa = ctMaMap[ctId] || '';
            var nganhTen = pick(d.DAOTAO_NGANH_TS_TEN, d.DAOTAO_NGANH_DT_TEN);
            var nganhId = pick(d.DAOTAO_NGANH_TS_ID, d.DAOTAO_NGANH_DT_ID);
            var nganhMa = lookupNganhMa(nganhId, nganhTen);
            html += '<tr'
                + ' data-ct-id="' + esc(ctId) + '"'
                + ' data-ten-ht="' + esc(ten || ctTen || nganhTen) + '"'
                + '>'
                + '<td class="text-center">' + (i + 1) + '</td>'
                + '<td>' + esc(ma || ctMa) + '</td>'
                + '<td>' + esc(ten || ctTen) + '</td>'
                + '<td>' + esc(he) + '</td>'
                + '<td>' + esc(khoa) + '</td>'
                + '<td>' + esc(fmt(ctTen, ctMa)) + '</td>'
                + '<td>' + esc(fmt(nganhTen, nganhMa)) + '</td>'
                + '<td class="text-center">'
                + '<button type="button" class="btn btn-sm btn-primary btn-chon-nvdv">'
                + '<i class="fa-light fa-check"></i> Chọn</button>'
                + '</td>'
                + '</tr>';
        }
        $tb.html(html);
    },

    /*------------------------------------------
    -- Xác nhận chọn: validate 3 field (Person_Id, ChuongTrinh_Id, INTAKE_Id) — nếu 1
    -- trong 3 rỗng → alert "Dữ liệu không hợp lệ" kèm field thiếu, KHÔNG call API.
    -- Sau confirm user → gọi PKG_CORE_TS_HOSO.XacNhanChonChuongTrinhHoc.
    -- Success: đóng picker + reload danh sách KQĐK để lấy snapshot mới.
    -------------------------------------------*/
    confirmChonNVDauVao: function (sel) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var ctx = me._chonNVDV_ctx || {};
        var personId = ctx.CorePerson_Id || '';
        var intakeId = ctx.Intake_Id || '';       // Lấy từ hồ sơ (view LayDS_HoSo_TS.CORE_PERSON_INTAKE_ID)
        var ctId = sel.ChuongTrinh_Id || '';      // Lấy từ item picker (Pr_Ts_Kh_Dau_Ra_Get_Ds.DAOTAO_TOCHUCCHUONGTRINH_ID)

        // Validate 3 field khác rỗng theo spec
        var missing = [];
        if (!edu.util.checkValue(personId)) missing.push('Person_Id (COREPERSON_ID của hồ sơ)');
        if (!edu.util.checkValue(ctId)) missing.push('DaoTao_ChuongTrinh_Id (DAOTAO_TOCHUCCHUONGTRINH_ID của nguyện vọng đầu ra)');
        if (!edu.util.checkValue(intakeId)) missing.push('INTAKE_Id (CORE_PERSON_INTAKE_ID của hồ sơ)');
        if (missing.length) {
            edu.system.alert("Dữ liệu không hợp lệ. Thiếu: " + missing.join(', '), "w");
            return;
        }

        var tenHT = sel.TenHT || '';
        edu.system.confirm("Xác nhận đổi nguyện vọng đầu vào cho thí sinh <strong>" + (ctx.HoTen || '') + "</strong> sang <strong>" + tenHT + "</strong>?");
        $("#btnYes").off("click").on("click", function () {
            var obj_save = {
                'action': 'SV_Core_TS_HoSo_MH/GSAiDykgLwIpLi8CKTQuLyYVMygvKQkuIgPP',
                'func': 'PKG_CORE_TS_HOSO.XacNhanChonChuongTrinhHoc',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'strDaoTao_ChuongTrinh_Id': ctId,
                'strINTAKE_Id': intakeId,
                'strNguoiThucHien_Id': edu.system.userId
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) {
                        edu.system.alert("Đã đổi nguyện vọng đầu vào thành công.", "s");
                        $('#modal-chon-nvdv').modal('hide');
                        // Reload danh sách KQĐK để lấy snapshot mới (Hệ/Khóa/CT/Ngành)
                        if (typeof me.loadKQDK_List === 'function') {
                            me.loadKQDK_List();
                        }
                    } else {
                        edu.system.alert(data && data.Message ? data.Message : "Đổi nguyện vọng thất bại", "e");
                    }
                },
                error: function () {
                    edu.system.alert("Lỗi kết nối khi đổi nguyện vọng.", "e");
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_HOSO.Sua_HoSo_TS
    -- Action: SV_Core_TS_HoSo_MH/EjQgHgkuEi4eFRIP
    -- Đọc 9 field từ form Khai (ddlKQ_* / txtKQ_*) — các field khác trong form
    -- chỉ hiển thị (backend không nhận qua Sua_HoSo_TS).
    -------------------------------------------*/
    saveSuaHoSo_Full: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._isSavingSua) {
            console.warn("[saveSuaHoSo_Full] Đang trong quá trình cập nhật, bỏ qua thao tác lặp.");
            return;
        }
        if (!edu.util.checkValue(me.strSuaHoSo_Id)) {
            edu.system.alert("Chưa xác định hồ sơ để sửa", "w");
            return;
        }
        var hoTen = edu.system.getValById('txtKQ_HoTen');
        if (!edu.util.checkValue(hoTen)) {
            edu.system.alert("Vui lòng nhập Họ và tên", "w");
            $('#kqdkKhaiTabs .aps-sv-tab').first().trigger('click');
            $('#txtKQ_HoTen').focus();
            return;
        }

        var $btnSave = $('#btnKhaiSave');
        me._isSavingSua = true;
        $btnSave.prop('disabled', true).addClass('disabled').html('<i class="fa-solid fa-spinner fa-spin"></i><span> Đang cập nhật...</span>');

        var unlockSua = function () {
            me._isSavingSua = false;
            $btnSave.prop('disabled', false).removeClass('disabled');
            if (me._suaMode) {
                $btnSave.html('<i class="fa-light fa-floppy-disk"></i> Cập nhật hồ sơ');
            } else {
                $btnSave.html('<i class="fa-solid fa-floppy-disk"></i><span> Lưu hồ sơ</span>');
            }
        };

        var g = function (id) { return edu.system.getValById(id) || ''; };
        // Chụp Nơi sinh / Hộ khẩu + Thanh toán + Nguồn khai thác ngay bây giờ — _exitSuaMode() ở success sẽ dọn form
        var addrBlocks = me._collectAddrBlocks();
        var bankInfo = me._collectBank();
        var profileInfo = me._collectProfile();
        var famList = me._collectFamily();
        var idenInfo = me._collectIden();
        var nguonSnap = {
            doiTacId: g('ddlKQ_NguonKhaiThac'),
            ghiChu: g('txtKQ_NguonKhaiThac_GhiChu'),
            nguyenVong: g('ddlKQ_NguyenVongDauRa'),
            dot: me.strDot_Id_ForKQ || g('ddlKQ_DotTuyenSinh') || me._hsDotHienTai(),
            keHoachId: me.strKeHoachTuyenSinh_Id || ''
        };

        // XT_Mon_Data: MON_MA~DIEM~SO_MON~STT~MON_TEN|... — cùng format với luồng Thêm mới
        var tenMon = (g('txtKQ_ToHopTen') || '').split(/[,;]/);
        var monArr = [];
        for (var iMon = 0; iMon < 3; iMon++) {
            var diemMon = g('txtKQ_Diem' + (iMon + 1));
            if (!diemMon && !tenMon[iMon]) continue;
            var tenM = (tenMon[iMon] || ('Mon ' + (iMon + 1))).trim();
            monArr.push(tenM.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
                + '~' + diemMon + '~1~' + (iMon + 1) + '~' + tenM);
        }

        // Extra_Data chỉ còn giữ các field THẬT SỰ không có param trong signature.
        // ⚠ Cột SUA_HOSO_TS_LICHSU.EXTRA_DATA là VARCHAR2(1000) → nhồi nhiều là
        // ORA-12899 và hỏng nguyên lần lưu (đã xảy ra: 1009/1000 khi khai tab Xét tuyển).
        // Các field đã có param thật ở dưới thì KHÔNG lặp lại vào đây nữa.
        var extraObj = {
            NgayCapCCCD: g('txtKQ_NgayCapCCCD'),
            NoiCapCCCD: g('txtKQ_NoiCapCCCD'),
            NS_Huyen_Id: g('ddlKQ_NS_Huyen'),
            HK_Huyen_Id: g('ddlKQ_HK_Huyen')
        };
        // Chỉ giữ field có giá trị để giảm size payload
        var extraFiltered = {};
        for (var k in extraObj) {
            if (extraObj[k]) extraFiltered[k] = extraObj[k];
        }

        var obj_save = {
            'action': 'SV_Core_TS_HoSo_MH/EjQgHgkuEi4eFRIP',
            'func': 'PKG_CORE_TS_HOSO.Sua_HoSo_TS',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA',
            'strHoSo_Id': me.strSuaHoSo_Id,
            'strCorePerson_HoTen': hoTen,
            // BE strict format dd/mm/yyyy (comment dòng 1097-1098). Ô nhập là type=date
            // nên trả về ISO yyyy-mm-dd → PHẢI đổi lại, gửi ISO thẳng là BE hiểu sai ngày/tháng.
            'strCorePerson_NgaySinh': me._ngaySinhToUI(g('txtKQ_NgaySinh')),
            'strCorePerson_GioiTinh_Id': g('ddlKQ_GioiTinh'),
            'strPersonContact_DienThoai': g('txtKQ_DienThoai'),
            'strPersonContact_Email': g('txtKQ_Email'),
            'strPersonIden_SoCCCD': g('txtKQ_SoCCCD'),
            'strHoSo_MaHoSo': g('txtKQ_MaHoSo'),
            'strHoSo_SoBaoDanh': g('txtKQ_SBD'),
            // ---- Các param dưới đây lấy ĐÚNG TÊN theo signature Them_HoSo_TS (dòng 3579+).
            // Trước đây bị nhét vào strExtra_Data → BE không parse nên sửa xong mở lại là trắng,
            // đồng thời làm JSON vượt 1000 ký tự gây ORA-12899 hỏng cả lần lưu.
            // Nếu Sua_HoSo_TS chưa khai param nào thì BE bỏ qua param đó, không phá payload.
            'strPersonProfile_DanToc_Id': g('ddlKQ_DanToc'),
            'strPersonProfile_TonGiao_Id': g('ddlKQ_TonGiao'),
            'strPersonProfile_QuocTich_Id': g('ddlKQ_QuocTich'),
            'strPersonIden_NgayCap': g('txtKQ_NgayCapCCCD'),
            'strPersonIden_NoiCap': g('txtKQ_NoiCapCCCD'),
            // Tab 3 — Xét tuyển
            'strHoSo_KH_Dot_PT_Id': g('ddlKQ_PhuongThuc'),
            'strHoSo_DoiTuong_TS_Id': g('ddlKQ_DoiTuongTS'),
            'strHoSo_DoiTuong_UT_Ids': g('ddlKQ_DoiTuongUT'),
            'strHoSo_KhuVuc_UT_Id': g('ddlKQ_KhuVucUT'),
            'strPersonEdu_Tinh_Id': g('txtKQ_MaTinh12'),
            'strPersonEdu_TruongMaTen': g('txtKQ_TruongMaTen'),
            'strPersonEdu_HocLuc': g('ddlKQ_HocLuc'),
            'strPersonEdu_HanhKiem': g('ddlKQ_HanhKiem'),
            'strXetTuyen_TohopMon_Id': g('txtKQ_ToHopMa'),
            'strXetTuyen_TohopMon_Code': g('txtKQ_ToHopMa'),
            'strXetTuyen_TohopMon_Ten': g('txtKQ_ToHopTen'),
            'dXetTuyen_DiemUuTien': g('txtKQ_DiemUT'),
            'dXetTuyen_DiemTongMon': g('txtKQ_TongDiemMon'),
            'dXetTuyen_DiemTongXT': g('txtKQ_TongDiemXT'),
            'strXT_Mon_Data': monArr.join('|'),
            // Tab 5 — Gia đình
            'strPersonFam_Bo_HoTen': g('txtKQ_Bo_HoTen'),
            'dPersonFam_Bo_NamSinh': g('txtKQ_Bo_NamSinh'),
            'strPersonFam_Bo_NoiO': g('txtKQ_Bo_NoiO'),
            'strPersonFam_Bo_SDT': g('txtKQ_Bo_SDT'),
            'strPersonFam_Me_HoTen': g('txtKQ_Me_HoTen'),
            'dPersonFam_Me_NamSinh': g('txtKQ_Me_NamSinh'),
            'strPersonFam_Me_NoiO': g('txtKQ_Me_NoiO'),
            'strPersonFam_Me_SDT': g('txtKQ_Me_SDT'),
            // Ngân hàng (tab 6) — Them_HoSo_TS có param, trước chỉ nằm trong Extra_Data
            'strPersonBank_HinhThucTT': g('ddlKQ_HD_HinhThucTT'),
            'strPersonBank_TenNganHang': g('txtKQ_HD_NganHang'),
            'strPersonBank_SoTaiKhoan': g('txtKQ_HD_SoTK'),
            'strPersonBank_ChuTaiKhoan': g('txtKQ_HD_ChuTK'),
            'strPersonBank_GhiChu': g('txtKQ_HD_GhiChu'),
            // Khác
            'strKetQua_QuyetDinh_Id': g('txtKQ_QDMa'),
            'strIntake_IntakeCode': g('txtKQ_IntakeCode'),
            'strIntake_IntakeTypeCode': g('txtKQ_IntakeTypeCode'),
            'strDaoTao_CoSoDaoTao_Id': g('ddlKQ_CoSoDaoTao'),
            'strNguyenVong_DauRa_Id': g('ddlKQ_NguyenVongDauRa'),
            /* Lớp dự kiến đầu ra — luồng THÊM MỚI (Them_HoSo_TS) vẫn gửi tham số này từ
               10/09/2026, nhưng luồng SỬA thì BỎ SÓT nên chọn lớp rồi bấm Cập nhật là mất
               (sếp Khoa báo 05/10/2026). Tên tham số lấy đúng theo chữ ký Them_HoSo_TS.
               ⚠ GỬI CẢ HAI TÊN. Trong toàn bộ trang này, tham số lớp dự kiến được gọi là
               `strDaoTao_LopQuanLy_DuKien` ở MỌI nơi khác: bảng cột file Excel import,
               danh sách 77 param của Them_HoSo_TS bên "Đọc từ API", và cả tham số lọc của
               LayDS_HoSo_TS. Chỉ 2 chỗ lưu tay dùng `..._Id_DK` — nhiều khả năng sai tên,
               nên BE nhận "đủ hàm" mà giá trị vẫn rơi mất (05/10/2026).
               Tên lạ thì BE bỏ qua chứ không lỗi, nên gửi kèm là an toàn. */
            'strDaoTao_LopQuanLy_Id_DK': g('ddlKQ_LopDuKien'),
            'strDaoTao_LopQuanLy_DuKien': g('ddlKQ_LopDuKien'),
            'strTS_DoiTacTuyenSinh_Id': g('ddlKQ_NguonKhaiThac'),
            'strTS_DoiTacTuyenSinh_id': g('ddlKQ_NguonKhaiThac'),
            'strTS_DoiTacTuyenSinh_Khac': g('txtKQ_NguonKhaiThac_GhiChu'),
            'strExtra_Data': me._fitExtraData(extraFiltered)
        };
        // ⚠ Chống ghi đè rỗng: ô nào đang trống trên form thì BỎ HẲN khỏi payload,
        // không gửi chuỗi rỗng. Nếu gửi '' thì Sua_HoSo_TS sẽ xoá trắng dữ liệu đang có
        // (đã xảy ra: form Sửa không nạp được Điện thoại/Email/Giới tính → bấm Cập nhật là mất).
        var giuLai = ['action', 'func', 'iM', 'strNguoiThucHien_Id', 'strVaiTroDangNhap_Id',
            'strChucNangHeThong_Id', 'strHanhDong_Code', 'strHoSo_Id', 'strCorePerson_HoTen',
            'strExtra_Data'];
        Object.keys(obj_save).forEach(function (k) {
            if (giuLai.indexOf(k) >= 0) return;
            if (!edu.util.checkValue(obj_save[k])) { delete obj_save[k]; return; }
            // Param d* là NUMBER trong Oracle: gửi chuỗi sẽ PLS-00306 và C# nuốt lỗi
            // thành Success=true nhưng không update gì.
            if (k.charAt(0) === 'd') {
                var n = Number(obj_save[k]);
                if (isNaN(n)) delete obj_save[k]; else obj_save[k] = n;
            }
        });
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    // Tab 6 — thông tin hóa đơn KHÔNG được Sua_HoSo_TS ghi vào bảng
                    // PERSON_INVOICE_INFO (chỉ nằm trong strExtra_Data) → phải lưu riêng.
                    me.save_PersonInvoice(me.strSuaHoSo_CorePersonId || '');
                    // Nơi sinh / Hộ khẩu cũng không được Sua_HoSo_TS ghi ra PERSON_ADDRESS
                    me.save_PersonAddress(me.strSuaHoSo_CorePersonId || '', addrBlocks);
                    // Thông tin thanh toán — Sua_HoSo_TS không có param ngân hàng
                    me.save_PersonBank(me.strSuaHoSo_CorePersonId || '', bankInfo);
                    // Dân tộc / Tôn giáo — nằm ở PERSON_PROFILE, Sua_HoSo_TS cũng không nhận
                    me.save_PersonProfile(me.strSuaHoSo_CorePersonId || '', profileInfo);
                    // Tab 5 Gia đình — PERSON_FAMILY, cũng ngoài spec Sua_HoSo_TS
                    me.save_PersonFamily(me.strSuaHoSo_CorePersonId || '', famList);
                    /* CCCD ngày cấp / nơi cấp — Sua_HoSo_TS chỉ nhận mỗi số CCCD.
                       ⚠ SỐ CCCD hiện ở bảng danh sách lấy từ PERSON_IDENTIFIER, tức do
                       chính hàm này ghi. Nó chạy 2 bước (đọc bản cũ → ghi đè) nên xong
                       SAU nút Cập nhật. Phải chờ nó báo xong rồi mới tải lại danh sách,
                       không thì bảng vẫn hiện số cũ và phải F5 (sếp Khoa 23/09/2026). */
                    var idenXong = false;
                    var dmXong = false;
                    var taiLaiDS = function () {
                        if (!idenXong || !dmXong) return;
                        me.loadKQDK_List();
                    };
                    me.save_PersonIden(me.strSuaHoSo_CorePersonId || '', idenInfo, function () {
                        idenXong = true;
                        taiLaiDS();
                    });
                    // Phòng hờ: nhánh CCCD không gọi lại (mất mạng, thiếu Core_Person_Id...)
                    // thì vẫn tải lại sau 2s, đừng để danh sách đứng im mãi.
                    setTimeout(function () {
                        if (idenXong) return;
                        idenXong = true;
                        taiLaiDS();
                    }, 2000);
                    // Tab 7 — ghi nhận nguồn khai thác SAU CÙNG. Chế độ Sửa đã biết sẵn
                    // Core_Person_Id của hồ sơ đang mở (lưu ở openSuaHoSo).
                    if (me.strSuaHoSo_CorePersonId && nguonSnap.doiTacId) {
                        me._nguonMap[me.strSuaHoSo_CorePersonId] = me._tenDoiTacTS(nguonSnap.doiTacId);
                    }
                    me.save_HoSoDoiTacTS(me.strSuaHoSo_CorePersonId || '', nguonSnap);
                    /* Tab 8 — danh mục hồ sơ giấy tờ. Gộp về MỘT nút (yêu cầu 22/09/2026):
                       không còn nút "Lưu danh mục" riêng, bấm "Cập nhật hồ sơ" là lưu luôn.
                       Gọi TRƯỚC khi dọn form vì _saveHoSoDM đọc thẳng từ lưới trong DOM.
                       Truyền callback để nó KHÔNG tự alert — gộp chung một thông báo, tránh
                       chồng alert làm BS3 gỡ body.modal-open khiến modal tự đóng. */
                    me._saveHoSoDM(function (kq) {
                        var txtDM = '';
                        if (kq && kq.total) {
                            txtDM = '<br/>Danh mục hồ sơ: đã lưu ' + kq.done + '/' + kq.total + ' dòng'
                                + (kq.failed ? ' <span class="text-danger">(lỗi: ' + kq.failed + ')</span>' : '');
                        }
                        edu.system.alert("Cập nhật hồ sơ thành công"
                            + me._addrWarnText(addrBlocks) + me._nguonWarnText()
                            + me._hoaDonWarnText() + txtDM, "s");
                        unlockSua();
                        me._exitSuaMode();
                        // Về lại screen list; việc tải lại do taiLaiDS lo — nó chờ cả
                        // nhánh ghi CCCD xong mới gọi, tránh đọc phải dữ liệu cũ.
                        $('#kqdk_khai').addClass('d-none');
                        $('#kqdk_list').removeClass('d-none');
                        dmXong = true;
                        taiLaiDS();
                    });
                } else {
                    unlockSua();
                    edu.system.alert("Sua_HoSo_TS: " + ((data && data.Message) || 'Lỗi'), "w");
                }
            },
            error: function (er) {
                unlockSua();
                edu.system.alert("Sua_HoSo_TS (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_HOSO.Xoa_HoSo_TS
    -- Action: SV_Core_TS_HoSo_MH/GS4gHgkuEi4eFRIP
    -------------------------------------------*/
    deleteHoSo_TS: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'SV_Core_TS_HoSo_MH/GS4gHgkuEi4eFRIP',
            'func': 'PKG_CORE_TS_HOSO.Xoa_HoSo_TS',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA',
            'strHoSo_Id': strId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    edu.system.alert("Xóa hồ sơ thành công", "s");
                    me.loadKQDK_List();
                } else {
                    edu.system.alert("Xoa_HoSo_TS: " + ((data && data.Message) || 'Lỗi'), "w");
                }
            },
            error: function (er) {
                edu.system.alert("Xoa_HoSo_TS (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Preload DM Giới tính vào #ddlKQ_GioiTinh (dropdown ẩn của form Khai) để list dùng lookup.
    -- Chạy 1 lần, sau khi load xong nếu list đang hiển thị dữ liệu → re-render với TEN.
    -------------------------------------------*/
    _preloadDMForList: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._listDMLoaded) return;
        me._listDMLoaded = true;
        try {
            var C = (window.constant && constant.setting && constant.setting.CATOR) ? constant.setting.CATOR : {};
            var NS = C.NS || {};
            // Re-render sau khi mỗi DM nạp xong để cột lookup theo ID hiện ra tên
            var reRender = function () {
                if (!$('#kqdk_list').hasClass('d-none') && me.dtKQDK_HoSo && me.dtKQDK_HoSo.length) {
                    me._kqApplyAllFilters();
                }
            };
            if (NS.GITI) edu.system.loadToCombo_DanhMucDuLieu(NS.GITI, "ddlKQ_GioiTinh", "", reRender);
            // Dân tộc / Tôn giáo: view LayDS_HoSo_TS không trả về, phải lấy ID từ PERSON_PROFILE
            // (_ensureProfileMapForList) rồi tra tên qua 2 DM này.
            if (NS.DATO) edu.system.loadToCombo_DanhMucDuLieu(NS.DATO, "ddlKQ_DanToc", "", reRender);
            if (NS.TOGI) edu.system.loadToCombo_DanhMucDuLieu(NS.TOGI, "ddlKQ_TonGiao", "", reRender);
            // 4 danh mục dưới đây phục vụ chế độ Đầy đủ: LayTT_HoSo_TS chỉ trả ID,
            // phải có danh mục mới đổi ra tên hiển thị được (xem _ensureChiTietForRows).
            var CH = C.CHUN || {};
            if (CH.CHLU) edu.system.loadToCombo_DanhMucDuLieu(CH.CHLU, "ddlKQ_QuocTich", "", reRender);
            edu.system.loadToCombo_DanhMucDuLieu("TS.DOITUONGDUTUYEN", "ddlKQ_DoiTuongTS", "", reRender);
            edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG", "ddlKQ_DoiTuongUT", "", reRender);
            edu.system.loadToCombo_DanhMucDuLieu("QLSV.KHUVUC", "ddlKQ_KhuVucUT", "", reRender);
        } catch (ex) { }
    },

    /*------------------------------------------
    -- Nạp PERSON_PROFILE cho toàn bộ hồ sơ đang hiển thị → map PERSON_ID → profile.
    -- Dùng PKG_CORE_NGUOIHOC_01.LayDSPerson_Profile (nhận strPerson_Ids nhiều giá trị)
    -- nên chỉ tốn 1 request cho cả trang thay vì gọi lẻ từng hồ sơ.
    -- Phục vụ 2 cột Dân tộc / Tôn giáo mà view LayDS_HoSo_TS chưa trả về.
    -------------------------------------------*/
    _ensureProfileMapForList: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var done = function () { if (typeof cb === 'function') cb(); };
        me._kqProfileMap = me._kqProfileMap || {};
        var ids = [], seen = {};
        (rows || []).forEach(function (d) {
            var pid = me._kqPick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'PERSON_ID', 'Person_Id']);
            if (pid && !seen[pid] && !me._kqProfileMap[pid]) { seen[pid] = 1; ids.push(pid); }
        });
        if (!ids.length) { done(); return; }
        // Chia lô để chuỗi strPerson_Ids không quá dài khi danh sách lớn
        var BATCH = 300, batches = [];
        for (var i = 0; i < ids.length; i += BATCH) batches.push(ids.slice(i, i + BATCH));
        var remain = batches.length;
        batches.forEach(function (b) {
            edu.system.makeRequest({
                success: function (data) {
                    var arr = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                    arr.forEach(function (p) {
                        var pid = p.PERSON_ID || p.Person_Id || '';
                        if (pid) me._kqProfileMap[pid] = p;
                    });
                    if (--remain === 0) done();
                },
                error: function (er) {
                    kqdkNoLog('[KQDK] LayDSPerson_Profile err:', er);
                    if (--remain === 0) done();
                },
                type: 'POST',
                contentType: true,
                action: 'SV_NGUOIHOC_01_MH/DSA4BRIRJDMyLi8eETMuJygtJAPP',
                data: {
                    'action': 'SV_NGUOIHOC_01_MH/DSA4BRIRJDMyLi8eETMuJygtJAPP',
                    'func': 'PKG_CORE_NGUOIHOC_01.LayDSPerson_Profile',
                    'iM': edu.system.iM,
                    'strPerson_Ids': b.join(','),
                    'strEthnicity_Id': '',
                    'strReligion_Id': '',
                    'strPolicyObject_Id': '',
                    'dIsActive': 1,
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                    'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                    'strHanhDong_Code': ''
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_HOSO.LayDS_HoSo_TS
    -- Action: SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP
    -- Backend cần nâng cấp view SQL của procedure này (join thêm Profile/Address/Edu/Family/
    -- Invoice/Bank + DM TEN) để trả về đầy đủ 51 cột mà UI cần.
    -------------------------------------------*/
    loadKQDK_List: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            me.dtKQDK_HoSo = [];
            me.renderKQDK_Table([]);
            return;
        }
        // Ưu tiên bản FULL: view thường không trả Điện thoại / Email (và nhiều cột khác),
        // nên bảng để trống dù hồ sơ có dữ liệu. Bản FULL lỗi hoặc rỗng thì lùi về bản thường.
        // Bản FULL lỗi 1 lần rồi thì thôi, khỏi gọi hỏng lại mỗi lần tải danh sách.
        // (Server hiện trả ORA-01791 "not a SELECTed expression" — lỗi trong proc.)
        var dungBanGon = !!arguments[0] || !!me._fullViewHong;
        var obj_save = {
            'action': dungBanGon ? 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP'
                : 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEh4HFA0N',
            'func': dungBanGon ? 'PKG_CORE_TS_HOSO.LayDS_HoSo_TS'
                : 'PKG_CORE_TS_HOSO.LayDS_HoSo_TS_FULL',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM',
            'strHoSo_KH_TS_Id': me.strKeHoachTuyenSinh_Id || '',
            'strHoSo_KH_TS_Dot_Id': me.strDot_Id_ForKQ || '',
            'strHoSo_KH_Dot_PT_Id': '',
            'strNguyenVong_DauRa_Id': '',
            'strDaoTao_LopQuanLy_DuKien': '',
            'strHoSo_KetQuaCode': '',
            'strHoSo_TuNgay': '',
            'strHoSo_DenNgay': ''
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    var rows = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (!dungBanGon && !rows.length) { me.loadKQDK_List(true); return; }
                    me.dtKQDK_HoSo = rows;
                    // Response KHÔNG có field NGÀNH → phải lookup 2 bước:
                    //   NGUYENVONG_DAURA_ID → đầu ra (Pr_Ts_Kh_Dau_Ra_Get_Ds) → NGANH_TS_ID/TEN
                    //   → _nganhMaLookup (DM TUYENSINH.NGANHNGHE) → MA_NGANH
                    var remaining = 3;
                    var afterAll = function () {
                        // Qua _kqApplyAllFilters chứ không render thẳng: tải lại sau khi
                        // sửa/xóa hồ sơ vẫn giữ nguyên bộ lọc người dùng đang đặt.
                        if (--remaining !== 0) return;
                        me._kqApplyAllFilters();
                        /* Đi từ màn "Tra cứu người học" sang: danh sách vừa có cache thì mở
                           luôn hồ sơ đó ra. openSuaHoSo đọc từ dtKQDK_HoSo nên BẮT BUỘC phải
                           đợi tới đây, gọi sớm hơn là báo "không tìm thấy hồ sơ trong cache". */
                        if (edu.util.checkValue(me._traCuu_MoHoSoId)) {
                            var id = me._traCuu_MoHoSoId;
                            me._traCuu_MoHoSoId = '';
                            setTimeout(function () { me.openSuaHoSo(id); }, 60);
                        }
                    };
                    me._ensureKQDK_DauRaMap(afterAll);
                    me._ensureNganhMaLookup(afterAll);
                    // Dân tộc / Tôn giáo không có trong view → lấy từ PERSON_PROFILE (1 request cho cả trang)
                    me._ensureProfileMapForList(rows, afterAll);
                } else {
                    if (!dungBanGon) { me._fullViewHong = true; me.loadKQDK_List(true); return; }
                    me.dtKQDK_HoSo = [];
                    me.renderKQDK_Table([]);
                    edu.system.alert("LayDS_HoSo_TS: " + ((data && data.Message) || 'Không lấy được danh sách'), "w");
                }
            },
            error: function (er) {
                if (!dungBanGon) { me._fullViewHong = true; me.loadKQDK_List(true); return; }
                me.dtKQDK_HoSo = [];
                me.renderKQDK_Table([]);
                edu.system.alert("LayDS_HoSo_TS (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Multi-key fallback getter — API có thể trả tên cột nhiều casing khác nhau
    -------------------------------------------*/
    _kqPick: function (d, keys) {
        if (!d) return '';
        for (var i = 0; i < keys.length; i++) {
            var v = d[keys[i]];
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    },

    /*------------------------------------------
    -- Fuzzy pick: quét key của record, trả value đầu tiên khớp regex.
    -- Fallback cho field convention API không nhất quán (VD CCCD: SOCCCD/CCCD/SO_CCCD/soCCCD…).
    -------------------------------------------*/
    _kqPickFuzzy: function (d, re) {
        if (!d) return '';
        for (var k in d) {
            if (!d.hasOwnProperty(k)) continue;
            if (re.test(k)) {
                var v = d[k];
                if (v !== undefined && v !== null && v !== '') return v;
            }
        }
        return '';
    },

    /*------------------------------------------
    -- Lookup TEN theo ID từ option của 1 dropdown DM đã load (VD tra Giới tính TEN từ ID).
    -- Fallback trả '' nếu DM chưa load hoặc ID không match.
    -------------------------------------------*/
    _kqLookupById: function (id, selectId) {
        if (!id) return '';
        var el = document.getElementById(selectId);
        if (!el) return '';
        for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === String(id)) return el.options[i].text;
        }
        return '';
    },

    /*==========================================================================
    == CỘT "MÃ LỚP QL"
    == Đã soi bằng _dumpLop() trên dữ liệu thật (14/09/2026):
    ==   LayDS_HoSo_TS  (20 cột) — KHÔNG có cột lớp
    ==   LayTT_HoSo_TS  (42 cột) — KHÔNG có cột lớp
    == Lý do: hồ sơ tuyển sinh chỉ đi tới bước TIẾP NHẬN. Lớp quản lý chỉ tồn tại
    == sau khi tạo hồ sơ học tập (nút "Phân lớp tự động" làm việc này), lúc đó dữ
    == liệu nằm bên QLSV người học chứ không nằm trong hồ sơ TS.
    == Danh sách có sẵn cờ INTAKE_ISSTUDYCREATED nên phân biệt được 2 tình huống:
    ==   = 0 → chưa tạo hồ sơ học tập → CHẮC CHẮN chưa có lớp, khỏi gọi API
    ==   = 1 → tra lớp qua PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All (trả
    ==         DAOTAO_LOPQUANLY_MA / _TEN — xem zoneEditModal_inject.js:1817)
    == Chỉ gọi cho dòng ĐANG HIỂN THỊ, tối đa 6 request song song, có cache nên
    == lật trang qua lại không gọi lại. Cùng cách chữa cháy của cột SĐT/Email.
    ==========================================================================*/
    _lopSVMap: {},        // COREPERSON_ID → { ma, ten, id }
    _lopQLMap: null,      // ID lớp → { ma, ten } — chỉ nạp khi người học trả về mỗi ID

    _ACTION_LayDSNguoiHoc_All: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',

    _ensureLopForRows: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (coMoi) { if (typeof cb === 'function') cb(coMoi); };
        var pick = me._kqPick;

        // Chỉ hỏi cho hồ sơ ĐÃ tạo hồ sơ học tập — còn lại chắc chắn chưa có lớp
        var caans = [];
        (rows || []).forEach(function (d) {
            if (String(pick(d, ['INTAKE_ISSTUDYCREATED'])) !== '1') return;
            var pid = pick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'PERSON_ID']);
            if (!pid || (pid in me._lopSVMap)) return;
            if (caans.some(function (x) { return x.pid === pid; })) return;
            caans.push({
                pid: pid,
                tuKhoa: pick(d, ['PERSONIDEN_SOCCCD', 'SOCCCD', 'CCCD'])
                    || pick(d, ['COREPERSON_HOTEN', 'HOTEN'])
            });
        });
        if (!caans.length) { xong(false); return; }

        var canMapId = false;
        var i = 0, dangChay = 0, MAX = 6;
        var tiepTuc = function () {
            while (dangChay < MAX && i < caans.length) {
                var item = caans[i++];
                dangChay++;
                (function (it) {
                    var ketThuc = function () {
                        dangChay--;
                        if (i < caans.length) { tiepTuc(); return; }
                        if (dangChay > 0) return;
                        // Người học chỉ trả ID lớp → nạp thêm bảng lớp rồi mới vẽ
                        if (canMapId) { me._ensureLopQLLookup(function () { xong(true); }); }
                        else { xong(true); }
                    };
                    edu.system.makeRequest({
                        success: function (data) {
                            var rs = (data && data.Success && data.Data) || [];
                            if (rs.length === undefined) rs = [rs];
                            // Một người có thể học nhiều ngành → nhiều dòng. Ưu tiên dòng
                            // đúng Core_Person_Id, sau đó mới tới dòng duy nhất trả về.
                            var row = rs.filter(function (r) {
                                return me._kqPick(r, ['CORE_PERSON_ID', 'COREPERSON_ID', 'PERSON_ID']) === it.pid;
                            })[0] || rs[0];
                            if (row) {
                                var o = {
                                    ma: me._kqPick(row, ['DAOTAO_LOPQUANLY_MA', 'LOPQUANLY_MA', 'LOP_MA']),
                                    ten: me._kqPick(row, ['DAOTAO_LOPQUANLY_TEN', 'QLSV_NGUOIHOC_LOPQUANLY_TEN', 'LOP_TEN', 'LOP']),
                                    id: me._kqPick(row, ['DAOTAO_LOPQUANLY_ID', 'LOPQUANLY_ID'])
                                };
                                if (!o.ma && !o.ten && o.id) canMapId = true;
                                me._lopSVMap[it.pid] = o;
                            } else {
                                me._lopSVMap[it.pid] = { ma: '', ten: '', id: '' };
                            }
                            ketThuc();
                        },
                        // Lỗi cũng ghi cache, không thì mỗi lần vẽ lại là gọi lại
                        error: function () { me._lopSVMap[it.pid] = { ma: '', ten: '', id: '' }; ketThuc(); },
                        type: 'POST',
                        contentType: true,
                        action: me._ACTION_LayDSNguoiHoc_All,
                        data: {
                            'action': me._ACTION_LayDSNguoiHoc_All,
                            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
                            'iM': edu.system.iM,
                            'strTuKhoa': it.tuKhoa || '',
                            'strNguoiThucHien_Id': edu.system.userId,
                            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || edu.system.strVaiTro_Id || '',
                            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id || '',
                            'strHanhDong_Code': '',
                            'strDaoTao_HeDaoTao_Id': '',
                            'strDaoTao_KhoaDaoTao_Id': '',
                            'strDaoTao_ChuongTrinh_Id': '',
                            'strDaoTao_KhoaQuanLy_Id': '',
                            'strDaoTao_LopQuanLy_Id': '',
                            'strStudyStatus_Ids': '',
                            'dIsPrimary': '',
                            'dBoQuaPhamVi': 0,
                            'pageIndex': 1,
                            'pageSize': 20
                        },
                        fakedb: []
                    }, false, false, false, null);
                })(item);
            }
        };
        tiepTuc();
    },

    _ensureLopQLLookup: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (me._lopQLMap) { xong(); return; }
        me._lopQLMap = {};   // set sớm để lần gọi sau không bắn thêm request khi đang bay
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                rows.forEach(function (r) {
                    var id = r.ID || r.Id || r.id || '';
                    if (!id) return;
                    me._lopQLMap[String(id).trim()] = {
                        ma: r.MA || r.Ma || '',
                        ten: r.TEN || r.Ten || ''
                    };
                });
                xong();
            },
            error: function (er) {
                kqdkNoLog('[KQDK] LayDSKS_DaoTao_LopQuanLy err:', er);
                xong();
            },
            type: 'POST',
            contentType: true,
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
            data: {
                'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
                'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
                'iM': edu.system.iM,
                'strTuKhoa': '',
                'strDaoTao_CoSoDaoTao_Id': '',
                'strDaoTao_KhoaDaoTao_Id': '',
                'strDaoTao_Nganh_Id': '',
                'strDaoTao_KhoaQuanLy_Id': '',
                'strDaoTao_LoaiLop_Id': '',
                'strDaoTao_ToChucCT_Id': '',
                'dLopMoNganh2': '',
                'strNhomlop_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'pageIndex': 1,
                'pageSize': 100000
            },
            fakedb: []
        }, false, false, false, null);
    },

    _kqLopQL: function (d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var laId = function (v) { return String(v == null ? '' : v).trim().length === 32; };
        var traMap = function (id) {
            var o = (me._lopQLMap || {})[String(id).trim()];
            return o ? (o.ma || o.ten || '') : '';
        };

        // 1) Hồ sơ TS tự trả mã/tên lớp — hiện chưa có, nhưng để sẵn cho ngày
        //    BE bổ sung cột thì không phải sửa lại chỗ này nữa.
        var v = me._kqPick(d, [
            'INTAKE_LOP_MA', 'DAOTAO_LOPQUANLY_MA', 'LOPQUANLY_MA', 'LOP_QUANLY_MA',
            'MA_LOP', 'MaLop', 'DAOTAO_LOPQUANLY_DUKIEN_MA', 'LOPQUANLY_DUKIEN_MA',
            'DAOTAO_LOPQUANLY_TEN', 'LOPQUANLY_TEN', 'TEN_LOP'
        ]);
        if (v) return laId(v) ? traMap(v) : v;

        // 2) Lớp lấy được từ hồ sơ người học (chỉ có khi đã tạo hồ sơ học tập)
        var pid = me._kqPick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'PERSON_ID']);
        var o = (me._lopSVMap || {})[pid];
        if (o) {
            var got = o.ma || o.ten || (o.id ? traMap(o.id) : '');
            if (got) return got;
        }

        // 3) Chưa tạo hồ sơ học tập → nói rõ lý do thay vì để ô trắng, tránh bị
        //    hiểu nhầm là bảng lỗi không hiện được dữ liệu.
        if (String(me._kqPick(d, ['INTAKE_ISSTUDYCREATED'])) === '0') return 'Chưa phân lớp';

        // Đã tạo hồ sơ học tập nhưng chưa tra xong → để trống, vẽ lại sau khi có
        return '';
    },

    /*------------------------------------------
    -- Entry point: cache toàn bộ data đang view + reset về trang 1 + render.
    -- Không render trực tiếp — delegate cho _kqRenderPage() để chỉ vẽ slice (tránh đơ 11K row).
    -------------------------------------------*/
    renderKQDK_Table: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._kqViewData = data || [];
        me._kqPageIdx = 1;
        $('#lblKQDK_Total').text(me._kqViewData.length);
        me._kqInitTableMode();      // tự guard; lần đầu sẽ dựng thead theo chế độ đã nhớ
        me._kqCapNhatIconLoc();     // thead chỉ dựng 1 lần → phải tự tô lại phễu/mũi tên
        me._kqRenderPage();
    },

    /*------------------------------------------
    -- Tô đậm phễu của cột đang lọc + gắn mũi tên ở cột đang sắp xếp.
    -- _kqInitTableMode chỉ dựng thead đúng 1 lần nên mỗi lần đổi bộ lọc phải tự
    -- cập nhật ở đây, không thì bấm lọc xong nhìn tiêu đề vẫn như chưa lọc gì.
    -------------------------------------------*/
    _kqCapNhatIconLoc: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        $('#tblKQDK_HoSo thead .kqdk-th-sort').remove();
        $('#tblKQDK_HoSo thead .kqdk-th-loc').each(function () {
            var k = $(this).attr('data-key');
            var co = !!(me._kqFilters && me._kqFilters[k] && me._kqFilters[k].length);
            $(this).toggleClass('dang-loc', co);
            if (me._kqSort && me._kqSort.key === k) {
                $('<i class="fa-solid fa-arrow-' + (me._kqSort.dir === 'asc' ? 'down-a-z' : 'up-z-a')
                    + ' kqdk-th-sort"></i>').insertBefore(this);
            }
        });
    },

    /*------------------------------------------
    -- Sync thanh scroll-x giả (kqdk_scrollx_top) với container thật (kqdk_table_wrap).
    -- Bind 1 lần (idempotent qua .off), gọi lại sau mỗi lần render để cập nhật width.
    -- Width phải match table.outerWidth() để scrollbar giả tương thích chiều dài scroll thật.
    -------------------------------------------*/
    _kqSyncScrollTop: function () {
        var $top = $('#kqdk_scrollx_top');
        var $wrap = $('#kqdk_table_wrap');
        var $inner = $('#kqdk_scrollx_top_inner');
        if (!$top.length || !$wrap.length) return;
        var w = $wrap.find('table').outerWidth() || 0;
        $inner.width(w);
        // Bind sync 2 chiều — off trước để idempotent
        $top.off('scroll.kqsync').on('scroll.kqsync', function () {
            $wrap.scrollLeft($(this).scrollLeft());
        });
        $wrap.off('scroll.kqsync').on('scroll.kqsync', function () {
            $top.scrollLeft($(this).scrollLeft());
        });
    },

    /*------------------------------------------
    -- Nhảy tới trang N (clamp trong [1, totalPages]) rồi render.
    -------------------------------------------*/
    _kqGoPage: function (p) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var total = (me._kqViewData || []).length;
        var pages = Math.max(1, Math.ceil(total / me._kqPageSize));
        if (p < 1) p = 1;
        if (p > pages) p = pages;
        me._kqPageIdx = p;
        me._kqRenderPage();
    },

    /*------------------------------------------
    -- Render 1 trang (slice _kqViewData) vào tbody + update control phân trang.
    -- STT là chỉ số toàn cục (offset + i + 1) để nhất quán khi lật trang.
    -- Escape HTML để tránh XSS từ raw API/import.
    -------------------------------------------*/
    /*==========================================================================
    == BẢNG KẾT QUẢ ĐĂNG KÝ — CHẾ ĐỘ GỌN / ĐẦY ĐỦ (yêu cầu khách 11/09/2026)
    == "Phần kết quả quá nhiều thông tin không cần thiết, chi tiết sẽ nhấn vào
    ==  từng người xem."
    == Bảng gốc 51 cột chia 8 nhóm (thead 2 tầng có colspan). Ẩn từng cột bằng CSS
    == sẽ vỡ colspan của hàng nhóm, nên chế độ Gọn thay hẳn thead bằng 1 tầng và
    == chỉ render đúng các cột trong _KQ_COT_GON. Dữ liệu nạp về KHÔNG đổi —
    == Xuất kết quả vẫn ra đủ 51 cột.
    ==========================================================================*/
    // i  = chỉ số trong mảng của _kqRowToArray (0=STT, 1=checkbox, 2=Họ tên...)
    // get = tự tính giá trị từ bản ghi, dùng khi cột gọn cần dữ liệu khác bảng đầy đủ
    //       (VD hiện TÊN ngành thay vì MÃ ngành) — không đụng vào mảng 51 phần tử,
    //       đổi mảng đó là lệch toàn bộ cột của chế độ Đầy đủ.
    // key = định danh cột cho bộ lọc kiểu Excel (xem _kqMoFilter).
    // Đặt theo chỉ số trong mảng _kqRowToArray ('i' + index) để KHỚP với key mà
    // chế độ Đầy đủ tự sinh — lọc ở chế độ này rồi đổi sang chế độ kia vẫn giữ
    // nguyên bộ lọc và phễu vẫn sáng đúng cột. Cột nào tự tính giá trị (Ngành)
    // thì mới đặt tên riêng.
    _KQ_COT_GON: [
        { key: 'i2', i: 2, ten: 'Họ và tên', css: 'td-left', w: 200 },
        { key: 'i3', i: 3, ten: 'Ngày sinh', css: 'td-center', w: 110 },
        { key: 'i4', i: 4, ten: 'Giới tính', css: 'td-center', w: 90 },
        { key: 'i11', i: 11, ten: 'Số CCCD', css: 'td-center', w: 140 },
        { key: 'i8', i: 8, ten: 'Điện thoại', css: 'td-center', w: 120 },
        {
            key: 'nganh', ten: 'Ngành', css: 'td-left', w: 240,
            get: function (d) {
                var me = main_doc.KeHoachTuyenSinhNew;
                // View có cột tên ngành thì lấy thẳng, không thì tra qua Nguyện vọng đầu ra
                var ten = me._kqPick(d, ['INTAKE_NGANH_TEN', 'NGANH_TEN', 'TEN_NGANH', 'MaNganh_Ten']);
                if (ten) return ten;
                var drId = me._kqPick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']);
                var dr = drId ? (me._kqDauRaMap || {})[drId] : null;
                return (dr && dr.nganhTen) || '';
            }
        },
        { key: 'i44', i: 44, ten: 'Mã lớp QL', css: 'td-center', w: 110 },
        { key: 'i51', i: 51, ten: 'Nguồn khai thác', css: 'td-left', w: 170 },
        { key: 'i41', i: 41, ten: 'Ngày BH QĐ', css: 'td-center', w: 130 }
    ],

    _kqTableMode: '',

    _kqApplyTableMode: function (mode) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (mode !== 'gon' && mode !== 'full') mode = 'gon';
        me._kqTableMode = mode;
        try { localStorage.setItem('kqdk_tbmode', mode); } catch (e) { }
        $('#kqdkTableMode .kqdk-tbopt').removeClass('active')
            .filter('[data-tbmode="' + mode + '"]').addClass('active');

        var $tbl = $('#tblKQDK_HoSo');
        // Giữ lại thead gốc để quay về Đầy đủ mà không phải dựng lại tay
        if (!me._kqTheadFull) me._kqTheadFull = $tbl.find('thead').html();

        if (mode === 'full') {
            $tbl.find('thead').html(me._kqTheadFull);
            $tbl.removeClass('kqdk-clickrow');
            me._kqGanPhezuFull();
        } else {
            // Mỗi cột kèm nút phễu → bộ lọc kiểu Excel (xem _kqMoFilter).
            // Phễu tô màu + hiện mũi tên sắp xếp khi cột đó đang có lọc/sort.
            var ths = me._KQ_COT_GON.map(function (c) {
                var dangLoc = !!(me._kqFilters && me._kqFilters[c.key]);
                var sort = (me._kqSort && me._kqSort.key === c.key) ? me._kqSort.dir : '';
                return '<th class="' + c.css + '" style="min-width:' + c.w + 'px;">'
                    + '<span class="kqdk-th">'
                    + '<span class="kqdk-th-ten">' + c.ten + '</span>'
                    + (sort ? '<i class="fa-solid fa-arrow-' + (sort === 'asc' ? 'down-a-z' : 'up-z-a') + ' kqdk-th-sort"></i>' : '')
                    + '<i class="fa-solid fa-filter kqdk-th-loc' + (dangLoc ? ' dang-loc' : '')
                    + '" data-key="' + c.key + '" title="Lọc / sắp xếp"></i>'
                    + '</span></th>';
            }).join('');
            $tbl.find('thead').html('<tr>'
                + '<th class="td-fixed td-center kqdk-col1">STT</th>'
                + '<th class="td-center kqdk-col2"><input type="checkbox" id="chkKQDK_All"></th>'
                + '<th class="td-center kqdk-col3">Thao tác</th>'
                + ths + '</tr>');
            $tbl.addClass('kqdk-clickrow');
        }
        // Chỉ vẽ lại khi đã có dữ liệu — lần init đầu tiên renderKQDK_Table sẽ tự vẽ
        if (me._kqViewData) me._kqRenderPage();
    },

    /*------------------------------------------
    -- Gắn phễu lọc cho chế độ ĐẦY ĐỦ. Thead ở đây 2 tầng nên không map thẳng
    -- vị trí th sang chỉ số cột được, phải đi theo đúng luật của bảng:
    --   Tầng 1: th có rowspan=2 là CỘT THẬT (bỏ 3 cột đầu STT/tick/Thao tác),
    --           th không rowspan là TIÊU ĐỀ NHÓM (Số CCCD, Hộ khẩu...) → bỏ qua
    --   Tầng 2: mọi th đều là cột thật, nối tiếp chỉ số của tầng 1
    -- Đi hết 2 tầng là ra đúng chỉ số 2..50 của mảng _kqRowToArray.
    -- Cách này tự bám theo thead nên sau này thêm/bớt cột không phải sửa lại đây.
    -------------------------------------------*/
    _kqGanPhezuFull: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tr = $('#tblKQDK_HoSo thead tr');
        if ($tr.length < 2) return;
        me._kqCotFull = {};
        var idx = 2;      // arr[0]=STT, arr[1]=ô tick → cột dữ liệu bắt đầu từ 2
        $tr.eq(0).find('th').each(function (i) {
            if (i < 3) return;                        // STT / tick / Thao tác
            if (!$(this).attr('rowspan')) return;     // tiêu đề nhóm
            me._kqThemPhezu($(this), idx++);
        });
        $tr.eq(1).find('th').each(function () {
            me._kqThemPhezu($(this), idx++);
        });
    },

    _kqThemPhezu: function ($th, i) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var ten = ($th.text() || '').replace(/\s+/g, ' ').trim();
        var key = 'i' + i;
        me._kqCotFull[key] = { key: key, i: i, ten: ten || ('Cột ' + i) };
        var dangLoc = !!(me._kqFilters && me._kqFilters[key] && me._kqFilters[key].length);
        var sort = (me._kqSort && me._kqSort.key === key) ? me._kqSort.dir : '';
        $th.html('<span class="kqdk-th">'
            + '<span class="kqdk-th-ten">' + esc(ten) + '</span>'
            + (sort ? '<i class="fa-solid fa-arrow-' + (sort === 'asc' ? 'down-a-z' : 'up-z-a') + ' kqdk-th-sort"></i>' : '')
            + '<i class="fa-solid fa-filter kqdk-th-loc' + (dangLoc ? ' dang-loc' : '')
            + '" data-key="' + key + '" title="Lọc / sắp xếp"></i>'
            + '</span>');
    },

    _kqInitTableMode: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._kqTbBound) return;
        me._kqTbBound = true;
        $('#kqdkTableMode').on('click', '.kqdk-tbopt', function () {
            me._kqApplyTableMode($(this).attr('data-tbmode'));
        });
        var mode = 'gon';
        try { mode = localStorage.getItem('kqdk_tbmode') || 'gon'; } catch (e) { }
        me._kqApplyTableMode(mode);
    },

    /*==========================================================================
    == SĐT / EMAIL CHO BẢNG DANH SÁCH
    == View LayDS_HoSo_TS không trả 2 cột này, còn LayDS_HoSo_TS_FULL đang lỗi
    == ORA-01791 ở server. Không có API lấy liên hệ theo LÔ (LayDSPerson_Profile
    == có strPerson_Ids nhưng chỉ cho dân tộc/tôn giáo), nên phải gọi từng người.
    == Giảm tải bằng 3 cách: chỉ lấy cho các dòng ĐANG HIỂN THỊ, chạy tối đa 6
    == request song song, và nhớ vào cache nên lật trang qua lại không gọi lại.
    == ⚠ Đây là cách chữa cháy. Sếp sửa LayDS_HoSo_TS_FULL xong thì bỏ được.
    ==========================================================================*/
    _contactMap: {},

    _ensureContactForRows: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (coMoi) { if (typeof cb === 'function') cb(coMoi); };
        var ids = [];
        (rows || []).forEach(function (d) {
            var pid = me._kqPick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'PERSON_ID']);
            if (pid && !(pid in me._contactMap) && ids.indexOf(pid) < 0) ids.push(pid);
        });
        if (!ids.length) { xong(false); return; }

        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
        };
        var i = 0, dangChay = 0, MAX = 6;
        var tiepTuc = function () {
            while (dangChay < MAX && i < ids.length) {
                var pid = ids[i++];
                dangChay++;
                (function (personId) {
                    var ketThuc = function () {
                        dangChay--;
                        if (i < ids.length) { tiepTuc(); return; }
                        if (dangChay === 0) xong(true);
                    };
                    edu.system.makeRequest({
                        success: function (data) {
                            var lh = { sdt: '', email: '' };
                            var rs = (data && data.Success && data.Data) || [];
                            (rs.length !== undefined ? rs : [rs]).forEach(function (item) {
                                if (!item) return;
                                var val = item.CONTACT_VALUE || item.VALUE || '';
                                if (!val) return;
                                var text = strip(item.CONTACT_TYPE_CODE_MA || item.MA) + '|'
                                    + strip(item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME);
                                var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
                                var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
                                if (!isEmail && !isPhone) {      // loại không rõ → đoán theo giá trị
                                    if (val.indexOf('@') > -1) isEmail = true;
                                    else if (/^[\d\s\+\-\(\)\.]+$/.test(val) && val.replace(/\D/g, '').length >= 6) isPhone = true;
                                }
                                if (isEmail && !lh.email) lh.email = val;
                                else if (isPhone && !lh.sdt) lh.sdt = val;
                            });
                            me._contactMap[personId] = lh;
                            ketThuc();
                        },
                        // Lỗi cũng phải ghi vào cache, không thì lần render sau lại gọi lại
                        error: function () { me._contactMap[personId] = { sdt: '', email: '' }; ketThuc(); },
                        type: 'POST',
                        contentType: true,
                        action: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
                        data: {
                            'action': 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
                            'func': 'PKG_CORE_HOSONHANSU_05.GetPersonContactByPerson_Id',
                            'iM': edu.system.iM,
                            'strPerson_Id': personId,
                            'strChucNang_Id': edu.system.strChucNang_Id,
                            'strNguoiThucHien_Id': edu.system.userId
                        },
                        fakedb: []
                    }, false, false, false, null);
                })(pid);
            }
        };
        tiepTuc();
    },

    /*==========================================================================
    == CỘT "NGUỒN KHAI THÁC" CHO BẢNG DANH SÁCH (yêu cầu 14/09/2026)
    == Nguồn khai thác không nằm trong hồ sơ TS mà ở bảng ghi-nhận đối tác
    == (TS_HoSo_DoiTacTS), nên view danh sách không có.
    == Cách lấy: thử MỘT request cho cả kế hoạch trước (bỏ trống Core_Person_Id).
    == Được thì cả bảng chỉ tốn 1 lượt gọi. Proc không cho bỏ trống thì mới lùi
    == về hỏi từng người như cột SĐT/Email đang làm.
    ==========================================================================*/
    _nguonMap: {},          // COREPERSON_ID → tên nguồn khai thác ('' = không có)
    _nguonLoDaThu: false,   // đã thử cách lấy cả lô chưa
    _ACTION_DM_DoiTacTS: 'SV_Core_TS_HoSo_MH/DSA4BRIeFRIeBS4oFSAiFTQ4JC8SKC8p',

    /*------------------------------------------
    -- Nạp danh mục đối tác để đổi ID → tên. Tách riêng khỏi _loadNguonKhaiThac
    -- vì hàm đó còn đổ options + dựng lại select2 — không nên chạy khi đang ở
    -- màn danh sách, form Khai lúc ấy đang ẩn.
    -------------------------------------------*/
    _ensureDMDoiTacTS: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (me._dtNguonKhaiThac && me._dtNguonKhaiThac.length) { xong(); return; }
        if (me._dmDoiTacDangTai) { setTimeout(function () { me._ensureDMDoiTacTS(cb); }, 300); return; }
        me._dmDoiTacDangTai = true;
        edu.system.makeRequest({
            success: function (data) {
                me._dtNguonKhaiThac = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                me._dmDoiTacDangTai = false;
                xong();
            },
            error: function () {
                me._dtNguonKhaiThac = me._dtNguonKhaiThac || [];
                me._dmDoiTacDangTai = false;
                xong();
            },
            type: 'POST',
            contentType: true,
            action: me._ACTION_DM_DoiTacTS,
            data: {
                'action': me._ACTION_DM_DoiTacTS,
                'func': 'PKG_CORE_TS_HOSO.LayDS_TS_DoiTacTuyenSinh',
                'iM': edu.system.iM,
                'strTuKhoa': '',
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- ID đối tác → tên hiển thị. Danh mục để tên riêng ở cột TEN ("Anh", "Hùng")
    -- nên phải ghép Họ + Đệm + Tên, giống cách dropdown đang dựng.
    -------------------------------------------*/
    _tenDoiTacTS: function (id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!id) return '';
        var rows = me._dtNguonKhaiThac || [];
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i] || {};
            if (((r.ID || r.Id || r.id || '') + '') !== (id + '')) continue;
            var full = me._kqPick(r, ['HOTEN', 'HO_TEN', 'HOVATEN', 'FULL_NAME', 'TENDAYDU', 'TEN_HIENTHI', 'TEN_DONVI']);
            if (!full) {
                full = [me._kqPick(r, ['HO', 'LAST_NAME']),
                me._kqPick(r, ['HODEM', 'HO_DEM', 'TENDEM', 'MIDDLE_NAME']),
                me._kqPick(r, ['TEN', 'FIRST_NAME'])]
                    .filter(function (x) { return x; }).join(' ').replace(/\s+/g, ' ').trim();
            }
            return full || me._kqPick(r, ['MA', 'Ma']) || '';
        }
        return '';
    },

    _ensureNguonForRows: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (coMoi) { if (typeof cb === 'function') cb(coMoi); };
        if (!edu.util.checkValue(me._ACTION_LayDS_HoSo_DoiTacTS)) { xong(false); return; }

        me._nguonDangTai = me._nguonDangTai || {};
        var canIds = [];
        (rows || []).forEach(function (d) {
            var pid = me._kqPick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']);
            if (!pid) return;
            // Ưu tiên đọc trực tiếp từ bản ghi hồ sơ nếu view LayDS_HoSo_TS có trả
            var dtIdDirect = me._kqPick(d, ['TS_DOITACTUYENSINH_ID', 'DOITAC_ID', 'ID_DOITAC', 'TS_DOITAC_ID', 'DOI_TAC_ID']);
            var tenDirect = me._kqPick(d, ['TS_DOITACTUYENSINH_TEN', 'DOITAC_TEN'])
                || (dtIdDirect ? me._tenDoiTacTS(dtIdDirect) : '');
            if (tenDirect) {
                me._nguonMap[pid] = tenDirect;
                return;
            }
            if (!(pid in me._nguonMap) && !me._nguonDangTai[pid] && canIds.indexOf(pid) < 0) {
                canIds.push(pid);
            }
        });
        if (!canIds.length) { xong(false); return; }

        canIds.forEach(function (p) { me._nguonDangTai[p] = 1; });

        var ghi = function (r, fallbackPid) {
            var pid = me._pickLoose(r, ['CORE_PERSON_ID', 'COREPERSON_ID', 'PERSON_ID']) || fallbackPid;
            if (!pid) return;
            var dtId = me._pickLoose(r, ['TS_DOITACTUYENSINH_ID', 'DOITAC_ID', 'ID_DOITAC', 'TS_DOITAC_ID', 'DOI_TAC_ID']);
            var ten = me._kqPick(r, ['TS_DOITACTUYENSINH_TEN', 'DOITAC_TEN', 'HOTEN', 'TEN', 'FULL_NAME', 'TENDAYDU', 'TEN_DONVI'])
                || me._tenDoiTacTS(dtId);
            me._nguonMap[pid] = ten || '';
        };

        me._ensureDMDoiTacTS(function () {
            layTungNguoi();
        });

        function layTungNguoi() {
            var i = 0, dangChay = 0, MAX = 6, coMoi = false;
            var tiep = function () {
                while (dangChay < MAX && i < canIds.length) {
                    var pid = canIds[i++];
                    dangChay++;
                    (function (personId) {
                        me._queryHoSoDoiTacTS(personId, '', function (arr) {
                            delete me._nguonDangTai[personId];
                            if (arr && arr.length) {
                                arr.forEach(function (r) { ghi(r, personId); });
                                coMoi = true;
                            } else {
                                if (!(personId in me._nguonMap)) me._nguonMap[personId] = '';
                            }
                            dangChay--;
                            if (i < canIds.length) { tiep(); return; }
                            if (dangChay === 0) xong(coMoi);
                        });
                    })(pid);
                }
            };
            tiep();
        }
    },

    /*==========================================================================
    == NẠP CHI TIẾT CHO CHẾ ĐỘ "ĐẦY ĐỦ"
    == Bảng Đầy đủ có 50 cột nhưng view danh sách chỉ trả 20 → hơn nửa bảng trống.
    == Phần thiếu nằm ở các bảng khác, mỗi bảng một API riêng THEO TỪNG NGƯỜI:
    ==   LayTT_HoSo_TS            → ngày/nơi cấp CCCD, dân tộc, tôn giáo, quốc tịch,
    ==                              đối tượng TS/UT, khu vực UT, tổ hợp, điểm
    ==   Get_Person_Family        → 8 cột bố / mẹ
    ==   LayDS_PersonInvoiceInfo  → 5 cột xuất hóa đơn
    == → 3 request / dòng. Vì vậy:
    ==   - CHỈ chạy ở chế độ Đầy đủ, CHỈ cho các dòng đang hiển thị
    ==   - tối đa 6 request song song, cache theo người (lật trang lại không gọi lại)
    ==   - quá _CT_MAX_ROWS dòng/trang thì KHÔNG tự chạy, tránh bắn cả nghìn request
    == Muốn bỏ hẳn cách chữa cháy này thì BE phải mở rộng view LayDS_HoSo_TS.
    ==========================================================================*/
    _ctMap: {},            // COREPERSON_ID → gộp dữ liệu 3 API
    _CT_MAX_ROWS: 60,      // quá số này thì bắt bấm tay, không tự nạp

    /*------------------------------------------
    -- "id1,id2" → "Tên 1, Tên 2" theo danh mục đã nạp vào 1 dropdown.
    -------------------------------------------*/
    /*------------------------------------------
    -- Lát dữ liệu của đúng trang đang hiển thị.
    -------------------------------------------*/
    _kqTrangHienTai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var data = me._kqViewData || [];
        var size = me._kqPageSize || 50;
        var offset = (Math.max(1, me._kqPageIdx || 1) - 1) * size;
        return data.slice(offset, Math.min(offset + size, data.length));
    },

    _kqLookupNhieuId: function (ids, selectId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!ids) return '';
        return String(ids).split(/[,;]/).map(function (x) {
            x = x.trim();
            return x ? (me._kqLookupById(x, selectId) || '') : '';
        }).filter(function (x) { return x; }).join(', ');
    },

    _ensureChiTietForRows: function (rows, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (coMoi) { if (typeof cb === 'function') cb(coMoi); };

        var viec = [];
        (rows || []).forEach(function (d) {
            var pid = me._kqPick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']);
            var hid = me._kqPick(d, ['HOSO_ID', 'ID']);
            if (!pid || (pid in me._ctMap)) return;
            if (viec.some(function (x) { return x.pid === pid; })) return;
            viec.push({ pid: pid, hid: hid });
        });
        if (!viec.length) { xong(false); return; }
        if (viec.length > me._CT_MAX_ROWS) {
            $('#lblKQDK_CtTienTrinh').removeClass('d-none').html(
                '<a href="#" id="btnKQDK_NapChiTiet" style="color:#b45309;font-weight:600;">'
                + '<i class="fa-regular fa-cloud-arrow-down"></i> Nạp chi tiết ' + viec.length + ' dòng</a>');
            xong(false);
            return;
        }

        var tong = viec.length, doneNguoi = 0;
        var $tt = $('#lblKQDK_CtTienTrinh').removeClass('d-none');
        var veTienTrinh = function () {
            $tt.html('<i class="fa-solid fa-spinner fa-spin"></i> Đang nạp chi tiết ' + doneNguoi + '/' + tong);
        };
        veTienTrinh();

        // 1 người = 3 request; gom hết vào 1 hàng đợi chung, chạy 6 luồng
        var hangDoi = [];
        viec.forEach(function (v) {
            me._ctMap[v.pid] = {};   // đặt sớm để lượt vẽ sau không xếp hàng lại
            var oc = { con: 4 };
            var xongMot = function () {
                if (--oc.con === 0) { doneNguoi++; veTienTrinh(); }
            };
            hangDoi.push(function (tiep) { me._ctLayHoSo(v, function () { xongMot(); tiep(); }); });
            hangDoi.push(function (tiep) { me._ctLayGiaDinh(v, function () { xongMot(); tiep(); }); });
            hangDoi.push(function (tiep) { me._ctLayHoaDon(v, function () { xongMot(); tiep(); }); });
            hangDoi.push(function (tiep) { me._ctLayDiaChi(v, function () { xongMot(); tiep(); }); });
        });

        var i = 0, dangChay = 0, MAX = 6;
        var chay = function () {
            while (dangChay < MAX && i < hangDoi.length) {
                var f = hangDoi[i++];
                dangChay++;
                f(function () {
                    dangChay--;
                    if (i < hangDoi.length) { chay(); return; }
                    if (dangChay === 0) { $tt.addClass('d-none').html(''); xong(true); }
                });
            }
        };
        chay();
    },

    /*------------------------------------------
    -- Bảng tra ID → tên đơn vị hành chính. Dùng chung cache mà genDropTinhThanh
    -- đã dựng sẵn ở localStorage.strTinhThanh6 — mảng phẳng {ID, TEN, QUANHECHA_ID}
    -- gồm cả 3 cấp, nên tra tên KHÔNG tốn request nào. Cache trống thì mới gọi DM.
    -------------------------------------------*/
    _ensureTinhThanhMap: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (me._ttMap) { xong(); return; }
        var dung = function (arr) {
            me._ttMap = {};
            (arr || []).forEach(function (e) {
                if (e && e.ID) me._ttMap[e.ID] = e.TEN || '';
            });
            xong();
        };
        try {
            var s = localStorage.getItem('strTinhThanh6');
            if (s) { dung(JSON.parse(s)); return; }
        } catch (ex) { }
        edu.system.makeRequest({
            success: function (data) { dung((data && data.Success && data.Data) || []); },
            error: function () { dung([]); },
            type: 'GET',
            contentType: true,
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            data: { 'strMaBangDanhMuc': 'CHUN.DMTT', 'strTieuChiSapXep': '', 'dTrangThai': 1 },
            fakedb: []
        }, false, false, false, null);
    },

    _tenDiaDanh: function (id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!id) return '';
        return (me._ttMap || {})[id] || '';
    },

    /*------------------------------------------
    -- Chọn đúng dòng địa chỉ theo loại. Khớp Id danh mục trước (ADDRESS_TYPE_CODE
    -- lưu ID chứ không phải mã chữ), không trúng thì đoán theo tên loại kèm theo.
    -------------------------------------------*/
    _ctTimAddr: function (rows, kind) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!rows || !rows.length) return null;
        var typeId = me._addrTypeId(kind);
        var found = typeId && rows.filter(function (it) { return it.ADDRESS_TYPE_CODE === typeId; })[0];
        if (found) return found;
        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
        };
        var rx = (kind === 'NS') ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
        return rows.filter(function (it) {
            return rx.test(strip(it.ADDRESS_TYPE_CODE_NAME || it.ADDRESS_TYPE_NAME || ''));
        })[0] || null;
    },

    _ctLayDiaChi: function (v, done) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._ensureAddrTypeDM(function () {
            me._ensureTinhThanhMap(function () {
                me._getPersonAddressList(v.pid, function (rows) {
                    if (rows && rows.length) {
                        me._ctMap[v.pid].hk = me._ctTimAddr(rows, 'HK');
                        me._ctMap[v.pid].ns = me._ctTimAddr(rows, 'NS');
                    }
                    done();
                });
            });
        });
    },

    _ctLayHoSo: function (v, done) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!v.hid) { done(); return; }
        edu.system.makeRequest({
            success: function (r) {
                var d = (r && r.Success && r.Data) || null;
                var row = (d && d.length !== undefined) ? d[0] : d;
                if (row) me._ctMap[v.pid].hs = row;
                done();
            },
            error: function () { done(); },
            type: 'POST', contentType: true,
            action: me._ACTION_LayTT_HoSo,
            data: {
                'action': me._ACTION_LayTT_HoSo,
                'func': 'PKG_CORE_TS_HOSO.LayTT_HoSo_TS',
                'iM': edu.system.iM,
                'strHoSo_Id': v.hid,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'XEM'
            },
            fakedb: []
        }, false, false, false, null);
    },

    _ctLayGiaDinh: function (v, done) {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Phải có danh mục Quan hệ gia đình trước: _findFamRow khớp Bố/Mẹ theo Id
        // danh mục, thiếu nó thì chỉ còn cách đoán theo tên quan hệ.
        me._ensureFamTypeDM(function () {
            me._getFamilyList(v.pid, function (rows) {
                if (rows && rows.length) {
                    me._ctMap[v.pid].bo = me._findFamRow(rows, 'BO');
                    me._ctMap[v.pid].me = me._findFamRow(rows, 'ME');
                }
                done();
            });
        });
    },

    _ctLayHoaDon: function (v, done) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me._ACTION_Inv_LayDS)) { done(); return; }
        edu.system.makeRequest({
            success: function (data) {
                var arr = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                if (arr.length) me._ctMap[v.pid].hd = arr[0];
                done();
            },
            error: function () { done(); },
            type: 'POST', contentType: true,
            action: me._ACTION_Inv_LayDS,
            data: {
                'action': me._ACTION_Inv_LayDS,
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': v.pid,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    _kqRenderPage: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $('#tblKQDK_HoSo tbody');
        var data = me._kqViewData || [];
        var total = data.length;
        var $wrap = $('#kqdk_pagination_wrap');

        $tbody.html('');
        // Sang trang khác là danh sách tick trắng lại → ô tổng phải về hẳn trạng thái
        // chưa chọn (bỏ cả nửa-tick), không thì trang mới hiện tick tổng mà không dòng nào chọn.
        $('#chkKQDK_All').prop('checked', false).prop('indeterminate', false);

        if (!total) {
            $tbody.append('<tr><td class="td-center" colspan="53">Không có dữ liệu</td></tr>');
            $wrap.addClass('d-none');
            return;
        }
        $wrap.removeClass('d-none');

        var size = me._kqPageSize || 50;
        var pages = Math.max(1, Math.ceil(total / size));
        if (me._kqPageIdx > pages) me._kqPageIdx = pages;
        if (me._kqPageIdx < 1) me._kqPageIdx = 1;
        var pageIdx = me._kqPageIdx;
        var offset = (pageIdx - 1) * size;
        var end = Math.min(offset + size, total);

        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var pick = me._kqPick;
        var rows = '';
        for (var i = offset; i < end; i++) {
            var d = data[i];
            var id = pick(d, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']);
            var corePersonId = pick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'PERSON_ID', 'Person_Id']);
            var arr = me._kqRowToArray(d, i + 1);   // STT toàn cục
            var idAttr = esc(id);
            var corePersonIdAttr = esc(corePersonId);
            var tds = '';
            tds += '<td class="td-center kqdk-col1">' + arr[0] + '</td>';
            tds += '<td class="td-center kqdk-col2">' + arr[1] + '</td>';
            // Thao tác — chuyển lên vị trí 3 (sticky) để không bị khuất khi scroll ngang
            tds += '<td class="td-center kqdk-col3">'
                + '<a class="btn btn-sm btn-primary btnSuaHoSo" data-id="' + idAttr + '" title="Sửa hồ sơ" style="padding:4px 8px;margin-right:4px;"><i class="fa fa-pencil"></i></a>'
                + '<a class="btn btn-sm btn-danger btnXoaHoSo" data-id="' + idAttr + '" title="Xóa hồ sơ" style="padding:4px 8px;"><i class="fa fa-trash"></i></a>'
                + '</td>';
            if (me._kqTableMode === 'gon') {
                me._KQ_COT_GON.forEach(function (c) {
                    var v = c.get ? c.get(d) : arr[c.i];
                    tds += '<td class="' + c.css + '">' + esc(v) + '</td>';
                });
            } else {
                for (var j = 2; j < arr.length; j++) {
                    tds += '<td>' + esc(arr[j]) + '</td>';
                }
            }
            rows += '<tr data-id="' + idAttr + '" data-kq-idx="' + i + '" data-core-person-id="' + corePersonIdAttr + '">' + tds + '</tr>';
        }
        $tbody.append(rows);

        // Update pagination controls
        $('#lblKQDK_PageTotal').text(pages);
        $('#lblKQDK_PageRange').text((offset + 1) + '-' + end);
        $('#lblKQDK_PageTotalRecords').text(total);
        $('#txtKQDK_PageJump').val(pageIdx).attr('max', pages);
        $('#btnKQDK_PageFirst, #btnKQDK_PagePrev').prop('disabled', pageIdx <= 1);
        $('#btnKQDK_PageNext, #btnKQDK_PageLast').prop('disabled', pageIdx >= pages);

        // Sync width thanh scroll-x giả với bảng (defer để chờ browser layout xong)
        setTimeout(function () { me._kqSyncScrollTop(); }, 0);

        // Lấy SĐT/Email cho đúng các dòng vừa vẽ, xong mới vẽ lại 1 lần.
        // Lần vẽ lại đó mọi id đã nằm trong cache → coMoi = false → dừng, không lặp vô tận.
        me._ensureContactForRows(data.slice(offset, end), function (coMoi) {
            if (coMoi) me._kqRenderPage();
        });
        // Lớp quản lý cho đúng các dòng vừa vẽ — cũng chỉ chạy 1 vòng rồi dừng
        // (lượt vẽ lại thấy mọi id đã có cache → coMoi = false).
        me._ensureLopForRows(data.slice(offset, end), function (coMoi) {
            if (coMoi) me._kqRenderPage();
        });
        // Nguồn khai thác — cùng cơ chế cache + vẽ lại đúng 1 lần
        me._ensureNguonForRows(data.slice(offset, end), function (coMoi) {
            if (coMoi) me._kqRenderPage();
        });
        // Chi tiết cho chế độ Đầy đủ (3 request/dòng) — chế độ Gọn không cần nên không gọi
        if (me._kqTableMode === 'full') {
            me._ensureChiTietForRows(data.slice(offset, end), function (coMoi) {
                if (coMoi) me._kqRenderPage();
            });
        }
    },

    /*------------------------------------------
    -- Map 1 record → array 51 phần tử theo thứ tự cột bảng.
    -- Field name pattern: {MODULE}_{FIELD} viết hoa (COREPERSON_*, PERSONCONTACT_*, HOSO_*, XETTUYEN_*, ...)
    -- Các field API chưa trả về (VD Dân tộc, Hộ khẩu, Bố/Mẹ, Trúng tuyển, Hóa đơn) → hiển thị rỗng
    -- → cần backend mở rộng view join nếu muốn đầy đủ 51 cột.
    -------------------------------------------*/
    _kqRowToArray: function (d, stt) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var pick = me._kqPick;
        // Dữ liệu nạp bổ sung cho chế độ Đầy đủ (xem _ensureChiTietForRows).
        // ct.hs = LayTT_HoSo_TS | ct.bo / ct.me = Get_Person_Family | ct.hd = hóa đơn
        var ct = (me._ctMap || {})[pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])] || {};
        var hs = ct.hs || {};
        var hd = ct.hd || {};
        // Lấy từ view danh sách trước, không có mới lấy từ bản chi tiết
        var bu = function (v, k) { return v || (hs[k] == null ? '' : hs[k]); };
        var fam = function (r, names) { return r ? (me._pickLoose(r, names) || '') : ''; };
        // Địa chỉ: bảng PERSON_ADDRESS chỉ lưu ID đơn vị hành chính → đổi ra tên.
        // Hệ 2 cấp bỏ quận/huyện nên tên xã có thể đang nằm ở DISTRICT_ID
        // (ví dụ "Xã Khánh Yên" hiện ở ô Quận/Huyện) → thiếu WARD thì lấy DISTRICT.
        var dcTinh = function (r) { return r ? me._tenDiaDanh(r.PROVINCE_ID) : ''; };
        var dcXa = function (r) {
            if (!r) return '';
            return me._tenDiaDanh(r.WARD_ID) || me._tenDiaDanh(r.DISTRICT_ID) || '';
        };
        var dcSoNha = function (r) { return r ? (r.ADDRESS_LINE1 || '') : ''; };
        // Format ngày sinh ISO "2026-07-08" → "08/07/2026"
        var ngaySinh = pick(d, ['COREPERSON_NGAYSINH', 'CorePerson_NgaySinh', 'NGAY_SINH', 'NGAYSINH']);
        if (ngaySinh && /^\d{4}-\d{2}-\d{2}/.test(ngaySinh)) {
            var m = ngaySinh.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) ngaySinh = m[3] + '/' + m[2] + '/' + m[1];
        }
        // Giới tính: ưu tiên TEN từ view FULL, fallback lookup từ ID qua DM đã load
        var giTen = pick(d, ['COREPERSON_GIOITINH_TEN', 'GIOITINH_TEN', 'CorePerson_GioiTinh_Ten']);
        if (!giTen) {
            var giId = pick(d, ['COREPERSON_GIOITINH_ID', 'GIOITINH_ID']);
            giTen = me._kqLookupById(giId, 'ddlKQ_GioiTinh');
        }
        return [
            stt,
            '<input type="checkbox" class="kqdk-sel">',
            // Basic
            pick(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen', 'HOTEN', 'FULL_NAME']),
            ngaySinh,
            giTen,
            // Dân tộc / Tôn giáo: view chưa trả tên → fallback lấy ID từ PERSON_PROFILE
            // (đã nạp sẵn ở _ensureProfileMapForList) rồi tra tên qua DM đã load.
            (function () {
                var t = pick(d, ['PERSONPROFILE_DANTOC_TEN', 'DANTOC_TEN', 'PersonProfile_DanToc_Ten']);
                if (t) return t;
                var pf = (me._kqProfileMap || {})[pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])];
                return (pf ? me._kqLookupById(pf.ETHNICITY_ID, 'ddlKQ_DanToc') : '')
                    || me._kqLookupById(hs.PERSONPROFILE_DANTOC_ID, 'ddlKQ_DanToc');
            })(),
            (function () {
                var t = pick(d, ['PERSONPROFILE_TONGIAO_TEN', 'TONGIAO_TEN', 'PersonProfile_TonGiao_Ten']);
                if (t) return t;
                var pf = (me._kqProfileMap || {})[pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])];
                return (pf ? me._kqLookupById(pf.RELIGION_ID, 'ddlKQ_TonGiao') : '')
                    || me._kqLookupById(hs.PERSONPROFILE_TONGIAO_ID, 'ddlKQ_TonGiao');
            })(),
            pick(d, ['PERSONPROFILE_QUOCTICH_TEN', 'QUOCTICH_TEN', 'PersonProfile_QuocTich_Ten'])
            || me._kqLookupById(hs.PERSONPROFILE_QUOCTICH_ID, 'ddlKQ_QuocTich'),
            // Điện thoại / Email: view thường không trả, bản FULL có thể đặt tên khác →
            // thử alias rồi mới quét mờ. Quét mờ phải LOẠI TRỪ BO_/ME_/BUYER_ để không
            // lấy nhầm SĐT của bố mẹ hay số trên hóa đơn vào cột của thí sinh.
            (pick(d, ['PERSONCONTACT_DIENTHOAI', 'PersonContact_DienThoai', 'DIENTHOAI',
                'SODIENTHOAI', 'SO_DIEN_THOAI', 'SDT', 'PHONE', 'PHONE_NUMBER', 'MOBILE'])
                || me._kqPickFuzzy(d, /^(?!.*(BO_|ME_|FAM|PARENT|INVOICE|BUYER|EMERGENCY)).*(DIENTHOAI|DIEN_THOAI|SDT|PHONE|MOBILE).*$/i)
                || (me._contactMap[pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])] || {}).sdt || ''),
            (pick(d, ['PERSONCONTACT_EMAIL', 'PersonContact_Email', 'EMAIL',
                'CONTACT_EMAIL', 'EMAIL_LIENHE', 'MAIL'])
                || me._kqPickFuzzy(d, /^(?!.*(BO_|ME_|FAM|PARENT|INVOICE|BUYER)).*(EMAIL|MAIL).*$/i)
                || (me._contactMap[pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])] || {}).email || ''),
            // Nơi sinh — view không có; ghép từ PERSON_ADDRESS loại "Nơi sinh" (ct.ns)
            pick(d, ['PERSONADDR_NOISINH', 'PersonAddr_NoiSinh', 'NOISINH'])
            || [dcSoNha(ct.ns), dcXa(ct.ns), dcTinh(ct.ns)]
                .filter(function (x) { return x; }).join(', '),
            // CCCD — thử alias biết trước, fallback fuzzy quét mọi key chứa "CCCD"/"CMND"
            (pick(d, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD', 'SO_CCCD', 'CCCD', 'CCCD_SO', 'SoCCCD', 'strPersonIden_SoCCCD', 'SOCMND', 'SO_CMND', 'CMND'])
                || me._kqPickFuzzy(d, /^(?!.*NGAY)(?!.*NOI)(?!.*NGAY_CAP)(?!.*NOI_CAP).*(CCCD|CMND).*$/i)),
            bu(pick(d, ['PERSONIDEN_NGAYCAP', 'PersonIden_NgayCap', 'NGAYCAPCCCD', 'NGAY_CAP', 'NGAYCAP', 'NgayCap', 'NgayCapCCCD', 'strPersonIden_NgayCap'])
                || me._kqPickFuzzy(d, /(NGAY_?CAP|NGAYCAP)/i), 'PERSONIDEN_NGAYCAP'),
            bu(pick(d, ['PERSONIDEN_NOICAP', 'PersonIden_NoiCap', 'NOICAPCCCD', 'NOI_CAP', 'NOICAP', 'NoiCap', 'NoiCapCCCD', 'strPersonIden_NoiCap'])
                || me._kqPickFuzzy(d, /(NOI_?CAP|NOICAP)/i), 'PERSONIDEN_NOICAP'),
            // Hộ khẩu — view danh sách không có, lấy từ PERSON_ADDRESS (ct.hk)
            pick(d, ['PERSONADDR_HK_TINH_TEN', 'HK_TINH_TEN', 'PersonAddr_HK_Tinh_Ten']) || dcTinh(ct.hk),
            pick(d, ['PERSONADDR_HK_XA_TEN', 'HK_XA_TEN', 'PersonAddr_HK_Xa_Ten']) || dcXa(ct.hk),
            pick(d, ['PERSONADDR_HK_SONHA', 'HK_SONHA', 'PersonAddr_HK_SoNha']) || dcSoNha(ct.hk),
            // Xét tuyển
            pick(d, ['HOSO_KH_DOT_PT_TEN', 'PHUONGTHUC_TEN', 'HoSo_KH_Dot_PT_Ten']),
            pick(d, ['HOSO_DOITUONG_TS_TEN', 'DOITUONG_TS_TEN'])
            || me._kqLookupById(hs.HOSO_DOITUONG_TS_ID, 'ddlKQ_DoiTuongTS'),
            pick(d, ['HOSO_DOITUONG_UT_TEN', 'DOITUONG_UT_TEN'])
            || me._kqLookupNhieuId(hs.HOSO_DOITUONG_UT_IDS, 'ddlKQ_DoiTuongUT'),
            pick(d, ['HOSO_KHUVUC_UT_TEN', 'KHUVUC_UT_TEN'])
            || me._kqLookupById(hs.HOSO_KHUVUC_UT_ID, 'ddlKQ_KhuVucUT'),
            pick(d, ['PERSONEDU_TINH_ID', 'MATINH12']),
            pick(d, ['PERSONEDU_MATRUONG', 'MATRUONG12']),
            pick(d, ['PERSONEDU_TRUONGMATEN', 'TENTRUONG12']),
            pick(d, ['PERSONEDU_HOCLUC', 'HOCLUC12', 'HOC_LUC']),
            pick(d, ['PERSONEDU_HANHKIEM', 'HANHKIEM12', 'HANH_KIEM']),
            bu(pick(d, ['XETTUYEN_TOHOPMON_CODE', 'XetTuyen_TohopMon_Code', 'TOHOP_MA']), 'XETTUYEN_TOHOPMON_CODE'),
            pick(d, ['XETTUYEN_DIEM_MON1', 'DIEM_MON1']),
            pick(d, ['XETTUYEN_DIEM_MON2', 'DIEM_MON2']),
            pick(d, ['XETTUYEN_DIEM_MON3', 'DIEM_MON3']),
            bu(pick(d, ['XETTUYEN_DIEMUUTIEN', 'DIEM_UT', 'XetTuyen_DiemUuTien']), 'XETTUYEN_DIEMUUTIEN'),
            bu(pick(d, ['XETTUYEN_DIEMTONGXT', 'XetTuyen_DiemTongXT', 'TONG_DIEM_XT']), 'XETTUYEN_DIEMTONGXT'),
            // Bố — view danh sách không có, lấy từ PERSON_FAMILY (ct.bo)
            pick(d, ['PERSONFAM_BO_HOTEN', 'BO_HOTEN']) || fam(ct.bo, ['FULL_NAME', 'HOTEN']),
            pick(d, ['PERSONFAM_BO_NAMSINH', 'BO_NAMSINH']) || fam(ct.bo, ['BIRTH_YEAR', 'NAMSINH']),
            pick(d, ['PERSONFAM_BO_NOIO', 'BO_NOIO']) || fam(ct.bo, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']),
            pick(d, ['PERSONFAM_BO_SDT', 'BO_SDT']) || fam(ct.bo, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']),
            // Mẹ
            pick(d, ['PERSONFAM_ME_HOTEN', 'ME_HOTEN']) || fam(ct.me, ['FULL_NAME', 'HOTEN']),
            pick(d, ['PERSONFAM_ME_NAMSINH', 'ME_NAMSINH']) || fam(ct.me, ['BIRTH_YEAR', 'NAMSINH']),
            pick(d, ['PERSONFAM_ME_NOIO', 'ME_NOIO']) || fam(ct.me, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']),
            pick(d, ['PERSONFAM_ME_SDT', 'ME_SDT']) || fam(ct.me, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']),
            // Trúng tuyển
            pick(d, ['KETQUA_QUYETDINH_MA', 'SO_QD_TT', 'SoQuyetDinh']),
            pick(d, ['KETQUA_NGAYBANHANH', 'NGAY_QD_TT', 'HOSO_NGAYKETQUA']),
            pick(d, ['INTAKE_KHOA_TEN', 'KHOA_DT', 'KhoaDT']),
            (function () {
                // Mã ngành: response không có field NGANH → lookup qua NGUYENVONG_DAURA_ID
                var direct = pick(d, ['INTAKE_NGANH_MA', 'MA_NGANH', 'MaNganh']);
                if (direct) return direct;
                var drId = pick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']);
                var drMap = me._kqDauRaMap || {};
                var dr = drId ? drMap[drId] : null;
                if (!dr) return '';
                var nganhMap = me._nganhMaLookup || {};
                var nganhMapTen = me._nganhMaLookupByTen || {};
                return nganhMap[dr.nganhId]
                    || (dr.nganhTen ? nganhMapTen[String(dr.nganhTen).trim().toLowerCase()] : '')
                    || dr.nganhTen
                    || '';
            })(),
            // Mã lớp QL — view không có cột mã, phải dò + tra map ID (xem _kqLopQL)
            me._kqLopQL(d),
            pick(d, ['COREPERSON_MASO', 'MA_SV', 'MASV', 'MASO']),
            // Hóa đơn — view danh sách không có, lấy từ PERSON_INVOICE_INFO (ct.hd)
            pick(d, ['PERSONINVOICE_TYPELOAI_TEN', 'HD_DOITUONG_TEN']) || (hd.BUYER_TYPE_LOAI || ''),
            pick(d, ['PERSONINVOICE_TENDONVI', 'HD_TEN_DONVI']) || (hd.BUYER_NAME || ''),
            pick(d, ['PERSONINVOICE_MAQHNS', 'HD_MA_QHNS']) || (hd.BUYER_BUDGET_MAQHNS || ''),
            pick(d, ['PERSONINVOICE_DIACHI', 'HD_DIACHI']) || (hd.BUYER_ADDR_DIACHI || ''),
            pick(d, ['PERSONINVOICE_MST', 'HD_MST', 'MST']) || (hd.BUYER_TAX_MST || ''),
            // [51] Nguồn khai thác — không có trong view, lấy từ bảng ghi-nhận đối tác
            // (xem _ensureNguonForRows). PHẢI để CUỐI mảng: chèn vào giữa là lệch hết
            // chỉ số của _KQ_COT_GON và mã cột bộ lọc.
            (function () {
                var pid = pick(d, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']);
                var dtId = pick(d, ['TS_DOITACTUYENSINH_ID', 'DOITAC_ID', 'ID_DOITAC', 'TS_DOITAC_ID', 'DOI_TAC_ID']);
                var tenDirect = pick(d, ['TS_DOITACTUYENSINH_TEN', 'DOITAC_TEN']) || (dtId ? me._tenDoiTacTS(dtId) : '');
                return (me._nguonMap || {})[pid] || tenDirect || '';
            })(),

            /* ===== [52..68] BỔ SUNG cho file xuất (khách báo 29/09/2026 "xuất ra thiếu
               rất nhiều thông tin"). PHẢI THÊM Ở CUỐI: _KQ_COT_GON và mã cột bộ lọc
               tham chiếu theo CHỈ SỐ, chèn vào giữa là lệch hết bảng.
               Kế hoạch / đợt / hệ / ngành suy từ nguyện vọng đầu ra, vì response hồ sơ
               không có mấy khóa đó (xem _ensureKQDK_DauRaMap). ===== */
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                var tenKH = dr.khTen || '';
                if (!tenKH) {
                    // Danh sách mở theo 1 kế hoạch → lấy tên kế hoạch đang mở
                    (me.dtKeHoachTuyenSinh || []).forEach(function (k) {
                        if (String(k.ID || k.Id || '') === String(me.strKeHoachTuyenSinh_Id)) {
                            tenKH = k.TEN || k.Ten || '';
                        }
                    });
                }
                return tenKH;
            })(),
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                return dr.dotTen || '';
            })(),
            pick(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo', 'MA_HOSO']),
            pick(d, ['HOSO_SOBAODANH', 'HoSo_SoBaoDanh', 'SOBAODANH']),
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                return dr.ten ? (dr.ma ? (dr.ten + ' (' + dr.ma + ')') : dr.ten) : '';
            })(),
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                return dr.heTen || '';
            })(),
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                return dr.ctTen || '';
            })(),
            (function () {
                var dr = (me._kqDauRaMap || {})[pick(d, ['NGUYENVONG_DAURA_ID'])] || {};
                return dr.nganhTen || '';
            })(),
            // Mã trạng thái đổi sang chữ đọc được; mã lạ thì giữ nguyên, không đoán
            me._tcTenTrangThai(pick(d, ['HOSO_STATUS'])),
            me._tcTenTrangThai(pick(d, ['HOSO_KETQUA'])),
            pick(d, ['HOSO_NGAYNOP']),
            pick(d, ['HOSO_NGAYKETQUA']),
            bu(pick(d, ['INTAKE_NGAYTIEPNHAN']), 'INTAKE_NGAYTIEPNHAN'),
            (String(pick(d, ['INTAKE_ISSTUDYCREATED'])) === '1' ? 'Có' : ''),
            // 3 cột hóa đơn còn thiếu (chỉ có dữ liệu ở chế độ Đầy đủ, như 5 cột hóa đơn trên)
            me._pickLoose(hd, ['BUYER_NAME_TENNM', 'BUYER_NAME']) || '',
            me._pickLoose(hd, ['BUYER_EMAIL']) || '',
            me._pickLoose(hd, ['BUYER_PHONE_SDT', 'BUYER_PHONE']) || ''
        ];
    },

    /*------------------------------------------
    -- Filter local: search trên dtKQDK_HoSo (không call API lại)
    -- Trường tìm: Họ tên, SĐT, Email, CCCD, Mã HS, SBD (chuỗi haystack)
    -------------------------------------------*/
    /*==========================================================================
    == BỘ LỌC KIỂU EXCEL CHO BẢNG KẾT QUẢ ĐĂNG KÝ (yêu cầu 14/09/2026)
    == Bấm phễu ở tiêu đề cột → popup liệt kê các GIÁ TRỊ ĐANG CÓ của cột đó
    == kèm số dòng, tick chọn cái nào thì bảng còn lại đúng cái đó. Lọc nhiều
    == cột cùng lúc = giao nhau (AND), và vẫn cộng dồn với ô "Tìm nhanh".
    == Sắp xếp tăng/giảm nằm luôn trong popup.
    ==
    == Toàn bộ chạy trên dữ liệu đã tải sẵn (dtKQDK_HoSo) — KHÔNG gọi lại API.
    == Chỉ bật ở chế độ "Gọn": chế độ "Đầy đủ" 51 cột mà cắm phễu từng cột thì
    == tiêu đề vỡ và cũng không ai lọc kiểu đó.
    ==========================================================================*/
    _kqFilters: {},    // key cột → mảng giá trị được chọn
    _kqSort: null,     // { key, dir: 'asc' | 'desc' }

    /*------------------------------------------
    -- Giá trị HIỂN THỊ của 1 cột cho 1 bản ghi — phải đúng cái người dùng nhìn
    -- thấy trên bảng, không thì lọc một đằng bảng hiện một nẻo.
    -------------------------------------------*/
    _kqGiaTriCot: function (d, cot, arr) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var v = cot.get ? cot.get(d) : (arr || me._kqRowToArray(d, 0))[cot.i];
        return (v == null ? '' : String(v)).trim();
    },

    _kqCotFull: {},    // key → { key, i, ten } — dựng khi vào chế độ Đầy đủ

    _kqTimCot: function (key) {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Ưu tiên định nghĩa cột Gọn: có cột tự tính giá trị riêng (Ngành)
        var c = me._KQ_COT_GON.filter(function (x) { return x.key === key; })[0];
        if (c) return c;
        c = (me._kqCotFull || {})[key];
        if (c) return c;
        // Lọc đặt ở chế độ Đầy đủ, sau đó đổi chế độ nên chưa dựng lại bảng cột
        var m = /^i(\d+)$/.exec(key || '');
        return m ? { key: key, i: +m[1], ten: 'Cột ' + m[1] } : null;
    },

    /*------------------------------------------
    -- Áp TẤT CẢ điều kiện: ô tìm nhanh + lọc từng cột + sắp xếp → _kqViewData.
    -- Một chỗ duy nhất quyết định bảng hiện gì, để không lệch giữa các đường vào.
    -------------------------------------------*/
    _kqApplyAllFilters: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var pick = me._kqPick;
        var rows = (me.dtKQDK_HoSo || []).slice();

        // 1) Ô tìm nhanh
        var kw = ($('#txtKQDK_Search').val() || '').toLowerCase().trim();
        if (kw) {
            rows = rows.filter(function (d) {
                return [
                    pick(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen', 'HOTEN']),
                    pick(d, ['PERSONCONTACT_DIENTHOAI', 'PersonContact_DienThoai', 'DIENTHOAI']),
                    pick(d, ['PERSONCONTACT_EMAIL', 'EMAIL']),
                    pick(d, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD']),
                    pick(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo', 'MA_HOSO']),
                    pick(d, ['HOSO_SOBAODANH', 'HoSo_SoBaoDanh', 'SBD']),
                    pick(d, ['COREPERSON_MASO', 'MA_SV', 'MASO'])
                ].join('|').toLowerCase().indexOf(kw) !== -1;
            });
        }

        // 2) Lọc theo từng cột (AND). Tính arr 1 lần / bản ghi cho đỡ nặng.
        var cacKey = Object.keys(me._kqFilters || {});
        if (cacKey.length) {
            var cacCot = cacKey.map(function (k) {
                return { key: k, cot: me._kqTimCot(k), chon: me._kqFilters[k] };
            }).filter(function (x) { return x.cot && x.chon && x.chon.length; });

            rows = rows.filter(function (d) {
                var arr = me._kqRowToArray(d, 0);
                for (var i = 0; i < cacCot.length; i++) {
                    var v = me._kqGiaTriCot(d, cacCot[i].cot, arr);
                    if (cacCot[i].chon.indexOf(v) < 0) return false;
                }
                return true;
            });
        }

        // 3) Sắp xếp
        if (me._kqSort && me._kqSort.key) {
            var cotSort = me._kqTimCot(me._kqSort.key);
            if (cotSort) {
                var huong = me._kqSort.dir === 'desc' ? -1 : 1;
                rows.sort(function (a, b) {
                    var va = me._kqGiaTriCot(a, cotSort);
                    var vb = me._kqGiaTriCot(b, cotSort);
                    // Ô trống luôn xuống cuối dù sắp xếp chiều nào
                    if (!va && !vb) return 0;
                    if (!va) return 1;
                    if (!vb) return -1;
                    // dd/mm/yyyy → so theo mốc thời gian, không so chuỗi
                    var da = me._kqSoSanhNgay(va), db = me._kqSoSanhNgay(vb);
                    if (da !== null && db !== null) return (da - db) * huong;
                    var na = parseFloat(va.replace(/[^\d.-]/g, '')), nb = parseFloat(vb.replace(/[^\d.-]/g, ''));
                    if (!isNaN(na) && !isNaN(nb) && /^[\d\s.,-]+$/.test(va) && /^[\d\s.,-]+$/.test(vb)) {
                        return (na - nb) * huong;
                    }
                    return va.localeCompare(vb, 'vi') * huong;
                });
            }
        } else {
            /* MẶC ĐỊNH (khi user chưa bấm sort cột): Hồ sơ mới nhập / mới nhất
               luôn được đưa lên ĐẦU BẢNG (DESC). Tránh trường hợp vừa nhập xong
               hôm nay lại bị tống xuống cuối danh sách (sang trang 2/3). */
            rows.sort(function (a, b) {
                var ta = me._kqGetRowTime(a);
                var tb = me._kqGetRowTime(b);
                if (ta !== tb) return tb - ta; // Timestamp lớn hơn (mới hơn) đứng trước
                return 0;
            });
        }

        me._kqVeChipLoc();
        me.renderKQDK_Table(rows);
    },

    /*------------------------------------------
    -- "14/09/2026 15:03:22" / "01/08/2007" / "2026-10-01T09:34:24" → số timestamp để so sánh.
    -- Không phải ngày → null.
    -------------------------------------------*/
    _kqSoSanhNgay: function (s) {
        if (!s) return null;
        if (s instanceof Date) return s.getTime();
        var str = String(s).trim();
        // dd/mm/yyyy hh:mm:ss hoặc dd/mm/yyyy
        var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (m) {
            return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime();
        }
        // yyyy-mm-dd hh:mm:ss hoặc ISO
        var mIso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (mIso) {
            return new Date(+mIso[1], +mIso[2] - 1, +mIso[3], +(mIso[4] || 0), +(mIso[5] || 0), +(mIso[6] || 0)).getTime();
        }
        var dt = Date.parse(str);
        if (!isNaN(dt)) return dt;
        return null;
    },

    /*------------------------------------------
    -- Lấy timestamp đại diện thời gian tạo / nộp / ban hành của 1 dòng hồ sơ
    -- để làm tiêu chí sắp xếp mặc định (mới nhất lên đầu bảng).
    -------------------------------------------*/
    _kqGetRowTime: function (d) {
        if (!d) return 0;
        var me = main_doc.KeHoachTuyenSinhNew;
        var pick = me._kqPick;
        var cacNgay = [
            pick(d, ['HOSO_NGAYTAO', 'NGAY_TAO', 'NGAYTAO', 'NgayTao', 'NgayTao_dd_mm_yyyy_hhmmss']),
            pick(d, ['KETQUA_NGAYBANHANH', 'NGAY_QD_TT', 'HOSO_NGAYKETQUA']),
            pick(d, ['HOSO_NGAYNOP', 'NGAY_NOP', 'NGAYNOP', 'NGAY_DK', 'NGAYDK']),
            pick(d, ['HOSO_NGAYCAPNHAT', 'NGAY_CAPNHAT', 'NGAYCAPNHAT']),
            pick(d, ['INTAKE_NGAYTIEPNHAN']),
            me._kqPickFuzzy(d, /(NGAY_?TAO|NGAY_?NOP|NGAY_?DK|NGAY_?BANHANH|NGAY_?QD|CREATED)/i)
        ];
        for (var i = 0; i < cacNgay.length; i++) {
            var val = cacNgay[i];
            if (val) {
                var t = me._kqSoSanhNgay(val);
                if (t !== null && !isNaN(t) && t > 0) return t;
            }
        }
        return 0;
    },

    /*------------------------------------------
    -- Thanh chip: đang lọc cột nào, bấm x để bỏ lọc cột đó.
    -------------------------------------------*/
    _kqVeChipLoc: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $wrap = $('#kqdk_chip_loc');
        if (!$wrap.length) return;
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var html = '';
        Object.keys(me._kqFilters || {}).forEach(function (k) {
            var cot = me._kqTimCot(k);
            var chon = me._kqFilters[k] || [];
            if (!cot || !chon.length) return;
            var mo = chon.length <= 2
                ? chon.map(function (v) { return v || '(trống)'; }).join(', ')
                : chon.length + ' giá trị';
            html += '<span class="kqdk-chip">'
                + '<b>' + esc(cot.ten) + ':</b> ' + esc(mo)
                + '<i class="fa-solid fa-xmark kqdk-chip-x" data-key="' + k + '" title="Bỏ lọc cột này"></i>'
                + '</span>';
        });
        if (me._kqSort && me._kqSort.key) {
            var cs = me._kqTimCot(me._kqSort.key);
            if (cs) {
                html += '<span class="kqdk-chip kqdk-chip-sort">'
                    + '<i class="fa-solid fa-arrow-' + (me._kqSort.dir === 'asc' ? 'down-a-z' : 'up-z-a') + '"></i> '
                    + esc(cs.ten)
                    + '<i class="fa-solid fa-xmark kqdk-chip-x" data-key="__sort" title="Bỏ sắp xếp"></i>'
                    + '</span>';
            }
        }
        if (html) {
            $wrap.html(html + '<a href="#" id="btnKQDK_XoaHetLoc" class="kqdk-chip-clear">'
                + '<i class="fa-regular fa-trash-can"></i> Xóa hết lọc</a>').removeClass('d-none');
        } else {
            $wrap.html('').addClass('d-none');
        }
    },

    /*------------------------------------------
    -- Mở popup lọc của 1 cột. Danh sách giá trị lấy từ dữ liệu ĐÃ lọc bởi các
    -- cột KHÁC (giống Excel: lọc Ngành rồi mở Lớp thì chỉ còn lớp của ngành đó).
    -------------------------------------------*/
    _kqMoFilter: function (key, elAnchor) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var cot = me._kqTimCot(key);
        if (!cot) return;
        me._kqDongFilter();

        // Dữ liệu nền: áp ô tìm nhanh + lọc của các cột khác (bỏ qua cột đang mở)
        var pick = me._kqPick;
        var rows = (me.dtKQDK_HoSo || []).slice();
        var kw = ($('#txtKQDK_Search').val() || '').toLowerCase().trim();
        if (kw) {
            rows = rows.filter(function (d) {
                return [
                    pick(d, ['COREPERSON_HOTEN', 'HOTEN']), pick(d, ['PERSONCONTACT_DIENTHOAI', 'DIENTHOAI']),
                    pick(d, ['PERSONCONTACT_EMAIL', 'EMAIL']), pick(d, ['PERSONIDEN_SOCCCD', 'SOCCCD']),
                    pick(d, ['HOSO_MAHOSO']), pick(d, ['HOSO_SOBAODANH']), pick(d, ['COREPERSON_MASO'])
                ].join('|').toLowerCase().indexOf(kw) !== -1;
            });
        }
        Object.keys(me._kqFilters || {}).forEach(function (k) {
            if (k === key) return;
            var c = me._kqTimCot(k), chon = me._kqFilters[k];
            if (!c || !chon || !chon.length) return;
            rows = rows.filter(function (d) { return chon.indexOf(me._kqGiaTriCot(d, c)) >= 0; });
        });

        // Gom giá trị duy nhất + đếm số dòng
        var dem = {};
        rows.forEach(function (d) {
            var v = me._kqGiaTriCot(d, cot);
            dem[v] = (dem[v] || 0) + 1;
        });
        var dsGiaTri = Object.keys(dem).sort(function (a, b) {
            if (!a) return 1;
            if (!b) return -1;
            var da = me._kqSoSanhNgay(a), db = me._kqSoSanhNgay(b);
            if (da !== null && db !== null) return da - db;
            return a.localeCompare(b, 'vi');
        });

        var dangChon = me._kqFilters[key] || null;   // null = chưa lọc = chọn hết
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        // .text().html() KHÔNG escape dấu nháy kép → tên chứa " sẽ phá vỡ attribute,
        // nên giá trị nhét vào data-v phải escape riêng.
        var escAttr = function (s) { return esc(s).replace(/"/g, '&quot;'); };
        var items = dsGiaTri.map(function (v, idx) {
            var tick = (!dangChon || dangChon.indexOf(v) >= 0) ? 'checked' : '';
            return '<label class="kqdk-f-item" data-v="' + escAttr(v) + '">'
                + '<input type="checkbox" class="kqdk-f-cb" data-idx="' + idx + '" ' + tick + '>'
                + '<span class="kqdk-f-txt">' + (v ? esc(v) : '<i style="color:#94a3b8">(trống)</i>') + '</span>'
                + '<span class="kqdk-f-dem">' + dem[v] + '</span>'
                + '</label>';
        }).join('');

        var $pop = $('<div id="kqdk_filter_pop" class="kqdk-fpop">'
            + '<div class="kqdk-f-head">' + esc(cot.ten) + '</div>'
            + '<div class="kqdk-f-sort">'
            + '<button type="button" class="kqdk-f-sbtn" data-dir="asc"><i class="fa-solid fa-arrow-down-a-z"></i> Tăng dần</button>'
            + '<button type="button" class="kqdk-f-sbtn" data-dir="desc"><i class="fa-solid fa-arrow-up-z-a"></i> Giảm dần</button>'
            + '</div>'
            + '<div class="kqdk-f-search"><i class="fa-light fa-magnifying-glass"></i>'
            + '<input type="text" id="kqdk_f_tim" placeholder="Tìm trong danh sách..."></div>'
            + '<label class="kqdk-f-item kqdk-f-all"><input type="checkbox" id="kqdk_f_all" checked>'
            + '<span class="kqdk-f-txt"><b>(Chọn tất cả)</b></span>'
            + '<span class="kqdk-f-dem">' + dsGiaTri.length + '</span></label>'
            + '<div class="kqdk-f-list">' + (items || '<div class="kqdk-f-empty">Không có dữ liệu</div>') + '</div>'
            + '<div class="kqdk-f-foot">'
            + '<a href="#" class="kqdk-f-clear">Bỏ lọc cột này</a>'
            + '<div><button type="button" class="kqdk-f-btn kqdk-f-cancel">Hủy</button>'
            + '<button type="button" class="kqdk-f-btn kqdk-f-ok">Đồng ý</button></div>'
            + '</div></div>');

        $pop.data('giatri', dsGiaTri).data('key', key);

        /* ⚠ PHẢI gắn vào TRONG modal, KHÔNG gắn ra <body>.
           Bootstrap khoá con trỏ trong modal đang mở: hễ focus nhảy ra thẻ nằm ngoài
           modal là nó kéo về ngay. Ô "Tìm trong danh sách" nằm ngoài nên vừa bấm vào
           đã bị cướp focus → gõ không ăn chữ nào, trong khi tick chọn vẫn bình thường
           (tick không cần giữ focus) — đúng hiện tượng sếp Khoa báo 29/09/2026.
           Popup dùng position:fixed nên nằm trong modal vẫn định vị theo màn hình như cũ
           (đã soát: không thẻ cha nào có transform để phá containing block). */
        var $noiChua = $(elAnchor).closest('.modal');
        if (!$noiChua.length) $noiChua = $('body');
        $noiChua.append($pop);

        // Định vị dưới nút phễu, tự lùi vào trong nếu chạm mép phải/dưới màn hình
        var r = elAnchor.getBoundingClientRect();
        var w = $pop.outerWidth(), h = $pop.outerHeight();
        var left = Math.min(r.left, window.innerWidth - w - 12);
        var top = r.bottom + 6;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
        $pop.css({ left: Math.max(8, left) + 'px', top: top + 'px' });

        me._kqDongBoTickAll($pop);
        setTimeout(function () { $('#kqdk_f_tim').focus(); }, 0);
    },

    _kqDongFilter: function () {
        $('#kqdk_filter_pop').remove();
    },

    /*------------------------------------------
    -- Ô "(Chọn tất cả)" phản ánh trạng thái các dòng ĐANG HIỆN (sau khi gõ tìm).
    -------------------------------------------*/
    _kqDongBoTickAll: function ($pop) {
        var $hien = $pop.find('.kqdk-f-list .kqdk-f-item:visible .kqdk-f-cb');
        var tong = $hien.length, chon = $hien.filter(':checked').length;
        var $all = $pop.find('#kqdk_f_all');
        $all.prop('checked', tong > 0 && chon === tong);
        $all.prop('indeterminate', chon > 0 && chon < tong);
    },

    filterKQDK_HoSo: function () {
        main_doc.KeHoachTuyenSinhNew._kqApplyAllFilters();
    },

    /*------------------------------------------
    -- Xuất Excel bằng SheetJS (đã load qua CDN cho phần Import)
    -- Header 2 tầng (group + column), rows từ dtKQDK_HoSo (theo filter hiện tại nếu có).
    -------------------------------------------*/
    exportKQDK_Excel: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại", "w");
            return;
        }
        /* Xuất ĐÚNG NHỮNG GÌ ĐANG NHÌN THẤY: _kqViewData là danh sách sau khi áp ô tìm
           nhanh + bộ lọc cột + sắp xếp. Không lọc gì thì nó bằng cả danh sách, nên
           không mất dữ liệu. Trước đây luôn xuất me.dtKQDK_HoSo → lọc xong xuất vẫn ra
           đủ mọi dòng, trái với cái người dùng đang thấy trên màn hình. */
        var src = (me._kqViewData && me._kqViewData.length) ? me._kqViewData : (me.dtKQDK_HoSo || []);
        if (!src.length) {
            edu.system.alert("Không có dữ liệu để xuất", "w");
            return;
        }
        var headerCols = [
            'STT', 'Họ và tên', 'Ngày sinh', 'Giới tính', 'Dân tộc', 'Tôn giáo', 'Quốc tịch', 'Điện thoại', 'Email', 'Nơi sinh',
            'Số CCCD', 'Ngày cấp', 'Nơi cấp',
            'HK Tỉnh/TP', 'HK Xã/Phường', 'HK Số nhà/Thôn/Xóm',
            'Phương thức XT', 'Đối tượng TS', 'Đối tượng UT', 'Khu vực UT',
            'Mã tỉnh L12', 'Mã trường L12', 'Tên trường L12', 'Học lực L12', 'Hạnh kiểm L12',
            'Tổ hợp môn', 'Điểm 1', 'Điểm 2', 'Điểm 3', 'Điểm UT', 'Tổng điểm XT',
            'Bố - Họ tên', 'Bố - Năm sinh', 'Bố - Nơi ở', 'Bố - SĐT',
            'Mẹ - Họ tên', 'Mẹ - Năm sinh', 'Mẹ - Nơi ở', 'Mẹ - SĐT',
            'Số QĐ TT', 'Ngày ban hành QĐ', 'Khóa ĐT', 'Mã ngành', 'Mã lớp QL', 'Mã SV',
            'Đối tượng HĐ', 'Tên đơn vị HĐ', 'Mã QHNS', 'Địa chỉ cơ quan HĐ', 'MST',
            'Nguồn khai thác',
            // Bổ sung 29/09/2026 — phải khớp ĐÚNG THỨ TỰ 17 giá trị thêm ở cuối _kqRowToArray
            'Kế hoạch tuyển sinh', 'Đợt tuyển sinh', 'Mã hồ sơ', 'Số báo danh',
            'Nguyện vọng đầu ra', 'Hệ đào tạo', 'Chương trình đào tạo', 'Ngành tuyển sinh',
            'Trạng thái hồ sơ', 'Kết quả xét tuyển', 'Ngày nộp hồ sơ', 'Ngày có kết quả',
            'Ngày tiếp nhận', 'Đã tạo hồ sơ học tập',
            'Người mua HĐ', 'Email nhận HĐ', 'SĐT nhận HĐ'
        ];
        var ws_data = [headerCols];
        for (var i = 0; i < src.length; i++) {
            var arr = me._kqRowToArray(src[i], i + 1);
            // Bỏ cột checkbox (index 1) khi export
            var out = [arr[0]];
            for (var j = 2; j < arr.length; j++) out.push(arr[j]);
            ws_data.push(out);
        }
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        // Auto-set column width based on header text length
        ws['!cols'] = headerCols.map(function (h) { return { wch: Math.max(10, Math.min(30, h.length + 2)) }; });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DS HoSo');
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var fname = 'DS_HoSo_TS_' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes()) + '.xlsx';
        XLSX.writeFile(wb, fname);
    },

    /*------------------------------------------
    -- Gọi phân lớp tự động cho các bản ghi đang tick ở list KQĐK.
    -- ParamCore_Person_Id lấy từ record field CorePerson_Id.
    -- Ưu tiên endpoint old3, fallback old2 -> old để tương thích nhiều môi trường.
    -------------------------------------------*/
    kqdk_PhanLopTuDong_Selected: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $checked = $('#tblKQDK_HoSo tbody .kqdk-sel:checked');
        if (!$checked.length) {
            edu.system.alert('Vui lòng tick ít nhất 1 hồ sơ để phân lớp tự động', 'w');
            return;
        }

        var tasks = [];
        $checked.each(function () {
            var $tr = $(this).closest('tr');
            var idx = parseInt($tr.attr('data-kq-idx'), 10);
            var row = (!isNaN(idx) && me._kqViewData && me._kqViewData[idx]) ? me._kqViewData[idx] : null;
            var corePersonId = '';
            if (row) {
                corePersonId = me._kqPick(row, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'PERSON_ID', 'Person_Id']);
            }
            if (!corePersonId) corePersonId = $tr.attr('data-core-person-id') || '';
            tasks.push({
                corePersonId: corePersonId,
                hoSoId: $tr.attr('data-id') || '',
                hoTen: $.trim($tr.find('td').eq(3).text())
            });
        });

        var valid = tasks.filter(function (t) { return !!t.corePersonId; });
        var skipped = tasks.length - valid.length;
        if (!valid.length) {
            edu.system.alert('Không lấy được CorePerson_Id từ các dòng đã tick', 'w');
            return;
        }

        edu.system.confirm('Thực hiện phân lớp tự động cho ' + valid.length + ' hồ sơ đã chọn?');
        $('#btnYes').off('click').on('click', function () {
            var i = 0, ok = 0, fail = 0;
            var errs = [];

            var runNext = function () {
                if (i >= valid.length) {
                    var summary = 'Phân lớp tự động xong. Thành công: ' + ok + '/' + valid.length + ', Lỗi: ' + fail;
                    if (skipped > 0) summary += ', Bỏ qua (thiếu CorePerson_Id): ' + skipped;
                    if (errs.length) {
                        summary += '\nChi tiết lỗi: ' + errs.slice(0, 5).join(' | ');
                        if (errs.length > 5) summary += ' ...';
                    }
                    edu.system.alert(summary, fail ? 'w' : 's');
                    me.loadKQDK_List();
                    return;
                }

                var item = valid[i++];
                me._call_PhanLopTuDong_ByCorePerson(item.corePersonId, function (res) {
                    if (res && res.ok) {
                        ok++;
                    } else {
                        fail++;
                        errs.push((item.hoTen || item.hoSoId || item.corePersonId) + ': ' + ((res && res.message) || 'Lỗi không xác định'));
                    }
                    runNext();
                });
            };

            runNext();
        });
    },

    /*------------------------------------------
    -- Call 1 hồ sơ theo CorePerson_Id.
    -- Dùng func mới PKG_CORE_NhapHoc_ThuTien.PhanLop_TuDong, endpoint fallback.
    -------------------------------------------*/
    _call_PhanLopTuDong_ByCorePerson: function (corePersonId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var apis = [
            'SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0lcgPP',
            'SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0lcwPP',
            'SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0l'
        ];
        var tryAt = 0;
        var messages = [];

        var tryOne = function () {
            if (tryAt >= apis.length) {
                cb({ ok: false, message: messages.join(' | ') || 'Không gọi được API phân lớp' });
                return;
            }

            var action = apis[tryAt++];
            var obj_save = {
                'action': action,
                'func': 'PKG_CORE_NhapHoc_ThuTien.PhanLop_TuDong',
                'iM': edu.system.iM,
                'strCore_Person_Id': corePersonId,
                'strNguonSuKien_Code': 'TS_KQDK_AUTO_CLASS',
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || ''
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) {
                        cb({ ok: true, message: data.Message || '' });
                    } else {
                        messages.push((action.split('/')[1] || action) + ': ' + ((data && data.Message) || 'BE reject'));
                        tryOne();
                    }
                },
                error: function (er) {
                    messages.push((action.split('/')[1] || action) + ': HTTP ' + JSON.stringify(er));
                    tryOne();
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        };

        if (!corePersonId) {
            cb({ ok: false, message: 'Thiếu CorePerson_Id' });
            return;
        }
        tryOne();
    },

    /*------------------------------------------
    -- KHAI TRỰC TIẾP HỒ SƠ — nạp danh mục cho form
    -- Reuse các mã DM bên hồ sơ nhân sự (core_person cùng cấu trúc):
    --   NS.GITI  → Giới tính
    --   NS.DATO  → Dân tộc
    --   NS.TOGI  → Tôn giáo
    --   CHUN.CHLU→ Quốc tịch
    -- Tỉnh/Huyện/Xã (Nơi sinh + Hộ khẩu) dùng edu.extend.genDropTinhThanh
    --   → cascade tự động qua bảng CHUN.DMTT (cache localStorage.strTinhThanh6)
    -- Lazy load: chỉ chạy lần đầu bấm "Khai trực tiếp".
    -------------------------------------------*/
    initKhai_DanhMuc: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._initViewMode();     // tự guard, gọi nhiều lần không sao
        if (me._khaiDMLoaded) return;
        me._khaiDMLoaded = true;
        // Danh mục Loại địa chỉ — không gắn vào dropdown nào, chỉ để đối chiếu
        // ADDRESS_TYPE_CODE lúc đọc/ghi Nơi sinh & Hộ khẩu (xem save_PersonAddress).
        me._ensureAddrTypeDM();
        try {
            var C = (window.constant && constant.setting && constant.setting.CATOR) ? constant.setting.CATOR : {};
            var NS = C.NS || {};
            var CH = C.CHUN || {};

            // Chuẩn bị danh sách DM cần nạp — chỉ push nếu constant tồn tại (tránh gọi API với code rỗng)
            // Phần tử thứ 3 là placeholder. Không truyền thì loadToCombo_data lấy mặc định
            // theo mã bảng danh mục → hiện ra "Chọn qlsv.doituong" trên form.
            var toLoad = [];
            if (NS.GITI) toLoad.push([NS.GITI, "ddlKQ_GioiTinh", "-- Chọn giới tính --"]);
            if (NS.DATO) toLoad.push([NS.DATO, "ddlKQ_DanToc", "-- Chọn dân tộc --"]);
            if (NS.TOGI) toLoad.push([NS.TOGI, "ddlKQ_TonGiao", "-- Chọn tôn giáo --"]);
            if (CH.CHLU) toLoad.push([CH.CHLU, "ddlKQ_QuocTich", "-- Chọn quốc tịch --"]);
            // Tab Xét tuyển — dùng string key trực tiếp (không có trong constant.setting.CATOR)
            toLoad.push(["TS.DOITUONGDUTUYEN", "ddlKQ_DoiTuongTS", "-- Chọn đối tượng --"]);
            toLoad.push(["QLSV.DOITUONG", "ddlKQ_DoiTuongUT", "-- Chọn đối tượng ưu tiên --"]);
            toLoad.push(["QLSV.KHUVUC", "ddlKQ_KhuVucUT", "-- Chọn khu vực ưu tiên --"]);
            // Trường lớp 12: dropdown có ô tìm kiếm (select2) thay cho gõ tay.
            // Cùng danh mục mà hosotuyensinh.js / xettuyen.js đang dùng.
            toLoad.push(["TUYENSINH.TRUONGHOC", "ddlKQ_Truong12", "-- Chọn trường THPT --"]);
            toLoad.push(["TUYENSINH.HOCLUC", "ddlKQ_HocLuc", "-- Chọn học lực --"]);
            toLoad.push(["TUYENSINH.HANHKIEM", "ddlKQ_HanhKiem", "-- Chọn hạnh kiểm --"]);
            // Tab Trúng tuyển — Cơ sở đào tạo: KHÔNG dùng DM `KHCT.COSODAOTAO` (CMC trả rỗng),
            // dùng proc `pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao` giống Import + Đọc API.
            me.loadCoSoDaoTao_ToSelect('#ddlKQ_CoSoDaoTao');
            // Tab Hóa đơn
            toLoad.push(["TS.DOITUONGHOADON", "ddlKQ_HD_DoiTuong", "-- Chọn đối tượng --"]);     // TODO: verify mã DM chuẩn
            toLoad.push(["PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "ddlKQ_HD_HinhThucTT", "-- Chọn hình thức --"]);
            // Tab 8 — Danh mục hồ sơ. Cùng DM mà duyethoso.js đang dùng cho cột "Loại hồ sơ".
            toLoad.push(["TUYENSINH.LOAIHOSO", "ddlKQ_HS_LoaiHoSo", "-- Chọn loại hồ sơ --"]);

            // Phương thức tuyển sinh: KHÔNG dùng dtPhuongAnTuyenSinh vì đó là bảng "Phương án" khác
            // với "Phương thức của Đợt" (FK cần TS_KH_DOT_PHUONGTHUC.ID). Chưa có API list theo đợt
            // → để dropdown disabled, gửi rỗng → backend nhận NULL, không vi phạm FK.

            var finalize = function () {
                // Cascading Tỉnh → Huyện → Xã (data cache localStorage.strTinhThanh6, load sync nếu có cache)
                if (edu.extend && typeof edu.extend.genDropTinhThanh === 'function') {
                    edu.extend.genDropTinhThanh('ddlKQ_NS_Tinh', 'ddlKQ_NS_Huyen', 'ddlKQ_NS_Xa');
                    edu.extend.genDropTinhThanh('ddlKQ_HK_Tinh', 'ddlKQ_HK_Huyen', 'ddlKQ_HK_Xa');
                }
                me._bindCascadeNative();
                // Tab 7 - Nguồn khai thác (đối tác tuyển sinh), nạp riêng qua PKG_CORE_TS_HOSO
                me._loadNguonKhaiThac();
                // Bật select2 (có ô tìm kiếm) cho mọi dropdown của form Khai.
                // Phải chạy SAU _bindCascadeNative để handler change.kqnat (lock/unlock Huyện/Xã)
                // fire trước handler change.kqrep (re-apply select2) — xem _bindCascadeReapply.
                me.initKhai_Select2();
                me._bindCascadeReapply();
            };

            if (toLoad.length === 0) { finalize(); return; }

            // loadToCombo_DanhMucDuLieu signature: (strCode, zone_id, type, callback, title, strTenCotSapXep)
            // Đợi tất cả 4 DM nạp xong (callback) mới finalize → tránh select2 apply lên dropdown rỗng.
            var pending = toLoad.length;
            var onOne = function () { if (--pending <= 0) finalize(); };
            toLoad.forEach(function (p) {
                edu.system.loadToCombo_DanhMucDuLieu(p[0], p[1], "", function (rows) {
                    // Giữ lại data thô của danh mục Trường THPT để dựng chuỗi "Mã | Tên"
                    // (option chỉ render TEN, không có MA trong DOM).
                    if (p[1] === 'ddlKQ_Truong12') me._dtTruong12 = rows || [];
                    // Đối tượng hóa đơn: giữ data thô để đổi ID → MÃ CHỮ lúc lưu
                    // (BE chỉ nhận CA_NHAN/TO_CHUC — xem _maDoiTuongHoaDon).
                    if (p[1] === 'ddlKQ_HD_DoiTuong') me._dtDoiTuongHD = rows || [];
                    // Tab 8: giữ data thô để tra TÊN loại hồ sơ khi dựng bảng
                    // (API LayDSTS_HoSo có thể chỉ trả LOAIHOSO_ID, không trả tên).
                    if (p[1] === 'ddlKQ_HS_LoaiHoSo') me._dtLoaiHoSo = rows || [];
                    onOne();
                }, p[2]);
            });
        } catch (ex) {
            kqdkNoLog('[KQĐK] Nạp danh mục lỗi:', ex);
        }
    },

    /*------------------------------------------
    -- Re-apply select2 cho Huyện/Xã sau khi cascade (options thay đổi) + quản lý disabled state.
    -- Logic UX: Huyện disabled cho tới khi có Tỉnh; Xã disabled cho tới khi có Huyện.
    -- Placeholder hướng dẫn: "Vui lòng chọn Tỉnh trước" / "Vui lòng chọn Quận/Huyện trước".
    -------------------------------------------*/
    /*------------------------------------------
    -- Sau khi user chọn Tỉnh/Huyện, genDropTinhThanh thay options của Huyện/Xã.
    -- select2 wrapper cũ giữ snapshot options → cần destroy + apply lại để lấy options mới.
    -------------------------------------------*/
    _bindCascadeReapply: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var reapply = function (id) { me._reapplyKQSelect2(id); };
        // .off trước để idempotent (initKhai_DanhMuc chạy 1 lần nhưng phòng gọi lại)
        $('#ddlKQ_NS_Tinh').off('change.kqrep').on('change.kqrep', function () {
            setTimeout(function () { reapply('ddlKQ_NS_Huyen'); reapply('ddlKQ_NS_Xa'); }, 80);
        });
        $('#ddlKQ_NS_Huyen').off('change.kqrep').on('change.kqrep', function () {
            setTimeout(function () { reapply('ddlKQ_NS_Xa'); }, 80);
        });
        $('#ddlKQ_HK_Tinh').off('change.kqrep').on('change.kqrep', function () {
            setTimeout(function () { reapply('ddlKQ_HK_Huyen'); reapply('ddlKQ_HK_Xa'); }, 80);
        });
        $('#ddlKQ_HK_Huyen').off('change.kqrep').on('change.kqrep', function () {
            setTimeout(function () { reapply('ddlKQ_HK_Xa'); }, 80);
        });
    },

    /*------------------------------------------
    -- Destroy + apply lại select2 cho 1 dropdown.
    -- Bắt buộc sau khi thay <option> bằng .html()/.append() vì select2 giữ snapshot options cũ.
    -- Gọi ở: cascade Tỉnh→Huyện→Xã, và cuối các hàm _load* nạp dropdown động.
    -------------------------------------------*/
    _reapplyKQSelect2: function (id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (typeof $.fn.select2 !== 'function') return;
        var $el = $('#' + id);
        if (!$el.length) return;
        if ($el.hasClass('select2-hidden-accessible')) {
            try { $el.select2('destroy'); } catch (e) { }
        }
        me._applyKQSelect2(id);
    },

    /*------------------------------------------
    -- Nạp dropdown Đợt tuyển sinh (#ddlKQ_DotTuyenSinh) trong form Khai.
    -- Nguồn data: cache me.dtDotTuyenSinh (đã load ở modal Đợt trước đó).
    -- Auto-select:
    --   1) Ưu tiên preselect nếu đã có context (me.strDot_Id_ForKQ) — mở khai từ row Đợt.
    --   2) Nếu KH chỉ có 1 đợt → auto pick đợt duy nhất (UX phổ biến, khỏi bắt user click).
    -- Trường hợp không có đợt nào (dtDotTuyenSinh rỗng): giữ placeholder, user không lưu được
    -- (validate ở saveKhai_HoSo sẽ chặn).
    -------------------------------------------*/
    /*------------------------------------------
    -- Đảm bảo me.dtDotTuyenSinh đã có data rồi mới chạy cb.
    -- Cache này vốn chỉ được nạp khi user mở modal "Các đợt tuyển sinh"; nếu vào thẳng
    -- "Kết quả đăng ký" từ bảng KH thì cache rỗng → dropdown Đợt trong form Khai không có
    -- lựa chọn nào. Hàm này tự gọi Pr_Ts_Kh_Ts_Dot_Get_Ds theo KH hiện tại để lấp chỗ đó.
    -------------------------------------------*/
    _ensureDotTuyenSinh: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var done = function () { if (typeof cb === 'function') cb(); };
        if (me.dtDotTuyenSinh && me.dtDotTuyenSinh.length) { done(); return; }
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) { done(); return; }
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_KeHoach_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strDot_Status_Code': '',
            'dIs_Active': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success && edu.util.checkValue(data.Data)) {
                    me.dtDotTuyenSinh = data.Data;
                }
                done();
            },
            error: function () { done(); },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    _loadDotToKhai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_DotTuyenSinh');
        $sel.empty().append('<option value="">-- Chọn đợt tuyển sinh --</option>');
        var arr = me.dtDotTuyenSinh || [];
        arr.forEach(function (d) {
            var id = d.ID || d.Id || d.id || '';
            var ma = d.MA || d.Ma || '';
            var ten = d.TEN || d.Ten || '';
            if (id) $sel.append('<option value="' + id + '">' + (ma ? '[' + ma + '] ' : '') + ten + '</option>');
        });
        if (me.strDot_Id_ForKQ) {
            $sel.val(me.strDot_Id_ForKQ);
        } else if (arr.length === 1) {
            var onlyId = arr[0].ID || arr[0].Id || arr[0].id || '';
            if (onlyId) {
                $sel.val(onlyId);
                me.strDot_Id_ForKQ = onlyId;
            }
        }
        me._reapplyKQSelect2('ddlKQ_DotTuyenSinh');

        /* .val() KHÔNG bắn sự kiện change → handler change.dotkq (nơi nạp lại tab 8)
           không chạy, nên lưới danh mục hồ sơ của form KHAI MỚI đứng trắng dù đợt đã
           được chọn sẵn. Tự gọi lại ở đây. Chỉ làm cho chế độ khai mới: luồng Sửa
           (openSuaHoSo) gọi _loadHoSoDM_ForEdit ngay sau đó với Id thật, gọi ở đây
           nữa là bắn thừa một lượt request. */
        if (!edu.util.checkValue(me.strSuaHoSo_Id) && edu.util.checkValue($sel.val())) {
            me._loadHoSoDM_ForEdit('');
        }
        me._veBadgeKeHoach();
    },

    /*------------------------------------------
    -- Load Nguyện vọng đầu ra (list Kế hoạch đầu ra theo KH+Đợt) vào dropdown.
    -- Origin API: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds
    -- Chỉ lấy các đầu ra còn hiệu lực (dIs_Active=1).
    -- Field TS_HOSO_NGUYENVONG.TS_KEHOACH_DAU_RA_ID NOT NULL → user phải chọn 1 giá trị.
    -------------------------------------------*/
    _loadNguyenVongDauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_NguyenVongDauRa');
        $sel.html('<option value="">-- Chọn nguyện vọng đầu ra --</option>');
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) return;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': me.strDot_Id_ForKQ || '',
            'strTs_Kh_Dot_PhuongThuc_Id': '',
            'strOutput_Status_Code': '',
            'dIs_Public': '',
            'dIs_Active': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success) return;
                var rows = edu.util.checkValue(data.Data) ? data.Data : [];
                var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
                // Pick giá trị đầu tiên không null / rỗng
                var pick = function () {
                    for (var k = 0; k < arguments.length; k++) {
                        var v = arguments[k];
                        if (v != null && String(v).trim() !== '') return String(v).trim();
                    }
                    return '';
                };
                for (var i = 0; i < rows.length; i++) {
                    var d = rows[i];
                    var id = d.ID || d.Id || d.id || '';
                    if (!id) continue;
                    var name = pick(d.TEN_HIENTHI, d.TenHienThi, d.TEN, d.Ten);
                    var ma = pick(d.MA_HIENTHI, d.MA_CT, d.MaCT, d.MA, d.Ma);
                    var display;
                    if (name) {
                        display = name + (ma && ma !== name ? ' (' + ma + ')' : '');
                    } else {
                        // Fallback: dựng từ Ngành TS + Hệ + Khóa khi TEN/MA đều null
                        var nganh = pick(d.DAOTAO_NGANH_TS_TEN, d.DAOTAO_NGANH_DT_TEN, d.DAOTAO_TOCHUCCHUONGTRINH_TEN);
                        var he = pick(d.DAOTAO_HEDAOTAO_TEN);
                        var khoa = pick(d.DAOTAO_KHOADAOTAO_TEN);
                        var extra = [];
                        if (he) extra.push(he);
                        if (khoa) extra.push(khoa);
                        display = nganh || '[Đầu ra ' + (i + 1) + ']';
                        if (extra.length) display += ' — ' + extra.join(' · ');
                    }
                    $sel.append('<option value="' + esc(id) + '">' + esc(display) + '</option>');
                }
                me._reapplyKQSelect2('ddlKQ_NguyenVongDauRa');
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Load Phương thức tuyển sinh theo KH + Đợt vào dropdown.
    -- Origin API: PKG_CORE_TS_KEHOACH.LayDS_PhuongThucTuyenSinh
    -------------------------------------------*/
    _loadPhuongThucTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_PhuongThuc');
        $sel.html('<option value="">-- Chọn phương thức tuyển sinh --</option>');
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) return;
        var obj_save = {
            'action': 'TS_CORE_KEHOACH_MH/DSA4BRIeESk0Li8mFSk0IhU0OCQvEigvKQPP',
            'func': 'PKG_CORE_TS_KEHOACH.LayDS_PhuongThucTuyenSinh',
            'iM': edu.system.iM,
            'strKeHoach_Id': me.strKeHoachTuyenSinh_Id,
            'strDot_Id': me.strDot_Id_ForKQ || '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success) return;
                var rows = edu.util.checkValue(data.Data) ? data.Data : [];
                var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
                var pick = function () {
                    for (var k = 0; k < arguments.length; k++) {
                        var v = arguments[k];
                        if (v != null && String(v).trim() !== '') return String(v).trim();
                    }
                    return '';
                };
                for (var i = 0; i < rows.length; i++) {
                    var d = rows[i];
                    var id = pick(d.ID, d.Id, d.id);
                    if (!id) continue;
                    var name = pick(d.TEN, d.Ten, d.PHUONGTHUC_TEN, d.PHUONG_THUC_TEN);
                    var ma = pick(d.MA, d.Ma, d.PHUONGTHUC_MA, d.PHUONG_THUC_MA);
                    var display = name || ma || ('[Phương thức ' + (i + 1) + ']');
                    if (name && ma && ma !== name) display += ' (' + ma + ')';
                    $sel.append('<option value="' + esc(id) + '">' + esc(display) + '</option>');
                }
                me._reapplyKQSelect2('ddlKQ_PhuongThuc');
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Load Lớp quản lý dự kiến theo Nguyện vọng đầu ra (cascade).
    -- Origin API: PKG_CORE_TS_KEHOACH.LayDS_LopQuanLy_TheoDauRa
    -- strDauRa_Id = giá trị đang chọn ở #ddlKQ_NguyenVongDauRa.
    -------------------------------------------*/
    _loadLopDuKien: function (strDauRa_Id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_LopDuKien');
        if (!edu.util.checkValue(strDauRa_Id)) {
            $sel.html('<option value="">-- Chọn nguyện vọng đầu ra trước --</option>')
                .prop('disabled', true).val('');
            me._reapplyKQSelect2('ddlKQ_LopDuKien');
            return;
        }
        $sel.html('<option value="">-- Chọn lớp dự kiến --</option>').prop('disabled', false);
        var obj_save = {
            'action': 'TS_CORE_KEHOACH_MH/DSA4BRIeDS4xEDQgLw04HhUpJC4FIDQTIAPP',
            'func': 'PKG_CORE_TS_KEHOACH.LayDS_LopQuanLy_TheoDauRa',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strDauRa_Id': strDauRa_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success) return;
                var rows = edu.util.checkValue(data.Data) ? data.Data : [];
                var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
                var pick = function () {
                    for (var k = 0; k < arguments.length; k++) {
                        var v = arguments[k];
                        if (v != null && String(v).trim() !== '') return String(v).trim();
                    }
                    return '';
                };
                for (var i = 0; i < rows.length; i++) {
                    var d = rows[i];
                    var id = pick(d.ID, d.Id, d.id);
                    if (!id) continue;
                    var name = pick(d.TEN, d.Ten, d.LOPQUANLY_TEN, d.LOP_QUANLY_TEN, d.TEN_LOP);
                    var ma = pick(d.MA, d.Ma, d.LOPQUANLY_MA, d.LOP_QUANLY_MA, d.MA_LOP);
                    var display = name || ma || ('[Lớp ' + (i + 1) + ']');
                    if (name && ma && ma !== name) display += ' (' + ma + ')';
                    $sel.append('<option value="' + esc(id) + '">' + esc(display) + '</option>');
                }
                me._reapplyKQSelect2('ddlKQ_LopDuKien');
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    _bindCascadeNative: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Chỉ enable/disable Huyện + Xã theo Tỉnh/Huyện (native <select>, không select2).
        // genDropTinhThanh đã handle empty+populate options; ta chỉ bổ sung UX lock/unlock.
        var lockDrop = function (id, msg) {
            $('#' + id).empty().append('<option value="">' + msg + '</option>').prop('disabled', true);
        };
        var unlockDrop = function (id) {
            $('#' + id).prop('disabled', false);
        };
        var bind = function (tinhId, huyenId, xaId) {
            $('#' + tinhId).off('change.kqnat').on('change.kqnat', function () {
                if ($(this).val()) {
                    unlockDrop(huyenId);
                    lockDrop(xaId, 'Vui lòng chọn Quận/Huyện trước');
                } else {
                    lockDrop(huyenId, 'Vui lòng chọn Tỉnh trước');
                    lockDrop(xaId, 'Vui lòng chọn Quận/Huyện trước');
                }
                // genDropTinhThanh đổ option ở handler khác → đợi nó xong rồi mới xét
                // tỉnh 2 cấp. Chạy ở 2 mốc cho chắc vì nguồn data có thể async.
                setTimeout(function () { me._apply2Cap(tinhId, huyenId, xaId); }, 0);
                setTimeout(function () { me._apply2Cap(tinhId, huyenId, xaId); }, 250);
            });
            $('#' + huyenId).off('change.kqnat').on('change.kqnat', function () {
                if ($(this).val()) unlockDrop(xaId);
                else if (!$('#' + huyenId).attr('data-2cap')) {
                    lockDrop(xaId, 'Vui lòng chọn Quận/Huyện trước');
                }
            });
        };
        bind('ddlKQ_NS_Tinh', 'ddlKQ_NS_Huyen', 'ddlKQ_NS_Xa');
        bind('ddlKQ_HK_Tinh', 'ddlKQ_HK_Huyen', 'ddlKQ_HK_Xa');
        me._bindAddrTouched();
        me._bindTruong12();
    },

    /*------------------------------------------
    -- Đánh dấu người dùng ĐÃ TỰ TAY đụng vào cụm địa chỉ.
    -- Cần để phân biệt 2 trường hợp ô trống, vốn trông y hệt nhau lúc lưu:
    --   a) form chưa nạp kịp  → phải GIỮ giá trị cũ, không thì mất dữ liệu
    --   b) user bấm × xoá đi  → phải GHI RỖNG, không thì xoá không được
    -- Dùng select2:select/clear/unselect vì mấy sự kiện này chỉ phát khi user thao tác,
    -- còn .val().trigger('change') của code thì không phát → không đánh dấu nhầm.
    -------------------------------------------*/
    /*==========================================================================
    == TRƯỜNG LỚP 12 — dropdown có tìm kiếm thay cho gõ tay (yêu cầu 11/09/2026)
    == Danh mục TUYENSINH.TRUONGHOC, đúng nguồn hosotuyensinh.js/xettuyen.js dùng.
    == BE vẫn nhận TEXT qua strPersonEdu_TruongMaTen nên giá trị thật nằm ở input
    == ẩn #txtKQ_TruongMaTen — dropdown chỉ là cách chọn. Nhờ vậy mọi hàm lưu/nạp
    == và cột bảng danh sách không phải sửa gì.
    ==========================================================================*/
    _truong12TuId: function (id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(id)) return '';
        var r = (me._dtTruong12 || []).filter(function (e) { return e.ID === id; })[0];
        if (!r) return '';
        var ma = ((r.MA || '') + '').trim();
        var ten = ((r.TEN || '') + '').trim();
        return (ma && ten) ? (ma + ' | ' + ten) : (ten || ma);
    },

    /*------------------------------------------
    -- Đổ text đã lưu ngược lên dropdown. Trường không có trong danh mục (dữ liệu cũ
    -- gõ tay, hoặc trường mới) thì chèn 1 option tạm mang đúng text đó — KHÔNG được
    -- để trống, vì bấm Cập nhật sau đó sẽ ghi rỗng đè lên dữ liệu đang có.
    -------------------------------------------*/
    _setTruong12FromText: function (text, _try) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_Truong12');
        if (!$sel.length || !edu.util.checkValue(text)) return;
        var dt = me._dtTruong12 || [];
        if (!dt.length) {                       // danh mục nạp async → chờ rồi thử lại
            _try = (_try || 0) + 1;
            if (_try > 25) return;
            setTimeout(function () { me._setTruong12FromText(text, _try); }, 200);
            return;
        }
        var chuan = function (s) { return ((s || '') + '').trim().toLowerCase(); };
        var t = chuan(text);
        var hit = dt.filter(function (e) {
            return chuan(me._truong12TuId(e.ID)) === t
                || chuan(e.TEN) === t || chuan(e.MA) === t;
        })[0];
        if (hit) {
            $sel.val(hit.ID);
            $('#txtKQ_Truong12_Khac').val('');
        } else {
            // Không có trong danh mục (trường mới / dữ liệu cũ gõ tay) → đổ vào ô gõ tay
            // để cán bộ sửa được, thay vì nhét option ảo vào danh sách chọn.
            $sel.val('');
            $('#txtKQ_Truong12_Khac').val(text);
        }
        me._reapplyKQSelect2('ddlKQ_Truong12');
    },

    /*------------------------------------------
    -- Hai ô cùng ghi vào MỘT chỗ (#txtKQ_TruongMaTen — giá trị thật gửi BE):
    --   #ddlKQ_Truong12      chọn từ danh mục TUYENSINH.TRUONGHOC
    --   #txtKQ_Truong12_Khac gõ tay, cho trường chưa có trong danh mục
    -- Luật: ô nào vừa được dùng thì ô kia nhường. Gõ tay có chữ → ưu tiên chữ gõ tay.
    -- Không có luật này thì hai ô cùng có giá trị, không ai biết cái nào xuống DB.
    -------------------------------------------*/
    _bindTruong12: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tay = function () { return $('#txtKQ_Truong12_Khac'); };
        var layTay = function () { return $.trim($tay().val() || ''); };

        $('#ddlKQ_Truong12').off('change.kqtr').on('change.kqtr', function () {
            var v = $(this).val() || '';
            if (!v) {
                // Bỏ chọn trong danh mục: nếu đang có chữ gõ tay thì giữ chữ đó,
                // không thì mới xoá trắng giá trị gửi đi.
                edu.util.viewValById('txtKQ_TruongMaTen', layTay());
                return;
            }
            var txt = (v === '__khac__')
                ? ($(this).find('option[value="__khac__"]').text() || '')
                : me._truong12TuId(v);
            edu.util.viewValById('txtKQ_TruongMaTen', txt);
            $tay().val('');       // đã chọn trong danh mục → bỏ phần gõ tay
        });

        $('#txtKQ_Truong12_Khac').off('input.kqtr').on('input.kqtr', function () {
            var tay = layTay();
            if (tay === '') {
                // Xoá hết chữ gõ tay → quay về giá trị của ô chọn (nếu đang chọn)
                var v = $('#ddlKQ_Truong12').val() || '';
                edu.util.viewValById('txtKQ_TruongMaTen', v ? me._truong12TuId(v) : '');
                return;
            }
            edu.util.viewValById('txtKQ_TruongMaTen', tay);
            // Bỏ chọn ô danh mục cho khỏi hiểu nhầm. .trigger('change') là để select2
            // vẽ lại placeholder; handler ở trên thấy value rỗng sẽ lấy đúng chữ gõ tay,
            // nên không sợ xoá ngược lại cái vừa gõ.
            if ($('#ddlKQ_Truong12').val()) $('#ddlKQ_Truong12').val('').trigger('change');
        });
    },

    _bindAddrTouched: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var danhDau = function () { $(this).attr('data-user-touched', '1'); };
        [['NS', 'txtKQ_NoiSinh'], ['HK', 'txtKQ_HK_SoNha']].forEach(function (c) {
            var kind = c[0];
            // Người dùng vừa đụng cụm nào thì lấy cụm đó điền sang hóa đơn.
            // setTimeout 0 để chờ cascade đổ xong Huyện/Xã rồi mới ghép chuỗi.
            var dienSangHD = function () {
                setTimeout(function () { me._autoFillHoaDonDiaChi(kind); }, 0);
            };
            ['Tinh', 'Huyen', 'Xa'].forEach(function (cap) {
                $('#ddlKQ_' + kind + '_' + cap).off('.kqtouch')
                    .on('select2:select.kqtouch select2:clear.kqtouch select2:unselect.kqtouch',
                        function () { danhDau.call(this); dienSangHD(); });
            });
            $('#' + c[1]).off('.kqtouch').on('input.kqtouch',
                function () { danhDau.call(this); dienSangHD(); });
        });
        // Gõ vào ô địa chỉ hóa đơn = tự quyết → từ đó không tự điền đè lên nữa
        $('#txtKQ_HD_DiaChi').off('.kqtouch').on('input.kqtouch', danhDau);

        /* Họ tên người mua hàng tự điền theo Họ và tên ở tab Cá nhân (khách yêu cầu
           23/09/2026), cùng luật với ô Địa chỉ: gõ tay vào ô hóa đơn là từ đó thôi
           tự điền — người mua có thể là phụ huynh chứ không phải thí sinh. */
        $('#txtKQ_HoTen').off('.kqhdten').on('input.kqhdten', function () {
            me._autoFillHoaDonTen();
        });
        $('#txtKQ_HD_NguoiMua').off('.kqhdten').on('input.kqhdten', danhDau);
    },

    /*------------------------------------------
    -- In lại ngày đã chọn theo dd/mm/yyyy ngay dưới ô lịch.
    -- Lý do: <input type="date"> hiển thị theo NGÔN NGỮ TRÌNH DUYỆT, không theo định dạng
    -- ngày của Windows — máy cài Chrome tiếng Anh ra mm/dd/yyyy dù Windows đã đổi sang
    -- dd/MM/yyyy (khách báo 23/09/2026). Giá trị gửi đi luôn đúng, chỉ chỗ nhìn là dễ lẫn:
    -- 09/07 không biết là 9 tháng 7 hay 7 tháng 9. Dòng này khử hẳn cái mơ hồ đó.
    -------------------------------------------*/
    _bindNgayHienThi: function (inputId, hintId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $in = $('#' + inputId), $hint = $('#' + hintId);
        if (!$in.length || !$hint.length) return;
        var ve = function () {
            var v = me._ngaySinhToUI($in.val() || '');
            // Gọn trong một dòng: dài quá là ô nhập bị bóp lại, mà chỗ cần đọc chỉ là con số
            $hint.attr('title', v ? ('Ngày đã chọn: ' + v + ' (ngày/tháng/năm)') : '')
                .html(v ? ('<b>' + v + '</b>') : '');
        };
        $in.off('.kqngay').on('input.kqngay change.kqngay', ve);
        // Gọi luôn 1 lần cho trường hợp mở hồ sơ cũ (giá trị đổ bằng code, không có sự kiện)
        ve();
        // Và vài nhịp sau, vì các hàm nạp form chạy async
        setTimeout(ve, 1200);
        setTimeout(ve, 2400);
    },

    /*------------------------------------------
    -- Chép Họ và tên (tab Cá nhân) sang Họ tên người mua hàng (tab Xuất hóa đơn).
    -- Bỏ qua khi người dùng đã tự gõ vào ô hóa đơn, hoặc khi hồ sơ đã có tên người
    -- mua lưu sẵn — xem _loadPersonInvoice.
    -------------------------------------------*/
    _autoFillHoaDonTen: function () {
        var $hd = $('#txtKQ_HD_NguoiMua');
        if (!$hd.length || $hd.attr('data-user-touched')) return;
        edu.util.viewValById('txtKQ_HD_NguoiMua', edu.system.getValById('txtKQ_HoTen') || '');
    },

    /*------------------------------------------
    -- Tự điền "Địa chỉ trên hóa đơn" theo cụm địa chỉ vừa chọn, cho đỡ gõ lại.
    -- KHÔNG đè khi: người dùng đã tự sửa ô đó, hoặc hồ sơ đã có địa chỉ hóa đơn
    -- lưu sẵn trong DB (_loadPersonInvoice đánh dấu luôn khi đổ lên).
    -- Hóa đơn có thể xuất cho đơn vị ở địa chỉ khác nên không được ép đồng bộ.
    -------------------------------------------*/
    _autoFillHoaDonDiaChi: function (kind) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $hd = $('#txtKQ_HD_DiaChi');
        if (!$hd.length || $hd.attr('data-user-touched')) return;
        var b = (me._collectAddrBlocks() || []).filter(function (x) { return x.kind === kind; })[0];
        if (!b || !edu.util.checkValue(b.full)) return;
        edu.util.viewValById('txtKQ_HD_DiaChi', b.full);
    },

    _clearAddrTouched: function () {
        $('#ddlKQ_NS_Tinh, #ddlKQ_NS_Huyen, #ddlKQ_NS_Xa,'
            + '#ddlKQ_HK_Tinh, #ddlKQ_HK_Huyen, #ddlKQ_HK_Xa,'
            + '#txtKQ_NoiSinh, #txtKQ_HK_SoNha,'
            // Cả ô Họ tên người mua: sang hồ sơ khác mà còn cờ "đã sửa tay" thì
            // ô đó sẽ không tự điền nữa, người dùng tưởng chức năng hỏng.
            + '#txtKQ_HD_DiaChi, #txtKQ_HD_NguoiMua').removeAttr('data-user-touched');
    },

    /*------------------------------------------
    -- Nghị định bỏ cấp huyện: nhiều tỉnh giờ chỉ còn 2 cấp Tỉnh → Xã.
    -- Với các tỉnh đó, genDropTinhThanh vẫn đổ con của Tỉnh vào ô "Quận/Huyện" —
    -- tức là ô Quận/Huyện đang chứa danh sách XÃ, còn ô Xã thì rỗng vĩnh viễn.
    -- Người dùng chọn xong lưu ra WARD_ID rỗng → "nhập vào lưu xong mất xã".
    --
    -- Nhận diện bằng chính dữ liệu, không hardcode danh sách tỉnh: nếu con của Tỉnh
    -- KHÔNG có cháu thì tỉnh đó 2 cấp. Tỉnh nào còn 3 cấp vẫn chạy như cũ.
    -------------------------------------------*/
    _apply2Cap: function (tinhSel, huyenSel, xaSel) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var dt = (edu.extend && edu.extend.dtTinhThanh) || [];
        var $huyen = $('#' + huyenSel);
        var tinhId = $('#' + tinhSel).val() || '';
        if (!tinhId || !dt.length) { $huyen.removeAttr('data-2cap'); return; }
        var con = dt.filter(function (e) { return e.QUANHECHA_ID === tinhId; });
        if (!con.length) { $huyen.removeAttr('data-2cap'); return; }
        var coChau = con.some(function (c) {
            return dt.some(function (e) { return e.QUANHECHA_ID === c.ID; });
        });
        if (coChau) { $huyen.removeAttr('data-2cap'); return; }   // tỉnh 3 cấp → giữ nguyên

        // --- Tỉnh 2 cấp ---
        // KHÔNG khoá ô Quận/Huyện: dữ liệu đang lẫn cả tỉnh cũ lẫn tỉnh mới, người dùng
        // chọn được tới đâu thì lưu tới đó. Chỉ đánh dấu để handler cascade đừng khoá ô Xã.
        $huyen.attr('data-2cap', '1');
        // Giữ lại lựa chọn hiện có nếu vẫn hợp lệ (tránh xoá khi hàm chạy lại ở mốc 250ms)
        var dangChon = $('#' + xaSel).val() || '';
        var conHopLe = con.some(function (c) { return c.ID === dangChon; });
        edu.system.loadToCombo_data({
            data: con,
            renderInfor: { id: 'ID', parentId: '', name: 'TEN', code: '', default_val: conHopLe ? dangChon : '' },
            renderPlace: [xaSel], type: '', title: 'Chọn phường/xã'
        });
        $('#' + xaSel).prop('disabled', false);
        me._reapplyKQSelect2(huyenSel);
        me._reapplyKQSelect2(xaSel);
    },

    /*------------------------------------------
    -- Apply select2 cho các dropdown có nhiều option (Quốc tịch/Dân tộc/Tỉnh/Huyện/Xã...)
    -- minimumResultsForSearch: 5 → dropdown < 5 items không hiện search box.
    -- dropdownParent: neo dropdown vào modal fullscreen để không bị z-index issue.
    -- placeholder + templateResult: ẩn option value="" khỏi dropdown list (option này chỉ
    -- làm placeholder ở field, không nên xuất hiện như 1 item chọn được).
    -------------------------------------------*/
    /*==========================================================================
    == CÁCH XEM FORM KHAI (yêu cầu khách hàng 11/09/2026)
    == "Gom tab 1,2,5,7 vào 1 tab — thông tin dàn trải cả trang khó nhìn —
    ==  cấu trúc xử lý không thay đổi, cho option các cách view."
    ==
    == Cách làm: các panel vốn đã là anh em cùng cấp trong .aps-sv-body nên chỉ cần
    == bật/tắt class active, KHÔNG dời DOM. Dời panel sẽ làm select2 đứt container
    == (select2 render ra thẻ anh em, tách khỏi <select> là hỏng), và id field đổi chỗ
    == thì mọi hàm lưu/nạp phải sửa theo. Bật/tắt thì không đụng gì tới luồng xử lý.
    ==========================================================================*/
    _PANEL_META: {
        kqdk_tab_canhan: { so: 1, icon: 'fa-id-badge', ten: 'Cá nhân' },
        kqdk_tab_cccd: { so: 2, icon: 'fa-address-card', ten: 'CCCD & Hộ khẩu' },
        kqdk_tab_xettuyen: { so: 3, icon: 'fa-file-pen', ten: 'Xét tuyển' },
        kqdk_tab_trungtuyen: { so: 4, icon: 'fa-award', ten: 'Trúng tuyển' },
        kqdk_tab_giadinh: { so: 5, icon: 'fa-people-roof', ten: 'Gia đình' },
        kqdk_tab_hoadon: { so: 6, icon: 'fa-file-invoice-dollar', ten: 'Xuất hóa đơn' },
        kqdk_tab_nguonkt: { so: 7, icon: 'fa-share-nodes', ten: 'Nguồn khai thác' },
        kqdk_tab_hoso: { so: 8, icon: 'fa-folder-open', ten: 'Danh mục hồ sơ' }
    },

    // Thứ tự gốc các bước — các chỗ validate cũ tham chiếu theo CHỈ SỐ của mảng này,
    // nên tab mới BẮT BUỘC thêm vào CUỐI (chèn giữa sẽ lệch hết _goToTabByIndex).
    _PANEL_ORDER: ['kqdk_tab_canhan', 'kqdk_tab_cccd', 'kqdk_tab_xettuyen',
        'kqdk_tab_trungtuyen', 'kqdk_tab_giadinh', 'kqdk_tab_hoadon', 'kqdk_tab_nguonkt',
        'kqdk_tab_hoso'],

    _viewMode: '',

    _nhomTheoCheDo: function (mode) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (mode === 'gom') {
            return [
                {
                    ten: 'Hồ sơ cá nhân', icon: 'fa-id-badge',
                    panels: ['kqdk_tab_canhan', 'kqdk_tab_cccd', 'kqdk_tab_giadinh', 'kqdk_tab_nguonkt']
                },
                { ten: 'Xét tuyển', icon: 'fa-file-pen', panels: ['kqdk_tab_xettuyen'] },
                { ten: 'Trúng tuyển', icon: 'fa-award', panels: ['kqdk_tab_trungtuyen'] },
                { ten: 'Xuất hóa đơn', icon: 'fa-file-invoice-dollar', panels: ['kqdk_tab_hoadon'] },
                // Danh mục hồ sơ đứng riêng: nó ghi thẳng xuống DB theo từng dòng,
                // gom chung với nhóm khai form sẽ gây hiểu nhầm là phải bấm "Lưu hồ sơ".
                { ten: 'Danh mục hồ sơ', icon: 'fa-folder-open', panels: ['kqdk_tab_hoso'] }
            ];
        }
        return me._PANEL_ORDER.map(function (pid) {
            var m = me._PANEL_META[pid] || {};
            return { ten: m.ten, icon: m.icon, so: m.so, panels: [pid] };
        });
    },

    _applyViewMode: function (mode) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (['buoc', 'gom', 'motrang'].indexOf(mode) < 0) mode = 'buoc';
        me._viewMode = mode;
        try { localStorage.setItem('kqdk_viewmode', mode); } catch (e) { }
        $('#kqdkViewOpts .kqdk-viewopt').removeClass('active')
            .filter('[data-view="' + mode + '"]').addClass('active');

        var $tabs = $('#kqdkKhaiTabs');
        if (mode === 'motrang') {
            $tabs.addClass('d-none').empty();
            $('#kqdk_khai .aps-sv-panel').addClass('active');
            return;
        }
        $tabs.removeClass('d-none');
        var nhom = me._nhomTheoCheDo(mode);
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var html = nhom.map(function (n, i) {
            return '<button type="button" class="aps-sv-tab' + (i === 0 ? ' active' : '') + '"'
                + ' data-panels="' + esc(n.panels.join(',')) + '"'
                + ' data-target="' + esc(n.panels[0]) + '">'
                + '<span class="aps-sv-tab-num">' + (i + 1) + '</span>'
                + '<i class="fa-light ' + esc(n.icon) + '"></i> ' + esc(n.ten) + '</button>';
        }).join('');
        $tabs.html(html);
        $('#kqdk_khai .aps-sv-panel').removeClass('active');
        nhom[0].panels.forEach(function (p) { $('#' + p).addClass('active'); });
    },

    /*==========================================================================
    == TAB 8 — DANH MỤC HỒ SƠ  (PKG_TUYENSINH_HOSO / controller TS_HoSo_MH)
    ==
    == Khác 7 tab trên: 1 hồ sơ có NHIỀU dòng danh mục nên tab này ghi từng dòng
    == xuống DB (Thêm / Sửa / Xóa), nhưng do nút "Lưu hồ sơ" / "Cập nhật hồ sơ"
    == chung ở cuối form kích hoạt (gộp 1 nút, 22/09/2026).
    ==
    == Khóa gắn kết:
    ==   strTS_HoSoDuTuyen_Id      = Id hồ sơ. Sửa: me.strSuaHoSo_Id. Khai mới: chưa có
    ==                               lúc gõ lưới → tra sau khi Them_HoSo_TS chạy xong
    ==                               (_findNewPersonId trả kèm HOSO_ID).
    ==   strTS_KeHoachTuyenSinh_Id = Id ĐỢT tuyển sinh (BE xác nhận, dù tên param là KeHoach)
    ==
    == 2 action LayDS/LayTT KHÔNG có trong tài liệu BE gửi, được suy ra từ quy tắc
    == sinh action của hệ thống: action = base64(XOR(tên_method, 'A')), ký tự đệm 'P'.
    == Quy tắc đã đối chiếu khớp 100% với các action có sẵn:
    ==   Them_TS_HoSo -> FSkkLB4VEh4JLhIu   Sua_TS_HoSo -> EjQgHhUSHgkuEi4P
    ==   Xoa_TS_HoSo  -> GS4gHhUSHgkuEi4P   LayDS_HoSo_TS_FULL -> DSA4BRIeCS4SLh4VEh4HFA0N
    == Nếu BE chưa expose 2 endpoint đó thì đổi lại 2 hằng dưới đây.
    ==========================================================================*/
    _ACT_HS: {
        LayDS: { action: 'TS_HoSo_MH/DSA4BRIVEh4JLhIu', func: 'pkg_tuyensinh_hoso.LayDSTS_HoSo' },
        LayTT: { action: 'TS_HoSo_MH/DSA4FRUVEh4JLhIu', func: 'pkg_tuyensinh_hoso.LayTTTS_HoSo' },
        Them: { action: 'TS_HoSo_MH/FSkkLB4VEh4JLhIu', func: 'pkg_tuyensinh_hoso.Them_TS_HoSo' },
        Sua: { action: 'TS_HoSo_MH/EjQgHhUSHgkuEi4P', func: 'pkg_tuyensinh_hoso.Sua_TS_HoSo' },
        Xoa: { action: 'TS_HoSo_MH/GS4gHhUSHgkuEi4P', func: 'pkg_tuyensinh_hoso.Xoa_TS_HoSo' }
    },

    _dtHoSoDM: [],          // cache danh sách dòng danh mục của hồ sơ đang mở
    _dtLoaiHoSo: [],        // data thô DM TUYENSINH.LOAIHOSO (tra tên theo Id)
    _suaHoSoDM_Id: '',      // Id dòng đang sửa; rỗng = đang ở chế độ Thêm
    _hsBound: false,

    /*------------------------------------------
    -- Gọi API mã hóa dùng chung cho tab 8
    -------------------------------------------*/
    _hsCall: function (objApi, obj, fnOk) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var payload = $.extend({
            'action': objApi.action,
            'func': objApi.func,
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        }, obj || {});

        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    if (typeof fnOk === 'function') fnOk(data.Data || [], data);
                } else {
                    // Hiện NGUYÊN message BE/CSDL trả về, không diễn giải lại — để còn
                    // chụp màn hình báo BE đúng nội dung lỗi gốc.
                    edu.system.alert(objApi.func + ": " + ((data && data.Message) || ''), "w");
                }
            },
            error: function (er) {
                edu.system.alert(objApi.func + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: payload.action,
            contentType: true,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Bind sự kiện tab 8 (chỉ chạy 1 lần)
    -------------------------------------------*/
    _bindHoSoDM: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._hsBound) return;
        me._hsBound = true;

        // Nút "Lưu danh mục" đã ẩn (gộp vào "Cập nhật hồ sơ" — xem saveSuaHoSo_Full).
        // Vẫn bind phòng khi bật lại nút đó trong HTML.
        $("#btnKQ_HS_Luu").on('click', function () { me._saveHoSoDM(); });
        // "Nhập lại" = bỏ những gì vừa gõ, vẽ lại lưới theo đúng dữ liệu dưới CSDL
        $("#btnKQ_HS_Reset").on('click', function () { me._genTable_HoSoDM(me._dtHoSoDM || []); });

        // Gõ số lượng → cập nhật ngay cột Tình trạng + dòng tổng, khỏi phải bấm Lưu mới thấy
        $("#tblKQ_HS").on('input', '.kqhs-sl', function () { me._hsCapNhatTinhTrang(); });

        // Lưới trắng vì chưa chọn đợt → đưa thẳng người dùng sang chỗ chọn, đỡ phải
        // tự mò xem "tab Trúng tuyển" nằm đâu.
        $("#tblKQ_HS").on('click', '.kqhs-gotodot', function () {
            me._goToPanel('kqdk_tab_trungtuyen');
            setTimeout(function () {
                var $s = $('#ddlKQ_DotTuyenSinh');
                // Đợt dùng select2 → focus vào ô gốc không thấy gì, phải mở dropdown
                if ($s.hasClass('select2-hidden-accessible')) { try { $s.select2('open'); return; } catch (e) { } }
                $s.focus();
            }, 250);
        });

        $("#tblKQ_HS").on('click', '.kqhs-del', function () {
            var id = $(this).attr('data-id');
            if (!edu.util.checkValue(id)) return;
            edu.system.confirm("Bạn có chắc chắn xóa dòng danh mục hồ sơ này không?");
            $("#btnYes").off("click").on("click", function () {
                // .off("click") gỡ luôn handler mặc định của systemroot (systemroot.js:5886
                // — nó lo ẩn nút Yes + dọn #alert_content), nên phải TỰ đóng hộp confirm:
                //   - không đóng thì nút Yes còn nguyên, bấm được nhiều lần → xóa lặp
                //   - cờ edu.system.flag_alert vẫn true → alert "Xóa thành công" bị APPEND
                //     vào chính hộp confirm đang mở thay vì mở hộp báo mới
                $("#btnYes").off("click");
                $('#myModalAlert').modal('hide');
                me._deleteHoSoDM(id);
            });
        });
    },

    /*------------------------------------------
    -- Nạp danh sách danh mục hồ sơ của hồ sơ đang mở.
    -- Gọi từ openSuaHoSo (sau khi đã có strSuaHoSo_Id + strDot_Id_ForKQ).
    -------------------------------------------*/
    _loadHoSoDM_ForEdit: function (strHoSoId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._bindHoSoDM();
        me._resetFormHoSoDM();

        /* KHAI MỚI (chưa có Id hồ sơ) — vẫn dựng lưới theo QUY ĐỊNH của đợt.
           Sếp Khoa 22/09/2026: "đây là khai báo từ đầu... học sinh mang theo giấy tờ gì
           thì phải ghim vào cho nó, chứ đâu phải nhận rồi mới thu hồ sơ".
           Chưa có khóa TS_HoSoDuTuyen_Id nên KHÔNG gọi API ở đây: số đã nộp được giữ
           trên DOM, saveKhai_HoSo chụp lại rồi gửi ngay sau khi Them_HoSo_TS tạo xong
           hồ sơ và tra được Id (xem _saveHoSoDM_Rows). */
        if (!edu.util.checkValue(strHoSoId)) {
            $('#kqdk_hs_chualuu').removeClass('d-none');
            $('#kqdk_hs_zone').removeClass('d-none');
            me._hsLayQuyDinh(function () {
                me._genTable_HoSoDM([]);
                if (typeof cb === 'function') cb([]);
            });
            return;
        }
        $('#kqdk_hs_chualuu').addClass('d-none');
        $('#kqdk_hs_zone').removeClass('d-none');

        var xong = function (rows) {
            me._genTable_HoSoDM(rows || []);
            if (typeof cb === 'function') cb(rows || []);
        };

        /* Hai cách lọc, thử lần lượt (cùng kiểu loadKQDK_List dò LayDS_HoSo_TS_FULL):

           [1] Lọc theo HỒ SƠ — đúng nghiệp vụ, chỉ ra giấy tờ của thí sinh đang mở.
               Nhánh này trong proc từng văng "ORA-24338: statement handle not executed"
               (21/09/2026), nhưng BE có sửa proc nên phải thử lại mỗi lần.
           [2] Hỏng thì lùi về lọc theo ĐỢT. Lưu ý: khi ParamTS_HoSoDuTuyen_Id rỗng,
               proc CHỈ trả các dòng có TS_HOSODUTUYEN_ID = NULL (tức danh mục khai ở
               mức đợt) — không phải "tất cả". Đo được: thêm 1 dòng gắn đúng Id thí sinh
               thì Them_ ghi đúng cả 2 Id (kiểm chứng qua LayTTTS_HoSo theo strId),
               nhưng lọc kiểu [2] không thấy nó.
               → Bảng khi đó hiện danh mục mức đợt, còn hơn để trắng.

           Tên param phân trang là pageIndex/pageSize theo entity C#, KHÔNG phải
           PageNumber/ItemPerPage của proc Oracle. */
        var goiLayDS = function (theoHoSo, khiHong) {
            var A = me._ACT_HS.LayDS;
            var nhanKetQua = function (data) {
                if (data && data.Success) { xong(data.Data || []); return; }
                if (khiHong) { khiHong(); return; }
                edu.system.alert(A.func + ": " + ((data && data.Message) || ''), "w");
                xong([]);
            };
            edu.system.makeRequest({
                success: nhanKetQua,
                error: function (er) {
                    if (khiHong) { khiHong(); return; }
                    edu.system.alert(A.func + " (er): " + JSON.stringify(er), "w");
                    xong([]);
                },
                type: 'POST', contentType: true, action: A.action,
                data: {
                    'action': A.action, 'func': A.func, 'iM': edu.system.iM,
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strNguoiThucHien_Id': edu.system.userId,
                    'pageIndex': 1,
                    'pageSize': 500,
                    'strTS_HoSoDuTuyen_Id': theoHoSo ? strHoSoId : '',
                    'strLoaiHoSo_Id': '',
                    'strTS_KeHoachTuyenSinh_Id': me.strDot_Id_ForKQ || '',
                    'strNguoiTao_Id': '',
                    'strTuKhoa': ''
                },
                fakedb: []
            }, false, false, false, null);
        };

        // Lấy QUY ĐỊNH của đợt trước (khung của bảng), rồi mới lấy số đã nộp của thí sinh
        me._hsLayQuyDinh(function () {
            goiLayDS(true, function () { goiLayDS(false, null); });
        });
    },

    /*------------------------------------------
    -- Danh mục hồ sơ QUY ĐỊNH cho đợt tuyển sinh — chính là dữ liệu khai ở modal
    -- "Khai danh mục hồ sơ giấy tờ" (cột Khai ở bảng Các đợt).
    -- Đây là KHUNG của lưới tab 8: đợt khai bao nhiêu loại thì thí sinh hiện bấy nhiêu dòng,
    -- KHÔNG liệt kê cả danh mục TUYENSINH.LOAIHOSO (sếp Tuấn chốt 22/09/2026).
    -- Cache theo Id đợt; đổi đợt là nạp lại.
    -------------------------------------------*/
    /*------------------------------------------
    -- Đợt đang áp dụng cho hồ sơ đang mở. Mỗi đợt gắn một HỆ đào tạo (TS_CD_… = cao đẳng),
    -- nên lấy quy định theo đợt này chính là lấy đúng bộ hồ sơ của hệ đó.
    -- Ưu tiên dropdown "Đợt tuyển sinh" ngay trên form (tab Trúng tuyển) vì đó là đợt THẬT
    -- của hồ sơ; strDot_Id_ForKQ chỉ là context lúc mở modal, có thể rỗng hoặc lệch khi
    -- vào thẳng từ danh sách Kết quả đăng ký.
    -------------------------------------------*/
    /*------------------------------------------
    -- Badge "kế hoạch — đợt" ở tiêu đề modal Kết quả đăng ký.
    -- Mục đích: khai mới / sửa hồ sơ đều biết đang làm việc trên HỆ nào, khỏi nhập nhầm
    -- kế hoạch (sếp Khoa 23/09/2026). Đợt chưa xác định thì nói thẳng là chưa chọn,
    -- KHÔNG để trống — trống thì người dùng tưởng đã đúng.
    -------------------------------------------*/
    _veBadgeKeHoach: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $b = $('#lblKQDK_KeHoach');
        if (!$b.length) return;

        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var tenMa = function (arr, id) {
            for (var i = 0; i < (arr || []).length; i++) {
                var d = arr[i];
                if (String(d.ID || d.Id || d.id || '') !== String(id)) continue;
                var ma = d.MA || d.Ma || d.KEHOACH_MA || '';
                var ten = d.TEN || d.Ten || d.KEHOACH_TEN || '';
                return (ten && ma && ten !== ma) ? (ten + ' (' + ma + ')') : (ten || ma || '');
            }
            return '';
        };

        var kh = tenMa(me.dtKeHoachTuyenSinh, me.strKeHoachTuyenSinh_Id);
        // Đặt display tường minh chứ không dùng .show(): CSS đang khai display:none,
        // .show() trả về giá trị mặc định của thẻ nên dễ hiện sai kiểu.
        if (!kh) { $b.html('').css('display', 'none'); return; }

        var dotId = me._hsDotHienTai();
        var dot = dotId ? tenMa(me.dtDotTuyenSinh, dotId) : '';
        if (!dot && dotId) dot = ($('#ddlKQ_DotTuyenSinh option:selected').text() || '').trim();

        $b.html('<i class="fa-light fa-layer-group"></i> ' + esc(kh)
            + (dot
                ? ('<span class="kqdk-badge-sep">›</span><span class="kqdk-badge-dot">' + esc(dot) + '</span>')
                : '<span class="kqdk-badge-sep">›</span><span style="color:#b45309;">chưa chọn đợt</span>'))
            .css('display', 'inline-block');
    },

    _hsDotHienTai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var v = ($('#ddlKQ_DotTuyenSinh').val() || '') || me.strDot_Id_ForKQ || '';
        if (v) return v;
        /* Cứu cánh cuối: suy đợt từ NGUYỆN VỌNG ĐẦU RA của hồ sơ.
           Cần vì cả LayDS_HoSo_TS lẫn LayTT_HoSo_TS đều KHÔNG trả đợt (đo 23/09/2026),
           nên mở hồ sơ thẳng từ danh sách là đợt rỗng → dropdown Nguyện vọng nạp ra rỗng
           → bấm Cập nhật thì báo "Khong ton tai ho so tuyen sinh". */
        var nv = me._nvDauRaHienTai();
        var dr = nv ? ((me._kqDauRaMap || {})[nv] || null) : null;
        return (dr && dr.dotId) ? dr.dotId : '';
    },

    /*------------------------------------------
    -- Nguyện vọng đầu ra của hồ sơ đang mở.
    -- Ưu tiên dropdown trên form; dropdown chưa nạp được (vì đợt rỗng) thì lấy thẳng
    -- từ dòng hồ sơ trong cache danh sách — dữ liệu đó luôn có NGUYENVONG_DAURA_ID.
    -------------------------------------------*/
    _nvDauRaHienTai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var v = edu.system.getValById('ddlKQ_NguyenVongDauRa') || '';
        if (v) return v;
        if (!edu.util.checkValue(me.strSuaHoSo_Id)) return '';
        var rows = me.dtKQDK_HoSo || [];
        for (var i = 0; i < rows.length; i++) {
            if (me._kqPick(rows[i], ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']) === me.strSuaHoSo_Id) {
                return me._kqPick(rows[i], ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']) || '';
            }
        }
        return '';
    },

    _hsLayQuyDinh: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(me._dtQuyDinhHS || []); };
        var dotId = me._hsDotHienTai();
        if (me._dtQuyDinhHS && me._dtQuyDinhHS_Dot === dotId) { xong(); return; }
        if (!edu.util.checkValue(dotId)) { me._dtQuyDinhHS = []; me._dtQuyDinhHS_Dot = dotId; xong(); return; }

        // Cần danh mục Tính chất hồ sơ để đổi Id → tên hiển thị
        me._qdhsEnsureDM(function () {
            edu.system.makeRequest({
                success: function (data) {
                    me._dtQuyDinhHS = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                    me._dtQuyDinhHS_Dot = dotId;
                    xong();
                },
                error: function () {
                    me._dtQuyDinhHS = [];
                    me._dtQuyDinhHS_Dot = dotId;
                    xong();
                },
                type: 'POST',
                contentType: true,
                action: me._ACTION_QDHS_LayDS,
                data: {
                    'action': me._ACTION_QDHS_LayDS,
                    'func': 'pkg_tuyensinh_kehoach.LayDSTS_QuyDinhHoSo',
                    'iM': edu.system.iM,
                    'strTuKhoa': '',
                    // ⚠ Param mang tên KeHoachTuyenSinh nhưng BE nhận Id ĐỢT
                    'strTS_KeHoachTuyenSinh_Id': dotId,
                    'strLoaiHoSo_Id': '',
                    'strNguoiTao_Id': '',
                    'pageIndex': 1,
                    'pageSize': 500
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Id tính chất hồ sơ → tên hiển thị (DM TUYENSINH.TINHCHATHOSO).
    -------------------------------------------*/
    /*------------------------------------------
    -- Badge cạnh tiêu đề: đang lấy quy định theo đợt/hệ nào.
    -------------------------------------------*/
    _hsVeBadgeDot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $b = $('#lblKQ_HS_Dot');
        if (!$b.length) return;
        var dotId = me._hsDotHienTai();
        if (!edu.util.checkValue(dotId)) {
            $b.text('').hide();
            return;
        }
        var ten = '';
        (me.dtDotTuyenSinh || []).forEach(function (d) {
            if (String(d.ID || d.Id || d.id || '') !== String(dotId)) return;
            var ma = d.MA || d.Ma || '', t = d.TEN || d.Ten || '';
            ten = (t && ma && t !== ma) ? (t + ' (' + ma + ')') : (t || ma);
        });
        if (!ten) ten = ($('#ddlKQ_DotTuyenSinh option:selected').text() || '').trim();
        $b.text(ten ? ('Theo đợt: ' + ten) : '').toggle(!!ten);
    },

    _hsTenTinhChat: function (id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(id)) return '';
        var dt = me.dtQDHS_TinhChatHoSo || [];
        for (var i = 0; i < dt.length; i++) {
            if (String(dt[i].ID || dt[i].Id || dt[i].id) === String(id)) {
                return dt[i].TEN || dt[i].Ten || '';
            }
        }
        return '';
    },

    /*------------------------------------------
    -- Dựng bảng + dòng tổng ở tfoot (quy ước: bảng có cột số phải có tổng)
    -------------------------------------------*/
    /* LƯỚI NHẬP HÀNG LOẠT — khung lấy từ QUY ĐỊNH của đợt.
       Sếp Tuấn chốt 22/09/2026: "trong phần khai báo danh mục của từng hệ, mình đã khai báo
       hồ sơ cần nộp của từng hệ rồi" → tab 8 CHỈ hiện đúng các loại hồ sơ đã khai cho đợt
       (modal "Khai danh mục hồ sơ giấy tờ" ở bảng Các đợt, pkg_tuyensinh_kehoach.*_TS_QuyDinhHoSo),
       KHÔNG liệt kê cả danh mục TUYENSINH.LOAIHOSO.
       Hai nguồn ghép lại:
         - _dtQuyDinhHS  (theo ĐỢT)  → khung bảng: loại hồ sơ, tính chất, SỐ LƯỢNG CẦN NỘP
         - rows           (theo HỒ SƠ) → số đã nộp + mô tả của chính thí sinh đang mở
       Cán bộ chỉ điền cột "Đã nộp"; dòng để trống thì không gọi API (xem _saveHoSoDM). */
    _genTable_HoSoDM: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var pick = me._kqPick;
        me._dtHoSoDM = rows || [];

        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var num = function (v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
        var qd = me._dtQuyDinhHS || [];

        me._hsVeBadgeDot();
        if (!qd.length) {
            var chuaCoDot = !edu.util.checkValue(me._hsDotHienTai());
            $('#tblKQ_HS tbody').html('<tr><td class="kqhs-empty" colspan="8">'
                + (chuaCoDot
                    ? ('Chưa chọn <b>đợt tuyển sinh</b> nên chưa biết lấy danh mục của hệ nào.<br/>'
                        + '<button type="button" class="aps-sv-btn aps-sv-btn-primary kqhs-gotodot" '
                        + 'style="margin-top:10px;"><i class="fa-light fa-arrow-right"></i> '
                        + 'Chọn đợt tuyển sinh</button>')
                    : ('Đợt tuyển sinh này chưa khai danh mục hồ sơ cần nộp.<br/>'
                        + 'Vào <b>Các đợt tuyển sinh</b> → cột <b>“Khai danh mục hồ sơ”</b> để khai trước.'))
                + '</td></tr>');
            $('#tblKQ_HS tfoot').addClass('d-none');
            $('#lblKQ_HS_Tong').text('(0)');
            return;
        }

        // Số đã nộp của thí sinh, tra theo loại hồ sơ
        var daNopTheoLoai = {};
        me._dtHoSoDM.forEach(function (r) {
            var k = String(pick(r, ['LOAIHOSO_ID', 'LoaiHoSo_Id']) || '');
            if (k) daNopTheoLoai[k] = r;
        });

        me._hsVeBadgeDot();

        var html = '';
        for (var i = 0; i < qd.length; i++) {
            var q = qd[i] || {};
            var loaiId = String(me._pickLoose(q, ['LOAIHOSO_ID', 'LOAI_HOSO_ID']) || '');
            if (!loaiId) continue;
            var r = daNopTheoLoai[loaiId] || null;

            var id = r ? String(pick(r, ['ID', 'Id', 'TS_HOSO_ID']) || '') : '';
            // Cần nộp = SỐ LƯỢNG trong quy định của đợt (không phải số cán bộ tự gõ)
            var canNop = num(me._pickLoose(q, ['SOLUONG', 'SO_LUONG'])) || 1;
            var daNop = r ? num(pick(r, ['SOLUONG', 'SoLuong', 'SL_DANOP'])) : '';
            var moTa = r ? pick(r, ['MOTA', 'MoTa', 'GHICHU']) : '';
            var tenLoai = me._pickLoose(q, ['LOAIHOSO_TEN', 'LOAI_HOSO_TEN'])
                || me._tenLoaiHoSo(loaiId);
            var tinhChat = me._pickLoose(q, ['TINHCHATHOSO_TEN', 'TINHCHAT_HOSO_TEN'])
                || me._hsTenTinhChat(me._pickLoose(q, ['TINHCHATHOSO_ID', 'TINHCHAT_HOSO_ID']));

            html += '<tr' + (r ? ' class="kqhs-dalu"' : '') + ' data-loai="' + esc(loaiId) + '"'
                + ' data-id="' + esc(id) + '"'
                + ' data-can="' + canNop + '"'
                + ' data-goc-sl="' + esc(daNop) + '"'
                + ' data-goc-mota="' + esc(moTa) + '">'
                + '<td class="kqhs-ct">' + (i + 1) + '</td>'
                + '<td>' + esc(tenLoai || '-') + '</td>'
                + '<td class="kqhs-ct">' + esc(tinhChat) + '</td>'
                + '<td class="kqhs-num">' + canNop + '</td>'
                + '<td class="kqhs-ct"><input type="number" min="0" step="1" class="kqhs-in kqhs-sl"'
                + ' value="' + esc(daNop) + '" placeholder="—"></td>'
                + '<td class="kqhs-ct"><span class="kqhs-tag"></span></td>'
                + '<td><input type="text" class="kqhs-in kqhs-mota" value="' + esc(moTa) + '"'
                + ' placeholder="Ghi chú (nếu có)"></td>'
                + '<td class="kqhs-ct">'
                + (id ? ('<button type="button" class="kqhs-ibtn kqhs-del" data-id="' + esc(id)
                    + '" title="Xóa dòng đã lưu"><i class="fa-light fa-trash-can"></i></button>') : '')
                + '</td>'
                + '</tr>';
        }
        $('#tblKQ_HS tbody').html(html);
        $('#tblKQ_HS tfoot').removeClass('d-none');
        $('#lblKQ_HS_Tong').text('(' + me._dtHoSoDM.length + '/' + qd.length + ')');
        me._hsCapNhatTinhTrang();
    },

    /*------------------------------------------
    -- Tính lại cột Tình trạng + dòng tổng theo số đang gõ trên lưới.
    -- Ô để trống = chưa khai → không tô "Thiếu" cho đỡ đỏ cả bảng.
    -------------------------------------------*/
    _hsCapNhatTinhTrang: function () {
        var tongCan = 0, tongDa = 0;
        $('#tblKQ_HS tbody tr[data-loai]').each(function () {
            var $r = $(this);
            var can = parseInt($r.attr('data-can'), 10) || 0;
            var v = $.trim($r.find('.kqhs-sl').val() || '');
            var $tag = $r.find('.kqhs-tag');
            tongCan += can;
            if (v === '') {
                $tag.attr('class', 'kqhs-tag').text('—');
                return;
            }
            var da = parseInt(v, 10) || 0;
            tongDa += da;
            var du = (can > 0 && da >= can);
            $tag.attr('class', 'kqhs-tag ' + (du ? 'ok' : 'thieu')).text(du ? 'Đủ' : 'Thiếu');
        });
        $('#lblKQ_HS_TongCanNop').text(tongCan);
        $('#lblKQ_HS_TongDaNop').text(tongDa);
    },

    /*------------------------------------------
    -- Tra tên loại hồ sơ theo Id từ data thô danh mục
    -------------------------------------------*/
    _tenLoaiHoSo: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(strId)) return '';
        var dt = me._dtLoaiHoSo || [];
        for (var i = 0; i < dt.length; i++) {
            if (String(dt[i].ID) === String(strId)) return dt[i].TEN || dt[i].NAME || '';
        }
        return '';
    },

    /*------------------------------------------
    -- Giữ lại cho tương thích: luồng cũ (form thêm từng dòng) gọi hàm này.
    -- Lưới nhập hàng loạt không còn form nên chỉ việc vẽ lại theo dữ liệu CSDL.
    -------------------------------------------*/
    _resetFormHoSoDM: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._suaHoSoDM_Id = '';
    },

    /*------------------------------------------
    -- Lưu cả lưới một lượt (yêu cầu sếp Tuấn 21/09/2026).
    -- Quy tắc:
    --   - Dòng CHƯA có trong CSDL và để trống ô "Đã nộp" → BỎ QUA, không gọi API.
    --   - Dòng CHƯA có, có nhập → Them_TS_HoSo.
    --   - Dòng ĐÃ có, giá trị đổi so với lúc nạp → Sua_TS_HoSo (so với data-goc-*).
    --   - Dòng ĐÃ có, không đổi gì → bỏ qua, khỏi bắn request thừa.
    -- "Cần nộp" lấy từ data-can (chỉ xem, không cho sửa — là quy định).
    --
    -- cb: truyền vào thì hàm KHÔNG tự alert và KHÔNG reload, mà gọi cb({done,failed,total,loi}).
    --     Dùng khi gộp vào nút "Cập nhật hồ sơ" (saveSuaHoSo_Full) — phải gộp chung một
    --     thông báo, vì BS3 chồng alert sẽ gỡ body.modal-open làm modal tự đóng.
    -------------------------------------------*/
    /*------------------------------------------
    -- Thu những dòng CẦN GHI trên lưới (đọc thẳng DOM).
    -- Tách riêng vì luồng KHAI MỚI phải chụp lưới TRƯỚC khi gọi Them_HoSo_TS:
    -- lúc callback về thì resetKhai_HoSo() đã xoá trắng lưới rồi.
    -------------------------------------------*/
    _hsThuLuoi: function () {
        var chuan = function (v) { return String(v == null ? '' : v).trim(); };
        /* Param Oracle kiểu NUMBER: gửi "" thì proc Success nhưng không ghi. Mà entity
           HoSo_MHEntity khai dSoLuong/dSoLuongCanNop là `double` NON-NULLABLE nên gửi null
           là HTTP 500 "Error converting value {null} to type 'System.Double'" → quy về số. */
        var so = function (v) { var n = parseInt(chuan(v), 10); return isNaN(n) ? 0 : n; };

        var viec = [];
        $('#tblKQ_HS tbody tr[data-loai]').each(function () {
            var $r = $(this);
            var id = chuan($r.attr('data-id'));
            var slMoi = chuan($r.find('.kqhs-sl').val());
            var motaMoi = chuan($r.find('.kqhs-mota').val());
            var slGoc = chuan($r.attr('data-goc-sl'));
            var motaGoc = chuan($r.attr('data-goc-mota'));

            if (!id) {
                // Chưa từng khai: không nhập gì thì thôi, đúng ý "cột nào ko nhập thì ko lưu"
                if (slMoi === '' && motaMoi === '') return;
            } else {
                // Đã khai: chỉ gửi khi thật sự có thay đổi
                if (slMoi === slGoc && motaMoi === motaGoc) return;
            }
            viec.push({
                id: id,
                loai: chuan($r.attr('data-loai')),
                can: so($r.attr('data-can')),
                sl: so(slMoi),
                mota: motaMoi
            });
        });
        return viec;
    },

    _saveHoSoDM: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var goiCb = function (kq) { if (typeof cb === 'function') cb(kq); };

        if (!edu.util.checkValue(me.strSuaHoSo_Id)) {
            if (cb) { goiCb({ done: 0, failed: 0, total: 0, loi: [] }); return false; }
            edu.system.alert("Cần lưu hồ sơ trước khi khai danh mục hồ sơ!", "w");
            return false;
        }

        var viec = me._hsThuLuoi();
        if (!viec.length) {
            if (cb) { goiCb({ done: 0, failed: 0, total: 0, loi: [] }); return false; }
            edu.system.alert("Không có thay đổi nào để lưu.", "w");
            return false;
        }
        me._saveHoSoDM_Rows(me.strSuaHoSo_Id, me._hsDotHienTai(), viec, cb, true);
    },

    /*------------------------------------------
    -- Gửi các dòng đã thu xuống BE. Tách khỏi _saveHoSoDM để luồng KHAI MỚI gọi lại
    -- được với Id hồ sơ vừa tạo (lúc đó lưới trên DOM đã bị dọn).
    --   cb      : có thì KHÔNG tự alert/reload, để người gọi gộp chung một thông báo
    --             (chồng alert là BS3 gỡ body.modal-open → modal tự đóng).
    --   taiLai  : chỉ true khi đang ở form Sửa và muốn nạp lại lưới sau khi lưu xong.
    -------------------------------------------*/
    _saveHoSoDM_Rows: function (strHoSoId, strDotId, viec, cb, taiLai) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var goiCb = function (kq) { if (typeof cb === 'function') cb(kq); };
        viec = viec || [];

        if (!edu.util.checkValue(strHoSoId) || !viec.length) {
            goiCb({ done: 0, failed: 0, total: viec.length, loi: [], thieuId: !edu.util.checkValue(strHoSoId) });
            return false;
        }

        var done = 0, failed = 0, total = viec.length, loi = [];
        var finalize = function () {
            if (done + failed !== total) return;
            if (cb) {
                // Người gọi tự lo thông báo + điều hướng (tránh chồng alert)
                goiCb({ done: done, failed: failed, total: total, loi: loi });
                return;
            }
            var msg = "Đã lưu " + done + "/" + total + " dòng";
            if (failed) msg += " (lỗi: " + failed + ")" + (loi.length ? "<br/>" + loi.slice(0, 5).join("<br/>") : "");
            edu.system.alert(msg, failed ? "w" : "s");
            if (taiLai) me._loadHoSoDM_ForEdit(strHoSoId);
        };

        viec.forEach(function (v) {
            var api = v.id ? me._ACT_HS.Sua : me._ACT_HS.Them;
            var d = {
                'action': api.action, 'func': api.func, 'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'strTS_HoSoDuTuyen_Id': strHoSoId,
                'strTS_KeHoachTuyenSinh_Id': strDotId || '',   // Id ĐỢT tuyển sinh
                'strLoaiHoSo_Id': v.loai,
                'dSoLuongCanNop': v.can,
                'dSoLuong': v.sl,
                'strMoTa': v.mota
            };
            if (v.id) d.strId = v.id;
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) done++;
                    else { failed++; if (data && data.Message) loi.push(api.func + ": " + data.Message); }
                    finalize();
                },
                error: function (er) {
                    failed++;
                    loi.push(api.func + " (er): " + JSON.stringify(er));
                    finalize();
                },
                type: 'POST', contentType: true, action: api.action, data: d, fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Xóa 1 dòng (ParamIds nhận danh sách Id, ở đây gửi 1)
    -------------------------------------------*/
    _deleteHoSoDM: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._hsCall(me._ACT_HS.Xoa, { 'strIds': strId }, function () {
            edu.system.alert("Xóa danh mục hồ sơ thành công!", "s");
            if (me._suaHoSoDM_Id === strId) me._resetFormHoSoDM();
            me._loadHoSoDM_ForEdit(me.strSuaHoSo_Id);
        });
    },

    /*------------------------------------------
    -- Nhảy tới panel theo ID, dùng chung cho validate. Chế độ nào cũng chạy:
    -- có tab thì click đúng tab chứa panel, chế độ Một trang thì cuộn tới nơi.
    -------------------------------------------*/
    _goToPanel: function (panelId) {
        if (!panelId) return;
        var $btn = $('#kqdkKhaiTabs .aps-sv-tab').filter(function () {
            var ds = ',' + ($(this).attr('data-panels') || $(this).attr('data-target') || '') + ',';
            return ds.indexOf(',' + panelId + ',') >= 0;
        }).first();
        if ($btn.length) $btn.trigger('click');
        var el = document.getElementById(panelId);
        if (el && el.scrollIntoView) {
            try { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(); }
        }
    },

    // Giữ nguyên cách gọi cũ theo chỉ số 0..6 của 7 bước gốc
    _goToTabByIndex: function (idx) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._goToPanel(me._PANEL_ORDER[idx] || me._PANEL_ORDER[0]);
    },

    _initViewMode: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._viewBound) return;
        me._viewBound = true;
        $('#kqdkViewOpts').on('click', '.kqdk-viewopt', function () {
            me._applyViewMode($(this).attr('data-view'));
        });
        $('#kqdkWidthToggle').on('click', function () {
            var $f = $('#kqdk_khai .aps-sv-form').toggleClass('kqdk-narrow');
            var hep = $f.hasClass('kqdk-narrow');
            $(this).find('span').text(hep ? 'Khổ vừa' : 'Khổ rộng');
            try { localStorage.setItem('kqdk_narrow', hep ? '1' : '0'); } catch (e) { }
        });
        var mode = 'buoc', hep = '1';
        try {
            mode = localStorage.getItem('kqdk_viewmode') || 'buoc';
            hep = localStorage.getItem('kqdk_narrow');
            if (hep === null) hep = '1';        // mặc định bó khổ cho dễ đọc
        } catch (e) { }
        $('#kqdk_khai .aps-sv-form').toggleClass('kqdk-narrow', hep === '1');
        $('#kqdkWidthToggle').find('span').text(hep === '1' ? 'Khổ vừa' : 'Khổ rộng');
        me._applyViewMode(mode);
    },

    initKhai_Select2: function () {
        if (typeof $.fn.select2 !== 'function') return;
        var me = main_doc.KeHoachTuyenSinhNew;
        var dropIds = [
            // Tab 1 - Cá nhân
            'ddlKQ_GioiTinh', 'ddlKQ_QuocTich', 'ddlKQ_DanToc', 'ddlKQ_TonGiao',
            'ddlKQ_NS_Tinh', 'ddlKQ_NS_Huyen', 'ddlKQ_NS_Xa',
            // Tab 2 - Hộ khẩu
            'ddlKQ_HK_Tinh', 'ddlKQ_HK_Huyen', 'ddlKQ_HK_Xa',
            // Tab 3 - Xét tuyển
            'ddlKQ_PhuongThuc', 'ddlKQ_DoiTuongTS', 'ddlKQ_DoiTuongUT',
            'ddlKQ_KhuVucUT', 'ddlKQ_Truong12', 'ddlKQ_HocLuc', 'ddlKQ_HanhKiem',
            // Tab 4 - Trúng tuyển (nạp async → _load* sẽ _reapplyKQSelect2 lại sau khi có option)
            'ddlKQ_DotTuyenSinh', 'ddlKQ_NguyenVongDauRa', 'ddlKQ_LopDuKien', 'ddlKQ_CoSoDaoTao',
            // Tab 6 - Xuất hóa đơn
            'ddlKQ_HD_DoiTuong', 'ddlKQ_HD_HinhThucTT',
            // Tab 7 - Nguồn khai thác
            'ddlKQ_NguonKhaiThac',
            // Tab 8: dropdown loại hồ sơ đã bỏ khỏi giao diện (lưới nhập hàng loạt thay thế),
            // chỉ còn thẻ select ẩn làm chỗ nạp DM → không cần select2 nữa.
            // 'ddlKQ_HS_LoaiHoSo'
        ];
        for (var i = 0; i < dropIds.length; i++) {
            me._applyKQSelect2(dropIds[i]);
        }
        me._bindKQSelectKeyboard();
    },

    _bindKQSelectKeyboard: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me._kqSelectKeyboardBound) return;
        me._kqSelectKeyboardBound = true;

        $(document).on('focusin.kqselecttypeahead', '#ket-qua-dk .select2-selection--single', function () {
            var $select = $(this).closest('.select2-container').prev('select');
            if (!$select.length || !$select.hasClass('select2-hidden-accessible')) return;
            me._kqActiveSelect = $select[0];
            if (!$('.select2-container--open').length) $select.select2('open');
        });

        var moveKQSelectFocus = function ($select, reverse) {
            if (!$select.length) return false;

            var $focusables = $('#kqdk_khai').find(
                'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled),'
                + ' button:not(:disabled), .select2-selection--single'
            ).filter(':visible').filter(function () {
                return $(this).attr('tabindex') !== '-1';
            });
            var $selection = $select.nextAll('.select2-container').first().find('.select2-selection--single');
            var index = $focusables.index($selection);
            if (index < 0) return false;

            var nextIndex = index + (reverse ? -1 : 1);
            if (nextIndex < 0 || nextIndex >= $focusables.length) return false;

            $select.select2('close');
            $focusables.eq(nextIndex).trigger('focus');
            return true;
        };

        $(document).on('keydown.kqselecttypeahead', '#ket-qua-dk .select2-search__field', function (e) {
            if (e.key !== 'Tab') return;

            var $select = $(me._kqActiveSelect);
            if (!$select.length) return;
            if (moveKQSelectFocus($select, e.shiftKey)) e.preventDefault();
        });

        $(document).on('keydown.kqselecttypeahead', '#ket-qua-dk .select2-selection--single', function (e) {
            var $selection = $(this);
            var $select = $selection.closest('.select2-container').prev('select');
            if (!$select.length || !$select.hasClass('select2-hidden-accessible')) return;
            me._kqActiveSelect = $select[0];

            if (e.key === 'Tab') {
                if (moveKQSelectFocus($select, e.shiftKey)) e.preventDefault();
                return;
            }
            if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;

            var firstKey = e.key;
            e.preventDefault();
            $select.select2('open');

            setTimeout(function () {
                var $search = $('.select2-container--open .select2-search__field:visible').first();
                if ($search.length) {
                    $search.val(firstKey).trigger('input').focus();
                    return;
                }

                var needle = firstKey.toLocaleLowerCase();
                var $match = $select.find('option').filter(function () {
                    var text = ($(this).text() || '').trim().toLocaleLowerCase();
                    return $(this).val() !== '' && (text.indexOf(needle) === 0 || text.indexOf(needle) >= 0);
                }).first();
                if ($match.length) $select.val($match.val()).trigger('change');
            }, 0);
        });
    },

    /*------------------------------------------
    -- Apply select2 cho 1 dropdown (dùng chung cho init + re-apply cascade).
    -------------------------------------------*/
    _applyKQSelect2: function (id) {
        var $el = $('#' + id);
        if (!$el.length) return;
        if ($el.hasClass('select2-hidden-accessible')) return;
        // Đọc text option value="" đầu tiên làm placeholder, sau đó XÓA text đó.
        // templateResult sẽ ẩn option có text rỗng (chỉ placeholder có text rỗng, DM items luôn có text).
        var $firstOpt = $el.find('option').filter(function () { return $(this).val() === ''; }).first();
        var placeholder = ($firstOpt.length ? $firstOpt.text() : '') || 'Chọn';
        if ($firstOpt.length) $firstOpt.text('');
        $el.select2({
            width: '100%',
            dropdownParent: $('#ket-qua-dk'),
            minimumResultsForSearch: 5,
            placeholder: placeholder,
            // Cho phép bỏ chọn: option rỗng bị templateResult ẩn khỏi danh sách nên nếu
            // không có nút "×" thì user chọn nhầm là mắc kẹt, không quay lại trống được.
            allowClear: true,
            templateResult: function (state) {
                // Ẩn item có text rỗng khỏi dropdown list (VD: placeholder option đã bị clear text).
                // Các DM item luôn có text ("Nam", "Nữ", "Khác"...) → không bị ảnh hưởng.
                var t = (state && state.text) ? String(state.text).trim() : '';
                if (t === '') return null;
                return state.text;
            }
        });
        $el.closest('.aps-sv-select').addClass('select2-applied');
    },

    /*------------------------------------------
    -- Reset toàn bộ form khai + về tab đầu
    -------------------------------------------*/
    resetKhai_HoSo: function () {
        // Reset trạng thái lock lưu hồ sơ
        main_doc.KeHoachTuyenSinhNew._isSavingKhai = false;
        main_doc.KeHoachTuyenSinhNew._isSavingSua = false;
        $('#btnKhaiSave').prop('disabled', false).removeClass('disabled');

        // Sang hồ sơ khác → quên bản ghi hóa đơn cũ, nếu không sẽ Sua_ nhầm sang người trước
        main_doc.KeHoachTuyenSinhNew._currentInvoiceId = '';
        // Tương tự với nguồn khai thác: giữ lại id cũ là bỏ chọn ở hồ sơ B sẽ XOÁ bản ghi của A
        main_doc.KeHoachTuyenSinhNew._currentDoiTacRowId = '';
        main_doc.KeHoachTuyenSinhNew._currentDoiTacRowIds = [];
        main_doc.KeHoachTuyenSinhNew._currentDoiTacNguonId = '';
        main_doc.KeHoachTuyenSinhNew._currentDoiTacPartnerId = '';
        main_doc.KeHoachTuyenSinhNew._currentDoiTacGhiChu = '';
        // Sang hồ sơ khác → quên dấu "user đã sửa địa chỉ" của hồ sơ trước
        main_doc.KeHoachTuyenSinhNew._clearAddrTouched();
        // Text/number/date inputs (list ID để tránh clear nhầm input khác trong page)
        var arrTxt = [
            'txtKQ_HoTen', 'txtKQ_NgaySinh', 'txtKQ_DienThoai', 'txtKQ_Email', 'txtKQ_NoiSinh',
            'txtKQ_SoCCCD', 'txtKQ_NgayCapCCCD', 'txtKQ_NoiCapCCCD', 'txtKQ_HK_SoNha',
            'txtKQ_MaTinh12', 'txtKQ_TruongMaTen', 'txtKQ_Truong12_Khac',
            'txtKQ_ToHopMa', 'txtKQ_ToHopTen',
            'txtKQ_Diem1', 'txtKQ_Diem2', 'txtKQ_Diem3', 'txtKQ_DiemUT',
            'txtKQ_TongDiemMon', 'txtKQ_TongDiemXT',
            'txtKQ_MaHoSo', 'txtKQ_SBD', 'txtKQ_QDMa',
            'txtKQ_IntakeCode', 'txtKQ_IntakeTypeCode',
            'txtKQ_Bo_HoTen', 'txtKQ_Bo_NamSinh', 'txtKQ_Bo_SDT', 'txtKQ_Bo_NoiO',
            'txtKQ_Me_HoTen', 'txtKQ_Me_NamSinh', 'txtKQ_Me_SDT', 'txtKQ_Me_NoiO',
            'txtKQ_HD_NguoiMua', 'txtKQ_HD_TenDonVi', 'txtKQ_HD_MST', 'txtKQ_HD_MaQHNS',
            'txtKQ_HD_SDT', 'txtKQ_HD_Email', 'txtKQ_HD_DiaChi',
            'txtKQ_HD_NganHang', 'txtKQ_HD_SoTK', 'txtKQ_HD_ChuTK', 'txtKQ_HD_GhiChu',
            'txtKQ_NguonKhaiThac_GhiChu'
        ];
        edu.util.resetValByArrId(arrTxt);
        // .trigger('change') để select2 vẽ lại placeholder — nếu chỉ .val('') thì ô chọn
        // vẫn hiển thị giá trị cũ dù value đã rỗng.
        $('#ddlKQ_GioiTinh, #ddlKQ_QuocTich, #ddlKQ_DanToc, #ddlKQ_TonGiao,'
            + '#ddlKQ_PhuongThuc, #ddlKQ_DoiTuongTS, #ddlKQ_DoiTuongUT,'
            + '#ddlKQ_KhuVucUT, #ddlKQ_Truong12, #ddlKQ_HocLuc, #ddlKQ_HanhKiem,'
            + '#ddlKQ_NguyenVongDauRa, #ddlKQ_CoSoDaoTao,'
            + '#ddlKQ_HD_DoiTuong, #ddlKQ_HD_HinhThucTT,'
            + '#ddlKQ_NguonKhaiThac').val('').trigger('change');

        // Lớp dự kiến: reset về placeholder disabled (chờ chọn NV đầu ra)
        $('#ddlKQ_LopDuKien').html('<option value="">-- Chọn nguyện vọng đầu ra trước --</option>')
            .prop('disabled', true).val('');
        main_doc.KeHoachTuyenSinhNew._reapplyKQSelect2('ddlKQ_LopDuKien');

        // Cascade: clear Tỉnh + khóa lại Huyện/Xã về trạng thái ban đầu
        $('#ddlKQ_NS_Tinh, #ddlKQ_HK_Tinh').val('').trigger('change');   // trigger change để cascade fire

        // Tab 8 cũng là một phần của form: không dọn thì lưới danh mục vẫn còn số của
        // hồ sơ trước. Truyền rỗng = chế độ khai mới → lưới dựng lại theo quy định của
        // đợt, các ô "Đã nộp" trắng. openSuaHoSo gọi lại ngay sau đó với Id thật nên
        // không ảnh hưởng luồng Sửa.
        main_doc.KeHoachTuyenSinhNew._resetFormHoSoDM();
        main_doc.KeHoachTuyenSinhNew._loadHoSoDM_ForEdit('');

        // Về tab 1
        $('#kqdkKhaiTabs .aps-sv-tab').first().trigger('click');
        // Form vừa trắng → dọn luôn banner nhắc của hồ sơ trước
        main_doc.KeHoachTuyenSinhNew._veCanhBaoHoaDon();
    },

    /*------------------------------------------
    -- Cộng 3 điểm môn + điểm UT, đổ vào 2 ô readonly tổng
    -------------------------------------------*/
    tinhTongDiem_Khai: function () {
        var parse = function (id) {
            var v = parseFloat($('#' + id).val());
            return isNaN(v) ? 0 : v;
        };
        var tongMon = parse('txtKQ_Diem1') + parse('txtKQ_Diem2') + parse('txtKQ_Diem3');
        var tongXT = tongMon + parse('txtKQ_DiemUT');
        $('#txtKQ_TongDiemMon').val(tongMon ? tongMon.toFixed(2) : '');
        $('#txtKQ_TongDiemXT').val(tongXT ? tongXT.toFixed(2) : '');
    },

    /*------------------------------------------
    -- Ghép payload rồi gọi Them_HoSo_TS cho 1 hồ sơ khai tay
    -- Origin: PKG_CORE_TS_HOSO.Them_HoSo_TS  (KHÁC PKG_CORE_TS_HOSO_IMPORT dùng cho batch)
    -- Action: SV_Core_TS_HoSo_MH/FSkkLB4JLhIuHhUS
    -- Convention _Id cho tất cả field (chọn từ dropdown). Bắt buộc gửi strNguyenVong_DauRa_Id
    -- để BE snapshot 5 field DAOTAO_* (Hệ/Khóa/CT/Ngành TS/Ngành ĐT) từ TS_KEHOACH_DAU_RA.
    -------------------------------------------*/
    saveKhai_HoSo: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Dispatch: nếu đang ở chế độ SỬA → gọi Sua_HoSo_TS thay vì Them_HoSo_TS
        if (me._suaMode && edu.util.checkValue(me.strSuaHoSo_Id)) {
            me.saveSuaHoSo_Full();
            return;
        }
        if (me._isSavingKhai) {
            console.warn("[saveKhai_HoSo] Đang trong quá trình lưu hồ sơ, bỏ qua thao tác click lặp.");
            return;
        }
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Chưa xác định kế hoạch tuyển sinh (mở lại từ danh sách)", "w");
            return;
        }
        // Validate theo thứ tự tab (tránh nhảy tab lung tung). Mỗi lỗi: nhảy đúng tab + focus field.
        // Nhảy theo PANEL chứ không theo chỉ số tab: chế độ Gộp nhóm chỉ có 4 tab,
        // chế độ Một trang thì không có tab nào.
        var goTab = function (idx) { me._goToTabByIndex(idx); };
        var warn = function (msg, tabIdx, fieldId) {
            edu.system.alert(msg, "w");
            goTab(tabIdx);
            // Ô cần nhập có thể nằm trong mục đang đóng → mở ra rồi mới focus,
            // không thì người dùng chỉ thấy cảnh báo mà chẳng thấy ô nào.
            me._secMoTheoField(fieldId);
            $('#' + fieldId).focus();
        };

        // --- TAB 1: Cá nhân ---
        var hoTen = edu.system.getValById('txtKQ_HoTen');
        if (!edu.util.checkValue(hoTen)) { warn("Vui lòng nhập Họ và tên", 0, 'txtKQ_HoTen'); return; }

        // Ô type=date: chưa chọn đủ ngày thì trình duyệt trả rỗng, nên chỉ cần kiểm tra
        // rỗng. Vẫn đổi sang dd/mm/yyyy rồi soát lại lần nữa — phòng trình duyệt cũ
        // không hỗ trợ type=date và tụt về ô text gõ tay.
        var strNgaySinh = me._ngaySinhToUI(edu.system.getValById('txtKQ_NgaySinh'));
        if (!edu.util.checkValue(strNgaySinh)) { warn("Vui lòng nhập Ngày tháng năm sinh", 0, 'txtKQ_NgaySinh'); return; }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(strNgaySinh)) {
            warn("Ngày sinh chưa hợp lệ — chọn lại ngày trên lịch", 0, 'txtKQ_NgaySinh'); return;
        }

        if (!edu.util.checkValue(edu.system.getValById('ddlKQ_GioiTinh'))) {
            warn("Vui lòng chọn Giới tính", 0, 'ddlKQ_GioiTinh'); return;
        }

        // --- TAB 2: CCCD & Hộ khẩu ---
        var soCCCD = edu.system.getValById('txtKQ_SoCCCD');
        if (!edu.util.checkValue(soCCCD)) { warn("Vui lòng nhập Số CCCD", 1, 'txtKQ_SoCCCD'); return; }
        if (!/^\d{9,12}$/.test(soCCCD)) {
            warn("Số CCCD phải là 9–12 chữ số", 1, 'txtKQ_SoCCCD'); return;
        }

        // Kiểm tra trùng CCCD ngay tại FE dựa trên danh sách hồ sơ đã nạp (chống tạo 2 lần do mạng lag/ấn nhầm)
        var cccdNhap = String(soCCCD || '').trim();
        var trungHS = null;
        if (cccdNhap && me.dtKQDK_HoSo && me.dtKQDK_HoSo.length) {
            for (var iCCCD = 0; iCCCD < me.dtKQDK_HoSo.length; iCCCD++) {
                var itemHS = me.dtKQDK_HoSo[iCCCD];
                var itemCccd = String(me._kqPick(itemHS, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD', 'SO_CCCD', 'CCCD']) || '').trim();
                if (itemCccd && itemCccd === cccdNhap) {
                    trungHS = itemHS;
                    break;
                }
            }
        }
        if (trungHS) {
            var tenTrung = me._kqPick(trungHS, ['COREPERSON_HOTEN', 'HOTEN']) || 'thí sinh khác';
            warn("Số CCCD <b>" + cccdNhap + "</b> đã tồn tại trong danh sách hồ sơ (Thí sinh: <b>" + tenTrung + "</b>).<br/>Vui lòng kiểm tra lại!", 1, 'txtKQ_SoCCCD');
            return;
        }

        // --- TAB 4: Trúng tuyển ---
        // Đợt tuyển sinh: bắt buộc (BE proc yêu cầu strHoSo_KH_TS_Dot_Id).
        // Sync lại từ dropdown phòng khi context bị lệch (VD user vừa đổi dropdown).
        me.strDot_Id_ForKQ = edu.system.getValById('ddlKQ_DotTuyenSinh') || me.strDot_Id_ForKQ || '';
        if (!edu.util.checkValue(me.strDot_Id_ForKQ)) {
            warn("Vui lòng chọn Đợt tuyển sinh", 3, 'ddlKQ_DotTuyenSinh'); return;
        }
        if (!edu.util.checkValue(edu.system.getValById('ddlKQ_NguyenVongDauRa'))) {
            warn("Vui lòng chọn Nguyện vọng đầu ra (ngành đầu vào)", 3, 'ddlKQ_NguyenVongDauRa'); return;
        }

        // Khóa nút Lưu & bật loading spinner chống double-click khi mạng lag
        var $btnSave = $('#btnKhaiSave');
        me._isSavingKhai = true;
        $btnSave.prop('disabled', true).addClass('disabled').html('<i class="fa-solid fa-spinner fa-spin"></i><span> Đang lưu...</span>');

        var unlockSave = function () {
            me._isSavingKhai = false;
            $btnSave.prop('disabled', false).removeClass('disabled');
            if (me._suaMode) {
                $btnSave.html('<i class="fa-light fa-floppy-disk"></i> Cập nhật hồ sơ');
            } else {
                $btnSave.html('<i class="fa-solid fa-floppy-disk"></i><span> Lưu hồ sơ</span>');
            }
        };

        // Tự tính tổng lần cuối trước khi build payload
        me.tinhTongDiem_Khai();

        var g = function (id) { return edu.system.getValById(id) || ''; };

        // Ô nhập là type=date (ISO) → đổi về dd/mm/yyyy cho payload, BE strict format này.
        // Đồng thời tách số riêng biệt cho dCorePerson_NgayS/ThangS/NamS
        var dNgayS = '', dThangS = '', dNamS = '';
        var strNgaySinh = me._ngaySinhToUI(g('txtKQ_NgaySinh'));
        if (strNgaySinh) {
            var m = strNgaySinh.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (m) { dNgayS = parseInt(m[1], 10); dThangS = parseInt(m[2], 10); dNamS = parseInt(m[3], 10); }
        }

        // XT_Mon_Data format: MON_MA~DIEM~SO_MON~STT~MON_TEN|... (delimited theo spec)
        // Tách tên môn từ tổ hợp (VD "Toán, Lý, Hóa") → gán vào 3 điểm môn tương ứng
        var tenMon = (g('txtKQ_ToHopTen') || '').split(/[,;]/);
        var monArr = [];
        for (var i = 0; i < 3; i++) {
            var diem = g('txtKQ_Diem' + (i + 1));
            var ten = (tenMon[i] || ('Mon ' + (i + 1))).trim();
            if (!diem && !tenMon[i]) continue;
            var ma = ten.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
            monArr.push(ma + '~' + diem + '~1~' + (i + 1) + '~' + ten);
        }
        var strXT_Mon_Data = monArr.join('|');
        var toHopMa = g('txtKQ_ToHopMa');

        var payload = {
            'action': 'SV_Core_TS_HoSo_MH/FSkkLB4JLhIuHhUS',
            'func': 'PKG_CORE_TS_HOSO.Them_HoSo_TS',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'THEM',

            // Person — cá nhân
            'strCorePerson_HoTen': hoTen,
            'strCorePerson_Ho': '',
            'strCorePerson_Dem': '',
            'strCorePerson_Ten': '',
            'strCorePerson_NgaySinh': strNgaySinh,
            'dCorePerson_NgayS': dNgayS,
            'dCorePerson_ThangS': dThangS,
            'dCorePerson_NamS': dNamS,
            'strCorePerson_GioiTinh_Id': g('ddlKQ_GioiTinh'),
            'strMaSo': '',   // MSSV nội bộ — hệ thống tự sinh
            'strDaoTao_LopQuanLy_Id_DK': g('ddlKQ_LopDuKien'),
            'strDaoTao_LopQuanLy_DuKien': g('ddlKQ_LopDuKien'),

            // Profile
            'strPersonProfile_DanToc_Id': g('ddlKQ_DanToc'),
            'strPersonProfile_TonGiao_Id': g('ddlKQ_TonGiao'),
            'strPersonProfile_QuocTich_Id': g('ddlKQ_QuocTich'),

            // Contact
            'strPersonContact_DienThoai': g('txtKQ_DienThoai'),
            'strPersonContact_Email': g('txtKQ_Email'),

            // Định danh
            'strPersonIden_SoCCCD': g('txtKQ_SoCCCD'),
            'strPersonIden_NgayCap': g('txtKQ_NgayCapCCCD'),
            'strPersonIden_NoiCap': g('txtKQ_NoiCapCCCD'),

            // Địa chỉ
            'strPersonAddr_NS_Tinh_Id': g('ddlKQ_NS_Tinh'),
            'strPersonAddr_NS_Xa_Id': g('ddlKQ_NS_Xa'),
            'strPersonAddr_NoiSinh': g('txtKQ_NoiSinh'),
            'strPersonAddr_HK_Tinh_Id': g('ddlKQ_HK_Tinh'),
            'strPersonAddr_HK_Xa_Id': g('ddlKQ_HK_Xa'),
            'strPersonAddr_HK_SoNha': g('txtKQ_HK_SoNha'),

            // Học vấn 12 — proc HoSo dùng _Id (khớp signature PKG_CORE_TS_HOSO)
            'strPersonEdu_Tinh_Id': g('txtKQ_MaTinh12'),
            'strPersonEdu_TruongMaTen': g('txtKQ_TruongMaTen'),
            'strPersonEdu_HocLuc': g('ddlKQ_HocLuc'),
            'strPersonEdu_HanhKiem': g('ddlKQ_HanhKiem'),

            // Gia đình
            'strPersonFam_Bo_HoTen': g('txtKQ_Bo_HoTen'),
            'dPersonFam_Bo_NamSinh': g('txtKQ_Bo_NamSinh'),
            'strPersonFam_Bo_NoiO': g('txtKQ_Bo_NoiO'),
            'strPersonFam_Bo_SDT': g('txtKQ_Bo_SDT'),
            'strPersonFam_Me_HoTen': g('txtKQ_Me_HoTen'),
            'dPersonFam_Me_NamSinh': g('txtKQ_Me_NamSinh'),
            'strPersonFam_Me_NoiO': g('txtKQ_Me_NoiO'),
            'strPersonFam_Me_SDT': g('txtKQ_Me_SDT'),

            // Hồ sơ nguồn
            'strHoSo_KH_TS_Id': me.strKeHoachTuyenSinh_Id || '',
            'strHoSo_KH_TS_Dot_Id': me.strDot_Id_ForKQ || '',
            'strHoSo_KH_Dot_PT_Id': g('ddlKQ_PhuongThuc'),
            'strHoSo_DoiTuong_TS_Id': g('ddlKQ_DoiTuongTS'),
            'strHoSo_DoiTuong_UT_Ids': g('ddlKQ_DoiTuongUT'),
            'strHoSo_KhuVuc_UT_Id': g('ddlKQ_KhuVucUT'),
            'strHoSo_MaHoSo': g('txtKQ_MaHoSo'),
            'strHoSo_SoBaoDanh': g('txtKQ_SBD'),
            'strHoSo_Import_Batch_Id': '',
            'dHoSo_Import_Row_No': '',

            // Cơ sở đào tạo — param "new" của Them_HoSo_TS (proc Oracle đã có, comment C# chưa update)
            'strDaoTao_CoSoDaoTao_Id': g('ddlKQ_CoSoDaoTao'),

            // Số tiền nộp trước (giữ chỗ) — param mới (06/08/2026); form Khai chưa có input UI → gửi rỗng
            'strSoTienNopTruoc': '',

            // Nguyện vọng đầu ra — BẮT BUỘC trong signature, BE dùng để snapshot Hệ/Khóa/CT/NganhTS/NganhDT
            'strNguyenVong_DauRa_Id': g('ddlKQ_NguyenVongDauRa'),

            // Lớp quản lý dự kiến — signature HoSo KHÔNG có (chỉ IMPORT proc có), đóng gói vào Extra_HoSo_Data
            // để không mất user input; BE parse nếu cần

            // Xét tuyển
            'strXetTuyen_TohopMon_Id': toHopMa,
            'strXetTuyen_TohopMon_Code': toHopMa,
            'strXetTuyen_TohopMon_Ten': g('txtKQ_ToHopTen'),
            'dXetTuyen_DiemUuTien': g('txtKQ_DiemUT'),
            'dXetTuyen_DiemTongMon': g('txtKQ_TongDiemMon'),
            'dXetTuyen_DiemTongXT': g('txtKQ_TongDiemXT'),
            'strXT_Mon_Data': strXT_Mon_Data,

            // Kết quả
            'strKetQua_QuyetDinh_Id': g('txtKQ_QDMa'),

            // Intake
            'strIntake_IntakeCode': g('txtKQ_IntakeCode'),
            'strIntake_IntakeTypeCode': g('txtKQ_IntakeTypeCode'),

            // Hóa đơn
            'strPersonInvoice_TypeLoai': g('ddlKQ_HD_DoiTuong'),
            'strPersonInvoice_NguoiMua': g('txtKQ_HD_NguoiMua'),
            'strPersonInvoice_TenDonVi': g('txtKQ_HD_TenDonVi'),
            'strPersonInvoice_MST': g('txtKQ_HD_MST'),
            'strPersonInvoice_MaQHNS': g('txtKQ_HD_MaQHNS'),
            'strPersonInvoice_SDT': g('txtKQ_HD_SDT'),
            'strPersonInvoice_DiaChi': g('txtKQ_HD_DiaChi'),
            'strPersonInvoice_Email': g('txtKQ_HD_Email'),

            // Ngân hàng
            'strPersonBank_HinhThucTT': g('ddlKQ_HD_HinhThucTT'),
            'strPersonBank_TenNganHang': g('txtKQ_HD_NganHang'),
            'strPersonBank_SoTaiKhoan': g('txtKQ_HD_SoTK'),
            'strPersonBank_ChuTaiKhoan': g('txtKQ_HD_ChuTK'),
            'strPersonBank_GhiChu': g('txtKQ_HD_GhiChu'),

            // Nguồn khai thác (đối tác)
            'strTS_DoiTacTuyenSinh_Id': g('ddlKQ_NguonKhaiThac'),
            'strTS_DoiTacTuyenSinh_id': g('ddlKQ_NguonKhaiThac'),
            'strTS_DoiTacTuyenSinh_Khac': g('txtKQ_NguonKhaiThac_GhiChu'),

            // Extra JSON — lưu các field ngoài signature để không mất user input
            'strExtra_Person_Data': JSON.stringify({
                NS_Huyen_Id: g('ddlKQ_NS_Huyen'),
                HK_Huyen_Id: g('ddlKQ_HK_Huyen')
            }),
            // Lớp dự kiến đã có param thật ở trên → không cần dồn vào extra nữa
            'strExtra_HoSo_Data': '',
            'strExtra_Intake_Data': ''
        };

        // Convention Oracle: param prefix 'd*' = NUMBER → rỗng phải gửi null (không phải '')
        // Nếu gửi '' vào NUMBER → PLS-00306 wrong type, C# catch nuốt exception thành
        // Success=true, Message='' nhưng proc chưa insert gì (giống bug đã fix ở _buildImportPayload).
        Object.keys(payload).forEach(function (k) {
            if (k.charAt(0) !== 'd') return;
            var v = payload[k];
            if (v === '' || v === undefined || v === null) {
                payload[k] = null;
            } else {
                var n = Number(v);
                payload[k] = isNaN(n) ? null : n;
            }
        });

        var dotHienTai = me.strDot_Id_ForKQ || g('ddlKQ_DotTuyenSinh') || me._hsDotHienTai();
        var keHoachIdHienTai = me.strKeHoachTuyenSinh_Id || '';
        var snap = {
            addr: me._collectAddrBlocks(),
            invoice: me._collectInvoice(),
            bank: me._collectBank(),
            profile: me._collectProfile(),
            family: me._collectFamily(),
            iden: me._collectIden(),
            nguon: {
                doiTacId: g('ddlKQ_NguonKhaiThac'),
                ghiChu: g('txtKQ_NguonKhaiThac_GhiChu'),
                nguyenVong: g('ddlKQ_NguyenVongDauRa'),
                dot: dotHienTai,
                keHoachId: keHoachIdHienTai
            },
            cccd: g('txtKQ_SoCCCD'),
            hoTen: hoTen,
            // Tab 8 — giấy tờ thí sinh mang tới, khai ngay từ lúc thêm mới.
            // Phải chụp ở đây vì lưới bị dọn trắng ngay khi lưu xong.
            danhMuc: me._hsThuLuoi(),
            dot: dotHienTai,
            keHoachId: keHoachIdHienTai
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    // ⚠ Controller Them_HoSo_TS KHÔNG gán 3 out param vào response
                    // (không có this.response.Id = strCorePerson_Id_Out) → FE luôn nhận Id null.
                    // Thử đọc trước, không có thì tra ngược từ danh sách theo CCCD.
                    // Soát cảnh báo hóa đơn NGAY BÂY GIỜ: mọi nhánh dưới đây đều chạy
                    // async, tới lúc callback về thì form có thể đã bị dọn trắng.
                    var canhBaoHD = me._hoaDonWarnText();
                    var xuLy = function (pid, hosoId) {
                        if (pid) {
                            if (snap && snap.nguon && snap.nguon.doiTacId) {
                                me._nguonMap[pid] = me._tenDoiTacTS(snap.nguon.doiTacId);
                            }
                            me._saveKhai_PhuThuoc(pid, snap);
                            /* Danh mục hồ sơ (tab 8) gắn theo HOSO_ID chứ không phải person,
                               nên chỉ ghi được sau khi tra ra Id hồ sơ vừa tạo. Gộp kết quả
                               vào ĐÚNG MỘT alert: bắn alert thứ hai là BS3 gỡ body.modal-open
                               làm modal tự đóng (xem feedback_bs3_alert_stacking). */
                            me._saveHoSoDM_Rows(hosoId, snap.dot, snap.danhMuc, function (kq) {
                                var txtDM = '';
                                if (kq && kq.total && !kq.thieuId) {
                                    txtDM = '<br/>Danh mục hồ sơ: đã lưu ' + kq.done + '/' + kq.total + ' dòng'
                                        + (kq.failed ? ' <span class="text-danger">(lỗi: ' + kq.failed + ')</span>' : '');
                                } else if (kq && kq.total && kq.thieuId) {
                                    // Hồ sơ đã lưu nhưng không tra được Id → danh mục chưa xuống DB.
                                    // Nói thẳng ra, đừng để người dùng tưởng đã ghim xong giấy tờ.
                                    txtDM = '<br/><b>Chưa lưu được danh mục hồ sơ</b> (không tra được mã hồ sơ vừa tạo).'
                                        + '<br/>Mở lại hồ sơ trong danh sách → tab <b>Danh mục hồ sơ</b> → nhập lại rồi bấm <b>"Cập nhật hồ sơ"</b>.';
                                }
                                edu.system.alert("Đã lưu hồ sơ thành công"
                                    + me._addrWarnText(snap.addr) + canhBaoHD + txtDM, kq && kq.thieuId ? "w" : "s");
                                unlockSave();
                                me.resetKhai_HoSo();
                            });
                            return;
                        }
                        // Không tra được Core_Person_Id → 7 bảng phụ CHƯA được ghi.
                        // Trước đây chỗ này im lặng nên người dùng tưởng đã lưu đủ,
                        // mãi tới khi kế toán báo thiếu địa chỉ mới biết.
                        unlockSave();
                        me.resetKhai_HoSo();
                        $('#kqdk_khai_luu_canhbao').removeClass('d-none');
                        edu.system.alert('Đã lưu hồ sơ chính, NHƯNG chưa gắn được các thông tin '
                            + 'bổ sung (địa chỉ, hóa đơn, gia đình, ngân hàng, nguồn khai thác).'
                            + '<br/>Vui lòng mở hồ sơ vừa tạo trong danh sách và bấm '
                            + '<b>"Cập nhật hồ sơ"</b> một lần để lưu nốt.', 'w');
                    };
                    var newPersonId = me._pickCorePersonIdFromResp(data);
                    // Có danh mục hồ sơ cần ghi thì PHẢI tra ngược danh sách: response
                    // Them_HoSo_TS không trả HOSO_ID, mà tab 8 gắn theo Id đó.
                    if (newPersonId && !(snap.danhMuc && snap.danhMuc.length)) xuLy(newPersonId, '');
                    else me._findNewPersonId(snap.cccd, snap.hoTen, function (pid, hosoId) {
                        xuLy(pid || newPersonId, hosoId);
                    });
                } else {
                    unlockSave();
                    edu.system.alert("Them_HoSo_TS: " + ((data && data.Message) || 'Lỗi không xác định'), "w");
                }
            },
            error: function (er) {
                unlockSave();
                edu.system.alert("Them_HoSo_TS (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================================
    == FORM SỬA — NẠP CÁC FIELD MÀ LayDS_HoSo_TS KHÔNG TRẢ VỀ
    == Bug (2026-09-10): khai mới xong, bấm Sửa thì Dân tộc / Tôn giáo / Điện thoại /
    == Email / CCCD trống trơn dù bảng danh sách vẫn hiện đủ. Lý do: openSuaHoSo chỉ
    == đọc từ cache dtKQDK_HoSo (view chỉ có 20 cột), trong khi dữ liệu thật nằm ở
    == PERSON_PROFILE / PERSON_CONTACT / PERSON_IDENTIFIER.
    == Nguy hiểm hơn: form trống rồi bấm Cập nhật → Sua_HoSo_TS gửi chuỗi rỗng đè lên
    == dữ liệu cũ (đúng hiện tượng "ấn sửa nó lại mất").
    ==========================================================================*/
    _loadPersonExtras_ForEdit: function (corePersonId, d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(corePersonId)) return;
        d = d || {};

        // 1) Giới tính / Dân tộc / Tôn giáo.
        //    3 danh mục này bị nạp 2 lần vào cùng dropdown: _preloadDMForList (cho bảng)
        //    và initKhai_DanhMuc (cho form). Lần nạp sau đổ lại <option> → xoá mất lựa chọn
        //    vừa set → phải set lại ở vài mốc thời gian cho chắc.
        var pf = (me._kqProfileMap || {})[corePersonId];
        var applyDrops = function () {
            var giId = me._kqPick(d, ['COREPERSON_GIOITINH_ID', 'GIOITINH_ID']);
            var giTen = me._kqPick(d, ['COREPERSON_GIOITINH_TEN', 'GIOITINH_TEN', 'CorePerson_GioiTinh_Ten']);
            if (giId || giTen) me._setSelectByIdOrText('#ddlKQ_GioiTinh', giId, giTen);
            if (pf && pf.ETHNICITY_ID) me._setSelectByIdOrText('#ddlKQ_DanToc', pf.ETHNICITY_ID, '');
            if (pf && pf.RELIGION_ID) me._setSelectByIdOrText('#ddlKQ_TonGiao', pf.RELIGION_ID, '');
            // Quốc tịch: Them_/Sua_Person_Profile KHÔNG có tham số nào cho nó (đã đối chiếu
            // chữ ký C#), nên FE không ghi được. Nhưng nếu bảng vốn CÓ cột và Them_HoSo_TS
            // đã ghi lúc khai mới thì vẫn hiện lên được — dò nhiều tên cột cho chắc.
            var qt = pf ? me._pickLoose(pf, ['NATIONALITY_ID', 'QUOCTICH_ID', 'COUNTRY_ID']) : '';
            if (qt) me._setSelectByIdOrText('#ddlKQ_QuocTich', qt, '');
        };
        applyDrops();
        setTimeout(applyDrops, 900);
        setTimeout(applyDrops, 1800);

        // Bản ghi profile ĐẦY ĐỦ theo person (LayDSPerson_Profile dùng cho bảng danh sách
        // có thể không trả hết cột). Cần cho Quốc tịch: cột PERSON_PROFILE.NATIONALITY_ID
        // đã có sẵn trong bảng — chỉ Them_/Sua_Person_Profile là chưa hở param để ghi.
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data)) return;
                var pfFull = data.Data;
                if (pfFull.length !== undefined) pfFull = pfFull[0];
                if (!pfFull) return;
                var applyFull = function () {
                    var qt = me._pickLoose(pfFull, ['NATIONALITY_ID', 'QUOCTICH_ID']);
                    if (qt) me._setSelectByIdOrText('#ddlKQ_QuocTich', qt, '');
                    if (pfFull.ETHNICITY_ID) me._setSelectByIdOrText('#ddlKQ_DanToc', pfFull.ETHNICITY_ID, '');
                    if (pfFull.RELIGION_ID) me._setSelectByIdOrText('#ddlKQ_TonGiao', pfFull.RELIGION_ID, '');
                };
                applyFull();
                setTimeout(applyFull, 900);
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Profile_LayTT,
            data: {
                'action': me._ACTION_Profile_LayTT,
                'func': 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
                'iM': edu.system.iM,
                'strId': '',
                'strPerson_Id': corePersonId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);

        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
        };

        // 2) Điện thoại / Email — PERSON_CONTACT
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data)) return;
                data.Data.forEach(function (item) {
                    var val = item.CONTACT_VALUE || item.VALUE || '';
                    if (!val) return;
                    var text = strip(item.CONTACT_TYPE_CODE_MA || item.MA) + '|'
                        + strip(item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME);
                    var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
                    var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
                    if (!isEmail && !isPhone) {           // loại không rõ → đoán theo giá trị
                        if (val.indexOf('@') > -1) isEmail = true;
                        else if (/^[\d\s\+\-\(\)\.]+$/.test(val) && val.replace(/\D/g, '').length >= 6) isPhone = true;
                    }
                    if (isEmail) edu.util.viewValById('txtKQ_Email', val);
                    else if (isPhone) edu.util.viewValById('txtKQ_DienThoai', val);
                });
            },
            error: function (er) { kqdkNoLog('[SuaHoSo] GetPersonContact err:', er); },
            type: 'POST',
            contentType: true,
            action: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
            data: {
                'action': 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
                'func': 'PKG_CORE_HOSONHANSU_05.GetPersonContactByPerson_Id',
                'iM': edu.system.iM,
                'strPerson_Id': corePersonId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);

        // 3) Nơi sinh / Hộ khẩu — PERSON_ADDRESS
        //    API chỉ trả PROVINCE_ID + WARD_ID (không có huyện), trong khi form là cascade
        //    Tỉnh → Huyện → Xã. Tra ngược huyện từ cây tỉnh/thành trong cache (_fillDiaChi).
        //    Nạp danh mục Loại địa chỉ trước để đối chiếu ADDRESS_TYPE_CODE (là GUID, không phải text).
        me._ensureAddrTypeDM(function () {
            me._getPersonAddressList(corePersonId, function (rows) {
                if (!rows.length) return;
                var pick = function (kind) {
                    var typeId = me._addrTypeId(kind);
                    var found = typeId && rows.filter(function (it) { return it.ADDRESS_TYPE_CODE === typeId; })[0];
                    if (found) return found;
                    // Danh mục chưa có mục tương ứng → đoán theo tên loại trả kèm bản ghi
                    var rx = (kind === 'NS') ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
                    return rows.filter(function (it) {
                        return rx.test(strip(it.ADDRESS_TYPE_CODE_NAME || it.ADDRESS_TYPE_NAME || ''));
                    })[0];
                };
                var noiSinh = pick('NS');
                var hoKhau = pick('HK');
                // Không phân loại được mà chỉ có 1 dòng → coi là hộ khẩu thường trú
                if (!noiSinh && !hoKhau && rows.length === 1) hoKhau = rows[0];
                var huyenCua = function (r) {
                    return me._pickLoose(r, ['DISTRICT_ID', 'QUANHUYEN_ID', 'HUYEN_ID']);
                };
                if (noiSinh) {
                    me._fillDiaChi('ddlKQ_NS_Tinh', 'ddlKQ_NS_Huyen', 'ddlKQ_NS_Xa', 'txtKQ_NoiSinh',
                        noiSinh.PROVINCE_ID, huyenCua(noiSinh), noiSinh.WARD_ID, noiSinh.ADDRESS_LINE1);
                }
                if (hoKhau) {
                    me._fillDiaChi('ddlKQ_HK_Tinh', 'ddlKQ_HK_Huyen', 'ddlKQ_HK_Xa', 'txtKQ_HK_SoNha',
                        hoKhau.PROVINCE_ID, huyenCua(hoKhau), hoKhau.WARD_ID, hoKhau.ADDRESS_LINE1);
                }
            });
        });

        // 4) CCCD / ngày cấp / nơi cấp — PERSON_IDENTIFIER
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data) || !data.Data.length) return;
                var rows = data.Data;
                var cccd = rows.find(function (it) {
                    var t = strip(it.IDENTIFIER_TYPE_CODE_MA || it.MA) + '|'
                        + strip(it.IDENTIFIER_TYPE_CODE_NAME || it.IDENTIFIER_TYPE_NAME);
                    return /CCCD|CAN CUOC|CMND/.test(t);
                }) || rows.find(function (it) { return it.IS_PRIMARY == 1; }) || rows[0];
                if (!cccd) return;
                if (cccd.IDENTIFIER_NO) edu.util.viewValById('txtKQ_SoCCCD', cccd.IDENTIFIER_NO);
                if (cccd.ISSUE_DATE) edu.util.viewValById('txtKQ_NgayCapCCCD', me._ngaySinhToISO(cccd.ISSUE_DATE) || cccd.ISSUE_DATE);
                if (cccd.ISSUE_PLACE) edu.util.viewValById('txtKQ_NoiCapCCCD', cccd.ISSUE_PLACE);
            },
            error: function (er) { kqdkNoLog('[SuaHoSo] GetPersonIdentifier err:', er); },
            type: 'POST',
            contentType: true,
            action: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
            data: {
                'action': 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
                'func': 'PKG_CORE_HOSONHANSU_05.GetPersonIdentifierByPerson_Id',
                'iM': edu.system.iM,
                'strPerson_Id': corePersonId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đổ 1 cụm địa chỉ (Tỉnh → Huyện → Xã → chi tiết) vào form.
    -- districtId: lấy thẳng từ DISTRICT_ID nếu API có trả. Trước đây hàm này chỉ suy
    -- Huyện NGƯỢC từ Xã, nên hồ sơ chọn Huyện mà bỏ trống Xã thì mở lại mất Huyện
    -- dù DB vẫn lưu đủ. Không có districtId thì mới tra ngược từ Xã như cũ
    -- (edu.extend.dtTinhThanh: mảng phẳng {ID, TEN, QUANHECHA_ID}).
    -- Tự retry chờ cache tỉnh/thành nạp xong (genDropTinhThanh nạp bất đồng bộ).
    -------------------------------------------*/
    _fillDiaChi: function (elTinh, elHuyen, elXa, elChiTiet, provinceId, districtId, wardId, chiTiet, _try) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (chiTiet) edu.util.viewValById(elChiTiet, chiTiet);
        if (!provinceId && !districtId && !wardId) return;
        var dt = (edu.extend && edu.extend.dtTinhThanh) || [];
        if (!dt.length) {                       // cache chưa sẵn sàng → chờ rồi thử lại
            _try = (_try || 0) + 1;
            if (_try > 25) return;
            setTimeout(function () {
                me._fillDiaChi(elTinh, elHuyen, elXa, elChiTiet, provinceId, districtId, wardId, '', _try);
            }, 200);
            return;
        }
        var find = function (id) { return dt.filter(function (e) { return e.ID === id; })[0]; };
        var xa = wardId ? find(wardId) : null;
        var huyenId = districtId || (xa ? xa.QUANHECHA_ID : '');
        var tinhId = provinceId || (huyenId ? ((find(huyenId) || {}).QUANHECHA_ID || '') : '');
        var fill = function (elId, list, defVal, title) {
            edu.system.loadToCombo_data({
                data: list,
                renderInfor: { id: 'ID', parentId: '', name: 'TEN', code: '', default_val: defVal },
                renderPlace: [elId], type: '', title: title
            });
        };
        if (tinhId) {
            $('#' + elTinh).val(tinhId).trigger('change');
            $('#' + elTinh).prop('disabled', false);
        }
        // Tỉnh 2 cấp (sau sáp nhập): Xã treo thẳng vào Tỉnh, không có cấp Huyện ở giữa
        // → cha của Xã chính là Tỉnh. Nếu vẫn coi nó là Huyện thì cả 2 ô đều trống.
        var haiCap = !!(huyenId && tinhId && huyenId === tinhId);
        // Tỉnh 2 cấp: vẫn để ô Huyện dùng được, chỉ đánh dấu để cascade không khoá ô Xã
        if (haiCap) $('#' + elHuyen).attr('data-2cap', '1').prop('disabled', false);
        if (huyenId && !haiCap) {
            fill(elHuyen, dt.filter(function (e) { return e.QUANHECHA_ID === tinhId; }), huyenId, 'Chọn quận/huyện');
            $('#' + elHuyen).prop('disabled', false);
        }
        // Luôn đổ danh sách Xã khi đã biết cấp cha — kể cả hồ sơ chưa chọn Xã.
        // Nếu không, ô Xã đứng nguyên ở trạng thái khoá "Vui lòng chọn Quận/Huyện trước"
        // và người dùng không bổ sung được.
        var chaCuaXa = haiCap ? tinhId : huyenId;
        if (chaCuaXa) {
            fill(elXa, dt.filter(function (e) { return e.QUANHECHA_ID === chaCuaXa; }),
                wardId || '', 'Chọn phường/xã');
            $('#' + elXa).prop('disabled', false);
        }
    },

    /*==========================================================================
    == NƠI SINH / HỘ KHẨU — GHI XUỐNG BẢNG PERSON_ADDRESS
    == Bug (2026-09-10): địa chỉ nhập trên form chỉ được nhét vào strExtra_Data của
    == Sua_HoSo_TS (dòng 2182-2189) — BE không tách JSON đó ra để ghi bảng. Đọc lại
    == bằng Get_Person_Address nên luôn rỗng → "thêm rồi mà mở Sửa lại trắng".
    == Cách xử lý: gọi thẳng PKG_CORE_HOSONHANSU_06 y như trang Đề xuất hồ sơ.
    ==========================================================================*/
    _ACTION_Addr_LayDS: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy',
    _ACTION_Addr_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy',
    _ACTION_Addr_Sua: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy',

    /*------------------------------------------
    -- Danh mục Loại địa chỉ. PERSON_ADDRESS.ADDRESS_TYPE_CODE lưu ID (GUID) của
    -- danh mục chứ không phải mã chữ, nên bắt buộc phải có bảng này mới đối chiếu
    -- được đâu là Nơi sinh, đâu là Hộ khẩu. Nạp 1 lần rồi cache.
    -------------------------------------------*/
    _ensureDMList: function (maBangDM, prop, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (me[prop]) { if (typeof cb === 'function') cb(); return; }
        edu.system.makeRequest({
            success: function (data) {
                me[prop] = (data && data.Success && data.Data) || [];
                if (typeof cb === 'function') cb();
            },
            error: function () {
                me[prop] = [];
                if (typeof cb === 'function') cb();
            },
            type: 'GET',
            contentType: true,
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            data: {
                'strMaBangDanhMuc': maBangDM,
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    _ensureAddrTypeDM: function (cb) {
        main_doc.KeHoachTuyenSinhNew._ensureDMList(
            'PERSON_ADDRESS.ADDRESS_TYPE_CODE', 'dtDM_AddrType', cb);
    },

    /*------------------------------------------
    -- kind: 'NS' (nơi sinh) | 'HK' (hộ khẩu thường trú) → ID danh mục tương ứng.
    -- Trả '' nếu danh mục chưa khai báo mục đó (khi đó không ghi được xuống bảng).
    -------------------------------------------*/
    _addrTypeId: function (kind) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var dt = me.dtDM_AddrType || [];
        if (!dt.length) return '';
        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
        };
        var rx = (kind === 'NS') ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
        var found = dt.filter(function (e) { return rx.test(strip(e.TEN) + ' ' + strip(e.MA)); })[0];
        return found ? (found.ID || '') : '';
    },

    _getPersonAddressList: function (personId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId)) { cb([]); return; }
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                // Bỏ bản ghi đã xoá mềm (IS_ACTIVE = 0) như trang Đề xuất hồ sơ vẫn làm
                cb(rows.filter(function (r) {
                    return r && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1);
                }));
            },
            error: function () { cb([]); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Addr_LayDS,
            data: {
                'action': me._ACTION_Addr_LayDS,
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Address',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Chụp giá trị 2 cụm địa chỉ từ form NGAY LẬP TỨC (đồng bộ).
    -- Bắt buộc gọi trước resetKhai_HoSo() ở luồng Thêm mới, vì hàm lưu chạy async —
    -- lúc callback về thì dropdown đã bị reset trắng.
    -------------------------------------------*/
    _collectAddrBlocks: function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        // Lấy tên hiển thị của option ĐANG ĐƯỢC CHỌN THẬT. Bám vào value rỗng để nhận ra
        // option placeholder, không so khớp chữ: bỏ dấu thì "Chơn Thành" cũng thành "Chon..."
        // và sẽ bị loại nhầm cùng với "-- Chọn --".
        var txt = function (id, val) {
            return val ? ($('#' + id + ' option:selected').text() || '').trim() : '';
        };
        var cham = function (id) { return !!$('#' + id).attr('data-user-touched'); };
        var build = function (kind, pre, lineId) {
            var b = {
                kind: kind,
                tinh: g('ddlKQ_' + pre + '_Tinh'),
                huyen: g('ddlKQ_' + pre + '_Huyen'),
                xa: g('ddlKQ_' + pre + '_Xa'),
                line: g(lineId)
            };
            // Chạm vào bất kỳ ô nào của cụm = user đang chủ động sửa cụm này.
            // Gom chung vì xoá Tỉnh sẽ khiến cascade tự dọn Huyện/Xã bằng code —
            // 2 ô đó không được đánh dấu nhưng vẫn phải coi là user cố ý xoá.
            b.daCham = cham('ddlKQ_' + pre + '_Tinh') || cham('ddlKQ_' + pre + '_Huyen')
                || cham('ddlKQ_' + pre + '_Xa');
            b.chamLine = cham(lineId);
            b.full = [b.line,
            txt('ddlKQ_' + pre + '_Xa', b.xa),
            txt('ddlKQ_' + pre + '_Huyen', b.huyen),
            txt('ddlKQ_' + pre + '_Tinh', b.tinh)]
                .filter(function (x) { return x; }).join(', ');
            return b;
        };
        // Giữ cụm có nhập, HOẶC cụm user vừa xoá sạch (phải gửi đi để ghi rỗng).
        // Cụm vừa trống vừa không ai đụng vào thì bỏ qua, không chạm bản ghi cũ.
        return [build('NS', 'NS', 'txtKQ_NoiSinh'), build('HK', 'HK', 'txtKQ_HK_SoNha')]
            .filter(function (b) {
                return b.tinh || b.xa || b.line || b.daCham || b.chamLine;
            });
    },

    /*------------------------------------------
    -- Ghi 2 cụm địa chỉ xuống PERSON_ADDRESS. Đã có bản ghi cùng loại → Upd, chưa có → Ins.
    -- blocks: kết quả _collectAddrBlocks() chụp trước đó.
    -------------------------------------------*/
    save_PersonAddress: function (personId, blocks) {
        var me = main_doc.KeHoachTuyenSinhNew;
        blocks = blocks || [];
        if (!edu.util.checkValue(personId) || !blocks.length) return;
        me._ensureAddrTypeDM(function () {
            me._getPersonAddressList(personId, function (rows) {
                blocks.forEach(function (b) {
                    var typeId = me._addrTypeId(b.kind);
                    if (!typeId) return;     // danh mục thiếu mục này → đã cảnh báo ở saveSuaHoSo_Full
                    var old = rows.filter(function (r) { return r.ADDRESS_TYPE_CODE === typeId; })[0];
                    var isUpd = !!(old && old.ID);
                    var id = ((isUpd ? old.ID : edu.util.uuid()) + '').toUpperCase();
                    // ⚠ Chống ghi đè rỗng. Cụm địa chỉ được giữ lại khi CHỈ CẦN tỉnh hoặc
                    // số nhà có giá trị (xem _collectAddrBlocks), nên nếu form chưa kịp nạp
                    // Huyện/Xã mà user bấm Cập nhật thì ghi thẳng b.huyen/b.xa xuống sẽ
                    // XOÁ TRẮNG dữ liệu đang có. Ô nào trống thì giữ nguyên giá trị cũ.
                    var giu = function (moi, cu, daCham) {
                        if (edu.util.checkValue(moi)) return moi;
                        if (daCham) return '';              // user chủ động xoá → ghi rỗng
                        return isUpd ? (cu || '') : '';     // form chưa nạp → giữ nguyên
                    };
                    var payload = {
                        'action': isUpd ? me._ACTION_Addr_Sua : me._ACTION_Addr_Them,
                        'func': 'PKG_CORE_HOSONHANSU_06.' + (isUpd ? 'Upd_Person_Address' : 'Ins_Person_Address'),
                        'iM': edu.system.iM,
                        'Id': id,
                        'strId': id,
                        'strChucNang_Id': edu.system.strChucNang_Id,
                        'strVaiTro_Id': '',
                        'strPerson_Id': personId,
                        'strAddress_Type_Code': typeId,
                        'strAddress_Status_Code': '',
                        'strCountry_Id': '',
                        'strProvince_Id': giu(b.tinh, old && old.PROVINCE_ID, b.daCham),
                        'strDistrict_Id': giu(b.huyen, old && old.DISTRICT_ID, b.daCham),
                        'strWard_Id': giu(b.xa, old && old.WARD_ID, b.daCham),
                        'strAddress_Line1': giu(b.line, old && old.ADDRESS_LINE1, b.chamLine),
                        'strAddress_Line2': '',
                        'strFull_Address': giu(b.full, old && old.FULL_ADDRESS, b.daCham || b.chamLine),
                        'strPostal_Code': '',
                        // Hộ khẩu thường trú là địa chỉ chính; d* = NUMBER nên gửi số, không gửi ''
                        'dIs_Primary': (b.kind === 'HK') ? 1 : 0,
                        'dIs_Verified': 0,
                        'dIs_Active': 1,
                        'strEffective_From': '',
                        'strEffective_To': '',
                        'strNote': '',
                        'strNguoiThucHien_Id': edu.system.userId
                    };
                    edu.system.makeRequest({
                        success: function () { },
                        error: function () { },
                        type: 'POST',
                        contentType: true,
                        action: payload.action,
                        data: payload,
                        fakedb: []
                    }, false, false, false, null);
                });
            });
        });
    },

    /*------------------------------------------
    -- Cảnh báo (đồng bộ) khi danh mục Loại địa chỉ thiếu mục cần dùng.
    -- Gộp vào chung 1 alert thành công thay vì alert riêng: BS3 chồng alert sẽ gỡ
    -- body.modal-open làm form đang mở tự đóng.
    -------------------------------------------*/
    _addrWarnText: function (blocks) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!me.dtDM_AddrType || !me.dtDM_AddrType.length) return '';
        var missing = (blocks || []).filter(function (b) { return !me._addrTypeId(b.kind); })
            .map(function (b) { return b.kind === 'NS' ? 'Nơi sinh' : 'Hộ khẩu thường trú'; });
        if (!missing.length) return '';
        return '<br/><span class="text-danger">Chưa lưu được ' + missing.join(' và ')
            + ': danh mục "Loại địa chỉ" (PERSON_ADDRESS.ADDRESS_TYPE_CODE) chưa khai báo mục này.</span>';
    },

    /*==========================================================================
    == FORM SỬA — NẠP CHI TIẾT HỒ SƠ THEO ID (PKG_CORE_TS_HOSO.LayTT_HoSo_TS)
    == openSuaHoSo trước đây chỉ đọc từ cache dtKQDK_HoSo (view LayDS_HoSo_TS ~20 cột)
    == nên tab Xét tuyển / Gia đình / Intake luôn trống dù DB có dữ liệu (Them_HoSo_TS
    == ghi đủ). Proc LayTT_HoSo_TS lấy trọn 1 hồ sơ theo Id — dùng đúng cho form Sửa.
    ==========================================================================*/
    _ACTION_LayTT_HoSo: 'SV_Core_TS_HoSo_MH/DSA4FRUeCS4SLh4VEgPP',

    /*------------------------------------------
    -- Lấy field theo tên "lỏng": bỏ qua khác biệt hoa/thường và tiền tố nhóm cột
    -- (HOSO_/XETTUYEN_/PERSONEDU_/PERSONFAM_...). Khớp đuôi bắt buộc đúng ranh giới "_"
    -- nên tìm 'TEN' sẽ KHÔNG ăn nhầm 'HOTEN'.
    -------------------------------------------*/
    _pickLoose: function (row, names) {
        if (!row) return '';
        var up = function (s) { return (s + '').replace(/\s+/g, '').toUpperCase(); };
        var bare = function (s) { return up(s).replace(/_/g, ''); };
        var keys = [];
        for (var k in row) { if (row.hasOwnProperty(k)) keys.push(k); }
        var val = function (key) {
            var v = row[key];
            return (v === undefined || v === null || v === '') ? null : v;
        };
        for (var i = 0; i < names.length; i++) {
            var want = up(names[i]);
            var wantBare = bare(names[i]);
            // 1) Khớp đúng tên — bỏ qua khác biệt hoa/thường và vị trí dấu "_"
            for (var j = 0; j < keys.length; j++) {
                if (bare(keys[j]) === wantBare) { var v1 = val(keys[j]); if (v1 !== null) return v1; }
            }
            // 2) Khớp đuôi để bỏ tiền tố nhóm (HOSO_/XETTUYEN_/PERSONEDU_...).
            //    Chỉ áp dụng cho tên đủ đặc trưng: có "_" hoặc dài >= 6 ký tự —
            //    nếu không thì 'TEN' sẽ vơ luôn '..._TEN' bất kỳ, 'ID' vơ 'HOSO_ID'.
            if (want.indexOf('_') < 0 && want.length < 6) continue;
            for (var j2 = 0; j2 < keys.length; j2++) {
                var nk = up(keys[j2]);
                if (nk.length > want.length + 1 && nk.slice(-(want.length + 1)) === '_' + want) {
                    var v2 = val(keys[j2]); if (v2 !== null) return v2;
                }
            }
        }
        return '';
    },

    _loadHoSoDetail_ForEdit: function (strHoSoId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(strHoSoId)) return;
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data)) return;
                var d = data.Data;
                if (d.length !== undefined) d = d[0];   // proc trả cursor → lấy dòng đầu
                if (!d) return;
                /* Vớt Đợt tuyển sinh từ bản chi tiết khi view danh sách không trả DOT_ID.
                   Đợt rỗng kéo theo cả dây: dropdown Nguyện vọng load sai, và
                   Them_TS_HoSo_DoiTacTS báo "Khong ton tai ho so tuyen sinh" vì proc tra hồ
                   sơ theo bộ (kế hoạch + đợt + nguyện vọng + người). */
                if (!edu.util.checkValue(me.strDot_Id_ForKQ)) {
                    var dotCT = me._pickLoose(d, ['HOSO_KH_TS_DOT_ID', 'KH_TS_DOT_ID',
                        'TS_KH_TUYENSINH_DOT_ID', 'DOT_ID'])
                        || me._kqPickFuzzy(d, /DOT.*_ID$/i);
                    if (edu.util.checkValue(dotCT)) {
                        me.strDot_Id_ForKQ = dotCT;
                        me._ensureDotTuyenSinh(function () {
                            me._loadDotToKhai();
                            // Đợt vừa xác định được → Nguyện vọng / Phương thức phải nạp lại theo đợt
                            me._loadNguyenVongDauRa();
                            me._loadPhuongThucTuyenSinh();
                        });
                    }
                }
                me._bindHoSoDetail_ForEdit(d);
                // Dropdown phụ thuộc danh mục nạp async → bind lại vài mốc cho chắc
                setTimeout(function () { me._bindHoSoDetail_ForEdit(d); }, 900);
                setTimeout(function () { me._bindHoSoDetail_ForEdit(d); }, 1800);
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: me._ACTION_LayTT_HoSo,
            data: {
                'action': me._ACTION_LayTT_HoSo,
                'func': 'PKG_CORE_TS_HOSO.LayTT_HoSo_TS',
                'iM': edu.system.iM,
                'strHoSo_Id': strHoSoId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'XEM'
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Dò cột theo TỪ KHÓA khi không đoán trúng tên đầy đủ.
    -- Tách sẵn 3 loại để không lẫn: cột *_TEN/_NAME là nhãn, *_ID/_IDS là khoá,
    -- còn lại là giá trị trần (VD PERSONEDU_HOCLUC lưu thẳng Id danh mục).
    -------------------------------------------*/
    _pickPair: function (row, re) {
        var out = { id: '', ten: '' };
        if (!row) return out;
        var plain = '';
        for (var k in row) {
            if (!row.hasOwnProperty(k)) continue;
            var K = (k + '').toUpperCase();
            if (!re.test(K)) continue;
            var v = row[k];
            if (v === undefined || v === null || v === '') continue;
            if (/(_TEN|_NAME|_MOTA)$/.test(K)) { if (!out.ten) out.ten = v; }
            else if (/_IDS?$/.test(K)) { if (!out.id) out.id = v; }
            else if (plain === '') plain = v;
        }
        if (!out.id) out.id = plain;
        return out;
    },

    /*------------------------------------------
    -- Thông tin thanh toán (tab 6) — PKG_CORE_TS_HOSO.LayDS_Bank_TS theo Core_Person_Id.
    -- Trước đây không hàm nào đọc lên nên cụm này luôn trống khi mở Sửa.
    -------------------------------------------*/
    _ACTION_LayDS_Bank: 'SV_Core_TS_HoSo_MH/DSA4BRIeAyAvKh4VEgPP',

    _loadBank_ForEdit: function (corePersonId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(corePersonId)) return;
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data)) return;
                var b = data.Data;
                if (b.length !== undefined) {
                    // Nhiều tài khoản → ưu tiên cái đang dùng / mặc định
                    b = b.filter(function (x) {
                        return x && (x.IS_ACTIVE === undefined || x.IS_ACTIVE == 1);
                    }).sort(function (x, y) {
                        return (y.IS_PRIMARY == 1 ? 1 : 0) - (x.IS_PRIMARY == 1 ? 1 : 0);
                    })[0];
                }
                if (!b) return;
                var bind = function () { me._bindBank_ForEdit(b); };
                bind();
                setTimeout(bind, 900);
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: me._ACTION_LayDS_Bank,
            data: {
                'action': me._ACTION_LayDS_Bank,
                'func': 'PKG_CORE_TS_HOSO.LayDS_Bank_TS',
                'iM': edu.system.iM,
                'strCorePerson_Id': corePersonId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'XEM'
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================================
    == CCCD — SỐ / NGÀY CẤP / NƠI CẤP (PERSON_IDENTIFIER)
    == Sua_HoSo_TS chỉ nhận strPersonIden_SoCCCD, không có ngày cấp và nơi cấp.
    == PKG_CORE_HOSONHANSU_05 có đủ Insert/UpdatePersonIdentifier.
    ==========================================================================*/
    _ACTION_Iden_LayDS: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
    _ACTION_Iden_Them: 'NS_HoSoNhanSu5_MH/CC8yJDM1ESQzMi4vCCUkLzUoJygkMwPP',
    _ACTION_Iden_Sua: 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vCCUkLzUoJygkMwPP',

    _ensureIdenTypeDM: function (cb) {
        main_doc.KeHoachTuyenSinhNew._ensureDMList(
            'PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE', 'dtDM_IdenType', cb);
    },

    /*------------------------------------------
    -- Id danh mục loại giấy tờ = CCCD. Ưu tiên CCCD/căn cước, không có mới lấy CMND.
    -------------------------------------------*/
    _idenTypeId: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var dt = me.dtDM_IdenType || [];
        if (!dt.length) return '';
        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
        };
        var tim = function (rx) {
            var f = dt.filter(function (e) { return rx.test(strip(e.TEN) + ' ' + strip(e.MA)); })[0];
            return f ? (f.ID || '') : '';
        };
        return tim(/CCCD|CAN CUOC/) || tim(/CMND|CHUNG MINH/);
    },

    _collectIden: function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        var i = {
            so: g('txtKQ_SoCCCD'),
            ngayCap: g('txtKQ_NgayCapCCCD'),
            noiCap: g('txtKQ_NoiCapCCCD')
        };
        // Ngày/nơi cấp mà không có số thì không đủ để tạo bản ghi định danh
        return i.so ? i : null;
    },

    /*------------------------------------------
    -- cb: gọi khi ĐÃ GHI XONG. Cần vì số CCCD hiển thị ở bảng danh sách lấy từ
    -- PERSON_IDENTIFIER — do chính hàm này ghi, mà nó là chuỗi 2 bước (đọc rồi mới ghi).
    -- Không chờ thì tải lại danh sách xong rồi nó mới ghi → bảng vẫn hiện số cũ,
    -- phải F5 mới thấy (sếp Khoa báo 23/09/2026 khi sửa hàng loạt CCCD thiếu số 0).
    -------------------------------------------*/
    save_PersonIden: function (personId, i, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (!edu.util.checkValue(personId) || !i) { xong(); return; }
        me._ensureIdenTypeDM(function () {
            edu.system.makeRequest({
                success: function (data) {
                    var rows = (data && data.Success && data.Data) || [];
                    if (rows && rows.length === undefined) rows = [rows];
                    var strip = function (s) {
                        return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
                    };
                    var old = (rows || []).filter(function (r) {
                        return /CCCD|CAN CUOC|CMND/.test(
                            strip(r.IDENTIFIER_TYPE_CODE_MA || r.MA) + ' ' +
                            strip(r.IDENTIFIER_TYPE_CODE_NAME || r.IDENTIFIER_TYPE_NAME));
                    })[0] || (rows || []).filter(function (r) { return r.IS_PRIMARY == 1; })[0]
                        || (rows || [])[0];
                    me._writeIden(personId, i, old || null, cb);
                },
                error: function () { me._writeIden(personId, i, null, cb); },
                type: 'POST',
                contentType: true,
                action: me._ACTION_Iden_LayDS,
                data: {
                    'action': me._ACTION_Iden_LayDS,
                    'func': 'PKG_CORE_HOSONHANSU_05.GetPersonIdentifierByPerson_Id',
                    'iM': edu.system.iM,
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strPerson_Id': personId
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    _writeIden: function (personId, i, old, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        var oldId = old ? me._pickLoose(old, ['ID', 'PERSON_IDENTIFIER_ID']) : '';
        var isUpd = edu.util.checkValue(oldId);
        // Sửa thì giữ nguyên loại giấy tờ của bản ghi cũ, khỏi phụ thuộc danh mục
        var typeId = (old && old.IDENTIFIER_TYPE_CODE) || me._idenTypeId();
        if (!edu.util.checkValue(typeId)) { xong(); return; }
        var payload = {
            'action': isUpd ? me._ACTION_Iden_Sua : me._ACTION_Iden_Them,
            'func': 'PKG_CORE_HOSONHANSU_05.' + (isUpd ? 'UpdatePersonIdentifier' : 'InsertPersonIdentifier'),
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPersonId': personId,
            'strIdentifierTypeCode': typeId,
            'strIdentifierNo': i.so,
            // Gửi thẳng giá trị ô input như luồng Thêm mới (strPersonIden_NgayCap) vẫn làm
            'strIssueDate': i.ngayCap,
            'strIssuePlace': i.noiCap,
            'dIsPrimary': 1,
            'strEffectiveFrom': '',
            'strEffectiveTo': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (isUpd) payload.strId = oldId;
        edu.system.makeRequest({
            // Báo xong ở cả 2 nhánh: hỏng cũng phải tải lại danh sách, không thì
            // màn hình treo ở trạng thái cũ mà người dùng không biết vì sao.
            success: function () { xong(); },
            error: function () { xong(); },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================================
    == TAB 5 — GIA ĐÌNH (PERSON_FAMILY)
    == Sua_HoSo_TS không có param bố/mẹ. PKG_CORE_HOSONHANSU_06 có đủ bộ
    == Get_/Ins_/Upd_Person_Family → đọc và ghi được trọn vẹn.
    == RELATION_TYPE_CODE là Id danh mục PERSON_FAMILY.RELATION_TYPE_CODE
    == (GUID, không phải mã chữ) — xem [_famTypeId].
    ==========================================================================*/
    _ACTION_Fam_LayDS: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4HICwoLTgP',
    _ACTION_Fam_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4HICwoLTgP',
    _ACTION_Fam_Sua: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4HICwoLTgP',

    _ensureFamTypeDM: function (cb) {
        main_doc.KeHoachTuyenSinhNew._ensureDMList(
            'PERSON_FAMILY.RELATION_TYPE_CODE', 'dtDM_FamType', cb);
    },

    /*------------------------------------------
    -- kind: 'BO' | 'ME' → Id danh mục quan hệ. Khớp đúng tên trước ("Bố", "Cha", "Mẹ"),
    -- sau đó mới khớp theo từ ("Bố đẻ", "Mẹ ruột"). Bắt buộc ranh giới từ, nếu không
    -- "ME" sẽ ăn nhầm "ANH EM", "CHA" ăn nhầm "CHAU".
    -------------------------------------------*/
    _famTypeId: function (kind) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var dt = me.dtDM_FamType || [];
        if (!dt.length) return '';
        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().trim();
        };
        var chinhXac = (kind === 'BO') ? ['BO', 'CHA'] : ['ME'];
        var found = dt.filter(function (e) { return chinhXac.indexOf(strip(e.TEN)) >= 0; })[0];
        if (found) return found.ID || '';
        var rx = (kind === 'BO') ? /\b(BO|CHA|FATHER)\b/ : /\b(ME|MOTHER)\b/;
        found = dt.filter(function (e) { return rx.test(strip(e.TEN) + ' ' + strip(e.MA)); })[0];
        return found ? (found.ID || '') : '';
    },

    _getFamilyList: function (personId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId)) { cb([]); return; }
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (rows && rows.length === undefined) rows = [rows];
                cb((rows || []).filter(function (r) {
                    return r && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1);
                }));
            },
            error: function () { cb([]); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Fam_LayDS,
            data: {
                'action': me._ACTION_Fam_LayDS,
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Family',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'strPerson_Id': personId
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Tìm bản ghi Bố / Mẹ trong danh sách: ưu tiên khớp Id danh mục, không có thì
    -- đoán theo tên quan hệ mà API trả kèm.
    -------------------------------------------*/
    _findFamRow: function (rows, kind) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var typeId = me._famTypeId(kind);
        var hit = typeId && rows.filter(function (r) { return r.RELATION_TYPE_CODE === typeId; })[0];
        if (hit) return hit;
        var strip = function (s) {
            return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
        };
        var rx = (kind === 'BO') ? /\b(BO|CHA|FATHER)\b/ : /\b(ME|MOTHER)\b/;
        return rows.filter(function (r) {
            return rx.test(strip(r.RELATION_TYPE_CODE_NAME || r.RELATION_TYPE_NAME || ''));
        })[0];
    },

    _loadFamily_ForEdit: function (personId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId)) return;
        me._ensureFamTypeDM(function () {
            me._getFamilyList(personId, function (rows) {
                if (!rows.length) return;
                [['BO', 'Bo'], ['ME', 'Me']].forEach(function (pair) {
                    var r = me._findFamRow(rows, pair[0]);
                    if (!r) return;
                    var pre = 'txtKQ_' + pair[1] + '_';
                    var set = function (id, v) {
                        if (edu.util.checkValue(v) && !$('#' + id).val()) edu.util.viewValById(id, v);
                    };
                    set(pre + 'HoTen', me._pickLoose(r, ['FULL_NAME', 'HOTEN']));
                    set(pre + 'NamSinh', me._pickLoose(r, ['BIRTH_YEAR', 'NAMSINH']));
                    set(pre + 'NoiO', me._pickLoose(r, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']));
                    set(pre + 'SDT', me._pickLoose(r, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']));
                });
            });
        });
    },

    _collectFamily: function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        var one = function (kind, pre) {
            var f = {
                kind: kind,
                hoTen: g('txtKQ_' + pre + '_HoTen'),
                namSinh: g('txtKQ_' + pre + '_NamSinh'),
                noiO: g('txtKQ_' + pre + '_NoiO'),
                sdt: g('txtKQ_' + pre + '_SDT')
            };
            return (f.hoTen || f.namSinh || f.noiO || f.sdt) ? f : null;
        };
        return [one('BO', 'Bo'), one('ME', 'Me')].filter(function (f) { return f; });
    },

    save_PersonFamily: function (personId, list) {
        var me = main_doc.KeHoachTuyenSinhNew;
        list = list || [];
        if (!edu.util.checkValue(personId) || !list.length) return;
        me._ensureFamTypeDM(function () {
            me._getFamilyList(personId, function (rows) {
                list.forEach(function (f) {
                    var typeId = me._famTypeId(f.kind);
                    if (!typeId) return;   // danh mục thiếu Bố/Mẹ → không ghi bừa
                    me._writeFamily(personId, f, typeId, me._findFamRow(rows, f.kind));
                });
            });
        });
    },

    _writeFamily: function (personId, f, typeId, old) {
        var me = main_doc.KeHoachTuyenSinhNew;
        old = old || {};
        var oldId = me._pickLoose(old, ['ID', 'PERSON_FAMILY_ID']);
        var isUpd = edu.util.checkValue(oldId);
        // Năm sinh / Nơi ở đã ẩn khỏi form (yêu cầu khách 11/09/2026) nên f.namSinh,
        // f.noiO luôn rỗng. Gửi thẳng xuống là XOÁ TRẮNG dữ liệu đang có → giữ giá trị cũ.
        var noiOMoi = edu.util.checkValue(f.noiO) ? f.noiO
            : me._pickLoose(old, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']);
        // ⚠ Number('') === 0 chứ không phải NaN → phải kiểm tra rỗng TRƯỚC khi ép số,
        // không thì hồ sơ mới sẽ ghi BIRTH_YEAR = 0 vào DB.
        var namSinhRaw = edu.util.checkValue(f.namSinh) ? f.namSinh
            : me._pickLoose(old, ['BIRTH_YEAR', 'NAMSINH']);
        var namSinh = edu.util.checkValue(namSinhRaw) ? Number(namSinhRaw) : NaN;
        var payload = {
            'action': isUpd ? me._ACTION_Fam_Sua : me._ACTION_Fam_Them,
            'func': 'PKG_CORE_HOSONHANSU_06.' + (isUpd ? 'Upd_Person_Family' : 'Ins_Person_Family'),
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': personId,
            'strRelation_Type_Code': typeId,
            'strRelation_Status_Code': '',
            'strFull_Name': f.hoTen,
            'strLast_Name': '',
            'strMiddle_Name': '',
            'strFirst_Name': '',
            'strGender_Id': '',
            'strDate_Of_Birth': '',
            'strDob_Precision_Level': '',
            // Form tuyển sinh chỉ hỏi NĂM sinh → ngày/tháng để null, không gửi ''
            'dBirth_Day': null,
            'dBirth_Month': null,
            'dBirth_Year': isNaN(namSinh) ? null : namSinh,
            'strOccupation': '',
            'strWorkplace': '',
            'strPhone_Number': f.sdt,
            'strEmail': '',
            'strAddress_Text': noiOMoi,
            'dIs_Dependent': 0,
            'dIs_Emergency_Contact': 0,
            'dIs_Primary_Contact': (f.kind === 'BO') ? 1 : 0,
            'dIs_Active': 1,
            'strEffective_From': '',
            'strEffective_To': '',
            'strNote': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (isUpd) payload.strId = oldId;
        edu.system.makeRequest({
            success: function () { },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================================
    == GHI DÂN TỘC / TÔN GIÁO (PERSON_PROFILE)
    == Sua_HoSo_TS không có param cho 2 trường này (Them_HoSo_TS thì có), nên sửa
    == hồ sơ là mất. PKG_CORE_NGUOIHOC_01 có bộ Them_/Sua_Person_Profile riêng.
    == ⚠ Quốc tịch KHÔNG có param ở cả Them_ lẫn Sua_Person_Profile → vẫn chờ BE.
    ==========================================================================*/
    _ACTION_Profile_LayTT: 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
    _ACTION_Profile_Them: 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8eETMuJygtJAPP',
    _ACTION_Profile_Sua: 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLx4RMy4nKC0k',

    _collectProfile: function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        var p = { danToc: g('ddlKQ_DanToc'), tonGiao: g('ddlKQ_TonGiao') };
        return (p.danToc || p.tonGiao) ? p : null;
    },

    save_PersonProfile: function (personId, p) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId) || !p) return;
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (rows && rows.length === undefined) rows = [rows];
                me._writeProfile(personId, p, (rows && rows[0]) || null);
            },
            error: function () { me._writeProfile(personId, p, null); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Profile_LayTT,
            data: {
                'action': me._ACTION_Profile_LayTT,
                'func': 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
                'iM': edu.system.iM,
                'strId': '',
                'strPerson_Id': personId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    _writeProfile: function (personId, p, old) {
        var me = main_doc.KeHoachTuyenSinhNew;
        old = old || {};
        var oldId = me._pickLoose(old, ['PERSON_PROFILE_ID', 'PROFILE_ID', 'ID']);
        var keep = function (v) { return (v === null || v === undefined) ? '' : v; };
        // Form tuyển sinh không có input cho các field còn lại của PERSON_PROFILE
        // (thành phần GĐ, hôn nhân, đối tượng CS, nhóm máu, Đoàn/Đảng) → gửi lại
        // giá trị cũ để Sua_ không xoá trắng chúng.
        var payload = {
            'iM': edu.system.iM,
            'strReligion_Id': p.tonGiao,
            'strEthnicity_Id': p.danToc,
            'strFamilyBackground_Id': keep(old.FAMILY_BACKGROUND_ID),
            'strMaritalStatus_Id': keep(old.MARITAL_STATUS_ID),
            'strPolicyObject_Id': keep(old.POLICY_OBJECT_ID),
            'strBloodType_Code': keep(old.BLOOD_TYPE_CODE),
            'strUnionJoinDate': keep(old.UNION_JOIN_DATE),
            'strPartyJoinDate': keep(old.PARTY_JOIN_DATE),
            'strPartyOfficialDate': keep(old.PARTY_OFFICIAL_DATE),
            'dIsActive': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };
        if (edu.util.checkValue(oldId)) {
            payload.action = me._ACTION_Profile_Sua;
            payload.func = 'PKG_CORE_NGUOIHOC_01.Sua_Person_Profile';
            payload.strId = oldId;
        } else {
            payload.action = me._ACTION_Profile_Them;
            payload.func = 'PKG_CORE_NGUOIHOC_01.Them_Person_Profile';
            payload.strPerson_Id = personId;
        }
        edu.system.makeRequest({
            success: function () { },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================================
    == GHI THÔNG TIN THANH TOÁN (PERSON_BANK_ACCOUNT)
    == Sua_HoSo_TS không có param ngân hàng (chỉ 14 param) nên bấm Cập nhật là mất.
    == Sua_Bank_TS lại BẮT BUỘC strPersonBank_Id → chỉ sửa được bản ghi đã có.
    == Vì vậy: có bản ghi → Sua_Bank_TS; chưa có → Ins_Person_Bank_Account
    == (PKG_CORE_HOSONHANSU_06, cùng bảng, đang dùng ở trang Đề xuất hồ sơ).
    ==========================================================================*/
    _ACTION_Bank_Sua: 'SV_Core_TS_HoSo_MH/EjQgHgMgLyoeFRIP',
    _ACTION_Bank_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP',

    /*------------------------------------------
    -- Chụp cụm Thanh toán khỏi form (đồng bộ) — xem chú thích ở _collectAddrBlocks.
    -------------------------------------------*/
    _collectBank: function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        var b = {
            loai: g('ddlKQ_HD_HinhThucTT'),
            nganHang: g('txtKQ_HD_NganHang'),
            soTK: g('txtKQ_HD_SoTK'),
            chuTK: g('txtKQ_HD_ChuTK'),
            ghiChu: g('txtKQ_HD_GhiChu')
        };
        return (b.loai || b.nganHang || b.soTK || b.chuTK || b.ghiChu) ? b : null;
    },

    save_PersonBank: function (personId, b) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId) || !b) return;
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (rows && rows.length === undefined) rows = [rows];
                var old = (rows || []).filter(function (r) {
                    return r && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1);
                }).sort(function (x, y) {
                    return (y.IS_PRIMARY == 1 ? 1 : 0) - (x.IS_PRIMARY == 1 ? 1 : 0);
                })[0];
                me._writeBank(personId, b, old ? me._pickLoose(old, ['ID', 'PERSONBANK_ID', 'PERSON_BANK_ID']) : '');
            },
            error: function () { me._writeBank(personId, b, ''); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_LayDS_Bank,
            data: {
                'action': me._ACTION_LayDS_Bank,
                'func': 'PKG_CORE_TS_HOSO.LayDS_Bank_TS',
                'iM': edu.system.iM,
                'strCorePerson_Id': personId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'XEM'
            },
            fakedb: []
        }, false, false, false, null);
    },

    _writeBank: function (personId, b, oldId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var payload;
        if (edu.util.checkValue(oldId)) {
            payload = {
                'action': me._ACTION_Bank_Sua,
                'func': 'PKG_CORE_TS_HOSO.Sua_Bank_TS',
                'iM': edu.system.iM,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'SUA',
                'strPersonBank_Id': oldId,
                'strPersonBank_HinhThucTT': b.loai,
                'strPersonBank_TenNganHang': b.nganHang,
                'strPersonBank_SoTaiKhoan': b.soTK,
                'strPersonBank_ChuTaiKhoan': b.chuTK,
                'strPersonBank_GhiChu': b.ghiChu
            };
        } else {
            // Chưa có bản ghi → Sua_Bank_TS vô dụng (thiếu Id). Dùng proc Ins của
            // PKG_CORE_HOSONHANSU_06 — cùng bảng PERSON_BANK_ACCOUNT.
            payload = {
                'action': me._ACTION_Bank_Them,
                'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Bank_Account',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strPerson_Id': personId,
                'strAccount_Type_Code': b.loai,
                'strAccount_Status_Code': '',
                'strBank_Id': '',
                'strBank_Code': '',
                'strBank_Name': b.nganHang,
                'strBranch_Id': '',
                'strBranch_Code': '',
                'strBranch_Name': '',
                'strAccount_Number': b.soTK,
                'strAccount_Name': b.chuTK,
                'strAccount_Currency_Code': '',
                'dIs_Primary': 1,
                'dIs_Payroll_Default': 0,
                'dIs_Verified': 0,
                'dIs_Active': 1,
                'strEffective_From': '',
                'strEffective_To': '',
                'strNote': b.ghiChu,
                'strNguoiThucHien_Id': edu.system.userId
            };
        }
        edu.system.makeRequest({
            success: function () { },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- CÔNG CỤ CHẨN ĐOÁN — không tự chạy, không ghi log nền.
    -- Mở form Sửa rồi gõ ở Console:  main_doc.KeHoachTuyenSinhNew._dumpEdit()
    -- In ra tên cột thật của LayTT_HoSo_TS + LayDS_Bank_TS để map cho đúng,
    -- thay vì đoán tên cột.
    -------------------------------------------*/
    /*------------------------------------------
    -- CÔNG CỤ CHẨN ĐOÁN cho BẢNG danh sách. Gõ ở Console khi đang xem danh sách:
    --     main_doc.KeHoachTuyenSinhNew._dumpList()
    -- In ra tên cột thật mà LayDS_HoSo_TS_FULL trả về + soi riêng các cột liên quan
    -- Điện thoại/Email. Đọc từ cache đã nạp nên không gọi thêm request nào.
    -------------------------------------------*/
    _dumpList: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var rows = me.dtKQDK_HoSo || [];
        console.log('Số dòng đang có:', rows.length);
        if (!rows.length) { console.log('(chưa nạp danh sách)'); return; }
        var keys = Object.keys(rows[0]);
        console.log('Tổng số cột view trả về:', keys.length);
        var lienQuan = keys.filter(function (k) {
            return /DIENTHOAI|DIEN_THOAI|SDT|PHONE|MOBILE|EMAIL|MAIL|CONTACT/i.test(k);
        });
        console.log('Cột liên quan Điện thoại/Email:', lienQuan.length ? lienQuan : '(KHÔNG CÓ CỘT NÀO)');
        lienQuan.forEach(function (k) { console.log('   ' + k + ' =', rows[0][k]); });
        // Lớp quản lý — soi riêng để biết view trả mã, trả ID, hay không trả gì
        var cotLop = keys.filter(function (k) { return /LOP/i.test(k); });
        console.log('Cột liên quan Lớp:', cotLop.length ? cotLop : '(KHÔNG CÓ CỘT NÀO)');
        cotLop.forEach(function (k) { console.log('   ' + k + ' =', rows[0][k]); });
        console.log('   → _kqLopQL(dòng 1) =', me._kqLopQL(rows[0]) || '(rỗng)',
            '| số lớp trong map =', Object.keys(me._lopQLMap || {}).length);
        console.log('--- toàn bộ tên cột ---');
        console.log(keys);
        console.log('--- dòng đầu tiên ---');
        console.log(rows[0]);
    },

    /*------------------------------------------
    -- CHẨN ĐOÁN CỘT "MÃ LỚP QL". Mở modal Kết quả đăng ký rồi gõ ở Console:
    --     main_doc.KeHoachTuyenSinhNew._dumpLop()
    -- In 3 thứ để chốt vì sao cột trống:
    --   1) Danh sách (LayDS_HoSo_TS) có cột nào dính chữ LOP không, giá trị ra sao
    --   2) Chi tiết 1 hồ sơ (LayTT_HoSo_TS) có cột lớp không — nếu DS thiếu mà chi tiết
    --      có thì chuyển sang lấy theo từng dòng như đang làm với SĐT/Email
    --   3) Map ID→Mã lớp nạp được bao nhiêu dòng (0 = proc lớp quản lý gọi hỏng)
    -------------------------------------------*/
    _dumpLop: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var rows = me.dtKQDK_HoSo || [];
        console.log('=== CHẨN ĐOÁN CỘT MÃ LỚP QL ===');
        console.log('Số dòng danh sách đang có:', rows.length);
        console.log('Map lớp quản lý (ID → Mã):', Object.keys(me._lopQLMap || {}).length, 'lớp');
        if (!rows.length) { console.log('(chưa nạp danh sách — mở modal Kết quả đăng ký trước)'); return; }

        var soi = function (nhan, row) {
            if (!row) { console.log('[' + nhan + '] (không có dữ liệu)'); return; }
            var keys = Object.keys(row);
            var cot = keys.filter(function (k) { return /LOP/i.test(k); });
            console.log('[' + nhan + '] tổng ' + keys.length + ' cột, cột dính chữ LOP:',
                cot.length ? cot : '(KHÔNG CÓ CỘT NÀO)');
            cot.forEach(function (k) { console.log('     ' + k + ' =', row[k]); });
        };

        var d0 = rows[0];
        soi('LayDS_HoSo_TS — dòng 1', d0);
        console.log('   → _kqLopQL(dòng 1) =', me._kqLopQL(d0) || '(rỗng)');

        var hoSoId = me._kqPick(d0, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']);
        console.log('   HoSo_Id dòng 1 =', hoSoId || '(không lấy được)');
        if (!hoSoId) return;
        edu.system.makeRequest({
            success: function (r) {
                var d = (r && r.Data) || null;
                var row = (d && d.length !== undefined) ? d[0] : d;
                console.log('LayTT_HoSo_TS: Success=' + (r && r.Success), (r && r.Message) || '');
                soi('LayTT_HoSo_TS — hồ sơ dòng 1', row);
                if (row) console.log('   (toàn bộ dòng chi tiết)', row);
            },
            error: function (e) { console.log('LayTT_HoSo_TS LỖI', e); },
            type: 'POST', contentType: true,
            action: me._ACTION_LayTT_HoSo,
            data: {
                'action': me._ACTION_LayTT_HoSo,
                'func': 'PKG_CORE_TS_HOSO.LayTT_HoSo_TS',
                'iM': edu.system.iM,
                'strHoSo_Id': hoSoId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'XEM'
            },
            fakedb: []
        }, false, false, false, null);
    },

    _dumpEdit: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var show = function (nhan, data) {
            var d = (data && data.Data) || null;
            var row = (d && d.length !== undefined) ? d[0] : d;
            console.log('=== ' + nhan + ' ===', 'Success=' + (data && data.Success),
                (data && data.Message) || '', 'soDong=' + (d && d.length !== undefined ? d.length : (d ? 1 : 0)));
            if (row) { console.log(row); } else { console.log('(không có dữ liệu)'); }
        };
        var ctx = {
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        var call = function (nhan, action, func, them) {
            var body = { 'action': action, 'func': func };
            for (var k in ctx) body[k] = ctx[k];
            for (var k2 in them) body[k2] = them[k2];
            edu.system.makeRequest({
                success: function (r) { show(nhan, r); },
                error: function (e) { console.log('=== ' + nhan + ' === LỖI', e); },
                type: 'POST', contentType: true, action: action, data: body, fakedb: []
            }, false, false, false, null);
        };
        console.log('HoSo_Id =', me.strSuaHoSo_Id, '| CorePerson_Id =', me.strSuaHoSo_CorePersonId);
        // Danh mục Loại địa chỉ — thiếu mục "Nơi sinh" là Nơi sinh KHÔNG BAO GIỜ lưu được
        me._ensureAddrTypeDM(function () {
            var dt = me.dtDM_AddrType || [];
            console.log('=== Danh mục PERSON_ADDRESS.ADDRESS_TYPE_CODE ===', dt.length + ' mục');
            dt.forEach(function (e) { console.log('   ' + (e.MA || '(không mã)') + ' — ' + e.TEN); });
            console.log('   → Id "Nơi sinh"      =', me._addrTypeId('NS') || '(KHÔNG TÌM THẤY)');
            console.log('   → Id "Hộ khẩu TT"    =', me._addrTypeId('HK') || '(KHÔNG TÌM THẤY)');
        });
        call('LayTT_HoSo_TS', me._ACTION_LayTT_HoSo, 'PKG_CORE_TS_HOSO.LayTT_HoSo_TS',
            { 'strHoSo_Id': me.strSuaHoSo_Id });
        call('LayDS_Bank_TS', me._ACTION_LayDS_Bank, 'PKG_CORE_TS_HOSO.LayDS_Bank_TS',
            { 'strCorePerson_Id': me.strSuaHoSo_CorePersonId });
        // Dùng để trả lời: bảng PERSON_PROFILE có sẵn cột quốc tịch chưa?
        // Nếu có cột NATIONALITY_ID/QUOCTICH_ID trong kết quả → BE chỉ cần hở param;
        // không có → phải thêm cả cột.
        call('LayTTPerson_Profile', me._ACTION_Profile_LayTT, 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
            { 'strId': '', 'strPerson_Id': me.strSuaHoSo_CorePersonId });
        // Dùng để trả lời: view địa chỉ có trả cột DISTRICT_ID không?
        // Không có cột đó thì hồ sơ chỉ chọn Huyện (bỏ trống Xã) sẽ không đọc lại được.
        call('Get_Person_Address', me._ACTION_Addr_LayDS, 'PKG_CORE_HOSONHANSU_06.Get_Person_Address',
            { 'strPerson_Id': me.strSuaHoSo_CorePersonId, 'strVaiTro_Id': '' });
    },

    _bindHoSoDetail_ForEdit: function (d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var L = function (names) { return me._pickLoose(d, names); };
        // Thử tên đầy đủ trước, không trúng thì dò theo từ khóa đặc trưng của cột
        var V = function (names, re) {
            var v = L(names);
            return edu.util.checkValue(v) ? v : (re ? me._pickPair(d, re).id : '');
        };
        var T = function (re) { return re ? me._pickPair(d, re).ten : ''; };
        // Cho ô free-text mà cái tên CHÍNH LÀ giá trị (VD "Trường lớp 12") — nhận cả cột *_TEN
        var VT = function (names, re) {
            var v = V(names, re);
            return edu.util.checkValue(v) ? v : T(re);
        };
        var setTxt = function (id, v) {
            if (edu.util.checkValue(v) && !$('#' + id).val()) edu.util.viewValById(id, v);
        };
        var setDrop = function (sel, id, ten) {
            if (edu.util.checkValue(id) || edu.util.checkValue(ten)) me._setSelectByIdOrText(sel, id, ten);
        };

        // --- Tab 3: Xét tuyển ---
        setDrop('#ddlKQ_PhuongThuc', V(['HOSO_KH_DOT_PT_ID', 'KH_DOT_PT_ID', 'DOT_PT_ID'], /DOT_PT|PHUONGTHUC/),
            T(/DOT_PT|PHUONGTHUC/));
        setDrop('#ddlKQ_DoiTuongTS', V(['HOSO_DOITUONG_TS_ID', 'DOITUONG_TS_ID'], /DOITUONG_?TS/),
            T(/DOITUONG_?TS/));
        setDrop('#ddlKQ_DoiTuongUT', V(['HOSO_DOITUONG_UT_IDS', 'DOITUONG_UT_IDS', 'DOITUONG_UT_ID'], /DOITUONG_?UT/),
            T(/DOITUONG_?UT/));
        setDrop('#ddlKQ_KhuVucUT', V(['HOSO_KHUVUC_UT_ID', 'KHUVUC_UT_ID'], /KHUVUC/), T(/KHUVUC/));
        setDrop('#ddlKQ_HocLuc', V(['PERSONEDU_HOCLUC', 'EDU_HOCLUC', 'HOCLUC'], /HOCLUC/), T(/HOCLUC/));
        setDrop('#ddlKQ_HanhKiem', V(['PERSONEDU_HANHKIEM', 'EDU_HANHKIEM', 'HANHKIEM'], /HANHKIEM/), T(/HANHKIEM/));
        // 'TINH_ID' trần dễ ăn nhầm tỉnh của Nơi sinh/Hộ khẩu → chỉ nhận cột có tiền tố EDU
        setTxt('txtKQ_MaTinh12', V(['PERSONEDU_TINH_ID', 'EDU_TINH_ID', 'PERSONEDU_TINH_MA'], /EDU.*TINH|TINH.*12/));
        var truong12 = VT(['PERSONEDU_TRUONGMATEN', 'EDU_TRUONGMATEN', 'TRUONGMATEN', 'TRUONG_MA_TEN'], /TRUONG/);
        setTxt('txtKQ_TruongMaTen', truong12);
        // Input đã ẩn → phải đổ ngược lên dropdown cho người dùng nhìn thấy
        if (edu.util.checkValue(truong12)) me._setTruong12FromText(truong12);
        setTxt('txtKQ_ToHopMa', V(['XETTUYEN_TOHOPMON_CODE', 'TOHOPMON_CODE', 'TOHOPMON_MA', 'TOHOP_MA'], /TOHOP.*(CODE|MA)$/));
        setTxt('txtKQ_ToHopTen', V(['XETTUYEN_TOHOPMON_TEN', 'TOHOPMON_TEN', 'TOHOP_TEN']) || T(/TOHOP/));
        setTxt('txtKQ_DiemUT', V(['XETTUYEN_DIEMUUTIEN', 'DIEMUUTIEN', 'DIEM_UU_TIEN'], /DIEM.*UUTIEN|DIEMUT$/));
        setTxt('txtKQ_TongDiemMon', V(['XETTUYEN_DIEMTONGMON', 'DIEMTONGMON', 'TONGDIEMMON'], /DIEM.*TONGMON|TONGDIEM.*MON/));
        setTxt('txtKQ_TongDiemXT', V(['XETTUYEN_DIEMTONGXT', 'DIEMTONGXT', 'TONGDIEMXT'], /DIEM.*TONGXT|TONGDIEM.*XT/));

        // Điểm từng môn: ưu tiên cột rời, không có thì tách chuỗi
        // XT_MON_DATA (MON_MA~DIEM~SO_MON~STT~MON_TEN|...)
        var diemRoi = [L(['XETTUYEN_DIEM1', 'DIEM1', 'DIEM_MON1']),
        L(['XETTUYEN_DIEM2', 'DIEM2', 'DIEM_MON2']),
        L(['XETTUYEN_DIEM3', 'DIEM3', 'DIEM_MON3'])];
        if (!diemRoi[0] && !diemRoi[1] && !diemRoi[2]) {
            var raw = V(['XT_MON_DATA', 'XTMON_DATA', 'MON_DATA'], /MON_?DATA/);
            if (raw) {
                (raw + '').split('|').forEach(function (item) {
                    var p = item.split('~');
                    var stt = parseInt(p[3], 10);
                    if (stt >= 1 && stt <= 3) diemRoi[stt - 1] = p[1];
                });
            }
        }
        for (var i = 0; i < 3; i++) setTxt('txtKQ_Diem' + (i + 1), diemRoi[i]);

        // --- Tab 5: Gia đình ---
        setTxt('txtKQ_Bo_HoTen', V(['PERSONFAM_BO_HOTEN', 'BO_HOTEN'], /BO_HOTEN|BO_TEN/));
        setTxt('txtKQ_Bo_NamSinh', V(['PERSONFAM_BO_NAMSINH', 'BO_NAMSINH'], /BO_NAMSINH/));
        setTxt('txtKQ_Bo_NoiO', V(['PERSONFAM_BO_NOIO', 'BO_NOIO'], /BO_NOIO|BO_DIACHI/));
        setTxt('txtKQ_Bo_SDT', V(['PERSONFAM_BO_SDT', 'BO_SDT'], /BO_SDT|BO_DIENTHOAI/));
        setTxt('txtKQ_Me_HoTen', V(['PERSONFAM_ME_HOTEN', 'ME_HOTEN'], /ME_HOTEN|ME_TEN/));
        setTxt('txtKQ_Me_NamSinh', V(['PERSONFAM_ME_NAMSINH', 'ME_NAMSINH'], /ME_NAMSINH/));
        setTxt('txtKQ_Me_NoiO', V(['PERSONFAM_ME_NOIO', 'ME_NOIO'], /ME_NOIO|ME_DIACHI/));
        setTxt('txtKQ_Me_SDT', V(['PERSONFAM_ME_SDT', 'ME_SDT'], /ME_SDT|ME_DIENTHOAI/));

        // --- Tab 4: Trúng tuyển / Intake ---
        setTxt('txtKQ_QDMa', V(['KETQUA_QUYETDINH_ID', 'QUYETDINH_MA', 'QUYETDINH_ID'], /QUYETDINH/));
        setTxt('txtKQ_IntakeCode', V(['INTAKE_INTAKECODE', 'INTAKECODE', 'INTAKE_CODE'], /INTAKE.*CODE$/));
        setTxt('txtKQ_IntakeTypeCode', V(['INTAKE_INTAKETYPECODE', 'INTAKETYPECODE', 'INTAKE_TYPE_CODE'], /INTAKE.*TYPE.*CODE$/));
        setDrop('#ddlKQ_CoSoDaoTao', V(['DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID'], /COSODAOTAO/), T(/COSODAOTAO/));

        // --- Tab 7: Nguồn khai thác (đối tác tuyển sinh) ---
        var dtId = V(['TS_DOITACTUYENSINH_ID', 'TS_DOITAC_TUYENSINH_ID', 'TS_DOITAC_ID', 'DOITAC_ID', 'DOI_TAC_ID'], /DOITAC/);
        var dtTen = T(/DOITAC/);
        if (edu.util.checkValue(dtId) || edu.util.checkValue(dtTen)) {
            setDrop('#ddlKQ_NguonKhaiThac', dtId, dtTen);
        }
    },

    /*------------------------------------------
    -- Bind riêng cụm Thanh toán. Tách khỏi _bindHoSoDetail_ForEdit vì bảng ngân hàng
    -- đặt tên kiểu khác hẳn (BANK_NAME, ACCOUNT_HOLDER_NAME, NOTE...) — đuôi _NAME làm
    -- _pickPair xếp vào nhóm "nhãn", nên ở đây phải nhận cả id lẫn ten.
    -------------------------------------------*/
    _bindBank_ForEdit: function (b) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var any = function (names, re) {
            var v = me._pickLoose(b, names);
            if (edu.util.checkValue(v)) return v;
            var p = me._pickPair(b, re);
            return edu.util.checkValue(p.id) ? p.id : p.ten;
        };
        var setTxt = function (id, v) {
            if (edu.util.checkValue(v) && !$('#' + id).val()) edu.util.viewValById(id, v);
        };
        var loai = me._pickPair(b, /HINHTHUCTT|ACCOUNT_TYPE|LOAI_?TK|BANK_TYPE/);
        if (edu.util.checkValue(loai.id) || edu.util.checkValue(loai.ten)) {
            me._setSelectByIdOrText('#ddlKQ_HD_HinhThucTT', loai.id, loai.ten);
        }
        setTxt('txtKQ_HD_NganHang', any(['PERSONBANK_TENNGANHANG', 'BANK_TENNGANHANG', 'TENNGANHANG'],
            /NGANHANG|BANK_NAME|BANK_TEN/));
        setTxt('txtKQ_HD_SoTK', any(['PERSONBANK_SOTAIKHOAN', 'BANK_SOTAIKHOAN', 'SOTAIKHOAN'],
            /SOTAIKHOAN|ACCOUNT_NO|ACCOUNT_NUMBER|SO_?TK/));
        setTxt('txtKQ_HD_ChuTK', any(['PERSONBANK_CHUTAIKHOAN', 'BANK_CHUTAIKHOAN', 'CHUTAIKHOAN'],
            /CHUTAIKHOAN|ACCOUNT_HOLDER|ACCOUNT_NAME|CHU_?TK/));
        setTxt('txtKQ_HD_GhiChu', any(['PERSONBANK_GHICHU', 'BANK_GHICHU', 'GHICHU', 'NOTE'],
            /GHICHU|^NOTE$|DESCRIPTION/));
    },

    /*------------------------------------------
    -- Ép strExtra_Data vừa cột SUA_HOSO_TS_LICHSU.EXTRA_DATA = VARCHAR2(1000).
    -- Vượt ngưỡng là ORA-12899 và HỎNG CẢ LẦN LƯU (không phải chỉ mất field thừa),
    -- nên thà bỏ bớt key phụ còn hơn để user bấm Cập nhật mà không lưu được gì.
    -- Đếm theo BYTE vì Oracle dùng byte semantics: 1 chữ có dấu = 3 byte UTF-8
    -- (lỗi thật báo 1009 byte trong khi chuỗi chỉ 1002 ký tự).
    -------------------------------------------*/
    _fitExtraData: function (obj) {
        var byteLen = function (s) {
            return encodeURIComponent(s + '').replace(/%[0-9A-F]{2}/gi, 'x').length;
        };
        var out = {};
        for (var k in obj) { if (obj[k]) out[k] = obj[k]; }
        var json = JSON.stringify(out);
        if (byteLen(json) <= 990) return json;
        // Bỏ dần key có value dài nhất cho tới khi vừa — luôn trả JSON hợp lệ
        var keys = Object.keys(out).sort(function (a, b) {
            return byteLen(out[b]) - byteLen(out[a]);
        });
        for (var i = 0; i < keys.length && byteLen(json) > 990; i++) {
            delete out[keys[i]];
            json = JSON.stringify(out);
        }
        return json;
    },

    /*==========================================================================
    == TAB 6 — XUẤT HÓA ĐƠN (PERSON_INVOICE_INFO)
    == Bug (2026-09-10): ở chế độ SỬA, các field hóa đơn chỉ được nhét vào
    == strExtra_Data (JSON) của Sua_HoSo_TS — BE không tách ra để ghi vào bảng
    == PERSON_INVOICE_INFO, nên sửa Địa chỉ/MST... bấm Cập nhật là mất; mở lại
    == cũng không thấy dữ liệu cũ vì không hàm nào đọc lên.
    == Cách xử lý: gọi thẳng PKG_CORE_NGUOIHOC_01 như trang Quản lý hồ sơ vẫn làm.
    ==========================================================================*/
    _ACTION_Inv_LayDS: 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
    _ACTION_Inv_Them: 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8ILzcuKCIkCC8nLgPP',
    _ACTION_Inv_Sua: 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLwgvNy4oIiQILycu',

    /*------------------------------------------
    -- Đọc thông tin hóa đơn đã lưu của 1 người → đổ lên tab 6.
    -- Lưu _currentInvoiceId để lúc Lưu biết gọi Them_ hay Sua_.
    -------------------------------------------*/
    _loadPersonInvoice: function (personId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._currentInvoiceId = '';
        // Ghi nhớ id này thuộc về AI. Không có nó thì mở hồ sơ A (có hóa đơn) rồi sang
        // hồ sơ B là _currentInvoiceId còn của A → save gọi Sua_ lên bản ghi của A.
        me._currentInvoicePersonId = personId || '';
        if (!edu.util.checkValue(personId)) return;
        edu.system.makeRequest({
            success: function (data) {
                if (!data || !data.Success || !edu.util.checkValue(data.Data) || !data.Data.length) return;
                var inv = data.Data[0];
                me._currentInvoiceId = inv.ID || '';
                var setVal = function (id, v) { if (v) edu.util.viewValById(id, v); };
                // ⚠ PERSON_INVOICE_INFO chỉ có MỘT cột tên (BUYER_NAME) trong khi form
                // có HAI ô. Trước đây luôn đổ vào "Tên đơn vị" → hồ sơ xuất cho cá nhân
                // thì tên nhảy sang ô đơn vị, ô "Họ tên người mua" trống trơn, kéo theo
                // banner nhắc kêu oan (khách báo 15/09/2026).
                // Nay đổ theo đúng đối tượng của chính bản ghi đó.
                if (me._loaiHD_TuGiaTri(inv.BUYER_TYPE_LOAI) === 'CN') {
                    setVal('txtKQ_HD_NguoiMua', inv.BUYER_NAME_TENNM);
                    // Đã có tên lưu sẵn → khoá tự-điền, khỏi bị họ tên ở tab Cá nhân
                    // ghi đè mất tên người mua cũ (cùng lý lẽ với ô Địa chỉ bên dưới).
                    if (edu.util.checkValue(inv.BUYER_NAME_TENNM)) {
                        $('#txtKQ_HD_NguoiMua').attr('data-user-touched', '1');
                    }
                } else {
                    setVal('txtKQ_HD_TenDonVi', inv.BUYER_NAME_TENNM);
                }
                setVal('txtKQ_HD_DiaChi', inv.BUYER_ADDR_DIACHI);
                // Đã có địa chỉ lưu sẵn → khoá tự-điền, không để chọn lại Nơi sinh
                // là ghi đè mất địa chỉ xuất hóa đơn cũ.
                if (edu.util.checkValue(inv.BUYER_ADDR_DIACHI)) {
                    $('#txtKQ_HD_DiaChi').attr('data-user-touched', '1');
                }
                setVal('txtKQ_HD_MST', inv.BUYER_TAX_MST);
                setVal('txtKQ_HD_MaQHNS', inv.BUYER_BUDGET_MAQHNS);
                setVal('txtKQ_HD_Email', inv.BUYER_EMAIL);
                setVal('txtKQ_HD_SDT', inv.BUYER_PHONE_SDT);
                // Đối tượng là dropdown, danh mục nạp async → dùng retry của _setSelectByIdOrText
                // DB lưu MÃ CHỮ (CA_NHAN/TO_CHUC) còn option value là ID → tra ngược ra ID
                // qua data thô của danh mục, kèm text để phòng trường hợp chưa có cache.
                if (inv.BUYER_TYPE_LOAI) {
                    var maHD = (inv.BUYER_TYPE_LOAI + '').trim();
                    var idHD = '', tenHD = maHD;
                    (me._dtDoiTuongHD || []).forEach(function (r) {
                        if (((r.MA || r.Ma || '') + '').trim() !== maHD) return;
                        idHD = ((r.ID || r.Id || r.id || '') + '').trim();
                        tenHD = ((r.TEN || r.Ten || '') + '').trim() || maHD;
                    });
                    me._setSelectByIdOrText('#ddlKQ_HD_DoiTuong', idHD || maHD, tenHD);
                }
                // Đã đổ xong dữ liệu cũ → soát lại để banner nhắc đúng hồ sơ này.
                // Chờ một nhịp cho _setSelectByIdOrText retry chọn xong dropdown.
                me._veCanhBaoHoaDon();
                setTimeout(function () { me._veCanhBaoHoaDon(); }, 800);
            },
            error: function (er) { kqdkNoLog('[HoaDon] LayDS_PersonInvoiceInfo err:', er); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Inv_LayDS,
            data: {
                'action': me._ACTION_Inv_LayDS,
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Lưu thông tin hóa đơn. Đã có bản ghi → Sua_, chưa có → Them_.
    -- Không nhập gì và cũng chưa có bản ghi → bỏ qua, không tạo dòng rỗng.
    -------------------------------------------*/
    /*------------------------------------------
    -- BUYER_TYPE_LOAI nhận gì thì HAI ghi chú trong cùng trang hồ sơ lại nói ngược nhau:
    --   zoneEditModal_inject.js:1215 — "kiểm tra thẳng DB: phải là ID DANH MỤC (GUID)"
    --   zoneEditModal_inject.js:1242 — "giá trị lưu xuống chính là chữ hiển thị CA_NHAN"
    -- Thực tế bảng đang có CẢ HAI KIỂU dữ liệu (ghi chú 11/09 có nhắc "một dòng rác
    -- mang CA_NHAN"), nên không suy luận được BE đời nào đang chạy trên máy khách nào.
    -- → Trả về DANH SÁCH ứng viên, save_PersonInvoice gửi lần lượt: ID trước (theo kết
    --   luận kiểm tra DB), BE chê đúng field này thì gửi lại bằng mã chữ.
    -- Chỉ tốn thêm 1 request trong trường hợp đoán trượt, và tự đúng ở mọi trường.
    -------------------------------------------*/
    _doiTuongHoaDon_UngVien: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var val = ((edu.system.getValById('ddlKQ_HD_DoiTuong') || '') + '').trim();
        if (!val) return [];
        var maChu = '';
        var rows = me._dtDoiTuongHD || [];
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i] || {};
            var rid = ((r.ID || r.Id || r.id || '') + '').trim();
            var rma = ((r.MA || r.Ma || '') + '').trim();
            if (rid === val || rma === val) {
                maChu = rma || ((r.TEN || r.Ten || '') + '').trim();
                break;
            }
        }
        // Danh mục không khai MA riêng → mã chữ chính là chữ đang hiển thị
        if (!maChu) {
            var txt = ($('#ddlKQ_HD_DoiTuong option:selected').text() || '').trim();
            if (txt && txt.indexOf('--') !== 0) maChu = txt;
        }
        var out = [];
        [val, maChu].forEach(function (v) {
            if (v && out.indexOf(v) < 0) out.push(v);
        });
        return out;
    },

    /*==========================================================================
    == NHẮC KHAI THIẾU / KHAI LỆCH Ở TAB XUẤT HÓA ĐƠN
    == Yêu cầu (14/09/2026): CHỈ NHẮC, KHÔNG CHẶN. Người dùng khai xong các tab
    == khác hay quên tab này, hoặc gõ tạm một ký tự cho qua — lưu thì vẫn lưu
    == được nên không ai biết là dữ liệu hỏng. Nhắc ở 2 chỗ:
    ==   1) Banner vàng ngay trong tab + dấu ⚠ trên nút tab → thấy ngay lúc khai
    ==   2) Nối vào thông báo sau khi Lưu/Cập nhật → bắt cả người không mở tab
    == KHÔNG được biến thành validate chặn lưu: nhiều hồ sơ vốn không cần hóa đơn.
    ==========================================================================*/

    /*------------------------------------------
    -- Đối tượng đang chọn là cá nhân hay tổ chức. Danh mục TS.DOITUONGHOADON mỗi
    -- trường khai một kiểu (có nơi MA rỗng, TEN chính là "CA_NHAN") nên dò trên cả
    -- mã lẫn chữ hiển thị, bỏ dấu để "Cá nhân" / "CA_NHAN" / "Tổ chức" đều nhận ra.
    -------------------------------------------*/
    _loaiDoiTuongHD: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        return me._loaiHD_TuGiaTri(me._doiTuongHoaDon_UngVien().join(' ') + ' '
            + ($('#ddlKQ_HD_DoiTuong option:selected').text() || ''));
    },

    /*------------------------------------------
    -- Cùng việc trên nhưng nhận giá trị thô (ID hoặc mã chữ) — dùng khi đọc bản ghi
    -- từ DB lên, lúc đó dropdown chưa kịp được chọn nên không soi dropdown được.
    -------------------------------------------*/
    _loaiHD_TuGiaTri: function (v) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!v) return '';
        var raw = String(v).trim();
        var text = raw;
        // Giá trị là ID danh mục → gom thêm MA/TEN của dòng đó để còn nhận ra
        (me._dtDoiTuongHD || []).forEach(function (r) {
            var id = ((r.ID || r.Id || r.id || '') + '').trim();
            var ma = ((r.MA || r.Ma || '') + '').trim();
            if (id === raw || ma === raw) {
                text += ' ' + ma + ' ' + ((r.TEN || r.Ten || '') + '');
            }
        });
        var s = text.normalize ? text.normalize('NFD').replace(/[̀-ͯ]/g, '') : text;
        s = s.toUpperCase().replace(/[^A-Z]/g, '');
        if (/CANHAN|CANHN/.test(s)) return 'CN';
        if (/TOCHUC|DONVI|DOANHNGHIEP|CONGTY/.test(s)) return 'TC';
        return '';
    },

    /*------------------------------------------
    -- Trả về mảng câu nhắc. Rỗng = không có gì phải nhắc.
    -------------------------------------------*/
    _kiemTraHoaDon: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var g = function (id) { return ((edu.system.getValById(id) || '') + '').trim(); };
        var doiTuong = g('ddlKQ_HD_DoiTuong');
        var nguoiMua = g('txtKQ_HD_NguoiMua');
        var tenDonVi = g('txtKQ_HD_TenDonVi');
        var mst = g('txtKQ_HD_MST');
        var diaChi = g('txtKQ_HD_DiaChi');
        var email = g('txtKQ_HD_Email');
        var sdt = g('txtKQ_HD_SDT');
        var maQHNS = g('txtKQ_HD_MaQHNS');
        var loai = me._loaiDoiTuongHD();
        var ds = [];

        var coGiDo = !!(doiTuong || nguoiMua || tenDonVi || mst || diaChi || email || sdt || maQHNS);
        if (!coGiDo) {
            return ['Chưa khai thông tin xuất hóa đơn — bỏ qua nếu hồ sơ này không cần xuất hóa đơn.'];
        }

        // Ô "gõ tạm cho qua": 1 ký tự, hoặc toàn dấu câu. Lưu được nhưng là dữ liệu rác.
        var goTam = function (v) {
            if (!v) return false;
            return v.length < 2 || !/[0-9A-Za-zÀ-ỹ]/.test(v);
        };
        if (goTam(nguoiMua)) ds.push('Ô "Họ tên người mua hàng" đang là "' + nguoiMua + '" — trông như gõ tạm cho qua, nên sửa lại thành tên thật.');
        if (goTam(tenDonVi)) ds.push('Ô "Tên đơn vị / Công ty" đang là "' + tenDonVi + '" — trông như gõ tạm cho qua, nên xóa đi hoặc điền tên đơn vị thật.');

        if (!doiTuong) {
            ds.push('Đã khai thông tin hóa đơn nhưng chưa chọn "Đối tượng xuất hóa đơn".');
        } else if (loai === 'CN') {
            // Hệ thống chỉ lưu được MỘT tên cho hóa đơn, nên có ô nào trong hai ô là đủ.
            // Trước đây kêu "chưa điền Họ tên người mua" kể cả khi tên đã nằm ở ô đơn vị
            // → nhắc oan, đúng chỗ khách phàn nàn 15/09/2026.
            if (!nguoiMua && !tenDonVi) {
                ds.push('Xuất hóa đơn cho cá nhân nhưng chưa điền "Họ tên người mua hàng".');
            } else if (nguoiMua && tenDonVi && !goTam(tenDonVi)
                && nguoiMua.trim().toLowerCase() !== tenDonVi.trim().toLowerCase()) {
                // Chỉ nhắc khi hai ô ghi HAI tên khác nhau — lúc đó mới thật sự mơ hồ
                ds.push('Hai ô "Họ tên người mua hàng" và "Tên đơn vị / Công ty" đang ghi hai tên khác nhau; '
                    + 'hóa đơn chỉ lưu được một tên và sẽ lấy theo "Họ tên người mua hàng".');
            }
        } else if (loai === 'TC') {
            if (!tenDonVi) ds.push('Xuất hóa đơn cho tổ chức nhưng chưa điền "Tên đơn vị / Công ty".');
            if (!mst && !maQHNS) ds.push('Xuất hóa đơn cho tổ chức nhưng chưa có "Mã số thuế" lẫn "Mã quan hệ ngân sách".');
        }

        if (mst && !/^\d{10}$|^\d{13}$/.test(mst.replace(/[\s-]/g, ''))) {
            ds.push('"Mã số thuế" phải là 10 hoặc 13 chữ số (đang có ' + mst.replace(/[\s-]/g, '').length + ' ký tự).');
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            ds.push('"Email nhận hóa đơn điện tử" chưa đúng định dạng.');
        }
        if (sdt && !/^0\d{8,10}$/.test(sdt.replace(/[\s.\-()]/g, ''))) {
            ds.push('"Số điện thoại nhận" chưa đúng định dạng (bắt đầu bằng 0, 9–11 chữ số).');
        }
        if (!diaChi) ds.push('Chưa có "Địa chỉ trên hóa đơn".');

        return ds;
    },

    /*------------------------------------------
    -- Vẽ banner trong tab + dấu ⚠ trên nút tab. Gọi lại thoải mái, tự dọn trạng thái cũ.
    -------------------------------------------*/
    _veCanhBaoHoaDon: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $box = $('#kqdk_hd_canhbao');
        if (!$box.length) return;
        var ds = me._kiemTraHoaDon();
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        if (!ds.length) {
            $box.addClass('d-none');
            $('#kqdk_hd_canhbao_ds').html('');
        } else {
            $('#kqdk_hd_canhbao_ds').html(ds.map(function (m) {
                return '<li>' + esc(m) + '</li>';
            }).join(''));
            $box.removeClass('d-none');
        }
        // Dấu nhắc trên nút tab — chế độ Gộp nhóm / Một trang dựng lại thanh tab nên
        // phải dò cả data-panels chứ không chỉ data-target.
        var $tab = $('#kqdkKhaiTabs .aps-sv-tab').filter(function () {
            var a = ($(this).attr('data-target') || '') + ',' + ($(this).attr('data-panels') || '');
            return a.indexOf('kqdk_tab_hoadon') >= 0;
        });
        $tab.find('.kqdk-hd-warn').remove();
        if (ds.length) {
            $tab.append('<i class="fa-solid fa-triangle-exclamation kqdk-hd-warn" title="Có mục cần kiểm tra lại" style="color:#f59e0b; margin-left:6px;"></i>');
        }
    },

    /*------------------------------------------
    -- Câu nhắc nối vào thông báo sau khi Lưu/Cập nhật — cùng kiểu _addrWarnText /
    -- _nguonWarnText. Dành cho người khai xong các tab khác mà không mở tab hóa đơn.
    -------------------------------------------*/
    _hoaDonWarnText: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var ds = me._kiemTraHoaDon();
        if (!ds.length) return '';
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        return '<br/><br/><span style="color:#b45309;"><b>Nhắc — tab "Xuất hóa đơn" còn mục nên xem lại:</b><br/>'
            + ds.map(function (m) { return '• ' + esc(m); }).join('<br/>')
            + '<br/><i>(hồ sơ đã lưu, vào tab Xuất hóa đơn sửa bổ sung rồi lưu lại là được)</i></span>';
    },

    _collectInvoice: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var g = function (id) { return ((edu.system.getValById(id) || '') + '').trim(); };
        var ungVien = me._doiTuongHoaDon_UngVien();
        return {
            tenDonVi: g('txtKQ_HD_TenDonVi'), nguoiMua: g('txtKQ_HD_NguoiMua'),
            diaChi: g('txtKQ_HD_DiaChi'), mst: g('txtKQ_HD_MST'),
            maQHNS: g('txtKQ_HD_MaQHNS'), email: g('txtKQ_HD_Email'),
            sdt: g('txtKQ_HD_SDT'),
            doiTuong: ungVien[0] || '',
            doiTuongUngVien: ungVien
        };
    },

    /*------------------------------------------
    -- snap: ảnh chụp form. Luồng Thêm mới bắt buộc truyền vào, vì lúc callback về
    -- thì resetKhai_HoSo() đã xoá trắng form (xem saveKhai_HoSo).
    -------------------------------------------*/
    /*------------------------------------------
    -- ⚠ PHẢI hỏi DB xem người này đã có bản ghi hóa đơn chưa rồi mới ghi.
    -- Bug khách báo 14-15/09/2026: "thêm mới xong địa chỉ không lên, vào Cập nhật
    -- lại mới lên", lặp nhiều lần.
    -- Nguyên nhân: Them_HoSo_TS ĐÃ gửi kèm 8 param strPersonInvoice_* nên BE tự tạo
    -- sẵn 1 bản ghi PERSON_INVOICE_INFO. Trong khi đó _saveKhai_PhuThuoc lại ép
    -- _currentInvoiceId = '' với giả định "hồ sơ mới thì chưa có bản ghi nào" →
    -- hàm này đi đường Them_ và tạo BẢN GHI THỨ HAI cho cùng một người. Đọc lên
    -- bằng LayDS_PersonInvoiceInfo (dChiHienHanh = 1) chỉ ra một bản → hiện đúng
    -- bản thiếu địa chỉ. Vào Sửa thì _loadPersonInvoice nạp được Id nên gọi Sua_
    -- trên đúng bản đang hiện hành → địa chỉ mới lên. Khớp y hệt hiện tượng.
    -- Nay: luôn tra trước, có sẵn thì Sua_, chưa có mới Them_ (upsert thật).
    -------------------------------------------*/
    save_PersonInvoice: function (personId, snap) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var s = snap || me._collectInvoice();
        if (!edu.util.checkValue(personId)) {
            kqdkNoLog('[HoaDon] thiếu Person_Id → không lưu được thông tin hóa đơn');
            return;
        }
        // Đã biết chắc Id của ĐÚNG người này (luồng Sửa) thì ghi thẳng.
        // Chưa biết → hỏi DB một nhịp rồi mới ghi.
        if (me._currentInvoicePersonId === personId && me._currentInvoiceId) {
            me._ghi_PersonInvoice(personId, s, me._currentInvoiceId);
            return;
        }
        me._timInvoiceId(personId, function (id) {
            if (id) {
                me._currentInvoicePersonId = personId;
                me._currentInvoiceId = id;
            }
            me._ghi_PersonInvoice(personId, s, id);
        });
    },

    /*------------------------------------------
    -- Tra Id bản ghi hóa đơn hiện hành của 1 người. Không có → trả ''.
    -------------------------------------------*/
    _timInvoiceId: function (personId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (id) { if (typeof cb === 'function') cb(id || ''); };
        if (!edu.util.checkValue(me._ACTION_Inv_LayDS)) { xong(''); return; }
        edu.system.makeRequest({
            success: function (data) {
                var arr = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                if (arr.length && arr.length === undefined) arr = [arr];
                var r = arr[0];
                xong(r ? (me._pickLoose(r, ['ID', 'PERSON_INVOICE_INFO_ID', 'INVOICE_ID']) || '') : '');
            },
            error: function () { xong(''); },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Inv_LayDS,
            data: {
                'action': me._ACTION_Inv_LayDS,
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    _ghi_PersonInvoice: function (personId, s, invoiceId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var tenDonVi = s.tenDonVi, nguoiMua = s.nguoiMua, diaChi = s.diaChi;
        var mst = s.mst, maQHNS = s.maQHNS, email = s.email, sdt = s.sdt;
        var doiTuong = s.doiTuong;
        if (!(tenDonVi || nguoiMua || diaChi || mst || maQHNS || email || sdt || doiTuong) && !invoiceId) return;
        var isUpdate = !!(invoiceId && invoiceId.length === 32);
        var obj_save = {
            'action': isUpdate ? me._ACTION_Inv_Sua : me._ACTION_Inv_Them,
            'func': isUpdate ? 'PKG_CORE_NGUOIHOC_01.Sua_PersonInvoiceInfo'
                : 'PKG_CORE_NGUOIHOC_01.Them_PersonInvoiceInfo',
            'iM': edu.system.iM,
            'strBuyer_Type_Loai': doiTuong,
            'strBuyer_Ref_Type': '',
            'strBuyer_Ref_Id': '',
            // Chỉ có MỘT cột tên cho cả 2 ô của form → chọn theo đối tượng cho khớp
            // với chiều đọc lên ở _loadPersonInvoice: cá nhân lấy họ tên người mua,
            // tổ chức lấy tên đơn vị; thiếu cái nào thì lấy cái còn lại.
            'strBuyer_Name': (me._loaiHD_TuGiaTri(doiTuong) === 'CN')
                ? (nguoiMua || tenDonVi)
                : (tenDonVi || nguoiMua),
            'strBuyer_Addr': diaChi,
            'strBuyer_Tax_Mst': mst,
            'strBuyer_Budget_Qhns': maQHNS,
            'strBuyer_Email': email,
            'strBuyer_Phone': sdt,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        if (isUpdate) obj_save.strId = invoiceId;
        else obj_save.strPerson_Id = personId;

        // Gửi lần lượt các kiểu giá trị của Đối tượng xuất hóa đơn cho tới khi BE nhận.
        // Chỉ thử tiếp khi lỗi ĐÚNG là về BUYER_TYPE_LOAI — lỗi khác (thiếu BUYER_NAME,
        // sai quyền...) thì báo ngay, không gửi mò thêm request.
        var ungVien = (s.doiTuongUngVien && s.doiTuongUngVien.length)
            ? s.doiTuongUngVien.slice()
            : [doiTuong];
        if (!ungVien.length) ungVien = [''];
        var lan = 0;
        var gui = function () {
            obj_save.strBuyer_Type_Loai = ungVien[lan];
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) {
                        if (!isUpdate && data.Id) me._currentInvoiceId = data.Id;
                        return;
                    }
                    var msg = (data && data.Message) || '';
                    if (/BUYER_TYPE_LOAI/i.test(msg) && lan + 1 < ungVien.length) {
                        kqdkNoLog('[HoaDon] BE chê "' + ungVien[lan] + '" → thử "' + ungVien[lan + 1] + '"');
                        lan++;
                        gui();
                        return;
                    }
                    edu.system.alert('Lưu thông tin hóa đơn lỗi: ' + msg, 'w');
                },
                error: function (er) {
                    edu.system.alert('Lưu thông tin hóa đơn lỗi (er): ' + JSON.stringify(er), 'w');
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        };
        gui();
    },

    /*==========================================================================
    == TAB 7 — THÔNG TIN NGUỒN KHAI THÁC (đối tác tuyển sinh)
    == Tách hoàn toàn khỏi luồng Them_HoSo_TS / Sua_HoSo_TS đang chạy:
    ==   - Danh mục   : PKG_CORE_TS_HOSO.LayDS_TS_DoiTacTuyenSinh
    ==   - Đọc đã lưu : PKG_CORE_TS_HOSO.LayDS_TS_HoSo_DoiTacTS  (bind selected)
    ==   - Ghi        : PKG_CORE_TS_HOSO.Them_TS_HoSo_DoiTacTS   (gọi SAU CÙNG,
    ==                  vì cần Core_Person_Id do Them_HoSo_TS trả ra)
    ==========================================================================*/

    /*------------------------------------------
    -- Nạp danh mục nguồn khai thác vào #ddlKQ_NguonKhaiThac (1 lần, có cache).
    -------------------------------------------*/
    _loadNguonKhaiThac: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $('#ddlKQ_NguonKhaiThac');
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        // Lấy giá trị đầu tiên không rỗng theo danh sách alias
        var pick = function (d, keys) {
            for (var i = 0; i < keys.length; i++) {
                var v = d[keys[i]];
                if (v != null && String(v).trim() !== '') return String(v).trim();
            }
            return '';
        };
        // Cột TEN của danh mục chỉ chứa TÊN RIÊNG ("Anh", "Hùng"...) nên nhiều dòng trông
        // giống hệt nhau → phải dựng họ tên đầy đủ: ưu tiên cột họ tên có sẵn, không có
        // thì ghép Họ + Đệm + Tên.
        var buildHoTen = function (d) {
            var full = pick(d, ['HOTEN', 'HO_TEN', 'HOVATEN', 'HO_VA_TEN', 'TENDAYDU', 'TEN_DAYDU',
                'FULL_NAME', 'FULLNAME', 'HoTen', 'FullName']);
            if (full) return full;
            var parts = [
                pick(d, ['HO', 'LAST_NAME', 'Ho']),
                pick(d, ['HODEM', 'HO_DEM', 'TENDEM', 'TEN_DEM', 'DEM', 'MIDDLE_NAME', 'HoDem']),
                pick(d, ['TEN', 'FIRST_NAME', 'Ten'])
            ];
            return parts.filter(function (x) { return x; }).join(' ').replace(/\s+/g, ' ').trim();
        };
        var render = function (rows) {
            $sel.html('<option value="">-- Chọn nguồn khai thác --</option>');
            (rows || []).forEach(function (d) {
                var id = d.ID || d.Id || d.id || '';
                if (!id) return;
                var ten = buildHoTen(d) || pick(d, ['TEN_HIENTHI', 'TEN_DONVI', 'TENDONVI']);
                var ma = pick(d, ['MA', 'Ma', 'MA_HIENTHI']);
                var display = ten || ma || id;
                if (ten && ma && ma !== ten) display = ten + ' (' + ma + ')';
                $sel.append('<option value="' + esc(id) + '">' + esc(display) + '</option>');
            });
            me._reapplyKQSelect2('ddlKQ_NguonKhaiThac');
            if (typeof cb === 'function') cb();
        };
        if (me._dtNguonKhaiThac && me._dtNguonKhaiThac.length) { render(me._dtNguonKhaiThac); return; }
        var obj_list = {
            'action': 'SV_Core_TS_HoSo_MH/DSA4BRIeFRIeBS4oFSAiFTQ4JC8SKC8p',
            'func': 'PKG_CORE_TS_HOSO.LayDS_TS_DoiTacTuyenSinh',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                me._dtNguonKhaiThac = rows;
                render(rows);
            },
            error: function (er) {
                kqdkNoLog('[NguonKhaiThac] LayDS_TS_DoiTacTuyenSinh err:', er);
                render([]);
            },
            type: 'POST',
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đọc nguồn khai thác đã ghi nhận của hồ sơ → bind selected vào dropdown.
    -- Gọi khi mở form ở chế độ Sửa. Lọc theo KH + Đợt + NV đầu ra + Core_Person_Id.
    -------------------------------------------*/
    _ACTION_LayDS_HoSo_DoiTacTS: 'SV_Core_TS_HoSo_MH/DSA4BRIeFRIeCS4SLh4FLigVICIVEgPP',

    _ACTION_Xoa_HoSo_DoiTacTS: 'SV_Core_TS_HoSo_MH/GS4gHhUSHgkuEi4eBS4oFSAiFRIP',

    /* PKG_CORE_TS_HOSO.Sua_TS_HoSo_DoiTacTS — BE xác nhận CÓ (23/09/2026).
       Chữ ký KHÁC hàm Thêm: không nhận bộ (kế hoạch + đợt + nguyện vọng) mà nhận
       strId + strTS_HoSo_Nguon_Id. Nhờ vậy sửa không dính "Khong ton tai ho so tuyen sinh".
       Có hàm này thì đổi nguồn KHÔNG phải thêm-rồi-xóa nữa → hết cảnh đẻ dòng rác. */
    _ACTION_Sua_HoSo_DoiTacTS: 'SV_Core_TS_HoSo_MH/EjQgHhUSHgkuEi4eBS4oFSAiFRIP',

    _currentDoiTacNguonId: '',   // TS_HOSO_NGUON_ID của dòng đang có (nếu view trả về)

    // dd/MM/yyyy — proc TO_DATE tham số ngày, gửi rỗng dễ fail ngầm
    _ngayHomNay: function () {
        var d = new Date();
        var p = function (n) { return n < 10 ? '0' + n : '' + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
    },

    // Bản ghi ghi-nhận đang có của hồ sơ đang mở — dùng để gỡ / thay thế
    _currentDoiTacRowId: '',
    _currentDoiTacRowIds: [],   // TẤT CẢ dòng đang có (kể cả rác của các lần đổi trước)
    _currentDoiTacPartnerId: '',
    _currentDoiTacGhiChu: '',

    /*------------------------------------------
    -- Gỡ bản ghi ghi-nhận nguồn khai thác. Chưa có API thì báo rõ thay vì im lặng
    -- để người dùng khỏi tưởng đã bỏ được.
    -------------------------------------------*/
    _xoaDoiTacTS: function (rowId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(rowId)) return;
        if (!edu.util.checkValue(me._ACTION_Xoa_HoSo_DoiTacTS)) return;   // đã cảnh báo ở _nguonWarnText
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) me._currentDoiTacRowId = '';
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: me._ACTION_Xoa_HoSo_DoiTacTS,
            // Chữ ký chỉ có strId + strNguoiThucHien_Id — không gửi thừa param
            data: {
                'action': me._ACTION_Xoa_HoSo_DoiTacTS,
                'func': 'PKG_CORE_TS_HOSO.Xoa_TS_HoSo_DoiTacTS',
                'iM': edu.system.iM,
                'strId': rowId,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Cảnh báo đồng bộ khi user bỏ chọn nguồn khai thác mà chưa có API xóa.
    -- Gộp vào alert thành công thay vì alert riêng (BS3 chồng alert làm đóng modal).
    -------------------------------------------*/
    _nguonWarnText: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var dangChon = edu.system.getValById('ddlKQ_NguonKhaiThac') || '';
        if (edu.util.checkValue(dangChon)) return '';
        if (!edu.util.checkValue(me._currentDoiTacRowId)) return '';
        if (edu.util.checkValue(me._ACTION_Xoa_HoSo_DoiTacTS)) return '';
        return '<br/><span class="text-danger">Chưa bỏ được Nguồn khai thác cũ: '
            + 'PKG_CORE_TS_HOSO chưa có hàm xóa TS_HoSo_DoiTacTS.</span>';
    },

    /*------------------------------------------
    -- Id CỦA CHÍNH DÒNG ghi-nhận (TS_HOSO_DOITACTS) — không phải Id đối tác.
    -- Dò rộng vì chưa dump được tên cột thật: tên đoán trượt là không xoá được dòng cũ,
    -- mà không xoá được thì dòng rác dồn lại và form hiện sai nguồn.
    -------------------------------------------*/
    _dtcRowId: function (r) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!r) return '';
        var id = me._pickLoose(r, ['ID', 'TS_HOSO_DOITACTS_ID', 'HOSO_DOITACTS_ID',
            'HOSO_DOITAC_ID', 'TS_HOSO_DOITAC_ID']);
        if (id) return id;
        for (var k in r) {
            if (!r.hasOwnProperty(k)) continue;
            var K = String(k).toUpperCase();
            // Trừ Id của đối tác và của người/hồ sơ — đó là khóa ngoài, xoá nhầm là chết
            if (K.indexOf('DOITACTUYENSINH') >= 0 || K.indexOf('PERSON') >= 0) continue;
            if (/_ID$/.test(K) && K.indexOf('HOSO') >= 0 && K.indexOf('DOITAC') >= 0 && r[k]) return r[k];
        }
        return '';
    },

    /*------------------------------------------
    -- Chọn dòng ghi-nhận ĐANG HIỆU LỰC trong danh sách trả về:
    -- ưu tiên IS_CURRENT=1, rồi tới ngày ghi nhận/ngày tạo mới nhất, cuối cùng lấy dòng cuối.
    -------------------------------------------*/
    _dtcDongMoiNhat: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!rows || !rows.length) return null;
        if (rows.length === 1) return rows[0];

        // Đổi mọi kiểu ngày về số để so: "20260923094512" hoặc "23/09/2026" → 20260923...
        var moc = function (r) {
            var s = String(me._pickLoose(r, ['NGAYTAO', 'NGAY_TAO']) || '');
            if (/^\d{8,14}$/.test(s)) return parseInt(s.substring(0, 14), 10);
            var g = String(me._pickLoose(r, ['NGAY_GHI_NHAN', 'NGAYGHINHAN']) || '')
                .match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            if (g) return parseInt(g[3] + g[2] + g[1] + '000000', 10);
            return 0;
        };

        var uuTien = rows.filter(function (r) {
            return String(me._pickLoose(r, ['IS_CURRENT', 'ISCURRENT']) || '') === '1';
        });
        var ds = uuTien.length ? uuTien : rows;

        var best = ds[ds.length - 1], bestMoc = moc(best);
        for (var i = 0; i < ds.length; i++) {
            var m = moc(ds[i]);
            if (m >= bestMoc) { best = ds[i]; bestMoc = m; }
        }
        return best;
    },

    /*------------------------------------------
    -- Payload lọc dùng chung cho LayDS_TS_HoSo_DoiTacTS (đọc + dọn rác).
    -- Một chỗ duy nhất để đọc và ghi không lệch bộ khóa.
    -------------------------------------------*/
    /*------------------------------------------
    -- Tra cứu nguồn khai thác đã lưu với cơ chế thử luỹ tiến (progressive fallback).
    -- Đảm bảo dù backend lưu theo bộ (KH + Đợt + Người) hay chỉ theo Người thì vẫn tìm thấy.
    -------------------------------------------*/
    _queryHoSoDoiTacTS: function (corePersonId, dotId, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (rows) { if (typeof cb === 'function') cb(rows || []); };
        if (!edu.util.checkValue(corePersonId)) { xong([]); return; }

        var dot = dotId !== undefined && dotId !== '' ? dotId : (me.strDot_Id_ForKQ || me._hsDotHienTai() || '');
        var khId = me.strKeHoachTuyenSinh_Id || '';

        var makePayload = function (useKh, useDot, isActive, isPrimary, isCurrent) {
            return {
                'action': me._ACTION_LayDS_HoSo_DoiTacTS,
                'func': 'PKG_CORE_TS_HOSO.LayDS_TS_HoSo_DoiTacTS',
                'iM': edu.system.iM,
                'strHoSo_KH_TS_Id': useKh ? khId : '',
                'strHoSo_KH_TS_Dot_Id': useDot ? dot : '',
                'strNguyenVong_DauRa_Id': '',
                'strCore_Person_Id': corePersonId,
                'strTS_DoiTacTuyenSinh_Id': '',
                'dIs_Primary': isPrimary !== undefined && isPrimary !== null ? isPrimary : '',
                'dIs_Current': isCurrent !== undefined && isCurrent !== null ? isCurrent : '',
                'dIs_Active': isActive !== undefined && isActive !== null ? isActive : '',
                'strTuKhoa': '',
                'strNguoiThucHien_Id': edu.system.userId
            };
        };

        var doReq = function (payload, next) {
            edu.system.makeRequest({
                success: function (data) {
                    var arr = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                    if (arr.length) { xong(arr); return; }
                    next();
                },
                error: function () { next(); },
                type: 'POST',
                contentType: true,
                action: payload.action,
                data: payload,
                fakedb: []
            }, false, false, false, null);
        };

        // Bước 1: Tra theo KH + Đợt + Người (không lọc dIs_Active/Primary/Current vì Them_TS_HoSo_DoiTacTS lưu IS_ACTIVE = NULL)
        doReq(makePayload(!!khId, !!dot, '', '', ''), function () {
            // Bước 2: Tra theo KH + Người (bỏ đợt)
            doReq(makePayload(!!khId, false, '', '', ''), function () {
                // Bước 3: Tra chỉ theo Core_Person_Id
                doReq(makePayload(false, false, '', '', ''), function () {
                    // Bước 4: Dự phòng thử dIs_Active = 1
                    doReq(makePayload(false, false, 1, '', ''), function () {
                        xong([]);
                    });
                });
            });
        });
    },

    _dtcFilter: function (corePersonId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        return {
            'action': me._ACTION_LayDS_HoSo_DoiTacTS,
            'func': 'PKG_CORE_TS_HOSO.LayDS_TS_HoSo_DoiTacTS',
            'iM': edu.system.iM,
            'strHoSo_KH_TS_Id': me.strKeHoachTuyenSinh_Id || '',
            'strHoSo_KH_TS_Dot_Id': '',
            'strNguyenVong_DauRa_Id': '',
            'strCore_Person_Id': corePersonId || '',
            'strTS_DoiTacTuyenSinh_Id': '',
            'dIs_Primary': '',
            'dIs_Current': '',
            'dIs_Active': '',
            'strTuKhoa': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
    },

    _hsDotHienTai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        return me.strDot_Id_ForKQ
            || edu.system.getValById('ddlKQ_DotTuyenSinh')
            || (me.strDot_Id_HienTai || '');
    },

    _nvDauRaHienTai: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        return edu.system.getValById('ddlKQ_NguyenVongDauRa')
            || (me.strNguyenVongDauRa_Id || '');
    },

    /*------------------------------------------
    -- Lọc theo nguyện vọng đầu ra ngay tại FE (thay cho nhánh lọc đang hỏng dưới proc).
    -- Dòng nào không có cột nguyện vọng thì GIỮ LẠI — không có cột để so mà loại đi
    -- là mất sạch dữ liệu, tệ hơn nhiều so với hiện dư một dòng.
    -------------------------------------------*/
    _dtcLocTheoNV: function (rows) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var nv = (typeof me._nvDauRaHienTai === 'function') ? me._nvDauRaHienTai() : '';
        if (!nv || !rows || !rows.length) return rows || [];
        var khop = rows.filter(function (r) {
            var v = me._pickLoose(r, ['NGUYENVONG_DAURA_ID', 'TS_KEHOACH_DAU_RA_ID', 'DAURA_ID']);
            return !v || String(v) === String(nv);
        });
        return khop.length ? khop : rows;
    },

    /*------------------------------------------
    -- Sau khi ghi xong: đọc lại, GIỮ bản mới nhất, xoá phần dư.
    -------------------------------------------*/
    _dtcDonRac: function (corePersonId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(corePersonId)) return;
        me._queryHoSoDoiTacTS(corePersonId, '', function (data) {
            var rows = me._dtcLocTheoNV(data || []);
            console.log('[NguonKhaiThac] sau khi lưu còn ' + rows.length + ' dòng'
                + (rows.length ? ' — cột: ' + Object.keys(rows[0]).join(', ') : ''));
            if (rows.length <= 1) {
                if (rows.length === 1) {
                    me._currentDoiTacRowId = me._dtcRowId(rows[0]);
                    me._currentDoiTacRowIds = me._currentDoiTacRowId ? [me._currentDoiTacRowId] : [];
                }
                return;
            }
            var giu = me._dtcDongMoiNhat(rows);
            var idGiu = me._dtcRowId(giu);
            me._currentDoiTacRowId = idGiu;
            me._currentDoiTacRowIds = idGiu ? [idGiu] : [];
            rows.forEach(function (r) {
                var rid = me._dtcRowId(r);
                if (!rid || rid === idGiu) return;
                console.log('[NguonKhaiThac] xoá dòng dư', rid);
                me._xoaDoiTacTS(rid);
            });
        });
    },

    _loadHoSoDoiTacTS: function (corePersonId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me._currentDoiTacPersonId = corePersonId || '';
        if (!edu.util.checkValue(corePersonId)) return;
        if (!edu.util.checkValue(me._ACTION_LayDS_HoSo_DoiTacTS)) return;

        var setDropdown = function (id, ten) {
            if (!id && !ten) return;
            me._setSelectByIdOrText('#ddlKQ_NguonKhaiThac', id, ten);
        };

        me._queryHoSoDoiTacTS(corePersonId, '', function (data) {
            var soDong = (data && data.length) ? data.length : 0;
            console.log('[NguonKhaiThac] đọc lên: ' + soDong + ' dòng | người=' + corePersonId);
            if (!data || !data.length) {
                var tenNgoai = (me._nguonMap || {})[corePersonId] || '';
                if (tenNgoai) setDropdown('', tenNgoai);
                return;
            }
            var rows = me._dtcLocTheoNV(data);
            if (!rows.length) {
                var tenNgoai2 = (me._nguonMap || {})[corePersonId] || '';
                if (tenNgoai2) setDropdown('', tenNgoai2);
                return;
            }
            var r = me._dtcDongMoiNhat(rows);
            if (!r) return;
            console.log('[NguonKhaiThac] dòng chọn:', r);
            me._currentDoiTacRowIds = rows.map(function (x) { return me._dtcRowId(x); })
                .filter(function (x) { return !!x; });
            var id = me._pickLoose(r, ['TS_DOITACTUYENSINH_ID', 'Ts_DoiTacTuyenSinh_Id', 'TS_DOITAC_TUYENSINH_ID',
                'DOITAC_ID', 'DOI_TAC_ID', 'DOITACTUYENSINH_ID', 'TS_DOITAC_ID', 'ID_DOITAC']) || '';
            var ten = me._pickLoose(r, ['TS_DOITACTUYENSINH_TEN', 'DOITAC_TEN', 'HOTEN', 'TEN', 'FULL_NAME'])
                || me._tenDoiTacTS(id)
                || (me._nguonMap || {})[corePersonId]
                || '';
            me._currentDoiTacRowId = me._dtcRowId(r);
            if (rows.length > 1 || !me._currentDoiTacRowId) {
                kqdkNoLog('[NguonKhaiThac] ' + rows.length + ' dòng, rowId="'
                    + me._currentDoiTacRowId + '" — cột:', Object.keys(rows[0] || {}));
            }
            var ghiChu = r.GHICHU || r.GhiChu || '';
            me._currentDoiTacPartnerId = id;
            me._currentDoiTacGhiChu = ghiChu;
            me._currentDoiTacNguonId = me._pickLoose(r, ['TS_HOSO_NGUON_ID', 'HOSO_NGUON_ID']) || '';
            if (ghiChu) edu.util.viewValById('txtKQ_NguonKhaiThac_GhiChu', ghiChu);
            setDropdown(id, ten);
        });
    },

    /*------------------------------------------
    -- Ghi nhận nguồn khai thác. GỌI SAU CÙNG trong luồng lưu hồ sơ.
    -- corePersonId: khi Thêm mới lấy từ out param của Them_HoSo_TS;
    --               khi Sửa lấy Core_Person_Id của hồ sơ đang mở.
    -- Không chọn nguồn → bỏ qua, không gọi API.
    -------------------------------------------*/
    save_HoSoDoiTacTS: function (corePersonId, snap) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var strDoiTac_Id = snap ? (snap.doiTacId || '')
            : (edu.system.getValById('ddlKQ_NguonKhaiThac') || '');
        // Bản ghi đang nhớ chỉ dùng được khi nó thuộc đúng người đang lưu
        var cuaNguoiNay = (me._currentDoiTacPersonId === corePersonId);
        if (!edu.util.checkValue(strDoiTac_Id)) {
            // Bỏ chọn nguồn khai thác → phải GỠ bản ghi cũ. Trước đây hàm return thẳng
            // ở đây nên bấm Cập nhật xong nguồn cũ vẫn còn nguyên.
            if (cuaNguoiNay) {
                var ds = (me._currentDoiTacRowIds || []).slice();
                if (edu.util.checkValue(me._currentDoiTacRowId) && ds.indexOf(me._currentDoiTacRowId) < 0) {
                    ds.push(me._currentDoiTacRowId);
                }
                ds.forEach(function (rid) { me._xoaDoiTacTS(rid); });
                me._currentDoiTacRowIds = [];
                me._currentDoiTacRowId = '';
                me._currentDoiTacPartnerId = '';
                me._currentDoiTacGhiChu = '';
                if (corePersonId) me._nguonMap[corePersonId] = '';
            }
            return;
        }
        if (!edu.util.checkValue(corePersonId)) {
            kqdkNoLog('[NguonKhaiThac] thiếu Core_Person_Id → không ghi nhận được nguồn khai thác');
            return;
        }
        var rowCu = cuaNguoiNay ? (me._currentDoiTacRowId || '') : '';
        var ghiChuMoi = snap ? (snap.ghiChu || '')
            : (edu.system.getValById('txtKQ_NguonKhaiThac_GhiChu') || '');
        // Không đổi gì thì thôi, khỏi bắn request thừa mỗi lần bấm Cập nhật
        if (rowCu && strDoiTac_Id === me._currentDoiTacPartnerId
            && ghiChuMoi === (me._currentDoiTacGhiChu || '')) return;

        /* ĐÃ CÓ bản ghi → dùng Sua_TS_HoSo_DoiTacTS (BE xác nhận có, 23/09/2026).
           Ưu điểm so với cách thêm-rồi-xoá cũ:
             - không đẻ dòng rác, khỏi phải dọn
             - chữ ký KHÔNG cần bộ (kế hoạch + đợt + nguyện vọng) nên không dính
               "Khong ton tai ho so tuyen sinh" khi mấy khóa đó chưa xác định được. */
        if (rowCu) {
            var obj_sua = {
                'action': me._ACTION_Sua_HoSo_DoiTacTS,
                'func': 'PKG_CORE_TS_HOSO.Sua_TS_HoSo_DoiTacTS',
                'iM': edu.system.iM,
                'strId': rowCu,
                'strTS_HoSo_Nguon_Id': me._currentDoiTacNguonId || '',
                'strCore_Person_Id': corePersonId,
                'strTS_DoiTacTuyenSinh_Id': strDoiTac_Id,
                'strNgay_Ghi_Nhan': me._ngayHomNay(),
                'dIs_Primary': 1,
                'dIs_Current': 1,
                'dIs_Active': 1,
                'strNguon_Ghi_Nhan_Code': '',
                'strNguoi_Ghi_Nhan_Id': edu.system.userId,
                'strGhiChu': ghiChuMoi,
                'strNguoiThucHien_Id': edu.system.userId
            };
            console.log('[NguonKhaiThac] SỬA dòng ' + rowCu + ' → đối tác=' + strDoiTac_Id);
            edu.system.makeRequest({
                success: function (data) {
                    console.log('[NguonKhaiThac] SỬA kết quả: Success=' + (data && data.Success)
                        + ' | ' + ((data && data.Message) || ''));
                    if (!data || !data.Success) {
                        edu.system.alert('Cập nhật nguồn khai thác lỗi: ' + ((data && data.Message) || ''), 'w');
                        return;
                    }
                    me._currentDoiTacPartnerId = strDoiTac_Id;
                    me._currentDoiTacGhiChu = ghiChuMoi;
                    if (corePersonId) me._nguonMap[corePersonId] = me._tenDoiTacTS(strDoiTac_Id);
                },
                error: function (er) {
                    edu.system.alert('Cập nhật nguồn khai thác lỗi (er): ' + JSON.stringify(er), 'w');
                },
                type: 'POST', contentType: true, action: obj_sua.action, data: obj_sua, fakedb: []
            }, false, false, false, null);
            return;
        }

        var dotId = (snap && snap.dot) ? snap.dot : (me.strDot_Id_ForKQ || me._hsDotHienTai());
        var nvId = (snap && snap.nguyenVong) ? snap.nguyenVong : me._nvDauRaHienTai();
        var khId = (snap && snap.keHoachId) ? snap.keHoachId : (me.strKeHoachTuyenSinh_Id || '');

        var obj_save = {
            'action': 'SV_Core_TS_HoSo_MH/FSkkLB4VEh4JLhIuHgUuKBUgIhUS',
            'func': 'PKG_CORE_TS_HOSO.Them_TS_HoSo_DoiTacTS',
            'iM': edu.system.iM,
            'strHoSo_KH_TS_Id': khId,
            'strHoSo_KH_TS_Dot_Id': dotId,
            'strNguyenVong_DauRa_Id': nvId,
            'strCore_Person_Id': corePersonId,
            'strTS_DoiTacTuyenSinh_Id': strDoiTac_Id,
            'strNgay_Ghi_Nhan': me._ngayHomNay(),
            'dIs_Primary': 1,
            'dIs_Current': 1,
            'strNguon_Ghi_Nhan_Code': '',
            'strNguoi_Ghi_Nhan_Id': edu.system.userId,
            'strGhiChu': ghiChuMoi,
            'strNguoiThucHien_Id': edu.system.userId
        };
        console.log('[NguonKhaiThac] GHI → đối tác=' + obj_save.strTS_DoiTacTuyenSinh_Id
            + ' | KH=' + obj_save.strHoSo_KH_TS_Id + ' | đợt=' + obj_save.strHoSo_KH_TS_Dot_Id
            + ' | nguyện vọng=' + obj_save.strNguyenVong_DauRa_Id
            + ' | người=' + obj_save.strCore_Person_Id + ' | dòng cũ=' + (rowCu || '(không có)'));
        edu.system.makeRequest({
            success: function (data) {
                console.log('[NguonKhaiThac] GHI kết quả: Success=' + (data && data.Success)
                    + ' | Id=' + ((data && data.Id) || '(không trả)') + ' | ' + ((data && data.Message) || ''));
                if (!data || !data.Success) {
                    // Kèm context đang gửi: lỗi loại này gần như luôn do một mảnh bị rỗng,
                    // nhìn phát biết ngay thay vì phải mở F12 dò lại.
                    var thieu = [];
                    if (!edu.util.checkValue(obj_save.strHoSo_KH_TS_Id)) thieu.push('Kế hoạch');
                    if (!edu.util.checkValue(obj_save.strHoSo_KH_TS_Dot_Id)) thieu.push('Đợt tuyển sinh');
                    if (!edu.util.checkValue(obj_save.strNguyenVong_DauRa_Id)) thieu.push('Nguyện vọng đầu ra');
                    if (!edu.util.checkValue(obj_save.strCore_Person_Id)) thieu.push('Mã người học');
                    edu.system.alert('Ghi nhận nguồn khai thác lỗi: ' + ((data && data.Message) || '')
                        + (thieu.length
                            ? ('<br/><span style="color:#b45309;">Đang thiếu: <b>' + thieu.join(', ')
                                + '</b> — vào tab <b>Trúng tuyển</b> chọn đủ rồi lưu lại.</span>')
                            : ''), 'w');
                    return;
                }
                me._currentDoiTacPartnerId = strDoiTac_Id;
                me._currentDoiTacGhiChu = ghiChuMoi;
                if (data && data.Id) me._currentDoiTacRowId = data.Id;
                if (corePersonId) me._nguonMap[corePersonId] = me._tenDoiTacTS(strDoiTac_Id);
                /* ⚠ TUYỆT ĐỐI KHÔNG xoá theo Id nhớ từ trước.
                   `Them_TS_HoSo_DoiTacTS` có thể là UPSERT theo bộ (kế hoạch + đợt + nguyện
                   vọng + người) — y như `Them_TS_HoSo` bên tab 8 đã xác minh. Khi đó bản
                   "mới" chính là bản cũ, xoá rowCu là xoá luôn thứ vừa ghi → lưu báo thành
                   công mà mở lại trống trơn (khách báo 23/09/2026, do chính đoạn dọn rác
                   mình thêm sáng nay).
                   Cách an toàn: đọc lại danh sách, GIỮ bản mới nhất, chỉ xoá phần dư. */
                me._dtcDonRac(corePersonId);
            },
            error: function (er) {
                edu.system.alert('Ghi nhận nguồn khai thác lỗi (er): ' + JSON.stringify(er), 'w');
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Lấy Core_Person_Id từ response của Them_HoSo_TS.
    -- BE trả qua out param ParamCorePerson_Id_Out; tuỳ cách C# map có thể nằm ở
    -- Data / Id / Message → thử lần lượt các key thường gặp.
    -------------------------------------------*/
    /*------------------------------------------
    -- Chạy các hàm lưu phụ cho hồ sơ VỪA KHAI MỚI.
    -- Trước đây luồng Thêm chỉ gọi nguồn khai thác + địa chỉ, còn hóa đơn / ngân hàng /
    -- dân tộc / gia đình / CCCD thì phó mặc cho Them_HoSo_TS — mà proc đó không ghi
    -- (đúng hiện tượng "nhập hóa đơn lúc khai mới, mở ra không thấy").
    -------------------------------------------*/
    _saveKhai_PhuThuoc: function (personId, snap) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(personId) || !snap) return;
        // ⚠ KHÔNG được coi "hồ sơ mới = chưa có bản ghi hóa đơn". Them_HoSo_TS đã gửi
        // kèm 8 param strPersonInvoice_* nên BE tạo sẵn một bản rồi — ép rỗng ở đây
        // chính là thứ đẻ ra bản ghi thứ hai và làm địa chỉ không lên (xem chú thích
        // dài ở save_PersonInvoice). Để trống cả 2 biến → save_PersonInvoice tự tra DB.
        me._currentInvoiceId = '';
        me._currentInvoicePersonId = '';
        me._currentDoiTacRowId = '';
        me._currentDoiTacRowIds = [];
        me._currentDoiTacNguonId = '';
        me._currentDoiTacPersonId = personId;
        me._currentDoiTacPartnerId = '';
        me._currentDoiTacGhiChu = '';
        me.save_PersonInvoice(personId, snap.invoice);
        me.save_PersonBank(personId, snap.bank);
        me.save_PersonProfile(personId, snap.profile);
        me.save_PersonFamily(personId, snap.family);
        me.save_PersonIden(personId, snap.iden);
        me.save_PersonAddress(personId, snap.addr);
        me.save_HoSoDoiTacTS(personId, snap.nguon);
    },

    /*------------------------------------------
    -- Tra Core_Person_Id của hồ sơ vừa thêm. Cần vì controller Them_HoSo_TS bỏ rơi
    -- out param strCorePerson_Id_Out (so sánh: Them_Person_Profile có this.response.Id).
    -- Cách tra: nạp lại danh sách hồ sơ của KH + Đợt vừa khai rồi khớp theo CCCD.
    -------------------------------------------*/
    /*------------------------------------------
    -- ⚠ Đây là mắt xích quyết định việc lưu hồ sơ MỚI có đủ hay không.
    -- Tra không ra Id là 7 bảng phụ (hóa đơn, địa chỉ, gia đình, ngân hàng, CCCD
    -- ngày/nơi cấp, dân tộc/tôn giáo, nguồn khai thác) ĐỀU KHÔNG ĐƯỢC LƯU, mà
    -- trước đây lại im lặng — đúng hiện tượng khách báo 14/09/2026: "lưu lần đầu
    -- không được, vào Cập nhật lại mới được", gặp 3 lần liền.
    -- Bản cũ chỉ hỏi ĐÚNG MỘT LẦN với strTuKhoa = CCCD, hỏng ở 2 điểm:
    --   1) không chắc proc có tìm theo CCCD hay không
    --   2) hỏi ngay lập tức, BE có thể chưa commit xong bản ghi vừa thêm
    -- Nay: hỏi theo từ khóa → không ra thì quét cả danh sách của KH+Đợt rồi lọc
    -- tại chỗ → vẫn không ra thì chờ rồi thử lại, tối đa 3 nhịp (0.9s/1.8s/2.7s).
    -- cb(corePersonId, hoSoId): trả kèm HOSO_ID vì tab 8 (danh mục hồ sơ) gắn theo Id
    -- hồ sơ chứ không theo person, mà response Them_HoSo_TS cũng không có Id đó.
    -------------------------------------------*/
    _findNewPersonId: function (cccd, hoTen, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function (id, hosoId) { if (typeof cb === 'function') cb(id || '', hosoId || ''); };
        if (!edu.util.checkValue(cccd) && !edu.util.checkValue(hoTen)) { xong('', ''); return; }
        var chuan = function (s) { return ((s || '') + '').trim().toLowerCase(); };
        // So CCCD theo chữ số thôi — file/BE hay dính khoảng trắng, dấu gạch
        var soCC = function (s) { return ((s || '') + '').replace(/\D/g, ''); };

        var doTim = function (kw, dotParam, ok) {
            edu.system.makeRequest({
                success: function (data) {
                    var rows = (data && data.Success && data.Data) || [];
                    if (rows && rows.length === undefined) rows = [rows];
                    var hit = null;
                    if (edu.util.checkValue(cccd)) {
                        hit = (rows || []).filter(function (r) {
                            return soCC(me._pickLoose(r, ['PERSONIDEN_SOCCCD', 'SOCCCD', 'CCCD'])) === soCC(cccd);
                        })[0];
                    }
                    // CCCD trùng là chắc chắn; khớp theo họ tên chỉ dùng khi không có CCCD
                    if (!hit && edu.util.checkValue(hoTen)) {
                        hit = (rows || []).filter(function (r) {
                            return chuan(me._pickLoose(r, ['COREPERSON_HOTEN', 'HOTEN'])) === chuan(hoTen);
                        })[0];
                    }
                    ok(hit ? me._pickLoose(hit, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']) : '',
                        hit ? me._pickLoose(hit, ['HOSO_ID', 'ID', 'TS_HOSO_ID']) : '');
                },
                error: function () { ok('', ''); },
                type: 'POST',
                contentType: true,
                action: 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP',
                data: {
                    'action': 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP',
                    'func': 'PKG_CORE_TS_HOSO.LayDS_HoSo_TS',
                    'iM': edu.system.iM,
                    'strTuKhoa': kw || '',
                    'strHoSo_KH_TS_Id': me.strKeHoachTuyenSinh_Id || '',
                    'strHoSo_KH_TS_Dot_Id': dotParam !== undefined ? dotParam : (me.strDot_Id_ForKQ || ''),
                    'strHoSo_KH_Dot_PT_Id': '',
                    'strNguyenVong_DauRa_Id': '',
                    'strHoSo_KetQuaCode': '',
                    'strHoSo_TuNgay': '',
                    'strHoSo_DenNgay': '',
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                    'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                    'strHanhDong_Code': 'XEM'
                },
                fakedb: []
            }, false, false, false, null);
        };

        var nhip = 0;
        var dotIdKQ = me.strDot_Id_ForKQ || '';
        var vong = function () {
            doTim(edu.util.checkValue(cccd) ? cccd : (hoTen || ''), dotIdKQ, function (id, hsId) {
                if (id) { xong(id, hsId); return; }
                // Proc có thể không tìm theo CCCD hoặc đợt chưa nạp kịp → quét cả danh sách không lọc đợt
                doTim('', '', function (id2, hsId2) {
                    if (id2) { xong(id2, hsId2); return; }
                    if (++nhip > 3) {
                        kqdkNoLog('[LuuHoSo] không tra được Core_Person_Id sau ' + nhip + ' nhịp');
                        xong('', '');
                        return;
                    }
                    setTimeout(vong, 900 * nhip);   // chờ BE commit xong rồi hỏi lại
                });
            });
        };
        vong();
    },

    _pickCorePersonIdFromResp: function (data) {
        if (!data) return '';
        var tryVal = function (v) {
            if (v == null) return '';
            var s = String(v).trim();
            return (s.length === 32) ? s : '';   // ID hệ thống là chuỗi 32 ký tự
        };
        var d = data.Data;
        if (d && !Array.isArray(d) && typeof d === 'object') {
            var keys = ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id',
                'CorePerson_Id_Out', 'PERSON_ID', 'Person_Id'];
            for (var i = 0; i < keys.length; i++) {
                var got = tryVal(d[keys[i]]);
                if (got) return got;
            }
        }
        if (Array.isArray(d) && d.length && typeof d[0] === 'object') {
            return main_doc.KeHoachTuyenSinhNew._pickCorePersonIdFromResp({ Data: d[0] });
        }
        return tryVal(d) || tryVal(data.Id) || '';
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Loai_TuyenSinh_Get_Ds
    -- Lấy danh sách Loại nguồn tuyển sinh
    -------------------------------------------*/
    getList_LoaiTuyenSinh: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeDS4gKB4VNDgkLxIoLykeBiQ1HgUy',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Loai_TuyenSinh_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'dIs_Active': 1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtLoaiTuyenSinh = dtResult;
                    me.genCombo_LoaiTuyenSinh('ddlLoaiNguonTuyenSinh', '');
                    me.genCombo_LoaiTuyenSinh('ddlKH_LoaiNguonTuyenSinh', '');
                }
                else {
                    edu.system.alert("Pr_Ts_Loai_TuyenSinh_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Loai_TuyenSinh_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_LoaiTuyenSinh: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiTuyenSinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Loại nguồn tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_PA_TuyenSinh_Get_Ds
    -- Lấy danh sách Phương án tuyển sinh
    -------------------------------------------*/
    getList_PhuongAnTuyenSinh: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeEQAeFTQ4JC8SKC8pHgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_PA_TuyenSinh_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'dIs_Active': 1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtPhuongAnTuyenSinh = dtResult;
                    me.genCombo_PhuongAnTuyenSinh('ddlPhuongAnTuyenSinh', '');
                    me.genCombo_PhuongAnTuyenSinh('ddlKH_PhuongAnTuyenSinh', '');
                }
                else {
                    edu.system.alert("Pr_Ts_PA_TuyenSinh_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_PA_TuyenSinh_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_PhuongAnTuyenSinh: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhuongAnTuyenSinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Phương án tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- [Shared] NS_CoCauToChuc/LayDanhSach
    -- Đổ vào 3 dropdown: Đơn vị quản lý KH / quản lý HS / tiếp nhận HS
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCoCauToChuc = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genCombo_DonVi('ddlKH_DonViQLKH', '');
                    me.genCombo_DonVi('ddlKH_DonViQLHS', '');
                    me.genCombo_DonVi('ddlKH_DonViTiepNhan', '');
                }
            },
            error: function () { },
            type: 'GET',
            action: 'NS_CoCauToChuc/LayDanhSach',
            contentType: true,
            data: {
                'dTrangThai': 1,
                'strLoaiCoCauToChuc_Id': '',
                'strCoCauToChucCha_Id': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_DonVi: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCoCauToChuc,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "MA" },
            renderPlace: [strDrop_Id],
            title: "Chọn đơn vị",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Lấy danh mục Tình trạng kế hoạch (bảng DM: TS.KEHOACH.TINHTRANG)
    -------------------------------------------*/
    getList_TinhTrangKeHoach: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = {
            strMaBangDanhMuc: "TS.KEHOACH.TINHTRANG",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_TinhTrangKeHoach);
    },

    cbGetList_TinhTrangKeHoach: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtTinhTrangKeHoach = data || [];
        me.genCombo_TinhTrangKeHoach('ddlTinhTrangKeHoach', '');
        me.genCombo_TinhTrangKeHoach('ddlKH_TinhTrang', '');
    },

    genCombo_TinhTrangKeHoach: function (strDrop_Id, default_val) {
        var me = this;
        // value của option = MA (vì API list nhận strPlan_Status_Code)
        var obj = {
            data: me.dtTinhTrangKeHoach,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: [strDrop_Id],
            title: "Tình trạng kế hoạch",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List
    -- Lấy danh sách kế hoạch tuyển sinh theo filter
    -------------------------------------------*/
    getList_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4NKDI1',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
            'strLoai_TuyenSinh_Id': edu.system.getValById('ddlLoaiNguonTuyenSinh'),
            'strTs_PhuongAn_TuyenSinh_Id': edu.system.getValById('ddlPhuongAnTuyenSinh'),
            'strNam_TuyenSinh': edu.system.getValById('txtSearch_NamTuyenSinh'),
            'strNam_Hoc': edu.system.getValById('txtSearch_NamHoc'),
            'strHoc_Ky': edu.system.getValById('txtSearch_HocKy'),
            'strPlan_Status_Code': edu.system.getValById('ddlTinhTrangKeHoach'),
            'dIs_Active': edu.system.getValById('ddlConHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
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
                    me.dtKeHoachTuyenSinh = dtResult;
                    me.genTable_KeHoachTuyenSinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_List: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_List (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng danh sách kế hoạch tuyển sinh
    -- Fallback nhiều casing cho Mã/Tên + lookup DM local (dtLoaiTuyenSinh/dtPhuongAnTuyenSinh)
    -- qua ID khi API không join sẵn _Ten.
    -------------------------------------------*/
    genTable_KeHoachTuyenSinh: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        $("#lblKeHoachTuyenSinh_Tong").html(data.length || 0);
        var $tbody = $("#tblKHtyensinh tbody");
        $tbody.html("");

        if (!data || data.length === 0) {
            $tbody.append('<tr><td class="td-center" colspan="21">Không có dữ liệu</td></tr>');
            return;
        }

        var lookupTenById = function (arr, id) {
            if (!id || !arr || !arr.length) return '';
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].ID == id) return arr[j].TEN || '';
            }
            return '';
        };
        var lookupTenByMa = function (arr, ma) {
            if (!ma || !arr || !arr.length) return '';
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].MA == ma) return arr[j].TEN || '';
            }
            return ma;
        };

        var iconCheck = '<i class="fa-solid fa-check color-success font-weight fz18"></i>';
        var iconX = '<i class="fa-solid fa-xmark color-red font-weight fz18"></i>';
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var sMa = d.MA || d.Ma || d.KEHOACH_MA || '';
            var sTen = d.TEN || d.Ten || d.KEHOACH_TEN || '';
            var sLoai = d.LOAITUYENSINH_TEN || d.LOAI_TUYENSINH_TEN || d.LOAI_TUYENSINH_Ten || lookupTenById(me.dtLoaiTuyenSinh, d.LOAI_TUYENSINH_ID);
            var sPA = d.PHUONGANTUYENSINH_TEN || d.TS_PHUONGAN_TUYENSINH_TEN || d.TS_PHUONGAN_TUYENSINH_Ten || lookupTenById(me.dtPhuongAnTuyenSinh, d.TS_PHUONGAN_TUYENSINH_ID);
            var sTinhTrang = d.TINHTRANG_TEN || d.PLAN_STATUS_Name || d.PLAN_STATUS_TEN || lookupTenByMa(me.dtTinhTrangKeHoach, d.PLAN_STATUS_CODE);
            rows += '<tr id="row_' + strId + '">'
                + '<td class="td-center td-fix">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sMa + '</td>'
                + '<td class="td-left">' + sTen + '</td>'
                + '<td class="td-left">' + sLoai + '</td>'
                + '<td class="td-left">' + sPA + '</td>'
                + '<td class="td-center">' + (d.NAM_TUYENSINH || '') + '</td>'
                + '<td class="td-center">' + (d.NAM_HOC || '') + '</td>'
                + '<td class="td-center">' + (d.HOC_KY || '') + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Các đợt tuyển sinh" data-bs-toggle="modal" data-bs-target="#dot-tuyen-sinh">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Phân công nhân sự" data-bs-toggle="modal" data-bs-target="#phan-cong-nhan-su">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Kế hoạch đầu ra" data-bs-toggle="modal" data-bs-target="#ke-hoach-dau-ra">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Quy định phí" data-bs-toggle="modal" data-bs-target="#quy-dinh-phi">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Mẫu khai hồ sơ" data-bs-toggle="modal" data-bs-target="#mau-khai-hs">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Kết quả đăng ký" data-bs-toggle="modal" data-bs-target="#ket-qua-dk">Xem</a></td>'
                + '<td class="td-left">' + sTinhTrang + '</td>'
                + '<td class="td-center">' + (d.IS_PUBLIC == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_LOCKED == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_ACTIVE == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.NGUOITAO_TEN || '') + '</td>'
                + '<td class="td-center">' + (d.NGAYTAO || '') + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview btnDetail" data-id="' + strId + '" style="min-width: 68px !important;" title="Xem chi tiết" data-bs-toggle="modal" data-bs-target="#chi-tiet">Chi tiết</a></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_By_Id
    -- Lấy chi tiết kế hoạch tuyển sinh theo ID
    -------------------------------------------*/
    getDetail_KeHoachTuyenSinh: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4DOB4IJQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_By_Id',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = null;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.dtChiTiet = dtResult;
                    me.view_ChiTietKeHoach(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_By_Id: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_By_Id (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đổ dữ liệu chi tiết vào modal #chi-tiet
    -- NOTE: tên cột (KEHOACH_MA, KEHOACH_TEN, ...) đoán theo convention.
    --       Nếu API trả tên khác thì sửa lại tại đây.
    -------------------------------------------*/
    view_ChiTietKeHoach: function (data) {
        if (!data) return;
        var d = data;

        // Đây là lối vào DUY NHẤT của chế độ Xem-sửa → khóa Mã ngay tại đây, khỏi phụ
        // thuộc nút nào mở modal (nút Chi tiết ở bảng đã khóa sẵn, nhưng còn lối khác).
        main_doc.KeHoachTuyenSinhNew._khoaMaKeHoach(true);

        edu.util.viewValById('txtKH_Ma', d.MA || d.Ma || d.KEHOACH_MA || '');
        edu.util.viewValById('txtKH_Ten', d.TEN || d.Ten || d.KEHOACH_TEN || '');
        edu.util.viewValById('txtKH_NamTuyenSinh', d.NAM_TUYENSINH || '');
        edu.util.viewValById('txtKH_NamHoc', d.NAM_HOC || '');
        edu.util.viewValById('txtKH_HocKy', d.HOC_KY || '');
        edu.util.viewValById('txtKH_SoHoSoToiDa', d.MAX_HOSO_PER_PERSON || '');
        edu.util.viewValById('txtKH_ChiTieu', d.CHI_TIEU || '');
        edu.util.viewValById('txtKH_GhiChu', d.GHICHU || '');

        edu.util.viewValById('lblKH_SoDaDangKy', d.SO_DA_DANGKY || 0);
        edu.util.viewValById('lblKH_SoDaNopHS', d.SO_DA_NOP_HOSO || 0);
        edu.util.viewValById('lblKH_SoDaTrungTuyen', d.SO_DA_TRUNGTUYEN || 0);
        edu.util.viewValById('lblKH_SoDaTiepNhan', d.SO_DA_TIEPNHAN || 0);
        edu.util.viewValById('lblKH_SoDaNhapHoc', d.SO_DA_NHAPHOC || 0);

        $('#ddlKH_LoaiNguonTuyenSinh').val(d.LOAI_TUYENSINH_ID || '');
        $('#ddlKH_PhuongAnTuyenSinh').val(d.TS_PHUONGAN_TUYENSINH_ID || '');
        $('#ddlKH_MauHoSo').val(d.FORM_LAYOUT_ID || '');
        $('#ddlKH_DonViQLKH').val(d.OWNER_ORG_ID || '');
        $('#ddlKH_DonViQLHS').val(d.MANAGE_ORG_ID || '');
        $('#ddlKH_DonViTiepNhan').val(d.RECEIVE_ORG_ID || '');
        $('#ddlKH_TinhTrang').val(d.PLAN_STATUS_CODE || '');

        $('#chkKH_TaoTaiKhoan').prop('checked', d.REQUIRE_ACCOUNT == 1);
        $('#chkKH_ChoTSTuDangKy').prop('checked', d.ALLOW_ONLINE_REGISTER == 1);
        $('#chkKH_ChoCanBoNhapHS').prop('checked', d.ALLOW_DIRECT_INPUT == 1);
        $('#chkKH_ChoImport').prop('checked', d.ALLOW_IMPORT == 1);
        $('#chkKH_ChoDocApi').prop('checked', d.ALLOW_API == 1);
        $('#chkKH_YeuCauCanBoDuyet').prop('checked', d.REQUIRE_APPROVAL == 1);
        $('#chkKH_YeuCauKiemTraHS').prop('checked', d.REQUIRE_DOCUMENT_CHECK == 1);
        $('#chkKH_YeuCauThanhToan').prop('checked', d.REQUIRE_PAY_BEFORE_INTAKE == 1);
        $('#chkKH_ChoPhepThayDoiDauRa').prop('checked', d.ALLOW_CHANGE_OUTPUT == 1);
        $('#chkKH_KiemSoatTrungHS').prop('checked', edu.util.checkValue(d.HOSO_UNIQUE_SCOPE_CODE));
        $('#chkKH_CoMoPublic').prop('checked', d.IS_PUBLIC == 1);
        $('#chkKH_CoKhoa').prop('checked', d.IS_LOCKED == 1);
        $('#chkKH_ConHieuLuc').prop('checked', d.IS_ACTIVE == 1);
    },

    /*------------------------------------------
    -- Lấy danh mục Phân loại đợt (DM: TS.KEHOACH.DOT.KIEUDOT)
    -------------------------------------------*/
    getList_KieuDot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = {
            strMaBangDanhMuc: "TS.KEHOACH.DOT.KIEUDOT",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_KieuDot);
    },

    cbGetList_KieuDot: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtKieuDot = data || [];
        me.genCombo_KieuDot('ddl_KieuDot', '');
    },

    genCombo_KieuDot: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKieuDot,
            renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
            renderPlace: [strDrop_Id],
            title: "Chọn phân loại đợt",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Lấy danh mục Tình trạng đợt (DM: TS.KEHOACH.DOT.TINHTRANG)
    -------------------------------------------*/
    getList_TinhTrangDot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = {
            strMaBangDanhMuc: "TS.KEHOACH.DOT.TINHTRANG",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_TinhTrangDot);
    },

    cbGetList_TinhTrangDot: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtTinhTrangDot = data || [];
        me.genCombo_TinhTrangDot('ddl_TinhTrangDot', '');
    },

    genCombo_TinhTrangDot: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhTrangDot,
            renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
            renderPlace: [strDrop_Id],
            title: "Chọn tình trạng đợt",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Reset form Thêm mới đợt
    -------------------------------------------*/
    rewrite_Dot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var arrTxt = [
            'txtDot_Ma', 'txtDot_Ten', 'txtDot_SoDotThu',
            'txtDot_NgayBatDau_DangKy', 'txtDot_NgayKetThuc_DangKy',
            'txtDot_NgayBatDau_NopHS', 'txtDot_NgayKetThuc_NopHS',
            'txtDot_NgayBatDau_XuLy', 'txtDot_NgayKetThuc_XuLy',
            'txtDot_NgayCongBoKQ',
            'txtDot_NgayBatDau_XNNH', 'txtDot_NgayKetThuc_XNNH',
            'txtDot_ChiTieu', 'txtDot_ChiTieuToiThieu', 'txtDot_ChiTieuToiDa',
            'txtDot_GhiChu'
        ];
        edu.util.resetValByArrId(arrTxt);
        // 5 LABEL view-only — set text 0
        $('#lblDot_SoDaDangKy, #lblDot_SoDaNopHS, #lblDot_SoDaTrungTuyen, #lblDot_SoDaTiepNhan, #lblDot_SoDaNhapHoc').text('0');
        $('#ddl_KieuDot, #ddl_MauHoSo, #ddl_TinhTrangDot').val('');
        $('#chkDot_YeuCauCanBoDuyet, #chkDot_YeuCauKiemTraHS, #chkDot_YeuCauThanhToan, #chkDot_ChoPhepThayDoiDauRa, #chkDot_CoMoPublic, #chkDot_CoKhoa').prop('checked', false);
        $('#chkDot_ConHieuLuc').prop('checked', true);
        me.strDot_Id = '';
        $('#them-moi-dot .modal-header .title').html('<i class="fa-regular fa-plus"></i> Thêm mới đợt tuyển sinh');
        $('#btnDelete_Dot').addClass('d-none');  // ẩn nút Xóa khi Thêm mới
    },

    /*------------------------------------------
    -- Dispatcher: nếu strDot_Id có → update, không có → insert
    -------------------------------------------*/
    save_Dot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (edu.util.checkValue(me.strDot_Id)) {
            me.update_Dot();
        } else {
            me.insert_Dot();
        }
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Ins
    -- Thêm mới đợt tuyển sinh
    -------------------------------------------*/
    insert_Dot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Vui lòng chọn kế hoạch tuyển sinh trước khi thêm đợt", "w");
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HggvMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Ins',
            'iM': edu.system.iM,
            'strTs_KeHoach_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTen': edu.system.getValById('txtDot_Ten'),
            'strMa': edu.system.getValById('txtDot_Ma'),
            'dDot_No': edu.system.getValById('txtDot_SoDotThu'),
            'strDot_Type_Code': edu.system.getValById('ddl_KieuDot'),
            'strNgay_BatDau_DangKy': edu.system.getValById('txtDot_NgayBatDau_DangKy'),
            'strNgay_KetThuc_DangKy': edu.system.getValById('txtDot_NgayKetThuc_DangKy'),
            'strNgay_BatDau_Nop_HoSo': edu.system.getValById('txtDot_NgayBatDau_NopHS'),
            'strNgay_KetThuc_Nop_HoSo': edu.system.getValById('txtDot_NgayKetThuc_NopHS'),
            'strNgay_BatDau_XuLy': edu.system.getValById('txtDot_NgayBatDau_XuLy'),
            'strNgay_KetThuc_XuLy': edu.system.getValById('txtDot_NgayKetThuc_XuLy'),
            'strNgay_CongBo_KetQua': edu.system.getValById('txtDot_NgayCongBoKQ'),
            'strNgay_BD_XacNhan_NhapHoc': edu.system.getValById('txtDot_NgayBatDau_XNNH'),
            'strNgay_KT_XacNhan_NhapHoc': edu.system.getValById('txtDot_NgayKetThuc_XNNH'),
            'strNgay_BatDau_NhapHoc': '',
            'strNgay_KetThuc_NhapHoc': '',
            'dRequire_Approval_In_Dot': $('#chkDot_YeuCauCanBoDuyet').is(':checked') ? 1 : 0,
            'dRequire_Payment_In_Dot': $('#chkDot_YeuCauThanhToan').is(':checked') ? 1 : 0,
            'dRequire_Document_In_Dot': $('#chkDot_YeuCauKiemTraHS').is(':checked') ? 1 : 0,
            'dAllow_Change_OP_In_Dot': $('#chkDot_ChoPhepThayDoiDauRa').is(':checked') ? 1 : 0,
            'strForm_Layout_Id': edu.system.getValById('ddl_MauHoSo'),
            'dForm_Version_No': '',
            'dChi_Tieu': edu.system.getValById('txtDot_ChiTieu'),
            'dChi_Tieu_Toi_Thieu': edu.system.getValById('txtDot_ChiTieuToiThieu'),
            'dChi_Tieu_Toi_Da': edu.system.getValById('txtDot_ChiTieuToiDa'),
            'dSo_Da_DangKy': $('#lblDot_SoDaDangKy').text() || 0,
            'dSo_Da_Nop_HoSo': $('#lblDot_SoDaNopHS').text() || 0,
            'dSo_Da_TrungTuyen': $('#lblDot_SoDaTrungTuyen').text() || 0,
            'dSo_Da_TiepNhan': $('#lblDot_SoDaTiepNhan').text() || 0,
            'dSo_Da_NhapHoc': $('#lblDot_SoDaNhapHoc').text() || 0,
            'strDot_Status_Code': edu.system.getValById('ddl_TinhTrangDot'),
            'dIs_Public': $('#chkDot_CoMoPublic').is(':checked') ? 1 : 0,
            'dIs_Default': 0,
            'dIs_Locked': $('#chkDot_CoKhoa').is(':checked') ? 1 : 0,
            'dIs_Active': $('#chkDot_ConHieuLuc').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtDot_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'THEM'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công");
                    $("#them-moi-dot").modal('hide');
                    me.getList_DotTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Ins: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Ins (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Upd
    -- Cập nhật đợt tuyển sinh (Xem-sửa)
    -------------------------------------------*/
    update_Dot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strDot_Id)) {
            edu.system.alert("Chưa chọn đợt để sửa", "w");
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HhQxJQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Upd',
            'iM': edu.system.iM,
            'strId': me.strDot_Id,
            'strTs_KeHoach_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTen': edu.system.getValById('txtDot_Ten'),
            'strMa': edu.system.getValById('txtDot_Ma'),
            'dDot_No': edu.system.getValById('txtDot_SoDotThu'),
            'strDot_Type_Code': edu.system.getValById('ddl_KieuDot'),
            'strNgay_BatDau_DangKy': edu.system.getValById('txtDot_NgayBatDau_DangKy'),
            'strNgay_KetThuc_DangKy': edu.system.getValById('txtDot_NgayKetThuc_DangKy'),
            'strNgay_BatDau_Nop_HoSo': edu.system.getValById('txtDot_NgayBatDau_NopHS'),
            'strNgay_KetThuc_Nop_HoSo': edu.system.getValById('txtDot_NgayKetThuc_NopHS'),
            'strNgay_BatDau_XuLy': edu.system.getValById('txtDot_NgayBatDau_XuLy'),
            'strNgay_KetThuc_XuLy': edu.system.getValById('txtDot_NgayKetThuc_XuLy'),
            'strNgay_CongBo_KetQua': edu.system.getValById('txtDot_NgayCongBoKQ'),
            'strNgay_BD_XacNhan_NhapHoc': edu.system.getValById('txtDot_NgayBatDau_XNNH'),
            'strNgay_KT_XacNhan_NhapHoc': edu.system.getValById('txtDot_NgayKetThuc_XNNH'),
            'strNgay_BatDau_NhapHoc': '',
            'strNgay_KetThuc_NhapHoc': '',
            'dRequire_Approval_In_Dot': $('#chkDot_YeuCauCanBoDuyet').is(':checked') ? 1 : 0,
            'dRequire_Payment_In_Dot': $('#chkDot_YeuCauThanhToan').is(':checked') ? 1 : 0,
            'dRequire_Document_In_Dot': $('#chkDot_YeuCauKiemTraHS').is(':checked') ? 1 : 0,
            'dAllow_Change_OP_In_Dot': $('#chkDot_ChoPhepThayDoiDauRa').is(':checked') ? 1 : 0,
            'strForm_Layout_Id': edu.system.getValById('ddl_MauHoSo'),
            'dForm_Version_No': '',
            'dChi_Tieu': edu.system.getValById('txtDot_ChiTieu'),
            'dChi_Tieu_Toi_Thieu': edu.system.getValById('txtDot_ChiTieuToiThieu'),
            'dChi_Tieu_Toi_Da': edu.system.getValById('txtDot_ChiTieuToiDa'),
            'strDot_Status_Code': edu.system.getValById('ddl_TinhTrangDot'),
            'dIs_Public': $('#chkDot_CoMoPublic').is(':checked') ? 1 : 0,
            'dIs_Default': 0,
            'dIs_Locked': $('#chkDot_CoKhoa').is(':checked') ? 1 : 0,
            'dIs_Active': $('#chkDot_ConHieuLuc').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtDot_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                    $("#them-moi-dot").modal('hide');
                    me.getList_DotTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Upd: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Upd (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Del
    -- Xóa đợt tuyển sinh
    -------------------------------------------*/
    delete_Dot: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgUkLQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Del',
            'iM': edu.system.iM,
            'strId': me.strDot_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                    $("#them-moi-dot").modal('hide');
                    me.strDot_Id = '';
                    me.getList_DotTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Del: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Del (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Reset form Kế hoạch (modal #chi-tiet) — dùng cho mode Thêm mới
    -------------------------------------------*/
    rewrite_KeHoach: function () {
        var arrTxt = [
            'txtKH_Ma', 'txtKH_Ten', 'txtKH_NamTuyenSinh', 'txtKH_NamHoc', 'txtKH_HocKy',
            'txtKH_SoHoSoToiDa', 'txtKH_ChiTieu', 'txtKH_GhiChu',
            'lblKH_SoDaDangKy', 'lblKH_SoDaNopHS', 'lblKH_SoDaTrungTuyen',
            'lblKH_SoDaTiepNhan', 'lblKH_SoDaNhapHoc'
        ];
        edu.util.resetValByArrId(arrTxt);
        $('#ddlKH_LoaiNguonTuyenSinh, #ddlKH_PhuongAnTuyenSinh, #ddlKH_MauHoSo, #ddlKH_DonViQLKH, #ddlKH_DonViQLHS, #ddlKH_DonViTiepNhan, #ddlKH_TinhTrang').val('');
        $('#chkKH_TaoTaiKhoan, #chkKH_ChoTSTuDangKy, #chkKH_ChoCanBoNhapHS, #chkKH_ChoImport, #chkKH_ChoDocApi, #chkKH_YeuCauCanBoDuyet, #chkKH_YeuCauKiemTraHS, #chkKH_YeuCauThanhToan, #chkKH_ChoPhepThayDoiDauRa, #chkKH_KiemSoatTrungHS, #chkKH_CoMoPublic, #chkKH_CoKhoa').prop('checked', false);
        $('#chkKH_ConHieuLuc').prop('checked', true);
        $('#chi-tiet .modal-header .title').html('<i class="fa-regular fa-plus"></i> Thêm mới kế hoạch tuyển sinh');
        $('#btnDelete_KH').addClass('d-none');
        main_doc.KeHoachTuyenSinhNew._khoaMaKeHoach(false);   // Thêm mới thì phải gõ được Mã
    },

    /*------------------------------------------
    -- Khóa / mở ô "Mã" của kế hoạch (modal #chi-tiet).
    -- Mã là khóa nghiệp vụ: đợt, hồ sơ, giấy báo… đều tham chiếu theo nó, sửa lại là
    -- lệch dữ liệu cũ. Nên chỉ gõ lúc THÊM MỚI, vào Xem-sửa thì chỉ đọc (yêu cầu
    -- sếp Khoa 22/09/2026).
    -- ⚠ Dùng readonly chứ KHÔNG dùng disabled: disabled thì .val() vẫn đọc được nhưng
    --    nhiều helper/trình duyệt bỏ qua field, dễ gửi Mã rỗng lên proc Upd → xoá trắng mã.
    -------------------------------------------*/
    _khoaMaKeHoach: function (khoa) {
        $('#txtKH_Ma')
            .prop('readonly', !!khoa)
            .attr('title', khoa ? 'Mã kế hoạch không được sửa sau khi đã tạo' : '')
            .css({
                'background-color': khoa ? '#f1f5f9' : '',
                'cursor': khoa ? 'not-allowed' : ''
            });
    },

    /*------------------------------------------
    -- Dispatcher: nếu strKeHoachTuyenSinh_Id có → update, không → insert
    -------------------------------------------*/
    save_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            me.update_KeHoachTuyenSinh();
        } else {
            me.insert_KeHoachTuyenSinh();
        }
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Create
    -- Thêm mới kế hoạch tuyển sinh
    -------------------------------------------*/
    insert_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeAjMkIDUk',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Create',
            'iM': edu.system.iM,
            'strMa': edu.system.getValById('txtKH_Ma'),
            'strTen': edu.system.getValById('txtKH_Ten'),
            'strLoai_TuyenSinh_Id': edu.system.getValById('ddlKH_LoaiNguonTuyenSinh'),
            'strTs_PhuongAn_TuyenSinh_Id': edu.system.getValById('ddlKH_PhuongAnTuyenSinh'),
            'strNam_TuyenSinh': edu.system.getValById('txtKH_NamTuyenSinh'),
            'strNam_Hoc': edu.system.getValById('txtKH_NamHoc'),
            'strHoc_Ky': edu.system.getValById('txtKH_HocKy'),
            'dRequire_Account': $('#chkKH_TaoTaiKhoan').is(':checked') ? 1 : 0,
            'dAllow_Online_Register': $('#chkKH_ChoTSTuDangKy').is(':checked') ? 1 : 0,
            'dAllow_Direct_Input': $('#chkKH_ChoCanBoNhapHS').is(':checked') ? 1 : 0,
            'dAllow_Import': $('#chkKH_ChoImport').is(':checked') ? 1 : 0,
            'dAllow_Api': $('#chkKH_ChoDocApi').is(':checked') ? 1 : 0,
            'dRequire_Approval': $('#chkKH_YeuCauCanBoDuyet').is(':checked') ? 1 : 0,
            'dRequire_Document_Check': $('#chkKH_YeuCauKiemTraHS').is(':checked') ? 1 : 0,
            'dRequire_Pay_Before_Intake': $('#chkKH_YeuCauThanhToan').is(':checked') ? 1 : 0,
            'dAllow_Change_Output': $('#chkKH_ChoPhepThayDoiDauRa').is(':checked') ? 1 : 0,
            'strHoso_Unique_Scope_Code': $('#chkKH_KiemSoatTrungHS').is(':checked') ? '1' : '',
            'dMax_Hoso_Per_Person': edu.system.getValById('txtKH_SoHoSoToiDa'),
            'strForm_Layout_Id': edu.system.getValById('ddlKH_MauHoSo'),
            'strForm_Version_No': '',
            'strOwner_Org_Id': edu.system.getValById('ddlKH_DonViQLKH'),
            'strManage_Org_Id': edu.system.getValById('ddlKH_DonViQLHS'),
            'strReceive_Org_Id': edu.system.getValById('ddlKH_DonViTiepNhan'),
            'dChi_Tieu': edu.system.getValById('txtKH_ChiTieu'),
            'strPlan_Status_Code': edu.system.getValById('ddlKH_TinhTrang'),
            'dIs_Public': $('#chkKH_CoMoPublic').is(':checked') ? 1 : 0,
            'dIs_Locked': $('#chkKH_CoKhoa').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtKH_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'THEM'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công");
                    if (edu.util.checkValue(data.Id)) {
                        me.strKeHoachTuyenSinh_Id = data.Id;
                    }
                    $("#chi-tiet").modal('hide');
                    me.getList_KeHoachTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Create: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Create (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Update
    -- Lưu chỉnh sửa kế hoạch tuyển sinh
    -------------------------------------------*/
    update_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Chưa chọn kế hoạch để sửa", "w");
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeFDElIDUk',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Update',
            'iM': edu.system.iM,
            'strId': me.strKeHoachTuyenSinh_Id,
            'strMa': edu.system.getValById('txtKH_Ma'),
            'strTen': edu.system.getValById('txtKH_Ten'),
            'strLoai_TuyenSinh_Id': edu.system.getValById('ddlKH_LoaiNguonTuyenSinh'),
            'strTs_PhuongAn_TuyenSinh_Id': edu.system.getValById('ddlKH_PhuongAnTuyenSinh'),
            'strNam_TuyenSinh': edu.system.getValById('txtKH_NamTuyenSinh'),
            'strNam_Hoc': edu.system.getValById('txtKH_NamHoc'),
            'strHoc_Ky': edu.system.getValById('txtKH_HocKy'),
            'dRequire_Account': $('#chkKH_TaoTaiKhoan').is(':checked') ? 1 : 0,
            'dAllow_Online_Register': $('#chkKH_ChoTSTuDangKy').is(':checked') ? 1 : 0,
            'dAllow_Direct_Input': $('#chkKH_ChoCanBoNhapHS').is(':checked') ? 1 : 0,
            'dAllow_Import': $('#chkKH_ChoImport').is(':checked') ? 1 : 0,
            'dAllow_Api': $('#chkKH_ChoDocApi').is(':checked') ? 1 : 0,
            'dRequire_Approval': $('#chkKH_YeuCauCanBoDuyet').is(':checked') ? 1 : 0,
            'dRequire_Document_Check': $('#chkKH_YeuCauKiemTraHS').is(':checked') ? 1 : 0,
            'dRequire_Pay_Before_Intake': $('#chkKH_YeuCauThanhToan').is(':checked') ? 1 : 0,
            'dAllow_Change_Output': $('#chkKH_ChoPhepThayDoiDauRa').is(':checked') ? 1 : 0,
            'strHoso_Unique_Scope_Code': $('#chkKH_KiemSoatTrungHS').is(':checked') ? '1' : '',
            'dMax_Hoso_Per_Person': edu.system.getValById('txtKH_SoHoSoToiDa'),
            'strForm_Layout_Id': edu.system.getValById('ddlKH_MauHoSo'),
            'strForm_Version_No': '',
            'strOwner_Org_Id': edu.system.getValById('ddlKH_DonViQLKH'),
            'strManage_Org_Id': edu.system.getValById('ddlKH_DonViQLHS'),
            'strReceive_Org_Id': edu.system.getValById('ddlKH_DonViTiepNhan'),
            'dChi_Tieu': edu.system.getValById('txtKH_ChiTieu'),
            'strPlan_Status_Code': edu.system.getValById('ddlKH_TinhTrang'),
            'dIs_Public': $('#chkKH_CoMoPublic').is(':checked') ? 1 : 0,
            'dIs_Locked': $('#chkKH_CoKhoa').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtKH_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                    $("#chi-tiet").modal('hide');
                    me.getList_KeHoachTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Update: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Update (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_By_Id
    -- Lấy chi tiết đợt theo ID
    -------------------------------------------*/
    getDetail_Dot: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgYkNR4DOB4IJQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_By_Id',
            'iM': edu.system.iM,
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = null;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.dtChiTietDot = dtResult;
                    me.view_ChiTietDot(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_By_Id: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_By_Id (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đổ data đợt vào modal #them-moi-dot (chế độ Xem-sửa)
    -- NOTE: tên cột (Ma, Ten, DOT_NO, DOT_TYPE_CODE, NGAY_BATDAU_DANGKY, ...) đoán theo convention.
    --       Nếu API trả khác thì sửa lại tại đây.
    -------------------------------------------*/
    view_ChiTietDot: function (data) {
        if (!data) return;
        var d = data;

        // Đổi title sang chế độ Xem-sửa + hiện nút Xóa
        $('#them-moi-dot .modal-header .title').html('<i class="fa-regular fa-pen-to-square"></i> Xem - sửa đợt tuyển sinh');
        $('#btnDelete_Dot').removeClass('d-none');

        edu.util.viewValById('txtDot_Ma', d.Ma || d.MA || '');
        edu.util.viewValById('txtDot_Ten', d.Ten || d.TEN || '');
        edu.util.viewValById('txtDot_SoDotThu', d.DOT_NO || '');
        edu.util.viewValById('txtDot_NgayBatDau_DangKy', d.NGAY_BATDAU_DANGKY || '');
        edu.util.viewValById('txtDot_NgayKetThuc_DangKy', d.NGAY_KETTHUC_DANGKY || '');
        edu.util.viewValById('txtDot_NgayBatDau_NopHS', d.NGAY_BATDAU_NOP_HOSO || '');
        edu.util.viewValById('txtDot_NgayKetThuc_NopHS', d.NGAY_KETTHUC_NOP_HOSO || '');
        edu.util.viewValById('txtDot_NgayBatDau_XuLy', d.NGAY_BATDAU_XULY || '');
        edu.util.viewValById('txtDot_NgayKetThuc_XuLy', d.NGAY_KETTHUC_XULY || '');
        edu.util.viewValById('txtDot_NgayCongBoKQ', d.NGAY_CONGBO_KETQUA || '');
        edu.util.viewValById('txtDot_NgayBatDau_XNNH', d.NGAY_BD_XACNHAN_NHAPHOC || '');
        edu.util.viewValById('txtDot_NgayKetThuc_XNNH', d.NGAY_KT_XACNHAN_NHAPHOC || '');
        edu.util.viewValById('txtDot_ChiTieu', d.CHI_TIEU || '');
        edu.util.viewValById('txtDot_ChiTieuToiThieu', d.CHI_TIEU_TOI_THIEU || '');
        edu.util.viewValById('txtDot_ChiTieuToiDa', d.CHI_TIEU_TOI_DA || '');
        edu.util.viewValById('txtDot_GhiChu', d.GHICHU || '');

        // 5 LABEL view-only — set text trực tiếp (span chứ không phải input)
        $('#lblDot_SoDaDangKy').text(d.SO_DA_DANGKY || 0);
        $('#lblDot_SoDaNopHS').text(d.SO_DA_NOP_HOSO || 0);
        $('#lblDot_SoDaTrungTuyen').text(d.SO_DA_TRUNGTUYEN || 0);
        $('#lblDot_SoDaTiepNhan').text(d.SO_DA_TIEPNHAN || 0);
        $('#lblDot_SoDaNhapHoc').text(d.SO_DA_NHAPHOC || 0);

        $('#ddl_KieuDot').val(d.DOT_TYPE_CODE || '');
        $('#ddl_MauHoSo').val(d.FORM_LAYOUT_ID || '');
        $('#ddl_TinhTrangDot').val(d.DOT_STATUS_CODE || '');

        $('#chkDot_YeuCauCanBoDuyet').prop('checked', d.REQUIRE_APPROVAL_IN_DOT == 1);
        $('#chkDot_YeuCauKiemTraHS').prop('checked', d.REQUIRE_DOCUMENT_IN_DOT == 1);
        $('#chkDot_YeuCauThanhToan').prop('checked', d.REQUIRE_PAYMENT_IN_DOT == 1);
        $('#chkDot_ChoPhepThayDoiDauRa').prop('checked', d.ALLOW_CHANGE_OP_IN_DOT == 1);
        $('#chkDot_CoMoPublic').prop('checked', d.IS_PUBLIC == 1);
        $('#chkDot_CoKhoa').prop('checked', d.IS_LOCKED == 1);
        $('#chkDot_ConHieuLuc').prop('checked', d.IS_ACTIVE == 1);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds
    -- Lấy danh sách đợt theo kế hoạch (modal #dot-tuyen-sinh)
    -------------------------------------------*/
    getList_DotTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            me.genTable_DotTuyenSinh([]);
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_KeHoach_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strDot_Status_Code': '',
            'dIs_Active': ''
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtDotTuyenSinh = dtResult;
                    me.genTable_DotTuyenSinh(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng đợt tuyển sinh trong modal #dot-tuyen-sinh
    -- Fallback nhiều casing vì API có thể trả MA/TEN (uppercase) hoặc Ma/Ten (PascalCase).
    -- Kiểu đợt + Tình trạng đợt: lookup từ cache DM local (dtKieuDot / dtTinhTrangDot)
    -- thay vì dựa vào API join sẵn để tránh phụ thuộc tên cột _Ten.
    -------------------------------------------*/
    genTable_DotTuyenSinh: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $("#tblDotTuyenSinh tbody");
        $tbody.html("");

        if (!data || data.length === 0) {
            $tbody.append('<tr><td class="td-center" colspan="18">Không có dữ liệu</td></tr>');
            return;
        }

        var lookupTen = function (arrDM, ma) {
            if (!ma || !arrDM || !arrDM.length) return '';
            for (var j = 0; j < arrDM.length; j++) {
                if (arrDM[j].MA == ma) return arrDM[j].TEN || '';
            }
            return ma;
        };

        var iconCheck = '<i class="fa-solid fa-check color-success font-weight fz18"></i>';
        var iconX = '<i class="fa-solid fa-xmark color-red font-weight fz18"></i>';
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var sMa = d.MA || d.Ma || '';
            var sTen = d.TEN || d.Ten || '';
            var sKieuDot = d.DOT_TYPE_CODE_Ten || d.KIEUDOT_TEN || lookupTen(me.dtKieuDot, d.DOT_TYPE_CODE);
            var sTinhTrang = d.DOT_STATUS_CODE_Ten || d.TINHTRANG_TEN || lookupTen(me.dtTinhTrangDot, d.DOT_STATUS_CODE);
            var sNgayBD = d.NGAY_BATDAU_DANGKY || d.Ngay_BatDau_DangKy || '';
            var sNgayKT = d.NGAY_KETTHUC_DANGKY || d.Ngay_KetThuc_DangKy || '';
            var sNguoiTao = d.NGUOITAO_TaiKhoan || d.NGUOITAO_TEN || d.NGUOI_TAO || d.NguoiTao || '';
            var sNgayTao = d.NgayTao_dd_mm_yyyy_hhmmss || d.NGAY_TAO || d.NgayTao || '';
            // Badge "TEN (MA)" cho title modal Khai danh mục hồ sơ — escape " để không vỡ attribute
            var sBadgeDot = (sTen && sMa && sTen !== sMa) ? (sTen + ' (' + sMa + ')') : (sTen || sMa || '');
            sBadgeDot = String(sBadgeDot).replace(/"/g, '&quot;');

            rows += '<tr id="row_dot_' + strId + '">'
                + '<td class="td-center td-fix">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sMa + '</td>'
                + '<td class="td-left">' + sTen + '</td>'
                + '<td class="td-left">' + sKieuDot + '</td>'
                + '<td class="td-center">' + sNgayBD + '</td>'
                + '<td class="td-center">' + sNgayKT + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Phương thức tuyển" data-bs-toggle="modal" data-bs-target="#phuong-thuc-tuyen">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Kế hoạch đầu ra" data-bs-toggle="modal" data-bs-target="#ke-hoach-dau-ra">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Mẫu khai hồ sơ" data-bs-toggle="modal" data-bs-target="#mau-khai-hs">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview" data-id="' + strId + '" title="Kết quả đăng ký" data-bs-toggle="modal" data-bs-target="#ket-qua-dk">Xem</a></td>'
                + '<td class="td-center"><a class="btn btn-default btnview btnKhaiQuyDinhHoSo" data-id="' + strId + '" data-ten="' + sBadgeDot + '" title="Khai danh mục hồ sơ giấy tờ" data-bs-toggle="modal" data-bs-target="#khai-danh-muc-ho-so">Khai</a></td>'
                + '<td class="td-left">' + sTinhTrang + '</td>'
                + '<td class="td-center">' + (d.IS_PUBLIC == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_LOCKED == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_ACTIVE == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + sNguoiTao + '</td>'
                + '<td class="td-center">' + sNgayTao + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview btnDetailDot" data-id="' + strId + '" style="min-width: 68px !important;" title="Xem chi tiết" data-bs-toggle="modal" data-bs-target="#them-moi-dot">Chi tiết</a></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*==========================================================================
    == KHAI DANH MỤC HỒ SƠ GIẤY TỜ THEO ĐỢT TUYỂN SINH
    == Origin: pkg_tuyensinh_kehoach.LayDSTS_QuyDinhHoSo / Them_ / Sua_ / Xoa_TS_QuyDinhHoSo
    ==
    == ⚠ Param `strTS_KeHoachTuyenSinh_Id` của CẢ 3 proc nhận ID **ĐỢT** tuyển sinh,
    ==   KHÔNG phải ID kế hoạch (BE đặt tên param lệch — spec xác nhận 21/09/2026).
    ==   Vì vậy ở đây dùng me.strQDHS_Dot_Id chứ không phải me.strKeHoachTuyenSinh_Id.
    ==
    == UI là grid khai trực tiếp: mỗi dòng = 1 loại hồ sơ giấy tờ.
    ==   - Dòng chưa có data-id → Lưu sẽ gọi Them_
    ==   - Dòng đã có data-id   → Lưu sẽ gọi Sua_
    ==   - Nút "Xóa" từng dòng: dòng mới gỡ khỏi DOM luôn, dòng cũ mới gọi Xoa_
    ==========================================================================*/
    _ACTION_QDHS_LayDS: 'TS_KeHoach_MH/DSA4BRIVEh4QNDgFKC8pCS4SLgPP',
    _ACTION_QDHS_Them: 'TS_KeHoach_MH/FSkkLB4VEh4QNDgFKC8pCS4SLgPP',
    _ACTION_QDHS_Sua: 'TS_KeHoach_MH/EjQgHhUSHhA0OAUoLykJLhIu',
    _ACTION_QDHS_Xoa: 'TS_KeHoach_MH/GS4gHhUSHhA0OAUoLykJLhIu',

    strQDHS_Dot_Id: '',
    dtQDHS_LoaiHoSo: null,
    dtQDHS_TinhChatHoSo: null,

    /*------------------------------------------
    -- Nạp 2 danh mục cho dropdown của grid (1 lần, cache qua _ensureDMList).
    -------------------------------------------*/
    _qdhsEnsureDM: function (cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var xong = function () { if (typeof cb === 'function') cb(); };
        if (me.dtQDHS_LoaiHoSo && me.dtQDHS_TinhChatHoSo) { xong(); return; }
        var remain = 2;
        var done = function () { if (--remain === 0) xong(); };
        me._ensureDMList('TUYENSINH.LOAIHOSO', 'dtQDHS_LoaiHoSo', done);
        me._ensureDMList('TUYENSINH.TINHCHATHOSO', 'dtQDHS_TinhChatHoSo', done);
    },

    /*------------------------------------------
    -- Dựng <option> cho 1 dropdown danh mục, tự chọn sẵn selectedId nếu có.
    -------------------------------------------*/
    _qdhsOptions: function (arr, selectedId, placeholder) {
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        var sel = String(selectedId == null ? '' : selectedId);
        var html = '<option value="">' + esc(placeholder) + '</option>';
        (arr || []).forEach(function (d) {
            var id = ((d.ID || d.Id || d.id || '') + '').trim();
            if (!id) return;
            var ten = ((d.TEN || d.Ten || '') + '').trim();
            var ma = ((d.MA || d.Ma || '') + '').trim();
            html += '<option value="' + esc(id) + '"' + (id === sel ? ' selected' : '') + '>'
                + esc(ten || ma) + '</option>';
        });
        return html;
    },

    /*------------------------------------------
    -- 1 dòng grid. d rỗng = dòng thêm mới (data-id rỗng).
    -- Tên cột response chưa chốt → dùng _pickLoose để dò lỏng theo đuôi cột.
    -------------------------------------------*/
    _qdhsRowHtml: function (d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var esc = function (s) { return $('<div>').text(s == null ? '' : s).html(); };
        d = d || {};
        var id = me._pickLoose(d, ['ID']);
        var loaiId = me._pickLoose(d, ['LOAIHOSO_ID', 'LOAI_HOSO_ID', 'TS_LOAIHOSO_ID']);
        var tinhChatId = me._pickLoose(d, ['TINHCHATHOSO_ID', 'TINHCHAT_HOSO_ID', 'TS_TINHCHATHOSO_ID']);
        var soLuong = me._pickLoose(d, ['SOLUONG', 'SO_LUONG']);
        var thuTu = me._pickLoose(d, ['THUTU', 'THU_TU']);
        if (soLuong === '') soLuong = 1;
        if (thuTu === '') thuTu = 0;
        return '<tr class="qdhs-row" data-id="' + esc(id) + '">'
            + '<td class="td-center"><input type="number" min="0" class="form-control qdhs-thutu" value="' + esc(thuTu) + '"></td>'
            + '<td><select class="form-select qdhs-loai">'
            + me._qdhsOptions(me.dtQDHS_LoaiHoSo, loaiId, '-- Chọn loại hồ sơ --') + '</select></td>'
            + '<td><input type="number" min="0" class="form-control qdhs-soluong" value="' + esc(soLuong) + '"></td>'
            + '<td><select class="form-select qdhs-tinhchat">'
            + me._qdhsOptions(me.dtQDHS_TinhChatHoSo, tinhChatId, '-- Chọn tính chất --') + '</select></td>'
            + '<td class="td-center"><a href="javascript:void(0)" class="color-red qdhs-xoa" title="Xóa dòng">Xóa</a></td>'
            + '</tr>';
    },

    /*------------------------------------------
    -- Cập nhật badge tổng + dòng placeholder khi bảng trống.
    -------------------------------------------*/
    _qdhsCapNhatTong: function () {
        var $tbody = $('#tblQuyDinhHoSo tbody');
        var n = $tbody.find('tr.qdhs-row').length;
        $('#lblQDHS_Tong').text(n);
        $tbody.find('tr.qdhs-empty').remove();
        if (!n) {
            $tbody.append('<tr class="qdhs-empty"><td colspan="5" class="td-center text-muted" style="padding:16px 8px;">'
                + 'Chưa khai danh mục hồ sơ — bấm "Thêm hồ sơ" để thêm dòng</td></tr>');
        }
    },

    getList_QuyDinhHoSo: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strQDHS_Dot_Id)) {
            me.genTable_QuyDinhHoSo([]);
            return;
        }
        var obj_save = {
            'action': me._ACTION_QDHS_LayDS,
            'func': 'pkg_tuyensinh_kehoach.LayDSTS_QuyDinhHoSo',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            // ⚠ Tên param là KeHoachTuyenSinh nhưng BE nhận ID ĐỢT — xem chú thích đầu khối
            'strTS_KeHoachTuyenSinh_Id': me.strQDHS_Dot_Id,
            'strLoaiHoSo_Id': '',
            'strNguoiTao_Id': '',
            'pageIndex': 1,
            'pageSize': 100000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.genTable_QuyDinhHoSo(edu.util.checkValue(data.Data) ? data.Data : []);
                } else {
                    me.genTable_QuyDinhHoSo([]);
                    edu.system.alert("LayDSTS_QuyDinhHoSo: " + ((data && data.Message) || 'Không lấy được danh sách'), "w");
                }
            },
            error: function (er) {
                me.genTable_QuyDinhHoSo([]);
                edu.system.alert("LayDSTS_QuyDinhHoSo (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_QuyDinhHoSo: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $('#tblQuyDinhHoSo tbody');
        $tbody.html('');
        (data || []).forEach(function (d) { $tbody.append(me._qdhsRowHtml(d)); });
        me._qdhsCapNhatTong();
    },

    addRow_QuyDinhHoSo: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $('#tblQuyDinhHoSo tbody');
        $tbody.find('tr.qdhs-empty').remove();
        // Thứ tự gợi ý = số dòng hiện có + 1, số lượng mặc định 1
        $tbody.append(me._qdhsRowHtml({ THUTU: $tbody.find('tr.qdhs-row').length + 1, SOLUONG: 1 }));
        me._qdhsCapNhatTong();
    },

    /*------------------------------------------
    -- Xóa 1 dòng. Dòng chưa lưu (data-id rỗng) chỉ gỡ khỏi DOM, không gọi API.
    -------------------------------------------*/
    xoaDong_QuyDinhHoSo: function ($tr) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var id = $tr.attr('data-id') || '';
        if (!edu.util.checkValue(id)) {
            $tr.remove();
            me._qdhsCapNhatTong();
            return;
        }
        edu.system.confirm("Bạn có chắc chắn xóa dòng hồ sơ này không?");
        $("#btnYes").off("click").on("click", function () {
            // ⚠ .off("click") ở trên đã gỡ luôn handler mặc định của systemroot
            // (systemroot.js:5886 — nó lo việc ẩn nút Yes + dọn #alert_content),
            // nên phải TỰ đóng hộp confirm, nếu không:
            //   - nút Yes còn nguyên → bấm được nhiều lần, gọi Xóa lặp lại
            //   - cờ edu.system.flag_alert vẫn true → edu.system.alert("Xóa thành công")
            //     bị APPEND vào chính hộp confirm đang mở thay vì mở hộp báo mới.
            // Đóng TRƯỚC khi gọi API để modal kịp tắt hẳn trước lúc có response.
            $("#btnYes").off("click");
            $('#myModalAlert').modal('hide');
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) {
                        edu.system.alert("Xóa thành công");
                        me.getList_QuyDinhHoSo();
                    } else {
                        edu.system.alert("Xoa_TS_QuyDinhHoSo: " + ((data && data.Message) || 'Lỗi'), "w");
                    }
                },
                error: function (er) {
                    edu.system.alert("Xoa_TS_QuyDinhHoSo (ex): " + JSON.stringify(er), "w");
                },
                type: 'POST',
                contentType: true,
                action: me._ACTION_QDHS_Xoa,
                data: {
                    'action': me._ACTION_QDHS_Xoa,
                    'func': 'pkg_tuyensinh_kehoach.Xoa_TS_QuyDinhHoSo',
                    'iM': edu.system.iM,
                    'strIds': id,
                    'strNguoiThucHien_Id': edu.system.userId
                },
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Lưu tất cả dòng: chưa có Id → Them_, đã có Id → Sua_. Đếm done/failed rồi
    -- báo tổng 1 lần (cùng pattern save_DauRa / save_PhanCong).
    -------------------------------------------*/
    save_QuyDinhHoSo: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strQDHS_Dot_Id)) {
            edu.system.alert("Chưa xác định đợt tuyển sinh (mở lại từ bảng Các đợt tuyển sinh)", "w");
            return;
        }

        var tasks = [];
        var thieuLoai = false;
        $('#tblQuyDinhHoSo tbody tr.qdhs-row').each(function () {
            var $r = $(this);
            var loaiId = $r.find('.qdhs-loai').val() || '';
            if (!loaiId) { thieuLoai = true; return; }
            tasks.push({
                id: $r.attr('data-id') || '',
                loaiId: loaiId,
                tinhChatId: $r.find('.qdhs-tinhchat').val() || '',
                soLuong: $r.find('.qdhs-soluong').val(),
                thuTu: $r.find('.qdhs-thutu').val()
            });
        });
        if (thieuLoai) {
            edu.system.alert("Có dòng chưa chọn Loại hồ sơ — vui lòng chọn hoặc xóa dòng đó", "w");
            return;
        }
        if (!tasks.length) {
            edu.system.alert("Chưa có dòng nào để lưu", "w");
            return;
        }

        // Param prefix 'd' là NUMBER bên Oracle. KHÔNG gửi null ở đây: entity C#
        // KeHoach_MHEntity có thể khai double non-nullable → null sẽ 500 lúc deserialize.
        // 2 ô này luôn có giá trị mặc định trên form nên quy rỗng về 0 là an toàn.
        var soNguyen = function (v) {
            if (v === '' || v === undefined || v === null) return 0;
            var n = Number(v);
            return isNaN(n) ? 0 : n;
        };

        var done = 0, failed = 0, total = tasks.length;
        var loi = [];
        var finalize = function () {
            if (done + failed !== total) return;
            var msg = "Đã lưu " + done + "/" + total;
            if (failed) msg += " (lỗi: " + failed + ")" + (loi.length ? "<br/>" + loi.slice(0, 5).join("<br/>") : "");
            edu.system.alert(msg, failed ? "w" : "s");
            me.getList_QuyDinhHoSo();
        };

        tasks.forEach(function (t) {
            var isUpd = edu.util.checkValue(t.id);
            var obj_save = {
                'action': isUpd ? me._ACTION_QDHS_Sua : me._ACTION_QDHS_Them,
                'func': 'pkg_tuyensinh_kehoach.' + (isUpd ? 'Sua_TS_QuyDinhHoSo' : 'Them_TS_QuyDinhHoSo'),
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strTS_KeHoachTuyenSinh_Id': me.strQDHS_Dot_Id,
                'strTinhChatHoSo_Id': t.tinhChatId,
                'strLoaiHoSo_Id': t.loaiId,
                'dSoLuong': soNguyen(t.soLuong),
                'dThuTu': soNguyen(t.thuTu),
                'strNguoiThucHien_Id': edu.system.userId
            };
            if (isUpd) obj_save.strId = t.id;

            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) done++;
                    else { failed++; if (data && data.Message) loi.push(data.Message); }
                    finalize();
                },
                error: function (er) {
                    failed++;
                    loi.push('HTTP: ' + JSON.stringify(er));
                    finalize();
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Lấy danh mục Vai trò phân công (DM: TS.KEHOACH.NHANSU.VAITRO)
    -------------------------------------------*/
    getList_VaiTro_PhanCong: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = {
            strMaBangDanhMuc: "TS.KEHOACH.NHANSU.VAITRO",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro_PhanCong);
    },

    cbGetList_VaiTro_PhanCong: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtVaiTro_PhanCong = data || [];
        me.genCombo_VaiTro_PhanCong('ddlXS_VaiTro', '');         // modal Xem-sửa
        me.genCombo_VaiTro_PhanCong('ddlPC_New_VaiTro', '');     // modal Thêm mới (form chung)
    },

    genCombo_VaiTro_PhanCong: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro_PhanCong,
            renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
            renderPlace: [strDrop_Id],
            title: "Chọn vai trò",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Reset form Thêm mới phân công nhân sự
    -------------------------------------------*/
    rewrite_PhanCong: function () {
        $("#tblNhanSuDaChon tbody").html(
            '<tr><td colspan="3" class="td-center text-muted" style="padding:16px 8px;">Chưa chọn nhân sự — bấm "Chọn nhân sự"</td></tr>'
        );
        $("#lblCountPC_NSDaChon").text(0);
        $("#chkPC_SelectAll").prop('checked', false);
        // Reset form chung (Section B)
        $('#ddlPC_New_VaiTro').val('');
        $('#txtPC_New_NgayBatDau, #txtPC_New_NgayKetThuc, #txtPC_New_GhiChu').val('');
        $('#chkPC_New_Allowed, #chkPC_New_Active').prop('checked', true);
    },

    /*------------------------------------------
    -- Public method: shared picker gọi lại sau khi user chọn xong nhân sự
    -- arrPersons: [{ID, FULL_NAME, current_employee_code}, ...]
    -- Mỗi row chỉ chứa Stt | Thông tin NS | checkbox Chọn — Vai trò/Ngày/Ghi chú
    -- khai chung 1 lần ở Section B.
    -------------------------------------------*/
    addNhanSu_PhanCong: function (arrPersons) {
        if (!arrPersons || !arrPersons.length) return;

        var $tbody = $("#tblNhanSuDaChon tbody");
        // Xoá row placeholder (nếu còn) trước khi append real rows
        $tbody.find('tr').filter(function () {
            return $(this).find('td[colspan]').length > 0;
        }).remove();
        var startIdx = $tbody.find('tr[data-person-id]').length;
        var rows = '';
        for (var i = 0; i < arrPersons.length; i++) {
            var p = arrPersons[i];
            var stt = startIdx + i + 1;
            var personId = p.ID || '';
            var nhanSuTen = (p.FULL_NAME || '') + (p.current_employee_code ? ' - ' + p.current_employee_code : '');
            rows += '<tr data-person-id="' + personId + '">'
                + '<td class="td-center td-fix">' + stt + '</td>'
                + '<td class="td-left">' + nhanSuTen + '</td>'
                + '<td class="td-center"><input type="checkbox" class="pc-select" checked /></td>'
                + '</tr>';
        }
        $tbody.append(rows);
        $("#lblCountPC_NSDaChon").text($tbody.find('tr[data-person-id]').length);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Ins
    -- Form chung (Section B) khai 1 lần → áp cho mọi nhân sự được tick.
    -------------------------------------------*/
    save_PhanCong: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Vui lòng chọn kế hoạch tuyển sinh trước", "w");
            return;
        }

        var $rows = $("#tblNhanSuDaChon tbody tr");
        if ($rows.length === 0) {
            edu.system.alert("Vui lòng chọn nhân sự để phân công", "w");
            return;
        }

        var arrPersonIds = [];
        $rows.each(function () {
            var $r = $(this);
            if (!$r.find('.pc-select').is(':checked')) return;
            var pid = $r.attr('data-person-id') || '';
            if (pid) arrPersonIds.push(pid);
        });

        if (arrPersonIds.length === 0) {
            edu.system.alert("Không có nhân sự nào được tích chọn để lưu", "w");
            return;
        }

        var common = {
            strRole_Code: edu.system.getValById('ddlPC_New_VaiTro'),
            strNgay_BatDau: edu.system.getValById('txtPC_New_NgayBatDau'),
            strNgay_KetThuc: edu.system.getValById('txtPC_New_NgayKetThuc'),
            dIs_Allowed: $('#chkPC_New_Allowed').is(':checked') ? 1 : 0,
            dIs_Active: $('#chkPC_New_Active').is(':checked') ? 1 : 0,
            strGhiChu: edu.system.getValById('txtPC_New_GhiChu')
        };

        var done = 0, failed = 0, total = arrPersonIds.length;
        var finalize = function () {
            if (done + failed !== total) return;
            edu.system.alert("Đã lưu " + done + "/" + total + (failed ? " (lỗi: " + failed + ")" : ""));
            $("#them-moi-nhansu").modal('hide');
            me.getList_PhanCongNhanSu();
        };

        arrPersonIds.forEach(function (personId) {
            var obj_save = {
                'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeCC8y',
                'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Ins',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
                'strTs_Kh_TuyenSinh_Dot_Id': '',
                'strTs_Kh_Dot_PhuongThuc_Id': '',
                'strRole_Code': common.strRole_Code,
                'strAction_Code': '',
                'strScope_Level_Code': '',
                'strNgay_BatDau': common.strNgay_BatDau,
                'strNgay_KetThuc': common.strNgay_KetThuc,
                'dIs_Allowed': common.dIs_Allowed,
                'dIs_Active': common.dIs_Active,
                'strGhiChu': common.strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'THEM'
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) done++; else failed++;
                    finalize();
                },
                error: function () {
                    failed++;
                    finalize();
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Reset modal Thêm mới kế hoạch đầu ra
    -------------------------------------------*/
    rewrite_DauRa: function () {
        $("#ddlDR_HeDaoTao").html('<option value="">Chọn hệ đào tạo</option>');
        $("#ddlDR_KhoaDaoTao").html('<option value="">Chọn khóa đào tạo</option>');
        $("#tblChuongTrinhDauRa tbody").html("");
        $("#chkDR_SelectAll").prop('checked', false);
        // Reset section "Thông tin chung"
        $('#ddlDR_New_LoaiDauRa, #ddlDR_New_KieuHocTap, #ddlDR_New_TrangThai').val('');
        $('#chkDR_New_HighLight, #chkDR_New_AllowRegister, #chkDR_New_AllowWaitlist, #chkDR_New_AllowTransferIn, #chkDR_New_AutoIntake, #chkDR_New_AutoEnrollment, #chkDR_New_AutoClassAssign, #chkDR_New_Public').prop('checked', false);
        $('#chkDR_New_Active').prop('checked', true);
    },

    /*------------------------------------------
    -- [Shared] KHCT_HeDaoTao/LayDanhSach
    -------------------------------------------*/
    getList_HeDaoTao_DR: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHeDaoTao_DR = edu.util.checkValue(data.Data) ? data.Data : [];
                    var obj = {
                        data: me.dtHeDaoTao_DR,
                        renderInfor: { id: "ID", parentId: "", name: "TENHEDAOTAO" },
                        renderPlace: ['ddlDR_HeDaoTao'],
                        title: "Chọn hệ đào tạo"
                    };
                    edu.system.loadToCombo_data(obj);
                }
            },
            error: function () { },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': '',
                'strDaoTao_HinhThucDaoTao_Id': '',
                'strDaoTao_BacDaoTao_Id': '',
                'strNguoiThucHien_Id': '',
                'pageIndex': 1,
                'pageSize': 100000000
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- [Shared] KHCT_KhoaDaoTao/LayDanhSach (cascading từ Hệ)
    -------------------------------------------*/
    getList_KhoaDaoTao_DR: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoaDaoTao_DR = edu.util.checkValue(data.Data) ? data.Data : [];
                    var obj = {
                        data: me.dtKhoaDaoTao_DR,
                        renderInfor: { id: "ID", parentId: "", name: "TENKHOA" },
                        renderPlace: ['ddlDR_KhoaDaoTao'],
                        title: "Chọn khóa đào tạo"
                    };
                    edu.system.loadToCombo_data(obj);
                }
            },
            error: function () { },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': '',
                'strDaoTao_HeDaoTao_Id': edu.system.getValById('ddlDR_HeDaoTao'),
                'strDaoTao_CoSoDaoTao_Id': '',
                'strNguoiThucHien_Id': '',
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- [Shared] Lấy danh sách chương trình theo Hệ + Khóa
    -- TODO: bạn xác nhận action hash chính xác (đoán: KHCT_ToChucChuongTrinh/LayDanhSach)
    -------------------------------------------*/
    getList_ChuongTrinh_DR: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChuongTrinh_DR = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_ChuongTrinh_DR(me.dtChuongTrinh_DR);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                me.genTable_ChuongTrinh_DR([]);
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': '',
                'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('ddlDR_KhoaDaoTao'),
                'strDaoTao_HeDaoTao_Id': edu.system.getValById('ddlDR_HeDaoTao'),
                'strDaoTao_N_CN_Id': '',
                'strDaoTao_KhoaQuanLy_Id': '',
                'strDaoTao_ToChucCT_Cha_Id': '',
                'strNguoiThucHien_Id': '',
                'pageIndex': 1,
                'pageSize': 100000
            },
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng chương trình với input editable
    -- Cột data API trả (UPPERCASE): MACHUONGTRINH, TENCHUONGTRINH, NGANHTUYENSINH_TEN, DAOTAO_N_CN_TEN
    -- Tham khảo: ApisKeHoachChuongTrinh/.../chuongtrinh.js (genTable_ChuongTrinh)
    -------------------------------------------*/
    genTable_ChuongTrinh_DR: function (data) {
        var $tbody = $("#tblChuongTrinhDauRa tbody");
        $tbody.html("");
        $("#chkDR_SelectAll").prop('checked', false);

        if (!data || data.length === 0) {
            $tbody.append('<tr><td class="td-center" colspan="9">Không có chương trình</td></tr>');
            return;
        }

        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var ctId = d.ID || '';
            rows += '<tr data-ct-id="' + ctId + '">'
                + '<td class="td-center td-fix">' + (i + 1) + '</td>'
                + '<td class="td-left">' + (d.MACHUONGTRINH || '') + '</td>'
                + '<td class="td-left">' + (d.TENCHUONGTRINH || '') + '</td>'
                + '<td class="td-left">' + (d.NGANHTUYENSINH_TEN || '') + '</td>'
                + '<td class="td-left">' + (d.DAOTAO_N_CN_TEN || '') + '</td>'
                + '<td class="td-center"><input type="number" class="form-control ct-chitieu" min="0"></td>'
                + '<td class="td-center"><input type="number" class="form-control ct-chitieu-toida" min="0"></td>'
                + '<td class="td-center"><input type="number" class="form-control ct-chitieu-toithieu" min="0"></td>'
                + '<td class="td-center"><input type="checkbox" class="ct-select"></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Ins
    -- Lưu hàng loạt: mỗi chương trình được tick → 1 lần gọi Insert.
    -- Thông tin chung (Loại đầu ra / Kiểu học / 7 cờ cấu hình / Trạng thái / Public / Hiệu lực)
    -- áp chung cho tất cả các bản ghi. Chỉ tiêu/Tối đa/Tối thiểu lấy theo từng row.
    -------------------------------------------*/
    save_DauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Vui lòng chọn kế hoạch tuyển sinh trước", "w");
            return;
        }

        // Lookup {CT_ID: {ma, ten}} từ cache dtChuongTrinh_DR để auto điền strMa/strTen khi INS
        // (BE không tự lấy từ CT — nếu FE truyền rỗng thì record đầu ra sẽ có MA/TEN null → cột picker "Đổi NV đầu vào" trống)
        var ctMap = {};
        (me.dtChuongTrinh_DR || []).forEach(function (c) {
            if (c.ID) ctMap[c.ID] = { ma: c.MACHUONGTRINH || '', ten: c.TENCHUONGTRINH || '' };
        });

        var arrTasks = [];
        $("#tblChuongTrinhDauRa tbody tr").each(function () {
            var $r = $(this);
            if (!$r.find('.ct-select').is(':checked')) return;
            var ctId = $r.attr('data-ct-id') || '';
            var ct = ctMap[ctId] || { ma: '', ten: '' };
            arrTasks.push({
                'strDaotao_ChuongTrinh_Id': ctId,
                'strMa': ct.ma,
                'strTen': ct.ten,
                'dChi_Tieu': $r.find('.ct-chitieu').val() || '',
                'dChi_Tieu_Toi_Da': $r.find('.ct-chitieu-toida').val() || '',
                'dChi_Tieu_Toi_Thieu': $r.find('.ct-chitieu-toithieu').val() || ''
            });
        });

        if (arrTasks.length === 0) {
            edu.system.alert("Vui lòng tích chọn ít nhất 1 chương trình để tạo đầu ra", "w");
            return;
        }

        var common = {
            strDau_Ra_Type_Code: edu.system.getValById('ddlDR_New_LoaiDauRa'),
            strStudy_Type_Code: edu.system.getValById('ddlDR_New_KieuHocTap'),
            strOutput_Status_Code: edu.system.getValById('ddlDR_New_TrangThai'),
            dIs_HighLight: $('#chkDR_New_HighLight').is(':checked') ? 1 : 0,
            dIs_Allow_Register: $('#chkDR_New_AllowRegister').is(':checked') ? 1 : 0,
            dIs_Allow_Waitlist: $('#chkDR_New_AllowWaitlist').is(':checked') ? 1 : 0,
            dIs_Allow_Transfer_In: $('#chkDR_New_AllowTransferIn').is(':checked') ? 1 : 0,
            dIs_Auto_Intake: $('#chkDR_New_AutoIntake').is(':checked') ? 1 : 0,
            dIs_Auto_Enrollment: $('#chkDR_New_AutoEnrollment').is(':checked') ? 1 : 0,
            dIs_Auto_Class_Assign: $('#chkDR_New_AutoClassAssign').is(':checked') ? 1 : 0,
            dIs_Public: $('#chkDR_New_Public').is(':checked') ? 1 : 0,
            dIs_Active: $('#chkDR_New_Active').is(':checked') ? 1 : 0
        };

        var done = 0, failed = 0, total = arrTasks.length;
        var finalize = function () {
            if (done + failed !== total) return;
            edu.system.alert("Đã thêm " + done + "/" + total + (failed ? " (lỗi: " + failed + ")" : ""));
            $("#them-moi-dau-ra").modal('hide');
            me.getList_KeHoachDauRa();
        };

        arrTasks.forEach(function (task) {
            var obj_save = {
                'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHggvMgPP',
                'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Ins',
                'iM': edu.system.iM,
                'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
                'strTs_Kh_TuyenSinh_Dot_Id': me.strDot_Id_ForDauRa || '',
                'strTs_Kh_Dot_PhuongThuc_Id': '',
                'strMa': task.strMa,
                'strTen': task.strTen,
                'strDau_Ra_Type_Code': common.strDau_Ra_Type_Code,
                'strStudy_Type_Code': common.strStudy_Type_Code,
                'strDaotao_HeDaoTao_Id': '',
                'strDaotao_KhoaDaoTao_Id': '',
                'strDaotao_ChuongTrinh_Id': task.strDaotao_ChuongTrinh_Id,
                'strDaotao_Nganh_Dt_Id': '',
                'strDaotao_Nganh_Ts_Id': '',
                'strTen_HienThi': '',
                'strMa_HienThi': '',
                'strMoTa_HienThi': '',
                'dThu_Tu_HienThi': '',
                'dIs_HighLight': common.dIs_HighLight,
                'dChi_Tieu': task.dChi_Tieu,
                'dChi_Tieu_Toi_Da': task.dChi_Tieu_Toi_Da,
                'dChi_Tieu_Toi_Thieu': task.dChi_Tieu_Toi_Thieu,
                'dIs_Allow_Register': common.dIs_Allow_Register,
                'dIs_Allow_Waitlist': common.dIs_Allow_Waitlist,
                'dIs_Allow_Transfer_In': common.dIs_Allow_Transfer_In,
                'dIs_Auto_Intake': common.dIs_Auto_Intake,
                'dIs_Auto_Enrollment': common.dIs_Auto_Enrollment,
                'dIs_Auto_Class_Assign': common.dIs_Auto_Class_Assign,
                'strOutput_Status_Code': common.strOutput_Status_Code,
                'dIs_Public': common.dIs_Public,
                'dIs_Active': common.dIs_Active,
                'strGhiChu': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'THEM'
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) done++; else failed++;
                    finalize();
                },
                error: function () {
                    failed++;
                    finalize();
                },
                type: 'POST',
                contentType: true,
                action: obj_save.action,
                data: obj_save,
                fakedb: []
            }, false, false, false, null);
        });
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_By_Id
    -- Lấy chi tiết kế hoạch đầu ra theo ID
    -------------------------------------------*/
    getDetail_DauRa: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4DOB4IJQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_By_Id',
            'iM': edu.system.iM,
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = null;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.dtChiTietDauRa = dtResult;
                    me.view_ChiTietDauRa(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Dau_Ra_Get_By_Id: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Dau_Ra_Get_By_Id (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Lấy DM Loại đầu ra (TS.KEHOACH.DAURA.LOAI)
    -------------------------------------------*/
    getList_LoaiDauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = { strMaBangDanhMuc: "TS.KEHOACH.DAURA.LOAI", strTenCotSapXep: "", iTrangThai: 1 };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_LoaiDauRa);
    },
    cbGetList_LoaiDauRa: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtLoaiDauRa = data || [];
        var info = { id: "MA", parentId: "", name: "TEN", code: "MA" };
        edu.system.loadToCombo_data({ data: me.dtLoaiDauRa, renderInfor: info, renderPlace: ['ddlDR_LoaiDauRa'], title: "Chọn loại đầu ra" });
        edu.system.loadToCombo_data({ data: me.dtLoaiDauRa, renderInfor: info, renderPlace: ['ddlDR_New_LoaiDauRa'], title: "Chọn loại đầu ra" });
    },

    /*------------------------------------------
    -- Lấy DM Kiểu học sau khi vào học (TS.KEHOACH.DAURA.KIEUHOC)
    -------------------------------------------*/
    getList_KieuHocTap: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = { strMaBangDanhMuc: "TS.KEHOACH.DAURA.KIEUHOC", strTenCotSapXep: "", iTrangThai: 1 };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_KieuHocTap);
    },
    cbGetList_KieuHocTap: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtKieuHocTap = data || [];
        var info = { id: "MA", parentId: "", name: "TEN", code: "MA" };
        edu.system.loadToCombo_data({ data: me.dtKieuHocTap, renderInfor: info, renderPlace: ['ddlDR_KieuHocTap'], title: "Chọn kiểu học" });
        edu.system.loadToCombo_data({ data: me.dtKieuHocTap, renderInfor: info, renderPlace: ['ddlDR_New_KieuHocTap'], title: "Chọn kiểu học" });
    },

    /*------------------------------------------
    -- Lấy DM Trạng thái đầu ra (TS.KEHOACH.DAURA.TRANGTHAI)
    -------------------------------------------*/
    getList_TrangThaiDauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj = { strMaBangDanhMuc: "TS.KEHOACH.DAURA.TRANGTHAI", strTenCotSapXep: "", iTrangThai: 1 };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_TrangThaiDauRa);
    },
    cbGetList_TrangThaiDauRa: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtTrangThaiDauRa = data || [];
        var info = { id: "MA", parentId: "", name: "TEN", code: "MA" };
        edu.system.loadToCombo_data({ data: me.dtTrangThaiDauRa, renderInfor: info, renderPlace: ['ddlDR_TrangThai'], title: "Chọn trạng thái" });
        edu.system.loadToCombo_data({ data: me.dtTrangThaiDauRa, renderInfor: info, renderPlace: ['ddlDR_New_TrangThai'], title: "Chọn trạng thái" });
    },

    /*------------------------------------------
    -- Đổ data kế hoạch đầu ra vào modal #xem-sua-dau-ra
    -- NOTE: tên cột đoán theo convention list API (Ma, Ten, DAU_RA_TYPE_CODE, ...)
    --       Sửa lại tại đây nếu API trả tên khác.
    -------------------------------------------*/
    view_ChiTietDauRa: function (data) {
        if (!data) return;
        var d = data;

        $('#lblDR_He').text(d.DAOTAO_HEDAOTAO_Ten || d.DAOTAO_HEDAOTAO_TEN || '');
        $('#lblDR_Khoa').text(d.DAOTAO_KHOADAOTAO_Ten || d.DAOTAO_KHOADAOTAO_TEN || '');
        $('#lblDR_ChuongTrinh').text(d.DAOTAO_TOCHUCCHUONGTRINH_Ten || d.DAOTAO_TOCHUCCHUONGTRINH_TEN || '');

        edu.util.viewValById('txtDR_ChiTieu', d.CHI_TIEU || '');
        edu.util.viewValById('txtDR_ChiTieuToiDa', d.CHI_TIEU_TOI_DA || '');
        edu.util.viewValById('txtDR_ChiTieuToiThieu', d.CHI_TIEU_TOI_THIEU || '');

        edu.util.viewValById('txtDR_Ma', d.Ma || d.MA || '');
        edu.util.viewValById('txtDR_Ten', d.Ten || d.TEN || '');
        edu.util.viewValById('txtDR_MaHienThi', d.MA_HIENTHI || '');
        edu.util.viewValById('txtDR_TenHienThi', d.TEN_HIENTHI || '');

        $('#ddlDR_LoaiDauRa').val(d.DAU_RA_TYPE_CODE || '');
        $('#ddlDR_KieuHocTap').val(d.STUDY_TYPE_CODE || '');
        $('#ddlDR_TrangThai').val(d.OUTPUT_STATUS_CODE || '');

        $('#chkDR_HighLight').prop('checked', d.IS_HIGHLIGHT == 1);
        edu.util.viewValById('txtDR_ThuTuHienThi', d.THU_TU_HIENTHI || '');

        $('#chkDR_AllowRegister').prop('checked', d.IS_ALLOW_REGISTER == 1);
        $('#chkDR_AllowWaitlist').prop('checked', d.IS_ALLOW_WAITLIST == 1);
        $('#chkDR_AllowTransferIn').prop('checked', d.IS_ALLOW_TRANSFER_IN == 1);
        $('#chkDR_AutoIntake').prop('checked', d.IS_AUTO_INTAKE == 1);
        $('#chkDR_AutoEnrollment').prop('checked', d.IS_AUTO_ENROLLMENT == 1);
        $('#chkDR_AutoClassAssign').prop('checked', d.IS_AUTO_CLASS_ASSIGN == 1);

        $('#chkDR_Public').prop('checked', d.IS_PUBLIC == 1);
        $('#chkDR_Active').prop('checked', (d.is_active || d.IS_ACTIVE) == 1);
        edu.util.viewValById('txtDR_GhiChu', d.GHICHU || '');
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Upd
    -- Cập nhật kế hoạch đầu ra (Xem-sửa)
    -------------------------------------------*/
    update_DauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strDauRa_Id)) {
            edu.system.alert("Chưa chọn đầu ra để sửa", "w");
            return;
        }

        // Lấy ID Hệ/Khóa/CT/Ngành từ cache (vì label readonly không lưu được trên UI)
        var c = me.dtChiTietDauRa || {};

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHhQxJQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Upd',
            'iM': edu.system.iM,
            'strId': me.strDauRa_Id,
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': c.TS_KH_TUYENSINH_DOT_ID || '',
            'strTs_Kh_Dot_PhuongThuc_Id': c.TS_KH_DOT_PHUONGTHUC_ID || '',
            'strMa': edu.system.getValById('txtDR_Ma'),
            'strTen': edu.system.getValById('txtDR_Ten'),
            'strDau_Ra_Type_Code': edu.system.getValById('ddlDR_LoaiDauRa'),
            'strStudy_Type_Code': edu.system.getValById('ddlDR_KieuHocTap'),
            'strDaotao_HeDaoTao_Id': c.DAOTAO_HEDAOTAO_ID || '',
            'strDaotao_KhoaDaoTao_Id': c.DAOTAO_KHOADAOTAO_ID || '',
            'strDaotao_ChuongTrinh_Id': c.DAOTAO_TOCHUCCHUONGTRINH_ID || c.DAOTAO_CHUONGTRINH_ID || '',
            'strDaotao_Nganh_Dt_Id': c.DAOTAO_NGANH_DT_ID || '',
            'strDaotao_Nganh_Ts_Id': c.DAOTAO_NGANH_TS_ID || '',
            'strTen_HienThi': edu.system.getValById('txtDR_TenHienThi'),
            'strMa_HienThi': edu.system.getValById('txtDR_MaHienThi'),
            'strMoTa_HienThi': c.MOTA_HIENTHI || '',
            'dThu_Tu_HienThi': edu.system.getValById('txtDR_ThuTuHienThi'),
            'dIs_HighLight': $('#chkDR_HighLight').is(':checked') ? 1 : 0,
            'dChi_Tieu': edu.system.getValById('txtDR_ChiTieu'),
            'dChi_Tieu_Toi_Da': edu.system.getValById('txtDR_ChiTieuToiDa'),
            'dChi_Tieu_Toi_Thieu': edu.system.getValById('txtDR_ChiTieuToiThieu'),
            'dIs_Allow_Register': $('#chkDR_AllowRegister').is(':checked') ? 1 : 0,
            'dIs_Allow_Waitlist': $('#chkDR_AllowWaitlist').is(':checked') ? 1 : 0,
            'dIs_Allow_Transfer_In': $('#chkDR_AllowTransferIn').is(':checked') ? 1 : 0,
            'dIs_Auto_Intake': $('#chkDR_AutoIntake').is(':checked') ? 1 : 0,
            'dIs_Auto_Enrollment': $('#chkDR_AutoEnrollment').is(':checked') ? 1 : 0,
            'dIs_Auto_Class_Assign': $('#chkDR_AutoClassAssign').is(':checked') ? 1 : 0,
            'strOutput_Status_Code': edu.system.getValById('ddlDR_TrangThai'),
            'dIs_Public': $('#chkDR_Public').is(':checked') ? 1 : 0,
            'dIs_Active': $('#chkDR_Active').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtDR_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                    $("#xem-sua-dau-ra").modal('hide');
                    me.getList_KeHoachDauRa();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Dau_Ra_Upd: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Dau_Ra_Upd (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Del
    -- Xóa kế hoạch đầu ra theo ID (chỉ nhận strId + audit fields)
    -------------------------------------------*/
    delete_DauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strDauRa_Id)) {
            edu.system.alert("Chưa chọn đầu ra để xóa", "w");
            return;
        }
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgUkLQPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Del',
            'iM': edu.system.iM,
            'strId': me.strDauRa_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                    $("#xem-sua-dau-ra").modal('hide');
                    me.getList_KeHoachDauRa();
                } else {
                    edu.system.alert("Pr_Ts_Kh_Dau_Ra_Del: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Dau_Ra_Del (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds
    -- Lấy danh sách kế hoạch đầu ra theo kế hoạch tuyển sinh
    -------------------------------------------*/
    getList_KeHoachDauRa: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            me.genTable_KeHoachDauRa([]);
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Dau_Ra_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': me.strDot_Id_ForDauRa || '',
            'strTs_Kh_Dot_PhuongThuc_Id': '',
            'strOutput_Status_Code': '',
            'dIs_Public': '',
            'dIs_Active': ''
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtKeHoachDauRa = dtResult;
                    // Enrich mã CT + mã Ngành song song trước khi render (reuse lookup từ picker "Đổi NV")
                    var remaining = 2;
                    var afterAll = function () { if (--remaining === 0) me.genTable_KeHoachDauRa(dtResult); };
                    me._ensureCTMaLookup(dtResult, afterAll);
                    me._ensureNganhMaLookup(afterAll);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Dau_Ra_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Dau_Ra_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng kế hoạch đầu ra
    -- Fallback nhiều casing (MA/Ma, TEN/Ten) + lookup DM local cho Loại đầu ra & Kiểu học
    -- (dtLoaiDauRa, dtKieuHocTap) khi API không join sẵn _Name.
    -------------------------------------------*/
    genTable_KeHoachDauRa: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $("#tblKeHoachDauRa tbody");
        $tbody.html("");

        if (!data || data.length === 0) {
            $tbody.append('<tr><td class="td-center" colspan="21">Không có dữ liệu</td></tr>');
            return;
        }

        var lookupTen = function (arrDM, ma) {
            if (!ma || !arrDM || !arrDM.length) return '';
            for (var j = 0; j < arrDM.length; j++) {
                if (arrDM[j].MA == ma) return arrDM[j].TEN || '';
            }
            return ma;
        };

        var iconCheck = '<i class="fa-solid fa-check color-success font-weight fz18"></i>';
        var iconX = '<i class="fa-solid fa-xmark color-red font-weight fz18"></i>';
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var sMa = d.MA || d.Ma || '';
            var sTen = d.TEN || d.Ten || '';
            var sLoaiDauRa = d.DAU_RA_TYPE_CODE_Name || d.DAU_RA_TYPE_CODE_Ten || lookupTen(me.dtLoaiDauRa, d.DAU_RA_TYPE_CODE);
            var sKieuHoc = d.STUDY_TYPE_CODE_Name || d.STUDY_TYPE_CODE_Ten || lookupTen(me.dtKieuHocTap, d.STUDY_TYPE_CODE);
            var sHe = d.DAOTAO_HEDAOTAO_Ten || d.DAOTAO_HEDAOTAO_TEN || '';
            var sKhoa = d.DAOTAO_KHOADAOTAO_Ten || d.DAOTAO_KHOADAOTAO_TEN || '';
            // Format "TEN (MA)" cho 3 cột — lookup từ me._ctMaLookup / me._nganhMaLookup(ByTen)
            var ctMaMap = me._ctMaLookup || {};
            var nganhMaMap = me._nganhMaLookup || {};
            var nganhMaMapByTen = me._nganhMaLookupByTen || {};
            var lookupNganhMa = function (id, ten) {
                return nganhMaMap[id]
                    || (ten ? nganhMaMapByTen[String(ten).trim().toLowerCase()] : '')
                    || '';
            };
            var fmtTenMa = function (ten, ma) {
                if (ten && ma && ten !== ma) return ten + ' (' + ma + ')';
                return ten || ma || '';
            };
            var ctTen = d.DAOTAO_TOCHUCCHUONGTRINH_Ten || d.DAOTAO_TOCHUCCHUONGTRINH_TEN || '';
            var nganhTsTen = d.DAOTAO_NGANH_TS_Ten || d.DAOTAO_NGANH_TS_TEN || '';
            var nganhDtTen = d.DAOTAO_NGANH_DT_Ten || d.DAOTAO_NGANH_DT_TEN || '';
            var sCT = fmtTenMa(ctTen, ctMaMap[d.DAOTAO_TOCHUCCHUONGTRINH_ID] || '');
            var sNganhTS = fmtTenMa(nganhTsTen, lookupNganhMa(d.DAOTAO_NGANH_TS_ID, nganhTsTen));
            var sNganhDT = fmtTenMa(nganhDtTen, lookupNganhMa(d.DAOTAO_NGANH_DT_ID, nganhDtTen));
            var sActive = (d.is_active || d.IS_ACTIVE) == 1;
            var sNguoiTao = d.NGUOITAO_TaiKhoan || d.NGUOITAO_TEN || d.NGUOI_TAO || d.NguoiTao || '';
            var sNgayTao = d.NgayTao_dd_mm_yyyy_hhmmss || d.NGAY_TAO || d.NgayTao || '';

            rows += '<tr id="row_dr_' + strId + '">'
                + '<td class="td-center td-fix">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sMa + '</td>'
                + '<td class="td-left">' + sTen + '</td>'
                + '<td class="td-left">' + sLoaiDauRa + '</td>'
                + '<td class="td-left">' + sKieuHoc + '</td>'
                + '<td class="td-left">' + sHe + '</td>'
                + '<td class="td-left">' + sKhoa + '</td>'
                + '<td class="td-left">' + sCT + '</td>'
                + '<td class="td-left">' + sNganhTS + '</td>'
                + '<td class="td-left">' + sNganhDT + '</td>'
                + '<td class="td-left">' + (d.TEN_HIENTHI || '') + '</td>'
                + '<td class="td-left">' + (d.MA_HIENTHI || '') + '</td>'
                + '<td class="td-center">' + (d.IS_HIGHLIGHT == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.THU_TU_HIENTHI || '') + '</td>'
                + '<td class="td-center">' + (d.CHI_TIEU || '') + '</td>'
                + '<td class="td-center">' + (d.CHI_TIEU_TOI_DA || '') + '</td>'
                + '<td class="td-center">' + (d.CHI_TIEU_TOI_THIEU || '') + '</td>'
                + '<td class="td-center">' + (sActive ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + sNguoiTao + '</td>'
                + '<td class="td-center">' + sNgayTao + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview btnDetailDauRa" data-id="' + strId + '" style="min-width: 68px !important;" title="Xem chi tiết" data-bs-toggle="modal" data-bs-target="#xem-sua-dau-ra">Chi tiết</a></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Get_By_Id
    -- Lấy chi tiết phân công nhân sự theo ID
    -------------------------------------------*/
    getDetail_PhanCong: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeBiQ1HgM4Hggl',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Get_By_Id',
            'iM': edu.system.iM,
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = null;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.dtChiTietPhanCong = dtResult;
                    me.view_ChiTietPhanCong(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_By_Id: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_By_Id (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đổ data phân công vào modal #xem-sua-phancong (chế độ Xem-sửa)
    -- NOTE: tên cột (FULL_NAME, current_employee_code, role_code, ngay_batdau, ...) đoán theo convention list API.
    --       Nếu API Get_By_Id trả khác thì sửa lại.
    -------------------------------------------*/
    view_ChiTietPhanCong: function (data) {
        if (!data) return;
        var d = data;
        var nhanSuTen = (d.FULL_NAME || '') + (d.current_employee_code ? ' - ' + d.current_employee_code : '');
        $('#lblXS_NhanSu').text(nhanSuTen);

        $('#ddlXS_VaiTro').val(d.role_code || d.ROLE_CODE || '');
        edu.util.viewValById('txtXS_NgayBatDau', d.ngay_batdau || d.NGAY_BATDAU || '');
        edu.util.viewValById('txtXS_NgayKetThuc', d.ngay_ketthuc || d.NGAY_KETTHUC || '');
        edu.util.viewValById('txtXS_GhiChu', d.GHICHU || d.ghichu || '');

        $('#chkXS_Allowed').prop('checked', (d.is_allowed || d.IS_ALLOWED) == 1);
        $('#chkXS_Active').prop('checked', (d.is_active || d.IS_ACTIVE) == 1);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Upd
    -- Cập nhật phân công nhân sự (Xem-sửa)
    -------------------------------------------*/
    update_PhanCong: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        if (!edu.util.checkValue(me.strPhanCong_Id)) {
            edu.system.alert("Chưa chọn phân công để sửa", "w");
            return;
        }

        var personId = '';
        if (me.dtChiTietPhanCong) {
            personId = me.dtChiTietPhanCong.person_id || me.dtChiTietPhanCong.PERSON_ID
                || me.dtChiTietPhanCong.ID_PERSON || '';
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeFDEl',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Upd',
            'iM': edu.system.iM,
            'strId': me.strPhanCong_Id,
            'strPerson_Id': personId,
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': '',
            'strTs_Kh_Dot_PhuongThuc_Id': '',
            'strRole_Code': edu.system.getValById('ddlXS_VaiTro'),
            'strAction_Code': '',
            'strScope_Level_Code': '',
            'strNgay_BatDau': edu.system.getValById('txtXS_NgayBatDau'),
            'strNgay_KetThuc': edu.system.getValById('txtXS_NgayKetThuc'),
            'dIs_Allowed': $('#chkXS_Allowed').is(':checked') ? 1 : 0,
            'dIs_Active': $('#chkXS_Active').is(':checked') ? 1 : 0,
            'strGhiChu': edu.system.getValById('txtXS_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                    $("#xem-sua-phancong").modal('hide');
                    me.getList_PhanCongNhanSu();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Upd: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Upd (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Del
    -- Xóa phân công nhân sự
    -------------------------------------------*/
    delete_PhanCong: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeBSQt',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Del',
            'iM': edu.system.iM,
            'strId': me.strPhanCong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                    $("#xem-sua-phancong").modal('hide');
                    me.strPhanCong_Id = '';
                    me.getList_PhanCongNhanSu();
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Del: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Del (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Get_Ds
    -- Lấy danh sách phân công nhân sự theo kế hoạch
    -------------------------------------------*/
    getList_PhanCongNhanSu: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            me.genTable_PhanCongNhanSu([]);
            return;
        }

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeBiQ1HgUy',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Get_Ds',
            'iM': edu.system.iM,
            'strTs_Kh_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTs_Kh_TuyenSinh_Dot_Id': '',
            'strPerson_Id': '',
            'strRole_Code': '',
            'strAction_Code': '',
            'dIs_Active': ''
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtPhanCongNhanSu = dtResult;
                    me.genTable_PhanCongNhanSu(dtResult);
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Render bảng phân công nhân sự
    -- Cột data: FULL_NAME, current_employee_code, ts_kehoach_tuyensinh_ten,
    --           ts_kehoach_tuyensinh_dot_ten, TS_PHUONGTHUC_TUYENSINH_Ten,
    --           role_code_Name, action_code_Name, scope_level_code_Name,
    --           ngay_batdau, ngay_ketthuc, is_allowed, is_active,
    --           NGUOITAO_TaiKhoan, NgayTao_dd_mm_yyyy_hhmmss
    -------------------------------------------*/
    genTable_PhanCongNhanSu: function (data) {
        var $tbody = $("#tblPhanCongNhanSu tbody");
        $tbody.html("");

        if (!data || data.length === 0) {
            $tbody.append('<tr><td class="td-center" colspan="15">Không có dữ liệu</td></tr>');
            return;
        }

        var iconCheck = '<i class="fa-solid fa-check color-success font-weight fz18"></i>';
        var iconX = '<i class="fa-solid fa-xmark color-red font-weight fz18"></i>';
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var strNhanSu = (d.FULL_NAME || '') + (d.current_employee_code ? ' - ' + d.current_employee_code : '');
            rows += '<tr id="row_pcns_' + strId + '">'
                + '<td class="td-center td-fix">' + (i + 1) + '</td>'
                + '<td class="td-left">' + strNhanSu + '</td>'
                + '<td class="td-left">' + (d.ts_kehoach_tuyensinh_ten || '') + '</td>'
                + '<td class="td-left">' + (d.ts_kehoach_tuyensinh_dot_ten || '') + '</td>'
                + '<td class="td-left">' + (d.TS_PHUONGTHUC_TUYENSINH_Ten || '') + '</td>'
                + '<td class="td-center">' + (d.role_code_Name || '') + '</td>'
                + '<td class="td-center">' + (d.action_code_Name || '') + '</td>'
                + '<td class="td-center">' + (d.scope_level_code_Name || '') + '</td>'
                + '<td class="td-center">' + (d.ngay_batdau || '') + '</td>'
                + '<td class="td-center">' + (d.ngay_ketthuc || '') + '</td>'
                + '<td class="td-center">' + (d.is_allowed == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.is_active == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.NGUOITAO_TaiKhoan || '') + '</td>'
                + '<td class="td-center">' + (d.NgayTao_dd_mm_yyyy_hhmmss || '') + '</td>'
                + '<td class="td-center"><a class="btn btn-default btnview btnDetailPhanCong" data-id="' + strId + '" style="min-width: 68px !important;" title="Xem chi tiết" data-bs-toggle="modal" data-bs-target="#xem-sua-phancong">Chi tiết</a></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Delete
    -- Xóa kế hoạch tuyển sinh
    -------------------------------------------*/
    delete_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;

        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeBSQtJDUk',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KeHoach_TuyenSinh_Delete',
            'iM': edu.system.iM,
            'strId': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                    $("#chi-tiet").modal('hide');
                    me.strKeHoachTuyenSinh_Id = '';
                    me.getList_KeHoachTuyenSinh();
                }
                else {
                    edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Delete: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KeHoach_TuyenSinh_Delete (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*==============================================
    == Đọc dữ liệu từ nguồn API (modal #doc-api-tuyensinh)
    == - Preset 3 nguồn: CMC, UHD, Phenikaa (hardcode client-side như quanlyhosomorong cũ)
    == - Tải cấu trúc API → list cột từ record đầu
    == - Load trường thông tin của KH (TS_DuLieu/LayDSCauHienThiHoSo) làm target
    == - User mapping cột API → target; auto-map fuzzy; lưu localStorage
    == - Import: loop record × field mapped, gọi pkg_TuyenSinh_Import.Import_TS_HoSo_DuLieu_API
    ==============================================*/
    _docAPI_Presets: [
        {
            id: 'CMC',
            ten: 'CMC (Nhap hoc)',
            // Bên CMC (Nguyễn Văn Thái, 09/08) khuyến nghị 15K — hiện ~11K records.
            // FE để 50K làm buffer dài hạn (limit_page_length chỉ là max cap, không force fetch,
            // server vẫn trả về data thực tế 11K nên không tăng tải).
            host: 'https://crm.cmcu.edu.vn/api/resource/Nhaphoc?fields=["*"]&limit_page_length=50000',
            loaiXacThuc: 'Authorization',
            // Frappe/ERPNext: "Authorization: token <api_key>:<api_secret>"
            token: 'token 62e39c71e027e21:edca5904211fb8c',
            keyCol_default: 'mssv',
            // Frappe LIKE partial match: %kw% (encode % thành %25 vì đây là 1 phần URL)
            filterFmt: '&filters=[["mssv","like","%25{kw}%25"]]',
            responseUnwrap: 'data'   // JSON.parse(data.Data).data
        },
        {
            id: 'UHD',
            ten: 'UHD (User admitted)',
            host: 'https://tuyensinh.uhd.edu.vn/api/admission/user-registration/user-admitted',
            loaiXacThuc: 'Authorization',
            token: 'Bearer HaiDuong@2025',
            keyCol_default: 'userId',
            filterFmt: '',
            responseUnwrap: 'data'
        },
        {
            id: 'PHENIKAA',
            ten: 'Phenikaa (HRM profiles)',
            host: 'https://hrm.phenikaa-uni.edu.vn/hrm/api/v1/profiles/apis?page=1&pageSize=100000&username=apis&password=ewdjkl213kSD22k3%40k41JDa',
            loaiXacThuc: '',
            token: '',
            keyCol_default: '',
            filterFmt: '',
            responseUnwrap: 'data.listProfile'   // JSON.parse(data.Data).data.listProfile
        }
    ],
    _docAPI_ApiCols: [],       // list tên cột API (keys record đầu)
    _docAPI_ApiData: [],       // raw records từ API
    _docAPI_TargetCols: [],    // list {ma, ten} — hiện là 77 param của Them_HoSo_TS
    _docAPI_Mapping: {},       // {apiCol: paramName của Them_HoSo_TS}
    _docAPI_KeyCol: '',        // API col dùng làm mã hồ sơ (chỉ để hiển thị preview)
    _docAPI_ImportCancelled: false,
    _docAPI_CurrentPresetId: '',
    _docAPI_DoiTuong: [],      // (deprecated) cache list Đối tượng — không dùng nữa với proc mới

    /*------------------------------------------
    -- 77 param của PKG_CORE_TS_HOSO.Them_HoSo_TS làm target mapping cố định.
    -- Import qua "Đọc từ API" giờ ghi thẳng vào bảng chuẩn hóa (giống Import Excel).
    -------------------------------------------*/
    _docAPI_TargetParams: [
        { ma: 'strCorePerson_HoTen', ten: 'Họ và tên (đầy đủ)' },
        { ma: 'strCorePerson_Ho', ten: 'Họ' },
        { ma: 'strCorePerson_Dem', ten: 'Đệm' },
        { ma: 'strCorePerson_Ten', ten: 'Tên' },
        { ma: 'strCorePerson_NgaySinh', ten: 'Ngày sinh (raw từ API, không format)' },
        { ma: 'dCorePerson_NgayS', ten: 'Ngày sinh - ngày (số)' },
        { ma: 'dCorePerson_ThangS', ten: 'Ngày sinh - tháng (số)' },
        { ma: 'dCorePerson_NamS', ten: 'Ngày sinh - năm (số)' },
        { ma: 'strCorePerson_GioiTinh_Ma', ten: 'Giới tính (Mã/Tên)' },
        { ma: 'strMaSo', ten: 'Mã số (MSSV nội bộ)' },
        { ma: 'strDaoTao_LopQuanLy_DuKien', ten: 'Lớp quản lý dự kiến' },
        { ma: 'strPersonProfile_DanToc_Ma', ten: 'Dân tộc (Mã/Tên)' },
        { ma: 'strPersonProfile_TonGiao_Ma', ten: 'Tôn giáo (Mã/Tên)' },
        { ma: 'strPersonProfile_QuocTich_Ma', ten: 'Quốc tịch (Mã/Tên)' },
        { ma: 'strPersonContact_DienThoai', ten: 'Điện thoại' },
        { ma: 'strPersonContact_Email', ten: 'Email' },
        { ma: 'strPersonIden_SoCCCD', ten: 'Số CCCD' },
        { ma: 'strPersonIden_NgayCap', ten: 'Ngày cấp CCCD' },
        { ma: 'strPersonIden_NoiCap', ten: 'Nơi cấp CCCD' },
        { ma: 'strPersonAddr_NS_Tinh_Ma', ten: 'Nơi sinh - Tỉnh (Mã/Tên)' },
        { ma: 'strPersonAddr_NS_Xa_Ma', ten: 'Nơi sinh - Xã (Mã/Tên)' },
        { ma: 'strPersonAddr_NoiSinh', ten: 'Nơi sinh (text)' },
        { ma: 'strPersonAddr_HK_Tinh_Ma', ten: 'Hộ khẩu - Tỉnh (Mã/Tên)' },
        { ma: 'strPersonAddr_HK_Xa_Ma', ten: 'Hộ khẩu - Xã (Mã/Tên)' },
        { ma: 'strPersonAddr_HK_SoNha', ten: 'Hộ khẩu - Số nhà/Thôn/Xóm' },
        { ma: 'strPersonEdu_Tinh_Ma', ten: 'Tỉnh lớp 12 (Mã/Tên)' },
        { ma: 'strPersonEdu_TruongMaTen', ten: 'Trường lớp 12 (Mã-Tên)' },
        { ma: 'strPersonEdu_HocLuc', ten: 'Học lực lớp 12' },
        { ma: 'strPersonEdu_HanhKiem', ten: 'Hạnh kiểm lớp 12' },
        { ma: 'strPersonFam_Bo_HoTen', ten: 'Bố - Họ tên' },
        { ma: 'dPersonFam_Bo_NamSinh', ten: 'Bố - Năm sinh' },
        { ma: 'strPersonFam_Bo_NoiO', ten: 'Bố - Nơi ở' },
        { ma: 'strPersonFam_Bo_SDT', ten: 'Bố - SĐT' },
        { ma: 'strPersonFam_Me_HoTen', ten: 'Mẹ - Họ tên' },
        { ma: 'dPersonFam_Me_NamSinh', ten: 'Mẹ - Năm sinh' },
        { ma: 'strPersonFam_Me_NoiO', ten: 'Mẹ - Nơi ở' },
        { ma: 'strPersonFam_Me_SDT', ten: 'Mẹ - SĐT' },
        { ma: 'strHoSo_KH_Dot_PT_Ma', ten: 'Phương thức tuyển sinh (Mã/Tên)' },
        { ma: 'strHoSo_DoiTuong_TS_Ma', ten: 'Đối tượng tuyển sinh (Mã/Tên)' },
        { ma: 'strHoSo_DoiTuong_UT_Mas', ten: 'Đối tượng ưu tiên (Mã, có thể nhiều)' },
        { ma: 'strHoSo_KhuVuc_UT_Ma', ten: 'Khu vực ưu tiên (Mã/Tên)' },
        { ma: 'strHoSo_MaHoSo', ten: 'Mã hồ sơ' },
        { ma: 'strHoSo_SoBaoDanh', ten: 'Số báo danh' },
        { ma: 'strHoSo_Import_Batch_Ma', ten: 'Import Batch (Mã)' },
        { ma: 'strMaNganhTrungTuyen', ten: 'Mã ngành trúng tuyển' },
        { ma: 'strMaCTDT', ten: 'Mã CTĐT (nếu ngành TT không duy nhất)' },
        { ma: 'strXetTuyen_TohopMon_Ma', ten: 'Tổ hợp môn (Mã/Tên)' },
        { ma: 'strXetTuyen_TohopMon_Code', ten: 'Tổ hợp môn (code)' },
        { ma: 'strXetTuyen_TohopMon_Ten', ten: 'Tổ hợp môn (tên)' },
        { ma: 'dXetTuyen_DiemUuTien', ten: 'Điểm ưu tiên' },
        { ma: 'dXetTuyen_DiemTongMon', ten: 'Điểm tổng môn' },
        { ma: 'dXetTuyen_DiemTongXT', ten: 'Điểm tổng xét tuyển' },
        { ma: 'strXT_Mon_Data', ten: 'XT Môn Data (JSON)' },
        { ma: 'strKetQua_QuyetDinh_Ma', ten: 'Quyết định trúng tuyển (Mã)' },
        { ma: 'strIntake_IntakeCode', ten: 'Intake code' },
        { ma: 'strIntake_IntakeTypeCode', ten: 'Intake type code' },
        { ma: 'strPersonInvoice_TypeLoai', ten: 'Hóa đơn - Loại' },
        { ma: 'strPersonInvoice_NguoiMua', ten: 'Hóa đơn - Người mua' },
        { ma: 'strPersonInvoice_TenDonVi', ten: 'Hóa đơn - Tên đơn vị' },
        { ma: 'strPersonInvoice_MST', ten: 'Hóa đơn - MST' },
        { ma: 'strPersonInvoice_MaQHNS', ten: 'Hóa đơn - Mã QHNS' },
        { ma: 'strPersonInvoice_SDT', ten: 'Hóa đơn - SĐT' },
        { ma: 'strPersonInvoice_DiaChi', ten: 'Hóa đơn - Địa chỉ' },
        { ma: 'strPersonInvoice_Email', ten: 'Hóa đơn - Email' },
        { ma: 'strPersonBank_HinhThucTT', ten: 'Ngân hàng - Hình thức TT' },
        { ma: 'strPersonBank_TenNganHang', ten: 'Ngân hàng - Tên NH' },
        { ma: 'strPersonBank_SoTaiKhoan', ten: 'Ngân hàng - Số TK' },
        { ma: 'strPersonBank_ChuTaiKhoan', ten: 'Ngân hàng - Chủ TK' },
        { ma: 'strPersonBank_GhiChu', ten: 'Ngân hàng - Ghi chú' },
        { ma: 'strDaoTao_CoSoDaoTao', ten: 'Cơ sở đào tạo (Mã/Tên)' },
        { ma: 'strSoTienNopTruoc', ten: 'Số tiền nộp trước (giữ chỗ)' },
        { ma: 'strExtra_Person_Data', ten: 'Extra Person Data (JSON)' },
        { ma: 'strExtra_HoSo_Data', ten: 'Extra Hồ Sơ Data (JSON)' },
        { ma: 'strExtra_Intake_Data', ten: 'Extra Intake Data (JSON)' }
    ],

    /*------------------------------------------
    -- Alias mapping: tên cột API (CMC/UHD/...) → param của Them_HoSo_TS.
    -- Auto-map ưu tiên tra alias trước, sau đó mới fuzzy match theo tên.
    -------------------------------------------*/
    _docAPI_ColAliases: {
        // CMC (Nhaphoc) — Import proc dùng convention _Ma (BE tự tra cứu ID)
        'hoten': 'strCorePerson_HoTen',
        'dob': 'strCorePerson_NgaySinh',
        'gt': 'strCorePerson_GioiTinh_Ma',
        'dantoc': 'strPersonProfile_DanToc_Ma',
        'quoctich': 'strPersonProfile_QuocTich_Ma',
        'sdt': 'strPersonContact_DienThoai',
        'emailts': 'strPersonContact_Email',
        'emailsv': 'strPersonContact_Email',
        'cccd': 'strPersonIden_SoCCCD',
        'noisinh': 'strPersonAddr_NoiSinh',
        'dc_tinhthanh': 'strPersonAddr_HK_Tinh_Ma',
        'dc_phuongxa': 'strPersonAddr_HK_Xa_Ma',
        'dc_lienlac': 'strPersonAddr_HK_SoNha',
        'truongthpt': 'strPersonEdu_TruongMaTen',
        'tinhthpt': 'strPersonEdu_Tinh_Ma',
        'hocluc_12': 'strPersonEdu_HocLuc',
        'hangkiem_12': 'strPersonEdu_HanhKiem',
        'hotenph_bo': 'strPersonFam_Bo_HoTen',
        'sdtph_bo': 'strPersonFam_Bo_SDT',
        'hotenph_me': 'strPersonFam_Me_HoTen',
        'sdtph_me': 'strPersonFam_Me_SDT',
        'mssv': 'strMaSo',
        'mahoso': 'strHoSo_MaHoSo',
        'sbd': 'strHoSo_SoBaoDanh',
        'phuongthuc_trungtuyen': 'strHoSo_KH_Dot_PT_Ma',
        'dtut': 'strHoSo_DoiTuong_UT_Mas',
        'kvut': 'strHoSo_KhuVuc_UT_Ma',
        'tohop_trungtuyen': 'strXetTuyen_TohopMon_Code',
        'diem_trungtuyen': 'dXetTuyen_DiemTongXT',
        // 2 field IMPORT-only:
        'manganh': 'strMaNganhTrungTuyen',
        'mactdt': 'strMaCTDT',
        // CMC mới bổ sung (chiều 05/08/2026):
        'dc_hoadon': 'strPersonInvoice_DiaChi',
        // CMC field tài chính (sếp bổ sung 06/08/2026):
        'tc_lpgd': 'strSoTienNopTruoc',
        // CMC tên cột NEW song song (sếp confirm 06/08/2026):
        'noptientruoc': 'strSoTienNopTruoc',
        'diachixuathoadon': 'strPersonInvoice_DiaChi',
        // CMC "cosonhaphoc" = Cơ sở nhập học ("Hà Nội" / "Hồ Chí Minh") — chính là Cơ sở đào tạo bên mình
        'cosonhaphoc': 'strDaoTao_CoSoDaoTao',

        // ===== EXPLICIT SKIP (value=null) — các cột CMC KHÔNG map vào target =====
        // Lý do: fuzzy match có thể khớp nhầm (VD 'tennganh' chứa 'tenngan' → mismap vào TenNganHang).
        // Đây là whitelist "biết rõ không map" — an toàn hơn để fuzzy tự do.

        // Tên khoa/ngành/tổ hợp — không có target riêng (nhưng có nguy cơ mismap TenNganHang)
        'tennganh': null,
        'tenkhoa': null,
        'maxettuyen': null,
        'maxettuyengoc': null,        // CMC bổ sung 09/08 — mã xét tuyển gốc theo cơ sở
        'tohop_thpt': null,
        'tohop_hocba': null,
        // Điểm cộng CMC (không có target riêng — đã tính vào tổng)
        'diem_tieuchicong': null,
        'diem_diemcongthanhtich': null,

        // Metadata Frappe/CMC — không dùng cho tuyển sinh mình
        'name': null, 'owner': null, 'creation': null, 'modified': null,
        'modified_by': null, 'docstatus': null, 'idx': null, 'naming_series': null,
        'da_xacthucdinhdanh': null, 'mssv_barcode': null,

        // Thông tin phụ / anh chị em — không có target trong signature IMPORT
        'sdt_khac': null, 'hotenph_anhchi': null, 'sdtph_anhchi': null,
        'nguoinhacmc': null, 'namtotnghiep': null, 'ttnv': null, 'ccnn': null,

        // Public letter (giấy báo online của CMC)
        'public_letter_token': null, 'public_letter_expires_on': null,
        'allow_public_letter': null, 'linkgiaybao': null,

        // Trạng thái nhập học CMC / cơ sở
        'thoigiannhaphoc': null, 'xacnhannhaphoc': null, 'tuvanvien': null,
        'diachinhaphoc': null, 'da_checkin': null,
        'trangthaicheckin': null, 'trangthaichupanh': null, 'trangthaihoso': null,
        'trangthaiquatang': null, 'trangthaidongtien': null, 'trangthailaptop': null,
        'trangthaifaceid': null, 'trangthaidvsv': null, 'trangthaikhaosat': null,

        // Điểm chi tiết môn (không có target riêng — chỉ giữ diem_trungtuyen)
        'diem_dgnl': null, 'diem_tuyenthang': null, 'diem_thpt': null, 'diem_hocba': null,
        'thpt_to': null, 'thpt_li': null, 'thpt_si': null, 'thpt_di': null,
        'thpt_cncn': null, 'thpt_th': null, 'thpt_va': null, 'thpt_ho': null,
        'thpt_su': null, 'thpt_kt': null, 'thpt_cnnn': null, 'thpt_nn': null,
        'hb_to': null, 'hb_li': null, 'hb_si': null, 'hb_di': null,
        'hb_cncn': null, 'hb_ti': null, 'hb_va': null, 'hb_ho': null,
        'hb_su': null, 'hb_ktpl': null, 'hb_cnnn': null, 'hb_nn': null,

        // Tài chính chi tiết CMC — chỉ giữ tc_lpgd (đã map vào strSoTienNopTruoc)
        'tc_hocphi': null, 'tc_ndck': null, 'tc_link_ndck': null,
        'tc_ksk': null, 'tc_bhyt': null, 'tc_hbud_giatri': null, 'tc_qs': null,
        'tc_tongtien': null, 'tc_hbud': null, 'tc_gdtc': null,
        'base_total': null, 'tc_tienconlai': null,

        // Trạng thái CTSV / nội bộ CMC (không import vào tuyển sinh)
        'ctsv_mabhyt': null, 'ctsv_ngaynhaphoc': null, 'ctsv_ngaydongbhyt': null,
        'ctsv_sohoso': null, 'ctsv_ngayhetbhyt': null, 'ctsv_sohoso_tichluy': null,
        'ctsv_hieulucbhyt': null, 'ctsv_gbnh': null, 'ctsv_gcnkqt': null,
        'ctsv_gcnnvqs': null, 'ctsv_ggtnvqs': null, 'ctsv_sodoandang': null,
        'ctsv_ddcd': null, 'ctsv_btnthpt': null, 'ctsv_hocba': null, 'ctsv_gks': null,
        'nh_gcntn': null, 'ctsv_gtkhac': null, 'ctsv_ngayvaodoan': null,
        'ctsv_ngayvaodang': null, 'ctsv_thett': null, 'ctsv_nhatro': null,
        'ctsv_xnsinhvien': null, 'ctsv_tvvayvon': null, 'dbcl_khaosattsv': null,
        'mc_laptop': null, 'mc_henlaptop': null, 'mc_quasinhvien': null,
        'dhs_faceid': null, 'tadv_diem': null, 'tadv_phanloai': null,
        'tadv_ngaythi': null, 'tadv_ghichu': null,

        // Ảnh — không import
        'anh_dai_dien': null, 'anh_dai_dien_goc': null,
        // Dots — không rõ nghĩa, để null
        'dots': null
    },

    initDocAPI_Bindings: function () {
        var me = this;

        // Load preset combo lần đầu khi trang init (không phụ thuộc modal)
        me.docAPI_LoadPresets();

        // Show modal → reset UI + populate preset + load config từ localStorage (nếu có)
        $("#doc-api-tuyensinh").on('show.bs.modal', function () {
            me.docAPI_ResetView();
            // Auto-pick preset theo hostname nếu chưa chọn
            if (!$('#ddlDocAPI_Preset').val()) {
                var host = (edu.system.strhost || '').toLowerCase();
                if (host.indexOf('103.159.50.116') !== -1) $('#ddlDocAPI_Preset').val('UHD').trigger('change');
                else if (host.indexOf('phenikaa-uni.edu.vn') !== -1) $('#ddlDocAPI_Preset').val('PHENIKAA').trigger('change');
                else $('#ddlDocAPI_Preset').val('CMC').trigger('change');
            } else {
                $('#ddlDocAPI_Preset').trigger('change');
            }
            // Load combo Đợt theo KH đang mở (Đối tượng không cần cho proc Them_HoSo_TS,
            // user tự map cột API vào strHoSo_DoiTuong_TS_Id nếu có)
            me.docAPI_LoadDotCombo();
            // Cơ sở đào tạo — data thật lấy qua proc `pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao`
            // (giống chuongtrinh.js:953, lophoc.js:946). DM `KHCT.COSODAOTAO` trên CMC trả rỗng
            // → dùng proc business. Share cache với Import Excel.
            me.loadCoSoDaoTao_ToSelect('#ddlDocAPI_CoSoDaoTao');
        });

        $("#ddlDocAPI_Preset").on('change', function () {
            var preset = me._getDocAPI_Preset($(this).val());
            $('#docAPI_PresetHint').html(preset
                ? '<b>Host:</b> <code>' + preset.host + '</code>'
                : '');
        });

        $("#btnDocAPI_Fetch").click(function () {
            me.docAPI_FetchAll();
        });

        $("#txtDocAPI_Keyword").keypress(function (e) {
            if (e.which === 13) { e.preventDefault(); me.docAPI_FetchAll(); }
        });

        // Ẩn Auto-map (2026-08-09) — UI đã comment ở HTML; hàm docAPI_AutoMap giữ nguyên để mở lại nếu cần.
        // $("#btnDocAPI_AutoMap").click(function () { me.docAPI_AutoMap(); });
        $("#btnDocAPI_ClearMap").click(function () { me.docAPI_ClearMapping(); });
        $("#btnDocAPI_SaveMap").click(function () { me.docAPI_SaveMapping(true); });

        // Update mapping state khi user đổi select — dùng DEBOUNCED để tránh render preview
        // 11K row mỗi lần chọn 1 dropdown (freeze browser).
        $("#tblDocAPI_Mapping").on('change', 'select.docAPI-map-sel', function () {
            var apiCol = $(this).attr('data-apicol');
            me._docAPI_Mapping[apiCol] = $(this).val() || '';
            me.docAPI_RefreshPreview_Debounced();
        });
        $("#tblDocAPI_Mapping").on('input', 'input.docAPI-map-input', function () {
            var apiCol = $(this).attr('data-apicol');
            var v = ($(this).val() || '').trim();
            if (v) me._docAPI_Mapping[apiCol] = v;
            else delete me._docAPI_Mapping[apiCol];
            me.docAPI_RefreshPreview_Debounced();
        });
        $("#ddlDocAPI_KeyCol").on('change', function () {
            me._docAPI_KeyCol = $(this).val() || '';
            me.docAPI_RefreshPreview_Debounced();
        });

        // Select all preview — set flag → import dùng toàn bộ filteredIdx (không chỉ trang hiện tại).
        // Đồng thời tick TẤT CẢ checkbox visible + populate ManualPicks với toàn bộ filteredIdx để
        // trạng thái tick nhất quán khi chuyển trang.
        $("#chkDocAPI_SelectAll").click(function () {
            var checked = $(this).is(':checked');
            $('#tblDocAPI_Preview tbody .docAPI-sel').prop('checked', checked);
            me._docAPI_SelectedAll = checked;
            if (checked) {
                var filteredIdx = me._docAPI_getFilteredIdx();
                me._docAPI_ManualPicks = {};
                for (var i = 0; i < filteredIdx.length; i++) me._docAPI_ManualPicks[filteredIdx[i]] = true;
            } else {
                me._docAPI_ManualPicks = {};
            }
            me._docAPI_RenderPager(
                me._docAPI_getFilteredIdx().length,
                Math.max(1, Math.ceil(me._docAPI_getFilteredIdx().length / me._docAPI_PAGE_SIZE)),
                me._docAPI_currentPage, 0, 0
            );
        });
        // Individual checkbox: sync ManualPicks + tắt flag SelectAll khi bỏ tick 1 dòng
        $("#tblDocAPI_Preview").on('change', '.docAPI-sel', function () {
            var idx = parseInt($(this).attr('data-idx'), 10);
            if (isNaN(idx)) return;
            if ($(this).is(':checked')) {
                me._docAPI_ManualPicks[idx] = true;
            } else {
                delete me._docAPI_ManualPicks[idx];
                if (me._docAPI_SelectedAll) {
                    me._docAPI_SelectedAll = false;
                    $('#chkDocAPI_SelectAll').prop('checked', false);
                }
            }
            me._docAPI_RenderPager(
                me._docAPI_getFilteredIdx().length,
                Math.max(1, Math.ceil(me._docAPI_getFilteredIdx().length / me._docAPI_PAGE_SIZE)),
                me._docAPI_currentPage, 0, 0
            );
        });

        // Pagination buttons — dùng _docAPI_GoPage(delta, absolute)
        $("#btnDocAPI_PageFirst").click(function () { me._docAPI_GoPage(1, true); });
        $("#btnDocAPI_PagePrev").click(function () { me._docAPI_GoPage(-1, false); });
        $("#btnDocAPI_PageNext").click(function () { me._docAPI_GoPage(1, false); });
        $("#btnDocAPI_PageLast").click(function () { me._docAPI_GoPage(999999, false); });
        $("#txtDocAPI_PageJump").on('change', function () {
            var n = parseInt($(this).val(), 10);
            if (!isNaN(n) && n >= 1) me._docAPI_GoPage(n, true);
            else $(this).val(me._docAPI_currentPage + 1);
        });
        $("#ddlDocAPI_PageSize").on('change', function () {
            var n = parseInt($(this).val(), 10);
            if (!isNaN(n) && n > 0) {
                me._docAPI_PAGE_SIZE = n;
                me._docAPI_currentPage = 0;   // đổi page size → về trang 1
                me.docAPI_RefreshPreview();
            }
        });

        $("#btnDocAPI_StartImport").click(function () { me.docAPI_StartImport(); });
        $("#btnDocAPI_CancelImport").click(function () { me._docAPI_ImportCancelled = true; });
        $("#btnDocAPI_ExportExcel").click(function () { me.docAPI_ExportToExcel(); });

        // Filter client-side: mỗi lần user gõ → debounce refresh preview theo keyword.
        // Filter đổi → về trang 1; giữ ManualPicks (user có thể lọc + tick dần nhiều nhóm).
        $("#txtDocAPI_FilterPreview").on('input', function () {
            me._docAPI_FilterKeyword = ($(this).val() || '').trim().toLowerCase();
            me._docAPI_currentPage = 0;
            me.docAPI_RefreshPreview_Debounced();
        });
        $("#btnDocAPI_ShowErrors").click(function (e) { e.preventDefault(); me.docAPI_RenderErrorsPanel(); $('#docAPI_ErrorsPanel').removeClass('d-none'); });
        $("#btnDocAPI_HideErrors").click(function (e) { e.preventDefault(); $('#docAPI_ErrorsPanel').addClass('d-none'); });
        $("#btnDocAPI_ExportErrors").click(function (e) { e.preventDefault(); me.docAPI_ExportErrorsToExcel(); });
    },

    docAPI_LoadPresets: function () {
        var me = this;
        var $sel = $('#ddlDocAPI_Preset');
        $sel.empty().append('<option value="">-- Chọn nguồn --</option>');
        // Filter theo domain hiện tại:
        //   - CMC preset CHỈ hiện khi domain là iu.cmcu.edu.vn (tránh trường khác ăn nhầm API của CMC)
        //   - UHD & Phenikaa: tạm ẩn hết (yêu cầu sếp 10/08/2026)
        // Reference: rule "ẩn UI thì comment code, đừng xóa" — dữ liệu preset vẫn giữ ở _docAPI_Presets
        // để bật lại nhanh khi cần; chỉ filter ở tầng render.
        var host = (window.location && window.location.hostname || '').toLowerCase();
        var isCmcDomain = host.indexOf('cmcu.edu.vn') !== -1;
        me._docAPI_Presets.forEach(function (p) {
            var show = false;
            if (p.id === 'CMC') show = isCmcDomain;
            // if (p.id === 'UHD') show = ...;         // tạm ẩn
            // if (p.id === 'PHENIKAA') show = ...;    // tạm ẩn
            if (show) $sel.append('<option value="' + p.id + '">' + p.ten + '</option>');
        });
    },

    _docAPI_esc: function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    _getDocAPI_Preset: function (id) {
        var me = this;
        if (!id) return null;
        for (var i = 0; i < me._docAPI_Presets.length; i++) {
            if (me._docAPI_Presets[i].id === id) return me._docAPI_Presets[i];
        }
        return null;
    },

    docAPI_ResetView: function () {
        var me = this;
        me._docAPI_ApiCols = [];
        me._docAPI_ApiData = [];
        me._docAPI_Mapping = {};
        me._docAPI_KeyCol = '';
        me._docAPI_ImportCancelled = false;
        me._docAPI_FilterKeyword = '';   // reset filter client-side
        me._docAPI_SelectedAll = false;
        me._docAPI_ManualPicks = {};     // reset picks tay
        me._docAPI_currentPage = 0;
        $('#txtDocAPI_Keyword').val('');
        $('#txtDocAPI_FilterPreview').val('');
        $('#lblDocAPI_FilterInfo').text('');
        $('#lblDocAPI_FetchInfo').text('');
        $('#docAPI_MapWrap, #docAPI_ImportWrap').addClass('d-none');
        $('#tblDocAPI_Mapping tbody, #tblDocAPI_Preview tbody').html('');
        $('#lblDocAPI_ApiColCount, #lblDocAPI_TargetColCount, #lblDocAPI_RowCount').text('0');
        $('#docAPI_ProgressWrap').addClass('d-none');
        $('#lblDocAPI_Progress').text('0 / 0');
        $('#lblDocAPI_OK, #lblDocAPI_Err').text('0');
        $('#docAPI_ProgressBar').css('width', '0%').text('0%');
        $('#btnDocAPI_CancelImport').addClass('d-none');
        $('#btnDocAPI_StartImport').prop('disabled', false);
    },

    /*------------------------------------------
    -- Load combo Đợt từ me.dtDotTuyenSinh (đã load ở modal Đợt).
    -- Auto-preselect nếu mở từ context Đợt cụ thể (me.strDot_Id_ForKQ).
    -------------------------------------------*/
    docAPI_LoadDotCombo: function () {
        var me = this;
        var $sel = $('#ddlDocAPI_Dot');
        $sel.empty().append('<option value="">-- Chọn đợt --</option>');
        (me.dtDotTuyenSinh || []).forEach(function (d) {
            var id = d.ID || d.Id || d.id || '';
            var ma = d.MA || d.Ma || '';
            var ten = d.TEN || d.Ten || '';
            if (id) $sel.append('<option value="' + id + '">' + (ma ? '[' + ma + '] ' : '') + ten + '</option>');
        });
        if (me.strDot_Id_ForKQ) $sel.val(me.strDot_Id_ForKQ);
    },

    /*------------------------------------------
    -- Load combo Cơ sở đào tạo từ proc business `pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao`.
    -- Pattern copy từ chuongtrinh.js:953. DM `KHCT.COSODAOTAO` trả rỗng ở CMC nên phải dùng proc này.
    -- Cache data — DM không đổi trong session, tránh call lặp mỗi lần mở modal.
    -- Dùng cho cả dropdown "Đọc từ API" và "Import Excel" (share cache).
    -- Param: selector — string jQuery selector của <select> cần populate (VD '#ddlDocAPI_CoSoDaoTao').
    -------------------------------------------*/
    loadCoSoDaoTao_ToSelect: function (selector) {
        var me = this;
        if (!selector) return;
        // Đã có cache → render ngay, không call API
        if (me._dtCoSoDaoTao_Cache && me._dtCoSoDaoTao_Cache.length) {
            me._renderCoSoDaoTao_ToSelect(selector, me._dtCoSoDaoTao_Cache);
            return;
        }
        // Đang có request pending → subscribe vào list callback, tránh call trùng khi mở nhiều modal
        if (me._dtCoSoDaoTao_Loading) {
            (me._dtCoSoDaoTao_Waiters = me._dtCoSoDaoTao_Waiters || []).push(selector);
            return;
        }
        me._dtCoSoDaoTao_Loading = true;
        me._dtCoSoDaoTao_Waiters = [selector];
        edu.system.makeRequest({
            success: function (data) {
                me._dtCoSoDaoTao_Loading = false;
                if (data && data.Success) {
                    var arr = Array.isArray(data.Data) ? data.Data : [];
                    me._dtCoSoDaoTao_Cache = arr;
                    (me._dtCoSoDaoTao_Waiters || []).forEach(function (sel) {
                        me._renderCoSoDaoTao_ToSelect(sel, arr);
                    });
                    me._dtCoSoDaoTao_Waiters = [];
                } else {
                    kqdkNoLog('[CSDT] LayDSDaoTao_CoSoDaoTao lỗi:', data && data.Message);
                }
            },
            error: function (er) {
                me._dtCoSoDaoTao_Loading = false;
                kqdkNoLog('[CSDT] LayDSDaoTao_CoSoDaoTao network err:', er);
            },
            type: "POST",
            contentType: true,
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
            data: {
                'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
                'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
                'iM': edu.system.iM,
                'strTuKhoa': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'pageIndex': 1,
                'pageSize': 100000
            }
        }, false, false, false, null);
    },

    _renderCoSoDaoTao_ToSelect: function (selector, arr) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $sel = $(selector);
        if (!$sel.length) return;
        $sel.empty().append('<option value="">-- Chọn cơ sở đào tạo --</option>');
        (arr || []).forEach(function (d) {
            var id = d.ID || d.Id || d.id || '';
            var ma = d.MA || d.Ma || '';
            var ten = d.TEN || d.Ten || ma;
            if (id) $sel.append('<option value="' + id + '">' + ten + (ma && ma !== ten ? ' [' + ma + ']' : '') + '</option>');
        });
        // Chỉ dropdown của form Khai mới dùng select2 (2 dropdown còn lại thuộc modal Import/Đọc API
        // nên giữ native — _applyKQSelect2 neo dropdownParent vào #ket-qua-dk).
        if (selector === '#ddlKQ_CoSoDaoTao') me._reapplyKQSelect2('ddlKQ_CoSoDaoTao');
    },

    /*------------------------------------------
    -- Load combo Đối tượng dự tuyển từ danh mục master data "TS.DOITUONGDUTUYEN".
    -- App mới không dùng endpoint TS_Dot_DoiTuong/LayDSTS_DoiTuong (chỉ trả các
    -- đối tượng đã link vào Đợt) — thay bằng master data giống form Khai trực tiếp
    -- (kehoachtuyensinhnew.js:1456). Data luôn có, không phụ thuộc KH config.
    -------------------------------------------*/
    docAPI_LoadDoiTuongCombo: function () {
        var me = this;
        var $sel = $('#ddlDocAPI_DoiTuong');
        $sel.empty().append('<option value="">-- Chọn đối tượng --</option>');
        $('#docAPI_DoiTuongHint').remove();
        // Dùng helper getList_DanhMucDulieu để tự populate select (native, không select2).
        var obj = {
            strMaBangDanhMuc: 'TS.DOITUONGDUTUYEN',
            strTenCotSapXep: '',
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, '', '', function (data) {
            var arr = Array.isArray(data) ? data : [];
            me._docAPI_DoiTuong = arr;
            arr.forEach(function (d) {
                var id = d.MA || d.ID || d.Id || '';
                var ten = d.TEN || d.Ten || id;
                if (id) $sel.append('<option value="' + id + '">' + ten + (d.MA && d.TEN ? ' [' + d.MA + ']' : '') + '</option>');
            });
            if (arr.length === 0) {
                $sel.empty().append('<option value="">(Không có đối tượng — sẽ để trống)</option>');
                $sel.after(
                    '<div id="docAPI_DoiTuongHint" class="fz12 mt-5" '
                    + 'style="color:#d97706;"><i class="fa-regular fa-triangle-exclamation"></i> '
                    + 'Danh mục "TS.DOITUONGDUTUYEN" trống.</div>'
                );
            }
        });
    },

    /*------------------------------------------
    -- Tải song song: (1) cấu trúc API bên ngoài, (2) trường thông tin của KH
    -- Cả hai xong → render mapping table + preview + auto-load config đã lưu
    -------------------------------------------*/
    docAPI_FetchAll: function () {
        var me = this;
        var presetId = $('#ddlDocAPI_Preset').val();
        var preset = me._getDocAPI_Preset(presetId);
        if (!preset) { edu.system.alert("Vui lòng chọn nguồn API", "w"); return; }
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Chưa xác định kế hoạch tuyển sinh (mở lại modal Đợt từ danh sách KH)", "w");
            return;
        }
        var strDotId = $('#ddlDocAPI_Dot').val() || '';
        if (!strDotId) {
            edu.system.alert("Vui lòng chọn Đợt tuyển sinh trước khi tải cấu trúc", "w");
            return;
        }
        me._docAPI_CurrentPresetId = presetId;
        $('#lblDocAPI_FetchInfo').html('<i class="fa fa-spinner fa-spin"></i> Đang tải...');

        var doneApi = false, doneTarget = false;
        function tryFinalize() {
            if (!doneApi || !doneTarget) return;
            $('#lblDocAPI_FetchInfo').text(
                'Đã tải ' + me._docAPI_ApiData.length + ' bản ghi API, '
                + me._docAPI_TargetCols.length + ' trường thông tin.');
            me.docAPI_RenderMapping();
            me.docAPI_LoadMapping();     // apply mapping đã lưu (nếu có)
            me.docAPI_RefreshPreview();
            $('#docAPI_MapWrap, #docAPI_ImportWrap').removeClass('d-none');
        }

        me.docAPI_FetchApiStructure(preset, function (ok) {
            doneApi = true;
            if (!ok) $('#lblDocAPI_FetchInfo').html('<span style="color:#dc2626">Không tải được dữ liệu API</span>');
            tryFinalize();
        });
        me.docAPI_FetchTargetCols(function () {
            doneTarget = true;
            tryFinalize();
        });
    },

    docAPI_FetchApiStructure: function (preset, cb) {
        var me = this;
        var kw = (edu.util.getValById('txtDocAPI_Keyword') || '').trim();
        var host = preset.host;
        if (kw && preset.filterFmt) {
            host += preset.filterFmt.replace('{kw}', encodeURIComponent(kw));
        }
        // Áp dụng giới hạn số bản ghi: nếu chọn "Chỉ đọc N" → replace limit_page_length trong URL.
        // Chọn "Toàn bộ" → giữ nguyên limit_page_length gốc (5000000).
        var limitMode = $('input[name="docAPI_LimitMode"]:checked').val() || 'custom';
        if (limitMode === 'custom') {
            var limitN = parseInt(edu.util.getValById('txtDocAPI_Limit'), 10);
            if (limitN > 0) {
                if (/limit_page_length=\d+/.test(host)) {
                    host = host.replace(/limit_page_length=\d+/, 'limit_page_length=' + limitN);
                } else {
                    host += (host.indexOf('?') === -1 ? '?' : '&') + 'limit_page_length=' + limitN;
                }
            }
        }
        kqdkNoLog('%c[docAPI] Fetch URL:', 'color:#7c3aed', host);
        var obj_save = {
            'action': 'CM_UngDung/CustomAPIGet',
            'type': 'POST',
            'strHost': host,
            'strApi': '',
            'strLoaiXacThuc': preset.loaiXacThuc || '',
            'strMaXacThuc': preset.token || '',
            'strData': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert("CustomAPIGet: " + data.Message, "w");
                    return cb(false);
                }
                var parsed = null;
                try { parsed = JSON.parse(data.Data); } catch (ex) {
                    edu.system.alert("Response API không phải JSON hợp lệ", "w");
                    return cb(false);
                }
                // Bóc theo path responseUnwrap ('data' hay 'data.listProfile')
                var records = parsed;
                (preset.responseUnwrap || '').split('.').forEach(function (k) {
                    if (records && k) records = records[k];
                });
                if (!Array.isArray(records)) records = [];
                me._docAPI_ApiData = records;
                me._docAPI_ApiCols = records.length ? Object.keys(records[0]) : [];
                // Set keyCol mặc định theo preset nếu có
                me._docAPI_KeyCol = preset.keyCol_default && me._docAPI_ApiCols.indexOf(preset.keyCol_default) !== -1
                    ? preset.keyCol_default
                    : (me._docAPI_ApiCols[0] || '');
                cb(true);
            },
            error: function (er) {
                edu.system.alert("CustomAPIGet (er): " + JSON.stringify(er), "w");
                cb(false);
            },
            type: 'POST', contentType: true,
            action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    docAPI_FetchTargetCols: function (cb) {
        var me = this;
        // Target list = 77 param của Them_HoSo_TS (hardcode, không cần gọi BE).
        // Import qua "Đọc từ API" ghi thẳng vào bảng chuẩn hóa giống Import Excel.
        me._docAPI_TargetCols = me._docAPI_TargetParams.slice();
        cb();
    },

    docAPI_RenderMapping: function () {
        var me = this;
        $('#lblDocAPI_ApiColCount').text(me._docAPI_ApiCols.length);
        $('#lblDocAPI_TargetColCount').text(me._docAPI_TargetCols.length);
        $('#lblDocAPI_RowCount').text(me._docAPI_ApiData.length);

        // Combo cột định danh HS = các cột API
        var $keySel = $('#ddlDocAPI_KeyCol');
        $keySel.empty();
        me._docAPI_ApiCols.forEach(function (c) {
            $keySel.append('<option value="' + edu.util.returnEmpty(c) + '">' + edu.util.returnEmpty(c) + '</option>');
        });
        if (me._docAPI_KeyCol) $keySel.val(me._docAPI_KeyCol);

        // Fallback C: nếu target list rỗng → dùng input text để user tự gõ mã
        var useInputFallback = me._docAPI_TargetCols.length === 0;
        var optsTarget = '';
        if (!useInputFallback) {
            optsTarget = '<option value="">-- Bỏ qua --</option>';
            me._docAPI_TargetCols.forEach(function (t) {
                optsTarget += '<option value="' + edu.util.returnEmpty(t.ma) + '">'
                    + edu.util.returnEmpty(t.ten) + ' [' + edu.util.returnEmpty(t.ma) + ']</option>';
            });
        }

        // Xóa div pagination cũ nếu còn tồn tại (từ v68/v69 đã revert)
        $('#docAPI_MapPagination').remove();

        var sample = me._docAPI_ApiData[0] || {};
        var html = '';
        me._docAPI_ApiCols.forEach(function (col, idx) {
            var sv = sample[col];
            if (typeof sv === 'object') sv = JSON.stringify(sv);
            if (sv == null) sv = '';
            sv = String(sv);
            if (sv.length > 80) sv = sv.substring(0, 80) + '…';
            var mapCell;
            if (useInputFallback) {
                mapCell = '<input type="text" class="form-control form-control-sm docAPI-map-input" '
                    + 'data-apicol="' + edu.util.returnEmpty(col) + '" '
                    + 'placeholder="Gõ mã trường thông tin (để trống = bỏ qua)">';
            } else {
                mapCell = '<select class="form-select form-select-sm docAPI-map-sel" data-apicol="'
                    + edu.util.returnEmpty(col) + '">' + optsTarget + '</select>';
            }
            html += '<tr>'
                + '<td class="td-center">' + (idx + 1) + '</td>'
                + '<td><b>' + edu.util.returnEmpty(col) + '</b></td>'
                + '<td><span style="color:#64748b;">' + me._docAPI_esc(sv) + '</span></td>'
                + '<td>' + mapCell + '</td>'
                + '</tr>';
        });
        if (!html) html = '<tr><td colspan="4" class="td-center text-muted" style="padding:16px;">Không có cột nào từ API</td></tr>';
        $('#tblDocAPI_Mapping tbody').html(html);

        // Restore value cho các select/input theo _docAPI_Mapping đã có (auto-map / localStorage)
        Object.keys(me._docAPI_Mapping).forEach(function (col) {
            var v = me._docAPI_Mapping[col];
            if (!v) return;
            var $sel = $('#tblDocAPI_Mapping select.docAPI-map-sel[data-apicol="' + col + '"]');
            var $inp = $('#tblDocAPI_Mapping input.docAPI-map-input[data-apicol="' + col + '"]');
            if ($sel.length) $sel.val(v);
            else if ($inp.length) $inp.val(v);
        });

        // Banner cảnh báo khi rơi vào fallback
        var $mapWrap = $('#docAPI_MapWrap');
        $mapWrap.find('.docAPI-fallback-warn').remove();
        if (useInputFallback && me._docAPI_ApiCols.length) {
            $mapWrap.prepend(
                '<div class="docAPI-fallback-warn alert alert-warning fz13 mb-10" '
                + 'style="background:#fef3c7; border-left:4px solid #f59e0b; padding:8px 12px; border-radius:4px; color:#92400e;">'
                + '<i class="fa-regular fa-triangle-exclamation"></i> '
                + 'KH này chưa có <b>trường thông tin</b> nào — chuyển sang chế độ nhập tay. '
                + 'Gõ mã đích cho cột API cần import (để trống = bỏ qua).'
                + '</div>'
            );
        }
    },

    /*------------------------------------------
    -- Fuzzy auto-map: chuẩn hóa lowercase + bỏ ký tự không phải chữ/số + so sánh
    -- Ưu tiên khớp tuyệt đối, sau đó khớp chứa nhau
    -------------------------------------------*/
    docAPI_AutoMap: function () {
        var me = this;
        if (!me._docAPI_ApiCols.length || !me._docAPI_TargetCols.length) return;
        function norm(s) {
            return String(s || '').toLowerCase()
                .normalize('NFD').replace(/[̀-ͯ]/g, '')  // bỏ dấu tiếng Việt (combining diacritics)
                .replace(/[^a-z0-9]/g, '');
        }
        var MIN_FUZZY_LEN = 5;   // tránh match ngắn kiểu "ho" (Họ) khớp "thptho"/"hbho"
        var targetsNorm = me._docAPI_TargetCols.map(function (t) {
            return { ma: t.ma, nma: norm(t.ma), nten: norm(t.ten) };
        });
        var validTargetMa = {};
        me._docAPI_TargetCols.forEach(function (t) { validTargetMa[t.ma] = 1; });

        // Dedupe: mỗi target chỉ được map bởi 1 cột API (first-come-first-serve)
        // Ưu tiên: alias thắng fuzzy → chạy 2 pass, pass 1 lấy alias trước
        var used = {};   // { targetMa: apiCol }
        var pendingCols = [];

        // Pass 1: alias exact match — priority tuyệt đối
        // NẾU cột có key trong _docAPI_ColAliases (kể cả value null/'') → EXPLICIT DECISION:
        //   - value truthy + target hợp lệ → map
        //   - value null/'' → SKIP fuzzy (không map, không mismap)
        // Chỉ những cột KHÔNG có key alias mới fall xuống pass 2 fuzzy.
        me._docAPI_ApiCols.forEach(function (col) {
            var colLower = String(col || '').toLowerCase();
            if (me._docAPI_ColAliases.hasOwnProperty(colLower)) {
                var alias = me._docAPI_ColAliases[colLower];
                if (alias && validTargetMa[alias] && !used[alias]) {
                    me._docAPI_Mapping[col] = alias;
                    used[alias] = col;
                    $('#tblDocAPI_Mapping select.docAPI-map-sel[data-apicol="' + col + '"]').val(alias);
                }
                // Có key → tôn trọng quyết định (map hoặc skip), không rơi vào fuzzy
                return;
            }
            pendingCols.push(col);
        });

        // Pass 2: fuzzy match cho các cột còn lại
        pendingCols.forEach(function (col) {
            var nc = norm(col);
            if (!nc) return;
            // Ưu tiên: exact mã > mã contains (min length) > exact tên > tên contains (min length)
            var hit = targetsNorm.find(function (t) {
                return !used[t.ma] && t.nma === nc;
            });
            if (!hit) hit = targetsNorm.find(function (t) {
                return !used[t.ma] && t.nma && t.nma.length >= MIN_FUZZY_LEN
                    && (t.nma.indexOf(nc) !== -1 || nc.indexOf(t.nma) !== -1)
                    && Math.min(t.nma.length, nc.length) >= MIN_FUZZY_LEN;
            });
            if (!hit) hit = targetsNorm.find(function (t) {
                return !used[t.ma] && t.nten === nc;
            });
            if (!hit) hit = targetsNorm.find(function (t) {
                return !used[t.ma] && t.nten && t.nten.length >= MIN_FUZZY_LEN
                    && (t.nten.indexOf(nc) !== -1 || nc.indexOf(t.nten) !== -1)
                    && Math.min(t.nten.length, nc.length) >= MIN_FUZZY_LEN;
            });
            if (hit) {
                me._docAPI_Mapping[col] = hit.ma;
                used[hit.ma] = col;
                $('#tblDocAPI_Mapping select.docAPI-map-sel[data-apicol="' + col + '"]').val(hit.ma);
            }
        });
        me.docAPI_RefreshPreview();
    },

    docAPI_ClearMapping: function () {
        var me = this;
        me._docAPI_Mapping = {};
        $('#tblDocAPI_Mapping select.docAPI-map-sel').val('');
        $('#tblDocAPI_Mapping input.docAPI-map-input').val('');
        me.docAPI_RefreshPreview();
    },

    _docAPI_StorageKey: function () {
        var me = this;
        return (edu.system.strChucNang_Id || '') + '_docAPI_'
            + (me._docAPI_CurrentPresetId || '') + '_'
            + (me.strKeHoachTuyenSinh_Id || '');
    },

    docAPI_SaveMapping: function (announce) {
        var me = this;
        // Đọc lại từ DOM để chắc chắn state đúng (bắt cả select và input fallback)
        me._docAPI_Mapping = {};
        $('#tblDocAPI_Mapping select.docAPI-map-sel').each(function () {
            var col = $(this).attr('data-apicol');
            var v = $(this).val() || '';
            if (v) me._docAPI_Mapping[col] = v;
        });
        $('#tblDocAPI_Mapping input.docAPI-map-input').each(function () {
            var col = $(this).attr('data-apicol');
            var v = ($(this).val() || '').trim();
            if (v) me._docAPI_Mapping[col] = v;
        });
        me._docAPI_KeyCol = $('#ddlDocAPI_KeyCol').val() || '';
        try {
            localStorage.setItem(me._docAPI_StorageKey(), JSON.stringify({
                keyCol: me._docAPI_KeyCol,
                mapping: me._docAPI_Mapping,
                savedAt: new Date().toISOString()
            }));
            if (announce) edu.system.alert("Đã lưu cấu hình mapping cho KH này + nguồn API này.");
        } catch (ex) {
            edu.system.alert("Không lưu được vào localStorage: " + ex.message, "w");
        }
    },

    docAPI_LoadMapping: function () {
        var me = this;
        var raw = null;
        try { raw = localStorage.getItem(me._docAPI_StorageKey()); } catch (ex) { return; }
        if (!raw) return;
        var cfg = null;
        try { cfg = JSON.parse(raw); } catch (ex) { return; }
        if (!cfg) return;
        if (cfg.keyCol && me._docAPI_ApiCols.indexOf(cfg.keyCol) !== -1) {
            me._docAPI_KeyCol = cfg.keyCol;
            $('#ddlDocAPI_KeyCol').val(cfg.keyCol);
        }
        // Filter mapping cũ theo alias hiện tại: nếu cột có explicit null alias → SKIP restore
        // (bảo vệ chống mismap cũ đã lưu trong localStorage từ phiên bản trước).
        var oldMapping = cfg.mapping || {};
        var cleanMapping = {};
        var skippedCount = 0;
        Object.keys(oldMapping).forEach(function (col) {
            var colLower = String(col).toLowerCase();
            if (me._docAPI_ColAliases.hasOwnProperty(colLower)
                && me._docAPI_ColAliases[colLower] == null) {
                skippedCount++;
                return;   // explicit skip, không restore
            }
            cleanMapping[col] = oldMapping[col];
        });
        me._docAPI_Mapping = cleanMapping;
        Object.keys(cleanMapping).forEach(function (col) {
            var $sel = $('#tblDocAPI_Mapping select.docAPI-map-sel[data-apicol="' + col + '"]');
            var $inp = $('#tblDocAPI_Mapping input.docAPI-map-input[data-apicol="' + col + '"]');
            if ($sel.length) $sel.val(cleanMapping[col]);
            else if ($inp.length) $inp.val(cleanMapping[col]);
        });
        var msg = ' <span style="color:#059669;">— Đã khôi phục cấu hình đã lưu.</span>';
        if (skippedCount > 0) {
            msg += ' <span style="color:#d97706;">(Đã bỏ qua ' + skippedCount + ' mapping cũ không hợp lệ.)</span>';
        }
        $('#lblDocAPI_FetchInfo').append(msg);
    },

    /*------------------------------------------
    -- Preview: mỗi record → 1 row với các field đã map.
    -- ⚠ Perf: chỉ render tối đa PREVIEW_LIMIT rows đầu (không full 11K) để tránh freeze
    --   khi user đổi mapping. Import khi bấm "Bắt đầu" vẫn chạy TOÀN BỘ records đã tick.
    -- Debounce hook: dùng docAPI_RefreshPreview_Debounced() ở event handler tương tác.
    -- Pagination: mỗi trang render tối đa _docAPI_PAGE_SIZE row (mặc định 200).
    --   _docAPI_currentPage: index trang hiện tại (0-based)
    --   _docAPI_ManualPicks: dict {idx: true} — record đã tick tay, PERSIST khi đổi trang
    --   _docAPI_SelectedAll: cờ "chọn tất cả" — khi TRUE, import dùng toàn bộ filteredIdx
    --     (bỏ qua ManualPicks) để user không phải tick từng trang.
    -------------------------------------------*/
    _docAPI_PAGE_SIZE: 200,
    _docAPI_currentPage: 0,
    _docAPI_ManualPicks: {},

    docAPI_RefreshPreview_Debounced: function () {
        var me = this;
        if (me._docAPI_previewTimer) clearTimeout(me._docAPI_previewTimer);
        me._docAPI_previewTimer = setTimeout(function () { me.docAPI_RefreshPreview(); }, 400);
    },

    /*------------------------------------------
    -- Build danh sách indices sau khi filter theo _docAPI_FilterKeyword.
    -- Nếu không có filter → trả indices [0..total-1] (nguyên bản).
    -- Nếu có filter → quét toàn bộ records, giữ record có bất kỳ field value chứa keyword.
    -------------------------------------------*/
    _docAPI_getFilteredIdx: function () {
        var me = this;
        var kw = (me._docAPI_FilterKeyword || '').trim().toLowerCase();
        var total = me._docAPI_ApiData.length;
        if (!kw) {
            var all = [];
            for (var i = 0; i < total; i++) all.push(i);
            return all;
        }
        var arr = [];
        for (var j = 0; j < total; j++) {
            var rec = me._docAPI_ApiData[j];
            var match = false;
            for (var k in rec) {
                var v = rec[k];
                if (v == null) continue;
                if (String(v).toLowerCase().indexOf(kw) !== -1) { match = true; break; }
            }
            if (match) arr.push(j);
        }
        return arr;
    },

    docAPI_RefreshPreview: function () {
        var me = this;
        var html = '';
        var mappedCols = Object.keys(me._docAPI_Mapping).filter(function (c) { return me._docAPI_Mapping[c]; });
        var total = me._docAPI_ApiData.length;
        var pageSize = me._docAPI_PAGE_SIZE;
        // Filter theo _docAPI_FilterKeyword (client-side)
        var filteredIdx = me._docAPI_getFilteredIdx();
        var filteredTotal = filteredIdx.length;

        // Cập nhật label info filter
        var kw = me._docAPI_FilterKeyword || '';
        if (kw) {
            $('#lblDocAPI_FilterInfo').html('<i class="fa-solid fa-filter"></i> Lọc: ' + filteredTotal + '/' + total);
        } else {
            $('#lblDocAPI_FilterInfo').text('');
        }

        // Clamp trang hiện tại: nếu filter đổi làm total nhỏ đi → về trang cuối hợp lệ
        var totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
        if (me._docAPI_currentPage >= totalPages) me._docAPI_currentPage = totalPages - 1;
        if (me._docAPI_currentPage < 0) me._docAPI_currentPage = 0;
        var page = me._docAPI_currentPage;
        var start = page * pageSize;
        var end = Math.min(start + pageSize, filteredTotal);
        var picks = me._docAPI_ManualPicks || {};
        var selAll = !!me._docAPI_SelectedAll;

        for (var ii = start; ii < end; ii++) {
            var idx = filteredIdx[ii];
            var rec = me._docAPI_ApiData[idx];
            var maHS = me._docAPI_KeyCol ? edu.util.returnEmpty(rec[me._docAPI_KeyCol]) : '';
            var preview = mappedCols.map(function (col) {
                var v = rec[col];
                // ⚠ Phải check null TRƯỚC typeof === 'object' vì typeof null === 'object' trong JS
                // → nếu không, JSON.stringify(null) = "null" (string) sẽ hiện ra dạng text "null".
                if (v == null) {
                    v = '';
                } else if (typeof v === 'object') {
                    v = JSON.stringify(v);
                }
                var s = String(v);
                if (s.length > 40) s = s.substring(0, 40) + '…';
                return '<span style="margin-right:12px;"><b>' + me._docAPI_Mapping[col] + '</b>=' + me._docAPI_esc(s) + '</span>';
            }).join('');
            // Restore trạng thái tick từ ManualPicks (persist qua các trang)
            var isChecked = selAll || !!picks[idx];
            html += '<tr>'
                + '<td class="td-center"><input type="checkbox" class="docAPI-sel" data-idx="' + idx + '"' + (isChecked ? ' checked' : '') + '></td>'
                + '<td class="td-center">' + (idx + 1) + '</td>'
                + '<td>' + me._docAPI_esc(maHS) + '</td>'
                + '<td>' + (preview || '<span style="color:#94a3b8;">(chưa map cột nào)</span>') + '</td>'
                + '<td class="td-center docAPI-status" data-idx="' + idx + '">—</td>'
                + '<td class="docAPI-errmsg" data-idx="' + idx + '"></td>'
                + '</tr>';
        }
        if (!html) html = '<tr><td colspan="6" class="td-center text-muted" style="padding:16px;">Không có bản ghi nào</td></tr>';
        $('#tblDocAPI_Preview tbody').html(html);

        // Header select-all checkbox: reflect state — "checked" khi flag ON hoặc mọi row của trang đều được pick
        var allPageChecked = false;
        if (end > start) {
            allPageChecked = selAll;
            if (!allPageChecked) {
                allPageChecked = true;
                for (var jj = start; jj < end; jj++) {
                    if (!picks[filteredIdx[jj]]) { allPageChecked = false; break; }
                }
            }
        }
        $('#chkDocAPI_SelectAll').prop('checked', allPageChecked);

        // Render pager
        me._docAPI_RenderPager(filteredTotal, totalPages, page, start, end);
    },

    /*------------------------------------------
    -- Cập nhật UI pagination: enable/disable các nút, hiển thị "Trang x/y", "hiển thị a-b/N",
    -- và số record đã pick tay (nếu có).
    -------------------------------------------*/
    _docAPI_RenderPager: function (filteredTotal, totalPages, page, start, end) {
        var me = this;
        $('#txtDocAPI_PageJump').val(page + 1);
        $('#lblDocAPI_PageTotal').text(totalPages);
        var rangeLbl = filteredTotal === 0 ? '0-0' : ((start + 1) + '-' + end);
        $('#lblDocAPI_PageRange').text(rangeLbl);
        $('#lblDocAPI_PageTotalRec').text(filteredTotal);
        var atFirst = page <= 0;
        var atLast = page >= totalPages - 1;
        $('#btnDocAPI_PageFirst, #btnDocAPI_PagePrev').prop('disabled', atFirst);
        $('#btnDocAPI_PageNext, #btnDocAPI_PageLast').prop('disabled', atLast);
        // Hiển thị số record đã tick tay (persist qua các trang)
        var pickCount = 0;
        if (me._docAPI_ManualPicks) {
            for (var k in me._docAPI_ManualPicks) if (me._docAPI_ManualPicks[k]) pickCount++;
        }
        if (me._docAPI_SelectedAll) {
            $('#lblDocAPI_PagePicks').html('<i class="fa-solid fa-check-double"></i> Đã chọn TẤT CẢ ' + filteredTotal + ' bản ghi');
        } else if (pickCount > 0) {
            $('#lblDocAPI_PagePicks').html('<i class="fa-solid fa-check"></i> Đã tick ' + pickCount + ' bản ghi');
        } else {
            $('#lblDocAPI_PagePicks').text('');
        }
    },

    /*------------------------------------------
    -- Chuyển trang: gọi từ handler nút pager. delta = số trang di chuyển; nếu absolute = true
    -- thì delta là số trang (1-based → 0-based).
    -------------------------------------------*/
    _docAPI_GoPage: function (delta, absolute) {
        var me = this;
        var pageSize = me._docAPI_PAGE_SIZE;
        var filteredIdx = me._docAPI_getFilteredIdx();
        var totalPages = Math.max(1, Math.ceil(filteredIdx.length / pageSize));
        var next;
        if (absolute) next = delta - 1; else next = me._docAPI_currentPage + delta;
        if (next < 0) next = 0;
        if (next > totalPages - 1) next = totalPages - 1;
        if (next === me._docAPI_currentPage) return;
        me._docAPI_currentPage = next;
        me.docAPI_RefreshPreview();
    },

    /*------------------------------------------
    -- Import: mỗi record checked → build 1 payload đầy đủ từ mapping → gọi Them_HoSo_TS.
    -- Data ghi vào bảng chuẩn hóa TS_HOSO (giống Import Excel), hiển thị được ở bảng
    -- "Kết quả đăng ký" mới thông qua LayDS_HoSo_TS.
    -- Progress bar + counter OK/Err.
    -------------------------------------------*/
    /*------------------------------------------
    -- Xuất raw data từ API ra Excel (backup / review offline).
    -- Nếu user tick 1 số record → xuất record đã tick; không tick → xuất tất cả.
    -- Headers = union tất cả keys (record khác nhau có thể có set field khác nhau).
    -- Reuse SheetJS đã load sẵn cho Import Excel.
    -------------------------------------------*/
    docAPI_ExportToExcel: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        if (!me._docAPI_ApiData || !me._docAPI_ApiData.length) {
            edu.system.alert("Chưa có dữ liệu API — bấm 'Kết nối & Tải' trước khi xuất.", "w");
            return;
        }
        // Records cần xuất:
        //   SelectAll flag ON → toàn bộ filteredIdx
        //   Else → ManualPicks giao filteredIdx (persist qua các trang, loại record ngoài filter)
        //   Nếu vẫn 0 → xuất all raw
        var arrIdx = [];
        var filteredIdxExp = me._docAPI_getFilteredIdx();
        if (me._docAPI_SelectedAll) {
            arrIdx = filteredIdxExp.slice();
        } else {
            var filterSetExp = {};
            for (var fx = 0; fx < filteredIdxExp.length; fx++) filterSetExp[filteredIdxExp[fx]] = true;
            for (var k in me._docAPI_ManualPicks) {
                if (me._docAPI_ManualPicks[k] && filterSetExp[k]) arrIdx.push(parseInt(k, 10));
            }
        }
        var records = arrIdx.length
            ? arrIdx.map(function (i) { return me._docAPI_ApiData[i]; })
            : me._docAPI_ApiData.slice();

        // Union keys: quét toàn bộ records để tính đủ headers (order = order xuất hiện)
        var headerSet = {};
        var headers = [];
        records.forEach(function (rec) {
            Object.keys(rec || {}).forEach(function (k) {
                if (!headerSet[k]) { headerSet[k] = 1; headers.push(k); }
            });
        });
        if (!headers.length) {
            edu.system.alert("Records không có field nào để xuất.", "w");
            return;
        }

        // AoA: hàng 1 = headers, hàng 2+ = data (object → JSON string)
        var aoa = [headers];
        records.forEach(function (rec) {
            var row = headers.map(function (h) {
                var v = rec[h];
                if (v == null) return '';
                if (typeof v === 'object') return JSON.stringify(v);
                return v;
            });
            aoa.push(row);
        });

        var ws = XLSX.utils.aoa_to_sheet(aoa);
        ws['!cols'] = headers.map(function (h) {
            return { wch: Math.max(12, Math.min(40, h.length + 2)) };
        });
        ws['!freeze'] = { xSplit: 0, ySplit: 1 };
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DuLieuAPI');

        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
        var preset = me._docAPI_CurrentPresetId || 'API';
        var fname = 'DuLieuAPI_' + preset + '_' + records.length + 'ban_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
        edu.system.alert("Đã xuất " + records.length + " bản ghi ra file " + fname, "s");
    },

    /*------------------------------------------
    -- Log 1 lỗi vào bộ nhớ tổng hợp + hiện nút "Xem chi tiết lỗi" ở progress header.
    -- type: 'BE'  = BE reject (Success=false, ParamErr có nội dung)
    --       'API' = network error khi call BE (không nhận được response)
    -- Sau này có thể thêm 'PARSE' cho trường hợp record API bị lỗi parse ở FE.
    -------------------------------------------*/
    _docAPI_LogError: function (idx, type, msg) {
        var me = this;
        if (!me._docAPI_Errors) me._docAPI_Errors = [];
        var rec = me._docAPI_ApiData[idx] || {};
        var maHS = me._docAPI_KeyCol ? rec[me._docAPI_KeyCol] : '';
        me._docAPI_Errors.push({
            row: idx + 1,
            maHS: maHS || '',
            hoTen: rec.hoten || rec.HoTen || rec.HOTEN || '',
            type: type,
            msg: msg || ''
        });
        // Hiện nút "Xem chi tiết lỗi" ở progress header
        $('#btnDocAPI_ShowErrors').removeClass('d-none');
    },

    /*------------------------------------------
    -- Render danh sách lỗi vào panel #docAPI_ErrorsPanel
    -------------------------------------------*/
    docAPI_RenderErrorsPanel: function () {
        var me = this;
        var errs = me._docAPI_Errors || [];
        $('#lblDocAPI_ErrCount').text(errs.length);
        var $tbody = $('#tblDocAPI_Errors tbody');
        if (!errs.length) {
            $tbody.html('<tr><td colspan="5" class="td-center text-muted" style="padding:12px;">Chưa có lỗi nào</td></tr>');
            return;
        }
        var html = errs.map(function (e) {
            var typeColor = e.type === 'API' ? '#7c2d12' : '#991b1b';
            var typeBg = e.type === 'API' ? '#fed7aa' : '#fecaca';
            return '<tr>'
                + '<td class="td-center">' + e.row + '</td>'
                + '<td>' + me._docAPI_esc(e.maHS) + '</td>'
                + '<td>' + me._docAPI_esc(e.hoTen) + '</td>'
                + '<td class="td-center"><span style="background:' + typeBg + ';color:' + typeColor + ';padding:2px 8px;border-radius:10px;font-weight:600;font-size:11px;">' + e.type + '</span></td>'
                + '<td>' + me._docAPI_esc(e.msg) + '</td>'
                + '</tr>';
        }).join('');
        $tbody.html(html);
    },

    /*------------------------------------------
    -- Export danh sách record lỗi ra Excel để gửi BE dev debug.
    -- 2 sheet:
    --   Sheet 1 "Loi_TomTat": row/mã HS/họ tên/loại/thông báo lỗi (giống panel)
    --   Sheet 2 "Loi_FullData": ngoài info lỗi, kèm TOÀN BỘ field raw từ API của record đó
    --                           → BE dev có đủ data để reproduce.
    -- Reuse SheetJS đã load. Không có lỗi → alert warning.
    -------------------------------------------*/
    docAPI_ExportErrorsToExcel: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert("Thư viện Excel chưa load xong, vui lòng thử lại sau vài giây.", "w");
            return;
        }
        var errs = me._docAPI_Errors || [];
        if (!errs.length) {
            edu.system.alert("Chưa có lỗi nào để xuất.", "w");
            return;
        }

        // --- Sheet 1: Tóm tắt ---
        var sheet1Aoa = [['STT', 'Hàng', 'Mã HS/MSSV', 'Họ tên', 'Loại lỗi', 'Chi tiết lỗi']];
        errs.forEach(function (e, i) {
            sheet1Aoa.push([i + 1, e.row, e.maHS || '', e.hoTen || '', e.type || '', e.msg || '']);
        });
        var ws1 = XLSX.utils.aoa_to_sheet(sheet1Aoa);
        ws1['!cols'] = [{ wch: 6 }, { wch: 8 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 80 }];
        ws1['!freeze'] = { xSplit: 0, ySplit: 1 };

        // --- Sheet 2: Full data (info lỗi + toàn bộ field API của record) ---
        // Union keys từ tất cả record lỗi → order = order xuất hiện trong record đầu
        var fullRecs = errs.map(function (e) {
            // e.row là 1-based → idx = row - 1
            var idx = (e.row || 1) - 1;
            return me._docAPI_ApiData && me._docAPI_ApiData[idx] ? me._docAPI_ApiData[idx] : {};
        });
        var headerSet = {};
        var apiHeaders = [];
        fullRecs.forEach(function (rec) {
            Object.keys(rec || {}).forEach(function (k) {
                if (!headerSet[k]) { headerSet[k] = 1; apiHeaders.push(k); }
            });
        });
        // Header sheet 2: info lỗi trước + all API fields sau
        var sheet2Headers = ['Hàng', 'Mã HS/MSSV', 'Họ tên', 'Loại lỗi', 'Chi tiết lỗi'].concat(apiHeaders);
        var sheet2Aoa = [sheet2Headers];
        errs.forEach(function (e, i) {
            var rec = fullRecs[i] || {};
            var row = [e.row, e.maHS || '', e.hoTen || '', e.type || '', e.msg || ''];
            apiHeaders.forEach(function (h) {
                var v = rec[h];
                if (v == null) row.push('');
                else if (typeof v === 'object') row.push(JSON.stringify(v));
                else row.push(v);
            });
            sheet2Aoa.push(row);
        });
        var ws2 = XLSX.utils.aoa_to_sheet(sheet2Aoa);
        ws2['!cols'] = [{ wch: 8 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 60 }]
            .concat(apiHeaders.map(function (h) { return { wch: Math.max(12, Math.min(30, h.length + 2)) }; }));
        ws2['!freeze'] = { xSplit: 5, ySplit: 1 };   // freeze 5 cột đầu + hàng header

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'Loi_TomTat');
        XLSX.utils.book_append_sheet(wb, ws2, 'Loi_FullData');

        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var now = new Date();
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
        var preset = me._docAPI_CurrentPresetId || 'API';
        var fname = 'LoiImport_' + preset + '_' + errs.length + 'loi_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fname);
        edu.system.alert("Đã xuất " + errs.length + " record lỗi ra file " + fname
            + "\n\nSheet 1: Tóm tắt lỗi\nSheet 2: Full data để BE debug", "s");
    },

    docAPI_StartImport: function () {
        var me = this;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            edu.system.alert("Chưa xác định kế hoạch tuyển sinh", "w"); return;
        }
        var strDotId = $('#ddlDocAPI_Dot').val() || me.strDot_Id_ForKQ || '';
        if (!strDotId) {
            edu.system.alert("Chưa chọn Đợt tuyển sinh", "w"); return;
        }
        var strCoSoId = $('#ddlDocAPI_CoSoDaoTao').val() || '';   // không bắt buộc
        var mappedCols = Object.keys(me._docAPI_Mapping).filter(function (c) { return me._docAPI_Mapping[c]; });
        if (!mappedCols.length) {
            edu.system.alert("Chưa mapping cột nào — vào bước 2 để chọn param tương ứng", "w"); return;
        }
        var arrIdx = [];
        // SelectAll flag ON → import TOÀN BỘ filteredIdx (bỏ qua paging, bỏ qua ManualPicks)
        // Flag OFF → import các record đã tick tay (ManualPicks persist qua các trang),
        //   nhưng CHỈ lấy record còn nằm trong filter hiện tại (tránh import record đã lọc ẩn).
        var filteredIdx = me._docAPI_getFilteredIdx();
        if (me._docAPI_SelectedAll) {
            arrIdx = filteredIdx.slice();
        } else {
            var filterSet = {};
            for (var fi = 0; fi < filteredIdx.length; fi++) filterSet[filteredIdx[fi]] = true;
            for (var pickIdx in me._docAPI_ManualPicks) {
                if (me._docAPI_ManualPicks[pickIdx] && filterSet[pickIdx]) arrIdx.push(parseInt(pickIdx, 10));
            }
            arrIdx.sort(function (a, b) { return a - b; });   // import theo thứ tự record
        }
        if (!arrIdx.length) {
            edu.system.alert("Chưa chọn bản ghi nào để import", "w"); return;
        }

        // Auto-save mapping mỗi lần import (không cần user bấm Lưu)
        me.docAPI_SaveMapping(false);

        // === DEBUG LOG: tổng quan trước khi import ===
        kqdkNoLog('%c[docAPI] === START IMPORT ===', 'color:#7c3aed;font-weight:bold;font-size:14px', {
            records: arrIdx.length,
            KH_TS_Id: me.strKeHoachTuyenSinh_Id,
            Dot_Id: strDotId,
            mappedCols: mappedCols.length,
            mapping: me._docAPI_Mapping,
            keyCol: me._docAPI_KeyCol,
            preset: me._docAPI_CurrentPresetId
        });

        var totalReq = arrIdx.length;
        var doneReq = 0, okReq = 0, errReq = 0;
        me._docAPI_ImportCancelled = false;
        me._docAPI_Errors = [];   // reset error log tổng hợp
        $('#docAPI_ProgressWrap').removeClass('d-none');
        $('#docAPI_ErrorsPanel').addClass('d-none');   // ẩn panel lỗi cũ
        $('#btnDocAPI_ShowErrors').addClass('d-none');
        $('#btnDocAPI_StartImport').prop('disabled', true);
        $('#btnDocAPI_CancelImport').removeClass('d-none');
        $('#lblDocAPI_Progress').text('0 / ' + totalReq);
        $('#lblDocAPI_OK').text('0'); $('#lblDocAPI_Err').text('0');
        $('#docAPI_ProgressBar').css('width', '0%').text('0%');
        arrIdx.forEach(function (i) {
            $('.docAPI-status[data-idx="' + i + '"]').html('<i class="fa fa-spinner fa-spin"></i>');
            $('.docAPI-errmsg[data-idx="' + i + '"]').html('');
        });

        // Build queue: 1 item per record — row là dict {paramName: value} theo mapping
        var queue = [];
        arrIdx.forEach(function (i) {
            var rec = me._docAPI_ApiData[i];
            var row = {};
            mappedCols.forEach(function (apiCol) {
                var target = me._docAPI_Mapping[apiCol];
                if (!target) return;
                var v = rec[apiCol];
                // Null check TRƯỚC typeof (typeof null === 'object') — tránh gửi text "null" xuống BE.
                if (v == null) {
                    v = '';
                } else if (typeof v === 'object') {
                    v = JSON.stringify(v);
                }
                row[target] = String(v);
            });
            queue.push({ idx: i, row: row });
        });

        function updateProgress() {
            var pct = totalReq > 0 ? Math.round(doneReq * 100 / totalReq) : 0;
            $('#lblDocAPI_Progress').text(doneReq + ' / ' + totalReq);
            $('#lblDocAPI_OK').text(okReq); $('#lblDocAPI_Err').text(errReq);
            $('#docAPI_ProgressBar').css('width', pct + '%').text(pct + '%');
        }

        // ====== PARALLEL với concurrency limit ======
        // Chạy tối đa N request cùng lúc, khi 1 xong → kick request kế tiếp.
        // Nhanh ~5× so với tuần tự cũ. Cancel: dừng dispatch mới, chờ in-flight xong.
        var CONC = me._IMPORT_CONCURRENCY || 5;
        var nextDispatch = 0;
        var inFlight = 0;
        var finished = false;

        function doFinish() {
            if (finished) return;
            finished = true;
            $('#btnDocAPI_StartImport').prop('disabled', false);
            $('#btnDocAPI_CancelImport').addClass('d-none');
            if (me._docAPI_ImportCancelled) {
                edu.system.alert("Đã dừng ở " + doneReq + "/" + totalReq + ". OK: " + okReq + " / Lỗi: " + errReq);
            } else {
                edu.system.alert("Xong. Thành công: " + okReq + " / Lỗi: " + errReq);
            }
        }

        function onOne() {
            inFlight--;
            updateProgress();
            if (doneReq >= totalReq) { doFinish(); return; }
            if (me._docAPI_ImportCancelled && inFlight === 0) { doFinish(); return; }
            kickNext();
        }

        function kickNext() {
            while (!me._docAPI_ImportCancelled && inFlight < CONC && nextDispatch < queue.length) {
                var item = queue[nextDispatch++];
                inFlight++;
                (function (item) {
                    var payload = me._buildImportPayload(item.row, item.idx + 1, { Dot: strDotId, CoSo: strCoSoId });
                    edu.system.makeRequest({
                        success: function (data) {
                            doneReq++;
                            var $cell = $('.docAPI-status[data-idx="' + item.idx + '"]');
                            var $errCell = $('.docAPI-errmsg[data-idx="' + item.idx + '"]');
                            var msg = (data && data.Message) || '';
                            if (data && data.Success) {
                                okReq++;
                                if (msg) {
                                    $cell.html('<span style="color:#d97706;" title="' + me._docAPI_esc(msg) + '"><i class="fa fa-exclamation-triangle"></i></span>');
                                    $errCell.html('<span style="color:#d97706;">' + me._docAPI_esc(msg) + '</span>');
                                } else {
                                    $cell.html('<span class="color-success" title="OK"><i class="fa fa-check"></i></span>');
                                    $errCell.html('');
                                }
                            } else {
                                errReq++;
                                var errMsg = msg || 'Lỗi không xác định';
                                $cell.html('<span class="color-red" title="' + me._docAPI_esc(errMsg) + '"><i class="fa fa-times"></i></span>');
                                $errCell.html('<span class="color-red">' + me._docAPI_esc(errMsg) + '</span>');
                                me._docAPI_LogError(item.idx, 'BE', errMsg);
                            }
                            onOne();
                        },
                        error: function (er) {
                            doneReq++; errReq++;
                            var $cell = $('.docAPI-status[data-idx="' + item.idx + '"]');
                            var $errCell = $('.docAPI-errmsg[data-idx="' + item.idx + '"]');
                            var netErr = 'Network error: ' + JSON.stringify(er);
                            $cell.html('<span class="color-red" title="' + me._docAPI_esc(netErr) + '"><i class="fa fa-times"></i></span>');
                            $errCell.html('<span class="color-red">' + me._docAPI_esc(netErr) + '</span>');
                            me._docAPI_LogError(item.idx, 'API', netErr);
                            onOne();
                        },
                        type: 'POST', contentType: true,
                        action: payload.action, data: payload, fakedb: []
                    }, false, false, false, null);
                })(item);
            }
        }

        kickNext();
    }
};
