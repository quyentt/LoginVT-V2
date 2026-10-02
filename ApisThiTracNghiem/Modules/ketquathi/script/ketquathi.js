function ketquathi() { };
ketquathi.prototype = { 
    rootPath: '',
    apiUrl: '',
    apiUrlTemp: '',
    rootPathUpload: '',
    rootPathReport: '',
    strThiSinh_Id: '',
    strExamRoomInfo_Id: '',
    strStudentExamRoom_Id: '',
    strUrlLogout: '',
    objApi: {},  
    init: function () {
        var me = this;
        me.strExamRoomInfo_Id = edu.util.getValById('txtExamRoomInfo_Id');
        me.strStudentExamRoom_Id = edu.util.getValById('txtStudentExamroom_Id');
        var strsite = location.pathname.split('/');
        me.strThiSinh_Id = edu.util.getValById('txtThiSinh_Id');
        me.strUrlLogout = location.origin + "/" + strsite[1] + "/Logout.aspx";
        
        if (location.hostname == 'localhost') {
            me.strUrlLogout = location.origin + "/Logout.aspx";
        }   
        
        if (me.strThiSinh_Id != edu.system.userId) {
            me.ThemTBL_EXA_TTNLOG();
            window.open(me.strUrlLogout, "_parent");
        }
        me.gen_KetQuaThi();
        
    }, 
    gen_KetQuaThi: function () {
        var me = this;
        var obj_list = {
            'action': 'TTN_ThiSinh/gen_KetQuaThiThiSinh',
            'strExamRoomInfoId': me.strExamRoomInfo_Id,
            'strStudentExamRoomId': me.strStudentExamRoom_Id,
            'strThiSinhId': me.strThiSinh_Id,
            'strUserId': me.strThiSinh_Id,

        };
        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinBaiThi").html(data.Data);
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
    ThemTBL_EXA_TTNLOG: function () {
        var me = this;
        var strGhiChu = "KETQUATHI: me.strThiSinh_Id=" + me.strThiSinh_Id
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

}