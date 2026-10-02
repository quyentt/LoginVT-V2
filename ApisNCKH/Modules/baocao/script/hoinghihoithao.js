/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 22/10/2018
----------------------------------------------*/
function HoiNghiHoiThao() { }
HoiNghiHoiThao.prototype = {
    dtHNHT: [],
    strHoiNghiHT_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],

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
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#zoneReport_HNHT").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_hnht/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_HNHT);
        });
        /*------------------------------------------
        --Discription: [1] Action HoiNghiHoiThao
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HNHT").click(function () {
            me.getList_HNHT();
        });
        $("#txtSearch_HNHT_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HNHT();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.dateYearToCombo("1993", "dropHNHT_NamBaoCao", "Chọn năm báo cáo");
        /*------------------------------------------
        --Discription: [1] Load TapChiQuocTe
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_HNHT();
            setTimeout(function () {
                var obj = {
                    strTuKhoa: "",
                    pageIndex: 1,
                    pageSize: 10000,
                    strCoCauToChuc_Id: "",
                    strNguoiThucHien_Id: ""
                };
                edu.system.getList_NhanSu(obj, "", "", me.genCombo_NhanSu);
                setTimeout(function () {
                    var obj = {
                        strCCTC_Loai_Id: "",
                        strCCTC_Cha_Id: "",
                        iTrangThai: 1
                    };
                    edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
                    setTimeout(function () {
                        edu.system.loadToCombo_DanhMucDuLieu("NCKH.PVHT", "dropSearch_HNHT_PhamVi,dropHNHT_PhamVi");
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu("NCKH.LVNC", "dropSearch_HNHT_LinhVuc,dropHNHT_LinhVuc_Nganh");
                            setTimeout(function () {
                                var obj = {
                                    strMaBangDanhMuc: "NCKH.VTHT",
                                    strTenCotSapXep: "",
                                    iTrangThai: 1
                                };
                                edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
                                setTimeout(function () {
                                    edu.system.loadToCombo_DanhMucDuLieu("NCKH.TCHT", "dropHNHT_DonViToChuc");
                                    setTimeout(function () {
                                        var obj = {
                                            strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.HNHT,
                                            strTenCotSapXep: "",
                                            iTrangThai: 1
                                        };
                                        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink);
                                    }, 150);
                                }, 150);
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiNghiHoiThao
    -------------------------------------------*/
    getList_HNHT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_HoiNghiHoiThao/LayDanhSach',
            

            'strVaitro_Id': "",
            'strQuanLyDeTai_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_HNHT_LinhVuc"),
            'strPhamViHoiNghiHoiThao_Id': edu.util.getValById("dropSearch_HNHT_PhamVi"),
            'strTuKhoa': edu.util.getValById("txtSearch_HNHT_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThanhVienDangKy_Id': edu.util.getValById("dropSearch_HNHT_NhanSu"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strDonViCuaThanhVien_Id': "",
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
                        me.dtHNHT = dtResult;
                    }
                    me.genTable_HNHT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML HoiNghiHoiThao
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HNHT: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHNHT_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHNHT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiNghiHoiThao.getList_HNHT()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            colPos: {
                center:[0, 4],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TENHOINGHIHOITHAO"
                }
                , {
                    "mDataProp": "THOIGIANTOCHUC"
                }
                , {
                    "mDataProp": "THUOCLINHVUCNAO_MA"
                }
                , {
                    "mDataProp": "SOTACGIA_N"
                }
                , {
                    "mDataProp": "PHAMVIHOINGHIHOITHAO_TEN"
                }
                , {
                    "mDataProp": "DONVITOCHUC_TEN"
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
    --Discription: [1] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
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
            renderPlace: ["dropSearch_HNHT_NhanSu"],
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
            renderPlace: ["dropSearch_HNHT_CCTC"],
            type: "",
            title: "Tất cả cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.HoiNghiHoiThao;
        me.dtVaiTro = data;
    },
    genCombo_VaiTro: function (place) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.HoiNghiHoiThao;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_hnht' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_HNHT").html(html_link);
    },
};