/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function ThongTin() { };
ThongTin.prototype = {
    strThongTin_Id: '',
    strNguoiDung_Id: '',
    strHoatDong_Id: '',
    dtQuyetDinh: [],
    dtTuNhapHoSo: [],
    init: function () {
        var me = this;
        me.strNguoiDung_Id = edu.system.userId;
        $("#btnSearch").click(function (e) {
            me.getList_ThongTin();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ThongTin();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_ThongTin").click(function (e) {
            me.save_ThongTin();
        });
        $("[id$=chkSelectAll_ThongTin]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThongTin" });
        });
        $("#btnDelete_ThongTin").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_ThongTin(me.strThongTin_Id);
            });
        });
        $("#tblThongTin").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblThongTin");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtThongTin, "ID")[0];
                me.viewEdit_ThongTin(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
            var strId = this.id;
            me.strHoatDong_Id = strId;
            me.getList_ThongTin();
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnAddQuyetDinh").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        });
        $("#tblQuyetDinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblQuyetDinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblQuyetDinh").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_QuyetDinh(strId);
            });
        });

        edu.system.loadToCombo_DanhMucDuLieu("NS.QUDI", "", "", function (data) {
            me.dtQuyetDinh = data;
        });
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropChucVu,dropChucVuMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMHV", "dropBangCap,dropBangCapMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOCD", "dropChucDanh,dropChucDanhMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDCT", "dropChinhTri,dropChinhTriMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDTH", "dropTinHoc,dropTinHocMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDNN", "dropNgoaiNgu,dropNgoaiNguMoi");
        me.getList_ThongTin();
        me.getList_CoCauToChuc();
        me.getList_DM_HoatDong();
    },

    rewrite: function () {
        //reset id
        var me = this;
        edu.util.viewValById("dropHoatDong", "");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("txtNoiDung", "");

        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("txtDonViKhac", "");
        edu.util.viewValById("dropDonViMoi", "");
        edu.util.viewValById("txtDonViKhacMoi", "");
        edu.util.viewValById("txtDonVi_GhiChu", "");

        edu.util.viewValById("dropChucVu", "");
        edu.util.viewValById("txtChucVuKhac", "");
        edu.util.viewValById("dropChucVuMoi", "");
        edu.util.viewValById("txtChucVuKhacMoi", "");
        edu.util.viewValById("txtChuVu_GhiChu", "");

        edu.util.viewValById("dropBangCap", "");
        edu.util.viewValById("txtBangCapKhac", "");
        edu.util.viewValById("dropBangCapMoi", "");
        edu.util.viewValById("txtBangCapKhacMoi", "");
        edu.util.viewValById("txtBangCap_GhiChu", "");

        edu.util.viewValById("dropChucDanh", "");
        edu.util.viewValById("txtChucDanhKhac", "");
        edu.util.viewValById("dropChucDanhMoi", "");
        edu.util.viewValById("txtChucDanhKhacMoi", "");
        edu.util.viewValById("txtChucDanh_GhiChu", "");

        edu.util.viewValById("dropChinhTri", "");
        edu.util.viewValById("txtChinhTriKhac", "");
        edu.util.viewValById("dropChinhTriMoi", "");
        edu.util.viewValById("txtChinhTriKhacMoi", "");
        edu.util.viewValById("txtChinhTri_GhiChu", "");

        edu.util.viewValById("dropTinHoc", "");
        edu.util.viewValById("txtTinHocKhac", "");
        edu.util.viewValById("dropTinHocMoi", "");
        edu.util.viewValById("txtTinHocKhacKhacMoi", "");
        edu.util.viewValById("txtTinHoc_GhiChu", "");

        edu.util.viewValById("dropNgoaiNgu", "");
        edu.util.viewValById("txtNgoaiNguKhac", "");
        edu.util.viewValById("dropNgoaiNguMoi", "");
        edu.util.viewValById("txtNgoaiNguKhacMoi", "");
        edu.util.viewValById("txtNgoaiNgu_GhiChu", "");

        $("#tblQuyetDinh tbody").html("");
        for (var i = 1; i < 2; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        }
        me.getList_TuNhapHoSo();
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },


    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThongTin: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoatDong_ThongTin/LayDanhSach',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strHoatDongNhanSu_Id': me.strHoatDong_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThongTin = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_ThongTin: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoatDong_ThongTin/ThemMoi',

            'strId': me.strThongTin_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strHoatDongNhanSu_Id': edu.util.getValById('dropHoatDong'),
            'strMoTa': edu.util.getValById('txtNoiDung'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strDonVi_CCTC_HienTai_Id': edu.util.getValById('dropDonVi'),
            'strDonVi_CCTC_HienTai': edu.util.getValById('txtDonViKhac'),
            'strDonVi_CCTC_BienDong_Id': edu.util.getValById('dropDonViMoi'),
            'strDonVi_CCTC_BienDong': edu.util.getValById('txtDonViKhacMoi'),
            'strDonVi_CCTC_BienDong_MoTa': edu.util.getValById('txtDonVi_GhiChu'),
            'strChucVu_HienTai_Id': edu.util.getValById('dropChucVu'),
            'strChucVu_HienTai': edu.util.getValById('txtChucVuKhac'),
            'strChucVu_BienDong_Id': edu.util.getValById('dropChucVuMoi'),
            'strChucVu_BienDong': edu.util.getValById('txtChucVuKhacMoi'),
            'strChucVu_BienDong_MoTa': edu.util.getValById('txtChuVu_GhiChu'),
            'strBangCap_HienTai_Id': edu.util.getValById('dropBangCap'),
            'strBangCap_HienTai': edu.util.getValById('txtBangCapKhac'),
            'strBangCap_BienDong_Id': edu.util.getValById('dropBangCapMoi'),
            'strBangCap_BienDong': edu.util.getValById('txtBangCapKhacMoi'),
            'strBangCap_BienDong_MoTa': edu.util.getValById('txtBangCap_GhiChu'),
            'strChucDanh_HienTai_Id': edu.util.getValById('dropChucDanh'),
            'strChucDanh_HienTai': edu.util.getValById('txtChucDanhKhac'),
            'strChucDanh_BienDong_Id': edu.util.getValById('dropChucDanhMoi'),
            'strChucDanh_BienDong': edu.util.getValById('txtChucDanhKhacMoi'),
            'strChucDanh_BienDong_MoTa': edu.util.getValById('txtChucDanh_GhiChu'),
            'strTrinhDoCT_HienTai_Id': edu.util.getValById('dropChinhTri'),
            'strTrinhDoCT_HienTai': edu.util.getValById('txtChinhTriKhac'),
            'strTrinhDoCT_BienDong_Id': edu.util.getValById('dropChinhTriMoi'),
            'strTrinhDoCT_BienDong': edu.util.getValById('txtChinhTriKhacMoi'),
            'strTrinhDoCT_BienDong_MoTa': edu.util.getValById('txtChinhTri_GhiChu'),
            'strTrinhDoTH_HienTai_Id': edu.util.getValById('dropTinHoc'),
            'strTrinhDoTH_HienTai': edu.util.getValById('txtTinHocKhac'),
            'strTrinhDoTH_BienDong_Id': edu.util.getValById('dropTinHocMoi'),
            'strTrinhDoTH_BienDong': edu.util.getValById('txtTinHocKhacKhacMoi'),
            'strTrinhDoTH_BienDong_MoTa': edu.util.getValById('txtTinHoc_GhiChu'),
            'strTrinhDoNN_HienTai_Id': edu.util.getValById('dropNgoaiNgu'),
            'strTrinhDoNN_HienTai': edu.util.getValById('txtNgoaiNguKhac'),
            'strTrinhDoNN_BienDong_Id': edu.util.getValById('dropNgoaiNguMoi'),
            'strTrinhDoNN_BienDong': edu.util.getValById('txtNgoaiNguKhacMoi'),
            'strTrinhDoNN_BienDong_MoTa': edu.util.getValById('txtNgoaiNgu_GhiChu'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strThongTinQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNguoiKy': edu.util.getValById('txtAAAA'),
            'strSoQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayHieuLuc': edu.util.getValById('txtAAAA'),
            'strNgayApDung': edu.util.getValById('txtAAAA'),
            'strNgayHetHieuLuc': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'NS_HoatDong_ThongTin/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThongTin_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strThongTin_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strThongTin_Id = obj_save.strId;
                    }
                    $("#tblQuyetDinh tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_QuyetDinh(strKetQua_Id, strThongTin_Id);
                    });
                    for (var i = 0; i < me.dtTuNhapHoSo.length; i++) {
                        me.save_TuNhapHoSo(me.dtTuNhapHoSo[i]);
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_ThongTin();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThongTin/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThongTin: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_HoatDong_ThongTin/Xoa',


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
                    me.getList_ThongTin();
                }
                else {
                    obj = {
                        content: "NS_HoatDong_ThongTin/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ThongTin: function (data, iPager) {
        var me = this;
        $("#lblThongTin_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThongTin",

            bPaginate: {
                strFuntionName: "main_doc.ThongTin.getList_ThongTin()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "HOATDONGNHANSU_TEN",
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "DONVI_CCTC_HIENTAI_TEN"
                },
                {
                    "mDataProp": "DONVI_CCTC_BIENDONG_TEN"
                },
                {
                    "mDataProp": "CHUCVU_HIENTAI_TEN"
                },
                {
                    "mDataProp": "CHUCVU_BIENDONG_TEN"
                },
                {
                    "mDataProp": "BANGCAP_HIENTAI_TEN"
                },
                {
                    "mDataProp": "BANGCAP_BIENDONG_TEN"
                },
                {
                    "mDataProp": "CHUCDANH_HIENTAI_TEN"
                },
                {
                    "mDataProp": "CHUCDANH_BIENDONG_TEN"
                },
                {
                    "mDataProp": "TRINHDOCHINHTRI_HIENTAI_TEN"
                },
                {
                    "mDataProp": "TRINHDOCHINHTRI_BIENDONG_TEN"
                },
                {
                    "mDataProp": "TRINHDOTINHOC_HIENTAI_TEN"
                },
                {
                    "mDataProp": "TRINHDOTINHOC_BIENDONG_TEN"
                },
                {
                    "mDataProp": "TRINHDONGOAINGU_HIENTAI_TEN"
                },
                {
                    "mDataProp": "TRINHDONGOAINGU_BIENDONG_TEN"
                },
                {
                    "mDataProp": "DSSOQUYETDINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_ThongTin: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropHoatDong", data.HOATDONGNHANSU_ID);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        edu.util.viewValById("txtNoiDung", data.MOTA);

        edu.util.viewValById("dropDonVi", data.DONVI_CCTC_HIENTAI_ID);
        edu.util.viewValById("txtDonViKhac", data.DONVI_CCTC_HIENTAI);
        edu.util.viewValById("dropDonViMoi", data.DONVI_CCTC_BIENDONG_ID);
        edu.util.viewValById("txtDonViKhacMoi", data.DONVI_CCTC_BIENDONG);
        edu.util.viewValById("txtDonVi_GhiChu", data.DONVI_CCTC_BIENDONG_MOTA);

        edu.util.viewValById("dropChucVu", data.CHUCVU_HIENTAI_ID);
        edu.util.viewValById("txtChucVuKhac", data.CHUCVU_HIENTAI);
        edu.util.viewValById("dropChucVuMoi", data.CHUCVU_BIENDONG_ID);
        edu.util.viewValById("txtChucVuKhacMoi", data.CHUCVU_BIENDONG);
        edu.util.viewValById("txtChuVu_GhiChu", data.CHUCVU_BIENDONG_MOTA);

        edu.util.viewValById("dropBangCap", data.BANGCAP_HIENTAI_ID);
        edu.util.viewValById("txtBangCapKhac", data.BANGCAP_HIENTAI);
        edu.util.viewValById("dropBangCapMoi", data.BANGCAP_BIENDONG_ID);
        edu.util.viewValById("txtBangCapKhacMoi", data.BANGCAP_BIENDONG);
        edu.util.viewValById("txtBangCap_GhiChu", data.BANGCAP_BIENDONG_MOTA);

        edu.util.viewValById("dropChucDanh", data.CHUCDANH_HIENTAI_ID);
        edu.util.viewValById("txtChucDanhKhac", data.CHUCDANH_HIENTAI);
        edu.util.viewValById("dropChucDanhMoi", data.CHUCDANH_BIENDONG_ID);
        edu.util.viewValById("txtChucDanhKhacMoi", data.CHUCDANH_BIENDONG);
        edu.util.viewValById("txtChucDanh_GhiChu", data.CHUCDANH_BIENDONG_MOTA);

        edu.util.viewValById("dropChinhTri", data.TRINHDOCHINHTRI_HIENTAI_ID);
        edu.util.viewValById("txtChinhTriKhac", data.TRINHDOCHINHTRI_HIENTAI);
        edu.util.viewValById("dropChinhTriMoi", data.TRINHDOCHINHTRI_BIENDONG_ID);
        edu.util.viewValById("txtChinhTriKhacMoi", data.TRINHDOCHINHTRI_BIENDONG);
        edu.util.viewValById("txtChinhTri_GhiChu", data.TRINHDOCHINHTRI_BIENDONG_MOTA);

        edu.util.viewValById("dropTinHoc", data.TRINHDOTINHOC_HIENTAI_ID);
        edu.util.viewValById("txtTinHocKhac", data.TRINHDOTINHOC_HIENTAI);
        edu.util.viewValById("dropTinHocMoi", data.TRINHDOTINHOC_BIENDONG_ID);
        edu.util.viewValById("txtTinHocKhacKhacMoi", data.TRINHDOTINHOC_BIENDONG);
        edu.util.viewValById("txtTinHoc_GhiChu", data.TRINHDOTINHOC_BIENDONG_MOTA);

        edu.util.viewValById("dropNgoaiNgu", data.TRINHDONGOAINGU_HIENTAI_ID);
        edu.util.viewValById("txtNgoaiNguKhac", data.TRINHDONGOAINGU_HIENTAI);
        edu.util.viewValById("dropNgoaiNguMoi", data.TRINHDONGOAINGU_BIENDONG_ID);
        edu.util.viewValById("txtNgoaiNguKhacMoi", data.TRINHDONGOAINGU_BIENDONG);
        edu.util.viewValById("txtNgoaiNgu_GhiChu", data.TRINHDONGOAINGU_BIENDONG_MOTA);
        me.strThongTin_Id = data.ID;
        me.getList_QuyetDinh();
        me.getList_TuNhapHoSo();
    },
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
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
            renderPlace: ["dropDonVi", "dropDonViMoi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoatDong_ThongTin/LayDanhSach',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strHoatDongNhanSu_Id': me.strHoatDong_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThongTin = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyetDinh: function (strQuyetDinh_Id, strThongTin_Id) {
        var me = this;
        var strId = strQuyetDinh_Id;
        var strSoQuyetDinh = edu.util.getValById('txtSoQuyetDinh' + strQuyetDinh_Id);
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
            'strNgayApDung': edu.util.getValById('txtNgayApDung' + strQuyetDinh_Id),
            'strNguonDuLieu_Id': strThongTin_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strSoQuyetDinh': edu.util.getValById('txtSoQuyetDinh' + strQuyetDinh_Id),
            'strNgayQuyetDinh': edu.util.getValById('txtNgayQuyetDinh' + strQuyetDinh_Id),
            'strNguoiKyQuyetDinh': edu.util.getValById('txtNguoiKy' + strQuyetDinh_Id),
            'strNgayHieuLuc': edu.util.getValById('txtNgayHieuLuc' + strQuyetDinh_Id),
            'strThongTinQuyetDinh': edu.util.getValById('txtThongTin' + strQuyetDinh_Id),
            'strThongTinDinhKem': edu.util.getValById('txtAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropLoaiQuyetDinh' + strQuyetDinh_Id),
            'strNgayHetHieuLuc': edu.util.getValById('txtNgayHetHieuLuc' + strQuyetDinh_Id),
            'strNguoiThucHien_Id': edu.system.userId,
            'iTrangThai': 1,
            'iThuTu': 1,
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
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strQuyetDinh_Id, strId, "NS_Files");
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
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguonDuLieu_Id': me.strThongTin_Id,
            'iTrangThai': -1,
            'strNgayHieuLuc_Tu': edu.util.getValById('txtAAAA'),
            'strNgayHieuLuc_Den': edu.util.getValById('txtAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strThanhVien_Id': edu.util.getValById('dropAAAA'),
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
        var obj = {};
        var obj_delete = {
            'action': 'NS_ThongTinQuyetDinh/Xoa',

            'strId': strIds,
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
                    me.getList_DeTai_KetQua();
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
        $("#tblQuyetDinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropLoaiQuyetDinh' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><input type="text" id="txtSoQuyetDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgayQuyetDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYQUYETDINH) + '" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtNgayHieuLuc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYHIEULUC) + '" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtNgayApDung' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYAPDUNG) + '" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtNgayHetHieuLuc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYHETHIEULUC) + '" class="form-control input-datepicker"/></td>';
            row += '<td><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblQuyetDinh tbody").append(row);
            edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
            me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strKetQua_Id, aData.LOAIQUYETDINH_ID);

            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "NS_Files");
        }
        edu.system.pickerdate();
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyetDinh(id, "");
        }
    },
    genHTML_QuyetDinh: function (strKetQua_Id) {
        var me = this;
        var i = document.getElementById("tblQuyetDinh").getElementsByTagName('tbody')[0].rows.length;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
        row += '<td><select id="dropLoaiQuyetDinh' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><input type="text" id="txtSoQuyetDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOQUYETDINH) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgayQuyetDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYQUYETDINH) + '" class="form-control input-datepicker"/></td>';
        row += '<td><input type="text" id="txtNgayHieuLuc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYHIEULUC) + '" class="form-control input-datepicker"/></td>';
        row += '<td><input type="text" id="txtNgayApDung' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYAPDUNG) + '" class="form-control input-datepicker"/></td>';
        row += '<td><input type="text" id="txtNgayHetHieuLuc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAYHETHIEULUC) + '" class="form-control input-datepicker"/></td>';
        row += '<td><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
        row += '</tr>';
        $("#tblQuyetDinh tbody").append(row);
        edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
        me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strKetQua_Id, aData.LOAIQUYETDINH_ID);
        edu.system.pickerdate();
    },
    cbGetList_TTDT: function (data) {
        main_doc.DeTai.dtTinhTrang = data;
    },
    genComBo_LoaiQuyetDinh: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyetDinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn loại quyết định"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DM_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoatDong_ThongTin/LayDM_NhanSu_HoatDong',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_DM_HoatDong(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_DM_HoatDong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropHoatDong"],
            type: "",
            title: "Chọn hoạt động"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<li class="tabhoatdong" id="' + aData.ID +'">';
            html += '<a href="#tab_' + (nRow + 2) + '" data-toggle="tab" aria-expanded="false">';
            html += '<span class="lang" key="">' + (nRow + 2) + ') ' + aData.TEN +'</span>';
            html += '</a>';
            html += '</li>';
        });
        $("#zoneTab").append(html);
    },


    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TuNhapHoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoatDong_DuLieu/ThemMoi',
            'type': 'POST',
            'strId': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strHoatDongNhanSu_Id': me.strHoatDong_Id,
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': $("#m" + aData.ID).val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HoatDong_DuLieu/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_TuNhapHoSo();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TuNhapHoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoatDong_DuLieu/LayDanhSach',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNguoiDung_Id,
            'strHoatDongNhanSu_Id': me.strHoatDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuNhapHoSo = dtReRult;
                    me.genTable_TuNhapHoSo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_TuNhapHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HoatDong_DuLieu/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TuNhapHoSo();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TuNhapHoSo: function (data, iPager) {
        var me = this;
        $("#lblTuNhapHoSo_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblTuNhapHoSo",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }]
        };
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                if (aData.KIEUDULIEU) {
                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "TEXT": return '<input id="m' + aData.ID + '" class="form-control" value="' + me.getGiaTri(aData) + '" />';
                        case "LIST": return '<select id="m' + aData.ID + '" class="select-opt"></select>';
                        case "FILE": return '<div id="m' + aData.ID + '"></div>';
                        //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                    }
                }
            }
        });
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID);
                            $("#m" + aData.ID).select2();
                        }
                    }; break;
                    case "FILE": edu.system.uploadFiles(["m" + aData.ID]); break;
                }
            }
        });
        setTimeout(function () {
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID, "m" + aData.ID, "NS_Files"); break;
                    }
                }
            });
        }, 1000);
        /*III. Callback*/
    },
    getGiaTri: function (aData) {
        var me = this;
        if (me.bcheck) return edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI);
        return edu.util.returnEmpty(aData.THONGTINXACMINH);
    }
}