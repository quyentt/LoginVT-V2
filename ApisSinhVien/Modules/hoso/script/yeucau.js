/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function YeuCau() { };
YeuCau.prototype = {
    strYeuCau_Id: '',
    strLoaiYeuCau_Id: '',
    dtYeuCau: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_YeuCau();
        edu.system.loadToCombo_DanhMucDuLieu("DVMC.YEUCAU", "dropSearch_YeuCau,dropYeuCau");
        $("#tblYeuCau").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_YeuCau(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_YeuCau").click(function () {
            me.save_YeuCau();
        });
        $("#btnXoaYeuCau").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblYeuCau", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_YeuCau(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_YeuCau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_YeuCau();
            }
        });
        edu.system.uploadAvatar(['uploadPicture_HS'], "");
        $('#dropSearch_YeuCau').on('select2:select', function (e) {
            me.getList_LoaiYeuCau();
            me.getList_YeuCau();
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strYeuCau_Id = "";
        edu.util.viewValById("dropYeuCau", edu.util.getValById("dropSearch_YeuCau"));
        //edu.util.viewValById("txtDong", "");
        //edu.util.viewValById("txtKichThuoc", "");
        //edu.util.viewValById("txtCanLe", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtNoiDung", "");
        edu.util.viewHTMLById("txtNoiDung", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_LoaiYeuCau: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/DSA4FRUFFwwCHhgkNAI0HgwuFSAP',
            'func': 'pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa',
            'iM': edu.system.iM,
            'strYeuCau_Id': edu.util.getValById('dropSearch_YeuCau'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    let aData = {};
                    if (data.length) aData = data[0];
                    me.viewForm_LoaiYeuCau(aData);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_LoaiYeuCau: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/FSkkLB4FFwwCHhgkNAI0HgwuFSAP',
            'func': 'pkg_dvmc_thongtin.Them_DVMC_YeuCu_MoTa',
            'iM': edu.system.iM,
            'strYeuCau_Id': edu.util.getValById('dropSearch_YeuCau'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strTieuDe': edu.util.getValById('txtTieuDe'),
            'strHinhAnhMinhHoa': edu.util.getValById('uploadPicture_HS'),
            'strDiaChiTraYeuCau': edu.util.getValById('txtDiaChiTraVe'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
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
                    me.getList_LoaiYeuCau();
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
    viewForm_LoaiYeuCau: function (data) {
        var me = this;

        edu.util.viewValById("txtTieuDe", data.TIEUDE);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtDiaChiTraVe", data.DIACHITRAYEUCAU);
        edu.util.viewValById("uploadPicture_HS", data.HINHANHMINHHOA);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.HINHANHMINHHOA), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        me.strLoaiYeuCau_Id = data.ID;
    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_YeuCau: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/FSkkLB4FFwwCHgIgNBUzNCIeGCQ0AiA0',
            'func': 'pkg_dvmc_thongtin.Them_DVMC_CauTruc_YeuCau',
            'iM': edu.system.iM,
            'strId': me.strYeuCau_Id,
            'strYeuCau_Id': edu.util.getValById('dropYeuCau'),
            'strNoiDung': edu.util.getValById('txtNoiDung'),
            'dDongThu': edu.util.getValById('txtDong') ? edu.util.getValById('txtDong'): -1,
            'dKichThuocDong': edu.util.getValById('txtKichThuoc') ? edu.util.getValById('txtKichThuoc') : -1,
            'strCanLe': edu.util.getValById('txtCanLe'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_DVMC_ThongTin_MH/EjQgHgUXDAIeAiA0FTM0Ih4YJDQCIDQP';
            obj_save.func = 'pkg_dvmc_thongtin.Sua_DVMC_CauTruc_YeuCau'
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
                    me.getList_YeuCau();
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
    getList_YeuCau: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/DSA4BRIFFwwCHgIgNBUzNCIeGCQ0AiA0',
            'func': 'pkg_dvmc_thongtin.LayDSDVMC_CauTruc_YeuCau',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strYeuCau_Id': edu.util.getValById('dropSearch_YeuCau'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtYeuCau = dtReRult;
                    me.genTable_YeuCau(dtReRult, data.Pager);
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
    delete_YeuCau: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/GS4gHgUXDAIeAiA0FTM0Ih4YJDQCIDQP',
            'func': 'pkg_dvmc_thongtin.Xoa_DVMC_CauTruc_YeuCau',
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
                    me.getList_YeuCau();
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
    genTable_YeuCau: function (data, iPager) {
        $("#lblYeuCau_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblYeuCau",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.YeuCau.getList_YeuCau()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3,7,8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "YEUCAU_TEN"
                },
                {
                    "mDataProp": "DONGTHU"
                },
                {
                    "mDataProp": "KICHTHUOCDONG"
                },
                {
                    "mDataProp": "CANLE"
                },
                {
                    //"mDataProp": "HIEULUC",
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC == 0 ? "Không": "Có";
                    }
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
    viewForm_YeuCau: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtYeuCau.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        //edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        //edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA));
        
        edu.util.viewValById("dropYeuCau", data.YEUCAU_ID);
        edu.util.viewValById("txtNoiDung", data.NOIDUNG);
        edu.util.viewValById("txtDong", data.HINHTHUCTHU_ID);
        edu.util.viewValById("txtKichThuoc", data.KICHTHUOCDONG);
        edu.util.viewValById("txtCanLe", data.CANLE);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewHTMLById("txtNoiDung", data.NOIDUNG);
        me.strYeuCau_Id = data.ID;
    },
}