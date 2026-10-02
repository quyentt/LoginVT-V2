/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function ChamCongVaoRa() { }
ChamCongVaoRa.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu:[],
    dtCCVaoRa: [],
    strCCVaoRa_Id: '',
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
        $(".btnSearchCCVaoRa_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.toggle_input();
        });
        $("#btnSaveCCVaoRa").click(function () {
            me.save_CCVaoRa();
        });
        $("#btnSearch_CCVaoRa_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_CCVaoRa_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblCCVaoRa_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                me.getList_CCVaoRa(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_CCVaoRa_CCTC").on("select2:select", function () {
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
        edu.util.focus("txtSearch_CCVaoRa_TuKhoa");
        me.toggle_notify();
        $(".lblCCRaVao_Thang").html(edu.util.thisMonth() + "/" + edu.util.thisYear());
        edu.system.dateYearToCombo("1993", "dropCCVaoRa_NamApDung", "Chọn năm áp dụng")
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
        //
        var arrId = [""];
        edu.util.resetValByArrId(arrId);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneCCVaoRa", "zone_detail_CCVaoRa");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneCCVaoRa", "zone_notify_CCVaoRa");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_CCVaoRa_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CCVaoRa_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CCVaoRa_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
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
        var me = main_doc.ChamCongVaoRa;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblCCVaoRa_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblCCVaoRa_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChamCongVaoRa.getList_NhanSu()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
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
        var me = main_doc.ChamCongVaoRa;
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
            renderPlace: ["dropSearch_CCVaoRa_CCTC"],
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
            renderPlace: ["dropSearch_CCVaoRa_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CCVaoRa
    -------------------------------------------*/
    getList_CCVaoRa: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_VaoRaCaNhan/LayDanhSach',
            

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
                        iPager = data.Pager;
                    }
                    me.dtCCVaoRa = dtResult;
                    me.genTable_CCVaoRa(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_VaoRaCaNhan/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_VaoRaCaNhan/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CCVaoRa: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_VaoRaCaNhan/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': "",
            'strThoiGian': edu.util.getValById("txtCCVaoRa_NgayBatDau"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_CCVaoRa();
                }
                else {
                    edu.system.alert("NS_VaoRaCaNhan/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_VaoRaCaNhan/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_CCVaoRa: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_VaoRaCaNhan/CapNhat',
            

            'strId': me.strCCVaoRa_Id,
            'strNhanSu_HoSoCanBo_Id': "",
            'strThoiGian': edu.util.getValById("txtCCVaoRa_NgayBatDau"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_CCVaoRa();
                }
                else {
                    edu.system.alert("NS_VaoRaCaNhan/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_VaoRaCaNhan/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_CCVaoRa: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtCCVaoRa, "ID", me.viewDetail_CCVaoRa);
    },
    delete_CCVaoRa: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_VaoRaCaNhan/Xoa',
            

            'strIds': strId,
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
                    me.getList_CCVaoRa();
                }
                else {
                    obj = {
                        content: "NS_VaoRaCaNhan/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_VaoRaCaNhan/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML CCVaoRa
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CCVaoRa: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblCCVaoRa",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChamCongVaoRa.getList_CCVaoRa()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DIADIEMCCVaoRa",
                }
                , {
                    "mDataProp": "DIADIEMCCVaoRa",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_NhanSu: function (strId) {
        var me = this;
        var dt = [];
        $("#lblCCVaoRa_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblCCVaoRa_NhanSu").html(valHoTen);
    },
    viewDetail_CCVaoRa: function (data) {
        var me = main_doc.ChamCongVaoRa;

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
};