/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 22/10/2018
----------------------------------------------*/
function VanBangSangChe() { }
VanBangSangChe.prototype = {
    dtVanBangSC: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus-cndg", "zone_list_cndg");
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            edu.util.toggle_overide("zone-bus-cndg", "zone_input_cndg");
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#zoneReport_VBSC").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_vbsc/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_VBSC);
        });
        /*------------------------------------------
        --Discription: [1] Action VanBangSangChe
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_VanBangSC").click(function () {
            me.getList_VBSC();
        });
        $("#txtSearch_VBSC_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_VBSC();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        $("#txtSearch_VBSC_TuKhoa").focus();
        /*------------------------------------------
        --Discription: [1] Load VanBangSangChe
        -------------------------------------------*/
        setTimeout(function(){
            me.getList_VBSC();
            setTimeout(function () {
                //1. NhanSu
                var obj = {
                    strTuKhoa: "",
                    pageIndex: 1,
                    pageSize: 10000,
                    strCoCauToChuc_Id: "",
                    strNguoiThucHien_Id: ""
                };
                edu.system.getList_NhanSu(obj, "", "", me.genCombo_NhanSu);
                setTimeout(function () {
                    //2.CoCauToChuc
                    var obj = {
                        strCCTC_Loai_Id: "",
                        strCCTC_Cha_Id: "",
                        iTrangThai: 1
                    };
                    edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
                    setTimeout(function () {
                        var obj = {
                            strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.VBSC,
                            strTenCotSapXep: "",
                            iTrangThai: 1
                        };
                        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSangChe
    -------------------------------------------*/
    getList_VBSC: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_VanBangSangChe/LayDanhSach',
            

            'strVaitro_Id': "",
            'strCanBo_Id': "",
            'strQuanLyDeTai_Id': "",
            'strThanhVienDangKy_Id': edu.util.getValById("dropSearch_VBSC_NhanSu"),
            'iTrangThai': 1,
            'strTuKhoa': edu.util.getValById("txtSearch_VBSC_TuKhoa"),
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
                        me.dtVanBangSC = dtResult;
                    }
                    me.genTable_VBSC(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML VanBangSangChe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_VBSC: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblVanBangSC",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.VanBangSangChe.getList_VBSC()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false,
            },
            colPos: {
                center:[0],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TENVANBANG"
                }
                , {
                    "mDataProp": "NOIDUNGVANBANG"
                }
                , {
                    "mDataProp": "NAMCAPVANBANG"
                }
                , {
                    "mDataProp": "NCKH_DETAI_THANHVIEN_TEN"
                }
                , {
                    "mDataProp": "THONGTINMINHCHUNG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genCombo_NhanSu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: "AVATAR"
            },
            renderPlace: ["dropSearch_VBSC_NhanSu"],
            type: "",
            title: "Tất cả nhân sự"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CoCauToChuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_VBSC_CCTC"],
            type: "",
            title: "Tất cả cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] Print excell
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.VanBangSangChe;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_vbsc' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_VBSC").html(html_link);
    },
};