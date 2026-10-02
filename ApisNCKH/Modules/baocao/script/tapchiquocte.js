/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 24/12/2018
----------------------------------------------*/
function TapChiQuocTe() { }
TapChiQuocTe.prototype = {
    dtReportTemp: [],
    dtTapChiQT: [],

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
        $("#zoneReport_TCQT").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_TCQT/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_TCQT);
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocGia
        --Order: 
        -------------------------------------------*/
        $("#txtSearch_BaoCao_TuKhoa").click(function () {
            me.getList_TCQT();
        });
        $("#txtSearch_BBTN_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQT();
            }
        });
        $("#tblBaiBao_QT").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.getDetail_TCQT(strId);
                me.getList_TCQT_ThanhVien(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        $("#txtSearch_BaoCao_TuKhoa").focus();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_TCQT();
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
                        edu.system.loadToCombo_DanhMucDuLieu("NCKH.TCQT", "dropSearch_BaoCao_PhanLoai", "Chọn phân loại");
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu("NCKH.LVNC", "dropSearch_BaoCao_LinhVuc", "Chọn lĩnh vực");
                            setTimeout(function () {
                                me.getList_DMTCQT();
                                setTimeout(function () {
                                    var obj = {
                                        strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.TCQT,
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
    rewrite: function () {
        //reset id
        var me = this;
        //
        var arrId = [""];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocGia
    -------------------------------------------*/
    getList_TCQT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe/LayDanhSach',
            

            'strVaitro_Id': "",
            'strQuanLyDeTai_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_BaoCao_LinhVuc"),
            'strPhanLoaiTapChi_Id': edu.util.getValById("dropSearch_BaoCao_PhanLoai"),
            'strTuKhoa': edu.util.getValById("btnSearch_BaoCao_TCQT"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThanhVienDangKy_Id': edu.util.getValById("dropSearch_BaoCao_NhanSu"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_BaoCao_CCTC"),
            'strDMTapChiQuocTe_Id': edu.util.getValById("dropSearch_BaoCao_TenDMTC"),
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
                        me.dtTapChiQT = dtResult;
                    }
                    me.genTable_TCQT(dtResult, iPager);
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
    getList_TCQT_ThanhVien: function (strId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe_ThanhVien/LayDanhSach',
            
            'strTapChiQuocGia_Id': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genDetail_ThanhVien_TCQT(dtResult);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe_ThanhVien/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe_ThanhVien/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML TapChiQuocGia
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TCQT: function (data, iPager) {
        var me = this;
        var html = '';
        var jsonForm = {
            strTable_Id: "tblBaiBao_QT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TapChiQuocTe.getList_TCQT()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "SOTAPCHI"
                }
                , {
                    "mDataProp": "NAMCONGBO"
                }
                , {
                    "mDataProp": "TENBAIBAO"
                }
                , {
                    "mDataProp": "NCKH_DETAI_THANHVIEN_TEN"
                }
                , {
                    "mDataProp": "SOTACGIA_N"
                }
                , {
                    "mDataProp": "THUOCLINHVUCNAO"
                }
                , {
                    "mDataProp": "THONGTINMINHCHUNG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_NhanSu: function (data) {
        var me = main_doc.TapChiQuocTe;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HODEM",
                code: "",
                avatar: "AVATAR"
            },
            renderPlace: ["dropSearch_BaoCao_NhanSu"],
            type: "",
            title: "Chọn nhân sự"
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
            renderPlace: ["dropSearch_BaoCao_CCTC"],
            type: "",
            title: "Cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_DMTCQT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocTe/LayDanhSach',
            

            'strTuKhoa': "",
            'strTenTapChiDang_Id': "",
            'strLoaiTapChi_Id': "",
            'strCoQuanXuatBan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
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
                    me.genCombo_DMTCQT(dtResult);
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DMTCQT: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTAPCHIDANG_TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_BaoCao_TenDMTC"],
            title: "Chọn tên danh mục tạp chí"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.TapChiQuocTe;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_TCQT' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_TCQT").html(html_link);
    },
};