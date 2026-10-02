/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 17/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function HachToanTaiChinh() { };
HachToanTaiChinh.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.getList_TongHopChung_No();
        me.getList_TongHopChung_Du();
        me.getList_TongHopRieng_No();
        me.getList_TongHopRieng_Du();

        me.toggleList_HachToan();
        $(".btnClose").click(function () {
            me.toggleList_HachToan();
        });
        /*------------------------------------------
        --Discription: Action detail KHOANCHUNG/RIENG
        -------------------------------------------*/
        $("#zoneKhoanChung").delegate(".btnDetail_KhoanChung_Du", "click", function () {
            me.toggleDetail_NhapHoc();
            me.getList_TongHopKhoanChung_Du();
        });
        $("#zoneKhoanChung").delegate(".btnDetail_KhoanChung_No", "click", function () {
            me.toggleDetail_NhapHoc();
            me.getList_TongHopKhoanChung_No();
        });
        $("#zoneKhoanRieng").delegate(".btnDetail_KhoanRieng_Du", "click", function () {
            me.toggleDetail_NhapHoc();
            me.getList_TongHopKhoanRieng_Du();
        });
        $("#zoneKhoanRieng").delegate(".btnDetail_KhoanRieng_No", "click", function () {
            me.toggleDetail_NhapHoc();
            me.getList_TongHopKhoanRieng_No();
        });
        /*------------------------------------------
        --Discription: Action detail KHOANCHUNG/RIENG for User
        -------------------------------------------*/
        $("#zoneKhoanChung").delegate("#btnDetail_KhoanChung_Du_User", "click", function () {
            me.toggleDetail_NhapHoc();
            //strLoai: taichinh_tonghop_No_chung | taichinh_tonghop_No_Rieng | taichinh_tonghop_Du_Rieng | taichinh_tonghop_Du_chung
            var strLoai = "taichinh_tonghop_Du_chung"
            me.getDetail_DuNoChungRieng_User(strLoai);
        });
        $("#zoneKhoanChung").delegate("#btnDetail_KhoanChung_No_User", "click", function () {
            me.toggleDetail_NhapHoc();
            //strLoai: taichinh_tonghop_No_chung | taichinh_tonghop_No_Rieng | taichinh_tonghop_Du_Rieng | taichinh_tonghop_Du_chung
            var strLoai = "taichinh_tonghop_No_chung"
            me.getDetail_DuNoChungRieng_User(strLoai);
        });
        $("#zoneKhoanRieng").delegate("#btnDetail_KhoanRieng_Du_User", "click", function () {
            me.toggleDetail_NhapHoc();
            //strLoai: taichinh_tonghop_No_chung | taichinh_tonghop_No_Rieng | taichinh_tonghop_Du_Rieng | taichinh_tonghop_Du_chung
            var strLoai = "taichinh_tonghop_Du_Rieng"
            me.getDetail_DuNoChungRieng_User(strLoai);
        });
        $("#zoneKhoanRieng").delegate("#btnDetail_KhoanRieng_No_User", "click", function () {
            me.toggleDetail_NhapHoc();
            //strLoai: taichinh_tonghop_No_chung | taichinh_tonghop_No_Rieng | taichinh_tonghop_Du_Rieng | taichinh_tonghop_Du_chung
            var strLoai = "taichinh_tonghop_No_Rieng"
            me.getDetail_DuNoChungRieng_User(strLoai);
        });
    },
    /********************************************
    --------------ZONE: [^^] COMMON--------------
    ********************************************/
    toggleList_HachToan: function () {
        $("#zone_list_hachtoan").show();
        $("#zone_detail_hachtoan").hide();
    },
    toggleDetail_NhapHoc: function () {
        $("#zone_list_hachtoan").hide();
        $("#zone_detail_hachtoan").show();
    },
    /********************************************
    -----ZONE: [A] GET DATA FROM DATABASE--------
    ********************************************/
    /*------------------------------------------
    --Discription: [1] TONG HOP ==> KHOAN CHUNG/RIENG
    -------------------------------------------*/
    getList_TongHopChung_No: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopNoChung',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TongHopChung_No(data.Data);
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
    getList_TongHopChung_Du: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopDuChung',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TongHopChung_Du(data.Data);
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
    getList_TongHopRieng_No: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopNoRieng',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TongHopRieng_No(data.Data);
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
    getList_TongHopRieng_Du: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopDuRieng',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TongHopRieng_Du(data.Data);
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
    --Discription: [2] CHITIET ==> KHOAN CHUNG/RIENG
    -------------------------------------------*/
    getList_TongHopKhoanChung_Du: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopDuChungTheoKhoan',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        //"TONGDU" ==> truong thong tin muon lay du lieu
                        me.genDetail_DuNoChungRieng(data.Data, "TONGDU");
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
    getList_TongHopKhoanChung_No: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopNoChungTheoKhoan',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        //"TONGNO" ==> truong thong tin muon lay du lieu
                        me.genDetail_DuNoChungRieng(data.Data, "TONGNO");
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
    getList_TongHopKhoanRieng_Du: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopDuRiengTheoKhoan',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        //"TONGDU" ==> truong thong tin muon lay du lieu
                        me.genDetail_DuNoChungRieng(data.Data, "TONGDU");
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
    getList_TongHopKhoanRieng_No: function () {
        var me = this;
        var strKhoaHoc_Id = "";

        var obj_list = {
            'action': 'TC_ThongKe/LayTongHopNoRiengTheoKhoan',
            'versionAPI': 'v1.0',
            'strKhoaHoc_Id': strKhoaHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        //"TONGNO" ==> truong thong tin muon lay du lieu
                        me.genDetail_DuNoChungRieng(data.Data, "TONGNO");
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
    --Discription: [3] CHITIET ==> KHOAN CHUNG/RIENG for USER
    -------------------------------------------*/
    getDetail_DuNoChungRieng_User: function (strLoai) {
        var me = this;
        //taichinh_tonghop_No_chung | taichinh_tonghop_No_Rieng | taichinh_tonghop_Du_Rieng | taichinh_tonghop_Du_chung
        var strLoaiThongTin = strLoai;
        var strKhoaHoc_Id = "";
        var strTAICHINH_CacKhoanThu_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;

        var obj_list = {
            'action': 'TC_ThongKe/LayCTDuLieuDuNoChungRieng',
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
                        me.genDetail_DuNoChungRieng_User(dtResult, iPager, strLoai);
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
    -------------ZONE: [B] GEN HTML-------------
    ********************************************/
    /*------------------------------------------
    --Discription: [1] TONG HOP ==> KHOAN CHUNG/RIENG
    -------------------------------------------*/
    genHTML_TongHopChung_Du: function (data) {
        //
        var me = this;
        me.proSeqObj(data, "TONGDU").then(function (dTong) {
            edu.util.resetHTMLById("lblTongHopChung_Du");
            edu.util.viewHTMLById("lblTongHopChung_Du", edu.util.formatCurrency(dTong));
        });
    },
    genHTML_TongHopChung_No: function (data) {
        //
        var me = this;
        me.proSeqObj(data, "TONGNO").then(function (dTongChung_No) {
            edu.util.resetHTMLById("lblTongHopChung_No");
            edu.util.viewHTMLById("lblTongHopChung_No", edu.util.formatCurrency(dTongChung_No));
        });
    },
    genHTML_TongHopRieng_Du: function (data) {
        //
        var me = this;
        me.proSeqObj(data, "TONGDU").then(function (dTongRieng_Du) {
            edu.util.resetHTMLById("lblTongHopRieng_Du");
            edu.util.viewHTMLById("lblTongHopRieng_Du", edu.util.formatCurrency(dTongRieng_Du));
        });
    },
    genHTML_TongHopRieng_No: function (data) {
        //
        var me = this;
        me.proSeqObj(data, "TONGNO").then(function (dTongRieng_No) {
            edu.util.resetHTMLById("lblTongHopRieng_No");
            edu.util.viewHTMLById("lblTongHopRieng_No", edu.util.formatCurrency(dTongRieng_No));
        });
    },
    proSeqObj: function (obj, item) {
        var index = 0;
        var sum = 0;
        var promise = new Promise(function (resolve, reject) {
            function next() {
                if (index < obj.length) {
                    sum += edu.util.returnZero(obj[index++][item]);
                    next();
                } else {
                    resolve(sum);
                }
            }
            next();
        });
        return promise;
    },
    /*------------------------------------------
    --Discription: [2] CHITIET ==> KHOAN CHUNG/RIENG
    -------------------------------------------*/
    genDetail_DuNoChungRieng: function (data, strThongTin) {

        var tbody = '';
        var thead = '';
        $("#changetbldataChiTiet").remove();
        $("#tbldataChiTiet_filter").remove();
        $("#tbldata_infotbldataChiTiet").remove();
        $("#light-paginationtbldataChiTiet").remove();


        $("#tbldataChiTiet thead").html('');
        $("#tbldataChiTiet tbody").html('');
        //1. gen thead
        thead += '<tr>';
        thead += '<th class="td-fixed  td-center w50px">Stt</th>';
        thead += '<th class="td-left">Khoản</th>';
        thead += '<th class="td-center">Số tiền</th>';
        thead += '<th class="td-fixed td-center">Chi tiết</th>';
        thead += '</tr>';
        $("#tbldataChiTiet thead").html(thead);
        //2. gen tbody
        for (var i = 0; i < data.length; i++) {
            tbody += '<tr>';
            tbody += '<td class="td-center">' + (i + 1) + '</td>';
            tbody += '<td class="td-left">' + edu.util.returnEmpty(data[i].TEN) + '</td>';
            tbody += '<td class="td-center color-danger">' + edu.util.formatCurrency(edu.util.returnZero(data[i][strThongTin])) + '</td>';
            tbody += '<td class="td-center"><a class="btn btn-default btn-circle"><i class="fa fa-info-circle color-active"></i><a></td>';
            tbody += '</tr>';
        }
        $("#tbldataChiTiet tbody").append(tbody);
    },
    /*------------------------------------------
    --Discription: [3] CHITIET ==> KHOAN CHUNG/RIENG for USER
    -------------------------------------------*/
    genDetail_DuNoChungRieng_User: function (data, iPager, strLoai) {
        var me = this;
        var thead = '';
        $("#changetbldataChiTiet").remove();
        $("#tbldataChiTiet_filter").remove();
        $("#tbldata_infotbldataChiTiet").remove();
        $("#light-paginationtbldataChiTiet").remove();


        $("#tbldataChiTiet thead").html('');
        //gen thead
        thead += '<tr>';
        thead += '<th class="td-fixed  td-center">Stt</th>';
        thead += '<th class="td-left">Mã số</th>';
        thead += '<th class="td-left">Họ tên</th>';
        thead += '<th class="td-left">Khoản</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#tbldataChiTiet thead").html(thead);
        //gen tbody
        var jsonForm = {
            strTable_Id: "tbldataChiTiet",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HachToanTaiChinh.getDetail_DuNoChungRieng_User('" + strLoai + "')",
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
            },
            {
                "mDataProp": "HOVATEN"
            }
            , {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }
            , {
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