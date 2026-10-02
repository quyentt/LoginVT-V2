/*----------------------------------------------
--Author: nnThuong
--Phone: 
--Date of created: 18/12/2018
----------------------------------------------*/
function NangLuongThuongXuyen() { };
NangLuongThuongXuyen.prototype = {
    dtReportTemp: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearchNLTX_CoCauToChuc").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_NLThuongXuyen();
        });
        /*------------------------------------------
        --Author: nnThuong
        --Discription: Export data 
        ------------------------------------------*/
        $("#zoneReport_NLTX").delegate(".btnPrint_InHoSo", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_hoso_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_InHoSo);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Business
        -------------------------------------------*/
        me.getList_CoCauToChuc();
        setTimeout(function () {
            var obj = {
                strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.NLTX,
                strTenCotSapXep: "",
                iTrangThai: 1
            };
            edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink_InHoSo);
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB NangLuongThuongXuyen
    -------------------------------------------*/
    getList_NLThuongXuyen: function () {
        var me = this;
        var strDonViBoPhan_Id   = "";
        var strCoCauToChuc  = $("#dropSearchNLTX_CoCauToChuc").val();
        var strBoMon        = $("#dropSearchNLTX_BoMon").val();
        if (edu.util.checkValue(strBoMon)) {
            strDonViBoPhan_Id = strBoMon;
        }
        else {
            strDonViBoPhan_Id = strCoCauToChuc;
        }
        //--Edit
        var obj_list = {
            'action': 'NS_DuBao/NangLuongThuongXuyen',
            

            'strDonViBoPhan_GiangVien_Id': strDonViBoPhan_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_NLThuongXuyen(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_DuBao/NangLuongThuongXuyen: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_DuBao/NangLuongThuongXuyen (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    genTable_NLThuongXuyen: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tbldataNLTX",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NangLuongThuongXuyen.getList_NLThuongXuyen()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "HOTEN",
                }
                , {
                    "mDataProp": "GIOITINH_TEN",
                }
                , {
                    "mDataProp": "TRINHDOCHUYENMONCAONHAT_TEN",
                }
                , {
                    "mDataProp": "NGACHLUONG_MA"
                }
                , {
                    "mDataProp": "BACLUONG_TEN"
                }
                , {
                    "mDataProp": "HESOLUONG"
                }
                , {
                    "mDataProp": "NGAYQUYETDINH"
                }
                , {
                    "mDataProp": "NGACHLUONG_MA"
                }
                , {
                    "mDataProp": "BACLUONG_TIEPTHEO_TEN"
                }
                , {
                    "mDataProp": "HESOLUONG_TIEPTHEO"
                }
                , {
                    "mDataProp": "NGAYHUONGLUONG_TIEPTHEO"
                }
                , {
                    "mDataProp": "NGAYHUONGLUONG_TIEPTHEO"
                }
                , {
                    "mDataProp": "SOTHANGDUOCHUONGTINHHETNAM"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML CoCauToChuc
    --ULR:  Modules
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.NangLuongThuongXuyen;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }

        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNLTX_CoCauToChuc"],
            type: "",
            title: "Chọn cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNLTX_BoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
   
    /*------------------------------------------
    --Discription: [Last] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink_InHoSo: function (data) {
        var me = main_doc.NangLuongThuongXuyen;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_hoso_' + strId + '" class="poiter btnPrint_InHoSo" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_NLTX").html(html_link);
    },
};