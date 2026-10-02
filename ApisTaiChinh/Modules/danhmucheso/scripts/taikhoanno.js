/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TaiKhoanNo() { };
TaiKhoanNo.prototype = {
    strTaiKhoanNo_Id: '',
    dtTaiKhoanNo: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_TaiKhoanNo();
        me.getList_DoiTac();
        me.getList_KhoanThu();
        //me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropSearch_HinhThuc,dropHinhThuc");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblTaiKhoanNo").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TaiKhoanNo(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_TaiKhoanNo").click(function () {
            me.save_TaiKhoanNo();
        });
        $("#btnXoaTaiKhoanNo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTaiKhoanNo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TaiKhoanNo(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_TaiKhoanNo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TaiKhoanNo();
            }
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strTaiKhoanNo_Id = "";
        edu.util.viewValById("dropKhoanThu", edu.util.getValById("dropSearch_KhoanThu"));
        edu.util.viewValById("dropDoiTac", edu.util.getValById("dropSearch_DoiTac"));
        edu.util.viewValById("dropHinhThuc", edu.util.getValById("dropSearch_HinhThuc"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtTKNo", "");
        edu.util.viewValById("txtTKCo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoanThu: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNhomCacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strcanboquanly_id': edu.util.getValById('txtAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KhoanThu(data);
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
    genCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KhoanThu", "dropKhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DoiTac: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_KeToan_MH/DSA4BQw0IgARCB4FLigVICIP',
            'func': 'pkg_taichinh_ketoan.LayDMucAPI_DoiTac',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_DoiTac(data);
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
    genCombo_DoiTac: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDOITAC",
            },
            renderPlace: ["dropSearch_DoiTac", "dropDoiTac"],
            title: "Chọn đối tác"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TaiKhoanNo: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/FSkkLB4AEQgeCiQVLiAvHgopLiAvHgkV',
            'func': 'pkg_taichinh_ketoan.Them_API_KeToan_Khoan_HT',
            'iM': edu.system.iM,
            'strId': me.strTaiKhoanNo_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropHinhThuc'),
            'strKeToan_TKNo': edu.util.getValById('txtTKNo'),
            'strKeToan_TKCo': edu.util.getValById('txtTKCo'),
            'strAPI_DoiTac_Id': edu.util.getValById('dropDoiTac'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
            obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TaiKhoanNo();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TaiKhoanNo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/DSA4BRIAEQgeCiQVLiAvHgopLiAvHgkV',
            'func': 'pkg_taichinh_ketoan.LayDSAPI_KeToan_Khoan_HT',
            'iM': edu.system.iM,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_DoiTac'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThuc'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTaiKhoanNo = dtReRult;
                    me.genTable_TaiKhoanNo(dtReRult, data.Pager);
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
    delete_TaiKhoanNo: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/GS4gHgARCB4KJBUuIC8eCikuIC8eCRUP',
            'func': 'pkg_taichinh_ketoan.Xoa_API_KeToan_Khoan_HT',
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
                    me.getList_TaiKhoanNo();
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
    genTable_TaiKhoanNo: function (data, iPager) {
        $("#lblTaiKhoanNo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTaiKhoanNo",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TaiKhoanNo.getList_TaiKhoanNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3,7,8],
                //right: [5]
            },
            aoColumns: [

                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + " - " + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HINHTHUCTHU_TEN) + " - " + edu.util.returnEmpty(aData.HINHTHUCTHU_MA);
                    }
                },
                {
                    "mDataProp": "API_DOITAC_TEN"
                },
                {
                    "mDataProp": "KETOAN_TAIKHOANNO"
                },
                {
                    "mDataProp": "KETOAN_TAIKHOANCO"
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
    viewForm_TaiKhoanNo: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtTaiKhoanNo.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        //edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        //edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA));
        
        edu.util.viewValById("dropKhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDoiTac", data.API_DOITAC_ID);
        edu.util.viewValById("dropHinhThuc", data.HINHTHUCTHU_ID);
        edu.util.viewValById("txtTKNo", data.KETOAN_TAIKHOANNO);
        edu.util.viewValById("txtTKCo", data.KETOAN_TAIKHOANCO);
        me.strTaiKhoanNo_Id = data.ID;
    },
}