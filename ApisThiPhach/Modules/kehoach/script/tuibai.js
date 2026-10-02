/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TuiBai() { };
TuiBai.prototype = {
    dtTuiBai: [],
    strTuiBai_Id: '',
    strPhach_Id: '',
    strTui_Id: '',
    strMonThi_Id: '',
    strMonThi_Ten: '',
    dtTuiThi: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGian();
        me.getList_TuiBai();
        edu.system.loadToCombo_DanhMucDuLieu("THI.PHACH.QUYTACTAOPHACH", "dropTaoPhach");
        edu.system.loadToCombo_DanhMucDuLieu("THI.PHACH.QUYTACTAOTUI", "dropTaoTui");
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();
        me.getList_HeDaoTao();

        $("#btnSearch").click(function (e) {
            me.getList_TuiBai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TuiBai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            if ($("#dropSearch_MonThi").val() == "") {
                edu.system.alert("Bạn cần chọn môn thi");
                return;
            }
            me.strMonThi_Id = $("#dropSearch_MonThi").val();
            me.strMonThi_Ten = $("#dropSearch_MonThi option:selected").text();
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_TuiBai").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_TuiBai();
            }
        });
        $("[id$=chkSelectAll_TuiBai]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTuiBai" });
        });
        $("[id$=chkSelectAll_ChuaGan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuaGan" });
        });
        $("[id$=chkSelectAll_DaGan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaGan" });
        });
        $("[id$=chkSelectAll_PhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi" });
        });
        $("#btnXoaTuiBai").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_TuiBai(me.strTuiBai_Id);
                me.toggle_form();
            });
        });
        $("#tblTuiBai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblTuiBai");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtTuiBai, "ID")[0];
                me.viewEdit_TuiBai(data);
                me.getList_QuyTacPhach(strId);
                me.getList_Thi(strId);
                me.getList_ThiChuaGan(strId);
                //me.getList_TuiThi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            me.toggle_edit();
        });

        $("#btnSaveChuaGan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_Thi(me.strTuiBai_Id, arrChecked_Id[i]);
                }
            });
        });
        $("#btnDeleteDaGan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaGan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Thi(arrChecked_Id[i]);
                }
            });
        });
        $("#btnDeleteTuiBai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_TuiThi(arrChecked_Id.toString());
            });
        });
        $("#btnDeleteSoPhach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_SoPhach(arrChecked_Id.toString());
            });
        });
        $("#btnDeleteDotPhach").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_TuiBai(me.strTuiBai_Id);
            });
            
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTuiBai_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblTuiThi").delegate('.btnDSSinhVien', 'click', function (e) {
            $('#myModal').modal('show');
            var strId = this.id;
            me.strTui_Id = strId;
            me.getList_QuanSoTheoLop(strId);
            console.log(strId);
            var objTuiThi = me.dtTuiThi.find(e => e.ID === strId);
            console.log(objTuiThi);
            $("#txtTenTui_Sua").val(edu.util.returnEmpty(objTuiThi.TEN));
            $("#txtSoBatDau_Sua").val(edu.util.returnEmpty(objTuiThi.SOPHACHBATDAU));
            $("#txtTienTo_Sua").val(edu.util.returnEmpty(objTuiThi.TIENTO));
        });
        $("#tblTuiBai").delegate('.btnDSThi', 'click', function (e) {
            $('#myModalDSThi').modal('show');
            me.getList_DSThi(this.id);
        });

        $("#tblTuiBai").delegate('.btnDSTuiThi', 'click', function (e) {
            me.toggle_view();
            var strId = this.id;
            var data = edu.util.objGetDataInData(strId, me.dtTuiBai, "ID")[0];
            me.viewEdit_TuiBai(data);
            me.getList_TuiThi(strId);
        });
        $("#btnSaveTuiSoPhach").click(function (e) {

            me.save_TuiThi();
        });
        $("#btnSaveSoPhach").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_SinhSoPhach(arrChecked_Id[i]);
            }
        });
        $("#btnXoaTuiThi").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_TuiThi(me.strTuiBai_Id);
            });
        });


        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_TuiBai();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {
            me.getList_TuiBai();
            me.getList_MonThi();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_HinhThucThi();
            me.getList_MonThi(); me.getList_TuiBai();
        });
        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi(); me.getList_TuiBai();
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            me.getList_DotThi();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_TuiBai", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.TuiBai.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiBai", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
        edu.system.getList_MauImport("zonebtnBaoCao_TuiBaiPhach", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.TuiBai.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strTuiBai_Id", e));
        });

        $("#btnAddTui").click(function (e) {
            $("#myModal_Tui").modal("show");
            $("#txtTenTui").val("");
            $("#txtSoBatDau").val("");
            $("#txtTienTo").val("");
            me.getList_DanhSachThi();
            me.getList_DanhSachThi_DaGan();
            me.getList_TuiTiepTheo();

        });
        $("#btnSave_Tui").click(function (e) {
            $("#myModal_Tui").modal("hide");
            me.save_Tui();

        });
        $("#btnSave_TaoTui").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu không?");
            $("#btnYes").click(function (e) {
                me.save_TaoTui(arrChecked_Id);
            });

        });
        $("#btnSave_SinhVien").click(function (e) {
            $("#myModal").modal("hide");
            me.update_Tui();

        });

        $("#txtTenTui").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            $("#tblPhongThi_DaGan tbody tr").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#txtSearch_ChuaGan").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            $("#tblChuaGan tbody tr").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });
        me.getList_PhanDoan();

        $("#btnSearchTest").click(function () {
            for (var i = 0; i < 1000; i++) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", 1000);
                me.getList_test();
            }

        });

        $("#btnAdd_SVChuaThem").click(function () {
            $("#myModalSVChuaThem").modal("show");
            me.getList_SVChuaThem();
        });
        $("#btnSave_SinhVienChuaThem").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVienChuaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_SVChuaThem(arrChecked_Id[i]);
            }

        });

        $("#btnDelete_SinhVien").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng ?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_SinhVien(arrChecked_Id[i]);
            }

        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strTuiBai_Id = "";
        me.strPhach_Id = "";
        $("#lblDotPhach").html($("#dropSearch_ThoiGian option:selected").text() + " - " + $("#dropSearch_DotThi option:selected").text() + " - " + me.strMonThi_Ten);

        edu.util.viewValById("txtTen", $("#dropSearch_ThoiGian option:selected").text() + " - " + $("#dropSearch_DotThi option:selected").text() + " - " + me.strMonThi_Ten);
        edu.util.viewValById("txtBuocNhay", "");
        edu.util.viewValById("txtSoBatDau", "");
        edu.util.viewValById("dropTaoTui", '');
        edu.util.viewValById("dropTaoPhach", '');
        $("#tblChuaGan tbody").html("");
        $("#tblDaGan tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_TuiBai();
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        this.getList_ThiChuaGan("");
        $("#lblHocPhan").html(me.strMonThi_Ten);
        $("#lblDotThi").html(me.strMonThi_Ten);
    },
    toggle_view: function () {
        edu.util.toggle_overide("zone-bus", "zoneView");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiBai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDotTaoPhach',
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
                    me.dtTuiBai = dtReRult;
                    me.genTable_TuiBai(dtReRult, data.Pager);
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
    save_TuiBai: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_DotPhach/ThemMoi',
            'type': 'POST',
            'strId': me.strTuiBai_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMa': edu.util.getValById('txtAAAA'),
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': me.strMonThi_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_list.strId != "") {
            obj_list.action = 'TP_DotPhach/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";
                    
                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                        var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
                        for (var i = 0; i < arrChecked_Id.length; i++) {
                            me.save_Thi(strTuiBai_Id, arrChecked_Id[i]);
                        }
                        me.toggle_form();
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId;
                    }
                    me.save_QuyTacPhach(strTuiBai_Id);

                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: obj_list.type,
            
            contentType: true,
            
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TuiBai: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_list = {
            'action': 'TP_DotPhach/Xoa',
            'type': 'POST',
            'strIds': strId,
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
                    me.getList_TuiBai();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
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
    genTable_TuiBai: function (data, iPager) {
        var me = this;
        $("#lblTuiBai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTuiBai",

            bPaginate: {
                strFuntionName: "main_doc.TuiBai.getList_TuiBai()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.THI_DOTTHI_TEN) + '</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSThi" id="' + aData.ID + '" title="Chi tiết"> Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSTuiThi" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_TuiBai: function (data) {
        var me = this;
        //View - Thong tin
        $("#lblDotPhach").html(edu.util.returnEmpty(data.THOIGIAN) + " - " + edu.util.returnEmpty(data.THI_DOTTHI_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_HOCPHAN_TEN));
        $("#lblTenDot").html(data.TEN);
        edu.util.viewValById("txtTen", data.TEN);
        $("#tblChuaGan tbody").html("");
        $("#tblDaGan tbody").html("");
        me.strMonThi_Id = data.DAOTAO_HOCPHAN_ID;
        me.strMonThi_Ten = data.DAOTAO_HOCPHAN_TEN;
        me.strTuiBai_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    getList_QuanSoTheoLop: function (strThi_TuiBai_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSNguoiHocTheoTuiBai',
            'type': 'GET',
            'strThi_TuiBai_Id': strThi_TuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager);
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
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    //"mDataProp": "SOPHACH",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TIENTO) + " " + edu.util.returnEmpty(aData.SOPHACH);
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "THI_DANHSACHTHI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyTacPhach: function (strDotPhach_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_QuyTacTu_SoPhach/ThemMoi',
            'type': 'POST',
            'strId': me.strPhach_Id,
            'dQuyTacTaoPhach_BuocNhay': edu.util.getValById('txtBuocNhay'),
            'dQuyTacTaoPhach_SoBatDau': edu.util.getValById('txtSoBatDau'),
            'strQuyTacTaoTui_Id': edu.util.getValById('dropTaoTui'),
            'strQuyTacTaoPhach_Id': edu.util.getValById('dropTaoPhach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strPhamViApDung_Id': strDotPhach_Id,
            'strNgayApDung': edu.util.getValById('txtAAAA'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuyTacPhach: function (strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_QuyTacTu_SoPhach/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQuyTacTui_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strQuyTacPhach_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuyTacPhach(dtReRult, data.Pager, strPhamViApDung_Id);
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
    genTable_QuyTacPhach: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        if (data.length > 0) {
            data = data[0];
            edu.util.viewValById("txtBuocNhay", data.QUYTACTAOPHACH_BUOCNHAY);
            edu.util.viewValById("txtSoBatDau", data.QUYTACTAOPHACH_SOBATDAU);
            edu.util.viewValById("dropTaoTui", data.QUYTACTAOTUI_ID);
            edu.util.viewValById("dropTaoPhach", data.QUYTACTAOPHACH_ID);

            $("#lblTuiThi").html(data.QUYTACTAOTUI_TEN + " - " + data.QUYTACTAOPHACH_TEN + " - " + data.QUYTACTAOPHACH_BUOCNHAY + " - " + data.QUYTACTAOPHACH_SOBATDAU);
            me.strPhach_Id = data.ID;
        } else {
            edu.util.viewValById("txtBuocNhay", '');
            edu.util.viewValById("txtSoBatDau", '');
            edu.util.viewValById("dropTaoTui", '');
            edu.util.viewValById("dropTaoPhach", '');
            me.strPhach_Id = "";
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    save_Thi: function (strDotPhach_Id, strThi_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_DotPhach_DST/ThemMoi',
            'type': 'POST',
            'strThi_DanhSachThi_Id': strThi_Id,
            'strThi_DotPhach_Id': strDotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_Thi("");
                    me.getList_Thi(strDotPhach_Id);
                    me.getList_ThiChuaGan(me.strTuiBai_Id)
                });
            },
            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Thi: function (strId) {
        var me = this;
        //--Edit
        var obj = {};

        var obj_list = {
            'action': 'TP_DotPhach_DST/Xoa',
            'type': 'POST',
            'strIds': strId,
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
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
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
                    me.getList_Thi("");
                    me.getList_Thi(me.strTuiBai_Id);
                    me.getList_ThiChuaGan(me.strTuiBai_Id)
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Thi: function (strThi_DotPhach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': strThi_DotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_Thi(dtReRult, data.Pager, "1");
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
    getList_ThiChuaGan: function (strThi_DotPhach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiChuaGanPhachTheoDotThi',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': me.strMonThi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_Thi(dtReRult, data.Pager);
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
    genTable_Thi: function (data, iPager, strThi_DotPhach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: strThi_DotPhach_Id ? "tblDaGan": "tblChuaGan",

            //bPaginate: {
            //    strFuntionName: "main_doc.TuiBai.getList_Thi('" + strThi_DotPhach_Id + "')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 1, 2, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "MADANHSACHTHI"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "THI_CATHI_TEN"
                },
                {
                    "mDataProp": "TKB_PHONGTHI_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CHISOBAODANHBATDAU) + ' --> ' + edu.util.returnEmpty(aData.CHISOBAODANHKETTHUC);
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strIDDanhSach = strThi_DotPhach_Id ? aData.THI_DOTPHACH_DANHSACHTHI_ID : aData.ID;
                        return '<input type="checkbox" id="checkX' + strIDDanhSach + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    save_DSThi: function (strDotPhach_Id, strThi_Id) {
        var me = this;
        //--Edit


        var obj_list = {
            'action': 'TP_DotPhach_DST/ThemMoi',
            'type': 'POST',
            'strThi_DanhSachThi_Id': strThi_Id,
            'strThi_DotPhach_Id': strDotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DSThi: function (strThi_DotPhach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': strThi_DotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DSThi(dtReRult, data.Pager, strThi_DotPhach_Id);
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
    genTable_DSThi: function (data, iPager, strThi_DotPhach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.TuiBai.getList_DSThi('" + strThi_DotPhach_Id + "')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MADANHSACHTHI"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    save_TuiThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_XuLy/TaoTuiBai_SinhSoPhach_NguoiHoc',
            'type': 'POST',
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId;
                    }
                    me.getList_TuiThi(me.strTuiBai_Id);
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_SinhSoPhach: function (strThi_TuiBai_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_XuLy/SinhSoPhachTheoTuiBai',
            'type': 'POST',
            'strThi_TuiBai_Id': strThi_TuiBai_Id,
            'strTHI_QuyTacPhanDoan_Id': edu.util.getValById('dropPhanDoan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strTuiBai_Id = obj_list.strId;
                    }
                    me.getList_TuiThi(me.strTuiBai_Id);
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_TuiBai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,

            contentType: true,

            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TuiThi: function (strId) {
        var me = this;
        //--Edit
        var obj = {};

        var obj_list = {
            'action': 'TP_TuiBai/Xoa',
            'type': 'POST',
            'strIds': strId,
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
                    me.toggle_form();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
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

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_SoPhach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};

        var obj_save = {
            'action': 'TP_XuLy/XoaSoPhachTheoTuiBai',
            'type': 'POST',
            'strThi_TuiBai_Id': strId,
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
                    me.getList_TuiThi();
                }
                else {
                    obj = {
                        content: "" + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: " " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DotPhach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};

        var obj_save = {
            'action': 'TP_ThongTin/Xoa_Thi_DotPhach',
            'type': 'POST',
            'strIds': strId,
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
                    me.getList_TuiThi();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
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
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TuiThi: function (strThi_DotPhach_Id) {
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
                    me.dtTuiThi = dtReRult;
                    me.genTable_TuiThi(dtReRult, data.Pager, me.strTuiBai_Id);
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
        var jsonForm = {
            strTable_Id: "tblTuiThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.TuiBai.getList_DSThi('" + strThi_DotPhach_Id + "')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 2,3, 4],
            },
            aoColumns: [
                {
                    "mData": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSSinhVien" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TEN) + '</a></span>';
                    }
                },
                {
                    "mDataProp": "SOBAI"
                },
                {
                    "mDataProp": "SOPHACHBATDAU"
                },
                {
                    "mDataProp": "SOPHACHKETTHUC"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSHeDaoTaoDuaTheoDot',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
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
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        };
        edu.system.loadToCombo_data(obj);
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
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
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
  --Discription: [2] GenHTML ThanhVien/NhanSu
  --ULR:  Modules
  -------------------------------------------*/

    save_Tui: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'TP_TuiBai/ThemMoi',
            'type': 'POST',
            'strMa': edu.util.getValById('txtAAAA'),
            'strTen': edu.util.getValById('txtTenTui'),
            'iThuTu': 1,
            'strTienTo': edu.util.getValById('txtTienTo'),
            'dSoBaiThi': -1,
            'dSoPhachBatDau': edu.util.getValById('txtSoBatDau'),
            'dSoPhachKetThuc': -1,
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                        //var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
                        //for (var i = 0; i < arrChecked_Id.length; i++) {
                        //    me.save_Thi(strTuiBai_Id, arrChecked_Id[i]);
                        //}
                        //me.toggle_form();
                        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                        arrChecked_Id.forEach(e => me.save_DanhSachThi(strTuiBai_Id, e));
                    }
                    me.getList_TuiThi();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: obj_save.type,

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_Tui: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'TP_TuiBai/CapNhat',
            'type': 'POST',
            'strId': me.strTui_Id,
            'strMa': edu.util.getValById('txtAAAA'),
            'strTen': edu.util.getValById('txtTenTui_Sua'),
            'iThuTu': 1,
            'strTienTo': edu.util.getValById('txtTienTo_Sua'),
            'dSoBaiThi': -1,
            'dSoPhachBatDau': edu.util.getValById('txtSoBatDau_Sua'),
            'dSoPhachKetThuc': -1,
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";
                    edu.system.alert("Cập nhật thành công!");
                    if (obj_save.strId == "") {
                        
                        strTuiBai_Id = data.Id;
                        //var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
                        //for (var i = 0; i < arrChecked_Id.length; i++) {
                        //    me.save_Thi(strTuiBai_Id, arrChecked_Id[i]);
                        //}
                        //me.toggle_form();
                    }
                    //var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                    //arrChecked_Id.forEach(e => me.save_DanhSachThi(strTuiBai_Id, e));

                    me.getList_TuiThi();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: obj_save.type,

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_TaoTui: function (arrCheck) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'TP_XuLy/TaoTui_SinhPhach_DST',
            'type': 'POST',
            'strTHI_QuyTacPhanDoan_Id': edu.util.getValById('dropPhanDoan2'),
            'strMa': edu.util.getValById('txtAAAA'),
            'strTen': edu.util.getValById('txtTenTui'),
            'iThuTu': 1,
            'strTienTo': edu.util.getValById('txtTienTo'),
            'dSoBaiThi': -1,
            'dSoPhachBatDau': edu.util.getValById('txtSoBatDau'),
            'dSoPhachKetThuc': -1,
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strThi_DanhSachThi_Id': arrCheck.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";
                    edu.system.alert("Thực hiện thành công!");
                    $("#myModal_Tui").modal("hide");
                    me.getList_TuiThi();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: obj_save.type,

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_DanhSachThi: function (strThi_TuiBai_Id, strThi_DanhSachThi_Id) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'TP_TuiBai_DST/Them_Thi_TuiBai_DST',
            'type': 'POST',
            'strThi_DanhSachThi_Id': strThi_DanhSachThi_Id,
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strThi_TuiBai_Id': strThi_TuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTuiBai_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strTuiBai_Id = data.Id;
                        //var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
                        //for (var i = 0; i < arrChecked_Id.length; i++) {
                        //    me.save_Thi(strTuiBai_Id, arrChecked_Id[i]);
                        //}
                        //me.toggle_form();
                    }
                    //var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                    //arrChecked_Id.forEach(e=> )
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: obj_save.type,

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DanhSachThi: function (strThi_TuiBai_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiChuaGanTuiTheoDotPhach',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strDaoTao_HocPhan_Id': me.strMonThi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DanhSachThi(dtReRult, data.Pager);
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
    genTable_DanhSachThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhongThi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MADANHSACHTHI"
                },
                {
                    "mDataProp": "PHONGTHI_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CHISOBAODANHBATDAU) + ' --> ' + edu.util.returnEmpty(aData.CHISOBAODANHKETTHUC);
                    }
                },
                {
                    "mDataProp": "NGAYTHI"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    delete_SinhVien: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TP_XuLy/Xoa_Thi_Tui_NH_ThuCong',
            'type': 'POST',
            'strThi_TuiBai_NguoiHoc_Id': Ids,
            'strThi_TuiBai_Id': me.strTui_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop(me.strTui_Id);
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_DanhSachThi_DaGan: function (strThi_TuiBai_Id) {
        var me = this;
        var objTui_Bai = me.dtTuiBai.find(e => me.strTuiBai_Id === e.ID);
        //--Edit
        var obj_list = {
            'action': 'TP_TuiBai/LayDSThi_TuiBai_DotThi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strThi_DotThi_Id': objTui_Bai.THI_DOTTHI_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DanhSachThi_DaGan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                console.log(er);
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
    genTable_DanhSachThi_DaGan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhongThi_DaGan",
            //bPaginate: {
            //    strFuntionName: "main_doc.TuiBai.getList_DanhSachThi_DaGan()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THI_DOTPHACH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "SOPHACHBATDAU"
                },
                {
                    "mDataProp": "SOPHACHKETTHUC"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_test: function (strThi_TuiBai_Id) {
        var me = this;
        //var objTui_Bai = me.dtTuiBai.find(e => me.strTuiBai_Id === e.ID);
        //--Edit
        var obj_list = {
            'action': 'TP_TuiBai/LayDSThi_TuiBai_DotThi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strThi_DotThi_Id': 'ca00f385bfeb422fbd270aefcbba7c89',
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DanhSachThi_DaGan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {
                console.log(er);
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_TangThem();
                });
            },
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_TuiTiepTheo: function (strThi_TuiBai_Id) {
        var me = this;
        var objTui_Bai = me.dtTuiBai.find(e => me.strTuiBai_Id === e.ID);
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTuiTiepTheoTrongDotThi',
            'type': 'GET',
            'strDaoTao_HocPhan_Id': objTui_Bai.DAOTAO_HOCPHAN_ID,
            'strThi_DotThi_Id': objTui_Bai.THI_DOTTHI_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.genTable_DanhSachThi_DaGan(dtReRult, data.Pager);
                    if (dtReRult.length > 0) {
                        $("#txtTenTui").val(edu.util.returnEmpty(dtReRult[0].TUITIEPTHEO));
                        $("#txtSoBatDau").val(edu.util.returnEmpty(dtReRult[0].SOPHACHTIEPTHEO));
                    }
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


    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanDoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ThongTin/LayDSQuyTacPhanDoan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_PhanDoan(json);
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
    cbGenCombo_PhanDoan: function (data) {
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
            renderPlace: ["dropPhanDoan", "dropPhanDoan2"],
            type: "",
            title: "Chọn phân đoạn",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) $("#dropPhanDoan").parent().show();
    },
    
    getList_SVChuaThem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TP_XuLy/LayDSNguoiHocChuaDonTui',
            'type': 'POST',
            'strThi_TuiBai_Id': me.strTui_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSVChuaThem"] = dtReRult;
                    me.genTable_SVChuaThem(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SVChuaThem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVienChuaThem",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanCTDT()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtTienTo' + aData.ID + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoPhach' + aData.ID + '" class="form-control" />';
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
        /*III. Callback*/
    },

    save_SVChuaThem: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TP_XuLy/Them_Thi_Tui_NH_ThuCong',
            'type': 'POST',
            'strThi_DanhSachSinhVien_Id': strId,
            'strThi_TuiBai_Id': me.strTui_Id,
            'strTienTo': edu.util.getValById('txtTienTo' + strId),
            'strSoPhach': edu.util.getValById('txtSoPhach' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop(me.strTui_Id);
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}