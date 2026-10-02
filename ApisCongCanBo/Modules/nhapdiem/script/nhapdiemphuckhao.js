/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapDiemPK() { };
NhapDiemPK.prototype = {
    dtNhapDiem: [],
    strNhapDiem_Id: '',
    formatDiem: function (val) {
        if (val === null || val === undefined || val === '') return '';
        var num = parseFloat(String(val).replace(',', '.'));
        if (isNaN(num)) return '';
        return num.toFixed(1).replace('.', ',');
    },

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me["strLoaiXacNhan"] = "XACNHAN_HOANTHANH_PHUCKHAO";
        me.getList_ThoiGian();
        me.getList_HocPhan();
        me.getList_NhapDiem();


        $("#btnSearch").click(function (e) {
            me.getList_NhapDiem();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_NhapDiem();
            }
        });
        $(".btnSave_NhapDiem").click(function () {
            var arrChecked_Id = [];

            me.dtNhapDiem.forEach(e => {
                var pointDiem = $("#txtDiem" + e.ID);
                var pointSoPhach = $("#txtSoPhach" + e.ID);
                if (pointDiem.val() != pointDiem.attr("name") || pointSoPhach.val() != pointSoPhach.attr("name")) arrChecked_Id.push(e.ID);
            });
            if (arrChecked_Id.length > 0) {

                edu.system.confirm("Bạn có chắc chắn lưu " + arrChecked_Id.length + " dữ liệu không?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.save_NhapDiem(arrChecked_Id[i]);
                    }
                });
            } else {
                edu.system.alert("Không có thay đổi cần lưu")
            }
        });
        
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_HocPhan();
            me.getList_NhapDiem();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {

            me.getList_NhapDiem();
        });


        $("#btnDuyet").click(function () {
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_PHUCKHAO";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            //if (arrChecked_Id.length > 1) {
            //    edu.system.alert("Bạn chỉ được chọn 1");
            //    return;
            //}

            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanSanPham(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $("#btnDuyet_DST").click(function () {
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_PHUCKHAO";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem_DST", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            //if (arrChecked_Id.length > 1) {
            //    edu.system.alert("Bạn chỉ được chọn 1");
            //    return;
            //}

            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanSanPham(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $("#btnDuyet_Tui").click(function () {
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_PHUCKHAO";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem_Tui", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            //if (arrChecked_Id.length > 1) {
            //    edu.system.alert("Bạn chỉ được chọn 1");
            //    return;
            //}

            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanSanPham(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            var arrChecked_Id2 = edu.util.getArrCheckedIds("tblNhapDiem_DST", "checkX");
            var arrChecked_Id3 = edu.util.getArrCheckedIds("tblNhapDiem_Tui", "checkX");
            arrChecked_Id.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
            arrChecked_Id2.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
            arrChecked_Id3.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem" });
        });
        $("#chkSelectAll_DST").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem_DST" });
        });
        $("#chkSelectAll_Tui").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem_Tui" });
        });

        edu.system.getList_MauImport("zonebtnBaoCao_DPK", function (addKeyValue) {
            var obj_list = {
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_NhapDiem: function () {
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
                    var dtDST = dtReRult.filter(e => e.PHANLOAI == "DST");
                    var dtTUI = dtReRult.filter(e => e.PHANLOAI == "TUI");
                    var dtDiem = dtReRult.filter(e => e.PHANLOAI == null || e.PHANLOAI == "" );
                    dtDST.length ? $("#tblNhapDiem_DST").parent().parent().show() : $("#tblNhapDiem_DST").parent().parent().hide();
                    dtTUI.length ? $("#tblNhapDiem_Tui").parent().parent().show() : $("#tblNhapDiem_Tui").parent().parent().hide();
                    dtDiem.length ? $("#tblNhapDiem").parent().parent().show() : $("#tblNhapDiem").parent().parent().hide();
                    me.genTable_NhapDiem_DST(dtDST);
                    me.genTable_NhapDiem_Tui(dtTUI);
                    me.genTable_NhapDiem(dtDiem, data.Pager);
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
    save_NhapDiem: function (strId) {
        var me = this;
        //--Edit
        var objNhapDiem = me.dtNhapDiem.find(e => e.ID == strId);

        var obj_list = {
            'action': 'TP_PhucKhao/CapNhatThi_PhucKhao_KetQua',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strDiem': edu.util.getValById('txtDiem' + objNhapDiem.ID),
            'strThi_DanhSachThi_TuiBai_Id': objNhapDiem.ID,
            'strQLSV_NguoiHoc_Id': objNhapDiem.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': objNhapDiem.DAOTAO_HOCPHAN_ID,
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhapDiem_Id = "";
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_NhapDiem/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NhapDiem();
                });
            },
            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_NhapDiem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhapDiem",
            
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
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma"
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return me.formatDiem(aData.DIEM);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = me.formatDiem(aData.DIEMBANDAU);
                        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + v + '" name="' + v + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTinhTrang' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable("tblNhapDiem")
        data.forEach(e => me.getList_Diem(e, ""));
        data.forEach(e => getTinhTrang(e.ID));
        function getTinhTrang(strId) {
            me.getList_XacNhan(strId, "", data => {
                if (data.length > 0) $("#lblTinhTrang" + strId).html(data[0].TEN)
            }, me.strLoaiXacNhan)
        }
    },

    genTable_NhapDiem_DST: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhapDiem_DST",

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
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma"
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
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
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return me.formatDiem(aData.DIEM);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = me.formatDiem(aData.DIEMBANDAU);
                        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + v + '" name="' + v + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTinhTrang' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable("tblNhapDiem_DST")
        data.forEach(e => me.getList_Diem(e, "#tblNhapDiem_DST "));
        data.forEach(e => getTinhTrang(e.ID));
        function getTinhTrang(strId) {
            me.getList_XacNhan(strId, "", data => {
                if (data.length > 0) $("#tblNhapDiem_DST #lblTinhTrang" + strId).html(data[0].TEN)
            }, me.strLoaiXacNhan)
        }
    },

    genTable_NhapDiem_Tui: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhapDiem_Tui",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                //{
                //    "mDataProp": "QLSV_NGUOIHOC_MASO"
                //},
                //{
                //    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                //},
                //{
                //    "mDataProp": "QLSV_NGUOIHOC_TEN"
                //},
                {
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma"
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" name="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" />';
                //    }
                //},
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "TUI"
                },
                {
                    "mDataProp": "SOPHACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return me.formatDiem(aData.DIEM);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = me.formatDiem(aData.DIEMBANDAU);
                        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + v + '" name="' + v + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTinhTrang' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable("tblNhapDiem_Tui")
        data.forEach(e => me.getList_Diem(e, "#tblNhapDiem_Tui "));
        data.forEach(e => getTinhTrang(e.ID));
        function getTinhTrang(strId) {
            me.getList_XacNhan(strId, "", data => {
                if (data.length > 0) $("#tblNhapDiem_Tui #lblTinhTrang" + strId).html(data[0].TEN)
            }, me.strLoaiXacNhan)
        }
    },
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
                avatar: "",
                selectFirst: true
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
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4CS4iESkgLxEpNCIKKSAuBTQ4JDUP',
            'func': 'PKG_THI_PHACH_PHUCKHAO.LayHocPhanPhucKhaoDuyet',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_Diem: function (objNguoiHoc, strTable) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_PhucKhao/LayDiemPhucKhao',
            'type': 'GET',
            'strThi_DanhSachThi_TuiBai_Id': objNguoiHoc.ID,
            'strQLSV_NguoiHoc_Id': objNguoiHoc.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': objNguoiHoc.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    json.forEach(e => {
                        var x = $(strTable + "#txtDiem" + objNguoiHoc.ID);
                        var v = me.formatDiem(e.DIEM);
                        x.val(v);
                        x.attr("name", v);
                    })
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

    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_XacNhan/Them_Diem_XacNhan',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
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

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}