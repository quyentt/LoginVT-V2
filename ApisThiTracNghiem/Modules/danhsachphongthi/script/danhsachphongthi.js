function danhsachphongthi() { };
danhsachphongthi.prototype = {
    rootPath: '',
    apiUrl: '',
    apiUrlTemp: '',
    rootPathUpload: '',
    rootPathReport: '',
    strThiSinh_Id: '',
    dtBaiThi: [],  
    strUrlLogout:'',

    init: function () {
        var me = this;
        
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

        me.getList_ThongTinThiSinh();
        me.getList_BaiThi();
        $(document).delegate('.hplCourseName', 'click', function () {
            var id = $(this).attr('id');
            me.Save_ThiSinhVaoPhongThi(id);
        });
    }, 

    getList_ThongTinThiSinh: function () {
        var me = this; 
        edu.util.viewHTMLById("lblHoTen", "");
        edu.util.viewHTMLById("lblMaThiSinh", "");
        edu.util.viewHTMLById("lblNgaySinh", "");
        edu.util.viewHTMLById("lblSoDienThoaiCaNhan", "");
        edu.util.viewHTMLById("lblEmail", "");
        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_ThongTinThiSinh',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {

                edu.util.viewHTMLById("lblHoTen", data.Data[0].FULLNAME);
                edu.util.viewHTMLById("lblMaThiSinh", data.Data[0].NAME);
                edu.util.viewHTMLById("lblNgaySinh", data.Data[0].NGAYSINH);
                edu.util.viewHTMLById("lblSoDienThoaiCaNhan", data.Data[0].DIENTHOAICANHAN);
                edu.util.viewHTMLById("lblEmail", data.Data[0].EMAIL);

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
    getList_BaiThi: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_PhongThiByThiSinhId',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {

                me.dtBaiThi = data.Data.Table;
                

                me.genTable_BaiThi(me.dtBaiThi);
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
    genTable_BaiThi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBaiThi",
            aaData: data,
            sort: true,
            arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 1,2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = ""; 

                        if (parseFloat(aData.CONTHOIGIANLAMBAI) < 1)
                            strReturn =
                                "<span style='font-weight: bold;'>  </span>&nbsp;&nbsp;&nbsp;"
                                + "        <a href='#' style='color: blue; text-decoration: underline; font-weight: bold' class='hplCourseName' id='" + aData.STUDENTEXAMROOM_ID + "'> " + aData.COURSENAME + " </a>";

                        else {
                            if (aData.STUDENTEXAMROOMSTATUS != "TAMDUNGTHI") {
                                strReturn = "<span style='font-weight: bold; '>"
                                    + "            <a class='test'>Làm bài thi =></a>"
                                    + "        </span>"
                                    + "<span style='font-weight: bold;'>  </span>&nbsp;&nbsp;&nbsp;"
                                    + "        <a href='#' style='color: blue; text-decoration: underline; font-weight: bold' class='hplCourseName' id='" + aData.STUDENTEXAMROOM_ID + "'> " + aData.COURSENAME + " </a>";
                            }
                        }
                        if (aData.FINISHED == "1")
                            strReturn =
                                "<span style='font-weight: bold;'>  </span>&nbsp;&nbsp;&nbsp;"
                                + "        <a href='#' style='color: blue; text-decoration: underline; font-weight: bold' class='hplCourseName' id='" + aData.STUDENTEXAMROOM_ID + "'> " + aData.COURSENAME + " </a>";

                        return strReturn; 
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strHTML = "";
                        var idTimer = "timer" + aData.STUDENTEXAMROOM_ID.toString();
                        var timeMinute = aData.TIMERCOUNTDOWN;
                        if (parseFloat(aData.THOIGIANCONLAI) > 0) {
                            //if (timeMinute != "" && timeMinute != null && timeMinute != "0") {
                            //    if (parseInt(timeMinute) > 0 && aData.FINISHED == "0")
                            //        strHTML += "<span style='text-align:center' id='" + idTimer + "'>" + timeMinute + "</span>";
                            //    else
                            //        strHTML += "<span style='text-align:center'>--:--</span>";
                            //}
                        }
                        //else (parseInt(timeMinute) <= 0)
                        //    strHTML = "<span style='color: Violet' >Kết thúc</span>";
                        
                        if (aData.CHUALAMBAITHI == null || aData.CHUALAMBAITHI == '')
                            strHTML = "<span style='color: Green' >Chưa thi</span>";
                        if (aData.FINISHED == "1")
                            strHTML = "<span style='color: red' >Thi xong</span>";

                        if (aData.STUDENTEXAMROOMSTATUS == "TAMDUNGTHI")
                            strHTML = "<span style='color: red' >Tạm dừng</span>";

                        return strHTML;
                    }

                },
                {
                    "mDataProp": "EXAMROOMINFONAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "ROOMTITLE"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
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
                
                //if (data.Data == '1') {                    
                //    alert('Bạn đã vi phạm quy định trong quá trình làm bài');
                //    window.open(me.strUrlLogout, "_parent");
                //}
                //else {
                    if (data.Data == '1') 
                    alert('Bạn đã vi phạm quy định trong quá trình làm bài');
                    var dt = edu.util.objGetDataInData(strStudentExamroom_Id, me.dtBaiThi, "STUDENTEXAMROOM_ID");


                    var strThiSinh_Id = dt[0].USERID;
                    var strExamRoomInfo_Id = dt[0].EXAMROOMINFOID;
                    var strFinish = dt[0].FINISHED;
                    var COFILEAUDIO = dt[0].COFILEAUDIO;
                    me.doExam(strStudentExamroom_Id, strThiSinh_Id, strExamRoomInfo_Id, strFinish, COFILEAUDIO);
                //}
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
    doExam: function (strStudentExamroom_Id, strThiSinh_Id, strExamRoomInfo_Id, strFinish, COFILEAUDIO) {
        var url = "";

        if (strFinish == '1')
            url = "ketquathi.aspx?strExamRoomInfo_Id=" + strExamRoomInfo_Id + "&strStudentExamroom_Id=" + strStudentExamroom_Id + "&strThiSinh_Id=" + strThiSinh_Id
        else {

            if (COFILEAUDIO != '0')
                url = "TestAudio.aspx?strStudentExamroom_Id=" + strStudentExamroom_Id + "&strThiSinh_Id=" + strThiSinh_Id + "&strExamRoomInfo_Id=" + strExamRoomInfo_Id;
            else
                url = "Confirm.aspx?strStudentExamroom_Id=" + strStudentExamroom_Id + "&strThiSinh_Id=" + strThiSinh_Id + "&strExamRoomInfo_Id=" + strExamRoomInfo_Id;

        }
        url += "&v=<%= System.Guid.NewGuid() %>";


        window.open(url, "_parent");
    },
    ThemTBL_EXA_TTNLOG: function () {
        var me = this;
        var strGhiChu = "DANH SACH PHONG THI: me.strThiSinh_Id=" + me.strThiSinh_Id
            + " edu.system.userId =" + edu.system.userId;
        var obj_list = {
            'action': 'TTN_ThiSinh/ThemTBL_EXA_TTNLOG',
            'versionAPI': 'v1.0',
            'type': 'POST', 
            'strEXAMROOMINFOID': '',
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