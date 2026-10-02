/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 31/05/2018 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DangKy() { };
DangKy.prototype = {
    strKeHoach_Id: '',
    strHocPhan_Id: '',
    objName: {},
    dtLopHocPhan: [],
    dtHocPhan: [],
    dtKeHoach: [],
    dtKetQuaDK: [],
    iTongSoTinChiDK: 0,
    dTongSoTienDangKy: 0,
    objDangKy: { index: [], id: [] },
    arrThuocTinhLop_Id: [],
    temSelect: {id: '', name: ''},
    atStep: 0,
    arrStep: [],
    activeStep: '',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        edu.util.yyyy_mm_dd_hh_mm_ss();
        
        /*------------------------------------------
		--Discription: initial 
		-------------------------------------------*/
        me.objName = {
            kehoach     : "dkh_kehoach",
            hocphan     : "dkh_dthocphan",
            lophocphan  : "dkh_dtlophocphan",
            ketquadangky: "dkh_dtketquadangky",
        }
        me.getList_KeHoachDangKy();
        /*------------------------------------------
		--Discription: action 
		-------------------------------------------*/
        $('#dropKeHoach_Search').on('select2:select', function () {
            var strKeHoach_Id = $(this).find('option:selected').val();
            if (strKeHoach_Id != "") {
                me.strKeHoach_Id = strKeHoach_Id;
                me.getList_HocPhan(strKeHoach_Id);
            }
        });
        $('#dropHocPhan_Search').on('select2:select', function () {
            var strHocPhan_Id = $(this).find('option:selected').val();
            me.resetVar();
            if (strHocPhan_Id != "") {
                me.strHocPhan_Id = strHocPhan_Id;
                me.getDetail_HocPhan(me.strKeHoach_Id, strHocPhan_Id, me.getList_LopHocPhan);
            }
        });
        $("#btnClearCache").click(function () {
            edu.system.delCache_LocalStore(me.objName.kehoach);
            edu.system.delCache_LocalStore(me.objName.hocphan);
            edu.system.delCache_LocalStore(me.objName.lophocphan);
            edu.system.delCache_LocalStore(me.objName.ketquadangky);
            edu.system.alert("Bạn đã xóa dữ liệu cache thành công!, dữ liệu cache xóa bằng tay chỉ có ý nghĩa cho người phát triển, khi chạy thật sẽ tự động xóa");
        });
        /*------------------------------------------
        --Discription: action popover - detail schadule for each weeks
        -------------------------------------------*/
        $(document).delegate('.detail', 'mouseenter', function () {
            var selected_id = this.id;
            var objdata = {
                obj: this,
                title: "Chi tiết tuần học",
                content: function () {
                    var html_popover = '';
                    html_popover += '<table class="table table-condensed table-hover">';
                    html_popover += '<thead>';
                    html_popover += '<tr>';
                    html_popover += '<th>Thứ</th>';
                    html_popover += '<th>Buổi</th>';
                    html_popover += '<th>Tiết</th>';
                    html_popover += '<th>Ngày</th>';
                    html_popover += '</tr>';
                    html_popover += '</thead>';
                    html_popover += '<tbody>';
                    for (var i = 2; i < 8; i++) {
                        html_popover += '<tr>';
                        html_popover += '<td class="td-center">' + i + '</td>';
                        if (i < 5) {
                            html_popover += '<td class="td-center">S</td>';
                        }
                        else{
                            html_popover += '<td class="td-center">C</td>';
                        }
                        html_popover += '<td class="td-center">00:00</td>';
                        html_popover += '<td class="td-center">../../..</td>';
                        html_popover += '</tr>';
                    }
                    html_popover += '</tbody>';
                    html_popover += '</table>';
                    return html_popover;
                },
                event: 'hover',
                place: 'left',
            };
            edu.system.loadToPopover_data(objdata);
        });
        $(document).delegate(".select_lhp", "click", function () {
            var strLopHocPhan_Id = this.id;
            strLopHocPhan_Id = edu.util.cutPrefixId(/rdMon_/g, strLopHocPhan_Id);

            if (edu.util.checkValue(strLopHocPhan_Id)) {
                var strLopHocPhan_Ten = $("#lophocphan_ten" + strLopHocPhan_Id).text();
                me.temSelect.id = strLopHocPhan_Id;
                me.temSelect.name = strLopHocPhan_Ten;
            }
            else {
                alert("Thông báo: chưa chọn được dữ liệu, vui lòng chọn lại!");
            }
            console.log(me.temSelect);
        });
        /*------------------------------------------
		--Discription: ketquadangky 
		-------------------------------------------*/
        $(document).delegate('a[href="#zone_content_kqdk"]', 'click', function () {
            //Load 1 lan khi click ao tab
            //var data = JSON.parse(localStorage.getItem("data_table"));
            //console.log("data: " + JSON.stringify(data));
            me.genTable_KetQuaDangKy(me.dtKetQuaDK);
            console.log("me.dtKetQuaDK: " + JSON.stringify(me.dtKetQuaDK));
        });
    },
    /*------------------------------------------
	--Discription: Common
	-------------------------------------------*/
    popup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_TTDK.strId = "";
        //
        var arrId = ["txtSoDienThoai"];
        edu.util.resetValByArrId(arrId);
    },
    resetVar: function () {
        var me = this;
        me.objDangKy = { index: [], id: [] };
        me.arrThuocTinhLop_Id = [];
        me.arrStep = [];
    },
    /*------------------------------------------
	--Discription: Ke hoach dang ky
	-------------------------------------------*/
    getList_KeHoachDangKy: function () {
        var me = this;
        //////////////////////////////////////////////////////////////////////////////
        var objCache = edu.system.getCache_LocalStore(me.objName.kehoach, "");
        if (objCache.key == true) {
            me.loadToCombo_KeHoachDangKy(objCache.data);
            return;
        }
        /////////////////////////////////////////////////////////////////////////////
        var obj_kehoach = {};
        alert("Get data from db for KEHOACH!");
        var data = [ 
            { "ID": "KH1", "NAME": "Tổ chức đăng ký học đợt 2 năm 2016_2017" },
            { "ID": "KH2", "NAME": "Tổ chức đăng ký học đợt 1 năm 2017_2018" },
            { "ID": "KH3", "NAME": "Tổ chức đăng ký học đợt 2 năm 2017_2018"},
        ];
        /////////////////////////////////////////////////////////////////////////////
        //set objCache
        obj_kehoach.key = "";
        obj_kehoach.data = data;
        me.dtKeHoach.push(obj_kehoach);
        //cache
        edu.system.setCache_LocalStore(me.objName.kehoach, me.dtKeHoach);
        me.loadToCombo_KeHoachDangKy(obj_kehoach.data);
    },
    /*------------------------------------------
	--Discription: Hoc phan
	-------------------------------------------*/
    getList_HocPhan: function (strKeHoach_Id) {
        var me = this;
        //////////////////////////////////////////////////////////////////////////////
        var key = strKeHoach_Id;
        var objCache = edu.system.getCache_LocalStore(me.objName.hocphan, key);
        if (objCache.key == true) {
            me.loadToCombo_HocPhan(objCache.data);
            return;
        }
        /////////////////////////////////////////////////////////////////////////////
        var obj_hocphan = {};
        var dtHocPhan = [];
        alert("Get data from db for HOCPHAN, ma ke hoach: " + strKeHoach_Id);
        var data = [
            { "ID": "HP1", "NAME": "Chủ nghĩa xã hội và khoa học", "KEHOACH_ID":"KH1", "TINCHI":"3", "THUOCTINHLOP_ID":"lt,th,btl" },
            { "ID": "HP2", "NAME": "Kinh tế thị trường 1", "KEHOACH_ID": "KH1", "TINCHI": "2", "THUOCTINHLOP_ID": "lt,th,btl" },
            { "ID": "HP3", "NAME": "Lịch sử nhân loại và nguồn gốc loài người", "TINCHI": "3", "KEHOACH_ID": "KH1", "THUOCTINHLOP_ID": "lt" },

            { "ID": "HP4", "NAME": "Hoạt động kinh doanh", "KEHOACH_ID": "KH2", "TINCHI": "3", "THUOCTINHLOP_ID": "lt" },
            { "ID": "HP5", "NAME": "An toàn trong công tác đầu tư", "KEHOACH_ID": "KH2", "TINCHI": "2", "THUOCTINHLOP_ID": "lt" },
            { "ID": "HP6", "NAME": "Tin học cơ bản", "KEHOACH_ID": "KH2", "TINCHI": "3", "THUOCTINHLOP_ID": "lt" },

            { "ID": "HP7", "NAME": "Chính sách đầu tư", "KEHOACH_ID": "KH3", "TINCHI": "1", "THUOCTINHLOP_ID": "lt" },
            { "ID": "HP8", "NAME": "Triển khai mô hình kinh doanh", "KEHOACH_ID": "KH3", "TINCHI": "3", "THUOCTINHLOP_ID": "lt" },
            { "ID": "HP9", "NAME": "Xoay vòng vốn trong thị trường mới", "KEHOACH_ID": "KH3", "TINCHI": "3", "THUOCTINHLOP_ID": "lt" },
        ];
        for (var i = 0; i < data.length; i++) {
            if (data[i].KEHOACH_ID == strKeHoach_Id) {
                dtHocPhan.push(data[i]);
            }
        }
        /////////////////////////////////////////////////////////////////////////////
        //set objCache
        obj_hocphan.key     = strKeHoach_Id;
        obj_hocphan.data    = dtHocPhan;
        me.dtHocPhan.push(obj_hocphan);
        //cache
        edu.system.setCache_LocalStore(me.objName.hocphan, me.dtHocPhan);
        //
        me.loadToCombo_HocPhan(obj_hocphan.data);
    },
    getDetail_HocPhan: function (strKeHoach_Id, strHocPhan_Id, callback) {
        var me = this;
        var key = strKeHoach_Id;
        var objCache = edu.system.getCache_LocalStore(main_doc.DangKy.objName.hocphan, key);
        if (objCache.key == true) {
            var iThuocTinhLop_Id = main_doc.DangKy.genDetail_HocPhan(strKeHoach_Id, strHocPhan_Id, objCache.data);
        }
        //if success then call this function getList_LopHocPhan()
        callback(strKeHoach_Id, strHocPhan_Id, iThuocTinhLop_Id[0]);
    },
    genDetail_HocPhan: function (strKeHoach_Id, strHocPhan_Id, data) {
        var html = '';
        var $iTinChi    = '#iTinChi';
        var $iThuocTinhLop_Id   = '#iLoaiLop';
        $($iTinChi).html('');
        $(iThuocTinhLop_Id).html('');
        var tinchi = 0;
        var iThuocTinhLop_Id = '';
        //
        for (var i = 0; i < data.length; i++) {
            if (strHocPhan_Id == data[i].ID) {
                tinchi = data[i].TINCHI;
                iThuocTinhLop_Id = edu.util.convertStrToArr(data[i].THUOCTINHLOP_ID);
            }
        }
        main_doc.DangKy.arrThuocTinhLop_Id = iThuocTinhLop_Id;

        //
        main_doc.DangKy.genZone_Step(strKeHoach_Id, strHocPhan_Id, iThuocTinhLop_Id);
        //
        $($iTinChi).html(tinchi);
        $($iThuocTinhLop_Id).html(iThuocTinhLop_Id);
        return iThuocTinhLop_Id;
    },
    /*------------------------------------------
	--Discription: Lop hoc phan dang ky
	-------------------------------------------*/
    getList_LopHocPhan: function (strKeHoach_Id, strHocPhan_Id, iThuocTinhLop_Id) {
        //////////////////////////////////////////////////////////////////////////////
        var key = strKeHoach_Id + strHocPhan_Id + iThuocTinhLop_Id;
        var objCache = edu.system.getCache_LocalStore(main_doc.DangKy.objName.lophocphan, key);
        if (objCache.key == true) {
            //if success then call this function genTable_LopHocPhan()
            main_doc.DangKy.genTable_LopHocPhan(objCache.data);
            return;
        }   
        /////////////////////////////////////////////////////////////////////////////
        var objCache_lophocphan = {};
        var data_lophocphan = [];

        alert("get data from db data: LOPHOCPHAN, key: " + strKeHoach_Id + strHocPhan_Id + iThuocTinhLop_Id);
        var data = [
            //HP1
            {
                "ID": "LHP1-1", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN":"300000","SOTINCHI":"3"
            },
            {
                "ID": "LHP1-2", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học th01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP1-3", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học btl01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Bài tập lớn", "THUOCTINHLOP_ID": "btl",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-1", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-2", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học th02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-3", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học btl02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "btl",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            //HP2
            {
                "ID": "LHP3", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-Y01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp03",
                "SOLUONG_TONG": "30", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP4", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-Y02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp03",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP5", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-K02", "LOPHOCPHAN_TEN": "Kinh tế thị trường 1 lhp02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP6", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-K03", "LOPHOCPHAN_TEN": "Kinh tế thị trường 1 lhp03",
                "SOLUONG_TONG": "30", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            //HP3
            {
                "ID": "LHP7", "HOCPHAN_ID": "HP3", "HOCPHAN_MA": "HP-F01", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp01",
                "SOLUONG_TONG": "50", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "45", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            //HP4
            {
                "ID": "LHP8", "HOCPHAN_ID": "HP4", "HOCPHAN_MA": "HP-F02", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp02",
                "SOLUONG_TONG": "50", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "40", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP9", "HOCPHAN_ID": "HP4", "HOCPHAN_MA": "HP-F03", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp03",
                "SOLUONG_TONG": "30", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "45", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
        ];
        for (var i = 0; i < data.length; i++) {
            if (data[i].HOCPHAN_ID == strHocPhan_Id && data[i].THUOCTINHLOP_ID == iThuocTinhLop_Id) {
                data_lophocphan.push(data[i]); 
            }
        }
        /////////////////////////////////////////////////////////////////////////////
        //set objCache
        objCache_lophocphan.key = strKeHoach_Id + strHocPhan_Id + iThuocTinhLop_Id;
        objCache_lophocphan.data = data_lophocphan;
        main_doc.DangKy.dtLopHocPhan.push(objCache_lophocphan);
        //cache
        edu.system.setCache_LocalStore(main_doc.DangKy.objName.lophocphan, main_doc.DangKy.dtLopHocPhan);
        //if success then call this function genTable_LopHocPhan()
        main_doc.DangKy.genTable_LopHocPhan(objCache_lophocphan.data);
    },
    getDetail_LopHocPhan: function (strId) {
        var me = this;
        var data = "";
        var data_lophocphan = [
            //HP1
            {
                "ID": "LHP1-1", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP1-2", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học th01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP1-3", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học btl01",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Bài tập lớn", "THUOCTINHLOP_ID": "btl",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-1", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-2", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học th02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP2-3", "HOCPHAN_ID": "HP1", "HOCPHAN_MA": "HP-X02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học btl02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "btl",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            //HP2
            {
                "ID": "LHP3", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-Y01", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp03",
                "SOLUONG_TONG": "30", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Trương Giang Long", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP4", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-Y02", "LOPHOCPHAN_TEN": "Chủ nghĩa xã hội và khoa học lhp03",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Thực hành", "THUOCTINHLOP_ID": "th",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP5", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-K02", "LOPHOCPHAN_TEN": "Kinh tế thị trường 1 lhp02",
                "SOLUONG_TONG": "50", "SOLUONG_CONLAI": "40", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            {
                "ID": "LHP6", "HOCPHAN_ID": "HP2", "HOCPHAN_MA": "HP-K03", "LOPHOCPHAN_TEN": "Kinh tế thị trường 1 lhp03",
                "SOLUONG_TONG": "30", "SOLUONG_CONLAI": "45", "LOPHOCPHAN_LOAI": "Lý thuyết", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Hoàng Minh Duy", "SOTIEN": "200000", "SOTINCHI": "2"
            },
            //HP3
            {
                "ID": "LHP7", "HOCPHAN_ID": "HP3", "HOCPHAN_MA": "HP-F01", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp01",
                "SOLUONG_TONG": "50", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "45", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            //HP4
            {
                "ID": "LHP8", "HOCPHAN_ID": "HP4", "HOCPHAN_MA": "HP-F02", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp02",
                "SOLUONG_TONG": "50", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "40", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
            {
                "ID": "LHP9", "HOCPHAN_ID": "HP4", "HOCPHAN_MA": "HP-F03", "LOPHOCPHAN_TEN": "Lịch sử nhân loại và nguồn gốc loài người lhp03",
                "SOLUONG_TONG": "30", "LOPHOCPHAN_LOAI": "Lý thuyết", "SOLUONG_CONLAI": "45", "THUOCTINHLOP_ID": "lt",
                "THOIGIAN": "15/02/2018 - 20/06/2018", "GIANGVIEN": "Tạ Anh Chung", "SOTIEN": "300000", "SOTINCHI": "3"
            },
        ];
        for (var i = 0; i < data_lophocphan.length; i++) {
            //lophocphan_id
            if (data_lophocphan[i].ID == strId) {
                data = data_lophocphan[i];
                //save into KetQuaDangKy
                me.save_KetQuaDangKy(data);
            }
        }
        
        return data;
    },
    /*------------------------------------------
	--Discription: KetQuaDangKy
	-------------------------------------------*/
    getList_KetQuaDangKy: function () {
        var me = this;
        var key = '';
        var objCache = edu.system.getCache_LocalStore(me.objName.ketquadangky, key);
        if (objCache.key == true) {
            //if success then call this function genTable_LopHocPhan()
            me.genTable_KetQuaDangKy(objCache.data);
        }

    },
    save_KetQuaDangKy: function (data) {
        var me = this;
        var data_table = {
            "ID": "", "HOCPHAN_MA": "", "HOCPHAN_ID": "", "LOPHOCPHAN_ID": "", "LOPHOCPHAN_TEN": "", "LOPHOCPHAN_LOAI": "",
            "THOIGIAN": "", "LICHTUAN": "", "SOTINCHI": "", "SOTIEN": "", "GIANGVIEN_TEN": "", "GIANGIVEN_MA": ""
        };
        //pair to copy data
        data_table.ID               = "xyz";
        data_table.HOCPHAN_MA       = data.HOCPHAN_MA;
        data_table.HOCPHAN_ID       = data.HOCPHAN_ID;
        data_table.LOPHOCPHAN_ID    = data.ID;
        data_table.LOPHOCPHAN_TEN   = data.LOPHOCPHAN_TEN;
        data_table.LOPHOCPHAN_LOAI  = data.LOPHOCPHAN_LOAI;
        data_table.THOIGIAN         = data.THOIGIAN;
        data_table.LICHTUAN         = data.LICHTUAN;
        data_table.SOTINCHI         = data.SOTINCHI;
        data_table.SOTIEN           = data.SOTIEN;
        data_table.GIANGVIEN_TEN    = data.GIANGVIEN;
        data_table.GIANGIVEN_MA     = "";

        me.dtKetQuaDK.push(data_table);
        //call to db to save (tem into cache)
    },
    delete_KetQuaDangKy: function () {
        var data = [
            {
                "ID": "", "MONHOC_MA": "", "MONHOC_TEN": "", "LOPHOCPHAN_MA": "", "LOPHOCPHAN_TEN": "",
                "THOIGIAN": "", "LICHTUAN": "", "SOTINCHI": "", "SOTIEN": "", "GIANGVIEN_TEN": "", "GIANGIVEN_MA": ""
            }
        ];

    },
    /*------------------------------------------
	--Discription: NguyenVong
	-------------------------------------------*/
    getList_NguyenVong: function () {

    },
    /*------------------------------------------
	--Discription: Gen content of Step
	-------------------------------------------*/
    genZone_Step: function (strKeHoach_Id, strHocPhan_Id, iThuocTinhLop_Id) {
        var html = '';
        var $dkh_action = "#dkh_action";
        var $dkh_step = "#dkh_step";
        var $step_select = '#step_select';
        var action_save = '';
        var action_step = '';
        $($dkh_step).html('');
        $($dkh_action).html('');
        if (iThuocTinhLop_Id.length > 1) {
            for (var i = 0; i < iThuocTinhLop_Id.length; i++) {
                action_step += main_doc.DangKy.gen_Step(iThuocTinhLop_Id[i], i);
            }
        }
        else {
            action_step += main_doc.DangKy.gen_Step(iThuocTinhLop_Id[0], 0);
        }
        action_save = main_doc.DangKy.genAction_Save();
        $($dkh_step).html(action_step);
        $($dkh_action).html(action_save);
        //action
        $(document).delegate(".step_tab", "click", function () {
            var step_id = this.id;
            step_id = edu.util.cutPrefixId(/step/g, step_id);
            main_doc.DangKy.activeStep = step_id;
            main_doc.DangKy.changeBtnSelect_Step(main_doc.DangKy.activeStep);
            main_doc.DangKy.addEffect_Step(main_doc.DangKy.activeStep);
            main_doc.DangKy.getList_LopHocPhan(main_doc.DangKy.strKeHoach_Id, main_doc.DangKy.strHocPhan_Id, main_doc.DangKy.activeStep);
        });
        $("#btnSelect_DKH").click(function () {
            if (!edu.util.checkValue(main_doc.DangKy.temSelect.id)) {
                edu.system.alert("Vui lòng lựa chọn lớp học phần!");
                return false;
            }
            else {
                //1. add to objDangKy
                main_doc.DangKy.addToCart_DangKy(main_doc.DangKy.temSelect.id);
                //2. change background and color of step
                main_doc.DangKy.changeBackground_Step(main_doc.DangKy.activeStep, "bg-green");
                main_doc.DangKy.changeColor_Step(main_doc.DangKy.activeStep, "color-active");
                //3. change name of step
                main_doc.DangKy.changeName_Step(main_doc.DangKy.activeStep, main_doc.DangKy.temSelect.name);
                //4. remove effect of step
                main_doc.DangKy.removeEffect_Step(main_doc.DangKy.activeStep);
                //5. change ActiveStep and goNext_Step()
                main_doc.DangKy.activeStep = main_doc.DangKy.goNext_Step(main_doc.DangKy.arrStep, main_doc.DangKy.activeStep);
                //6. getList_LopHocPhan(strKeHoach, strHocPhan_Id, strThuocTinhLop_Id)
                main_doc.DangKy.getList_LopHocPhan(main_doc.DangKy.strKeHoach_Id, main_doc.DangKy.strHocPhan_Id, main_doc.DangKy.activeStep);
            }
            //reset temSlect
            main_doc.DangKy.temSelect = { id: '', name: '' };
        });
        $("#btnSave_DKH").click(function () {
            if (main_doc.DangKy.objDangKy.id.length == main_doc.DangKy.arrStep.length) {
                edu.system.alert("Chọn môn học thành công: " + main_doc.DangKy.objDangKy.id);
                for (var i = 0; i < main_doc.DangKy.objDangKy.id.length; i++) {
                    main_doc.DangKy.getDetail_LopHocPhan(main_doc.DangKy.objDangKy.id[i]);
                }
            }
            else {
                edu.system.alert("Vui lòng chọn đầy đủ thông tin lớp học phần!");
            }
        });
    },
    gen_Step: function (id, index) {
        //logic     : bg-red doesnt select, bg-yellow is selecting, bg-green is selected
        //default   : active selecting the first
        var me = this;
        var html = '';
        var bg = 'bg-red';
        var color = 'color-default';
        var btn = '';
        var effect = '';
        if (index == 0) {
            bg = 'bg-yellow';
            color = 'color-warning';
            btn = main_doc.DangKy.genAction_Select();
            effect = '<i class="fa fa-spin fa-ellipsis-h"></i>';
            me.activeStep = id;
        }
        html += '<p id="step' + id + '" class="step_tab" style="float:left">';
        html += '<a href="#" id="step_color' + id + '" class="' + color + '">';
        html += '<span id="step_bg' + id + '" class="badge ' + bg + '">' + (index + 1) + '</span>';
        html += ' Lớp <span id="step_title' + id + '"></span> : ';
        html += '<span id="step_name' + id + '">' + id + '</span>';
        html += '<span id="step_effect' + id + '">' + effect + '</span>';
        html += '<span id="step_select' + id + '">' + btn + '</span>';
        html += '</a>';
        html += '</p>';
        me.arrStep.push(id);
        return html;
    },
    genAction_Select: function () {
        var html = '';
        html += '<button type="button" class="badge bg-yellow btn-xs" id="btnSelect_DKH"><i class="fa fa-check"></i> Chọn</button>';
        return html;
    },
    genAction_Save: function () {
        var html = '';
        html += '<button type="button" class="badge bg-green btn-xs" id="btnSave_DKH"><i class="fa fa-check"></i> Lưu</button>';
        return html;
    },
    /*------------------------------------------
    --Discription: Change content of Step
    -------------------------------------------*/
    changeBackground_Step: function (active, color) {
        var me = this;
        var $step_bg = "#step_bg" + active;
        $($step_bg).addClass(color);
    },
    changeColor_Step: function (active, color) {
        var me = this;
        var $step_color = "#step_color" + active;
        $($step_color).removeClass();
        $($step_color).addClass(color);
    },
    changeName_Step: function (active, name) {
        var me = this;
        var $step_name = "#step_name" + active;
        $($step_name).html(" " + name);
    },
    removeEffect_Step: function (active) {
        //hieu ung quay quay cho select lophocphan
        var me = this;
        var $hieuung = "#step_effect" + active;
        $($hieuung).html('');
    },
    addEffect_Step: function (active) {
        //hieu ung quay quay cho select lophocphan
        var me = this;
        var $hieuung = "#step_effect" + active;
        var html = '';
        html += '<i class="fa fa-spin fa-ellipsis-h"></i>';
        $($hieuung).html(html);
    },
    changeBtnSelect_Step: function (active, befor) {//move btnSelect to a next step
        var me = this;
        var $step_select = '#step_select';
        var $btnSelect = '#btnSelect_DKH';
        var $active = $step_select + active;
        $($btnSelect).appendTo($active);
    },
    goNext_Step: function (arrStep, currentActive) {
        var me = this;
        var index = edu.util.arrGetIndex(arrStep, currentActive);
        me.removeEffect_Step(currentActive);
        if ((index + 1) >= arrStep.length) {//out of array --> stop
            return false;
        }
        else {
            var activeNext = arrStep[index + 1];
            me.changeBackground_Step(activeNext, "bg-yellow");
            me.changeColor_Step(activeNext, "color-warning");
            me.changeBtnSelect_Step(activeNext);
            return activeNext;
        }
        
    },
    /*------------------------------------------
	--Discription: Shopping Cart (gio hang dang ky hoc)
	-------------------------------------------*/
    addToCart_DangKy: function(id){
        var me = this;
        //check id exit in arr befor ?, if exitance --> update, if not --> add new
        //index: [], id: []
        console.log("me.activeStep: " + me.activeStep);
        if (edu.util.arrCheckExist(me.objDangKy.index, me.activeStep)) {//update item in arr
            var index = edu.util.arrGetIndex(me.objDangKy.index, me.activeStep);
            edu.util.arrUpdateVale(me.objDangKy.id, index, id);
        }
        else {//add new item in arr
            me.objDangKy.id.push(id);
            me.objDangKy.index.push(me.activeStep);
        }
        console.log("me.objDangKy: " + JSON.stringify(me.objDangKy));
    },
    removeFromCart_DangKy:function(){
        var me = this;

    },
    /*------------------------------------------
	--Discription: Gen html
	-------------------------------------------*/

    /*------------------------------------------
	--Discription: Gen data
	-------------------------------------------*/
    loadToCombo_KeHoachDangKy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoach_Search"],
            type: "",
            title: "Chọn kế hoạch tổ chức đăng ký",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHocPhan_Search"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_LopHocPhan: function (data) {
        var me = this;
        $("#tab1_total").html(data.length);
        var jsonForm = {
            strTable_Id: "tblDangKy",
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 0,
            },
            sort: true,
            colPos: {
                left: [4, 5, 7, 8],
                center: [1, 2, 3, 6],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '<input type="radio" name="rdLop_' + aData.ID + '" id="rdMon_' + aData.ID + '" class="select_lhp" />';
                        return html;
                    }
                }, {
                    "mDataProp": "HOCPHAN_MA"
                }, {
                    "mRender": function (nRow, aData) {//lophocphan_ten 
                        var strTinhTrang = edu.util.returnEmpty(aData.SOLUONG_TONG) + "/" + edu.util.returnEmpty(aData.SOLUONG_CONLAI);
                        return '<span>' + strTinhTrang + '</span>';
                    }
                }, {
                    "mDataProp": "LOPHOCPHAN_LOAI"
                }, {
                    "mRender": function (nRow, aData) {//lophocphan_ten  
                        var strLopHocPhan_Ten = aData.LOPHOCPHAN_TEN;
                        return '<span id="lophocphan_ten' + aData.ID + '">' + strLopHocPhan_Ten + '</span>';
                    }
                }, {
                    "mDataProp": "THOIGIAN"
                }, {
                    "mRender": function (nRow, aData) {
                        var lichtuan = LichTuan();
                        return lichtuan;
                    }
                },
                {
                    "mDataProp": "GIANGVIEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        function LichTuan() {
            var html = '';
            html += '<span class="lang" key="">';
            html += '<a class="color-active poiter detail">1</a>';
            html += '<a class="color-active poiter detail">2</a>';
            html += '<a class="color-active poiter detail">3</a>';
            html += '<a class="color-active poiter detail">4</a>';
            html += '<a class="color-active poiter detail">5</a>';
            html += '<a class="color-active poiter detail">6</a>';
            html += '<a class="color-active poiter detail">-</a>';
            html += '<a class="color-active poiter detail">8</a>';
            html += '<a class="color-active poiter detail">9</a>';
            html += '<a class="color-active poiter detail">10</a>';
            html += '<a class="color-active poiter detail">-</a>';
            html += '<a class="color-active poiter detail">-</a>';
            html += '<a class="color-active poiter detail">13</a>';
            html += '<a class="color-active poiter detail">14</a>';
            html += '<a class="color-active poiter detail">15</a>';
            html += '<a class="color-active poiter detail">16</a>';
            html += '<a class="color-active poiter detail">17</a>';
            html += '</span>';
            return html;
        }
    },
    genTable_KetQuaDangKy: function (data) {
        var me = this;
        var dataRoot    = data;
        var dataUnique  = [];
        var count = 0;
        //1. get items are not same value in array <==> get only unique 
        for (var i = 0; i < dataRoot.length; i++) {
            count = 0;
            for (var j = i + 1; j < dataRoot.length; j++) {
                if (dataRoot[i].HOCPHAN_MA == dataRoot[j].HOCPHAN_MA) {
                    count++;
                }
            }
            if (count == 0) {
                dataUnique.push(dataRoot[i].HOCPHAN_MA);
            }
        }
        console.log("dataUnique: " + dataUnique);
        //2. gen table
        $("#tblKetQuaDangKy tbody").html("");
        var stt = 0;
        var rowspan = 0;
        var html_row = '';
        var html_row_span = '';
        var html_table = '';

        var strHocPhan_Id = '';
        var strHocPhan_Ma = '';
        var strLopHocPhan_Ten = '';
        var strLopHocPhan_Loai = '';
        var strThoiGian = '';
        var strLichTuan = '';
        var strGiangVien = '';
        var iSoTien = 0;
        var iSoTinChi = 0;

        var strLopHocPhan_Ten_p = "";
        var strLopHocPhan_Loai_p = "";
        var strThoiGian_p = "";
        var strLichTuan_p = "";
        var strGiangVien_p = "";
        
        for (var k = 0; k < dataUnique.length; k++) {
            stt++;
            for (var h = 0; h < dataRoot.length; h++) {
                if (dataRoot[h].HOCPHAN_MA == dataUnique[k]) {
                    rowspan++;
                    
                    if (rowspan == 1) {
                        //common param for row
                        strHocPhan_Id = dataRoot[h].ID;
                        strHocPhan_Ma = edu.util.returnEmpty(dataRoot[h].HOCPHAN_MA);
                        iSoTien = edu.util.returnZero(dataRoot[h].SOTIEN);
                        //each param for row
                        strLopHocPhan_Ten_p = edu.util.returnEmpty(dataRoot[h].LOPHOCPHAN_TEN);
                        strLopHocPhan_Loai_p = edu.util.returnEmpty(dataRoot[h].LOPHOCPHAN_LOAI);
                        strThoiGian_p = edu.util.returnEmpty(dataRoot[h].THOIGIAN);
                        strLichTuan_p = '';
                        strGiangVien_p = edu.util.returnEmpty(dataRoot[h].GIANGVIEN_TEN);
                        iSoTinChi = edu.util.returnZero(dataRoot[h].SOTINCHI);

                    }
                    if (rowspan > 1) {
                        strLopHocPhan_Ten = edu.util.returnEmpty(dataRoot[h].LOPHOCPHAN_TEN);
                        strLopHocPhan_Loai = edu.util.returnEmpty(dataRoot[h].LOPHOCPHAN_LOAI);
                        strThoiGian = edu.util.returnEmpty(dataRoot[h].THOIGIAN);
                        strLichTuan = '';
                        strGiangVien = edu.util.returnEmpty(dataRoot[h].GIANGVIEN_TEN);
                        html_row_span += '<tr>';
                        html_row_span += '<td class="td-left"><span class="lang" key="">' + strLopHocPhan_Ten + '</span></td>';
                        html_row_span += '<td class="td-left"><span class="lang" key="">' + strLopHocPhan_Loai + '</span></td>';
                        html_row_span += '<td class="td-center"><span class="lang" key="">' + strThoiGian + '</span></td>';
                        html_row_span += '<td class="td-left">' + strLichTuan + '</td>';
                        html_row_span += '<td class="td-left"><span class="lang" key="">' + strGiangVien + '</span></td>';
                        html_row_span += '</tr>';
                    }
                    
                }
                //end if check
            }
            //end for h
            html_row += '<tr>';
            html_row += '<td class="td-center" rowspan="' + rowspan + '">' + stt + '</td>';
            html_row += '<td class="td-left" rowspan="' + rowspan + '"><span class="lang" key="">' + strHocPhan_Ma + '</td>';
            html_row += '<td class="td-left"><span class="lang" key="">' + strLopHocPhan_Ten_p + '</span></td>';
            html_row += '<td class="td-left"><span class="lang" key="">' + strLopHocPhan_Loai_p + '</span></td>';
            html_row += '<td class="td-center"><span class="lang" key="">' + strThoiGian_p + '</span></td>';
            html_row += '<td class="td-left">' + strLichTuan_p + '</td>';
            html_row += '<td class="td-left"><span class="lang" key="">' + strGiangVien_p + '</span></td>';
            html_row += '<td class="td-right bold" rowspan="' + rowspan + '"><span class="lang" key="">' + edu.util.formatCurrency(iSoTien) + '</span></td>';
            html_row += '<td class="td-center" rowspan="' + rowspan + '"><span class="lang" key=""><a href="#">Hủy</a></span></td>';
            html_row += '</tr>';

            html_table += (html_row + html_row_span);
            me.sum_SoTinChiDangKy(iSoTinChi);
            me.sum_SoTienDangKy(iSoTien);
            //reset variable
            html_row = "";
            html_row_span = "";
            rowspan = 0;
        }
        $("#tblKetQuaDangKy tbody").append(html_table);
        html_table = "";
    },
    sum_SoTinChiDangKy: function (iSoTinChi) {
        var me = this;
        $("#dkh_lblTongSoTinChi").html('');
        me.iTongSoTinChiDK += parseInt(iSoTinChi);
        $("#tab2_total").html(me.iTongSoTinChiDK);
        $("#dkh_lblTongSoTinChi").html(me.iTongSoTinChiDK);
    },
    sum_SoTienDangKy: function (dSoTien) {
        var me = this;
        $("#dkh_lblTongSoTien").html('');
        me.dTongSoTienDangKy += parseFloat(dSoTien);
        $("#dkh_lblTongSoTien").html(edu.util.formatCurrency(me.dTongSoTienDangKy));
        $("#dkh_lblTongSoTien_footer").html(edu.util.formatCurrency(me.dTongSoTienDangKy));
    },
}