/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichSu() { };
LichSu.prototype = {
    strLichSu_Id: '',
    dtLichSu: [],
    dtKeHoachDangKy: [],
    strNguoiHoc_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //me.strNguoiHoc_Id = edu.system.userId;
        //me.getList_LichSu(); 

        $("#btnSearch").click(function () {
            me.getList_KeHoachDangKy();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachDangKy();
            }
        });
        me.getList_KeHoachDangKy();

        $('#dropSearch_KeHoach').on('select2:select', function (e) {

            me.getList_TongHop();

        });

        edu.system.getList_MauImport("zonebtnBaoCao_DeTai", function (addKeyValue) {
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strQLSV_NguoiHoc_Id", main_doc.LichSu.strNguoiHoc_Id);
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TongHop: function (strTuKhoa) {
        var me = this;
        
        var obj_list = {
            'action': 'DKH_XuLy/LayLichSuDangKyHocCaNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLichSu = data.Data;
                    me.genTable_TongHop(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_TongHop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "THOIGIANTHUCHIEN"
                },
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachDangKy: function () {
        var me = this;
        $("#tblLichSu tbody").html("");
        $("#dropSearch_KeHoach").html("");
        $("#lblLichSu_Tong").html("");
        me.strNguoiHoc_Id = "";
        //--Edit
        var obj_list = {
            'action': 'DKH_XuLy/LayDSKeHoachTheoLichSuDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKeHoachDangKy = dtResult.rsKeHoach;
                    me.cbGenCombo_KeHoach(dtResult.rsKeHoach, iPager);
                    if (dtResult.rsThongTinNguoiHoc.length == 1) {
                        var objNguoiHoc = dtResult.rsThongTinNguoiHoc[0];
                        $("#lblLichSu_Tong").html("" + edu.util.returnEmpty(objNguoiHoc.MASO) + " - " + edu.util.returnEmpty(objNguoiHoc.HODEM) + " " + edu.util.returnEmpty(objNguoiHoc.TEN));
                        me.strNguoiHoc_Id = objNguoiHoc.ID;
                        me.getList_TongHop();
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
}