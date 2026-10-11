/*----------------------------------------------
--Updated by: 
--Date of created: 
----------------------------------------------*/
function ToaNha() { };
ToaNha.prototype = {
    dtToaNha: [],
    dtPhong: [],
    strToaNha_Id: '',
    strPhong_Id: '',
    arrLoaiDoiTuong_Id: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnSearchPhong").click(function () {
            me.getList_Phong("", "");
        });
        $("#btnSearchDangKy_Phong").click(function () {
            me.getList_Phong("", edu.util.getValById("txtSearch_DangKy_Phong_TuKhoa"), edu.util.getValById("dropSearch_DangKy_Phong_Loai"), edu.util.getValById("dropSearch_DangKy_Phong_TinhChat"), edu.util.getValById("dropSearch_DangKy_Phong_LoaiDoiTuong"));
            me.toggle_list_phong();
        });
        $("#txtSearch_DangKy_Phong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.toggle_list_phong();
                me.getList_Phong("", edu.util.getValById("txtSearch_DangKy_Phong_TuKhoa"));
            }
        });
        $("#btnAddNew_Toanha").click(function () {
            me.rewriteToaNha();
            me.resetPopup();
            me.popup();
        });
        $(".btnClose").click(function () {
            me.toggle_list_toanha();
            me.getCount_Phong();
        });
        $(".btnCloseThemPhong").click(function () {
            me.toggle_list_phong();
        });
        /*------------------------------------------
        --Discription: [1] Action ToaNha
        --Order: 
        -------------------------------------------*/
        $("#btnSave_ToaNha").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DapAn);
            if (valid) {
                if (edu.util.checkValue(me.strToaNha_Id)) {
                    me.update_ToaNha();
                }
                else {
                    me.save_ToaNha();
                }
            }
        });
        $("#zoneBox_ToaNha").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strToaNha_Id = strId;
                edu.util.objGetDataInData(strId, me.dtToaNha, "ID", me.viewEdit_ToaNha);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_ToaNha").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ToaNha(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_ToaNha").delegate(".btnView", "click", function () {
            var strToaNha_Id = this.id;
            strToaNha_Id = edu.util.cutPrefixId(/view_/g, strToaNha_Id);
            me.strToaNha_Id = strToaNha_Id;
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_list_phong();
                me.getList_Phong(strToaNha_Id);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [1] Action Phong
        --Order:
        -------------------------------------------*/
        $("#btnAddNew").click(function () {
            me.rewritePhong();
            me.strPhong_Id = "";
            edu.util.viewValById("dropPhong_ToaNha", me.strToaNha_Id);
            me.toggle_input_phong();
        });
        $("#btnSave_Phong").click(function () {
            if (edu.util.checkValue(me.strPhong_Id)) {
                me.update_Phong();
            }
            else {
                me.save_Phong();
            }
        });
        $("#tblPhong").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strPhong_Id = strId;
                edu.util.objGetDataInData(strId, me.dtPhong, "ID", me.viewEdit_Phong);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPhong").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },

    rewritePhong: function () {
        var me = this;
        me.strPhong_Id = "";
        edu.util.viewValById("dropPhong_ToaNha", "");
        edu.util.viewValById("dropPhong_TangSo", "");
        edu.util.viewValById("txtPhong_Ten", "");
        edu.util.viewValById("txtPhong_Ma", "");
        edu.util.viewValById("txtPhong_DienTichSuDung", "");
        edu.util.viewValById("txtPhong_SoGiuong", "");
        edu.util.viewValById("dropPhong_LoaiPhong", "");
        edu.util.viewValById("dropPhong_TinhChat", "");
        edu.util.viewValById("txtPhong_SoLuongToiDa", "");
        edu.util.viewValById("dropPhong_LoaiDoiTuong", "");
        edu.util.viewValById("txtPhong_MoTa", "");
    },
    rewriteToaNha: function () {
        var me = this;
        me.strPhong_Id = "";
        edu.util.viewValById("txtToaNha_Ten", "");
        edu.util.viewValById("txtToaNha_Ma", "");
        edu.util.viewValById("txtToaNha_SoTang", "");
        edu.util.viewValById("dropToaNha_Loai", "");
        edu.util.viewValById("txtPhong_DienTichSuDung", "");
        edu.util.viewValById("dropToaNha_ViTriCauThang", "");
        edu.util.viewValById("txtToaNha_ThongTinLienHe", "");
        edu.util.viewValById("txtToaNha_DiaChi", "");
    },
    page_load: function () {
        var me = this;
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_DapAn = [
            { "MA": "txtToaNha_Ten", "THONGTIN1": "EM" },
            { "MA": "txtToaNha_SoTang", "THONGTIN1": "EM#IN" },
            { "MA": "txtToaNha_ThongTinLienHe", "THONGTIN1": "EM" },
            { "MA": "txtToaNha_DiaChi", "THONGTIN1": "EM" }
        ];
        //get date initial
        me.toggle_list_toanha();
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropSearch_DangKy_Phong_LoaiDoiTuong,dropPhong_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.ST00", "dropPhong_TangSo");
        me.getList_ToaNha();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LTN0, "dropToaNha_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.VTCT, "dropToaNha_ViTriCauThang");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.ST00, "dropPhong_SoTang");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LP00, "dropPhong_LoaiPhong,dropSearch_DangKy_Phong_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.TCP0, "dropPhong_TinhChat,dropSearch_DangKy_Phong_TinhChat");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTP0", "dropPhong_TinhTrang");
        $(".select-opt").select2();
    },
    /*------------------------------------------
    --Discription: [1] Form input
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_ToaNha').modal('show');
    },
    resetPopup: function () {
        var me = this;
        me.strToaNha_Id = "";
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới tòa nhà');
        
    },
    editPopup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('<i class="fa fa-edit"></i> Chỉnh sửa tòa nhà');

    },

    toggle_list_toanha: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_toanha");
    },
    toggle_input_phong: function () {
        console.log(11111);
        edu.util.toggle_overide("zone-bus", "zone_input_phong");
    },
    toggle_list_phong: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_phong");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB ToaNha
    -------------------------------------------*/
    getList_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.dtToaNha = dtResult;
                    me.genBox_ToaNha(dtResult, iPager)
                    me.genCombo_ToaNha(dtResult);
                    me.getCount_Phong();
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_ToaNha/ThemMoi',
            

            'strId': "",
            'strTen': edu.util.getValById("txtToaNha_Ten"),
            'strMa': edu.util.getValById("txtToaNha_Ma"),
            'strThongTinLienHe': edu.util.getValById("txtToaNha_ThongTinLienHe"),
            'dSoTang': edu.util.getValById("txtToaNha_SoTang"),
            'strDiaChi': edu.util.getValById("txtToaNha_DiaChi"),
            'strLoaiToaNha_Id': edu.util.getValById("dropToaNha_Loai"),
            'strViTriCauThang_Id': edu.util.getValById("dropToaNha_ViTriCauThang"),
            'strNguoiThucHien_Id': edu.system.userId
            
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ToaNha();
                }
                else {
                    edu.system.alert("KTX_ToaNha/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_ToaNha/CapNhat',
            

            'strId': me.strToaNha_Id,
            'strTen': edu.util.getValById("txtToaNha_Ten"),
            'strMa': edu.util.getValById("txtToaNha_Ma"),
            'strThongTinLienHe': edu.util.getValById("txtToaNha_ThongTinLienHe"),
            'dSoTang': edu.util.getValById("txtToaNha_SoTang"),
            'strDiaChi': edu.util.getValById("txtToaNha_DiaChi"),
            'strLoaiToaNha_Id': edu.util.getValById("dropToaNha_Loai"),
            'strViTriCauThang_Id': edu.util.getValById("dropToaNha_ViTriCauThang"),
            'strNguoiThucHien_Id': edu.system.userId

        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "i",
                        content: "Cập nhật thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ToaNha();
                }
                else {
                    edu.system.alert("KTX_ToaNha/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ToaNha: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KTX_ToaNha/Xoa',
            

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
                }
                else {
                    obj = {
                        content: "KTX_ToaNha/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_ToaNha();
            },
            error: function (er) {
                var obj = {
                    content: "KTX_ToaNha/Xoa (er): " + JSON.stringify(er),
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

    viewEdit_ToaNha: function (data) {
        var me = main_doc.ToaNha;
        edu.util.viewValById("txtToaNha_Ten", data[0].TEN);
        edu.util.viewValById("txtToaNha_Ma", data[0].MA);
        edu.util.viewValById("txtToaNha_ThongTinLienHe", data[0].THONGTINLIENHE);
        edu.util.viewValById("txtToaNha_SoTang", data[0].SOTANG);
        edu.util.viewValById("txtToaNha_DiaChi", data[0].DIACHI);
        edu.util.viewValById("dropToaNha_Loai", data[0].LOAITOANHA_ID);
        edu.util.viewValById("dropToaNha_ViTriCauThang", data[0].VITRICAUTHANG_ID);
        me.popup();
    },
    genBox_ToaNha: function (data, iPager) {
        var me = this;
        var html = '';
        var strToaNha_Id = "";
        var strToaNha_Ten = "";
        var iToaNha_SoPhong = 0;
        var iTongSoPhong = 0;

        $("#zoneBox_ToaNha").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            strToaNha_Id = data[i].ID;
            strToaNha_Ten = data[i].TEN;
            //số phòng đếm từ danh sách phòng (khớp màn "Xem phòng"); chưa có thì dùng TONGSOPHONG của API tòa nhà
            if (me.objSoPhong_ToaNha) iToaNha_SoPhong = me.objSoPhong_ToaNha[strToaNha_Id] || 0;
            else iToaNha_SoPhong = data[i].TONGSOPHONG || 0;
            iTongSoPhong += parseInt(iToaNha_SoPhong, 10) || 0;

            html += '<div class="tn-card btnView" id="view_' + strToaNha_Id + '">';
            html += '<div class="tn-card-head">';
            html += '<span class="tn-card-ico"><i class="fa fa-building"></i></span>';
            html += '<h4 class="tn-card-title">' + strToaNha_Ten + '</h4>';
            html += '</div>';
            html += '<div class="tn-card-body">';
            html += '<div class="tn-count"><span class="tn-count-lbl">Số phòng</span><b>' + iToaNha_SoPhong + '</b></div>';
            html += '<span class="tn-xem poiter">Xem phòng <i class="fa fa-arrow-right"></i></span>';
            html += '</div>';
            html += '<div class="tn-card-foot">';
            html += '<a id="delete_' + strToaNha_Id + '" class="tn-btn tn-btn-del poiter btnDelete"><i class="fa fa-trash"></i> Xóa</a>';
            html += '<a id="edit_' + strToaNha_Id + '" class="tn-btn tn-btn-edit poiter btnEdit"><i class="fa fa-pencil"></i> Chỉnh sửa</a>';
            html += '</div>';
            html += '</div>';
        }
        if (data.length == 0) {
            html = '<div class="tn-empty"><i class="fa fa-building-o"></i> Chưa có tòa nhà nào</div>';
        }
        //
        $("#zoneBox_ToaNha").html(html);
        $("#lblToaNha_TongQuan").html(data.length + ' tòa nhà · ' + iTongSoPhong + ' phòng');
    },
    /*------------------------------------------
    --Discription: [3] AcessDB Phong
    -------------------------------------------*/
    //Đếm số phòng theo từng tòa từ KTX_Phong/LayDanhSach (không lọc) để hiển thị trên thẻ tòa nhà,
    //vì TONGSOPHONG của KTX_ToaNha/LayDanhSach có tòa trả 0 dù đã có phòng
    getCount_Phong: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var objSoPhong = {};
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    for (var i = 0; i < dtResult.length; i++) {
                        var strId = dtResult[i].KTX_TOANHA_ID;
                        objSoPhong[strId] = (objSoPhong[strId] || 0) + 1;
                    }
                    me.objSoPhong_ToaNha = objSoPhong;
                    me.genBox_ToaNha(me.dtToaNha, 0);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_Phong: function (strToaNha_Id, strTuKhoa) {
        var me = this;
        if (strToaNha_Id == undefined) {
            me.strToaNha_Id = "";
        }
        if (strTuKhoa == undefined) strTuKhoa = "";

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': strTuKhoa,
            'strKTX_ToaNha_Id': me.strToaNha_Id,
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_DangKy_Phong_LoaiDoiTuong"),
            'strTangThu_Id': "",
            'strLoaiPhong_Id': edu.util.getValById("dropSearch_DangKy_Phong_Loai"),
            'strTinhChat_Id': edu.util.getValById("dropSearch_DangKy_Phong_TinhChat"),
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

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
                    me.dtPhong = dtResult;
                    me.genTable_Phong(dtResult, iPager, strToaNha_Id);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_Phong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_Phong/ThemMoi',
            

            'strId': "",
            'strTen': edu.util.getValById("txtPhong_Ten"),
            'strMa': edu.util.getValById("txtPhong_Ma"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropPhong_ToaNha"),
            'strDienTichSuDung': edu.util.returnZero(edu.util.getValById("txtPhong_DienTichSuDung")),
            'strSoGiuong': edu.util.getValById("txtPhong_SoGiuong"),
            'strTangThu_Id': edu.util.getValById("dropPhong_TangSo"),
            'strLoaiPhong_Id': edu.util.getValById("dropPhong_LoaiPhong"),
            'strTinhChat_Id': edu.util.getValById("dropPhong_TinhChat"),
            'strTinhTrang_Id': edu.util.getValById("dropPhong_TinhTrang"),
            'strMoTa': edu.util.getValById("txtPhong_MoTa"),
            'dSoSinhVienToiDa': edu.util.getValById("txtPhong_SoLuongToiDa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_Phong(me.strToaNha_Id);
                    var arrDoiTuong = $("#dropPhong_LoaiDoiTuong").val();
                    for (var i = 0; i < arrDoiTuong.length; i++) {
                        if (!me.arrLoaiDoiTuong_Id.includes(arrDoiTuong[i])) {
                            me.save_Phong_ApDung(data.Id, arrDoiTuong[i]);
                        }
                    }
                    //Xóa tượng áp dụng với những thành phần mới trong dãy
                    for (var i = 0; i < me.arrLoaiDoiTuong_Id.length; i++) {
                        if (!arrDoiTuong.includes(me.arrLoaiDoiTuong_Id[i])) {
                            me.delete_Phong_ApDung(me.strPhong_Id, me.arrLoaiDoiTuong_Id[i]);
                        }
                    }

                }
                else {
                    edu.system.alert("KTX_Phong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_Phong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_Phong/CapNhat',
            

            'strId': me.strPhong_Id,
            'strTen': edu.util.getValById("txtPhong_Ten"),
            'strMa': edu.util.getValById("txtPhong_Ma"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropPhong_ToaNha"),
            'strDienTichSuDung': edu.util.returnZero(edu.util.getValById("txtPhong_DienTichSuDung")),
            'strSoGiuong': edu.util.getValById("txtPhong_SoGiuong"),
            'strTangThu_Id': edu.util.getValById("dropPhong_TangSo"),
            'strLoaiPhong_Id': edu.util.getValById("dropPhong_LoaiPhong"),
            'strTinhChat_Id': edu.util.getValById("dropPhong_TinhChat"),
            'strTinhTrang_Id': edu.util.getValById("dropPhong_TinhTrang"),
            'strMoTa': edu.util.getValById("txtPhong_MoTa"),
            'dSoSinhVienToiDa': edu.util.getValById("txtPhong_SoLuongToiDa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_Phong(me.strToaNha_Id);
                    var arrDoiTuong = $("#dropPhong_LoaiDoiTuong").val();
                    //Thêm đối tượng áp dụng với những thành phần mới trong dãy 
                    for (var i = 0; i < arrDoiTuong.length; i++) {
                        if (!me.arrLoaiDoiTuong_Id.includes(arrDoiTuong[i])) {
                            me.save_Phong_ApDung(me.strPhong_Id, arrDoiTuong[i]);
                        }
                    }
                    //Xóa tượng áp dụng với những thành phần mới trong dãy
                    for (var i = 0; i < me.arrLoaiDoiTuong_Id.length; i++) {
                        if (!arrDoiTuong.includes(me.arrLoaiDoiTuong_Id[i])) {
                            me.delete_Phong_ApDung(me.strPhong_Id, me.arrLoaiDoiTuong_Id[i]);
                        }
                    }
                }
                else {
                    edu.system.alert("KTX_Phong/CapNhat: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Phong: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_Phong/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa phòng thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_Phong(me.strPhong_Id);
                }
                else {
                    $("#notify_cn").html("KTX_Phong.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_Phong.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    viewEdit_Phong: function (data) {
        var me = main_doc.ToaNha;
        edu.util.viewValById("txtToaNha_Ten", data[0].KTX_TOANHA_TEN);
        edu.util.viewValById("txtPhong_Ten", data[0].TEN);
        edu.util.viewValById("txtPhong_Ma", data[0].MA);
        edu.util.viewValById("txtPhong_DienTichSuDung", data[0].DIENTICHSUDUNG);
        edu.util.viewValById("txtPhong_SoGiuong", data[0].SOGIUONG);
        edu.util.viewValById("dropPhong_ToaNha", data[0].KTX_TOANHA_ID);
        edu.util.viewValById("dropPhong_TangSo", data[0].TANGTHU_ID);
        edu.util.viewValById("dropPhong_LoaiPhong", data[0].LOAIPHONG_ID);
        edu.util.viewValById("dropPhong_TinhChat", data[0].TINHCHAT_ID);
        edu.util.viewValById("txtPhong_SoLuongToiDa", data[0].SOSINHVIENTOIDA);
        edu.util.viewValById("dropPhong_TinhTrang", data[0].TINHTRANG_ID);
        edu.util.viewValById("txtPhong_MoTa", data[0].MOTA);
        me.getList_Phong_ApDung(data[0].ID);
        me.toggle_input_phong();
    },
    genTable_Phong: function (data, iPager, strToaNha_Id) {
        var me = this;
        edu.util.viewHTMLById("", iPager);
        me.genHeader_Phong(data);
        me.genTfoot_Phong(data);
        //ô không có dữ liệu hiện dấu gạch thay vì để trống
        var fnCell = function (strCol, bChip) {
            return function (nRow, aData) {
                if (!edu.util.checkValue(aData[strCol])) return '<span class="tn-na">—</span>';
                return bChip ? '<span class="tn-chip">' + aData[strCol] + '</span>' : aData[strCol];
            };
        };

        var jsonForm = {
            strTable_Id: "tblPhong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ToaNha.getList_Phong('" + strToaNha_Id+"')",
            //    iDataRow: iPager
            //},
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
                left: [1, 2, 3, 5, 6],
                right: [7, 8, 9],
                center: [0, 4, 10, 11],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_TOANHA_TEN"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mData": "tang",
                    "mRender": fnCell("TANGTHU_TEN")
                },
                {
                    "mData": "tinhchat",
                    "mRender": fnCell("TINHCHAT_TEN", true)
                }
                , {
                    "mData": "loaiphong",
                    "mRender": fnCell("LOAIPHONG_TEN")
                }
                , {
                    "mData": "dientich",
                    "mRender": fnCell("DIENTICHSUDUNG")
                }
                , {
                    "mData": "sogiuong",
                    "mRender": fnCell("SOGIUONG")
                }
                , {
                    "mData": "songuoitoida",
                    "mRender": fnCell("SOSINHVIENTOIDA")
                }
                , {
                    "mData": "edit",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="tn-icon-btn tn-icon-edit btnEdit" id="edit_' + aData.ID + '" href="#"><i class="fa fa-pencil"></i></a>';
                    }
                }
                , {
                    "mData": "delete",
                    "mRender": function (nRow, aData) {
                        return '<a title="Xóa" class="tn-icon-btn tn-icon-del btnDelete" id="delete_' + aData.ID + '" href="#"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/

    },
    //Tiêu đề màn phòng: tên (mã) tòa nhà đang xem + số phòng
    genHeader_Phong: function (data) {
        var me = this;
        var strTen = "Tất cả tòa nhà";
        for (var i = 0; i < me.dtToaNha.length; i++) {
            if (me.dtToaNha[i].ID == me.strToaNha_Id) {
                strTen = me.dtToaNha[i].TEN;
                if (edu.util.checkValue(me.dtToaNha[i].MA) && me.dtToaNha[i].MA != me.dtToaNha[i].TEN) strTen += " (" + me.dtToaNha[i].MA + ")";
                break;
            }
        }
        $("#lblPhong_ToaNha_Ten").html(strTen);
        $("#lblPhong_TongSo").html(data.length + " phòng");
    },
    //Dòng tổng ở chân bảng: diện tích, số giường, số người ở tối đa
    genTfoot_Phong: function (data) {
        var dDienTich = 0, iGiuong = 0, iNguoi = 0;
        for (var i = 0; i < data.length; i++) {
            dDienTich += parseFloat(data[i].DIENTICHSUDUNG) || 0;
            iGiuong += parseInt(data[i].SOGIUONG, 10) || 0;
            iNguoi += parseInt(data[i].SOSINHVIENTOIDA, 10) || 0;
        }
        $("#lblPhong_TongDienTich").html(Math.round(dDienTich * 100) / 100);
        $("#lblPhong_TongGiuong").html(iGiuong);
        $("#lblPhong_TongNguoi").html(iNguoi);
    },

    genCombo_ToaNha: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataNhanSu_Combo);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropPhong_ToaNha"],
            type: "",
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AcessDB Phong
    -------------------------------------------*/
    getList_Phong_ApDung: function (strPhong_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strKTX_Phong_Id': me.strPhong_Id,
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_DangKy_Phong_LoaiDoiTuong"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000,

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
                    me.genCombo_Phong_ApDung(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_Phong_ApDung: function (strPhong_Id, strPhanLoaiDoiTuong_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_Phong_ApDung/ThemMoi',
            

            'strId': "",
            'strPhanLoaiDoiTuong_Id': strPhanLoaiDoiTuong_Id,
            'strKTX_Phong_Id': strPhong_Id,
            'strPhanLoaiDoiTuong_Id': strPhanLoaiDoiTuong_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("KTX_Phong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Phong_ApDung: function (strPhong_Id, strPhanLoaiDoiTuong_Id) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_Phong_ApDung/Xoa',
            

            'strPhanLoaiDoiTuong_Id': strPhanLoaiDoiTuong_Id,
            'strKTX_Phong_Id': strPhong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notify_cn").html("Xóa thành công!");
                }
                else {
                    $("#notify_cn").html("KTX_Phong.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_Phong.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genCombo_Phong_ApDung: function (data) {
        var me = this;
        me.arrLoaiDoiTuong_Id = [];
        for (var i = 0; i < data.length; i++) {
            me.arrLoaiDoiTuong_Id.push(data[i].PHANLOAIDOITUONG_ID);
        }
        $("#dropPhong_LoaiDoiTuong").val(me.arrLoaiDoiTuong_Id).trigger("change");
    },
};