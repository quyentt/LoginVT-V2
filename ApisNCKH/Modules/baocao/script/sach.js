/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function Sach() { }
Sach.prototype = {
    dtDS: [],
    strId: '',
    dtVaiTro: [],

    init: function () {
        var me = main_doc.Sach;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        $("#zoneReport_Sach").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_sach/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_Sach);
        });
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_TTS();
            }
        });
        $("#btnSearch_TTS,.btnRefresh").click(function () {
            me.getList_TTS();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.Sach;
        edu.system.page_load();
       
        setTimeout(function () {
            me.getList_TTS();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropSearch_LoaiHocVi_TTS");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropSearch_LoaiChucDanh_TTS");
                    setTimeout(function () {
                        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.PHLS, "dropSearch_PhanLoaiSach_TTS");
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropSearch_LinhVuc_TTS");
                            setTimeout(function () {
                                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.VTVS, "dropSearch_VaiTro_TTS");
                                setTimeout(function () {
                                    var obj = {
                                        strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.SACH,
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
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Sach
    -------------------------------------------*/
    getList_TTS: function () {
        var me = main_doc.Sach;

        //--Edit
        var obj_list = {
            'action': 'NCKH_Sach/LayDanhSach',
            
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strLoaiChucDanh_Id': edu.util.getValById("dropSearch_LoaiChucDanh_TTS"),
            'strLoaiHocVi_Id': edu.util.getValById("dropSearch_LoaiHocVi_TTS"),
            'strDonViCuaThanhVien_Id': '',
            'strVaiTro_Id': '',
            'strnckh_detai_thanhvien_id': '',
            'strPhanLoaiSach_Id': edu.util.getValById("dropSearch_PhanLoaiSach_TTS"),
            'strNCKH_QuanLyDeTai_Id': '',
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_LinhVuc_TTS"),
            'strCanBoNhap_Id': '',
            'iTrangThai': 1,
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
                        me.dtDS = dtResult;
                    }
                    me.genTable_TTS(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_Sach/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_Sach/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML Sach
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TTS: function (data, iPager) {
        var me = main_doc.Sach;
        edu.util.viewHTMLById("lblTTS_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblTTS",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Sach.getList_TTS()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnView"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAISACH"
                }
                , {
                    "mDataProp": "THUOCLINHVUCNAO"
                }
                , {
                    "mDataProp": "TENSACH"
                }
                , {
                    "mDataProp": "NAMXUATBAN"
                }
                , {
                    "mDataProp": "SOTRANGSACH_N"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] Print excell
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.Sach;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_sach' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_Sach").html(html_link);
    },
};