/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 17/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TongHopTaiChinh() { };
TongHopTaiChinh.prototype = {
    dtTongHopTheoKhoanThu: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.getList_TongHop_TheoKhoa();
        me.toggleList_TongHopTheoKhoan();
        $(".btnClose").click(function () {
            me.toggleList_TongHopTheoKhoan();
        });
        /*------------------------------------------
        --Discription: Action detail TONGHOP
        -------------------------------------------*/
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongDoanhThu", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            if (me.dtTongHopTheoKhoanThu.length > 0) {
                me.genTable_ChiTiet_TongHopTheoKhoan(me.dtTongHopTheoKhoanThu, "TONGDOANHTHU");
            }
            else {
                me.getList_TongHop_TheoKhoanThu("TONGDOANHTHU");
            }
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongPhaiNop", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            if (me.dtTongHopTheoKhoanThu.length > 0) {
                me.genTable_ChiTiet_TongHopTheoKhoan(me.dtTongHopTheoKhoanThu, "TONGPHAINOP");
            }
            else {
                me.getList_TongHop_TheoKhoanThu("TONGPHAINOP");
            }
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongMien", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            if (me.dtTongHopTheoKhoanThu.length > 0) {
                me.genTable_ChiTiet_TongHopTheoKhoan(me.dtTongHopTheoKhoanThu, "TONGMIEN");
            }
            else {
                me.getList_TongHop_TheoKhoanThu("TONGMIEN");
            }
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongRut", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            if (me.dtTongHopTheoKhoanThu.length > 0) {
                me.genTable_ChiTiet_TongHopTheoKhoan(me.dtTongHopTheoKhoanThu, "TONGRUT");
            }
            else {
                me.getList_TongHop_TheoKhoanThu("TONGRUT");
            }
        });
        $("#zone_tong_du_no").delegate("#detail_Tong_Du_No", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            if (me.dtTongHopTheoKhoanThu.length > 0) {
                me.genTable_ChiTiet_TongHopTheoKhoan(me.dtTongHopTheoKhoanThu, "");
            }
            else {
                me.getList_TongHop_TheoKhoanThu("");
            }
        });
        /*------------------------------------------
        --Discription: Action detail TONGHOP for USER
        -------------------------------------------*/
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongDoanhThu_User", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
            var strLoai = "TongDoanhThu";
            me.getDetail_TongHop_User(strLoai);
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongPhaiNop_User", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
            var strLoai = "TongPhaiNop";
            me.getDetail_TongHop_User(strLoai);
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongMien_User", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
            var strLoai = "TongMien";
            me.getDetail_TongHop_User(strLoai);
        });
        $("#zone_list_tonghoptheokhoan").delegate("#detail_TongRut_User", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
            var strLoai = "TongRut";
            me.getDetail_TongHop_User(strLoai);
        });
        $("#zone_tong_du_no").delegate("#detail_Tong_Du_No_User", "click", function () {
            me.toggleDetail_TongHopTheoKhoan();
            //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
            var strLoai = "Tong_Du_No";
            me.getDetail_TongHop_User(strLoai);
        });
        /*------------------------------------------
        --Discription: Action search
        -------------------------------------------*/
        $("#txtSearch_TongHopTheoKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_BarChart_TongHopTheoKhoa").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    },
    /*------------------------------------------
    --Discription: [--]. common
    -------------------------------------------*/
    toggleList_TongHopTheoKhoan: function () {
        $("#zone_list_tonghoptheokhoan").show();
        $("#zone_detail_tonghoptheokhoan").hide();
    },
    toggleDetail_TongHopTheoKhoan: function () {
        $("#zone_list_tonghoptheokhoan").hide();
        $("#zone_detail_tonghoptheokhoan").show();
    },
    /********************************************
    --Discription: [A]. GET DATA FROM DB
    ********************************************/
    /*------------------------------------------
    --Discription: [1] Tonghoptheokhoa ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    getList_TongHop_TheoKhoa: function () {
        var me = this;
        var strKhoaHoc_Id = '';
        //--Edit
        var obj_list = {
            'action': 'TC_ThongKe/LayDuLieuTongHopDuLieuTheoKhoa',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TongHop_TheoKhoa(data.Data);
                        me.genHTML_TongDu_No_TheoKhoa(data.Data);
                    }
                }
                else {
                    edu.util.alert("Lỗi: " + data.Message, "w");
                }
                me.getList_TongHop();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.util.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] Tonghop ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    getList_TongHop: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_ThongKe/LayDuLieuTongHop',
            'versionAPI': 'v1.0',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.barChart_TongHop(data.Data);
                    }
                }
                else {
                    edu.util.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.util.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] Tonghoptheokhoanthu ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    getList_TongHop_TheoKhoanThu: function (strLoai) {
        var me = this;
        var strKhoaHoc_Id = '';
        //--Edit
        var obj_list = {
            'action': 'TC_ThongKe/LayDuLieuTongHopTheoKhoanThu',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        //
                        me.dtTongHopTheoKhoanThu = data.Data;
                        me.genTable_ChiTiet_TongHopTheoKhoan(data.Data, strLoai);
                    }
                }
                else {
                    edu.util.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.util.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
   --Discription: [4] detail Tonghop for User
   -------------------------------------------*/
    getDetail_TongHop_User: function (strLoai) {
        //get detail for student (user)
        //strloai = Tong_Du_No | TongDoanhThu | TongPhaiNop| TongMien| TongRut
        var me = this;
        var strLoaiThongTin = strLoai;
        var strKhoaHoc_Id = "";
        var strTAICHINH_CacKhoanThu_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;

        var obj_list = {
            'action': 'TC_ThongKe/LayCTDuLieuTongHop',
            'versionAPI': 'v1.0',

            'strLoaiThongTin': strLoaiThongTin,
            'strKhoaHoc_Id': strKhoaHoc_Id,
            'strTAICHINH_CacKhoanThu_Id': strTAICHINH_CacKhoanThu_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        var dtResult = data.Data;
                        var iPager = data.Pager;
                        me.genTable_ChiTiet_TongHop_User(dtResult, iPager, strLoai);
                    }
                }
                else {
                    edu.util.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.util.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /********************************************
    --Discription: [B]. GEN HTMl
    ********************************************/

    /*------------------------------------------
    --Discription: [A.1] Tonghoptheokhoa ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    genHTML_TongHop_TheoKhoa: function (data) {
        var me = this;
        var html = '';
        //1. get data
        var dTongDoanhThu = edu.util.formatCurrency(edu.util.returnEmpty(data[0].TONGDOANHTHU));
        var dTongPhaiNop = edu.util.formatCurrency(edu.util.returnEmpty(data[0].TONGPHAINOP));
        var dTongMien = edu.util.formatCurrency(edu.util.returnEmpty(data[0].TONGMIEN));
        var dTongRut = edu.util.formatCurrency(edu.util.returnEmpty(data[0].TONGRUT));
        //2. gen html

        $("#zone_tonghop").html('');
        html += '<div class="col-md-3 col-sm-6 col-xs-12">';
        html += '<div class="info-box">';
        html += '<span class="info-box-icon round bg-green"><i class="fa-solid fa-display-chart-up-circle-dollar"></i></span>';
        html += '<div class="info-box-content">';
        html += '<span class="info-box-text">TỔNG DOANH THU</span>';
        html += '<span class="info-box-number">' + dTongDoanhThu + '</span>';
        html += '<span class="info-box-link">';
        html += '<a id="detail_TongDoanhThu" href="#" title="Chi tiết theo khoản"><i class="fa fa-arrow-circle-o-right "></i> Chi tiết</a> | ';
        html += '<a id="detail_TongDoanhThu_User" href="#" title="Chi tiết theo đối tượng"><i class="fa fa-user-circle"></i> Chi tiết</a>';
        html += '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12">';
        html += '<div class="info-box">';
        html += '<span class="info-box-icon round bg-blue"><i class="fa-solid fa-sack-dollar"></i></span>';
        html += '<div class="info-box-content">';
        html += '<span class="info-box-text">TỔNG PHẢI NỘP</span>';
        html += '<span class="info-box-number">' + dTongPhaiNop + '</span>';
        html += '<span class="info-box-link">';
        html += '<a id="detail_TongPhaiNop" href="#" title="Chi tiết theo khoản"><i class="fa fa-arrow-circle-o-right "></i> Chi tiết</a> | ';
        html += '<a id="detail_TongPhaiNop_User" href="#" title="Chi tiết theo đối tượng"><i class="fa fa-user-circle"></i> Chi tiết</a>';
        html += '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12">';
        html += '<div class="info-box">';
        html += '<span class="info-box-icon round bg-red"><i class="fa-solid fa-circle-dollar-to-slot"></i></span>';
        html += '<div class="info-box-content">';
        html += '<span class="info-box-text">TỔNG MIỄN</span>';
        html += '<span class="info-box-number">' + dTongMien + '</span>';
        html += '<span class="info-box-link">';
        html += '<a id="detail_TongMien" href="#" title="Chi tiết theo khoản"><i class="fa fa-arrow-circle-o-right "></i> Chi tiết</a> | ';
        html += '<a id="detail_TongMien_User" href="#" title="Chi tiết theo đối tượng"><i class="fa fa-user-circle"></i> Chi tiết</a>';
        html += '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12">';
        html += '<div class="info-box">';
        html += '<span class="info-box-icon round bg-puple"><i class="fa-duotone fa-regular fa-money-simple-from-bracket"></i></span>';
        html += '<div class="info-box-content">';
        html += '<span class="info-box-text">TỔNG RÚT</span>';
        html += '<span class="info-box-number">' + dTongRut + '</span>';
        html += '<span class="info-box-link">';
        html += '<a id="detail_TongRut" href="#" title="Chi tiết theo khoản"><i class="fa fa-arrow-circle-o-right "></i> Chi tiết</a> | ';
        html += '<a id="detail_TongRut_User" href="#" title="Chi tiết theo đối tượng"><i class="fa fa-user-circle"></i> Chi tiết</a>';
        html += '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("#zone_tonghop").html(html);
    },
    genHTML_TongDu_No_TheoKhoa: function (data) {
        var me = this;

        var dTongDu_No = edu.util.formatCurrency(edu.util.returnZero(data[0].TONG_DU_NO));
        var html = '';
        var status_bar = '';
        var color = '';
        //1. check status to change color
        if (dTongDu_No > 0) {
            status_bar = 'progress-bar-success';
            color = 'color-active';
        }
        else {
            status_bar = 'progress-bar-danger';
            color = 'color-danger';
        }
        //2. gen html
        $("#zone_tong_du_no").html('');
        html += '<i class="fa fa-balance-scale ' + color + '"></i>';
        html += '<span class="info-box-link">';
        html += '<span class="' + color + '">' + dTongDu_No + '</span>';
        html += ' <a href="#" id="detail_Tong_Du_No" title="Chi tiết theo khoản"> <i class="fa fa-arrow-circle-o-right "></i></a>'
        html += ' | <a href="#" id="detail_Tong_Du_No_User" title="Chi tiết theo đối tượng"><i class="fa fa-user-circle"></i></a>'
        html += '</span>';
        html += '<div class="progress progress-xxs">';
        html += '<div class="progress-bar ' + status_bar + ' progress-bar-striped" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 100%">';
        html += '<span class="sr-only"></span>';
        html += '</div>';
        html += '</div>';
        $("#zone_tong_du_no").html(html);
    },
    /*------------------------------------------
    --Discription: [A.2] Tonghop ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    barChart_TongHop: function (data) {
        //variable and setup data
        var arrKhoa_Ten = [];
        var arrTongDoanhThu = [];
        var arrTongPhaiNop = [];
        var arrTongMien = [];
        var arrTongRut = [];
        var arrTongDu_No = [];
        var arrNam = [];
        var html = '';
        //1. get Nam
        for (var j = 0; j < data.length; j++) {
            if (!edu.util.arrCheckExist(arrNam, data[j].NAMNHAPHOC)) {
                arrNam.push(data[j].NAMNHAPHOC);
            }
        }
        //2. main
        for (var h = 0; h < arrNam.length; h++) {
            for (var i = 0; i < data.length; i++) {
                strNam = edu.util.returnEmpty(data[i].NAMNHAPHOC);
                if (strNam == arrNam[h]) {
                    arrKhoa_Ten = [];
                    arrTongDoanhThu = [];
                    arrTongPhaiNop = [];
                    arrTongMien = [];
                    arrTongRut = [];
                    arrTongDu_No = [];

                    arrKhoa_Ten.push(edu.util.returnEmpty(data[i].TENKHOA));
                    arrTongDoanhThu.push(edu.util.returnZero(data[i].TONGDOANHTHU));
                    arrTongPhaiNop.push(edu.util.returnZero(data[i].TONGPHAINOP));
                    arrTongMien.push(edu.util.returnZero(data[i].TONGMIEN));
                    arrTongRut.push(edu.util.returnZero(data[i].TONGRUT));
                    arrTongDu_No.push(edu.util.returnZero(data[i].TONG_DU_NO));

                    //2.1 gen place to filll chart
                    html = '';
                    var palce = "barChart_TongHopTheoKhoa" + h + i;
                    html = '<div class="col-sm-6"><canvas id="' + palce + '"></canvas></div>';
                    $("#zone_BarChart_TongHopTheoKhoa").append(html);

                    //2.2 objChart
                    var datasets = [
                        {
                            label: "Doanh thu",
                            data: arrTongDoanhThu,
                            backgroundColor: '#eeff56'
                        },
                        {
                            label: 'Phải nộp',
                            data: arrTongPhaiNop,
                            backgroundColor: '#36a2eb'
                        },
                        {
                            label: 'Miễn',
                            data: arrTongMien,
                            backgroundColor: '#cc65fe'
                        },
                        {
                            label: 'Rút',
                            data: arrTongRut,
                            backgroundColor: '#ffce56'
                        },
                        {
                            label: 'Dư nợ',
                            data: arrTongDu_No,
                            backgroundColor: '#ff6384'
                        }

                    ];
                    var labels = arrKhoa_Ten;
                    var objChart = {
                        placement: palce,
                        data: datasets,
                        labels: labels,
                        title: "BIỂU ĐỒ THỐNG KÊ TÀI CHÍNH THEO KHÓA " + arrNam[h]
                    }
                    edu.system.barChart(objChart);
                }
            }
        }
    },
    /*------------------------------------------
    --Discription: [3] Tonghoptheokhoanthu ==> doanhthu/phainop/mien/rut/du_no
    -------------------------------------------*/
    genTable_ChiTiet_TongHopTheoKhoan: function (data, strLoai) {
        var tbody = '';
        var thead = '';
        $("#changetbldata_TongHopTheoKhoan").remove();
        $("#tbldata_TongHopTheoKhoan_filter").remove();
        $("#tbldata_infotbldata_TongHopTheoKhoan").remove();
        $("#light-paginationtbldata_TongHopTheoKhoan").remove();


        $("#tbldata_TongHopTheoKhoan tbody").html("");
        $("#tbldata_TongHopTheoKhoan thead").html("");

        genThead();
        switch (strLoai) {
            case "TONGDOANHTHU":
                genTbody("TONGDOANHTHU");
                break;
            case "TONGPHAINOP":
                genTbody("TONGPHAINOP");
                break;
            case "TONGMIEN":
                genTbody("TONGMIEN");
                break;
            case "TONGRUT":
                genTbody("TONGRUT");
                break;
            default:
                genTbody("TONG_DU_NO");
        }
        $("#tbldata_TongHopTheoKhoan tbody").html(tbody);

        function genThead() {
            thead += '<tr>';
            thead += '<th class="td-fixed td-center">Stt</th>';
            thead += '<th class="td-left">Khoản</th>';
            thead += '<th class="td-right">Số tiền</th>';
            thead += '</tr>';
            $("#tbldata_TongHopTheoKhoan thead").html(thead);
        }
        function genTbody(strLoai) {
            for (var i = 0; i < data.length; i++) {
                tbody += '<tr>';
                tbody += '<td>' + (i + 1) + '</td>';
                tbody += '<td>' + edu.util.returnEmpty(data[i].TEN) + '</td>';
                tbody += '<td  class="td-right color-danger">' + edu.util.formatCurrency(edu.util.returnZero(data[i][strLoai])) + '</td>';
                tbody += '</tr>';
            }
        }
    },
    /*------------------------------------------
    --Discription: [4] detail Tonghop for User
    -------------------------------------------*/
    genTable_ChiTiet_TongHop_User: function (data, iPager, strLoai) {
        var me = this;

        var thead = "";
        $("#changetbldata_TongHopTheoKhoan").remove();
        $("#tbldata_TongHopTheoKhoan_filter").remove();
        $("#tbldata_infotbldata_TongHopTheoKhoan").remove();
        $("#light-paginationtbldata_TongHopTheoKhoan").remove();


        $("#tbldata_TongHopTheoKhoan thead").html('');
        //1. gen thead
        thead += '<tr>';
        thead += '<th class="td-fixed td-center">Stt</th>';
        thead += '<th class="td-left">Mã số</th>';
        thead += '<th class="td-left">Họ tên</th>';
        thead += '<th class="td-left">Khoản</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#tbldata_TongHopTheoKhoan thead").html(thead);

        //2. gen tbody
        var jsonForm = {
            strTable_Id: "tbldata_TongHopTheoKhoan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TongHopTaiChinh.getDetail_TongHop_User('" + strLoai + "')",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [1, 2, 3],
                right: [4],
                center: [0],
                fix: [0]
            },
            aoColumns: [
            {
                "mDataProp": "MASO"
            }
            ,
            {
                "mDataProp": "HOVATEN"
            }
            , {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }, {
                "mRender": function (nRow, aData) {
                    var dSoTien = edu.util.formatCurrency(edu.util.returnZero(aData.SOTIEN));
                    return '<span class="color-danger">' + dSoTien + '</span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },
}