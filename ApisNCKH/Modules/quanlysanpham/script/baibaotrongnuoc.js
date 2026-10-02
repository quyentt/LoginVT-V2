/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 09/10/2018
----------------------------------------------*/
function BaiBaoTrongNuoc() { }
BaiBaoTrongNuoc.prototype = {
    dtTapChiDG: [],

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
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocGia
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_BaiBaoTN").click(function () {
            me.getList_TCQG();
        });
        $("#txtSearch_BBTN_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQG();
            }
        });
        $("#tblBaiBaoTN").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.getDetail_TCQG(strId);
                me.getList_TCQG_ThanhVien(strId);
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
        edu.util.toggle("box-sub-search");
        edu.util.toggle_overide("zone-bus-cndg", "zone_list_cndg");
        //edu.system.uploadFiles(["lblBaiBaoTN_FileDinhKem"], "", "");
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_TCQG();
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
                    //CoCauToChuc
                    var obj = {
                        strCCTC_Loai_Id: "",
                        strCCTC_Cha_Id: "",
                        iTrangThai: 1
                    };
                    edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
                    setTimeout(function () {
                        //DanhMuc
                        edu.system.loadToCombo_DanhMucDuLieu("NCKH.TCQG", "dropSearch_PhanLoai", "Chọn phân loại");
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu("NCKH.LVNC", "dropSearch_LinhVuc", "Chọn lĩnh vực");
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
    getDetail_TCQG: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtTapChiDG, "ID", me.viewForm_TCQG);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocGia
    -------------------------------------------*/
    getList_TCQG: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action'                    : 'NCKH_TapChiQuocGia/LayDanhSach',
            'versionAPI'                : 'v1.0',

            'strVaitro_Id'              : "",
            'strQuanLyDeTai_Id'         : "",
            'strThuocLinhVucNao_Id'     : edu.util.getValById("dropSearch_BBTN_LinhVuc"),
            'strPhanLoaiTapChi_Id'      : edu.util.getValById("dropSearch_BBTN_PhanLoai"),
            'strTuKhoa'                 : edu.util.getValById("txtSearch_BBTN_TuKhoa"),
            'iTrangThai'                : 1,
            'strCanBoNhap_Id'           : "",
            'strThanhVienDangKy_Id'     : edu.util.getValById("dropSearch_BBTN_NhanSu"),
            'strLoaiHocVi_Id'           : "",
            'strLoaiChucDanh_Id'        : "",
            'strDonViCuaThanhVien_Id'   : edu.util.getValById("dropSearch_BBTN_CCTC"),
            'strDMTapChiQuocGia_Id'     : "",
            'pageIndex'                 : edu.system.pageIndex_default,
            'pageSize'                  : edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult    = [];
                    var iPager      = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult        = data.Data;
                        iPager          = data.Pager;
                        me.dtTapChiDG   = dtResult;
                    }
                    me.genTable_TCQG(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_TCQG_ThanhVien: function (strId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_TapChiQuocGia_ThanhVien/LayDanhSach',
            
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
                    me.genDetail_ThanhVien_TCQG(dtResult);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia_ThanhVien/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia_ThanhVien/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    genTable_TCQG: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoTN_Tong", iPager);
        var html = '';
        var jsonForm = {
            strTable_Id: "tblBaiBaoTN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.BaiBaoTrongNuoc.getList_TCQG()",
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
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENBAIBAO) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_TCQG: function (data) {
        var me = this;
        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewHTMLById("lblBaiBaoTN_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        //View - Thong tin
        edu.util.viewHTMLById("lblBaiBaoTN_Ten", dt.TENBAIBAO.toUpperCase());
        edu.util.viewHTMLById("lblBaiBaoTN_TenTapChiDang", dt.TENTAPCHIDADANG);
        edu.util.viewHTMLById("lblBaiBaoTN_Ma", dt.MASANPHAM);
        edu.util.viewHTMLById("lblBaiBaoTN_ThoiGianPhanBo", dt.NAMCONGBO);
        edu.util.viewHTMLById("lblBaiBaoTN_LinhVuc", dt.THUOCLINHVUCNAO);
        edu.util.viewHTMLById("lblBaiBaoTN_PhanLoai", dt.PHANLOAITAPCHI);
        edu.util.viewHTMLById("lblBaiBaoTN_Tap", dt.TAPCUATAPCHI);
        edu.util.viewHTMLById("lblBaiBaoTN_So", dt.SOTAPCHI);
        edu.util.viewHTMLById("lblBaiBaoTN_Trang", dt.TRANGTAPCHI);
        edu.util.viewHTMLById("lblBaiBaoTN_TrichDanPubmet", dt.TENBAIBAOTRICHDAN_PUBMED);
        //View - Noi dung minh chung
        edu.util.viewHTMLById("lblBaiBaoTN_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        //edu.system.viewFiles("lblBaiBaoTN_FileDinhKem", dt.FILEMINHCHUNG);
        //vanhiep update
        setTimeout(function () {
            edu.system.viewFiles("lblBaiBaoTN_FileDinhKem", dt.ID, "NCKH_Files");
        }, 50);
    },
    genDetail_ThanhVien_TCQG: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDetail_TCQG_ThanhVien",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = aData.MACANBO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strVaiTro = edu.util.returnEmpty(aData.VAITRO_TEN);
                        return strVaiTro;
                    }
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
        //var jsonNS = $.parseJSON(localStorage.dataNhanSu_Combo);
        var me = main_doc.BaiBaoTrongNuoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: "AVATAR"
            },
            renderPlace: ["dropSearch_NhanSu"],
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
            renderPlace: ["dropSearch_CCTC"],
            type: "",
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    }
};