function testaudio() { };
testaudio.prototype = {
    rootPath: '',
    apiUrl: '',
    apiUrlTemp: '',
    rootPathUpload: '',
    rootPathReport: '',
    strThiSinhId: '',
    dtBaiThi: [],  
    strExamRoomInfo_Id: '',
    strStudentExamRoom_Id: '',
    strThiSinh_Id: '', 

    init: function () {
        var me = this; 
             var pConfig = Init_Prammater();
        me.rootPath = pConfig.rootPath;
        me.strExamRoomInfo_Id = edu.util.getValById('txtExamRoomInfo_Id');
        me.strStudentExamRoom_Id = edu.util.getValById('txtStudentExamroom_Id');
        me.strThiSinh_Id = edu.util.getValById('txtThiSinh_Id');
        var iconImage = null;
        me.LayDS_ThongTinBaiThiThiSinh();
        console.log(me.rootPath + '/ApisThiTracNghiem/Modules/danhsachphongthi/script/TestAudio.mp3');
        var abc = AP.init({
            
            container: '#zoneTableAudioPart',//a string containing one CSS selector
            volume: 0.7,
            autoPlay: false,
            notification: false,
            playList: [
                { 'icon': iconImage, 'title': 'Test', 'file':me.rootPath+'/ApisThiTracNghiem/Modules/danhsachphongthi/script/TestAudio.mp3' },
                
                
            ]
        });
    }, 
    LayDS_ThongTinBaiThiThiSinh: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_ThongTinBaiThiThiSinh',
            'versionAPI': 'v1.0',
            'strThiSinhId': me.strThiSinh_Id,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    if (dt.length > 0) {

                        $("#lblMonThi").html(dt[0].COURSENAME);
                        $("#lblMaSinhVien").html(dt[0].MATHISINH);
                        $("#lblPhongThi").html(dt[0].ROOMNAME);
                        $("#lblHoTen").html(dt[0].FULLNAME);
                        $("#lblSBD").html(dt[0].SOBAODANH);
                    }

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

     

}