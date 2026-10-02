function qlklgd_phanconggiangday() { };
qlklgd_phanconggiangday.prototype = {
    dtKhoiLuongThoiKhoaBieu: [],
    dtKhoiLuongThoiKhoaBieuBoMonKhac: [],
   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpHocKy').on('select2:select', function () {
            me.getList_drpDotHoc(); 
            me.getList_tblDaPhanCong();
            me.getList_tblChuaPhanCong();
            me.getList_tblDaPhanCongBoMonKhac();
        }); 
        $('#drpNamHoc').on('select2:select', function () {
            me.getList_drpHocKy();
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
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
             
            $("#modalPhanChoBoMonKhac").modal('show');
        });
        $("#btnToanBoPhanCong").click(function () {
          
            if (edu.util.getValById('drpNamHoc') == "") {
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
             
            
            edu.system.confirm("Bạn có chắc chắn phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strLopHocPhanIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strLopHocPhanIds += arrChecked_Id[i] + ",";
                }
                strLopHocPhanIds = strLopHocPhanIds.substr(0, strLopHocPhanIds.length - 1);
                var strStaffId = edu.util.getValById('drpGiangVien');
                me.ThucHienPhanGiang(strLopHocPhanIds, strStaffId);
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
            
            var strKHOILUONGTHOIKHOABIEUID = "";
            var strNamHoc = "";
            var strHocKy = "";
            var strDotHocId = "";
            var strLopHocPhanId = "";
            var strStaffId = "";
            var strGa = "";

            edu.system.confirm("Bạn có chắc chắn xóa phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var dt;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strKHOILUONGTHOIKHOABIEUID += arrChecked_Id[i] + ",";
                    dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtKhoiLuongThoiKhoaBieu, "KHOILUONGTHOIKHOABIEUID");
                    
                    strLopHocPhanId += dt[0].IDLOPHOCPHAN + ",";
                    strNamHoc += dt[0].NAMHOC + ",";
                    strHocKy += dt[0].HOCKYFULL + ",";
                    strDotHocId += dt[0].DAOTAO_THOIGIANDAOTAO_ID + ",";
                    strStaffId += dt[0].STAFFID + ","; 
                    
                }
                strKHOILUONGTHOIKHOABIEUID = strKHOILUONGTHOIKHOABIEUID.substr(0, strKHOILUONGTHOIKHOABIEUID.length - 1);
                strNamHoc = strNamHoc.substr(0, strNamHoc.length - 1);
                strHocKy = strHocKy.substr(0, strHocKy.length - 1);
                strDotHocId = strDotHocId.substr(0, strDotHocId.length - 1);
                strLopHocPhanId = strLopHocPhanId.substr(0, strLopHocPhanId.length - 1);
                strStaffId = strStaffId.substr(0, strStaffId.length - 1);
                
              
                me.DeletePhanCongGiangDay(strKHOILUONGTHOIKHOABIEUID, strNamHoc, strHocKy, strDotHocId, strLopHocPhanId, strStaffId  );
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

            var strKHOILUONGTHOIKHOABIEUID = "";
            var strNamHoc = "";
            var strHocKy = "";
            var strDotHocId = "";
            var strLopHocPhanId = "";
            var strStaffId = "";
            var strGa = "";

            edu.system.confirm("Bạn có chắc chắn xóa phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var dt;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strKHOILUONGTHOIKHOABIEUID += arrChecked_Id[i] + ",";
                    dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtKhoiLuongThoiKhoaBieuBoMonKhac, "KHOILUONGTHOIKHOABIEUID");

                    strLopHocPhanId += dt[0].IDLOPHOCPHAN + ",";
                    strNamHoc += dt[0].NAMHOC + ",";
                    strHocKy += dt[0].HOCKYFULL + ",";
                    strDotHocId += dt[0].DAOTAO_THOIGIANDAOTAO_ID + ",";
                    strStaffId += dt[0].STAFFID + ",";

                }
                strKHOILUONGTHOIKHOABIEUID = strKHOILUONGTHOIKHOABIEUID.substr(0, strKHOILUONGTHOIKHOABIEUID.length - 1);
                strNamHoc = strNamHoc.substr(0, strNamHoc.length - 1);
                strHocKy = strHocKy.substr(0, strHocKy.length - 1);
                strDotHocId = strDotHocId.substr(0, strDotHocId.length - 1);
                strLopHocPhanId = strLopHocPhanId.substr(0, strLopHocPhanId.length - 1);
                strStaffId = strStaffId.substr(0, strStaffId.length - 1);


                me.DeletePhanCongGiangDay(strKHOILUONGTHOIKHOABIEUID, strNamHoc, strHocKy, strDotHocId, strLopHocPhanId, strStaffId);
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
        me.getList_NamHoc();        
        me.getList_drpHeDaoTao();
        me.getList_drpAcademicyear();         
        me.getList_drpCoSoDaoTao();
        me.getList_drpBoMon();
        me.getList_drpGiangVien();

    },
    getList_NamHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strLoaiThoiGian': 'NAMHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_NamHoc(data.Data);

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
    genList_NamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMHOC",
                parentId: "",
                name: "NAMHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNamHoc"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpHocKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpNamHoc'),
            'strLoaiThoiGian': 'HOCKY',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHocKy(data.Data);
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
    genList_drpHocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "HOCKY",
                parentId: "",
                name: "HOCKY",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy"],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpHocKy'),
            'strLoaiThoiGian': 'DOTHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,

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
                id: "ID",
                parentId: "",
                name: "DOTHOC",
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
          
        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_HeDaoTao',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
            
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
        var strHocKy = edu.util.getValById('drpNamHoc') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_KhoaHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
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
            'action': 'TKGG_QLKLGD/ListDS_CoSoDaoTao',
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
                name: "MA",
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
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNamHoc': edu.util.getValById('drpNamHoc'), 
            'strNguoiDungId': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
            
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
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',
            'strNhomMonHocId': edu.util.getValById('drpBoMon'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length>0)
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
                id: "STAFFID",
                parentId: "",
                name: "HOTENMASO",
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
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachPhanCong',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strStaffId': edu.util.getValById('drpGiangVien'),            
            'strHocKy': edu.util.getValById('drpHocKy'), 
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'), 
            'strNguoiThucHienId': edu.system.userId,
             
        };
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.dtKhoiLuongThoiKhoaBieu = data.Data;
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
                    
                    "mRender": function (nRow, aData) {
                        var strReturn = "<span style='color: red;'>" + aData.TENKHOA + "_" + aData.MAHOCPHAN + "_</span>" + aData.TENLOP;
                        if (aData.LALOPTACH > 1)
                            strReturn += "<span style='color: red;'>_Lớp tách</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOCTRINH"
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
                    "mDataProp": "TONGTIETCTDT"
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mDataProp": "HOTENMASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
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
            'action': 'TKGG_QLKLGD/GetNhomMonHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpNamHoc') ,
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
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',       
            'strNhomMonHocId': edu.util.getValById('drpBoMon_All'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId, 
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
                id: "STAFFID",
                parentId: "",
                name: "HOTENMASO",
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
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachChuaPhanCong',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strNguoiThucHienId': edu.system.userId,

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
                        return "<span style='color: red;'>" + aData.TENKHOA + "_" + aData.MAHOCPHAN + "_</span>" + aData.TENLOP;
                    }
                },
                {
                    "mDataProp": "HOCTRINH"
                } ,
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETCTDT"
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        return '<input type="checkbox" id="checkX' + aData.IDLOPHOCPHAN + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienPhanGiang: function (strLopHocPhanIds, strStaffId) {
        var me = this;       
        var obj_list = {
            'action': 'TKGG_QLKLGD/PhanCongGiangDay',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId,
            'strNamHoc': edu.util.getValById('drpNamHoc') ,
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc') ,
            'strLopHocPhanIds': strLopHocPhanIds, 
            'strNguoiThucHienId': edu.system.userId,
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
    DeletePhanCongGiangDay: function (strKHOILUONGTHOIKHOABIEUID, strNamHoc, strHocKy, strDotHocId, strLopHocPhanId, strStaffId) {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/DeletePhanCongGiangDay',
            'versionAPI': 'v1.0',
             
            'strKhoiLuongThoiKhoaBieuId': strKHOILUONGTHOIKHOABIEUID,
            'strNamHoc': strNamHoc,
            'strHocKy': strHocKy,
            'strDotHocId': strDotHocId,
            'strLopHocPhanId': strLopHocPhanId,
            'strStaffId': strStaffId,
            'strNguoiThucHienId': edu.system.userId,
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
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachPhanCongBMKhac',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strBoMonKhacId': edu.util.getValById('drpBoMon_All'),
            'strStaffId': edu.util.getValById('drpGiangVien_All'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoiLuongThoiKhoaBieuBoMonKhac = data.Data;
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

                    "mRender": function (nRow, aData) {
                        var strReturn = "<span style='color: red;'>" + aData.TENKHOA + "_" + aData.MAHOCPHAN + "_</span>" + aData.TENLOP;
                        if (aData.LALOPTACH > 1)
                            strReturn += "<span style='color: red;'>_Lớp tách</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOCTRINH"
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
                    "mDataProp": "TONGTIETCTDT"
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mDataProp": "HOTENMASO"
                },
                {
                    "mDataProp": "TENBOMONPHANGIANG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
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
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachCacMonHocDaPCCuaBM',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strBoMonKhacId': edu.util.getValById('drpBoMon_All'),
            'strStaffId': edu.util.getValById('drpGiangVien_All'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strNguoiThucHienId': edu.system.userId,

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
                    "mDataProp": "TENHEDAOTAO"
                },
                {

                    "mRender": function (nRow, aData) {
                        var strReturn = "<span style='color: red;'>" + aData.TENKHOA + "_" + aData.MAHOCPHAN + "_</span>" + aData.TENLOP;
                        if (aData.LALOPTACH > 1)
                            strReturn += "<span style='color: red;'>_Lớp tách</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "HOCKYDOTHOCFULL"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETCTDT"
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mDataProp": "HOTENMASO"
                },
                {
                    "mDataProp": "TENBOMONPHANGIANG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}

