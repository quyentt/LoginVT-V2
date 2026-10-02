function confirm() { };
confirm.prototype = {  
    rootPath: '',
    apiUrl: '',
    apiUrlTemp: '',
    
    rootPathUpload: '',
    rootPathReport: '',
    strExamRoomInfo_Id: '',
    strThiSinh_Id: '',
    strStudentExamroom_Id: '',
    strKTXemCoMKPhongThiKhong: '',
    strUrlLogout:'',
    objApi: {}, 
    init: function () {
        var me = this;
        //me.checkIfRemoteFileExists();
        me.strExamRoomInfo_Id = edu.util.getValById('txtExamRoomInfo_Id');
        me.strStudentExamRoom_Id = edu.util.getValById('txtStudentExamroom_Id');        
        me.strThiSinh_Id = edu.util.getValById('txtThiSinh_Id');
        var strsite = location.pathname.split('/');
        me.strUrlLogout = location.origin + "/" + strsite[1] + "/Logout.aspx";
        if (location.hostname == 'localhost') {
            me.strUrlLogout = location.origin + "/Logout.aspx";
        } 
         if (me.strThiSinh_Id != edu.system.userId) {
            me.ThemTBL_EXA_TTNLOG();
            window.open(me.strUrlLogout, "_parent");
        }

        me.LayDS_ThongTinThiSinh();
        //me.Save_ThiSinhVaoPhongThi(me.strStudentExamRoom_Id);
        $("#btnBatDauLamBai").click(function () {
            me.Save_ThiSinhVaoPhongThi(me.strStudentExamRoom_Id);
            me.KTXemCoMKPhongThiKhong();            
        });
        $("#btn_NhapMatKhauPhongThi").click(function () {
            me.Save_ThiSinhVaoPhongThi(me.strStudentExamRoom_Id);
            me.KiemTraMatKhauSinhVienPhongThi();

        });
        
    },  
    getUrlParameter: function (sParam) {
        var sURLVariables = window.location.search.substring(1).split('&'), sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    },
    LayDS_ThongTinThiSinh: function () {
        var me = this;

        $('#lblHoTen').html("");
        $('#lblMaThiSinh').html("");
        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_ThongTinThiSinh',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) { 
                $('#lblHoTen').html(data.Data[0].FULLNAME);
                $('#lblMaThiSinh').html(data.Data[0].NAME);
                me.LayDS_CacPhanDeThiThiSinh();
                
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
    KTXemCoMKPhongThiKhong: function () {
        var me = this;  
        
        var obj_list = {
            'action': 'TTN_ThiSinh/KTXemCoMKPhongThiKhong',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfo_Id,
        };
       
        edu.system.makeRequest({
            success: function (data) {                 
                me.strKTXemCoMKPhongThiKhong = data.Data;
                console.log(me.strKTXemCoMKPhongThiKhong);
                if (me.strKTXemCoMKPhongThiKhong == "1") {
                    $('#zoneMatKhauPhongThi').modal('show'); 
                }
                else {
                    edu.system.confirm("Bạn cần xác nhận là đã đọc và hiểu rõ về quy định, hướng dẫn trước khi làm bài thi này?");
                    $("#btnYes").click(function (e) {
                        me.Save_ThiSinhVaoPhongThi(me.strStudentExamRoom_Id);
                        var url = "ApisThiTracNghiem/Modules/lambaithi/html/lambaithionline.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strThiSinh_Id=" + me.strThiSinh_Id + "&strStudentExamroom_Id=" + me.strStudentExamRoom_Id + "&v=1.0.1.5";
                        
                        window.open(url, "_parent");
                    });

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
    
    KiemTraMatKhauSinhVienPhongThi: function () { 
        var me = this;
        var obj_list = {
            'action': 'TTN_ThiSinh/KiemTraMatKhauSinhVienPhongThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfo_Id,
            'strMatKhauPhongThi': edu.util.getValById("txtMatKhauPhongThi"),
        };

        edu.system.makeRequest({
            success: function (data) {
                 
                if (data.Data == "1") {
                    $('#zoneMatKhauPhongThi').modal('hide');
                    edu.system.confirm("Bạn có chắc chắn làm bài thi?");
                    $("#btnYes").click(function (e) {
                        
                        var url = "ApisThiTracNghiem/Modules/lambaithi/html/lambaithionline.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strThiSinh_Id=" + me.strThiSinh_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id+ "&v=1.0.1.5";
                        window.open(url, "_parent");
                    });
                }
                else {
                    $('#zoneMatKhauPhongThi').modal('hide');
                    edu.system.alert("Bạn nhập sai mật khẩu phòng thi?"); 
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
    LayDS_CacPhanDeThiThiSinh: function () {
        var me = this;
         
        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_CacPhanDeThiThiSinh',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                // 
            
                edu.util.viewHTMLById("lblThoiGianLamBai", data.Data[0].TONGTHOIGIAN);
                edu.util.viewHTMLById("lblMonThi", data.Data[0].COURSENAME);
                edu.util.viewHTMLById("lblPhongThi", data.Data[0].ROOMNAME);
                edu.util.viewHTMLById("lblHuongDanThiSinhLamBai", data.Data[0].ROOMHELP);

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
    Save_ThiSinhVaoPhongThi: function (strStudentExamroom_Id) {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/Save_ThiSinhVaoPhongThi',
            'versionAPI': 'v1.0',
            'strStudentExamroom_Id': strStudentExamroom_Id,
            'strMacAddress': edu.util.getValById('txtMacAddress'),
            'strIpAddress': edu.util.getValById('txtIpAddress'),
            'strComputerName': edu.util.getValById('txtComputerName'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Data == '1') {                  
                    alert('Bạn đã vi phạm quy định trong quá trình làm bài');
                    window.open(me.strUrlLogout, "_parent");
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

    ThemTBL_EXA_TTNLOG: function () {
        var me = this;
        var strGhiChu = "CONFIRM: me.strThiSinh_Id=" + me.strThiSinh_Id
            + " edu.system.userId =" + edu.system.userId + " me.strExamRoomInfo_Id" + me.strExamRoomInfo_Id;
        var obj_list = {
            'action': 'TTN_ThiSinh/ThemTBL_EXA_TTNLOG',
            'versionAPI': 'v1.0',
            'type': 'POST',
            'strEXAMROOMINFOID': me.strExamRoomInfo_Id,
            'strUSERID': me.strThiSinh_Id,
            'strGHICHU': strGhiChu,
        };

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

            },
            type: obj_list.type,
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    checkIfRemoteFileExists: function () {
         

    $.ajax({
        url: 'https://qldtbeta.hunre.edu.vn/upload/ApisQuanLyThiTracNghiem/Doc/Audio_temp/6AAD263D448E4F4A8A690F0CD1AA2EE7/5F8D3359AD064A94B8C504D95E1B0378_202406141720114670_nghe3.m3u8', //get the value from the url box
        error: function () {
            alert("file does not exists"); //update answer box
        },
        success: function () {
            alert("file exists"); //update answer box
        }
    });
}

}