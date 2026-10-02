/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 18/01/2019
----------------------------------------------*/
function KDM_NhanSu() { }
KDM_NhanSu.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtKDM_NhanSu: [],
    strKDM_NhanSu_Id: '',
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
        $(".btnSearchKDM_NhanSu_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action Search NhanSu
        --Order: 
        -------------------------------------------*/
        $("#txtSearch_KDM_NhanSu_NhanSu").focusin(function (e) {
            $("#boxSearch_NhanSu").show();
        });
        $("#boxSearch_NhanSu").mouseleave(function () {
            $("#boxSearch_NhanSu").hide();
        });
        $("#txtSearch_KDM_NhanSu_NhanSu").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
                $("#boxSearch_NhanSu").html(me.boxResult_NhanSu());
            }
        });
        $("#boxSearch_NhanSu").delegate(".btnSelect", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/select_/g, strId);
            if (edu.util.checkValue(strId)) {
                //getvalue
                me.strNhanSu_Id = strId;
                $("#txtSearch_KDM_NhanSu_NhanSu").val(strId);
                var strTen = $("#lbl" + strId).html();
                //append result
                var html = '';
                html += '<span class="rs" style="background:#f1f1f1; border-radius:5px; padding:2px; font-style:italic; font-size:16px">';
                html += '<div style="display:inline-block; padding-right:5px">' + strTen + '</div>';
                html += '<div style="display:inline-block"><a class="poiter btnClose"><i class="fa fa-times-circle"></i></a></div>';
                html += '</span>';
                $("#txtSearch_KDM_NhanSu_NhanSu").after(html);
                $("#txtSearch_KDM_NhanSu_NhanSu").hide();
                //close
                $(".btnClose").click(function () {
                    $("#txtSearch_KDM_NhanSu_NhanSu").show();
                    $("#txtSearch_KDM_NhanSu_NhanSu").val('');
                    $("#txtSearch_KDM_NhanSu_NhanSu").focus();
                    $(".rs").remove();
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_KDM_NhanSu_CCTC").on("select2:select", function () {
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
        $("#tblInput_KDM_NhanSu_NhanSu").delegate('.btnRemove', 'click', function () {
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
        edu.util.focus("txtSearch_KDM_NhanSu_TuKhoa");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropKDM_NhanSu_NamApDung", "Chọn năm áp dụng")
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_KDM_NhanSu();
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strKDM_NhanSu_Id = "";
        //
        var arrId = ["txtKDM_NhanSu_NgayBatDau", "txtKDM_NhanSu_NgayKetThuc", "txtKDM_NhanSu_SoNgayNghi", "txtKDM_NhanSu_ThamNien", "dropKDM_NhanSu_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbKDM_NhanSu_All").prop('checked', false);
        $("#tblInput_KDM_NhanSu_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneKDM_NhanSu", "zone_detail_KDM_NhanSu");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneKDM_NhanSu", "zone_input_KDM_NhanSu");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneKDM_NhanSu", "zone_notify_KDM_NhanSu");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_KDM_NhanSu_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_KDM_NhanSu_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_KDM_NhanSu_NhanSu"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: ""
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
    },
    find_NhanSu: function () {
        edu.util.objGetDataInData(strId, edu.extend.dtNhanSu, "ID", me.genTable_NhanSu);
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
        var me = main_doc.KDM_NhanSu;

        edu.util.viewHTMLById("lblKDM_NhanSu_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblKDM_NhanSu_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KDM_NhanSu.getList_NhanSu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnSelect"],
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
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.KDM_NhanSu;
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
            renderPlace: ["dropSearch_KDM_NhanSu_CCTC"],
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
            renderPlace: ["dropSearch_KDM_NhanSu_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB KDM_NhanSu
    -------------------------------------------*/
    getList_KDM_NhanSu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KhungDinhMuc_NhanSu/LayDanhSach',
            

            'strKLGD_THOIGIAN_Id': "",
            'strLOAICHUCDANH_Id': me.strNhanSu_Id,
            'strKLGD_KhungDMChuan_Id': "",
            'strNHANSU_HOSOCANBO_Id': "",
            'strDonVi_Id': "",
            'strCANBONHAP_Id': "",
            'dTuKhoaNumber': -1,
            'strTuKhoaText':"",
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
                    me.dtKDM_NhanSu = dtResult;
                    me.genTable_KDM_NhanSu(dtResult);
                }
                else {
                    edu.system.alert("TKGG_KhungDinhMuc_NhanSu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_KhungDinhMuc_NhanSu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KDM_NhanSu: function () {
        var me = this;
        var strNhanSu_Ids = "";

        //check all NhanSu or list of NhanSu
        if ($("#ckbKDM_NhanSu_All").is(':checked')) {
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
            'action': 'TKGG_KhungDinhMuc_NhanSu/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strNgayBatDau': edu.util.getValById("txtKDM_NhanSu_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtKDM_NhanSu_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropKDM_NhanSu_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtKDM_NhanSu_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtKDM_NhanSu_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_KDM_NhanSu();
                }
                else {
                    edu.system.alert("TKGG_KhungDinhMuc_NhanSu/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_KhungDinhMuc_NhanSu/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_KDM_NhanSu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TKGG_KhungDinhMuc_NhanSu/CapNhat',
            

            'strId': me.strKDM_NhanSu_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayBatDau': edu.util.getValById("txtKDM_NhanSu_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtKDM_NhanSu_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropKDM_NhanSu_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtKDM_NhanSu_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtKDM_NhanSu_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_KDM_NhanSu();
                }
                else {
                    edu.system.alert("TKGG_KhungDinhMuc_NhanSu/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("TKGG_KhungDinhMuc_NhanSu/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_KDM_NhanSu: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtKDM_NhanSu, "ID", me.viewDetail_KDM_NhanSu);
    },
    delete_KDM_NhanSu: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TKGG_KhungDinhMuc_NhanSu/Xoa',
            

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
                    me.getList_KDM_NhanSu();
                }
                else {
                    obj = {
                        content: "TKGG_KhungDinhMuc_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TKGG_KhungDinhMuc_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML KDM_NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KDM_NhanSu: function (data) {
        var me = this;
        var strHoTen = "";

        var jsonForm = {
            strTable_Id: "tblKDM_NhanSu",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 4, 5, 6, 7],
                left: [1, 2, 3],
                fix: [0, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strHoTen = edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HOTEN);
                        return strHoTen;
                    }
                }
                , {
                    "mDataProp": "CHUCVUCHINHQUYENKIEMNHIEM"
                }
                , {
                    "mDataProp": "KLGD_KHUNGDINHMUCGIOCHUAN_TEN"
                }
                , {
                    "mDataProp": "SOGIOCHUAN"
                }
                , {
                    "mDataProp": "TYLEMIEN"
                }
                , {
                    "mDataProp": "TYLEMIENGIAMKHAC"
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
        $("#lblKDM_NhanSu_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblKDM_NhanSu_NhanSu").html(valHoTen);
    },
    viewDetail_KDM_NhanSu: function (data) {
        var me = main_doc.KDM_NhanSu;

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
        $("#tblInput_KDM_NhanSu_NhanSu tbody").append(html);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_KDM_NhanSu_NhanSu tbody").html("");
            $("#tblInput_KDM_NhanSu_NhanSu tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    boxResult_NhanSu: function () {
        var me = this;
        var box = '';
        box += '<div style="background: #808080;z-index:1051; position:absolute; width:99.5%; border:1px solid #909090; border-top:none">';
        box += '<div class="box box-solid" >';
        box += '<div class="box-header with-border">';
        box += '<h3 class="box-title" title="Tổng bài báo trong nước">';
        box += '<i class="fa fa-search"></i> Kết quả';
        box += '</h3>';
        box += '<span class="pull-right badge bg-light-blue">';
        box += '<span id="lblKDM_NhanSu_NhanSu_Tong"></span>';
        box += '</span>';
        box += '</div>';
        box += '<div class="box-body">';
        box += '<table id="tblKDM_NhanSu_NhanSu" class="table table-hover">';
        box += '<tbody></tbody>';
        box += '</table>';
        box += '</div>';
        box += '</div>';
        box += '</div>';
        return box;
    },
};