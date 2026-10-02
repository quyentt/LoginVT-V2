/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function QuaTrinhLuong() { };
QuaTrinhLuong.prototype = {
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


        $("#tblCapNhat_QuaTrinhLuong").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            //me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_QuaTrinhLuong();
            //if (me.tab_item_actived.length == 0) $('a[href="#tab_5"]').trigger("shown.bs.tab");
            //else {
            //    for (var i = 0; i < me.tab_item_actived.length; i++) {
            //        me.switch_GetData(me.tab_item_actived[i]);
            //    }
            //}
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_QuaTrinhLuong");
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
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_QuaTrinhLuong").click(function () {
            me.save_QuaTrinhLuong();
            setTimeout(function () {
                me.resetPopup_QuaTrinhLuong();
            }, 1000);
        });
        $("#btnSave_QuaTrinhLuong").click(function () {
            me.save_QuaTrinhLuong();
        });
        $("#tbl_QuaTrinhLuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_QuaTrinhLuong");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_QuaTrinhLuong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_QuaTrinhLuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_QuaTrinhLuong");
                $("#btnYes").click(function (e) {
                    me.delete_QuaTrinhLuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_CapNhat_CCTC").on("select2:select", function () {
            me.getList_CoCauToChuc();
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_BoMon").on("select2:select", function () {
            me.getList_HS();
        });

        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        });
        $("#zone_input_QuaTrinhLuong").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblQuyetDinh tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input_QuaTrinhLuong").delegate(".deleteQuyetDinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_QuyetDinh(strId);
            });
        });

    },
    page_load: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUDI", "", "", me.cbGetList_LoaiQuyetDinh);
        //edu.system.loadToCombo_DanhMucDuLieu("QLNS.NHOMNGACH", "dropNhomNgach");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NHOMNGACH", "dropNhomNgach");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "dropNgach");
        edu.system.loadToCombo_DanhMucDuLieu("NS.CDNN", "dropChucDanhNgheNghiep");
        //edu.system.loadToCombo_DanhMucDuLieu("QLCB.DMBL", "dropBacLuong");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.getList_HS();
        }, 150);
        me.getList_QuyDinhLuong();
        me.getList_BangHeSoLuong();
    },

    cbGetList_LoaiQuyetDinh: function (data) {
        main_doc.QuaTrinhLuong.dtLoaiQuyetDinh = data;
    },
    genComBo_LoaiQuyetDinh: function (strQuyetDinh_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiQuyetDinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strQuyetDinh_Id],
            type: "",
            title: "Chọn loại quyết định"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strQuyetDinh_Id).select2();
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
        var me = main_doc.QuaTrinhLuong;
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
            renderPlace: ["dropSearch_CapNhat_CCTC"],
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
            renderPlace: ["dropSearch_CapNhat_BoMon"],
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
            case "key_quatrinhluong":
                me.resetPopup_QuaTrinhLuong();
                me.popup_QuaTrinhLuong();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_quatrinhluong":
                me.getList_QuaTrinhLuong();
                break;
        }
    },

    /*------------------------------------------
    --Discription: DanhSachNhanSu
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
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
        var me = main_doc.QuaTrinhLuong;
        me.dtNhanSu = data;
        $("#zoneEdit").slideDown();
        $("#lbl_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_QuaTrinhLuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhLuong.getList_HS()",
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

        $("#tbl_QuaTrinhLuong tbody").html("");

    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_QuaTrinhLuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_QT_Luong/LayDanhSach',


            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_QuaTrinhLuong(data.Data, data.Pager);
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
    save_QuaTrinhLuong: function () {
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
        //var BangHeSoLuong_val = edu.util.getValCheckBoxByDiv("divLoaiKhoanTinhBaoHiem");//Kiểu check box
        var obj_save = {
            'action': 'NS_QT_Luong/ThemMoi',


            'strId': '',
            'strNhanSu_ThongTinQD_Id': "",
            'strSoQuyetDinh': "",
            'strNgayQuyetDinh': "",
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': "",
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': "",
            'strNgayHetHieuLuc': "",
            'iTrangThai': 1,
            'iThuTu': "",
            'strNhanSu_BangQDLuong_Id': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNgayHuong': edu.util.getValById("txtNgayHuong"),
            'strLyDo': edu.util.getValById("txtLyDo"),
            'strNhomNgach_Id': edu.util.getValById("dropNhomNgach"),
            'strNgach_Id': edu.util.getValById("dropNgach"),
            'strLoaiChucDanhNgheNghiep_Id': edu.util.getValById('dropChucDanhNgheNghiep'),
            //'dBac': edu.util.getValById("dropBacLuong"),
            'dBac': edu.util.getValById("txtBacLuong"),
            'strLoai_Id': "",
            'dHeSoLuong': edu.util.getValById("txtHeSoLuong"),
            'strNhanSu_BangHeSoLuong_Id': "",
            'strLoaiChucDanhNgheNghiep_Id': "",
            'dPhanTramHuong': edu.util.getValById("txtPhanTramHuong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_Luong/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = me.strCommon_Id;
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NS_QT_Luong");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#tblQuyetDinh tbody tr").each(function () {
                        var strQuyetDinh_Id = this.id.replace(/rm_row/g, '');
                        me.save_QuyetDinh(strQuyetDinh_Id, strId);
                    });
                    me.getList_QuaTrinhLuong();
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
    delete_QuaTrinhLuong: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_QT_Luong/Xoa',

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
                    me.getList_QuaTrinhLuong();
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
    getDetail_QuaTrinhLuong: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_QT_Luong/LayChiTiet',

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
                        me.editForm_QuaTrinhLuong(data.Data[0]);
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

    popup_QuaTrinhLuong: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_QuaTrinhLuong");
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_QuaTrinhLuong: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("dropNhomNgach", "");
        edu.util.viewValById("dropNgach", "");
        edu.util.viewValById("dropChucDanhNgheNghiep", "");
        edu.util.viewValById("txtBacLuong", "");
        edu.util.viewValById("txtHeSoLuong", "");
        edu.util.viewValById("txtNgayHuong", "");
        edu.util.viewValById("txtPhanTramHuong", "");
        edu.util.viewValById("txtLyDo", "");
        edu.util.viewValById("txtMocNangBacLuongLanSau", "");
        edu.util.viewValById("txtLtxtNgayXetTangLuongDuKienyDo", "");
        $("#tblQuyetDinh tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.QuaTrinhLuong.genHTML_QuyetDinh(id, "");
        }
    },
    genTable_QuaTrinhLuong: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_QuaTrinhLuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "NGACH_MA"
                },
                {
                    "mDataProp": "BAC"
                },
                {
                    "mDataProp": "HESOLUONG"
                },
                {
                    "mDataProp": "NGAYHUONG"
                },
                {
                    "mDataProp": "PHANTRAMHUONG"
                },
                {
                    "mDataProp": "LYDO"
                },
                //{
                //    "mDataProp": "THONGTINQUYETDINH"
                //},
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
    editForm_QuaTrinhLuong: function (data) {
        var me = this;
        me.popup_QuaTrinhLuong();
        //view data --Edit
        edu.util.viewValById("dropNhomNgach", data.NHOM_ID);
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        edu.util.viewValById("dropChucDanhNgheNghiep", data.LOAICHUCDANHNGHENGHIEP_ID);
        //edu.util.viewValById("dropBacLuong", data.NGACH_ID);
        edu.util.viewValById("txtBacLuong", data.BACLUONG_HIENTAI);
        edu.util.viewValById("txtHeSoLuong", data.HESOLUONG);
        edu.util.viewValById("txtNgayHuong", data.NGAYHUONG);
        edu.util.viewValById("txtPhanTramHuong", data.PHANTRAMHUONG);
        edu.util.viewValById("txtLyDo", data.LYDO);
        edu.util.viewValById("txtMocNangBacLuongLanSau", data.BACLUONG_TIEPTHEO);//
        edu.util.viewValById("txtNgayXetTangLuongDuKien", data.NGAYHUONGLUONG_TIEPTHEO);//
        me.getList_QuyetDinh();
    },

    editForm_NhanSu: function (data) {
        var me = this;
        //me.popup_QuaTrinhLuong();
        //view data --Edit
        // edu.util.viewValById("dropQuyDinhLuong", data.NHOMMAU_ID);
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    getList_QuyDinhLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',


            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
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
                    me.genCombo_QuyDinhLuong(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_BangQuyDinhLuong/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("L_BangQuyDinhLuong/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_QuyDinhLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCLUONGCOBAN",
                code: "MUCLUONGCOBAN",
                order: "unorder"
            },
            renderPlace: ["dropQuyDinhLuong"],
            title: "Chọn quy định lương"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_BangHeSoLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangHeSoLuong/LayDanhSach',


            'strTuKhoa': "",
            'strNgach_Id': "",
            'strNhom_Id': "",
            'strLoai_Id': "",
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
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
                    me.genCombo_BangHeSoLuong(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_BangHeSoLuong/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("L_BangHeSoLuong/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_BangHeSoLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THONGTINHIENTHI",
                code: "THONGTINHIENTHI",
                order: "unorder"
            },
            renderPlace: ["dropBangHeSoLuong"],
            title: "Chọn bảng hệ số lương"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [2] AccessDB QuyetDinh
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyetDinh: function (strQuyetDinh_Id, strQuaTrinhLuong_Id) {
        var me = this;
        var strId = strQuyetDinh_Id;
        var strLoaiQuyetDinh = edu.util.getValById('dropLoaiQuyetDinh' + strQuyetDinh_Id);
        var strSoQuyetDinh = edu.util.getValById('txtSoQuyetDinh' + strQuyetDinh_Id);
        var strNgayQuyetDinh = edu.util.getValById('txtNgayQuyetDinh' + strQuyetDinh_Id);
        var strNamBatDau = edu.util.getValById('txtNamBatDau' + strQuyetDinh_Id);
        var strNamKetThuc = edu.util.getValById('txtNamKetThuc' + strQuyetDinh_Id);
        if (!edu.util.checkValue(strSoQuyetDinh)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinQuyetDinh/ThemMoi',


            'strId': strId,
            'strNguonDuLieu_Id': strQuaTrinhLuong_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNgayQuyetDinh': strNgayQuyetDinh,
            'strNguoiKyQuyetDinh': '',
            'strNgayHieuLuc': strNamBatDau,
            'strThongTinQuyetDinh': '',
            'strThongTinDinhKem': '',
            'strLoaiQuyetDinh_Id': strLoaiQuyetDinh,
            'strNgayHetHieuLuc': strNamKetThuc,
            'iTrangThai': 1,
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_ThongTinQuyetDinh/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(obj_save + ": " + data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strQuyetDinh_Id, strId, "NS_Files");


            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuyetDinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinQuyetDinh/LayDanhSach',


            'strTuKhoa': '',
            'strNguonDuLieu_Id': me.strCommon_Id,
            'iTrangThai': 1,
            'strNgayHieuLuc_Tu': '',
            'strNgayHieuLuc_Den': '',
            'strLoaiQuyetDinh_Id': '',
            'strThanhVien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000000
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_QuyetDinh_Data(dtResult);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_QuyetDinh: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_ThongTinQuyetDinh/Xoa',

            'strIds': strIds,
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
                    me.getList_QuyetDinh();
                }
                else {
                    obj = {
                        content: "NS_ThongTinQuyetDinh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "NS_ThongTinQuyetDinh/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_QuyetDinh_Data: function (data) {
        var me = this;
        $("#tblQuyetDinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strQuyetDinh_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strQuyetDinh_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strQuyetDinh_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropLoaiQuyetDinh' + strQuyetDinh_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
            row += '<td><input type="text" id="txtSoQuyetDinh' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgayQuyetDinh' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYQUYETDINH) + '" class="form-control input-datepicker_X"/></td>';
            row += '<td><input type="text" id="txtNamBatDau' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHIEULUC) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNamKetThuc' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHETHIEULUC) + '" class="form-control"/></td>';
            row += '<td><div id="txtFileDinhKem' + strQuyetDinh_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteQuyetDinh" id="' + strQuyetDinh_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblQuyetDinh tbody").append(row);
            edu.system.uploadFiles(["txtFileDinhKem" + strQuyetDinh_Id]);
            me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strQuyetDinh_Id, data[i].LOAIQUYETDINH_ID);
            //me.genComBo_TTDT("dropDeTai_TinhTrang" + strNhiemVu_Id, data[i].TINHTRANG_ID);
            edu.system.viewFiles("txtFileDinhKem" + strQuyetDinh_Id, strQuyetDinh_Id, "NS_Files");
        }
        for (var i = data.length; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        }
        edu.system.pickerdate("input-datepicker_X");
    },
    genHTML_QuyetDinh: function (strQuyetDinh_Id) {
        var me = this;
        var iViTri = document.getElementById("tblQuyetDinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strQuyetDinh_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strQuyetDinh_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropLoaiQuyetDinh' + strQuyetDinh_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
        row += '<td><input type="text" id="txtSoQuyetDinh' + strQuyetDinh_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgayQuyetDinh' + strQuyetDinh_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNamBatDau' + strQuyetDinh_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNamKetThuc' + strQuyetDinh_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><div id="txtFileDinhKem' + strQuyetDinh_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strQuyetDinh_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblQuyetDinh tbody").append(row);
        //$("#dropDeTai_TinhTrang" + strKetQua_Id).select2();
        edu.system.uploadFiles(["txtFileDinhKem" + strQuyetDinh_Id]);
        edu.system.pickerdate("input-datepicker_X");
        me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strQuyetDinh_Id, "");
        edu.system.viewFiles("txtFileDinhKem" + strQuyetDinh_Id, strQuyetDinh_Id, "NS_Files");
        //me.genComBo_TTDT("dropDeTai_TinhTrang" + strNhiemVu_Id, "");
    },
}