/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 12/07/2018
--API URL: NH_KeHoachNhapHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoachNhapHoc() { };
KeHoachNhapHoc.prototype = {
    valid_KHNH: [],
    html_KHNH: {},
    input_KHNH: {},
    dtCaNhapHoc: [],
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
		--Discription:[0] Action Common
		--Author: 
		-------------------------------------------*/
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-khnh", "zone_list_khnh");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-khnh", "zone_input_khnh");
        });
        /*------------------------------------------
		--Discription:[1] Action KeHoachNhapHoc
		--Author: 
		-------------------------------------------*/
        $("#tbldata_KHNH").delegate(".btnEditRole_KHNH", "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_KHNH.strId = selected_id;
                me.getDetail_KHNH(selected_id);
                me.getList_ThongTin();
            }
        });
        $("#tbldata_KHNH").delegate(".chkSelectOne_KHNH", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_KHNH);
        });
        $("[id$=chkSelectAll_KHNH]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_KHNH);
        });
        $("#btnDelete_KHNH").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_KHNH);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click",function (e) {
                me.delete_KHNH(selected_id);
            });
            return false;
        });
        $("#btnRefresh_KHNH").click(function () {
            me.getList_KHNH();
        });
        $("#btnRewrite_KHNH").click(function () {
            me.rewrite();
        });
        $("#btnSave_KHNH").click(function () {
            var valid = true;
            if (valid == true) {
                me.save_KHNH();
            }
        });
        $("#btnSearch_KHNH").click(function () {
            me.getList_KHNH();
        });
        $("#txtKeyword_Search_KHNH").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_KHNH();
            }
        });
        $("#dropHeDaoTao_KHNH").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });

        $("#btnThemCa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        });
        $("#tblCaNhapHoc").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCaNhapHoc tr[id='" + strRowId + "']").remove();
        });
        $("#tblCaNhapHoc").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThongTin(strId);
            });
        });;

        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.CA.NHAPHOC", "", "", data => me.dtCaNhapHoc = data);
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-khnh", "zone_list_khnh");
        /*------------------------------------------
		--Discription: config KeHoachNhapHoc
		-------------------------------------------*/
        me.html_KHNH = {
            table_id: "tbldata_KHNH",
            prefix_id: "chkSelect_KHNH",
            regexp: /chkSelect_KHNH/g,
            chkOne: "chkSelectOne_KHNH",
            btn_edit: "btnEditRole_KHNH",
        };
        me.input_KHNH = {
            strTenKeHoach: "txtTenKeHoach_KHNH",
            strMoTa: "",
            strNgayBatDau: "txtNgayBatDau_KHNH",
            strNgayKetThuc: "txtNgayKetThuc_KHNH",
            strDAOTAO_KhoaDaoTao_Id: "dropKhoaDaoTao_KHNH",
            strMoHinhNhapHoc_Id: "dropMoHinhNhapHoc_KHNH",
            strMoHinhApDungPhieuThu_Id: "dropMoHinhApDungPhieuThu_KHNH",
            strTAICHINH_HeThongPhieu_Id: "dropHeThongPhieuThu_KHNH",
            strMoHinhApDungPhieuRut_Id: "dropMoHinhApDungPhieuRut_KHNH",
            strTAICHINH_HeThongRut_Id: "dropHeThongPhieuRut_KHNH",
            strNguoiThucHien_Id: "",
            strId: "",
            strDAOTAO_KhoaDaoTao_Id_Search: "",
            strMoHinhNhapHoc_Id_Search: "",
            strMoHinhApDungPhieuThu_Id_Search: "",
            strTAICHINH_HeThongPhieu_Id_Search: "",
            strMoHinhApDungPhieuRut_Id_Search: "",
            strTAICHINH_HeThongRut_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "txtKeyword_Search_KHNH",
        };
        me.valid_KHNH = [
			{ "MA": me.input_KHNH.strTenKeHoach, "THONGTIN1": "1" },
        ];
        me.getList_KHNH();
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.MOHINH", "dropMoHinhNhapHoc_KHNH", "Chọn mô hình nhập học");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.PHANBOPHIEUTHU", "dropMoHinhApDungPhieuThu_KHNH", "Chọn mô hình áp dụng phiếu thu");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.PHANBOPHIEURUT", "dropMoHinhApDungPhieuRut_KHNH", "Chọn mô hình áp dụng phiếu rút");
        me.getList_HeThongPhieu();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_KHNH.strId = "";
        //
        var arrId = ["txtTenKeHoach_KHNH", "txtNgayBatDau_KHNH", "txtNgayKetThuc_KHNH", "dropKhoaDaoTao_KHNH", "dropMoHinhNhapHoc_KHNH",
                    "dropMoHinhApDungPhieuThu_KHNH", "dropHeThongPhieuThu_KHNH", "dropMoHinhApDungPhieuRut_KHNH", "dropHeThongPhieuRut_KHNH"];
        edu.util.resetValByArrId(arrId);
        $("#tblCaNhapHoc tbody").html("");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB ==> KeHoachNhapHoc
	-------------------------------------------*/
    save_KHNH: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_KeHoachNhapHoc/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_KHNH.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTenKeHoach': edu.util.getValById(me.input_KHNH.strTenKeHoach),
            'strMoTa': edu.util.getValById(me.input_KHNH.strMoTa),
            'strNgayBatDau': edu.util.getValById(me.input_KHNH.strNgayBatDau),
            'strNgayKetThuc': edu.util.getValById(me.input_KHNH.strNgayKetThuc),
            'strDAOTAO_KhoaDaoTao_Id': edu.util.getValById(me.input_KHNH.strDAOTAO_KhoaDaoTao_Id),
            'strMoHinhNhapHoc_Id': edu.util.getValById(me.input_KHNH.strMoHinhNhapHoc_Id),
            'strMoHinhApDungPhieuThu_Id': edu.util.getValById(me.input_KHNH.strMoHinhApDungPhieuThu_Id),
            'strTAICHINH_HeThongPhieu_Id': edu.util.getValById(me.input_KHNH.strTAICHINH_HeThongPhieu_Id),
            'strMoHinhApDungPhieuRut_Id': edu.util.getValById(me.input_KHNH.strMoHinhApDungPhieuRut_Id),
            'strTAICHINH_HeThongRut_Id': edu.util.getValById(me.input_KHNH.strTAICHINH_HeThongRut_Id),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_KeHoachNhapHoc/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    if (!edu.util.checkValue(me.input_KHNH.strId)) {
                        obj_save.strId = data.Id;
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#tblCaNhapHoc tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThongTin(strKetQua_Id, obj_save.strId);
                    });
                    me.getList_KHNH();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KHNH: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc',
            'iM': edu.system.iM,
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strDAOTAO_KhoaDaoTao_Id': "",
            'strMoHinhNhapHoc_Id': "",
            'strMoHinhApDungPhieuThu_Id': "",
            'strTAICHINH_HeThongPhieu_Id': "",
            'strMoHinhApDungPhieuRut_Id': "",
            'strTAICHINH_HeThongRut_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById(me.input_KHNH.strTuKhoa_Search),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_KHNH = data.Data;
                    me.genTable_KHNH(data.Data, data.Pager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_KHNH: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_KeHoachNhapHoc/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_KHNH.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_KHNH = data.Data;
                        me.viewForm_KHNH(data.Data[0]);
                    }
                    else {
                        console.log("Lỗi ");
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            versionAPI: obj_detail.versionAPI,
            contentType: true,
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KHNH: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_KeHoachNhapHoc/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_KHNH);
                    me.getList_KHNH();
                }
                else {
                    var obj = {
                        content: data.Message,
                        code:"w"
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: JSON.stringify(er),
                    code: "w"
                }
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> TC_ThietLapThamSoPhieuThu
	-------------------------------------------*/
    getList_HeThongPhieu: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_HeThongPhieuThu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'iTuKhoa_Number': -1,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNguoiThucHien_Id': "",
            'iTinhTrang': -1,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HeThongPhieu(data.Data);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] GEN HTML ==> KeHoachNhapHoc
	--ULR:  Modules
	-------------------------------------------*/
    genTable_KHNH: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_KHNH.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachNhapHoc.getList_KHNH()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [1, 3, 4, 5, 6],
                center:[0, 2, 8, 7],
                fix: [0, 8, 7]
            },
            aoColumns: [
            {
                "mDataProp": "TENKEHOACH"
            }
            , {
                "mData": "THOIGIAN",
                "mRender": function (nRow, aData) {
                    var strNgayBatDau = aData.NGAYBATDAU;
                    var strNgayKetThuc = aData.NGAYKETTHUC;
                    var strThoiGian = strNgayBatDau + " - " + strNgayKetThuc;
                    return '<span class="color-active">' + strThoiGian + '</span>';
                }
                }
                , {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
            , {
                "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
            }
            , {
                "mDataProp": "MOHINHNHAPHOC_TEN"
            }
            , {
                "mDataProp": "MOHINHAPDUNGPHIEUTHU_TEN"
            }, {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa/xem" class="btn btn-default btn-circle ' + me.html_KHNH.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_KHNH.prefix_id + aData.ID + '" class="' + me.html_KHNH.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KHNH: function (data) {
        var me = this;
        me.showHide_Box("zone-bus-khnh", "zone_input_khnh");
        //view data --Edit
        edu.util.viewValById(me.input_KHNH.strTenKeHoach, data.TENKEHOACH);
        edu.util.viewValById(me.input_KHNH.strMoTa, data.MOTA);
        edu.util.viewValById(me.input_KHNH.strNgayBatDau, data.NGAYBATDAU);
        edu.util.viewValById(me.input_KHNH.strNgayKetThuc, data.NGAYKETTHUC);
        edu.util.viewValById(me.input_KHNH.strDAOTAO_KhoaDaoTao_Id, data.DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById(me.input_KHNH.strMoHinhNhapHoc_Id, data.MOHINHNHAPHOC_ID);
        edu.util.viewValById(me.input_KHNH.strMoHinhApDungPhieuThu_Id, data.MOHINHAPDUNGPHIEUTHU_ID);
        edu.util.viewValById(me.input_KHNH.strTAICHINH_HeThongPhieu_Id, data.TAICHINH_HETHONGPHIEUTHU_ID);
        edu.util.viewValById(me.input_KHNH.strMoHinhApDungPhieuRut_Id, data.MOHINHAPDUNGPHIEURUT_ID);
        edu.util.viewValById(me.input_KHNH.strTAICHINH_HeThongRut_Id, data.TAICHINH_HETHONGPHIEURUT_ID);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropHeDaoTao_KHNH"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [0] GEN HTML ==> KhoaDaoTao
	--ULR:  Modules
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_KDT = {
            strHeDaoTao_Id: edu.util.getValById("dropHeDaoTao_KHNH"),
            strCoSoDaoTao_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 100000
        };
        edu.system.getList_KhoaDaoTao(obj_KDT, "", "", me.genCombo_KhoaDaoTao);
    },
    genCombo_KhoaDaoTao: function (data, pager) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.TENKHOA + " - " + aData.DAOTAO_HEDAOTAO_TEN;
                }
            },
            renderPlace: ["dropKhoaDaoTao_KHNH"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> TC_ThietLapThamSoPhieuThu
	--ULR:  Modules
	-------------------------------------------*/
    genCombo_HeThongPhieu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAUIN_MA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeThongPhieuThu_KHNH", "dropHeThongPhieuRut_KHNH"],
            type: "",
            title: "Chọn phiếu",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
   --Discription: [2] AccessDB DeTai_KetQua
   --ULR:  Modules
   -------------------------------------------*/
    save_ThongTin: function (strKetQua_Id, strTC_KeHoachNhapHoc_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strCaNhapHoc_Id = edu.util.getValById('dropCaNhapHoc' + strKetQua_Id);
        if (!edu.util.checkValue(strCaNhapHoc_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NH_QuayNhapHoc/Them_NhapHoc_KeHoach_CaNhapHoc',
            'type': 'POST',
            'strId': strId,
            'strCaNhapHoc_Id': strCaNhapHoc_Id,
            'strTC_KeHoachNhapHoc_Id': strTC_KeHoachNhapHoc_Id,
            'dCaNhapHocHienTai': edu.util.getValById('dropCaHienTai' + strKetQua_Id),
            'iThuTu': edu.util.getValById('txtThuTu' + strKetQua_Id),
            'strMoTa': edu.util.getValById('txtMoTa' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'NH_QuayNhapHoc/Sua_NhapHoc_KeHoach_CaNhapHoc';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId) {
                        strId = data.Id;
                        edu.system.alert("Cập nhật thành công");
                    } else {

                        edu.system.alert("Thêm mới thành công");
                    }

                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
                me.getList_ThongTin();
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
    getList_ThongTin: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_QuayNhapHoc/LayDSNhapHoc_KeHoach_CaNhapHoc',
            'type': 'GET',
            'strTC_KeHoachNhapHoc_Id': me.input_KHNH.strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThongTin_Data(dtResult);
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
    delete_ThongTin: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NH_QuayNhapHoc/Xoa_NhapHoc_KeHoach_CaNhapHoc',

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
                    me.getList_ThongTin(data.Data);
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genHTML_ThongTin_Data: function (data) {
        var me = this;
        $("#tblCaNhapHoc tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropCaNhapHoc' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
            row += '<td><select id="dropCaHienTai' + strKetQua_Id + '" class="select-opt"><option value="1">Ca đang chạy</option ><option value="0">Ca đã chạy</option ></select ></td>';
            row += '<td><input id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"</td>';
            row += '<td><input id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"</td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblCaNhapHoc tbody").append(row);
            $("#dropCaHienTai" + strKetQua_Id).select2()
            me.genComBo_CaNhapHoc("dropCaNhapHoc" + strKetQua_Id, aData.CANHAPHOC_ID);
            edu.util.viewValById("dropCaHienTai" + strKetQua_Id, aData.CANHAPHOCHIENTAI);
        }
    },
    genHTML_ThongTin: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblCaNhapHoc").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropCaNhapHoc' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        row += '<td><select id="dropCaHienTai' + strKetQua_Id + '" class="select-opt"><option value="1">Ca đang chạy</option ><option value="0">Ca đã chạy</option ></select ></td>';
        row += '<td><input id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"</td>';
        row += '<td><input id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"</td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblCaNhapHoc tbody").append(row);
        $("#dropCaHienTai" + strKetQua_Id).select2()
        me.genComBo_CaNhapHoc("dropCaNhapHoc" + strKetQua_Id, aData.KIEUHOC_ID);
    },
    genComBo_CaNhapHoc: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCaNhapHoc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn ca nhập học"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
}