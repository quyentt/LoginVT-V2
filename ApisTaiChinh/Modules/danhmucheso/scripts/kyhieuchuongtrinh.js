/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KyHieuChuongTrinh() { };
KyHieuChuongTrinh.prototype = {
    strKyHieuChuongTrinh_Id: '',
    dtKyHieuChuongTrinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KyHieuChuongTrinh();
        edu.extend.genBoLoc_HeKhoa("_SR");
        edu.extend.genBoLoc_HeKhoa("_Add");
        //me.getList_ThoiGianDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "dropSearch_MoHinhHoc,dropMoHinhHoc");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblKyHieuChuongTrinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KyHieuChuongTrinh(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KyHieuChuongTrinh").click(function () {
            me.save_KyHieuChuongTrinh();
        });
        $("#btnXoaKyHieuChuongTrinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKyHieuChuongTrinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KyHieuChuongTrinh(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KyHieuChuongTrinh();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KyHieuChuongTrinh();
            }
        });
        $('#dropHeDaoTao_SR').on('select2:select', function (e) {
            $('#dropHeDaoTao_Add').val($('#dropHeDaoTao_SR').val()).trigger("change").trigger({ type: 'select2:select' });;
        });
        $('#dropKhoaDaoTao_SR').on('select2:select', function (e) {
            $('#dropKhoaDaoTao_Add').val($('#dropKhoaDaoTao_SR').val()).trigger("change").trigger({ type: 'select2:select' });;
        });
        $('#dropChuongTrinh_SR').on('select2:select', function (e) {
            $('#dropChuongTrinh_Add').val($('#dropChuongTrinh_SR').val()).trigger("change").trigger({ type: 'select2:select' });;
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKyHieuChuongTrinh_Id = "";
        //edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        //edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        //edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtKyHieu", "");
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
                    edu.system.alert(data.Message, "w");
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
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KyHieuChuongTrinh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/FSkkLB4VAh4DAh4KOAkoJDQeCikuIB4PJiAvKQPP',
            'func': 'pkg_taichinh_ketoan.Them_TC_BC_KyHieu_Khoa_Nganh',
            'iM': edu.system.iM,
            'strId': me.strKyHieuChuongTrinh_Id,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_Add'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_Add'),
            'strKyHieu': edu.util.getValById('txtKyHieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeToan_MH/EjQgHhUCHgMCHgo4CSgkNB4KKS4gHg8mIC8p';
            obj_save.func = 'pkg_taichinh_ketoan.Sua_TC_BC_KyHieu_Khoa_Nganh'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_KyHieuChuongTrinh();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KyHieuChuongTrinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/DSA4BRIVAh4DAh4KOAkoJDQeCikuIB4PJiAvKQPP',
            'func': 'pkg_taichinh_ketoan.LayDSTC_BC_KyHieu_Khoa_Nganh',
            'iM': edu.system.iM,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_SR'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_SR'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKyHieuChuongTrinh = dtReRult;
                    me.genTable_KyHieuChuongTrinh(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KyHieuChuongTrinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/GS4gHhUCHgMCHgo4CSgkNB4KKS4gHg8mIC8p',
            'func': 'pkg_taichinh_ketoan.Xoa_TC_BC_KyHieu_Khoa_Nganh',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content:  JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KyHieuChuongTrinh();
                });
            },
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KyHieuChuongTrinh: function (data, iPager) {
        $("#lblKyHieuChuongTrinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKyHieuChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KyHieuChuongTrinh.getList_KyHieuChuongTrinh()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3,7,8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_MAKHOA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA);
                    }
                },
                {
                    "mDataProp": "KYHIEU"
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
        /*III. Callback*/
    },
    viewForm_KyHieuChuongTrinh: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtKyHieuChuongTrinh.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(data.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_CHUONGTRINH_MA));
        
        edu.util.viewValById("txtKyHieu", data.KYHIEU);
        me.strKyHieuChuongTrinh_Id = data.ID;
    },
}