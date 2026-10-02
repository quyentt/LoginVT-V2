/*----------------------------------------------
--Author: 
--Date of created: 
--Note: Quản trị quyền dữ liệu theo Nhân sự - Giao diện giống quantriquyendulieum2
----------------------------------------------*/
function PhanQuyenDuLieuNhanSu() { };
PhanQuyenDuLieuNhanSu.prototype = {
    dsNhanSu: [], // Danh sách nhân sú/cán bộ
    dsDimensions: [], // Danh sách các chiều dữ liệu
    dsDataDimension: [], // Danh sách giá trị của các chiều
    dimensionGroups: {}, // Nhóm dữ liệu theo chiều
    dsPermissions: {}, // Quyền hiện tại
    currentDimensionName: '',
    dsDonViChuQuan: [], // Danh sách Đơn vị chủ quản
    selectedDonViId: '', // Đơn vị đang chọn
    dsVaiTro: [], // Danh sách Vai trò
    selectedVaiTroId: '', // Vai trò đang chọn
    
    // Multi-select filters
    dsChucNang: [], // Danh sách Chức năng
    dsQuyen: [], // Danh sách Quyền
    selectedChucNangIds: [], // Các chức năng đã chọn
    selectedQuyenIds: [], // Các quyền đã chọn
    selectedVaiTroListIds: [], // Các vai trò đã chọn (multi-select)
    
    // Phân trang modal
    modalCurrentPage: 1,
    modalPageSize: 10,
    modalTotalRecords: 0,
    modalTotalPages: 0,
    modalData: [],
    modalFilteredData: null, // Dữ liệu đã lọc theo tìm kiếm
    modalNhanSuId: '',
    modalDimensionId: '',
    modalExistingPermissions: {},
    
    // Phân trang cho nhân sự
    currentPage: 1,
    pageSize: 20,
    totalRecords: 0,
    totalPages: 0,
    filteredNhanSu: [],
    
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: new Date(),
    
    init: function () {
        var me = this;
        me.page_load();

        // Khởi tạo calendar
        me.initCalendar();
        
        // Sự kiện chọn Đơn vị chủ quản
        $("#ddlDonViChuQuan").change(function () {
            me.selectedDonViId = $(this).val();
            console.log("=== Đơn vị changed ===");
            console.log("Selected value:", me.selectedDonViId);
            console.log("Dropdown value:", $("#ddlDonViChuQuan").val());
            
            me.currentPage = 1;
            
            if (me.selectedDonViId) {
                // Khi đã chọn đơn vị, load nhân sự (vai trò đã load sẵn)
                console.log("Loading nhân sự for đơn vị:", me.selectedDonViId);
                me.getList_NhanSu();
            } else {
                // Chưa chọn đơn vị, xóa bảng và reset vai trò đang chọn
                console.log("No đơn vị selected, clearing table");
                me.selectedVaiTroId = '';
                $("#ddlVaiTro").val('');
                $("#ddlVaiTroList").val(null);
                $("#tblPhanQuyenDuLieu thead").html('');
                $("#tblPhanQuyenDuLieu tbody").html('<tr><td colspan="2" style="text-align: center; padding: 40px;"><i class="fa-solid fa-info-circle fa-3x" style="color: #ffc107;"></i><div style="margin-top: 15px;">Vui lòng chọn Đơn vị để bắt đầu</div></td></tr>');
                $("#paginationContainer").html('');
            }
        });
        
        // Sự kiện chọn Vai trò
        $("#ddlVaiTro").change(function () {
            me.selectedVaiTroId = $(this).val();
            me.currentPage = 1;

            // Reset chức năng đã chọn và load lại danh sách chức năng theo vai trò
            me.selectedChucNangIds = [];
            me.loadDanhSachChucNang(me.selectedVaiTroId);

            // Load lại nhân sự theo vai trò
            me.getList_NhanSu();
        });
        
        // Sự kiện chọn Chức năng (multi-select)
        $("#ddlChucNang").change(function () {
            me.selectedChucNangIds = $(this).val() || [];
            me.currentPage = 1;
            console.log("Selected Chức năng:", me.selectedChucNangIds);
            
            // Load lại nhân sự theo filter
            me.getList_NhanSu();
        });
        
        // Sự kiện chọn Quyền (multi-select)
        $("#ddlQuyen").change(function () {
            me.selectedQuyenIds = $(this).val() || [];
            me.currentPage = 1;
            console.log("Selected Quyền:", me.selectedQuyenIds);
            
            // Load lại nhân sự theo filter
            me.getList_NhanSu();
        });
        
        // Sự kiện chọn Vai trò LIST (multi-select)
        $("#ddlVaiTroList").change(function () {
            me.selectedVaiTroListIds = $(this).val() || [];
            me.currentPage = 1;
            console.log("Selected Vai trò LIST:", me.selectedVaiTroListIds);
            
            // Load lại nhân sự theo filter
            me.getList_NhanSu();
        });
    },
    
    page_load: function () {
        var me = this;
        // Load danh sách Đơn vị chủ quản trước
        me.loadDanhSachDonViChuQuan();

        // Load danh sách Vai trò (cha-con) ngay khi vào trang
        me.loadDanhSachVaiTro();

        // Chức năng phụ thuộc vai trò → reset dropdown, load khi chọn vai trò
        me.loadDanhSachChucNang(null);

        // Load danh sách Quyền
        me.loadDanhSachQuyen();
    },
    
    /*------------------------------------------
    --Lấy danh sách Vai trò
    -------------------------------------------*/
    loadDanhSachVaiTro: function () {
        var me = this;

        // console.log("=== loadDanhSachVaiTro START ===");

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
                // console.log("=== loadDanhSachVaiTro RESPONSE ===", data);

                if (data.Success) {
                    // Response có thể là data.Data[] hoặc data.Data.rs[]
                    var raw = [];
                    if (Array.isArray(data.Data)) {
                        raw = data.Data;
                    } else if (data.Data && Array.isArray(data.Data.rs)) {
                        raw = data.Data.rs;
                    }
                    me.dsVaiTro = raw;
                    // console.log("Số lượng vai trò:", me.dsVaiTro.length);

                    var html = '<option value="">-- Tất cả vai trò --</option>';
                    html += me.buildVaiTroTreeOptions(me.dsVaiTro);

                    $("#ddlVaiTro").html(html);
                    $("#ddlVaiTroList").html(html);
                } else {
                    console.error("API Error:", data.Message);
                    edu.system.alert("Lỗi khi tải danh sách vai trò: " + data.Message);
                    $("#ddlVaiTro").html('<option value="">-- Tất cả vai trò --</option>');
                    $("#ddlVaiTroList").html('<option value="">-- Tất cả vai trò --</option>');
                }
            },
            error: function (er) {
                console.error("Request Error:", er);
                edu.system.alert("Lỗi khi tải danh sách vai trò: " + JSON.stringify(er));
                $("#ddlVaiTro").html('<option value="">-- Tất cả vai trò --</option>');
                $("#ddlVaiTroList").html('<option value="">-- Tất cả vai trò --</option>');
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Build cây vai trò cha-con thành options có indent
    -------------------------------------------*/
    buildVaiTroTreeOptions: function (dsVaiTro) {
        var childrenMap = {};
        for (var i = 0; i < dsVaiTro.length; i++) {
            var parentId = dsVaiTro[i].CHUNG_VAITRO_CHA_ID || '';
            if (!childrenMap[parentId]) childrenMap[parentId] = [];
            childrenMap[parentId].push(dsVaiTro[i]);
        }

        // Sắp xếp con theo tên
        for (var key in childrenMap) {
            childrenMap[key].sort(function (a, b) {
                return (a.TENVAITRO || '').localeCompare(b.TENVAITRO || '', 'vi');
            });
        }

        // Tìm root (không có cha hoặc cha không tồn tại trong ds)
        var idSet = {};
        for (var k = 0; k < dsVaiTro.length; k++) idSet[dsVaiTro[k].ID] = true;

        var roots = [];
        for (var m = 0; m < dsVaiTro.length; m++) {
            var chaId = dsVaiTro[m].CHUNG_VAITRO_CHA_ID;
            if (!chaId || !idSet[chaId]) roots.push(dsVaiTro[m]);
        }
        roots.sort(function (a, b) {
            return (a.TENVAITRO || '').localeCompare(b.TENVAITRO || '', 'vi');
        });

        var html = '';
        function renderNode(node, depth) {
            var prefix = '';
            for (var d = 0; d < depth; d++) prefix += '\u00A0\u00A0\u00A0\u00A0';
            if (depth > 0) prefix += '└─ ';
            html += '<option value="' + node.ID + '">' + prefix + (node.TENVAITRO || '') + '</option>';
            var kids = childrenMap[node.ID] || [];
            for (var c = 0; c < kids.length; c++) renderNode(kids[c], depth + 1);
        }
        for (var r = 0; r < roots.length; r++) renderNode(roots[r], 0);
        return html;
    },
    
    /*------------------------------------------
    --Lấy danh sách Chức năng theo Ứng dụng + Vai trò
    -------------------------------------------*/
    loadDanhSachChucNang: function (strVaiTro_Id) {
        var me = this;

        // console.log("=== loadDanhSachChucNang START === vaiTroId:", strVaiTro_Id);

        // Chưa chọn vai trò thì reset dropdown
        if (!strVaiTro_Id) {
            me.dsChucNang = [];
            $("#ddlChucNang").html('<option value="">-- Chọn vai trò để xem chức năng --</option>');
            return;
        }

        var obj_list = {
            'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro',
            'iM': 'Azz',
            'strUngDung_Id': edu.system.appId,
            'strVaiTro_Id': strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== loadDanhSachChucNang RESPONSE ===", data);

                if (data.Success) {
                    // Response: data.Data.rs[] hoặc data.Data[]
                    var raw = [];
                    if (data.Data && Array.isArray(data.Data.rs)) {
                        raw = data.Data.rs;
                    } else if (Array.isArray(data.Data)) {
                        raw = data.Data;
                    }
                    me.dsChucNang = raw;
                    console.log("Số lượng chức năng:", me.dsChucNang.length);

                    // Render cây cha-con theo CHUCNANGCHA_ID
                    var html = '<option value="">-- Tất cả chức năng --</option>';
                    html += me.buildChucNangTreeOptions(me.dsChucNang);
                    $("#ddlChucNang").html(html);
                } else {
                    console.error("API Error:", data.Message);
                    $("#ddlChucNang").html('<option value="">-- Tất cả chức năng --</option>');
                }
            },
            error: function (er) {
                console.error("Request Error:", er);
                $("#ddlChucNang").html('<option value="">-- Tất cả chức năng --</option>');
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Build cây chức năng cha-con (theo CHUCNANGCHA_ID, tên TENCHUCNANG)
    -------------------------------------------*/
    buildChucNangTreeOptions: function (dsChucNang) {
        var childrenMap = {};
        for (var i = 0; i < dsChucNang.length; i++) {
            var pid = dsChucNang[i].CHUCNANGCHA_ID || '';
            if (!childrenMap[pid]) childrenMap[pid] = [];
            childrenMap[pid].push(dsChucNang[i]);
        }

        for (var key in childrenMap) {
            childrenMap[key].sort(function (a, b) {
                var ta = a.THUTU != null ? parseInt(a.THUTU) : 999;
                var tb = b.THUTU != null ? parseInt(b.THUTU) : 999;
                if (ta !== tb) return ta - tb;
                return (a.TENCHUCNANG || '').localeCompare(b.TENCHUCNANG || '', 'vi');
            });
        }

        var idSet = {};
        for (var k = 0; k < dsChucNang.length; k++) idSet[dsChucNang[k].ID] = true;

        var roots = [];
        for (var m = 0; m < dsChucNang.length; m++) {
            var chaId = dsChucNang[m].CHUCNANGCHA_ID;
            if (!chaId || !idSet[chaId]) roots.push(dsChucNang[m]);
        }
        roots.sort(function (a, b) {
            var ta = a.THUTU != null ? parseInt(a.THUTU) : 999;
            var tb = b.THUTU != null ? parseInt(b.THUTU) : 999;
            if (ta !== tb) return ta - tb;
            return (a.TENCHUCNANG || '').localeCompare(b.TENCHUCNANG || '', 'vi');
        });

        var html = '';
        function renderNode(node, depth) {
            var prefix = '';
            for (var d = 0; d < depth; d++) prefix += '\u00A0\u00A0\u00A0\u00A0';
            if (depth > 0) prefix += '└─ ';
            html += '<option value="' + node.ID + '">' + prefix + (node.TENCHUCNANG || '') + '</option>';
            var kids = childrenMap[node.ID] || [];
            for (var c = 0; c < kids.length; c++) renderNode(kids[c], depth + 1);
        }
        for (var r = 0; r < roots.length; r++) renderNode(roots[r], 0);
        return html;
    },

    /*------------------------------------------
    --Lấy danh sách Quyền
    -------------------------------------------*/
    loadDanhSachQuyen: function () {
        var me = this;
        
        // console.log("=== loadDanhSachQuyen START ===");
        
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICPCQvLjMk',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Permission',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== loadDanhSachQuyen RESPONSE ===", data);
                
                if (data.Success) {
                    me.dsQuyen = data.Data || [];
                    // console.log("Số lượng quyền:", me.dsQuyen.length);
                    
                    // Sắp xếp theo tên
                    me.dsQuyen.sort(function(a, b) {
                        var tenA = (a.PERMISSION_NAME || a.TEN || '').toLowerCase();
                        var tenB = (b.PERMISSION_NAME || b.TEN || '').toLowerCase();
                        return tenA.localeCompare(tenB, 'vi');
                    });
                    
                    // Render dropdown
                    var html = '<option value="">-- Tất cả quyền --</option>';
                    for (var i = 0; i < me.dsQuyen.length; i++) {
                        var quyen = me.dsQuyen[i];
                        var id = quyen.ID || quyen.CORE_PERMISSION_ID || quyen.PERMISSION_ID;
                        var ten = quyen.PERMISSION_NAME || quyen.TEN;
                        html += '<option value="' + id + '">' + ten + '</option>';
                    }
                    $("#ddlQuyen").html(html);
                    console.log("Dropdown Quyền rendered successfully");
                } else {
                    console.error("API Error:", data.Message);
                    $("#ddlQuyen").html('<option value="">-- Tất cả quyền --</option>');
                }
            },
            error: function (er) {
                console.error("Request Error:", er);
                $("#ddlQuyen").html('<option value="">-- Tất cả quyền --</option>');
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Lấy danh sách Đơn vị theo Core Employment
    -------------------------------------------*/
    loadDanhSachDonViChuQuan: function () {
        var me = this;
        
        // console.log("=== loadDanhSachDonViChuQuan START ===");
        
        var obj_list = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRIFLi8XKBUpJC4CLjMkHgQsMS0uOCwkLzUP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSDonViTheoCore_Employment',
            'iM': 'Azz',
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== loadDanhSachDonViChuQuan RESPONSE ===", data);
                
                if (data.Success) {
                    me.dsDonViChuQuan = data.Data || [];
                    // console.log("Số lượng đơn vị:", me.dsDonViChuQuan.length);
                    
                    // Sắp xếp theo tên
                    me.dsDonViChuQuan.sort(function(a, b) {
                        var tenA = a.NAME || a.TEN || a.DONVI_TEN || a.COCAUTOCHUC_TEN || a.ORG_UNIT_NAME || '';
                        var tenB = b.NAME || b.TEN || b.DONVI_TEN || b.COCAUTOCHUC_TEN || b.ORG_UNIT_NAME || '';
                        return tenA.localeCompare(tenB, 'vi');
                    });

                    // Render dropdown
                    var html = '<option value="">-- Chọn đơn vị --</option>';
                    for (var i = 0; i < me.dsDonViChuQuan.length; i++) {
                        var donVi = me.dsDonViChuQuan[i];
                        var id = donVi.ID || donVi.DONVI_ID || donVi.COCAUTOCHUC_ID || donVi.ORG_UNIT_ID;
                        var ten = donVi.NAME || donVi.TEN || donVi.DONVI_TEN || donVi.COCAUTOCHUC_TEN || donVi.ORG_UNIT_NAME || '';
                        var ma = donVi.CODE ? ' (' + donVi.CODE + ')' : '';
                        html += '<option value="' + id + '">' + ten + ma + '</option>';
                    }
                    $("#ddlDonViChuQuan").html(html);
                    // console.log("Dropdown rendered successfully");
                } else {
                    // console.error("API Error:", data.Message);
                    edu.system.alert("Lỗi khi tải danh sách đơn vị: " + data.Message);
                    $("#ddlDonViChuQuan").html('<option value="">-- Chọn đơn vị --</option>');
                }
            },
            error: function (er) {
                // console.error("Request Error:", er);
                edu.system.alert("Lỗi khi tải danh sách đơn vị: " + JSON.stringify(er));
                $("#ddlDonViChuQuan").html('<option value="">-- Chọn đơn vị --</option>');
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Lấy danh sách nhân sự theo Core Employment
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        
        // Kiểm tra đã chọn đơn vị chưa
        if (!me.selectedDonViId) {
            // console.log("selectedDonViId is empty, setting empty staff list");
            // Set danh sách nhân sự rỗng và tiếp tục load dimensions
            me.dsNhanSu = [];
            $("#lblSoLuongNhanSu").text(0);
            
            // Vẫn load dimensions để hiển thị bảng
            me.getList_DataDimension();
            return;
        }
        
        // console.log("=== getList_NhanSu START ===");
        // console.log("selectedDonViId:", me.selectedDonViId);
        // console.log("selectedVaiTroId:", me.selectedVaiTroId);
        // console.log("selectedChucNangIds:", me.selectedChucNangIds);
        // console.log("selectedQuyenIds:", me.selectedQuyenIds);
        // console.log("selectedVaiTroListIds:", me.selectedVaiTroListIds);
        
        // Kiểm tra có filter Vai trò / Chức năng không → dùng Pr_Core_Person_Get_By_R_F_Emp
        var hasVaiTroFilter = me.selectedVaiTroId && me.selectedVaiTroId !== '';
        var hasVaiTroListFilter = me.selectedVaiTroListIds && me.selectedVaiTroListIds.length > 0;
        var hasChucNangFilter = me.selectedChucNangIds && me.selectedChucNangIds.length > 0;

        if (hasVaiTroFilter || hasVaiTroListFilter || hasChucNangFilter) {
            me.getList_NhanSuTheoFilters();
        } else {
            // Không có filter → lấy tất cả nhân sự của đơn vị
            me.getList_NhanSuTheoCore();
        }
    },
    
    /*------------------------------------------
    --Lấy danh sách nhân sự theo Vai trò + Chức năng + Đơn vị
    --  Dùng Pr_Core_Person_Get_By_R_F_Emp. API nhận single role/function
    --  nên nếu multi-select thì gọi tất cả tổ hợp rồi union kết quả.
    -------------------------------------------*/
    getList_NhanSuTheoFilters: function () {
        var me = this;

        // Gom danh sách Vai trò từ ddlVaiTro (single) + ddlVaiTroList (multi)
        var roleIds = (me.selectedVaiTroListIds || []).slice();
        if (me.selectedVaiTroId && roleIds.indexOf(me.selectedVaiTroId) === -1) {
            roleIds.push(me.selectedVaiTroId);
        }
        if (roleIds.length === 0) roleIds = [''];

        // Chức năng (multi-select)
        var funcIds = (me.selectedChucNangIds || []).slice();
        if (funcIds.length === 0) funcIds = [''];

        // ==== DEBUG: IDs gửi xuống Pr_Core_Person_Get_By_R_F_Emp ====
        // console.log("%c=== IDs gửi Pr_Core_Person_Get_By_R_F_Emp ===", "color:#223771;font-weight:bold");
        // console.log("  strDonVi_Id    (Đơn vị) :", me.selectedDonViId || '(trống)');
        // console.log("  strVaiTro_Id   (Vai trò):", roleIds);
        // console.log("  strChucNang_Id (Chức năng):", funcIds);
        // console.table({
        //     'Đơn vị'   : { id: me.selectedDonViId || '' },
        //     'VaiTro (single)' : { id: me.selectedVaiTroId || '' },
        //     'VaiTroList (multi)': { id: (me.selectedVaiTroListIds || []).join(', ') },
        //     'ChucNang (multi)' : { id: (me.selectedChucNangIds || []).join(', ') }
        // });

        // Sinh tổ hợp (vai trò × chức năng)
        var calls = [];
        for (var i = 0; i < roleIds.length; i++) {
            for (var j = 0; j < funcIds.length; j++) {
                calls.push({ roleId: roleIds[i], funcId: funcIds[j] });
            }
        }

        // console.log("=== Tổng số tổ hợp gọi API:", calls.length);

        if (calls.length === 0) {
            me.getList_NhanSuTheoCore();
            return;
        }

        var completed = 0;
        var mergedUsers = {}; // key = personId, value = obj (union, loại trùng)

        for (var k = 0; k < calls.length; k++) {
            (function (call) {
                var obj_list = {
                    'action': 'CMS_QuanTri02_MH/ETMeAi4zJB4RJDMyLi8eBiQ1HgM4HhMeBx4ELDEP',
                    'func': 'PKG_CORE_QUANTRI_02.Pr_Core_Person_Get_By_R_F_Emp',
                    'iM': 'Azz',
                    'strVaiTro_Id': call.roleId || '',
                    'strChucNang_Id': call.funcId || '',
                    'strDonVi_Id': me.selectedDonViId || '',
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                    'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                    'strHanhDong_Code': 'XEM'
                };

                // console.log("  → REQUEST:", {
                //     strVaiTro_Id   : obj_list.strVaiTro_Id,
                //     strChucNang_Id : obj_list.strChucNang_Id,
                //     strDonVi_Id    : obj_list.strDonVi_Id
                // });

                edu.system.makeRequest({
                    success: function (data) {
                        completed++;
                        // console.log("  ← RESPONSE (role=" + call.roleId + ", func=" + call.funcId + "):", data);
                        if (data.Success && data.Data) {
                            var arr = [];
                            if (Array.isArray(data.Data)) arr = data.Data;
                            else if (Array.isArray(data.Data.rs)) arr = data.Data.rs;

                            for (var n = 0; n < arr.length; n++) {
                                var u = arr[n];
                                var uid = u.ID || u.PERSON_ID || u.CORE_PERSON_ID || u.NHANSU_ID || u.USER_ID;
                                if (uid && !mergedUsers[uid]) mergedUsers[uid] = u;
                            }
                                // console.log("    → Trả về " + arr.length + " người. Keys item[0]:", arr[0] ? Object.keys(arr[0]) : '(rỗng)');
                        }

                        if (completed === calls.length) {
                            me.dsNhanSu = [];
                            for (var key in mergedUsers) me.dsNhanSu.push(mergedUsers[key]);
                            console.log("Total unique nhân sự:", me.dsNhanSu.length);
                            $("#lblSoLuongNhanSu").text(me.dsNhanSu.length);
                            me.getList_DataDimension();
                        }
                    },
                    error: function (er) {
                        completed++;
                        console.error("Pr_Core_Person_Get_By_R_F_Emp error:", er);
                        if (completed === calls.length) {
                            me.dsNhanSu = [];
                            for (var key in mergedUsers) me.dsNhanSu.push(mergedUsers[key]);
                            $("#lblSoLuongNhanSu").text(me.dsNhanSu.length);
                            me.getList_DataDimension();
                        }
                    },
                    type: 'POST',
                    action: obj_list.action,
                    contentType: true,
                    data: obj_list,
                    fakedb: []
                }, false, false, false, null);
            })(calls[k]);
        }
    },
    
    /*------------------------------------------
    --Lấy danh sách nhân sự theo Core Employment (tất cả)
    -------------------------------------------*/
    getList_NhanSuTheoCore: function () {
        var me = this;
        
        var obj_list = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRIPKSAvEjQVKSQuAi4zJB4ELDEtLjgsJC81',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSNhanSuTheoCore_Employment',
            'iM': 'Azz',
            'strOrg_Unit_Id': me.selectedDonViId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== getList_NhanSuTheoCore RESPONSE ===", data);
                
                if (data.Success) {
                    me.dsNhanSu = data.Data || [];
                    // console.log("Số lượng nhân sự:", me.dsNhanSu.length);
                    
                    $("#lblSoLuongNhanSu").text(me.dsNhanSu.length);
                    
                    // Load danh sách chiều dữ liệu
                    me.getList_DataDimension();
                } else {
                    console.error("API Error:", data.Message);
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                console.error("Request Error:", er);
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Lấy danh sách nhân sự theo Vai trò
    -------------------------------------------*/
    getList_NhanSuTheoVaiTro: function () {
        var me = this;
        
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICPCQvLjMkHhQyJDMeFB4FIDUgHhIiLjEk',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_User_Role_Scope',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCore_Role_Id': me.selectedVaiTroId,
            'strOrg_Unit_Id': me.selectedDonViId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== getList_NhanSuTheoVaiTro RESPONSE ===", data);
                
                if (data.Success) {
                    // API trả về danh sách user có vai trò này
                    var dsUserRole = data.Data || [];
                    // console.log("Số lượng user có vai trò:", dsUserRole.length);
                    
                    // Lấy danh sách ID user
                    var userIds = [];
                    for (var i = 0; i < dsUserRole.length; i++) {
                        var userId = dsUserRole[i].USER_ID || dsUserRole[i].CORE_PERSON_ID || dsUserRole[i].PERSON_ID;
                        if (userId) {
                            userIds.push(userId);
                        }
                    }
                    
                    // console.log("User IDs:", userIds);
                    
                    // Lấy thông tin chi tiết nhân sự
                    me.getList_NhanSuByIds(userIds);
                } else {
                    console.error("API Error:", data.Message);
                    // Nếu lỗi, vẫn hiển thị bảng trống
                    me.dsNhanSu = [];
                    me.getList_DataDimension();
                }
            },
            error: function (er) {
                console.error("Request Error:", er);
                // Nếu lỗi, vẫn hiển thị bảng trống
                me.dsNhanSu = [];
                me.getList_DataDimension();
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Lấy thông tin nhân sự theo danh sách ID
    -------------------------------------------*/
    getList_NhanSuByIds: function (userIds) {
        var me = this;
        
        if (!userIds || userIds.length === 0) {
            // console.log("No user IDs, showing empty table");
            me.dsNhanSu = [];
            me.getList_DataDimension();
            return;
        }
        
        var obj_list = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRIPKSAvEjQVKSQuAi4zJB4ELDEtLjgsJC81',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSNhanSuTheoCore_Employment',
            'iM': 'Azz',
            'strOrg_Unit_Id': me.selectedDonViId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var allNhanSu = data.Data || [];
                    
                    // Lọc chỉ lấy nhân sự có ID trong danh sách
                    me.dsNhanSu = [];
                    for (var i = 0; i < allNhanSu.length; i++) {
                        var ns = allNhanSu[i];
                        var nsId = ns.ID || ns.NHANSU_ID || ns.PERSON_ID;
                        if (userIds.indexOf(nsId) !== -1) {
                            me.dsNhanSu.push(ns);
                        }
                    }
                    
                    // console.log("Filtered nhân sự:", me.dsNhanSu.length);
                    $("#lblSoLuongNhanSu").text(me.dsNhanSu.length);
                    
                    // Load danh sách chiều dữ liệu
                    me.getList_DataDimension();
                } else {
                    me.dsNhanSu = [];
                    me.getList_DataDimension();
                }
            },
            error: function (er) {
                me.dsNhanSu = [];
                me.getList_DataDimension();
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Lấy danh sách chiều dữ liệu (Data Dimension)
    -------------------------------------------*/
    getList_DataDimension: function () {
        var me = this;
        
        // console.log("=== getList_DataDimension START ===");
        // console.log("dsNhanSu length:", me.dsNhanSu.length);
        // console.log("selectedDonViId:", me.selectedDonViId);
        
        // Kiểm tra đã chọn đơn vị chưa
        if (!me.selectedDonViId) {
            // console.log("selectedDonViId is empty, cannot load dimensions");
            edu.system.alert("Vui lòng chọn Đơn vị trước");
            return;
        }
        
        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUgNSAeBSgsJC8yKC4v',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Data_Dimension',
            'iM': 'Azz',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== getList_DataDimension RESPONSE ===", data);
                // console.log("Success:", data.Success);
                // console.log("Data length:", data.Data ? data.Data.length : 0);
                
                if (data.Success) {
                    me.dsDimensions = data.Data || [];
                    // console.log("Loaded", me.dsDimensions.length, "dimensions");
                    me.loadAllDimensionValues();
                } else {
                    console.error("API Error:", data.Message);
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                console.error("API Request Error:", er);
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Load giá trị cho TẤT CẢ các chiều
    -------------------------------------------*/
    loadAllDimensionValues: function () {
        var me = this;
        // console.log("=== loadAllDimensionValues START ===");
        // console.log("dsDimensions length:", me.dsDimensions.length);
        
        $("#ddlDimension").closest('.search-bar-controls').find('select').parent().hide();
        me.loadAllDimensionsData();
    },
    
    /*------------------------------------------
    --Load dữ liệu cho tất cả các chiều
    -------------------------------------------*/
    loadAllDimensionsData: function () {
        var me = this;
        // console.log("=== loadAllDimensionsData START ===");
        
        me.dsDataDimension = [];
        me.dimensionGroups = {};
        
        var loadedCount = 0;
        var totalDimensions = me.dsDimensions.length;
        
        // console.log("Total dimensions to load:", totalDimensions);
        
        if (totalDimensions === 0) {
            // console.log("No dimensions, rendering table directly");
            me.genTable_DuLieu();
            return;
        }
        
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
                            
                            for (var j = 0; j < data.Data.length; j++) {
                                data.Data[j].DIMENSION_NAME = dimName;
                                data.Data[j].CORE_DATA_DIMENSION_ID = dimId;
                                me.dsDataDimension.push(data.Data[j]);
                            }
                        }
                        
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
    --Tạo bảng dữ liệu
    -------------------------------------------*/
    genTable_DuLieu: function () {
        var me = this;
        
        // console.log("=== genTable_DuLieu START ===");
            // console.log("selectedDonViId:", me.selectedDonViId);
            // console.log("dimensionGroups:", Object.keys(me.dimensionGroups).length);
            // console.log("dsNhanSu:", me.dsNhanSu.length);
        
        // Kiểm tra đã có dimensions chưa
        if (Object.keys(me.dimensionGroups).length === 0) {
            // console.log("Chưa có dimension - hiển thị loading");
            $("#tblPhanQuyenDuLieu thead").html('');
            $("#tblPhanQuyenDuLieu tbody").html('<tr><td colspan="2" style="text-align: center; padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Đang tải dữ liệu...</div></td></tr>');
            return;
        }
        
        // Lấy danh sách nhân sự (đã được lọc theo vai trò từ API)
        me.filteredNhanSu = me.dsNhanSu;
        
        // Không lọc thêm theo DAOTAO_COCAUTOCHUC_ID vì API Pr_Core_Person_Get_By_R_F_Emp
        // và API LayDSNhanSuTheoCore_Employment đều đã filter theo Đơn vị ở backend.
        // (Field DAOTAO_COCAUTOCHUC_ID không tồn tại trong response của Pr_Core_Person_Get_By_R_F_Emp.)
        
        // console.log("filteredNhanSu:", me.filteredNhanSu.length);
        
        // Tính phân trang
        me.totalRecords = me.filteredNhanSu.length;
        me.totalPages = Math.ceil(me.totalRecords / me.pageSize);
        
        // Lấy dữ liệu trang hiện tại
        var startIndex = (me.currentPage - 1) * me.pageSize;
        var endIndex = Math.min(startIndex + me.pageSize, me.totalRecords);
        var pageNhanSu = me.filteredNhanSu.slice(startIndex, endIndex);
        
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
        
        // Tạo header - LUÔN HIỂN THỊ
        var htmlHead = '<tr>';
        htmlHead += '<th rowspan="2" style="min-width: 200px; position: sticky; left: 0; z-index: 12; background: #223771; vertical-align: middle;">';
        htmlHead += '<div style="font-weight: 600; font-size: 13px;">Nhân sự</div>';
        htmlHead += '<div style="font-size: 11px; margin-top: 3px; opacity: 0.9;">(' + me.totalRecords + ' người)</div>';
        htmlHead += '</th>';
        
        for (var i = 0; i < sortedDimensions.length; i++) {
            var dim = sortedDimensions[i];
            htmlHead += '<th style="background: #3c5398; color: white; padding: 10px; border: 1px solid #223771;">';
            htmlHead += '<div style="font-weight: 600; font-size: 13px;">' + dim.name + '</div>';
            htmlHead += '<div style="font-size: 10px; margin-top: 3px; opacity: 0.9;">(' + dim.data.length + ' giá trị)</div>';
            htmlHead += '</th>';
        }
        htmlHead += '</tr>';
        
        $("#tblPhanQuyenDuLieu thead").html(htmlHead);
        
        // Tạo body - Mỗi dòng là 1 nhân sự (có phân trang)
        var htmlBody = '';
        var totalCols = 1 + sortedDimensions.length;
        
        if (pageNhanSu.length > 0) {
            for (var v = 0; v < pageNhanSu.length; v++) {
                var nhanSu = pageNhanSu[v];
                var stt = startIndex + v + 1;
                var nsId  = nhanSu.ID || nhanSu.NHANSU_ID || nhanSu.PERSON_ID || '';
                var nsName = nhanSu.FULL_NAME || nhanSu.HOTEN || nhanSu.TEN || 'N/A';
                var nsMa   = nhanSu.CURRENT_EMPLOYEE_CODE || nhanSu.MASO || nhanSu.MA || '';
                var nsDept = nhanSu.DAOTAO_COCAUTOCHUC_TEN || nhanSu.ORG_NAME || '';

                htmlBody += '<tr>';

                // Cột đầu tiên: Thông tin nhân sự
                htmlBody += '<td style="padding: 10px 12px; position: sticky; left: 0; background: #f8f9fa; z-index: 5; border-right: 2px solid #dee2e6;">';
                htmlBody += '<div style="display: flex; align-items: center; gap: 8px;">';
                htmlBody += '<div style="min-width: 25px; text-align: center; font-weight: 600; color: #999; font-size: 11px;">' + stt + '</div>';
                htmlBody += '<i class="fa-solid fa-user" style="color: #223771; font-size: 12px;"></i>';
                htmlBody += '<div>';
                htmlBody += '<div style="font-weight: 500; font-size: 12px;">' + nsName + '</div>';
                if (nsMa) htmlBody += '<div style="font-size: 10px; color: #666;">Mã: ' + nsMa + '</div>';
                if (nsDept) htmlBody += '<div style="font-size: 10px; color: #666;">' + nsDept + '</div>';
                htmlBody += '</div>';
                htmlBody += '</div>';
                htmlBody += '</td>';

                // Checkbox cho từng giá trị của từng chiều
                for (var i = 0; i < sortedDimensions.length; i++) {
                    var dim = sortedDimensions[i];

                    htmlBody += '<td class="td-center" style="border: 1px solid #e0e0e0; padding: 8px;">';
                    htmlBody += '<div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">';

                    // Nút Xem kết quả
                    htmlBody += '<button type="button" class="btn btn-sm btn-info btnXemKetQua" ';
                    htmlBody += 'data-nhansu-id="' + nsId + '" ';
                    htmlBody += 'data-nhansu-name="' + nsName + '" ';
                    htmlBody += 'data-dimension-id="' + dim.id + '" ';
                    htmlBody += 'data-dimension-name="' + dim.name + '" ';
                    htmlBody += 'style="font-size: 10px; padding: 3px 6px; white-space: nowrap;" title="Xem các quyền đã gán">';
                    htmlBody += '<i class="fa-solid fa-list-check"></i> Xem kết quả';
                    htmlBody += '</button>';

                    // Nút Thêm quyền
                    htmlBody += '<button type="button" class="btn btn-sm btn-success btnThemQuyen" ';
                    htmlBody += 'data-nhansu-id="' + nsId + '" ';
                    htmlBody += 'data-nhansu-name="' + nsName + '" ';
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
            // Không có nhân sự - hiển thị thông báo NHƯNG VẪN GIỮ CẤU TRÚC BẢNG
            htmlBody += '<tr>';
            htmlBody += '<td colspan="' + totalCols + '" style="text-align: center; padding: 40px; background: #fff3cd;">';
            htmlBody += '<i class="fa-solid fa-users-slash fa-3x" style="color: #856404;"></i>';
            htmlBody += '<div style="margin-top: 15px; font-size: 16px; color: #856404; font-weight: 600;">Không tìm thấy nhân sự</div>';
            if (!me.selectedDonViId) {
                htmlBody += '<div style="font-size: 13px; color: #856404; margin-top: 5px;">Vui lòng chọn Đơn vị để bắt đầu</div>';
            } else {
                htmlBody += '<div style="font-size: 13px; color: #856404; margin-top: 5px;">Đơn vị này chưa có nhân sự hoặc dữ liệu chưa được cập nhật</div>';
            }
            htmlBody += '</td>';
            htmlBody += '</tr>';
        }
        
        // console.log("Rendering table with", pageNhanSu.length, "rows");
        $("#tblPhanQuyenDuLieu tbody").html(htmlBody);
        
        // Bind event cho nút Xem kết quả
        $(".btnXemKetQua").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var nhanSuId = $(this).data("nhansu-id");
            var nhanSuName = $(this).data("nhansu-name");
            var dimensionId = $(this).data("dimension-id");
            var dimensionName = $(this).data("dimension-name");
            
            me.showResultModal(nhanSuId, nhanSuName, dimensionId, dimensionName);
            return false;
        });
        
        // Bind event cho nút Thêm quyền
        $(".btnThemQuyen").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var nhanSuId = $(this).data("nhansu-id");
            var nhanSuName = $(this).data("nhansu-name");
            var dimensionId = $(this).data("dimension-id");
            var dimensionName = $(this).data("dimension-name");
            
            me.showAddPermissionModal(nhanSuId, nhanSuName, dimensionId, dimensionName);
            return false;
        });
        
        // Render phân trang
        me.renderPagination();
    },

    /*------------------------------------------
    --Hiển thị modal chi tiết để chọn giá trị (CÓ PHÂN TRANG)
    -------------------------------------------*/
    showDetailModal: function(nhanSuId, nhanSuName, dimensionId, dimensionName) {
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
        me.modalNhanSuId = nhanSuId;
        me.modalDimensionId = dimensionId;
        me.modalExistingPermissions = {}; // {valueId: scopeId}
        
        // Tạo HTML cho modal
        var modalHtml = '';
        modalHtml += '<div id="modalChiTiet" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
        modalHtml += '<div style="background: white; border-radius: 8px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">';
        
        // Header
        modalHtml += '<div style="background: linear-gradient(135deg, #223771 0%, #3c5398 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">';
        modalHtml += '<h5 style="margin: 0; font-size: 16px;"><i class="fa-solid fa-user"></i> ' + nhanSuName + ' - ' + dimensionName + ' (' + me.modalTotalRecords + ' giá trị)</h5>';
        modalHtml += '<button id="btnCloseModal" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">&times;</button>';
        modalHtml += '</div>';
        
        // Body
        modalHtml += '<div style="padding: 20px; flex: 1; overflow-y: auto;">';
        modalHtml += '<div style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">';
        modalHtml += '<strong>Hướng dẫn:</strong> Chọn các giá trị bạn muốn gán quyền cho nhân sự này. Các giá trị đã có quyền sẽ được đánh dấu sẵn.';
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
        me.loadExistingPermissions(nhanSuId, dimensionId, function() {
            // Sau khi load xong quyền, render bảng
            $("#modalLoadingIndicator").hide();
            $("#modalTableContainer").show();
            me.renderModalTable(nhanSuId, dimensionId);
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
            me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
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
                // console.log("Selected value to add:", valueId, "Has scope-id:", $(this).attr("data-scope-id"));
            });
            
            // console.log("Total selected values to add:", selectedValues.length);
            // console.log("Selected values:", selectedValues);
            
            if (selectedValues.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 giá trị chưa có quyền");
                return false;
            }
            
            // Hiển thị popup chọn chế độ và kiểu
            me.showScopeModePopup(nhanSuId, dimensionId, selectedValues);
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
            me.modalFilteredData = null;
            me.modalTotalRecords = me.modalData.length;
            me.modalCurrentPage = 1;
            me.modalTotalPages = Math.ceil(me.modalTotalRecords / me.modalPageSize);
            $("#modalSearchCount").text('');
            me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
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
        me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
    },

    /*------------------------------------------
    --Hiển thị modal XEM KẾT QUẢ (chỉ hiển thị quyền đã gán)
    -------------------------------------------*/
    showResultModal: function(nhanSuId, nhanSuName, dimensionId, dimensionName) {
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
        me.modalNhanSuId = nhanSuId;
        me.modalDimensionId = dimensionId;
        me.modalExistingPermissions = {}; // {valueId: scopeId}
        
        // Tạo HTML cho modal
        var modalHtml = '';
        modalHtml += '<div id="modalXemKetQua" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
        modalHtml += '<div style="background: white; border-radius: 8px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">';
        
        // Header
        modalHtml += '<div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">';
        modalHtml += '<h5 style="margin: 0; font-size: 16px;"><i class="fa-solid fa-list-check"></i> Kết quả phân quyền - ' + nhanSuName + ' - ' + dimensionName + '</h5>';
        modalHtml += '<button id="btnCloseResultModal" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">&times;</button>';
        modalHtml += '</div>';
        
        // Body
        modalHtml += '<div style="padding: 20px; flex: 1; overflow-y: auto;">';
        modalHtml += '<div style="margin-bottom: 15px; padding: 10px; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">';
        modalHtml += '<strong>Thông tin:</strong> Hiển thị các quyền đã được gán cho nhân sự này. Chỉ xem, không thể chỉnh sửa.';
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
        me.loadExistingPermissions(nhanSuId, dimensionId, function() {
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
        
        // Bind event cho nút Xóa (thu thập combo URFDV cho API Pr_Co_U_R_F_Da_Sc_De_By_URFDV)
        $("#btnXoaResultModal").click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var combos = [];
            $(".chkResultItem:checked").each(function() {
                combos.push({
                    userId     : $(this).data("user-id"),
                    roleId     : $(this).data("role-id"),
                    functionId : $(this).data("function-id"),
                    dimensionId: $(this).data("dimension-id"),
                    valueId    : $(this).data("value-id")
                });
            });

            if (combos.length === 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 quyền để xóa");
                return false;
            }

            me.deletePermissions(combos);
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
            
            // Role + Function từ filter hiện tại (để gắn cho từng combo xóa URFDV)
            var curRoleId = me.selectedVaiTroId || ((me.selectedVaiTroListIds && me.selectedVaiTroListIds[0]) || '');
            var curFuncId = (me.selectedChucNangIds && me.selectedChucNangIds[0]) || '';

            for (var j = 0; j < assignedItems.length; j++) {
                var assigned = assignedItems[j];
                var item = assigned.item;

                tableHtml += '<tr style="background: #d4edda;">';
                tableHtml += '<td style="text-align: center; padding: 8px;">';
                tableHtml += '<input type="checkbox" class="chkResultItem"';
                tableHtml += ' data-scope-id="' + assigned.scopeId + '"';
                tableHtml += ' data-user-id="' + (me.modalNhanSuId || '') + '"';
                tableHtml += ' data-role-id="' + curRoleId + '"';
                tableHtml += ' data-function-id="' + curFuncId + '"';
                tableHtml += ' data-dimension-id="' + (me.modalDimensionId || '') + '"';
                tableHtml += ' data-value-id="' + assigned.valueId + '"';
                tableHtml += ' style="width: 18px; height: 18px; cursor: pointer;"/>';
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
    showAddPermissionModal: function(nhanSuId, nhanSuName, dimensionId, dimensionName) {
        var me = this;
        
        // Gọi lại function showDetailModal cũ với tên mới
        me.showDetailModal(nhanSuId, nhanSuName, dimensionId, dimensionName);
    },

    /*------------------------------------------
    --Hiển thị popup chọn chế độ và kiểu
    -------------------------------------------*/
    showScopeModePopup: function(nhanSuId, dimensionId, selectedValues) {
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
        me.loadScopeOptions(nhanSuId, dimensionId, selectedValues);
        
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
    loadScopeOptions: function(nhanSuId, dimensionId, selectedValues) {
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
        me.renderScopeForm(scopeModes, scopeKinds, nhanSuId, dimensionId, selectedValues);
    },

    /*------------------------------------------
    --Render form chọn SCOPE_MODE và SCOPE_KIND
    -------------------------------------------*/
    renderScopeForm: function(scopeModes, scopeKinds, nhanSuId, dimensionId, selectedValues) {
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
        formHtml += '<small style="color: #666; margin-top: 5px; display: block;">INCLUDE: Nhân sự được phép truy cập dữ liệu này<br/>EXCLUDE: Nhân sự bị từ chối truy cập dữ liệu này</small>';
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
            me.savePermissions(nhanSuId, dimensionId, selectedValues, "ADD", scopeMode, scopeKind);
            
            return false;
        });
    },
    
    /*------------------------------------------
    --Load quyền dữ liệu đã gán cho 1 nhân sự × 1 chiều
    --  Dùng PKG_CORE_QUANTRI_02.LayDSCore_D_V_URF_Data_Scope (User-Role-Function)
    --  Lọc theo Vai trò + Chức năng đang chọn ở filter để chỉ hiện quyền
    --  tương ứng với bối cảnh user đang xem.
    -------------------------------------------*/
    loadExistingPermissions: function(nhanSuId, dimensionId, callback) {
        var me = this;

        // Lấy 1 vai trò / 1 chức năng từ filter để truyền vào stored proc.
        // API nhận single values nên ưu tiên ddlVaiTro (single) rồi tới phần tử đầu của list.
        var roleId = me.selectedVaiTroId || ((me.selectedVaiTroListIds && me.selectedVaiTroListIds[0]) || '');
        var funcId = (me.selectedChucNangIds && me.selectedChucNangIds[0]) || '';

        var obj_list = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUeFx4UEwceBSA1IB4SIi4xJAPP',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_D_V_URF_Data_Scope',
            'iM': 'Azz',
            'strCore_Person_Id': nhanSuId,
            'strCore_Role_Id': roleId,
            'strChucNang_Id': funcId,
            'strCore_Data_Dimension_Id': dimensionId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };

        // console.log("Request params:", obj_list);

        edu.system.makeRequest({
            success: function (data) {
                // console.log("=== DEBUG loadExistingPermissions FULL RESPONSE ===");
                // console.log("Raw response:", data);
                // console.log("Success:", data.Success);
                // console.log("Message:", data.Message);
                // console.log("Data type:", typeof data.Data);
                // console.log("Data is array:", Array.isArray(data.Data));
                // console.log("Data length:", data.Data ? data.Data.length : 'null/undefined');
                
                if (data.Data && data.Data.length > 0) {
                    // console.log("First item keys:", Object.keys(data.Data[0]));
                    // console.log("First item values:", data.Data[0]);
                    
                    // Thử tất cả các field có thể
                    var firstItem = data.Data[0];
                    // console.log("Possible VALUE_ID fields:");
                    // console.log("  DIMENSION_VALUE_ID:", firstItem.DIMENSION_VALUE_ID);
                    // console.log("  CORE_DATA_VALUE_ID:", firstItem.CORE_DATA_VALUE_ID);
                    // console.log("  VALUE_ID:", firstItem.VALUE_ID);
                    // console.log("  CORE_DIMENSION_VALUE_ID:", firstItem.CORE_DIMENSION_VALUE_ID);
                    // console.log("  DIMENSIONVALUEID:", firstItem.DIMENSIONVALUEID);
                    // console.log("  COREDATAVALUEID:", firstItem.COREDATAVALUEID);
                    
                    // console.log("Possible SCOPE_ID fields:");
                    // console.log("  ID:", firstItem.ID);
                    // console.log("  SCOPE_ID:", firstItem.SCOPE_ID);
                    // console.log("  CORE_USER_DATA_SCOPE_ID:", firstItem.CORE_USER_DATA_SCOPE_ID);
                    // console.log("  SCOPEID:", firstItem.SCOPEID);
                    // console.log("  COREUSERDATASCOPEID:", firstItem.COREUSERDATASCOPEID);
                }
                
                if (data.Success && data.Data) {
                    // Response có thể là data.Data[] hoặc data.Data.rs[]
                    var arr = [];
                    if (Array.isArray(data.Data)) arr = data.Data;
                    else if (Array.isArray(data.Data.rs)) arr = data.Data.rs;

                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];

                        var valueId = item.DIMENSION_VALUE_ID || item.CORE_DATA_VALUE_ID ||
                                      item.VALUE_ID || item.CORE_DIMENSION_VALUE_ID ||
                                      item.DIMENSIONVALUEID || item.COREDATAVALUEID;

                        // API mới không trả SCOPE_ID; dùng chính record để đánh dấu đã gán
                        // (delete đã chuyển sang theo URFDV combo nên không cần scope ID).
                        var scopeId = item.ID || item.SCOPE_ID || item.CORE_USER_DATA_SCOPE_ID ||
                                      item.SCOPEID || item.COREUSERDATASCOPEID || true;

                        if (valueId) {
                            me.modalExistingPermissions[valueId] = scopeId;
                        }
                    }
                }

                if (callback) callback();
            },
            error: function (er) {
                // API chưa có hoặc lỗi → vẫn callback để modal hiển thị
                if (callback) callback();
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Render bảng trong modal với phân trang
    -------------------------------------------*/
    renderModalTable: function(nhanSuId, dimensionId) {
        var me = this;
        
        // Sử dụng dữ liệu đã lọc nếu có, nếu không thì dùng dữ liệu gốc
        var dataToUse = me.modalFilteredData || me.modalData;
        
        // Debug: Kiểm tra quyền hiện tại
        // console.log("=== DEBUG renderModalTable ===");
        // console.log("NhanSuId:", nhanSuId);
        // console.log("DimensionId:", dimensionId);
        // console.log("Existing Permissions:", me.modalExistingPermissions);
        // console.log("Total permissions:", Object.keys(me.modalExistingPermissions).length);
        // console.log("Using filtered data:", !!me.modalFilteredData);
        // console.log("Data length:", dataToUse.length);
        
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
            // console.log("Item " + globalIndex + ":", {
            //     valueId: valueId,
            //     scopeId: scopeId,
            //     hasPermission: hasPermission,
            //     name: item.VALUE_NAME || item.CORE_DATA_VALUE_NAME || item.TEN
            // });
            
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
        me.renderModalPagination(nhanSuId, dimensionId);
    },

    /*------------------------------------------
    --Render phân trang cho modal
    -------------------------------------------*/
    renderModalPagination: function(nhanSuId, dimensionId) {
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
            me.modalGoToPage(1, nhanSuId, dimensionId);
            return false;
        });
        
        $(".btnModalPrevPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalCurrentPage - 1, nhanSuId, dimensionId);
            return false;
        });
        
        $(".btnModalNextPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalCurrentPage + 1, nhanSuId, dimensionId);
            return false;
        });
        
        $(".btnModalLastPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(me.modalTotalPages, nhanSuId, dimensionId);
            return false;
        });
        
        $(".btnModalPage").click(function(e) {
            e.preventDefault();
            me.modalGoToPage(parseInt($(this).data("page")), nhanSuId, dimensionId);
            return false;
        });
    },
    
    /*------------------------------------------
    --Chuyển trang trong modal
    -------------------------------------------*/
    modalGoToPage: function(page, nhanSuId, dimensionId) {
        var me = this;
        if (page < 1 || page > me.modalTotalPages) return;
        me.modalCurrentPage = page;
        me.renderModalTable(nhanSuId, dimensionId);
    },

    /*------------------------------------------
    --Lưu quyền (Thêm) - USER SCOPE
    -------------------------------------------*/
    savePermissions: function(nhanSuId, dimensionId, valueIds, action, scopeMode, scopeKind) {
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
            
            // Lấy Role + Function từ filter đang chọn để gán quyền đúng bối cảnh
            var filterRoleId = me.selectedVaiTroId || ((me.selectedVaiTroListIds && me.selectedVaiTroListIds[0]) || '');
            var filterFuncId = (me.selectedChucNangIds && me.selectedChucNangIds[0]) || '';

            for (var i = 0; i < valueIds.length; i++) {
                var obj_save = {
                    'action': 'CMS_QuanTri02_MH/ETMeAi4zJB4UHhMeBx4FIDUgHhIiLjEkHggv',
                    'func': 'PKG_CORE_QUANTRI_02.Pr_Core_U_R_F_Data_Scope_In',
                    'iM': 'Azz',
                    'strUser_Id': nhanSuId,
                    'strRole_Id': filterRoleId,
                    'strFunction_Id': filterFuncId,
                    'strDimension_Id': dimensionId,
                    'strDimension_Value_Id': valueIds[i],
                    'strResource_Id': '',
                    'strScope_Mode': scopeMode,
                    'strScope_Kind': scopeKind,
                    'dIs_Allowed': 1,
                    'dPriority_No': 100,
                    'strEffective_From': '',
                    'strEffective_To': '',
                    'dIs_Active': 1,
                    'dIs_Current': 1,
                    'strSource_Type': 'MANUAL',
                    'strSource_Ref_Id': '',
                    'strNote': '',
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                    'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                    'strHanhDong_Code': 'THEM'
                };
                
                // console.log("=== DEBUG API Call ===");
                // console.log("API Parameters:", JSON.stringify(obj_save, null, 2));
                
                edu.system.makeRequest({
                    success: function (data) {
                        // console.log("=== DEBUG API Response ===");
                        // console.log("Response:", JSON.stringify(data, null, 2));
                        
                        completedCount++;
                        
                        if (data.Success) {
                            successCount++;
                            // console.log("✅ Success for valueId:", valueIds[completedCount - 1]);
                        } else {
                            // console.log("❌ Error for valueId:", valueIds[completedCount - 1], "Message:", data.Message);
                            
                            // Kiểm tra nếu là lỗi "đã tồn tại" thì coi như thành công
                            // (backend đôi khi trả message bị lỗi encoding: "Ðã t?n t?i...")
                            var msgLower = (data.Message || '').toLowerCase();
                            var isDuplicate =
                                msgLower.indexOf("da ton tai") !== -1 ||
                                msgLower.indexOf("đã tồn tại") !== -1 ||
                                msgLower.indexOf("already exists") !== -1 ||
                                msgLower.indexOf("ðã") !== -1 ||                 // Đã → Ð (bị lỗi encode)
                                msgLower.indexOf("t?n t?i") !== -1 ||            // tồn tại bị ?
                                msgLower.indexOf("ph?m vi d? li?u") !== -1;      // phạm vi dữ liệu bị ?
                            
                            if (isDuplicate) {
                                // Coi như thành công vì quyền đã có rồi
                                successCount++;
                                // console.log("ℹ️ Quyền đã tồn tại, bỏ qua:", data.Message);
                            } else {
                                // Lỗi thật sự
                                errorCount++;
                                errorMessages.push(data.Message);
                            }
                        }
                        
                        if (completedCount === totalCount) {
                            // Reload lại popup để hiển thị quyền mới
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalNhanSuId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
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
                            me.loadExistingPermissions(me.modalNhanSuId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
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
        }
    },

    /*------------------------------------------
    --Xóa quyền - Pr_Co_U_R_F_Da_Sc_De_By_URFDV
    --  Nhận mảng combo [{userId, roleId, functionId, dimensionId, valueId}]
    -------------------------------------------*/
    deletePermissions: function(combos) {
        var me = this;

        if (!combos || combos.length === 0) {
            edu.system.alert("Không có quyền nào để xóa");
            return;
        }

        edu.system.confirm("Bạn có chắc chắn muốn xóa " + combos.length + " quyền đã chọn?");

        $("#btnYes").off("click").click(function() {
            var completedCount = 0;
            var totalCount = combos.length;
            var successCount = 0;
            var errorCount = 0;
            var errorMessages = [];

            for (var i = 0; i < combos.length; i++) {
                var c = combos[i];
                var obj_delete = {
                    'action': 'CMS_QuanTri02_MH/ETMeAi4eFB4THgceBSAeEiIeBSQeAzgeFBMHBRcP',
                    'func': 'PKG_CORE_QUANTRI_02.Pr_Co_U_R_F_Da_Sc_De_By_URFDV',
                    'iM': 'Azz',
                    'strUser_Id': c.userId || '',
                    'strRole_Id': c.roleId || '',
                    'strFunction_Id': c.functionId || '',
                    'strDimension_Id': c.dimensionId || '',
                    'strDimension_Value_Id': c.valueId || '',
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                    'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                    'strHanhDong_Code': 'XOA'
                };

                edu.system.makeRequest({
                    success: function (data) {
                        completedCount++;

                        if (data.Success) {
                            successCount++;
                        } else {
                            errorCount++;
                            if (data.Message) errorMessages.push(data.Message);
                        }

                        if (completedCount === totalCount) {
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalNhanSuId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
                            });

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
                            me.modalExistingPermissions = {};
                            me.loadExistingPermissions(me.modalNhanSuId, me.modalDimensionId, function() {
                                me.renderModalTable(me.modalNhanSuId, me.modalDimensionId);
                            });
                            edu.system.alert("Có lỗi khi xóa quyền: " + errorMessages.join(", "));
                        }
                    },
                    type: 'POST',
                    action: obj_delete.action,
                    contentType: true,
                    data: obj_delete,
                    fakedb: []
                }, false, false, false, null);
            }
        });
    },

    /*------------------------------------------
    --Lưu phân quyền (không dùng trong modal)
    -------------------------------------------*/
    save_PhanQuyen: function () {
        var me = this;
        edu.system.alert("Vui lòng sử dụng nút Thêm/Xóa trong popup chi tiết để quản lý quyền");
    },
    
    /*------------------------------------------
    --Render phân trang
    -------------------------------------------*/
    renderPagination: function () {
        var me = this;
        
        var html = '<div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 6px; margin-top: 15px; flex-wrap: wrap; gap: 15px;">';
        
        // Info
        var from = me.totalRecords > 0 ? ((me.currentPage - 1) * me.pageSize + 1) : 0;
        var to = Math.min(me.currentPage * me.pageSize, me.totalRecords);
        html += '<div style="font-size: 13px; color: #555;">';
        html += 'Hiển thị <strong>' + from + '</strong> - <strong>' + to + '</strong> / <strong>' + me.totalRecords + '</strong> nhân sự';
        html += '</div>';
        
        // Page size selector
        html += '<div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">';
        html += '<label>Hiển thị:</label>';
        html += '<select id="ddlPageSize" class="form-select" style="width: auto; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px;">';
        html += '<option value="10"' + (me.pageSize === 10 ? ' selected' : '') + '>10</option>';
        html += '<option value="20"' + (me.pageSize === 20 ? ' selected' : '') + '>20</option>';
        html += '<option value="50"' + (me.pageSize === 50 ? ' selected' : '') + '>50</option>';
        html += '<option value="100"' + (me.pageSize === 100 ? ' selected' : '') + '>100</option>';
        html += '</select>';
        html += '</div>';
        
        // Buttons
        html += '<div style="display: flex; gap: 5px;">';
        html += '<button class="btn btn-sm btn-outline-primary" id="btnFirstPage" ' + (me.currentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angles-left"></i></button>';
        html += '<button class="btn btn-sm btn-outline-primary" id="btnPrevPage" ' + (me.currentPage === 1 ? 'disabled' : '') + '><i class="fa-solid fa-angle-left"></i></button>';
        
        var startPage = Math.max(1, me.currentPage - 2);
        var endPage = Math.min(me.totalPages, me.currentPage + 2);
        
        for (var i = startPage; i <= endPage; i++) {
            html += '<button class="btn btn-sm ' + (i === me.currentPage ? 'btn-primary' : 'btn-outline-primary') + ' btnPage" data-page="' + i + '">' + i + '</button>';
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
        $(".btnPage").click(function() { me.goToPage(parseInt($(this).data("page"))); });
        
        $("#ddlPageSize").change(function() {
            me.pageSize = parseInt($(this).val());
            me.currentPage = 1;
            me.genTable_DuLieu();
        });
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
