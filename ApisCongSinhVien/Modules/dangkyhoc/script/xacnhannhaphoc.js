/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--Note:  Xác nhận nhập học - Lịch sử xác nhận của bạn
----------------------------------------------*/
function XacNhanNhapHoc() { };
XacNhanNhapHoc.prototype = {
    strSinhVien_Id: '',
    dtKeHoach: [],
    dtCoSoDaoTao: [],
    dtLichSu: [],

    init: function () {
        var me = this;
        me.strSinhVien_Id = edu.system.userId;

        me.getList_KeHoach();

        $("#btnXemThongTin").click(function () {
            var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
            if (!strKeHoach_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học?", "w");
                return;
            }
            me.getList_CoSoDaoTao();
            me.getList_LichSuXacNhan();
        });

        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_CoSoDaoTao();
            me.getList_LichSuXacNhan();
        });

        $("#btnXacNhan").click(function () {
            var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
            var strCoSoDaoTao_Id = edu.util.getValById('dropSearch_CoSoDaoTao');
            if (!strKeHoach_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch nhập học?", "w");
                return;
            }
            if (!strCoSoDaoTao_Id) {
                edu.system.alert("Vui lòng chọn cơ sở đào tạo học tập?", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xác nhận nhập học không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhanNhapHoc(strKeHoach_Id, strCoSoDaoTao_Id);
            });
        });
    },

    /*------------------------------------------
    --Discription: Lấy danh sách kế hoạch nhập học của người học
    --Origin: PKG_CORE_NhapHoc_ThuTien.LayDS_KeHoach_TheoNguoiHoc
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIeCiQJLiAiKR4VKSQuDyY0LigJLiIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDS_KeHoach_TheoNguoiHoc',
            'iM': edu.system.iM,
            'strCore_Person_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtKeHoach = dtResult;
                    me.genCombo_KeHoach(dtResult);
                } else {
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

    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN_KEHOACH",
                selectFirst: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch nhập học"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Lấy danh sách cơ sở đào tạo theo kế hoạch
    --Origin: PKG_CORE_NhapHoc_ThuTien.LayDS_CSDT_TheoNguoiHoc_KH
    -------------------------------------------*/
    getList_CoSoDaoTao: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIeAhIFFR4VKSQuDyY0LigJLiIeCgkP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDS_CSDT_TheoNguoiHoc_KH',
            'iM': edu.system.iM,
            'strCore_Person_Id': me.strSinhVien_Id,
            'strNh_KeHoach_NhapHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtCoSoDaoTao = dtResult;
                    me.genCombo_CoSoDaoTao(dtResult);
                } else {
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

    genCombo_CoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectFirst: true
            },
            renderPlace: ["dropSearch_CoSoDaoTao"],
            title: "Chọn cơ sở đào tạo học tập"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Lấy lịch sử xác nhận cơ sở của sinh viên
    --Origin: PKG_CORE_NhapHoc_ThuTien.LayDS_LichSu_XacNhanCoSo
    -------------------------------------------*/
    getList_LichSuXacNhan: function () {
        var me = this;
        var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
        if (!strKeHoach_Id) {
            me.render_LichSuXacNhan([]);
            return;
        }
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIeDSgiKRI0HhkgIg8pIC8CLhIu',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDS_LichSu_XacNhanCoSo',
            'iM': edu.system.iM,
            'strNh_KeHoach_NhapHoc_Id': strKeHoach_Id,
            'strCore_Person_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        console.group('[XacNhanNhapHoc] LayDS_LichSu_XacNhanCoSo → REQUEST');
        console.log('  strNh_KeHoach_NhapHoc_Id=', obj_save.strNh_KeHoach_NhapHoc_Id);
        console.log('  strCore_Person_Id       =', obj_save.strCore_Person_Id);
        console.log('  strNguoiThucHien_Id     =', obj_save.strNguoiThucHien_Id);
        console.groupEnd();
        edu.system.makeRequest({
            success: function (data) {
                console.group('[XacNhanNhapHoc] LayDS_LichSu_XacNhanCoSo ← RESPONSE');
                console.log('Success:', data && data.Success);
                console.log('Message:', data && data.Message);
                console.log('Data (raw):', data && data.Data);
                if (data && data.Data && data.Data.length) {
                    console.log('→ Fields của dòng đầu:', Object.keys(data.Data[0]));
                    console.table(data.Data);
                } else {
                    console.warn('→ Proc trả rỗng cho cặp (KH, Person_Id) ở REQUEST bên trên');
                }
                console.groupEnd();
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtLichSu = dtResult;
                    me.render_LichSuXacNhan(dtResult);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                console.error('[XacNhanNhapHoc] LayDS_LichSu_XacNhanCoSo ← ERROR', er);
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    render_LichSuXacNhan: function (rows) {
        var html = '';
        if (!rows || rows.length == 0) {
            html = '<tr><td colspan="4" class="text-center">Không có dữ liệu</td></tr>';
        } else {
            for (var i = 0; i < rows.length; i++) {
                var r = rows[i];
                // Dòng đầu = bản ghi hiệu lực (xanh đậm, bôi đậm), các dòng sau xám mờ
                var rowAttr = i === 0
                    ? ' class="color-dask-blue fw-bold" style="background-color:#e6f0fa;"'
                    : ' class="color-66"';
                html += '<tr' + rowAttr + '>'
                    + '<td class="text-center">' + (i + 1) + '</td>'
                    + '<td>' + edu.util.returnEmpty(r.ThoiGianThucHien) + '</td>'
                    + '<td>' + edu.util.returnEmpty(r.NguoiThucHien) + '</td>'
                    + '<td>' + edu.util.returnEmpty(r.CoSoDaoTao) + '</td>'
                    + '</tr>';
            }
        }
        $("#tblLichSuXacNhan tbody").html(html);
    },

    /*------------------------------------------
    --Discription: Lưu xác nhận cơ sở đào tạo nhập học
    --Origin: PKG_CORE_NhapHoc_ThuTien.Sua_CoSoNhapHoc
    -------------------------------------------*/
    save_XacNhanNhapHoc: function (strKeHoach_Id, strCoSoDaoTao_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/EjQgHgIuEi4PKSAxCS4i',
            'func': 'PKG_CORE_NhapHoc_ThuTien.Sua_CoSoNhapHoc',
            'iM': edu.system.iM,
            'strNh_KeHoach_NhapHoc_Id': strKeHoach_Id,
            'strCore_Person_Id': me.strSinhVien_Id,
            'strDaoTao_CoSoDaoTao_Id': strCoSoDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xác nhận nhập học thành công!", "s");
                    me.getList_CoSoDaoTao();
                    me.getList_LichSuXacNhan();
                } else {
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
    }
};
