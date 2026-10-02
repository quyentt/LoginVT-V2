/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function DSGiamtruGiaCanh() { };
DSGiamtruGiaCanh.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],

    init: function () {
        var me = this;
        me.page_load();
        me.strNhanSu_Id = edu.system.userId;
        me.getList_DSGiamtruGiaCanh();

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


        $("#tblCapNhat_DanhSachGiamTruGiaCanh").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            //me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_DSGiamtruGiaCanh();
            //if (me.tab_item_actived.length == 0) $('a[href="#tab_5"]').trigger("shown.bs.tab");
            //else {
            //    for (var i = 0; i < me.tab_item_actived.length; i++) {
            //        me.switch_GetData(me.tab_item_actived[i]);
            //    }
            //}
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_DanhSachGiamTruGiaCanh");
            edu.system.viewFiles("txtThongTinDinhKem", me.strNhanSu_Id, "NS_Files");
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
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
        });
        //$("#tblCapNhat_DanhSachGiamTruGiaCanh").click(function () {
        //    me.getList_HS();
        //});
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_DSGiamTruGiaCanh").click(function () {
            me.save_DSGiamtruGiaCanh();
            setTimeout(function () {
                me.resetPopup_DSGiamtruGiaCanh();
            }, 1000);
        });
        $("#btnSave_DSGiamTruGiaCanh").click(function () {
            me.save_DSGiamtruGiaCanh();
        });
        $("#tbl_DanhSachGiamTruGiaCanh").delegate(".btnEdit", "click", function () { 
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_DanhSachGiamTruGiaCanh");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_DSGiamtruGiaCanh(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DanhSachGiamTruGiaCanh").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_DanhSachGiamTruGiaCanh");
                $("#btnYes").click(function (e) {
                    me.delete_DSGiamtruGiaCanh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        //

        $("#btnKeThua").click(function () {
            var strNgayVao = "";
            var strNgayRa = "";
            var confirm = 'Bạn điền đủ thông tin năm để kế thừa?';
            confirm += '<div class="clear"></div>';
            confirm += '<table>';
            confirm += '<tbody>';
            confirm += '<tr>';
            confirm += '<td>Năm nguồn:</td>';
            confirm += '<td>  <input id="txtNgayVao" value="' + strNgayVao + '" class="form-control" /> </td>';
            confirm += '<td>Năm đích:</td>';
            confirm += '<td>  <input id="txtNgayRa" value="' + strNgayRa + '" class="form-control" /> </td>';
            confirm += '</tr>';
            confirm += '</tbody>';
            confirm += '</table>';
            confirm += '<div class="clear"></div>';
            confirm += '<div id="lblConfirmContent2"></div>';
            //confirm += '<i>*Chú ý: Ngày vào KTX là bắt buộc</i>';
            confirm += '<div class="clear"></div>';
            edu.system.confirm(confirm, "q");
            $("#btnYes").click(function (e) {
                var strNgayVao = $("#txtNgayVao").val();
                var strNgayRa = $("#txtNgayRa").val();
                if (strNgayVao == "" || strNgayRa == "") {
                    e.stopImmediatePropagation();
                    $("#lblConfirmContent2").html('<i class="cl-danger">Vui lòng nhập !</i>');
                    $("#btnYes").show();
                    return;
                }
                me.save_KeThua(strNgayVao, strNgayRa);
            });
        });
    },
    page_load: function () {
        var me = this;
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropQuocTich");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QHGD, "dropQuanHeVoiNguoiNopThue", "Chọn quan hệ với người nộp thuế");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropGiayKhaiSinh_QuocGia");
        //edu.extend.setTinhThanh_V2(["txtGiayKhaiSinh_NoiSinh"], 'TP Hà Nội, Quận Cầu Giấy, Dịch Vọng');
        //edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropQuocTich");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD", "dropQuanHeVoiNguoiNopThue");
        //edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropGiayKhaiSinh_QuocGia");
        //edu.system.loadToCombo_DanhMucDuLieu("CHUN.DMTT", "", "", function (data) {
        //    var obj = {
        //        data: data,
        //        renderInfor: {
        //            id: "ID",
        //            parentId: "",
        //            name: "TEN",
        //        },
        //        renderPlace: ["dropGiayKhaiSinh_TinhThanh"],
        //        title: "Chọn tỉnh thành"
        //    };
        //    edu.system.loadToCombo_data(obj);
        //    var obj = {
        //        data: data,
        //        renderInfor: {
        //            id: "ID",
        //            parentId: "",
        //            name: "TEN",
        //        },
        //        renderPlace: ["dropGiayKhaiSinh_QuanHuyen"],
        //        title: "Chọn Quận/Huyện"
        //    };
        //    edu.system.loadToCombo_data(obj);
        //    var obj = {
        //        data: data,
        //        renderInfor: {
        //            id: "ID",
        //            parentId: "",
        //            name: "TEN",
        //        },
        //        renderPlace: ["dropGiayKhaiSinh_PhuongXa"],
        //        title: "Chọn phường/xã"
        //    };
        //    edu.system.loadToCombo_data(obj);
        //});
        //edu.system.loadToCombo_DanhMucDuLieu("QLCB.NHMA", "dropNhomMau");
        //edu.system.uploadFiles(["txtThongTinDinhKem"]);
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //edu.system.page_load();
        //me.getList_CoCauToChuc();
        //me.getList_HS();
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
        var me = main_doc.DSGiamtruGiaCanh;
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
            case "key_danhsachgiamtrugiacanh":
                me.resetPopup_DSGiamtruGiaCanh();
                me.popup_DSGiamtruGiaCanh();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_danhsachgiamtrugiacanh":
                me.getList_DSGiamtruGiaCanh();
                break;
        }
    },

    /*------------------------------------------
    --Discription: DanhSachNhanSu
    -------------------------------------------*/
    getList_HS: function () {
        var me = main_doc.DSGiamtruGiaCanh;
        
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

    getDetail_HS: function () {
        var me = main_doc.CapNhatHoSo;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',

            'strId': edu.system.userId
        }


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_NhanSu(data.Data[0]);
                    }
                    else {
                        me.viewForm_NhanSu([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);

                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));

            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.DSGiamtruGiaCanh;
        me.dtNhanSu = data;
        $("#lbl_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_DanhSachGiamTruGiaCanh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DSGiamtruGiaCanh.getList_HS()",
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

        $("#tbl_DanhSachGiamTruGiaCanh tbody").html("");

    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_DSGiamtruGiaCanh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_GiamTruGiaCanh/LayDanhSach',
            
            
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiTao_Id': "",
            'strTuKhoa': "",
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
                    me.genTable_DSGiamtruGiaCanh(data.Data, data.Pager);
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
    save_DSGiamtruGiaCanh: function () {
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
            'action': 'L_GiamTruGiaCanh/ThemMoi',
            

            'strId': '',
            'strMaSoThue': edu.util.getValById("txtNS_MaSoThue"),
            'strHoTen': edu.util.getValById("txtNguoiPhuThuoc_HoTen"),
            'strNgaySinh': edu.util.getValById("txtNguoiPhuThuoc_NgaySinh"),
            'strThangSinh': edu.util.getValById("txtNguoiPhuThuoc_ThangSinh"),
            'strNamSinh': edu.util.getValById("txtNguoiPhuThuoc_NamSinh"),
            'strQuocTich_Id': edu.util.getValById("dropQuocTich"),
            'strCMTND': edu.util.getValById("txtNguoiPhuThuoc_CMND"),
            'strHoChieu': edu.util.getValById("txtNguoiPhuThuoc_HoChieu"),
            'strTheCanCuoc': edu.util.getValById("txtNguoiPhuThuoc_TheCanCuoc"),
            'strMaSoThueNguoiPhuThuoc': edu.util.getValById("txtNguoiPhuThuoc_MaSoThue"),
            'strQuanHeVoiNguoiNopThue_Id': edu.util.getValById("dropQuanHeVoiNguoiNopThue"),
            'strGiayKhaiSinh_So': edu.util.getValById("txtGiayKhaiSinh_So"),
            'strGiayKhaiSinh_Quyen': edu.util.getValById("txtGiayKhaiSinh_Quyen"),
            'strGiayKhaiSinh_QuocGia_Id': edu.util.getValById("dropGiayKhaiSinh_QuocGia"),
            'strGiayKhaiSinh_TinhThanh_Id': edu.util.getValById("dropGiayKhaiSinh_TinhThanh"),
            'strGiayKhaiSinh_QuanHuyen_Id': edu.util.getValById("dropGiayKhaiSinh_QuanHuyen"),
            'strGiayKhaiSinh_PhuongXa_Id': edu.util.getValById("dropGiayKhaiSinh_PhuongXa"),   
            'strTuThang': edu.util.getValById("txtThoiGian_TuThang"),
            'strTuNam': edu.util.getValById("txtThoiGian_TuNam"),
            'strDenThang': edu.util.getValById("txtThoiGian_DenThang"),
            'strDenNam': edu.util.getValById("txtThoiGian_DenNam"),

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'L_GiamTruGiaCanh/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                       // edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtThongTinDinhKem", me.strCommon_Id, "NS_Files");
                    }
                    me.getList_DSGiamtruGiaCanh();
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
    delete_DSGiamtruGiaCanh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_GiamTruGiaCanh/Xoa',
            
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
                    me.getList_DSGiamtruGiaCanh();
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
    getDetail_DSGiamtruGiaCanh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_GiamTruGiaCanh/LayChiTiet',
            
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
                        me.editForm_DSGiamtruGiaCanh(data.Data[0]);
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
    save_KeThua: function (strNgayVao, strNgayRa) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_GiamTruGiaCanh/KeThua',


            'strNamNguon': strNgayVao,
            'strNamDich': strNgayRa,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_QDGiamTruGiaCanh();
                    edu.system.alert("Kế thừa thành công. Hãy kiểm tra lại");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    popup_DSGiamtruGiaCanh: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_DanhSachGiamTruGiaCanh");
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_DSGiamtruGiaCanh: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("txtNS_MaSoThue", "");
        edu.util.viewValById("txtNguoiPhuThuoc_HoTen", "");
        edu.util.viewValById("txtNguoiPhuThuoc_NgaySinh", "");
        edu.util.viewValById("txtNguoiPhuThuoc_ThangSinh", "");
        edu.util.viewValById("txtNguoiPhuThuoc_NamSinh", "");
        edu.util.viewValById("txtNguoiPhuThuoc_CMND", "");
        edu.util.viewValById("txtNguoiPhuThuoc_TheCanCuoc", "");
        edu.util.viewValById("txtNguoiPhuThuoc_HoChieu", "");
        edu.util.viewValById("txtNguoiPhuThuoc_MaSoThue", "");
        edu.util.viewValById("dropQuocTich", "");
        edu.util.viewValById("dropQuanHeVoiNguoiNopThue", "");
        edu.util.viewValById("txtGiayKhaiSinh_So", "");
        edu.util.viewValById("txtGiayKhaiSinh_Quyen", "");
        edu.util.viewValById("dropGiayKhaiSinh_QuocGia", "");
        edu.util.viewValById("dropGiayKhaiSinh_Tinh", "");
        //edu.util.viewValById("dropGiayKhaiSinh_Huyen", "");
        //edu.util.viewValById("dropGiayKhaiSinh_Xa", "");
        edu.util.viewValById("txtThoiGian_TuThang", "");
        edu.util.viewValById("txtThoiGian_TuNam", "");
        edu.util.viewValById("txtThoiGian_DenThang", "");
        edu.util.viewValById("txtThoiGian_DenNam", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
    genTable_DSGiamtruGiaCanh: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_DanhSachGiamTruGiaCanh",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        return html;
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                },
                {
                    "mDataProp": "MASOTHUENGUOIPHUTHUOC"
                },
                {
                    "mDataProp": "QUOCTICH_MA"
                },
                {
                    "mDataProp": "QUOCTICH_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.CMTND) + "/" + edu.util.returnEmpty(aData.THECANCUOC) + "/" + edu.util.returnEmpty(aData.HOCHIEU) + "</span><br />";
                        return html;
                    }
                },
                {
                    "mDataProp": "QUANHE_MA"
                },
                {
                    "mDataProp": "QUANHE_TEN"
                },
                {
                    "mDataProp": "GIAYKHAISINH_SO"
                },
                {
                    "mDataProp": "GIAYKHAISINH_QUYEN"
                },
                {
                    "mDataProp": "GIAYKHAISINH_QUOCGIA_MA"
                },
                {
                    "mDataProp": "GIAYKHAISINH_QUOCGIA_TEN"
                },
                {
                    "mDataProp": "GIAYKHAISINH_TINHTHANH_MA"
                },
                {
                    "mDataProp": "GIAYKHAISINH_TINHTHANH_TEN"
                },
                {
                    "mDataProp": "GIAYKHAISINH_QUANHUYEN_MA"
                },
                {
                    "mDataProp": "GIAYKHAISINH_QUANHUYEN_TEN"
                },
                {
                    "mDataProp": "GIAYKHAISINH_PHUONGXA_MA"
                },
                {
                    "mDataProp": "GIAYKHAISINH_PHUONGXA_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TUTHANG) + "/" + edu.util.returnEmpty(aData.TUNAM) + "</span><br />";
                        return html;
                    }
                },
                {

                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.DENTHANG) + "/" + edu.util.returnEmpty(aData.DENNAM) + "</span><br />";
                        return html;
                    }
                }
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                //    }
                //}
                //, {
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_DSGiamtruGiaCanh: function (data) {
        var me = this;
        me.popup_DSGiamtruGiaCanh();
        //view data --Edit
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
        edu.util.viewValById("txtNS_MaSoThue", data.NHANSU_HOSOCANBO_MASOTHUE);
        edu.util.viewValById("txtNguoiPhuThuoc_HoTen", data.HOTEN);
        edu.util.viewValById("txtNguoiPhuThuoc_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNguoiPhuThuoc_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNguoiPhuThuoc_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtNguoiPhuThuoc_CMND", data.CMTND);
        edu.util.viewValById("txtNguoiPhuThuoc_TheCanCuoc", data.THECANCUOC);
        edu.util.viewValById("txtNguoiPhuThuoc_HoChieu", data.HOCHIEU);
        edu.util.viewValById("txtNguoiPhuThuoc_MaSoThue", data.MASOTHUENGUOIPHUTHUOC);
        edu.util.viewValById("dropQuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropQuanHeVoiNguoiNopThue", data.QUANHEVOINGUOINOPTHUE_ID);
        edu.util.viewValById("txtGiayKhaiSinh_So", data.GIAYKHAISINH_SO);
        edu.util.viewValById("txtGiayKhaiSinh_Quyen", data.GIAYKHAISINH_QUYEN);
        edu.util.viewValById("dropGiayKhaiSinh_QuocGia", data.GIAYKHAISINH_QUOCGIA_ID);
        edu.util.viewValById("dropGiayKhaiSinh_TinhThanh", data.GIAYKHAISINH_TINHTHANH_ID);
        edu.util.viewValById("dropGiayKhaiSinh_QuanHuyen", data.GIAYKHAISINH_QUANHUYEN_ID);
        edu.util.viewValById("dropGiayKhaiSinh_PhuongXa", data.GIAYKHAISINH_PHUONGXA_ID);
        edu.util.viewValById("txtThoiGian_TuThang", data.TUTHANG);
        edu.util.viewValById("txtThoiGian_TuNam", data.TUNAM);
        edu.util.viewValById("txtThoiGian_DenThang", data.DENTHANG);
        edu.util.viewValById("txtThoiGian_DenNam", data.DENNAM);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.DSGiamtruGiaCanh;
        //call popup --Edit
        //me.toggle_input();
        //view data --Edit
        //me.popup_ChucVu();
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}