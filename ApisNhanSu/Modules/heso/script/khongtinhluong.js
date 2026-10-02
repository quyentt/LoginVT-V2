/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhongTinhLuong() { };
KhongTinhLuong.prototype = {
    strKhongTinhLuong_Id: '',
    dtKhongTinhLuong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhongTinhLuong();
        me.getList_CCTC();
        me.getList_QuyDinhLuong();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.THANHPHANLUONG", "dropSearch_ThanhPhanLuong,dropThanhPhanLuong");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "dropLoaiBangLuong");
        $("#tblKhongTinhLuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KhongTinhLuong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KhongTinhLuong").click(function () {
            var arrChecked_Id = $("#dropThanhPhanLuong").val();
            if (arrChecked_Id.length > 0) {

                edu.system.alert('<div id="zoneprocessKhongTinhLuong"></div>');
                edu.system.genHTML_Progress("zoneprocessKhongTinhLuong", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_KhongTinhLuong(arrChecked_Id[i]);
                }
            }
        });
        $("#btnXoaKhongTinhLuong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhongTinhLuong", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessKhongTinhLuong"></div>');
                edu.system.genHTML_Progress("zoneprocessKhongTinhLuong", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhongTinhLuong(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhongTinhLuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhongTinhLuong();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhongTinhLuong" });
        });

        $("#dropSearch_DonVi").on("select2:select", function () {
            me.getList_HS(edu.util.getValById("dropSearch_DonVi"), "");
        });
        $("#dropDonVi").on("select2:select", function () {
            me.getList_HS(edu.util.getValById("dropDonVi"), "");
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhongTinhLuong_Id = "";
        edu.util.viewValById("dropDonVi", edu.util.getValById("dropSearch_DonVi"));
        edu.util.viewValById("dropThanhVien", edu.util.getValById("dropSearch_ThanhVien"));
        edu.util.viewValById("dropLoaiXuLy", edu.util.getValById("dropSearch_LoaiXuLy"));
        edu.util.viewValById("dropThanhPhanLuong", edu.util.getValById("dropSearch_ThanhPhanLuong"));
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtThang", "");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhongTinhLuong: function (strThanhPhan_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'L_KhongTinh/ThemMoi',

            'strId': me.strKhongTinhLuong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropThanhVien'),
            'strNhanSu_BangQuyDinh_Id': edu.util.getValById('dropAAAA'),
            'strLoaiBangLuong_Id': strThanhPhan_Id, // edu.util.getValById('dropThanhPhanLuong'),
            'strLoaiKhongTinhLuong_Id': edu.util.getValById('dropLoaiXuLy'),
            'strThanhPhan_Id': strThanhPhan_Id, // edu.util.getValById('dropThanhPhanLuong'),
            'strNam': edu.util.getValById('txtNam'),
            'strThang': edu.util.getValById('txtThang'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'L_KhongTinh/CapNhat';
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
                    //me.getList_KhongTinhLuong();
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

            complete: function () {
                edu.system.start_Progress("zoneprocessKhongTinhLuong", function () {
                    me.getList_KhongTinhLuong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhongTinhLuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_KhongTinh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNhanSu_BangQuyDinh_Id': edu.util.getValById('dropSearch_QuyDinh'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strLoaiKhongTinhLuong_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strThanhPhan_Id': edu.util.getValById('dropSearch_ThanhPhanLuong'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongTinhLuong = dtReRult;
                    me.genTable_KhongTinhLuong(dtReRult, data.Pager);
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
    delete_KhongTinhLuong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_KhongTinh/Xoa',
            
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
                edu.system.start_Progress("zoneprocessKhongTinhLuong", function () {
                    me.getList_KhongTinhLuong();
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
    genTable_KhongTinhLuong: function (data, iPager) {
        $("#lblKhongTinhLuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhongTinhLuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhongTinhLuong.getList_KhongTinhLuong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4, 5,6,7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MA"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "THANHPHAN_TEN"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KhongTinhLuong: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtKhongTinhLuong, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropThanhVien", data.NHANSU_HOSOCANBO_ID);
        edu.util.viewValById("dropLoaiXuLy", data.LOAIKhongTinhLuong_ID);
        edu.util.viewValById("dropThanhPhanLuong", data.THANHPHAN_ID);
        edu.util.viewValById("txtNam", data.NAM);
        edu.util.viewValById("txtThang", data.THANG);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        me.strKhongTinhLuong_Id = data.ID;
        me.getList_HS("", data.NHANSU_HOSOCANBO_ID);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_QuyDinhLuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',


            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_QuyDinhLuong(dtReRult, data.Pager);
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
    genCombo_QuyDinhLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCLUONGCOBAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_QuyDinh"],
            title: "Chọn quy định lương"
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
            renderPlace: ["dropDonVi", "dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function (strDaoTao_CoCauToChuc_Id, strDefaultVal) {
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
            'strDaoTao_CoCauToChuc_Id': strDaoTao_CoCauToChuc_Id,
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
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },
}