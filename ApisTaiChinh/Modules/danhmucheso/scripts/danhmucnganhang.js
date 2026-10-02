/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DanhMucNganHang() { };
DanhMucNganHang.prototype = {
    strDanhMucNganHang_Id: '',
    dtDanhMucNganHang: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DanhMucNganHang();
        //edu.system.loadToCombo_DanhMucDuLieu("VNPAY.NGANHANG", "", "", data => me.genTable_DanhMucNganHang(data));
        $("#tblDanhMucNganHang").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_DanhMucNganHang(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_DanhMucNganHang").click(function () {
            me.save_DanhMucNganHang();
        });
        $("#btnXoaDanhMucNganHang").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucNganHang", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DanhMucNganHang(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DanhMucNganHang();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DanhMucNganHang();
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
        me.strDanhMucNganHang_Id = "";
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
    save_DanhMucNganHang: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_DanhMuc_MH/AiAxDykgNRUzIC8mFSkgKB4FNA0oJDQFDAPP',
            'func': 'pkg_chung_danhmuc.CapNhatTrangThai_DuLieuDM',
            'iM': edu.system.iM,
            'strId': me.strDanhMucNganHang_Id,
            'dTrangThai': edu.util.getValById('dropTrangThai'),
        };
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
                    me.getList_DanhMucNganHang();
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
    getList_DanhMucNganHang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFNA0oJDQFIC8pDDQi',
            'func': 'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strCHUNG_TENDANHMUC_Id': '62122C28DD724285BFC93E11639E5136',
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
            'strQUANHECHA_Id': edu.util.getValById('dropAAAA'),
            'dTrangThai': -1,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDanhMucNganHang = dtReRult;
                    me.genTable_DanhMucNganHang(dtReRult, data.Pager);
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
    delete_DanhMucNganHang: function (Ids) {
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
                    me.getList_DanhMucNganHang();
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
    genTable_DanhMucNganHang: function (data, iPager) {
        var me = this;
        me.dtDanhMucNganHang = data;
        $("#lblDanhMucNganHang_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucNganHang",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNganHang.getList_DanhMucNganHang()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "THONGTIN1"
                },
                {
                    //"mDataProp": "TRANGTHAI",
                    "mRender": function (nRow, aData) {
                        return aData.TRANGTHAI ? "Đang hoạt động" : "Ẩn";
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
    viewForm_DanhMucNganHang: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtDanhMucNganHang.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        //edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        //edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA));
        
        edu.util.viewValById("dropTrangThai", data.TRANGTHAI);
        me.strDanhMucNganHang_Id = data.ID;
    },
}