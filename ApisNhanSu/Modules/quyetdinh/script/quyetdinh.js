/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function QuyetDinh() { }
QuyetDinh.prototype = {
    dtQuyetDinh: [],
    strQuyetDinh_Id: '',
    arrNhanSu_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchQuyetDinh_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocGia
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_QuyetDinh").click(function () {
            me.getList_QuyetDinh();
        });
        $("#btnSave_QuyetDinh").click(function () {
            var valid = edu.util.objGetDataInData("VALID.NCKH.QuyetDinh", edu.system.dataCache, "key", "");
            if (edu.util.checkValue(valid)) {
                if (edu.util.validInputForm(valid[0].data)) {
                    if (edu.util.checkValue(me.strQuyetDinh_Id)) {
                        me.update_QuyetDinh();
                    }
                    else {
                        me.save_QuyetDinh();
                    }
                }
            }
            else {
                if (edu.util.checkValue(me.strQuyetDinh_Id)) {
                    me.update_QuyetDinh();
                }
                else {
                    me.save_QuyetDinh();
                }
            }
        });
        $("#tblQuyetDinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strQuyetDinh_Id = strId;
                me.getDetail_QuyetDinh(strId, constant.setting.ACTION.EDIT);
                me.getList_QuyetDinh_ThanhVien(constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblQuyetDinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyetDinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyetDinh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
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
        $("#tblInput_QuyetDinh_ThanhVien").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
        });
        $("#tblInput_QuyetDinh_ThanhVien").delegate('.btnDelete', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/delete_QuyetDinh_thanhvien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyetDinh_ThanhVien(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#zone_input_QuyetDinh").delegate(".btnDelUploadedFile", "click", function () {
        //    var strFileName = this.title;
        //    if (edu.util.checkValue(strFileName)) {
        //        //xoa file trong csdl
        //        edu.extend.delete_File(strFileName, deleteFiles);
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        edu.system.uploadFiles(["txtQuyetDinh_File"]);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_QuyetDinh();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh_Loai,dropSearch_QuyetDinh_Loai");
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_QuyetDinh");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuyetDinh");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuyetDinh");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuyetDinh_Id = "";
        me.arrNhanSu_Id = [];
        var arrId = ["txtQuyetDinh_Ten", "dropQuyetDinh_Loai", "txtQuyetDinh_So",
            "txtQuyetDinh_Ngay", "txtQuyetDinh_NgayHieuLuc", "txtQuyetDinh_NgayKetThuc",
            "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy"];
        edu.util.resetValByArrId(arrId);
        //table
        me.genTableInput_ThanhVien_QuyetDinh([]);
        //reset file
        edu.system.viewFiles("lblQuyetDinh_File", "");
        edu.system.viewFiles("txtQuyetDinh_File", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Third-Party
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML Third-Party
    --ULR:  Modules
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.QuyetDinh;
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
            renderPlace: ["dropSearch_PhanCap_CCTC"],
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
            renderPlace: ["dropSearch_PhanCap_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocGia
    -------------------------------------------*/
    getList_QuyetDinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinQuyetDinh/LayDanhSach',
            
            
            'strNgayHieuLuc_Tu': "",
            'strNgayHieuLuc_Den': edu.util.getValById("dropSearch_LinhVuc"),
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropSearch_PhanLoai"),
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strThanhVien_Id': "",
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
                        me.dtQuyetDinh = dtResult;
                    }
                    me.genTable_QuyetDinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_ThongTinQuyetDinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_ThongTinQuyetDinh/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuyetDinh: function () {
        var me = this;
        var strNhanSu_Ids = "";

        for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
            //convert to string seprate by #
            if (i < me.arrNhanSu_Id.length - 1) {
                strNhanSu_Ids += me.arrNhanSu_Id[i] + "#";
            }
            else {
                strNhanSu_Ids += me.arrNhanSu_Id[i];
            }
        }
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinQuyetDinh/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strSoQuyetDinh': edu.util.getValById("txtQuyetDinh_So"),
            'strNgayQuyetDinh': edu.util.getValById("txtQuyetDinh_Ngay"),
            'strNguoiKyQuyetDinh': edu.util.getValById("txtQuyetDinh_NguoiKy"),
            'strNgayHieuLuc': edu.util.getValById("txtQuyetDinh_NgayHieuLuc"),
            'strThongTinQuyetDinh': edu.util.getValById("txtQuyetDinh_Ten"),
            'strThongTinDinhKem': edu.util.getValById("txtQuyetDinh_File"),
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh_Loai"),
            'strNgayHetHieuLuc': edu.util.getValById("txtQuyetDinh_NgayKetThuc"),
            'strNguoiThucHien_Id': edu.util.getValById("dropQuyetDinh_LinhVuc"),
            'dTrangThai': 1,
            'dThuTu': 1
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_QuyetDinh();
                    //update by vanhiep: lưu file đính kèm
                    var strId = data.Id;
                    if (edu.util.checkValue(strId)) {
                        edu.system.saveFiles("txtQuyetDinh_File", strId, "NS_Files");
                    }
                }
                else {
                    edu.system.alert("NS_ThongTinQuyetDinh/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_ThongTinQuyetDinh/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_QuyetDinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinQuyetDinh/CapNhat',
            

            'strId': me.strQuyetDinh_Id,
            'strNhanSu_HoSoCanBo_Id': "",
            'strSoQuyetDinh': edu.util.getValById("txtQuyetDinh_So"),
            'strNgayQuyetDinh': edu.util.getValById("txtQuyetDinh_Ngay"),
            'strNguoiKyQuyetDinh': edu.util.getValById("txtQuyetDinh_ChuKy"),
            'strNgayHieuLuc': edu.util.getValById("txtQuyetDinh_NgayHieuLuc"),
            'strThongTinQuyetDinh': edu.util.getValById("txtQuyetDinh_Ten"),
            'strThongTinDinhKem': edu.util.getValById("txtQuyetDinh_File"),
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh_Loai"),
            'strNgayHetHieuLuc': edu.util.getValById("txtQuyetDinh_NgayKetThuc"),
            'strNguoiThucHien_Id': edu.util.getValById("dropQuyetDinh_LinhVuc"),
            'dTrangThai': 1,
            'dThuTu': 1,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QuyetDinh();
                    //update by vanhiep: lưu file đính kèm
                    var strId = me.strQuyetDinh_Id;
                    if (edu.util.checkValue(strId)) {
                        edu.system.saveFiles("txtQuyetDinh_File", strId, "NS_Files");
                    }
                }
                else {
                    edu.system.alert("NS_ThongTinQuyetDinh/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_ThongTinQuyetDinh/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyetDinh: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_ThongTinQuyetDinh/Xoa',
            

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
    --Discription: [1] GenHTML TapChiQuocGia
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuyetDinh: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyetDinh_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyetDinh.getList_QuyetDinh()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.THONGTINQUYETDINH) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_QuyetDinh: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID", me.viewEdit_QuyetDinh);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID", me.viewDetail_QuyetDinh);
                break;
        }
    },
    genTable_ThanhVien_QuyetDinh: function (data, strAction) {
        var me = this;
        me.genTableInput_ThanhVien_QuyetDinh(data);
    },
    //
    viewEdit_QuyetDinh: function (data) {
        var me = this;
        var dt = data[0];
        //View - Thong tin
        edu.util.viewValById("txtQuyetDinh_Ten", dt.THONGTINQUYETDINH);
        edu.util.viewValById("dropQuyetDinh_Loai", dt.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtQuyetDinh_So", dt.SOQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_Ngay", dt.NGAYQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_NgayHieuLuc", dt.NGAYHIEULUC);
        edu.util.viewValById("txtQuyetDinh_NgayKetThuc", dt.NGAYHETHIEULUC);
        edu.util.viewValById("txtQuyetDinh_NguoiKy", dt.NGUOIKYQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_ChuKy", "");
        //View - Noi dung minh chung
        //update
        edu.system.viewFiles("txtQuyetDinh_File", dt.ID, "NS_Files");
    },
    genTableInput_ThanhVien_QuyetDinh: function (data) {
        var me = this;
        var arrVaiTro_Id = [];
        var jsonForm = {
            strTable_Id: "tblInput_QuyetDinh_ThanhVien",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 4],
                left: [],
                fix: [0]
            },
            orowid: {
                id: 'ID',
                prefixId: 'rm_row'
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = aData.MACANBO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYSINHDAYDU;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a class="btn btn-default btn-circle btnDelete" id="delete_QuyetDinh_thanhvien' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    //
    viewDetail_QuyetDinh: function (data) {
        var me = main_doc.QuyetDinh;
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
        edu.util.viewHTMLById("lblQuyetDinh_ChuKy", dt.NGUOIKYQUYETDINH);
        //View - Noi dung minh chung
        //edu.system.viewFiles("lblQuyetDinh_File", dt.THONGTINDINHKEM);
        //update
        edu.system.viewFiles("lblQuyetDinh_File", dt.ID, "NS_Files");
    },
    genTableDetail_ThanhVien_QuyetDinh: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDetail_QuyetDinh_ThanhVien",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = aData.MACANBO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = edu.util.returnEmpty(aData.NGAYSINHDAYDU);
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
   --Discription: [2] AccessDB QuyetDinh_ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_QuyetDinh_ThanhVien: function (strAction) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyetDinhNhanSu/LayDanhSach',
            
            'strNhanSu_ThongTinQD_Id': me.strQuyetDinh_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien_QuyetDinh(dtResult, strAction);
                }
                else {
                    edu.system.alert("NS_QuyetDinhNhanSu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyetDinhNhanSu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    add_QuyetDinh_ThanhVien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyetDinhNhanSu/ThemMoi',
            

            'strNhanSu_ThongTinQD_Id': me.strQuyetDinh_Id,
            'strNhanSu_HoSoCanBo_Id': "#",
            'dThuTu': edu.util.getValById("dropQuyetDinh_LinhVuc"),
            'strTrangThai': 1,
            'strTinhtrang':1
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("NS_QuyetDinhNhanSu/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyetDinhNhanSu/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyetDinh_ThanhVien: function (strQuyetDinhNhanSu) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyetDinhNhanSu/Xoa',
            
            'strId': strQuyetDinhNhanSu,
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
                    //remove on interface
                    me.getList_QuyetDinh_ThanhVien();
                }
                else {
                    obj = {
                        content: "NS_QuyetDinhNhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyetDinhNhanSu/Xoa (er): " + JSON.stringify(er),
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
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove'>Bỏ chọn</td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_QuyetDinh_ThanhVien tbody").append(html);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_QuyetDinh_ThanhVien tbody").html("");
            $("#tblInput_QuyetDinh_ThanhVien tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    }
};