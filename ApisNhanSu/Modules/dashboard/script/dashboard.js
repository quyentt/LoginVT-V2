/*----------------------------------------------
--Author: Hoàng Tùng
--Phone: 098 677 6348
--Date of created: 07/11/2016
--Input:
--Output:
--Note:
--Updated by: nnthuong
--Date of updated: 20/07/2017
----------------------------------------------*/
function Dashboard() { };
Dashboard.prototype = {
    Id: '',
    data_NhanSu: "",
    arr_month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    data_NhanSuTang: [],
    data_NhanSuTong: [],
    iGioiTinhNu: 0,
    iGioiTinhNam: 0,
    iGiaoSu: 0,
    iPhoGiaoSu: 0,
    iTienSi: 0,
    iThacSi: 0,
    iBSDaKhoa: 0,
    iBSChuyenKhoaII: 0,
    iBSChuyenKhoaI: 0,
    iCuNhan: 0,
    data_UniqAge: [],
    data_SameAge: [],
    data_UniqSalary: [],
    data_SameSalary: [],

    init: function () {
        var me = this;
        me.getList_NhanSu_root();
        //me.getList_NhanSu();
    },
    /*----------------------------------------------
    --Date of created: 05/09/2017
    --Discription: Lấy danh sách nhân sự
    --API: 
    ----------------------------------------------*/
    getList_NhanSu_root: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    me.data_NhanSu = $.parseJSON(mystring);
                    if (me.data_NhanSu.length > 0) {
                        me.process_BienDongNhanSu();
                        me.process_GioiTinhChucDanh();
                        me.process_Tuoi();
                        me.process_HeSoLuong();
                        me.process_SinhNhat();
                    }
                }
                else {
                    edu.system.alert("NS_HoSo/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_HoSo/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'NS_HoSoV2/LayDanhSach',
            
            
            contentType: true,
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'strDaoTao_CoCauToChuc_Id': "",
                'strNguoiThucHien_Id': "",
                'dLaCanBoNgoaiTruong': 0
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NhanSu: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strLoaiCoCauToChuc_Id = "";
        var strChung_DonVi_Id = "";
        var strLoaiDoiTuong_Ma = "";//Giang viên

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    me.data_NhanSu = $.parseJSON(mystring);
                    if (me.data_NhanSu.length > 0) {
                        me.process_BienDongNhanSu();
                        me.process_GioiTinhChucDanh();
                        me.process_Tuoi();
                        me.process_HeSoLuong();
                        me.process_SinhNhat();
                    }
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: 'GET',
            action: 'NS_HoSoV2/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'strDaoTao_CoCauToChuc_Id': "",
                'strNguoiThucHien_Id': "",
                'dLaCanBoNgoaiTruong': 0
            },
            fakedb: [

            ]
        }, false, false, false, null, "");
    },
    /*----------------------------------------------
    --Date of created: 05/09/2017
    --Discription: Process data from NhanSu
    --API: 
    ----------------------------------------------*/
    process_BienDongNhanSu: function () {
        var me = this;
        var date = new Date();
        var thisYear = date.getFullYear();
        var countTong = 0;
        var countTang = 0;
        var str;
        for (var m = 0; m < me.arr_month.length; m++) {
            for (var i = 0; i < me.data_NhanSu.length; i++) {
                if (me.data_NhanSu[i].NGAYHOPDONG == "" || me.data_NhanSu[i].NGAYHOPDONG == null || me.data_NhanSu[i].NGAYHOPDONG == undefined) { }
                else {
                    str = edu.util.dateParse(me.data_NhanSu[i].NGAYHOPDONG);
                    if (str.year < thisYear - 1) {
                        countTong++;
                    }
                    if (str.month == me.arr_month[m] && str.year == thisYear) {
                        countTang++;
                    }
                }
            }
            me.data_NhanSuTong.push(countTong);
            me.data_NhanSuTang.push(countTong + countTang);
            me.arr_month[m] = me.arr_month[m] + "/" + thisYear;
            countTong = countTang;
            countTang = 0;
        }
        me.barChart_BienDongNhanSu();
    },
    process_GioiTinhChucDanh: function () {
        var me = this;
        /*Giới tính - Chức danh*/
        for (var i = 0; i < me.data_NhanSu.length; i++) {
            //Giới tính
            if (me.data_NhanSu[i].GIOITINH_MA == "1")                             //Giới tính Nam
            {
                me.iGioiTinhNam++;
            }
            else if (me.data_NhanSu[i].GIOITINH_MA == "0")                        //Giới tính Nữ
            {
                me.iGioiTinhNu++;
            }
            //Chức danh
            if (me.data_NhanSu[i].CHUCDANH_MA == "GS")                        //Chức danh giáo sư
            {
                me.iGiaoSu++;
            }
            else if (me.data_NhanSu[i].CHUCDANH_MA == "PGS")                  //Chức danh phó giáo sư   
            {
                me.iPhoGiaoSu++;
            }
            else if (me.data_NhanSu[i].LOAIHOCVI_MA == "TS")                           //Học vị tiến sĩ
            {
                me.iTienSi++;
            }
            else if (me.data_NhanSu[i].HOCVI_MA == "ThS")                     //Học vị thạc sĩ 
            {
                me.iThacSi++;
            }
            else if (me.data_NhanSu[i].HOCVI_MA == "BSĐK")                    //Học vị Bác sĩ đa khoa
            {
                me.iBSDaKhoa++;
            }
            else if (me.data_NhanSu[i].HOCVI_MA == "BSCKII")                  //Học vị chuyên khoa II
            {
                me.iBSChuyenKhoaII++;
            }
            else if (me.data_NhanSu[i].HOCVI_MA == "BSCKI")                  //Học vị chuyên khoa I
            {
                me.iBSChuyenKhoaI++;
            }
            else if (me.data_NhanSu[i].HOCVI_MA == "CN")                      //Học vị CỬ NHÂN
            {
                me.iCuNhan++;
            }
        }
        me.bieChart_GioiTinh();
        me.bieChart_ChucDanh();
    },
    process_Tuoi: function () {
        var me = this;
        /*Tính tuổi trung bình*/
        var ageData = [];
        for (var i = 0; i < me.data_NhanSu.length; i++) {//Get age
            if (me.data_NhanSu[i].TUOINHANSU != "") {
                ageData.push(me.data_NhanSu[i].TUOINHANSU);
            }
        }
        ageData.sort();//Arrange arr_age from small to big
        me.data_UniqAge = ageData.filter(function (item, index, inputArray) {//Remove the same value, keep the only value in me.data_UniqAge[] ;
            return inputArray.indexOf(item) == index;
        });
        for (var j = 0; j < me.data_UniqAge.length; j++) {//Count the same value 
            var count = 0;
            for (var k = 0; k < ageData.length; k++) {
                if (me.data_UniqAge[j] == ageData[k]) {
                    count++;
                }
            }
            me.data_SameAge.push(count);
        }
        var totalAge = 0;
        var dmediumAge = 0;
        var dminAge = 0;
        var maxAge = 0;
        for (var h = 0; h < me.data_UniqAge.length; h++) {
            totalAge += parseFloat(me.data_UniqAge[h]);
        }//Min - max medium age
        dmediumAge = parseFloat(totalAge) / parseFloat(me.data_UniqAge.length);
        dminAge = me.data_UniqAge[0];
        maxAge = me.data_UniqAge[me.data_UniqAge.length - 1];
        $("#txtMinAge").text(dminAge);
        $("#txtMediumAge").text(dmediumAge.toFixed(2));
        $("#txtMaxAge").text(maxAge);
        me.areaChart_DoTuoi();
    },
    process_HeSoLuong: function () {
        var me = this;
        /*Hệ số lương*/
        var salaryData = [];
        //Get age
        for (var i = 0; i < me.data_NhanSu.length; i++) {
            if (me.data_NhanSu[i].HESOLUONG_HIENTAI == "" || me.data_NhanSu[i].HESOLUONG_HIENTAI == undefined || me.data_NhanSu[i].HESOLUONG_HIENTAI == null) {
                //nothing
            }
            else {
                salaryData.push(me.data_NhanSu[i].HESOLUONG_HIENTAI);
            }
        }
        salaryData.sort();//Arrange arr_age from small to big
        //Remove the same value, keep the only value in me.data_UniqSalary[] ;
        me.data_UniqSalary = salaryData.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        });
        //Count the same value 
        for (var j = 0; j < me.data_UniqSalary.length; j++) {
            var count = 0;
            for (var k = 0; k < salaryData.length; k++) {
                if (me.data_UniqSalary[j] == salaryData[k]) {
                    count++;
                }
            }
            me.data_SameSalary.push(count);
        }
        //Min - max medium salary
        var totalSalary = 0;
        var mediumSalary = 0;
        var min = 0;
        var max = 0;
        for (var h = 0; h < me.data_UniqSalary.length; h++) {
            totalSalary += parseFloat(me.data_UniqSalary[h]);
        }
        mediumSalary = parseFloat(totalSalary) / parseFloat(me.data_UniqSalary.length);
        min = me.data_UniqSalary[0];
        max = me.data_UniqSalary[me.data_UniqSalary.length - 1];
        $("#txtMinSalary").text(min);
        $("#txtMediumSalary").text(mediumSalary.toFixed(2));
        $("#txtMaxSalary").text(max);
        me.areaChart_HeSoLuong();
    },
    process_SinhNhat: function () {
        var me = this;
        var date = new Date();
        var thisMonth = date.getMonth() + 1;
        var thisDay = date.getDate();
        var strHoTen = "";
        var strGioiTinh = "";
        var strNgaySinh = "";
        var iTuoi = 0;
        var strAnhCaNhan = "";
        var strId = "";
        var arrSinhNhat = [];
        for (var i = 0; i < me.data_NhanSu.length; i++) {
            if (me.data_NhanSu[i].THANGSINH == "" || me.data_NhanSu[i].THANGSINH == null || me.data_NhanSu[i].THANGSINH == undefined) {
                //nothing
            }
            else {
                if (me.data_NhanSu[i].THANGSINH == thisMonth) {
                    arrSinhNhat.push(me.data_NhanSu[i]);
                }
            }
        }
        var byDate = arrSinhNhat.slice(0);
        byDate.sort(function (a, b) {
            return a.NGAYSINH - b.NGAYSINH;
        });
        for (var i = 0; i < byDate.length; i++) {
            strId = byDate[i].ID;
            strHoTen = byDate[i].HOTEN;
            strGioiTinh = byDate[i].GIOITINH_TEN;
            strNgaySinh = byDate[i].NGAYSINH + '/' + byDate[i].THANGSINH;
            iTuoi = edu.util.returnEmpty(byDate[i].TUOINHANSU);
            strAnhCaNhan = edu.system.getRootPathImg(edu.util.returnEmpty(byDate[i].ANHCANHAN), constant.setting.EnumImageType.ACCOUNT);
            var strClassSinhNhat = "";
            if (byDate[i].NGAYSINH == thisDay) strClassSinhNhat = "tr-bg";
            var html = "<img class='img-circle img-bordered-sm' height='35' width='35' src=" + strAnhCaNhan + ">" +
                "<span class='username " + strClassSinhNhat +"'>" +
                "<a href='#'>" + strHoTen + "(" + iTuoi + ")" + "</a>" +
                "</span>" +
                "<span class='description " + strClassSinhNhat +"'> - " + strNgaySinh + "</span>" +
                "<div class='clear'></div>";
            $("#sinhNhat").append(html);
        }
        //scroll
        $('#sinhNhat').slimScroll({
            position: 'right',
            height: "250px",
            railVisible: true,
            alwaysVisible: false
        });
    },
    /*----------------------------------------------
    --Date of created: 05/09/2017
    --Discription: Fill data into chart
    --API: 
    ----------------------------------------------*/
    barChart_BienDongNhanSu: function () {
        var me = this;
        //2.2 objChart
        var datasets = [
            {
                label: "Tổng",
                data: me.data_NhanSuTong,
                backgroundColor: '#eeff56'
            },
            {
                label: 'Tăng',
                data: me.data_NhanSuTang,
                backgroundColor: '#36a2eb'
            }
        ];
        var labels = me.arr_month;
        var objChart = {
            placement: "barChart",
            data: datasets,
            labels: labels,
            title: "BIỂU ĐỒ THỐNG KÊ TÀI CHÍNH THEO KHÓA "
        }
        edu.system.barChart(objChart);
    },
    bieChart_GioiTinh: function () {
        var me = this;
        //2.2 objChart
        var datasets = [
            {
                data: [me.iGioiTinhNam, me.iGioiTinhNu],
                backgroundColor: ['#eeff56', '#36a2eb'],
            }
        ];
        var objChart = {
            placement: "pieChart_GioiTinh",
            data: datasets,
            title: "THỐNG KÊ TỶ LỆ GIỚI TÍNH",
            labels: ["Nam", "Nữ"],
            type:"pie"
        }
        edu.system.doughnutChart(objChart);
    },
    bieChart_ChucDanh: function () {
        var me = this;
        //2.2 objChart
        var datasets = [
            {
                data: [me.iGiaoSu, me.iPhoGiaoSu, me.iTienSi, me.iThacSi, me.iBSDaKhoa, me.iBSChuyenKhoaII, me.iBSChuyenKhoaI, me.iCuNhan],
                backgroundColor: ['#eeff56', '#36a2eb', '#f39c12', '#f1f1f1', '#3c8dbc', '#00c0ef','green','blue'],
            }
        ];
        var objChart = {
            placement: "pieChart_ChucDanh",
            data: datasets,
            title: "THỐNG KÊ TỶ LỆ CHỨC DANH",
            labels: ["Giáo sư", "Phó giáo sư", "Tiến sĩ", "Thạc sĩ", "Bác sĩ ĐK", "Bác sĩ CKII", "Bác sĩ CKI", "Bác sĩ CKI"],
            type: "pie"
        }
        edu.system.doughnutChart(objChart);
    },
    areaChart_DoTuoi: function () {
        var me = this;
        var datasets = [
            {
                label: "Già hóa độ tuổi lao động",
                data: me.data_SameAge
            }
        ];
        var labels = me.data_UniqAge;
        var obj = {
            placement: "areaChart_Tuoi",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "THỐNG KÊ THEO ĐỘ TUỔI"
        }
        edu.system.lineChart(obj);
    },
    areaChart_HeSoLuong: function () {
        var me = this;
        var me = this;
        var datasets = [
            {
                label: "Hệ số lương",
                data: me.data_SameSalary
            }
        ];
        var labels = me.data_UniqSalary;
        var obj = {
            placement: "areaChart_HSLuong",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "THỐNG HỆ SỐ LƯƠNG THU NHẬP"
        }
        edu.system.lineChart(obj);
    },
};