/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/KhoaDaoTao
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HopDongDuKien() { };
HopDongDuKien.prototype = {
    strCommon_Id: '',
    strHopDongDuKien_Id: '',
    treenode: '',
    dtTab: '',
    dtHopDongDuKien: '',//danh sách hợp đồng dự kiến
    strId: '',
    arrValid_HopDongDuKien: [],

    init: function () {
        var me = this;
        me.page_load();
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strHopDongDuKien_Id)) {
                me.update_HopDongDuKien();
            }
            else {
                me.save_HopDongDuKien();
            }
        });
        $(".btnReWrite").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HopDongDuKien);
            if (valid) {
                if (edu.util.checkValue(me.strHopDongDuKien_Id)) {
                    me.update_HopDongDuKien();
                }
                else {
                    me.save_HopDongDuKien();
                }
            }
            me.rewrite();
        });
        $("#tblHopDongDuKien").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHopDongDuKien_Id = strId;
                me.getDetail_HopDongDuKien(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblHopDongDuKien");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHopDongDuKien").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HopDongDuKien(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_HopDongDuKien();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HopDongDuKien();
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHopDongDuKien", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn hợp đồng cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HopDongDuKien(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHopDongDuKien" });
        });
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HopDongDuKien");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_HopDongDuKien");
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOAIHOPDONG", "drop_LoaiHopDong");
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.getList_HopDongDuKien();
        }, 50);
        me.arrValid_HopDongDuKien = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txt_HoTen", "THONGTIN1": "EM" },
            { "MA": "txt_SoCMND", "THONGTIN1": "EM" },
            { "MA": "txt_SoHopDong", "THONGTIN1": "EM" },
            { "MA": "txt_NgaySinh", "THONGTIN1": "EM" },
            { "MA": "txt_NgayBDHieuLuc", "THONGTIN1": "EM" },
            { "MA": "drop_LoaiHopDong", "THONGTIN1": "EM" },
            { "MA": "drop_DonViTuyenDung", "THONGTIN1": "EM" }
        ];
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.HopDongDuKien;
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
            renderPlace: ["drop_DonViTuyenDung"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.HopDongDuKien;
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
    save_HopDongDuKien: function () {
        var me = main_doc.HopDongDuKien;
        var obj_save = {
            'action': 'NS_ThongTinHopDong/ThemMoi',           

            'strId': '',
            'strTinhTrang_Id': "",
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("drop_DonViTuyenDung"),
            'strNhanSu_HoSoCanBo_Id': "",
            'strDieu1_HinhThucTuyen_Id': "",
            'strNgayTuyenDung': "",
            'strNgayHieuLucHopDong': edu.util.getValById("txt_NgayBDHieuLuc"),
            'strNgayHetHieuLucHopDong': edu.util.getValById("txt_NgayHetHieuLuc"),
            'strNgayKyHopDong': edu.util.getValById("txt_NgayKyHD"),
            'strSoHopDong': edu.util.getValById("txt_SoHopDong"),
            'strDieu3_DongBaoHiem_Id': "",
            'strDieu3_CheDoPhucLoi_Id': "",
            'strDieu3_HinhThucTra_Id': "",
            'strDieu3_BangQuyDinhLuong_Id': "",
            'strDieu3_HeSoLuong': "",
            'strDieu3_Bac': "",
            'strDieu3_Ngach_Id': "",
            'strDieu3_PhuongTienDiLai_Id': "",
            'strDieu2_ThoiGianLamViec_Id': "",
            'strDieu1_CongViecPhaiLam': edu.util.getValById("txtCongViecDamNhan"),
            'strDieu1_ChucDanhCM_Id': "",
            'strDieu1_DiaDiemLamViec': edu.util.getValById("txt_DiaDiemLamViec"),
            'strDieu1_DenNgay': "",
            'strDieu1_TuNgay': "",
            'strDieu1_LoaiHopDong_Id': edu.util.getValById("drop_LoaiHopDong"),
            'strBenB_NoiCapCMTND': "",
            'strBenB_NgayCapCMTND': "",
            'strBenB_SoCMTND': edu.util.getValById("txt_SoCMND"),
            'strBenB_DiaChi': edu.util.getValById("txt_DiaChi"),
            'strBenB_TrinhDoChuyenMon_Id': "",
            'strBenB_NamSinh': "",
            'strBenB_NgaySinh': edu.util.getValById("txt_NgaySinh"),
            'strBenB_ThangSinh': "",
            'strBenB_QuocTich_Id': "",
            'strBenB_Ten': edu.util.getValById("txt_HoTen"),
            'strBenB_HoDem': "",
            'strBenA_DienThoai': "",
            'strBenA_DiaChi': "",
            'strBenA_DonVi_Id': "",
            'strBenA_ChucVu_Id': "",
            'strBenA_QuocTich_Id': "",
            'strBenA_NguoiKy_Id': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });                        
                    }
                    setTimeout(function () {
                        me.getList_HopDongDuKien();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");                
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HopDongDuKien: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_ThongTinHopDong/CapNhat',            

            'strId': me.strHopDongDuKien_Id,
            'strTinhTrang_Id': "",
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("drop_DonViTuyenDung"),
            'strNhanSu_HoSoCanBo_Id': "",
            'strDieu1_HinhThucTuyen_Id': "",
            'strNgayTuyenDung': "",
            'strNgayHieuLucHopDong': edu.util.getValById("txt_NgayBDHieuLuc"),
            'strNgayHetHieuLucHopDong': edu.util.getValById("txt_NgayHetHieuLuc"),
            'strNgayKyHopDong': edu.util.getValById("txt_NgayKyHD"),
            'strSoHopDong': edu.util.getValById("txt_SoHopDong"),
            'strDieu3_DongBaoHiem_Id': "",
            'strDieu3_CheDoPhucLoi_Id': "",
            'strDieu3_HinhThucTra_Id': "",
            'strDieu3_BangQuyDinhLuong_Id': "",
            'strDieu3_HeSoLuong': "",
            'strDieu3_Bac': "",
            'strDieu3_Ngach_Id': "",
            'strDieu3_PhuongTienDiLai_Id': "",
            'strDieu2_ThoiGianLamViec_Id': "",
            'strDieu1_CongViecPhaiLam': edu.util.getValById("txtCongViecDamNhan"),
            'strDieu1_ChucDanhCM_Id': "",
            'strDieu1_DiaDiemLamViec': edu.util.getValById("txt_DiaDiemLamViec"),
            'strDieu1_DenNgay': "",
            'strDieu1_TuNgay': "",
            'strDieu1_LoaiHopDong_Id': edu.util.getValById("drop_LoaiHopDong"),
            'strBenB_NoiCapCMTND': "",
            'strBenB_NgayCapCMTND': "",
            'strBenB_SoCMTND': edu.util.getValById("txt_SoCMND"),
            'strBenB_DiaChi': edu.util.getValById("txt_DiaChi"),
            'strBenB_TrinhDoChuyenMon_Id': "",
            'strBenB_NamSinh': "",
            'strBenB_NgaySinh': edu.util.getValById("txt_NgaySinh"),
            'strBenB_ThangSinh': "",
            'strBenB_QuocTich_Id': "",
            'strBenB_Ten': edu.util.getValById("txt_HoTen"),
            'strBenB_HoDem': "",
            'strBenA_DienThoai': "",
            'strBenA_DiaChi': "",
            'strBenA_DonVi_Id': "",
            'strBenA_ChucVu_Id': "",
            'strBenA_QuocTich_Id': "",
            'strBenA_NguoiKy_Id': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHopDongDuKien_Id = me.strHopDongDuKien_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HopDongDuKien();
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
    getList_HopDongDuKien: function () {
        var me = main_doc.HopDongDuKien;
        var obj_list = {
            'action': 'NS_ThongTinHopDong/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNhanSu_HoSoCanBo_Id': "",
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
                    me.genTable_HopDongDuKien(dtResult, iPager);
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
    getDetail_HopDongDuKien: function (strId) {
        var me = main_doc.HopDongDuKien;
        var obj_detail = {
            'action': 'NS_ThongTinHopDong/LayChiTiet',
            
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
                        me.viewForm_HopDongDuKien(data.Data[0]);
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
    delete_HopDongDuKien: function (Ids) {
        var me = main_doc.HopDongDuKien;
        var obj_delete = {
            'action': 'NS_ThongTinHopDong/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
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
                    me.getList_HopDongDuKien();
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
    genTable_HopDongDuKien: function (data, iPager) {
        var me = main_doc.HopDongDuKien;
        $("#lblHopDongDuKien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHopDongDuKien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HopDongDuKien.getList_HopDongDuKien()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + 'Họ Tên: ' + edu.util.returnEmpty(aData.BENB_TEN) + "</span><br />";
                        html += '<span>' + 'CMND/CCCD: ' + edu.util.returnEmpty(aData.BENB_SOCMTND) + "</span><br />";
                        html += '<span>' + 'Số hợp đồng: ' + edu.util.returnEmpty(aData.SOHOPDONG) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);        
    },
    viewForm_HopDongDuKien: function (data) {
        var me = this;
        var dt = data[0];
        edu.util.viewValById("txt_HoTen", data.BENB_TEN);
        edu.util.viewValById("txt_NgaySinh", data.BENB_NGAYSINH);
        edu.util.viewValById("txt_SoCMND", data.BENB_SOCMTND);
        edu.util.viewValById("txt_SoHopDong", data.SOHOPDONG);
        edu.util.viewValById("drop_LoaiHopDong", data.DIEU1_LOAIHOPDONG_ID);
        edu.util.viewValById("txt_NgayBDHieuLuc", data.NGAYHIEULUCHOPDONG);
        edu.util.viewValById("txt_NgayHetHieuLuc", data.NGAYHETHIEULUCHOPDONG);
        edu.util.viewValById("drop_DonViTuyenDung", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txt_DiaDiemLamViec", data.DIEU1_DIADIEMLAMVIEC);
        edu.util.viewValById("txtCongViecDamNhan", data.DIEU1_CONGVIECPHAILAM);
        edu.util.viewValById("txt_DiaChi", data.BENB_DIACHI);
    },
    rewrite: function () {
        var me = this;
        me.strHopDongDuKien_Id = "";
        edu.util.viewValById("txt_HoTen", "");
        edu.util.viewValById("txt_NgaySinh", "");
        edu.util.viewValById("txt_SoCMND", "");
        edu.util.viewValById("txt_SoHopDong", "");
        edu.util.viewValById("drop_LoaiHopDong", "");
        edu.util.viewValById("txt_NgayBDHieuLuc", "");
        edu.util.viewValById("txt_NgayHetHieuLuc", "");
        edu.util.viewValById("drop_DonViTuyenDung", "");
        edu.system.viewFiles("txt_DiaDiemLamViec", "");
        edu.system.viewFiles("txtCongViecDamNhan", "");
        edu.system.viewFiles("txt_DiaChi", "");
    },    
};