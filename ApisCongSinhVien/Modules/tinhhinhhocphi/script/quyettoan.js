/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuyetToan() { };
QuyetToan.prototype = {
    dtKetQua: [],
    init: function () {
        var me = this;
        me.strNguoiHoc_Id = edu.system.userId;// 'e7c4d5e4b2ed4ea1a50c3aaaac1988f6';
        me.getList_DotQuyetToan();
        me.getList_QuyetToan();
        $('#dropSearch_DotQT').on('select2:select', function (e) {
            var strMota = $('#dropSearch_DotQT option:selected').attr("name");

            $("#lblChuY").html(edu.util.returnEmpty(strMota));
            me.getList_QuyetToan();
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    getList_QuyetToan: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4CiQ1EDQgEDQ4JDUVLiAvAiAPKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.LayKetQuaQuyetToanCaNhan',
            'iM': edu.system.iM,
            'strTaiChinh_DotQuyetToan_Id': edu.util.getValById('dropSearch_DotQT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtKetQua = dtResult;
                    me.genHtml_ThongTinCaNhan();
                    me.genTable_QuyetToan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_ThongTinCaNhan: function () {
        var me = this;
        if (me.dtKetQua.length > 0) {

            var jsonSV = me.dtKetQua[0];
            $("#lblQT_HoTenSV").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_HOTEN));
            $("#lblQT_MaSo").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_MASO));
            $("#lblQT_NgaySinh").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_NGAYSINH));
            $("#lblQT_Lop").html(edu.util.returnEmpty(jsonSV.DAOTAO_LOPQUANLY_TEN));
            $("#lblQT_GhiChu").html(edu.util.returnEmpty(jsonSV.GHICHU));
            $("#lblQT_Nganh").html(edu.util.returnEmpty(jsonSV.DAOTAO_TOCHUCCHUONGTRINH_TEN));
        }
    },
    genTable_QuyetToan: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblQuyetToan",
            aaData: data,

            colPos: {
                center: [0,3],
                right: [2]
            },
            aoColumns: [
                {
                    "mDataProp": "THANHPHAN_TEN"
                },
                {
                    //"mDataProp": "THANHPHAN_GIATRI"
                    "mRender": function (nRow, aData) {
                        //var iThuTu = edu.system.icolumn++;
                        //return '<span id="tinhtrang_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '"></span>';
                        if (aData.DONVITINH_LATIEN != 1) {
                            return edu.util.returnEmpty(aData.THANHPHAN_GIATRI)
                        }
                        return edu.util.formatCurrency(aData.THANHPHAN_GIATRI)
                    }
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_DotQuyetToan: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIFLjUQNDgkNRUuIC8P',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSDotQuyetToan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_DotQuyetToan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DotQuyetToan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MOTA"
            },
            renderPlace: ["dropSearch_DotQT"],
            title: "Chọn đợt quyết toán"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            $("#dropSearch_DotQT").val(data[0].ID).trigger("change").trigger({ type: 'select2:select' });
        }
    },
    
}