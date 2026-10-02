/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DiaChiTruong() { };
DiaChiTruong.prototype = {
    strDiaChiTruong_Id: '',
    dtDiaChiTruong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_DiaChiTruong();

        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TRUONGHOC", "dropSeacrch_Truong,dropTruong");
        $("#tblDiaChiTruong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_DiaChiTruong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_DiaChiTruong").click(function () {
            me.save_DiaChiTruong();
        });
        

        $("#btnSearch").click(function () {
            me.getList_DiaChiTruong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DiaChiTruong();
            }
        });
        edu.system.hiddenElement('{"readonlyselect2": "#dropTruong"}');
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strDiaChiTruong_Id = "";
        edu.util.viewValById("dropTruong", "");
        edu.util.viewValById("dropTinh", "");
        edu.util.viewValById("dropHuyen", "");
        edu.util.viewValById("dropXa", "");
        edu.util.viewValById("txtDiaChi", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DiaChiTruong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_Truong_DiaChi/ThemMoi',

            'strId': me.strDiaChiTruong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTruong_Id': edu.util.getValById('dropTruong'),
            'strTinhThanh_Id': edu.util.getValById('dropTinh'),
            'strQuanHuyen_Id': edu.util.getValById('dropHuyen'),
            'strPhuongXa_Id': edu.util.getValById('dropXa'),
            'strDiaChi': edu.util.getValById('txtDiaChi'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_Truong_DiaChi/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
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
                    me.getList_DiaChiTruong();
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
    getList_DiaChiTruong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_Truong_DiaChi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDiaChiTruong = dtReRult;
                    me.genTable_DiaChiTruong(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DiaChiTruong: function (data, iPager) {
        $("#lblDiaChiTruong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDiaChiTruong",
            aaData: data,
            colPos: {
                center: [0, 6, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TRUONG_TEN"
                },
                {
                    "mDataProp": "TINHTHANH_TEN"
                },
                {
                    "mDataProp": "QUANHUYEN_TEN"
                },
                {
                    "mDataProp": "PHUONGXA_TEN"
                },
                {
                    "mDataProp": "DIACHI"
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
    viewForm_DiaChiTruong: function (strId) {
        var me = this;
        edu.util.viewValById("dropHuyen", "");
        edu.util.viewValById("dropXa", "");
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDiaChiTruong, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropTruong", data.TRUONG_ID);
        edu.extend.genDropTinhThanh("dropTinh", "dropHuyen", "dropXa", data.TINHTHANH_ID, data.QUANHUYEN_ID, data.PHUONGXA_ID);
        edu.util.viewValById("txtDiaChi", data.DIACHI);
        me.strDiaChiTruong_Id = data.ID;
    },
}