function qlklgd_tonghopkhoiluong_giangvien() { };
qlklgd_tonghopkhoiluong_giangvien.prototype = {
    dtNhomMonHoc: [],  
    strNhomMonHocId:'',
    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
            me.getList_drpHocKy();
            me.getList_drpDotHoc();
            //me.getList_drpBoMon(); 
           // me.genEmty_ThongTinGiangVien();
            //me.getList_drpGiangVien();
            me.getList_tblKhoiLuong(); 
        });

        $('#drpHeDaoTao').on('select2:select', function () {

            me.getList_drpAcademicyear();
            me.genEmty_ThongTinGiangVien();
            me.getList_tblKhoiLuong(); 
            
        });
        //$('#drpBoMon').on('select2:select', function () {
        //    me.getList_drpGiangVien();
        //    me.genEmty_ThongTinGiangVien();

            
        //});
 
        //$('#btnTongHop').click(function () {
        //    if (edu.util.getValById('drpNamHoc') == "") {
        //        edu.system.alert("Bạn chưa chọn năm học");
        //    }
        //    if (edu.util.getValById('drpBoMon') != "") { 
        //        me.TinhKhoiLuongTruDanTheoChuan_Kieu2(edu.util.getValById('drpBoMon'));
                
        //}
        //    else {
        //        for (var i = 0; i < me.dtNhomMonHoc.length; i++) {
        //            me.TinhKhoiLuongTruDanTheoChuan_Kieu2(me.dtNhomMonHoc[i]["ID"]);

        //        }
        //    }
            
        //    setTimeout(function () {
        //        me.getList_tblKhoiLuong();
        //    }, 2000);
        //});
        //$('#drpGiangVien').on('select2:select', function () {

        //    me.genEmty_ThongTinGiangVien();
        //    me.getList_tblKhoiLuong(); 
        //});
        

        //edu.system.getList_MauImport("zonebtnKLGD", function (addKeyValue) {
        //    var obj_list = {
        //        'strNamHoc': edu.util.getValById('drpNamHoc'),
        //        'strNhomMonHocId': edu.util.getValById('drpBoMon'),
        //        'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
        //        'Id': edu.util.getValById('drpBoMon'),
        //        'strNguoiThucHienId': edu.system.userId,
        //        'strChucNang_Id': edu.system.strChucNang_Id,
        //    };

        //    for (var x in obj_list) {
        //        addKeyValue(x, obj_list[x]);
        //    }
        //});


      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_NamHoc();
        
        me.getList_drpHeDaoTao();
            
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
        var strHocKy = edu.util.getValById('drpHocKy');

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
                    if (data.Data.length > 0)
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
    getList_tblKhoiLuong: function () {
        var me = this;
        //--Edit
        var strStaffId = edu.system.userId;
        var strBoMonId = me.strNhomMonHocId;
        strBoMonId = strBoMonId == "" ? "#@" : strBoMonId;
        strStaffId = strStaffId == "" ? "#@" : strStaffId;
         

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachPhanCong',
            'versionAPI': 'v1.0',
            'strBoMonId': strBoMonId,
            'strStaffId': strStaffId,
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
                    "mDataProp": "TENCOSODAOTAO"
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENHOCPHAN + "_" + "<span style = 'color:red'>" + aData.MAHOCPHAN + "_" + aData.HOCTRINH + "</span>";

                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOCTRINH"
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
                    },
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mDataProp": "TENHINHTHUCGIANGDAY"
                    
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mDataProp": "TENHEDAOTAO"
                },
                {
                    "mDataProp": "HOCKYDOTHOCFULL"
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
        
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/TinhKhoiLuongTruDanTheoChuan_Kieu2',
            'versionAPI': 'v1.0',
            'NhomMonHocID': strNhomMonHocID, 
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': edu.util.getValById('drpHocKy'),
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
            'action': 'TKGG_QLKLGD/GetThongTinCanBo',
            'versionAPI': 'v1.0',
            'strStaffId': edu.system.userId, 
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    me.strNhomMonHocId = dt[0].TBL_KLGD_NHOMMONHOCID;
                    $("#lblHoTen").text(dt[0].HOCHAMHOCVI + " " + dt[0].HOTEN);
                    $("#lblMaGiangVien").text(dt[0].SOHIEUCT);
                    $("#lblBoMon").text(dt[0].TENBM);
                    $("#lblDinhMucGiangDay").text(dt[0].DINHMUCGIANGDAY);
                    var strSoTietHoanThanhGiangDay = dt[0].SOTIETHOANTHANHGIANGDAY;
                     if (edu.util.returnEmpty(dt[0].SOTIETDUOCCONGTHEM) != "")
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

