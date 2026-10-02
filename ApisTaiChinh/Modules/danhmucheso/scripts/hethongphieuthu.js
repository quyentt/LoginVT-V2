/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function HeThongPhieuThu() { }
HeThongPhieuThu.prototype = {
    dtHeThongPhieuThu: [],
    strHeThongPhieuThu_Id:'',

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
            me.getList_HeThongPhieuThu();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeThongPhieuThu();
            }
        });
        $("#btnSearch_HeThongPhieuThu").click(function () {
            me.getList_HeThongPhieuThu();
        });
         /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order:
        -------------------------------------------*/
        $("#btnSave_PhieuThu").click(function () {
            var valid = edu.util.validInputForm([
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
                //{ "MA": "txtGT_NoiDung", "THONGTIN1": "1" },
                //{ "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "1 },
                //{ "MA": "txtGT_SoNguoi", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Nam", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_Thang", "THONGTIN1": "1" },
                //{ "MA": "txtGT_HinhThuc", "THONGTIN1": "1" },
                { "MA": "txtMauSo_PT", "THONGTIN1": "1" }
            ]);
            if (valid) {
                me.save_HeThongPhieuThu();
            }
        });
        $("#tblPhieuThu").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHeThongPhieuThu_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtHeThongPhieuThu, "ID");
                if (data.length > 0) {
                    me.viewEdit_HeThongPhieuThu(data[0]);
                } else {
                    edu.system.alert("Dữ liệu chọn không đúng", "w");
                }
                edu.util.setOne_BgRow(strId, "tblPhieuThu");
            }
            else {
            }
        });
        $("#deletePhieuThu").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
            $("#btnYes").click(function (e) {
                me.delete_HeThongPhieuThu();
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        
        me.toggle_form();
        me.getList_HeThongPhieuThu();
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.MAUIN", "dropLoaiMau_PT");
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
        me.strHeThongPhieuThu_Id = "";
        edu.util.viewValById("txtMauSo_PT", "");
        edu.util.viewValById("txtKyHieu_PT", "");
        edu.util.viewValById("txtDoDaiQuyen_PT", "");
        edu.util.viewValById("txtDoDaiPhieuThu_PT", "");
        edu.util.viewValById("txtNam_PT", "");
        edu.util.viewValById("txtSoKhoiTao_PT", "");
        edu.util.viewValById("dropLoaiMau_PT", "");
        edu.util.viewValById("txtSoPhieu_PT", "");
        edu.util.viewValById("txtSoDienThoai_PT", "");
        edu.util.viewValById("txtDiaChi_PT", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_HeThongPhieuThu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_PhieuThu/LayDanhSach',
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
                        me.dtHeThongPhieuThu = dtResult;
                    }
                    me.genTable_HeThongPhieuThu(dtResult, iPager);
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
    save_HeThongPhieuThu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_PhieuThu/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strHeThongPhieuThu_Id,
            'strMauSo': edu.util.getValById('txtMauSo_PT'),
            'strKyHieuQuyen': edu.util.getValById('txtKyHieu_PT'),
            'dSoPhieuThuTrongQuyen': edu.util.getValById('txtSoPhieu_PT'),
            'dDoDaiQuyen': edu.util.getValById('txtDoDaiQuyen_PT'),
            'dDoDaiPhieuThu': edu.util.getValById('txtDoDaiPhieuThu_PT'),
            'dSoKhoiTaoBanDau': edu.util.getValById('txtSoKhoiTao_PT'),
            'strNam': edu.util.getValById('txtNam_PT'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strMauIn_Id': edu.util.getValById('dropLoaiMau_PT'),
            'strSoDienThoai': edu.util.getValById('txtSoDienThoai_PT'),
            'strDiaChi': edu.util.getValById('txtDiaChi_PT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_PhieuThu/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_HeThongPhieuThu();
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
    delete_HeThongPhieuThu: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_PhieuThu/Xoa',
            'versionAPI': 'v1.0',
            'strId': me.strHeThongPhieuThu_Id
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
                    me.getList_HeThongPhieuThu();
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
    genTable_HeThongPhieuThu: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblPhieuThu_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblPhieuThu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeThongPhieuThu.getList_HeThongPhieuThu()",
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
    viewEdit_HeThongPhieuThu: function (data) {
        var me = this;
        edu.util.viewValById("txtMauSo_PT", data.MAUSO);
        edu.util.viewValById("txtKyHieu_PT", data.KYHIEUQUYEN);
        edu.util.viewValById("txtDoDaiQuyen_PT", data.DODAIQUYEN);
        edu.util.viewValById("txtDoDaiPhieuThu_PT", data.DODAIPHIEUTHU);
        edu.util.viewValById("txtNam_PT", data.NAM);
        edu.util.viewValById("txtSoKhoiTao_PT", data.SOKHOITAOBANDAU);
        edu.util.viewValById("dropLoaiMau_PT", data.MAUIN_ID);
        edu.util.viewValById("txtSoPhieu_PT", data.SOPHIEUTHUTRONGQUYEN);
        edu.util.viewValById("txtSoDienThoai_PT", data.SODIENTHOAI);
        edu.util.viewValById("txtDiaChi_PT", data.DIACHI);
    },
};