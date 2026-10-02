function VanBan() { };
VanBan.prototype = {
    init: function () {
        var me = this;
        me.getList_VanBan();
    },

    getList_VanBan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ThongTin/LayDSTinTuc_VanBan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiVanBan_Id': edu.util.getValById('dropAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_VanBan(dtReRult, data.Pager);
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
    genTable_VanBan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVanBan",

            aaData: data,
            colPos: {
                center: [0, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "TENVANBAN"
                },
                {
                    //"mDataProp": "SOHIEU",
                    "mRender": function (nRow, aData) {
                        return '<a class="color-dask-blue text-decoration-underline" href="" id="txtFileDinhKem' + aData.ID + '" href="#" target="_blank">' + edu.util.returnEmpty(aData.SOHIEU) + '</a>';
                    }
                },
                {
                    "mDataProp": "NGAYBANHANH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            var strApi = "TT_Files";
            var strDuLieu_Id = e;
            getList_File(strApi, strDuLieu_Id.ID);
        })

        function getList_File(strApi, strDuLieu_Id) {

            var obj_detail = {
                'action': strApi + '/LayDanhSach',

                'strDuLieu_Id': strDuLieu_Id
            };
            //
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        if (json.length > 0) $("#txtFileDinhKem" + strDuLieu_Id).attr("href", edu.system.rootPathUpload + "/" + json[0].FILEMINHCHUNG);
                    } else {
                        console.log("Thông báo: có lỗi xảy ra!");
                    }

                },
                error: function (er) { },
                type: "GET",
                action: obj_detail.action,

                contentType: true,

                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        }
    },
    
}