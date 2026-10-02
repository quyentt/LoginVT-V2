/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 30/09/2019
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function KhoanDuocNhanKhac() { };
KhoanDuocNhanKhac.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [do_table] Action Common
        -------------------------------------------*/
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnCloseInput").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });

        


        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            //me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_KhoanDuocNhanKhac();
            //if (me.tab_item_actived.length == 0) $('a[href="#tab_5"]').trigger("shown.bs.tab");
            //else {
            //    for (var i = 0; i < me.tab_item_actived.length; i++) {
            //        me.switch_GetData(me.tab_item_actived[i]);
            //    }
            //}
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            //edu.system.viewFiles("txtThongTinDinhKem", me.strNhanSu_Id, "NS_Files");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.editForm_NhanSu(data);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_CapNhat_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#txtSearch_NgayPhatSinh_TuNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoanDuocNhanKhac();
            }
        });
        $("#txtSearch_NgayPhatSinh_DenNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoanDuocNhanKhac();
            }
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_KhoanDuocNhanKhac").click(function () {
            me.save_KhoanDuocNhanKhac();
            setTimeout(function () {
                me.resetPopup_KhoanDuocNhanKhac();
            }, 1000);
        });
        $("#btnSave_KhoanDuocNhanKhac").click(function () {
            me.save_KhoanDuocNhanKhac();
        });
        $("#tbl_KhoanDuocNhanKhac").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_KhoanDuocNhanKhac");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_KhoanDuocNhanKhac(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_KhoanDuocNhanKhac").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_KhoanDuocNhanKhac");
                $("#btnYes").click(function (e) {
                    me.delete_KhoanDuocNhanKhac(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "dropLoaiKhoan");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.getList_HS();
        }, 150);
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
    processData_CoCauToChuc: function (data) {
        var me = main_doc.KhoanDuocNhanKhac;
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
        me.genComBo_CCTC(data);
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
            renderPlace: ["dropSearch_KhoanDuocNhanKhac_CCTC"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
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
            renderPlace: ["dropSearch_KhoanDuocNhanKhac_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNS_CoCauToChuc"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_khoanduocnhankhac":
                me.resetPopup_KhoanDuocNhanKhac();
                me.popup_KhoanDuocNhanKhac();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_khoanduocnhankhac":
                me.getList_KhoanDuocNhanKhac();
                break;
        }
    },

    /*------------------------------------------
    --Discription: DanhSachNhanSu
    -------------------------------------------*/
   
    getList_HS: function () {
        var me = this;
        
        var strCoCauToChuc = edu.util.getValById("dropSearch_KhoanDuocNhanKhac_CCTC");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_KhoanDuocNhanKhac_BoMon");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);

    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.KhoanDuocNhanKhac;
        me.dtNhanSu = data;
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoanDuocNhanKhac.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnDetail"],
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    reset_HS: function () {
        var me = this;

        $("#tbl_LuongDuocNhan tbody").html("");

    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_KhoanDuocNhanKhac: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_DuocNhan/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_KhoanDuocNhanKhac_CCTC"),
            'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_NgayPhatSinh_TuNgay"),
            'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_NgayPhatSinh_DenNgay"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiTao_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_KhoanDuocNhanKhac(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KhoanDuocNhanKhac: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        //var strNgayKiemTra = edu.util.getValById("txtNgayKiemTra");
        //var strHomNay = edu.util.dateToday();
        //var check = edu.util.dateCompare(strNgayKiemTra, strHomNay);
        //if (check == 1) {
        //    objNotify = {
        //        content: "Ngày khám sức khỏe không được lớn hơn ngày hiện tại!",
        //        type: "w",
        //        prePos: "#myModal #notify"
        //    }
        //    edu.system.alertOnModal(objNotify);
        //    return;
        //}
        var obj_save = {
            'action': 'L_DuocNhan/ThemMoi',
            

            'strId': '',
            'dNam': edu.util.getValById("txtNam"),
            'dThang': edu.util.getValById("txtThang"),
            'strSoTien': edu.util.getValById("txtSoTien"),
            'strChungTu': edu.util.getValById("txtChungTu"),
            'strNgayPhatSinh': edu.util.getValById("txtNgay"),

            'strLoaiKhoan_Id': edu.util.getValById("dropLoaiKhoan"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'L_DuocNhan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        //edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KhoanDuocNhanKhac();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhoanDuocNhanKhac: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_DuocNhan/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KhoanDuocNhanKhac();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_KhoanDuocNhanKhac: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_DuocNhan/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.editForm_KhoanDuocNhanKhac(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    popup_KhoanDuocNhanKhac: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_KhoanDuocNhanKhac");
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_KhoanDuocNhanKhac: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("txtSoTien", "");
        edu.util.viewValById("txtChungTu", "");
        edu.util.viewValById("txtNgay", "");
        edu.util.viewValById("txtThang", "");
        edu.util.viewValById("txtNam", "");
    },
    genTable_KhoanDuocNhanKhac: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_KhoanDuocNhanKhac",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        return html;
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mDataProp": "LOAIKHOAN_TEN"
                },
                {
                    "mDataProp": "NGAYPHATSINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_KhoanDuocNhanKhac: function (data) {
        var me = this;
        me.popup_KhoanDuocNhanKhac();
        //view data --Edit
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
        edu.util.viewValById("dropLoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("txtSoTien", data.SOTIEN);
        edu.util.viewValById("txtChungTu", data.CHUNGTU);
        edu.util.viewValById("txtNgay", data.NGAYPHATSINH);
    },
    editForm_NhanSu: function (data) {
        var me = this;
        //view data --Edit
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO
    },
}