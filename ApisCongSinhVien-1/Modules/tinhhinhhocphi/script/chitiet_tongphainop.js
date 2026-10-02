/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 14/05/2018
--Input: 
--Output:
--API URL: 
--Note:
----------------------------------------------*/
function ChiTiet_TongPhaiNop() { };
ChiTiet_TongPhaiNop.prototype = {
    strUser_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.strUser_Id = edu.system.userId;
        /*------------------------------------------
        --Discription: Initial this
        -------------------------------------------*/
        me.getList_TongPhaiNop();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_TongPhaiNop();
        });
        $("#btnBack").click(function () {
            edu.util.goBack();
            edu.system.initMain('#tinhhinhhocphi', '/modules/tinhhinhhocphi/html/tinhhinhhocphi.aspx');
        });
    },
    /*------------------------------------------
    --Discription: call data from db
    --ULR:  Modules
    -------------------------------------------*/
    getList_TongPhaiNop: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CSV_ThongTinTaiChinh/LayDanhSach_PhaiNop',
            
            'strStudentId': me.strUser_Id,
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dataJson = data.Data;
                    me.genHTML_TongPhaiNop(dataJson);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("Lỗi_er: " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_TongPhaiNop: function (data) {
        var me = this;
        //Content tbody
        var jsonForm = {
            strTable_Id: "tblChiTiet",
            aaData: data,
            sort: true,
            colPos: {
                left: [],
                right: [3, 4],
                center: [0, 1, 2, 5],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strKyHoc = "Kỳ " + aData.HOCKY;
                        var strDotHoc = aData.DOTHOC;
                        if (edu.util.checkValue(strDotHoc)) {
                            strDotHoc = ", đợt " + strDotHoc;
                        }
                        else {
                            strDotHoc = "";
                        }
                        return '<span>' + strKyHoc + strDotHoc + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strLoaiKhoan_Ma = aData.LOAIKHOAN_MA;
                        var strLoaiKhoan_Ten = edu.util.returnEmpty(aData.LOAIKHOAN_TEN);
                        switch (strLoaiKhoan_Ma) {
                            case "HOCPHI":
                                return '<span class="label label-success">' + strLoaiKhoan_Ten + '</span>';
                                break;
                            case "KINHPHI":
                                return '<span class="label label-info">' + strLoaiKhoan_Ten + '</span>';
                                break;
                            default:
                                return '<span class="label label-default">' + strLoaiKhoan_Ten + '</span>';
                        }
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="color-active">' + edu.util.formatCurrency(aData.SOTIEN) + '</span>';
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="color-active">' + edu.util.formatCurrency(aData.SOTIENSAUKHITRUMIEN) + '</span>';
                    }
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
            ]
        };
        //Sum tfoot
        var tfoot = "";
        tfoot += '<tr>';
        tfoot += '<th></th>';
        tfoot += '<th></th>';
        tfoot += '<th>Tổng</th>';
        tfoot += '<th>' + edu.util.formatCurrency(TinhTong("SOTIEN")) + '</th>';
        tfoot += '<th>' + edu.util.formatCurrency(TinhTong("SOTIENSAUKHITRUMIEN")) + '</th>';
        tfoot += '<th></th>';
        tfoot += '</tr>';
        $("#tblChiTiet tfoot").html(tfoot);

        edu.system.loadToTable_data(jsonForm);

        function TinhTong(strTieuChi) {
            var sum = 0.0;
            for (var i = 0; i < data.length; i++) {
                var dGiaTri = data[i][strTieuChi];
                if (!isNaN(dGiaTri)) {
                    sum += dGiaTri;
                }
            }
            return sum.toFixed(2);
        }
    },
}