function taodethucong() { };
taodethucong.prototype = {
    strDeThiThuCongId: '',
    strGroupQuestionId:'',
    dtDeThiThuCong: [],
    dtDapAn_All: [],
    dtCauHoi:[],


    init: function () {
        var me = this;
        me.page_load();
        //#region Examstruct 
        $(".btnSearch_DeThiThuCong").click(function () {
            me.getList_DeThiThuCong();
        });
        $("[id$=chkSelectAll_DanhSachCauHoiDeThiThuCong]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDanhSachCauHoiDeThiThuCong" });
        });
        $("[id$=chkSelectAll_CauHoi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCauHoi" });
        });
        $("#drpDonVi").on("select2:select", function () {
            me.getList_drpGroupQuestion();
        });
        $("#btnAdd_Dethithucong").click(function () {
            if (edu.util.getValById("drpDonVi") == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }

            me.strDeThiThuCongId = "";
            me.getList_drpGroupQuestionEdit("");
            me.rewrite_ThongTinDeThiThuCong();
            me.toggle_edit_ThongTinDeThiThuCong();

        });
        $("#btnSave_DeThiThuCong").click(function () {

            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtSoDeThiThuCong", "THONGTIN1": "EM" },
                { "MA": "txtTenDeThiThuCong", "THONGTIN1": "EM" },
                { "MA": "drpGroupQuestionEdit", "THONGTIN1": "EM" },
                { "MA": "drpThongTinDeThiThuCongStatusEdit", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_DeThiThuCong();



        });

        $("#btnIn_IndeThi").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnDelete_DeThiThuCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeThiThuCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_DeThiThuCong(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DeThiThuCong();
            }, 2000);
        });
        $("#btnPreview_CauHoi").click(function () {
           
        }); 
        $("#btnDelete_CauHoiDeThiThuCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhSachCauHoiDeThiThuCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_CauHoiDeThiThuCong(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DanhSachCauHoiDeThiThuCong();
            }, 2000);
        });
        $("#tblDeThiThuCong").delegate(".btnDeThiThuCong_Edit", "click", function () {

            var strId = this.id;
            me.strDeThiThuCongId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtDeThiThuCong, "ID");
            me.getList_drpGroupQuestionEdit(dt[0].GROUPQUESTIONID);
            me.rewrite_ThongTinDeThiThuCong();
            me.toggle_edit_ThongTinDeThiThuCong();
            me.viewEdit_DeThiThuCong(dt[0]);

        });
        $("#tblDeThiThuCong").delegate(".btnWritenExam", "click", function () {
            var strId = this.id;
            me.strDeThiThuCongId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtDeThiThuCong, "ID");
             
            $("#lblDonViDeThi").html(dt[0].DEPARTORGANNAME);
            $("#lblBoDeDeThi").html(dt[0].NAME);
            $("#lblGroupQuestionDeThi").html(dt[0].GROUPQUESTIONNAME);
            me.toggle_batdau_DeThi();
            me.strGroupQuestionId = dt[0].GROUPQUESTIONID;
            // me.getList_GroupQuestionDetail();
            me.getList_drpDeThiThu(dt[0].SODETAO);
            me.getList_GroupQuestionDetail();

        });
        $("#btnAdd_ThemVaoDeThiThuCong").click(function () {
            if (edu.util.getValById("drpDeThiThu") == "") {
                edu.system.alert("Chưa chọn đề thi");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Them_CauHoiDeThiThuCong(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DanhSachCauHoiDeThiThuCong();
            }, 2000);
             

        });

        $("#btnSave_CapNhatCauHoiDeThiThucng").click(function () {
            if (edu.util.getValById("drpDeThiThu") == "") {
                edu.system.alert("Chưa chọn đề thi");
                return;
            } 
            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblDanhSachCauHoiDeThiThuCong", "checkX"); 
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strOrder = edu.util.getValById("txtOrders" + arrChecked_Id[i]);                    
                    me.Sua_CauHoiDeThiThuCong(arrChecked_Id[i], strOrder);
                }
            });
            setTimeout(function () {
                me.getList_DanhSachCauHoiDeThiThuCong();
            }, 2000);


        });
        $("#btnClose_ChiTietDeThi").click(function (e) {
           // e.stopImmediatePropagation();
            me.closeChiTietDeThi();
        });
        $("#btnPreview_DeThi").click(function () {
            if (edu.util.getValById("drpDeThiThu") == "") {
                edu.system.alert("Chưa chọn đề thi");
                return;
            } 
            //e.stopImmediatePropagation();
            $("#zoneDeThi").hide();
            $("#zoneChiTietDeThi").slideDown();
            me.gen_ChiTietDeThi();


        });


        $("#drpDeThiThu").on("select2:select", function () {
            me.getList_DanhSachCauHoiDeThiThuCong();
        });

        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpDonVi();
        me.getList_drpGroupQuestion();
        me.getList_drpLoaiCauHoi();
        me.getList_drpMucDoCauHoi_Search();


    },
    rewrite_ThongTinDeThiThuCong: function () {
        var me = this;

        $("#lblDonVi").html($("#drpDonVi option:selected").text());
        edu.util.viewValById("txtTenDeThiThuCong", "");
        edu.util.viewValById("txtSoDeThiThuCong", "");
        $("#drpThongTinDeThiThuCongEdit").val("").change();

    },
    closeChiTietDeThi: function () {
        var me = this;
        $("#zoneDeThi").show();
        $("#zoneChiTietDeThi").slideUp();
    },
    toggle_edit_ThongTinDeThiThuCong: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneThongTinDeThiThuCong");
    },
    viewEdit_DeThiThuCong: function (dt) {
        var me = this;
        $("#lblDonVi").html(dt.DEPARTORGANNAME);
        edu.util.viewValById("txtTenDeThiThuCong", dt.NAME);
        edu.util.viewValById("txtSoDeThiThuCong", dt.SODETAO);
        $("#drpThongTinDeThiThuCongStatusEdit").val(dt.STATUS).change();
    },

    getList_drpDonVi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_DonViByUserId',
            'strUserId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDonVi(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpGroupQuestion: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strStatus': edu.util.getValById('drpStatus'),
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpGroupQuestion(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAME",
                code: "GROUPQUESTIONNAME",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpDeThiThu: function (SoDeTao) {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CacDeThi',
            'versionAPI': 'v1.0',
            'strSoDeTao': SoDeTao, 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 

                    me.gen_drpDeThiThu(data.Data);
                  

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpDeThiThu: function (data) {
        var me = this;
       
        var obj = {
            data: data,
            renderInfor: {
                id: "DeThiThu",
                name: "DeThiThu",
                code: "DeThiThu",
                order: "unorder"
            },
            renderPlace: ["drpDeThiThu"],
            title: "Chọn đề"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpGroupQuestionEdit: function (strExamStructGroupQuestionId) {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strStatus': edu.util.getValById('drpStatus'),
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpGroupQuestionEdit(data.Data, strExamStructGroupQuestionId);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestionEdit: function (data, strExamStructGroupQuestionId) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAME",
                code: "GROUPQUESTIONNAME",
                order: "unorder",
                default_val: strExamStructGroupQuestionId
            },
            renderPlace: ["drpGroupQuestionEdit"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_DeThiThuCong: function () {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_DeThiThuCong',
            'versionAPI': 'v1.0',
            'strId': "",
            'strName': edu.util.getValById('txtTenDeThiThuCong'),
            'strSoDeTao': edu.util.getValById('txtSoDeThiThuCong'),
            'strStatus': edu.util.getValById('drpThongTinDeThiThuCongStatusEdit'),
            'strDepartOrganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestionEdit'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strDeThiThuCongId != "") {
            obj_save.action = 'QLTTN_QuanLyBoDe/Sua_DeThiThuCong';
            obj_save.strId = me.strDeThiThuCongId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_DeThiThuCong();
                    me.strDeThiThuCongId = data.ID;
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },

    toggle_batdau_DeThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneDeThi");
    },
    getList_DeThiThuCong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_DeThiThuCong',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion'),
            'strStatus': edu.util.getValById('drpStatus'),
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDeThiThuCong = data.Data;
                    me.genTable_DeThiThuCong(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    genTable_DeThiThuCong: function (data, iPager) {
        var me = this;
        $("#lblExamStruct_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeThiThuCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.taodethucong.getList_DeThiThuCong()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                },
                {
                    "mDataProp": "SODETAO"
                },
                {
                    "mDataProp": "GROUPQUESTIONNAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.STATUS == "0" ? "Ẩn" : "Hiện";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDeThiThuCong_Edit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnWritenExam" id="' + aData.ID + '" title="Đề thi"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
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
    Xoa_DeThiThuCong: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_DeThiThuCong',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GroupQuestionDetail: function () {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestionDetail',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strGroupQuestionId': me.strGroupQuestionId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 1000000,

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
                     
                    me.genTreeJs_GroupQuestionDetail(dtResult, iPager);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    genTreeJs_GroupQuestionDetail: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "PARENTID",
                name: "NAME",
                code: "CODE"
            },
            renderPlaces: ["zone_GroupQuestionDetail_treejs"],
            style: "fa fa-user color-active"
        };

        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_GroupQuestionDetail_treejs').on("select_node.jstree", function (e, data) {

            $("#lblTenNhomCauHoi").html(data.node.text.toUpperCase());
            me.strGroupQuestionDetailId = data.node.id;
            me.getList_DapAn_All();
            //Set GroupQuestionDetail text for edit
             
            me.getList_CauHoi();
              

        });

    },
    getList_drpLoaiCauHoi: function (strQuestionTypeId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_LoaiCauHoi',
            'versionAPI': 'v1.0',
            'strQuestionTypeId': ''

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpLoaiCauHoi(data.Data, strQuestionTypeId);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpLoaiCauHoi: function (data, strQuestionTypeId) {
        var me = this;
        if (strQuestionTypeId == undefined) strQuestionTypeId = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
                default_val: strQuestionTypeId
            },
            renderPlace: ["drpLoaiCauHoi_Search"],
            title: "--Chọn loại câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpMucDoCauHoi_Search: function (strLevelQuestionId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_MucDoCauHoi',
            'versionAPI': 'v1.0',
            'strLevelQuestionId': ''

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpMucDoCauHoi_Search(data.Data, strLevelQuestionId);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpMucDoCauHoi_Search: function (data, strLevelQuestionId) {
        var me = this;
        if (strLevelQuestionId == undefined) strLevelQuestionId = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
                default_val: strLevelQuestionId
            },
            renderPlace: ["drpMucDoCauHoi_Search"],
            title: "--Chọn mức độ--"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_DapAn_All: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_DapAn_All',
            'versionAPI': 'v1.0',
            'strGroupQuestionDetailId': me.strGroupQuestionId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDapAn_All = data.Data;

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
            async: false,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_CauHoi: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_CauHoi',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_CauHoi'),
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strStatus': edu.util.getValById('drpQuestionStatus'),
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Search'),
            'strLeVelId': edu.util.getValById('drpMucDoCauHoi_Search'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCauHoi = data.Data;
                    me.genTable_CauHoi(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    genTable_CauHoi: function (data, iPager) {
        var me = this;
        $("#lblNhomCauHoi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCauHoi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.taodethucong.getList_CauHoi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                left: [1, 2, 3],
                center: [4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "ORDERNUMBER"
                },
                {
                    "mDataProp": "CONTENT"
                },
                {
                    "mRender": function (nRow, aData) {

                        var dt = edu.util.objGetDataInData(aData.ID, me.dtDapAn_All, "QUESTIONID");
                        var row = "";
                        for (var i = 0; i < dt.length; i++) {
                            row += '<span>' + dt[i].ORDERABC + dt[i].CONTENT + '</span>  </br>';
                        }

                        return row;
                    }
                },
                {
                    "mDataProp": "SODAPAN"
                },
                {
                    "mDataProp": "TENLOAICAUHOI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + aData.TENMUCDOCAUHOI + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + aData.PLUSMARK + '/' + aData.MINUSMARK + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var vDapAn = aData.DAODAPAN == "1" ? "Có" : "Không";
                        return '<span>' + vDapAn + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strTrangThai = aData.STATUS == "1" ? "Đang dùng" : "Không dùng";
                        return '<span>' + strTrangThai + '</span>';

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var SOLUOTDATHI = aData.SOLUOTDATHI_CHUALUU + aData.SOLUOTDATHI_DALUU;
                        return '<span>' + SOLUOTDATHI + '</span>';
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
    getList_DanhSachCauHoiDeThiThuCong: function () {
        var me = this; 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauHoiDeThiThuCong',
            'versionAPI': 'v1.0',  
            'strDeThiThu': edu.util.getValById('drpDeThiThu'),
            'strWritenExamId': me.strDeThiThuCongId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_DanhSachCauHoiDeThiThuCong(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    genTable_DanhSachCauHoiDeThiThuCong: function (data, iPager) {
        var me = this;
        $("#lblTongCauHoiDeThi").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhSachCauHoiDeThiThuCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.taodethucong.getList_DanhSachCauHoiDeThiThuCong()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                left: [1, 2, 3],
                center: [4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                { 
                     "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtOrders' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                    }
                },
                {
                    "mDataProp": "CONTENT"
                },
                {
                    "mRender": function (nRow, aData) {

                        var dt = edu.util.objGetDataInData(aData.ID, me.dtDapAn_All, "QUESTIONID");
                        var row = "";
                        for (var i = 0; i < dt.length; i++) {
                            row += '<span>' + dt[i].ORDERABC + dt[i].CONTENT + '</span>  </br>';
                        }

                        return row;
                    }
                },
                {
                    "mDataProp": "SODAPAN"
                },
                {
                    "mDataProp": "TENLOAICAUHOI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + aData.TENMUCDOCAUHOI + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + aData.PLUSMARK + '/' + aData.MINUSMARK + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var vDapAn = aData.DAODAPAN == "1" ? "Có" : "Không";
                        return '<span>' + vDapAn + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strTrangThai = aData.STATUS == "1" ? "Đang dùng" : "Không dùng";
                        return '<span>' + strTrangThai + '</span>';

                    }
                } ,
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
    Them_CauHoiDeThiThuCong: function (strQuestionId) {
        var me = this;

        //--Edit
       
        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_CauHoiDeThiThuCong',
            'versionAPI': 'v1.0',
            'strWritenExamId': me.strDeThiThuCongId,
            'strDethithu': edu.util.getValById("drpDeThiThu"),
            'strQuestionId': strQuestionId,
            'strNguoithuchien_id': edu.system.userId,
        }; 
        
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Sua_CauHoiDeThiThuCong: function (strId, strOrders) {
        var me = this;

        //--Edit

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Sua_CauHoiDeThiThuCong',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strOrders': strOrders, 
            'strNguoithuchien_id': edu.system.userId,
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Xoa_CauHoiDeThiThuCong: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_CauHoiDeThiThuCong',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    gen_ChiTietDeThi: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_DeThiThuCongThu',
            'versionAPI': 'v1.0',
            'strWritenExamId': me.strDeThiThuCongId,
            'strDeThiThuCongThu': edu.util.getValById("drpDeThiThu"),
        };
        $("#ChiTietDeThiPreview").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data);
                    $("#ChiTietDeThiPreview").html(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("ChiTietDeThiPreview");
        edu.util.printHTML('ChiTietDeThiPreview');

        me.closePhieu();
    },
    
}

