/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function MonHocGiangDay() { };
MonHocGiangDay.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    dtNhanSu: [],
    tab_actived: [],
    tab_item_actived: [],
    arrValid_MonHocGiangDay: [],

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
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href"); //activated tab
            var check = edu.util.arrEqualVal(me.tab_actived, target);
            if (!check) {
                me.tab_actived.push(target);
                switch (target) {
                    case "#tab_1": //Tieu su ban than
                        me.open_Collapse("key_monhocgiangday");
                        break;

                }
            }
        });
        $(".btnGetData").click(function () {
            var item = this.id;
            var check = edu.util.arrEqualVal(me.tab_item_actived, item);
            if (!check) {
                me.tab_item_actived.push(item);
                me.switch_GetData(item);
            }
        });
        $('a[href="#tab_1"]').trigger("shown.bs.tab");

        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_MonHocGiangDay();
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            //edu.system.viewFiles("txtThongTinDinhKem", me.strNhanSu_Id, "NS_Files");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
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
        $("#dropSearch_CapNhat_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_TinhTrangLamViec").on("select2:select", function () {
            me.getList_HS();
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_HDXH").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MonHocGiangDay);
            if (valid) {
                me.save_MonHocGiangDay();
                setTimeout(function () {
                    me.resetPopup_MonHocGiangDay();
                }, 1000);
            }
        });
        $("#btnSave").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MonHocGiangDay);
            if (valid) {
                me.save_MonHocGiangDay();
            }
        });
        $("#tbl_MonHocGiangDay").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_MonHocGiangDay");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_MonHocGiangDay(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_MonHocGiangDay").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HDXH");
                $("#btnYes").click(function (e) {
                    me.delete_MonHocGiangDay(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        //edu.system.loadToCombo_DanhMucDuLieu("NS.NHIEMVUCHIENLUOC", "dropNhiemVu");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacHoc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropNgonNguGiangDay");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_CoCauToChuc();
        me.arrValid_MonHocGiangDay = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTenMonHoc", "THONGTIN1": "EM" },
            { "MA": "txtMaMonHoc", "THONGTIN1": "EM" },
            
        ];
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
        var me = main_doc.MonHocGiangDay;
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
        $(".myModalLabel_MonHocGiangDay").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_monhocgiangday":
                me.resetPopup_MonHocGiangDay();
                me.popup_MonHocGiangDay();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_monhocgiangday":
                me.getList_MonHocGiangDay();
                break;
        }
    },

    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.MonHocGiangDay;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
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
            renderPlace: ["dropDonViGiangDay"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: DanhSachNhanSu
    -------------------------------------------*/
    getList_HS: function () {
        var me = main_doc.MonHocGiangDay;
        
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: strTinhTrangNhanSu_Id,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);

    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.MonHocGiangDay;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.MonHocGiangDay.getList_HS()",
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

        $("#tbl_TieuSuBanThan tbody").html("");
        $("#tbl_QuanHeGiaDinh tbody").html("");
        $("#tbl_Dang tbody").html("");
        $("#tbl_Doan tbody").html("");
        $("#tbl_CongDoan tbody").html("");
        $("#tbl_TrinhDoChinhTri tbody").html("");
        $("#tbl_TrinhDoTinHoc tbody").html("");
        $("#tbl_TrinhDoNgoaiNgu tbody").html("");

    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_MonHocGiangDay: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_QT_MonHoc/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_MonHocGiangDay(data.Data, data.Pager);
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
    save_MonHocGiangDay: function () {
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
            'action': 'NS_QT_MonHoc/ThemMoi',
            

            'strId': '',
            'strTenMon': edu.util.getValById("txtTenMonHoc"),
            'strMaMon': edu.util.getValById("txtMaMonHoc"),
            'dSoTC': edu.util.getValById("txtSoTinChi"),
            'strBacDaoTao_Id': edu.util.getValById("dropBacHoc"),
            'strDonViGiangDay_Id': edu.util.getValById("dropDonViGiangDay"),
            'strDonViGiangDay_Khac': edu.util.getValById("txtDonViKhac"),
            'strThoiGianBatDau': edu.util.getValById("txtNamBDGiangDay"),
            'strNgonNgu_Id': edu.util.getValById("dropNgonNguGiangDay"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_MonHoc/CapNhat';
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
                    me.getList_MonHocGiangDay();
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
    delete_MonHocGiangDay: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_QT_MonHoc/Xoa',
            
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
                    me.getList_MonHocGiangDay();
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
    getDetail_MonHocGiangDay: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_QT_MonHoc/LayChiTiet',
            
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
                        me.editForm_MonHocGiangDay(data.Data[0]);
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

    popup_MonHocGiangDay: function () {
        //show
        $("#zoneMonHocGiangDay_input").slideDown();
        //edu.util.toggle_overide("zone-bus", "zoneMonHocGiangDay_input");
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_MonHocGiangDay: function () {
        var me = this;
        me.strCommon_Id = "";
        $("#myModalLabel_MonHocGiangDay").html('<i class="fa fa-plus"></i> Thêm môn học đã giảng dạy');
        me.strCommon_Id = "";
        edu.util.viewValById("txtTenMonHoc", "");
        edu.util.viewValById("txtMaMonHoc", "");
        edu.util.viewValById("dropBacHoc", "");
        edu.util.viewValById("txtSoTinChi", "");
        edu.util.viewValById("dropDonViGiangDay", "");
        edu.util.viewValById("txtDonViKhac", "");
        edu.util.viewValById("txtNamBDGiangDay", "");
        edu.util.viewValById("dropNgonNguGiangDay", "");
    },
    genTable_MonHocGiangDay: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_MonHocGiangDay",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TENMON"
                },
                {
                    "mDataProp": "BACDAOTAO_TEN"
                },
                {
                    "mDataProp": "DONVIGIANGDAY_TEN"
                },
                //{
                //    "mDataProp": "CANNANG"
                //},
                //{
                //    "mDataProp": "NHOMMAU_TEN"
                //},
                {
                    "mDataProp": "THOIGIANBATDAU"
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
    editForm_MonHocGiangDay: function (data) {
        var me = this;
        me.popup_MonHocGiangDay();
        //view data --Edit
        edu.util.viewValById("txtTenMonHoc", data.TENMON);
        edu.util.viewValById("txtMaMonHoc", data.MAMON);
        edu.util.viewValById("dropBacHoc", data.BACDAOTAO_ID);
        edu.util.viewValById("txtSoTinChi", data.SOTC);
        edu.util.viewValById("dropDonViGiangDay", data.DONVIGIANGDAY_ID);
        edu.util.viewValById("txtDonViKhac", data.DONVIGIANGDAY_KHAC);
        edu.util.viewValById("txtNamBDGiangDay", data.THOIGIANBATDAU);
        edu.util.viewValById("dropNgonNguGiangDay", data.NGONNGU_ID);
        $("#myModalLabel_MonHocGiangDay").html('<i class="fa fa-pencil"></i> Chỉnh sửa môn học đã giảng dạy');
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.MonHocGiangDay;
        //call popup --Edit
        //me.toggle_input();
        //view data --Edit
        // me.popup_ChucVu();
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}