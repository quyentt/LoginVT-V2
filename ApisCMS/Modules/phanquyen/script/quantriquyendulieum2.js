/*----------------------------------------------
--Author: 
--Date of created: 
--Note: Quản trị quyền dữ liệu - Hiển thị động theo vai trò
----------------------------------------------*/
function PhanQuyenDuLieuM2() { };
PhanQuyenDuLieuM2.prototype = {
    dsVaiTro: [], // Danh sách vai trò từ API
    dsDimensions: [], // Danh sách các chiều dữ liệu (Hệ, Khóa, Khoa, CT, Lớp)
    dsDataDimension: [], // Danh sách giá trị của các chiều
    dimensionGroups: {}, // Nhóm dữ liệu theo chiều {dimensionId: {name: '', data: []}}
    dsGrouped: {}, // Dữ liệu đã nhóm theo chiều
    dsPermissions: {}, // Quyền hiện tại {vaiTroId_dimensionValueId: true}
    currentDimensionName: '', // Tên chiều đang chọn
    
    // Phân trang modal
    modalCurrentPage: 1,
    modalPageSize: 10,
    modalTotalRecords: 0,
    modalTotalPages: 0,
    modalData: [],
    modalFilteredData: null, // Dữ liệu đã lọc theo tìm kiếm
    
    // Phân trang
    currentPage: 1,
    pageSize: 50,
    totalRecords: 0,
    totalPages: 0,
    
    // Filter
    selectedDimensionId: '', // Chiều đang chọn để filter
    
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: new Date(),
    
    init: function () {
        var me = this;
        me.page_load();
        
        // Khởi tạo calendar
        me.initCalendar();
        
        // Sự kiện tìm kiếm
        $("#btnSearch").click(function () {
            me.genTable_DuLieu();
        });
        
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.genTable_DuLieu();
            }
        });
        
        // Sự kiện lưu phân quyền
        $("#btnLuuPhanQuyen").click(function () {
            me.save_PhanQuyen();
        });
        
        // Sự kiện tìm kiếm trong bảng (debounce 300ms)
        var tableSearchTimeout;
        $("#txtSearchTable").on('input', function () {
            clearTimeout(tableSearchTimeout);
            tableSearchTimeout = setTimeout(function() {
                me.filterTable();
            }, 300);
        });
        
        // Sự kiện tìm kiếm khi nhấn Enter cho bảng
        $("#txtSearchTable").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                clearTimeout(tableSearchTimeout);
                me.filterTable();
            }
        });
        
        // Sự kiện nút xóa bộ lọc
        $("#btnClearSearch").click(function() {
            $("#txtSearchTable").val('');
            me.filterTable();
        });
        
        // Sự kiện checkbox select all theo cột
        $("#tblPhanQuyenDuLieu").delegate(".chkSelectAllCol", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var colIndex = $(this).data("col-index");
            $("#tblPhanQuyenDuLieu tbody tr").each(function() {
                $(this).find("td").eq(colIndex).find("input[type='checkbox']").prop("checked", checked_status);
            });
        });
        
        // Sự kiện calendar
        $("#btnPrevMonth").click(function () {
            me.changeMonth(-1);
        });
        
        $("#btnNextMonth").click(function () {
            me.changeMonth(1);
        });
    },
    
    page_load: function () {
        var me = this;
        // Load danh sách vai trò
        me.getList_VaiTro();
    },
    
    /*------------------------------------------
    --Lọc bảng dữ liệu theo từ khóa
    -------------------------------------------*/
    filterTable: function() {
        var me = this;
        var keyword = $("#txtSearchTable").val().toLowerCase().trim();
        
        // Xóa highlight cũ
        $("#tblPhanQuyenDuLieu tbody tr").removeClass('search-highlight');
        
        // Hiển thị/ẩn nút xóa bộ lọc
        if (keyword) {
            $("#btnClearSearch").show();
        } else {
            $("#btnClearSearch").hide();
        }
        
        if (!keyword) {
            // Hiển thị lại tất cả dòng
            $("#tblPhanQuyenDuLieu tbody tr").show();
            $("#searchResultCount").text('');
            return;
        }
        
        var foundCount = 0;
        var totalRows = $("#tblPhanQuyenDuLieu tbody tr").length;
        
        // Lọc các dòng trong bảng
        $("#tblPhanQuyenDuLieu tbody tr").each(function() {
            var $row = $(this);
            var rowText = $row.text().toLowerCase();
            
            if (rowText.indexOf(keyword) !== -1) {
                $row.show().addClass('search-highlight');
                foundCount++;
            } else {
                $row.hide();
            }
        });
        
        // Hiển thị số lượng kết quả
        if (foundCount === 0) {
            $("#searchResultCount").html('<i class="fa-solid fa-exclamation-triangle" style="color: #dc3545;"></i> Không tìm thấy');
        } else {
            $("#searchResultCount").html('<i class="fa-solid fa-check-circle" style="color: #28a745;"></i> ' + foundCount + '/' + totalRows + ' kết quả');
        }
    },
    
    /*------------------------------------------
    --Lấy danh sách vai trò dạng cây cha-con
    -------------------------------------------*/
    getList_VaiTro: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_VaiTro/LayDanhSach',
            'strLoaiVaiTro_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var raw = data.Data || [];
                    // Xây cây cha-con → danh sách phẳng có thứ tự + depth
                    me.dsVaiTro = me.buildVaiTroTree(raw);
                    $("#lblSoLuongVaiTro").text(me.dsVaiTro.length);
                    me.getList_DataDimension();
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Xây cây cha-con → mảng phẳng có thứ tự + depth
    -------------------------------------------*/
    buildVaiTroTree: function (data) {
        var childrenMap = {};
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var pid = item.CHUNG_VAITRO_CHA_ID || '#';
            if (!childrenMap[pid]) childrenMap[pid] = [];
            childrenMap[pid].push(item);
        }

        // Sắp xếp mỗi nhóm theo THUTU rồi TENVAITRO
        for (var pid in childrenMap) {
            childrenMap[pid].sort(function(a, b) {
                var ta = (a.THUTU != null ? a.THUTU : 999);
                var tb = (b.THUTU != null ? b.THUTU : 999);
                if (ta !== tb) return ta - tb;
                return (a.TENVAITRO || '').localeCompare(b.TENVAITRO || '', 'vi');
            });
        }

        var result = [];
        // lineGuides: mảng boolean cho từng cấp tổ tiên,
        // lineGuides[d] = true nếu ở cấp d vẫn còn node anh em phía dưới (cần vẽ đường dọc)
        function walk(nodeId, depth, lineGuides) {
            var children = childrenMap[nodeId];
            if (!children) return;
            for (var j = 0; j < children.length; j++) {
                var node = children[j];
                var isLast = (j === children.length - 1);
                node._depth = depth;
                node._isLast = isLast;
                node._lineGuides = lineGuides.slice();
                result.push(node);
                walk(node.ID, depth + 1, lineGuides.concat([!isLast]));
            }
        }
        walk('#', 0, []);

        // Fallback: nếu cây rỗng (không có root '#') thì dùng flat
        if (result.length === 0) {
            for (var k = 0; k < data.length; k++) {
                data[k]._depth = 0;
                data[k]._isLast = true;
                data[k]._lineGuides = [];
            }
            return data;
        }
        return result;
    },
    
    /*------------------------------------------
    --Lấy danh sách chiều dữ liệu (Data Dimension)
    -------------------------------------------*/
    getList_DataDimension: function () {
        var me = this;
        
        // Bước 1: Lấy danh sách các chiều dữ liệu
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUgNSAeBSgsJC8yKC4v',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Data_Dimension',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dsDimensions = data.Data || [];
                    
                    // Bước 2: Load giá trị cho từng chiều
                    me.loadAllDimensionValues();
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Load giá trị cho TẤT CẢ các chiều (hiển thị cùng lúc)
    -------------------------------------------*/
    loadAllDimensionValues: function () {
        var me = this;
        
        // Ẩn dropdown vì không cần nữa
        $("#ddlDimension").closest('.search-bar-controls').find('select').parent().hide();
        
        // Load tất cả các chiều
        me.loadAllDimensionsData();
    },
    
    /*------------------------------------------
    --Load dữ liệu cho tất cả các chiều
    -------------------------------------------*/
    loadAllDimensionsData: function () {
        var me = this;
        me.dsDataDimension = [];
        me.dimensionGroups = {}; // Nhóm theo chiều {dimensionId: {name: '', data: []}}
        
        var loadedCount = 0;
        var totalDimensions = me.dsDimensions.length;
        
        if (totalDimensions === 0) {
            me.genTable_DuLieu();
            return;
        }
        
        // Load từng chiều
        for (var i = 0; i < me.dsDimensions.length; i++) {
            var dimension = me.dsDimensions[i];
            var dimensionId = dimension.ID || dimension.CORE_DATA_DIMENSION_ID;
            var dimensionName = dimension.DIMENSION_NAME || dimension.TEN;
            
            (function(dimId, dimName) {
                var obj_list = {
                    'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUoLCQvMiguLx4XIC00JAPP',
                    'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Dimension_Value',
                    'iM': 'Azz',
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strCore_Data_Dimension_Id': dimId,
                    'strNguoiThucHien_Id': edu.system.userId
                };
                
                edu.system.makeRequest({
                    success: function (data) {
                        loadedCount++;
                        
                        if (data.Success && data.Data) {
                            me.dimensionGroups[dimId] = {
                                name: dimName,
                                data: data.Data,
                                order: loadedCount
                            };
                            
                            // Gắn thông tin chiều vào từng item
                            for (var j = 0; j < data.Data.length; j++) {
                                data.Data[j].DIMENSION_NAME = dimName;
                                data.Data[j].CORE_DATA_DIMENSION_ID = dimId;
                                me.dsDataDimension.push(data.Data[j]);
                            }
                        }
                        
                        // Khi đã load xong tất cả
                        if (loadedCount === totalDimensions) {
                            me.totalRecords = me.dsDataDimension.length;
                            me.genTable_DuLieu();
                        }
                    },
                    error: function (er) {
                        loadedCount++;
                        if (loadedCount === totalDimensions) {
                            me.totalRecords = me.dsDataDimension.length;
                            me.genTable_DuLieu();
                        }
                    },
                    type: "POST",
                    action: obj_list.action,
                    contentType: true,
                    data: obj_list
                }, false, false, false, null);
            })(dimensionId, dimensionName);
        }
    },
    
    /*------------------------------------------
    --Render dropdown chọn chiều dữ liệu
    -------------------------------------------*/
    renderDimensionFilter: function () {
        var me = this;
        var html = '<option value="">-- Chọn chiều dữ liệu --</option>';
        
        for (var i = 0; i < me.dsDimensions.length; i++) {
            var dim = me.dsDimensions[i];
            var id = dim.ID || dim.CORE_DATA_DIMENSION_ID;
            var name = dim.DIMENSION_NAME || dim.TEN;
            html += '<option value="' + id + '">' + name + '</option>';
        }
        
        $("#ddlDimension").html(html);
        
        // Bind event
        $("#ddlDimension").change(function() {
            me.selectedDimensionId = $(this).val();
            me.currentPage = 1;
            if (me.selectedDimensionId) {
                me.loadDimensionValues(me.selectedDimensionId);
            } else {
                me.dsDataDimension = [];
                me.totalRecords = 0;
                me.totalPages = 0;
                me.genTable_DuLieu();
            }
        });
    },
    
    /*------------------------------------------
    --Load giá trị cho 1 chiều cụ thể
    -------------------------------------------*/
    loadDimensionValues: function (dimensionId) {
        var me = this;
        me.dsDataDimension = [];
        
        var dimension = me.dsDimensions.find(function(d) {
            return (d.ID || d.CORE_DATA_DIMENSION_ID) === dimensionId;
        });
        
        if (!dimension) return;
        
        var dimensionName = dimension.TEN || dimension.CORE_DATA_DIMENSION_NAME || 'Khác';
        
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUoLCQvMiguLx4XIC00JAPP',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Dimension_Value',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCore_Data_Dimension_Id': dimensionId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Data) {
                    // Gắn tên chiều vào từng giá trị
                    for (var j = 0; j < data.Data.length; j++) {
                        data.Data[j].DIMENSION_NAME = dimensionName;
                        data.Data[j].CORE_DATA_DIMENSION_ID = dimensionId;
                        me.dsDataDimension.push(data.Data[j]);
                    }
                    
                    me.totalRecords = me.dsDataDimension.length;
                    me.totalPages = Math.ceil(me.totalRecords / me.pageSize);
                    me.currentDimensionName = dimensionName; // Lưu tên chiều hiện tại
                    me.genTable_DuLieu();
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi load dữ liệu");
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Nhóm dữ liệu theo chiều (Dimension)
    -------------------------------------------*/
    groupDataByDimension: function () {
        var me = this;
        
        // Nhóm dữ liệu theo DIMENSION_NAME hoặc DIMENSION_TYPE
        me.dsGrouped = {};
        
        for (var i = 0; i < me.dsDataDimension.length; i++) {
            var item = me.dsDataDimension[i];
            var dimensionName = item.DIMENSION_NAME || item.CORE_DATA_DIMENSION_NAME || 'Khác';
            
            if (!me.dsGrouped[dimensionName]) {
                me.dsGrouped[dimensionName] = [];
            }
            
            me.dsGrouped[dimensionName].push(item);
        }
    },
    
    /*------------------------------------------
    --Tạo bảng hiển thị dữ liệu - HIỂN THỊ TẤT CẢ 6 CHIỀU
    --Header 2 dòng: Dòng 1 = Tên chiều (colspan), Dòng 2 = Giá trị cụ thể
    --Body: Mỗi dòng = 1 vai trò
    -------------------------------------------*/
    genTable_DuLieu: function () {
        var me = this;
        
        if (Object.keys(me.dimensionGroups).length === 0) {
            $("#tblPhanQuyenDuLieu thead").html('');
            $("#tblPhanQuyenDuLieu tbody").html('<tr><td colspan="2" style="text-align: center; padding: 40px; color: #999;"><i class="fa-solid fa-inbox fa-3x" style="display: block; margin-bottom: 15px; opacity: 0.3;"></i><div style="font-size: 16px;">Đang tải dữ liệu...</div></td></tr>');
            return;
        }
        
        // Sắp xếp các chiều theo thứ tự
        var sortedDimensions = [];
        for (var dimId in me.dimensionGroups) {
            sortedDimensions.push({
                id: dimId,
                name: me.dimensionGroups[dimId].name,
                data: me.dimensionGroups[dimId].data,
                order: me.dimensionGroups[dimId].order
            });
        }
        sortedDimensions.sort(function(a, b) { return a.order - b.order; });
        
        // Tạo header dòng 1 - Tên các chiều với colspan
        var htmlHead1 = '<tr>';
        htmlHead1 += '<th rowspan="2" class="td-center" style="min-width: 200px; position: sticky; left: 0; z-index: 12; background: #223771; vertical-align: middle;">';
        htmlHead1 += '<div style="font-weight: 600; font-size: 13px;">Vai trò</div>';
        htmlHead1 += '</th>';
        
        for (var i = 0; i < sortedDimensions.length; i++) {
            var dim = sortedDimensions[i];
            htmlHead1 += '<th class="td-center" style="background: #3c5398; color: white; padding: 10px; border: 1px solid #223771;">';
            htmlHead1 += '<div style="font-weight: 600; font-size: 13px;">' + dim.name + '</div>';
            htmlHead1 += '<div style="font-size: 10px; margin-top: 3px; opacity: 0.9;">(' + dim.data.length + ' giá trị)</div>';
            htmlHead1 += '</th>';
        }
        htmlHead1 += '</tr>';
        
        $("#tblPhanQuyenDuLieu thead").html(htmlHead1);
        
        // Tạo body - Mỗi dòng là 1 vai trò
        var htmlBody = '';
        
        if (me.dsVaiTro.length > 0) {
            for (var v = 0; v < me.dsVaiTro.length; v++) {
                var vaiTro = me.dsVaiTro[v];
                htmlBody += '<tr>';
                
                // Cột đầu tiên: Tên vai trò (cây cha-con với đường kẻ nối CSS)
                var depth = vaiTro._depth || 0;
                var isLast = vaiTro._isLast !== false;
                var lineGuides = vaiTro._lineGuides || [];
                var bgColor = depth === 0 ? '#e8edf5' : '#f8f9fa';
                var fontWeight = depth === 0 ? '700' : '500';
                var paddingLeft = depth * 20 + 12;
                htmlBody += '<td style="padding: 0; position: sticky; left: 0; background: ' + bgColor + '; z-index: 5; border-right: 2px solid #dee2e6;">';
                htmlBody += '<div style="position:relative; padding: 9px 12px 9px ' + paddingLeft + 'px; display:flex; align-items:center; gap:5px; min-height:38px;">';

                if (depth > 0) {
                    var lineColor = '#b0b8c9';
                    var connX = (depth - 1) * 20 + 10; // x của đường nối tại cấp hiện tại

                    // Đường dọc từ trên xuống giữa (luôn vẽ cho depth > 0)
                    htmlBody += '<div style="position:absolute;left:' + connX + 'px;top:0;height:50%;border-left:1.5px solid ' + lineColor + ';"></div>';
                    // Đường ngang nối vào icon
                    htmlBody += '<div style="position:absolute;left:' + connX + 'px;top:50%;width:10px;border-bottom:1.5px solid ' + lineColor + ';"></div>';
                    // Đường dọc từ giữa xuống dưới (nếu không phải con cuối)
                    if (!isLast) {
                        htmlBody += '<div style="position:absolute;left:' + connX + 'px;top:50%;bottom:0;border-left:1.5px solid ' + lineColor + ';"></div>';
                    }
                    // Đường dọc xuyên suốt cho các cấp tổ tiên vẫn còn anh em phía dưới
                    for (var d = 0; d < depth - 1; d++) {
                        if (lineGuides[d]) {
                            var gx = d * 20 + 10;
                            htmlBody += '<div style="position:absolute;left:' + gx + 'px;top:0;bottom:0;border-left:1.5px solid ' + lineColor + ';"></div>';
                        }
                    }
                }

                htmlBody += '<i class="fa-solid fa-' + (depth === 0 ? 'users' : 'user-shield') + '" style="color:#223771;font-size:11px;flex-shrink:0;"></i>';
                htmlBody += '<span style="font-weight:' + fontWeight + ';font-size:12px;">' + (vaiTro.TENVAITRO || 'N/A') + '</span>';
                htmlBody += '</div>';
                htmlBody += '</td>';
                
                // Checkbox cho từng giá trị của từng chiều
                for (var i = 0; i < sortedDimensions.length; i++) {
                    var dim = sortedDimensions[i];
                    
                    htmlBody += '<td class="td-center" style="border: 1px solid #e0e0e0; padding: 8px;">';
                    htmlBody += '<div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">';
                    
                    // Nút Xem kết quả
                    htmlBody += '<button type="button" class="btn btn-sm btn-info btnXemKetQua" ';
                    htmlBody += 'data-vaitro-id="' + (vaiTro.ID || vaiTro.VAITRO_ID) + '" ';
                    htmlBody += 'data-vaitro-name="' + (vaiTro.TENVAITRO || vaiTro.TEN || 'N/A') + '" ';
                    htmlBody += 'data-dimension-id="' + dim.id + '" ';
                    htmlBody += 'data-dimension-name="' + dim.name + '" ';
                    htmlBody += 'style="font-size: 10px; padding: 3px 6px; white-space: nowrap;" title="Xem các quyền đã gán">';
                    htmlBody += '<i class="fa-solid fa-list-check"></i> Xem kết quả';
                    htmlBody += '</button>';
                    
                    // Nút Thêm quyền
                    htmlBody += '<button type="button" class="btn btn-sm btn-success btnThemQuyen" ';
                    htmlBody += 'data-vaitro-id="' + (vaiTro.ID || vaiTro.VAITRO_ID) + '" ';
                    htmlBody += 'data-vaitro-name="' + (vaiTro.TENVAITRO || vaiTro.TEN || 'N/A') + '" ';
                    htmlBody += 'data-dimension-id="' + dim.id + '" ';
                    htmlBody += 'data-dimension-name="' + dim.name + '" ';
                    htmlBody += 'style="font-size: 10px; padding: 3px 6px; white-space: nowrap;" title="Thêm quyền mới">';
                    htmlBody += '<i class="fa-solid fa-plus"></i> Thêm quyền';
                    htmlBody += '</button>';
                    
                    htmlBody += '</div>';
                    htmlBody += '</td>';
                }
                
                htmlBody += '</tr>';
            }
        } else {
            var totalCols = 1 + sortedDimensions.length;
            
            htmlBody += '<tr>';
            htmlBody += '<td colspan="' + totalCols + '" style="text-align: center; padding: 40px; color: #999;">';
            htmlBody += '<i class="fa-solid fa-users-slash fa-3x" style="display: block; margin-bottom: 15px; opacity: 0.3;"></i>';
            htmlBody += '<div style="font-size: 16px;">Chưa có vai trò</div>';
            htmlBody += '</td>';
            htmlBody += '</tr>';
        }
        
        $("#tblPhanQuyenDuLieu tbody").html(htmlBody);
        
        // Bind event cho nút Xem kết quả
        $(".btnXemKetQua").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var vaiTroId = $(this).data("vaitro-id");
            var vaiTroName = $(this).data("vaitro-name");
            var dimensionId = $(this).data("dimension-id");
            var dimensionName = $(this).data("dimension-name");
            
            me.showResultModal(vaiTroId, vaiTroName, dimensionId, dimensionName);
            return false;
        });
        
        // Bind event cho nút Thêm quyền
        $(".btnThemQuyen").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var vaiTroId = $(this).data("vaitro-id");
            var vaiTroName = $(this).data("vaitro-name");
            var dimensionId = $(this).data("dimension-id");
            var dimensionName = $(this).data("dimension-name");
            
            me.showAddPermissionModal(vaiTroId, vaiTroName, dimensionId, dimensionName);
            return false;
        });
        
        // Không cần phân trang nữa vì hiển thị tất cả
        $("#paginationContainer").html('<div style="padding: 15px; text-align: center; background: #f8f9fa; border-radius: 6px; margin-top: 15px;"><strong>Tổng: ' + me.totalRecords + ' giá trị</strong> từ ' + sortedDimensions.length + ' chiều dữ liệu</div>');
    },
    
    /*------------------------------------------
    --Hiển thị modal chi tiết để chọn giá trị (CÓ PHÂN TRANG)
    -------------------------------------------*/
    showDetailModal: function(vaiTroId, vaiTroName, dimensionId, dimensionName) {
        var me = this;
        
        // Lấy dữ liệu của chiều này
        var dimensionData = me.dimensionGroups[dimensionId];
        if (!dimensionData) {
            edu.system.alert("Không tìm thấy dữ liệu");
            return;
        }
        
        // Reset phân trang
        me.modalCurrentPage = 1;
        me.modalPageSize = 10;
        me.modalData = dimensionData.data;
        me.modalFilteredData = null; // Reset dữ liệu lọc
        me.modalTotalRecords = me.modalData.length;
        me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
        me.modalVaiTroId = vaiTroId;
        me.modalDimensionId = dimensionId;
        me.modalExistingPermissions = {}; // {valueId: scopeId}
        
        // Tạo HTML cho modal
        var modalHtml = '';
        modalHtml += '<div id="modalChiTiet" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
        modalHtml += '<div style="background: white; border-radius: 8px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">';
        
        // Header
        modalHtml += '<div style="background: linear-gradient(135deg, #223771 0%, #3c5398 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">';
        modalHtml += '<h5 style="margin: 0; font-size: 16px;"><i class="fa-solid fa-user-shield"></i> ' + vaiTroName + ' - ' + dimensionName + ' (' + me.modalTotalRecords + ' giá trị)</h5>';
        modalHtml += '<button id="btnCloseModal" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">&times;</button>';
        modalHtml += '</div>';
        
        // Body
        modalHtml += '<div style="padding: 20px; flex: 1; overflow-y: auto;">';
        modalHtml += '<div style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">';
        modalHtml += '<strong>Hướng dẫn:</strong> Chọn các giá trị bạn muốn gán quyền cho vai trò này. Các giá trị đã có quyền sẽ được đánh dấu sẵn.';
        modalHtml += '</div>';
        
        // Search Bar trong modal
        modalHtml += '<div style="margin-bottom: 15px; padding: 12px; background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%); border: 1px solid #28a745; border-radius: 6px;">';
        modalHtml += '<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">';
        modalHtml += '<label style="font-size: 13px; font-weight: 600; color: #155724; white-space: nowrap;">';
        modalHtml += '<i class="fa-solid fa-search"></i> Tìm kiếm:';
        modalHtml += '</label>';
        modalHtml += '<div style="flex: 1; position: relative; min-width: 200px;">';
        modalHtml += '<input type="text" id="txtModalSearch" placeholder="Nhập mã, tên để tìm kiếm..." ';
        modalHtml += 'style="width: 100%; padding: 8px 35px 8px 12px; border: 1px solid #28a745; border-radius: 4px; font-size: 13px;">';
        modalHtml += '<i class="fa-solid fa-search" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #28a745;"></i>';
        modalHtml += '</div>';
        modalHtml += '<div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #155724; white-space: nowrap;">';
        modalHtml += '<label>Hiển thị:</label>';
        modalHtml += '<select id="ddlModalPageSize" style="padding: 4px 8px; border: 1px solid #28a745; border-radius: 3px; font-size: 12px;">';
        modalHtml += '<option value="10" selected>10</option>';
        modalHtml += '<option value="20">20</option>';
        modalHtml += '<option value="50">50</option>';
        modalHtml += '<option value="100">100</option>';
        modalHtml += '</select>';
        modalHtml += '</div>';
        modalHtml += '<button type="button" id="btnClearModalSearch" class="btn btn-outline-secondary btn-sm" style="padding: 6px 10px; font-size: 11px; display: none;">';
        modalHtml += '<i class="fa-solid fa-times"></i> Xóa';
        modalHtml += '</button>';
        modalHtml += '<div id="modalSearchCount" style="font-size: 11px; color: #666; white-space: nowrap;"></div>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        
        // Loading indicator
        modalHtml += '<div id="modalLoadingIndicator" style="text-align: center; padding: 20px;">';
        modalHtml += '<i class="fa-solid fa-spinner fa-spin fa-2x" style="color: #223771;"></i>';
        modalHtml += '<div style="margin-top: 10px;">Đang tải quyền hiện tại...</div>';
        modalHtml += '</div>';
        
        // Container cho bảng
        modalHtml += '<div id="modalTableContainer" style="display: none;"></div>';
        
        // Container cho phân trang
        modalHtml += '<div id="modalPaginationContainer" style="margin-top: 15px;"></div>';
        
        modalHtml += '</div>';
        
        // Footer
        modalHtml += '<div style="padding: 15px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; gap: 10px; background: #f8f9fa; border-radius: 0 0 8px 8px;">';
        modalHtml += '<button type="button" class="btn btn-secondary" id="btnDongModal" style="padding: 8px 16px;"><i class="fa-solid fa-times"></i> Đóng</button>';
        modalHtml += '<button type="button" class="btn btn-success" id="btnThemChiTiet" style="padding: 8px 16px;"><i class="fa-solid fa-plus"></i> Thêm</button>';
        modalHtml += '</div>';
        
        modalHtml += '</div>';
        modalHtml += '</div>';
        
        // Xóa modal cũ nếu có
        $("#modalChiTiet").remove();
        
        // Thêm modal vào body
        $("body").append(modalHtml);
        
        // Load quyền hiện tại trước
        me.loadExistingPermissions(vaiTroId, dimensionId, function() {
            // Sau khi load xong quyền, render bảng
            $("#modalLoadingIndicator").hide();
            $("#modalTableContainer").show();
            me.renderModalTable(vaiTroId, dimensionId);
        });
        
        // Bind event đóng modal
        $("#btnCloseModal, #btnDongModal, #modalChiTiet").click(function(e) {
            if (e.target.id === "modalChiTiet" || e.target.id === "btnCloseModal" || e.target.id === "btnDongModal") {
                $("#modalChiTiet").remove();
            }
        });
        
        // Ngăn click vào content đóng modal
        $("#modalChiTiet > div").click(function(e) {
            e.stopPropagation();
        });
        
        // Bind event cho tìm kiếm trong modal
        var modalSearchTimeout;
        $("#txtModalSearch").on('input', function() {
            clearTimeout(modalSearchTimeout);
            modalSearchTimeout = setTimeout(function() {
                me.filterModalTable();
            }, 300);
        });
        
        $("#txtModalSearch").keypress(function(e) {
            if (e.which === 13) {
                e.preventDefault();
                clearTimeout(modalSearchTimeout);
                me.filterModalTable();
            }
        });
        
        $("#btnClearModalSearch").click(function() {
            $("#txtModalSearch").val('');
            me.filterModalTable();
        });
        
        // Event cho thay đổi page size
        $("#ddlModalPageSize").change(function() {
            me.modalPageSize = parseInt($(this).val());
            me.modalCurrentPage = 1;
            me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
            me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
        });
        
        // Bind event cho nút Thêm
        $("#btnThemChiTiet").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var selectedValues = [];
            $(".chkDetailItem:not([data-scope-id]):checked").each(function() {
                // Chỉ lấy các checkbox chưa có quyền (không có data-scope-id)
                var valueId = $(this).data("value-id");
                selectedValues.push(valueId);
                console.log("Selected value to add:", valueId, "Has scope-id:", $(this).attr("data-scope-id"));
            });
            
            console.log("Total selected values to add:", selectedValues.length);
            console.log("Selected values:", selectedValues);
            
            if (selectedValues.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 giá trị chưa có quyền");
                return false;
            }
            
            // Hiển thị popup chọn chế độ và kiểu
            me.showScopeModePopup(vaiTroId, dimensionId, selectedValues);
            return false;
        });
    },
    
    /*------------------------------------------
    --Lọc bảng trong modal theo từ khóa (TÌM KIẾM TOÀN BỘ DỮ LIỆU)
    -------------------------------------------*/
    filterModalTable: function() {
        var me = this;
        var keyword = $("#txtModalSearch").val().toLowerCase().trim();
        
        // Hiển thị/ẩn nút xóa
        if (keyword) {
            $("#btnClearModalSearch").show();
        } else {
            $("#btnClearModalSearch").hide();
        }
        
        if (!keyword) {
            // Không có từ khóa - hiển thị lại toàn bộ dữ liệu
            me.modalFilteredData = me.modalData;
            me.modalTotalRecords = me.modalData.length;
            me.modalCurrentPage = 1;
            me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
            $("#modalSearchCount").text('');
            me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
            return;
        }
        
        // Lọc toàn bộ dữ liệu theo từ khóa
        me.modalFilteredData = [];
        for (var i = 0; i < me.modalData.length; i++) {
            var item = me.modalData[i];
            var searchText = '';
            
            // Tạo chuỗi tìm kiếm từ các field
            searchText += (item.VALUE_CODE || item.CORE_DATA_VALUE_CODE || '') + ' ';
            searchText += (item.VALUE_NAME || item.CORE_DATA_VALUE_NAME || item.TEN || '') + ' ';
            searchText += (item.GHICHU || '') + ' ';
            
            searchText = searchText.toLowerCase();
            
            if (searchText.indexOf(keyword) !== -1) {
                me.modalFilteredData.push(item);
            }
        }
        
        // Cập nhật phân trang với dữ liệu đã lọc
        me.modalTotalRecords = me.modalFilteredData.length;
        me.modalCurrentPage = 1;
        me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
        
        // Hiển thị số lượng kết quả
        if (me.modalFilteredData.length === 0) {
            $("#modalSearchCount").html('<i class="fa-solid fa-exclamation-triangle" style="color: #dc3545;"></i> Không tìm thấy');
        } else {
            $("#modalSearchCount").html('<i class="fa-solid fa-check-circle" style="color: #28a745;"></i> ' + me.modalFilteredData.length + '/' + me.modalData.length);
        }
        
        // Render lại bảng với dữ liệu đã lọc
        me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
    },

    /*------------------------------------------
    --Hiển thị modal XEM KẾT QUẢ (chỉ hiển thị quyền đã gán)
    -------------------------------------------*/
    showResultModal: function(vaiTroId, vaiTroName, dimensionId, dimensionName) {
        var me = this;
        
        // Lấy dữ liệu của chiều này
        var dimensionData = me.dimensionGroups[dimensionId];
        if (!dimensionData) {
            edu.system.alert("Không tìm thấy dữ liệu");
            return;
        }
        
        // Reset phân trang
        me.modalCurrentPage = 1;
        me.modalPageSize = 10;
        me.modalData = dimensionData.data;
        me.modalTotalRecords = me.modalData.length;
        me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
        me.modalVaiTroId = vaiTroId;
        me.modalDimensionId = dimensionId;
        me.modalExistingPermissions = {}; // {valueId: scopeId}
        
        // Tạo HTML cho modal
        var modalHtml = '';
        modalHtml += '<div id="modalXemKetQua" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
        modalHtml += '<div style="background: white; border-radius: 8px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">';
        
        // Header
        modalHtml += '<div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">';
        modalHtml += '<h5 style="margin: 0; font-size: 16px;"><i class="fa-solid fa-list-check"></i> Kết quả phân quyền - ' + vaiTroName + ' - ' + dimensionName + '</h5>';
        modalHtml += '<button id="btnCloseResultModal" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">&times;</button>';
        modalHtml += '</div>';
        
        // Body
        modalHtml += '<div style="padding: 20px; flex: 1; overflow-y: auto;">';
        modalHtml += '<div style="margin-bottom: 15px; padding: 10px; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">';
        modalHtml += '<strong>Thông tin:</strong> Hiển thị các quyền đã được gán cho vai trò này. Chỉ xem, không thể chỉnh sửa.';
        modalHtml += '</div>';
        
        // Loading indicator
        modalHtml += '<div id="resultLoadingIndicator" style="text-align: center; padding: 20px;">';
        modalHtml += '<i class="fa-solid fa-spinner fa-spin fa-2x" style="color: #17a2b8;"></i>';
        modalHtml += '<div style="margin-top: 10px;">Đang tải quyền hiện tại...</div>';
        modalHtml += '</div>';
        
        // Container cho bảng
        modalHtml += '<div id="resultTableContainer" style="display: none;"></div>';
        
        modalHtml += '</div>';
        
        // Footer
        modalHtml += '<div style="padding: 15px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; gap: 10px; background: #f8f9fa; border-radius: 0 0 8px 8px;">';
        modalHtml += '<button type="button" class="btn btn-secondary" id="btnDongResultModal" style="padding: 8px 16px;"><i class="fa-solid fa-times"></i> Đóng</button>';
        modalHtml += '<button type="button" class="btn btn-danger" id="btnXoaResultModal" style="padding: 8px 16px;"><i class="fa-solid fa-trash"></i> Xóa quyền đã chọn</button>';
        modalHtml += '</div>';
        
        modalHtml += '</div>';
        modalHtml += '</div>';
        
        // Xóa modal cũ nếu có
        $("#modalXemKetQua").remove();
        
        // Thêm modal vào body
        $("body").append(modalHtml);
        
        // Load quyền hiện tại
        me.loadExistingPermissions(vaiTroId, dimensionId, function() {
            $("#resultLoadingIndicator").hide();
            $("#resultTableContainer").show();
            me.renderResultTable();
        });
        
        // Bind event đóng modal
        $("#btnCloseResultModal, #btnDongResultModal, #modalXemKetQua").click(function(e) {
            if (e.target.id === "modalXemKetQua" || e.target.id === "btnCloseResultModal" || e.target.id === "btnDongResultModal") {
                $("#modalXemKetQua").remove();
            }
        });
        
        // Bind event cho nút Xóa
        $("#btnXoaResultModal").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var selectedScopes = [];
            $(".chkResultItem:checked").each(function() {
                selectedScopes.push($(this).data("scope-id"));
            });
            
            if (selectedScopes.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 quyền để xóa");
                return false;
            }
            
            me.deletePermissions(selectedScopes);
            return false;
        });
        
        // Ngăn click vào content đóng modal
        $("#modalXemKetQua > div").click(function(e) {
            e.stopPropagation();
        });
    },

    /*------------------------------------------
    --Render bảng kết quả (chỉ hiển thị quyền đã gán)
    -------------------------------------------*/
    renderResultTable: function() {
        var me = this;
        
        // Lọc chỉ lấy các item đã có quyền
        var assignedItems = [];
        for (var i = 0; i < me.modalData.length; i++) {
            var item = me.modalData[i];
            var valueId = item.ID || item.CORE_DATA_VALUE_ID || item.VALUE_ID;
            var scopeId = me.modalExistingPermissions[valueId];
            
            if (scopeId) {
                assignedItems.push({
                    item: item,
                    valueId: valueId,
                    scopeId: scopeId
                });
            }
        }
        
        var tableHtml = '<div style="overflow-x: auto;">';
        
        if (assignedItems.length > 0) {
            tableHtml += '<table class="table table-bordered table-hover" style="margin: 0; width: 100%;">';
            tableHtml += '<thead style="background: #f8f9fa;">';
            tableHtml += '<tr>';
            tableHtml += '<th style="width: 50px; text-align: center; padding: 10px;">';
            tableHtml += '<input type="checkbox" id="chkSelectAllResult" style="width: 18px; height: 18px; cursor: pointer;"/>';
            tableHtml += '</th>';
            tableHtml += '<th style="width: 50px; text-align: center; padding: 10px;">STT</th>';
            tableHtml += '<th style="width: 150px; padding: 10px;">Mã</th>';
            tableHtml += '<th style="padding: 10px;">Tên</th>';
            tableHtml += '<th style="width: 120px; text-align: center; padding: 10px;">Trạng thái</th>';
            tableHtml += '</tr>';
            tableHtml += '</thead>';
            tableHtml += '<tbody>';
            
            for (var j = 0; j < assignedItems.length; j++) {
                var assigned = assignedItems[j];
                var item = assigned.item;
                
                tableHtml += '<tr style="background: #d4edda;">';
                tableHtml += '<td style="text-align: center; padding: 8px;">';
                tableHtml += '<input type="checkbox" class="chkResultItem" data-scope-id="' + assigned.scopeId + '" style="width: 18px; height: 18px; cursor: pointer;"/>';
                tableHtml += '</td>';
                tableHtml += '<td style="text-align: center; padding: 8px;">' + (j + 1) + '</td>';
                tableHtml += '<td style="padding: 8px;">' + (item.VALUE_CODE || item.CORE_DATA_VALUE_CODE || '') + '</td>';
                tableHtml += '<td style="padding: 8px;">' + (item.VALUE_NAME || item.CORE_DATA_VALUE_NAME || item.TEN || 'N/A') + '</td>';
                tableHtml += '<td style="text-align: center; padding: 8px;">';
                tableHtml += '<span style="color: #28a745; font-weight: bold;"><i class="fa-solid fa-check-circle"></i> Đã có quyền</span>';
                tableHtml += '</td>';
                tableHtml += '</tr>';
            }
            
            tableHtml += '</tbody>';
            tableHtml += '</table>';
            
            // Bind event cho checkbox "Chọn tất cả"
            setTimeout(function() {
                $("#chkSelectAllResult").change(function() {
                    var isChecked = $(this).is(':checked');
                    $(".chkResultItem").prop('checked', isChecked);
                });
                
                // Bind event cho từng checkbox để cập nhật "Chọn tất cả"
                $(document).on('change', '.chkResultItem', function() {
                    var totalCheckboxes = $(".chkResultItem").length;
                    var checkedCheckboxes = $(".chkResultItem:checked").length;
                    $("#chkSelectAllResult").prop('checked', totalCheckboxes === checkedCheckboxes);
                });
            }, 100);
        } else {
            tableHtml += '<div style="text-align: center; padding: 40px;">';
            tableHtml += '<i class="fa-solid fa-inbox fa-3x" style="color: #ccc;"></i>';
            tableHtml += '<div style="margin-top: 15px; font-size: 16px; color: #666;">Chưa có quyền nào được gán</div>';
            tableHtml += '<div style="font-size: 13px; color: #999; margin-top: 5px;">Sử dụng nút "Thêm quyền" để gán quyền mới</div>';
            tableHtml += '</div>';
        }
        
        tableHtml += '</div>';
        
        $("#resultTableContainer").html(tableHtml);
    },

    /*------------------------------------------
    --Hiển thị modal THÊM QUYỀN (để chọn thêm quyền mới)
    -------------------------------------------*/
    showAddPermissionModal: function(vaiTroId, vaiTroName, dimensionId, dimensionName) {
        var me = this;
        
        // Gọi lại function showDetailModal cũ với tên mới
        me.showDetailModal(vaiTroId, vaiTroName, dimensionId, dimensionName);
    },

    /*------------------------------------------
    --Hiển thị popup chọn chế độ và kiểu
    -------------------------------------------*/
    showScopeModePopup: function(vaiTroId, dimensionId, selectedValues) {
        var me = this;
        
        // Tạo popup với loading
        var popupHtml = '';
        popupHtml += '<div id="popupScopeMode" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1050; display: flex; align-items: center; justify-content: center;">';
        popupHtml += '<div style="background: white; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">';
        
        // Header
        popupHtml += '<div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">';
        popupHtml += '<h5 style="margin: 0; font-size: 16px;"><i class="fa-solid fa-cog"></i> Cấu hình quyền</h5>';
        popupHtml += '<button id="btnCloseScopePopup" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">&times;</button>';
        popupHtml += '</div>';
        
        // Body
        popupHtml += '<div style="padding: 25px;">';
        
        popupHtml += '<div style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">';
        popupHtml += '<strong>Thông tin:</strong> Đang thêm quyền cho <strong>' + selectedValues.length + '</strong> giá trị';
        popupHtml += '</div>';
        
        // Loading
        popupHtml += '<div id="scopeLoadingIndicator" style="text-align: center; padding: 20px;">';
        popupHtml += '<i class="fa-solid fa-spinner fa-spin fa-2x" style="color: #28a745;"></i>';
        popupHtml += '<div style="margin-top: 10px;">Đang tải danh sách...</div>';
        popupHtml += '</div>';
        
        // Container cho form
        popupHtml += '<div id="scopeFormContainer" style="display: none;"></div>';
        
        popupHtml += '</div>';
        
        // Footer
        popupHtml += '<div style="padding: 15px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; gap: 10px; background: #f8f9fa; border-radius: 0 0 8px 8px;">';
        popupHtml += '<button type="button" class="btn btn-secondary" id="btnHuyScopePopup" style="padding: 8px 16px;"><i class="fa-solid fa-times"></i> Hủy</button>';
        popupHtml += '<button type="button" class="btn btn-success" id="btnXacNhanScope" style="padding: 8px 16px; display: none;"><i class="fa-solid fa-check"></i> Xác nhận thêm</button>';
        popupHtml += '</div>';
        
        popupHtml += '</div>';
        popupHtml += '</div>';
        
        // Xóa popup cũ nếu có
        $("#popupScopeMode").remove();
        
        // Thêm popup vào body
        $("body").append(popupHtml);
        
        // Load danh sách SCOPE_MODE và SCOPE_KIND từ API
        me.loadScopeOptions(vaiTroId, dimensionId, selectedValues);
        
        // Bind event đóng popup
        $("#btnCloseScopePopup, #btnHuyScopePopup, #popupScopeMode").click(function(e) {
            if (e.target.id === "popupScopeMode" || e.target.id === "btnCloseScopePopup" || e.target.id === "btnHuyScopePopup") {
                $("#popupScopeMode").remove();
            }
        });
        
        // Ngăn click vào content đóng popup
        $("#popupScopeMode > div").click(function(e) {
            e.stopPropagation();
        });
    },
    
    /*------------------------------------------
    --Load danh sách SCOPE_MODE và SCOPE_KIND
    -------------------------------------------*/
    loadScopeOptions: function(vaiTroId, dimensionId, selectedValues) {
        var me = this;
        
        // Dùng giá trị mặc định (không cần gọi API)
        var scopeModes = [
            {CODE: 'INCLUDE', NAME: 'INCLUDE - Cho phép truy cập'},
            {CODE: 'EXCLUDE', NAME: 'EXCLUDE - Từ chối truy cập'}
        ];
        
        var scopeKinds = [
            {CODE: 'EXPLICIT', NAME: 'EXPLICIT - Tường minh'},
            {CODE: 'DIRECT', NAME: 'DIRECT - Trực tiếp'},
            {CODE: 'LIST', NAME: 'LIST - Danh sách'}
        ];
        
        // Render form ngay lập tức
        me.renderScopeForm(scopeModes, scopeKinds, vaiTroId, dimensionId, selectedValues);
    },
    
    /*------------------------------------------
    --Render form chọn SCOPE_MODE và SCOPE_KIND
    -------------------------------------------*/
    renderScopeForm: function(scopeModes, scopeKinds, vaiTroId, dimensionId, selectedValues) {
        var me = this;
        
        var formHtml = '';
        
        // Chế độ (SCOPE_MODE)
        formHtml += '<div style="margin-bottom: 20px;">';
        formHtml += '<label style="display: block; font-weight: 600; margin-bottom: 8px; color: #223771;">';
        formHtml += '<i class="fa-solid fa-toggle-on"></i> Chế độ (SCOPE_MODE):';
        formHtml += '</label>';
        formHtml += '<select id="ddlScopeMode" class="form-select" style="width: 100%; padding: 10px; border: 2px solid #dee2e6; border-radius: 6px; font-size: 14px;">';
        
        for (var i = 0; i < scopeModes.length; i++) {
            formHtml += '<option value="' + scopeModes[i].CODE + '">' + scopeModes[i].NAME + '</option>';
        }
        
        formHtml += '</select>';
        formHtml += '<small style="color: #666; margin-top: 5px; display: block;">INCLUDE: Vai trò được phép truy cập dữ liệu này<br/>EXCLUDE: Vai trò bị từ chối truy cập dữ liệu này</small>';
        formHtml += '</div>';
        
        // Kiểu (SCOPE_KIND)
        formHtml += '<div style="margin-bottom: 20px;">';
        formHtml += '<label style="display: block; font-weight: 600; margin-bottom: 8px; color: #223771;">';
        formHtml += '<i class="fa-solid fa-list"></i> Kiểu (SCOPE_KIND):';
        formHtml += '</label>';
        formHtml += '<select id="ddlScopeKind" class="form-select" style="width: 100%; padding: 10px; border: 2px solid #dee2e6; border-radius: 6px; font-size: 14px;">';
        
        for (var j = 0; j < scopeKinds.length; j++) {
            formHtml += '<option value="' + scopeKinds[j].CODE + '">' + scopeKinds[j].NAME + '</option>';
        }
        
        formHtml += '</select>';
        formHtml += '<small style="color: #666; margin-top: 5px; display: block;">EXPLICIT: Quyền được gán tường minh<br/>DIRECT: Quyền trực tiếp<br/>LIST: Quyền theo danh sách</small>';
        formHtml += '</div>';
        
        $("#scopeFormContainer").html(formHtml);
        $("#scopeLoadingIndicator").hide();
        $("#scopeFormContainer").show();
        $("#btnXacNhanScope").show();
        
        // Bind event cho nút Xác nhận
        $("#btnXacNhanScope").off("click").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var scopeMode = $("#ddlScopeMode").val();
            var scopeKind = $("#ddlScopeKind").val();
            
            if (!scopeMode || !scopeKind) {
                edu.system.alert("Vui lòng chọn đầy đủ chế độ và kiểu");
                return false;
            }
            
            // Đóng popup chọn mode
            $("#popupScopeMode").remove();
            
            // Gọi hàm thêm quyền với mode và kind đã chọn
            me.savePermissions(vaiTroId, dimensionId, selectedValues, "ADD", scopeMode, scopeKind);
            
            return false;
        });
    },
    
    /*------------------------------------------
    --Load danh sách quyền hiện tại
    -------------------------------------------*/
    loadExistingPermissions: function(vaiTroId, dimensionId, callback) {
        var me = this;
        
        console.log("=== DEBUG loadExistingPermissions ===");
        console.log("VaiTroId:", vaiTroId);
        console.log("DimensionId:", dimensionId);
        
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUeFyAtNCQeEx4FIDUgHhIiLjEk',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_D_Value_R_Data_Scope',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strRoleId': vaiTroId,
            'strDimensionId': dimensionId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        console.log("Request params:", obj_list);
        
        edu.system.makeRequest({
            success: function (data) {
                console.log("API Response FULL:", JSON.stringify(data, null, 2));
                
                if (data.Success && data.Data) {
                    console.log("Data.Data length:", data.Data.length);
                    
                    if (data.Data.length > 0) {
                        console.log("First item FULL:", JSON.stringify(data.Data[0], null, 2));
                        console.log("All keys in first item:", Object.keys(data.Data[0]));
                    }
                    
                    // Lưu mapping valueId -> scopeId
                    for (var i = 0; i < data.Data.length; i++) {
                        var item = data.Data[i];
                        console.log("Processing item " + i + ":", JSON.stringify(item, null, 2));
                        
                        // Thử nhiều tên field có thể
                        var valueId = item.DIMENSION_VALUE_ID || item.CORE_DATA_VALUE_ID || 
                                     item.VALUE_ID || item.CORE_DIMENSION_VALUE_ID || 
                                     item.DIMENSIONVALUEID || item.COREDATAVALUEID;
                        
                        var scopeId = item.ID || item.SCOPE_ID || item.CORE_ROLE_DATA_SCOPE_ID || 
                                     item.SCOPEID || item.COREROLEDATASCOPEID;
                        
                        console.log("  -> Extracted valueId:", valueId, "scopeId:", scopeId);
                        
                        if (valueId && scopeId) {
                            me.modalExistingPermissions[valueId] = scopeId;
                            console.log("  -> Added to permissions:", valueId, "=>", scopeId);
                        } else {
                            console.warn("  -> SKIPPED - Missing valueId or scopeId");
                        }
                    }
                    
                    console.log("Final modalExistingPermissions:", me.modalExistingPermissions);
                    console.log("Total permissions loaded:", Object.keys(me.modalExistingPermissions).length);
                } else {
                    console.log("No data or not success. Success:", data.Success, "Data:", data.Data);
                }
                
                if (callback) callback();
            },
            error: function (er) {
                console.error("API Error:", er);
                // Nếu lỗi vẫn tiếp tục hiển thị (có thể API chưa có)
                if (callback) callback();
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Render bảng trong modal với phân trang
    -------------------------------------------*/
    renderModalTable: function(vaiTroId, dimensionId) {
        var me = this;
        
        // Sử dụng dữ liệu đã lọc nếu có, nếu không thì dùng dữ liệu gốc
        var dataToUse = me.modalFilteredData || me.modalData;
        
        // Debug: Kiểm tra quyền hiện tại
        console.log("=== DEBUG renderModalTable ===");
        console.log("VaiTroId:", vaiTroId);
        console.log("DimensionId:", dimensionId);
        console.log("Existing Permissions:", me.modalExistingPermissions);
        console.log("Total permissions:", Object.keys(me.modalExistingPermissions).length);
        console.log("Using filtered data:", !!me.modalFilteredData);
        console.log("Data length:", dataToUse.length);
        
        // Tính toán phân trang
        var startIndex = (me.modalCurrentPage - 1) * me.modalPageSize;
        var endIndex = Math.min(startIndex + me.modalPageSize, dataToUse.length);
        var pageData = dataToUse.slice(startIndex, endIndex);
        
        // Tạo bảng
        var tableHtml = '<div style="overflow-x: auto;">';
        tableHtml += '<table class="table table-bordered table-hover" style="margin: 0; width: 100%;">';
        tableHtml += '<thead style="background: #f8f9fa;">';
        tableHtml += '<tr>';
        tableHtml += '<th style="width: 50px; text-align: center; padding: 10px;">STT</th>';
        tableHtml += '<th style="width: 150px; padding: 10px;">Mã<br/><span style="font-weight: normal; font-size: 11px;">VALUE_CODE</span></th>';
        tableHtml += '<th style="padding: 10px;">Tên<br/><span style="font-weight: normal; font-size: 11px;">VALUE_NAME</span></th>';
        tableHtml += '<th style="width: 120px; text-align: center; padding: 10px;">Ghi chú<br/><span style="font-weight: normal; font-size: 11px;">GhiChu</span></th>';
        tableHtml += '<th style="width: 80px; text-align: center; background: #fff3cd; padding: 10px;">';
        tableHtml += '<div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">';
        tableHtml += '<input type="checkbox" id="chkSelectAll" style="width: 18px; height: 18px; cursor: pointer;"/>';
        tableHtml += '<span style="font-size: 10px;">Chọn tất cả</span>';
        tableHtml += '</div>';
        tableHtml += '</th>';
        tableHtml += '</tr>';
        tableHtml += '</thead>';
        tableHtml += '<tbody>';
        
        for (var i = 0; i < pageData.length; i++) {
            var item = pageData[i];
            var globalIndex = startIndex + i + 1;
            var valueId = item.ID || item.CORE_DATA_VALUE_ID || item.VALUE_ID;
            var scopeId = me.modalExistingPermissions[valueId];
            var hasPermission = !!scopeId;
            
            // Debug từng item
            console.log("Item " + globalIndex + ":", {
                valueId: valueId,
                scopeId: scopeId,
                hasPermission: hasPermission,
                name: item.VALUE_NAME || item.CORE_DATA_VALUE_NAME || item.TEN
            });
            
            tableHtml += '<tr style="' + (hasPermission ? 'background: #d4edda;' : (i % 2 === 0 ? 'background: #f9f9f9;' : '')) + '">';
            tableHtml += '<td style="text-align: center; padding: 8px;">' + globalIndex + '</td>';
            tableHtml += '<td style="padding: 8px;">' + (item.VALUE_CODE || item.CORE_DATA_VALUE_CODE || '') + '</td>';
            tableHtml += '<td style="padding: 8px;">';
            tableHtml += (item.VALUE_NAME || item.CORE_DATA_VALUE_NAME || item.TEN || 'N/A');
            if (hasPermission) {
                tableHtml += ' <span style="color: #28a745; font-weight: bold; margin-left: 5px;"><i class="fa-solid fa-check-circle"></i> Đã có quyền</span>';
            }
            tableHtml += '</td>';
            tableHtml += '<td style="text-align: center; padding: 8px;">' + (item.GHICHU || '') + '</td>';
            tableHtml += '<td style="text-align: center; padding: 8px;">';
            tableHtml += '<input type="checkbox" class="chkDetailItem" ';
            tableHtml += 'data-value-id="' + valueId + '" ';
            
            if (hasPermission) {
                tableHtml += 'data-scope-id="' + scopeId + '" ';
                tableHtml += 'checked="checked" ';
            }
            
            tableHtml += 'style="width: 18px; height: 18px; cursor: pointer;"/>';
            tableHtml += '</td>';
            tableHtml += '</tr>';
        }
        
        tableHtml += '</tbody>';
        tableHtml += '</table>';
        tableHtml += '</div>';
        
        $("#modalTableContainer").html(tableHtml);
        
        // Bind event cho checkbox "Chọn tất cả"
        $("#chkSelectAll").change(function() {
            var isChecked = $(this).is(':checked');
            $(".chkDetailItem").prop('checked', isChecked);
        });
        
        // Bind event cho từng checkbox để cập nhật "Chọn tất cả"
        $(document).on('change', '.chkDetailItem', function() {
            var totalCheckboxes = $(".chkDetailItem").length;
            var checkedCheckboxes = $(".chkDetailItem:checked").length;
            $("#chkSelectAll").prop('checked', totalCheckboxes === checkedCheckboxes);
        });
        
        // Render phân trang
        me.renderModalPagination(vaiTroId, dimensionId);
    },
    
    /*------------------------------------------
    --Render phân trang cho modal
    -------------------------------------------*/
    renderModalPagination: function(vaiTroId, dimensionId) {
        var me = this;
        
        var html = '<div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 6px;">';
        
        // Info
        var from = me.modalTotalRecords > 0 ? ((me.modalCurrentPage - 1) * me.modalPageSize + 1) : 0;
        var to = Math.min(me.modalCurrentPage * me.modalPageSize, me.modalTotalRecords);
        html += '<div style="font-size: 13px; color: #555;">';
        html += 'Hiển thị <strong>' + from + '</strong> - <strong>' + to + '</strong> / <strong>' + me.modalTotalRecords + '</strong> bản ghi';
        html += '</div>';
        
        // Buttons
        html += '<div style="display: flex; gap: 5px;">';
        html += '<button class="btn btn-sm btn-outline-primary btnModalFirstPage" ' + (me.modalCurrentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angles-left"></i></button>';
        html += '<button class="btn btn-sm btn-outline-primary btnModalPrevPage" ' + (me.modalCurrentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angle-left"></i></button>';
        
        var startPage = Math.max(1, me.modalCurrentPage - 2);
        var endPage = Math.min(me.modalTotalPages, me.modalCurrentPage + 2);
        
        for (var i = startPage; i <= endPage; i++) {
            html += '<button class="btn btn-sm ' + (i === me.modalCurrentPage ? 'btn-primary' : 'btn-outline-primary') + ' btnModalPage" data-page="' + i + '">' + i + '</button>';
        }
        
        html += '<button class="btn btn-sm btn-outline-primary btnModalNextPage" ' + (me.modalCurrentPage === me.modalTotalPages ? 'disabled' : '') + '><i class="fa-solid fa-angle-right"></i></button>';
        html += '<button class="btn btn-sm btn-outline-primary btnModalLastPage" ' + (me.modalCurrentPage === me.modalTotalPages ? 'disabled' : '') + '><i class="fa-solid fa-angles-right"></i></button>';
        html += '</div>';
        html += '</div>';
        
        $("#modalPaginationContainer").html(html);
        
        // Bind events
        $(".btnModalFirstPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(1, vaiTroId, dimensionId);
            return false;
        });
        
        $(".btnModalPrevPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalCurrentPage - 1, vaiTroId, dimensionId);
            return false;
        });
        
        $(".btnModalNextPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalCurrentPage + 1, vaiTroId, dimensionId);
            return false;
        });
        
        $(".btnModalLastPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalTotalPages, vaiTroId, dimensionId);
            return false;
        });
        
        $(".btnModalPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(parseInt($(this).data("page")), vaiTroId, dimensionId);
            return false;
        });
    },
    
    /*------------------------------------------
    --Chuyển trang trong modal
    -------------------------------------------*/
    modalGoToPage: function(page, vaiTroId, dimensionId) {
        var me = this;
        if (page < 1 || page > me.modalTotalPages) return;
        me.modalCurrentPage = page;
        me.renderModalTable(vaiTroId, dimensionId);
    },
    
    /*------------------------------------------
    --Lưu quyền (Thêm hoặc Xóa)
    -------------------------------------------*/
    savePermissions: function(vaiTroId, dimensionId, valueIds, action, scopeMode, scopeKind) {
        var me = this;
        
        // Mặc định nếu không truyền
        scopeMode = scopeMode || 'INCLUDE';
        scopeKind = scopeKind || 'EXPLICIT';
        
        if (action === "ADD") {
            // Thêm quyền
            var completedCount = 0;
            var totalCount = valueIds.length;
            var successCount = 0;
            var errorCount = 0;
            var errorMessages = [];
            
            for (var i = 0; i < valueIds.length; i++) {
                var obj_save = {
                    'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhMuLSQeBSA1IB4SIi4xJAPP',
                    'func': 'PKG_CORE_QUANTRI_02.Them_Core_Role_Data_Scope',
                    'iM': 'Azz',
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strRoleId': vaiTroId,
                    'strDimensionId': dimensionId,
                    'strDimensionValueId': valueIds[i],
                    'strScopeMode': scopeMode,
                    'strScopeKind': scopeKind,
                    'strFunctionId': '',
                    'dPriorityNo': 1,
                    'strEffectiveFrom': '',
                    'strEffectiveTo': '',
                    'strSourceType': 'MANUAL',
                    'strSourceRefId': '',
                    'strAssignedBy': edu.system.userId,
                    'strNote': '',
                    'strNguoiThucHien_Id': edu.system.userId
                };
                
                edu.system.makeRequest({
                    success: function (data) {
                        completedCount++;
                        
                        if (data.Success) {
                            successCount++;
                        } else {
                            // Kiểm tra nếu là lỗi "đã tồn tại" thì coi như thành công
                            var isDuplicate = data.Message && (
                                data.Message.toLowerCase().indexOf("da ton tai") !== -1 ||
                                data.Message.toLowerCase().indexOf("đã tồn tại") !== -1 ||
                                data.Message.toLowerCase().indexOf("already exists") !== -1
                            );
                            
                            if (isDuplicate) {
                                // Coi như thành công vì quyền đã có rồi
                                successCount++;
                                console.log("Quyền đã tồn tại, bỏ qua:", data.Message);
                            } else {
                                // Lỗi thật sự
                                errorCount++;
                                errorMessages.push(data.Message);
                            }
                        }
                        
                        if (completedCount === totalCount) {
                            // Reload lại popup để hiển thị quyền mới
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalVaiTroId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
                            });
                            
                            // Hiển thị thông báo
                            if (errorMessages.length === 0) {
                                edu.system.alert("Thêm/cập nhật thành công " + successCount + " quyền!");
                            } else {
                                edu.system.alert("Thêm thành công " + successCount + " quyền. Có " + errorMessages.length + " lỗi: " + errorMessages.join(", "));
                            }
                        }
                    },
                    error: function (er) {
                        completedCount++;
                        errorCount++;
                        errorMessages.push("Lỗi kết nối");
                        
                        if (completedCount === totalCount) {
                            // Reload lại popup
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalVaiTroId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
                            });
                            
                            edu.system.alert("Có lỗi khi thêm quyền: " + errorMessages.join(", "));
                        }
                    },
                    type: "POST",
                    action: obj_save.action,
                    contentType: true,
                    data: obj_save
                }, false, false, false, null);
            }
        } else if (action === "DELETE") {
            // Xóa quyền - cần gọi API lấy danh sách quyền hiện tại trước
            edu.system.alert("Chức năng xóa đang được phát triển");
            $("#modalChiTiet").remove();
        }
    },
    
    /*------------------------------------------
    --Xóa quyền
    -------------------------------------------*/
    deletePermissions: function(scopeIds) {
        var me = this;
        
        if (!scopeIds || scopeIds.length === 0) {
            edu.system.alert("Không có quyền nào để xóa");
            return;
        }
        
        edu.system.confirm("Bạn có chắc chắn muốn xóa " + scopeIds.length + " quyền đã chọn?");
        
        $("#btnYes").off("click").click(function() {
            var completedCount = 0;
            var totalCount = scopeIds.length;
            var successCount = 0;
            var errorCount = 0;
            var errorMessages = [];
            
            for (var i = 0; i < scopeIds.length; i++) {
                var obj_delete = {
                    'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeEy4tJB4FIDUgHhIiLjEk',
                    'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_Role_Data_Scope',
                    'iM': 'Azz',
                    'strId': scopeIds[i],
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strNguoiThucHien_Id': edu.system.userId
                };
                
                edu.system.makeRequest({
                    success: function (data) {
                        completedCount++;
                        
                        if (data.Success) {
                            successCount++;
                        } else {
                            errorCount++;
                            if (data.Message) {
                                errorMessages.push(data.Message);
                            }
                        }
                        
                        if (completedCount === totalCount) {
                            // Reload lại popup để hiển thị quyền đã xóa
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalVaiTroId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
                            });
                            
                            // Hiển thị thông báo
                            if (successCount > 0 && errorCount === 0) {
                                edu.system.alert("Xóa thành công " + successCount + " quyền!");
                            } else if (successCount > 0 && errorCount > 0) {
                                edu.system.alert("Xóa thành công " + successCount + " quyền. Có " + errorCount + " lỗi: " + errorMessages.join(", "));
                            } else {
                                edu.system.alert("Không thể xóa quyền: " + errorMessages.join(", "));
                            }
                        }
                    },
                    error: function (er) {
                        completedCount++;
                        errorCount++;
                        errorMessages.push("Lỗi kết nối");
                        
                        if (completedCount === totalCount) {
                            // Reload lại popup
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalVaiTroId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalVaiTroId, me.modalDimensionId);
                            });
                            
                            edu.system.alert("Có lỗi khi xóa quyền: " + errorMessages.join(", "));
                        }
                    },
                    type: "POST",
                    action: obj_delete.action,
                    contentType: true,
                    data: obj_delete
                }, false, false, false, null);
            }
        });
    },
    
    /*------------------------------------------
    --Render phân trang
    -------------------------------------------*/
    renderPagination: function () {
        var me = this;
        
        var html = '<div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 6px; margin-top: 15px;">';
        
        // Info
        var from = me.totalRecords > 0 ? ((me.currentPage - 1) * me.pageSize + 1) : 0;
        var to = Math.min(me.currentPage * me.pageSize, me.totalRecords);
        html += '<div style="font-size: 13px; color: #555;">';
        html += 'Hiển thị <strong>' + from + '</strong> - <strong>' + to + '</strong> / <strong>' + me.totalRecords + '</strong> bản ghi';
        html += '</div>';
        
        // Buttons
        html += '<div style="display: flex; gap: 5px;">';
        html += '<button class="btn btn-sm btn-outline-primary" id="btnFirstPage" ' + (me.currentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angles-left"></i></button>';
        html += '<button class="btn btn-sm btn-outline-primary" id="btnPrevPage" ' + (me.currentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angle-left"></i></button>';
        
        var startPage = Math.max(1, me.currentPage - 2);
        var endPage = Math.min(me.totalPages, me.currentPage + 2);
        
        for (var i = startPage; i <= endPage; i++) {
            html += '<button class="btn btn-sm ' + (i === me.currentPage ? 'btn-primary' : 'btn-outline-primary') + '" data-page="' + i + '">' + i + '</button>';
        }
        
        html += '<button class="btn btn-sm btn-outline-primary" id="btnNextPage" ' + (me.currentPage === me.totalPages ? 'disabled' : '') + '><i class="fa-solid fa-angle-right"></i></button>';
        html += '<button class="btn btn-sm btn-outline-primary" id="btnLastPage" ' + (me.currentPage === me.totalPages ? 'disabled' : '') + '><i class="fa-solid fa-angles-right"></i></button>';
        html += '</div>';
        html += '</div>';
        
        $("#paginationContainer").html(html);
        
        // Bind events
        $("#btnFirstPage").click(function() { me.goToPage(1); });
        $("#btnPrevPage").click(function() { me.goToPage(me.currentPage - 1); });
        $("#btnNextPage").click(function() { me.goToPage(me.currentPage + 1); });
        $("#btnLastPage").click(function() { me.goToPage(me.totalPages); });
        $("[data-page]").click(function() { me.goToPage(parseInt($(this).data("page"))); });
    },
    
    /*------------------------------------------
    --Chuyển trang
    -------------------------------------------*/
    goToPage: function (page) {
        var me = this;
        if (page < 1 || page > me.totalPages) return;
        me.currentPage = page;
        me.genTable_DuLieu();
    },
    
    /*------------------------------------------
    --Kiểm tra quyền đã tồn tại
    -------------------------------------------*/
    checkPermission: function (dataItem, vaiTro) {
        var me = this;
        
        // TODO: Gọi API để kiểm tra quyền đã tồn tại
        // Tạm thời return false
        return false;
    },
    
    /*------------------------------------------
    --Render danh sách checkbox
    -------------------------------------------*/
    renderCheckboxList: function (dataList, vaiTroId, loaiDuLieu) {
        var html = '';
        
        if (dataList && dataList.length > 0) {
            for (var i = 0; i < dataList.length; i++) {
                html += '<div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">';
                html += '<input type="checkbox" class="chkPhanQuyen" ';
                html += 'data-vaitro-id="' + vaiTroId + '" ';
                html += 'data-loai="' + loaiDuLieu + '" ';
                html += 'data-dulieu-id="' + dataList[i].ID + '" ';
                html += 'style="width: 16px; height: 16px; flex-shrink: 0;" ';
                html += '/>';
                html += '<span style="font-size: 12px; color: #555; line-height: 1.3;">' + dataList[i].TEN + '</span>';
                html += '</div>';
            }
        } else {
            html = '<span style="color: #999; font-size: 12px; font-style: italic;">Chưa có dữ liệu</span>';
        }
        
        return html;
    },
    
    /*------------------------------------------
    --Lưu phân quyền
    -------------------------------------------*/
    save_PhanQuyen: function () {
        var me = this;
        
        var arrThem = [];
        var arrXoa = [];
        
        // Duyệt qua tất cả checkbox
        var checkboxes = $("#tblPhanQuyenDuLieu .chkPhanQuyen");
        
        for (var i = 0; i < checkboxes.length; i++) {
            var $chk = $(checkboxes[i]);
            var vaiTroId = $chk.data("vaitro-id");
            var dimensionId = $chk.data("dimension-id");
            var valueId = $chk.data("value-id");
            
            if ($chk.is(':checked')) {
                // Nếu checked mà không có attribute name="old" => thêm mới
                if (!$chk.attr("name")) {
                    arrThem.push({
                        strRoleId: vaiTroId,
                        strDimensionId: dimensionId,
                        strDimensionValueId: valueId
                    });
                }
            } else {
                // Nếu không checked mà có attribute name="old" => xóa
                if ($chk.attr("name") === "old") {
                    var scopeId = $chk.data("scope-id");
                    if (scopeId) {
                        arrXoa.push({
                            strId: scopeId
                        });
                    }
                }
            }
        }
        
        if ((arrThem.length + arrXoa.length) > 0) {
            edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " quyền và hủy " + arrXoa.length + " quyền?");
            
            $("#btnYes").click(function () {
                me.luuPhanQuyen_API(arrThem, arrXoa);
            });
        } else {
            edu.system.alert("Không có thay đổi để lưu");
        }
    },
    
    /*------------------------------------------
    --Gọi API lưu phân quyền
    -------------------------------------------*/
    luuPhanQuyen_API: function (arrThem, arrXoa) {
        var me = this;
        var completedCount = 0;
        var totalCount = arrThem.length + arrXoa.length;
        var hasError = false;
        
        // Thêm quyền mới
        for (var i = 0; i < arrThem.length; i++) {
            var obj_save = {
                'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhMuLSQeBSA1IB4SIi4xJAPP',
                'func': 'PKG_CORE_QUANTRI_02.Them_Core_Role_Data_Scope',
                'iM': 'Azz',
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strRoleId': arrThem[i].strRoleId,
                'strDimensionId': arrThem[i].strDimensionId,
                'strDimensionValueId': arrThem[i].strDimensionValueId,
                'strScopeMode': 'INCLUDE',
                'strScopeKind': 'EXPLICIT',
                'strFunctionId': '',
                'dPriorityNo': 1,
                'strEffectiveFrom': '',
                'strEffectiveTo': '',
                'strSourceType': 'MANUAL',
                'strSourceRefId': '',
                'strAssignedBy': edu.system.userId,
                'strNote': '',
                'strNguoiThucHien_Id': edu.system.userId
            };
            
            edu.system.makeRequest({
                success: function (data) {
                    completedCount++;
                    if (!data.Success) {
                        hasError = true;
                    }
                    
                    if (completedCount === totalCount) {
                        me.afterSave(hasError);
                    }
                },
                error: function (er) {
                    completedCount++;
                    hasError = true;
                    
                    if (completedCount === totalCount) {
                        me.afterSave(hasError);
                    }
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save
            }, false, false, false, null);
        }
        
        // Xóa quyền
        for (var j = 0; j < arrXoa.length; j++) {
            var obj_delete = {
                'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeEy4tJB4FIDUgHhIiLjEk',
                'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_Role_Data_Scope',
                'iM': 'Azz',
                'strId': arrXoa[j].strId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId
            };
            
            edu.system.makeRequest({
                success: function (data) {
                    completedCount++;
                    if (!data.Success) {
                        hasError = true;
                    }
                    
                    if (completedCount === totalCount) {
                        me.afterSave(hasError);
                    }
                },
                error: function (er) {
                    completedCount++;
                    hasError = true;
                    
                    if (completedCount === totalCount) {
                        me.afterSave(hasError);
                    }
                },
                type: "POST",
                action: obj_delete.action,
                contentType: true,
                data: obj_delete
            }, false, false, false, null);
        }
    },
    
    /*------------------------------------------
    --Sau khi lưu xong
    -------------------------------------------*/
    afterSave: function (hasError) {
        var me = this;
        
        if (hasError) {
            edu.system.alert("Lưu phân quyền có lỗi! Vui lòng kiểm tra lại.");
        } else {
            edu.system.alert("Lưu phân quyền thành công!");
            // Reload lại dữ liệu
            me.getList_VaiTro();
        }
    },
    
    /*------------------------------------------
    --Khởi tạo calendar
    -------------------------------------------*/
    initCalendar: function () {
        var me = this;
        me.renderCalendar();
    },
    
    /*------------------------------------------
    --Render calendar
    -------------------------------------------*/
    renderCalendar: function () {
        var me = this;
        var firstDay = new Date(me.currentYear, me.currentMonth, 1);
        var lastDay = new Date(me.currentYear, me.currentMonth + 1, 0);
        var prevLastDay = new Date(me.currentYear, me.currentMonth, 0);
        var firstDayIndex = firstDay.getDay();
        var lastDayIndex = lastDay.getDay();
        var nextDays = 7 - lastDayIndex - 1;
        
        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        
        var months = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];
        
        $("#thang").text(months[me.currentMonth]);
        $("#nam").text(me.currentYear);
        
        var days = "";
        
        // Previous month days
        for (var x = firstDayIndex; x > 0; x--) {
            days += '<li class="day-of-other-month">' + (prevLastDay.getDate() - x + 1) + '</li>';
        }
        
        // Current month days
        for (var i = 1; i <= lastDay.getDate(); i++) {
            var today = new Date();
            var isToday = i === today.getDate() && 
                         me.currentMonth === today.getMonth() && 
                         me.currentYear === today.getFullYear();
            
            var isSelected = i === me.selectedDate.getDate() && 
                            me.currentMonth === me.selectedDate.getMonth() && 
                            me.currentYear === me.selectedDate.getFullYear();
            
            var className = "poiter";
            if (isSelected) className += " active";
            
            days += '<li class="' + className + '" data-date="' + i + '">' + i + '</li>';
        }
        
        // Next month days
        for (var j = 1; j <= nextDays; j++) {
            days += '<li class="day-of-other-month">' + j + '</li>';
        }
        
        $(".calendar-body .days").html(days);
        
        // Add click event for days
        $(".calendar-body .days li.poiter").click(function () {
            var day = parseInt($(this).data("date"));
            me.selectedDate = new Date(me.currentYear, me.currentMonth, day);
            me.renderCalendar();
        });
    },
    
    /*------------------------------------------
    --Thay đổi tháng
    -------------------------------------------*/
    changeMonth: function (direction) {
        var me = this;
        me.currentMonth += direction;
        
        if (me.currentMonth < 0) {
            me.currentMonth = 11;
            me.currentYear--;
        } else if (me.currentMonth > 11) {
            me.currentMonth = 0;
            me.currentYear++;
        }
        
        me.renderCalendar();
    }
};
