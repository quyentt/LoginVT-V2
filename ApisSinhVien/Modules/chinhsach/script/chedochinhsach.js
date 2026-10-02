/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CheDoChinhSach() { };
CheDoChinhSach.prototype = {
    strCheDoChinhSach_Id: '',
    dtCheDoChinhSach: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_CheDoChinhSach();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.CDCS", "dropSearch_CheDo,dropCheDo");
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.DTMG", "dropDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.DONVITINH", "dropDonViTinh");
        $("#tblCheDoChinhSach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_CheDoChinhSach(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_CheDoChinhSach").click(function () {
            me.save_CheDoChinhSach();
        });
        $("#btnXoaCheDoChinhSach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCheDoChinhSach", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessCheDoChinhSach"></div>');
                edu.system.genHTML_Progress("zoneprocessCheDoChinhSach", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CheDoChinhSach(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CheDoChinhSach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CheDoChinhSach();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCheDoChinhSach" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strCheDoChinhSach_Id = "";
        edu.util.viewValById("dropCheDo", edu.util.getValById("dropSearch_CheDo"));
        edu.util.viewValById("dropDoiTuong", "");
        edu.util.viewValById("dropDonViTinh", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtGhiChu", "");
        edu.util.viewValById("txtPhanTramHuong", "");
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
    save_CheDoChinhSach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_ChinhSach_DT/ThemMoi',

            'strId': me.strCheDoChinhSach_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCheDoChinhSach_Id': edu.util.getValById('dropCheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropDoiTuong'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'dPhanTramHuong': edu.util.getValById('txtPhanTramHuong'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'SV_ChinhSach_DT/CapNhat';
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
                    me.getList_CheDoChinhSach();
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
    getList_CheDoChinhSach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ChinhSach_DT/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCheDoChinhSach = dtReRult;
                    me.genTable_CheDoChinhSach(dtReRult, data.Pager);
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
    delete_CheDoChinhSach: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_ChinhSach_DT/Xoa',

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
                edu.system.start_Progress("zoneprocessCheDoChinhSach", function () {
                    me.getList_CheDoChinhSach();
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
    genTable_CheDoChinhSach: function (data, iPager) {
        $("#lblCheDoChinhSach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCheDoChinhSach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CheDoChinhSach.getList_CheDoChinhSach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHEDOCHINHSACH_TEN"
                },
                {
                    "mDataProp": "DOITUONG_TEN"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                },
                {
                    "mDataProp": "HIEULUC"
                },
                {
                    "mDataProp": "PHANTRAMHUONG"
                },
                {
                    "mDataProp": "GHICHU"
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
    viewForm_CheDoChinhSach: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtCheDoChinhSach, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropCheDo", data.CHEDOCHINHSACH_ID);
        edu.util.viewValById("dropDoiTuong", data.DOITUONG_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        edu.util.viewValById("txtPhanTramHuong", data.PHANTRAMHUONG);
        me.strCheDoChinhSach_Id = data.ID;
    },
}