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
        $("#tblQuyetDinh").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_detail();
                me.strQuyetDinh_Id = strId;
                me.getDetail_QuyetDinh(strId, constant.setting.ACTION.VIEW);
                me.getList_QuyetDinh_ThanhVien(constant.setting.ACTION.VIEW);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        //edu.system.uploadFiles(["lblQuyetDinh_File"], "", "");
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        me.getList_QuyetDinh();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh_Loai,dropSearch_QuyetDinh_Loai");
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
            'pageIndex': 1,
            'pageSize': 1000000,
            'strThanhVien_Id': edu.system.userId,
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
                    edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
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
        edu.util.viewHTMLById("lblQuyetDinh_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyetDinh.getList_QuyetDinh()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.THONGTINQUYETDINH) + "</span>";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
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
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                me.genTableInput_ThanhVien_QuyetDinh(data);
                break;
            case constant.setting.ACTION.VIEW:
                me.genTableDetail_ThanhVien_QuyetDinh(data);
                break;
        }
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
        edu.system.viewFiles("txtQuyetDinh_File", dt.THONGTINDINHKEM);
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
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
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
                        var strNhanSu_Id = aData.ID;
                        arrVaiTro_Id.push(aData.VAITRO_ID);
                        var html_vaitro = '<select id="vaitro_' + strNhanSu_Id + '"></select>';
                        return html_vaitro;
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
        edu.util.viewHTMLById("lblQuyetDinh_ChuKy", "");
        //View - Noi dung minh chung
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
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
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
            'strTinhtrang': 1
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
    delete_QuyetDinh_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyetDinhNhanSu/Xoa',
            
            'strQuyetDinh_Id': me.strQuyetDinh_Id,
            'strThanhVien_Id': strNhanSu_Id,
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
                    me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
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
};