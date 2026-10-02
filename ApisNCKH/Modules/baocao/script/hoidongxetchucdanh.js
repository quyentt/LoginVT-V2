/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function HoiDongXetChucDanh() { }
HoiDongXetChucDanh.prototype = {
    dtHoiDongXCD: [],
    dtReportTemp: [],
    strHoiDongXetCD_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#zoneReport_HDXCD").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_hdxcd/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_HDXCD);
        });
        /*------------------------------------------
        --Discription: [1] Action HoiDongXetChucDanh
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HDXCD").click(function () {
            me.getList_HDXCD();
        });
        $("#txtSearch_HDXCD_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HDXCD();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        $("#txtSearch_HDXCD_TuKhoa").focus();
        setTimeout(function () {
            me.getList_HDXCD();
            setTimeout(function () {
                var obj = {
                    code: "QLCB.CHDA",
                    renderPlace: "rdHDXCD_ChucDanh",
                    nameRadio: "rdChucDanh",
                    title: ""
                }
                edu.system.loadToRadio_DanhMucDuLieu(obj);
                setTimeout(function () {
                    var obj = {
                        code: "NCKH.HDCS",
                        renderPlace: "rdHDXCD_HDCoSo",
                        nameRadio: "rdHDCoSo",
                        title: ""
                    }
                    edu.system.loadToRadio_DanhMucDuLieu(obj);
                    setTimeout(function () {
                        var obj = {
                            code: "NCKH.HDNG",
                            renderPlace: "rdHDXCD_HDNganh",
                            nameRadio: "rdHDNganh",
                            title: ""
                        }
                        edu.system.loadToRadio_DanhMucDuLieu(obj);
                        setTimeout(function () {
                            var obj = {
                                code: "NCKH.HDNN",
                                renderPlace: "rdHDXCD_HDNhaNuoc",
                                nameRadio: "rdHDNhaNuoc",
                                title: ""
                            }
                            edu.system.loadToRadio_DanhMucDuLieu(obj);
                            setTimeout(function () {
                                var obj = {
                                    strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.HDCD,
                                    strTenCotSapXep: "",
                                    iTrangThai: 1
                                };
                                edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink);
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_HDXCD: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_HoiDongXetChucDanh/LayDanhSach',
            

            'strChucDanhDeXuat_Id': "",
            'strDoiTuongDeXuat_Id': "",
            'strKetQuaHoiDongCoSo_Id': edu.util.returnEmpty(edu.util.getValRadio("name", "rdHDCoSo")),
            'strKetQuaHoiDongNghanh_Id': edu.util.returnEmpty(edu.util.getValRadio("name", "rdHDNganh")),
                'strKetQuaHoiDongNhaNuoc_Id': edu.util.returnEmpty(edu.util.getValRadio("name", "rdHDNhaNuoc")),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtSearch_HDXCD_TuKhoa"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtHoiDongXCD = dtResult;
                    }
                    me.genTable_HDXCD(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_HoiDongXetChucDanh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiDongXetChucDanh/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML HoiDongXetChucDanh
    -------------------------------------------*/
    genTable_HDXCD: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHDXCD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiDongXetChucDanh.getList_HDXCD()",
                iDataRow: iPager
            },
            colPos: {
                center:[0],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DOITUONGDEXUAT_TEN"
                }
                , {
                    "mDataProp": ""
                }
                , {
                    "mDataProp": "CHUYENNGANH_TEN"
                }
                , {
                    "mDataProp": "DOITUONGDEXUAT_TEN"
                }
                , {
                    "mDataProp": "CHUCDANHDEXUAT_TEN"
                }
                , {
                    "mDataProp": "KETQUAHOIDONGCOSO_TEN"
                }
                , {
                    "mDataProp": "KETQUAHOIDONGNGANH_TEN"
                }
                , {
                    "mDataProp": "KETQUAHOIDONGNHANUOC_TEN"
                }
                , {
                    "mDataProp": ""
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.HoiDongXetChucDanh;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_hdxcd' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_HDXCD").html(html_link);
    },
};