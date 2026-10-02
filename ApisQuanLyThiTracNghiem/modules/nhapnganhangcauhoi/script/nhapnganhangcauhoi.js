function nhapnganhangcauhoi() { };
nhapnganhangcauhoi.prototype = {   
    dtGroupQuestion: [],
    dtGroupQuestionDetail: [],    
    dtDapAn_All_Temp: [],
    dtMucPheDuyet: [],
    dtLoaiCauHoi:[],
    
    dtCauHoi_Temp:[],
    strGroupQuestionId: '',
    strGroupQuestionDetailId:'',
    strDepartOrganId: '',
     
    strQuestionTempId:'',
    
    strQuestionTypeCodeTemp: '',
    strNoiDungDapAnId: '',
    strMove_CauHoi_GroupQuestionDetailId: '',
    strMove_CauHoi_GroupQuestionDetailText: '',
    
    init: function () {
        var me = this;        
        me.page_load(); 
        $(".btnSearch_GroupQuestion").click(function () {
            me.getList_GroupQuestion();
        });
        $("#tblGroupQuestion").delegate(".btnGroupQuestion_Detail", "click", function () {
            var strId = this.id;
            me.strGroupQuestionId = strId;
            $("#btnAdd_DuaVaoNganHangDe").hide();
            var dt = edu.util.objGetDataInData(strId, me.dtGroupQuestion, "ID"); 
            me.getList_drpMucPheDuyet(); 
            $("#lblTenNhomCauHoi").html("");
            me.strGroupQuestionDetailId = "";
            me.getList_DapAn_All_Temp();
            //Set GroupQuestionDetail text for edit
            //me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            me.getList_CauHoi_Temp();
        });
        $(".btnSearch_CauHoi").click(function () {
            me.getList_CauHoi_Temp();
        });
        $("#txtSearch_CauHoi").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CauHoi_Temp();
            }

        });
        me.checkedCol_BgRow("tblDapAn_Temp"); 
        $(".btnDuyetCauHoi").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn câu hỏi cần duyệt?");
                return;
            }
            if (edu.util.getValById("drpMucPheDuyet") == '') {
                edu.system.alert("Chưa chọn mức phê duyệt");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn duyệt dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Duyet_QuestionTemp(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
            }, 2000);
        }); 
        $(".btnKhongDuyetDuyetCauHoi").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn câu hỏi cần duyệt?");
                return;
            }
            if (edu.util.getValById("drpMucPheDuyet") == '') {
                edu.system.alert("Chưa chọn mức phê duyệt");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn duyệt dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.KhongDuyet_QuestionTemp(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
            }, 2000);
        }); 
        $("#btnMauFileDoc").click(function () {
            me.report("MAUTEMPLATEIMPORT");
        });
        $("#btnAdd_DuaVaoNganHangDe").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn câu hỏi cần đưa vào NH đề?");
                return;
            }
           
            edu.system.confirm("Bạn có chắc chắn đưa vào NH đề?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.DuaCauHoiTmpVaoNH(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
            }, 2000);
        }); 
        $("#tblCauHoi_Temp").delegate(".btnEdit_Question_Temp", "click", function () {
            var strId = this.id;
            me.strQuestionTempId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtCauHoi_Temp, "ID");
            me.strQuestionTypeCodeTemp = dt[0].QUESTIONTYPECODE;

            $('#drpLoaiCauHoi_Temp').attr("disabled", true);

            if (dt.length > 0) { 
                me.rewrite_CauHoi_Temp();
                me.toggle_ChiTietCauHoiEdit_Temp();
                me.viewEdit_CauHoi_Temp(dt[0]);
                me.getList_DapAn_Temp(me.strQuestionTempId);

            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        }); 
        $("#drpDonVi").on("select2:select", function () {
           
            me.getList_GroupQuestion();
        });
        $("#drpMucPheDuyet").on("select2:select", function () {
            var dt = edu.util.objGetDataInData(edu.util.getValById("drpMucPheDuyet"), me.dtMucPheDuyet, "ID");
            if (dt.length > 0) {
                if (dt[0].ORDERS != "1")
                    $("#btnAdd_DuaVaoNganHangDe").hide();
                else
                    $("#btnAdd_DuaVaoNganHangDe").show();

            }
            else 
                $("#btnAdd_DuaVaoNganHangDe").hide();

            me.getList_DapAn_All_Temp();
            //Set GroupQuestionDetail text for edit
            //me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            me.getList_CauHoi_Temp();
        });
        
        $("#drpStatus").on("select2:select", function () {

            me.getList_GroupQuestion();
        });
        
        $(".btnClose_CauHoiTemp").click(function () {
            me.toggle_batdau_Temp();
        });
        $("#btnSave_CauHoi_Temp").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "drpDaoDapAn_Temp", "THONGTIN1": "EM" },
                { "MA": "drpMucDoCauHoi_Temp", "THONGTIN1": "EM" },
                { "MA": "drpTrangThaiCauHoi_Temp", "THONGTIN1": "EM" },
                { "MA": "txtDiemCong_Temp", "THONGTIN1": "EM" },
                { "MA": "drpLoaiCauHoi_Temp", "THONGTIN1": "EM" },

            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_Question_Temp();

        }); 
        $("#tblDapAn_Temp").delegate(".btnEdit_NoiDungDapAn_Temp", "click", function () {
            var strId = this.id;
            me.strNoiDungDapAnId = strId;
            if ($("#zoneCK_NoiDungDapAn_Temp" + strId).is(':visible'))
                $("#zoneCK_NoiDungDapAn_Temp" + strId).hide();
            else
                $("#zoneCK_NoiDungDapAn_Temp" + strId).show();
        });
        $(".btnClose_ThaoTac_GroupQuestionDetail").click(function () {
            me.toggle_batdau_ThaoTac_GroupQuestionDetail();
        });
        $("#btnSave_DapAn_Temp").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblDapAn_Temp", "checkX");

            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strAnswerId = arrChecked_Id[i];
                    var strCorrect = "0";
                    var strFixViTri = "0";
                    if ($("#chkFixViTri_Temp" + strAnswerId).is(":checked"))
                        strFixViTri = "1";
                    if (me.strQuestionTypeCodeTemp == "MULTICHOICE") {
                        if ($("#chkCorrect_Temp" + strAnswerId).is(":checked"))
                            strCorrect = "1";
                    }
                    if (me.strQuestionTypeCodeTemp == "BESTANSWER") {
                        if ($("#rdoCorrect_Temp" + strAnswerId).is(":checked"))
                            strCorrect = "1";
                    }
                    var strContent = CKEDITOR.instances['editor_DapAn_Temp' + strAnswerId].getData();
                    var strContent2 = edu.util.getValById("txtNoiDungDapAn_Ve2_Temp" + strAnswerId);
                    var strDiemDapAn = edu.util.getValById("txtDiemDapAn_Temp" + strAnswerId);
                    


                    var List = new Array();
                    $('#lstVe2_Temp' + strAnswerId + ' option:selected').each(function () {
                        List.push($(this).val());
                    });
                    var strAnswer_SencondId = List.join("#");
                    var strSymbol = "";
                    var strOrders = edu.util.getValById("txtOrders_Temp" + strAnswerId);

                    me.save_Answer_Temp(strAnswerId,
                        strContent,
                        strCorrect,
                        me.strQuestionTempId,
                        strContent2,
                        strAnswer_SencondId,
                        strSymbol,
                        strOrders,
                        strFixViTri,
                        strDiemDapAn);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
                //me.getandGenList_Answer_Temp();
            }, 2000);
        }); 
        $("#btnThem_DapAn_Temp").click(function () {
            if (me.strQuestionTempId == "") {
                edu.system.alert("Chưa chọn câu hỏi");
                return;
            }

            var strAnswerId = "";
            var strContent = CKEDITOR.instances['editor_txtContent_Temp'].getData();
            var strContent2 = edu.util.getValById("txtContent2_Temp");


            var strCorrect = "0";
            if ($("#chkDapAnDung_Temp").is(':checked') == true)
                strCorrect = "1";

            var strAnswer_SencondId = "";
            var strSymbol = "";
            var strDiemDapAn = "";
            var strOrders = edu.util.getValById("txtOrder_Temp");

            me.save_Answer_Temp(strAnswerId,
                strContent,
                strCorrect,
                me.strQuestionTempId,
                strContent2,
                strAnswer_SencondId,
                strSymbol,
                strOrders,
                strDiemDapAn);
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
                //me.getandGenList_Answer_Temp();
            }, 2000);

        });
        $("#btnXoa_DapAn_Temp").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDapAn_Temp", "checkX");

            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_Answer_Temp(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
                me.getList_DapAn_Temp(me.strQuestionTempId);
                //me.getandGenList_Answer_Temp();
            }, 2000);
        }); 
        $("#btnPreview_CauHoi_Temp").click(function () {
            me.toggle_edit_PreviewCauHoi_Temp();
        }); 
        $("[id$=chkSelectAll_CauHoi_Temp]").on("click", function () {
            me.checkedCol_BgRow("tblCauHoi_Temp");
        });
        $("#btnDelete_CauHoi_Temp").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_QuestionTemp(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
            }, 2000);
        });
        $("#btnCall_Import_DMIP").click(function () {

            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Bạn chưa chọn nhóm câu hỏi");
                return;
            }
            if (edu.util.getValById("drpMucPheDuyet") == '') {
                edu.system.alert("Chưa chọn mức phê duyệt");
                return;
            }
            if ($("#drpLoaiCauHoi_Imp").find('option:selected').val() == "") {
                edu.system.alert("Bạn chưa chọn loại câu hỏi");
                return;
            }
            me.popup_import();
        });
        $("#btnImport_DMIP_Doc").click(function () {
            me.import_DMIP_Doc();
        });
        $("#btnImport_DMIP_LaTeX").click(function () {
            me.import_DMIP_Doc();
        });
        $(".btnCloseImport").click(function () {
            me.toggle_batdau_Temp();
        });
        $("#btnAdd_CauHoi_Temp").click(function () {
            var strId = "";
            me.strQuestionTempId = "";
            $("#drpLoaiCauHoi_Temp").removeAttr("disabled");
            
            if (edu.util.getValById("drpMucPheDuyet") =='') {
                edu.system.alert("Chưa chọn mức phê duyệt");
                return;
            }
            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Chưa chọn nhóm câu hỏi");
                return;
            }
            me.rewrite_CauHoi_Temp(); 
            me.toggle_ChiTietCauHoiEdit_Temp();
            me.getList_DapAn_Temp(me.strQuestionTempId);
        }); 
        $("#btnIn_PreviewTemp").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu('zonePrintPreviewTemp');
        });
        $("[id$=chkSelectAll_Temp_TheoSoY]").on("click", function () {

            me.checkedCol_BgRow("tblCauHoi_Temp");

        });
         
    },
    page_load: function () {
        var me = this;
        
        edu.system.page_load();        
        CKEDITOR.replace('editor_nhomcauhoi');
        CKEDITOR.replace('editor_nhomcauhoi_Temp');
        CKEDITOR.replace('editor_GroupQuestionDetailContent');
        CKEDITOR.replace('editor_txtContent');
        CKEDITOR.replace('editor_txtContent_Temp');
        me.getList_drpMucDoCauHoi_Search();
        me.getList_drpLoaiCauHoi_Search();
        edu.system.uploadImport(["txtFile_DMIP"]);

        me.getList_drpDonVi();
        me.getList_GroupQuestion();
        me.getList_drpLoaiCauHoi_Imp();
        
        //$("#test1").html('<p><strong>Thiết bị n&agrave;o trong m&aacute;y t&iacute;nh c&oacute; nhiệm&nbsp;&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mn>333</mn></msqrt></math>&nbsp;vụ tải file hệ thống khi khởi động m&aacute;y t&iacute;nh?</strong></p><p><strong><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msubsup><mi>HC</mi><mn>3</mn><mn>3</mn></msubsup></math></strong></p>')
        // Hien thi cong thuc
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'test1']);

   
       
    }, 
    //#region GroupQuestion
    DuaCauHoiTmpVaoNH: function (strId) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/DuaCauHoiTmpVaoNH',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Import dữ liệu thành công!");
                }
                else {
                    edu.system.alert(JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(" (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            async: false,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
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
    getList_drpLoaiCauHoi_Imp: function () {
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
                    me.dtLoaiCauHoi = data.Data;
                    me.gen_drpLoaiCauHoi_Imp(data.Data);

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
    gen_drpLoaiCauHoi_Imp: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
            },
            renderPlace: ["drpLoaiCauHoi_Imp"],
            title: "--Chọn loại câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GroupQuestion: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),  
            'strStatus': edu.util.getValById('drpStatus'),
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtGroupQuestion = data.Data;
                    me.genTable_GroupQuestion(data.Data, data.Pager);
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
    genTable_GroupQuestion: function (data, iPager) {
        var me = this;
        $("#lblGroupQuestion_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGroupQuestion",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.nhapnganhangcauhoi.getList_GroupQuestion()",
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
                    "mDataProp": "GROUPQUESTIONCODE"
                },
                {
                    "mDataProp": "GROUPQUESTIONNAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.GROUPQUESTIONSTATUS == "0" ? "Ẩn" : "Hiện";
                    }
                },  
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnGroupQuestion_Detail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
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
    getList_drpLoaiCauHoi_Search: function (strQuestionTypeId) {
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
                    me.gen_drpLoaiCauHoi_Search(data.Data, strQuestionTypeId);

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
    gen_drpLoaiCauHoi_Search: function (data, strQuestionTypeId) {
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
    toggle_batdau_GroupQuestionDetail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneGroupQuestionDetail");
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
                    me.dtGroupQuestionDetail = dtResult;
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
        me.strMove_CauHoi_GroupQuestionDetailId = '';
        me.strMove_CauHoi_GroupQuestionDetailText = '';
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "PARENTID",
                name: "NAME",
                code: "CODE"
            },
            renderPlaces: ["zone_GroupQuestionDetail_treejs", "zone_Move_CauHoi_treejs"],
            style: "fa fa-user color-active"
        };


        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_GroupQuestionDetail_treejs').on("select_node.jstree", function (e, data) {
            var dt = edu.util.objGetDataInData(edu.util.getValById("drpMucPheDuyet"), me.dtMucPheDuyet, "ID");
            if (dt.length > 0) {
                if (dt[0].ORDERS != "1")
                    $("#btnAdd_DuaVaoNganHangDe").hide();
                else
                    $("#btnAdd_DuaVaoNganHangDe").show();
                
            }
            else
               
                    $("#btnAdd_DuaVaoNganHangDe").hide();

            $("#lblTenNhomCauHoi").html(data.node.text.toUpperCase());
            me.strGroupQuestionDetailId = data.node.id;
            me.getList_DapAn_All_Temp();
            //Set GroupQuestionDetail text for edit
            //me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            me.getList_CauHoi_Temp();
            

            //me.getList_AudioFiles();

        });
        $('#zone_Move_CauHoi_treejs').on("select_node.jstree", function (e, data) {
            me.strMove_CauHoi_GroupQuestionDetailId = data.node.id;
            me.strMove_CauHoi_GroupQuestionDetailText = data.node.text.toUpperCase();


        });
      

    },
    genTable_AudioFiles: function (data) {
        var me = this;
        var pConfig = Init_Prammater();
        var rootPathUploadFile = pConfig.rootPathUpload;

        var jsonForm = {
            strTable_Id: "tblAudioFiles",
            aaData: data,
            sort: true,
            colPos: {
                left: [1, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<audio controls title="' + aData.TENHIENTHI + '"> ' +
                            '    <source src="' + rootPathUploadFile + '/' + aData.DUONGDAN + '" type="audio/mpeg"> ' +

                            '</audio> ';
                    }
                },
                {
                    "mDataProp": "TENHIENTHI"
                },
                {
                    "mRender": function (nRow, aData) {

                        return '<a id="' + aData.ID + '" class="btn btn-default btnDelete_AudionFiles"><i class="fa fa-trash"></i> Xóa</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
  
    
     
    getList_CauHoi_Temp: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_CauHoi_Temp',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_CauHoi'),
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strStatus': edu.util.getValById('drpQuestionStatus'),
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Search'),
            'strLeVelId': edu.util.getValById('drpMucDoCauHoi_Search'),
            'strMucPheDuyetId': edu.util.getValById('drpMucPheDuyet'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCauHoi_Temp = data.Data;
                    
                    me.genTable_CauHoi_Temp(data.Data, data.Pager);
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
    genTable_CauHoi_Temp: function (data, iPager) {
        var me = this;
        $("#lblNhomCauHoi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCauHoi_Temp",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_CauHoi_Temp()",
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

                        var dt = edu.util.objGetDataInData(aData.ID, me.dtDapAn_All_Temp, "QUESTIONID");
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
                        return '<span>' + edu.util.returnEmpty(aData.PLUSMARK) + '/' + edu.util.returnEmpty(aData.MINUSMARK) + '</span>';
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
                        var strReturn = "<input type='checkbox' id='chkTINHDIEMTHEOSOY" + aData.ID + "' class='optcheckbox' name='chkTINHDIEMTHEOSOY" + aData.ID + " ' />";
                        if (aData.TINHDIEMTHEOSOY == "1")
                            strReturn = "<input type='checkbox'    id='chkTINHDIEMTHEOSOY" + aData.ID + "' checked class='optcheckbox' name='chkTINHDIEMTHEOSOY" + aData.ID + " ' />";
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit_Question_Temp" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblCauHoi_Temp']);
    },
     
     
    getList_DapAn_All_Temp: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_DapAn_All_Temp',
            'versionAPI': 'v1.0',
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDapAn_All_Temp = data.Data;

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
    rewrite_CauHoi_Temp: function () {
        var me = this;
        //edu.util.viewValById("txtNhomCauHoi", "");
        //CKEDITOR.instances['editor'].setData('');

        CKEDITOR.instances['editor_nhomcauhoi_Temp'].setData('');
        //edu.util.viewValById("drpTrangThaiCauHoi", "");
        //edu.util.viewValById("drpTrangThaiCauHoi", "");
        edu.util.viewValById("txtDiemCong_Temp", "");
        edu.util.viewValById("txtDiemTru_Temp", "");
        edu.util.viewValById("txtThoiGian_Temp", "");
        edu.util.viewValById("txtContent_Temp", "");
        edu.util.viewValById("txtOrder_Temp", "");
        edu.util.viewValById("txtOrderNumber_Temp", "");
        $("#drpDaoDapAn_Temp").val("").trigger("change");
        me.getList_drpLoaiCauHoi_Temp('');

        me.getList_drpMucDoCauHoi_Temp('');



    },
    toggle_ChiTietCauHoiEdit_Temp: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneChiTietCauHoiEdit_Temp");
    },
    viewEdit_CauHoi_Temp: function (data) {
        var me = this;
        //call popup --Edit     

        //edu.util.viewValById("txtNoiDungCauHoi", data.CONTENT);    

        setTimeout(function () {
            CKEDITOR.instances['editor_nhomcauhoi_Temp'].setData(data.CONTENT);

        }, 500);

        me.strQuestionTempId = data.ID;

        $("#drpTrangThaiCauHoi_Temp").val(data.STATUS).trigger("change");
        edu.util.viewValById("txtDiemCong_Temp", data.PLUSMARK);
        edu.util.viewValById("txtDiemTru_Temp", data.MINUSMARK);
        edu.util.viewValById("txtThoiGian_Temp", data.THOIGIAN);
        edu.util.viewValById("txtOrderNumber_Temp", data.ORDERNUMBER);
        $("#drpDaoDapAn_Temp").val(data.DAODAPAN).trigger("change");

        me.getList_drpMucDoCauHoi_Temp(data.QUESTIONLEVELID);
        me.getList_drpLoaiCauHoi_Temp(data.QUESTIONTYPEID);
    },
    getList_drpMucDoCauHoi_Temp: function (strLevelQuestionId) {
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
                    me.gen_drpMucDoCauHoi_Temp(data.Data, strLevelQuestionId);

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
    gen_drpMucDoCauHoi_Temp: function (data, strLevelQuestionId) {
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
            renderPlace: ["drpMucDoCauHoi_Temp"],
            title: "--Chọn mức độ--"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpLoaiCauHoi_Temp: function (strQuestionTypeId) {
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
                    me.gen_drpLoaiCauHoi_Temp(data.Data, strQuestionTypeId);

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
    gen_drpLoaiCauHoi_Temp: function (data, strQuestionTypeId) {
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
            renderPlace: ["drpLoaiCauHoi_Temp"],
            title: "--Chọn loại câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_DapAn_Temp: function (strQuestionTempId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_AnswerTempByQuestionId',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionTempId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_DapAn_Temp(data.Data, data.Pager);
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
    genTable_DapAn_Temp: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDapAn_Temp",
            aaData: data,
            colPos: {
                left: [1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtOrders_Temp' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='checkbox' id='chkFixViTri_Temp" + aData.ID + "' class='optcheckbox' name='chkFixViTri" + aData.ID + " ' />";
                        if (aData.FIXVITRI == "1")
                            strReturn = "<input type='checkbox'    id='chkFixViTri_Temp" + aData.ID + "' checked class='optcheckbox' name='chkFixViTri" + aData.ID + " ' />";
                        return strReturn;
                    }
                },
                {
                    //<!--3: MULTICHOICE-->
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='checkbox'    id='chkCorrect_Temp" + aData.ID + "' class='optcheckbox' name='chkCorrect_Temp" + aData.ID + " ' />";
                        if (aData.CORRECT == "1")
                            strReturn = "<input type='checkbox'    id='chkCorrect_Temp" + aData.ID + "' checked class='optcheckbox' name='chkCorrect_Temp" + aData.ID + " ' />";
                        return strReturn;

                    }
                },
                {
                    //<!--4: BESTANSWER-- >
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='radio'    id='rdoCorrect_Temp" + aData.ID + "' class='optcheckbox' name='rdoCorrect_Temp" + me.strQuestionTempId + " ' />";
                        if (aData.CORRECT == "1")
                            strReturn = "<input type='radio'    id='rdoCorrect_Temp" + aData.ID + "' checked class='optcheckbox' name='rdoCorrect_Temp" + me.strQuestionTempId + " ' />";
                        return strReturn;

                    }
                },
                {
                    //<!--5: -- >
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CONTENT)
                            + '<span><a class="btn btn-default btnEdit_NoiDungDapAn_Temp" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>'
                            + '<div id="zoneCK_NoiDungDapAn_Temp' + aData.ID + '"><textarea name="editor_DapAn_Temp' + aData.ID + '" id="editor_DapAn_Temp' + aData.ID + '"></textarea></div>';
                    }
                },
                {
                    //<!--6: CROSSLINK-- >
                    "mRender": function (nRow, aData) {
                        var lstVe2 = '<select id="lstVe2_Temp' + aData.ID + '" multiple="multiple" ></select>';
                        return lstVe2;
                    }
                },
                {
                    //<!--7: FILLTHEBLANK-- >
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtNoiDungDapAn_Ve2_Temp' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.CONTENT2) + '" class="form-control" />';
                    }
                },
                {
                    //<!--8: Điểm tự luận-- >
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtDiemDapAn_Temp' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.MARK) + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"  />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        for (var i = 0; i < data.length; i++) {
            CKEDITOR.replace('editor_DapAn_Temp' + data[i].ID);
            $("#zoneCK_NoiDungDapAn_Temp" + data[i].ID).hide();

            CKEDITOR.instances['editor_DapAn_Temp' + data[i].ID].setData(data[i].CONTENT);
            var strSelectId;
            if (data[i].ANSWER_SENCONDID != null)
                strSelectId = data[i].ANSWER_SENCONDID.split("#");
            me.getList_lstVe2Temp(me.strQuestionTempId, 'lstVe2_Temp' + data[i].ID, strSelectId);
        }
        me.getandGenList_Answer_Temp();
    },
    getandGenList_Answer_Temp: function () {
        var me = this; 
        $("#txtContent2_Temp").hide();
        if (me.strQuestionTempId != "")
            $('#drpLoaiCauHoi_Temp').attr("disabled", true);
        $("#zoneDapAn_Ve2_Temp").hide();
        if (me.strQuestionTypeCodeTemp == "CROSSLINK") {
            $("#zoneDapAn_Ve2_Temp").show();
            me.getList_DapAn_Ve2_Temp(me.strQuestionTempId);
        }
        if (me.strQuestionTypeCodeTemp == "FILLTHEBLANK") {
            $("#txtContent2_Temp").show();
        }

        var strcolHidden = "";
        if (me.strQuestionTypeCodeTemp == "BESTANSWER") {
            strcolHidden = "3,6,7,8";
        }
        if (me.strQuestionTypeCodeTemp == "MULTICHOICE" || me.strQuestionTypeCodeTemp == "TRUEFALSE" || me.strQuestionTypeCodeTemp == "TRUEFALSEONE") {
            strcolHidden = "4,6,7,8";
        }
        
        if (me.strQuestionTypeCodeTemp == "FREETEXT") {
            strcolHidden = "2,3,4,6,7";
        }
        if (me.strQuestionTypeCodeTemp == "CROSSLINK") {
            strcolHidden = "3,4,7,8";
        }
        if (me.strQuestionTypeCodeTemp == "FILLTHEBLANK") {
            strcolHidden = "3,4,6,8";
        }
 


        setTimeout(function () {
            //Ẩn cột sử dụng đối với bảng không sử dụng colspan và rowspan
            var x = $("#tblDapAn_Temp")[0].rows;
            for (var iCol = 0; iCol < x[0].cells.length; iCol++) {
                for (var i = 0; i < x.length; i++) {
                    x[i].cells[iCol].style.display = "";
                }
            }
            var colHidden;

            var arrcolHidden = strcolHidden.split(',');

            for (var iCol = 0; iCol < arrcolHidden.length; iCol++) {
                colHidden = arrcolHidden[iCol];
                for (var i = 0; i < x.length; i++) {
                    x[i].cells[colHidden].style.display = "none";
                }
            }
        }, 100);




    },
    getList_lstVe2Temp: function (strQuestionTempId, lstVe2Id, strSelectId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_Answer_SencondTemp',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionTempId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_lstVe2_Temp(data.Data, lstVe2Id, strSelectId);
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
    genTable_lstVe2_Temp: function (data, lstVe2Id, strSelectId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "CONTENT",
                code: "",
                avatar: "",
                default_val: strSelectId

            },
            renderPlace: [lstVe2Id],
            type: ""
        };
        edu.system.loadToCombo_data(obj);

        $("#" + lstVe2Id + " option[value='SELECTALL']").remove();
        //if (strSelectId != undefined)
        //$("#" + lstVe2Id).select2();
    },
    save_Question_Temp: function () {
        var me = this;
        var strTinhDiemTheoSoY = "0";
        if ($("#chkCachTinhDiemTheoSoY_Temp").is(":checked"))
            strTinhDiemTheoSoY = "1"
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_QuestionTemp',
            'versionAPI': 'v1.0',
            'strId': "",
            'strContent': CKEDITOR.instances['editor_nhomcauhoi_Temp'].getData(),
            'strStatus': edu.util.getValById('drpTrangThaiCauHoi_Temp'),
            'strPlusMark': edu.util.getValById('txtDiemCong_Temp'),
            'strMinusMark': edu.util.getValById('txtDiemTru_Temp'),
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Temp'),
            'strLevelId': edu.util.getValById('drpMucDoCauHoi_Temp'),
            'strDaoDapAn': edu.util.getValById('drpDaoDapAn_Temp'),
            'strTile': '',
            'strOrderNumber': edu.util.getValById("txtOrderNumber_Temp"),
            'strMucPheDuyetId': edu.util.getValById('drpMucPheDuyet'),
            'strThoiGian': edu.util.getValById('txtThoiGian_Temp'),
            'strTinhDiemTheoSoY': strTinhDiemTheoSoY,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strQuestionTempId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_QuestionTemp';
            obj_save.strId = me.strQuestionTempId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strQuestionTempId = data.Id;
                    me.getList_DapAn_All_Temp();
                    me.getList_CauHoi_Temp(); 
                    setTimeout(function () {
                        var dt = edu.util.objGetDataInData(me.strQuestionTempId, me.dtCauHoi_Temp, "ID");
                        console.log(dt[0].QUESTIONTYPECODE);
                        me.strQuestionTypeCodeTemp = dt[0].QUESTIONTYPECODE;
                        me.getandGenList_Answer_Temp();
                        edu.system.alert("Thực hiện thành công");
                    }, 1000);
                    
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
    toggle_batdau_Temp: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonebatdauGroupQuestionDetail");
    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    save_Answer_Temp: function (
        strAnswerId,
        strContent,
        strCorrect,
        strQuestionTempId,
        strContent2,
        strAnswer_SencondId,
        strSymbol,
        strOrders,
        strFixViTri,
        strDiemDapAn

    ) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_AnswerTemp',
            'versionAPI': 'v1.0',
            'strId': "",
            'strContent': strContent,
            'strCorrect': strCorrect,
            'strQuestionId': strQuestionTempId,
            'strContent2': strContent2,
            'strAnswer_SencondId': strAnswer_SencondId,
            'strSymbol': strSymbol,
            'strOrders': strOrders,
            'strFixViTri': strFixViTri,
            'strMark': strDiemDapAn,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strAnswerId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_AnswerTemp';
            obj_save.strId = strAnswerId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.util.viewValById("txtOrder_Temp", "");
                    CKEDITOR.instances['editor_txtContent_Temp'].setData('');
                    edu.util.viewValById("txtContent2_Temp", "");
                    me.getList_DapAn_Temp(strQuestionTempId);
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
    Xoa_Answer_Temp: function (strId) {
        var me = this;


        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_AnswerTemp',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(" (er): " + er);
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
    toggle_edit_PreviewCauHoi_Temp: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng cần xem?");
            return;
        }
        var strId = "";
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strId += arrChecked_Id[i] + ",";
        }
        strId = strId.substr(0, strId.length - 1);
        me.getList_PreviewCauHoi(
            strId,
            "zonePreviewTableQuestion_Temp"
        );

        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonePreviewCauHoi_TempEdit");
    },
    getList_PreviewCauHoi: function (strId,strZone) {

        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_PreviewCauHoi',
            'versionAPI': 'v1.0',
            'strId': strId, 
            'strZone': strZone,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    dtQuestion = data.Data.rsQuestion;
                    dtAnswer = data.Data.rsAnswer;
                    dtAnswer_Sencond = data.Data.rsAnswerSecond;


                    me.genTable_PreviewCauHoi(dtQuestion, dtAnswer, dtAnswer_Sencond, strZone);
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
    genTable_PreviewCauHoi: function (dtQuestion, dtAnswer, dtAnswer_Sencond, strZone) {

        $("#" + strZone + "").html('');

        //#region gen table  noi dung cau hoi
        var strContentQuestion = "";

        for (i = 0; i < dtQuestion.length; i++) {
            var ChiTietCauHoi = "";
            if (i < 9) {
                ChiTietCauHoi = "<b>Câu 0" + (i + 1) + "</b>";
            }
            else {
                ChiTietCauHoi = "<b>Câu " + (i + 1) + "</b>";
            }
            var dataTraLoi = edu.util.objGetDataInData(dtQuestion[i].QUESTIONID, dtAnswer, "QUESTIONID");



            strContentQuestion +=
                "<div class='bix-div-container' id='zoneContentQuestion" + dtQuestion[i].QUESTIONID + "' style = 'display:\"\"'  >"
                + "<label class='lbcauhoi' id='" + dtQuestion[i].QUESTIONID + "' style = 'font-size: 16pt; color:Red' > <u><b>" + ChiTietCauHoi + ": </b></u></label >"
                + "<span style='font-size: 16pt; color:Blue;'>" + dtQuestion[i].GUIDE + "</span>"
                + "<input type ='text'   id='QUESTIONTYPECODE" + dtQuestion[i].QUESTIONID + "'  value='" + dtQuestion[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                + "<div class='clearQuestion'></div>"
                + "<div class='clearQuestion'></div>"
                + "<label class='lbcauhoi'><span style='font-size: 18pt; margin-top:10px'>" + dtQuestion[i].CONTENT + "</span></label>"
                + "<div class='clearQuestion'></div>"
                + "<div class='clearQuestion' style='margin-bottom:0px'></div>"
                + "<label class='lbcauhoi' style='font-size: 16pt; color:#0066FF'><b>Câu trả lời:</b></label>"
                + "<div class='clearQuestion' style='margin-bottom:5px'></div>";

            //#region Dap An
            for (var j = 0; j < dataTraLoi.length; j++) {
                var ischecked = "";
                if (dataTraLoi[j].CORRECT == "1") {
                    ischecked = "checked";
                }
                else {
                    ischecked = "";
                }
                if (dtQuestion[i].QUESTIONTYPECODE == "BESTANSWER" || dtQuestion[i].QUESTIONTYPECODE == "TRUEFALSEONE") {

                    strContentQuestion += "<div class='radio'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + "<input type='radio' id='" + dataTraLoi[j].ANSWERID + "' " + " class='optradio' name='optradio" + dtQuestion[i].QUESTIONID
                        + "' value='" + dtQuestion[i].QUESTIONID + "' " + ischecked + " /> "
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                }
                if (dtQuestion[i].QUESTIONTYPECODE == "MULTICHOICE") {
                    strContentQuestion += "<div class='checkbox'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + "<input type='checkbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='optcheckbox' name='optcheckbox" + dtQuestion[i].QUESTIONID
                        + "' value='" + dtQuestion[i].QUESTIONID + "' " + ischecked + " /> "
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                }
                if (dtQuestion[i].QUESTIONTYPECODE == "CROSSLINK") {
                    var dataTraLoi_Ve2 = edu.util.objGetDataInData(dataTraLoi[j].QUESTIONID, dtAnswer_Sencond, "QUESTIONID");

                    var optValues = '<select id="' + dataTraLoi[j].ANSWERID + '" name="' + dataTraLoi[j].QUESTIONID + '" class="select-opt">' +
                        '<option id="" value="' + dataTraLoi[j].ANSWERID + '">--Chọn--</option>';
                    for (var iSTTCauVe2 = 0; iSTTCauVe2 < dataTraLoi_Ve2.length; iSTTCauVe2++) {
                        if (dataTraLoi[j].STUDENTANSWER_SENCOND_ID != "" &&
                            dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID == dataTraLoi[j].STUDENTANSWER_SENCOND_ID
                        )
                            optValues += '<option id="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" name="' + dataTraLoi[j].QUESTIONID + '"  value="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" selected="' + dataTraLoi[j].STUDENTANSWER_SENCOND_ID + '">' + dataTraLoi_Ve2[iSTTCauVe2].CONTENT + '</option>';
                        else
                            optValues += '<option id="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" name="' + dataTraLoi[j].QUESTIONID + '"  value="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" >' + dataTraLoi_Ve2[iSTTCauVe2].CONTENT + '</option>';
                    }
                    optValues += '</select>';

                    strContentQuestion += "<div class='radio'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' id='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + optValues
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                }
                if (dtQuestion[i].QUESTIONTYPECODE == "TRUEFALSE") {

                    var strSelectTrueFalse = "";
                    var strSelectTrue = "";
                    var strSelectFalse = "";
                    if (dataTraLoi[j].CORRECT == "1")
                        strSelectTrue = "selected";
                    else if (dataTraLoi[j].CORRECT == "0")
                        strSelectFalse = "selected";
                    else
                        strSelectTrueFalse = "selected";
                    // cau hoi true/false mac dinh khi khoi tao la 2
                    var optValues = "";
                    optValues = '<select id="' + dataTraLoi[j].ANSWERID + '" name="' + dataTraLoi[j].QUESTIONID + '" class="select-opt-truefalse">';
                    optValues += '<option id="CHON' + dataTraLoi[j].ANSWERID + '" name="' + dataTraLoi[j].QUESTIONID + '"  value="2" ' + strSelectTrueFalse + ' >Chọn</option>';
                    optValues += '<option id="DUNG' + dataTraLoi[j].ANSWERID + '" name="' + dataTraLoi[j].QUESTIONID + '"  value="1" ' + strSelectTrue + ' >Đúng</option>';
                    optValues += '<option id="SAI' + dataTraLoi[j].ANSWERID + '" name="' + dataTraLoi[j].QUESTIONID + '"  value="0" ' + strSelectFalse + '>Sai</option>';
                    optValues += "</select>";


                    strContentQuestion += "<div class='radio'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' id='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + optValues + dataTraLoi[j].CONTENT
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                }
                if (dtQuestion[i].QUESTIONTYPECODE == "FILLTHEBLANK") {
                    strContentQuestion += "<div class='textbox'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "<input type='textbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='opttextbox' name='opttextbox" + me.dtQuestion[i].QUESTIONID
                        + "' value='" + edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2) + "' /> "
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                }
                if (dtQuestion[i].QUESTIONTYPECODE == "FREETEXT") {
                    strContentQuestion += "<div class='radio'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                }


            }
            //#endregioin Dap An

            strContentQuestion += "<hr style='border-color:#2a2727; width:98%; margin-bottom:20px; margin-top:30px;' />";
            strContentQuestion += "</div>";

        }



        $("#" + strZone + "").html(strContentQuestion);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, strZone]);

    },
    toggle_batdau_ThaoTac_GroupQuestionDetail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonebatdauGroupQuestionDetail");
    },
    Xoa_QuestionTemp: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_QuestionTemp',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(" (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            async: false,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Duyet_QuestionTemp: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Duyet_QuestionTemp',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strMucPheDuyetId': edu.util.getValById('drpMucPheDuyet'),
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(" (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            async: false,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    KhongDuyet_QuestionTemp: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/KhongDuyet_QuestionTemp',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strMucPheDuyetId': edu.util.getValById('drpMucPheDuyet'),
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(" (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            async: false,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    import_DMIP_Doc: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ImportNganHangCauHoi_Temp_Doc',
            'versionAPI': 'v1.0',
            'GroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Imp'),
            'MucPheDuyetId': edu.util.getValById('drpMucPheDuyet'),
            'NguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                   
                    edu.system.viewFiles("txtFile_DMIP", "");
                    console.log(data.Data.Table1);
                    console.log(data.Data.Table2);
                    me.genTable_Import_View(data.Data.Table1, "tblImport_ThatBai");
                    me.genTable_Import_View(data.Data.Table2, "tblImport_ThanhCong");
                    me.toggle_import();
                    me.getList_DapAn_All_Temp();
                    setTimeout(function () {
                        me.getList_CauHoi_Temp();
                    }, 100); 

                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTTN_QuanLyNganHangCauHoi/ImportNganHangCauHoi_Temp(er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Import_View: function (data, strTable) {
        
        $("#" + strTable + "_Tong").html(data.length);
        var row = "";
        row += '<tr>';
        if (data == undefined || data.length == 0) return;
        for (var x in data[0]) {
            row += '<td>' + edu.util.returnEmpty(x) + '</td>';
        }
        row += '</tr>';
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
            }
            row += '</tr>';
        }
        $("#" + strTable + " tbody").html(row);
    },
    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneImport"); 

    },
    
    printPhieu: function (table_id) {
        var me = this;
        edu.extend.remove_PhoiIn(table_id);
        edu.util.printHTML(table_id);
        //  me.closePhieu();
    },
    getList_drpMucPheDuyet: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_MucPheDuyetByDonViUserId',
            'strUserId': edu.system.userId,
            'strDonViId': edu.util.getValById('drpDonVi')

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMucPheDuyet = data.Data;
                    
                    
                    me.genList_drpMucPheDuyet(data.Data);
                    if (me.dtMucPheDuyet.length == 0)
                        edu.system.alert('Bạn chưa được phân quyền mức nhập câu hỏi');
                    else {
                        me.toggle_batdau_GroupQuestionDetail();
                        //me.getList_DapAn_All_Temp();
                        me.getList_GroupQuestionDetail();
                    }
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
    genList_drpMucPheDuyet: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpMucPheDuyet"],
            type: "",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },
    report: function (strLoaiBaoCao) {
        var me = this;
        var strMau_LoaiCauHoiId = $("#drpLoaiCauHoi_Imp").find('option:selected').val();


        if (strLoaiBaoCao == "MAUTEMPLATEIMPORT" && strMau_LoaiCauHoiId == "") {
            edu.system.alert("Chưa chọn loại câu hỏi cần xuất mẫu");
            return;
        }
        if (strLoaiBaoCao == "MAUTEMPLATEIMPORT") {
            var dt1 = edu.util.objGetDataInData($("#drpLoaiCauHoi_Imp").find('option:selected').val(), me.dtLoaiCauHoi, "ID");

            var strUrl = "ApisQuanLyThiTracNghiem/Modules/Template/Template" + dt1[0].CODE + ".docx";
            window.open(strUrl);
            return;
        }

        
        var arrTuKhoa = [];
        var arrDuLieu = [];
        addKeyValue("MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId", strMau_LoaiCauHoiId);

        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);

        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Thông báo", "Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //alert(1);
        //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {
            console.log(111);
            var checked_status = $(this).is(':checked');
            var child = this.parentNode;
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            $("#" + strTable_Id + " tbody tr").each(function () {
                var arrcheck = $(this).find("td:eq(" + index + ")").find('input:checkbox');
                arrcheck.each(function () {
                    if ($(this).is(":hidden")) return;
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            });
        });
    },

}

