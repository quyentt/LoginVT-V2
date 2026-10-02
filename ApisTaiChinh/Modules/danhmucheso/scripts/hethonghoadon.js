/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function HeThongHoaDon() { }
HeThongHoaDon.prototype = {
    dtHeThongHoaDon: [],
    strHeThongHoaDon_Id:'',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_HeThongHoaDon();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeThongHoaDon();
            }
        });
        $("#btnSearch_HeThongHoaDon").click(function () {
            me.getList_HeThongHoaDon();
        });
         /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order:
        -------------------------------------------*/
        $("#btnSave_HoaDon").click(function () {
            var valid = edu.util.validInputForm([
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
                //{ "MA": "txtGT_NoiDung", "THONGTIN1": "1" },
                //{ "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "1 },
                //{ "MA": "txtGT_SoNguoi", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Nam", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_HinhThuc", "THONGTIN1": "1" },
                { "MA": "txtMauSo_HD", "THONGTIN1": "1" }
            ]);
            if (valid) {
                me.save_HeThongHoaDon();
            }
        });
        $("#tblHoaDon").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHeThongHoaDon_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtHeThongHoaDon, "ID");
                if (data.length > 0) {
                    me.viewEdit_HeThongHoaDon(data[0]);
                } else {
                    edu.system.alert("Dữ liệu chọn không đúng", "w");
                }
                edu.util.setOne_BgRow(strId, "tblHoaDon");
            }
            else {
            }
        });
        $("#deleteHoaDon").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
            $("#btnYes").click(function (e) {
                me.delete_HeThongHoaDon();
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        
        me.toggle_form();
        me.getList_HeThongHoaDon();
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.MAUIN", "dropLoaiMau_HD");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHeThongHoaDon_Id = "";
        edu.util.viewValById("txtMaSoThue_HD", "");
        edu.util.viewValById("txtMauSo_HD", "");
        edu.util.viewValById("txtKyHieu_HD", "");
        edu.util.viewValById("txtDoDai_HD", "");
        edu.util.viewValById("txtNam_HD", "");
        edu.util.viewValById("txtSoKhoiTao_HD", "");
        edu.util.viewValById("dropLoaiMau_HD", "");
        edu.util.viewValById("txtSoDienThoai_HD", "");
        edu.util.viewValById("txtDiaChi_HD", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_HeThongHoaDon: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_HoaDon/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strLoaiHoaDon_Id': "",
            'strNguoiThucHien_Id': "",
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
                        me.dtHeThongHoaDon = dtResult;
                    }
                    me.genTable_HeThongHoaDon(dtResult, iPager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HeThongHoaDon: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_HoaDon/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strHeThongHoaDon_Id,
            'strMauso': edu.util.getValById('txtMauSo_HD'),
            'strKyHieu': edu.util.getValById('txtKyHieu_HD'),
            'dDoDaiHoaDon': edu.util.getValById('txtDoDai_HD'),
            'strNamApDung': edu.util.getValById('txtNam_HD'),
            'strMauIn_Id': edu.util.getValById('dropLoaiMau_HD'),
            'strSupplierTaxCode': edu.util.getValById('txtMaSoThue_HD'),
            'dSoKhoiTaoBanDau': edu.util.getValById('txtSoKhoiTao_HD'),
            'strSoDienThoai': edu.util.getValById('txtSoDienThoai_HD'),
            'strDiaChi': edu.util.getValById('txtDiaChi_HD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_HoaDon/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_HeThongHoaDon();
                    if (obj_save.strId == "") {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?', 's');
                        $("#btnYes").click(function (e) {
                            $(".btnReWrite").trigger("click");
                            $('#myModalAlert').modal('hide');
                        });
                    }
                    else {
                        edu.system.alert('Cập nhật thành công!', 's');
                    }
                }
                else {
                    edu.system.alert( obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HeThongHoaDon: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_HoaDon/Xoa',
            'versionAPI': 'v1.0',
            'strId': me.strHeThongHoaDon_Id
        };
        var obj = {};
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HeThongHoaDon();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HeThongHoaDon: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHoaDon_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblHoaDon",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeThongHoaDon.getList_HeThongHoaDon()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span> Mẫu số:' + edu.util.returnEmpty(aData.MAUSO) + "</span><br />";
                        html += '<span> Năm áp dụng:' + edu.util.returnEmpty(aData.NAMAPDUNG) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_HeThongHoaDon: function (data) {
        var me = this;
        edu.util.viewValById("txtMaSoThue_HD", data.SUPPLIERTAXCODE);
        edu.util.viewValById("txtMauSo_HD", data.MAUSO);
        edu.util.viewValById("txtKyHieu_HD", data.KYHIEU);
        edu.util.viewValById("txtDoDai_HD", data.DODAIHOADON);
        edu.util.viewValById("txtNam_HD", data.NAMAPDUNG);
        edu.util.viewValById("txtSoKhoiTao_HD", data.SOKHOITAOBANDAU);
        edu.util.viewValById("dropLoaiMau_HD", data.MAUIN_ID);
        edu.util.viewValById("txtSoDienThoai_HD", data.SODIENTHOAI);
        edu.util.viewValById("txtDiaChi_HD", data.DIACHI);
    },
};