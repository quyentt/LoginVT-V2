function tonghopkhoiluong() { };
tonghopkhoiluong.prototype = {
    dtNhomMonHoc:[],   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpSchoolYear').on('select2:select', function () {
          
            me.getList_drpBoMon(); 
            me.genEmty_ThongTinGiangVien();
            me.getList_drpGiangVien();
        });

        $('#drpHeDaoTao').on('select2:select', function () {

            me.getList_drpAcademicyear();
            
        });
        $('#drpBoMon').on('select2:select', function () {
            me.getList_drpGiangVien();
            me.genEmty_ThongTinGiangVien();

            
        });
 
        $('#btnTongHop').click(function () {
            if (edu.util.getValById('drpSchoolYear') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
            }
            if (edu.util.getValById('drpBoMon') != "") { 
                me.TinhKhoiLuongTruDanTheoChuan_Kieu2(edu.util.getValById('drpBoMon'));
                
        }
            else {
                for (var i = 0; i < me.dtNhomMonHoc.length; i++) {
                    me.TinhKhoiLuongTruDanTheoChuan_Kieu2(me.dtNhomMonHoc[i]["ID"]);

                }
            }
            me.getList_tblKhoiLuong();
        });
        $('#drpGiangVien').on('select2:select', function () {

            me.genEmty_ThongTinGiangVien();
            me.getList_tblKhoiLuong(); 
        });
        

        edu.system.getList_MauImport("zonebtnKLGD", function (addKeyValue) {
            var obj_list = {
                'strNamHoc': edu.util.getValById('drpSchoolYear'),
                'strNhomMonHocId': edu.util.getValById('drpBoMon'),
                'Id': edu.util.getValById('drpBoMon'),
                'strChucNang_Id': edu.system.strChucNang_Id,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });


      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();
        
        me.getList_drpHeDaoTao();
            
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
                    
                    me.dtNhomMonHoc = data.Data;
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
    getList_tblKhoiLuong: function () {
        var me = this;
        //--Edit
        var strStaffId = edu.util.getValById('drpGiangVien');
        var strBoMonId = edu.util.getValById('drpBoMon');
        strBoMonId = strBoMonId == "" ? "#@" : strBoMonId;
        strStaffId = strStaffId == "" ? "#@" : strStaffId;
         

        var obj_list = {
            'action': 'TKGG_KLGD/GetKhoiLuongThoiKhoaBieu',
            'versionAPI': 'v1.0',
            'strBoMonId': strBoMonId,
            'strStaffId': strStaffId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'), 
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'), 
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblKhoiLuong(data.Data, data.Pager);
                    me.getList_ThongTinGiangVien();
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
    genTable_tblKhoiLuong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblKhoiLuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAI"
                },
                {
                    
                     "mRender": function (nRow, aData) {

                         var strReturn = aData.TENMON + "_" +"<span style = 'color:red'>"+ aData.MAHOCPHAN+"</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "DVHT"
                },
                {
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENLOP;
                        if (aData.TACHTHEOSINHVIEN_TIET == "SV")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo SV)</span>";
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo tiết)</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mDataProp": "TENHINHTHUCGIANGDAY"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mDataProp": "HEDAOTAO"
                },
                {
                    "mDataProp": "HOCKY_DOT"
                },
                {
                    "mDataProp": "TIETLYTHUYET_DC"
                },
                {
                    "mDataProp": "TIETBAITAP_DC"
                },
                {
                    "mDataProp": "TIETTHAOLUAN_DC"
                },
                {
                    "mDataProp": "TIETTHINGHIEM_DC"
                },
                {
                    "mDataProp": "TIETTHUCHANH_DC"
                },
                {
                    "mDataProp": "BTL"
                },
                {
                    "mDataProp": "TKMH"
                },
                {
                    "mDataProp": "SONGAY"
                },
                {
                    "mDataProp": "THIETKETN"
                },
                {
                    "mDataProp": "SOTIETQUYDOI"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },  
    TinhKhoiLuongTruDanTheoChuan_Kieu2: function (strNhomMonHocID) {
        var me = this;
        //--Edit
        
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/TinhKhoiLuongTruDanTheoChuan_Kieu2',
            'versionAPI': 'v1.0',
            'NhomMonHocID': strNhomMonHocID, 
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strHocKy': strHocKy,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tổng hợp dữ liệu thành công");
                   
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
    getList_ThongTinGiangVien: function () {
        var me = this;
        //--Edit
        me.genEmty_ThongTinGiangVien();
        var obj_list = {
            'action': 'TKGG_KLGD/GetThongTinCanBo',
            'versionAPI': 'v1.0',             
            'strStaffId': edu.util.getValById('drpGiangVien'), 
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    $("#lblHoTen").text(dt[0].HOCHAMHOCVI + " " + dt[0].HOTEN);
                    $("#lblMaGiangVien").text(dt[0].MACANBO);
                    $("#lblBoMon").text(dt[0].TENBOMON);
                    $("#lblDinhMucGiangDay").text(dt[0].DINHMUCGIANGDAY);
                    var strSoTietHoanThanhGiangDay = dt[0].SOTIETHOANTHANHGIANGDAY;
                    if (dt[0].SOTIETDUOCCONGTHEM != 0)
                        strSoTietHoanThanhGiangDay += '(chưa cộng thêm' + dt[0].SOTIETDUOCCONGTHEM+')';
                    $("#lblHoanThanhGiangDay").text(strSoTietHoanThanhGiangDay);
                    $("#lblSoTietVuotGioGiangDay").text(dt[0].SOTIETVUOT);
                    $("#lblDinhMucNCKH").text(dt[0].DINHMUCNGHIENCUUKHOAHOC);
                    $("#lblHoanThanhNCKH").text(dt[0].SOTIETHOANTHANHNCKH);
                    $("#lblSoTietVuotNCKH").text(dt[0].THUATHIEUNCKH);
                    $("#lblTongTienVuotGio").text(edu.system.convertFloat(dt[0].TIENVUOTGIO));
                    $("#lblTongTienDaTamUng").text(edu.system.convertFloat(dt[0].TIENDATHANHTOAN)); 
                    
                    
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
    genEmty_ThongTinGiangVien: function () {
        $("#lblHoTen").text("");
        $("#lblMaGiangVien").text("");
        $("#lblBoMon").text("");
        $("#lblDinhMucGiangDay").text("");
       
        $("#lblHoanThanhGiangDay").text("");
        $("#lblSoTietVuotGioGiangDay").text("");
        $("#lblDinhMucNCKH").text("");
        $("#lblHoanThanhNCKH").text("");
        $("#lblSoTietVuotNCKH").text("");
        $("#lblTongTienVuotGio").text("");
        $("#lblTongTienDaTamUng").text("");
    },
}

