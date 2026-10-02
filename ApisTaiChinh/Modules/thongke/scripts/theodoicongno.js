/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 22/07/2018
--API URL: TheoDoiCongNo
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function TheoDoiCongNo() { };
TheoDoiCongNo.prototype = {
    dtNoChung: '',
    dtNoChung_ThoiGianTinh: '',
    dtNoChung_LoaiKhoan: '',

    dtNoRieng: '',
    dtNoRieng_ThoiGianTinh: '',
    dtNoRieng_LoaiKhoan: '',


    dtDuChung: '',
    dtDuChung_ThoiGianTinh: '',
    dtDuChung_LoaiKhoan: '',

    dtDuRieng: '',
    dtDuRieng_ThoiGianTinh: '',
    dtDuRieng_LoaiKhoan: '',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinh();
        me.getList_CongNo_NoChung();
        /*------------------------------------------
		--Discription: [1] Action common
		-------------------------------------------*/
        me.showHide_Box("tab-content", "zonelist_tdcn");
        $(".btnClose").click(function () {
            me.showHide_Box("tab-content", "zonelist_tdcn");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.toggleInput_MucDonViPhi();
        });
        $(".input-group-addon").click(function () {
            if ($('#content_search').is(':visible')) {
                $("#content_search").slideUp(200);
                $("#btnSearch_TDCN").removeAttr("style");
            }
            if ($('#content_search').is(':hidden')) {
                $("#content_search").slideDown(200);
                $("#btnSearch_TDCN").css("margin-top", "100px");
            }
        });
        /*------------------------------------------
		--Discription: [2] Action TheoDoiCongNo
		-------------------------------------------*/
        $("#tblNoChung").delegate(".btnDetail_NoChung", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/detail_nochung/g, selected_id);

            if (edu.util.checkValue(selected_id)) {
                me.showHide_Box("tab-content", "zonedetail_tdcn");
                console.log("selected_id: " + selected_id);
                me.getDetail_CongNo_DuChung(selected_id);
            }
        });
        $("#tblDuChung").delegate(".btnDetail_DuChung", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/chuongtrinh_id/g, selected_id);

            if (edu.util.checkValue(selected_id)) {
                me.showHide_Box("tab-content", "zonedetail_tdcn");
                //me.select_ChuongTrinh(selected_id);
            }
        });
        $("#btnSearch_TDCN").click(function () {
            if (edu.util.checkActive_Tab("tab1")) {
                me.getList_CongNo_NoChung();
            }
            else if (edu.util.checkActive_Tab("tab2")) {
                me.getList_CongNo_NoRieng();
            }
            else if (edu.util.checkActive_Tab("tab3")) {
                me.getList_CongNo_DuChung();
            }
            else {
                me.getList_CongNo_DuRieng();
            }
        });
        /*------------------------------------------
		--Discription: [3] Action -for TAB
		-------------------------------------------*/
        $("#tab_congno").delegate('a[href="#tab1_nochung"]', 'click', function () {
            //Load 1 lan khi click vao tab
            if (me.dtNoChung.length == 0) {
                me.getList_CongNo_NoChung();
            }
            else {
                me.genHTML_CongNo_ThoiGianTinh(me.dtNoChung_ThoiGianTinh);
                me.genHTML_CongNo_LoaiKhoan(me.dtNoChung_LoaiKhoan, "TONGNO");
            }
        });
        $("#tab_congno").delegate('a[href="#tab2_norieng"]', 'click', function () {
            //Load 1 lan khi click vao tab
            if (me.dtNoRieng.length == 0) {
                me.getList_CongNo_NoRieng();
            }
            else {
                me.genHTML_CongNo_ThoiGianTinh(me.dtNoRieng_ThoiGianTinh);
                me.genHTML_CongNo_LoaiKhoan(me.dtNoRieng_LoaiKhoan, "TONGNO");
            }
        });
        $("#tab_congno").delegate('a[href="#tab3_duchung"]', 'click', function () {
            //Load 1 lan khi click vao tab
            if (me.dtDuChung.length == 0) {
                me.getList_CongNo_DuChung();
            }
            else {
                me.genHTML_CongNo_ThoiGianTinh(me.dtDuChung_ThoiGianTinh);
                me.genHTML_CongNo_LoaiKhoan(me.dtDuChung_LoaiKhoan, "TONGDU");
            }
        });
        $("#tab_congno").delegate('a[href="#tab4_durieng"]', 'click', function () {
            //Load 1 lan khi click vao tab
            if (me.dtDuRieng.length == 0) {
                me.getList_CongNo_DuRieng();
            }
            else {
                me.genHTML_CongNo_ThoiGianTinh(me.dtDuRieng_ThoiGianTinh);
                me.genHTML_CongNo_LoaiKhoan(me.dtDuRieng_LoaiKhoan, "TONGDU");
            }
        });
    },
    /*------------------------------------------
    --Discription: [1] Hàm chung 
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        var arrId = ["dropHocKy_MDVP", "txtSoTien_MDVP", "dropKhoanThu_MDVP", "dropKieuHoc_MDVP"];
        edu.util.resetValByArrId(arrId);
        //reset table
        me.arrChuongTrinh_Id = [];
        $("#tbldata_ChuongTrinh_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
    },
    /*------------------------------------------
    --Discription: [2] ACCESS DB TheoDoiCongNo
    -------------------------------------------*/
    getList_CongNo_NoChung: function () {
        console.log("tab1");
        var me = this;
        var strHeDaoTao_Id = "";
        var strKhoaDaoTao_Id = "";
        var strChuongTrinh_Id = "";
        var strLopQuanLy_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;


        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNo_NoChung',
            'versionAPI': 'v1.0',

            'strHeDaoTao_Id': strHeDaoTao_Id,
            'strKhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strChuongTrinh_Id': strChuongTrinh_Id,
            'strLopQuanLy_Id': strLopQuanLy_Id,
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
                        //
                        me.dtNoChung_ThoiGianTinh = data.Data.rsThoiGian;
                        me.dtNoChung_LoaiKhoan = data.Data.rsThongTinTongHop;
                        me.dtNoChung = data.Data.rsThongTinSinhVien;
                        //
                        me.genTable_CongNo_NoChung(me.dtNoChung, data.Pager);
                        me.genHTML_CongNo_ThoiGianTinh(me.dtNoChung_ThoiGianTinh);
                        me.genHTML_CongNo_LoaiKhoan(me.dtNoChung_LoaiKhoan, "TONGNO");
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
    getList_CongNo_NoRieng: function () {
        console.log("tab2");
        var me = this;
        var strHeDaoTao_Id = "";
        var strKhoaDaoTao_Id = "";
        var strChuongTrinh_Id = "";
        var strLopQuanLy_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;


        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNo_NoRieng',
            'versionAPI': 'v1.0',

            'strHeDaoTao_Id': strHeDaoTao_Id,
            'strKhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strChuongTrinh_Id': strChuongTrinh_Id,
            'strLopQuanLy_Id': strLopQuanLy_Id,
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
                        me.dtNoRieng_ThoiGianTinh = data.Data.rsThoiGian;
                        me.dtNoRieng_LoaiKhoan = data.Data.rsThongTinTongHop;
                        me.dtNoRieng = data.Data.rsThongTinSinhVien;
                        //
                        me.genTable_CongNo_NoRieng(me.dtNoRieng, data.Pager);
                        me.genHTML_CongNo_ThoiGianTinh(me.dtNoRieng_ThoiGianTinh);
                        me.genHTML_CongNo_LoaiKhoan(me.dtNoRieng_LoaiKhoan, "TONGNO");
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
    getList_CongNo_DuChung: function () {
        console.log("tab3");
        var me = this;
        var strHeDaoTao_Id = "";
        var strKhoaDaoTao_Id = "";
        var strChuongTrinh_Id = "";
        var strLopQuanLy_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;


        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNo_DuChung',
            'versionAPI': 'v1.0',

            'strHeDaoTao_Id': strHeDaoTao_Id,
            'strKhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strChuongTrinh_Id': strChuongTrinh_Id,
            'strLopQuanLy_Id': strLopQuanLy_Id,
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
                        me.dtDuChung_ThoiGianTinh = data.Data.rsThoiGian;
                        me.dtDuChung_LoaiKhoan = data.Data.rsThongTinTongHop;
                        me.dtDuChung = data.Data.rsThongTinSinhVien;
                        //
                        me.genTable_CongNo_DuChung(me.dtDuChung, data.Pager);
                        me.genHTML_CongNo_ThoiGianTinh(me.dtDuChung_ThoiGianTinh);
                        me.genHTML_CongNo_LoaiKhoan(me.dtDuChung_LoaiKhoan, "TONGDU");
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
    getList_CongNo_DuRieng: function () {
        console.log("tab4");
        var me = this;
        var strHeDaoTao_Id = "";
        var strKhoaDaoTao_Id = "";
        var strChuongTrinh_Id = "";
        var strLopQuanLy_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;


        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNo_DuRieng',
            'versionAPI': 'v1.0',

            'strHeDaoTao_Id': strHeDaoTao_Id,
            'strKhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strChuongTrinh_Id': strChuongTrinh_Id,
            'strLopQuanLy_Id': strLopQuanLy_Id,
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
                        me.dtDuRieng_ThoiGianTinh = data.Data.rsThoiGian;
                        me.dtDuRieng_LoaiKhoan = data.Data.rsThongTinTongHop;
                        me.dtDuRieng = data.Data.rsThongTinSinhVien;
                        //
                        me.genTable_CongNo_DuRieng(me.dtDuRieng, data.Pager);
                        me.genHTML_CongNo_ThoiGianTinh(me.dtDuRieng_ThoiGianTinh);
                        me.genHTML_CongNo_LoaiKhoan(me.dtDuRieng_LoaiKhoan, "TONGDU");
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

    getDetail_CongNo_DuChung: function (strNguoiHoc_Id) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNoChiTiet_DuChung',
            'versionAPI': 'v1.0',

            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.dtDuRieng = data.Data;
                        me.genTable_CongNo_DuRieng(data.Data, data.Pager);
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
    getDetail_CongNo_NoChung: function (strNguoiHoc_Id) {
        var me = this;
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;

        var obj_list = {
            'action': 'TC_ThongKe/LayDSCongNoChiTiet_NoChung',
            'versionAPI': 'v1.0',

            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.dtDuRieng = data.Data;
                        me.genTable_CongNo_DuRieng(data.Data, data.Pager);
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
    --Discription: [2] GEN HTML TheoDoiCongNo
    -------------------------------------------*/
    genTable_CongNo_NoChung: function (data, iPager) {
        var me = this;
        $("#tab1_total_nc").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNoChung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TheoDoiCongNo.getList_CongNo_NoChung()",
                iDataRow: iPager,
            },
            arrClassName: [],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2, 3, 4],
                right: [5],
                fix: [0],
                center: [0, 1, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = ""
                        return strTinhTrang;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMaSo = ""
                        return strMaSo;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var strHoTen = aData.HOVATEN;
                        var strNgaySinh = aData.NGAYSINH;
                        var html = '';
                        html += '<span>' + strHoTen + '</span><br />';
                        html += '<span class="italic">' + strNgaySinh + '</span>'
                        return html;
                    }
                }, {
                    "mDataProp": "LOP"
                }, {
                    "mRender": function (nRow, aData) {
                        var dTongNo = edu.util.formatCurrency(edu.util.returnZero(aData.TONGNO));
                        return dTongNo;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a href="#" class="btnDetail_NoChung" id="detail_nochung' + aData.ID + '"><i class="fa fa-info-circle"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_CongNo_NoRieng: function (data, iPager) {
        var me = this;
        $("#tab2_total_nr").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNoRieng",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TheoDoiCongNo.getList_CongNo_NoRieng()",
                iDataRow: iPager,
            },
            arrClassName: [],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2, 3, 4],
                right: [5],
                fix: [0],
                center: [0, 1, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = ""
                        return strTinhTrang;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMaSo = ""
                        return strMaSo;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var strHoTen = aData.HOVATEN;
                        var strNgaySinh = aData.NGAYSINH;
                        var html = '';
                        html += '<span>' + strHoTen + '</span><br />';
                        html += '<span class="italic">' + strNgaySinh + '</span>'
                        return html;
                    }
                }, {
                    "mDataProp": "LOP"
                }, {
                    "mRender": function (nRow, aData) {
                        var strLoaiKhoan = "";
                        return strLoaiKhoan;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var dTongNo = "";
                        return dTongNo;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_CongNo_DuChung: function (data, iPager) {
        var me = this;
        $("#tab3_total_dc").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuChung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TheoDoiCongNo.getList_CongNo_DuChung()",
                iDataRow: iPager,
            },
            arrClassName: [],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2, 3, 4],
                right: [5],
                fix: [0],
                center: [0, 1, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = ""
                        return strTinhTrang;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMaSo = ""
                        return strMaSo;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var strHoTen = aData.HOVATEN;
                        var strNgaySinh = aData.NGAYSINH;
                        var html = '';
                        html += '<span>' + strHoTen + '</span><br />';
                        html += '<span class="italic">' + strNgaySinh + '</span>'
                        return html;
                    }
                }, {
                    "mDataProp": "LOP"
                }, {
                    "mRender": function (nRow, aData) {
                        var dTongNo = edu.util.formatCurrency(edu.util.returnZero(aData.TONGNO));
                        return dTongNo;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a href="#" class="btnDetail_NoChung" id="detail_nochung' + aData.ID + '"><i class="fa fa-info-circle"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_CongNo_DuRieng: function (data, iPager) {
        var me = this;
        $("#tab4_total_dr").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuRieng",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TheoDoiCongNo.getList_CongNo_DuRieng()",
                iDataRow: iPager,
            },
            arrClassName: [],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2, 3, 4],
                right: [5],
                fix: [0],
                center: [0, 1, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = ""
                        return strTinhTrang;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMaSo = ""
                        return strMaSo;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var strHoTen = aData.HOVATEN;
                        var strNgaySinh = aData.NGAYSINH;
                        var html = '';
                        html += '<span>' + strHoTen + '</span><br />';
                        html += '<span class="italic">' + strNgaySinh + '</span>'
                        return html;
                    }
                }, {
                    "mDataProp": "LOP"
                }, {
                    "mRender": function (nRow, aData) {
                        var strLoaiKhoan = "";
                        return strLoaiKhoan;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        var dTongNo = "";
                        return dTongNo;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    genHTML_CongNo_ThoiGianTinh: function (data) {

        $("#lblNgayChotDuLieu").html(data[0].NGAYTONGHOPCUOICUNG);
        $("#lblNgayThayDoi").html(data[0].NGAYTHAYDOIDULIEUCUOICUNG);
    },
    genHTML_CongNo_LoaiKhoan: function (data, field) {
        var html = "";
        var strLoaiKhoan_Ten = "";
        var dLoaiKhoan_TongNo = 0;
        var dTongNo = 0;
        $("#lblTongNo").html("");
        $("#zoneCongNo_LoaiKhoan").html("");
        //1. main
        for (var i = 0; i < data.length; i++) {
            strLoaiKhoan_Ten = data[i].TEN;
            dLoaiKhoan_TongNo = edu.util.returnZero(data[i][field]);
            dTongNo += edu.util.returnZero(data[i][field]);
            html += genHTML_LoaiKhoan(strLoaiKhoan_Ten, dLoaiKhoan_TongNo);
        }
        //2. funtion process
        function genHTML_LoaiKhoan(strLoaiKhoan_Ten, dLoaiKhoan_TongNo) {
            var html = "";
            html += '<div class="progress-group">';
            html += '<span class="italic"><a title="' + strLoaiKhoan_Ten + '">' + edu.util.splitString(strLoaiKhoan_Ten, 20) + '<a/></span>';
            html += '<span class="progress-number italic">' + edu.util.formatCurrency(dLoaiKhoan_TongNo) + '</span>';
            html += '<div class="progress xxs">';
            html += '<div style="width: 100%"></div>';
            html += '</div>';
            html += '</div>';
            return html;
        }
        //3. bind to html
        $("#lblTongNo").html(edu.util.formatCurrency(dTongNo));
        $("#zoneCongNo_LoaiKhoan").html(html);
    },

    genDetail_CongNo_DuChung: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDetail_TDCN",
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 0,
            },
            arrClassName: [],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [1],
                fix: [0],
                center: [2]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTen = aData.TENCHUONGTRINH;
                        var html = '<span id="chuongtrinh_ten' + aData.ID + '">' + strTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMa = aData.MACHUONGTRINH;
                        var html = '<span id="chuongtrinh_ma' + aData.ID + '">' + strMa + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a id="chuongtrinh_id' + aData.ID + '" class="btn btnSelect_ChuongTrinh"><i class="fa fa-check"> Chọn</i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [3] ACCESS DB HeDaoTao/KhoaDaoTao/ChuongTrinh
    --ULR:  
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var strDAOTAO_HinhThucDaoTao_Id = "";
        var strDaoTao_BacDaoTao_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_HeDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDAOTAO_HinhThucDaoTao_Id': strDAOTAO_HinhThucDaoTao_Id,
            'strDaoTao_BacDaoTao_Id': strDaoTao_BacDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.loadToCombo_HeDaoTao(data.Data);
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
    getList_KhoaDaoTao: function () {
        var me = this;
        var strDAOTAO_HeDaoTao_Id = $("#dropHeDaoTao").val();
        var strDaoTao_CoSoDaoTao_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_KhoaDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDAOTAO_HeDaoTao_Id': strDAOTAO_HeDaoTao_Id,
            'strDaoTao_CoSoDaoTao_Id': strDaoTao_CoSoDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.loadToCombo_KhoaDaoTao(data.Data);
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
    getList_ChuongTrinh: function () {
        var me = this;

        var strDAOTAO_KhoaDaoTao_Id = "";
        var strDaoTao_N_CN_LOP_Id = "";
        var strDaoTao_KhoaQuanLy_Id = "";
        var strDaoTao_ToChucCT_Cha_Id = "";
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;

        var obj_list = {
            'action': 'CM_ChuongTrinhDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',
            'strDAOTAO_KhoaDaoTao_Id': strDAOTAO_KhoaDaoTao_Id,
            'strDaoTao_N_CN_LOP_Id': strDaoTao_N_CN_LOP_Id,
            'strDaoTao_KhoaQuanLy_Id': strDaoTao_KhoaQuanLy_Id,
            'strDaoTao_ToChucCT_Cha_Id': strDaoTao_ToChucCT_Cha_Id,
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
                        me.loadToCombo_ChuongTrinh(data.Data);
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
    --Discription: [3] GEN HTML HeDaoTao/KhoaDaoTao/ChuongTrinh
    --ULR:  
    -------------------------------------------*/
    loadToCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao", "dropKhoaDaoTao_ChuongTrinh"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
}