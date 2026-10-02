/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/ChuongTrinh
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ThanhPhanDiem() { };
ThanhPhanDiem.prototype = {
    treenode: '',
    strThanhPhanDiem_Id: '',
    dtTab: '',
    dtThanhPhanDiem: [],
    arrValid_ThanhPhanDiem: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThanhPhanDiem();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ThanhPhanDiem();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });

        $("#btnSave").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strThanhPhanDiem_Id)) {
                me.update_ThanhPhanDiem();
            }
            else {
                me.save_ThanhPhanDiem();
            }
        });


        $(".btnReWrite").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strThanhPhanDiem_Id)) {
                me.update_ThanhPhanDiem();
            }
            else {
                me.save_ThanhPhanDiem();
            }
            me.rewrite();
        });

        $("#dropSearch_ThangDiem").on("select2:select", function () {
            me.getList_ThanhPhanDiem();
        });
        $("#dropSearch_QuyTacLamTron").on("select2:select", function () {
            me.getList_ThanhPhanDiem();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThanhPhanDiem();

            }
        });

        $("#tblThanhPhanDiem").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThanhPhanDiem_Id = strId;
                me.getDetail_ThanhPhanDiem(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThanhPhanDiem");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#tblThanhPhanDiem").delegate(".btnDelete", "click", function (e) {
        //    e.stopImmediatePropagation()
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/delete_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
        //        $("#btnYes").click(function (e) {
        //            me.delete_ThanhPhanDiem(strId);
        //        });
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $(".btnSearch").click(function () {
            me.getList_ThanhPhanDiem("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_ThangDiem"), edu.util.getValById("dropSearch_QuyTacLamTron"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhPhanDiem", "checkThanhPhanDiem");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn điểm đặc biệt cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThanhPhanDiem(arrChecked_Id.toString());
            });
        });
        //$("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "lblThamSoHocTapChung_Tong" });
        //});

        $("[id$=chkSelectAll_ThanhPhanDiem]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThanhPhanDiem" });
        });
        $("#tblThanhPhanDiem").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThanhPhanDiem", regexp: /checkX/g, });
        });
        me.arrValid_ThanhPhanDiem = [
            { "MA": "txtTen", "THONGTIN1": "EM" },
            { "MA": "txtMa", "THONGTIN1": "EM" },
            { "MA": "txtThuTu", "THONGTIN1": "EM" },
            { "MA": "txtKyHieu", "THONGTIN1": "EM" },
            { "MA": "dropThangDiem", "THONGTIN1": "EM" },
            { "MA": "dropThiLai", "THONGTIN1": "EM" },
            { "MA": "dropLaDiemTongKet", "THONGTIN1": "EM" },
            { "MA": "dropLaThanhPhanDiemCuoi", "THONGTIN1": "EM" },
            { "MA": "txtSoLeSauDauphay", "THONGTIN1": "EM" },
            { "MA": "dropLamTron", "THONGTIN1": "EM" },
            { "MA": "dropQuyTacLamTron", "THONGTIN1": "EM" },
            { "MA": "txtGiaTriMacDinh", "THONGTIN1": "EM" },
        ];

        edu.system.loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM", "dropSearch_ThangDiem, dropThangDiem");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACLAMTRON", "dropSearch_QuyTacLamTron, dropQuyTacLamTron");
    },
    page_load: function () {
        var me = this;

        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_ThanhPhanDiem();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThanhPhanDiem");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_ThanhPhanDiem");
    },


    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThanhPhanDiem_Id = "";
        edu.util.viewValById("dropThangDiem", edu.util.getValById('dropSearch_ThangDiem'));
        edu.util.viewValById("dropQuyTacLamTron", edu.util.getValById('dropSearch_QuyTacLamTron'));
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtKyHieu", "");
        edu.util.viewValById("dropThiLai", "");
        edu.util.viewValById("dropLaDiemTongKet", "");
        edu.util.viewValById("dropLaThanhPhanDiemCuoi", "");
        edu.util.viewValById("txtSoLeSauDauphay", "");
        edu.util.viewValById("dropLamTron", "");
        edu.util.viewValById("dropLapDSThi", 0);
        edu.util.viewValById("txtGiaTriMacDinh", "");
    },

    save_ThanhPhanDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/Them_Diem_ThanhPhanDiem',
            

            'strId': "",
            'strMa': edu.util.getValById("txtMa"),
            'strTen': edu.util.getValById("txtTen"),
            'dCoChoPhepThiLai': edu.util.getValById("dropThiLai"),
            'strThangDiem_Id': edu.util.getValById("dropThangDiem"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaDiemTongKet': edu.util.getValById("dropLaDiemTongKet"),
            'dLaThanhPhanDiemCuoi': edu.util.getValById("dropLaThanhPhanDiemCuoi"),
            'dSoLeSauDauPhay': edu.util.getValById("txtSoLeSauDauphay"),
            'dCoLamTron': edu.util.getValById("dropLamTron"),
            'dChoPhepLapDanhSachThi': edu.util.getValById('dropLapDSThi'),
            'strQuyTacLamTron_Id': edu.util.getValById("dropQuyTacLamTron"),
            'dGiaTriMacDinhChuaCoDiem': edu.util.getValById("txtGiaTriMacDinh"),
            'dThuTu': edu.util.getValById("txtThuTu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                        $("#txtTen").focus();
                    });
                    setTimeout(function () {
                        me.getList_ThanhPhanDiem();
                    }, 50);
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/ThemMoi: " + data.Message);
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
    update_ThanhPhanDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/Sua_Diem_ThanhPhanDiem',
            

            'strId': me.strThanhPhanDiem_Id,
            'strMa': edu.util.getValById("txtMa"),
            'strTen': edu.util.getValById("txtTen"),
            'dCoChoPhepThiLai': edu.util.getValById("dropThiLai"),
            'strThangDiem_Id': edu.util.getValById("dropThangDiem"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaDiemTongKet': edu.util.getValById("dropLaDiemTongKet"),
            'dLaThanhPhanDiemCuoi': edu.util.getValById("dropLaThanhPhanDiemCuoi"),
            'dSoLeSauDauPhay': edu.util.getValById("txtSoLeSauDauphay"),
            'dCoLamTron': edu.util.getValById("dropLamTron"),
            'dChoPhepLapDanhSachThi': edu.util.getValById('dropLapDSThi'),
            'strQuyTacLamTron_Id': edu.util.getValById("dropQuyTacLamTron"),
            'dGiaTriMacDinhChuaCoDiem': edu.util.getValById("txtGiaTriMacDinh"),
            'dThuTu': edu.util.getValById("txtThuTu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThanhPhanDiem_Id = me.strThanhPhanDiem_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_ThanhPhanDiem();
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("D_ThanhPhanDiem/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhPhanDiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThanhPhanDiem/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strThangDiem_Id': edu.util.getValById("dropSearch_ThangDiem"),
            'strQuyTacLamTron_Id': edu.util.getValById("dropSearch_QuyTacLamTron"),
            'dLaThanhPhanDiemCuoi': -1,
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_ThanhPhanDiem(dtResult, iPager);
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
    getDetail_ThanhPhanDiem: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThanhPhanDiem/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThanhPhanDiem(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //getDetail_ChuongTrinh_Full: function (strId, strAction) {
    //    var me = this;
    //    edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID", me.viewEdit_ChuongTrinh);
    //},
    delete_ThanhPhanDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThanhPhanDiem/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
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
                
                me.getList_ThanhPhanDiem();
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
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_ThanhPhanDiem: function (data, iPager) {
        var me = this;
        $("#lblThanhPhanDiem_Tong").html(iPager);
        //edu.util.viewHTMLById("lblThanhPhanDiem_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblThanhPhanDiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThanhPhanDiem.getList_ThanhPhanDiem()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 2, 3, 4, 6, 7, 8],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên thành phần điểm: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Thang điểm: ' + edu.util.returnEmpty(aData.THANGDIEM_TEN) + "</span><br />";
                //        html += '<span>' + 'Số lẻ sau dấu phẩy: ' + edu.util.returnEmpty(aData.SOLESAUDAUPHAY) + "</span><br />";
                //        html += '<span>' + 'Giá trị mặc định: ' + edu.util.returnEmpty(aData.GIATRIMACDINHKHICHUACODIEM) + "</span><br />";
                //        html += '<span>' + 'Quy tắc làm tròn: ' + edu.util.returnEmpty(aData.QUYTACLAMTRON_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THANGDIEM_TEN"
                },
                {
                    "mDataProp": "SOLESAUDAUPHAY"
                },
                {
                    "mDataProp": "GIATRIMACDINHKHICHUACODIEM"
                },
                {
                    "mDataProp": "QUYTACLAMTRON_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.CHOPHEPLAPDANHSACHTHI ? "Cho phép lập danh sách thi" : "Không cho phép lập danh sách thi";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkThanhPhanDiem' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_ThanhPhanDiem: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtKyHieu", data.KYHIEU);
        edu.util.viewValById("dropThangDiem", data.THANGDIEM_ID);
        edu.util.viewValById("dropThiLai", data.COCHOPHEPTHILAI);
        edu.util.viewValById("dropLaDiemTongKet", data.LADIEMTONGKET);
        edu.util.viewValById("dropLaThanhPhanDiemCuoi", data.LATHANHPHANDIEMCUOI);
        edu.util.viewValById("txtSoLeSauDauphay", data.SOLESAUDAUPHAY);
        edu.util.viewValById("dropLamTron", data.COLAMTRON);
        edu.util.viewValById("dropLapDSThi", data.CHOPHEPLAPDANHSACHTHI);
        edu.util.viewValById("dropQuyTacLamTron", data.QUYTACLAMTRON_ID);
        edu.util.viewValById("txtGiaTriMacDinh", data.GIATRIMACDINHKHICHUACODIEM);
    },
};