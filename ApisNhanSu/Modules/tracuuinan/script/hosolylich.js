/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function HoSoLyLich() { }
HoSoLyLich.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtReportTemp: [],
    strNhanSu_Id: '',

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
            me.toggle_view();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HSLL_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_HSLL_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblHoSoLL_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                //me.toggle_view();
                edu.util.setOne_BgRow(strId, "tblHoSoLL_NhanSu");
                me.strNhanSu_Id = strId;
                me.getDetail_NhanSu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#tblHoSoLL_NhanSu").delegate('.btnView', 'mouseenter', function (e) {
        //    e.stopImmediatePropagation();
        //    var obj = this;
        //    var strId = this.id;
        //    var strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
        //    edu.extend.popover_NhanSu(strNhanSu_Id, me.dtNhanSu, obj);
        //});
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_HSLL_CoCauToChuc").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("CCB.BCTK", "", "", me.loadBtnBaoCao, "Tất cả báo cáo", "HESO1");
        $("#zoneBtnBaoCao").delegate(".btnbaocao", "click", function (e) {
            e.preventDefault();
            var strNhanSu_Id = me.strNhanSu_Id;
            var LoaiBaoCao = this.id;
            edu.system.report(LoaiBaoCao, $(this).attr("name"), function (addKeyValue) {
                addKeyValue("strOutputType", edu.util.getValRadio("name", "rdhsll_output"));
                addKeyValue("strNhanSu_Id", strNhanSu_Id);
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_HSLL_TuKhoa");
        me.toggle_view();
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_NhanSu();
            setTimeout(function () {
                me.getList_CoCauToChuc();
                //setTimeout(function () {
                //    var obj = {
                //        strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.HSLL,
                //        strTenCotSapXep: "",
                //        iTrangThai: 1
                //    };
                //    edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink_InHoSo);
                //}, 50);
            }, 50);
        }, 50);
    },
    toggle_view: function () {
        edu.util.toggle_overide("zoneHSLL", "zone_view_hsll");
    },
    toggle_preview_2cbnv: function () {
        edu.util.toggle_overide("zoneHSLL", "zone_2cbnv_hsll");
    },
    toggle_preview_2tw: function () {
        edu.util.toggle_overide("zoneHSLL", "zone_2tw_hsll");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        var arrId = [""];
        edu.util.resetValByArrId(arrId);
    },
    loadBtnBaoCao: function (data) {
        console.log(data);
        var row = "";
        row += '<div style="width: ' + (data.length * 113) + 'px">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].MA + '" name="' + data[i].THONGTIN3 + '" class="btn-large btnbaocao" style="width: 108px">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<div class="clear"></div>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnBaoCao").html(row);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = main_doc.HoSoLyLich;
        var strCoCauToChuc = edu.util.getValById("dropSearch_HSLL_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_HSLL_CoCauToChuc");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_HSLL_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
        
    },
    getDetail_NhanSu: function (strId) {
        var me = main_doc.HoSoLyLich;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': strId
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data[0];
                    }
                    me.viewForm_NhanSu(dtResult);

                } else {
                    edu.system.alert("NS_HoSoV2/LayChiTiet: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_HoSoV2/LayChiTiet (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoSoLyLich
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhanSu: function (data, iPager) {
        var me = main_doc.HoSoLyLich;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblHSLL_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblHoSoLL_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoLyLich.getList_NhanSu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnView"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(data.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.HoSoLyLich;
        me.rewrite();
        //anh
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#txtInAnHSLL_Anh").html('<img src="' + strAnh + '" style="width: 100%">');
        //
        var strHoTen = data.HODEM + " " + data.TEN;
        if (edu.util.checkValue(strHoTen)) {
            strHoTen = strHoTen.toUpperCase();
        }
        edu.util.viewHTMLById("lblHSLL_HoTen", strHoTen);
        edu.util.viewHTMLById("lblHSLL_TenGoi_Khac", data.TENGOIKHAC);
        edu.util.viewHTMLById("lblHSLL_NgaySinh", edu.util.returnEmpty(data.NGAYSINH) + "/" + edu.util.returnEmpty(data.THANGSINH) + "/" + edu.util.returnEmpty(data.NAMSINH));
        edu.util.viewHTMLById("lblHSLL_GioiTinh", data.GIOITINH_TEN);

        edu.util.viewHTMLById("lblHSLL_NoiSinh", edu.util.returnEmpty(data.NOISINH_XA_TEN) + ", " +
            edu.util.returnEmpty(data.NOISINH_HUYEN_TEN) + ", " + edu.util.returnEmpty(data.NOISINH_TINH_TEN));
        edu.util.viewHTMLById("lblHSLL_QueQuan", edu.util.returnEmpty(data.QUEQUAN_XA_TEN) + ", " +
            edu.util.returnEmpty(data.QUEQUAN_HUYEN_TEN) + ", " + edu.util.returnEmpty(data.QUEQUAN_TINH_TEN));
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
        var me = main_doc.HoSoLyLich;
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
            renderPlace: ["dropSearch_HSLL_CoCauToChuc"],
            type: "",
            title: "Cơ cấu khoa/viện/phòng ban"
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
            renderPlace: ["dropSearch_HSLL_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [2] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink_InHoSo: function (data) {
        var me = main_doc.HoSoLyLich;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_hoso_' + strId + '" class="poiter btnPrint_InHoSo" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_NS").html(html_link);
    },
};