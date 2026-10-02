/*----------------------------------------------
--Author:
--Phone: 
--Date of created: 
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function AccessedHistory() { };
AccessedHistory.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        me.getList_LS();
        me.getList_UngDung();
        $("#btnSearch").click(function () {
            me.getList_LS();
        });
        $("#btnSearchTest").click(function () {
            for (var i = 0; i < 1000; i++) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", 1000);
                me.getList_LS();
            }
           
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LS();
            }
        });
        $("#dropSearch_UngDung").on("select2:select", function () {
            me.getList_UngDungChucNang();
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [1] AcessDB PhieuDG
    -------------------------------------------*/
    getList_LS: function () {
        var me = this;
        var obj_list = {
            'action': 'SYS_LuuCacThongTinHoatDong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strChucNang_Id': edu.util.getValById("dropSearch_ChucNang"),
            'strUngDung_Id': edu.util.getValById("dropSearch_UngDung"),
            'strHoatDong': edu.util.getValById("dropSearch_HoatDong"),
            'strDiaChiMayTramTruyCap': "",
            'strTrinhDuyetSuDungTruyCap': "",
            'strTaiKhoanDangNhap': edu.util.getValById("txtSearch_User"),
            'strThoiGianMayTram_BD': '',
            'strThoiGianMayTram_KT': '',
            'strThoiGianMayChu_BD': edu.util.getValById("txtSearch_TGBD"),
            'strThoiGianMayChu_KT': edu.util.getValById("txtSearch_TGKT"),
            'strTenThietBi': "",
            'strMoTa': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_LS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) { edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");},
            type: "GET",
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_TangThem();
                });
            },
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LS: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblLichSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0]
            },
            bPaginate: {
                strFuntionName: "main_doc.AccessedHistory.getList_LS()",
                iDataRow: iPager
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU"
                },
                {
                    "mDataProp": "UNGDUNG_TEN"
                },
                {
                    "mDataProp": "CHUCNANG_TEN"
                },
                {
                    "mDataProp": "HOATDONG"
                },
                {
                    "mDataProp": "THOIGIANMAYCHU"
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.TRINHDUYETSUDUNGTRUYCAP == null) return "";
                        if (aData.TRINHDUYETSUDUNGTRUYCAP.includes('(')) return aData.TRINHDUYETSUDUNGTRUYCAP.substring(0, aData.TRINHDUYETSUDUNGTRUYCAP.indexOf('(') - 1);
                        return "";
                    }
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.TRINHDUYETSUDUNGTRUYCAP == null) return "";
                        if (aData.TRINHDUYETSUDUNGTRUYCAP.includes('(')) return aData.TRINHDUYETSUDUNGTRUYCAP.substring(aData.TRINHDUYETSUDUNGTRUYCAP.indexOf('(') + 1, aData.TRINHDUYETSUDUNGTRUYCAP.indexOf(')'));
                        return "";
                    }
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.TRINHDUYETSUDUNGTRUYCAP == null) return "";
                        if (aData.TRINHDUYETSUDUNGTRUYCAP.includes('/')) return aData.TRINHDUYETSUDUNGTRUYCAP.substring(aData.TRINHDUYETSUDUNGTRUYCAP.indexOf('/') + 1);
                        return "";
                    }
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.DIACHIMAYTRAMTRUYCAP == null) return "";
                        if (aData.DIACHIMAYTRAMTRUYCAP.includes(' ')) return aData.DIACHIMAYTRAMTRUYCAP.substring(0, aData.DIACHIMAYTRAMTRUYCAP.indexOf(' '));
                        return "";
                    }
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.DIACHIMAYTRAMTRUYCAP == null) return "";
                        if (aData.DIACHIMAYTRAMTRUYCAP.includes('(')) return aData.DIACHIMAYTRAMTRUYCAP.substring(aData.DIACHIMAYTRAMTRUYCAP.indexOf('(') + 1, aData.DIACHIMAYTRAMTRUYCAP.lastIndexOf(':'));
                        return "";
                    }
                },
                {
                    "mData": "SOGIOSDH",
                    'mRender': function (nrow, aData) {
                        if (aData.DIACHIMAYTRAMTRUYCAP == null) return "";
                        if (aData.DIACHIMAYTRAMTRUYCAP.includes('(')) return aData.DIACHIMAYTRAMTRUYCAP.substring(aData.DIACHIMAYTRAMTRUYCAP.lastIndexOf(':') + 1, aData.DIACHIMAYTRAMTRUYCAP.lastIndexOf(')'));
                        return "";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },

    /*----------------------------------------------
    --Discription: [1] Access DB UngDung and ChucNang
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;
        var itrangThai = 1;
        var strTuKhoa = "";

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genComBo_UngDung(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_UngDung/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'CMS_UngDung/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': 1,
                'pageSize': 10000,
                'dTrangThai': itrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_UngDungChucNang: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CMS_ChucNang/LayDanhSach',
            
            'strTuKhoa': "",
            'strChung_UngDung_Id': edu.util.getValById("dropSearch_ChucNang"),
            'strCha_Id': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai': 1
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
                    me.genComBo_ChucNang(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (ex): " + ex, "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] GenHTML UngDung and ChucNang
    ----------------------------------------------*/
    genComBo_UngDung: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MA"
            },
            renderPlace: ["dropSearch_UngDung"],
            type: "",
            title: "Tất cả ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_ChucNang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUCNANG",
                code: "MA"
            },
            renderPlace: ["dropSearch_ChucNang"],
            type: "",
            title: "Tất cả chức năng"
        };
        edu.system.loadToCombo_data(obj);
    },
}