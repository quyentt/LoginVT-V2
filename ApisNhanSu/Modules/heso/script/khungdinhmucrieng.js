/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhungDinhMucRieng() { };
KhungDinhMucRieng.prototype = {
    strKhungDinhMucRieng_Id: '',
    dtKhungDinhMucRieng: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhungDinhMucRieng();
        me.getList_CoCauToChuc();
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.LOAIDINHMUC", "dropSearch_LoaiDinhMuc,dropLoaiDinhMuc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.CDNN", "dropSearch_ChucDanh,dropChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOCD", "dropSearch_HocHam,dropHocHam");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.DINHMUCMIEN.DONVITINH", "dropDonViTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHAMVIAPDUNG.DINHMUC", "dropPhamViApDung");
        $("#tblKhungDinhMucRieng").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KhungDinhMucRieng(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KhungDinhMucRieng").click(function () {
            me.save_KhungDinhMucRieng();
        });
        $("#btnXoaKhungDinhMucRieng").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhungDinhMucRieng", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessKhungDinhMucRieng"></div>');
                edu.system.genHTML_Progress("zoneprocessKhungDinhMucRieng", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhungDinhMucRieng(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhungDinhMucRieng();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhungDinhMucRieng();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhungDinhMucRieng" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhungDinhMucRieng_Id = "";
        edu.util.viewValById("dropLoaiDinhMuc", edu.util.getValById("dropSearch_LoaiDinhMuc"));
        edu.util.viewValById("dropHocHam", edu.util.getValById("dropSearch_HocHam"));
        edu.util.viewValById("dropChucDanh", edu.util.getValById("dropSearch_ChucDanh"));
        edu.util.viewValById("txtNgayApDung", edu.util.getValById("txtSearch_NgayApDung"));
        edu.util.viewValById("txtDinhMucChuan", "");
        edu.util.viewValById("txtDinhMucChuanToiDa", "");
        edu.util.viewValById("dropDonViTinh", "");
        edu.util.viewValById("dropDonVi", edu.util.getValById("dropSearch_DonVi"));
        edu.util.viewValById("dropPhamViApDung", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhungDinhMucRieng: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_KhungDinhMuc_AD_V2/ThemMoi',

            'strId': me.strKhungDinhMucRieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropDonVi'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strHocHam_Id': edu.util.getValById('dropHocHam'),
            'strTrinhDoChuyenMon_Id': edu.util.getValById('dropChucDanh'),
            'strChucDanh_Id': edu.util.getValById('dropChucDanh'),
            'strLoaiDinhMuc_Id': edu.util.getValById('dropLoaiDinhMuc'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamViApDung'),
            'dKhungDinhMucChuan': edu.util.getValById('txtDinhMucChuan'),
            'dKhungDinhMucChuan_ToiDa': edu.util.getValById('txtDinhMucChuanToiDa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'KHCT_KhungDinhMuc_AD_V2/CapNhat';
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
                    me.getList_KhungDinhMucRieng();
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
    getList_KhungDinhMucRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_KhungDinhMuc_AD_V2/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strLoaiDinhMuc_Id': edu.util.getValById('dropSearch_LoaiDinhMuc'),
            'strHocHam_Id': edu.util.getValById('dropSearch_HocHam'),
            'strChucDanh_Id': edu.util.getValById('dropSearch_ChucDanh'),
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
                    me.dtKhungDinhMucRieng = dtReRult;
                    me.genTable_KhungDinhMucRieng(dtReRult, data.Pager);
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
    delete_KhungDinhMucRieng: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_KhungDinhMuc_AD_V2/Xoa',
            
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
                edu.system.start_Progress("zoneprocessKhungDinhMucRieng", function () {
                    me.getList_KhungDinhMucRieng();
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
    genTable_KhungDinhMucRieng: function (data, iPager) {
        $("#lblKhungDinhMucRieng_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhungDinhMucRieng",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhungDinhMucRieng.getList_KhungDinhMucRieng()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 2,9,8],
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
                {
                    "mDataProp": "KHUNGDINHMUCCHUAN"
                },
                {
                    "mDataProp": "KHUNGDINHMUCCHUAN_TOIDA"
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
    viewForm_KhungDinhMucRieng: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtKhungDinhMucRieng, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropLoaiDinhMuc", data.LOAIDINHMUC_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropChucDanh", data.CHUCDANH_ID);
        edu.util.viewValById("dropHocHam", data.HOCHAM_ID);
        edu.util.viewValById("txtDinhMucChuan", data.KHUNGDINHMUCCHUAN);
        edu.util.viewValById("txtDinhMucChuanToiDa", data.KHUNGDINHMUCCHUAN_TOIDA);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropDonVi", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
        me.strKhungDinhMucRieng_Id = data.ID;
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