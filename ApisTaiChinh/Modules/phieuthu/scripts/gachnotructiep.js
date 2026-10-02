/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function GachNoTrucTiep() { };
GachNoTrucTiep.prototype = {
    dtGachNoTrucTiep: [],
    strGachNoTrucTiep_Id: '',

    init: function () {
        var me = this;

        $("#btnSearch").click(function (e) {
            me.getList_GachNoTrucTiep();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_GachNoTrucTiep();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_GachNoTrucTiep").click(function (e) {
            me.save_GachNoTrucTiep();
        });
        $("#btnSave_XacNhan").click(function (e) {
            var arrChecked_Id = $("#tblGachNoChiTiet tbody tr")
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i].id.replace(/checkX/g, ''));
            }
        });
        $("[id$=chkSelectAll_GachNoTrucTiep]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGachNoTrucTiep" });
        });
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });
        $("#btnXoaGachNoTrucTiep").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGachNoTrucTiep", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_GachNoTrucTiep(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_GachNoTrucTiep();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblGachNoTrucTiep").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strGachNoTrucTiep_Id = strId;
            me.toggle_edit();
            me.getList_ChiTiet();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGachNoTrucTiep_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGachNoTrucTiep", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strGachNoTrucTiep_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GachNoTrucTiep: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThanhToan_GachNo/TimThongTinTheoDonHang',
            'type': 'GET',
            'strMaDonHang': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;

                    me.getList_GachNoTrucTiepSV(dtReRult);
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
    getList_GachNoTrucTiepSV: function (dtGachNo) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThanhToan_GachNo/TimThongTinTheoMaSinhVien',
            'type': 'GET',
            'strSinhVien': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data.concat(dtGachNo);
                    me.dtGachNoTrucTiep = dtReRult;
                    me.genTable_GachNoTrucTiep(dtReRult, data.Pager);
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
    save_GachNoTrucTiep: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_Custom/ThucHienGachNo',
            'type': 'POST',
            'strThanhToan_DonHang_Id': me.strGachNoTrucTiep_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strGachNoTrucTiep_Id = "";
                    edu.system.alert("Thực hiện thành công!");
                    me.getList_ChiTiet();
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_GachNoTrucTiep();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: { strVal: edu.system.atob(JSON.stringify(obj_save), "chaolong") },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_XacNhan: function (strId) {
        var me = this;
        var iXacNhan = $("#checkX" + strId).is(":checked") ? 1 : 0;
        //--Edit
        var obj_save = {
            'action': 'TC_ThanhToan_GachNo/XacNhanThanhToan',
            'type': 'POST',
            'strId': strId,
            'dXacNhanThanhToan': iXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strGachNoTrucTiep_Id = "";
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChiTiet();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_GachNoTrucTiep: function (data, iPager) {
        var me = this;
        $("#lblGachNoTrucTiep_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGachNoTrucTiep",
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "MADONHANG_GUI_NGANHANG",
                },
                {
                    "mDataProp": "NGAYTAODONHANG"
                },
                {
                    "mDataProp": "HOVATENSINHVIEN"
                },
                {
                    "mDataProp": "MASINHVIEN"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    //"mDataProp": "SOTIENDAXACNHAN"
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENDAXACNHAN);
                    }
                },
                {
                    //"mDataProp": "SOTIENDATHANHTOAN"
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENDATHANHTOAN);
                    }
                },
                {
                    "mDataProp": "TINHTRANGGACHNO"
                },
                
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    getList_ChiTiet: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThanhToan_GachNo/LayDSChiTietDonHang',
            'type': 'GET',
            'strThanhToan_DonHang_Id': me.strGachNoTrucTiep_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChiTiet"] = dtReRult;
                    me.genTable_ChiTiet(dtReRult, data.Pager);
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
    genTable_ChiTiet: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGachNoChiTiet",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MADONHANG_GUI_NGANHANG"
                },
                {
                    "mDataProp": "KHOANTHU"
                },
                {
                    //"mDataProp": "SOTIEN"
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    //"mDataProp": "SOTIENDATHANHTOAN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENDATHANHTOAN);
                    }
                },
                {
                    "mDataProp": "NGAYTAO"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strCheck = aData.XACNHANTHANHTOAN == 1 ? 'checked="checked"' : '';
                        return '<input type="checkbox" id="checkX' + aData.ID + '" ' + strCheck + '/> ';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var iTong = 0;
        data.forEach(e => {
            if (e.XACNHANTHANHTOAN == 1) {
                iTong += e.SOTIEN;
            }
        })
        $("#tblGachNoChiTiet tfoot tr td:eq(3)").html(edu.util.formatCurrency(iTong))
        /*III. Callback*/
    },
}