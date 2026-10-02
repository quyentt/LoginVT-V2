/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function DeTai() { }
DeTai.prototype = {
    dtDeTai: [],
    strDeTai_Id: "",

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
        $("#btnSearchDeTai_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_DeTai();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu("NCKH.PLDT", "dropSearch_DeTai_Loai", "Tất cả phân loại");
                setTimeout(function () {
                    //CoCauToChuc
                    var obj = {
                        strCCTC_Loai_Id: "",
                        strCCTC_Cha_Id: "",
                        iTrangThai: 1
                    };
                    edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
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
                            var obj = {
                                strMaBangDanhMuc: constant.setting.CATOR.SYS.RP.DT00,
                                strTenCotSapXep: "",
                                iTrangThai: 1
                            };
                            edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenLink);
                        }, 50);
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',
            

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': "",
            'strTuKhoaText': edu.util.getValById("txtSearchModal_DeTai_TuKhoa"),
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': "",
            'strLinhVucNghienCuu_Id': edu.util.getValById("dropSearchModal_DeTai_LinhVuc"),
            'strNguonKinhPhi_Id': "",
            'strThietKeNghienCuu_Id': "",
            'strNCKH_ThanhVien_Id': edu.system.userId,
            'strDonVi_Id_CuaThanhVien_Id': edu.util.getValById("dropSearchModal_DeTai_DonVi"),
            'strDaoTao_CoCauToChuc_Id': "",
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strTinhTrang_Id': "",
            'strPhanLoaiDeTai_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': "",
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
                        me.dtDeTai = dtResult;
                    }
                    me.genTable_DeTai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DeTai/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DeTai: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDeTai_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblDeTai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeTai.getList_DeTai()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDETAITIENGVIET) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    genCombo_NhanSu: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataNhanSu_Combo);
        var me = main_doc.DeTai;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: "AVATAR"
            },
            renderPlace: ["dropSearch_DeTai_NhanSu"],
            type: "",
            title: "Chọn nhân sự"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CoCauToChuc: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataNhanSu_Combo);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DeTai_CCTC"],
            type: "",
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] Print excell
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.DeTai;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_detai' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_DeTai").html(html_link);
    },
};