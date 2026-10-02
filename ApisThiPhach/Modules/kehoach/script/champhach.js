/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChamPhach() { };
ChamPhach.prototype = {
    dtTuiBai: [],
    dtChamPhach: [],
    strChamPhach_Id: '',
    strTuiBai_Id: '',
    strLoaiXacNhan: '',
    dAction: 0,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        //me.getList_TuiBai();
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();


        $("#btnSearch").click(function (e) {
            me.dAction = 0;
            me.getList_ChamPhach();
        });
        $("#btnSearchDS").click(function (e) {
            me.dAction = 1;
            me.getList_LayNgauNhien();
        });
        $("#btnSearchKetQua").click(function (e) {
            me.dAction = 2;
            me.getList_KetQua();
        });
        //$("#txtSearch").keypress(function (e) {
        //    if (e.which === 13) {
        //        me.getList_TuiBai();
        //    }
        //});
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        //$("#btnSave_ChamPhach").click(function (e) {
        //    var valid = edu.util.validInputForm(me.arrValid);

        //    if (valid) {
        //        me.save_ChamPhach();
        //    }
        //});
        $("[id$=chkSelectAll_ChamPhach]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChamPhach" });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTuiThi" });
        });
        

        $("#btnSave_ChamPhach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChamPhach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ChamPhach(arrChecked_Id[i]);
                }
            });

            
        });
        $("#btnDelete_ChamPhach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChamPhach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChamPhach(arrChecked_Id[i]);
                }
            });
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtChamPhach_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        

        $('#dropSearch_DSThi').on('select2:select', function (e) {
            me.getList_ChamPhach();
            //me.getList_TuiBai();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            //me.getList_TuiBai();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            //me.getList_TuiBai();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            //me.getList_TuiBai();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            //me.getList_TuiBai();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            //me.getList_TuiBai();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            //me.getList_TuiBai();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_ChamPhach", function (addKeyValue) {
            addKeyValue("strThoiGian_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strLoaiDiem_Id", edu.util.getValCombo("dropSearch_LoaiDiem"));
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.ChamPhach.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChamPhach", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
        
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ChamPhach: function () {
        var me = this;
        switch (me.dAction) {
            case 1: me.getList_LayNgauNhien(); return;
            case 2: me.getList_KetQua(); return;
        }
        //--Edit
        var obj_list = {
            'action': 'TP_ChamKiemTra/LayDSTheoTui',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChamPhach = dtReRult;
                    me.genTable_ChamPhach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LayNgauNhien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ChamKiemTra/LayDSNgauNhienTheoTui',
            'type': 'GET',
            'dTyLePhanTram': edu.util.getValById('txtSearchPhanTram') ? edu.util.getValById('txtSearchPhanTram'): -1,
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChamPhach = dtReRult;
                    me.genTable_ChamPhach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_KetQua: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ChamKiemTra/LayDSTheoTuiChamKT',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChamPhach = dtReRult;
                    me.genTable_ChamPhach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_ChamPhach: function (strId) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'TP_ChamKiemTra/Them_Thi_DSSV_Tui_ChamKT',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strChamPhach_Id = "";
                    
                    edu.system.alert("Thực hiện thành công!");

                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
                
            },
            type: obj_save.type,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChamPhach();
                });
            },
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ChamPhach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_list = {
            'action': 'TP_ChamKiemTra/Xoa_Thi_DSSV_Tui_ChamKT',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_ChamPhach();
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: obj_list.type,
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChamPhach();
                });
            },
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ChamPhach: function (data, iPager) {
        var me = this;
        $("#lblChamPhach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChamPhach",

            //bPaginate: {
            //    strFuntionName: "main_doc.ChamPhach.getList_ChamPhach()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "SOPHACH"
                },
                {
                    "mDataProp": "DIEMBANDAU"
                },
                {
                    "mDataProp": "THONGTINXULY"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_ChamPhach: function (data) {
        var me = this;
        //View - Thong tin
        $("#lblTenDot").html(edu.util.returnEmpty(data.MADANHSACHTHI) + " - " + edu.util.returnEmpty(data.NGAYTHI) + " - " + edu.util.returnEmpty(data.THI_CATHI_TEN) + " - " + edu.util.returnEmpty(data.TKB_PHONGTHI_TEN));
        
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSTuiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TuiThi(dtReRult, data.Pager);
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
    genTable_TuiThi: function (data, iPager, strThi_DotPhach_Id) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DSThi"],
            type: "",
            title: "Chọn danh sách thi",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_DSThi", data[0].ID);
            me.getList_ChamPhach();
        }
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
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
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
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
    cbGenCombo_DotThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MonThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MonThi(json);
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
    cbGenCombo_MonThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                }
            },
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayLoaiDiem',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDiem(json);
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
    cbGenCombo_LoaiDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HinhThucThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HinhThucThi(json);
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
    cbGenCombo_HinhThucThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        main_doc.ChamPhach.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
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