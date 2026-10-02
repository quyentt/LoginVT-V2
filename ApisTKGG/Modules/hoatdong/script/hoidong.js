/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 18/01/2019
----------------------------------------------*/
function HoiDong() { }
HoiDong.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtHoiDong: [],
    strHoiDong_Id: '',
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
        $(".btnSearchHoiDong_NhanSu").click(function () {
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
        $("#btnSaveHoiDong").click(function () {
            me.save_HoiDong();
        });
        $("#btnSearch_HoiDong_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_HoiDong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblHoiDong_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                me.getList_HoiDong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHoiDong_NhanSu").delegate('.btnView', 'mouseenter', function (e) {
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
        $("#dropSearch_HoiDong_CCTC").on("select2:select", function () {
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
        $("#tblInput_HoiDong_NhanSu").delegate('.btnRemove', 'click', function () {
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
        edu.util.focus("txtSearch_HoiDong_NhanSu");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropHoiDong_NamApDung", "Chọn năm áp dụng")
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_HoiDong();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strHoiDong_Id = "";
        //
        var arrId = ["txtHoiDong_NgayBatDau", "txtHoiDong_NgayKetThuc", "txtHoiDong_SoNgayNghi", "txtHoiDong_ThamNien", "dropHoiDong_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbHoiDong_All").prop('checked', false);
        $("#tblInput_HoiDong_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneHoiDong", "zone_detail_HoiDong");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneHoiDong", "zone_input_HoiDong");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneHoiDong", "zone_notify_HoiDong");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_HoiDong_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_HoiDong_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_HoiDong_TuKhoa"),
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
        var me = main_doc.HoiDong;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblHoiDong_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHoiDong_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiDong.getList_NhanSu()",
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
        var me = main_doc.HoiDong;
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
            renderPlace: ["dropSearch_HoiDong_CCTC"],
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
            renderPlace: ["dropSearch_HoiDong_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB HoiDong
    -------------------------------------------*/
    getList_HoiDong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_HoatDong_HoiDong/LayDanhSach',
            

            'strTuKhoa': "",
            'iTrangThai': 1,
            'strKLGD_THOIGIAN_ID': "",
            'strTRINHDONGOAINGU_ID': "",
            'strSINHVIEN_ID': "",
            'strHOIDONGDETAI_ID': "",
            'strCANBONHAP_ID': "",
            'strVAITRO_ID': "",
            'strGIANGVIEN_ID': "",
            'strKLGD_DONVITINH_ID': "",
            'strKLGD_HOATDONG_ID': "",
            'strKLGD_TongHopHoatDong_Id': "",
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
                    me.dtHoiDong = dtResult;
                    me.genTable_HoiDong(dtResult, iPager);
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HoiDong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HoiDong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HoiDong: function () {
        var me = this;
        var strNhanSu_Ids = "";

        //check all NhanSu or list of NhanSu
        if ($("#ckbHoiDong_All").is(':checked')) {
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
            'action': 'TKGG_HoatDong_HoiDong/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strNgayBatDau': edu.util.getValById("txtHoiDong_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtHoiDong_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropHoiDong_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtHoiDong_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtHoiDong_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_HoiDong();
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HoiDong/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HoiDong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HoiDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TKGG_HoatDong_HoiDong/CapNhat',
            

            'strId': me.strHoiDong_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayBatDau': edu.util.getValById("txtHoiDong_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtHoiDong_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropHoiDong_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtHoiDong_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtHoiDong_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HoiDong();
                }
                else {
                    edu.system.alert("TKGG_HoatDong_HoiDong/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_HoatDong_HoiDong/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HoiDong: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtHoiDong, "ID", me.viewDetail_HoiDong);
    },
    delete_HoiDong: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TKGG_HoatDong_HoiDong/Xoa',
            

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
                    me.getList_HoiDong();
                }
                else {
                    obj = {
                        content: "TKGG_HoatDong_HoiDong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TKGG_HoatDong_HoiDong/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML HoiDong
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HoiDong: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblHoiDong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiDong.getList_HoiDong()",
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
                    "mDataProp": "NGAYBAOVE"
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
                    "mDataProp": "VAITRO_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default cl-active" href="#"><i class="fa fa-trash"></i></a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default cl-active"><i class="fa fa-edit"></i></a>';
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
        $("#lblHoiDong_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblHoiDong_NhanSu").html(valHoTen);
    },
    viewDetail_HoiDong: function (data) {
        var me = main_doc.HoiDong;

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
        $("#tblInput_HoiDong_NhanSu tbody").append(html);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_HoiDong_NhanSu tbody").html("");
            $("#tblInput_HoiDong_NhanSu tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    }
};