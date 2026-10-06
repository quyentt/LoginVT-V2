/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note: Lịch giảng nhiều phòng học
----------------------------------------------*/
function LichGiangNhieuPhong() { };
LichGiangNhieuPhong.prototype = {
    strNgayBatDau: '',
    strNgayKetThuc: '',
    dtLichHoc: [],
    dtPhongHoc: [],
    dtPhongHocFull: [],
    dtPhongHocOriginal: [], // Lưu bản gốc không bị filter
    dtToaNha: [],
    arrMauNen: ["#223771", "#d49f3a", "#ec4c00", "#5a7adb", "#3c5398"],
    arrLopHocPhanMau: [],
    iPageSize: 10, // Mỗi phòng cao ~260px (2 dòng module) → màn hình chỉ thấy ~3 phòng; tải 10, cuộn tới đâu tải thêm tới đó
    iCurrentPage: 1,
    isLoading: false,
    strSelectedBuilding: '',
    strSelectedRoomType: 'all', // Mặc định hiển thị tất cả loại phòng
    strEfficiencyMode: 'days', // Mặc định tính theo ngày sử dụng
    strNgayDangChon: '',

    // Giảm tải server: LayLichPhongHoc chỉ nhận 1 phòng/lần gọi → cache kết quả + giới hạn số request song song.
    // Đổi bộ lọc / cách tính hiệu suất / quay lại tuần đã xem thì dùng cache, không gọi lại API.
    iCacheTTL: 5 * 60 * 1000,   // Lịch hết hạn cache sau 5 phút
    iMaxConcurrent: 5,          // Tối đa 5 request LayLichPhongHoc cùng lúc
    objCacheLich: {},           // key: IdPhong|NgayBatDau|NgayKetThuc → { t, data }
    objCachePhong: {},          // key: ToaNha_Id ('' = tất cả) → danh sách phòng
    iLoadToken: 0,              // Tăng mỗi lượt tải → bỏ kết quả của lượt tải cũ (đổi tuần liên tục)
    bDaXemLich: false,          // false = đổi tuần/bộ lọc không tự tải (init bật true vì vào trang là tải luôn)
    iNextRow: 3,                // Dòng grid kế tiếp khi vẽ thêm phòng (mỗi phòng chiếm 2 dòng)
    ioCuon: null,               // IntersectionObserver theo dõi dòng "Cuộn xuống..." để tải thêm phòng

    // Đổi lịch ngay trên trang (giảng viên) — chỉ gọi API khi giảng viên bấm, mở trang không tải thêm gì
    objLichCuaToi: {},          // key: NgayBatDau|NgayKetThuc → lịch dạy của người đăng nhập (LayDSLichGiang)
    dtLopCuaToiDangChon: [],    // Các buổi dạy đang liệt kê trong modal chọn buổi
    objLopDoi: null,            // Buổi học đang yêu cầu đổi (bản ghi lịch cá nhân — đủ trường cho API đổi lịch)
    objDichDoi: null,           // Ô trống đích { IDPHONGHOC, TENPHONG, SUCCHUA, KIEUPHONG, NGAYHOC, TU, DEN }
    dtGiangVienThayDoi: [],     // rsGiangVien của lần khởi tạo đổi lịch
    bSangDoiLich: false,        // Đang chuyển từ modal chọn buổi sang modal đổi lịch (giữ tô ô đang chọn)
    strLoaiPhongDoi: '',        // Loại phòng hiện tại của buổi đang đổi (LT/TH) → chỉ cho đổi sang phòng cùng loại
    iTokenChiTiet: 0,           // Chống lệch khi bấm liên tiếp nhiều thẻ lịch

    // Module 3 tiết theo lịch xếp thường gặp. Sáng/Chiều mỗi buổi 2 module (trên/dưới), Tối 1 module.
    arrModule: [
        { tu: 1, den: 3, buoi: 'sang', tenBuoi: 'Sáng' },
        { tu: 4, den: 6, buoi: 'sang', tenBuoi: 'Sáng' },
        { tu: 7, den: 9, buoi: 'chieu', tenBuoi: 'Chiều' },
        { tu: 10, den: 12, buoi: 'chieu', tenBuoi: 'Chiều' },
        { tu: 13, den: 15, buoi: 'toi', tenBuoi: 'Tối' }
    ],
    // Icon Font Awesome Pro 6.4 duotone (assets/css/fontawesome-6.css) thay emoji — màu 2 lớp đặt ở CSS .session-icon.buoi-*
    arrBuoi: [
        { key: 'sang', ten: 'SÁNG', icon: 'fa-sun-bright', mau: '#FFF9E6' },
        { key: 'chieu', ten: 'CHIỀU', icon: 'fa-cloud-sun', mau: '#E6F3FF' },
        { key: 'toi', ten: 'TỐI', icon: 'fa-moon-stars', mau: '#F0E6FF' }
    ],

    // Helper function to clean HTML tags from text
    cleanHtmlTags: function(text) {
        if (!text) return '';
        return text
            .replace(/<br\s*\/?>/gi, ', ')  // Replace <br> with comma
            .replace(/,\s*,/g, ',')          // Remove double commas
            .replace(/^,\s*/, '')            // Remove leading comma
            .replace(/,\s*$/, '');           // Remove trailing comma
    },

    // Sức chứa phòng — LayDSPhongHoc chưa rõ tên cột nên dò theo danh sách key hay dùng,
    // fallback: số trong ngoặc cuối TEN (VD "A1-101(154)" → 154). Trả null nếu không xác định được.
    arrSucChuaKeys: ['SUCCHUAHOC', 'SUCCHUA', 'SUC_CHUA', 'SUCCHUA_HOC', 'SOCHOHOC', 'SOCHO', 'SOCHONGOI', 'SOLUONGCHO', 'SOLUONG'],
    getSucChua: function(room) {
        var me = this;
        for (var i = 0; i < me.arrSucChuaKeys.length; i++) {
            var v = room[me.arrSucChuaKeys[i]];
            if (v !== undefined && v !== null && v !== '' && !isNaN(v)) return parseInt(v, 10);
        }
        var m = /\((\d+)\)\s*$/.exec(room.TEN || '');
        return m ? parseInt(m[1], 10) : null;
    },

    // Tên phòng gọn: bỏ "(N)" sức chứa ở cuối TEN (đã hiện ở nhãn riêng)
    getTenPhong: function(room) {
        var ten = room.TEN || '';
        return this.getSucChua(room) !== null ? ten.replace(/\s*\(\d+\)\s*$/, '') : ten;
    },

    // Tên phòng + nhãn sức chứa. Nếu sức chứa lấy từ "(N)" cuối TEN thì bỏ phần đó khỏi tên cho gọn.
    genHtml_RoomName: function(room) {
        var me = this;
        var sucChua = me.getSucChua(room);
        var html = '<div style="font-weight: 600; margin-bottom: 3px;">' + me.getTenPhong(room) + '</div>';
        if (sucChua !== null) {
            html += '<div style="margin-bottom: 3px;">';
            html += '<span title="Sức chứa" style="display: inline-block; background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; padding: 1px 6px; border-radius: 10px; font-size: 11px; font-weight: 600; white-space: nowrap;">';
            html += '<i class="fa-solid fa-users" style="margin-right: 4px;"></i>' + sucChua + ' chỗ</span>';
            html += '</div>';
        }
        return html;
    },

    // Phân loại buổi (sang/chieu/toi) — ưu tiên TIETBATDAU, fallback theo GIOBATDAU khi API không trả tiết
    getSession: function(event) {
        var tiet = event.TIETBATDAU;
        if (tiet) {
            if (tiet >= 1 && tiet <= 6) return 'sang';
            if (tiet >= 7 && tiet <= 12) return 'chieu';
            if (tiet >= 13 && tiet <= 15) return 'toi';
        }
        var gio = event.GIOBATDAU;
        if (gio != null) {
            if (gio < 13) return 'sang';
            if (gio < 19) return 'chieu';
            return 'toi';
        }
        return null;
    },

    // Ước lượng (tiết bắt đầu, tiết kết thúc) — fallback theo giờ khi API không trả TIETBATDAU/TIETKETTHUC.
    // Quy ước: mỗi tiết ~1 giờ, tiết 1 ~ 7h → sáng T1-6 (7h-12h), chiều T7-12 (13h-18h), tối T13-15 (19h-21h).
    getTietRange: function(event) {
        var batDau = event.TIETBATDAU;
        var ketThuc = event.TIETKETTHUC;
        var g;
        if (!batDau && event.GIOBATDAU != null) {
            g = event.GIOBATDAU;
            if (g < 13) batDau = Math.max(1, Math.min(6, g - 6));
            else if (g < 19) batDau = Math.max(7, Math.min(12, g - 6));
            else batDau = Math.max(13, Math.min(15, g - 6));
        }
        if (!ketThuc && event.GIOKETTHUC != null) {
            g = event.GIOKETTHUC;
            if (g <= 12) ketThuc = Math.max(1, Math.min(6, g - 6));
            else if (g <= 18) ketThuc = Math.max(7, Math.min(12, g - 6));
            else ketThuc = Math.max(13, Math.min(15, g - 6));
        }
        return { batDau: batDau, ketThuc: ketThuc };
    },

    // Kiểm tra ngày dd/MM/yyyy có phải Chủ nhật không
    isSunday: function(dateStr) {
        if (!dateStr) return false;
        var parts = dateStr.split('/');
        if (parts.length !== 3) return false;
        var d = new Date(parts[2], parts[1] - 1, parts[0]);
        return d.getDay() === 0;
    },

    // Calculate efficiency based on selected mode
    // Hiệu suất tính trên 6 ngày làm việc (T2-T7), bỏ Chủ nhật khỏi cả tử & mẫu
    calculateEfficiency: function(roomSchedules, arrDays) {
        var me = this;
        var mode = me.strEfficiencyMode;

        // Loại Chủ nhật khỏi mẫu số
        var workingDays = arrDays.filter(function(d) {
            return !me.isSunday(d.date);
        }).length;

        // Loại lịch rơi vào Chủ nhật khỏi tử số
        var validSchedules = roomSchedules.filter(function(s) {
            return !me.isSunday(s.NGAYHOC);
        });

        if (workingDays === 0) return 0;

        if (mode === 'days') {
            // Tính theo ngày: đếm số ngày có lịch
            var uniqueDays = {};
            validSchedules.forEach(function(schedule) {
                if (schedule.NGAYHOC) {
                    uniqueDays[schedule.NGAYHOC] = true;
                }
            });
            var usedDays = Object.keys(uniqueDays).length;
            return Math.round((usedDays / workingDays) * 100);
        }

        // Tính theo tiết học
        var totalUsedPeriods = 0;
        var totalPeriods = 0;

        // Xác định range tiết theo mode
        var periodRange = { min: 1, max: 15 };
        switch(mode) {
            case 'morning':
                periodRange = { min: 1, max: 6 };
                totalPeriods = workingDays * 6;
                break;
            case 'afternoon':
                periodRange = { min: 7, max: 12 };
                totalPeriods = workingDays * 6;
                break;
            case 'evening':
                periodRange = { min: 13, max: 15 };
                totalPeriods = workingDays * 3;
                break;
            case 'morning-afternoon':
                periodRange = { min: 1, max: 12 };
                totalPeriods = workingDays * 12;
                break;
            case 'afternoon-evening':
                periodRange = { min: 7, max: 15 };
                totalPeriods = workingDays * 9;
                break;
            case 'all-sessions':
            case 'periods':
            default:
                periodRange = { min: 1, max: 15 };
                totalPeriods = workingDays * 15;
                break;
        }

        // Đếm số tiết đã sử dụng trong range (fallback theo giờ nếu thiếu TIETBATDAU/TIETKETTHUC)
        validSchedules.forEach(function(schedule) {
            var range = me.getTietRange(schedule);
            if (range.batDau && range.ketThuc) {
                var start = Math.max(range.batDau, periodRange.min);
                var end = Math.min(range.ketThuc, periodRange.max);
                if (start <= end) {
                    totalUsedPeriods += (end - start + 1);
                }
            }
        });

        return totalPeriods > 0 ? Math.round((totalUsedPeriods / totalPeriods) * 100) : 0;
    },
    
    // Get efficiency label text based on mode
    getEfficiencyModeLabel: function() {
        var me = this;
        switch(me.strEfficiencyMode) {
            case 'days': return 'Theo ngày';
            case 'morning': return 'Buổi sáng';
            case 'afternoon': return 'Buổi chiều';
            case 'evening': return 'Buổi tối';
            case 'morning-afternoon': return 'Sáng + Chiều';
            case 'afternoon-evening': return 'Chiều + Tối';
            case 'all-sessions': return 'Cả 3 buổi';
            case 'periods':
            default: return 'Theo tiết';
        }
    },

    // Update statistics display
    updateStats: function(totalRooms, totalSchedules) {
        // Removed - no longer displaying stats
        // Removed - no longer displaying stats
        $("#totalRoomsDisplay").text(totalRooms + " phòng");
        $("#totalSchedulesDisplay").text(totalSchedules + " lịch");
    },

    // Update statistics with TOTAL count (not paginated count)
    updateStatsTotal: function() {
        // Removed - no longer displaying stats
        // Removed - no longer displaying stats

        var me = this;
        
        // Load tất cả lịch để tính tổng
        var loadedCount = 0;
        var allSchedules = [];
        
        me.dtPhongHocFull.forEach(function(room) {
            me.getList_LichPhongHoc(room.ID, me.strNgayBatDau, me.strNgayKetThuc, function(schedules) {
                allSchedules = allSchedules.concat(schedules);
                loadedCount++;
                
                // Khi đã load xong tất cả
                if (loadedCount === me.dtPhongHocFull.length) {
                    $("#totalRoomsDisplay").text(me.dtPhongHocFull.length + " phòng");
                    $("#totalSchedulesDisplay").text(allSchedules.length + " lịch");
                }
            });
        });
    },

    init: function () {
        var me = this;
        // Cache riêng cho mỗi lần mở trang (không dùng object chung trên prototype)
        me.objCacheLich = {};
        me.objCachePhong = {};
        me.objDangTai = {};
        me.objLichCuaToi = {};
        
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();

        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);

        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);

        // Mở trang: chọn sẵn tuần hiện tại (tự tải lịch ở cuối init)
        var elHomNay = $(".days .poiter.active")[0];
        if (elHomNay) me.chonTuan(elHomNay);
        // Muốn mở trang KHÔNG tự tải (chờ bấm Xem): bỏ comment dòng dưới + comment 2 dòng tự tải ở cuối init
        // me.genHtml_ChuaXem();

        // Calendar click event — chọn tuần; chỉ tự tải khi đã bấm Xem trước đó
        $(".days").delegate(".poiter", "click", function () {
            me.chonTuan(this);
            $("#zoneChonTuan").hide();
        });

        // Popup lịch tháng để chọn tuần (nằm trên thanh tuần của lưới)
        $("#btnChonTuan").click(function (e) {
            e.stopPropagation();
            $("#zoneChonTuan").toggle();
        });
        $(document).off("mousedown.lichgiangnhieuphong").on("mousedown.lichgiangnhieuphong", function (e) {
            if (!$(e.target).closest("#zoneChonTuan, #btnChonTuan").length) $("#zoneChonTuan").hide();
        });

        // Month navigation
        $("#btnPrevMonth").click(function () {
            me.genHtml_Month(-1);
        });
        $("#btnNextMonth").click(function () {
            me.genHtml_Month(1);
        });
        
        // Legacy support for old calendar
        $(".month").delegate(".prev", "click", function () {
            me.genHtml_Month(-1);
        });
        $(".month").delegate(".next", "click", function () {
            me.genHtml_Month(1);
        });

        // Week navigation buttons
        $("#btnPrevWeek").click(function () {
            me.navigateWeek(-7);
        });
        
        $("#btnNextWeek").click(function () {
            me.navigateWeek(7);
        });

        // Search button
        $("#btnSearch").click(function () {
            var arrMulti = $("#dropSearch_PhongHocMulti").val() || [];
            var hasFilter = $("#dropSearch_ToaNha").val() || arrMulti.length > 0
                || $("#txtSucChua_Tu").val() || $("#txtSucChua_Den").val();
            if (!hasFilter) {
                edu.system.alert("Vui lòng chọn tòa nhà, phòng học hoặc sức chứa");
                return;
            }
            if (!me.strNgayBatDau || !me.strNgayKetThuc) {
                edu.system.alert("Vui lòng chọn tuần trên lịch");
                return;
            }
            me.bDaXemLich = true;
            me.getList_TuanHienTai();
        });

        // View all button — reset bộ lọc bằng 'change.select2' (chỉ cập nhật giao diện select2,
        // không chạy handler change của trang) rồi tải đúng 1 lần
        $("#btnViewAll").click(function () {
            $("#dropSearch_ToaNha").val('').trigger('change.select2');
            $("#dropSearch_PhongHocMulti").val(null).trigger('change.select2');
            $("#txtSucChua_Tu, #txtSucChua_Den").val('');
            me.loadPhongHocByToaNha('');
            if (!me.strNgayBatDau || !me.strNgayKetThuc) {
                edu.system.alert("Vui lòng chọn tuần trên lịch");
                return;
            }
            me.bDaXemLich = true;
            me.getList_TuanHienTai();
        });

        // Building filter change
        $("#dropSearch_ToaNha").change(function () {
            var toaNhaId = $(this).val();

            // Đóng dropdown Select2
            $(this).select2('close');

            // Bỏ chọn phòng của tòa cũ NGAY (trước khi tải) — nếu không, lượt tải dưới vẫn lọc theo phòng tòa cũ
            $("#dropSearch_PhongHocMulti").val(null).trigger('change.select2');
            me.loadPhongHocByToaNha(toaNhaId);

            if (me.bDaXemLich) me.getList_TuanHienTai();
        });

        // Multi-room filter change — KHÔNG tự load, user bấm nút "Xem lịch phòng" để load
        $("#dropSearch_PhongHocMulti").change(function () {
            var selected = $(this).val() || [];
            console.log("Đã chọn", selected.length, "phòng (chờ bấm 'Xem lịch phòng')");
        });

        // Room type filter change
        $("#dropRoomType").change(function () {
            me.strSelectedRoomType = $(this).val();
            // Lọc lại trên danh sách phòng + lịch đã cache, chỉ gọi API cho phòng chưa tải
            if (me.bDaXemLich) me.getList_TuanHienTai();
        });

        // Sức chứa filter change
        $("#txtSucChua_Tu, #txtSucChua_Den").change(function () {
            if (me.bDaXemLich) me.getList_TuanHienTai();
        });

        // select2 4.0.3 khóa cuộn các khung cha khi mở dropdown và chỉ gỡ khóa ở khung ĐANG có thanh cuộn lúc đóng.
        // Chọn xong → lưới đổi thành "Đang tải..." (trang ngắn lại, hết thanh cuộn) → khóa không được gỡ → trang đứng im, không cuộn được.
        // → Tự gỡ khóa ở mọi khung cha mỗi khi một ô chọn của thẻ lọc đóng lại.
        $(".lgnp-filter-card").on("select2:close", "select", function () {
            $(this).parents().off("scroll.select2");
        });

        // Lọc "Phòng trống lúc" (ngày + khung tiết) — đổi khung tiết khi chưa chọn ngày thì không cần tải lại
        $("#dropLoc_ThuTrong, #dropLoc_TietTrong").each(function () {
            if ($(this).hasClass("select2-hidden-accessible")) $(this).select2("destroy");
            $(this).select2({ width: '100%', minimumResultsForSearch: Infinity });
        });
        // Dòng tóm tắt lọc phòng trống: đổi qua lại 1 ngày / cả tuần (vẽ lại từ dữ liệu đang có), bỏ lọc
        $("#zoneLocTrong").on("click", "#btnLocTrong_CaTuan", function () {
            me.bLocXemCaTuan = !me.bLocXemCaTuan;
            me.capNhatThanhLocTrong();
            if (me.dtPhongHoc.length > 0) me.genTable_ThongTin(me.dtLichHoc);
        });
        // Khoảng nhiều ngày: chỉ phòng trống đủ mọi ngày ↔ cả phòng trống một phần (dữ liệu đã cache, không gọi lại API)
        $("#zoneLocTrong").on("click", "#btnLocTrong_MotPhan", function () {
            me.bLocTrongMotPhan = !me.bLocTrongMotPhan;
            me.getList_TuanHienTai();
        });
        $("#zoneLocTrong").on("click", "#btnLocTrong_Bo", function () {
            $("#txtLoc_TuNgay, #txtLoc_DenNgay").val('');
            $("#dropLoc_ThuTrong").val('').trigger('change.select2');
            me.getList_TuanHienTai();
        });
        // Chọn thứ: có khoảng ngày → chỉ xét thứ đó trong khoảng; không nhập ngày → thứ đó của tuần đang xem
        $("#dropLoc_ThuTrong").change(function () {
            if (me.bDaXemLich) me.getList_TuanHienTai();
        });
        $("#txtLoc_TuNgay, #txtLoc_DenNgay").change(function () {
            var strTu = $("#txtLoc_TuNgay").val(), strDen = $("#txtLoc_DenNgay").val();
            // Chỉ nhập "Đến ngày" → coi là 1 ngày đó; Đến < Từ → kéo Đến về bằng Từ
            if (!strTu && strDen) { strTu = strDen; $("#txtLoc_TuNgay").val(strTu); }
            if (strTu && strDen && strDen < strTu) { strDen = strTu; $("#txtLoc_DenNgay").val(strDen); }
            if (!me.bDaXemLich) return;
            // Lọc đúng 1 ngày nằm ngoài tuần đang xem → nhảy sang tuần chứa ngày đó (chonTuan tự tải lại)
            var dTu = me.toDate(me.isoToVn(strTu)), dDau = me.toDate(me.strNgayBatDau), dCuoi = me.toDate(me.strNgayKetThuc);
            if (dTu && (!strDen || strDen === strTu) && dDau && dCuoi && (dTu < dDau || dTu > dCuoi)) {
                var strDauCu = me.strNgayBatDau;
                me.bGiuNgayLoc = true;
                me.navigateWeek(Math.round((dTu - dDau) / 86400000));
                me.bGiuNgayLoc = false;
                if (me.strNgayBatDau !== strDauCu) return;
            }
            me.getList_TuanHienTai();
        });
        $("#dropLoc_TietTrong").change(function () {
            if (!$("#txtLoc_TuNgay").val() && !$("#dropLoc_ThuTrong").val()) return;
            if (me.bDaXemLich) me.getList_TuanHienTai();
        });
        // Bảng phòng trống theo khoảng ngày: bấm ô Trống → đổi lịch vào đó (giống ô Trống trên lưới tuần)
        $("#scheduleGrid").delegate(".kn-o.is-free", "click", function () {
            me.chonOTrong($(this));
        });

        // Efficiency mode change — chỉ vẽ lại từ dữ liệu đang có, không gọi API
        $("#dropEfficiencyMode").change(function () {
            me.strEfficiencyMode = $(this).val();
            if (me.dtPhongHoc.length > 0) {
                me.genTable_ThongTin(me.dtLichHoc);
            }
        });

        // Export Excel button
        $("#btnExportExcel").click(function () {
            me.showExportModal();
        });
        
        // Event: Khi đóng modal xuất Excel, destroy Select2
        $("#modal_export_excel").on('hidden.bs.modal', function () {
            if ($("#exportCustomRoom").hasClass("select2-hidden-accessible")) {
                $("#exportCustomRoom").select2('destroy');
            }
        });

        // Export modal events
        $("#exportTimeRange").change(function () {
            var value = $(this).val();
            $("#customDateSection").hide();
            $("#customRangeSection").hide();
            
            if (value === "custom_date") {
                $("#customDateSection").show();
            } else if (value === "custom_range") {
                $("#customRangeSection").show();
            }
        });

        $("#exportRoomFilter").change(function () {
            var value = $(this).val();
            if (value === "custom") {
                $("#customRoomSection").show();
            } else {
                $("#customRoomSection").hide();
            }
        });

        $("#btnConfirmExport").click(function () {
            me.processExport();
        });

        // Modal xuất: bấm thẻ lựa chọn → gán giá trị vào select ẩn tương ứng (processExport vẫn đọc select như cũ)
        $("#modal_export_excel").delegate(".lgnp-opt", "click", function () {
            $("#" + $(this).data("for")).val($(this).data("value")).trigger("change");
        });
        $("#exportTimeRange, #exportRoomFilter, #exportFileFormat, #exportTemplateMode").change(function () {
            me.dongBoLuaChonXuat();
        });

        // Đổi lịch ngay trên trang: bấm ô Trống → chọn buổi dạy của mình → modal yêu cầu đổi lịch điền sẵn
        $("#scheduleGrid").delegate(".schedule-module.is-free", "click", function () {
            me.chonOTrong($(this));
        });
        $("#zoneDoi_DSLop").delegate(".lgnp-lop-item", "click", function () {
            var objLop = me.dtLopCuaToiDangChon[parseInt($(this).attr("data-idx"), 10)];
            var objDich = me.objDichDoi;
            me.bSangDoiLich = true;
            me.dongModal("modal_chon_lop_doi", function () {
                me.bSangDoiLich = false;
                me.moDoiLich(objLop, objDich);
            });
        });
        $("#modal_chon_lop_doi").on("hidden.bs.modal", function () {
            if (!me.bSangDoiLich) $("#scheduleGrid .o-dang-chon").removeClass("o-dang-chon");
        });
        $("#modal_doilich").on("hidden.bs.modal", function () {
            $("#scheduleGrid .o-dang-chon").removeClass("o-dang-chon");
        });
        // Bấm thẻ lớp của chính mình → modal chi tiết có nút "Yêu cầu đổi lịch"
        $("#btnDetail_DoiLich").click(function () {
            var objLop = me.objLopDoi;
            me.dongModal("modal_detail", function () { me.moDoiLich(objLop, null); });
        });
        $("#btnDL_KiemTra").click(function () {
            me.save_KiemTraTrungLich();
        });
        $("#btnDL_Gui").click(function () {
            me.save_DoiLich();
        });
        // Sửa ngày/tiết/phòng sau khi đã kiểm tra → kết quả kiểm tra cũ không còn đúng
        $("#txtDL_Ngay, #txtDL_TietBatDau, #txtDL_TietKetThuc, #dropDL_PhongHoc").on("change", function () {
            $("#zoneDL_KetQua").hide();
        });
        // Đổi ngày/tiết mới → tìm lại phòng trống (chờ 400ms cho gõ xong, tránh gọi API mỗi phím)
        $("#txtDL_Ngay, #txtDL_TietBatDau, #txtDL_TietKetThuc").on("change input", function () {
            clearTimeout(me.tHenPhongTrong);
            me.tHenPhongTrong = setTimeout(function () { me.capNhatPhongTrong_DoiLich(); }, 400);
        });

        // Schedule event click
        $("#scheduleGrid").delegate(".schedule-event", "click", function () {
            var $el = $(this);
            var eventId = $el.data('event-id');
            var roomId = $el.data('room-id');
            var date = $el.data('date');
            var lopHocPhan = $el.data('lophocphan');
            
            console.log("Click event:", { eventId: eventId, roomId: roomId, date: date, lopHocPhan: lopHocPhan });
            
            me.showScheduleDetail(eventId, roomId, date, lopHocPhan);
        });

        // Scroll event for lazy loading
        // Scroll event for pagination
        $(".schedule-grid-container").scroll(function () {
            if (me.isLoading) return;
            
            var container = $(this);
            var scrollTop = container.scrollTop();
            var scrollHeight = container[0].scrollHeight;
            var clientHeight = container.height();
            
            // Load more when scrolled to 80% of content
            if (scrollTop + clientHeight >= scrollHeight * 0.8) {
                me.loadMoreRooms();
            }
        });
        $("#scheduleGrid").delegate(".scroll-notice", "click", function () {
            me.loadMoreRooms();
        });

        // Bề ngang đổi (cửa sổ, thu/mở sidebar) → xét lại chế độ bung hết / khung cuộn riêng
        me.capNhatCheDoLuoi();
        var elKhung = $(".schedule-grid-container")[0];
        if (elKhung && typeof ResizeObserver !== 'undefined') {
            var iRongCu = 0;
            new ResizeObserver(function (arrEntry) {
                var iRong = Math.round(arrEntry[0].contentRect.width);
                if (iRong === iRongCu) return;
                iRongCu = iRong;
                window.requestAnimationFrame(function () { me.capNhatCheDoLuoi(); });
            }).observe(elKhung);
        }

        // Initialize
        me.getList_ToaNha();

        // Vào trang hiển thị luôn lịch tuần hiện tại của tất cả phòng (trang đầu iPageSize phòng, cuộn để tải thêm)
        me.bDaXemLich = true;
        me.getList_TuanHienTai();
    },

    navigateWeek: function (days) {
        var me = this;
        if (!me.strNgayBatDau) return;
        
        var parts = me.strNgayBatDau.split('/');
        var currentDate = new Date(parts[2], parts[1] - 1, parts[0]);
        currentDate.setDate(currentDate.getDate() + days);
        
        // Find the Monday of the new week
        var dayOfWeek = currentDate.getDay();
        var diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentDate.setDate(currentDate.getDate() + diff);
        
        var newMonth = currentDate.getMonth() + 1;
        var newYear = currentDate.getFullYear();
        
        // Update calendar if month changed
        var currentMonth = parseInt($("#thang").attr("title"));
        var currentYear = parseInt($("#nam").attr("title"));
        
        if (newMonth !== currentMonth || newYear !== currentYear) {
            $("#thang").attr("title", newMonth);
            $("#thang").html("Tháng " + newMonth);
            $("#nam").attr("title", newYear);
            $("#nam").html(newYear);
            me.genHtml_Month(0);
        }

        // Chọn tuần mới (genHtml_Month vẽ đồng bộ nên tìm được ngay, không cần setTimeout)
        var targetElement = $(".days li.poiter[ngay='" + currentDate.getDate() + "']")[0];
        if (targetElement) me.chonTuan(targetElement);
    },

    // Chọn tuần theo 1 ô ngày trên lịch tháng. Chỉ tự tải khi người dùng đã bấm Xem ít nhất 1 lần.
    chonTuan: function (el) {
        var me = this;
        var $el = $(el);
        $(".days .active").removeClass("active");
        $el.addClass("active");
        var dDauCu = me.toDate(me.strNgayBatDau);
        me.strNgayBatDau = $el.attr('batdau');
        me.strNgayKetThuc = $el.attr('ketthuc');
        me.strNgayDangChon = $el.attr('title');
        $("#weekInfo").html("Tuần (" + me.strNgayBatDau + " - " + me.strNgayKetThuc + ")");
        me.danhDauTuanDangChon();
        //me.genCombo_NgayTrong(); // ô chọn ngày trong tuần đã thay bằng Từ ngày / Đến ngày
        // Đang lọc phòng trống mà chuyển tuần → dời Từ/Đến ngày theo đúng số ngày chuyển (giữ nguyên thứ)
        var dDauMoi = me.toDate(me.strNgayBatDau);
        if (dDauCu && dDauMoi && !me.bGiuNgayLoc) {
            var iLech = Math.round((dDauMoi - dDauCu) / 86400000);
            if (iLech) $("#txtLoc_TuNgay, #txtLoc_DenNgay").each(function () {
                var d = me.toDate(me.isoToVn(this.value));
                if (!d) return;
                d.setDate(d.getDate() + iLech);
                this.value = d.getFullYear() + '-' + me.returnTwo(d.getMonth() + 1) + '-' + me.returnTwo(d.getDate());
            });
        }
        if (me.bDaXemLich) me.getList_TuanHienTai();
    },

    // Tô cả hàng tuần đang chọn trên lịch tháng (so theo ngày, kể cả ngày của tháng trước/sau)
    danhDauTuanDangChon: function () {
        var me = this;
        var dBatDau = me.toDate(me.strNgayBatDau);
        var dKetThuc = me.toDate(me.strNgayKetThuc);
        $(".days li").each(function () {
            var d = me.toDate($(this).attr('title'));
            var bTrongTuan = d && dBatDau && dKetThuc && d >= dBatDau && d <= dKetThuc;
            $(this).toggleClass("week-selected", !!bTrongTuan);
        });
    },

    // dd/MM/yyyy → Date (null nếu sai định dạng)
    toDate: function (str) {
        var arr = (str || '').split('/');
        if (arr.length !== 3) return null;
        return new Date(arr[2], arr[1] - 1, arr[0]);
    },

    // Trạng thái ban đầu của lưới: chưa tải gì cho tới khi bấm Xem
    genHtml_ChuaXem: function () {
        var html = '<div class="schedule-empty">';
        html += '<i class="fa-solid fa-magnifying-glass"></i>';
        html += '<div>Chọn <b>tòa nhà</b>, <b>phòng học</b> hoặc <b>sức chứa</b> rồi bấm <b>Xem lịch phòng</b>';
        html += ' — hoặc bấm <b>Xem tất cả lịch phòng</b>.</div>';
        html += '</div>';
        $("#scheduleGrid").html(html);
    },

    getList_TuanHienTai: function () {
        var me = this;
        if (!me.strNgayBatDau || !me.strNgayKetThuc) return;

        // Mỗi lượt tải có token riêng: đổi tuần/bộ lọc liên tục thì kết quả lượt cũ bị bỏ qua
        var iToken = ++me.iLoadToken;
        me.iCurrentPage = 1;
        me.dtLichHoc = [];
        me.dtPhongHoc = [];
        me.dtPhongHocFull = [];
        me.arrLopHocPhanMau = [];
        me.isLoading = false;

        $("#scheduleGrid").html('<div class="schedule-empty"><i class="fas fa-spinner fa-spin text-primary"></i><div>Đang tải dữ liệu... <span id="lblTienDoTai"></span></div></div>');

        me.getList_PhongHoc(function() {
            if (iToken !== me.iLoadToken) return;
            me.capNhatThanhLocTrong();
            var o = me.objLocTrong;
            $("#scheduleGrid").removeClass("lgnp-khoang lgnp-1ngay");
            if (me.dtPhongHocFull.length === 0) {
                var strThongBao = 'Không có phòng học phù hợp bộ lọc';
                if (o && o.arrNgay.length > 1) strThongBao = 'Không có phòng nào trống ' + (me.bLocTrongMotPhan ? 'ngày nào' : 'đủ cả ' + o.arrNgay.length + ' ngày') + ' từ ' + o.arrNgay[0] + ' đến ' + o.arrNgay[o.arrNgay.length - 1] + ', tiết ' + o.TU + '-' + o.DEN + ' phù hợp bộ lọc';
                else if (o) strThongBao = 'Không có phòng trống ' + me.getThu(o.NGAYHOC) + ' ' + o.NGAYHOC + ' tiết ' + o.TU + '-' + o.DEN + ' phù hợp bộ lọc';
                $("#scheduleGrid").html('<div class="schedule-empty"><i class="fa-solid fa-door-closed"></i><div>' + strThongBao + '</div></div>');
                return;
            }

            if (me.strLoiLocTrong) edu.system.alert(me.strLoiLocTrong);

            // Lọc theo khoảng nhiều ngày → bảng phòng × ngày, vẽ thẳng từ kết quả phòng trống (không cần tải lịch từng phòng)
            if (o && o.bBang) {
                me.dtPhongHoc = me.dtPhongHocFull;
                me.genTable_KhoangNgay();
                return;
            }

            // Hiển thị trang đầu tiên (có phân trang)
            me.dtPhongHoc = me.dtPhongHocFull.slice(0, me.iPageSize);

            me.loadSchedulesForPage(me.dtPhongHoc, iToken, function() {
                me.genTable_ThongTin(me.dtLichHoc);
            });
        });
    },

    // Tải lịch nhiều phòng: dùng cache + tối đa iMaxConcurrent request cùng lúc (trước đây bắn 1 request/phòng cùng lúc).
    // fnConHieuLuc() trả false khi lượt tải đã bị thay bằng lượt mới → dừng, không gọi fnXong.
    taiLichNhieuPhong: function (rooms, strNgayBatDau, strNgayKetThuc, fnConHieuLuc, fnTienDo, fnXong) {
        var me = this;
        var dtKetQua = [];
        var iTiepTheo = 0;
        var iXong = 0;
        var iTong = rooms.length;
        if (iTong === 0) {
            fnXong(dtKetQua);
            return;
        }
        function chayTiep() {
            if (!fnConHieuLuc() || iTiepTheo >= iTong) return;
            var room = rooms[iTiepTheo++];
            me.getList_LichPhongHoc(room.ID, strNgayBatDau, strNgayKetThuc, function (dtLich) {
                if (!fnConHieuLuc()) return;
                dtKetQua = dtKetQua.concat(dtLich);
                iXong++;
                if (typeof fnTienDo === 'function') fnTienDo(iXong, iTong);
                if (iXong === iTong) fnXong(dtKetQua);
                else chayTiep();
            });
        }
        for (var i = 0; i < Math.min(me.iMaxConcurrent, iTong); i++) {
            chayTiep();
        }
    },

    loadSchedulesForPage: function (rooms, iToken, callback) {
        var me = this;
        me.taiLichNhieuPhong(rooms, me.strNgayBatDau, me.strNgayKetThuc,
            function () { return iToken === me.iLoadToken; },
            function (iXong, iTong) { $("#lblTienDoTai").text('(' + iXong + '/' + iTong + ' phòng)'); },
            function (dtLich) {
                me.dtLichHoc = me.dtLichHoc.concat(dtLich);
                if (typeof callback === 'function') callback();
            });
    },

    loadMoreRooms: function () {
        var me = this;

        if (me.isLoading) return;
        if (me.dtPhongHoc.length === 0 || me.dtPhongHoc.length >= me.dtPhongHocFull.length) return;

        me.isLoading = true;
        me.iCurrentPage++;
        var iToken = me.iLoadToken;

        var startIndex = (me.iCurrentPage - 1) * me.iPageSize;
        var endIndex = Math.min(startIndex + me.iPageSize, me.dtPhongHocFull.length);
        var newRooms = me.dtPhongHocFull.slice(startIndex, endIndex);

        $(".scroll-notice").html('<i class="fas fa-spinner fa-spin"></i> Đang tải thêm ' + newRooms.length + ' phòng... <span id="lblTienDoTai"></span>');

        me.loadSchedulesForPage(newRooms, iToken, function() {
            me.dtPhongHoc = me.dtPhongHoc.concat(newRooms);
            me.appendRoomsToGrid(newRooms);
            me.isLoading = false;
        });
    },

    appendRoomsToGrid: function (newRooms) {
        var me = this;
        var arrDays = me.getNgayHienThi();
        $(".scroll-notice").remove();
        $("#scheduleGrid").append(me.genHtml_DongPhong(newRooms, arrDays, me.dtLichHoc));
        me.genHtml_ThongBaoCuon();
    },

    // Dòng "Cuộn xuống để xem thêm" khi còn phòng chưa vẽ (bấm vào cũng tải thêm)
    genHtml_ThongBaoCuon: function () {
        var me = this;
        var iConLai = me.dtPhongHocFull.length - me.dtPhongHoc.length;
        if (iConLai <= 0) return;
        $("#scheduleGrid").append('<div class="scroll-notice" style="grid-row: ' + me.iNextRow + ';"><i class="fas fa-arrow-down"></i> Cuộn xuống (hoặc bấm vào đây) để xem thêm ' + iConLai + ' phòng</div>');
        me.theoDoiThongBaoCuon();
    },

    // Tự tải thêm khi dòng "Cuộn xuống..." sắp lọt vào vùng nhìn thấy — chạy cả khi lưới cuộn theo trang (bung hết)
    // lẫn cuộn trong khung riêng (màn hẹp). Trình duyệt cũ không có IntersectionObserver thì vẫn còn bấm vào dòng đó.
    theoDoiThongBaoCuon: function () {
        var me = this;
        if (me.ioCuon) me.ioCuon.disconnect();
        var el = $("#scheduleGrid .scroll-notice")[0];
        if (!el || typeof IntersectionObserver === 'undefined') return;
        me.ioCuon = new IntersectionObserver(function (arrEntry) {
            if (arrEntry[0].isIntersecting) me.loadMoreRooms();
        }, { root: me.getScrollParent(el), rootMargin: '0px 0px 300px 0px' });
        me.ioCuon.observe(el);
    },

    // Phần tử cha gần nhất đang cuộn dọc (null = cả trang)
    getScrollParent: function (el) {
        var p = el.parentElement;
        while (p && p !== document.body && p !== document.documentElement) {
            var strOverflow = window.getComputedStyle(p).overflowY;
            if ((strOverflow === 'auto' || strOverflow === 'scroll') && p.scrollHeight > p.clientHeight) return p;
            p = p.parentElement;
        }
        return null;
    },

    // Lưới vừa bề ngang → bung hết chiều cao, cuộn theo trang (tiêu đề ngày/buổi vẫn dính trên cùng).
    // Không vừa (màn hẹp) → giữ khung cuộn riêng để còn thanh cuộn ngang + tiêu đề dính.
    capNhatCheDoLuoi: function () {
        var elGrid = document.getElementById('scheduleGrid');
        if (!elGrid) return;
        var $khung = $(elGrid).closest('.schedule-grid-container');
        $khung.addClass('lgnp-full');
        $khung.toggleClass('lgnp-full', elGrid.scrollWidth <= elGrid.clientWidth + 1);
    },

    getList_PhongHoc: function (callback) {
        var me = this;
        var strToaNha_Id = $("#dropSearch_ToaNha").val() || '';
        me.getDS_PhongHoc_Cache(strToaNha_Id, function (dtPhong) {
            // Lưu bản gốc (theo tòa nhà) rồi lọc theo phòng / loại phòng / sức chứa, sau đó lọc "Phòng trống lúc"
            me.dtPhongHocOriginal = dtPhong;
            me.locPhongTrong(me.locPhongHoc(dtPhong), function (dtKetQua) {
                me.dtPhongHocFull = dtKetQua;
                if (typeof callback === 'function') callback();
            });
        });
    },

    // Các ngày lưới sẽ vẽ: bình thường cả tuần; đang lọc "Phòng trống lúc" thì chỉ ngày đã chọn
    // (trừ khi người dùng bấm "Xem cả tuần" trên dòng tóm tắt).
    getNgayHienThi: function () {
        var me = this;
        var arrDays = me.getDaysInWeek(me.strNgayBatDau, me.strNgayKetThuc);
        var o = me.objLocTrong;
        if (!o || me.bLocXemCaTuan) return arrDays;
        var arrMotNgay = arrDays.filter(function (d) { return d.date === o.NGAYHOC; });
        return arrMotNgay.length ? arrMotNgay : arrDays;
    },

    // Dòng tóm tắt phía trên lưới khi đang lọc "Phòng trống lúc": số phòng trống + nút xem cả tuần / bỏ lọc
    capNhatThanhLocTrong: function () {
        var me = this;
        var o = me.objLocTrong;
        var $zone = $("#zoneLocTrong");
        if (!o) { me.bLocXemCaTuan = false; $zone.hide().html(''); return; }
        var bd = me.getGioTiet(o.TU, false), kt = me.getGioTiet(o.DEN, true);
        var fn2 = function (i) { return (i < 10 ? '0' : '') + i; };
        var strGio = bd && kt ? ' (' + fn2(bd.gio) + ':' + fn2(bd.phut) + ' - ' + fn2(kt.gio) + ':' + fn2(kt.phut) + ')' : '';
        var html = '';
        if (o.bBang) {
            // Khoảng nhiều ngày
            var iSoNgay = o.arrNgay.length;
            html = '<i class="fa-solid fa-door-open"></i><span><b>' + o.iTrongDu + ' phòng trống đủ cả ' + iSoNgay + ' ngày</b>';
            if (me.bLocTrongMotPhan) html += ' + ' + (me.dtPhongHocFull.length - o.iTrongDu) + ' phòng trống một phần';
            html += ' — ' + (o.strThu ? 'các ' + o.strThu + ' ' : '') + 'từ ' + me.getThu(o.arrNgay[0]) + ' ' + o.arrNgay[0] + ' đến ' + me.getThu(o.arrNgay[iSoNgay - 1]) + ' ' + o.arrNgay[iSoNgay - 1] + ', tiết ' + o.TU + '-' + o.DEN + strGio + '</span>';
            html += '<span class="lgnp-thanh-loc-nut">';
            html += '<button type="button" class="btn btn-xem" id="btnLocTrong_MotPhan">' + (me.bLocTrongMotPhan ? '<i class="fa-solid fa-check-double me-1"></i>Chỉ phòng trống đủ ' + iSoNgay + ' ngày' : '<i class="fa-solid fa-list me-1"></i>Hiện cả phòng trống một phần (' + o.iTrongMotPhan + ')') + '</button>';
            html += '<button type="button" class="btn btn-bo" id="btnLocTrong_Bo"><i class="fa-solid fa-xmark me-1"></i>Bỏ lọc</button>';
            html += '</span>';
            $zone.html(html).css('display', 'flex');
            return;
        }
        html = '<i class="fa-solid fa-door-open"></i>';
        html += '<span><b>' + me.dtPhongHocFull.length + ' phòng trống</b> ' + me.getThu(o.NGAYHOC) + ' ' + o.NGAYHOC + ', tiết ' + o.TU + '-' + o.DEN + strGio;
        html += me.bLocXemCaTuan ? '' : ' — đang chỉ hiện ngày này';
        html += '</span>';
        html += '<span class="lgnp-thanh-loc-nut">';
        html += '<button type="button" class="btn btn-xem" id="btnLocTrong_CaTuan">' + (me.bLocXemCaTuan ? '<i class="fa-solid fa-calendar-day me-1"></i>Chỉ xem ngày này' : '<i class="fa-solid fa-calendar-week me-1"></i>Xem cả tuần') + '</button>';
        html += '<button type="button" class="btn btn-bo" id="btnLocTrong_Bo"><i class="fa-solid fa-xmark me-1"></i>Bỏ lọc</button>';
        html += '</span>';
        $zone.html(html).css('display', 'flex');
    },

    // Danh sách ngày trong tuần đang xem cho ô "Phòng trống lúc" (giữ thứ đã chọn khi chuyển tuần)
    genCombo_NgayTrong: function () {
        var me = this;
        var $drop = $("#dropLoc_NgayTrong");
        var iThuCu = $drop[0] ? $drop[0].selectedIndex : 0;
        var html = '<option value="">Không lọc</option>';
        if (me.strNgayBatDau && me.strNgayKetThuc) {
            me.getDaysInWeek(me.strNgayBatDau, me.strNgayKetThuc).forEach(function (d) {
                html += '<option value="' + d.date + '">' + d.dayName + ' ' + d.dateStr + '</option>';
            });
        }
        $drop.html(html);
        if (iThuCu > 0 && $drop[0].options.length > iThuCu) $drop[0].selectedIndex = iThuCu;
        $drop.trigger('change.select2'); // cập nhật chữ hiển thị của select2, không tải lại lưới
    },

    // Lọc "Phòng trống" theo Từ ngày - Đến ngày + khung tiết. API TKB_CHUNG.LAYPHONGHOCTRONG nhận 1 ngày/lần gọi
    // → mỗi ngày 1 request (cache + tối đa iMaxConcurrent cùng lúc), tối đa iMaxNgayLoc ngày.
    // 1 ngày: giữ phòng trống ngày đó. Nhiều ngày: giữ phòng trống ĐỦ mọi ngày (bLocTrongMotPhan → cả phòng trống ≥ 1 ngày,
    // xếp phòng trống nhiều ngày lên trước). Không nhập Từ ngày → không lọc. API lỗi → giữ nguyên danh sách + báo lỗi.
    iMaxNgayLoc: 31,
    locPhongTrong: function (dtPhong, callback) {
        var me = this;
        var strTu = me.isoToVn($("#txtLoc_TuNgay").val());
        var strDen = me.isoToVn($("#txtLoc_DenNgay").val()) || strTu;
        me.objLocTrong = null;
        me.strLoiLocTrong = '';
        // Chọn thứ mà không nhập ngày → xét thứ đó trong tuần đang xem
        var strThu = $("#dropLoc_ThuTrong").val() || '';
        if (!strTu && strThu !== '') { strTu = me.strNgayBatDau; strDen = me.strNgayKetThuc; }
        var dTu = me.toDate(strTu), dDen = me.toDate(strDen);
        if (!strTu || !dTu || !dDen) { callback(dtPhong); return; }
        // Khoảng quá dài (gõ nhầm năm...) → chỉ xét 1 năm kể từ Từ ngày
        if ((dDen - dTu) / 86400000 > 366) {
            dDen = new Date(dTu.getFullYear(), dTu.getMonth(), dTu.getDate() + 366);
            strDen = me.returnTwo(dDen.getDate()) + '/' + me.returnTwo(dDen.getMonth() + 1) + '/' + dDen.getFullYear();
        }
        var arrNgay = me.getDaysInWeek(strTu, strDen).map(function (d) { return d.date; });
        if (arrNgay.length === 0) arrNgay = [strTu];
        if (strThu !== '') {
            arrNgay = arrNgay.filter(function (strNgay) { return String(me.toDate(strNgay).getDay()) === strThu; });
            if (arrNgay.length === 0) {
                me.strLoiLocTrong = 'Khoảng ngày đã chọn không có ' + $("#dropLoc_ThuTrong option:selected").text() + ' nào — chưa lọc phòng trống.';
                callback(dtPhong);
                return;
            }
        }
        if (arrNgay.length > me.iMaxNgayLoc) {
            arrNgay = arrNgay.slice(0, me.iMaxNgayLoc);
            me.strLoiLocTrong = 'Khoảng ngày lọc phòng trống tối đa ' + me.iMaxNgayLoc + ' ngày — đang tính tới ' + arrNgay[arrNgay.length - 1] + '.';
            if ($("#txtLoc_TuNgay").val()) $("#txtLoc_DenNgay").val(me.vnToIso(arrNgay[arrNgay.length - 1]));
        }
        var arrTiet = ($("#dropLoc_TietTrong").val() || '1-3').split('-');
        var iTu = parseInt(arrTiet[0], 10), iDen = parseInt(arrTiet[1], 10);
        // Loại phòng KHÔNG gửi BE (gửi 'LT'/'TH' nghi bị proc trả 0 phòng) — đã lọc ở FE trong locPhongHoc, 1 kết quả/ngày dùng chung mọi loại
        var strLoai = '';
        var o = me.objLocTrong = { NGAYHOC: arrNgay[0], arrNgay: arrNgay, strThu: strThu !== '' ? $("#dropLoc_ThuTrong option:selected").text() : '', TU: iTu, DEN: iDen, objTrong: {}, objSoNgay: {}, iTrongDu: 0, iTrongMotPhan: 0 };
        // Vẽ dạng bảng phòng × ngày khi lọc nhiều ngày, hoặc 1 ngày nằm ngoài tuần đang xem (lưới tuần không có ngày đó)
        var dNgayDau = me.toDate(arrNgay[0]);
        o.bBang = arrNgay.length > 1 || dNgayDau < me.toDate(me.strNgayBatDau) || dNgayDau > me.toDate(me.strNgayKetThuc);
        var iToken = me.iLoadToken;

        var iTiep = 0, iXong = 0, strLoi = '';
        var fnXongHet = function () {
            if (iToken !== me.iLoadToken) return;
            if (strLoi) {
                me.strLoiLocTrong = 'Chưa lọc được phòng trống — BE báo: ' + strLoi + '. Đang hiện tất cả phòng.';
                me.objLocTrong = null;
                callback(dtPhong);
                return;
            }
            var dtCo = [];
            dtPhong.forEach(function (p) {
                var iSo = 0;
                arrNgay.forEach(function (strNgay) { if (o.objTrong[strNgay][String(p.ID)]) iSo++; });
                o.objSoNgay[String(p.ID)] = iSo;
                if (iSo === arrNgay.length) o.iTrongDu++;
                else if (iSo > 0) o.iTrongMotPhan++;
                if (iSo === arrNgay.length || (iSo > 0 && me.bLocTrongMotPhan)) dtCo.push(p);
            });
            // Phòng trống nhiều ngày hơn lên trước; cùng số ngày giữ thứ tự danh mục
            if (me.bLocTrongMotPhan && arrNgay.length > 1) {
                dtCo = dtCo.map(function (p, i) { return { p: p, i: i }; })
                    .sort(function (a, b) { return (o.objSoNgay[String(b.p.ID)] - o.objSoNgay[String(a.p.ID)]) || (a.i - b.i); })
                    .map(function (x) { return x.p; });
            }
            callback(dtCo);
        };
        var fnChay = function () {
            if (iToken !== me.iLoadToken || iTiep >= arrNgay.length) return;
            var strNgay = arrNgay[iTiep++];
            me.getDS_PhongTrong(strNgay, iTu, iDen, strLoai, function (dtTrong, strLoiNgay) {
                var objNgay = o.objTrong[strNgay] = {};
                if (dtTrong) dtTrong.forEach(function (r) { objNgay[String(r.ID || r.IDPHONGHOC || r.TKB_PHONGHOC_ID)] = 1; });
                else if (!strLoi) strLoi = strLoiNgay || 'lỗi';
                iXong++;
                if (arrNgay.length > 1) $("#lblTienDoTai").text('(phòng trống ' + iXong + '/' + arrNgay.length + ' ngày)');
                if (iXong === arrNgay.length) fnXongHet();
                else fnChay();
            });
        };
        for (var i = 0; i < Math.min(me.iMaxConcurrent, arrNgay.length); i++) fnChay();
    },

    // Phòng trống của 1 ngày + khung tiết (cache theo ngày|tiết|loại). callback(dt) hoặc callback(null, strLoi)
    getDS_PhongTrong: function (strNgay, iTu, iDen, strLoai, callback) {
        var me = this;
        var bd = me.getGioTiet(iTu, false), kt = me.getGioTiet(iDen, true);
        var strKey = 'T|' + strNgay + '|' + iTu + '|' + iDen + '|' + strLoai;
        var objCache = me.objCacheLich[strKey];
        if (objCache && (new Date().getTime() - objCache.t) < me.iCacheTTL) { callback(objCache.data); return; }

        me.goiMotLan(strKey, function (fnXong) {
            var obj_save = {
                'action': 'SV_TKB_Chung_MH/DQAYEQkODwYJDgIVEw4PBgPP',
                'func': 'TKB_CHUNG.LAYPHONGHOCTRONG',
                'iM': edu.system.iM,
                'strNgay': strNgay,
                'dGioBatDau': bd.gio,
                'dPhutBatDau': bd.phut,
                'dGioKetThuc': kt.gio,
                'dPhutKetThuc': kt.phut,
                'strKieuPhong': strLoai,
                'dSucChuaTu': null,     // sức chứa + tòa nhà đã lọc ở FE (locPhongHoc / LayDSPhongHoc)
                'dSucChuaDen': null,
                'dIdToaNha': null,
                'strIdLichBoQua': '',
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var dt = data.Data || [];
                        me.objCacheLich[strKey] = { t: new Date().getTime(), data: dt };
                        fnXong(dt);
                    } else {
                        console.error("LAYPHONGHOCTRONG lỗi:", data, "tham số:", obj_save);
                        fnXong(null, data.Message || 'BE trả Success=false, không có Message');
                    }
                },
                error: function (er) {
                    console.error("LAYPHONGHOCTRONG lỗi kết nối:", er, "tham số:", obj_save);
                    fnXong(null, 'lỗi kết nối' + (er && er.status ? ' HTTP ' + er.status : ''));
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save,
            }, false, false, false, null);
        }, callback);
    },

    // Bảng phòng trống theo khoảng ngày: mỗi phòng 1 dòng, mỗi ngày 1 cột (Trống / Có lịch ở khung tiết đang lọc).
    // Bấm ô Trống → đổi lịch vào phòng + ngày + tiết đó.
    genTable_KhoangNgay: function () {
        var me = this;
        var o = me.objLocTrong;
        var iSoNgay = o.arrNgay.length;
        var html = '<div class="kn-head kn-goc" style="grid-column: 1; grid-row: 1;">Phòng</div>';
        html += '<div class="kn-head" style="grid-column: 2; grid-row: 1;">Trống<small>tiết ' + o.TU + '-' + o.DEN + '</small></div>';
        o.arrNgay.forEach(function (strNgay, i) {
            var strThu = me.getThu(strNgay);
            html += '<div class="kn-head' + (strThu === 'CN' ? ' kn-cn' : '') + '" style="grid-column: ' + (3 + i) + '; grid-row: 1;">' + strThu + '<small>' + strNgay.substring(0, 5) + '</small></div>';
        });
        me.dtPhongHocFull.forEach(function (room, iPhong) {
            var iDong = iPhong + 2;
            var strId = String(room.ID);
            var iSucChua = me.getSucChua(room);
            var arrMoTa = [];
            if (iSucChua !== null) arrMoTa.push(iSucChua + ' chỗ');
            if (room.KIEUPHONG) arrMoTa.push(room.KIEUPHONG);
            var iSo = o.objSoNgay[strId] || 0;
            html += '<div class="kn-phong" style="grid-column: 1; grid-row: ' + iDong + ';">' + me.getTenPhong(room) + (arrMoTa.length ? '<small>' + arrMoTa.join(' · ') + '</small>' : '') + '</div>';
            html += '<div class="kn-dem' + (iSo === iSoNgay ? ' du' : '') + '" style="grid-column: 2; grid-row: ' + iDong + ';">' + iSo + '/' + iSoNgay + ' ngày</div>';
            o.arrNgay.forEach(function (strNgay, i) {
                var strViTri = ' style="grid-column: ' + (3 + i) + '; grid-row: ' + iDong + ';"';
                if (o.objTrong[strNgay][strId]) {
                    html += '<div class="kn-o is-free"' + strViTri + ' data-room-id="' + strId + '" data-date="' + strNgay + '" data-tu="' + o.TU + '" data-den="' + o.DEN
                        + '" title="Bấm để đổi lịch vào phòng này, ' + me.getThu(strNgay) + ' ' + strNgay + ' tiết ' + o.TU + '-' + o.DEN + '">Trống</div>';
                } else {
                    html += '<div class="kn-o is-busy"' + strViTri + ' title="Đã có lịch trong khung tiết ' + o.TU + '-' + o.DEN + '">Có lịch</div>';
                }
            });
        });
        $("#scheduleGrid").addClass("lgnp-khoang").css("--so-ngay", iSoNgay).html(html);
        me.capNhatCheDoLuoi();
    },

    // Danh sách phòng gần như không đổi trong phiên → cache theo tòa nhà, mỗi tòa chỉ gọi LayDSPhongHoc 1 lần
    getDS_PhongHoc_Cache: function (strToaNha_Id, callback) {
        var me = this;
        strToaNha_Id = strToaNha_Id || '';
        if (me.objCachePhong[strToaNha_Id]) {
            callback(me.objCachePhong[strToaNha_Id]);
            return;
        }
        me.goiMotLan('P|' + strToaNha_Id, function (fnXong) {
            var obj_save = {
                'action': 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP',
                'func': 'pkg_congthongtincanbo.LayDSPhongHoc',
                'iM': edu.system.iM,
                'strNguoiThucHien_Id': edu.system.userId,
                'strTKB_ToaNha_Id': strToaNha_Id, // Tham số lọc theo tòa nhà ('' = tất cả)
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var dtPhong = data.Data || [];
                        me.objCachePhong[strToaNha_Id] = dtPhong;
                        if (dtPhong.length > 0) console.log("Các cột phòng học từ API:", Object.keys(dtPhong[0]));
                        fnXong(dtPhong);
                    } else {
                        console.error("API failed:", data.Message);
                        fnXong([]);
                    }
                },
                error: function (err) {
                    console.error("API error:", err);
                    fnXong([]);
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save,
            }, false, false, false, null);
        }, callback);
    },

    // Lọc danh sách phòng theo: phòng đã chọn (1 hoặc nhiều), loại phòng (KIEUPHONG), sức chứa (Từ - Đến)
    locPhongHoc: function (dtPhong) {
        var me = this;
        var arrPhongHoc_Ids = $("#dropSearch_PhongHocMulti").val() || [];
        var strLoaiPhong = (me.strSelectedRoomType || 'all').toUpperCase();
        var iSucChuaTu = parseInt($("#txtSucChua_Tu").val(), 10);
        var iSucChuaDen = parseInt($("#txtSucChua_Den").val(), 10);
        return dtPhong.filter(function (room) {
            if (arrPhongHoc_Ids.length > 0 && arrPhongHoc_Ids.indexOf(room.ID) === -1) return false;
            if (strLoaiPhong !== 'ALL' && (room.KIEUPHONG || '').toUpperCase() !== strLoaiPhong) return false;
            if (!isNaN(iSucChuaTu) || !isNaN(iSucChuaDen)) {
                var iSucChua = me.getSucChua(room);
                if (iSucChua === null) return false;
                if (!isNaN(iSucChuaTu) && iSucChua < iSucChuaTu) return false;
                if (!isNaN(iSucChuaDen) && iSucChua > iSucChuaDen) return false;
            }
            return true;
        });
    },

    // Gộp các lời gọi trùng khóa khi request trước chưa trả về → bấm/đổi bộ lọc liên tục không bắn request trùng
    goiMotLan: function (strKey, fnGoiApi, callback) {
        var me = this;
        if (me.objDangTai[strKey]) {
            me.objDangTai[strKey].push(callback);
            return;
        }
        me.objDangTai[strKey] = [callback];
        fnGoiApi(function (dt, strLoi) {
            var arrCallback = me.objDangTai[strKey] || [];
            delete me.objDangTai[strKey];
            arrCallback.forEach(function (fn) {
                if (typeof fn === 'function') fn(dt, strLoi);
            });
        });
    },

    getList_LichPhongHoc: function (strPhongHoc_Id, strNgayBatDau, strNgayKetThuc, callback) {
        var me = this;
        var strKey = strPhongHoc_Id + '|' + strNgayBatDau + '|' + strNgayKetThuc;
        var objCache = me.objCacheLich[strKey];
        if (objCache && (new Date().getTime() - objCache.t) < me.iCacheTTL) {
            if (typeof callback === 'function') callback(objCache.data);
            return;
        }

        me.goiMotLan('L|' + strKey, function (fnXong) {
            var obj_save = {
                'action': 'NS_ThongTinCanBo_MH/DSA4DSgiKREpLi8mCS4i',
                'func': 'pkg_congthongtincanbo.LayLichPhongHoc',
                'iM': edu.system.iM,
                'strIdPhongHoc': strPhongHoc_Id,
                'strNgayBatDau': strNgayBatDau,
                'strNgayKetThuc': strNgayKetThuc,
            };

            edu.system.makeRequest({
                success: function (data) {
                    var dtLich = data.Success ? (data.Data || []) : [];
                    if (data.Success) me.objCacheLich[strKey] = { t: new Date().getTime(), data: dtLich };
                    fnXong(dtLich);
                },
                error: function () {
                    fnXong([]);
                },
                type: 'POST',
                action: obj_save.action,
                contentType: true,
                data: obj_save,
            }, false, false, false, null);
        }, callback);
    },

    getList_ToaNha: function () {
        var me = this;
        
        console.log("=== Calling getList_ToaNha ===");
        
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIVLiAPKSAP',
            'func': 'PKG_CONGTHONGTINCANBO.LayDSToaNha',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        console.log("Request:", obj_save);

        edu.system.makeRequest({
            success: function (data) {
                console.log("Response getList_ToaNha:", data);
                
                if (data.Success) {
                    var buildings = data.Data || [];
                    
                    console.log("Tổng số tòa nhà:", buildings.length);
                    console.log("Danh sách tòa nhà:", buildings);
                    
                    me.dtToaNha = buildings;
                    me.genCombo_ToaNha(buildings);
                    me.genCombo_PhongHoc(); // Load danh sách phòng sau khi có tòa nhà
                } else {
                    console.error("API failed:", data.Message);
                }
            },
            error: function(err) {
                console.error("API error:", err);
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },

    genCombo_ToaNha: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTOANHA",
            },
            renderPlace: ["dropSearch_ToaNha"],
            title: "Tất cả tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_ToaNha").select2({
            placeholder: "Chọn tòa nhà...",
            allowClear: true
        });
    },

    genCombo_PhongHoc: function () {
        // Ô chọn phòng: tất cả phòng (dùng chung cache LayDSPhongHoc với lượt tải lịch)
        this.loadPhongHocByToaNha('');
    },

    populateMultiRoomDropdown: function (roomList) {
        var $multi = $("#dropSearch_PhongHocMulti");

        // Destroy Select2 cũ trước khi load options mới
        if ($multi.hasClass("select2-hidden-accessible")) {
            $multi.select2('destroy');
        }

        var options = '';
        roomList.forEach(function(room) {
            options += '<option value="' + room.ID + '">' + room.TEN + '</option>';
        });
        $multi.html(options);

        $multi.select2({
            placeholder: "Chọn nhiều phòng học...",
            allowClear: true,
            multiple: true,
            closeOnSelect: false,
            width: '100%'
        });
    },

    loadPhongHocByToaNha: function (toaNhaId) {
        var me = this;
        me.getDS_PhongHoc_Cache(toaNhaId || '', function (rooms) {
            // Convert rooms to dropdown format
            var roomList = rooms.map(function(room) {
                return {
                    ID: room.ID,
                    TEN: room.TEN || room.TENPHONGHOC || room.MA || 'Phòng ' + room.ID,
                };
            });

            // Sort by name
            roomList.sort(function(a, b) {
                return a.TEN.localeCompare(b.TEN);
            });
            me.dtPhongHocList = roomList;

            // Reset & reload multi-select theo tòa nhà mới
            $("#dropSearch_PhongHocMulti").val(null);
            me.populateMultiRoomDropdown(roomList);
        });
    },

    genTable_ThongTin: function (data) {
        var me = this;

        if (me.dtPhongHoc.length === 0) {
            $("#scheduleGrid").html('<div class="schedule-empty"><i class="fa-solid fa-door-closed"></i><div>Không có dữ liệu phòng học</div></div>');
            return;
        }

        var arrDays = me.getNgayHienThi();
        var html = '';
        $("#scheduleGrid").toggleClass("lgnp-1ngay", arrDays.length === 1);

        // Header: Phòng | Hiệu suất | mỗi ngày 3 cột buổi (Sáng/Chiều/Tối)
        html += '<div class="schedule-header" style="grid-column: 1; grid-row: 1 / 3;">Phòng</div>';
        html += '<div class="schedule-header" style="grid-column: 2; grid-row: 1 / 3;">Hiệu suất<br/>sử dụng</div>';
        arrDays.forEach(function (day, iNgay) {
            var iCot = 3 + iNgay * 3;
            html += '<div class="schedule-header day-end" style="grid-column: ' + iCot + ' / span 3; grid-row: 1;">';
            html += '<div>' + day.dayName + '</div>';
            html += '<div style="font-size: 12px; font-weight: normal;">' + day.dateStr + '</div>';
            html += '</div>';
            me.arrBuoi.forEach(function (buoi, iBuoi) {
                var arrMod = me.arrModule.filter(function (m) { return m.buoi === buoi.key; });
                var strTiet = 'T' + arrMod[0].tu + '-' + arrMod[arrMod.length - 1].den;
                html += '<div class="schedule-subheader' + (iBuoi === me.arrBuoi.length - 1 ? ' day-end' : '') + '" style="grid-column: ' + (iCot + iBuoi) + '; grid-row: 2;">';
                html += '<div class="session-label" style="background: ' + buoi.mau + ';">';
                html += '<i class="fa-duotone ' + buoi.icon + ' session-icon buoi-' + buoi.key + '"></i>';
                html += '<div class="session-name">' + buoi.ten + '</div>';
                html += '<div class="session-time">' + strTiet + '</div>';
                html += '</div>';
                html += '</div>';
            });
        });

        me.iNextRow = 3;
        html += me.genHtml_DongPhong(me.dtPhongHoc, arrDays, data);
        $("#scheduleGrid").html(html);

        me.capNhatCheDoLuoi();

        // Dòng buổi (Sáng/Chiều/Tối) dính ngay dưới dòng ngày: đo chiều cao thật (CSS cố định top 60px bị che khi cuộn)
        var iCaoDongNgay = $("#scheduleGrid .schedule-header.day-end").first().outerHeight();
        if (iCaoDongNgay) $("#scheduleGrid .schedule-subheader").css("top", iCaoDongNgay + "px");

        me.genHtml_ThongBaoCuon();
    },

    // Vẽ các phòng: mỗi phòng chiếm 2 dòng grid (module trên / module dưới của mỗi buổi)
    genHtml_DongPhong: function (rooms, arrDays, data) {
        var me = this;
        var html = '';

        // Gom lịch theo phòng và theo phòng + ngày 1 lần (tránh filter cả mảng cho từng ô)
        var objTheoPhong = {};
        var objTheoPhongNgay = {};
        data.forEach(function (item) {
            var strKey = item.IDPHONGHOC + '|' + item.NGAYHOC;
            (objTheoPhong[item.IDPHONGHOC] = objTheoPhong[item.IDPHONGHOC] || []).push(item);
            (objTheoPhongNgay[strKey] = objTheoPhongNgay[strKey] || []).push(item);
        });

        var modeLabel = me.getEfficiencyModeLabel();
        // Hiệu suất luôn tính trên cả tuần, kể cả khi lưới chỉ vẽ 1 ngày (đang lọc phòng trống)
        var arrDaysTuan = me.getDaysInWeek(me.strNgayBatDau, me.strNgayKetThuc);
        rooms.forEach(function (room) {
            var iDong = me.iNextRow;

            // Tính hiệu suất sử dụng phòng
            var efficiency = me.calculateEfficiency(objTheoPhong[room.ID] || [], arrDaysTuan);

            // Xác định màu sắc
            var efficiencyClass = 'low';
            var efficiencyLabel = 'Thấp';
            if (efficiency > 60) {
                efficiencyClass = 'high';
                efficiencyLabel = 'Cao';
            } else if (efficiency > 30) {
                efficiencyClass = 'medium';
                efficiencyLabel = 'Trung bình';
            }

            html += '<div class="schedule-cell room-name" style="grid-column: 1; grid-row: ' + iDong + ' / span 2;"><div>' + me.genHtml_ThongTinPhong(room) + '</div></div>';

            // Cột hiệu suất
            html += '<div class="schedule-cell efficiency ' + efficiencyClass + '" style="grid-column: 2; grid-row: ' + iDong + ' / span 2;">';
            html += '<div class="efficiency-percent">' + efficiency + '%</div>';
            html += '<div class="efficiency-label">' + efficiencyLabel + '</div>';
            html += '<div class="efficiency-bar">';
            html += '<div class="efficiency-bar-fill" style="width: ' + efficiency + '%"></div>';
            html += '</div>';
            html += '<div style="font-size: 9px; margin-top: 4px; opacity: 0.7;">' + modeLabel + '</div>';
            html += '</div>';

            arrDays.forEach(function (day, iNgay) {
                var events = objTheoPhongNgay[room.ID + '|' + day.date] || [];
                me.arrBuoi.forEach(function (buoi, iBuoi) {
                    html += me.genHtml_Buoi(events, room, day, buoi.key, 3 + iNgay * 3 + iBuoi, iDong);
                });
            });

            me.iNextRow += 2;
        });
        return html;
    },

    // Ô tên phòng: tên + sức chứa + kiểu phòng (LT/TH) + mô tả
    genHtml_ThongTinPhong: function (room) {
        var me = this;
        var roomInfo = me.genHtml_RoomName(room);

        // Thêm kiểu phòng nếu có
        if (room.KIEUPHONG) {
            roomInfo += '<div style="font-size: 10px; color: #666; margin-bottom: 2px;">';
            roomInfo += '<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-weight: 600;">' + room.KIEUPHONG + '</span>';
            roomInfo += '</div>';
        }

        // Thêm mô tả kiểu phòng
        var moTa = room.MOTAKIEUPHONG;
        if (!moTa && room.KIEUPHONG === 'TH') {
            moTa = 'Phòng thực hành';
        }
        if (moTa) {
            roomInfo += '<div style="font-size: 9px; color: #888; font-style: italic;">' + moTa + '</div>';
        }
        return roomInfo;
    },

    // 1 cột buổi của 1 ngày: Sáng/Chiều = 2 module xếp trên/dưới (lịch dài hơn 3 tiết thì tràn cả 2 ô),
    // Tối = 1 module chiếm trọn 2 dòng. Module không có lịch hiện "Trống".
    genHtml_Buoi: function (events, room, day, strBuoi, iCot, iDong) {
        var me = this;
        var arrMod = me.arrModule.filter(function (m) { return m.buoi === strBuoi; });
        var html = '';
        me.chiaKhoiModule(events, arrMod).forEach(function (khoi, i) {
            if (!khoi) return; // module đã nằm trong khối phía trên
            var iSoDong = arrMod.length === 1 ? 2 : khoi.rowspan;
            var strClass = 'schedule-module buoi-' + strBuoi;
            if (strBuoi === 'toi') strClass += ' day-end';
            if (i === 0 && iSoDong === 1) strClass += ' module-top';
            strClass += khoi.events.length > 0 ? ' is-busy' : ' is-free';
            // Ô trống nằm trong khung đang lọc "Phòng trống lúc" → viền xanh
            var oLoc = me.objLocTrong;
            if (oLoc && !khoi.events.length && day.date === oLoc.NGAYHOC && arrMod[i].tu <= oLoc.DEN && arrMod[i + (iSoDong > 1 && arrMod.length > 1 ? 1 : 0)].den >= oLoc.TU) strClass += ' o-loc';

            // Ô trống mang theo phòng/ngày/tiết → bấm vào là đổi lịch vào đó (chonOTrong)
            var strDataOTrong = khoi.events.length > 0 ? '' : ' data-room-id="' + room.ID + '" data-date="' + day.date
                + '" data-tu="' + arrMod[i].tu + '" data-den="' + arrMod[i].den + '" title="Bấm để đổi lịch vào phòng này, tiết ' + arrMod[i].tu + '-' + arrMod[i].den + '"';
            html += '<div class="' + strClass + '" style="grid-column: ' + iCot + '; grid-row: ' + (iDong + i) + ' / span ' + iSoDong + ';"' + strDataOTrong + '>';
            if (khoi.events.length === 0) {
                html += '<div class="module-free"><span>T' + arrMod[i].tu + '-' + arrMod[i].den + '</span><b class="nhan">Trống</b><em class="goi-y">+ Đổi lịch</em></div>';
            } else {
                khoi.events.forEach(function (event, idx) {
                    html += me.genHtml_SuKien(event, room, day, strBuoi, idx);
                });
            }
            html += '</div>';
        });
        return html;
    },

    // Chia module thành khối: các module liên tiếp bị cùng 1 lịch chạm vào thì gộp thành 1 khối (tràn ô).
    // Trả mảng cùng độ dài arrMod: phần tử đầu khối = { rowspan, events }, module đã bị gộp = null.
    // Module bị chiếm dù chỉ 1 tiết vẫn tính là bận (không xếp được lớp 3 tiết vào đó).
    chiaKhoiModule: function (events, arrMod) {
        var me = this;
        var arrLich = [];
        events.forEach(function (e) {
            var k = me.getKhoangTiet(e);
            if (!k) return;
            var a = -1;
            var b = -1;
            arrMod.forEach(function (m, i) {
                if (k.tu <= m.den && k.den >= m.tu) {
                    if (a === -1) a = i;
                    b = i;
                }
            });
            if (a !== -1) arrLich.push({ e: e, a: a, b: b, tu: k.tu });
        });

        var arrKhoi = [];
        var i = 0;
        while (i < arrMod.length) {
            // Nới khối tới module xa nhất mà các lịch trong khối kéo dài tới
            var iCuoi = i;
            var bMoRong = true;
            while (bMoRong) {
                bMoRong = false;
                arrLich.forEach(function (x) {
                    if (x.a <= iCuoi && x.b > iCuoi) {
                        iCuoi = x.b;
                        bMoRong = true;
                    }
                });
            }
            var iDau = i;
            var arrTrongKhoi = arrLich.filter(function (x) { return x.a <= iCuoi && x.b >= iDau; });
            arrTrongKhoi.sort(function (x, y) {
                return (x.tu - y.tu) || (me.getPhutBatDau(x.e) - me.getPhutBatDau(y.e));
            });
            arrKhoi.push({ rowspan: iCuoi - i + 1, events: arrTrongKhoi.map(function (x) { return x.e; }) });
            for (var j = i + 1; j <= iCuoi; j++) arrKhoi.push(null);
            i = iCuoi + 1;
        }
        return arrKhoi;
    },

    // Khoảng tiết của 1 lịch (ước lượng theo giờ nếu API thiếu tiết). null nếu không xác định được.
    getKhoangTiet: function (event) {
        var range = this.getTietRange(event);
        var tu = parseInt(range.batDau, 10);
        var den = parseInt(range.ketThuc, 10);
        if (isNaN(tu)) return null;
        if (isNaN(den) || den < tu) den = tu;
        return { tu: tu, den: den };
    },

    getPhutBatDau: function (event) {
        return (parseInt(event.GIOBATDAU, 10) || 0) * 60 + (parseInt(event.PHUTBATDAU, 10) || 0);
    },

    // Thẻ 1 lịch học (click mở chi tiết)
    genHtml_SuKien: function (event, room, day, strBuoi, idx) {
        var me = this;
        var colorClass = me.getColorClass(event.IDLOPHOCPHAN);
        var uniqueId = event.ID || ('evt_' + room.ID + '_' + day.date + '_' + strBuoi + '_' + idx);
        var giangVien = me.cleanHtmlTags(event.THONGTINGIANGVIEN);
        // Thẻ trong ô hẹp bị cắt dòng → tooltip hiện đủ: học phần, giờ/tiết, giảng viên
        var strTooltip = event.TENHOCPHAN + '\n' + me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) + ' - '
            + me.returnTwo(event.GIOKETTHUC) + ':' + me.returnTwo(event.PHUTKETTHUC)
            + (event.TIETBATDAU ? ' (Tiết ' + event.TIETBATDAU + '-' + event.TIETKETTHUC + ')' : '')
            + (giangVien ? '\n' + giangVien : '');
        var html = '<div class="schedule-event ' + colorClass + '" data-event-id="' + uniqueId + '" data-room-id="' + room.ID + '" data-date="' + day.date + '" data-lophocphan="' + event.IDLOPHOCPHAN + '" title="' + me.escAttr(strTooltip) + '">';
        // Đầu thẻ đổ màu chữ trắng (giờ + học phần), thân thẻ trắng (giảng viên) — giống thẻ trang Thời khóa biểu cá nhân
        html += '<div class="event-head">';
        html += '<div class="event-time">' + me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) + (event.TIETBATDAU ? ' (T' + event.TIETBATDAU + '-' + event.TIETKETTHUC + ')' : '') + '</div>';
        html += '<div class="event-subject">' + event.TENHOCPHAN + '</div>';
        html += '</div>';
        if (giangVien) {
            html += '<div class="event-teacher">' + giangVien + '</div>';
        }
        html += '</div>';
        return html;
    },

    // Escape cho giá trị đặt trong attribute (tên học phần có dấu " làm vỡ thẻ)
    escAttr: function (str) {
        return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    },

    showScheduleDetail: function (strId, roomId, date, lopHocPhan) {
        var me = this;
        
        console.log("=== Show Schedule Detail ===");
        console.log("ID:", strId, "Room:", roomId, "Date:", date, "LopHocPhan:", lopHocPhan);
        console.log("Total schedules:", me.dtLichHoc.length);
        
        // Try to find by ID first
        var objLich = me.dtLichHoc.find(function(e) { return e.ID === strId; });
        
        // If not found by ID, try to find by other properties
        if (!objLich && roomId && date && lopHocPhan) {
            console.log("Searching by room, date, and lophocphan...");
            objLich = me.dtLichHoc.find(function(e) { 
                return e.IDPHONGHOC === roomId && 
                       e.NGAYHOC === date && 
                       e.IDLOPHOCPHAN === lopHocPhan;
            });
        }
        
        console.log("Found schedule:", objLich);
        
        if (!objLich) {
            console.error("Không tìm thấy lịch với ID:", strId);
            edu.system.alert("Không tìm thấy thông tin lịch học!");
            return;
        }
        
        // Học phần
        $("#lblHocPhan").html(objLich.TENHOCPHAN || 'Chưa có thông tin');
        
        // Lớp học phần
        $("#lblLopHocPhan").html('Lớp: ' + (objLich.TENLOPHOCPHAN || 'Chưa có thông tin'));
        
        // Phòng học
        $("#txtPhongHoc_Detail").val(objLich.TENPHONGHOC || 'Chưa có thông tin');
        
        // Ngày học
        $("#txtNgayHoc_Detail").val(objLich.NGAYHOC || 'Chưa có thông tin');
        
        // Thời gian
        var thoiGian = me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + 
                       ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC);
        $("#txtThoiGian_Detail").val(thoiGian);
        
        // Tiết học (fallback theo giờ nếu API không trả TIETBATDAU/TIETKETTHUC)
        var tietRange = me.getTietRange(objLich);
        var tietHoc = 'Tiết ' + (tietRange.batDau || '?') + ' - ' + (tietRange.ketThuc || '?');
        $("#txtTietHoc_Detail").val(tietHoc);
        
        // Giảng viên - Remove <br> tags
        var giangVienText = me.cleanHtmlTags(objLich.THONGTINGIANGVIEN) || 'Chưa có thông tin';
        $("#txtGiangVien_Detail").val(giangVienText);

        // Buổi này là của giảng viên đang đăng nhập → hiện nút "Yêu cầu đổi lịch"
        var iToken = ++me.iTokenChiTiet;
        $("#btnDetail_DoiLich").hide();
        me.objLopDoi = null;
        me.getLichCuaToi(me.strNgayBatDau, me.strNgayKetThuc, function (dtCuaToi) {
            if (iToken !== me.iTokenChiTiet) return;
            var objCuaToi = me.timLichCuaToi(objLich, dtCuaToi);
            if (!objCuaToi) return;
            me.objLopDoi = objCuaToi;
            $("#btnDetail_DoiLich").show();
        });

        // Show modal
        try {
            var modalEl = document.getElementById('modal_detail');
            if (modalEl) {
                if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    var modal = new bootstrap.Modal(modalEl);
                    modal.show();
                } else {
                    $("#modal_detail").modal("show");
                }
                console.log("Modal opened successfully");
            } else {
                console.error("Modal element not found!");
            }
        } catch (e) {
            console.error("Error opening modal:", e);
            $("#modal_detail").modal("show");
        }
    },

    /*------------------------------------------
    --Đổi lịch ngay trên trang (giảng viên)
    --Luồng 1: bấm ô "Trống" → chọn buổi dạy của mình trong tuần → modal yêu cầu đổi lịch điền sẵn ngày/tiết/phòng.
    --Luồng 2: bấm thẻ lớp của mình trên lưới → nút "Yêu cầu đổi lịch" trong modal chi tiết.
    --API + tham số giống hệt trang Thời khóa biểu cá nhân (lichgiang.js): LayDSLichGiang,
    --KhoiTaoThongTinYeuCauDoiLich, KiemTraLichCanDoi, GuiYeuCauDoiLich.
    -------------------------------------------*/
    // Mở / đóng modal Bootstrap 5 (fnSau chạy sau khi modal đóng hẳn — tránh chồng 2 modal)
    moModal: function (strId) {
        var el = document.getElementById(strId);
        if (!el) return;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) bootstrap.Modal.getOrCreateInstance(el).show();
        else $(el).modal("show");
    },

    dongModal: function (strId, fnSau) {
        var el = document.getElementById(strId);
        if (!el || !$(el).hasClass("show")) {
            if (typeof fnSau === 'function') fnSau();
            return;
        }
        if (typeof fnSau === 'function') $(el).one("hidden.bs.modal", fnSau);
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) bootstrap.Modal.getOrCreateInstance(el).hide();
        else $(el).modal("hide");
    },

    // Lịch dạy của người đăng nhập trong khoảng ngày (API của trang Thời khóa biểu cá nhân) — cache theo tuần
    getLichCuaToi: function (strNgayBatDau, strNgayKetThuc, callback) {
        var me = this;
        var strKey = strNgayBatDau + '|' + strNgayKetThuc;
        if (me.objLichCuaToi[strKey]) {
            callback(me.objLichCuaToi[strKey]);
            return;
        }
        me.goiMotLan('G|' + strKey, function (fnXong) {
            var obj_list = {
                'action': 'NS_ThongTinCanBo/LayDSLichGiang',
                'type': 'GET',
                'strNhanSu_HoSoCanBo_Id': edu.system.userId,
                'strNgayBatDau': strNgayBatDau,
                'strNgayKetThuc': strNgayKetThuc,
                'strNgayDangChon': strNgayBatDau,
            };
            edu.system.makeRequest({
                success: function (data) {
                    var dtLich = data.Success ? (data.Data || []) : [];
                    if (data.Success) me.objLichCuaToi[strKey] = dtLich;
                    fnXong(dtLich);
                },
                error: function () {
                    fnXong([]);
                },
                type: 'GET',
                action: obj_list.action,
                contentType: true,
                data: obj_list,
            }, false, false, false, null);
        }, callback);
    },

    // Buổi học trên lưới (LayLichPhongHoc) có trong lịch dạy của mình không → trả bản ghi lịch cá nhân tương ứng
    timLichCuaToi: function (objLich, dtCuaToi) {
        return (dtCuaToi || []).find(function (x) {
            if (x.NGAYHOC !== objLich.NGAYHOC) return false;
            if (x.IDLICHHOC && objLich.IDLICHHOC) return x.IDLICHHOC === objLich.IDLICHHOC;
            return x.IDLOPHOCPHAN === objLich.IDLOPHOCPHAN && String(x.TIETBATDAU) === String(objLich.TIETBATDAU);
        }) || null;
    },

    // Loại phòng (LT/TH) theo ID — tra danh sách phòng đã cache từ LayDSPhongHoc. '' nếu không rõ.
    getKieuPhong: function (strPhongId) {
        var me = this;
        var arrNguon = (me.objCachePhong[''] || []).concat(me.dtPhongHocOriginal || []);
        var room = arrNguon.find(function (x) { return String(x.ID) === String(strPhongId); });
        return room ? String(room.KIEUPHONG || '').toUpperCase() : '';
    },

    getTenLoaiPhong: function (strLoai) {
        if (strLoai === 'TH') return 'thực hành (TH)';
        if (strLoai === 'LT') return 'lý thuyết (LT)';
        return strLoai;
    },

    getThu: function (strNgay) {
        var d = this.toDate(strNgay);
        return d ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()] : '';
    },

    // dd/MM/yyyy ↔ yyyy-MM-dd (ô input type="date")
    vnToIso: function (strNgay) {
        var arr = (strNgay || '').split('/');
        return arr.length === 3 ? arr[2] + '-' + this.returnTwo(arr[1]) + '-' + this.returnTwo(arr[0]) : '';
    },

    isoToVn: function (strNgay) {
        var arr = (strNgay || '').split('-');
        return arr.length === 3 ? arr[2] + '/' + arr[1] + '/' + arr[0] : '';
    },

    // Bấm 1 ô "Trống" → mở modal chọn buổi dạy của mình để chuyển vào ô này
    chonOTrong: function ($o) {
        var me = this;
        var strRoomId = $o.attr("data-room-id");
        var room = me.dtPhongHoc.find(function (r) { return String(r.ID) === strRoomId; }) || {};
        me.objDichDoi = {
            IDPHONGHOC: strRoomId,
            TENPHONG: me.getTenPhong(room),
            SUCCHUA: me.getSucChua(room),
            KIEUPHONG: String(room.KIEUPHONG || '').toUpperCase(),
            NGAYHOC: $o.attr("data-date"),
            TU: parseInt($o.attr("data-tu"), 10),
            DEN: parseInt($o.attr("data-den"), 10)
        };
        $("#scheduleGrid .o-dang-chon").removeClass("o-dang-chon");
        $o.addClass("o-dang-chon");

        var d = me.objDichDoi;
        var html = '<span class="icon"><i class="fa-solid fa-door-open"></i></span>';
        html += '<div><div class="ten">Phòng ' + d.TENPHONG + (d.SUCCHUA !== null ? ' · ' + d.SUCCHUA + ' chỗ' : '') + (d.KIEUPHONG ? ' · ' + d.KIEUPHONG : '') + '</div>';
        html += '<div class="mota">' + me.getThu(d.NGAYHOC) + ' ' + d.NGAYHOC + ' · Tiết ' + d.TU + '-' + d.DEN + ' đang trống</div></div>';
        $("#zoneDoi_Dich").html(html);
        $("#zoneDoi_DSLop").html('<div class="lgnp-ds-trong"><i class="fas fa-spinner fa-spin"></i><div>Đang tải lịch dạy của bạn...</div></div>');
        me.moModal("modal_chon_lop_doi");

        me.getLichCuaToi(me.strNgayBatDau, me.strNgayKetThuc, function (dtLich) {
            me.genHtml_DSLopCuaToi(dtLich);
        });
    },

    // Danh sách buổi dạy của mình trong tuần: buổi cùng ngày + nằm gọn trong ô trống (chỉ đổi phòng) xếp lên đầu
    genHtml_DSLopCuaToi: function (dtLich) {
        var me = this;
        var d = me.objDichDoi;
        if (!dtLich || dtLich.length === 0) {
            me.dtLopCuaToiDangChon = [];
            $("#zoneDoi_DSLop").html('<div class="lgnp-ds-trong"><i class="fa-solid fa-calendar-xmark"></i><div>Bạn không có buổi dạy nào trong tuần này ('
                + me.strNgayBatDau + ' - ' + me.strNgayKetThuc + ').</div></div>');
            return;
        }
        var arr = dtLich.map(function (x) {
            var k = me.getKhoangTiet(x) || { tu: 0, den: 0 };
            var dNgay = me.toDate(x.NGAYHOC);
            var strLoai = me.getKieuPhong(x.IDPHONGHOC);
            return {
                x: x,
                k: k,
                strLoai: strLoai,
                // Chỉ đổi sang phòng cùng loại: lớp TH (phòng máy) không vào phòng LT và ngược lại
                bSaiLoai: !!(strLoai && d.KIEUPHONG && strLoai !== d.KIEUPHONG),
                bCungGio: x.NGAYHOC === d.NGAYHOC && k.tu >= d.TU && k.den <= d.DEN,
                iNgay: dNgay ? dNgay.getTime() : 0
            };
        });
        arr.sort(function (a, b) {
            return (a.bSaiLoai - b.bSaiLoai) || (b.bCungGio - a.bCungGio) || (a.iNgay - b.iNgay) || (a.k.tu - b.k.tu);
        });
        me.dtLopCuaToiDangChon = arr.map(function (a) { return a.x; });

        var html = '';
        arr.forEach(function (a, i) {
            var x = a.x;
            var iSoTiet = a.k.den - a.k.tu + 1;
            html += '<button type="button" class="lgnp-lop-item' + (a.bSaiLoai ? ' khoa' : '') + '" data-idx="' + i + '"' + (a.bSaiLoai ? ' disabled' : '') + '>';
            html += '<span class="ngay"><b>' + me.getThu(x.NGAYHOC) + '</b><span>' + (x.NGAYHOC || '').substr(0, 5) + '</span></span>';
            html += '<span class="noidung">';
            html += '<span class="ten">' + (x.TENHOCPHAN || '') + '</span>';
            html += '<span class="mota">Tiết ' + a.k.tu + '-' + a.k.den + ' · ' + me.returnTwo(x.GIOBATDAU) + ':' + me.returnTwo(x.PHUTBATDAU)
                + ' · Phòng ' + (x.TENPHONGHOC || '?') + (x.TENLOPHOCPHAN ? ' · ' + x.TENLOPHOCPHAN : '') + '</span>';
            if (a.bSaiLoai) html += '<span class="lgnp-tag sai-loai">Lớp học phòng ' + me.getTenLoaiPhong(a.strLoai) + ' — không đổi sang phòng ' + d.KIEUPHONG + '</span>';
            else if (a.bCungGio) html += '<span class="lgnp-tag cung-gio">Cùng giờ — chỉ đổi phòng</span>';
            else if (iSoTiet > d.DEN - d.TU + 1) html += '<span class="lgnp-tag dai">' + iSoTiet + ' tiết — dài hơn ô trống</span>';
            html += '</span>';
            html += a.bSaiLoai ? '<span class="chon"><i class="fa-solid fa-lock"></i></span>' : '<span class="chon">Chọn <i class="fa-solid fa-chevron-right"></i></span>';
            html += '</button>';
        });
        $("#zoneDoi_DSLop").html(html);
    },

    // Mở modal yêu cầu đổi lịch cho 1 buổi dạy (objDich = ô trống đã chọn, null nếu mở từ thẻ lớp)
    moDoiLich: function (objLop, objDich) {
        var me = this;
        if (!objLop) return;
        me.objLopDoi = objLop;
        me.objDichDoi = objDich;
        me.dtGiangVienThayDoi = [];
        me.strLoaiPhongDoi = '';
        $("#lblDL_GoiYPhong").text('');

        var k = me.getKhoangTiet(objLop) || { tu: objLop.TIETBATDAU, den: objLop.TIETKETTHUC };
        $("#lblDL_TieuDe").text((objLop.TENHOCPHAN || '') + (objLop.TENLOPHOCPHAN ? ' · Lớp: ' + objLop.TENLOPHOCPHAN : ''));
        $("#lblDL_Cu").text(me.getThu(objLop.NGAYHOC) + ' ' + (objLop.NGAYHOC || '') + ' · Tiết ' + k.tu + '-' + k.den
            + ' (' + me.returnTwo(objLop.GIOBATDAU) + ':' + me.returnTwo(objLop.PHUTBATDAU) + ' - ' + me.returnTwo(objLop.GIOKETTHUC) + ':' + me.returnTwo(objLop.PHUTKETTHUC) + ')'
            + ' · Phòng ' + (objLop.TENPHONGHOC || '?'));
        $("#zoneDL_Form, #zoneDL_KetQua, #zoneDL_CanhBao").hide();
        $("#zoneDL_DangTai").html('<i class="fas fa-spinner fa-spin me-2"></i>Đang tải thông tin buổi học...').show();
        $("#btnDL_KiemTra, #btnDL_Gui").prop("disabled", true);
        me.moModal("modal_doilich");

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/KhoiTaoThongTinYeuCauDoiLich',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strIdLichHoc': objLop.IDLICHHOC,
            'strIdHocPhan': objLop.IDHOCPHAN,
            'strIdPhongHoc': objLop.IDPHONGHOC,
            'strIdLopHocPhan': objLop.IDLOPHOCPHAN,
            'strNgayHoc': objLop.NGAYHOC,
            'strThu': objLop.THUHOC,
            'strTietBatDau': objLop.TIETBATDAU,
            'strTietKetThuc': objLop.TIETKETTHUC,
            'strGioBatDau': objLop.GIOBATDAU,
            'strPhutBatDau': objLop.PHUTBATDAU,
            'strGioKetThuc': objLop.GIOKETTHUC,
            'strPhutKetThuc': objLop.PHUTKETTHUC,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.viewForm_DoiLich(data.Data || {});
                } else {
                    $("#zoneDL_DangTai").empty().append($('<span class="text-danger">').text(data.Message || 'Không khởi tạo được yêu cầu đổi lịch'));
                }
            },
            error: function (er) {
                $("#zoneDL_DangTai").empty().append($('<span class="text-danger">').text('Lỗi kết nối: ' + JSON.stringify(er)));
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
        }, false, false, false, null);
    },

    // Đổ dữ liệu khởi tạo vào form. Có ô trống đích thì điền ngày/tiết/phòng của ô đó (giữ nguyên số tiết của buổi học).
    viewForm_DoiLich: function (data) {
        var me = this;
        var objLop = me.objLopDoi;
        var objDich = me.objDichDoi;
        var aData = (data.rsThongTinChung || [])[0] || {};
        me.dtGiangVienThayDoi = data.rsGiangVien || [];
        $("#txtDL_NoiDung").val(aData.NOIDUNG || '');

        var strNgay = aData.NGAYHOC_THAYDOI || objLop.NGAYHOC;
        var iTu = parseInt(aData.TIETBATDAU_THAYDOI || objLop.TIETBATDAU, 10);
        var iDen = parseInt(aData.TIETKETTHUC_THAYDOI || objLop.TIETKETTHUC, 10);
        var strPhong = aData.IDPHONGHOC_THAYDOI || objLop.IDPHONGHOC;
        var arrCanhBao = [];

        // Chỉ cho đổi sang phòng CÙNG LOẠI với phòng hiện tại: lớp TH (phòng máy) → phòng TH, lớp LT → phòng LT
        var strLoaiCu = me.getKieuPhong(objLop.IDPHONGHOC);
        var dtPhongDM = data.rsDanhMucPhong || [];
        var dtPhongHopLe = dtPhongDM;
        me.strLoaiPhongDoi = strLoaiCu;
        if (strLoaiCu) {
            dtPhongHopLe = dtPhongDM.filter(function (p) { return me.getKieuPhong(p.ID) === strLoaiCu; });
            if (dtPhongHopLe.length === 0) {
                // Không tra được loại phòng nào trong danh mục → không lọc, chỉ nhắc
                dtPhongHopLe = dtPhongDM;
                me.strLoaiPhongDoi = '';
                arrCanhBao.push('Chưa xác định được loại phòng trong danh mục — hãy chọn phòng cùng loại ' + me.getTenLoaiPhong(strLoaiCu) + '.');
            }
        }
        var bCoPhongDich = !!objDich && dtPhongHopLe.some(function (p) { return String(p.ID) === String(objDich.IDPHONGHOC); });
        if (objDich) {
            var k = me.getKhoangTiet(objLop) || { tu: iTu, den: iDen };
            var bCungGio = objLop.NGAYHOC === objDich.NGAYHOC && k.tu >= objDich.TU && k.den <= objDich.DEN;
            strNgay = objDich.NGAYHOC;
            iTu = bCungGio ? k.tu : objDich.TU;
            iDen = iTu + (k.den - k.tu);
            if (bCoPhongDich) strPhong = objDich.IDPHONGHOC;
            else if (me.strLoaiPhongDoi && objDich.KIEUPHONG && objDich.KIEUPHONG !== me.strLoaiPhongDoi) {
                arrCanhBao.push('Lớp đang học phòng ' + me.getTenLoaiPhong(me.strLoaiPhongDoi) + ', không đổi sang phòng ' + objDich.TENPHONG + ' (' + objDich.KIEUPHONG + ') được — hãy chọn phòng cùng loại.');
            }
            else arrCanhBao.push('Phòng ' + objDich.TENPHONG + ' không có trong danh mục phòng được đổi — hãy chọn phòng khác.');
            if (iDen > objDich.DEN) arrCanhBao.push('Buổi học dài ' + (k.den - k.tu + 1) + ' tiết, vượt ô trống T' + objDich.TU + '-' + objDich.DEN + ' — nên bấm "Kiểm tra trùng lịch" trước khi gửi.');
        }
        $("#txtDL_Ngay").val(me.vnToIso(strNgay));
        $("#txtDL_TietBatDau").val(isNaN(iTu) ? '' : iTu);
        $("#txtDL_TietKetThuc").val(isNaN(iDen) ? '' : iDen);
        $("#lblDL_GoiYPhong").text(me.strLoaiPhongDoi ? '— chỉ hiện phòng ' + me.getTenLoaiPhong(me.strLoaiPhongDoi) + ', cùng loại phòng hiện tại' : '');

        // Phòng: danh mục của BE (đã lọc cùng loại) → vẽ tạm, rồi hỏi LAYPHONGHOCTRONG để chỉ giữ phòng trống ở ngày/giờ mới
        me.dtPhongHopLeDoi = dtPhongHopLe;
        me.genCombo_PhongDoiLich(dtPhongHopLe, strPhong);
        me.capNhatPhongTrong_DoiLich();

        // Giảng viên: mỗi giảng viên hiện tại → chọn giảng viên thay (mặc định giữ nguyên)
        var fnTenGV = function (g) {
            return (g.HODEM || '') + ' ' + (g.TEN || '') + (g.MASO ? ' - ' + g.MASO : '');
        };
        var strOptGV = '<option value="">Chọn giảng viên</option>' + (data.rsDanhMucGiangVien || []).map(function (g) {
            return '<option value="' + g.ID + '">' + fnTenGV(g) + '</option>';
        }).join('');
        var htmlGV = '';
        me.dtGiangVienThayDoi.forEach(function (gv) {
            htmlGV += '<div class="lgnp-dl-gv-row"><span class="cu" title="' + me.escAttr(fnTenGV(gv)) + '">' + fnTenGV(gv) + '</span>';
            htmlGV += '<i class="fa-solid fa-arrow-right"></i><select class="form-select" id="dropDL_GiangVien' + gv.ID + '"></select></div>';
        });
        $("#zoneDL_GiangVien").html(htmlGV ? '<label>Giảng viên</label>' + htmlGV : '');
        me.dtGiangVienThayDoi.forEach(function (gv) {
            $("#dropDL_GiangVien" + gv.ID).html(strOptGV).val(gv.ID)
                .select2({ dropdownParent: $("#modal_doilich"), width: '100%' });
        });

        if (arrCanhBao.length) $("#zoneDL_CanhBao").html('<i class="fa-solid fa-triangle-exclamation me-2"></i>' + arrCanhBao.join('<br/>')).show();
        $("#zoneDL_DangTai").hide();
        $("#zoneDL_Form").show();
        $("#btnDL_KiemTra, #btnDL_Gui").prop("disabled", false);
    },

    // Vẽ ô chọn phòng của modal đổi lịch; ghi thêm sức chứa / loại phòng từ danh sách phòng đã cache (trùng ID).
    // Giữ phòng đang chọn nếu còn trong danh sách, không thì để trống cho giảng viên chọn lại.
    genCombo_PhongDoiLich: function (dtPhong, strPhongChon) {
        var me = this;
        var dtPhongCache = me.objCachePhong[''] || [];
        var htmlPhong = '<option value="">Chọn phòng học</option>';
        dtPhong.forEach(function (p) {
            var r = dtPhongCache.find(function (x) { return String(x.ID) === String(p.ID); });
            var strThem = '';
            if (r) {
                var iSucChua = me.getSucChua(r);
                strThem = (iSucChua !== null ? ' · ' + iSucChua + ' chỗ' : '') + (r.KIEUPHONG ? ' · ' + r.KIEUPHONG : '');
            }
            htmlPhong += '<option value="' + p.ID + '">' + (p.TENPHONGHOC || p.MA || '') + strThem + '</option>';
        });
        var $dropPhong = $("#dropDL_PhongHoc");
        if ($dropPhong.hasClass("select2-hidden-accessible")) $dropPhong.select2("destroy");
        var bCon = dtPhong.some(function (p) { return String(p.ID) === String(strPhongChon); });
        $dropPhong.html(htmlPhong).val(bCon ? strPhongChon : '');
        $dropPhong.select2({ dropdownParent: $("#modal_doilich"), width: '100%' });
        return bCon;
    },

    // Khung giờ tiết (mỗi tiết 50 phút) — dùng khi trên lưới chưa có lịch thật của tiết đó để lấy giờ
    arrGioTiet: [[6, 45], [7, 40], [8, 35], [9, 30], [10, 25], [11, 20], [13, 0], [13, 55], [14, 50], [15, 45], [16, 40], [17, 35], [18, 30], [19, 25], [20, 20]],

    // Giờ bắt đầu (hoặc kết thúc) của 1 tiết: ưu tiên lấy từ lịch thật đang tải trên lưới, không có thì theo khung chuẩn
    getGioTiet: function (iTiet, bKetThuc) {
        var me = this;
        if (!(iTiet >= 1 && iTiet <= 15)) return null;
        var src = (me.dtLichHoc || []).find(function (e) {
            return bKetThuc ? (parseInt(e.TIETKETTHUC, 10) === iTiet && e.GIOKETTHUC != null)
                : (parseInt(e.TIETBATDAU, 10) === iTiet && e.GIOBATDAU != null);
        });
        if (src) {
            return bKetThuc ? { gio: parseInt(src.GIOKETTHUC, 10), phut: parseInt(src.PHUTKETTHUC, 10) || 0 }
                : { gio: parseInt(src.GIOBATDAU, 10), phut: parseInt(src.PHUTBATDAU, 10) || 0 };
        }
        var g = me.arrGioTiet[iTiet - 1];
        var iPhut = g[0] * 60 + g[1] + (bKetThuc ? 50 : 0);
        return { gio: Math.floor(iPhut / 60), phut: iPhut % 60 };
    },

    // Hỏi BE phòng trống ở ngày/giờ mới (TKB_CHUNG.LAYPHONGHOCTRONG) → ô chọn phòng chỉ còn phòng trống cùng loại.
    // Lỗi / thiếu ngày-tiết thì giữ danh sách cùng loại như cũ (vẫn còn nút Kiểm tra trùng lịch).
    capNhatPhongTrong_DoiLich: function () {
        var me = this;
        var objLop = me.objLopDoi;
        var dtHopLe = me.dtPhongHopLeDoi || [];
        var strNgay = me.isoToVn($("#txtDL_Ngay").val());
        var bd = me.getGioTiet(parseInt($("#txtDL_TietBatDau").val(), 10), false);
        var kt = me.getGioTiet(parseInt($("#txtDL_TietKetThuc").val(), 10), true);
        var strLoai = me.strLoaiPhongDoi ? me.getTenLoaiPhong(me.strLoaiPhongDoi) : '';
        if (!objLop || !strNgay || !bd || !kt) {
            $("#lblDL_GoiYPhong").text(strLoai ? '— chỉ hiện phòng ' + strLoai + ', cùng loại phòng hiện tại' : '');
            return;
        }
        var iToken = me.iTokenPhongTrong = (me.iTokenPhongTrong || 0) + 1;
        $("#lblDL_GoiYPhong").text('— đang tìm phòng trống...');
        var obj_save = {
            'action': 'SV_TKB_Chung_MH/DQAYEQkODwYJDgIVEw4PBgPP',
            'func': 'TKB_CHUNG.LAYPHONGHOCTRONG',
            'iM': edu.system.iM,
            'strNgay': strNgay,
            'dGioBatDau': bd.gio,
            'dPhutBatDau': bd.phut,
            'dGioKetThuc': kt.gio,
            'dPhutKetThuc': kt.phut,
            // Không lọc loại phòng ở BE: gửi 'LT'/'TH' thì modal ra 0 phòng (nghi proc không so được mã chữ này với cột loại phòng).
            // Loại phòng đã lọc ở FE qua dtPhongHopLeDoi (cùng loại phòng hiện tại).
            'strKieuPhong': '',
            'dSucChuaTu': null,     // NUMBER rỗng phải gửi null
            'dSucChuaDen': null,
            'dIdToaNha': null,      // không lọc tòa (ID tòa trên trang là chuỗi, cột BE là NUMBER)
            'strIdLichBoQua': objLop.IDLICHHOC || '',
        };
        var strKhung = 'T' + $("#txtDL_TietBatDau").val() + '-' + $("#txtDL_TietKetThuc").val() + ' ngày ' + strNgay;
        edu.system.makeRequest({
            success: function (data) {
                if (iToken !== me.iTokenPhongTrong) return; // đã đổi ngày/tiết khác
                if (!data.Success) {
                    console.error("LAYPHONGHOCTRONG lỗi:", data, "tham số:", obj_save);
                    $("#lblDL_GoiYPhong").text('— chưa lấy được phòng trống (' + (data.Message || 'lỗi') + '), đang hiện tất cả phòng ' + strLoai);
                    return;
                }
                var dtTrong = data.Data || [];
                if (dtTrong.length > 0) console.log("LAYPHONGHOCTRONG các cột:", Object.keys(dtTrong[0]));
                var objTrong = {};
                dtTrong.forEach(function (r) { objTrong[String(r.ID || r.IDPHONGHOC || r.TKB_PHONGHOC_ID)] = 1; });
                var dtHienThi = dtHopLe.filter(function (p) { return objTrong[String(p.ID)]; });
                if (dtTrong.length > 0 && dtHienThi.length === 0) {
                    // BE có phòng trống mà không phòng nào khớp danh mục được đổi → in ra để so mã phòng 2 bên
                    console.warn("Đổi lịch: " + dtTrong.length + " phòng trống nhưng 0 phòng khớp danh mục " + dtHopLe.length + " phòng cùng loại '" + me.strLoaiPhongDoi + "'",
                        { mauPhongTrong: dtTrong.slice(0, 3), mauDanhMuc: dtHopLe.slice(0, 3) });
                }
                var strChon = $("#dropDL_PhongHoc").val();
                var bCon = me.genCombo_PhongDoiLich(dtHienThi, strChon);
                $("#lblDL_GoiYPhong").text('— ' + dtHienThi.length + ' phòng ' + (strLoai || '') + ' trống ' + strKhung
                    + (strChon && !bCon ? ' (phòng vừa chọn đã có lịch, chọn phòng khác)' : ''));
                $("#zoneDL_KetQua").hide();
            },
            error: function () {
                if (iToken !== me.iTokenPhongTrong) return;
                $("#lblDL_GoiYPhong").text('— chưa lấy được phòng trống, đang hiện tất cả phòng ' + strLoai);
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },

    // Tham số gửi BE — cùng bộ trường với lichgiang.js (save_DoiLich / save_KiemTraTrungLich);
    // các trường *_ThayDoi về Thứ/Giờ/Phút bên đó đọc từ ô không tồn tại (txtAAAA) nên luôn là "" → giữ nguyên "".
    getThamSo_DoiLich: function () {
        var me = this;
        var objLich = me.objLopDoi;
        var arrGiangVien_Id = [];
        var arrGiangVienThayDoi_Id = [];
        me.dtGiangVienThayDoi.forEach(function (e) {
            arrGiangVien_Id.push(e.ID);
            arrGiangVienThayDoi_Id.push($("#dropDL_GiangVien" + e.ID).val());
        });
        return {
            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
            'strIdHinhThucXep': objLich.IDHINHTHUCXEP,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtDL_NoiDung'),
            'strIdPhongHoc_ThayDoi': edu.util.getValById('dropDL_PhongHoc'),
            'strNgayHoc_ThayDoi': me.isoToVn(edu.util.getValById('txtDL_Ngay')),
            'strThu_ThayDoi': '',
            'strTietBatDau_ThayDoi': edu.util.getValById('txtDL_TietBatDau'),
            'strTietKetThuc_ThayDoi': edu.util.getValById('txtDL_TietKetThuc'),
            'strGioBatDau_ThayDoi': '',
            'strPhutBatDau_ThayDoi': '',
            'strGioKetThuc_ThayDoi': '',
            'strPhutKetThuc_ThayDoi': '',
            'strGiangVien_Ids': arrGiangVien_Id.toString(),
            'strGiangVien_ThayDoi_Ids': arrGiangVienThayDoi_Id.toString(),
        };
    },

    // Kết quả kiểm tra / lỗi hiện ngay trong modal (không bật thêm alert chồng lên modal)
    hienKetQuaDoiLich: function (strLoai, strThongBao) {
        var strIcon = strLoai === 'ok' ? 'fa-circle-check' : (strLoai === 'dang' ? 'fa-spinner fa-spin' : 'fa-circle-exclamation');
        $("#zoneDL_KetQua").attr("class", "lgnp-dl-ketqua " + strLoai)
            .empty().append('<i class="fa-solid ' + strIcon + ' me-2"></i>').append($("<span>").text(strThongBao)).show();
    },

    kiemTraNhapDoiLich: function () {
        var me = this;
        if (!$("#txtDL_Ngay").val() || !$("#txtDL_TietBatDau").val() || !$("#txtDL_TietKetThuc").val()) {
            me.hienKetQuaDoiLich('loi', 'Nhập đủ ngày học, tiết bắt đầu và tiết kết thúc mới.');
            return false;
        }
        if (!$("#dropDL_PhongHoc").val()) {
            me.hienKetQuaDoiLich('loi', 'Chọn phòng học mới (danh sách chỉ gồm phòng còn trống ở ngày/tiết đã chọn).');
            return false;
        }
        // Chốt chặn: không cho đổi sang phòng khác loại (TH ↔ LT)
        var strLoaiMoi = me.getKieuPhong($("#dropDL_PhongHoc").val());
        if (me.strLoaiPhongDoi && strLoaiMoi && strLoaiMoi !== me.strLoaiPhongDoi) {
            me.hienKetQuaDoiLich('loi', 'Lớp đang học phòng ' + me.getTenLoaiPhong(me.strLoaiPhongDoi) + ' — không đổi sang phòng ' + me.getTenLoaiPhong(strLoaiMoi) + ' được.');
            return false;
        }
        return true;
    },

    save_KiemTraTrungLich: function () {
        var me = this;
        if (!me.objLopDoi || !me.kiemTraNhapDoiLich()) return;
        var obj_list = $.extend({
            'action': 'KHCT_LichGiang_DoiLich/KiemTraLichCanDoi',
            'type': 'GET',
        }, me.getThamSo_DoiLich());
        me.hienKetQuaDoiLich('dang', 'Đang kiểm tra trùng lịch...');
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    me.hienKetQuaDoiLich('loi', data.Message || 'Không kiểm tra được');
                    return;
                }
                var dtResult = data.Data || [];
                if (dtResult.length === 0) me.hienKetQuaDoiLich('loi', 'Không trả về dữ liệu kiểm tra');
                else if (dtResult[0].HOPLE) me.hienKetQuaDoiLich('ok', 'Dữ liệu kiểm tra hợp lệ — không trùng lịch, có thể gửi yêu cầu.');
                else me.hienKetQuaDoiLich('loi', dtResult[0].THONGTINLOI || 'Lịch mới bị trùng');
            },
            error: function (er) {
                me.hienKetQuaDoiLich('loi', obj_list.action + ' (er): ' + JSON.stringify(er));
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
        }, false, false, false, null);
    },

    save_DoiLich: function () {
        var me = this;
        if (!me.objLopDoi || !me.kiemTraNhapDoiLich()) return;
        var obj_save = $.extend({
            'action': 'KHCT_LichGiang_DoiLich/GuiYeuCauDoiLich',
            'type': 'POST',
        }, me.getThamSo_DoiLich());
        $("#btnDL_Gui").prop("disabled", true);
        me.hienKetQuaDoiLich('dang', 'Đang gửi yêu cầu...');
        edu.system.makeRequest({
            success: function (data) {
                $("#btnDL_Gui").prop("disabled", false);
                if (data.Success) {
                    // Đóng modal xong mới báo (tránh alert chồng lên modal đang mở)
                    me.dongModal("modal_doilich", function () {
                        edu.system.alert("Gửi yêu cầu đổi lịch thành công. Lịch sẽ thay đổi sau khi yêu cầu được duyệt.");
                    });
                } else {
                    me.hienKetQuaDoiLich('loi', data.Message || 'Gửi yêu cầu không thành công');
                }
            },
            error: function (er) {
                $("#btnDL_Gui").prop("disabled", false);
                me.hienKetQuaDoiLich('loi', obj_save.action + ' (er): ' + JSON.stringify(er));
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },

    getDaysInWeek: function (strStart, strEnd) {
        var arrDays = [];
        var dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        
        var parts = strStart.split('/');
        var currentDate = new Date(parts[2], parts[1] - 1, parts[0]);
        
        var endParts = strEnd.split('/');
        var endDate = new Date(endParts[2], endParts[1] - 1, endParts[0]);
        
        while (currentDate <= endDate) {
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            var dayOfWeek = currentDate.getDay();
            
            arrDays.push({
                date: this.returnTwo(day) + '/' + this.returnTwo(month) + '/' + year,
                dateStr: this.returnTwo(day) + '/' + this.returnTwo(month),
                dayName: dayNames[dayOfWeek]
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return arrDays;
    },

    getColorClass: function (strLopHocPhan_Id) {
        var me = this;
        
        var found = me.arrLopHocPhanMau.find(function (item) {
            return item.ID === strLopHocPhan_Id;
        });
        
        if (!found) {
            var colorIndex = me.arrLopHocPhanMau.length % me.arrMauNen.length;
            me.arrLopHocPhanMau.push({
                ID: strLopHocPhan_Id,
                COLOR_INDEX: colorIndex + 1
            });
            return 'color-' + (colorIndex + 1);
        }
        
        return 'color-' + found.COLOR_INDEX;
    },

    genHtml_Month: function (cal) {
        var me = this;
        var nMonth = parseInt($("#thang").attr("title"));
        var nYear = parseInt($("#nam").attr("title"));
        nMonth += cal;
        if (nMonth == 0) {
            nMonth = 12;
            nYear--;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        if (nMonth == 13) {
            nMonth = 1;
            nYear++;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);

        var iDayOfMonth = getDay(nMonth, nYear);

        // Ô tô active: ngày đang chọn nếu thuộc tháng đang xem; chưa chọn tuần nào thì là hôm nay.
        // Lật tháng KHÔNG tự đổi tuần nữa (trước đây tự click ngày 1 sau 1 giây → tự tải lại lịch).
        var date = new Date();
        var iDay = -1;
        var arrNgayChon = (me.strNgayDangChon || '').split('/');
        if (arrNgayChon.length === 3) {
            if (parseInt(arrNgayChon[1], 10) === nMonth && parseInt(arrNgayChon[2], 10) === nYear) iDay = parseInt(arrNgayChon[0], 10);
        } else if (date.getMonth() + 1 == nMonth && date.getFullYear() == nYear) {
            iDay = date.getDate();
        }

        var iThu = new Date(nYear, nMonth - 1, 1, 0, 0, 0, 0);
        iThu = iThu.getDay();
        if (iThu == 0) iThu = 7;
        var html = "";
        var strNgayBatDau = '';
        var strNgayKetThuc = '';
        var uuid = edu.util.uuid();
        var iDayOfPreMonth = getDay(nMonth - 1, nYear);
        for (var i = iThu - 2; i >= 0; i--) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(iDayOfPreMonth - i, (nMonth - 1), nYear) + '" >' + (iDayOfPreMonth - i) + '</li>';
        }

        if (iThu > 1) {
            strNgayBatDau = getSMonth(iDayOfPreMonth - iThu + 2, (nMonth - 1), nYear);
            strNgayKetThuc = getSMonth(8 - iThu, nMonth, nYear);
        }
        for (var i = 1; i <= iDayOfMonth; i++) {
            var strClass = "";
            if (i == iDay) strClass = 'active';
            if ((i % 7 + iThu) % 7 == 2) {
                strNgayBatDau = getSMonth(i, nMonth, nYear);
                strNgayKetThuc = (i + 6 > iDayOfMonth) ? getSMonth(i + 6 - iDayOfMonth, (nMonth + 1), nYear) : getSMonth(i + 6, nMonth, nYear);
                uuid = edu.util.uuid();
            }

            html += '<li class="poiter ' + strClass + ' ' + uuid + '" ngay="' + i + '"  title="' + getSMonth(i, nMonth, nYear) + '" name="' + uuid + '" batdau="' + strNgayBatDau + '" ketthuc="' + strNgayKetThuc + '"><span>' + i + '</span></li>';
        }
        var iMax = 35 - iDayOfMonth - iThu;
        if (iMax < 0) iMax += 7;
        for (var i = 1; i < iMax + 2; i++) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(i, (nMonth + 1), nYear) + '">' + i + '</li>';
        }
        $(".days").html(html);
        me.danhDauTuanDangChon();

        function getDay(nMonth, nYear) {
            var iDayOfMonth = 31;
            switch (nMonth) {
                case 2: {
                    iDayOfMonth = 28;
                    if (nYear % 4 == 0) iDayOfMonth = 29;
                } break;
                case 4:
                case 6:
                case 9:
                case 11: iDayOfMonth = 30; break;
            }
            return iDayOfMonth;
        }
        function getSMonth(iDay, nMonth, Year) {
            if (nMonth == 0) {
                nMonth = 12;
                Year--;
            }
            if (nMonth == 13) {
                nMonth = 1;
                Year++;
            }
            return returnTwo(iDay) + '/' + returnTwo(nMonth) + '/' + Year;
        }

        function returnTwo(iDay) {
            iDay = "" + iDay;
            if (iDay.length == 1) return "0" + iDay;
            else return iDay;
        }
    },
    
    returnTwo: function (iDay) {
        iDay = "" + iDay;
        if (iDay.length == 1) return "0" + iDay;
        else return iDay;
    },

    // Danh sách phòng cho xuất file: phòng của lượt tải gần nhất; chưa tải lần nào thì lấy cache danh sách phòng
    getDSPhongXuat: function () {
        var me = this;
        if (me.dtPhongHocOriginal && me.dtPhongHocOriginal.length > 0) return me.dtPhongHocOriginal;
        return me.objCachePhong[$("#dropSearch_ToaNha").val() || ''] || me.objCachePhong[''] || [];
    },

    // Tô thẻ lựa chọn đang chọn trong modal xuất theo giá trị các select ẩn
    dongBoLuaChonXuat: function () {
        $("#modal_export_excel .lgnp-opt").each(function () {
            var $opt = $(this);
            $opt.toggleClass("active", $("#" + $opt.data("for")).val() === String($opt.data("value")));
        });
    },

    showExportModal: function () {
        var me = this;
        
        if (!me.strNgayBatDau || !me.strNgayKetThuc) {
            edu.system.alert("Vui lòng chọn tuần trước khi xuất");
            return;
        }
        
        console.log("Opening export modal...");
        
        // Load danh sách PHÒNG HỌC vào dropdown (không phải tòa nhà)
        var roomOptions = '<option value="">-- Chọn phòng --</option>';
        var dtPhongXuat = me.getDSPhongXuat();
        if (dtPhongXuat.length > 0) {
            // Sort phòng theo tên để dễ tìm
            var sortedRooms = dtPhongXuat.slice().sort(function(a, b) {
                return (a.TEN || '').localeCompare(b.TEN || '');
            });
            
            sortedRooms.forEach(function(room) {
                roomOptions += '<option value="' + room.ID + '">' + room.TEN + '</option>';
            });
        }
        $("#exportCustomRoom").html(roomOptions);
        
        // Khởi tạo Select2 cho dropdown chọn phòng với tìm kiếm
        $("#exportCustomRoom").select2({
            placeholder: "Tìm kiếm phòng học...",
            allowClear: true,
            width: '100%',
            dropdownParent: $('#modal_export_excel') // Hiển thị dropdown trong modal
        });
        
        // Set default dates
        var startParts = me.strNgayBatDau.split('/');
        var endParts = me.strNgayKetThuc.split('/');
        var startDate = startParts[2] + '-' + startParts[1] + '-' + startParts[0];
        var endDate = endParts[2] + '-' + endParts[1] + '-' + endParts[0];
        
        $("#exportSingleDate").val(startDate);
        $("#exportStartDate").val(startDate);
        $("#exportEndDate").val(endDate);
        
        // Reset form
        $("#exportTimeRange").val("current_week");
        $("#exportRoomFilter").val("all");
        $("#exportFileFormat").val("xlsx");
        $("#exportTemplateMode").val("full");
        $("#customDateSection").hide();
        $("#customRangeSection").hide();
        $("#customRoomSection").hide();

        // Nhãn trên các thẻ lựa chọn: tuần đang xem + số phòng của từng phạm vi
        $("#lblXuat_TuanTieuDe").text(me.strNgayBatDau + ' - ' + me.strNgayKetThuc);
        $("#lblXuat_Tuan").text(me.strNgayBatDau.substr(0, 5) + ' - ' + me.strNgayKetThuc); // 28/09 - 04/10/2026 cho vừa thẻ
        $("#lblXuat_SoPhongTatCa").text(me.getDSPhongXuat().length + ' phòng');
        $("#lblXuat_SoPhongLoc").text(me.dtPhongHocFull.length + ' phòng');
        me.dongBoLuaChonXuat();

        // Show modal - thử cả 2 cách
        try {
            var modalEl = document.getElementById('modal_export_excel');
            if (modalEl) {
                // Bootstrap 5
                if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    var modal = new bootstrap.Modal(modalEl);
                    modal.show();
                } else {
                    // Bootstrap 4 hoặc jQuery
                    $("#modal_export_excel").modal("show");
                }
                console.log("Modal opened successfully");
            } else {
                console.error("Modal element not found!");
                edu.system.alert("Không tìm thấy modal. Vui lòng refresh trang!");
            }
        } catch (e) {
            console.error("Error opening modal:", e);
            edu.system.alert("Lỗi mở modal: " + e.message);
        }
    },

    processExport: function () {
        var me = this;
        
        var timeRange = $("#exportTimeRange").val();
        var roomFilter = $("#exportRoomFilter").val();
        var fileFormat = $("#exportFileFormat").val();
        var templateMode = $("#exportTemplateMode").val() || 'full';
        
        var startDate, endDate;
        
        // Xác định khoảng thời gian
        if (timeRange === "current_week") {
            startDate = me.strNgayBatDau;
            endDate = me.strNgayKetThuc;
        } else if (timeRange === "custom_date") {
            var dateVal = $("#exportSingleDate").val();
            if (!dateVal) {
                edu.system.alert("Vui lòng chọn ngày");
                return;
            }
            var parts = dateVal.split('-');
            startDate = endDate = parts[2] + '/' + parts[1] + '/' + parts[0];
        } else if (timeRange === "custom_range") {
            var startVal = $("#exportStartDate").val();
            var endVal = $("#exportEndDate").val();
            if (!startVal || !endVal) {
                edu.system.alert("Vui lòng chọn đầy đủ khoảng thời gian");
                return;
            }
            var startParts = startVal.split('-');
            var endParts = endVal.split('-');
            startDate = startParts[2] + '/' + startParts[1] + '/' + startParts[0];
            endDate = endParts[2] + '/' + endParts[1] + '/' + endParts[0];
        }
        
        // Xác định phòng cần xuất
        var roomsToExport = [];
        if (roomFilter === "all") {
            // Lấy TẤT CẢ phòng học (theo tòa nhà đang chọn nếu có)
            var dtPhongXuat = me.getDSPhongXuat();
            if (dtPhongXuat.length > 0) {
                roomsToExport = dtPhongXuat;
            } else {
                edu.system.alert("Đang tải danh sách phòng...");
                // Gọi lại API để lấy đầy đủ
                me.getList_PhongHoc(function() {
                    if (me.dtPhongHocOriginal && me.dtPhongHocOriginal.length > 0) {
                        me.processExport();
                    } else {
                        edu.system.alert("Không có dữ liệu phòng học");
                    }
                });
                return;
            }
        } else if (roomFilter === "current") {
            if (me.strSelectedBuilding) {
                // Nếu đang lọc 1 phòng
                roomsToExport = me.dtPhongHocFull;
            } else {
                // Nếu đang xem tất cả nhưng chỉ load 1 phần
                roomsToExport = me.dtPhongHocFull;
            }
        } else if (roomFilter === "custom") {
            var selectedRoomId = $("#exportCustomRoom").val();
            if (!selectedRoomId) {
                edu.system.alert("Vui lòng chọn phòng");
                return;
            }
            roomsToExport = me.getDSPhongXuat().filter(function(r) {
                return r.ID === selectedRoomId;
            });
        }
        
        if (roomsToExport.length === 0) {
            edu.system.alert("Không có phòng nào để xuất");
            return;
        }
        
        console.log("Xuất Excel:");
        console.log("- Thời gian:", startDate, "-", endDate);
        console.log("- Số phòng:", roomsToExport.length);
        console.log("- Định dạng:", fileFormat);
        console.log("- Kiểu mẫu:", templateMode);

        // Đóng modal
        $("#modal_export_excel").modal("hide");

        // Gọi API lấy dữ liệu theo khoảng thời gian mới
        me.exportWithCustomData(startDate, endDate, roomsToExport, fileFormat, templateMode);
    },

    exportWithCustomData: function (startDate, endDate, rooms, fileFormat, templateMode) {
        var me = this;
        me.showExportLoading();

        // Dùng chung cache + giới hạn request song song như lưới (trước đây bắn 1 request/phòng cùng lúc)
        me.taiLichNhieuPhong(rooms, startDate, endDate,
            function () { return true; },
            function (iXong, iTong) { $("#lblTienDoXuat").text('Đang tải lịch ' + iXong + '/' + iTong + ' phòng'); },
            function (exportData) {
                if (fileFormat === "xlsx") {
                    me.exportToExcelAdvanced(startDate, endDate, rooms, exportData, templateMode);
                } else {
                    me.exportToCSVAdvanced(startDate, endDate, rooms, exportData, templateMode);
                }
            });
    },

    exportToExcelAdvanced: function (startDate, endDate, rooms, scheduleData, templateMode) {
        var me = this;

        console.log("=== EXPORT EXCEL VERSION 3.0.0.4 - DIRECT XLSX FORMAT ===");

        // Bỏ qua ExcelJS vì CDN không load được, dùng thẳng XLSX format mới
        me.exportToExcelWithXLSX(startDate, endDate, rooms, scheduleData, templateMode);
    },

    exportToExcelWithXLSX: function (startDate, endDate, rooms, scheduleData, templateMode) {
        var me = this;
        
        console.log("=== EXPORT WITH SIMPLE HTML TABLE METHOD ===");
        
        // Hiển thị loading đẹp
        me.showExportLoading();
        $("#lblTienDoXuat").text('Đang tạo file...');

        // Delay nhỏ để loading hiển thị
        setTimeout(function() {
            var isBusyMode = (templateMode === 'busy');
            // Tạo HTML table và xuất thành Excel
            var arrDays = me.getDaysInWeek(startDate, endDate);
            
            // Tạo HTML table
            var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
            html += '<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
            html += '<x:Name>Lịch giảng</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
            html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
            
            html += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;font-family:Arial;">';
            
            // Tiêu đề
            var numCols = arrDays.length + 3;
            var titleText = isBusyMode ? 'LỊCH GIẢNG NHIỀU PHÒNG HỌC (ĐÁNH DẤU PHÒNG BẬN)' : 'LỊCH GIẢNG NHIỀU PHÒNG HỌC';
            html += '<tr><td colspan="' + numCols + '" align="center" style="font-size:16px;font-weight:bold;height:30px;">' + titleText + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Thời gian: ' + startDate + ' - ' + endDate + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Số phòng: ' + rooms.length + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '</td></tr>';
            if (isBusyMode) {
                html += '<tr><td colspan="' + numCols + '" style="height:25px;font-style:italic;color:#666;">Ghi chú: mỗi dòng là 1 module 3 tiết. Ô <span style="background-color:#FFEB3B;padding:0 8px;">&nbsp;&nbsp;&nbsp;</span> = phòng đã có lịch sử dụng, ô trắng = phòng trống</td></tr>';
            } else {
                html += '<tr><td colspan="' + numCols + '" style="height:25px;font-style:italic;color:#666;">Ghi chú: mỗi dòng là 1 module 3 tiết. Ô xanh = có lịch (lịch dài hơn 3 tiết được gộp ô), ô trắng = phòng trống</td></tr>';
            }
            html += '<tr><td colspan="' + numCols + '" style="height:10px;"></td></tr>';
            
            // Header
            html += '<tr style="background-color:#D9D9D9;font-weight:bold;height:35px;">';
            html += '<td align="center" style="width:50px;">STT</td>';
            html += '<td align="center" style="width:150px;">Phòng học</td>';
            html += '<td align="center" style="width:80px;">Ca học</td>';
            arrDays.forEach(function(day) {
                html += '<td align="center" style="width:350px;">' + day.dayName + '<br>(' + day.dateStr + ')</td>';
            });
            html += '</tr>';
            
            // Dữ liệu
            // Mỗi phòng 5 dòng = 5 module 3 tiết; lịch dài hơn 1 module thì gộp ô (rowspan) → nhìn là biết module nào trống
            var nModule = me.arrModule.length;
            var strCaoDong = isBusyMode ? '36px' : '80px';
            rooms.forEach(function(room, iPhong) {
                var roomSchedules = scheduleData.filter(function(item) {
                    return item.IDPHONGHOC === room.ID;
                });
                var arrKhoiTheoNgay = arrDays.map(function (day) {
                    var events = roomSchedules.filter(function (item) {
                        return item.NGAYHOC === day.date;
                    });
                    return me.chiaKhoiModule(events, me.arrModule);
                });

                me.arrModule.forEach(function (mod, iMod) {
                    html += '<tr style="height:' + strCaoDong + ';">';

                    // STT + Phòng học (gộp theo số module)
                    if (iMod === 0) {
                        html += '<td align="center" rowspan="' + nModule + '" valign="middle">' + (iPhong + 1) + '</td>';
                        html += '<td rowspan="' + nModule + '" valign="middle">' + room.TEN + '</td>';
                    }

                    // Ca học: buổi + khoảng tiết của module
                    html += '<td align="center" valign="middle" style="font-weight:bold;">' + mod.tenBuoi + '<br>T' + mod.tu + '-' + mod.den + '</td>';

                    // Các ngày
                    arrDays.forEach(function (day, iNgay) {
                        var khoi = arrKhoiTheoNgay[iNgay][iMod];
                        if (!khoi) return; // module đã gộp vào ô phía trên
                        var strRowspan = khoi.rowspan > 1 ? ' rowspan="' + khoi.rowspan + '"' : '';

                        // Module trống
                        if (khoi.events.length === 0) {
                            html += '<td' + strRowspan + '>&nbsp;</td>';
                            return;
                        }

                        // Mẫu đánh dấu bận: chỉ tô vàng, không hiện nội dung
                        if (isBusyMode) {
                            html += '<td' + strRowspan + ' bgcolor="#FFFF00" style="background-color:#FFFF00;background:#FFFF00;mso-pattern:auto none #FFFF00;">&nbsp;</td>';
                            return;
                        }

                        html += '<td' + strRowspan + ' valign="top" bgcolor="#DDEBF7" style="white-space:pre-wrap;background-color:#DDEBF7;mso-pattern:auto none #DDEBF7;">';
                        khoi.events.forEach(function(event, idx) {
                            if (idx > 0) html += '<br>---<br>';

                            // Thời gian
                            html += me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) +
                                   '-' + me.returnTwo(event.GIOKETTHUC) + ':' + me.returnTwo(event.PHUTKETTHUC);

                            if (event.TIETBATDAU) {
                                html += ' (T' + event.TIETBATDAU;
                                if (event.TIETKETTHUC && event.TIETKETTHUC !== event.TIETBATDAU) {
                                    html += '-' + event.TIETKETTHUC;
                                }
                                html += ')';
                            }

                            html += '<br>' + event.TENHOCPHAN;

                            if (event.TENLOPHOCPHAN) {
                                html += '<br>Lớp: ' + event.TENLOPHOCPHAN;
                            }

                            if (event.THONGTINGIANGVIEN) {
                                var giangVien = me.cleanHtmlTags(event.THONGTINGIANGVIEN);
                                html += '<br>GV: ' + giangVien;
                            }
                        });
                        html += '</td>';
                    });

                    html += '</tr>';
                });
            });

            html += '</table></body></html>';
            
            // Tạo Blob và download
            var blob = new Blob(['\ufeff', html], {
                type: 'application/vnd.ms-excel;charset=utf-8'
            });
            
            // Tạo tên file thông minh dựa trên khoảng thời gian
            var fileName = me.generateSmartFileName(startDate, endDate);
            
            if (navigator.msSaveBlob) {
                // IE 10+
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', fileName);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }
            
            // Ẩn loading và hiển thị thông báo thành công
            me.hideExportLoading();
            me.showExportSuccess(fileName, rooms.length, scheduleData.length);
            
            console.log("Excel file exported successfully!");
        }, 300);
    },
    
    // Hiển thị loading khi xuất file
    showExportLoading: function() {
        // Đã hiện rồi thì thôi (tải dữ liệu và tạo file đều gọi) — tránh 2 overlay trùng id không tắt được
        if ($('#exportLoadingOverlay').length) return;
        var loadingHtml = '<div id="exportLoadingOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">';
        loadingHtml += '<div style="background:white;padding:40px;border-radius:15px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);min-width:300px;">';
        loadingHtml += '<div class="spinner-border text-primary" role="status" style="width:60px;height:60px;border-width:6px;margin-bottom:20px;">';
        loadingHtml += '<span class="sr-only">Loading...</span>';
        loadingHtml += '</div>';
        loadingHtml += '<h4 style="color:#223771;margin:0 0 10px 0;font-weight:600;">Đang xuất file Excel...</h4>';
        loadingHtml += '<p id="lblTienDoXuat" style="color:#666;margin:0;font-size:14px;">Vui lòng đợi trong giây lát</p>';
        loadingHtml += '</div>';
        loadingHtml += '</div>';
        
        $('body').append(loadingHtml);
    },
    
    // Ẩn loading
    hideExportLoading: function() {
        $('#exportLoadingOverlay').fadeOut(300, function() {
            $(this).remove();
        });
    },
    
    // Hiển thị thông báo thành công
    showExportSuccess: function(fileName, roomCount, scheduleCount) {
        var successHtml = '<div id="exportSuccessModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">';
        successHtml += '<div style="background:white;padding:30px;border-radius:15px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-width:500px;animation:slideIn 0.3s ease-out;">';
        successHtml += '<div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">';
        successHtml += '<i class="fa fa-check" style="color:white;font-size:40px;"></i>';
        successHtml += '</div>';
        successHtml += '<h3 style="color:#223771;margin:0 0 15px 0;font-weight:600;">Xuất file thành công!</h3>';
        successHtml += '<div style="background:#f8f9fa;padding:20px;border-radius:10px;margin-bottom:20px;text-align:left;">';
        successHtml += '<p style="margin:0 0 10px 0;color:#495057;"><i class="fa fa-file-excel-o" style="color:#28a745;margin-right:10px;"></i><strong>File:</strong> ' + fileName + '</p>';
        successHtml += '<p style="margin:0 0 10px 0;color:#495057;"><i class="fa fa-building-o" style="color:#007bff;margin-right:10px;"></i><strong>Số phòng:</strong> ' + roomCount + '</p>';
        successHtml += '<p style="margin:0;color:#495057;"><i class="fa fa-calendar-check-o" style="color:#17a2b8;margin-right:10px;"></i><strong>Số lịch:</strong> ' + scheduleCount + '</p>';
        successHtml += '</div>';
        successHtml += '<button onclick="$(\'#exportSuccessModal\').fadeOut(300, function(){ $(this).remove(); });" class="btn btn-primary" style="padding:10px 30px;font-size:16px;border-radius:25px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border:none;">';
        successHtml += '<i class="fa fa-check-circle" style="margin-right:8px;"></i>Đóng';
        successHtml += '</button>';
        successHtml += '</div>';
        successHtml += '</div>';
        
        // Add animation CSS
        if (!$('#exportAnimationStyle').length) {
            $('head').append('<style id="exportAnimationStyle">@keyframes slideIn{from{transform:translateY(-50px);opacity:0;}to{transform:translateY(0);opacity:1;}}</style>');
        }
        
        $('body').append(successHtml);
        
        // Auto close after 5 seconds
        setTimeout(function() {
            $('#exportSuccessModal').fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    },
    
    // Hàm tạo tên file thông minh
    generateSmartFileName: function(startDate, endDate) {
        var me = this;
        
        // Parse dates (format: dd/MM/yyyy)
        var parseDate = function(dateStr) {
            var parts = dateStr.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        };
        
        var start = parseDate(startDate);
        var end = parseDate(endDate);
        
        // Tính số ngày chênh lệch
        var diffTime = Math.abs(end - start);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Format ngày đẹp: 30.3 thay vì 30/03
        var formatDateShort = function(date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            return day + '.' + month;
        };
        
        // Format ngày đầy đủ: 30.3.2026
        var formatDateFull = function(date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return day + '.' + month + '.' + year;
        };
        
        // Tính số tuần
        var getWeekNumber = function(date) {
            var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            var dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        };
        
        var fileName = '';
        
        if (diffDays === 0) {
            // Cùng ngày - Theo ngày
            fileName = 'Lich hoc ngay ' + formatDateFull(start) + '.xls';
        } else if (diffDays === 6) {
            // 7 ngày - Theo tuần
            var weekNum = getWeekNumber(start);
            fileName = 'Lich hoc tuan ' + weekNum + ' tu ngay ' + formatDateShort(start) + ' den ' + formatDateFull(end) + '.xls';
        } else {
            // Khoảng thời gian tùy chọn
            fileName = 'Lich hoc tu ' + formatDateShort(start) + ' den ' + formatDateFull(end) + '.xls';
        }
        
        return fileName;
    },
    
    exportToCSVAdvanced: function (startDate, endDate, rooms, scheduleData, templateMode) {
        var me = this;
        var isBusyMode = (templateMode === 'busy');

        // Tạo CSV content
        var csvContent = '';

        // Tiêu đề
        csvContent += (isBusyMode ? 'LỊCH GIẢNG NHIỀU PHÒNG HỌC (ĐÁNH DẤU PHÒNG BẬN)' : 'LỊCH GIẢNG NHIỀU PHÒNG HỌC') + '\n';
        csvContent += 'Thời gian: ' + startDate + ' - ' + endDate + '\n';
        csvContent += 'Số phòng: ' + rooms.length + '\n';
        csvContent += 'Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '\n';
        csvContent += 'Ghi chú: mỗi dòng là 1 module 3 tiết; ô trống = phòng trống module đó'
            + (isBusyMode ? '; ô "BẬN" = đã có lịch' : '') + '\n';
        csvContent += '\n';

        // Header
        var arrDays = me.getDaysInWeek(startDate, endDate);
        csvContent += 'STT,Phòng học,Ca học';
        arrDays.forEach(function (day) {
            csvContent += ',' + day.dayName + ' (' + day.dateStr + ')';
        });
        csvContent += '\n';

        // Mỗi phòng 5 dòng = 5 module 3 tiết (CSV không gộp ô được → lịch kéo dài ghi ở mọi module nó chiếm)
        rooms.forEach(function (room, index) {
            var roomSchedules = scheduleData.filter(function (item) {
                return item.IDPHONGHOC === room.ID;
            });

            me.arrModule.forEach(function (mod, iMod) {
                csvContent += (iMod === 0 ? (index + 1) : '') + ',"' + (iMod === 0 ? String(room.TEN || '').replace(/"/g, '""') : '') + '"';
                csvContent += ',"' + mod.tenBuoi + ' T' + mod.tu + '-' + mod.den + '"';

                arrDays.forEach(function (day) {
                    var events = roomSchedules.filter(function (item) {
                        if (item.NGAYHOC !== day.date) return false;
                        var k = me.getKhoangTiet(item);
                        return k && k.tu <= mod.den && k.den >= mod.tu;
                    });

                    // Sort theo giờ
                    events.sort(function (a, b) {
                        return me.getPhutBatDau(a) - me.getPhutBatDau(b);
                    });

                    // Mẫu đánh dấu bận: chỉ ghi BẬN, không xuất nội dung
                    if (isBusyMode) {
                        csvContent += ',"' + (events.length > 0 ? 'BẬN' : '') + '"';
                        return;
                    }

                    // Ghép các buổi học
                    var cellContent = '';
                    events.forEach(function (event, idx) {
                        if (idx > 0) cellContent += ' | ';

                        cellContent += me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) +
                                      '-' + me.returnTwo(event.GIOKETTHUC) + ':' + me.returnTwo(event.PHUTKETTHUC);

                        if (event.TIETBATDAU) {
                            cellContent += ' (T' + event.TIETBATDAU + '-' + event.TIETKETTHUC + ')';
                        }

                        cellContent += ' ' + event.TENHOCPHAN;

                        if (event.TENLOPHOCPHAN) {
                            cellContent += ' - Lớp: ' + event.TENLOPHOCPHAN;
                        }

                        if (event.THONGTINGIANGVIEN) {
                            cellContent += ' - GV: ' + me.cleanHtmlTags(event.THONGTINGIANGVIEN);
                        }
                    });

                    csvContent += ',"' + cellContent.replace(/"/g, '""') + '"';
                });

                csvContent += '\n';
            });
        });

        // Thống kê
        csvContent += '\nTHỐNG KÊ\n';
        csvContent += 'Tổng số phòng:,' + rooms.length + '\n';
        csvContent += 'Tổng số lịch:,' + scheduleData.length + '\n';

        // Tạo Blob và download
        var BOM = "﻿"; // UTF-8 BOM for Excel
        var blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);

        // Tạo tên file thông minh, thay .xls thành .csv
        var fileName = me.generateSmartFileName(startDate, endDate).replace('.xls', '.csv');

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Ẩn loading (bật từ lúc tải dữ liệu) + hiển thị thông báo thành công
        me.hideExportLoading();
        me.showExportSuccess(fileName, rooms.length, scheduleData.length);
    },
}
