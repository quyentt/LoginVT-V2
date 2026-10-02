/*----------------------------------------------
--Updated by: nnthuong
--Date of created: 25/12/2018
----------------------------------------------*/
function Dashboard() { };
Dashboard.prototype = {
    Id: '',

    init: function () {
        var me = this;
        me.page_load();
    },
    page_load: function () {
        var me = this;
        me.getList_DeTai();
        me.getList_Sach();
        me.getList_BaiBaoQuocTe();
        me.getList_BaiBaoTrongNuoc();
    },
    /*----------------------------------------------
    --Date of created: 25/12/2018
    --Discription: Lay danh sach thong ke
    --API: 
    ----------------------------------------------*/
    getList_DeTai: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TK_DeTai/ThongKeDeTaiHangNam',
            

            'strNamBatDau': edu.util.thisYear() - 5,
            'strNamKeThuc': edu.util.thisYear(),
            'strTinhTrang_Id':""
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var strNam = [];
                    var strSoLuong = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        for (var i = 0; i < dtResult.length; i++) {
                            strNam.push(dtResult[i].NAM);
                            strSoLuong.push(dtResult[i].SOLUONG);
                            iPager += edu.util.returnEmpty(dtResult[i].SOLUONG, "NUM");
                        }
                    }
                    edu.util.viewHTMLById("totalDeTai", iPager);
                    me.lineChart_DeTai(strNam, strSoLuong);
                }
                else {
                    console.log("NCKH_TK_DeTai/ThongKeDeTaiHangNam: " + data.Message);
                }
                
            },
            error: function (er) {
                console.log("NCKH_TK_DeTai/ThongKeDeTaiHangNam (er): " + JSON.stringify(er));
                
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_Sach: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TK_Sach/ThongKeSachHangNam',
            

            'strNamBatDau': edu.util.thisYear() - 5,
            'strNamKeThuc': edu.util.thisYear(),
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var strNam = [];
                    var strSoLuong = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        for (var i = 0; i < dtResult.length; i++) {
                            strNam.push(dtResult[i].NAM);
                            strSoLuong.push(dtResult[i].SOLUONG);
                            iPager += edu.util.returnEmpty(dtResult[i].SOLUONG, "NUM");
                        }
                    }
                    edu.util.viewHTMLById("totalSach", iPager);
                    me.lineChart_Sach(strNam, strSoLuong);
                }
                else {
                    console.log("NCKH_TK_Sach/ThongKeSachHangNam: " + data.Message);
                }
                
            },
            error: function (er) {
                console.log("NCKH_TK_Sach/ThongKeSachHangNam (er): " + JSON.stringify(er));
                
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_BaiBaoQuocTe: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam',
            

            'strNamBatDau': edu.util.thisYear() - 5,
            'strNamKeThuc': edu.util.thisYear(),
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var strNam = [];
                    var strSoLuong = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        for (var i = 0; i < dtResult.length; i++) {
                            strNam.push(dtResult[i].NAM);
                            strSoLuong.push(dtResult[i].SOLUONG);
                            iPager += edu.util.returnEmpty(dtResult[i].SOLUONG, "NUM");
                        }
                    }
                    edu.util.viewHTMLById("totalTCQT", iPager);
                    me.lineChart_TapChiQuocTe(strNam, strSoLuong);
                }
                else {
                    console.log("NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam: " + data.Message);
                }
                
            },
            error: function (er) {
                console.log("NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam (er): " + JSON.stringify(er));
                
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_BaiBaoTrongNuoc: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam',
            

            'strNamBatDau': edu.util.thisYear() - 5,
            'strNamKeThuc': edu.util.thisYear(),
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var strNam = [];
                    var strSoLuong = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        for (var i = 0; i < dtResult.length; i++) {
                            strNam.push(dtResult[i].NAM);
                            strSoLuong.push(dtResult[i].SOLUONG);
                            iPager += edu.util.returnEmpty(dtResult[i].SOLUONG, "NUM");
                        }
                    }
                    edu.util.viewHTMLById("totalTCQG", iPager);
                    me.lineChart_TapChiQuocGia(strNam, strSoLuong);

                }
                else {
                    console.log("NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam: " + data.Message);
                }
                
            },
            error: function (er) {
                console.log("NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam (er): " + JSON.stringify(er));
                
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Date of created: 25/12/2018
    --Discription: Fill data into chart
    --API: 
    ----------------------------------------------*/
    lineChart_DeTai: function (dtLabel, data) {
        var me = this;
        var datasets = [
            {
                label: "Đề tài",
                data: data,
                backgroundColor: '#7ab26f'
            }
        ];
        var labels = dtLabel;
        var obj = {
            placement: "lineChart_DeTai",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "-- Biểu đồ thống kê số lượng đề tài hàng năm --"
        }
        edu.system.lineChart(obj);
    },
    lineChart_Sach: function (dtLabel, data) {
        var me = this;
        var datasets = [
            {
                label: "Sách xuất bản",
                data: data
            }
        ];
        var labels = dtLabel;
        var obj = {
            placement: "lineChart_Sach",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "-- Biểu đồ thống kê sách xuất bản hàng năm --"
        }
        edu.system.lineChart(obj);
    },

    lineChart_TapChiQuocTe: function (dtLabel, data) {
        var me = this;
        var datasets = [
            {
                label: "Bài báo quốc tế",
                data: data
            }
        ];
        var labels = dtLabel;
        var obj = {
            placement: "lineChart_TCQT",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "-- Biểu đồ thống kê tạp chí quốc tế hàng năm --"
        }
        edu.system.lineChart(obj);
    },
    lineChart_TapChiQuocGia: function (dtLabel, data) {
        var me = this;
        var datasets = [
            {
                label: "Tạp chí quốc gia",
                data: data
            }
        ];
        var labels = dtLabel;
        var obj = {
            placement: "lineChart_TCQG",
            data: datasets,
            labels: labels,
            titletooltip: labels,
            title: "-- Biểu đồ thống kê tạp chí quốc gia hàng năm --"
        }
        edu.system.lineChart(obj);
    },
};