
function ChiTieuTuyenSinh() { };
ChiTieuTuyenSinh.prototype = {

    init: function () {
        var me = this;
        me.page_load();

        
        $("#btnSearch").click(function () {
            me.getList_HoSo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HoSo();

            }
        });
        edu.system.getList_MauImport("zonebtnBaoCao_CTTS", function (addKeyValue) {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoTuyenSinh", "checkX");
            //if (arrChecked_Id.length > 100) {
            //    edu.system.alert("Số được chọn không quá 100?");
            //    return false;
            //}
            var obj_list = {
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
                'strTS_KeHoachChiTieu_Id': edu.util.getValById('dropSearch_KeHoachChiTieu'),
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });

        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChiTieuTuyenSinh" });
        });
        $("#btnSave_ChiTieu").click(function () {
            //$('#myModalNguyenVong').modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTieuTuyenSinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.confirm("Bạn có muốn cập nhật cho <span style='color: red'>" + arrChecked_Id.length + "</span> không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ChiTieu(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_HoSo();
                }, 500 + arrChecked_Id.length * 80);
            });
        });
    },

    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_HoSo();
        me.getList_KeHoachChiTieu();

    },

    getList_KeHoachChiTieu: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoachChiTieu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_KeHoachChiTieu(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    genCombo_KeHoachChiTieu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoachChiTieu"],
            title: "Chọn kế hoạch chi tiêu"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> ho so tuyen sinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HoSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ChiTieuTuyenSinh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTS_KeHoachChiTieu_Id': edu.util.getValById('dropSearch_KeHoachChiTieu'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.dtHoSo = dtResult;
                    me.genTable_HoSo(dtResult, iPager);
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
    genTable_HoSo: function (data, iPager) {
        var me = this;
        //$("#tblChiTieuTuyenSinh thead").html(me.strhead);
        $("#lblChiTieuTuyenSinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChiTieuTuyenSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChiTieuTuyenSinh.getList_HoSo()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0, 14],
                right: [5, 6, 7, 8,9,10, 11, 12, 13],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANH_TEN"
                },
                {
                    "mDataProp": "NGANH_MA"
                },
                {
                    "mDataProp": "TRINHDO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    //"mDataProp": "QUYMOTUYENSINH",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtQuyMo_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.QUYMOTUYENSINH) + '" />';
                    }
                },
                {
                    //"mDataProp": "PHANTRAMVUOT",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtPhanTram_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.PHANTRAMVUOT) + '" />';
                    }
                },
                {
                    "mDataProp": "QUYMOTUYENSINH_VUOT"
                },
                {
                    "mDataProp": "SOTRUNGTUYEN"
                },
                {
                    "mDataProp": "SONHAPHOC"
                },
                {
                    "mDataProp": "CHOTIEUCONSOVOITRUNGTUYEN"
                },
                {
                    "mDataProp": "CHITIEUCONSOVOINHAPHOC"
                },
                {
                    "mDataProp": "VUOTCHITIEUSOVOITRUNGTUYEN"
                },
                {
                    "mDataProp": "VUOTCHITIEUSOVOINHAPHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [5, 6, 7, 8, 9, 10, 11, 12, 13]);
        $("#zoneSumHead").html($("#" + jsonForm.strTable_Id + " tfoot tr").html());
        /*III. Callback*/
    },

    save_ChiTieu: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_save = {
            'action': 'TS_ChiTieuTuyenSinh/CapNhat',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dQuyMoTuyenSinh': $("#txtQuyMo_" + strId).val(),
            'dPhanTramVuot': $("#txtPhanTram_" + strId).val(),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Cập nhật thành công",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_HoSoGiayTo();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                //var obj = {
                //    content: "TS_HoSoDuTuyen_Lop9/Xoa (er): " + JSON.stringify(er),
                //    code: "w"
                //};
                //edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};