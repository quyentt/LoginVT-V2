function phanconggiangday() { };
phanconggiangday.prototype = {
   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpHocKy').on('select2:select', function () {
            me.getList_drpDotHoc(); 
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
       

        $('#drpSchoolYear').on('select2:select', function () {
            me.getList_drpDotHoc();
            me.getList_drpBoMon();
            me.getList_drpBoMon_All();
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.getList_drpAcademicyear();
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
        $('#drpBoMon').on('select2:select', function () {
            me.getList_drpGiangVien();
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
            
        });
        $('#drpGiangVien').on('select2:select', function () {
           
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();

        });
        
        $('#btnSearch').click(  function () {
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
        $('#drpDotHoc').on('select2:select', function () { 
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
        $('#drpAcademicyear').on('select2:select', function () {
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
        $('#drpCoSoDaoTao').on('select2:select', function () {
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        });
        

        $("[id$=chkSelectAll_DaPhanCong]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaPhanCong" });
        });
        $("[id$=chkSelectAll_ChuaPhanCong]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuaPhanCong" });
        });
        $("#btnShowPhanCong").click(function () {
            var me = this;       
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaPhanCong", "checkX");
            if (edu.util.getValById('drpSchoolYear') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần phân công?");
                return;
            } 
            $("#modalPhanChoBoMonKhac").modal('show');
        });
        $("#btnToanBoPhanCong").click(function () {
          
            if (edu.util.getValById('drpSchoolYear') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            if (edu.util.getValById('drpBoMon') == "") {
                edu.system.alert("Bạn chưa chọn bộ môn");
                return;
            }
            me.getList_tblToanBoPhanCong();
            $("#modalToanBoPhanCong").modal('show');
            
        });
        $('#drpBoMon_All').on('select2:select', function () { 
            me.getList_drpGiangVien_All();
            me.getList_tblDaPhanCongBoMonKhac();
           
        });
        $('#btnPhanCong').click(function () {
             
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần phân công?");
                return;
            }
            if (edu.util.getValById('drpGiangVien') == '') {
                edu.system.alert("Bạn chưa chọn giảng viên cần phân công ?");
                return;
            }
            var strThoiKhoaBieuId = "";
            
            edu.system.confirm("Bạn có chắc chắn phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strThoiKhoaBieuId += arrChecked_Id[i] + ",";
                }
                strThoiKhoaBieuId = strThoiKhoaBieuId.substr(0, strThoiKhoaBieuId.length - 1);
                var strStaffId = edu.util.getValById('drpGiangVien');
                me.ThucHienPhanGiang(strThoiKhoaBieuId, strStaffId);
            });
           
             
        });
        $('#btnPhanCong_BoMonKhac').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Bạn chưa chọn lớp cần phân công?");
                return;
            }
            if (edu.util.getValById('drpGiangVien_All') == '') {
                edu.system.alert("Bạn chưa chọn giảng viên cần phân công ?");
                return;
            }
            var strThoiKhoaBieuId = "";

            edu.system.confirm("Bạn có chắc chắn phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html(''); 
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strThoiKhoaBieuId += arrChecked_Id[i] + ",";
                }
                strThoiKhoaBieuId = strThoiKhoaBieuId.substr(0, strThoiKhoaBieuId.length - 1);
                var strStaffId = edu.util.getValById('drpGiangVien_All');
                me.ThucHienPhanGiang(strThoiKhoaBieuId, strStaffId);
            });

        });
        $('#btnXoaPhanCong').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần xóa phân công?");
                return;
            }
            
            var PhanCongTinChiId = "";

            edu.system.confirm("Bạn có chắc chắn xóa phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    PhanCongTinChiId += arrChecked_Id[i] + ",";
                }
                PhanCongTinChiId = PhanCongTinChiId.substr(0, PhanCongTinChiId.length - 1);
              
                me.DeletePhanCongGiangDay(PhanCongTinChiId);
                setTimeout(function () {
                    me.getList_tblDaPhanCong();
                    me.getList_tblChuaPhanCong();
                    me.getList_tblDaPhanCongBoMonKhac();
                }, 2000);
            });
            

        });
        $('#drpGiangVien_All').on('select2:select', function () {
            me.getList_tblDaPhanCongBoMonKhac();
        });
        $('#btnXoaPhanCong_BoMonKhac').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaPhanCongBoMonKhac", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần xóa phân công?");
                return;
            }

            var PhanCongTinChiId = "";

            edu.system.confirm("Bạn có chắc chắn xóa phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    PhanCongTinChiId += arrChecked_Id[i] + ",";
                }
                PhanCongTinChiId = PhanCongTinChiId.substr(0, PhanCongTinChiId.length - 1);

                me.DeletePhanCongGiangDay(PhanCongTinChiId);
                setTimeout(function () {
                    me.getList_tblDaPhanCong();
                    me.getList_tblChuaPhanCong();
                    me.getList_tblDaPhanCongBoMonKhac();
                }, 2000);
            });
          

        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();
        me.getList_drpDotHoc();
        me.getList_drpHeDaoTao();
        me.getList_drpAcademicyear();         
        me.getList_drpCoSoDaoTao();
        me.getList_drpBoMon();
        me.getList_drpGiangVien();

    },
    getList_SchoolYear: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'TKGG_KLGD/GetcboSchoolYear',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genList_SchoolYear(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_SchoolYear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NIENHOC",
                parentId: "",
                name: "NIENHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpSchoolYear"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotHoc: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetDotHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHocKy': strHocKy,
        };
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                    me.genList_drpDotHoc(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDotHoc: function (data) {
       
        var obj = {
            data: data,
            renderInfor: {
                id: "DOT",
                parentId: "",
                name: "DOT",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotHoc"],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpHeDaoTao: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetTRAININGSYSTEMList',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHeDaoTao(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpHeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpAcademicyear: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetAcademicYearByFormOfEdu',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'EducationSystemId': edu.util.getValById('drpHeDaoTao'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                    me.genList_drpAcademicyear(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpAcademicyear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpAcademicyear"],
            type: "",
            title: "Chọn khóa"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpCoSoDaoTao: function () {
        var me = this;
        

        var obj_list = {
            'action': 'TKGG_KLGD/GetListCSDT',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };
     


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                    me.genList_drpCoSoDaoTao(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpCoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpCoSoDaoTao"],
            type: "",
            title: "Chọn CSĐT"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpBoMon: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetBoMonDuocPhanCong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length >0 )
                    me.genList_drpBoMon(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpBoMon: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpGiangVien: function () {
        var me = this;
        

        var obj_list = {
            'action': 'TKGG_KLGD/GetListStaff',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNhomMonHocId': edu.util.getValById('drpBoMon'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                    me.genList_drpGiangVien(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpGiangVien: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NHANVIENID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblDaPhanCong: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/GetDanhSachPhanCong',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strStaffId': edu.util.getValById('drpGiangVien'),            
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'), 
            'strNguoiDung_Id': edu.system.userId,
             
        };
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genTable_tblDaPhanCong(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblDaPhanCong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDaPhanCong",
            aaData: data,
           
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DVHT"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "DOTHOC"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                }, 
                {
                    "mDataProp": "TONGTIETPHANBO"
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "MACONGCHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.PHANCONGTINCHIID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_drpBoMon_All: function () {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetToanBoBoMon',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear') ,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpBoMon_All(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpBoMon_All: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon_All"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpBoMon_All").select2({//Search on modal
            dropdownParent: $('#modalPhanChoBoMonKhac .modal-content')
        });
    },
    getList_drpGiangVien_All: function () {
        var me = this; 
        var obj_list = {
            'action': 'TKGG_KLGD/GetListStaff',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNhomMonHocId': edu.util.getValById('drpBoMon_All'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpGiangVien_All(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpGiangVien_All: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NHANVIENID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien_All"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpGiangVien_All").select2({//Search on modal
            dropdownParent: $('#modalPhanChoBoMonKhac .modal-content')
        });
    },
    getList_tblChuaPhanCong: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/GetDanhSachLopHocPhan',
            'versionAPI': 'v1.0',
            'strHocKy': strHocKy,
            'strBoMonId': edu.util.getValById('drpBoMon'),  
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'),
            'strNguoiDung_Id': edu.system.userId,

        }; 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genTable_tblChuaPhanCong(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblChuaPhanCong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        var jsonForm = {
            strTable_Id: "tblChuaPhanCong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TENLOP;
                        if (aData.DATACH > 0)
                            strReturn += '<span style="color:red;"> Đã tách</span>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "DVHT"
                } ,
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETPHANBO"
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        return '<input type="checkbox" id="checkX' + aData.IDTHOIKHOABIEU + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienPhanGiang: function (strThoiKhoaBieuId, strStaffId) {
        var me = this;       
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/PhanCongGiangDay',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId,
            'strNamHoc': edu.util.getValById('drpSchoolYear') ,
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc') ,
            'strThoiKhoaBieuId': strThoiKhoaBieuId, 
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công"); 
                        me.getList_tblDaPhanCong();
                        me.getList_tblChuaPhanCong();
                        me.getList_tblDaPhanCongBoMonKhac(); 
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    DeletePhanCongGiangDay: function (PhanCongTinChiId) {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/DeletePhanCongGiangDay',
            'versionAPI': 'v1.0',
             
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strPhanCongTinChiId': PhanCongTinChiId,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                     
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

        me.getList_tblDaPhanCong();
        me.getList_tblChuaPhanCong();
        me.getList_tblDaPhanCongBoMonKhac(); 
    },
    getList_tblDaPhanCongBoMonKhac: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/GetDanhSachPhanCongBMKhac',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon_All'),
            'strStaffId': edu.util.getValById('drpGiangVien_All'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'),
            'strBoMonGocId': edu.util.getValById('drpBoMon'),
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblDaPhanCongBoMonKhac(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblDaPhanCongBoMonKhac: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblDaPhanCongBoMonKhac",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DVHT"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETPHANBO"
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "MACONGCHUC"
                },
                {
                    "mRender": function (nRow, aData) {

                        return '<input type="checkbox" id="checkX' + aData.PHANCONGTINCHIID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_tblToanBoPhanCong: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/GetDanhSachCacMonHocDaPCCuaBM',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strStaffId': edu.util.getValById('drpGiangVien'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'),
            'strNguoiDung_Id': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblToanBoPhanCong(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblToanBoPhanCong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblToanBoPhanCong",
            aaData: data,

            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "MAHEDAOTAO"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DVHT"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "DOTHOC"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETPHANBO"
                } ,
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {

                    "mRender": function (nRow, aData) {
                        var strReturn = "<span>" + edu.util.returnEmpty(aData.HOTEN) + "</span>";
                        if (edu.util.returnEmpty(aData.HOTEN) == '' && aData.DATACH > 0)
                            strReturn = "<span style='color:red'> Đã tách</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "MACONGCHUC"
                },
                {
                    "mDataProp": "BOMON"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}

