/*----------------------------------------------
--Author: nxduong
--Phone: 0983029603
--Description:
--Date of created: 13/09/2016
--Updated by: nnthuong
--Date of updated: 06/06/2018
----------------------------------------------*/
function util() { };
util.prototype = {
    /*
    ********** orde: [] *****************************
    ********** name: COMMON *************************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    splitString: function (str, n) {
        //old_name SubString ===> splitString
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else {
            return String(str).substring(0, n) + "...";
        }
    },
    IsUnicode: function (str) {
        var pattern = /[^\u0000-\u0080]+/;
        return pattern.test(str);
    },
    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    printHTML: function (divId) {
        ////Get the HTML of div
        //var divElements = document.getElementById(divId).innerHTML;
        ////Get the HTML of whole page
        //var oldPage = document.body.innerHTML;

        ////Reset the page's HTML with div's HTML only
        //document.body.innerHTML = "<html><head><title></title></head><body>" + divElements + "</body>";
        ////Print Page
        //window.print();

        ////Restore orignal HTML
        //document.body.innerHTML = oldPage;

        //the second print
        var content = document.getElementById(divId).innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write('<html><head><title>Print</title><style>@media print{@page{margin:0}body{margin:1.0cm}}</style>');
        mywindow.document.write('</head><body>');
        mywindow.document.write(content);
        mywindow.document.write('</body></html>');

        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        setTimeout(function () {
            console.log(111111);
            mywindow.close();//chrome bị lỗi phải comment lại
        }, 2000);
        return true;
    },
    errorImg: function (name_id) {
        //old_name LoiHinhDaiDien ===> errorImg
        var me = this;
        name_id = "#" + name_id;
        var url = me.getRootPathImg("", me.EnumImageType.ACCOUNT);
        $(name_id).attr("src", url);
    },
    capitalize: function (string) {
        //Ký tự hoa đầu tiên
        //pass string directly to this function
        //ex: capitalize("something you want");
        var me = this;
        var value = "";
        if (me.checkValue(string)) {
            value = string.toString();
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
        return value;
    },
    capitalFirst: function (string) {
        //Ký tự hoa đầu tiên
        // pass value from others and then bind to this funtion
        //ex: var strName = $("#txtName"); capitalFirst(strName);
        var me = this;
        var value = "";
        if (me.checkValue(string)) {
            value = string.toString();
            value = value.charAt(1).toUpperCase() + value.slice(2).toLowerCase();
        }
        return value;
    },
    /*
    ********** orde: [] *****************************
    ********** name: NAVIGATE ***********************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    GoTo: function (i) {
        return goTo(i);
    },
    goTo: function (i) {
        location.href = i;
        return false;
    },
    goBack: function () {
        window.history.back();
    },
    goTopPage: function (top) {
        //old_name GoTopPage ====> goTopPage
        if (typeof (top) == "undefined") top = 0;
        $('html, body').animate({ scrollTop: top }, 500);
    },
    /*
    ********** orde: [] *****************************
    ********** name: CURRENCY $ ***********************
    ********** disc: ********************************
    ************************************************
    */
    formatCurrency: function (value) {
        var me = this;
        var val = me.returnZero(value);
        return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    formatCurrencyVN: function (value) {
        var me = this;
        var val = me.returnZero(value);
        //return val.toString();
        return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    },
    convertStrToNum: function (value) {
        var me = this;
        var result = "";
        var val = me.returnZero(value);
        if (val == 0) {
            result = 0;
        }
        else {
            result = val.replace(/,/g, "");
        }
        return result

    },
    convertCommaToDot: function (value) {
        var result = "";
        if (value == "" || value == null || value == undefined) {
            return 0
        }
        else {
            result = value.replace(',', ".");
            return result;
        }

    },
    convertDotToComma: function (value) {
        var result = "";
        if (value == "" || value == null || value == undefined) {
            return 0
        }
        else {
            result = value.replace('.', ",");
            return result;
        }

    },
    convertNumToDay: function (num) {
        var me = this;
        var day = "";
        if (me.checkValue(num)) {
            if (num == 8) {
                day = "CN";
            }
            else {
                day = "T" + num;
            }
        }
        else {
            day = "";
        }
        return day;
    },
    /*
    ********** orde: [] *****************************
    ********** name: DATE ***************************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    getServerTime: function ()//get datetime on server
    {
        return Date.now();
        //Gây chậm hệ thống đã comment lại
        //try {
        //    //FF, Opera, Safari, Chrome
        //    xmlHttp = new XMLHttpRequest();
        //}
        //catch (err1) {
        //    //IE
        //    try {
        //        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        //    }
        //    catch (err2) {
        //        try {
        //            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        //        }
        //        catch (eerr3) {
        //            //AJAX not supported, use CPU time.
        //            alert("AJAX not supported");
        //        }
        //    }
        //}
        //xmlHttp.open('HEAD', window.location.href.toString(), false);
        //xmlHttp.setRequestHeader("Content-Type", "text/html");
        //xmlHttp.send('');
        //console.log(xmlHttp.getResponseHeader("Date"));
        //return xmlHttp.getResponseHeader("Date");
    },
    dateToday: function () {
        var me = this;
        var dd = "";
        var mm = "";
        var yyyy = "";
        var str_dd_mm_yyyy = "";

        var dateServer = me.getServerTime();
        var date = new Date(dateServer);

        dd = me.addZeroToDate(date.getDate());
        mm = me.addZeroToDate(date.getMonth() + 1);
        yyyy = date.getFullYear();
        str_dd_mm_yyyy = dd + "/" + mm + "/" + yyyy;
        return str_dd_mm_yyyy;
    },
    dateFullToday: function () {
        //call from out: var dateFull = edu.util.yyyy_mm_dd_hh_mm_ss();
        var me = this;
        var dateServer = me.getServerTime();
        var date = new Date(dateServer);
        var year = date.getFullYear();
        var month = me.addZeroToDate(date.getMonth() + 1);
        var day = me.addZeroToDate(date.getDate());
        var hour = me.addZeroToDate(date.getHours());
        var minute = me.addZeroToDate(date.getMinutes());
        var second = me.addZeroToDate(date.getSeconds());

        var fullDate = day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
        return fullDate;
    },
    yyyy_mm_dd_hh_mm_ss: function () {
        //call from out: var dateFull = edu.util.yyyy_mm_dd_hh_mm_ss();
        var me = this;
        var dateServer = me.getServerTime();
        var date = new Date(dateServer);
        var year = date.getFullYear();
        var month = me.addZeroToDate(date.getMonth() + 1);
        var day = me.addZeroToDate(date.getDate());
        var hour = me.addZeroToDate(date.getHours());
        var minute = me.addZeroToDate(date.getMinutes());
        var second = me.addZeroToDate(date.getSeconds());
        var fullDate = year + month + day + hour + minute + second;

        return fullDate;
    },
    addZeroToDate: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    thisYear: function () {
        var me = this;
        var yyyy = "";
        var dateServer = me.getServerTime();
        var date = new Date(dateServer);
        yyyy = date.getFullYear();
        return yyyy;
    },
    thisMonth: function () {
        var me = this;
        var mm = "";
        var dateServer = me.getServerTime();
        var date = new Date(dateServer);
        mm = me.addZeroToDate(date.getMonth() + 1);
        return mm;
    },
    thisDay: function () {
        var me = this;
        var dd = "";
        var dateServer = me.getServerTime();
        var date = new Date(dateServer);
        dd = me.addZeroToDate(date.getDate());
        return dd;
    },
    getListMonth: function () {
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return arr;
    },
    getListDayOfWeek: function () {
        var arr = [2, 3, 4, 5, 6, 7, 8];
        return arr;
    },
    dateParse: function (dmy) {
        var me = this;
        if (me.dateValid(dmy)) {
            var date = dmy.split('/');
            return {
                year: date[2],
                month: date[1],
                day: date[0]
            }
        }
        else {
            return {
                year: "0000",
                month: "00",
                day: "00"
            }
        }
    },
    dateGetInFuture: function (dmy, numdays) {
        /*------------------------------
        --Input: format date: dd/mm/yyyy && a number of days that you want in the future to create a distance time
        --Output: mm/dd/yyyy
        -------------------------------*/
        var me = this;
        if (me.dateValid(dmy) && me.intValid(numdays)) {
            var newdate = "";
            var dd = "";
            var mm = "";
            var yyyy = "";
            var str_dd_mm_yyyy = "";
            var str_mm_dd_yyyy = "";

            str_mm_dd_yyyy = me.dateConvertDMYtoMDY(dmy);
            newdate = new Date(str_mm_dd_yyyy);//initialize format date: mm/dd/yyyy
            newdate.setDate(newdate.getDate() + numdays);
            dd = me.addZeroToDate(newdate.getDate());
            mm = me.addZeroToDate(newdate.getMonth() + 1);
            yyyy = newdate.getFullYear();
            str_dd_mm_yyyy = dd + "/" + mm + "/" + yyyy;
            return str_dd_mm_yyyy;
        }
        else {
            console.log("Warning from CORE__Please, date input is wrong format!");
            return "";
        }
    },
    dateConvertDMYtoMDY: function (dmy) {
        /*------------------------------
        --Input: format date: dd/mm/yyyy
        --Output: mm/dd/yyyy
        -------------------------------*/
        var me = this;
        var str_mm_dd_yyyy = "";
        arr_date = dmy.split("/");
        str_mm_dd_yyyy = me.addZeroToDate(arr_date[1]) + "/" + me.addZeroToDate(arr_date[0]) + "/" + arr_date[2];
        return str_mm_dd_yyyy;

    },
    dateInRange: function (dmy, dmy_start, dmy_end) {
        var me = this;
        if (me.dateValid(dmy_start) && me.dateValid(dmy_end) && me.dateValid(dmy)) {
            var arrDate = dmy.split("/");
            var arrDate_start = dmy_start.split("/");
            var arrDate_end = dmy_end.split("/");

            var valDate = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);
            var valDate_start = new Date(arrDate_start[2], arrDate_start[1] - 1, arrDate_start[0]);
            var valDate_end = new Date(arrDate_end[2], arrDate_end[1] - 1, arrDate_end[0]);

            if (valDate >= valDate_start && valDate <= valDate_end) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    dateCompare: function (dmy_first, dmy_second) {
        var me = this;
        if (me.dateValid(dmy_first) && me.dateValid(dmy_second)) {
            var arrDate_first = dmy_first.split("/");
            var arrDate_second = dmy_second.split("/");
            var valDate_first = new Date(arrDate_first[2], arrDate_first[1] - 1, arrDate_first[0]);
            var valDate_second = new Date(arrDate_second[2], arrDate_second[1] - 1, arrDate_second[0]);
            if (valDate_first.getTime() == valDate_second.getTime()) {
                return 0;
            }
            else if (valDate_first.getTime() > valDate_second.getTime()) {
                return 1
            }
            else if (valDate_first.getTime() < valDate_second.getTime()) {
                return -1
            }
        }
        else {
            return false;
        }
    },
    dateTimeFormat: function (strDate) {
        //old_name FormatDateTime ====> dateTimeFormat
        // Vài giây trước
        // 1-59 phút trước
        // 1-23 tiếng trước
        // 9:58 15/08/2010

        // Input DateTime
        strDate = strDate.replace("/Date(", "").replace(")/", "");
        var dt = new Date(parseInt(strDate));
        var yy = dt.getFullYear();
        var mm = (dt.getMonth() + 1);
        var dd = dt.getDate();
        var hr = dt.getHours();
        var mi = dt.getMinutes();
        var ss = dt.getSeconds();
        // Curent DateTime
        var dateServer = me.getServerTime();
        var curentDate = new Date(dateServer);
        var cYY = curentDate.getFullYear();
        var cMM = (curentDate.getMonth() + 1);
        var cDD = curentDate.getDate();
        var cHR = curentDate.getHours();
        var cMI = curentDate.getMinutes();
        var cSS = curentDate.getSeconds();

        var strTime = "";
        // If InputDate Is Today
        var dif = curentDate.getTime() - dt.getTime();
        var numberSecond = Math.abs(dif / 1000);
        var numberMinute = Math.floor(numberSecond / 60);
        var numberHour = Math.floor(numberSecond / 3600);
        if (numberSecond < 60)
            strTime = "Vài giây trước";
        else if (numberSecond < 3600)
            strTime = numberMinute.toString() + " phút trước";
        else if (numberSecond < 3600 * 24)
            strTime = numberHour.toString() + " giờ trước";

        else {
            strTime = "";
            strTime += parseInt(dd) < 10 ? ('0' + dd) : dd;
            strTime += "/" + (parseInt(mm) < 10 ? ('0' + mm) : mm);
            strTime += "/" + (parseInt(yy) < 10 ? ('0' + yy) : yy);
            strTime += " " + (parseInt(hr) < 10 ? ('0' + hr) : hr);
            strTime += ":" + (parseInt(mi) < 10 ? ('0' + mi) : mi);
        }
        console.log("strTime: " + strTime);
        return strTime;
    },
    roundClock: function (place) {
        var canvas = document.getElementById("cvClock");
        var ctx = canvas.getContext("2d");
        var radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.90
        setInterval(drawClock, 1000);

        function drawClock() {
            drawFace(ctx, radius);
            drawNumbers(ctx, radius);
            drawTime(ctx, radius);
        }

        function drawFace(ctx, radius) {
            var grad;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
            grad.addColorStop(0, '#333');
            grad.addColorStop(0.5, 'white');
            grad.addColorStop(1, '#333');
            ctx.strokeStyle = grad;
            ctx.lineWidth = radius * 0.1;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
            ctx.fillStyle = '#333';
            ctx.fill();
        }

        function drawNumbers(ctx, radius) {
            var ang;
            var num;
            ctx.font = radius * 0.15 + "px arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            for (num = 1; num < 13; num++) {
                ang = num * Math.PI / 6;
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.85);
                ctx.rotate(-ang);
                ctx.fillText(num.toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.85);
                ctx.rotate(-ang);
            }
        }

        function drawTime(ctx, radius) {
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            //hour
            hour = hour % 12;
            hour = (hour * Math.PI / 6) +
                (minute * Math.PI / (6 * 60)) +
                (second * Math.PI / (360 * 60));
            drawHand(ctx, hour, radius * 0.5, radius * 0.07);
            //minute
            minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
            drawHand(ctx, minute, radius * 0.8, radius * 0.07);
            // second
            second = (second * Math.PI / 30);
            drawHand(ctx, second, radius * 0.9, radius * 0.02);
        }

        function drawHand(ctx, pos, length, width) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0, 0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        }
    },
    digitalClock: function () {
        startTime();
        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            document.getElementById('dgClock').innerHTML = h + ":" + m + ":" + s;
            var t = setTimeout(startTime, 500);
        }
        function checkTime(i) {
            if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
            return i;
        }
    },
    getUserIP: function (onNewIP) { //  onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
            noop = function () { },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function iterateIP(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        });

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    },
    /*
    ********** orde: [] *****************************
    ********** name: VALIDATE ***********************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    strValid: function (name_id) {
        var value = $(name_id).val();
        if (value == "" || value == null || value == undefined || value == "Not empty!") {
            return false;
        }
        else {
            value = value.toString().trim();
            if (value) return true;
            else return false;
        }
    },
    intValid: function (value) {
        var pattern = /^-?[0-9]+$/;
        if (pattern.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },
    floatValid: function (value) {
        var pattern = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
        if (pattern.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },
    dateValid: function (dmy) {
        /*------------------------------
        --Input: format date: dd/mm/yyyy 
        --Output: true/false
        -------------------------------*/
        var me = this;
        var pattern = /(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/;//[dd/mm/yyyy || d/m/yyyy|| dd/m/yyyy||d/mm/yyyy] is ok
        if (pattern.test(dmy)) {//check format date
            var date = "";
            var str_mm_dd_yyyy = "";
            var arrdate = [];
            arrdate = dmy.split("/");
            str_mm_dd_yyyy = me.dateConvertDMYtoMDY(dmy);
            date = new Date(str_mm_dd_yyyy);
            if (date.getFullYear() == arrdate[2] && (date.getMonth() + 1) == arrdate[1] && date.getDate() == Number(arrdate[0])) {//check valid date
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    htmlEscape: function (value) {
        return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "").replace(/</g, "").replace(/>/g, "").replace(/&/g, "");
    },

    intValidForm_onblur: function (name_id) {
        var me = this;
        if (name_id != "" || name_id != null || name_id != undefined) {
            var id_check;
            var val_check;
            var flag = false;
            id_check = "#" + name_id;
            val_check = $(id_check).val();
            flag = me.intValid(val_check);
            if (!flag) {
                $(id_check).val("Orror!");
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Warning from CORE__Please, input your Name_Id befor checking empty!");
        }
    },
    floatValidForm_onblur: function (name_id) {
        var me = this;
        if (name_id != "" || name_id != null || name_id != undefined) {
            var id_check;
            var val_check;
            var flag = false;
            id_check = "#" + name_id;
            val_check = $(id_check).val();
            flag = me.floatValid(val_check);
            if (!flag) {
                $(id_check).val("Orror!");
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Please, input your Name_Id befor checking empty!");
        }
    },
    dateValidForm_onblur: function (name_id) {
        /*------------------------------
        --Input: format date: dd/mm/yyyy 
        --Output: true/false
        -------------------------------*/
        var me = this;
        var strId = "#" + name_id;
        var dmy = $(strId).val();
        var pattern = /(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/;//[dd/mm/yyyy || d/m/yyyy|| dd/m/yyyy||d/mm/yyyy] is ok
        if (pattern.test(dmy)) {//check format date
            var date = "";
            var str_mm_dd_yyyy = "";
            var arrdate = [];
            arrdate = dmy.split("/");
            str_mm_dd_yyyy = me.dateConvertDMYtoMDY(dmy);
            date = new Date(str_mm_dd_yyyy);
            if (date.getFullYear() == arrdate[2] && (date.getMonth() + 1) == arrdate[1] && date.getDate() == Number(arrdate[0])) {//check valid date
                return true;
            }
            else {
                console.log("Warning from CORE__Sorry !! - wrong date");
                $(strId).val("Orror!");
            }
        }
        else {
            $(strId).val("Orror!");
            return false;
        }
    },

    intValidForm: function (arrId) {
        var me = this;
        if (arrId.length > 0) {
            var valid_arr = [];
            var id_check;
            var val_check;
            var flag = false;
            for (var i = 0; i < arrId.length; i++) {
                id_check = "#" + arrId[i];
                val_check = $(id_check).val();
                flag = me.intValid(val_check);
                if (!flag) {
                    valid_arr.push(id_check);
                    $(id_check).val("Error type!");
                }
                else {
                    $(id_check).removeClass("input-bg-change");
                }
            }
            if (valid_arr.length > 0) {
                for (var j = 0; j < valid_arr.length; j++) {
                    $(valid_arr[j]).val("Error type!");
                    $(valid_arr[j]).addClass("input-bg-change");
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Warning from CORE__Please, input your array befor checking type is interger!");
        }
    },
    floatValidForm: function (arrId) {
        var me = this;
        if (arrId.length > 0) {
            var valid_arr = [];
            var id_check;
            var val_check;
            var flag = false;
            for (var i = 0; i < arrId.length; i++) {
                id_check = "#" + arrId[i];
                val_check = $(id_check).val();
                flag = me.floatValid(val_check);
                if (!flag) {
                    valid_arr.push(id_check);
                    $(id_check).val("Error type!");
                }
                else {
                    $(id_check).removeClass("input-bg-change");
                }
            }
            if (valid_arr.length > 0) {
                for (var j = 0; j < valid_arr.length; j++) {
                    $(id_check).val("Error type!");
                    $(valid_arr[j]).addClass("input-bg-change");
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Warning from CORE__Please, input your array befor checking type is float!");
        }
    },
    emptyValidForm: function (arrId) {
        var me = this;
        if (arrId.length > 0) {
            var arr_valid = [];
            var id_check;
            var value;
            var select2;

            for (var i = 0; i < arrId.length; i++) {
                if (me.checkId(arrId[i])) {
                    id_check = "#" + arrId[i];
                    value = me.strValid(id_check);
                    if (!value) {
                        arr_valid.push(arrId[i]);
                    }
                    else {
                        //1. for normal input
                        $(id_check).removeClass("input-bg-change");
                        //2. for select2
                        select2 = "select2-" + arrId[i] + "-container";
                        $("span[aria-labelledby='" + select2 + "']").removeClass("input-bg-change");
                        //3. bg for select2 multiple select2-selection--multiple
                        $(id_check + " + span>.selection>.select2-selection--multiple").removeClass("input-bg-change");
                    }
                }
            }
            if (arr_valid.length > 0) {
                for (var j = 0; j < arr_valid.length; j++) {
                    //1. bg for input
                    id_check = "#" + arr_valid[j];
                    $(id_check).addClass("input-bg-change");
                    $(id_check).val("Not empty!");
                    //2. bg for select2 single
                    select2 = "select2-" + arr_valid[j] + "-container";
                    $("span[aria-labelledby='" + select2 + "']").addClass("input-bg-change");
                    //3. bg for select2 multiple select2-selection--multiple
                    $(id_check + " + span>.selection>.select2-selection--multiple").addClass("input-bg-change");
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Warning from CORE__Please, input your array befor checking empty!");
        }
    },
    dateValidForm: function (arrId) {
        var me = this;
        if (arrId.length > 0) {
            var valid_arr = [];
            var id_check;
            var val_check;
            var flag = false;
            for (var i = 0; i < arrId.length; i++) {
                id_check = "#" + arrId[i];
                val_check = $(id_check).val();
                flag = me.dateValid(val_check);
                if (!flag) {
                    valid_arr.push(id_check);
                    $(id_check).val("Wrong date!");
                }
                else {
                    $(id_check).removeClass("input-bg-change");
                }
            }
            if (valid_arr.length > 0) {
                for (var j = 0; j < valid_arr.length; j++) {
                    $(valid_arr[j]).val("Wrong date!");
                    $(valid_arr[j]).addClass("input-bg-change");
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("Warning from CORE__Please, input your array befor checking type is date!");
        }
    },

    validInputForm: function (data) {
        var me = this;
        var jsonData;
        if (me.checkValue(data)) {
            jsonData = data;

            if (jsonData.length > 0) {
                var strValid_Id;
                var strValid_Cat;
                var arr_Cat = [];
                var arr_Empty = [];
                var arr_Float = [];
                var arr_Inter = [];
                var arr_Date = [];
                for (var i = 0; i < jsonData.length; i++) {
                    arr_Cat = [];
                    strValid_Id     = jsonData[i].MA;           //A field in DanhMucDuLieu_table
                    strValid_Cat    = jsonData[i].THONGTIN1;    //A field in DanhMucDuLieu_table

                    arr_Cat = strValid_Cat.split("#");

                    for (var j = 0; j < arr_Cat.length; j++) {
                        switch (arr_Cat[j]) {
                            case constant.setting.valid.EMPTY:
                                arr_Empty.push(strValid_Id);
                                break;
                            case constant.setting.valid.FLOAT:
                                arr_Float.push(strValid_Id);
                                break;
                            case constant.setting.valid.INT:
                                arr_Inter.push(strValid_Id);
                                break;
                            case constant.setting.valid.DATE:
                                arr_Date.push(strValid_Id);
                                break;
                        }
                    }
                }
                var flag_Empty = true;
                var flag_Float = true;
                var flag_Inter = true;
                var flag_Date = true;
                if (me.checkValue(arr_Empty)) {
                    flag_Empty = me.emptyValidForm(arr_Empty);
                }
                if (me.checkValue(arr_Float)) {
                    flag_Float = me.floatValidForm(arr_Float);
                }
                if (me.checkValue(arr_Inter)) {
                    flag_Inter = me.intValidForm(arr_Inter);
                }
                if (me.checkValue(arr_Date)) {
                    flag_Date = me.dateValidForm(arr_Date);
                }

                if (flag_Empty === true && flag_Float === true && flag_Inter === true && flag_Date === true) {
                    return true;
                }
                else {
                    edu.system.alert("Bạn nhập còn thiếu một số thông tin. Hãy kiểm tra lại!", 'w');
                    return false;
                }
            }
        }
    },
    /*
    ********** orde: [] *****************************
    ********** name: CHECK **************************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    checkValue: function (value) {
        if (value === 0) return true;
        if (value == "" || value == null || value == undefined || value == "null")
            return false;
        else
            return true;
    },
    checkEmpty: function (value) {
        var me = this;
        if (me.checkValue(value)) {
            return value;
        }
        else {
            return "";
        }
    },
    returnEmpty: function (value, type) {
        if (value == null || value == undefined) return "";
        return value;
    },
    returnZero: function (value) {
        //same as checkEmpty()
        var me = this;
        if (me.checkValue(value)) {
            return value;
        }
        else {
            return 0;
        }
    },
    checkId: function (id) {
        var me = this;
        if (me.checkValue(id)) {
            var idName = "#" + id;
            if ($(idName).length) {
                return true;
            }
            else {
                console.log("Warning from CORE_Util: not found id name is " + id);
                return false;
            }
        }
        else {
            console.log("Warning from CORE_Util: make sure you passed it");
            return false;
        }
    },
    checkAttr: function (name, value) {
        //check value of a atrribute whether exist or not in html?
        var me = this;
        if (me.checkValue(value) && me.checkValue(name)) {
            if ($('input[' + name + '="' + value + '"]').attr(name) == value) {
                return true;
            }
            else {
                console.log("Warning from CORE_Util: not found the attribute[name] has value is: " + value);
                return false;
            }
        }
        else {
            console.log("Warning from CORE_Util: make sure you passed it: checkAttr()");
            return false;
        }
    },
    checkClass: function (className) {
        var me = this;
        if (me.checkValue(className)) {
            var class_name = "." + className;
            if ($(class_name).length) {
                return true;
            }
            else {
                console.log("Warning from CORE_Util: not found class name is " + className);
                return false;
            }
        }
        else {
            console.log("Warning from CORE_Util: please input your class");
            return false;
        }
    },
    checkCharacter: function (str, character) {
        //change the checkCommoInStr() to checkCharacter()
        // check a character exist in a string ? or not?
        var me = this;
        var bool = false;
        if (me.checkValue(str)) {
            var checkType = str.indexOf(character);
            if (checkType > -1) {//exist character in the string
                bool = true;
            }
        }
        else {
            bool = false;
        }
        return bool;
    },
    checkActive_Tab: function (tab_id) {
        var $id = "#" + tab_id;
        if ($($id).attr('class') == 'active') {
            return true;
        }
        else {
            return false;
        }

    },
    /*
    ********** orde: [] *****************************
    ********** name: ARRAY **************************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    arrExcludeVal: function (arr, val) {
        var me = this;
        for (var i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                arr.splice(i, 1);
            }
        }
        return arr;
    },
    arrExcludeIndex: function (arr, index) {
        var me = this;
        for (var i = 0; i < arr.length; i++) {
            if (index == i) {
                arr.splice(i, 1);
            }
        }
        return arr;
    },
    arrEqualVal: function (arr, val) {
        var check = false;
        for (var i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                check = true;
            }
        }
        return check;
    },
    convertStrToArr: function (str, sign) {
        var me = this;
        var arr = [];
        var string = str;
        if (me.checkCharacter(string, sign)) {
            arr = string.split(sign);
        }
        else {
            arr.push(string);
        }
        return arr;
    },
    arrUpdateVale: function (arr, index, val) {
        //param: arr - array , index - index of array, val - new value
        //object: {"index":["lt","th"],"val":["LHP1","LHP1"]}
        //date: 07/06/2018
        var me = this;
        return arr[index] = val;
    },
    arrCheckExist: function (arr, val) {
        //param: arr, val - value of array
        //logic: if existed --> true, else --> false
        //date:06/07/2018 
        var boolean = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                boolean = true;
            }
        }
        return boolean;
    },
    arrGetIndex: function (arr, val) {
        //param: 
        //logic:
        //date: 07/06/2018
        var index = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                index = i;
            }
        }
        return index;
    },
    /*
    ********** orde: [] *****************************
    ********** name: OBJECT *************************
    ********** disc: nnthuong, 06/06/2018************
    ************************************************
    */
    objEqualVal: function (obj, name, val) {
        var check = false;
        for (var i = 0; i < obj.length; i++) {
            if (val == obj[i][name]) {
                check = true;
                break;
            }
        }
        return check;
    },
    objExcludeVal: function (obj, name, val) {
        var me = this;
        for (var i = 0; i < obj.length; i++) {
            if (val.trim() == obj[i][name]) {
                obj.splice(i, 1);
            }
        }
        return obj;
    },
    objGetDataInData: function (id, aoData, colname, cbFun) {
        //dateCreate: 30/08/2018
        //Author: nnthuong
        //-----------------------
        // id: value need to compare
        //aoData: [{}]
        //colname: name of field in aoData need to compare with id
        //cbFun: callback if have
        //return: data
        var me = this;
        var data = [];
        if (me.checkValue(aoData)) {
            var dtLen = aoData.length
            for (var i = 0; i < aoData.length; i++) {
                if (id == aoData[i][colname]) {
                    data.push(aoData[i]);
                }
                dtLen--;
            }
            if (dtLen <= 0) {

                if (typeof (cbFun) === "function") {
                    cbFun(data);
                }
                else {
                    return data;
                }
            }
        }
        else {
            if (typeof (cbFun) === "function") {
                cbFun([]);
            }
            else {
                return [];
            }
        }
    },
    objGetOneDataInData: function (id, aoData, colname) {
        //dateCreate: 30/08/2018
        //Author: nnthuong
        //-----------------------
        // id: value need to compare
        //aoData: [{}]
        //colname: name of field in aoData need to compare with id
        //return: data
        var me = this;
        var data = [];
        if (me.checkValue(aoData)) {
            for (var i = 0; i < aoData.length; i++) {
                if (id == aoData[i][colname]) {
                    data = aoData[i];
                    break;
                }
            }
        }
        else {
            data = [];
        }
        return data;
    },
    /*
    ********** orde: [] *****************************
    ********** name: DOM HTML ***********************
    ********** disc: ********************************
    ************************************************
    */
    getTextByClass: function (cl) {
        var class_name = "." + cl;
        var result = $(class_name).text();
        return result;
    },
    getHTMLByClass: function (cl) {
        var class_name = "." + cl;
        var result = $(class_name).html();
        return result;
    },
    viewHTMLByClass: function (cl, val) {
        var me = this;
        var idName = "." + cl;
        $(idName).html(val);
    },

    getTextById: function (id) {
        var idName = "#" + id;
        var result = $(idName).text();
        return result;
    },
    getTextById_Combo: function (id) {
        var idName = "#" + id;
        var result = $(idName + " option:selected").text();
        return result;
    },

    getHTMLById: function (id) {
        var me = this;
        var result = "";
        var checkId = me.checkId(id);
        if (checkId) {
            var idName = "#" + id;
            result = $(idName).html();
        }
        else {
            result = '';
        }
        return result;
    },
    viewHTMLById: function (id, val, type) {
        var me = this;
        var checkId = me.checkId(id);
        var value = me.returnEmpty(val, type);
        if (checkId) {
            var idName = "#" + id;
            $(idName).html(value);
        }
    },
    resetHTMLById: function (id) {
        var me = this;
        var checkId = me.checkId(id);
        if (checkId) {
            var idName = "#" + id;
            $(idName).html("");
        }
    },
    resetHTMLByArrId: function (arrId) {
        var me = this;
        var checkId = false;

        for (var i = 0; i < arrId.length; i++) {
            checkId = me.checkId(arrId[i]);
            if (checkId) {
                var idName = "#" + arrId[i];
                $(idName).html("");
            }
        }
    },

    getValById: function (id) {
        var me = this;
        var result = "";
        var checkId = me.checkId(id);
        if (checkId) {
            var idName = "#" + id;
            result = $(idName).val();
            if (id.indexOf("drop") == 0 && $(idName).attr("multiple")) {
                result = result.toString().replace("SELECTALL,", "");
                if (result.indexOf(",") == 0) {
                    result = result.substr(1);
                }
            }

        }
        else {
            result = "";
        }
        return result;
    },
    viewValById: function (id, val) {
        var me = this;
        var checkId = me.checkId(id);
        if (checkId) {
            var idName = "#" + id;
            var checkType = id.indexOf("drop");
            if (checkType == 0) {
                
                if (val == "" && $(idName).attr("resetto") != undefined) $(idName).val($(idName).attr("resetto")).trigger("change");
                else $(idName).val(val).trigger("change");//select2
                if ($(idName).attr("multiple")) $(idName).val(val && val.indexOf(",") != -1 ? val.split(",") : [val]).trigger("change");
            }
            else {
                $(idName).val(val);//txt
            }
        }
    },
    resetValById: function (id) {
        var me = this;
        var checkId = me.checkId(id);
        if (checkId) {
            var idName = "#" + id;
            var checkType = id.indexOf("drop");
            //reset value
            if (checkType == 0) {
                
                if ($(idName).attr("resetto") != undefined) $(idName).val($(idName).attr("resetto")).trigger("change");
                else $(idName).val("").trigger("change");//select2
            }
            else {
                $(idName).val("");//txt
            }
            //reset background valid
            $(idName).removeClass("input-bg-change");
        }
    },
    resetValByArrId: function (arrId) {
        var me = this;
        var idName = "";
        var select2 = "";
        var checkId = false;
        for (var i = 0; i < arrId.length; i++) {
            checkId = me.checkId(arrId[i]);
            if (checkId) {
                idName = "#" + arrId[i];
                var checkType = arrId[i].indexOf("drop");
                //reset value
                if (checkType == 0) {
                    $(idName).val("").trigger("change");//select2 
                }
                else {
                    $(idName).val("");//txt
                }
                //1. for normal input
                $(idName).removeClass("input-bg-change");
                //2. for select2
                select2 = "select2-" + arrId[i] + "-container";
                $("span[aria-labelledby='" + select2 + "']").removeClass("input-bg-change");
                //3. bg for select2 multiple select2-selection--multiple
                $(idName + " + span>.selection>.select2-selection--multiple").removeClass("input-bg-change");
            }
        }
    },

    viewRadioById: function (id, value) {
        $('#' + id + value).prop("checked", true);//jquery>-1.6
        $('#' + id + value).attr('checked', 'checked');//jquery<1.6
    },
    getValRadio: function (name, value) {
        var me = this;
        var val = "";
        if (me.checkAttr(name, value)) {
            val = $('input[' + name + '="' + value + '"]:checked').val();
        }
        else {
            val = "";
        }
        return val;
    },
    resetRadio: function (name, value) {
        $('input[' + name + '="' + value + '"]').prop("checked", false);//jquery>-1.6
        $('input[' + name + '="' + value + '"]').removeAttr('checked');//jquery<1.6
    },

    getValCheckBox: function (obj) {
        var me = this;
        //regexp ==> /something/g
        var checkId = me.checkId(obj.zone);
        if (checkId) {
            var selected_ids = "";
            $('[id$=' + obj.zone + ']').find(":checkbox[id^='" + obj.prefix + "']:checked").each(function () {
                selected_ids += this.id + ',';
            });
            selected_ids = me.cutPrefixId(obj.regexp, selected_ids);
        }
        else {
            selected_ids = "";
        }
        return selected_ids;
    },
    getValCheckBoxByDiv: function (strDiv, strMaDanhMuc, type) {
        //type == undifine lấy value
        //type == "id" lấy id
        if (strDiv != "") strDiv = "#" + strDiv + " ";
        if (strMaDanhMuc == undefined) strMaDanhMuc = "";
        else {
            if (strMaDanhMuc != "") {
                strMaDanhMuc = '[name="' + strMaDanhMuc + '"]';
            } 
        }

        var x = $(strDiv + 'input' + strMaDanhMuc + ':checked');
        if (type == undefined) {
            var arrresult = [];
            for (var i = 0; i < x.length; i++) {
                arrresult.push(x[i].id);
            }
            return arrresult.toString();
        } else {
            var arrresult = [];
            for (var i = 0; i < x.length; i++) {
                arrresult.push(x[i].value);
            }
            return arrresult.toString();
        }
        return "";
    },

    getValCombo: function (name_id) {
        var me = this;
        var value = "";
        if (me.checkId(name_id)) {
            var nameId = "#" + name_id;
            value = $(nameId).val();
            //check if user choose the title
            if (value !== null) {
                value = value.toString();
                value = value.toString().replace("SELECTALL,", "");
                if (value.indexOf(",") == 0) {
                    value = value.substr(1);
                }
            }
                
        }
        else {
            value = "";
        }
        return value;

    },
    getValForm: function (obj) {
        var me = this;
        var input_id = "";
        var input_val = "";
        var objdata = {};
        for (var i = 0; i < obj.inputId.length; i++) {
            input_id = obj.inputId[i] + obj.activeId;
            if (me.checkId(input_id)) {
                input_id = "#" + obj.inputId[i] + obj.activeId;
                input_val = $(input_id).val();
            }
            else {
                input_val = "";
            }
            objdata[obj.inputId[i]] = input_val;
        }
        return objdata;
    },
    getParamOnURL: function (name) {
        //old name: getParameterByName ===>getParamOnURL
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getFileNameUpload: function (strGiaTri, strKyTu) {
        console.log("Warning from CORE__: " + strKyTu);
        var ketqua = "";
        if (strKyTu == ".") {
            ketqua = strGiaTri.substr(strGiaTri.lastIndexOf(strKyTu) - 36, strGiaTri.length - 1);
        }
        else {
            ketqua = strGiaTri.substr(strGiaTri.lastIndexOf(strKyTu) + 1, strGiaTri.length - 1);
        }

        return ketqua;
    },
    getExtendFile: function (fileName) {
        //GetExtension ===> getExtendFile
        var re = /(?:\.([^.]+))?$/;
        var result = re.exec(fileName)[1];
        return result != undefined ? result : "";
    },

    getArrPrimaryById: function (id) {
        var me = this;
        var result = [];
        var x = document.getElementById(id).getElementsByClassName("btnSelectInList");
        for (var i = 0; i < x.length; i++) {
            if (x[i].classList.contains("btn-primary")) result.push(x[i].id);
        }
        return result.toString();
    },
    checkHasClassPrimary: function (strId) {
        if (document.getElementById(strId).classList.contains("btn-primary")) return 1
        return 0;
    },
    /*
    -- author: 
    -- discription: TABLE
    -- date: 
    */
    resetchkSelect: function () {
        $('[id^=chkSelect]').attr('checked', false);
    },
    resetAll_BgRow: function (table_Id) {
        var me = this;
        var all_table = "#" + table_Id + " tbody tr";
        $(all_table).removeClass("tr-bg");
    },
    setAll_BgRow: function (table_Id) {
        var me = this;
        var all_row = "#" + table_Id + " tbody tr";
        $(all_row).addClass("tr-bg");
    },
    setOne_BgRow: function (row_id, table_id) {
        var me = this;
        var row_selected_id = "#" + row_id;
        me.resetAll_BgRow(table_id);
        $(row_selected_id).addClass("tr-bg");
    },
    resetOne_BgRow: function (row_id) {
        var row_selected_id = "#" + row_id;
        $(row_selected_id).removeClass("tr-bg");
    },
    checkedOne_BgRow: function (obj, objHTML) {
        var me = this;
        var selected_id = obj.id.replace(objHTML.regexp, "");
        var checked_status = $(obj).is(':checked');
        var tbl_id = "[id$=" + objHTML.table_id + "]";
        if (selected_id != "") {
            var listData = $(tbl_id);
            listData.find('input:checkbox').each(function () {
                if (checked_status) {
                    me.setOne_BgRow(selected_id);
                }
                else {
                    me.resetOne_BgRow(selected_id);
                }
            });
        }
    },
    checkedAll_BgRow: function (obj, objHTML) {
        var me = this;
        var checked_status = $(obj).is(':checked');
        var tbl_id = "[id$=" + objHTML.table_id + "]";
        var listData = $(tbl_id);
        var arrcheck = listData.find('input:checkbox');
        if (arrcheck.length > 100) {
            arrcheck.each(function () {
                if ($(this).is(":hidden")) return;
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        } else {
            arrcheck.each(function () {
                if ($(this).is(":hidden")) return;
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
                if (checked_status) {
                    me.setAll_BgRow(objHTML.table_id);
                }
                else {
                    me.resetAll_BgRow(objHTML.table_id);
                }
            });
        }
        
    },
    cutPrefixId: function (regexp, string_id) {
        // regexp = /something/g
        var me = this;
        string_id = string_id.replace(regexp, "");
        if (me.checkCharacter(string_id, ",")) {
            string_id = string_id.substr(0, string_id.lastIndexOf(","));
        }
        return string_id;
    },
    getArrCheckedIds: function (strTable_Id, strPrefix_id) {
        var me = this;
        var arrTable_Id = [];
        $('#' + strTable_Id + ' tbody').find(":checkbox[id^='" + strPrefix_id + "']:checked").each(function () {
            arrTable_Id.push(this.id.replace(strPrefix_id, ""));
        });
        return arrTable_Id;
    },
    getAllArrCheckBoxIds: function (strTable_Id, strPrefix_id) {
        var me = this;
        var arrTable_Id = [];
        $('#' + strTable_Id + ' tbody').find(":checkbox[id^='" + strPrefix_id + "']").each(function () {
            arrTable_Id.push(this.id.replace(strPrefix_id, ""));
        });
        return arrTable_Id;
    },
    findCheckedIds: function (obj) {
        var me = this;
        var checkId = me.checkId(obj.table_id);
        if (checkId) {
            var selected_ids = "";
            $('[id$=' + obj.table_id + ']').find(":checkbox[id^='" + obj.prefix_id + "']:checked").each(function () {
                selected_ids += this.id + ',';
            });
            selected_ids = me.cutPrefixId(obj.regexp, selected_ids);
        }
        else {
            selected_ids = "";
        }
        return selected_ids;
    },
    getSmoothId: function (obj) {
        var me = this;
        var selected_ids = me.findCheckedIds(obj);
        if (selected_ids == '' || selected_ids.length <= 0) {
            return false;
        }
        else {
            return selected_ids;
        }

    },
    getCheckedIds: function (obj) {
        //check deleteById <==> checkCheckedIds
        var me = this;
        var selected_ids = me.findCheckedIds(obj);
        if (selected_ids == '' || selected_ids.length <= 0) {
            return "";
        }
        else {
            return selected_ids;
        }
    },
    /*
    -- author: 
    -- discription: Animation
    -- date: 
    */
    _show: function (id) {
        var selected_id = "#" + id;
        $(selected_id).show(500);
    },
    _hide: function (id) {
        var selected_id = "#" + id;
        $(selected_id).hide(500);
    },
    toggle: function (zone) {
        //zone is class {if zone is open --> close / if zone is close --> open}
        if ($('.' + zone).is(':visible')) {
            $('.' + zone).slideUp();
        }
        if ($('.' + zone).is(':hidden')) {
            $('.' + zone).slideDown();
        }
    },
    toggle_overide: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).each(function () {
            if (this.id != id) $(this).slideUp();
        })
        $("#" + id).slideDown();
    },
    focus: function (id) {
        document.getElementById(id).focus()
    },
    
    ActionInCheckedIds: function (strTable_Id, strPrefix_id, callback, strAlert) {
        var me = this;
        if (strAlert == undefined) strAlert = "xóa";
        var arrChecked_Id = [];
        var arrTable_Id = me.getArrCheckedIds(strTable_Id, strPrefix_id);
        if (arrTable_Id.length == 0) {
            edu.system.alert("Vui lòng chọn dữ liệu " + strAlert + "?");
            return;
        }
        edu.system.confirm("Bạn có chắc chắn muốn " + strAlert + " <span style='color: red'>" + arrTable_Id.length + "</span> dữ liệu không ?");
        $("#btnYes").click(function (e) {
            $("#btnYes").hide();
            $('#myModalAlert #alert_content').html('');
            edu.system.genHTML_Progress("myModalAlert #alert_content", arrTable_Id.length);
            for (var i = 0; i < arrTable_Id.length - 1; i++) {
                callback(arrTable_Id[i], false);
            }
            callback(arrTable_Id[arrTable_Id.length - 1], true);
        });
    },
    uuid: function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    getBrowser: function () {
        
            var ua = navigator.userAgent, browser;

            // helper functions to deal with common regex
            function getFirstMatch(regex) {
                var match = ua.match(regex);
                return (match && match.length > 1 && match[1]) || '';
            }

            function getSecondMatch(regex) {
                var match = ua.match(regex);
                return (match && match.length > 1 && match[2]) || '';
            }

            // start detecting
            if (/opera|opr/i.test(ua)) {
                browser = {
                    name: 'Opera',
                    type: 'opera',
                    version: getFirstMatch(/version\/(\d+(\.\d+)?)/i) || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
                }
            } else if (/msie|trident/i.test(ua)) {
                browser = {
                    name: 'Internet Explorer',
                    type: 'msie',
                    version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
                }
            } else if (/chrome.+? edge/i.test(ua)) {
                browser = {
                    name: 'Microsft Edge',
                    type: 'msedge',
                    version: getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
                }
            } else if (/chrome|crios|crmo/i.test(ua)) {
                browser = {
                    name: 'Google Chrome',
                    type: 'chrome',
                    version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
                }
            } else if (/firefox/i.test(ua)) {
                browser = {
                    name: 'Firefox',
                    type: 'firefox',
                    version: getFirstMatch(/(?:firefox)[ \/](\d+(\.\d+)?)/i)
                }
            } else if (!(/like android/i.test(ua)) && /android/i.test(ua)) {
                browser = {
                    name: 'Android',
                    type: 'android',
                    version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
                }
            } else if (/safari/i.test(ua)) {
                browser = {
                    name: 'Safari',
                    type: 'safari',
                    version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
                }
            } else {
                browser = {
                    name: getFirstMatch(/^(.*)\/(.*) /),
                    version: getSecondMatch(/^(.*)\/(.*) /)
                }
                browser.type = browser.name.toLowerCase().replace(/\s/g, '');
            }
            return browser;
        },
};