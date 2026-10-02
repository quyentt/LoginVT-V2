function quanlybode() { };
quanlybode.prototype = {    
    strExamStructId: '',
    strExamStructPartId: '',
    dtExamStruct: [],
    dtExamStructPart: [],
    dtExamStructDetail: [],
    dtAllExamStructDetail: [],
    dtLoaiCauHoi: [],
    dtCauHoiTuNganHang:[],
    strTapHopCacCauHoi:'',
    dtWritenExam: [],
    strGroupQuestionId: '',
    strGroupQuestionDetailId: '',
    init: function () {
        var me = this;
        me.page_load();
        console.log(edu.system.rootPathReport);
        console.log(edu.system.rootPathReport);
        //#region Examstruct
        $(".btnSearch_ExamStruct").click(function () {
            me.getList_ExamStruct();            
        });
        $("#drpDonVi").on("select2:select", function () {
            me.getList_drpGroupQuestion();
        });
        $("#btnAdd_ExamStruct").click(function () {
            if (edu.util.getValById("drpDonVi") == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }

            me.strExamStructId = "";
            me.getList_drpExamStructGroupQuestion("");
            me.rewrite_ExamStruct();
            me.toggle_edit_ExamStruct();

        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#btnSave_ExamStruct").click(function () {


            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtExamStructName", "THONGTIN1": "EM" },
                { "MA": "drpExamStructGroupQuestion", "THONGTIN1": "EM" },
                { "MA": "drpExamStructStatus", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_ExamStruct();
        });
        $("#tblExamStruct").delegate(".btnExamStruct_Edit", "click", function () {
            var strId = this.id;
            me.strExamStructId = strId;
            

            var dt = edu.util.objGetDataInData(strId, me.dtExamStruct, "ID");
            me.getList_drpExamStructGroupQuestion(dt[0].GROUPQUESTIONID);
            me.rewrite_ExamStruct();
            me.toggle_edit_ExamStruct();
            me.viewEdit_GroupQuestion(dt[0]);

        });
        $("#btnDelete_ExamStruct").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblExamStruct", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_ExamStruct(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_ExamStruct();                
            }, 2000);
        });
        $("#tblExamStruct").delegate(".btnExamStruct_Detail", "click", function () {
            var strId = this.id;
            me.strExamStructId = strId;
            me.strExamStructPartId = "";
            var dt = edu.util.objGetDataInData(strId, me.dtExamStruct, "ID");
            me.strGroupQuestionId = dt[0].GROUPQUESTIONID;
            $("#lblDonViExamStructDetail").html(dt[0].DEPARTORGANNAME);
            $("#lblBoDe").html(dt[0].NAME);
            $("#lblGroupQuestionExamStructDetail").html(dt[0].GROUPQUESTIONNAME);
            me.toggle_batdau_ExamStruct();
            //me.getList_DapAn_All();
            me.getList_GroupQuestionDetail();
            me.getList_ExamStructPart();
            me.getList_drpExamStructPart();
            
            me.getList_ExamStructDetail();
            me.getList_AllExamStructDetail();

        });
        $("#tblExamStruct").delegate(".btnWritenExam", "click", function () {
            var strId = this.id;
            me.strExamStructId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtExamStruct, "ID");
            me.strGroupQuestionId = dt[0].GROUPQUESTIONID;
            $("#lblDonViDeThi").html(dt[0].DEPARTORGANNAME);
            $("#lblBoDeDeThi").html(dt[0].NAME);
            $("#lblGroupQuestionDeThi").html(dt[0].GROUPQUESTIONNAME);
            me.toggle_batdau_DeThi();

            // me.getList_GroupQuestionDetail();
            me.getList_WritenExam();

        });
        //#endregion
        //#region ExamStruct Detail
        $("#drpLoaiCauHoi").on("select2:select", function () {
            me.get_SoCauHoi();
            //me.gen_drpMucDoCauHoi();
            me.getList_drpMucDoCauHoi();
        });
        $("#drpMucDoCauHoi").on("select2:select", function () {
            me.get_SoCauHoi();
            
        });
        $("#btnSave_ThemVaoBoDe").click(function () {
            if (edu.util.getValById("drpExamStructPart") == "" || edu.util.getValById("drpExamStructPart") == null) {
                edu.system.alert("Chưa chọn phần thi");
                return;
            }
            if (me.strTapHopCacCauHoi == "1")
                edu.system.alert("Hệ thống sẽ thêm tất cả các câu hỏi thuộc nhóm khi tạo đề");
            else {
                var arrValid_HS = [
                    //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                    { "MA": "drpLoaiCauHoi", "THONGTIN1": "EM" },
                    { "MA": "drpMucDoCauHoi", "THONGTIN1": "EM" },
                    { "MA": "txtSoCauLayRa", "THONGTIN1": "EM" },

                ];
                var valid = edu.util.validInputForm(arrValid_HS);
                if (!valid) {
                    return;
                }
            }
            var strLevelQuestionId = edu.util.getValById('drpMucDoCauHoi');
            var strQuestionTypeId = edu.util.getValById('drpLoaiCauHoi');
            var strExamStructPartId = edu.util.getValById('drpExamStructPart');
             
            me.Them_ExamStructDetail("", edu.util.getValById("txtSoCauLayRa"), strLevelQuestionId, strQuestionTypeId, me.strGroupQuestionDetailId, strExamStructPartId);
            setTimeout(function () {
                me.getList_ExamStructDetail();    
                me.getList_AllExamStructDetail();
            }, 2000);

        });
        $("#btnSave_ThemVaoBoDe_LuaChonTheoNhomChiTiet").click(function () {
            if (edu.util.getValById("drpExamStructPart") == "" || edu.util.getValById("drpExamStructPart") == null) {
                edu.system.alert("Chưa chọn phần thi");
                return;
            }
            if (edu.util.getValById("txtSoNhomCon") == "" || edu.util.getValById("txtSoNhomCon") == null) {
                edu.system.alert("Chưa nhập số nhóm");
                return;
            }
           
            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Chưa chọn nhóm NHCH");
                return;
            }
              
            me.Them_ExamStructTheoNhomCT();
            setTimeout(function () {
                me.getList_ExamStructDetail();
                me.getList_AllExamStructDetail();
            }, 2000);

        });
        $("#btnSave_CapNhatSoCauTrongBoDe").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblExamStructDetail", "checkX");

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strLevelQuestionId = '';
                var strQuestionTypeId = '';
                var GroupQuestionDetailId = '';
                var strExamStructPartId = "";
                var strOrders = '';
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtExamStructDetail, "ID");
                    strLevelQuestionId = dt[0].LEVELQUESTIONID;
                    strQuestionTypeId = dt[0].QUESTIONTYPEID;
                    GroupQuestionDetailId = dt[0].GROUPQUESTIONDETAILID;
                    strExamStructPartId = dt[0].EXAMSTRUCTPARTID;
                    strOrders = edu.util.getValById("txtSTT" + arrChecked_Id[i]);
                    me.Sua_ExamStructDetail(arrChecked_Id[i], edu.util.getValById("txtSoCau" + arrChecked_Id[i]), strLevelQuestionId, strQuestionTypeId, GroupQuestionDetailId, strExamStructPartId, edu.util.getValById("txtSoCau" + arrChecked_Id[i]), strOrders);
                }
            });

            setTimeout(function () {
                me.getList_ExamStructDetail();
                me.getList_AllExamStructDetail();
            }, 2000);

        });

        $("#btnDelete_SoCauTrongBoDe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblExamStructDetail", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            console.log(arrChecked_Id);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_ExamStructDetail(arrChecked_Id[i]);
                }
            });

            setTimeout(function () {
                me.getList_ExamStructDetail();
                me.getList_AllExamStructDetail();
            }, 2000);

        });
        $("[id$=chkSelectAll_ExamStructDetail]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblExamStructDetail" });
        });
        $("#btnSave_WritenExam").click(function () {


            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtTenDeThi", "THONGTIN1": "EM" },
                { "MA": "textSoDeTao", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_WritenExam();
        });
        $("#btnDelete_WritenExam").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_WritenExam(arrChecked_Id[i]);
                }
            });

            setTimeout(function () {
                me.getList_WritenExam();
            }, 2000);

        });
        $("[id$=chkSelectAll_WritenExam]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblWritenExam" });
        });
        $("#btnSua_WritenExam").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblWritenExam", "checkX");
            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strId = '';
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtWritenExam, "ID");
                    strId = dt[0].ID;
                    me.Sua_WritenExam(strId, edu.util.getValById("txtWritenExamName" + strId));
                }
            });

            setTimeout(function () {
                me.getList_WritenExam();
            }, 2000);

        });
        $("#btnTaiFile").click(function () {
            var selectedValue = edu.util.getValById("drpBaoCao");

            me.report(selectedValue);
        });
        $("#tblWritenExam").delegate('.btnChiTietDeThi', 'click', function (e) {
            var strId = this.id;
            e.stopImmediatePropagation();
            $("#zoneDeThi").hide();
            $("#zoneChiTietDeThi").slideDown();
            me.gen_ChiTietDeThi(strId);

            //$(".zone-bus").hide();
            //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
        });
        $("#btnClose_ChiTietDeThi").click(function (e) {
            e.stopImmediatePropagation();
            me.closeChiTietDeThi();
        });
        $("#btnClose_zoneInDeThiTuLuanHTMLMau01").click(function (e) {
            e.stopImmediatePropagation();
            me.closezoneInDeThiTuLuanHTMLMau01();
        });
        
        $("#btnIn_IndeThi").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu("ChiTietDeThiPreview");
        });
        $("#btnIn_InDeThiTuLuanHTMLMau01").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu("ThongTinInDeThiTuLuanHTMLMau01");
        });
        
        $("#btnCapNhat_ExamStructPart").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtExamStructPartTitle", "THONGTIN1": "EM" },
                { "MA": "txtExamStructPartGuide", "THONGTIN1": "EM" },
                { "MA": "drpExamStructKieuLamBaiThi", "THONGTIN1": "EM" },
                { "MA": "txtExamStructTotalTime", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.Sua_ExamStructPart();
        });
        $("#btnThemMoi_ExamStructPart").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtExamStructPartTitle_ThemMoi", "THONGTIN1": "EM" },
                { "MA": "txtExamStructPartGuide_ThemMoi", "THONGTIN1": "EM" },
                { "MA": "txtExamStructTotalTime_ThemMoi", "THONGTIN1": "EM" },
                { "MA": "drpExamStructKieuLamBaiThi_ThemMoi", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.Them_ExamStructPart();
        });
        $("#btnDelete_ExamStructPart").click(function () {

            if (me.strExamStructPartId == "") {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.Xoa_ExamStructPart();

            });


        });
        $("#drpExamStructPart").on("select2:select", function () {
            me.getList_ExamStructDetail();
        });
        //#endregion
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();   
        me.getList_drpDonVi();
        me.getList_drpLoaiCauHoi();
        me.getList_drpMucDoCauHoi();
        //me.getList_MauImport();
         
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
            'strStatus': '1',
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
                name: "GROUPQUESTIONNAMECODE",
                code: "GROUPQUESTIONNAMECODE",
                order: "unorder" 
            },
            renderPlace: ["drpGroupQuestion"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    //#region Examstruct
    getList_ExamStruct: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_ExamStruct',
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
                    me.dtExamStruct = data.Data;
                    me.genTable_ExamStruct(data.Data, data.Pager);
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
    genTable_ExamStruct: function (data, iPager) {
        var me = this;
        $("#lblExamStruct_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblExamStruct",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlybode.getList_ExamStruct()",
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
                    "mDataProp": "MAVATENNHOM"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.STATUS == "0" ? "Ẩn" : "Hiện";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnExamStruct_Edit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnWritenExam" id="' + aData.ID + '" title="Đề thi"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnExamStruct_Detail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
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
    rewrite_ExamStruct: function () {
        var me = this;

        $("#lblDonVi").html($("#drpDonVi option:selected").text());      
        edu.util.viewValById("txtExamStructName", "");      
        edu.util.viewValById("txtTongThoiGian", "");    
        $("#drpExamStructStatus").val("").change();

    },
    viewEdit_GroupQuestion: function (dt) {
        var me = this;
        me.strGroupQuestionId = dt.ID;
        me.strDepartOrganId = dt.DEPARTORGANID;
        if (dt.TINHDIEMTHEOSOCAUTRALOIDUNG == 1) {
            $('#rdoTheoSoCauTraLoiDung').prop('checked', true);
            $('#rdoTheoSoYTraLoiDung').prop('checked', false);
        }
        else {
            $('#rdoTheoSoCauTraLoiDung').prop('checked', false);
            $('#rdoTheoSoYTraLoiDung').prop('checked', true);
        }


        $("#lblDonVi").html(dt.DEPARTORGANNAME);
        edu.util.viewValById("txtExamStructName", dt.NAME);         
        edu.util.viewValById("txtTongThoiGian", dt.TONGTHOIGIAN);      
        $("#drpExamStructStatus").val(dt.STATUS).change();
    },
    toggle_edit_ExamStruct: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneExamStruct");
    },  
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    getList_drpExamStructGroupQuestion: function (strExamStructGroupQuestionId) {
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
                    me.gen_drpExamStructGroupQuestion(data.Data, strExamStructGroupQuestionId);

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
    gen_drpExamStructGroupQuestion: function (data, strExamStructGroupQuestionId) {
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
            renderPlace: ["drpExamStructGroupQuestion"],            
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_ExamStruct: function () {
        var me = this;
        var strTinhDiemTheoHeSoCauTLDung = "1";
        if (!$("#rdoTheoSoCauTraLoiDung").is(":checked"))
            strTinhDiemTheoHeSoCauTLDung = "0"; 
        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/ThemMoi_ExamStruct',
            'versionAPI': 'v1.0',
            'strId': "",
            'strName': edu.util.getValById('txtExamStructName'),
            'strStatus': edu.util.getValById('drpExamStructStatus'),
            'strTinhDiemTheoHeSoCauTLDung': strTinhDiemTheoHeSoCauTLDung,
            'strGroupQuestionId': edu.util.getValById('drpExamStructGroupQuestion'),
            'strTongThoiGian': edu.util.getValById('txtTongThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strExamStructId != "") {
            obj_save.action = 'QLTTN_QuanLyBoDe/Sua_ExamStruct';
            obj_save.strId = me.strExamStructId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {  
                if (data.Success) {
                    me.getList_ExamStruct();
                    me.strExamStructId = data.ID;
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
    Xoa_ExamStruct: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_ExamStruct',
            'versionAPI': 'v1.0',
            'strId': strIds,
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
   //#endregion
    //#region ExamStruct Detail
    toggle_batdau_ExamStruct: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneExamStructDetail");
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
        me.strGroupQuestionDetailId = '';
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
            me.strGroupQuestionDetailId = data.node.id;
            var dt = edu.util.objGetDataInData(me.strGroupQuestionDetailId, me.dtGroupQuestionDetail, "ID");
            $("#lblTapHopCacCauHoi").html("");
            me.strTapHopCacCauHoi = "0";
            if (dt[0].TAPHOPCACCAUHOI == "1") {
                $("#lblTapHopCacCauHoi").html("LÀ TẬP HỢP CÁC CÂU HỎI");
                me.strTapHopCacCauHoi = "1";
            }
             
            $("#lblGroupQuestionDetail").html(data.node.text);      
            me.get_SoCauHoi();
            me.getList_ExamStructDetail();
            me.LayDS_CauHoiTuNganHang();
             
            //me.getList_DapAn_All();
            //me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            //me.getList_CauHoi();
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
                    me.dtLoaiCauHoi = data.Data;
                    //me.gen_drpLoaiCauHoi(data.Data, strQuestionTypeId);
                    me.gen_drpLoaiCauHoiByGroupQuestionDetail(data.Data); 
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
            renderPlace: ["drpLoaiCauHoi"],
            title: "--Chọn loại câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
    },
    gen_drpLoaiCauHoiByGroupQuestionDetail: function (data) {
        var me = this; 
        
        var strQuestionTypeId = "";
        if (data != null)
        for (var i = 0; i < data.length; i++) {
            var dt = edu.util.objGetDataInData(data[i].ID, me.dtCauHoiTuNganHang, "QUESTIONTYPEID");  
            data[i].NAME = data[i].NAME+ " ( " + dt.length + " )";
             
        } 
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
                default_val: strQuestionTypeId
            },
            renderPlace: ["drpLoaiCauHoi"],
            title: "--Chọn loại câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpMucDoCauHoi: function (strLevelQuestionId) {
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
                    
                    me.gen_drpMucDoCauHoiByGroupQuestionDetail(data.Data, strLevelQuestionId);

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
    gen_drpMucDoCauHoi: function (data, strLevelQuestionId) {
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
            renderPlace: ["drpMucDoCauHoi"],
            title: "--Chọn mức độ--"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    gen_drpMucDoCauHoiByGroupQuestionDetail: function (data, strLevelQuestionId) {
        var me = this;
        if (strLevelQuestionId == undefined) strLevelQuestionId = "";
        if (data != null)
            for (var i = 0; i < data.length; i++) {
               
                var dtLocTheoLoaiCauHoi = "";
                if (edu.util.getValById("drpLoaiCauHoi") =="")
                    dtLocTheoLoaiCauHoi = me.dtCauHoiTuNganHang
                else
                    dtLocTheoLoaiCauHoi = edu.util.objGetDataInData(edu.util.getValById("drpLoaiCauHoi"), me.dtCauHoiTuNganHang, "QUESTIONTYPEID");
                
                var dtLocTheoMucDoCauHoi = edu.util.objGetDataInData(data[i].ID, dtLocTheoLoaiCauHoi, "QUESTIONLEVELID");
           
                data[i].NAME = data[i].NAME + " ( " + dtLocTheoMucDoCauHoi.length + " )";

        } 
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
                default_val: strLevelQuestionId
            },
            renderPlace: ["drpMucDoCauHoi"],
            title: "--Chọn mức độ--"
        };
        edu.system.loadToCombo_data(obj);
    }, 

    get_SoCauHoi: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauHoiTuNganHang',
            'versionAPI': 'v1.0',            
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strStatus': '1',
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi'),
            'strLeVelId': edu.util.getValById('drpMucDoCauHoi'),
            'strNguoiDung_Id': edu.system.userId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {                    
                    $("#lblTongSoCauTrongBoDe").html(data.Data.length);   
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
    LayDS_CauHoiTuNganHang: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauHoiTuNganHang',
            'versionAPI': 'v1.0',
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strStatus': '1',
            'strQuestionTypeId': '',
            'strLeVelId': '',
            'strNguoiDung_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCauHoiTuNganHang = data.Data;
                    me.getList_drpLoaiCauHoi();
                    me.getList_drpMucDoCauHoi();
                       
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
    getList_ExamStructDetail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi',
            'versionAPI': 'v1.0',
            'strExamStructPartId': edu.util.getValById("drpExamStructPart"),
            'strExamStructId': me.strExamStructId, 
            
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.dtExamStructDetail = data.Data;
                    me.genTable_ExamStructDetail(data.Data);
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
    genTable_ExamStructDetail: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblExamStructDetail",
            aaData: data, 
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
              
                {

                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtSTT' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                        
                    }
                },
                {
                    "mDataProp": "EXAMPARTTILEPARENT"
                },
                {
                     
                     "mRender": function (nRow, aData) {
                         var strReturn = aData.GROUPQUESTIONDETAILNAME;
                         if (edu.util.returnEmpty(aData.TEN_CHONMOTTRONGCACNHOM) != '')
                             strReturn = 'Chọn <span style="color:red">' + aData.SONHOMCON +'</span> trong nhóm:</br> <span style="color:blue">' + aData.TEN_CHONMOTTRONGCACNHOM + '</span>';

                         return strReturn;
                    }
                },
                {
                    "mDataProp": "QUESTIONTYPENAME"
                },
                {
                    "mDataProp": "LEVELQUESTIONNAME"
                },
                {
                    "mDataProp": "SOCAUTRONGNGANHANGCAUHOI"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type ="text" id="txtSoCau' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.NUMBERQUESTION) + '" class="form-control" />';
                        if (edu.util.returnEmpty(aData.TEN_CHONMOTTRONGCACNHOM) != '')
                            strReturn = '<input type ="text" id="txtSoCau' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.SONHOMCON) + '" class="form-control" />';

                        return strReturn;
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
        if (data != undefined && data.length > 0) { 
            edu.system.insertSumAfterTable('tblExamStructDetail', [7]);
            // $("#" + 'tblLopDaTach' + " tfoot tr td:eq(3)").attr("style", "text-align: right; font-size: 20px; padding-right: 20px");
        } else {
            $("#" + 'tblLopDaTach' + " tfoot").html('');
        }
        /*III. Callback*/
    },
    Them_ExamStructDetail: function (strId, strNumberQuestion, strLevelQuestionId, strQuestionTypeId, GroupQuestionDetailId, strExamStructPartId) {
        var me = this;
        
        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_ExamStructDetail',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strGroupQuestionDetailId': GroupQuestionDetailId,
            'strDepartOrganId': me.strDepartOrganId,
            'strNumberQuestion': strNumberQuestion,
            'strLevelQuestionId': strLevelQuestionId ,
            'strQuestionTypeId': strQuestionTypeId,
            'strExamstructId': me.strExamStructId,
            'strExamStructPartId': strExamStructPartId,
            'strNguoiThucHien_Id': edu.system.userId
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
    Sua_ExamStructDetail: function (strId, strNumberQuestion, strLevelQuestionId, strQuestionTypeId, GroupQuestionDetailId, strExamStructPartId, strSoNhomCon, strOrders) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Sua_ExamStructDetail',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strGroupQuestionDetailId': GroupQuestionDetailId,
            'strDepartOrganId': me.strDepartOrganId,
            'strNumberQuestion': strNumberQuestion,
            'strLevelQuestionId': strLevelQuestionId,
            'strQuestionTypeId': strQuestionTypeId,
            'strSoNhomCon': strSoNhomCon,
            'strOrders': strOrders,
            'strExamstructId': me.strExamStructId,
            'strExamStructPartId': strExamStructPartId,
            'strNguoiThucHien_Id': edu.system.userId
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
    Xoa_ExamStructDetail: function (strId) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_ExamStructDetail',
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

    toggle_batdau_DeThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneDeThi");
    },

    getList_WritenExam: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_WritenExam',
            'versionAPI': 'v1.0',
            'strExamStructId': me.strExamStructId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtWritenExam = data.Data;
                    me.genTable_WritenExam(data.Data);
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
    genTable_WritenExam: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblWritenExam",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [ 
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtWritenExamName' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.NAME) + '" class="form-control" />';
                    }
                },
                {
                    "mDataProp": "SODETAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietDeThi" id="' + aData.ID + '" title="Chi tiết đề thi"><i class="fa fa-eye color-active"></i>Chi tiết đề thi</a></span>';
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
    save_WritenExam: function () {
        var me = this;
        
        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_WritenExam',
            'versionAPI': 'v1.0',
            'strId': "",
            'strName': edu.util.getValById('txtTenDeThi'),
            'strSoDeTao': edu.util.getValById('textSoDeTao'),
            'strExamStructId': me.strExamStructId, 
            'strNguoiThucHien_Id': edu.system.userId
        };
       

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_WritenExam(); 
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
    Xoa_WritenExam: function (strId) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_WritenExam',
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

    Sua_WritenExam: function (strId,strName) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Sua_WritenExam',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strName': strName, 
            'strNguoiThucHien_Id': edu.system.userId
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
    closeChiTietDeThi: function () {
        var me = this;
        $("#zoneDeThi").show();
        $("#zoneChiTietDeThi").slideUp();
    },
    closezoneInDeThiTuLuanHTMLMau01: function () {
        var me = this;
        $("#zoneDeThi").show();
        $("#zoneInDeThiTuLuanHTMLMau01").slideUp();
    },
    report: function (strReportCode) {
        console.log(edu.system.rootPathReport);
        var me = this;
        var strMau_LoaiCauHoiId = $("#drpLoaiCauHoi_Imp").find('option:selected').val();

        if (strReportCode == "MAUTEMPLATEIMPORT" && strMau_LoaiCauHoiId == "") {
            edu.system.alert("Chưa chọn loại câu hỏi cần xuất mẫu");
            return;
        }
        if (strReportCode == "InDeThiTuLuanHTMLMau01" ) {      
            me.gen_InDeThiTuLuanHTMLMau01();
            return;
        }
        if (strReportCode == "InDapAnDeThiVietHTMLMau01") {
            me.gen_InDapAnDeThiVietHTMLMau01();
            return;
        }
        if (strReportCode == "InDeThiTracNghiemMau01") {
            me.gen_InDeThiTracNghiemMau01();
             
            var body = document.getElementById('zoneInDeThiTuLuanHTMLMau01');
            var html = document.documentElement;
            var bodyH = Math.max(body.scrollHeight, body.offsetHeight, body.getBoundingClientRect().height, html.clientHeight, html.scrollHeight, html.offsetHeight);
            console.log(bodyH);

            return;
        }
        if (strReportCode == "InDapAnDeThiTracNghiemMau01") {
            me.gen_InDapAnDeThiTracNghiemMau01();
            return;
        }
        var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
        var strWritenExamIds = "";
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strWritenExamIds += arrChecked_Id[i] + ";";
        }
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Bạn chưa chọn đề thi");
            return;
        }
        strWritenExamIds = strWritenExamIds.substr(0, strWritenExamIds.length - 1); 
        if (strReportCode == "InDeThiTracNghiem_Doc_Mau01") {
            if (arrChecked_Id.length > 1) {
                edu.system.alert("Bạn chọn quá 1 đề thi");
                return;
            }
        }
        if (strReportCode == "InDeThiTracNghiem_Doc_Mau02") {
            if (arrChecked_Id.length > 1) {
                edu.system.alert("Bạn chọn quá 1 đề thi");
                return;
            }
        }
        
        var arrTuKhoa = [];
        var arrDuLieu = [];
        addKeyValue("MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId", strMau_LoaiCauHoiId);
        addKeyValue("QUANLYBODE.strWritenExamIds", strWritenExamIds);

        addKeyValue("strReportCode", strReportCode);
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
                        
                        if (strReportCode == "InDeThiTracNghiemMau02") {
                            var win = window.open(url_report, '_blank');
                            if (win != undefined)
                                win.focus();
                            else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
                            
                        }
                        else
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
    closeKetQuaThi: function () {
        var me = this;
        $("#zoneChiTiet").show();
        $("#zoneKetQuaThi").slideUp();
    },
    gen_InDeThiTuLuanHTMLMau01: function () {
        
        var me = this;
        var strWritenExamId = "";
        
        var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Bạn chưa chọn đề thi");
            return;
        }        
        if (arrChecked_Id.length  >1 ) {
            edu.system.alert("Bạn chọn quá 1 đề thi");
            return;
        }
         
        $("#zoneDeThi").hide();
        $("#zoneInDeThiTuLuanHTMLMau01").slideDown();
        
        strWritenExamId = arrChecked_Id[0];

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_InDeThiTuLuanHTMLMau01',
            'versionAPI': 'v1.0',
            'strWritenExamId': strWritenExamId,  

        };

        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinInDeThiTuLuanHTMLMau01").html(data.Data);
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinInDeThiTuLuanHTMLMau01']);
                }
                else {
                    edu.system.alert(data.Message);
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
    gen_InDeThiTracNghiemMau01: function () {

        var me = this;
        var strWritenExamId = "";

        var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Bạn chưa chọn đề thi");
            return;
        }
        if (arrChecked_Id.length > 1) {
            edu.system.alert("Bạn chọn quá 1 đề thi");
            return;
        }

        $("#zoneDeThi").hide();
        $("#zoneInDeThiTuLuanHTMLMau01").slideDown();

        strWritenExamId = arrChecked_Id[0];

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_InDeThiTracNghiemMau01',
            'versionAPI': 'v1.0',
            'strWritenExamId': strWritenExamId,

        };

        $("#ThongTinInDeThiTuLuanHTMLMau01").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinInDeThiTuLuanHTMLMau01").html(data.Data);                    
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinInDeThiTuLuanHTMLMau01']);
                }
                else {
                    edu.system.alert(data.Message);
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
    gen_InDapAnDeThiTracNghiemMau01: function () {

        var me = this;
        var strWritenExamId = "";

        var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Bạn chưa chọn đề thi");
            return;
        }
        if (arrChecked_Id.length > 1) {
            edu.system.alert("Bạn chọn quá 1 đề thi");
            return;
        }

        $("#zoneDeThi").hide();
        $("#zoneInDeThiTuLuanHTMLMau01").slideDown();

        strWritenExamId = arrChecked_Id[0];

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_InDapAnDeThiTracNghiemMau01',
            'versionAPI': 'v1.0',
            'strWritenExamId': strWritenExamId,

        };

        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinInDeThiTuLuanHTMLMau01").html(data.Data);
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinInDeThiTuLuanHTMLMau01']);
                }
                else {
                    edu.system.alert(data.Message);
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
    gen_InDapAnDeThiVietHTMLMau01: function () {

        var me = this;
        var strWritenExamId = "";

        var arrChecked_Id = edu.util.getArrCheckedIds("tblWritenExam", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Bạn chưa chọn đề thi");
            return;
        }
        if (arrChecked_Id.length > 1) {
            edu.system.alert("Bạn chọn quá 1 đề thi");
            return;
        }

        $("#zoneDeThi").hide();
        $("#zoneInDeThiTuLuanHTMLMau01").slideDown();

        strWritenExamId = arrChecked_Id[0];

        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_InDapAnDeThiVietHTMLMau01',
            'versionAPI': 'v1.0',
            'strWritenExamId': strWritenExamId,

        };

        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinInDeThiTuLuanHTMLMau01").html(data.Data);
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinInDeThiTuLuanHTMLMau01']);
                }
                else {
                    edu.system.alert(data.Message);
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
    gen_ChiTietDeThi: function (strId) {
        var me = this;        
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/gen_ChiTietDeThiViet',
            'versionAPI': 'v1.0',     
            'strWritenExamId': strId, 
        };
        $("#ChiTietDeThiPreview").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    $("#ChiTietDeThiPreview").html(data.Data);
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ChiTietDeThiPreview']);
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
    printPhieu: function (MauIn) {
        var me = this;
        edu.extend.remove_PhoiIn(MauIn);
        edu.util.printHTML(MauIn);
        
        me.closePhieu();
    },
    closePhieu: function () {
        var me = this;
        $("#zoneBienLaiHoaDon").slideUp('slow');
        $("#zoneTimKiemSinhVien").slideDown('slow');
        $("#zoneThongTinHSSV").slideDown('slow');
        $("#zoneKhoan_ChiTiet").slideUp();
        $("#top_notifications_PhieuThu").hide();
        $("#notifications_PhieuThu").hide();
        $("#btnIn_HDBL").show();
        $("#btnThuTien").hide();
        $("#btnHuy_HDBL").show();
        $("#zoneActionXuatHoaDon").html('');
        $("#btnSaveHDBL").replaceWith('');
        
    },
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                   
                    me.genList_MauImport(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + JSON.stringify(data.Message), "w");
                }
                edu.system.endLoading();
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
    genList_MauImport: function (data) {
       
        var obj = {
            data: data,
            renderInfor: {
                id: "MAUIMPORT_TENFILEMAU",
                parentId: "",
                name: "MAUIMPORT_TEN",
                code: "MAUIMPORT_TENFILEMAU",
                avatar: ""
            },
            renderPlace: ["drpBaoCao"],
            type: "",
            title: "Chọn mẫu báo cáo"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ExamStructPart: function () {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamStructId': me.strExamStructId,
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
                    me.dtExamStructPart = data.Data;                                       
                    me.genTreeJs_ExamStructPart_treejs(dtResult, iPager);
                    me.gen_ExamStructView();

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
    genTreeJs_ExamStructPart_treejs: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblExamStructPart_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "PARENTID",
                name: "TITLE",
                code: "TITLE"
            },
            renderPlaces: ["zone_ExamStructPart_treejs"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_ExamStructPart_treejs').on("select_node.jstree", function (e, data) {
            me.strExamStructPartId = data.node.id;
            var dt = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPart, "ID");
           
            edu.util.viewValById("txtExamStructPartGuide", dt[0].GUIDE);
            edu.util.viewValById("txtExamStructPartTitle", dt[0].TITLE); 
            edu.util.viewValById("txtExamStructTotalTime", dt[0].TOTALTIME); 
            edu.util.viewValById("drpExamStructKieuLamBaiThi", dt[0].TITLE); 
            $("#drpExamStructKieuLamBaiThi").val(dt[0].KIEULAMBAITHI).change();   
            edu.util.viewValById("txtExamStructPartOrders", dt[0].ORDERS); 
           //me.get_SoCauHoi();
           // me.getList_ExamStructDetail();
            //me.getList_DapAn_All();
            //me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            //me.getList_CauHoi();
        });

    },
    Sua_ExamStructPart: function () {
        var me = this;
        var obj_save;        
        obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Sua_ExamStructPart',
            'versionAPI': 'v1.0',
            'strId': me.strExamStructPartId,            
            'strTitle': edu.util.getValById('txtExamStructPartTitle'),
            'strGuide': edu.util.getValById('txtExamStructPartGuide'),
            'strOrders': edu.util.getValById('txtExamStructPartOrders'),
            'strTotalTime': edu.util.getValById('txtExamStructTotalTime'),
            'strKieuLamBaiThi': edu.util.getValById('drpExamStructKieuLamBaiThi'),
            'strExamStructId': me.strExamStructId,
            'strNguoiThucHien_Id': edu.system.userId
        };         

        //default
        edu.system.makeRequest({
            success: function (data) {
                
                if (data.Success) {
                    me.getList_ExamStructPart();      
                    me.getList_drpExamStructPart();
                    me.gen_ExamStructView();
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
    Them_ExamStructPart: function () {
        var me = this;
        var obj_save;
        
        obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_ExamStructPart',
            'versionAPI': 'v1.0',
            'strId': "",
            'strParentId': me.strExamStructPartId,
            'strTitle': edu.util.getValById('txtExamStructPartTitle_ThemMoi'),
            'strGuide': edu.util.getValById('txtExamStructPartGuide_ThemMoi'),
            'strOrders': edu.util.getValById('txtExamStructPartOrders_ThemMoi'),
            'strTotalTime': edu.util.getValById('txtExamStructTotalTime_ThemMoi'),
            'strKieuLamBaiThi': edu.util.getValById('drpExamStructKieuLamBaiThi_ThemMoi'),
            'strExamStructId': me.strExamStructId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_ExamStructPart();
                    me.getList_drpExamStructPart();
                    me.gen_ExamStructView();
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
    Xoa_ExamStructPart: function () {
        var me = this;
        var obj_save;
        obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Xoa_ExamStructPart',
            'versionAPI': 'v1.0',
            'strId': me.strExamStructPartId,            
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    me.getList_ExamStructPart();
                    me.getList_drpExamStructPart();
                    me.gen_ExamStructView();
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
    getList_drpExamStructPart: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_drpExamStructPart',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamStructId': me.strExamStructId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 1000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpExamStructPart(data.Data);
                    
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
    gen_drpExamStructPart: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TITLE",
                code: "TITLE",
                order: "unorder"
            },
            renderPlace: ["drpExamStructPart"],
            title: "Chọn"
        };
        edu.system.loadToCombo_data(obj);
    },
    gen_ExamStructView: function () {
        var me = this;
        $("#ViewCauTrucDeThi").html("");
        var TieuDeTemp = "<div class='row'>"
            + "<span class='lang'  style='color: #0073b7; font-size: 25px;' key=''>@TITLE@</span>"
            + "</div>"
            +"<div class='row'>"
            + "<span class='lang' style='color: blue; font-size: 18px;'  key=''>@GUIDE@</span>"
            + "</div>";
        var tblTableHeaderTemp = "<table id='tblViewExamStructDetail' class='table table-hover table-bordered'> "
            + "<thead > "
            + "  <tr> "
            + "      <th class='td-fixed td-center'>Stt</th> "
            + "      <th class='td-center'>Tên</th> "
            + "      <th class='td-center' > Loại câu hỏi</th> "
            + "      <th class='td-center' > Mức độ</th> "
            + "      <th class='td-center' > Số câu trong NHCH</th> "
            + "      <th class='td-center' > Số câu lấy ra</th> "            
            + "  </tr> "
            + "</thead> "
            + "<tbody>"
            + "    <!-- load from js --> ";
        var tblRowContentTemp = "<tr>"
            + "<td style='text-align: center;'>@STT@</td>"
            + "<td>@GROUPQUESTIONDETAILNAME@</td>"
            + "<td>@QUESTIONTYPENAME@</td>"
            + "<td>@LEVELQUESTIONNAME@</td>"
            + "<td class='td-center'>@SOCAUTRONGNGANHANGCAUHOI@</td>"
            + "<td class='td-center'>@NUMBERQUESTION@</td>"
            + "</td>"; 
          
        var viewDeThi = "";
        
        for (var i = 0; i < me.dtExamStructPart.length; i++) {
            var TieuDe = TieuDeTemp;
            TieuDe = TieuDe.replace('@TITLE@', me.dtExamStructPart[i].TITLE);
            TieuDe = TieuDe.replace('@GUIDE@', me.dtExamStructPart[i].GUIDE);           
            
            var tblTableHeader = tblTableHeaderTemp;
            var dtContent = edu.util.objGetDataInData(me.dtExamStructPart[i].ID, me.dtAllExamStructDetail, "EXAMSTRUCTPARTID"); 
            var Stt = 1;
            var tblRowsContent = "";
            for (var j = 0; j < dtContent.length; j++) {                
                var tblRow = tblRowContentTemp;
                tblRow = tblRow.replace('@STT@', Stt);
                tblRow = tblRow.replace('@GROUPQUESTIONDETAILNAME@', dtContent[j].GROUPQUESTIONDETAILNAME);
                tblRow = tblRow.replace('@QUESTIONTYPENAME@', dtContent[j].QUESTIONTYPENAME);
                tblRow = tblRow.replace('@LEVELQUESTIONNAME@', dtContent[j].LEVELQUESTIONNAME);
                tblRow = tblRow.replace('@SOCAUTRONGNGANHANGCAUHOI@', dtContent[j].SOCAUTRONGNGANHANGCAUHOI);
                tblRow = tblRow.replace('@NUMBERQUESTION@', dtContent[j].NUMBERQUESTION);
                tblRowsContent +=tblRow;               
                Stt++;                
            }
            tblTableHeader += tblRowsContent;
            tblTableHeader += "</tbody>"
                + "</table>";

            viewDeThi += TieuDe + tblTableHeader;
        }
        
        $("#ViewCauTrucDeThi").html(viewDeThi);
    },
    getList_AllExamStructDetail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi',
            'versionAPI': 'v1.0',
            'strExamStructPartId':"",
            'strExamStructId': me.strExamStructId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtAllExamStructDetail = data.Data; 
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
    
    Them_ExamStructTheoNhomCT: function () {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyBoDe/Them_ExamStructTheoNhomCT',
            'versionAPI': 'v1.0',
            'strId': '',
            'strDepartOrganId': me.strDepartorganId,
            'strLayGroupQuestionDetailId_CT': me.strGroupQuestionDetailId,          
            'strExamstructId': me.strExamStructId,
            'strExamStructPartId': edu.util.getValById("drpExamStructPart"),
            'strSoNhomCon': edu.util.getValById('txtSoNhomCon'),
            'strNguoiThucHien_Id': edu.system.userId
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
    //#endregion
}

