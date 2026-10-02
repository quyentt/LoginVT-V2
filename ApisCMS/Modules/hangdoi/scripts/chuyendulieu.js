/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 23/08/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChuyenDuLieu() { };
ChuyenDuLieu.prototype = {
    arrHangDoi_Id: [],
    countQueue: 0,
    iThread_Queue: 10,
    objHangDoi: {},

    init: function () {
        var me = this;
        me.objHangDoi = {
            strLoaiNhiemVu: "CHUYENDULIEU_IU_SANGDOITAC",
            strName: "ChuyenDuLieu",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnChuyenDuLieu").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Chuyển dữ liệu</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi_ChuyenDuLieu_TuDong();
            });

        });
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_ChuyenDuLieu_TuDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_HangDoi/TaoHangDoi_ChuyenDuLieu_TuDong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "QLTC_HangDoi.TaoHangDoi_ChuyenDuLieu_TuDong: " + data.Message,
                        code: "w",
                    };
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_HangDoi.TaoHangDoi_ChuyenDuLieu_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
        var me = main_doc.ChuyenDuLieu;
        //me.getList_TinChi();
        //me.getList_NienChe();
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018 console.log("[ index ----------------------> " + index + " ]");
    --Discription: processing HangDoi sequence (1 HangDoi <==> n Task ==> process each task util finish all task)
    ----------------------------------------------*/
}