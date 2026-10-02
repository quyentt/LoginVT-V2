/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DuLieu() { };
DuLieu.prototype = {
    strDuLieu_Id: '',
    dtDuLieu: [],
    init: function () {

        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_DuLieu();
        });
        $(".btnSearch").click(function () {
            me.getList_DuLieu();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DuLieu();
            }
        });
        $("#btnSave").click(function () {
            me.save_DuLieu();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strDuLieu_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_DuLieu();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDuLieu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strDuLieu_Id = strId;
                edu.util.setOne_BgRow(strId, "tblDuLieu");
                me.viewForm_DuLieu(edu.util.objGetOneDataInData(strId, me.dtDuLieu, "ID"));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#dropDonVi").on("select2:select", function () {
            me.getList_HS();
        });

        edu.system.getList_MauImport("zonebtnLVLA");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DuLieu();
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropDoiTuong,dropSearch_DoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropHoatDong");
        me.getList_HeDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_CCTC();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DuLieu");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_DuLieu");
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDuLieu_Id = "";
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropThanhVien", "");
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropDoiTuong", edu.util.getValById("dropSearch_DoiTuong"));
        edu.util.viewValById("txtSoGio", "");
        edu.util.viewValById("txtSoGioChuan", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("txtMoTa", "");
    },

    getList_DuLieu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_DuLieu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strHoatDong_Id': edu.util.getValById('dropSearch_HoatDong'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.dtDuLieu = dtResult;
                    me.genTable_DuLieu(dtResult, iPager);
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
    save_DuLieu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'LVLA_DuLieu/ThemMoi',


            'strId': me.strDuLieu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropThanhVien'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'dSoGio': edu.util.getValById('txtSoGio'),
            'dSoGioChuan': edu.util.getValById('txtSoGioChuan'),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropDoiTuong'),
            'strHoatDong_Id': edu.util.getValById('dropHoatDong'),
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc'),
            'strGhiChu': edu.util.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'LVLA_DuLieu/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert('Thêm mới thành công!');
                    } else {
                        edu.system.alert('Cập nhật thành công!');
                    }
                    me.getList_DuLieu();
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
    delete_DuLieu: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'LVLA_DuLieu/Xoa',

            'strIds': me.strDuLieu_Id,
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
                    me.toggle_notify();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

                me.getList_DuLieu();
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DuLieu: function (data, iPager) {
        var me = this;
        $("#lblDuLieu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuLieu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuLieu.getList_DuLieu()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 8,9,11],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "HOATDONG_TEN"
                },
                {
                    "mDataProp": "HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGAYKETTHUC",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mData": "NGAYKETTHUC",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_NAM) + "_" + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_KY) + "_" + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT);
                    }

                },
                {
                    "mDataProp": "SOGIO"
                },
                {
                    "mDataProp": "SOGIOCHUAN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_DuLieu: function (data) {
        var me = this;
        console.log(data.HEDAOTAO_ID);
        //view data --Edit
        edu.util.viewValById("dropHoatDong", data.HOATDONG_ID);
        edu.util.viewValById("dropHeDaoTao", data.HEDAOTAO_ID);
        edu.util.viewValById("dropDonVi", data.DONVI_ID);
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropDoiTuong", data.PHANLOAIDOITUONG_ID);
        edu.util.viewValById("txtSoGio", data.SOGIO);
        edu.util.viewValById("txtSoGioChuan", data.SOGIOCHUAN);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("txtMoTa", data.GHICHU);
        me.getList_HS(data.NHANSU_HOSOCANBO_ID);
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
                    me.genCombo_HeDaoTao(data.Data);
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
                'pageSize': 100000000
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
                name: "TENHEDAOTAO"
            },
            renderPlace: ["dropHeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
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
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGian","dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
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
            renderPlace: ["dropDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function (strDefaultVal) {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropDonVi"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, strDefaultVal);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data, default_val) {
        if (default_val === undefined) default_val = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                },
                default_val: default_val
            },
            renderPlace: ["dropThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },
};