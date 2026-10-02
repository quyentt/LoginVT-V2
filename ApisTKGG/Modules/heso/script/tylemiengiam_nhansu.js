/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 18/01/2019
----------------------------------------------*/
function TLMG_NhanSu() { }
TLMG_NhanSu.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtTLMG_NhanSu: [],
    strTLMG_NhanSu_Id: '',
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
        $(".btnSearchTLMG_NhanSu_NhanSu").click(function () {
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
        $("#btnSaveTLMG_NhanSu").click(function () {
            me.save_TLMG_NhanSu();
        });
        $("#btnSearch_TLMG_NhanSu_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_TLMG_NhanSu_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblTLMG_NhanSu_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                me.getList_TLMG_NhanSu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTLMG_NhanSu_NhanSu").delegate('.btnView', 'mouseenter', function (e) {
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
        $("#dropSearch_TLMG_NhanSu_CCTC").on("select2:select", function () {
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
        $("#tblInput_TLMG_NhanSu_NhanSu").delegate('.btnRemove', 'click', function () {
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
        edu.util.focus("txtSearch_TLMG_NhanSu_TuKhoa");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropTLMG_NhanSu_NamApDung", "Chọn năm áp dụng")
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_TLMG_NhanSu();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTLMG_NhanSu_Id = "";
        //
        var arrId = ["txtTLMG_NhanSu_NgayBatDau", "txtTLMG_NhanSu_NgayKetThuc", "txtTLMG_NhanSu_SoNgayNghi", "txtTLMG_NhanSu_ThamNien", "dropTLMG_NhanSu_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbTLMG_NhanSu_All").prop('checked', false);
        $("#tblInput_TLMG_NhanSu_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneTLMG_NhanSu", "zone_detail_TLMG_NhanSu");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneTLMG_NhanSu", "zone_input_TLMG_NhanSu");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneTLMG_NhanSu", "zone_notify_TLMG_NhanSu");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_TLMG_NhanSu_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_TLMG_NhanSu_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_TLMG_NhanSu_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: ""
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
    },
    getList_CoCauToChuc: function () {
        var me = this;
        me.processData_CoCauToChuc(edu.extend.dtCoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoSoLyLich
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhanSu: function (data, iPager) {
        var me = main_doc.TLMG_NhanSu;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblTLMG_NhanSu_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblTLMG_NhanSu_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TLMG_NhanSu.getList_NhanSu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
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
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.TLMG_NhanSu;
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
            renderPlace: ["dropSearch_TLMG_NhanSu_CCTC"],
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
            renderPlace: ["dropSearch_TLMG_NhanSu_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB TLMG_NhanSu
    -------------------------------------------*/
    getList_TLMG_NhanSu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_TyLeMienGiam_NhanSu/LayDanhSach',
            

            'strKLGD_CHUCVU_Id': "",
            'strKLGD_THOIGIAN_Id': "",
            'strNHANSU_HOSOCANBO_Id': me.strNhanSu_Id,
            'dTuKhoaNumber': -1,
            'strTuKhoaText': "",
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
                    me.dtTLMG_NhanSu = dtResult;
                    me.genTable_TLMG_NhanSu(dtResult);
                }
                else {
                    edu.system.alert("TKGG_TyLeMienGiam_NhanSu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_TyLeMienGiam_NhanSu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_TLMG_NhanSu: function () {
        var me = this;
        var strNhanSu_Ids = "";

        //check all NhanSu or list of NhanSu
        if ($("#ckbTLMG_NhanSu_All").is(':checked')) {
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
            'action': 'TKGG_TyLeMienGiam_NhanSu/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strNgayBatDau': edu.util.getValById("txtTLMG_NhanSu_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtTLMG_NhanSu_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropTLMG_NhanSu_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtTLMG_NhanSu_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtTLMG_NhanSu_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_TLMG_NhanSu();
                }
                else {
                    edu.system.alert("TKGG_TyLeMienGiam_NhanSu/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_TyLeMienGiam_NhanSu/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TLMG_NhanSu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TKGG_TyLeMienGiam_NhanSu/CapNhat',
            

            'strId': me.strTLMG_NhanSu_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayBatDau': edu.util.getValById("txtTLMG_NhanSu_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtTLMG_NhanSu_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropTLMG_NhanSu_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtTLMG_NhanSu_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtTLMG_NhanSu_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_TLMG_NhanSu();
                }
                else {
                    edu.system.alert("TKGG_TyLeMienGiam_NhanSu/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_TyLeMienGiam_NhanSu/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_TLMG_NhanSu: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtTLMG_NhanSu, "ID", me.viewDetail_TLMG_NhanSu);
    },
    delete_TLMG_NhanSu: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TKGG_TyLeMienGiam_NhanSu/Xoa',
            

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
                    me.getList_TLMG_NhanSu();
                }
                else {
                    obj = {
                        content: "TKGG_TyLeMienGiam_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TKGG_TyLeMienGiam_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML TLMG_NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TLMG_NhanSu: function (data) {
        var me = this;
        var strHoTen = "";

        var jsonForm = {
            strTable_Id: "tblTLMG_NhanSu",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 4, 5],
                right: [3],
                fix: [0, 4, 5]
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_THOIGIAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        strHoTen = edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                        return strHoTen;
                    }
                }
                , {
                    "mDataProp": "TYLEMIEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default"><i class="fa fa-trash"></i></a></span>';
                    }
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
        $("#lblTLMG_NhanSu_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblTLMG_NhanSu_NhanSu").html(valHoTen);
    },
    viewDetail_TLMG_NhanSu: function (data) {
        var me = main_doc.TLMG_NhanSu;

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
    --Discription: [2] GenHTML add NhanSu
    --Task: 
    -------------------------------------------*/
    addHTMLinto_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ngaysinh = "#sl_ngaysinh" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valNgaySinh = $($ngaysinh).text();
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valNgaySinh + "</span></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove poiter'>Bỏ chọn</td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TLMG_NhanSu_NhanSu tbody").append(html);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_TLMG_NhanSu_NhanSu tbody").html("");
            $("#tblInput_TLMG_NhanSu_NhanSu tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    }
};