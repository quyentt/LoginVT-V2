/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function NghiHuu() { }
NghiHuu.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [], 
    dtNghiHuu: [],
    strNghiHuu_Id: '',

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
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchNghiHuu_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveNghiHuu").click(function () {
            me.save_NghiHuu();
        });
        $("#btnSearch_NghiHuu_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_NghiHuu_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblNghiHuu_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                //me.getDetail_QuyetDinhNghiHuu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        $("#btnViewNghiHuu_DuBao").click(function () {
            me.toggle_list();
            me.getList_DuBaoNghiHuu();
        });
        /*------------------------------------------
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_NghiHuu_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_NghiHuu_TuKhoa");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropNghiHuu_NamApDung", "Chọn năm áp dụng")
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_NhanSu();
            setTimeout(function () {
                me.getList_CoCauToChuc();
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strNghiHuu_Id = "";
        //
        var arrId = ["txtNghiHuu_NgayBatDau", "txtNghiHuu_NgayKetThuc", "txtNghiHuu_SoNgayNghi", "txtNghiHuu_ThamNien", "dropNghiHuu_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbNghiHuu_All").prop('checked', false);
        $("#tblInput_NghiHuu_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneNghiHuu", "zone_detail_NghiHuu");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneNghiHuu", "zone_list_NghiHuu");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNghiHuu", "zone_notify_NghiHuu");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_NghiHuu_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_NghiHuu_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_NghiHuu_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
    },
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
    --Discription: [1] GenHTML HoSoLyLich
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhanSu: function (data, iPager) {
        var me = main_doc.NghiHuu;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblNghiHuu_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblNghiHuu_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NghiHuu.getList_NhanSu()",
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
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span id="lbl' + aData.ID + '">' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.NghiHuu;
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
            renderPlace: ["dropSearch_NghiHuu_CCTC"],
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
            renderPlace: ["dropSearch_NghiHuu_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NghiHuu
    -------------------------------------------*/
    getList_NghiHuu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_NghiHuuCaNhan/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': "",
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
                    }
                    me.dtNghiHuu = dtResult;
                    me.genTable_NghiHuu(dtResult);
                    edu.util.viewHTMLById("lblCount_NghiHuu", dtResult.length);
                }
                else {
                    edu.system.alert("NS_NghiHuuCaNhan/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NghiHuuCaNhan/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [2] GenHTML NghiHuu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NghiHuu: function (data) {
        var me = this;
        var strNgayBatDau = "";
        var strThoiGian = "";
        var strNgayKetThuc = "";

        var jsonForm = {
            strTable_Id: "tblNghiHuu",
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
                        strNgayBatDau = edu.util.returnEmpty(aData.NGAYBATDAU, "date");
                        strNgayKetThuc = edu.util.returnEmpty(aData.NGAYKETTHUC, "date");
                        strThoiGian = '<span class="italic">' + strNgayBatDau + "-" + strNgayKetThuc + '</span>';
                        if (edu.util.dateInRange(edu.util.dateToday(), strNgayBatDau, strNgayKetThuc)) {
                            iTinhTrang = '<i class="fa fa-ellipsis-h color-warning"></i>';
                        }
                        return strThoiGian;
                    }
                }
                , {
                    "mDataProp": "DIADIEMNghiHuu",
                }
                , {
                    "mDataProp": "NOIDUNGNghiHuu",
                }
                , {
                    "mDataProp": "KETQUADATDUOC",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default"><i class="fa fa-edit"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_NhanSu: function (strId) {
        var me = this;
        var dt = [];
        $("#lblNghiHuu_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblNghiHuu_NhanSu").html(valHoTen);
    },
    viewDetail_NghiHuu: function (data) {
        var me = main_doc.NghiHuu;

        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewHTMLById("lblQuyetDinh_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        //View - Thong tin
        edu.util.viewHTMLById("lblQuyetDinh_Ten", dt.THONGTINQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_Loai", dt.LOAIQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_So", dt.SOQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_Ngay", dt.NGAYQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_NgayHieuLuc", dt.NGAYHIEULUC);
        edu.util.viewHTMLById("lblQuyetDinh_NgayKetThuc", dt.NGAYHETHIEULUC);
        edu.util.viewHTMLById("lblQuyetDinh_NguoiKy", dt.NGUOIKYQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_ChuKy", "");
        //View - Noi dung minh chung
        edu.system.viewFiles("lblQuyetDinh_File", dt.THONGTINDINHKEM);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB DuBaoNghiHuu
    --ULR:  Modules
    -------------------------------------------*/
    getList_DuBaoNghiHuu: function () {
        var me = this;
        var strDonViBoPhan_Id = "";
        var strCoCauToChuc = $("#dropSearch_NghiHuu_CCTC").val();
        var strBoMon = $("#dropSearch_NghiHuu_BoMon").val();
        if (edu.util.checkValue(strBoMon)) {
            strDonViBoPhan_Id = strBoMon;
        }
        else {
            strDonViBoPhan_Id = strCoCauToChuc;
        }
        //--Edit
        var obj_list = {
            'action': 'NS_DuBao/NghiHuu',
            

            'strDonViBoPhan_GiangVien_Id': strDonViBoPhan_Id,
            'dNamDuBao': edu.util.thisYear(),
            'dDoTuoiDuBao_Nam': 55,
            'dDoTuoiDuBao_Nu':50
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
                    me.genTable_DuBaoNghiHuu(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_DuBao/NghiHuu: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_DuBao/NghiHuu (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DuBaoNghiHuu: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblNghiHuu_DuKien_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblNghiHuu_DuBao",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "HOTEN"
                }
                , {
                    "mDataProp": "GIOITINH_TEN"
                }
                , {
                    "mDataProp": "NGAYSINHDAYDU"
                }
                , {
                    "mDataProp": "LOAICHUCDANH"
                }
                , {
                    "mDataProp": "DAOTAO_COCAUTOCHUC"
                }
                , {
                    "mDataProp": "NGACHLUONG_MA"
                }
                , {
                    "mDataProp": "NGAYDUKIENNGHIHUU"//ngaydukiennghihuu
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};