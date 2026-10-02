/*----------------------------------------------
--Author:
--Phone:
--Date of created: 29/06/2018
--Note: Lịch giảng nhiều giảng viên theo khoa/đơn vị
----------------------------------------------*/
function LichGiangNhieuPhong() { };
LichGiangNhieuPhong.prototype = {
    strNgayBatDau: '',
    strNgayKetThuc: '',
    dtLichHoc: [],
    dtCanBo: [],
    dtCanBoFull: [],
    dtCanBoOriginal: [], // Lưu bản gốc không bị filter
    dtDonVi: [],
    arrMauNen: ["#223771", "#d49f3a", "#ec4c00", "#5a7adb", "#3c5398"],
    arrLopHocPhanMau: [],
    iPageSize: 30,
    iCurrentPage: 1,
    isLoading: false,
    strSelectedDonVi: '',
    strEfficiencyMode: 'days', // Mặc định tính theo ngày có lịch dạy

    // Helper function to clean HTML tags from text
    cleanHtmlTags: function(text) {
        if (!text) return '';
        return text
            .replace(/<br\s*\/?>/gi, ', ')  // Replace <br> with comma
            .replace(/,\s*,/g, ',')          // Remove double commas
            .replace(/^,\s*/, '')            // Remove leading comma
            .replace(/,\s*$/, '');           // Remove trailing comma
    },

    // Calculate efficiency based on selected mode
    calculateEfficiency: function(schedules, totalDays) {
        var me = this;
        var mode = me.strEfficiencyMode;

        if (mode === 'days') {
            // Tính theo ngày: đếm số ngày có lịch
            var uniqueDays = {};
            schedules.forEach(function(schedule) {
                if (schedule.NGAYHOC) {
                    uniqueDays[schedule.NGAYHOC] = true;
                }
            });
            var usedDays = Object.keys(uniqueDays).length;
            return Math.round((usedDays / totalDays) * 100);
        }
        
        // Tính theo tiết học
        var totalUsedPeriods = 0;
        var totalPeriods = 0;
        
        // Xác định range tiết theo mode
        var periodRange = { min: 1, max: 15 };
        switch(mode) {
            case 'morning':
                periodRange = { min: 1, max: 6 };
                totalPeriods = totalDays * 6;
                break;
            case 'afternoon':
                periodRange = { min: 7, max: 10 };
                totalPeriods = totalDays * 4;
                break;
            case 'evening':
                periodRange = { min: 11, max: 15 };
                totalPeriods = totalDays * 5;
                break;
            case 'morning-afternoon':
                periodRange = { min: 1, max: 10 };
                totalPeriods = totalDays * 10;
                break;
            case 'afternoon-evening':
                periodRange = { min: 7, max: 15 };
                totalPeriods = totalDays * 9;
                break;
            case 'all-sessions':
            case 'periods':
            default:
                periodRange = { min: 1, max: 15 };
                totalPeriods = totalDays * 15;
                break;
        }
        
        // Đếm số tiết đã sử dụng trong range
        schedules.forEach(function(schedule) {
            if (schedule.TIETBATDAU && schedule.TIETKETTHUC) {
                var start = Math.max(schedule.TIETBATDAU, periodRange.min);
                var end = Math.min(schedule.TIETKETTHUC, periodRange.max);
                if (start <= end) {
                    totalUsedPeriods += (end - start + 1);
                }
            }
        });
        
        return Math.round((totalUsedPeriods / totalPeriods) * 100);
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
    updateStats: function(totalCanBo, totalSchedules) {
        $("#totalRoomsDisplay").text(totalCanBo + " giảng viên");
        $("#totalSchedulesDisplay").text(totalSchedules + " lịch");
    },

    // Update statistics with TOTAL count (not paginated count)
    updateStatsTotal: function() {
        var me = this;

        var loadedCount = 0;
        var allSchedules = [];

        me.dtCanBoFull.forEach(function(canBo) {
            me.getList_LichCanBo(canBo.ID, function(schedules) {
                allSchedules = allSchedules.concat(schedules);
                loadedCount++;

                if (loadedCount === me.dtCanBoFull.length) {
                    $("#totalRoomsDisplay").text(me.dtCanBoFull.length + " giảng viên");
                    $("#totalSchedulesDisplay").text(allSchedules.length + " lịch");
                }
            });
        });
    },

    init: function () {
        var me = this;
        
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();

        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);

        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);

        // Calendar click event
        $(".days").delegate(".poiter", "click", function () {
            $(".days .active").removeClass("active");
            this.classList.add("active");
            var strNgayBatDau = $(this).attr('batdau');
            var strNgayKetThuc = $(this).attr('ketthuc');
            var strNgayDangChon = $(this).attr('title');
            me.strNgayBatDau = strNgayBatDau;
            me.strNgayKetThuc = strNgayKetThuc;
            
            // Update week info
            $("#weekInfo").html("Tuần (" + strNgayBatDau + " - " + strNgayKetThuc + ")");
            
            me.getList_TuanHienTai(strNgayBatDau, strNgayKetThuc, strNgayDangChon);
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
            var arrMulti = $("#dropSearch_CanBoMulti").val() || [];
            var hasFilter = $("#dropSearch_DonVi").val() || $("#dropSearch_CanBo").val() || arrMulti.length > 0;
            if (hasFilter) {
                $(".days .active").trigger("click");
            } else {
                edu.system.alert("Vui lòng chọn khoa/đơn vị hoặc giảng viên");
            }
        });

        // View multi button — chỉ load khi user bấm
        $("#btnViewMulti").click(function () {
            var arrMulti = $("#dropSearch_CanBoMulti").val() || [];
            if (arrMulti.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 giảng viên để xem");
                return;
            }
            if (!me.strNgayBatDau || !me.strNgayKetThuc) {
                edu.system.alert("Vui lòng chọn tuần trên lịch");
                return;
            }
            me.getList_TuanHienTai(me.strNgayBatDau, me.strNgayKetThuc, me.strNgayBatDau);
        });

        // View all button
        $("#btnViewAll").click(function () {
            $("#dropSearch_DonVi").val('').trigger('change');
            $("#dropSearch_CanBo").val('').trigger('change');
            $("#dropSearch_CanBoMulti").val(null).trigger('change.select2');
            $(".days .active").trigger("click");
        });

        // Multi cán bộ filter change — KHÔNG tự load, chỉ reset filter đơn để không xung đột
        $("#dropSearch_CanBoMulti").change(function () {
            var selected = $(this).val() || [];
            console.log("Đã chọn", selected.length, "giảng viên (chờ bấm 'Xem nhiều giảng viên')");
            if (selected.length > 0) {
                $("#dropSearch_CanBo").val('').trigger('change.select2');
            }
        });

        // Đơn vị filter change
        $("#dropSearch_DonVi").change(function () {
            var donViId = $(this).val();
            console.log("Đơn vị filter changed to:", donViId);
            me.strSelectedDonVi = donViId || '';

            $(this).select2('close');

            // Reload cán bộ dropdown theo đơn vị được chọn
            me.loadCanBoByDonVi(donViId);

            // Auto load data if week is selected
            if (me.strNgayBatDau && me.strNgayKetThuc) {
                me.getList_TuanHienTai(me.strNgayBatDau, me.strNgayKetThuc, me.strNgayBatDau);
            }
        });

        // Cán bộ filter change
        $("#dropSearch_CanBo").change(function () {
            console.log("Cán bộ filter changed to:", $(this).val());

            $(this).select2('close');

            if (me.strNgayBatDau && me.strNgayKetThuc) {
                me.getList_TuanHienTai(me.strNgayBatDau, me.strNgayKetThuc, me.strNgayBatDau);
            }
        });

        // Efficiency mode change
        $("#dropEfficiencyMode").change(function () {
            me.strEfficiencyMode = $(this).val();
            console.log("Efficiency mode changed to:", me.strEfficiencyMode);
            if (me.dtCanBo.length > 0) {
                $(".days .active").trigger("click");
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

        // Schedule event click
        $("#scheduleGrid").delegate(".schedule-event", "click", function () {
            var $el = $(this);
            var eventId = $el.data('event-id');
            var canBoId = $el.data('canbo-id');
            var date = $el.data('date');
            var lopHocPhan = $el.data('lophocphan');

            console.log("Click event:", { eventId: eventId, canBoId: canBoId, date: date, lopHocPhan: lopHocPhan });

            me.showScheduleDetail(eventId, canBoId, date, lopHocPhan);
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

        // Initialize
        me.getList_DonVi();
        me.genCombo_CanBo();
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
        
        // Trigger click on the new week
        setTimeout(function () {
            var targetDay = currentDate.getDate();
            var targetElement = $(".days li[ngay='" + targetDay + "']");
            if (targetElement.length > 0) {
                targetElement.trigger("click");
            }
        }, 100);
    },

    getList_TuanHienTai: function (strNgayBatDau, strNgayKetThuc, strNgayDangChon) {
        var me = this;
        me.iCurrentPage = 1;
        me.dtLichHoc = [];
        me.arrLopHocPhanMau = [];

        $("#scheduleGrid").html('<div style="padding: 40px; text-align: center; grid-column: 1/-1;"><i class="fas fa-spinner fa-spin fa-3x text-primary"></i><br/><br/><h5>Đang tải dữ liệu...</h5></div>');

        me.getList_CanBo(function() {
            if (me.dtCanBoFull.length === 0) {
                $("#scheduleGrid").html('<div style="padding: 40px; text-align: center; grid-column: 1/-1;">Không có dữ liệu giảng viên</div>');
                return;
            }

            // Hiển thị trang đầu tiên (có phân trang)
            me.dtCanBo = me.dtCanBoFull.slice(0, me.iPageSize);

            console.log("Trang 1: Hiển thị", me.dtCanBo.length, "/", me.dtCanBoFull.length, "giảng viên");

            me.loadSchedulesForPage(me.dtCanBo, function() {
                me.genTable_ThongTin(me.dtLichHoc, null);
            });
        });
    },

    loadSchedulesForPage: function (canBos, callback) {
        var me = this;
        var loadedCount = 0;

        if (canBos.length === 0) {
            if (typeof callback === 'function') callback();
            return;
        }

        canBos.forEach(function(canBo) {
            me.getList_LichCanBo(canBo.ID, function(schedules) {
                me.dtLichHoc = me.dtLichHoc.concat(schedules);
                loadedCount++;

                if (loadedCount === canBos.length) {
                    if (typeof callback === 'function') callback();
                }
            });
        });
    },

    loadMoreRooms: function () {
        var me = this;

        if (me.isLoading) return;
        if (me.dtCanBo.length >= me.dtCanBoFull.length) return;

        me.isLoading = true;
        me.iCurrentPage++;

        var startIndex = (me.iCurrentPage - 1) * me.iPageSize;
        var endIndex = Math.min(startIndex + me.iPageSize, me.dtCanBoFull.length);
        var newCanBos = me.dtCanBoFull.slice(startIndex, endIndex);

        console.log("Trang", me.iCurrentPage, ": Tải thêm", newCanBos.length, "giảng viên");

        me.loadSchedulesForPage(newCanBos, function() {
            me.dtCanBo = me.dtCanBo.concat(newCanBos);
            me.appendRoomsToGrid(newCanBos);
            me.isLoading = false;
        });
    },

    appendRoomsToGrid: function (newCanBos) {
        var me = this;
        var arrDays = me.getDaysInWeek(me.strNgayBatDau, me.strNgayKetThuc);
        var html = '';

        $(".scroll-notice").remove();

        var dateSet = {};
        arrDays.forEach(function (d) { dateSet[d.date] = true; });

        var currentRow = $("#scheduleGrid > div").length / (arrDays.length + 2) + 2;

        newCanBos.forEach(function (canBo) {
            var canBoSchedules = me.dtLichHoc.filter(function(item) {
                return item.IDCANBO === canBo.ID && dateSet[item.NGAYHOC];
            });

            var efficiency = me.calculateEfficiency(canBoSchedules, arrDays.length);

            var efficiencyClass = 'low';
            var efficiencyLabel = 'Thấp';
            if (efficiency > 60) {
                efficiencyClass = 'high';
                efficiencyLabel = 'Cao';
            } else if (efficiency > 30) {
                efficiencyClass = 'medium';
                efficiencyLabel = 'Trung bình';
            }

            var tenGV = ((canBo.HODEM || '') + ' ' + (canBo.TEN || '')).trim() || canBo.TENGIANGVIEN || '';
            var canBoInfo = '<div style="font-weight: 600; margin-bottom: 3px;">' + tenGV + '</div>';

            if (canBo.MASO) {
                canBoInfo += '<div style="font-size: 10px; color: #666; margin-bottom: 2px;">';
                canBoInfo += '<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-weight: 600;">' + canBo.MASO + '</span>';
                canBoInfo += '</div>';
            }

            var donVi = canBo.DAOTAO_COCAUTOCHUC_TEN || canBo.COCAUTOCHUC_TEN || '';
            if (donVi) {
                canBoInfo += '<div style="font-size: 9px; color: #888; font-style: italic;">' + donVi + '</div>';
            }

            html += '<div class="schedule-cell room-name" style="grid-column: 1; grid-row: ' + currentRow + ';">' + canBoInfo + '</div>';

            var modeLabel = me.getEfficiencyModeLabel();
            html += '<div class="schedule-cell efficiency ' + efficiencyClass + '" style="grid-column: 2; grid-row: ' + currentRow + ';">';
            html += '<div class="efficiency-percent">' + efficiency + '%</div>';
            html += '<div class="efficiency-label">' + efficiencyLabel + '</div>';
            html += '<div class="efficiency-bar">';
            html += '<div class="efficiency-bar-fill" style="width: ' + efficiency + '%"></div>';
            html += '</div>';
            html += '<div style="font-size: 9px; margin-top: 4px; opacity: 0.7;">' + modeLabel + '</div>';
            html += '</div>';
            
            arrDays.forEach(function (day, dayIndex) {
                var colStart = dayIndex + 3;

                var events = me.dtLichHoc.filter(function (item) {
                    return item.IDCANBO === canBo.ID && item.NGAYHOC === day.date;
                });

                var sangEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 1 && e.TIETBATDAU <= 6;
                });
                var chieuEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 7 && e.TIETBATDAU <= 10;
                });
                var toiEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 11 && e.TIETBATDAU <= 15;
                });

                [sangEvents, chieuEvents, toiEvents].forEach(function(arr) {
                    arr.sort(function (a, b) {
                        return (a.GIOBATDAU * 60 + a.PHUTBATDAU) - (b.GIOBATDAU * 60 + b.PHUTBATDAU);
                    });
                });

                html += '<div style="grid-column: ' + colStart + '; grid-row: ' + currentRow + '; display: flex; border: 1px solid #e0e0e0; min-height: 120px;">';

                // Ca sáng
                html += '<div style="flex: 1; padding: 4px; border-right: 1px solid #e0e0e0; background: #FFFEF5;">';
                sangEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'sang', idx);
                });
                html += '</div>';

                // Ca chiều
                html += '<div style="flex: 1; padding: 4px; border-right: 1px solid #e0e0e0; background: #F5F9FF;">';
                chieuEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'chieu', idx);
                });
                html += '</div>';

                // Ca tối
                html += '<div style="flex: 1; padding: 4px; background: #F9F5FF;">';
                toiEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'toi', idx);
                });
                html += '</div>';

                html += '</div>';
            });

            currentRow++;
        });

        $("#scheduleGrid").append(html);

        if (me.dtCanBo.length < me.dtCanBoFull.length) {
            var remaining = me.dtCanBoFull.length - me.dtCanBo.length;
            $("#scheduleGrid").append('<div class="scroll-notice" style="grid-column: 1/-1; padding: 20px; text-align: center; background: #f8f9fa; color: #666;"><i class="fas fa-arrow-down"></i> Cuộn xuống để xem thêm ' + remaining + ' giảng viên</div>');
        }
    },

    // Helper: render 1 event block
    renderEventHtml: function (event, canBoId, date, caKey, idx) {
        var me = this;
        var colorClass = me.getColorClass(event.IDLOPHOCPHAN);
        var uniqueId = event.ID || ('evt_' + canBoId + '_' + date + '_' + caKey + '_' + idx);
        var phongHoc = event.TENPHONGHOC || '';
        var tenHP = event.TENHOCPHAN || '';
        var html = '<div class="schedule-event ' + colorClass + '" data-event-id="' + uniqueId + '" data-canbo-id="' + canBoId + '" data-date="' + date + '" data-lophocphan="' + event.IDLOPHOCPHAN + '" title="' + tenHP + '" style="margin: 2px 0;">';
        html += '<div class="event-time">' + me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) + ' (T' + event.TIETBATDAU + '-' + event.TIETKETTHUC + ')</div>';
        html += '<div class="event-subject">' + tenHP + '</div>';
        if (phongHoc) {
            html += '<div class="event-teacher"><i class="fa-solid fa-door-open"></i> ' + phongHoc + '</div>';
        }
        html += '</div>';
        return html;
    },

    getList_CanBo: function (callback) {
        var me = this;

        var strDonVi_Id = $("#dropSearch_DonVi").val() || '';

        console.log("=== Calling getList_CanBo ===");
        console.log("Đơn vị ID:", strDonVi_Id);

        var obj = {
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 1000000,
            strCoCauToChuc_Id: strDonVi_Id,
            strTinhTrangNhanSu_Id: '',
            strNguoiThucHien_Id: '',
            dLaCanBoNgoaiTruong: -1
        };

        edu.system.getList_NhanSu(obj, function (data) {
            var arr = data || [];
            console.log("Số cán bộ từ API:", arr.length);

            me.dtCanBoOriginal = arr;
            me.dtCanBoFull = arr.slice();

            // Apply multi-cán bộ filter (ưu tiên nếu chọn nhiều giảng viên)
            var arrCanBo_Ids = $("#dropSearch_CanBoMulti").val() || [];
            if (arrCanBo_Ids.length > 0) {
                console.log("Lọc theo nhiều giảng viên:", arrCanBo_Ids.length);
                me.dtCanBoFull = me.dtCanBoFull.filter(function (cb) {
                    return arrCanBo_Ids.indexOf(cb.ID) !== -1;
                });
                console.log("Sau khi lọc nhiều giảng viên:", me.dtCanBoFull.length);
            } else {
                // Apply filter giảng viên cụ thể nếu có
                var strCanBo_Id = $("#dropSearch_CanBo").val() || '';
                if (strCanBo_Id) {
                    me.dtCanBoFull = me.dtCanBoFull.filter(function (cb) {
                        return cb.ID === strCanBo_Id;
                    });
                    console.log("Sau khi lọc giảng viên:", me.dtCanBoFull.length);
                }
            }

            if (typeof callback === 'function') callback();
        }, function () {
            if (typeof callback === 'function') callback();
        });
    },

    getList_LichCanBo: function (strCanBo_Id, callback) {
        var me = this;

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSLichGiang',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': strCanBo_Id,
            'strNgayBatDau': me.strNgayBatDau,
            'strNgayKetThuc': me.strNgayKetThuc,
            'strNgayDangChon': me.strNgayBatDau,
        };

        edu.system.makeRequest({
            success: function (data) {
                var arr = (data && data.Success) ? (data.Data || []) : [];
                // Gắn IDCANBO vào mỗi record để filter theo hàng giảng viên
                arr.forEach(function (e) { e.IDCANBO = strCanBo_Id; });
                if (typeof callback === 'function') callback(arr);
            },
            error: function () {
                if (typeof callback === 'function') callback([]);
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    getList_DonVi: function () {
        var me = this;

        console.log("=== Calling getList_DonVi ===");

        var obj = {
            strCCTC_Loai_Id: '',
            strCCTC_Cha_Id: '',
            iTrangThai: 1
        };

        edu.system.getList_CoCauToChuc(obj, '', '', function (data) {
            var arr = data || [];
            console.log("Tổng số đơn vị:", arr.length);
            me.dtDonVi = arr;
            me.genCombo_DonVi(arr);
        });
    },

    genCombo_DonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonVi"],
            title: "Tất cả khoa/đơn vị"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_DonVi").select2({
            placeholder: "Chọn khoa/đơn vị...",
            allowClear: true
        });
    },

    genCombo_CanBo: function () {
        var me = this;

        console.log("=== Calling genCombo_CanBo (toàn bộ cán bộ) ===");

        var obj = {
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 1000000,
            strCoCauToChuc_Id: '',
            strTinhTrangNhanSu_Id: '',
            strNguoiThucHien_Id: '',
            dLaCanBoNgoaiTruong: -1
        };

        edu.system.getList_NhanSu(obj, function (data) {
            var arr = data || [];
            console.log("Tổng số cán bộ dropdown:", arr.length);
            me.dtCanBoList = arr;
            me.renderCanBoDropdown(arr);
        });
    },

    // Build label hiển thị cho 1 cán bộ
    formatCanBoLabel: function (cb) {
        var label = ((cb.HODEM || '') + ' ' + (cb.TEN || '')).trim();
        if (cb.MASO) label += ' - ' + cb.MASO;
        if (cb.DAOTAO_COCAUTOCHUC_TEN) label += ' - ' + cb.DAOTAO_COCAUTOCHUC_TEN;
        return label || ('CB-' + cb.ID);
    },

    // Tạo cấu hình ajax phân trang client-side cho Select2
    buildCanBoSelect2Ajax: function () {
        var me = this;
        var pageSize = 50;

        return {
            placeholder: "",
            allowClear: true,
            // Bắt buộc có 1 option rỗng để Select2 ajax hoạt động bình thường
            // Custom transport: trả về dữ liệu từ dtCanBoList theo trang
            ajax: {
                transport: function (params, success) {
                    var term = (params.data.term || '').toLowerCase().trim();
                    var page = params.data.page || 1;
                    var source = me.dtCanBoList || [];

                    var filtered = term ? source.filter(function (cb) {
                        var label = me.formatCanBoLabel(cb).toLowerCase();
                        return label.indexOf(term) !== -1;
                    }) : source;

                    var startIdx = (page - 1) * pageSize;
                    var endIdx = startIdx + pageSize;
                    var slice = filtered.slice(startIdx, endIdx);

                    var results = slice.map(function (cb) {
                        return { id: cb.ID, text: me.formatCanBoLabel(cb) };
                    });

                    success({
                        results: results,
                        pagination: { more: endIdx < filtered.length }
                    });
                },
                delay: 150
            }
        };
    },

    // Đảm bảo option đang chọn có trong DOM (ajax chỉ load 1 trang)
    ensureSelectedOption: function ($el, ids) {
        var me = this;
        var arrIds = Array.isArray(ids) ? ids : (ids ? [ids] : []);
        arrIds.forEach(function (id) {
            if (!id) return;
            if ($el.find('option[value="' + id + '"]').length) return;
            var found = (me.dtCanBoList || []).find(function (c) { return c.ID === id; });
            if (found) {
                $el.append(new Option(me.formatCanBoLabel(found), found.ID, true, true));
            }
        });
    },

    renderCanBoDropdown: function (arr) {
        var me = this;

        // Lưu nguồn dữ liệu cho Select2 ajax dùng
        me.dtCanBoList = arr || [];

        var $single = $("#dropSearch_CanBo");
        var prevSingle = $single.val();
        if ($single.hasClass("select2-hidden-accessible")) {
            $single.select2('destroy');
        }
        $single.html('<option value=""></option>');

        var ajaxCfg = me.buildCanBoSelect2Ajax();
        $single.select2($.extend({}, ajaxCfg, {
            placeholder: "Tìm kiếm giảng viên...",
            allowClear: true,
            width: '100%'
        }));

        if (prevSingle) {
            me.ensureSelectedOption($single, prevSingle);
            $single.val(prevSingle).trigger('change.select2');
        }

        // Load multi-select với cùng cơ chế phân trang
        me.populateMultiCanBoDropdown(arr);
    },

    populateMultiCanBoDropdown: function (arr) {
        var me = this;
        var $multi = $("#dropSearch_CanBoMulti");

        me.dtCanBoList = arr || me.dtCanBoList || [];

        var prevMulti = $multi.val();
        if ($multi.hasClass("select2-hidden-accessible")) {
            $multi.select2('destroy');
        }
        $multi.html('');

        var ajaxCfg = me.buildCanBoSelect2Ajax();
        $multi.select2($.extend({}, ajaxCfg, {
            placeholder: "Chọn nhiều giảng viên...",
            allowClear: true,
            multiple: true,
            closeOnSelect: false,
            width: '100%'
        }));

        if (prevMulti && prevMulti.length) {
            me.ensureSelectedOption($multi, prevMulti);
            $multi.val(prevMulti).trigger('change.select2');
        }
    },

    loadCanBoByDonVi: function (donViId) {
        var me = this;

        console.log("=== Loading cán bộ by đơn vị:", donViId);

        var obj = {
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 1000000,
            strCoCauToChuc_Id: donViId || '',
            strTinhTrangNhanSu_Id: '',
            strNguoiThucHien_Id: '',
            dLaCanBoNgoaiTruong: -1
        };

        edu.system.getList_NhanSu(obj, function (data) {
            var arr = data || [];
            console.log("Số cán bộ theo đơn vị:", arr.length);
            me.dtCanBoList = arr;
            me.renderCanBoDropdown(arr);
            $("#dropSearch_CanBo").val('').trigger('change');
            $("#dropSearch_CanBoMulti").val(null);
        });
    },

    genTable_ThongTin: function (data, iPager) {
        var me = this;

        console.log("=== genTable_ThongTin ===");
        console.log("Số giảng viên:", me.dtCanBo.length);
        console.log("Số lịch:", data.length);

        if (me.dtCanBo.length === 0) {
            $("#scheduleGrid").html('<div style="padding: 40px; text-align: center; grid-column: 1/-1;">Không có dữ liệu giảng viên</div>');
            return;
        }

        var arrDays = me.getDaysInWeek(me.strNgayBatDau, me.strNgayKetThuc);

        var html = '';

        // Header chính - Giảng viên, Hiệu suất và các ngày
        html += '<div class="schedule-header" style="grid-column: 1; grid-row: 1 / 3;">Giảng viên</div>';
        html += '<div class="schedule-header" style="grid-column: 2; grid-row: 1 / 3;">Hiệu suất<br/>dạy học</div>';
        
        arrDays.forEach(function (day, index) {
            var colStart = index + 3;
            html += '<div class="schedule-header" style="grid-column: ' + colStart + '; grid-row: 1;">';
            html += '<div>' + day.dayName + '</div>';
            html += '<div style="font-size: 12px; font-weight: normal;">' + day.dateStr + '</div>';
            html += '</div>';
        });
        
        // Sub-header - Sáng/Chiều/Tối cho mỗi ngày
        arrDays.forEach(function (day, index) {
            var colStart = index + 3;
            html += '<div class="schedule-subheader" style="grid-column: ' + colStart + '; grid-row: 2;">';
            html += '<div>';
            html += '<div class="session-label" style="border-right: 1px solid #ddd; background: #FFF9E6;">';
            html += '<div class="session-name">☀️ SÁNG</div>';
            html += '<div class="session-time">Tiết 1-6</div>';
            html += '</div>';
            html += '<div class="session-label" style="border-right: 1px solid #ddd; background: #E6F3FF;">';
            html += '<div class="session-name">🌤️ CHIỀU</div>';
            html += '<div class="session-time">Tiết 7-10</div>';
            html += '</div>';
            html += '<div class="session-label" style="background: #F0E6FF;">';
            html += '<div class="session-name">🌙 TỐI</div>';
            html += '<div class="session-time">Tiết 11-15</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });

        // Set các ngày trong tuần để lọc lịch theo tuần hiện tại
        var dateSet = {};
        arrDays.forEach(function (d) { dateSet[d.date] = true; });

        // Dữ liệu từng giảng viên
        var currentRow = 3;
        me.dtCanBo.forEach(function (canBo) {
            var canBoSchedules = data.filter(function(item) {
                return item.IDCANBO === canBo.ID && dateSet[item.NGAYHOC];
            });

            var efficiency = me.calculateEfficiency(canBoSchedules, arrDays.length);

            var efficiencyClass = 'low';
            var efficiencyLabel = 'Thấp';
            if (efficiency > 60) {
                efficiencyClass = 'high';
                efficiencyLabel = 'Cao';
            } else if (efficiency > 30) {
                efficiencyClass = 'medium';
                efficiencyLabel = 'Trung bình';
            }

            var tenGV = ((canBo.HODEM || '') + ' ' + (canBo.TEN || '')).trim() || canBo.TENGIANGVIEN || '';
            var canBoInfo = '<div style="font-weight: 600; margin-bottom: 3px;">' + tenGV + '</div>';

            if (canBo.MASO) {
                canBoInfo += '<div style="font-size: 10px; color: #666; margin-bottom: 2px;">';
                canBoInfo += '<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-weight: 600;">' + canBo.MASO + '</span>';
                canBoInfo += '</div>';
            }

            var donVi = canBo.DAOTAO_COCAUTOCHUC_TEN || canBo.COCAUTOCHUC_TEN || '';
            if (donVi) {
                canBoInfo += '<div style="font-size: 9px; color: #888; font-style: italic;">' + donVi + '</div>';
            }

            html += '<div class="schedule-cell room-name" style="grid-column: 1; grid-row: ' + currentRow + ';">' + canBoInfo + '</div>';
            
            // Cột hiệu suất
            var modeLabel = me.getEfficiencyModeLabel();
            html += '<div class="schedule-cell efficiency ' + efficiencyClass + '" style="grid-column: 2; grid-row: ' + currentRow + ';">';
            html += '<div class="efficiency-percent">' + efficiency + '%</div>';
            html += '<div class="efficiency-label">' + efficiencyLabel + '</div>';
            html += '<div class="efficiency-bar">';
            html += '<div class="efficiency-bar-fill" style="width: ' + efficiency + '%"></div>';
            html += '</div>';
            html += '<div style="font-size: 9px; margin-top: 4px; opacity: 0.7;">' + modeLabel + '</div>';
            html += '</div>';
            
            arrDays.forEach(function (day, dayIndex) {
                var colStart = dayIndex + 3;

                var events = data.filter(function (item) {
                    return item.IDCANBO === canBo.ID && item.NGAYHOC === day.date;
                });

                var sangEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 1 && e.TIETBATDAU <= 6;
                });
                var chieuEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 7 && e.TIETBATDAU <= 10;
                });
                var toiEvents = events.filter(function(e) {
                    return e.TIETBATDAU && e.TIETBATDAU >= 11 && e.TIETBATDAU <= 15;
                });

                [sangEvents, chieuEvents, toiEvents].forEach(function(arr) {
                    arr.sort(function (a, b) {
                        return (a.GIOBATDAU * 60 + a.PHUTBATDAU) - (b.GIOBATDAU * 60 + b.PHUTBATDAU);
                    });
                });

                html += '<div style="grid-column: ' + colStart + '; grid-row: ' + currentRow + '; display: flex; border: 1px solid #e0e0e0; min-height: 120px;">';

                // Ca sáng
                html += '<div style="flex: 1; padding: 4px; border-right: 1px solid #e0e0e0; background: #FFFEF5;">';
                sangEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'sang', idx);
                });
                html += '</div>';

                // Ca chiều
                html += '<div style="flex: 1; padding: 4px; border-right: 1px solid #e0e0e0; background: #F5F9FF;">';
                chieuEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'chieu', idx);
                });
                html += '</div>';

                // Ca tối
                html += '<div style="flex: 1; padding: 4px; background: #F9F5FF;">';
                toiEvents.forEach(function (event, idx) {
                    html += me.renderEventHtml(event, canBo.ID, day.date, 'toi', idx);
                });
                html += '</div>';

                html += '</div>';
            });

            currentRow++;
        });

        $("#scheduleGrid").html(html);

        if (me.dtCanBoFull.length > me.dtCanBo.length) {
            var remaining = me.dtCanBoFull.length - me.dtCanBo.length;
            $("#scheduleGrid").append('<div class="scroll-notice" style="grid-column: 1/-1; padding: 20px; text-align: center; background: #f8f9fa; color: #666;"><i class="fas fa-arrow-down"></i> Cuộn xuống để xem thêm ' + remaining + ' giảng viên</div>');
        }

        console.log("Grid đã tạo với format Sáng/Chiều/Tối × giảng viên");
    },

    showScheduleDetail: function (strId, canBoId, date, lopHocPhan) {
        var me = this;

        console.log("=== Show Schedule Detail ===");
        console.log("ID:", strId, "CanBo:", canBoId, "Date:", date, "LopHocPhan:", lopHocPhan);
        console.log("Total schedules:", me.dtLichHoc.length);

        var objLich = me.dtLichHoc.find(function(e) { return e.ID === strId; });

        if (!objLich && canBoId && date && lopHocPhan) {
            console.log("Searching by canBo, date, and lophocphan...");
            objLich = me.dtLichHoc.find(function(e) {
                return e.IDCANBO === canBoId &&
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
        
        // Tiết học
        var tietHoc = 'Tiết ' + (objLich.TIETBATDAU || '?') + ' - ' + (objLich.TIETKETTHUC || '?');
        $("#txtTietHoc_Detail").val(tietHoc);
        
        // Giảng viên - ưu tiên dữ liệu từ dòng cán bộ (IDCANBO), fallback sang THONGTINGIANGVIEN
        var giangVienText = '';
        var idCanBo = objLich.IDCANBO || canBoId;
        if (idCanBo) {
            var pool = (me.dtCanBoFull && me.dtCanBoFull.length ? me.dtCanBoFull : me.dtCanBoOriginal) || [];
            var cb = pool.find(function (e) { return e.ID === idCanBo; });
            if (cb) {
                var ten = ((cb.HODEM || '') + ' ' + (cb.TEN || '')).trim();
                if (cb.MASO) ten += ' - ' + cb.MASO;
                giangVienText = ten;
            }
        }
        if (!giangVienText) {
            giangVienText = me.cleanHtmlTags(objLich.THONGTINGIANGVIEN) || 'Chưa có thông tin';
        }
        $("#txtGiangVien_Detail").val(giangVienText);
        
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

        var strDay = edu.util.dateToday();
        var iDay = parseInt(strDay.substr(0, strDay.indexOf("/")));

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

        var date = new Date();
        if (date.getMonth() + 1 != nMonth || date.getFullYear() != nYear) iDay = 1;

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
        setTimeout(function () {
            $(".days .active").trigger("click");
        }, 1000);

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

    showExportModal: function () {
        var me = this;

        if (!me.strNgayBatDau || !me.strNgayKetThuc) {
            edu.system.alert("Vui lòng chọn tuần trước khi xuất");
            return;
        }

        console.log("Opening export modal...");

        // Load danh sách GIẢNG VIÊN vào dropdown
        var canBoOptions = '<option value="">-- Chọn giảng viên --</option>';
        if (me.dtCanBoOriginal && me.dtCanBoOriginal.length > 0) {
            var sortedCanBos = me.dtCanBoOriginal.slice().sort(function(a, b) {
                var na = ((a.HODEM || '') + ' ' + (a.TEN || '')).trim();
                var nb = ((b.HODEM || '') + ' ' + (b.TEN || '')).trim();
                return na.localeCompare(nb);
            });

            sortedCanBos.forEach(function(cb) {
                var ten = ((cb.HODEM || '') + ' ' + (cb.TEN || '')).trim();
                var ma = cb.MASO ? (' - ' + cb.MASO) : '';
                canBoOptions += '<option value="' + cb.ID + '">' + ten + ma + '</option>';
            });
        }
        $("#exportCustomRoom").html(canBoOptions);

        $("#exportCustomRoom").select2({
            placeholder: "Tìm kiếm giảng viên...",
            allowClear: true,
            width: '100%',
            dropdownParent: $('#modal_export_excel')
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
        $("#customDateSection").hide();
        $("#customRangeSection").hide();
        $("#customRoomSection").hide();
        
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
        
        // Xác định giảng viên cần xuất
        var canBosToExport = [];
        if (roomFilter === "all") {
            if (me.dtCanBoOriginal && me.dtCanBoOriginal.length > 0) {
                canBosToExport = me.dtCanBoOriginal;
            } else {
                edu.system.alert("Đang tải danh sách giảng viên...");
                me.getList_CanBo(function() {
                    if (me.dtCanBoOriginal && me.dtCanBoOriginal.length > 0) {
                        me.processExport();
                    } else {
                        edu.system.alert("Không có dữ liệu giảng viên");
                    }
                });
                return;
            }
        } else if (roomFilter === "current") {
            canBosToExport = me.dtCanBoFull;
        } else if (roomFilter === "custom") {
            var selectedCanBoId = $("#exportCustomRoom").val();
            if (!selectedCanBoId) {
                edu.system.alert("Vui lòng chọn giảng viên");
                return;
            }
            canBosToExport = me.dtCanBoOriginal.filter(function(r) {
                return r.ID === selectedCanBoId;
            });
        }

        if (canBosToExport.length === 0) {
            edu.system.alert("Không có giảng viên nào để xuất");
            return;
        }

        console.log("Xuất Excel:");
        console.log("- Thời gian:", startDate, "-", endDate);
        console.log("- Số giảng viên:", canBosToExport.length);
        console.log("- Định dạng:", fileFormat);

        $("#modal_export_excel").modal("hide");

        me.exportWithCustomData(startDate, endDate, canBosToExport, fileFormat);
    },

    exportWithCustomData: function (startDate, endDate, canBos, fileFormat) {
        var me = this;
        var exportData = [];
        var loadedCount = 0;

        // Tạm hoán đổi ngày hiện tại để getList_LichCanBo dùng đúng khoảng
        var originalStart = me.strNgayBatDau;
        var originalEnd = me.strNgayKetThuc;
        me.strNgayBatDau = startDate;
        me.strNgayKetThuc = endDate;

        var finish = function () {
            me.strNgayBatDau = originalStart;
            me.strNgayKetThuc = originalEnd;
            if (fileFormat === "xlsx") {
                me.exportToExcelAdvanced(startDate, endDate, canBos, exportData);
            } else {
                me.exportToCSVAdvanced(startDate, endDate, canBos, exportData);
            }
        };

        canBos.forEach(function(canBo) {
            me.getList_LichCanBo(canBo.ID, function (arr) {
                exportData = exportData.concat(arr);
                loadedCount++;
                if (loadedCount === canBos.length) finish();
            });
        });
    },

    exportToExcelAdvanced: function (startDate, endDate, canBos, scheduleData) {
        var me = this;

        console.log("=== EXPORT EXCEL - LỊCH GIẢNG THEO GIẢNG VIÊN ===");

        me.exportToExcelWithXLSX(startDate, endDate, canBos, scheduleData);
    },

    exportToExcelWithXLSX: function (startDate, endDate, canBos, scheduleData) {
        var me = this;

        console.log("=== EXPORT WITH SIMPLE HTML TABLE METHOD ===");

        me.showExportLoading();

        setTimeout(function() {
            var arrDays = me.getDaysInWeek(startDate, endDate);

            var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
            html += '<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
            html += '<x:Name>Lịch giảng</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
            html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';

            html += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;font-family:Arial;">';

            var numCols = arrDays.length + 3;
            html += '<tr><td colspan="' + numCols + '" align="center" style="font-size:16px;font-weight:bold;height:30px;">LỊCH GIẢNG NHIỀU GIẢNG VIÊN</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Thời gian: ' + startDate + ' - ' + endDate + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Số giảng viên: ' + canBos.length + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:25px;">Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '</td></tr>';
            html += '<tr><td colspan="' + numCols + '" style="height:10px;"></td></tr>';

            html += '<tr style="background-color:#D9D9D9;font-weight:bold;height:35px;">';
            html += '<td align="center" style="width:50px;">STT</td>';
            html += '<td align="center" style="width:200px;">Giảng viên</td>';
            html += '<td align="center" style="width:80px;">Ca học</td>';
            arrDays.forEach(function(day) {
                html += '<td align="center" style="width:350px;">' + day.dayName + '<br>(' + day.dateStr + ')</td>';
            });
            html += '</tr>';

            var sttCounter = 1;

            canBos.forEach(function(canBo) {
                var canBoSchedules = scheduleData.filter(function(item) {
                    return item.IDCANBO === canBo.ID;
                });

                var tenGV = ((canBo.HODEM || '') + ' ' + (canBo.TEN || '')).trim() || canBo.TENGIANGVIEN || '';
                var maSo = canBo.MASO || '';
                var donVi = canBo.DAOTAO_COCAUTOCHUC_TEN || canBo.COCAUTOCHUC_TEN || '';
                var canBoHtml = tenGV;
                if (maSo) canBoHtml += '<br><i>' + maSo + '</i>';
                if (donVi) canBoHtml += '<br><small>' + donVi + '</small>';

                var sessions = [
                    { name: 'Sáng', min: 1, max: 6 },
                    { name: 'Chiều', min: 7, max: 10 },
                    { name: 'Tối', min: 11, max: 15 }
                ];

                sessions.forEach(function(session, sessionIndex) {
                    html += '<tr style="height:100px;">';

                    if (sessionIndex === 0) {
                        html += '<td align="center" rowspan="3" valign="middle">' + sttCounter + '</td>';
                        html += '<td rowspan="3" valign="middle">' + canBoHtml + '</td>';
                    }

                    html += '<td align="center" valign="middle" style="font-weight:bold;">' + session.name + '</td>';

                    arrDays.forEach(function(day) {
                        var events = canBoSchedules.filter(function(item) {
                            return item.NGAYHOC === day.date &&
                                   item.TIETBATDAU >= session.min &&
                                   item.TIETBATDAU <= session.max;
                        });

                        events.sort(function(a, b) {
                            return (a.GIOBATDAU * 60 + a.PHUTBATDAU) - (b.GIOBATDAU * 60 + b.PHUTBATDAU);
                        });

                        html += '<td valign="top" style="white-space:pre-wrap;">';

                        if (events.length > 0) {
                            events.forEach(function(event, idx) {
                                if (idx > 0) html += '<br>---<br>';

                                html += me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) +
                                       '-' + me.returnTwo(event.GIOKETTHUC) + ':' + me.returnTwo(event.PHUTKETTHUC);

                                if (event.TIETBATDAU) {
                                    html += ' (T' + event.TIETBATDAU;
                                    if (event.TIETKETTHUC && event.TIETKETTHUC !== event.TIETBATDAU) {
                                        html += '-' + event.TIETKETTHUC;
                                    }
                                    html += ')';
                                }

                                html += '<br>' + (event.TENHOCPHAN || '');

                                if (event.TENLOPHOCPHAN) {
                                    html += '<br>Lớp: ' + event.TENLOPHOCPHAN;
                                }

                                if (event.TENPHONGHOC) {
                                    html += '<br>Phòng: ' + event.TENPHONGHOC;
                                }
                            });
                        }

                        html += '</td>';
                    });

                    html += '</tr>';
                });

                sttCounter++;
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
            
            me.hideExportLoading();
            me.showExportSuccess(fileName, canBos.length, scheduleData.length);

            console.log("Excel file exported successfully!");
        }, 300);
    },
    
    // Hiển thị loading khi xuất file
    showExportLoading: function() {
        var loadingHtml = '<div id="exportLoadingOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">';
        loadingHtml += '<div style="background:white;padding:40px;border-radius:15px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);min-width:300px;">';
        loadingHtml += '<div class="spinner-border text-primary" role="status" style="width:60px;height:60px;border-width:6px;margin-bottom:20px;">';
        loadingHtml += '<span class="sr-only">Loading...</span>';
        loadingHtml += '</div>';
        loadingHtml += '<h4 style="color:#223771;margin:0 0 10px 0;font-weight:600;">Đang xuất file Excel...</h4>';
        loadingHtml += '<p style="color:#666;margin:0;font-size:14px;">Vui lòng đợi trong giây lát</p>';
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
        successHtml += '<p style="margin:0 0 10px 0;color:#495057;"><i class="fa fa-user-tie" style="color:#007bff;margin-right:10px;"></i><strong>Số giảng viên:</strong> ' + roomCount + '</p>';
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
    
    exportToCSVAdvanced: function (startDate, endDate, canBos, scheduleData) {
        var me = this;

        var csvContent = '';

        csvContent += 'LỊCH GIẢNG NHIỀU GIẢNG VIÊN\n';
        csvContent += 'Thời gian: ' + startDate + ' - ' + endDate + '\n';
        csvContent += 'Số giảng viên: ' + canBos.length + '\n';
        csvContent += 'Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '\n\n';

        var arrDays = me.getDaysInWeek(startDate, endDate);
        csvContent += 'STT,Giảng viên,Mã số,Đơn vị';
        arrDays.forEach(function (day) {
            csvContent += ',' + day.dayName + ' (' + day.dateStr + ')';
        });
        csvContent += '\n';

        canBos.forEach(function (canBo, index) {
            var tenGV = ((canBo.HODEM || '') + ' ' + (canBo.TEN || '')).trim() || canBo.TENGIANGVIEN || '';
            var maSo = canBo.MASO || '';
            var donVi = canBo.DAOTAO_COCAUTOCHUC_TEN || canBo.COCAUTOCHUC_TEN || '';

            csvContent += (index + 1)
                + ',"' + tenGV.replace(/"/g, '""') + '"'
                + ',"' + maSo.replace(/"/g, '""') + '"'
                + ',"' + donVi.replace(/"/g, '""') + '"';

            arrDays.forEach(function (day) {
                var events = scheduleData.filter(function (item) {
                    return item.IDCANBO === canBo.ID && item.NGAYHOC === day.date;
                });

                events.sort(function (a, b) {
                    return (a.GIOBATDAU * 60 + a.PHUTBATDAU) - (b.GIOBATDAU * 60 + b.PHUTBATDAU);
                });

                var cellContent = '';
                events.forEach(function (event, idx) {
                    if (idx > 0) cellContent += ' | ';

                    cellContent += me.returnTwo(event.GIOBATDAU) + ':' + me.returnTwo(event.PHUTBATDAU) +
                                  '-' + me.returnTwo(event.GIOKETTHUC) + ':' + me.returnTwo(event.PHUTKETTHUC);

                    if (event.TIETBATDAU) {
                        cellContent += ' (T' + event.TIETBATDAU + '-' + event.TIETKETTHUC + ')';
                    }

                    cellContent += ' ' + (event.TENHOCPHAN || '');

                    if (event.TENLOPHOCPHAN) {
                        cellContent += ' - Lớp: ' + event.TENLOPHOCPHAN;
                    }

                    if (event.TENPHONGHOC) {
                        cellContent += ' - Phòng: ' + event.TENPHONGHOC;
                    }
                });

                csvContent += ',"' + cellContent.replace(/"/g, '""') + '"';
            });

            csvContent += '\n';
        });

        csvContent += '\nTHỐNG KÊ\n';
        csvContent += 'Tổng số giảng viên:,' + canBos.length + '\n';
        csvContent += 'Tổng số lịch:,' + scheduleData.length + '\n';

        var BOM = "\uFEFF";
        var blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);

        var fileName = me.generateSmartFileName(startDate, endDate).replace('.xls', '.csv');

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        me.showExportSuccess(fileName, canBos.length, scheduleData.length);
    },
}
