/*----------------------------------------------
--Author:
--Phone:
--Date of created: 2026-04-28
--Input:
--Output:
--Note: Đăng ký mua đồng phục - bảo hiểm
----------------------------------------------*/
function DongPhuc() { };
DongPhuc.prototype = {
    strSinhVien_Id: '',
    dtDotDangKy: [],
    dtDangKyMua: [],
    dtKetQuaDangKy: [],
    strSelected_KhoanThu_Id: '',

    getMoTaLoaiDangKy: function () {
        var me = this;
        var strId = edu.util.getValById('dropSearch_DotDangKy');
        var aData = me.dtDotDangKy.find(e => e.ID == strId);
        if (edu.util.checkValue(aData) && edu.util.checkValue(aData.MOTA)) {
            return aData.MOTA;
        }
        return 'tham gia';
    },

    updateLabels_LoaiDangKy: function () {
        var me = this;
        $('.lbl-loai-dangky').text(me.getMoTaLoaiDangKy());
    },

    init: function () {
        var me = this;
        me.strSinhVien_Id = edu.system.userId;
        me.getList_DotDangKy();

        $("#btnSearch").click(function () {
            me.getList_DangKyMua();
        });

        $("#dropSearch_DotDangKy").on("select2:select", function () {
            me.getList_DangKyMua();
        });

        $("#tblDangKyMua").delegate('.btnXacNhanMua', 'click', function (e) {
            var strId = this.id;
            var aData = me.dtDangKyMua.find(e => e.ID == strId);
            me.strSelected_KhoanThu_Id = strId;
            $("#lblTen_XacNhanMua").text(edu.util.returnEmpty(aData.TEN_KHOANTHU));
        });

        $("#btnSave_XacNhanMua").click(function () {
            me.save_XacNhanMua();
        });

        $("#tblDangKyMua").delegate('.btnXacNhanKhongMua', 'click', function (e) {
            var strId = this.id;
            me.strSelected_KhoanThu_Id = strId;
            $("#txtLyDoKhongMua").val('');
            $("#fileMinhChung").val('');
        });

        $("#btnSave_XacNhanKhongMua").click(function () {
            me.save_XacNhanKhongMua();
        });

        $('#ds_dangky').on('show.bs.modal', function () {
            me.getList_KetQuaDangKy();
        });

        $("#tblKetQua_DK_Mua").delegate('#chkSelectAll_KetQua', 'click', function () {
            var checked_status = $(this).is(':checked');
            $("#tblKetQua_DK_Mua tbody .checkX").prop('checked', checked_status);
        });

        $("#btnHuyDangKy").click(function () {
            edu.util.ActionInCheckedIds("tblKetQua_DK_Mua", "checkX", function (strId, isLast) {
                me.delete_KetQuaDangKy(strId);
            }, "hủy đăng ký");
        });
    },

    /*------------------------------------------
    --Discription: Lấy danh sách đợt đăng ký mua
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_DangKy
    -------------------------------------------*/
    getList_DotDangKy: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4FIC8mCjgP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_DangKy',
            'iM': edu.system.iM,
            'strNguoiThuVai_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtDotDangKy = dtResult;
                    me.genCombo_DotDangKy(dtResult);
                    me.updateLabels_LoaiDangKy();
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_DotDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectFirst: true
            },
            renderPlace: ["dropSearch_DotDangKy"],
            title: "Chọn đợt đăng ký"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Lấy danh sách hàng hóa đăng ký mua theo đợt
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDSDangKy
    -------------------------------------------*/
    getList_DangKyMua: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeDSA4BRIFIC8mCjgP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDSDangKy',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strTaiChinh_CacKhoanThu_Id': '',
            'strPhanLoaiHangHoa_Id': '',
            'dHieuLuc': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtDangKyMua = dtResult;
                    me.updateLabels_LoaiDangKy();
                    me.genTable_DangKyMua(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_DangKyMua: function (data) {
        var me = this;
        var strLoai = me.getMoTaLoaiDangKy();
        var jsonForm = {
            strTable_Id: "tblDangKyMua",
            aaData: data,
            colPos: {
                center: [0, 3, 4, 5],
                right: [2],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN_KHOANTHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.DONGIA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control soluong text-center" id="txtSoLuong_' + aData.ID + '" value="1" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXacNhanMua btn-table text-nowrap" style="min-width: 150px;" id="' + aData.ID + '" title="Xác nhận ' + strLoai + '" data-bs-toggle="modal" data-bs-target="#them_xacnhan_mua">Xác nhận ' + strLoai + '</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXacNhanKhongMua btn-table text-nowrap" style="min-width: 170px;" id="' + aData.ID + '" title="Xác nhận không ' + strLoai + '" data-bs-toggle="modal" data-bs-target="#them_xacnhan_khongmua" href="">Xác nhận không ' + strLoai + '</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: Xác nhận mua hàng
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Them_Mua
    -------------------------------------------*/
    save_XacNhanMua: function () {
        var me = this;
        var strId = me.strSelected_KhoanThu_Id;
        var aData = me.dtDangKyMua.find(e => e.ID == strId);
        if (!edu.util.checkValue(aData)) {
            edu.system.alert("Vui lòng chọn dịch vụ.", "w");
            return;
        }
        var dSoLuong = edu.util.getValById('txtSoLuong_' + strId);
        if (!edu.util.checkValue(dSoLuong) || Number(dSoLuong) <= 0) {
            edu.system.alert("Vui lòng nhập số lượng.", "w");
            return;
        }

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeChAeFSkkLB4MNCAP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Them_Mua',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_ID),
            'dSoLuong': dSoLuong,
            'dDonGia': edu.util.returnEmpty(aData.DONGIA),
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (document.activeElement) document.activeElement.blur();
                    $('#them_xacnhan_mua').modal('hide');
                    edu.system.alert("Xác nhận " + me.getMoTaLoaiDangKy() + " thành công!", "s");
                    me.getList_DangKyMua();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Xác nhận không mua
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Them_KhongMua
    -------------------------------------------*/
    save_XacNhanKhongMua: function () {
        var me = this;
        var strId = me.strSelected_KhoanThu_Id;
        var aData = me.dtDangKyMua.find(e => e.ID == strId);
        if (!edu.util.checkValue(aData)) {
            edu.system.alert("Vui lòng chọn dịch vụ.", "w");
            return;
        }
        var strLyDo = edu.util.getValById('txtLyDoKhongMua');
        if (!edu.util.checkValue(strLyDo)) {
            edu.system.alert("Vui lòng nhập lý do không " + me.getMoTaLoaiDangKy() + ".", "w");
            return;
        }
        var strMinhChung = edu.util.getValById('fileMinhChung');

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeChAeFSkkLB4KKS4vJgw0IAPP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Them_KhongMua',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_ID),
            'strLyDoKhongMua': strLyDo,
            'strMinhChung': strMinhChung,
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (document.activeElement) document.activeElement.blur();
                    $('#them_xacnhan_khongmua').modal('hide');
                    edu.system.alert("Xác nhận không " + me.getMoTaLoaiDangKy() + " thành công!", "s");
                    me.getList_DangKyMua();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Lấy danh sách kết quả đã đăng ký mua
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_LayDSDangKy
    -------------------------------------------*/
    getList_KetQuaDangKy: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeChAeDSA4BRIFIC8mCjgP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_LayDSDangKy',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strTaiChinh_CacKhoanThu_Id': '',
            'strTinhTrangDangKy_Code': '',
            'dHieuLuc': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtKetQuaDangKy = dtResult;
                    me.updateLabels_LoaiDangKy();
                    me.genTable_KetQuaDangKy(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Hủy đăng ký mua
    --Origin: PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Xoa
    -------------------------------------------*/
    delete_KetQuaDangKy: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeChAeGS4g',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_Xoa',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id,
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.start_Progress("myModalAlert #alert_content", function () {
                        me.getList_KetQuaDangKy();
                        me.getList_DangKyMua();
                    });
                }
                else {
                    edu.system.start_Progress("myModalAlert #alert_content", function () {
                        me.getList_KetQuaDangKy();
                        me.getList_DangKyMua();
                    });
                    edu.system.alert(obj_save.action + " (er): " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.start_Progress("myModalAlert #alert_content", function () {
                    me.getList_KetQuaDangKy();
                    me.getList_DangKyMua();
                });
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_KetQuaDangKy: function (data) {
        var jsonForm = {
            strTable_Id: "tblKetQua_DK_Mua",
            aaData: data,
            colPos: {
                center: [0, 3, 5, 6, 7],
                right: [2, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN_KHOANTHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.DONGIA);
                    }
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="fw-bold color-orange">' + edu.util.formatCurrency(aData.SOTIENPHAINOP) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (edu.util.returnEmpty(aData.TINHTRANGDANGKY_CODE) == 'DANG_KY') {
                            return '<i class="far fa-check color-success"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var code = edu.util.returnEmpty(aData.TINHTRANGDANGKY_CODE);
                        if (code != '' && code != 'DANG_KY') {
                            return '<i class="fal fa-times color-red"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="checkX" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}
