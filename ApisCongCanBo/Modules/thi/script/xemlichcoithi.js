/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function XemLichCoiThi() { };
XemLichCoiThi.prototype = {
    dtXemLichCoiThi: [],
    strXemLichCoiThi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_XemLichCoiThi();
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_XemLichCoiThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIKJDUQNCACLigVKSgP',
            'func': 'pkg_congthongtincanbo.LayDSKetQuaCoiThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_XemLichCoiThi(dtReRult.rsChuaThi, data.Pager, "tblLichMoi");
                    me.genTable_XemLichCoiThi(dtReRult.rsDaThi, data.Pager, "tblLichCu");
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_XemLichCoiThi: function (data, iPager, strTable_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTable_Id,

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_XemLichCoiThi()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày thi: </em><span>' + edu.util.returnEmpty(aData.NGAYTHI) +'</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ca thi: </em><span>' + edu.util.returnEmpty(aData.CATHI_TEN) + '(' + edu.util.returnEmpty(aData.CATHI_GIOBATDAU) + ':' + edu.util.returnEmpty(aData.CATHI_PHUTBATDAU) + ' -> ' + edu.util.returnEmpty(aData.CATHI_GIOKETTHUC) + ':' + edu.util.returnEmpty(aData.CATHI_PHUTKETTHUC) +')</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Môn thi:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '(' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) +')</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Hình thức thi:</em><span>' + edu.util.returnEmpty(aData.HINHTHUCTHI_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Phòng thi thi:</em><span>' + edu.util.returnEmpty(aData.PHONGTHI_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kỳ, đợt:</em><span>' + edu.util.returnEmpty(aData.THOIGIAN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ghi chú:</em><span>' + edu.util.returnEmpty(aData.GHICHU) + '</span>';
                    }
                }
                //, {
                //    "mRender": function (nRow, aData) {
                //        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

}