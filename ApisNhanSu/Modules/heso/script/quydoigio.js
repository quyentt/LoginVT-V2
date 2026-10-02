/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function QuyDoiGio() { };
QuyDoiGio.prototype = {
    strQuyDoiGio_Id: '',
    dtQuyDoiGio: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_QuyDoiGio();
        me.getList_ThoiGianDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropSearch_ThoiGian,dropThoiGian");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblQuyDoiGio").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_QuyDoiGio(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_QuyDoiGio").click(function () {
            me.save_QuyDoiGio();
        });
        $("#btnXoaQuyDoiGio").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyDoiGio", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuyDoiGio"></div>');
                edu.system.genHTML_Progress("zoneprocessQuyDoiGio", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyDoiGio(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_QuyDoiGio();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuyDoiGio();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuyDoiGio" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strQuyDoiGio_Id = "";
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        edu.util.viewValById("txtSoLuongTu", "");
        edu.util.viewValById("txtSoLuongDen", "");
        edu.util.viewValById("txtLyDo", "");
        edu.util.viewValById("txtHeSo", "");
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
    save_QuyDoiGio: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_QuyDoiGioChuan/ThemMoi',

            'strId': me.strQuyDoiGio_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strHoatDong_Id': edu.util.getValById('dropHoatDong'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamVi'),
            'strPhanLoaiDiaDiem_Id': edu.util.getValById('dropPhanLoai'),
            'dHeSoQuyDoiGioChuan': edu.util.getValById('txtHeSo'),
            'dSoLuongCanTren': edu.util.getValById('txtSoLuongDen'),
            'dSoLuongCanDuoi': edu.util.getValById('txtSoLuongTu'),
            'strLyDo': edu.util.getValById('txtLyDo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_QuyDoiGioChuan/CapNhat';
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
                    me.getList_QuyDoiGio();
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
    getList_QuyDoiGio: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HeSo_QuyDoiGioChuan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strPhanLoaiDiaDiem_Id': edu.util.getValById('dropSearch_DiaDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strHoatDong_Id': edu.util.getValById('dropSearch_HoatDong'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_PhamVi'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuyDoiGio = dtReRult;
                    me.genTable_QuyDoiGio(dtReRult, data.Pager);
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
    delete_QuyDoiGio: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_QuyDoiGioChuan/Xoa',
            
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
                edu.system.start_Progress("zoneprocessQuyDoiGio", function () {
                    me.getList_QuyDoiGio();
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
    genTable_QuyDoiGio: function (data, iPager) {
        $("#lblQuyDoiGio_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyDoiGio",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDoiGio.getList_QuyDoiGio()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4, 5, 9, 10],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "HOATDONG_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "SOLUONGCANDUOI"
                },
                {
                    "mDataProp": "SOLUONGCANTREN"
                },
                {
                    "mDataProp": "HESOQUYDOIGIOCHUAN"
                },
                {
                    "mDataProp": "PHANLOAIDIADIEM_TEN"
                },
                {
                    "mDataProp": "LYDO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_NAM) + " - " + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_KY) + " - " + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT);
                    }
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
    viewForm_QuyDoiGio: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtQuyDoiGio, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHoatDong", data.HOATDONG_ID);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAIDIADIEM_ID);
        edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtHeSo", data.HESOQUYDOIGIOCHUAN);
        edu.util.viewValById("txtSoLuongTu", data.SOLUONGCANDUOI);
        edu.util.viewValById("txtSoLuongDen", data.SOLUONGCANTREN);
        edu.util.viewValById("txtLyDo", data.LYDO);
        me.strQuyDoiGio_Id = data.ID;
    },
}