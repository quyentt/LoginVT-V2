/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhucKhao() { };
PhucKhao.prototype = {
    dtPhucKhao: [],
    strSinhVien_Id: '',
    strPhucKhao_Id: '',
    init: function () {
        var me = this;
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ThoiGianDangKy();
        me.getList_DSThi();
        $('#dropSearch_ThoiGianDangKy').on('select2:select', function (e) {
            me.getList_DSThi(me.strNguoiHoc_Id);
        });
        $("#tblDSThi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#modal_dangkyphuckhao").modal("show");
            me.strPhucKhao_Id = strId;
            me.getList_LichSu(strId);
            var objPhucKhao = me.dtPhucKhao.find(e => e.ID === strId);
            objPhucKhao.NGAYDANGKYPHUCKHAO ? $("#btnDangKyPhucKhao").hide() : $("#btnDangKyPhucKhao").show();
            objPhucKhao.TINHTRANGNOPPHI ? $("#btnNopPhi").hide() : $("#btnNopPhi").show();
            if (objPhucKhao.NGAYDANGKYPHUCKHAO) !objPhucKhao.TINHTRANGNOPPHI ? $("#btnHuyDangKy").hide() : $("#btnHuyDangKy").show(); else $("#btnHuyDangKy").hide()
            return false;
        });
        $("#btnDangKyPhucKhao").click(function () {
            me.save_PhucKhao();
        })
        $("#btnHuyDangKy").click(function () {
            me.delete_PhucKhao();
        })
        $("#btnSearch").click(function (e) {
            me.getList_DSThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DSThi();
            }
        });

    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_PhucKhao: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/BSAvJgo4ESk0IgopIC4P',
            'func': 'pkg_thi_phach_phuckhao.DangKyPhucKhao',
            'iM': edu.system.iM,
            'strThi_DanhSachThi_TuiBai_Id': me.strPhucKhao_Id,
            'strNguoiDangKy_Id': me.strSinhVien_Id,
            'strLyDoDangKy': edu.util.getValById('txtAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        //obj_notify = {
                        //    type: "s",
                        //    content: "Thêm mới thành công!",
                        //}
                        //edu.system.alertOnModal(obj_notify);
                        edu.system.alert("Đăng ký thành công");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_DSThi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    //edu.system.alertOnModal(obj_notify);
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhucKhao: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'XLHV_TP_PhucKhao_MH/CTQ4BSAvJgo4ESk0IgopIC4P',
            'func': 'pkg_thi_phach_phuckhao.HuyDangKyPhucKhao',
            'iM': edu.system.iM,
            'strThi_DanhSachThi_TuiBai_Id': me.strPhucKhao_Id,
            'strNguoiHuyDangKy_Id': me.strSinhVien_Id,
            'strLyDoHuyDangKy': edu.util.getValById('txtAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Hủy đăng ký thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_DSThi();
            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_ChuaDangKy();
                //    me.getList_DaDangKy();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_DSThi: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4BRIVKSgRKTQiCikgLgIgDykgLwPP',
            'func': 'pkg_thi_phach_phuckhao.LayDSThiPhucKhaoCaNhan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.dtPhucKhao = dtResult;
                    me.genTable_DSThi(dtResult);
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
    genTable_DSThi: function (data) {
        var me = this;
        if (data.length > 0) $("#btnHuongDan").attr("href", data[0].HUONGDANSUDUNG);
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
                    //"mDataProp": "DIEM"
                    mRender: function (nRow, aData) {
                        return aData.DIEM ? parseFloat(aData.DIEM) : "";
                    }
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
                    "mDataProp": "NGAYHETHANNOPPHIPHUCKHAO"
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
                    "mDataProp": "KETQUAPHUCKHAO1"
                },
                {
                    "mRender": function (nRow, aData) {
                        return 'ĐK <a class="is-fixed btnEdit pointer" id="' + aData.ID + '" ><i class="fal fa-money-check-edit"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //edu.system.insertSumAfterTable("tblKetQuaDangKy", [3])
    },
    
    getList_LichSu: function (strThi_DanhSachThi_TuiBai_Id) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4BRINKCIpEjQRKTQiCikgLgPP',
            'func': 'pkg_thi_phach_phuckhao.LayDSLichSuPhucKhao',
            'iM': edu.system.iM,
            'strThi_DanhSachThi_TuiBai_Id': strThi_DanhSachThi_TuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_LichSu(dtResult.rsKetQuaDangKy);
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
    genTable_LichSu: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSuDangKy",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYTHUCHIEN_DD_MM_YYYY"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN",
                },
                {
                    "mDataProp": "HINHTHUCTHI_TEN",
                   
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "CATHI_TEN"
                },
                {
                    "mDataProp": "PHONGTHI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //edu.system.insertSumAfterTable("tblKetQuaDangKy", [3])
    },

    getList_ThoiGianDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4FSkuKAYoIC8P',
            'func': 'pkg_thi_phach_phuckhao.LayThoiGian',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDangKy(json);
                    //me.getList_KetQuaDangKy(strQLSV_NguoiHoc_Id)
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGianDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectOne: true
            },
            renderPlace: ["dropSearch_ThoiGianDangKy"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },
}