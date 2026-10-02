/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichChamThi() { };
LichChamThi.prototype = {
    strTable_XacNhan_Id: "",
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_TuiBai();
        $("#btnSearch").click(function () {
            me.getList_TuiBai();
        });
        $("#chkSelectAll_TuiBai").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#chkSelectAll_Thi").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $(".btnXacNhan").click(function () {
            var x = $(this).attr("id");
            var arrChecked_Id = edu.util.getArrCheckedIds(x, "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.strTable_XacNhan_Id = x;
            $("#modal_XacNhan").modal("show");
        });
        $("#btnDongYXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds(me.strTable_XacNhan_Id, "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.save_XacNhan(e));
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_TuiBai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSKetQuaChamThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTuiBai"] = dtReRult;
                    me.genTable_Thi(dtReRult.rsTheoDST);
                    me.genTable_TuiBai(dtReRult.rsTheoTui);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TuiBai: function (data, iPager) {
        var me = this;
        console.log(data)
        if (data && data.length)
            data = data.sort(function (a, b) { return a.THI_TUIBAI_TEN - b.THI_TUIBAI_TEN });
        var jsonForm = {
            strTable_Id: "tblTuiBai",
            aaData: data,
            
            colPos: {
                //center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "THI_TUIBAI_TEN"
                },
                {
                    "mDataProp": "CANBOCHAMTHI_HOTEN"
                },
                {
                    "mDataProp": "SOBAI"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAUCHAM",
                    
                },
                {
                    "mDataProp": "NGAYHOANTHANHCHAM",
                },
                {
                    "mDataProp": "NGAYNHANBAI",
                },
                {
                    //"mDataProp": "TINHTRANGCHAM",
                    "mRender": function (nRow, aData) {
                        return aData.TINHTRANGCHAM ? "Đã chấm" : "Chưa chấm";
                    }
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        //if (data && data.length) edu.system.actionRowSpanForACol(jsonForm.strTable_Id, [1])
        
        /*III. Callback*/
    },
    genTable_Thi: function (data, iPager) {
        var me = this;
        console.log(data)
        var jsonForm = {
            strTable_Id: "tblThi",
            aaData: data,

            colPos: {
                //center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DANHSACHTHI_TEN"
                },
                {
                    "mDataProp": "CANBOCHAMTHI_HOTEN"
                },
                {
                    "mDataProp": "SOBAI"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAUCHAM"
                },
                {
                    "mDataProp": "CATHI_TEN"
                },
                {
                    "mDataProp": "PHONGTHI_TEN"
                },
                {
                    "mDataProp": "NGAYHOANTHANHCHAM",

                },
                {
                    "mDataProp": "NGAYNHANBAI",
                },
                {
                    //"mDataProp": "TINHTRANGCHAM",
                    "mRender": function (nRow, aData) {
                        return aData.TINHTRANGCHAM ? "Đã chấm" : "Chưa chấm";
                    }
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                //{
                //    "mDataProp": "NGAYTHI"
                //},
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //if (data && data.length) edu.system.actionRowSpanForACol(jsonForm.strTable_Id, [1])
        /*III. Callback*/
    },
    
    save_XacNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TP_XuLy/XacNhanTinhTrangChamThi',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'dTinhTrangCham': edu.util.getValById('dropLoaiXacNhan'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
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
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TuiBai();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    }
}
