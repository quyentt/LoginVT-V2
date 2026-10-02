/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--Note: SV theo kế hoạch, xem và xác nhận các thông tin do trường yêu cầu
----------------------------------------------*/
function NguoiHocXacNhanThanhToan() { };
NguoiHocXacNhanThanhToan.prototype = {
    dtKeHoach: [],
    dtThongTinXN: [],
    dtLoaiXacNhan: [],
    dtHanhDong: [],

    init: function () {
        var me = this;
        me.getList_KeHoach();

        $("#btnXem").click(function () {
            me.xemKeHoach();
        });

        $("#tblXacNhan").delegate("#chkSelectAll_XN", "click", function () {
            var checked_status = this.checked;
            $("#tblXacNhan tbody input.chkXN_Item").each(function () {
                $(this).prop('checked', checked_status);
            });
        });

        $("#btnXacNhan").click(function () {
            me.openModal_XacNhan();
        });

        $('#dropSearch_LoaiXacNhan').on('select2:select', function () {
            me.getList_HanhDong();
        });

        $("#btnXacNhan_Modal").click(function () {
            me.save_XacNhan();
        });
    },

    /*------------------------------------------
    --[1] Lấy danh sách kế hoạch xác nhận của người học
    --PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_XN_By
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_XacNhan_HoSo_MH/DSA4BRIeAi4zJB4RJDMyLi8eCgkeGQ8eAzgP',
            'func': 'PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_XN_By',
            'iM': edu.system.iM,
            'strNguoiThuVai_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoach = data.Data || [];
                    me.genCombo_KeHoach(me.dtKeHoach);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoachXacNhan"],
            type: "",
            title: "Chọn kế hoạch xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --[2] Xem chi tiết kế hoạch + thông tin xác nhận
    -------------------------------------------*/
    xemKeHoach: function () {
        var me = this;
        var strKeHoach_Id = edu.util.getValById("dropSearch_KeHoachXacNhan");
        if (!edu.util.checkValue(strKeHoach_Id)) {
            edu.system.alert("Vui lòng chọn kế hoạch xác nhận", "w");
            return;
        }
        var keHoach = me.dtKeHoach.find(e => e.ID == strKeHoach_Id);
        me.genThongTinKeHoach(keHoach);
        me.getList_ThongTinXN(strKeHoach_Id);
    },
    genThongTinKeHoach: function (keHoach) {
        if (!keHoach) {
            $("#zoneThongTinKeHoach").hide();
            return;
        }
        $("#lblTenKeHoach").html(edu.util.returnEmpty(keHoach.TEN));
        $("#lblTuNgay").html(edu.util.returnEmpty(keHoach.TUNGAY));
        $("#lblDenNgay").html(edu.util.returnEmpty(keHoach.DENNGAY));
        $("#lblMoTa").html(edu.util.returnEmpty(keHoach.MOTA));
        $("#zoneThongTinKeHoach").show();
    },

    /*------------------------------------------
    --[3] Lấy danh sách thông tin xác nhận theo kế hoạch
    --PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_TT_XN
    -------------------------------------------*/
    getList_ThongTinXN: function (strKeHoach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_XacNhan_HoSo_MH/DSA4BRIeAi4zJB4RJDMyLi8eCgkeFRUeGQ8P',
            'func': 'PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_TT_XN',
            'iM': edu.system.iM,
            'strCORE_PERSON_KH_XN_Id': strKeHoach_Id,
            'strCORE_PERSON_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtThongTinXN = data.Data || [];
                    me.genTable_XacNhan(me.dtThongTinXN);
                    $("#zoneXacNhan").show();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhan: function (data) {
        var jsonForm = {
            strTable_Id: "tblXacNhan",
            aaData: data,
            colPos: {
                center: [0, 6]
            },
            aoColumns: [
                {
                    "mDataProp": "TENHIENTHI"
                },
                {
                    "mDataProp": "GIATRIDULIEUNGUON"
                },
                {
                    // Cá nhân xác nhận - Xác nhận (hành động người học chọn)
                    "mDataProp": "CORE_PS_HS_XN_HANHDONG_NH_TEN"
                },
                {
                    // Cá nhân xác nhận - Ghi chú (người học nhập)
                    "mDataProp": "CORE_PS_HS_XN_HANHDONG_NH_MOTA"
                },
                {
                    // Nhà trường phản hồi - Xác nhận (hành động người duyệt)
                    "mDataProp": "CORE_PS_HS_XN_HANHDONG_ND_TEN"
                },
                {
                    // Nhà trường phản hồi - Ghi chú (người duyệt nhập)
                    "mDataProp": "CORE_PS_HS_XN_HANHDONG_ND_MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="chkXN_Item" id="chkXN_' + aData.ID + '" name="' + edu.util.returnEmpty(aData.ID) + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    -- Helper: ép Select2 dropdown scope trong modal
    -- Bootstrap modal có focus trap: nếu Select2 attach dropdown vào <body>
    -- (mặc định) thì click/tap vào option bị chặn — nhất là trên mobile.
    -- Fix: destroy Select2 do loadToCombo_data init, re-init với dropdownParent = modal.
    -------------------------------------------*/
    attachDropdownParent: function (selectId, placeholder) {
        var $sel = $("#" + selectId);
        if (!$sel.length || !$.fn.select2) return;
        if ($sel.hasClass("select2-hidden-accessible")) {
            $sel.select2("destroy");
        }
        $sel.select2({
            dropdownParent: $("#modal_ThucHienXacNhan"),
            placeholder: placeholder || "",
            allowClear: false,
            width: "100%"
        });
    },

    /*------------------------------------------
    --[4] Mở modal thực hiện xác nhận
    -------------------------------------------*/
    openModal_XacNhan: function () {
        var me = this;
        var arrChon = $("#tblXacNhan tbody input.chkXN_Item:checked");
        if (arrChon.length == 0) {
            edu.system.alert("Vui lòng chọn ít nhất 1 dòng để xác nhận", "w");
            return;
        }
        $("#txtGhiChu_XN").val("");
        me.getList_LoaiXacNhan();
        $("#modal_ThucHienXacNhan").modal("show");
    },

    /*------------------------------------------
    --[5] Lấy danh sách loại xác nhận
    --PKG_CORE_XACNHAN_HOSO.LayDS_LoaiXacNhan
    -------------------------------------------*/
    getList_LoaiXacNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_XacNhan_HoSo_MH/DSA4BRIeDS4gKBkgIg8pIC8P',
            'func': 'PKG_CORE_XACNHAN_HOSO.LayDS_LoaiXacNhan',
            'iM': edu.system.iM,
            'strCORE_PERSON_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLoaiXacNhan = data.Data || [];
                    me.genCombo_LoaiXacNhan(me.dtLoaiXacNhan);
                    me.getList_HanhDong();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_LoaiXacNhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiXacNhan"],
            type: "",
            title: "Chọn loại xác nhận"
        };
        edu.system.loadToCombo_data(obj);
        this.attachDropdownParent("dropSearch_LoaiXacNhan", "Chọn loại xác nhận");
        if (data.length == 1) {
            $("#dropSearch_LoaiXacNhan").val(data[0].ID).trigger("change");
        }
    },

    /*------------------------------------------
    --[6] Lấy danh sách hành động xác nhận
    --PKG_CORE_XACNHAN_HOSO.LayDS_HanhDong
    -------------------------------------------*/
    getList_HanhDong: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_XacNhan_HoSo_MH/DSA4BRIeCSAvKQUuLyYP',
            'func': 'PKG_CORE_XACNHAN_HOSO.LayDS_HanhDong',
            'iM': edu.system.iM,
            'strCORE_PERSON_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById("dropSearch_LoaiXacNhan"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHanhDong = data.Data || [];
                    me.genCombo_HanhDong(me.dtHanhDong);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_HanhDong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HanhDong"],
            type: "",
            title: "Chọn hành động xác nhận"
        };
        edu.system.loadToCombo_data(obj);
        this.attachDropdownParent("dropSearch_HanhDong", "Chọn hành động xác nhận");
        if (data.length == 1) {
            $("#dropSearch_HanhDong").val(data[0].ID).trigger("change");
        }
    },

    /*------------------------------------------
    --[7] Lưu xác nhận (cổng SV)
    --PKG_CORE_XACNHAN_HOSO.Them_Core_Person_HoSo_XN
    -------------------------------------------*/
    save_XacNhan: function () {
        var me = this;
        var strLoaiXacNhan_Id = edu.util.getValById("dropSearch_LoaiXacNhan");
        var strHanhDong_Id = edu.util.getValById("dropSearch_HanhDong");
        var strGhiChu = edu.util.getValById("txtGhiChu_XN");

        if (!edu.util.checkValue(strLoaiXacNhan_Id)) {
            edu.system.alert("Vui lòng chọn loại xác nhận", "w");
            return;
        }
        if (!edu.util.checkValue(strHanhDong_Id)) {
            edu.system.alert("Vui lòng chọn hành động xác nhận", "w");
            return;
        }

        var arrRowId = [];
        $("#tblXacNhan tbody input.chkXN_Item:checked").each(function () {
            arrRowId.push($(this).attr("name"));
        });
        if (arrRowId.length == 0) {
            edu.system.alert("Vui lòng chọn ít nhất 1 dòng để xác nhận", "w");
            return;
        }

        $("#modal_ThucHienXacNhan").modal("hide");
        edu.system.alert('<div id="zoneprocess_XN"></div>');
        edu.system.genHTML_Progress("zoneprocess_XN", arrRowId.length);

        me._iLeft = arrRowId.length;
        for (var i = 0; i < arrRowId.length; i++) {
            var row = me.dtThongTinXN.find(e => e.ID == arrRowId[i]);
            if (!row) { me._iLeft--; continue; }
            // Theo spec PKG_CORE_XACNHAN_HOSO.Them_Core_Person_HoSo_XN:
            // DuLieuXacNhan_Id = CORE_PERSON_Id + CORE_PERSON_KEHOACH_XACNHAN_Id
            //                  + BANGDULIEUNGUON + TRUONGDULIEUNGUON + DIEUKIENLOC
            // Nếu DIEUKIENLOC null/rỗng → '#'
            // API Oracle trả tên cột viết HOA (CORE_PERSON_ID, ...) — phải đúng case.
            var strDieuKienLoc = edu.util.returnEmpty(row.DIEUKIENLOC);
            if (!strDieuKienLoc) strDieuKienLoc = '#';
            var strDuLieuXacNhan_Id = edu.util.returnEmpty(row.CORE_PERSON_ID)
                + edu.util.returnEmpty(row.CORE_PERSON_KEHOACH_XACNHAN_ID)
                + edu.util.returnEmpty(row.BANGDULIEUNGUON)
                + edu.util.returnEmpty(row.TRUONGDULIEUNGUON)
                + strDieuKienLoc;
            // ParamDuLieuXacNhan (giá trị dữ liệu đang xác nhận) = giá trị hiển thị từ nguồn
            var strDuLieuXacNhan = edu.util.returnEmpty(row.GIATRIDULIEUNGUON);
            me.save_Them_XacNhan(strDuLieuXacNhan_Id, strLoaiXacNhan_Id, strDuLieuXacNhan, strHanhDong_Id, strGhiChu);
        }
    },
    save_Them_XacNhan: function (strRowId, strLoaiXacNhan_Id, strDuLieuXacNhan, strHanhDong_NguoiHoc_Id, strThongTin_NguoiHocNhap) {
        var me = this;
        var obj_save = {
            'action': 'SV_XacNhan_HoSo_MH/FSkkLB4CLjMkHhEkMzIuLx4JLhIuHhkP',
            'func': 'PKG_CORE_XACNHAN_HOSO.Them_Core_Person_HoSo_XN',
            'iM': edu.system.iM,
            'strDuLieuXacNhan_Id': strRowId,
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strDuLieuXacNhan': strDuLieuXacNhan,
            'strHanhDong_NguoiHoc_Id': strHanhDong_NguoiHoc_Id,
            'strHanhDong_NguoiDuyet_Id': '',
            'strThongTin_NguoiHocNhap': strThongTin_NguoiHocNhap,
            'strThongTin_NguoiDuyetNhap': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocess_XN", function () {
                    me.endSetData();
                });
            },
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        var me = main_doc.NguoiHocXacNhanThanhToan;
        setTimeout(function () {
            me.xemKeHoach();
        }, 1000);
    },
}
