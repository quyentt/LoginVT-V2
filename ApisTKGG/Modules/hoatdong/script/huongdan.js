/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 18/01/2019
----------------------------------------------*/
function HuongDan() { }
HuongDan.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtHuongDan: [],
    strHuongDan_Id: '',
    strNhanSu_Id: '',
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
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchHuongDan_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveHuongDan").click(function () {
            me.save_HuongDan();
        });
        $("#btnSearch_HuongDan_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_HuongDan_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblHuongDan_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                me.getList_HuongDan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHuongDan_NhanSu").delegate('.btnView', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var obj = this;
            var strId = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.extend.popover_NhanSu(strNhanSu_Id, me.dtNhanSu, obj);
        });
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_HuongDan_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
       --Discription: [3] Action QuyetDinh_ThanhVien input
       --Order: 
       -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_tblNhanSu(strNhanSu_Id);
        });
        $("#tblInput_HuongDan_NhanSu").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_HuongDan_NhanSu");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropHuongDan_NamApDung", "Chọn năm áp dụng")
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_HuongDan();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strHuongDan_Id = "";
        //
        var arrId = ["txtHuongDan_NgayBatDau", "txtHuongDan_NgayKetThuc", "txtHuongDan_SoNgayNghi", "txtHuongDan_ThamNien", "dropHuongDan_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbHuongDan_All").prop('checked', false);
        $("#tblInput_HuongDan_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneHuongDan", "zone_detail_HuongDan");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneHuongDan", "zone_input_HuongDan");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneHuongDan", "zone_notify_HuongDan");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB HuongDan
    -------------------------------------------*/
    getList_HuongDan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_HoatDong_HuongDan/LayDanhSach',
            

            'strTuKhoa': "",
            'iTrangThai': 1,
            'strKLGD_THOIGIAN_ID': "",
            'strSINHVIEN_ID': "",
            'strCanBoNhap_Id': "",
            'strGIANGVIEN_ID': "",
            'strKLGD_DONVITINH_ID': "",
            'strKLGD_HOATDONG_ID': "",
            'strPHANLOAIDONGHUONGDAN_Id': "",
            'strKLGD_TongHopHoatDong_Id':"",
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
                    }
                    me.dtHuongDan = dtResult;
                    me.genTable_HuongDan(dtResult, iPager);
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HuongDan/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HuongDan/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HuongDan: function () {
        var me = this;
        var strNhanSu_Ids = "";

        //check all NhanSu or list of NhanSu
        if ($("#ckbHuongDan_All").is(':checked')) {
            strNhanSu_Ids = "ALL";
        }
        else {
            for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
                //convert to string seprate by #
                if (i < me.arrNhanSu_Id.length - 1) {
                    strNhanSu_Ids += me.arrNhanSu_Id[i] + "#";
                }
                else {
                    strNhanSu_Ids += me.arrNhanSu_Id[i];
                }
            }
        }
        console.log("NhanSuId: " + strNhanSu_Ids);
        //--Edit
        var obj_save = {
            'action': 'TKGG_HoatDong_HuongDan/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strNgayBatDau': edu.util.getValById("txtHuongDan_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtHuongDan_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropHuongDan_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtHuongDan_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtHuongDan_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_HuongDan();
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HuongDan/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HuongDan/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HuongDan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TKGG_HoatDong_HuongDan/CapNhat',
            

            'strId': me.strHuongDan_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayBatDau': edu.util.getValById("txtHuongDan_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtHuongDan_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropHuongDan_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtHuongDan_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtHuongDan_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HuongDan();
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HuongDan/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HuongDan/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HuongDan: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtHuongDan, "ID", me.viewDetail_HuongDan);
    },
    delete_HuongDan: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TKGG_HoatDong_HuongDan/Xoa',
            

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HuongDan();
                }
                else {
                    obj = {
                        content: "TKGG_HoatDong_HuongDan/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TKGG_HoatDong_HuongDan/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML HuongDan
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HuongDan: function (data, iPager) {
        var me = this;
        var strNgayBatDau = "";
        var strThoiGian = "";
        var strNgayKetThuc = "";

        var jsonForm = {
            strTable_Id: "tblHuongDan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HuongDan.getList_HuongDan()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 8, 9],
                left: [],
                fix: [0, 8, 9]
            },
            aoColumns: [
                {
                    "mDataProp": ""
                }
                , {
                    "mDataProp": "GIANGVIEN_TEN"
                }
                , {
                    "mDataProp": ""
                }
                , {
                    "mDataProp": "LOPQUANLY_TEN"
                }
                , {
                    "mDataProp": "SINHVIEN_TEN"
                }
                , {
                    "mDataProp": "KLGD_HOATDONG_TEN"
                }
                , {
                    "mDataProp": "PHANLOAIDONGHUONGDAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default cl-active"><i class="fa fa-trash"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default cl-active"><i class="fa fa-edit"></i></a></span>';
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
        $("#lblHuongDan_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblHuongDan_NhanSu").html(valHoTen);
    },
    viewDetail_HuongDan: function (data) {
        var me = main_doc.HuongDan;

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
    }
};