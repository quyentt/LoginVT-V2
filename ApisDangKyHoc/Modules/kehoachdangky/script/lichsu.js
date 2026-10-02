/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LichSu() { };
LichSu.prototype = {
    dtLichSu: [],
    strLichSu_Id: '',
    dtSinhVien:[],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_LichSu();
        me.getList_KetQua();
        $("#btnSearch").click(function (e) {
            me.getList_LichSu();
            me.getList_KetQua();
        });

        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_LichSu();
                me.getList_KetQua();
            }
        });
    },

    getList_LichSu: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_XuLy/LayKetQuaLichSuDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strKy': edu.util.getValById('txtSearch_Ky'),
            'strDot': edu.util.getValById('txtSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtLichSu = dtReRult;
                    me.genTable_LichSu(dtReRult, data.Pager);
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
    genTable_LichSu: function (data, iPager) {
        var me = this;
        $("#lblLichSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLichSu",
            bPaginate: {
                strFuntionName: "main_doc.LichSu.getList_LichSu()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 3, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        var strTemp = aData.NAMHOC;
                        if (aData.HOCKY) strTemp += "_" + aData.HOCKY;
                        if (aData.DOTHOC) strTemp += "_" + aData.DOTHOC;

                        return strTemp;
                    }
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "THONGTINLOPHOCPHAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "ERR"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQua: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_XuLy/LayKetQuaDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strKy': edu.util.getValById('txtSearch_Ky'),
            'strDot': edu.util.getValById('txtSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KetQua(dtReRult, data.Pager);
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
    genTable_KetQua: function (data, iPager) {
        var me = this;
        $("#lblKetQua_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKetQua",
            bPaginate: {
                strFuntionName: "main_doc.LichSu.getList_KetQua()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 3, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        var strTemp = aData.NAMHOC;
                        if (aData.HOCKY) strTemp += "_" + aData.HOCKY;
                        if (aData.DOTHOC) strTemp += "," + aData.DOTHOC;

                        return strTemp;
                    }
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "THONGTINLOPHOCPHAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}