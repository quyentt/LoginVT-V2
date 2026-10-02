/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function HeThongBienLai() { }
HeThongBienLai.prototype = {
    dtHeThongBienLai: [],
    strHeThongBienLai_Id: '',

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
            me.getList_HeThongBienLai();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeThongBienLai();
            }
        });
        $("#btnSearch_HeThongBienLai").click(function () {
            me.getList_HeThongBienLai();
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_BienLai").click(function () {
            var valid = edu.util.validInputForm([
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
                //{ "MA": "txtGT_NoiDung", "THONGTIN1": "1" },
                //{ "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "1 },
                //{ "MA": "txtGT_SoNguoi", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Nam", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_HinhThuc", "THONGTIN1": "1" },
                { "MA": "txtMauSo_BL", "THONGTIN1": "1" }
            ]);
            if (valid) {
                me.save_HeThongBienLai();
            }
        });
        $("#tblBienLai").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHeThongBienLai_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtHeThongBienLai, "ID");
                if (data.length > 0) {
                    me.viewEdit_HeThongBienLai(data[0]);
                } else {
                    edu.system.alert("Dữ liệu chọn không đúng", "w");
                }
                edu.util.setOne_BgRow(strId, "tblBienLai");
            }
            else {
            }
        });
        $("#deleteBienLai").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
            $("#btnYes").click(function (e) {
                me.delete_HeThongBienLai();
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        
        me.toggle_form();
        me.getList_HeThongBienLai();
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.MAUIN", "dropLoaiMau_BL");
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
        me.strHeThongBienLai_Id = "";
        edu.util.viewValById("txtMauSo_BL", "");
        edu.util.viewValById("txtKyHieu_BL", "");
        edu.util.viewValById("txtDoDaiQuyen_BL", "");
        edu.util.viewValById("txtDoDaiBienLai_BL", "");
        edu.util.viewValById("txtNam_BL", "");
        edu.util.viewValById("txtSoKhoiTao_BL", "");
        edu.util.viewValById("dropLoaiMau_BL", "");
        edu.util.viewValById("txtSoPhieu_BL", "");
        edu.util.viewValById("txtSoDienThoai_BL", "");
        edu.util.viewValById("txtDiaChi_BL", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_HeThongBienLai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_BienLai/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
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
                        me.dtHeThongBienLai = dtResult;
                    }
                    me.genTable_HeThongBienLai(dtResult, iPager);
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
    save_HeThongBienLai: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_BienLai/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strHeThongBienLai_Id,
            'strMauSo': edu.util.getValById('txtMauSo_BL'),
            'strKyHieuQuyen': edu.util.getValById('txtKyHieu_BL'),
            'dSoBienLaiTrongQuyen': edu.util.getValById('txtSoPhieu_BL'),
            'dDoDaiQuyen': edu.util.getValById('txtDoDaiQuyen_BL'),
            'dDoDaiBienLai': edu.util.getValById('txtDoDaiBienLai_BL'),
            'dSoKhoiTaoBanDau': edu.util.getValById('txtSoKhoiTao_BL'),
            'strNam': edu.util.getValById('txtNam_BL'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strMauIn_Id': edu.util.getValById('dropLoaiMau_BL'),
            'strSoDienThoai': edu.util.getValById('txtSoDienThoai_BL'),
            'strDiaChi': edu.util.getValById('txtDiaChi_BL'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_BienLai/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_HeThongBienLai();
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
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    delete_HeThongBienLai: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_BienLai/Xoa',
            'versionAPI': 'v1.0',
            'strId': me.strHeThongBienLai_Id
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
                    me.getList_HeThongBienLai();
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
    genTable_HeThongBienLai: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblBienLai_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblBienLai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeThongBienLai.getList_HeThongBienLai()",
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
                        html += '<span>Mẫu số: ' + edu.util.returnEmpty(aData.MAUSO) + "</span><br />";
                        html += '<span>Năm áp dụng: ' + edu.util.returnEmpty(aData.NAM) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_HeThongBienLai: function (data) {
        var me = this;
        edu.util.viewValById("txtMauSo_BL", data.MAUSO);
        edu.util.viewValById("txtKyHieu_BL", data.KYHIEUQUYEN);
        edu.util.viewValById("txtDoDaiQuyen_BL", data.DODAIQUYEN);
        edu.util.viewValById("txtDoDaiBienLai_BL", data.DODAIBIENLAI);
        edu.util.viewValById("txtNam_BL", data.NAM);
        edu.util.viewValById("txtSoKhoiTao_BL", data.SOKHOITAOBANDAU);
        edu.util.viewValById("dropLoaiMau_BL", data.MAUIN_ID);
        edu.util.viewValById("txtSoPhieu_BL", data.SOBIENLAITRONGQUYEN);
        edu.util.viewValById("txtSoDienThoai_BL", data.SODIENTHOAI);
        edu.util.viewValById("txtDiaChi_BL", data.DIACHI);
    },
};