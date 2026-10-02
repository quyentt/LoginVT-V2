/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function DiNuocNgoai() { };
DiNuocNgoai.prototype = {
    //strCommon_Id: '',
    dtDiNuocNgoai: [],
    strDiNuocNgoai_Id: "",
    tab_actived: [],
    tab_item_actived: [],
    arrValid_DiNuocNgoai: [],

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
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href"); //activated tab
            var check = edu.util.arrEqualVal(me.tab_actived, target);
            if (!check) {
                me.tab_actived.push(target);
                switch (target) {
                    case "#tab_1": //Tieu su ban than
                        me.open_Collapse("key_dinuocngoai");
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
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DiNuocNgoai);
            if (valid) {
                me.save_DiNuocNgoai();
                setTimeout(function () {
                    me.resetPopup_DiNuocNgoai();
                }, 1000);
            }
        });
        $("#btnSave").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DiNuocNgoai);
            if (valid) {
                me.save_DiNuocNgoai();
            }
        });
        $("#tbl_DiNuocNgoai").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            if (edu.util.checkValue(strId)) {
                me.popup_DiNuocNgoai();
                me.strDiNuocNgoai_Id = strId;
                me.getDetail_DiNuocNgoai(strId);
                me.getList_QuyetDinh();
                edu.util.setOne_BgRow(strId, "tbl_DiNuocNgoai");
                edu.system.viewFiles("txtFileDinhKem", strId, "NS_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DiNuocNgoai").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_DiNuocNgoai");
                $("#btnYes").click(function (e) {
                    me.delete_DiNuocNgoai(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('a[href="#tab_1"]').trigger("shown.bs.tab");
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThem_QuyetDinh").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        });
        $("#zoneDiNuocNgoai_input").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_QuyetDinh tr[id='" + strRowId + "']").remove();
        });
        $("#zoneDiNuocNgoai_input").delegate(".deleteQuyetDinh", "click", function () {
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
        edu.system.loadToCombo_DanhMucDuLieu("NS.DINUOCNGOAI.LOAIQUYETDINH", "drop_QD_Loai");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.arrValid_DiNuocNgoai = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTuNgay", "THONGTIN1": "EM" },
            { "MA": "txtMucDich", "THONGTIN1": "EM" },
        ];
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_dinuocngoai":
                me.resetPopup_DiNuocNgoai();
                me.popup_DiNuocNgoai();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_dinuocngoai":
                me.getList_DiNuocNgoai();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_DiNuocNgoai: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_CongTacNuocNgoai/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtDiNuocNgoai = dtResult;
                    }
                    me.genTable_DiNuocNgoai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_QT_CongTacNuocNgoai/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_QT_CongTacNuocNgoai/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DiNuocNgoai: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_CongTacNuocNgoai/ThemMoi',            

            'strId': '',
            'strTuNam': edu.util.getValById("txtTuNgay"),
            'strDenNam': edu.util.getValById("txtDenNgay"),
            'strTenNuoc': edu.util.getValById("txt_TenNuoc"),
            'strMucDich': edu.util.getValById("txtMucDich"),
            'strThongTinDinhKem': '',
            'strTenToChucSangLamViec': edu.util.getValById("txtToChucSangLamViec"),
            'strKetQuaDatDuoc': edu.util.getValById("txtSanPham"),
            'iTrangThai': 1,
            'iThuTu': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strDiNuocNgoai_Id)) {
            obj_save.action = 'NS_QT_CongTacNuocNgoai/CapNhat';
            obj_save.strId = me.strDiNuocNgoai_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDiNuocNgoai_Id = data.Id;
                    if (!edu.util.checkValue(me.strDiNuocNgoai_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        strDiNuocNgoai_Id = me.strDiNuocNgoai_Id;
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#tbl_QuyetDinh tbody tr").each(function () {
                        var strQuyetDinh_Id = this.id.replace(/rm_row/g, '');
                        me.save_QuyetDinh(strQuyetDinh_Id, strDiNuocNgoai_Id);
                    });                    
                    me.getList_DiNuocNgoai();
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
    delete_DiNuocNgoai: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_CongTacNuocNgoai/Xoa',
            
            'strIds': strIds,
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
                    me.getList_DiNuocNgoai();
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
    getDetail_DiNuocNgoai: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDiNuocNgoai, "ID", me.editForm_DiNuocNgoai);
    },
    popup_DiNuocNgoai: function () {
        $("#zoneDiNuocNgoai_input").slideDown();
    },
    resetPopup_DiNuocNgoai: function () {
        var me = this;
        $("#myModalLabel_DiNuocNgoai").html('<i class="fa fa-plus"></i> Thêm công tác nước ngoài');
        me.strCommon_Id = "";
        me.strDiNuocNgoai_Id = "";
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("txt_TenNuoc", "");
        edu.util.viewValById("txtMucDich", "");
        edu.util.viewValById("txtToChucSangLamViec", "");
        edu.util.viewValById("txtSanPham", "");
        edu.system.viewFiles("txtDeTai_FileDinhKem", "");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        $("#tbl_QuyetDinh tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.DiNuocNgoai.genHTML_QuyetDinh(id, "");
        }
    },
    genTable_DiNuocNgoai: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_DiNuocNgoai",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNAM"
                },
                {
                    "mDataProp": "DENNAM"
                },
                {
                    "mDataProp": "TENNUOC"
                },
                {
                    "mDataProp": "MUCDICH"
                },
                {
                    "mDataProp": "TENTOCHUCSANGLAMVIEC"
                },
                {
                    "mDataProp": "KETQUADATDUOC"
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
    editForm_DiNuocNgoai: function (data) {
        var me = main_doc.DiNuocNgoai;
        var dtDiNuocNgoai = data[0];
        edu.util.viewValById("txtTuNgay", dtDiNuocNgoai.TUNAM);
        edu.util.viewValById("txtDenNgay", dtDiNuocNgoai.DENNAM);
        edu.util.viewValById("txt_TenNuoc", dtDiNuocNgoai.TENNUOC);
        edu.util.viewValById("txtMucDich", dtDiNuocNgoai.MUCDICH);
        edu.util.viewValById("txtToChucSangLamViec", dtDiNuocNgoai.TENTOCHUCSANGLAMVIEC);
        edu.util.viewValById("txtSanPham", dtDiNuocNgoai.KETQUADATDUOC);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB QuyetDinh
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyetDinh: function (strQuyetDinh_Id, strDiNuocNgoai_Id) {
        var me = this;
        var strId = strQuyetDinh_Id;
        var strSoQuyetDinh = edu.util.getValById('txtSoQuyetDinh' + strQuyetDinh_Id);
        var strNgayQuyetDinh = edu.util.getValById('txtNgayQuyetDinh' + strQuyetDinh_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung' + strQuyetDinh_Id);
        var strNgayHieuLuc = edu.util.getValById('txtNgayHieuLuc' + strQuyetDinh_Id);
        var strLoaiQuyetDinh_Id = edu.util.getValById('drop_LoaiQuyetDinh' + strQuyetDinh_Id);
        var strNgayHetHieuLuc = edu.util.getValById('txtNgayHetHieuLuc' + strQuyetDinh_Id);
        var strThongTinQuyetDinh = edu.util.getValById('txtNoiDungQuyetDinh' + strQuyetDinh_Id);
       
        if (!edu.util.checkValue(strSoQuyetDinh)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'NS_ThongTinQuyetDinh/ThemMoi',            

            'strId': strId,
            'strNguonDuLieu_Id': strDiNuocNgoai_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNgayApDung': strNgayApDung,
            'strNgayQuyetDinh': strNgayQuyetDinh,
            'strNguoiKyQuyetDinh': '',
            'strNgayHieuLuc': strNgayHieuLuc,
            'strThongTinQuyetDinh': strThongTinQuyetDinh,
            'strThongTinDinhKem': '',
            'strLoaiQuyetDinh_Id': strLoaiQuyetDinh_Id,
            'strNgayHetHieuLuc': strNgayHetHieuLuc,
            'iTrangThai': 1,
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_ThongTinQuyetDinh/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtQuyetDinh_FileDinhKem" + strQuyetDinh_Id, strId, "NS_Files");                
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
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
        var obj_list = {
            'action': 'NS_ThongTinQuyetDinh/LayDanhSach',            

            'strNguonDuLieu_Id': me.strDiNuocNgoai_Id,
            'strTuKhoa': '',
            'iTrangThai': 1,
            'strNgayHieuLuc_Tu': '',
            'strNgayHieuLuc_Den': '',
            'strLoaiQuyetDinh_Id': '',
            'strThanhVien_Id': edu.system.userId,
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
                    }
                    me.genHTML_QuyetDinh_Data(dtResult);
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
        var obj = {};
        var obj_delete = {
            'action': 'NS_ThongTinQuyetDinh/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.genHTML_QuyetDinh_Data();
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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_QuyetDinh_Data: function (data) {
        var me = this;
        $("#tbl_QuyetDinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strQuyetDinh_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strQuyetDinh_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strQuyetDinh_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="drop_LoaiQuyetDinh' + strQuyetDinh_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
            row += '<td><input type="text" id="txtSoQuyetDinh' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgayQuyetDinh' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYQUYETDINH) + '" class="form-control input-datepickerX"/></td>';
            row += '<td><input type="text" id="txtNgayApDung' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYQUYETDINH) + '" class="form-control input-datepickerX"/></td>';
            row += '<td><input type="text" id="txtNgayHieuLuc' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHIEULUC) + '" class="form-control input-datepickerX"/></td>';
            row += '<td><input type="text" id="txtNgayHetHieuLuc' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHETHIEULUC) + '" class="form-control input-datepickerX"/></td>';
            row += '<td><input type="text" id="txtNoiDungQuyetDinh' + strQuyetDinh_Id + '" value="' + edu.util.returnEmpty(data[i].THONGTINQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><div id="txtQuyetDinh_FileDinhKem' + strQuyetDinh_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteQuyetDinh" id="' + strQuyetDinh_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_QuyetDinh tbody").append(row);
            me.genComBo_LoaiQuyetDinh("drop_LoaiQuyetDinh" + strQuyetDinh_Id, data[i].LOAIQUYETDINH_ID);
            edu.system.uploadFiles(["txtQuyetDinh_FileDinhKem" + strQuyetDinh_Id]);
            edu.system.viewFiles("txtQuyetDinh_FileDinhKem" + strQuyetDinh_Id, strQuyetDinh_Id, "NS_Files");
        }
        for (var i = data.length; i < 3; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        }
        edu.system.pickerdate("input-datepickerX")
    },
    genHTML_QuyetDinh: function (strQuyetDinh_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_QuyetDinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strQuyetDinh_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strQuyetDinh_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="drop_LoaiQuyetDinh' + strQuyetDinh_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
        row += '<td><input type="text" id="txtSoQuyetDinh' + strQuyetDinh_Id + '"  class="form-control " /></td>';
        row += '<td><input type="text" id="txtNgayQuyetDinh' + strQuyetDinh_Id + '" class="form-control input-datepickerX" /></td>';
        row += '<td><input type="text" id="txtNgayApDung' + strQuyetDinh_Id + '" class="form-control input-datepickerX" /></td>';
        row += '<td><input type="text" id="txtNgayHieuLuc' + strQuyetDinh_Id + '" class="form-control input-datepickerX" /></td>';
        row += '<td><input type="text" id="txtNgayHetHieuLuc' + strQuyetDinh_Id + '" class="form-control input-datepickerX" /></td>';
        row += '<td><input type="text" id="txtNoiDungQuyetDinh' + strQuyetDinh_Id + '" class="form-control"/></td>';
        row += '<td><div id="txtQuyetDinh_FileDinhKem' + strQuyetDinh_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strQuyetDinh_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_QuyetDinh tbody").append(row);
        edu.system.uploadFiles(["txtQuyetDinh_FileDinhKem" + strQuyetDinh_Id]);
        me.genComBo_LoaiQuyetDinh("drop_LoaiQuyetDinh" + strQuyetDinh_Id, "");
        edu.system.pickerdate("input-datepickerX")
    },
    cbGetList_LoaiQuyetDinh: function (data) {
        main_doc.DiNuocNgoai.dtLoaiQuyetDinh = data;
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
}