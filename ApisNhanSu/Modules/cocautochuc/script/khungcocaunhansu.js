/*----------------------------------------------
--Author:   
--Phone: 
--Date of created: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KhungCoCauNhanSu() { }
KhungCoCauNhanSu.prototype = {
    arrValid_KCNS: [],
    dtKCNS: '',
    strKCNS_Id: '',
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    dtNhanSu: [],
    strCoCauToChuc_Id: '',

    init: function () {
        var me = this;
        me.pageLoad();
        $("#txtSearch_KCNS_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_KCNS_treejs ul li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }).css("color", "red");
        });
        $("#txtSearch_KCNS_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KCNS();
            }
        });
        $("#dropSearch_KCNS_Loai").on("select2:select", function () {
            me.getList_KCNS();
        });
        $("#tblKCNS_NhanSu").delegate('.btnDieuChuyen', 'click', function (e) {
            var strId = this.id;
            $("#zone_input_DieuChuyen").slideDown();
            me.strKCNS_Id = strId;
            edu.util.setOne_BgRow(strId, "tblKCNS_NhanSu");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID");
            me.viewForm_ThuyenChuyen(data[0]);
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-KCNS", "zone_detail_KCNS");
        });
        $("#btnSaveRe_ThuyenChuyen").click(function () {
            me.save_ThuyenChuyen();
            setTimeout(function () {
                me.resetPopup_ThuyenChuyen();
            }, 1000);
        });
        $("#btnSave_ThuyenChuyen").click(function () {
            me.save_ThuyenChuyen();
        });
    },
    pageLoad: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh");
        edu.system.uploadFiles(["txtThongTinDinhKem"]);
        edu.system.page_load();
        me.getList_KCNS();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu("NS.LCTC", "dropKCNS_Loai,dropSearch_KCNS_Loai");
        }, 50);
        me.getList_CoCauToChuc();
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
        var me = main_doc.KhungCoCauNhanSu;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                dtChilds.push(data[i]);
            }
            else {
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
            renderPlace: ["dropDonViMoi_TrongTruong"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KCNS: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',            

            'dTrangThai': 1,
            'strLoaiCoCauToChuc_Id': edu.util.getValById("dropSearch_KCNS_Loai"),
            'strCoCauToChucCha_Id': ""
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
                    me.dtKCNS = dtResult;
                    me.genCombo_KCNS();
                    me.genTreeJs_KCNS(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_CoCauToChuc/LayDanhSach: " + data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alert("NS_CoCauToChuc/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NhanSu: function (strCoCauToChuc_Id) {
        if (edu.util.checkValue(strCoCauToChuc_Id)) {            
            var me = main_doc.KhungCoCauNhanSu;
            var obj = {
                strTuKhoa: "",
                pageIndex: 1,
                pageSize: 100000,
                strCoCauToChuc_Id: strCoCauToChuc_Id,
                strNguoiThucHien_Id: "",
                'dLaCanBoNgoaiTruong': 0
            };
            edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
        }
    },
    genTreeJs_KCNS: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblKCNS_Tong", dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_KCNS_treejs"],
            style: "fa fa-institution color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_KCNS_treejs').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            me.strKCNS_Id = strNameNode;
            me.strCoCauToChuc_Id = strNameNode;
            me.getList_NhanSu(strNameNode);
        });
    },
    genTable_NhanSu: function (data, iPager) {
        var me = main_doc.KhungCoCauNhanSu;
        me.dtNhanSu = data;
        var html = "";
        var strNhanSu_Ma = "";
        var strNhanSu_HoDem = "";
        var strNhanSu_Ten = "";
        var strNhanSu_Avatar = "";
        var strNgaySinh = "";
        var strThangSinh = "";
        var strNamSinh = "";
        var strDienThoai = "";
        var strEmail = "";
        edu.util.viewHTMLById("lblKCNS_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblKCNS_NhanSu",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 6],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = "";
                        strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        strNhanSu_HoDem = edu.util.returnEmpty(aData.HODEM);
                        strNhanSu_Ten = edu.util.returnEmpty(aData.TEN);
                        html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoDem + " " + strNhanSu_Ten + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = "";
                        strNgaySinh = edu.util.returnEmpty(aData.NGAYSINH);
                        strThangSinh = edu.util.returnEmpty(aData.THANGSINH);
                        strNamSinh = edu.util.returnEmpty(aData.NAMSINH);
                        html = '<span id="sl_hoten' + aData.ID + '">' + strNgaySinh + "/" + strThangSinh + "/" + strNamSinh + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = "";
                        strDienThoai = edu.util.returnEmpty(aData.SDT_CANHAN);
                        html = '<span id="sl_hoten' + aData.ID + '">' + strDienThoai + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = "";
                        strEmail = edu.util.returnEmpty(aData.EMAIL);
                        html = '<span id="sl_hoten' + aData.ID + '">' + strEmail + '</span><br />';
                        return html;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDieuChuyen" id="' + aData.ID + '" title="Điều chuyển"><i class="color-active"></i>Điều chuyển</a> </span>';
                    }
                }

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/        
    },
    genCombo_KCNS: function () {
        var me = this;
        var obj = {
            data: me.dtKCNS,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropKCNS_DuLieuCha"],
            type: "",
            title: "Chọn cơ cấu tổ chức cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_ThuyenChuyen: function () {
        var me = this;
        var obj_notify = {};
        var data = edu.util.objGetDataInData(me.strKCNS_Id, me.dtNhanSu, "ID");
        // kiểm tra ngày ký quyết định không được lớn hơn ngày hiện tại
        var strNgayQuyetDinh = edu.util.getValById("txtNgayKy");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
            return;
        }
        var strDonViMoi_Id = edu.util.getValById("dropDonViMoi_TrongTruong");
        var strDonViMoi_NgoaiTruong = edu.util.getValById("txtDonViMoi_NgoaiTruong");
        if (edu.util.checkValue(strDonViMoi_Id) && edu.util.checkValue(strDonViMoi_NgoaiTruong)) {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = "";
        }
        else {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = strDonViMoi_NgoaiTruong;
        }
        var obj_save = {
            'action': 'NS_QT_ThuyenChuyenCanBo/ThemMoi',            

            'strId': '',
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayKy"),
            'strNgayChuyen': edu.util.getValById("txtNgayChuyen"),
            'strDonViCu_Id': data[0].DAOTAO_COCAUTOCHUC_ID,
            'strDonViMoi_Id': strDonViMoi_Id,
            'strDonViCu_NgoaiTruong': "",
            'strDonViMoi_NgoaiTruong': strDonViMoi_NgoaiTruong,
            'strThongTinDinhKem': edu.util.getValById("txtThongTinDinhKem"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("dropQuyetDinh"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': data[0].ID,
            'strNguoiThucHien_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TCCB");
                    me.getList_NhanSu(me.strCoCauToChuc_Id);
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
    getDetail_ThuyenChuyen: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ThuyenChuyenCanBo/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThuyenChuyen(data.Data[0]);
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
    viewForm_ThuyenChuyen: function (data) {
        var me = this;
        me.popup_ThuyenChuyen();
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
        edu.util.viewValById("dropDonViCu", data.DAOTAO_COCAUTOCHUC_ID);
    },
    popup_ThuyenChuyen: function () {
        edu.util.toggle_overide("zone-KCNS", "zone_input_DieuChuyen");
    },
    resetPopup_ThuyenChuyen: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("dropQuyetDinh", "");
        edu.util.viewValById("txtSoQuyetDinh", "");
        edu.util.viewValById("txtNgayChuyen", "");
        edu.util.viewValById("txtNgayKy", "");
        edu.util.viewValById("dropDonViCu_TrongTruong", "");
        edu.util.viewValById("txtDonViCu_NgoaiTruong", "");
        edu.util.viewValById("dropDonViMoi_TrongTruong", "");
        edu.util.viewValById("txtDonViMoi_NgoaiTruong", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
};