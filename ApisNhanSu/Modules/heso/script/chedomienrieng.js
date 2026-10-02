/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CheDoMienRieng() { };
CheDoMienRieng.prototype = {
    strCheDoMienRieng_Id: '',
    dtCheDoMienRieng: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_CheDoMienRieng();
        me.getList_CoCauToChuc();
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.LOAIDINHMUC", "dropSearch_LoaiDinhMuc,dropLoaiDinhMuc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropSearch_ChucVu,dropChucVu");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.DINHMUCMIEN.DONVITINH", "dropDonViTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHAMVIAPDUNG.MIENGIAM", "dropPhamViApDung");
        $("#tblCheDoMienRieng").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_CheDoMienRieng(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_CheDoMienRieng").click(function () {
            me.save_CheDoMienRieng();
        });
        $("#btnXoaCheDoMienRieng").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCheDoMienRieng", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessCheDoMienRieng"></div>');
                edu.system.genHTML_Progress("zoneprocessCheDoMienRieng", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CheDoMienRieng(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CheDoMienRieng();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CheDoMienRieng();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCheDoMienRieng" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strCheDoMienRieng_Id = "";
        edu.util.viewValById("dropLoaiDinhMuc", edu.util.getValById("dropSearch_LoaiDinhMuc"));
        edu.util.viewValById("txtNgayApDung", edu.util.getValById("txtSearch_NgayApDung"));
        edu.util.viewValById("dropChucVu", edu.util.getValById("dropSearch_Vu"));
        edu.util.viewValById("txtDinhMucChuan", "");
        edu.util.viewValById("dropDonViTinh", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CheDoMienRieng: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_KhungMienGiam_AD_V2/ThemMoi',

            'strId': me.strCheDoMienRieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strChucVu_Id': edu.util.getValById('dropChucVu'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strLoaiDinhMuc_Id': edu.util.getValById('dropLoaiDinhMuc'),
            'strLyDo': edu.util.getValById('txtAAAA'),
            'dKhungDinhMucMienGiam': edu.util.getValById('txtDinhMucChuan'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamViApDung'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropDonVi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'KHCT_KhungMienGiam_AD_V2/CapNhat';
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
                    me.getList_CheDoMienRieng();
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
    getList_CheDoMienRieng: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_KhungMienGiam_AD_V2/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strChucVu_Id': edu.util.getValById('dropSearch_ChucVu'),
            'strLoaiDinhMuc_Id': edu.util.getValById('dropSearch_LoaiDinhMuc'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropSearch_LoaiGiangVien'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCheDoMienRieng = dtReRult;
                    me.genTable_CheDoMienRieng(dtReRult, data.Pager);
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
    delete_CheDoMienRieng: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_KhungMienGiam_AD_V2/Xoa',
            
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
                edu.system.start_Progress("zoneprocessCheDoMienRieng", function () {
                    me.getList_CheDoMienRieng();
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
    genTable_CheDoMienRieng: function (data, iPager) {
        $("#lblCheDoMienRieng_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCheDoMienRieng",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CheDoMienRieng.getList_CheDoMienRieng()",
                iDataRow: iPager
            },
            colPos: {
                center: [0,9,10],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIDINHMUC_TEN"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                //{
                //    "mDataProp": "CHUCVU_TEN"
                //},
                {
                    "mDataProp": "KHUNGDINHMUCMIENGIAM"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
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
    viewForm_CheDoMienRieng: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtCheDoMienRieng, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropLoaiDinhMuc", data.LOAIDINHMUC_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropChucVu", data.CHUCVU_ID);
        edu.util.viewValById("txtDinhMucChuan", data.KHUNGDINHMUCMIENGIAM);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropDonVi", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
        me.strCheDoMienRieng_Id = data.ID;
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
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
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
                code: "MA",
            },
            renderPlace: ["dropDonVi", "dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    }, 
}