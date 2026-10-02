/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhucKhao() { };
PhucKhao.prototype = {
    dtNhapDiem: [],
    strNhapDiem_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        me.getList_HocPhan();
        me.getList_PhucKhao();


        $("#btnSearch").click(function (e) {
            me.getList_PhucKhao();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhucKhao();
            }
        });

        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_HocPhan();
            me.getList_PhucKhao();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {

            me.getList_PhucKhao();
        });
        $("#tblDSThi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#modal_dangkyphuckhao").modal("show");
            me.strPhucKhao_Id = strId;
            me.getList_LichSu(strId);
            var objPhucKhao = me.dtPhucKhao.find(e => e.ID === strId);
            objPhucKhao.NGAYDANGKYPHUCKHAO ? $("#btnDangKyPhucKhao").hide() : $("#btnDangKyPhucKhao").show();
            objPhucKhao.TINHTRANGNOPPHI ? $("#btnNopPhi").hide() : $("#btnNopPhi").show();
            if (objPhucKhao.NGAYDANGKYPHUCKHAO) !objPhucKhao.TINHTRANGNOPPHI ? $("#btnHuyDangKy").hide() : $("#btnHuyDangKy").show();
            return false;
        });
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhucKhao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNhapDiem = dtReRult;
                    me.genTable_PhucKhao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_PhucKhao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSThi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "SOBAODANH",
                },
                {
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "CATHI_TEN"
                },
                {
                    "mDataProp": "PHONGTHI_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "NGAYXACNHANHOANTHANHDIEMTHI"
                },
                {
                    "mDataProp": "NGAYDANGKYPHUCKHAO"
                },
                {
                    "mDataProp": "NGAYHETHANDANGKYPHUCKHAO"
                },
                {
                    //"mDataProp": "PhiPhucKhao - TinhTrangNopPhi"
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.PHIPHUCKHAO) + " - " + edu.util.returnEmpty(aData.TINHTRANGNOPPHI)
                    }
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "KETQUAPHUCKHAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return 'Đăng ký <a class="is-fixed btnEdit" id="' + aData.ID + '" ><i class="fal fa-money-check-edit"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_PhucKhao/LayThoiGianTheoDotThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_PhucKhao/LayHocPhanPhucKhao',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },
}