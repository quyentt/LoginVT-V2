/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 15/01/2018
--Input:
--Output:
--Note:
--Updated by: 
--Date of updated: 
----------------------------------------------*/
function Dashboard() { };
Dashboard.prototype = {
    Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.buttonLoading();
        /*------------------------------------------
        --Discription: Initial this
        -------------------------------------------*/
        me.lineChart_BieuDoDuong();
    },
    pieChart_ThongKeTinhTrangKhaoSat: function () {
        var me = this;
        //get data
        var objChart = {};
        var data = [];
        var sophieugui = 0;
        var sophieutraloi = 0;
        for (var i = 0; i < me.dtThongKeTinhTrangKhaoSat.length; i++) {
            sophieugui += edu.system.returzero(me.dtThongKeTinhTrangKhaoSat[i].SOPHIEUDAGUI);
            sophieutraloi += edu.system.returzero(me.dtThongKeTinhTrangKhaoSat[i].SOPHIEUDATRALOI);
        }
        //
        data.push(sophieugui);
        data.push(sophieutraloi);
        //call chart
        objChart = {
            placement: "chart_TyLeKhaoSat",
            data: data,
            label: ["Đã gửi", "Đã trả lời"],
            background: ["red", "green"],
            title: "Tổng hợp",
        }
        edu.system.doughnutChart(objChart);
    },
    lineChart_BieuDoDuong: function () {
        var me = this;
        //1. variable
        var objChart = {
            placement: "chart_bieudoduong",
            labels: [],
            data: [],
            title: 'Biến động sinh viên hàng năm',
            titletooltip: [],
        }
        var dataset = {
            data: [],
            label: '',
            borderColor: '',
        };
        //2. Tạo data
        //------tạo đường 1
        dataset.data = [1, 5, 3];
        dataset.label = "Tên đường số 1";
        dataset.borderColor = 'red';

        objChart.data.push(dataset);
        dataset = {};
        //------tạo đường 2
        dataset.data = [2, 1, 4];
        dataset.label = "Tên đường số 2";
        dataset.borderColor = 'green';

        objChart.data.push(dataset);
        //3. call chart
        edu.system.lineChart(objChart);
    },
};