/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function Test() { };
Test.prototype = {
    token: '',
    idLich: 'primary',
    dtGoogleLich: [],
    dtLich: [],
    init: function () {
        var me = this;
        //this.onLoadGapi(function () {
        //    me.getList_LichGoogle();
        //});
        edu.system.alert('<div id="zoneprocessXXXX"></div>');  
        edu.system.genHTML_Progress("zoneprocessXXXX", 100);

        $("#chkSelectAll_Them").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tbldataThem tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
            //edu.util.checkedAll_BgRow(this, { table_id: "tbldataThem" });
        });
        $("#chkSelectAll_Sua").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tbldataSua tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
            //edu.util.checkedAll_BgRow(this, { table_id: "tbldataSua" });
        });
        $("#chkSelectAll_Xoa").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tbldataXoa tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
            //edu.util.checkedAll_BgRow(this, { table_id: "tbldataXoa" });
        });
        $("#chkSelectAll_allgoogle").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tbldataallgoogle tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
            //edu.util.checkedAll_BgRow(this, { table_id: "tbldataXoa" });
        });
        $("#btnSaveGoogleLich").click(function () {
            var arrAction = [];
            var arrChecked_Them_Id = edu.util.getArrCheckedIds("tbldataThem", "checkX");
            arrChecked_Them_Id.forEach(e => {
                var aData = me.dtLich.find(ele => ele.ID === e);
                if (aData) {
                    // var data = {
                    //     "calendarId": me.idLich,
                    //     "resource": 
                    //     {
                    //         "summary": aData.TITLE,
                    //         "location": aData.LOCATION,
                    //         "description": aData.DESCRIPTION,
                    //         "start": {
                    //             "dateTime": timeUTC(aData.NGAYBATDAU, aData.GIOBATDAU, aData.PHUTBATDAU)
                    //         },
                    //         "end": {
                    //             "dateTime": timeUTC(aData.NGAYKETTHUC, aData.GIOKETTHUC, aData.PHUTKETTHUC)
                    //         },
                    //         "attendees": [
                    //             { "email": "darkpow11@gmail.com" }
                    //         ],
                    //         "extendedProperties": {
                    //             "private": {
                    //                 "ID": aData.ID,
                    //                 "IDCHECK": aData.IDCHECK
                    //             }
                    //         }
                    //     }

                    // };
                    arrAction.push({
                        type: 'insert',
                        data: {
                            "calendarId": me.idLich,
                            "resource":
                            {
                                "summary": aData.TITLE,
                                "location": aData.LOCATION,
                                "description": aData.DESCRIPTION,
                                "start": {
                                    "dateTime": timeUTC(aData.NGAYBATDAU, aData.GIOBATDAU, aData.PHUTBATDAU)
                                },
                                "end": {
                                    "dateTime": timeUTC(aData.NGAYKETTHUC, aData.GIOKETTHUC, aData.PHUTKETTHUC)
                                },
                                "attendees": [
                                    { "email": aData.GUESTS }
                                ],
                                "extendedProperties": {
                                    "private": {
                                        "ID": aData.ID,
                                        "IDCHECK": aData.IDCHECK
                                    }
                                }
                            }

                        }
                    });
                    //me.save_Lich(data)
                }
            });

            var arrChecked_Sua_Id = edu.util.getArrCheckedIds("tbldataSua", "checkX");
            arrChecked_Sua_Id.forEach(e => {
                var aData = me.dtLich.find(ele => ele.ID === e);
                if (aData) {
                    arrAction.push({
                        type: 'update',
                        data: {
                            "calendarId": me.idLich,
                            "eventId": me.dtGoogleLich(e => e.extendedProperties.private.ID === aData.ID).id,
                            "resource": {
                                "summary": aData.TITLE,
                                "location": aData.LOCATION,
                                "description": aData.DESCRIPTION,
                                "start": {
                                    "dateTime": timeUTC(aData.NGAYBATDAU, aData.GIOBATDAU, aData.PHUTBATDAU)
                                },
                                "end": {
                                    "dateTime": timeUTC(aData.NGAYKETTHUC, aData.GIOKETTHUC, aData.PHUTKETTHUC)
                                },
                                "attendees": [
                                    { "email": aData.GUESTS }
                                ],
                                "extendedProperties": {
                                    "private": {
                                        "ID": aData.ID,
                                        "IDCHECK": aData.IDCHECK
                                    }
                                }
                            }
                        }
                    });
                }
            });

            var arrChecked_Xoa_Id = edu.util.getArrCheckedIds("tbldataXoa", "checkX");
            arrChecked_Xoa_Id.forEach(e => {
                arrAction.push({
                    type: 'delete',
                    data: {
                        "calendarId": me.idLich,
                        "eventId": e,
                    }
                });
            });
            if (arrAction.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn thêm " + arrChecked_Them_Id.length + ", sửa " + arrChecked_Sua_Id.length + ", xóa " + arrChecked_Xoa_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrAction.length);
                me.makeGoogleRequest(arrAction);
            });
        });
        $("#btnDeleteAllGoogle").click(function () {
            var arrAction = [];
            var arrChecked_Xoa_Id = edu.util.getArrCheckedIds("tbldataallgoogle", "checkX");
            arrChecked_Xoa_Id.forEach(e => {
                arrAction.push({
                    type: 'delete',
                    data: {
                        "calendarId": me.idLich,
                        "eventId": e,
                    }
                });
            });
            if (arrAction.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa " + arrChecked_Xoa_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrAction.length);
                me.makeGoogleRequest(arrAction);
            });
        });
        function timeUTC(strNgay, strGio, strPhut) {
            if (!strNgay) return "";
            var arrNgay = strNgay.split('/');
            return parseInt(arrNgay[2]) + '-' + arrNgay[1] + '-' + arrNgay[0] + 'T' + strGio + ':' + strPhut + ':00-07:00';
        }
    },
    getList_LichGoogle: function () {
        var me = this;
        // me.makeRequest({
        //     type: 'GET',
        //     url: 'https://www.googleapis.com/calendar/v3/calendars/'+ me.idLich +'/events',
        //     data: {},
        //     success: function (data) {
        //         // data.items.forEach(e => me.delete_Lich(e.id));
        //     },
        //     error: function (e) {
        //         console.log(e);

        //     }
        // })
        gapi.client.calendar.events['list']({
            "calendarId": me.idLich,
            "singleEvents": true
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                me.dtGoogleLich = response.result.items;
                //response.result.items.forEach(e => me.delete_Lich(e.id));
                me.getList_Lich();
            },
                function (err) { console.error("Execute error", err); });
    },
    save_Lich: function (event) {
        var me = this;

        var request = gapi.client.calendar.events.insert({
            'calendarId': me.idLich,
            'resource': event
        });

        request.execute(function (event) {
            //appendPre('Event created: ' + event.htmlLink);
        });
    },
    update_Lich: function (event, strId) {
        var me = this;
        // me.makeRequest({
        //     type: 'PUT',
        //     url: 'https://www.googleapis.com/calendar/v3/calendars/'+ me.idLich +'/events/' + strId,
        //     data: {
        //         'summary': 'Azz'
        //     },
        //     success: function (d) {
        //         console.log(d);
        //     },
        //     error: function (e) {
        //         console.log(e);

        //     }
        // });
        gapi.client.calendar.events.update({
            "calendarId": me.idLich,
            "eventId": strId,
            "resource": event
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
    },
    delete_Lich: function (strId) {
        var me = this;
        // console.log(strId);
        // me.makeRequest({
        //     type: 'DELETE',
        //     url: 'https://www.googleapis.com/calendar/v3/calendars/'+ me.idLich +'/events/' + strId,
        //     data: {},
        //     success: function (d) {
        //         console.log(d);
        //     },
        //     error: function (e) {
        //         console.log(e);

        //     }
        // })
        gapi.client.calendar.events.delete({
            "calendarId": me.idLich,
            "eventId": strId
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
    },
    makeRequest: function (obj) {
        var me = this;
        $.ajax({
            type: obj.type,
            crossDomain: true,
            headers: { 'Authorization': 'Bearer ' + me.token },
            //dataType: constant.setting.method.DATA_TYPE,
            contentType: "application/json",
            url: obj.url,
            data: obj.data,
            success: function (d, s, x) {
                obj.success(d)
            },
            error: function (x, t, m) {
                //obj.error(x)
            },
            cache: false,
        });
    },
    onLoadGapi: function (callback) {
        var me = this;
        var CLIENT_ID = '298839391112-pklal724ic2ta7n40cpkva0ih7dkppbr.apps.googleusercontent.com';
        var API_KEY = 'AIzaSyDGGEfyF8ZTvUE-Ek7MB5azrx6TmOWc9yg';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar.events";

        var authorizeButton = document.getElementById('authorize_button');
        var signoutButton = document.getElementById('signout_button');

        /**
         *  On load, called to load the auth2 library and API client library.
         */
        gapi.load('client:auth2', initClient);

        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        function initClient() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                //me.token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
                //console.log(gapi.auth2.getAuthInstance().currentUser.get())
                var auth2 = gapi.auth2.getAuthInstance();
                var profile = auth2.currentUser.get().getBasicProfile();
                if (!auth2 || !profile)  window.location.href = 'lich.html';
                console.log(profile.getName());
                console.log(profile.getEmail());
                $("#signout_button").html(profile.getName() + " - " + profile.getEmail() + " Đăng xuất")
                auth2.isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(auth2.isSignedIn.get());
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
                //   console.log(x);
                //   console.log(111110);
                //createEvent();
                //me.save_Lich();
                callback();
            }, function (error) {
                appendPre(JSON.stringify(error, null, 2));
            });
        }

        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'block';
                $(".dadangnhap").show();
            } else {
                authorizeButton.style.display = 'block';
                signoutButton.style.display = 'none';
                $(".hide").show();
                window.location.href = 'lich.html';
            }
        }

        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
        }

        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }

        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
        }

        /**
         * Print the summary and start datetime/date of the next ten events in
         * the authorized user's calendar. If no events are found an
         * appropriate message is printed.
         */
        function listUpcomingEvents() {
            gapi.client.calendar.events.list({
                'calendarId': me.idLich,
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then(function (response) {
                var events = response.result.items;
                appendPre('Upcoming events:');

                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                        var event = events[i];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        appendPre(event.summary + ' (' + when + ')')
                    }
                } else {
                    appendPre('No upcoming events found.');
                }
            });
        }
    },
    getList_Lich: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_GoogleCalendar/LayChiTiet',
            'type': 'GET',
            'strNhansu_Hosocanbo_Id': "",
            'strTuNgay': "",
            'strDenNgay': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': "",
            'strIdLopHocPhan': "",
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLich = data.Data;
                    me.compareData();
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genTable_Lich: function (data, strTable) {
        $("#lbl" + strTable).html(data.length);
        var jsonForm = {
            strTable_Id: "tbldata" + strTable,
            aaData: data,
            colPos: {
                center: [0, 5, 6, 7]
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "GUESTS"
                },
                {
                    "mDataProp": "TITLE"
                },
                {
                    "mDataProp": "DESCRIPTION"
                },
                {
                    "mDataProp": "LOCATION"
                },
                {
                    "mDataProp": "STARTTIME"
                },
                {
                    "mDataProp": "ENDTIME"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    compareData: function () {
        var me = this;
        var arrThem = [];
        var arrSua = [];
        var arrXoa = [];
        var arrIDLichGoogle = [];
        me.dtGoogleLich.forEach(e => {
            if (e.extendedProperties && e.extendedProperties.private) arrIDLichGoogle.push(e.extendedProperties.private);
        });

        arrIDLichGoogle.forEach(e => {
            let temp = me.dtLich.find(ele => ele.ID === e.ID);
            if (temp) {
                if (temp.IDCHECK !== e.IDCHECK) arrSua.push(temp);
            } else {
                var aData = me.dtGoogleLich(ele => ele.extendedProperties.private.ID === e.ID);
                var data = {};
                if (aData && aData.attendees && aData.attendees.length > 0 && aData.start && aData.end) {
                    data = {
                        'GUESTS': aData.attendees[0].email,
                        'TITLE': aData.summary,
                        'DESCRIPTION': aData.description,
                        'LOCATION': aData.location,
                        'STARTTIME': aData.start.dateTime,
                        'ENDTIME': aData.end.dateTime,
                        'ID': aData.id
                    };
                    arrXoa.push(data);
                }
            }
        });

        arrThem = me.dtLich.filter(e => {
            return !arrIDLichGoogle.find(ele => ele.ID === e.ID);
        });
        me.genTable_Lich(arrThem, "Them");
        me.genTable_Lich(arrSua, "Sua");
        me.genTable_Lich(arrXoa, "Xoa");

        var arrAllGoogle = [];
        me.dtGoogleLich.forEach(aData => {
            var data = {
                'GUESTS': "",
                'TITLE': aData.summary,
                'DESCRIPTION': aData.description,
                'LOCATION': aData.location,
                'STARTTIME': "",
                'ENDTIME': "",
                'ID': aData.id
            };
            if (aData && aData.attendees && aData.attendees.length > 0) {
                data.GUESTS = aData.attendees[0].email;
            }
            if (aData.start) {

                data.STARTTIME = aData.start.dateTime;
            }
            if (aData.end) {

                data.ENDTIME = aData.end.dateTime;
            }
            arrAllGoogle.push(data);
        });
        me.genTable_Lich(arrAllGoogle, "allgoogle");
    },
    makeGoogleRequest: function (arrAction) {
        var me = this;
        if (arrAction.length > 0) {
            var aAction = arrAction.shift();
            gapi.client.calendar.events[aAction.type](aAction.data)
                .then(function (response) {
                    //edu.system.alert("The");
                    edu.system.alert("Thực hiện thành công");
                    me.makeGoogleRequest(arrAction);
                    edu.system.start_Progress("zoneprocessXXXX", function () {
                        me.getList_LichGoogle();
                    });
                },
                    function (err) {
                        edu.system.alert(err.result.error.message);
                        me.makeGoogleRequest(arrAction); edu.system.start_Progress("zoneprocessXXXX", function () {
                            me.getList_LichGoogle();
                        });
                    });
        }
    },
};