/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 22/10/2018
----------------------------------------------*/
function HoiDongDaoDuc() { }
HoiDongDaoDuc.prototype = {
    dtHDDD: [],
    strHDDD_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchHDDD_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoiDongDaoDuc
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HDDD").click(function () {
            me.getList_HDDD();
        });
        $("#txtSearch_HDDD_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HDDD();
            }
        });
        $("#btnSave_HDDD").click(function () {
            var valid = "";//edu.util.objGetDataInData("VALID.NCKH.HDDD", edu.system.dataCache, "key", "");
            if (edu.util.checkValue(valid)) {
                if (edu.util.validInputForm(valid[0].data)) {
                    if (edu.util.checkValue(me.strHDDD_Id)) {
                        me.update_HDDD();
                    }
                    else {
                        me.save_HDDD();
                    }
                }
            }
            else {
                if (edu.util.checkValue(me.strHDDD_Id)) {
                    me.update_HDDD();
                }
                else {
                    me.save_HDDD();
                }
            }
        });
        $("#tblHDDD").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_detail();
                me.strHDDD_Id = strId;
                me.getDetail_HDDD(strId, constant.setting.ACTION.VIEW);
                edu.util.setOne_BgRow(strId, "tblHDDD");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHDDD").delegate(".btnEdit", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strHDDD_Id = strId;
                me.getDetail_HDDD(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblHDDD");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHDDD").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HDDD(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3] Action HDDD_ThanhVien input
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_tblNhanSu(strNhanSu_Id);
        });
        $("#tblInput_HDDD_ThanhVien").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
        });
        $("#tblInput_HDDD_ThanhVien").delegate('.btnDelete', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/delete_HDDD_thanhvien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HDDD_ThanhVien(strNhanSu_Id);
                });
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
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropHDDD_NamBaoCao", "Chọn năm báo cáo");
        /*------------------------------------------
        --Discription: [1] Load TapChiQuocTe
        -------------------------------------------*/
        me.getList_HDDD();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_HDDD");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HDDD");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HDDD");
    },
    rewrite: function () {
        var me = this;
        me.strHDDD_Id = "";
        me.arrNhanSu_Id = [];
        var arrId = ["txtHDDD_Ten", "txtHDDD_TenBaoCao", "dropHDDD_PhamVi", "dropHDDD_NamBaoCao", "dropHDDD_LinhVuc_Nganh", "dropHDDD_DonViToChuc", "txtHDDD_SoLuongQuocTe", "txtHDDD_SoLuongTrongNuoc"];
        edu.util.resetValByArrId(arrId);
        me.genTableInput_ThanhVien_HDDD([]);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongDaoDuc
    -------------------------------------------*/
    getList_HDDD: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_SP_HoiDongDaoDuc/LayDanhSach',            

            'strNCKH_DeTai_ThanhVien_Id': "",
            'strQuanLyDeTai_Id': "",
            'strCanBoNhap_Id': edu.util.getValById("dropSearch_HDDD_LinhVuc"),
            'strTuKhoa': edu.util.getValById("dropSearch_HDDD_LinhVuc"),
            'iTrangThai': 1,
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
                        me.dtHDDD = dtResult;
                    }
                    me.genTable_HDDD(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_HDDD: function () {
        var me = this;

        var $VaiTro = "";
        var valVaiTro = "";
        var strNhanSu_Ids = "";
        var strVaiTro_Ids = "";
        var dTyLeThamGias = 0;

        for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
            $VaiTro = "vaitro_" + me.arrNhanSu_Id[i];
            valVaiTro = edu.util.getValById($VaiTro);
            //convert to string seprate by #
            if (i < me.arrNhanSu_Id.length - 1) {
                strNhanSu_Ids += me.arrNhanSu_Id[i] + "#";
                strVaiTro_Ids += valVaiTro + "#";
                dTyLeThamGias += 0 + "#";
            }
            else {
                strNhanSu_Ids += me.arrNhanSu_Id[i];
                strVaiTro_Ids += valVaiTro;
                dTyLeThamGias += 0;
            }
        }

        var obj_save = {
            'action': 'NCKH_SP_HoiDongDaoDuc/ThemMoi',            

            'strId': "",
            'dTyLeThamGia': 0,
            'iSoDaiBieuTrongNuoc': edu.util.getValById("txtHDDD_SoLuongTrongNuoc"),
            'iSoDaiBieuQuocTe': edu.util.getValById("txtHDDD_SoLuongQuocTe"),
            'strDonViToChuc_Id': edu.util.getValById("dropHDDD_DonViToChuc"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropHDDD_LinhVuc_Nganh"),
            'strQuanLyDeTai_Id': "",
            'strThanhVien_Id': strNhanSu_Ids,
            'strVaitro_Id': strVaiTro_Ids,
            'strNamBaoCao': edu.util.getValById("dropHDDD_NamBaoCao"),
            'strTen': edu.util.getValById("txtHDDD_Ten"),
            'iSoTacGia': edu.util.getValById("dropHDXCD_ChuyenNganh"),
            'strPhamVi_Id': edu.util.getValById("dropHDDD_PhamVi"),
            'strNamHoanThanh': edu.util.getValById("dropHDDD_NamBaoCao"),
            'strTenBaoCao': edu.util.getValById("txtHDDD_TenBaoCao"),
            'strFileMinhChung': edu.util.getValById("fileHDDD_FileDinhKem"),
            'strThongTinMinhChung': edu.util.getValById("txtHDDD_NoiDungMinhChung"),
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strMa': "",
            'iTrangThai': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_HDDD();
                }
                else {
                    edu.system.alert("NCKH_SP_HoiDongDaoDuc/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_SP_HoiDongDaoDuc/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HDDD: function () {
        var me = this;

        var $VaiTro = "";
        var valVaiTro = "";
        var strNhanSu_Ids = "";
        var strVaiTro_Ids = "";
        var dTyLeThamGias = 0;

        for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
            $VaiTro = "vaitro_" + me.arrNhanSu_Id[i];
            valVaiTro = edu.util.getValById($VaiTro);
            //convert to string seprate by #
            if (i < me.arrNhanSu_Id.length - 1) {
                strNhanSu_Ids += me.arrNhanSu_Id[i] + "#";
                strVaiTro_Ids += valVaiTro + "#";
                dTyLeThamGias += 0 + "#";
            }
            else {
                strNhanSu_Ids += me.arrNhanSu_Id[i];
                strVaiTro_Ids += valVaiTro;
                dTyLeThamGias += 0;
            }
        }
        var obj_save = {
            'action': 'NCKH_SP_HoiDongDaoDuc/CapNhat',            

            'strId': me.strHDDD_Id,
            'dTyLeThamGia': 0,
            'iSoDaiBieuTrongNuoc': edu.util.getValById("txtHDDD_SoLuongTrongNuoc"),
            'iSoDaiBieuQuocTe': edu.util.getValById("txtHDDD_SoLuongQuocTe"),
            'strDonViToChuc_Id': edu.util.getValById("dropHDDD_DonViToChuc"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropHDDD_LinhVuc_Nganh"),
            'strQuanLyDeTai_Id': "",
            'strThanhVien_Id': strNhanSu_Ids,
            'strVaitro_Id': strVaiTro_Ids,
            'strNamBaoCao': edu.util.getValById("dropHDDD_NamBaoCao"),
            'strTen': edu.util.getValById("txtHDDD_Ten"),
            'iSoTacGia': edu.util.getValById("dropHDXCD_ChuyenNganh"),
            'strPhamVi_Id': edu.util.getValById("dropHDDD_PhamVi"),
            'strNamHoanThanh': edu.util.getValById("dropHDDD_NamBaoCao"),
            'strTenBaoCao': edu.util.getValById("txtHDDD_TenBaoCao"),
            'strFileMinhChung': edu.util.getValById("fileHDDD_FileDinhKem"),
            'strThongTinMinhChung': edu.util.getValById("txtHDDD_NoiDungMinhChung"),
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strMa': "",
            'iTrangThai': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HDDD();
                }
                else {
                    edu.system.alert("NCKH_SP_HoiDongDaoDuc/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_SP_HoiDongDaoDuc/CapNhat  (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HDDD: function (strId) {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_SP_HoiDongDaoDuc/Xoa',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HDDD();
                }
                else {
                    obj = {
                        content: "NCKH_SP_HoiDongDaoDuc/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_SP_HoiDongDaoDuc/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML HoiDongDaoDuc
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HDDD: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHDDD_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHDDD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiDongDaoDuc.getList_HDDD()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            colPos: {
                left: [1],
                fix: [0]
            },
            arrClassName: ["btnView"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.MASANPHAM) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="View"><i class="fa fa-trash color-active"></i></a>';
                        html += '<a class="btn btn-default btn-circle btnEdit" id="edit_' + aData.ID + '" href="#" title="Edit"><i class="fa fa-pencil color-active"></i></a>';
                        html += '<a class="btn btn-default btn-circle " id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getDetail_HDDD: function (strId, strAction) {
        var me = this;

        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtHDDD, "ID", me.editForm_HDDD);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtHDDD, "ID", me.viewForm_HDDD);
                break;
        }
    },
    genTable_ThanhVien_HDDD: function (data, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                me.genTableInput_ThanhVien_HDDD(data);
                break;
            case constant.setting.ACTION.VIEW:
                me.genTableDetail_ThanhVien_HDDD(data);
                break;
        }
    },

    viewForm_HDDD: function (data) {
        var me = this;
        var dtHDDD = data[0];
        edu.util.viewHTMLById("lblHDDD_NguoiNhap", dtHDDD.CANBONHAP_TENDAYDU);
        edu.util.viewHTMLById("lblHDDD_MaSanPham", dtHDDD.MASANPHAM);
        edu.util.viewHTMLById("lblHDDD_TongSoHoiDong", dtHDDD.TONGSOHOIDONGDATHAMGIA);
        edu.util.viewHTMLById("lblHDDD_NamThamGia", dtHDDD.NAMTHAMGIA);
        edu.util.viewHTMLById("lblHDDD_TrangThai", dtHDDD.TRANGTHAI);
        edu.util.viewHTMLById("lblHDDD_MoTa", dtHDDD.MOTA);
        var row = '';
        row += '<tr id="rm_rowDC83A5B3F1B343CEA94406551EC0A81B">';
        row += '<td class="td-center">1</td>';
        row += '<td class="td-center"><img class="table-img" src="http://localhost:46945/Core/images/no-avatar.png"></td>';
        row += '<td class="td-left"><span> ' + dtHDDD.NCKH_DETAI_THANHVIEN_TEN + '</span> - <span>' + dtHDDD.NCKH_DETAI_THANHVIEN_MA +'</span></td>';
        row += '<td>Đồng tác giả</td>';
        row += '</tr> ';
        $("#tblDetail_HDDD_ThanhVien tbody").html(row);
    },
    genTableDetail_ThanhVien_HDDD: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDetail_HDDD_ThanhVienaa",
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
                        var strVaiTro = edu.util.returnEmpty(aData.VAITRO_TEN);
                        return strVaiTro;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    editForm_HDDD: function (data) {
        var me = this;
        var dtHDDD = data[0];
        edu.util.viewValById("txtHDDD_MaSanPham", dtHDDD.MASANPHAM);
        edu.util.viewValById("txtHDDD_TongSoHoiDong", dtHDDD.TONGSOHOIDONGDATHAMGIA);
        edu.util.viewValById("txtHDDD_NamThamGia", dtHDDD.NAMTHAMGIA);
        edu.util.viewValById("txtHDDD_TrangThai", dtHDDD.TRANGTHAI);
        edu.util.viewValById("txtHDDD_MoTa", dtHDDD.MOTA); var row = '';
        row += '<tr id="rm_rowDC83A5B3F1B343CEA94406551EC0A81B">';
        row += '<td class="td-center">1</td>';
        row += '<td class="td-center"><img class="table-img" src="http://localhost:46945/Core/images/no-avatar.png"></td>';
        row += '<td class="td-left"><span> ' + dtHDDD.NCKH_DETAI_THANHVIEN_TEN + '</span> - <span>' + dtHDDD.NCKH_DETAI_THANHVIEN_MA + '</span></td>';
        row += '<td>Đồng tác giả</td>';
        row += '</tr> ';
        $("#tblInput_HDDD_ThanhVien tbody").html(row);
    },
    genTableInput_ThanhVien_HDDD: function (data) {
        var me = this;
        var arrVaiTro_Id = [];
        var jsonForm = {
            strTable_Id: "tblInput_HDDD_ThanhVien",
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
                        //push into me.arrNhanSu_Id
                        me.arrNhanSu_Id.push(aData.ID);
                        return '<a id="delete_HDDD_thanhvien' + aData.ID + '" class="btnDelete poiter"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        //5. create data danhmucvaitro and bind agaist
        var placeRender = "";
        for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
            placeRender = "vaitro_" + me.arrNhanSu_Id[i];
            me.genCombo_VaiTro(placeRender);
            $("#" + placeRender).val(arrVaiTro_Id[i]).trigger("change");
        }
    },
    /*------------------------------------------
    --Discription: [2] AccessDB HDDD_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_HDDD_ThanhVien: function (strAction) {
        var me = this;
        var obj_list = {
            'action': 'NCKH_SP_HoiDongDaoDuc_ThanhVien/LayDanhSach',
            
            'strHoiDongDaoDuc_Id': me.strHDDD_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien_HDDD(dtResult, strAction);
                }
                else {
                    edu.system.alert("NCKH_SP_HoiDongDaoDuc_ThanhVien/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_SP_HoiDongDaoDuc_ThanhVien/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    add_HDDD_ThanhVien: function () {
        var me = this;

        var obj_save = {
            'action': 'NCKH_SP_HoiDongDaoDuc_ThanhVien/ThemMoi',            

            'strHoiDongDaoDuc_Id': me.strHDDD_Id,
            'strThanhVien_Id': "#",
            'strVaiTro_Id': edu.util.getValById("dropHDDD_LinhVuc"),
            'dTyLeThamGia': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("NCKH_SP_HoiDongDaoDuc_ThanhVien/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_SP_HoiDongDaoDuc_ThanhVien/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HDDD_ThanhVien: function (strNhanSu_Id) {
        var me = this;

        var obj = {};
        var obj_delete = {
            'action': 'NCKH_SP_HoiDongDaoDuc_ThanhVien/Xoa',
            
            'strHoiDongDaoDuc_Id': me.strHDDD_Id,
            'strThanhVien_Id': strNhanSu_Id,
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
                    //remove on interface
                    me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
                }
                else {
                    obj = {
                        content: "NCKH_SP_HoiDongDaoDuc_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_SP_HoiDongDaoDuc_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove'>Bỏ chọn</td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDDD_ThanhVien tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_HDDD_ThanhVien tbody").html("");
            $("#tblInput_HDDD_ThanhVien tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    genCombo_NhanSu: function (data) {
        var me = main_doc.HoiDongDaoDuc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: "AVATAR"
            },
            renderPlace: ["dropSearch_HDDD_NhanSu"],
            type: "",
            title: "Tất cả nhân sự"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CoCauToChuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HDDD_CCTC"],
            type: "",
            title: "Tất cả cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.HoiDongDaoDuc;
        me.dtVaiTro = data;
    },
    genCombo_VaiTro: function (place) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    }
};