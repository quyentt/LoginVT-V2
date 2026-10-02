function quanlynganhangcauhoi() { };
quanlynganhangcauhoi.prototype = {   
    dtGroupQuestion: [],
    dtLoaiCauHoi: [],
    dtGroupQuestionDetail: [],
    dtAnswer_Ve2:[],
    dtDapAn_All: [],
    dtDapAn_All_Temp: [],
    dtCauHoi: [],    
    dtCauHoi_Temp:[],
    strGroupQuestionId: '',
    strGroupQuestionDetailId:'',
    strDepartOrganId: '',
    strQuestionId: '',
    strQuestionTempId:'',
    strQuestionTypeCode: '', 
    strQuestionTypeCodeTemp: '',
    strNoiDungDapAnId: '',
    strMove_CauHoi_GroupQuestionDetailId: '',
    strMove_CauHoi_GroupQuestionDetailText: '',
    strMucPheDuyetId: '',
     
    
    
    init: function () {
        var me = this;        
        me.page_load(); 
         
         //#region zoneGroupQuestion
        $(".btnSearch_GroupQuestion").click(function () {
            me.getList_GroupQuestion();
        });
        $(".btnSearch_PhanQuyenGroupQuestion").click(function () {
            me.getList_PhanQuyenGroupQuestion();
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });    
        $("#btnThucHienTacVu").click(function () {
            if (edu.util.getValById("drpTacVu") == "") {
                edu.system.alert("Bạn chưa chọn tác vụ cần thực hiện");
                return;
            }
            if (edu.util.getValById("drpTacVu") == "CHUYENCAUHOI") {
                me.strMove_CauHoi_GroupQuestionDetailId = '';
                me.strMove_CauHoi_GroupQuestionDetailText = '';
                me.toggle_edit_Move_CauHoi();
            }
            if (edu.util.getValById("drpTacVu") == "TAOMOICAUHOI") {
                var strId = "";
                me.strQuestionId = "";
                $("#drpLoaiCauHoi").removeAttr("disabled");
                if (me.strGroupQuestionDetailId == "") {
                    edu.system.alert("Chưa chọn nhóm câu hỏi");
                    return;
                }
                me.rewrite_CauHoi();
                me.toggle_edit_CauHoi();
                me.getList_DapAn(me.strQuestionId);
            }
            if (edu.util.getValById("drpTacVu") == "PREVIEWCAUHOI") {
                me.toggle_edit_PreviewCauHoi(); 
            }
            if (edu.util.getValById("drpTacVu") == "KIEMTRACAUHOI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần kiểm tra?");
                    return;
                }
                var strId = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strId += arrChecked_Id[i] + ",";
                }
                strId = strId.substr(0, strId.length - 1);
                me.getList_CheckCauHoi(
                    strId,
                    "zonePreviewTableQuestion"
                );
            }
            if (edu.util.getValById("drpTacVu") == "IMPORTCAUHOITAM") {

                if (me.strGroupQuestionDetailId == "") {
                    edu.system.alert("Bạn chưa chọn nhóm câu hỏi");
                    return;
                }
                me.toggle_edit_CauHoi_Temp();
                //me.viewEdit_CauHoi(dt[0]);
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp(); 
            }
            if (edu.util.getValById("drpTacVu") == "XOACAUHOI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.Xoa_Question(arrChecked_Id[i]);
                    }
                });
                setTimeout(function () {
                    me.getList_DapAn_All();
                    me.getList_CauHoi(me.strQuestionId);
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "CAPNHATKHONGDUNG") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần cập nhật?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
                $("#btnYes").click(function (e) {
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.CapNhatTinhTrang_Question(arrChecked_Id[i],0);
                    }
                });
                setTimeout(function () {
                    me.getList_DapAn_All();
                    me.getList_CauHoi(me.strQuestionId);
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "CAPNHATDANGGDUNG") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần cập nhật?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
                $("#btnYes").click(function (e) {
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.CapNhatTinhTrang_Question(arrChecked_Id[i], 1);
                    }
                });
                setTimeout(function () {
                    me.getList_DapAn_All();
                    me.getList_CauHoi(me.strQuestionId);
                }, 2000);
            }
            
        });
        
        $(".btnClose_ThaoTac_GroupQuestionDetail").click(function () {
            me.toggle_batdau_ThaoTac_GroupQuestionDetail();
        });
        $("#btnIn_Preview").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu('zonePrintPreview');
        });
        $("#btnImport_DMIP_LaTeX").click(function () {
            me.import_DMIP_Latex();
        });
        $("#btnIn_PreviewTemp").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu('zonePrintPreviewTemp');
        });
        $("#drpDonVi").on("select2:select", function () {
            if (edu.util.getValById('filehtml') == 'viewquanlynganhangcauhoi')
                me.getList_PhanQuyenGroupQuestion();
            else
                me.getList_GroupQuestion();
        });
        $("#drpStatus").on("select2:select", function () {

            me.getList_GroupQuestion();
        });
        
        
        
        $(".btnClose_ThaoTac_Move_CauHoi").click(function () {
            me.toggle_batdau_ThaoTac_Move_CauHoi();
        });
        $("#tblGroupQuestion").delegate(".btnGroupQuestion_Edit", "click", function () {
            var strId = this.id;
            me.strGroupQuestionId = strId;
            me.strGroupQuestionDetailId = "";
            var dt = edu.util.objGetDataInData(strId, me.dtGroupQuestion, "ID");
            me.rewrite_GroupQuestion();
            me.toggle_edit_GroupQuestion();
            me.viewEdit_GroupQuestion(dt[0]);

        }); 
        $("#btnAdd_GroupQuestion").click(function () {
            if (edu.util.getValById("drpDonVi") == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }
            me.rewrite_GroupQuestion();
            me.toggle_edit_GroupQuestion();

        });
        $("#btn_ThucHienChuyenCauHoi").click(function () {
               
            //console.log($("#zone_Move_CauHoi_treejs").select_node)
            //me.strGroupQuestionDetailId = data.node.id; 
            if (me.strMove_CauHoi_GroupQuestionDetailId == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện chuyển " + arrChecked_Id.length + " câu hỏi tới " + me.strMove_CauHoi_GroupQuestionDetailText);
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Chuyen_Question(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All();
                me.getList_GroupQuestion();
            }, 2000);
             

        });
        $("[id$=chkSelectAll_GroupQuestion]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGroupQuestion" });
        });
        $("#btnDelete_GroupQuestion").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGroupQuestion", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_GroupQuestion(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_GroupQuestion();
            }, 2000);
        });
        $("#btnSave_GroupQuestion").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtGroupQuestionCode", "THONGTIN1": "EM" },
                { "MA": "txtGroupQuestionName", "THONGTIN1": "EM" },
                { "MA": "drpGroupQuestionStatus", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_GroupQuestion(me.strThiSinhId);
        });
        //#endregion
        //#region zoneGroupQuestionDetail
        $("#btnTaiFile").click(function () {
            var selectedValue = $("#drpBaoCao").find('option:selected').val();
            me.report($("#drpBaoCao").val());
        });
        $("#btnTaiFile_DaTaoDe").click(function () {
            var selectedValue = $("#drpBaoCao_DaTaoDe").find('option:selected').val();
            me.report($("#drpBaoCao_DaTaoDe").val());
        });
        $("#btnMauFileDoc").click(function () {
            me.report("MAUTEMPLATEIMPORT");
        });
        
        $(".btnSearch_CauHoi").click(function () {
            me.getList_CauHoi();
        });
        $("#txtSearch_CauHoi").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CauHoi();
            }
            
        });
        $("#tblGroupQuestion").delegate(".btnGroupQuestion_Detail", "click", function () {
            var strId = this.id;
            me.strGroupQuestionId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtGroupQuestion, "ID");
            me.toggle_batdau_GroupQuestionDetail();
            //me.getList_DapAn_All();
            me.getList_GroupQuestionDetail();
            $("#lblTenNhomCauHoi").html("");
            me.strGroupQuestionDetailId = "";
            me.getList_DapAn_All();
            //Set GroupQuestionDetail text for edit
            me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            me.getList_CauHoi();
            me.rewrite_editor_GroupQuestionDetailContent();

            me.getList_AudioFiles();

             

        });
        $("#zonebtnThaoTac").delegate(".btnThaoTac", "click", function (e) {
            e.preventDefault(); 
            me.ThaoTac($(this).attr("name"));
        });
        $("#btnSave_GroupQuestionDetail").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtMaNhomGroupQuestionDetail", "THONGTIN1": "EM" },
                { "MA": "txtTenNhomGroupQuestionDetail", "THONGTIN1": "EM" },
              
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_GroupQuestionDetail(me.strGroupQuestionDetailId);
        });
        $("#tblCauHoi").delegate(".btnEdit_Question", "click", function () {
            var strId = this.id;
            me.strQuestionId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtCauHoi, "ID");
            me.strQuestionTypeCode = dt[0].QUESTIONTYPECODE;
            
            $('#drpLoaiCauHoi').attr("disabled", true);

            if (dt.length > 0) {
                me.rewrite_CauHoi();

                me.getList_DapAn(me.strQuestionId);
                me.getList_QuestionAudioFiles();
                me.toggle_edit_CauHoi();
                me.viewEdit_CauHoi(dt[0]);  
                
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("#tblCauHoi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strQuestionId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtCauHoi, "ID");
            me.strQuestionTypeCode = dt[0].QUESTIONTYPECODE; 

            if (dt.length > 0) { 
                me.toggle_edit_CauHoi_DaTaoDe(); 
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("#tblCauHoi").delegate(".btnViewLichSu_CauHoi", "click", function () {
            var strId = this.id;
            me.strQuestionId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtCauHoi, "ID");
            me.strQuestionTypeCode = dt[0].QUESTIONTYPECODE;

            if (dt.length > 0) {
                edu.util.toggle_overide("zone-bus", "zonePreviewLichSu_CauHoi");
                me.getList_tblCauHoi_LichSu();
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("#tblCauHoi").delegate(".btnViewLichSu_DapAn", "click", function () {
            var strId = this.id;
            me.strQuestionId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtCauHoi, "ID");
            me.strQuestionTypeCode = dt[0].QUESTIONTYPECODE;

            if (dt.length > 0) {
                edu.util.toggle_overide("zone-bus", "zonePreviewLichSu_DapAn");
                me.getList_tblDapAn_LichSu();
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("#btnAdd_CauHoi").click(function () { 
            var strId = "";
            me.strQuestionId = "";
            $("#drpLoaiCauHoi").removeAttr("disabled");
            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Chưa chọn nhóm câu hỏi");
                return;
            }
            me.rewrite_CauHoi();
            me.toggle_edit_CauHoi(); 
            me.getList_DapAn(me.strQuestionId);
        }); 
        $("#btnPreview_CauHoi").click(function () { 
            me.toggle_edit_PreviewCauHoi(); 
        }); 
        $("#btnPreview_CauHoi_Temp").click(function () {
            me.toggle_edit_PreviewCauHoi_Temp();
        }); 
        $("#btnMove_CauHoi").click(function () {
            me.strMove_CauHoi_GroupQuestionDetailId = '';
            me.strMove_CauHoi_GroupQuestionDetailText = '';
            me.toggle_edit_Move_CauHoi();
        }); 
        $("#btnThem_DapAn").click(function () {   
            if (me.strQuestionId == "") {
                edu.system.alert("Chưa chọn câu hỏi");
                return;
            }
            

             
            var strAnswerId = "";
            var strContent = CKEDITOR.instances['editor_txtContent'].getData();
            var strContent2 = edu.util.getValById("txtContent2");
            var strDiemDapAn = "";

          

            var strCorrect = "0";
            if ($("#chkDapAnDung").is(':checked') == true)
                strCorrect = "1";
             
            var strAnswer_SencondId = "";
            var strSymbol = "";
            var strOrders = edu.util.getValById("txtOrder");
            
            me.save_Answer(strAnswerId,
                strContent,
                strCorrect,
                me.strQuestionId,
                strContent2,
                strAnswer_SencondId,
                strSymbol,
                strOrders,
                strDiemDapAn);
            
        });
        $("#tblDapAn").delegate(".btnEdit_NoiDungDapAn", "click", function () {
            var strId = this.id;
            me.strNoiDungDapAnId = strId;
            if ($("#zoneCK_NoiDungDapAn" + strId).is(':visible') )
                $("#zoneCK_NoiDungDapAn" + strId).hide();
            else
                $("#zoneCK_NoiDungDapAn" + strId).show();
        });
        $("#tblDapAn_Temp").delegate(".btnEdit_NoiDungDapAn_Temp", "click", function () {
            var strId = this.id;
            me.strNoiDungDapAnId = strId;
            if ($("#zoneCK_NoiDungDapAn_Temp" + strId).is(':visible'))
                $("#zoneCK_NoiDungDapAn_Temp" + strId).hide();
            else
                $("#zoneCK_NoiDungDapAn_Temp" + strId).show();
        });
        $("#btnThem_DapAn_Ve2").click(function () {
            if (me.strQuestionId == "") {
                edu.system.alert("Chưa chọn câu hỏi");
                return;
            }
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...        
                { "MA": "txtContent_Ve2", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            var strAnswer_SencondId = "";
            var strContent = edu.util.getValById("txtContent_Ve2");             
            var strSymbol = "";
            var strOrders = edu.util.getValById("txtOrder_Ve2");

            me.save_Answer_Ve2(strAnswer_SencondId,
                strContent,
                me.strQuestionId,
                strSymbol,
                strOrders);
            //setTimeout(function () {
            //    me.getandGenList_Answer();
            //}, 2000);

        });
        $("#drpLoaiCauHoi").on("select2:select", function () {            
            me.strQuestionTypeCode = $("#drpLoaiCauHoi").find('option:selected').attr("name");
            
            $("#zoneDapAn_KieuRadio").attr("display", "none");
            $("#zoneDapAnKieu_CheckBox").attr("display", "none"); 
            $("#zoneDapAn_Ve2").attr("display", "none");
            if (me.strQuestionTypeCode == "MULTICHOICE") {
                $("#zoneDapAn_KieuCheckBox").removeAttr("display"); 
            }
            if (me.strQuestionTypeCode == "BESTANSWER") {
                $("#zoneDapAn_KieuRadio").removeAttr("display"); 
            }
            if (me.strQuestionTypeCode == "CROSSLINK") {
                
                $("#zoneDapAn_Ve2").removeAttr("display");
            }
            me.getList_DapAn(me.strQuestionId);            

            
        });
        $("#drpQuestionStatus").on("select2:select", function () {
            me.getList_CauHoi();
        });
        $("#btnSave_CauHoi").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "drpDaoDapAn", "THONGTIN1": "EM" },
                { "MA": "drpMucDoCauHoi", "THONGTIN1": "EM" },
                { "MA": "drpTrangThaiCauHoi", "THONGTIN1": "EM" },
                { "MA": "txtDiemCong", "THONGTIN1": "EM" },
                { "MA": "drpLoaiCauHoi", "THONGTIN1": "EM" },

            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_Question();
            
        }); 
        $("#btnDelete_CauHoi").click(function () {
            
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_Question(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All();
                me.getList_CauHoi(me.strQuestionId);
            }, 2000);
        }); 
        $("[id$=chkSelectAll_CauHoi]").on("click", function () {
            
            me.checkedCol_BgRow("tblCauHoi");

        });
        $("[id$=chkSelectAll_Temp_TheoSoY]").on("click", function () {

            me.checkedCol_BgRow("tblCauHoi_Temp");

        });
        $("#btnXoa_DapAn").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDapAn", "checkX");

            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_Answer(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {                
                me.getList_DapAn_All();
                me.getList_CauHoi();
                me.getList_DapAn(me.strQuestionId);
            }, 2000);
        }); 
        $("#btnXoa_DapAn_Ve2").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDapAn_Ve2", "checkX");

            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_Answer_Sencond(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All();
                me.getList_CauHoi();
                me.getList_DapAn_Ve2(me.strQuestionId);
            }, 2000);
        }); 
         
        $("[id$=chkSelectAll_DapAn_Ve2]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDapAn_Ve2" });
        }); 
        me.checkedCol_BgRow("tblDapAn");
        me.checkedCol_BgRow("tblDapAn");

        me.checkedCol_BgRow("tblDapAn_Temp");
        $("#btnSave_DapAn").click(function () {   
            var arrChecked_Id =  edu.util.getAllArrCheckBoxIds("tblDapAn", "checkX"); 
         
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strAnswerId = arrChecked_Id[i];
                  
                    var strCorrect = "0"; 
                    var strFixViTri = "0";
                    if ($("#chkFixViTri" + strAnswerId).is(":checked"))
                        strFixViTri = "1";                      
                    if (me.strQuestionTypeCode == "MULTICHOICE") { 
                        if ($("#chkCorrect" + strAnswerId).is(":checked"))
                            strCorrect = "1"; 
                    }
                    if (me.strQuestionTypeCode == "BESTANSWER") { 
                        if ($("#rdoCorrect" + strAnswerId).is(":checked"))
                            strCorrect = "1"; 
                    } 
                    

                    //var strContent = edu.util.getValById("txtNoiDungDapAn" + strAnswerId); 
                    var strContent = CKEDITOR.instances['editor_DapAn' + strAnswerId].getData();
               
                    var strContent2 = edu.util.getValById("txtNoiDungDapAn_Ve2" + strAnswerId); 
                    var strDiemDapAn = edu.util.getValById("txtDiemDapAn" + strAnswerId); 
                    
                   
                    var List = new Array();
                    $('#lstVe2'+strAnswerId+' option:selected').each(function () {
                        List.push($(this).val()); 
                    }); 
                    var strAnswer_SencondId = List.join("#");                   
                    var strSymbol = "";
                    var strOrders = edu.util.getValById("txtOrders" + strAnswerId);
                     
                    me.save_Answer(strAnswerId,
                        strContent,
                        strCorrect,
                        me.strQuestionId,
                        strContent2,
                        strAnswer_SencondId,
                        strSymbol,
                        strOrders,
                        strFixViTri,
                        strDiemDapAn);
                }
            });
            setTimeout(function () {                
                me.getList_DapAn_All();
                me.getList_CauHoi();
                //me.getandGenList_Answer();
            }, 2000);
        }); 
        $("#btnSave_DapAn_Ve2").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblDapAn_Ve2", "checkX");

            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strAnswer_SencondId = arrChecked_Id[i];
                     var strContent = edu.util.getValById("txtContent_Ve2" + strAnswer_SencondId);
                    var strSymbol = "";
                    var strOrders = edu.util.getValById("txtOrders_Ve2" + strAnswer_SencondId);

                    me.save_Answer_Ve2(strAnswer_SencondId,
                        strContent,
                        me.strQuestionId,
                        strSymbol,
                        strOrders);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All();
                me.getList_CauHoi();
               // me.getandGenList_Answer();
                me.getList_DapAn_Ve2(me.strQuestionId);
            }, 2000);
        }); 
        //#endregion
        //#region Cau hoi Temp
        $("#btnView_CauHoi_Temp").click(function () {

            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Bạn chưa chọn nhóm câu hỏi");
                return;
            }
            me.toggle_edit_CauHoi_Temp();
            //me.viewEdit_CauHoi(dt[0]);
            me.getList_DapAn_All_Temp();
            me.getList_CauHoi_Temp(); 
        });
        $("#btnCall_Import_DMIP").click(function () {

            if (me.strGroupQuestionDetailId == "") {
                edu.system.alert("Bạn chưa chọn nhóm câu hỏi");
                return;
            }
            
            if ($("#drpLoaiCauHoi_Imp").find('option:selected').val() == "") {
                edu.system.alert("Bạn chưa chọn loại câu hỏi");
                return;
            }
            me.popup_import();
        });
        $("#btnImport_DMIP_Doc").click(function () {
            console.log(me.strMucPheDuyetId);
            me.import_DMIP_Doc();
        });
        $("[id$=chkSelectAll_CauHoi_Temp]").on("click", function () {
            
            me.checkedCol_BgRow("tblCauHoi_Temp");
        });
        $("[id$=chkSelectAll_TheoSoY]").on("click", function () {
            me.checkedCol_BgRow("tblCauHoi");
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
        $("#btnKiemTra_CauHoi_Temp").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần kiểm tra?");
                return;
            }
            var strId = "";
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strId += arrChecked_Id[i] + ",";
            }
            strId = strId.substr(0, strId.length - 1);
            me.getList_CheckCauHoi(
                strId,
                "zonePreviewTableQuestion_Temp"
            );
        }); 
        $("#btnUpdate_CauHoi_Temp_STT").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblCauHoi_Temp", "checkX");
            edu.system.confirm("Bạn có chắc chắn cập nhật liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    
                    var strId = arrChecked_Id[i];
                    var strOrderNumber = edu.util.getValById("txtCauHoi_Temp_STT" + strId);
                    var strTinhDiemTheoSoY = "0";
                    if ($("#chkTINHDIEMTHEOSOY" + strId).is(":checked"))
                        strTinhDiemTheoSoY = "1";
                    var dt = edu.util.objGetDataInData(strId, me.dtCauHoi_Temp, "ID");
                    if (strTinhDiemTheoSoY != edu.util.returnEmpty(dt[0].TINHDIEMTHEOSOY)
                        || strOrderNumber != edu.util.returnEmpty(dt[0].ORDERNUMBER))
                        me.Update_Question_Temp_STT(strId, strOrderNumber, strTinhDiemTheoSoY);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp();
            }, 2000);
        }); 
        $("#btnUpdate_CauHoi_STT").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblCauHoi", "checkX");
            edu.system.confirm("Bạn có chắc chắn cập nhật liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {

                    var strId = arrChecked_Id[i];
                    var strOrderNumber = edu.util.getValById("txtCauHoi_STT" + strId);
                    var strTinhDiemTheoSoY = "0"; 
                    if ($("#chkTINHDIEMTHEOSOY" + strId).is(":checked"))
                        strTinhDiemTheoSoY = "1";                   
                    var dt = edu.util.objGetDataInData(strId, me.dtCauHoi, "ID");
                    
                    if (strTinhDiemTheoSoY != edu.util.returnEmpty(dt[0].TINHDIEMTHEOSOY)
                        || strOrderNumber != edu.util.returnEmpty(dt[0].ORDERNUMBER))
                        me.Update_Question_STT(strId, strOrderNumber, strTinhDiemTheoSoY);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All();
                me.getList_CauHoi();
            }, 2000);
        }); 
       
        $(".btnCloseImport").click(function () { 
            me.toggle_batdau_Temp();
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
        $("#tblAudioFiles").delegate(".btnDelete_AudionFiles", "click", function () {            
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.Xoa_AudioFiles(strId);
                

                setTimeout(function () {
                    me.getList_AudioFiles();

                }, 500);
            });

        });
        $("#tblQuestionAudioFiles").delegate(".btnDelete_QuestionAudionFiles", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.Xoa_AudioFiles(strId);
                setTimeout(function () {
                    me.getList_QuestionAudioFiles();

                }, 500);
            });

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


                    var List = new Array();
                    $('#lstVe2_Temp' + strAnswerId + ' option:selected').each(function () {
                        List.push($(this).val());
                    });
                    var strAnswer_SencondId = List.join("#");
                    var strSymbol = "";
                    var strDiemDapAn = edu.util.getValById("txtDiemDapAn_Temp" + strAnswerId);
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
        $("#btnThem_DapAn_Temp").click(function () {
            if (me.strQuestionId == "") {
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
            var strOrders = edu.util.getValById("txtOrder_Temp");

            me.save_Answer_Temp(strAnswerId,
                strContent,
                strCorrect,
                me.strQuestionId,
                strContent2,
                strAnswer_SencondId,
                strSymbol,
                strOrders);
            
        });
        $("#drpLoaiCauHoi_Imp").on("select2:select", function () {
            me.getList_DapAn_All_Temp();
            me.getList_CauHoi_Temp();
        });
        $("#btnThem_DapAn_Ve2_Temp").click(function () {
            if (me.strQuestionId == "") {
                edu.system.alert("Chưa chọn câu hỏi");
                return;
            }
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...        
                { "MA": "txtContent_Ve2_Temp", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            var strAnswer_SencondId = "";
            var strContent = edu.util.getValById("txtContent_Ve2_Temp");
            var strSymbol = "";
            var strOrders = edu.util.getValById("txtOrder_Ve2_Temp");

            me.save_Answer_Ve2_Temp(strAnswer_SencondId,
                strContent,
                me.strQuestionId,
                strSymbol,
                strOrders);
            setTimeout(function () {
                me.getandGenList_Answer_Temp();
            }, 2000);

        });
        $("#btnXoa_DapAn_Ve2_Temp").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDapAn_Ve2_Temp", "checkX");

            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_Answer_Sencond_Temp(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_Temp(me.strQuestionTempId);
                me.getList_CauHoi_Temp();
                me.getList_DapAn_Ve2_Temp(me.strQuestionTempId);
            }, 2000);
        }); 
        $("#btnAdd_DuaVaoNganHangDe").click(function () { 
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_Temp", "checkX");

            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thao tác?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thao tác dữ liệu không?");
            
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.DuaCauHoiTmpVaoNH(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DapAn_All_Temp();
                me.getList_CauHoi_Temp(); 
              
                me.getList_DapAn_All();
                me.getList_CauHoi();
                 
            }, 2000);
        }); 
        $("#btnSave_GroupQuestionDetailContent").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "drpTrangThai_GroupQuestionDetailContent", "THONGTIN1": "EM" },                
            ];
           
            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_GroupQuestionDetailContent();
            
            setTimeout(function () {
                me.getList_AudioFiles();
            }, 100); 
        });
        //#endregion
        $("#btnShowPreview_CauHoi").click(function () {
            //$("#zoneChiTiet").hide();
            me.toggle_edit_ShowPreviewCauHoi(); 

        });
        $(".btnClose_ShowPreview_CauHoi").click(function () {
            me.toggle_batdau_ThaoTac_ShowPreview_CauHoi();
        });
        $("#drpNamHoc").on("select2:select", function () {
            me.getList_drpHocKy();
             
        });
        $("#drpHocKy").on("select2:select", function () {
            me.getList_drpDotThi();
            
        });
        $("#drpDotThi").on("select2:select", function () {
            me.getList_drpHocPhan_TheoDotThi(); 
        });
        $(".btnClose_ThaoTac_CauHoiDaTaoDe").click(function () {
            me.toggle_batdau_ThaoTac_CauHoiDaTaoDe();
        });
       
        $(".btnSearch_PhongThi_ThiSinh").click(function () { 
            me.getList_CauHoiDaTaoDe(me.strQuestionId);
           
        });
        $("#drpPhongThiDungCauHoi").on("select2:select", function () {
            me.getListSeach_CauHoiDaTaoDe(me.strQuestionId); 
        });
        $("#btnTinhLaiDiemThiSinhPhongThi").click(function () { 
            var strExamRoomInfoId = "";
            var strStudentExamRoomId = "";
            var strThiSinhId = "";
            var strUserId = "";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_DaTaoDe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần tính lại?");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strExamRoomInfoId = edu.util.getValById('checkEXAMROOMINFOID' + arrChecked_Id[i]);
                strStudentExamRoomId = edu.util.getValById('checkSTUDENTEXAMROOMID' + arrChecked_Id[i]);
                strThiSinhId = edu.util.getValById('checkSTUDENTID' + arrChecked_Id[i]);
                strUserId = edu.system.userId;
                me.getList_TinhLaiDiemThiSinh(strExamRoomInfoId, strStudentExamRoomId, strThiSinhId, strUserId); 
            }
            
        });
        $("#btnSaveDiem_ThiSinhPhongThi").click(function () {
            var strExamRoomInfoId = "";
            var strStudentExamRoomId = "";
            var strThiSinhId = "";
            var strUserId = "";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi_DaTaoDe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần luu?");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strExamRoomInfoId = edu.util.getValById('checkEXAMROOMINFOID' + arrChecked_Id[i]);
                strStudentExamRoomId = edu.util.getValById('checkSTUDENTEXAMROOMID' + arrChecked_Id[i]);
                strThiSinhId = edu.util.getValById('checkSTUDENTID' + arrChecked_Id[i]);
                strUserId = edu.system.userId
                var strMark = edu.util.getValById("txtDiemDuocCongNhan" + strStudentExamRoomId);
             
                me.save_DiemSuaCauHoi(strStudentExamRoomPartId, strMark);
            }

        });
        $("[id$=chkSelectAll_CauHoiThiSinhPhongThi]").on("click", function () {
            me.checkedCol_BgRow("tblCauHoi_DaTaoDe");
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
        me.getList_MucPheDuyet();
        me.getList_drpDonVi();
        me.getList_GroupQuestion();
        me.getList_drpLoaiCauHoi_Imp();
        edu.system.uploadFiles(["txt_File_Audio"], "Audio");
        edu.system.uploadFiles(["txt_Question_Audio"], "QuestionAudio");
        me.getList_drpNamHoc();
        me.getList_drpHocKy();
        me.getList_drpDotThi();
        
        //$("#test1").html('<p><strong>Thiết bị n&agrave;o trong m&aacute;y t&iacute;nh c&oacute; nhiệm&nbsp;&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mn>333</mn></msqrt></math>&nbsp;vụ tải file hệ thống khi khởi động m&aacute;y t&iacute;nh?</strong></p><p><strong><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msubsup><mi>HC</mi><mn>3</mn><mn>3</mn></msubsup></math></strong></p>')
        // Hien thi cong thuc
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'test1']);

   
       
    }, 
    //#region GroupQuestion
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
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_GroupQuestion()",
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
                        return '<span><a class="btn btn-default btnGroupQuestion_Edit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
                    }
                },  
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnGroupQuestion_Detail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
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
    rewrite_GroupQuestion: function () {
        var me = this;
        me.strGroupQuestionId = "";
        $("#lblDonVi").html($("#drpDonVi option:selected").text());      

        edu.util.viewValById("txtGroupQuestionCode", "");
        edu.util.viewValById("txtGroupQuestionName", "");
        $("#drpGroupQuestionStatus").val("").change();

    },
    toggle_edit_GroupQuestion: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneGroupQuestion");
    },  
    viewEdit_GroupQuestion: function (dt) {
        var me = this;
        me.strGroupQuestionId = dt.ID;
        me.strDepartOrganId = dt.DEPARTORGANID;
       
        $("#lblDonVi").html(dt.DEPARTORGANNAME);
        edu.util.viewValById("txtGroupQuestionCode", dt.GROUPQUESTIONCODE);
        edu.util.viewValById("txtGroupQuestionName", dt.GROUPQUESTIONNAME); 
        $("#drpGroupQuestionStatus").val(dt.GROUPQUESTIONSTATUS).change(); 
    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    save_GroupQuestion: function (strGroupQuestionId) {
        var me = this; 
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_GroupQuestion',
            'versionAPI': 'v1.0',
            'strId': "",
            'strCode': edu.util.getValById('txtGroupQuestionCode'),
            'strName': edu.util.getValById('txtGroupQuestionName'),
            'strDepartOrganId': edu.util.getValById('drpDonVi'),
            'strStatus': edu.util.getValById('drpGroupQuestionStatus'),            
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strGroupQuestionId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/CapNhat_GroupQuestion';
            obj_save.strId = me.strGroupQuestionId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_GroupQuestion();
                    me.strGroupQuestionId = data.ID;
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
    delete_GroupQuestion: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_GroupQuestion',
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
    Chuyen_Question: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Chuyen_Question',
            'versionAPI': 'v1.0',
            'strId': strIds,
            'strGroupQuestionDetailId': me.strMove_CauHoi_GroupQuestionDetailId,
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
    //#endregion
    //#region zoneGroupQuestionDetail
     
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
            renderPlaces: ["zone_GroupQuestionDetail_treejs","zone_Move_CauHoi_treejs"],
            style: "fa fa-user color-active"
        };

         
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_GroupQuestionDetail_treejs').on("select_node.jstree", function (e, data) {
            
            $("#lblTenNhomCauHoi").html(data.node.text.toUpperCase());
            me.strGroupQuestionDetailId = data.node.id; 
            me.getList_DapAn_All();
            //Set GroupQuestionDetail text for edit
            me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId); 
            me.getList_CauHoi();  
            me.rewrite_editor_GroupQuestionDetailContent();  
           
            me.getList_AudioFiles();
         
        });
        $('#zone_Move_CauHoi_treejs').on("select_node.jstree", function (e, data) { 
            me.strMove_CauHoi_GroupQuestionDetailId = data.node.id;
            me.strMove_CauHoi_GroupQuestionDetailText = data.node.text.toUpperCase(); 
             

        });

    },
    getList_AudioFiles: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_Files/LayDanhSach',
            'versionAPI': 'v1.0',
            'strDuLieu_Id': me.strGroupQuestionDetailId,            
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.viewFiles("txt_File_Audio", "", "QLTTN_Files");
                    edu.system.viewFiles("txt_File_Audio", me.strGroupQuestionDetailId, "QLTTN_Files");

                    me.genTable_AudioFiles(data.Data);
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

    genTable_AudioFiles: function (data) {       
        var me = this;                          
        
        var rootPathUploadFile = edu.system.rootPathUpload;
        
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
                            '    <source src="' + rootPathUploadFile + '/' + aData.DUONGDAN + '" type="audio/mp3"> ' +

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
    getList_CauHoi: function () {
        var me = this;
        console.log(me.strGroupQuestionDetailId);
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
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_CauHoi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: { 
                left: [1, 2, 3],
                center: [4,5,6,7,8,9,10],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type = "text" id = "txtCauHoi_STT' + aData.ID + '" value="' + edu.util.returnEmpty(aData.ORDERNUMBER) + '" class="form-control " />';
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
                            if (dt[i].ORDERS == "")
                                row += '<span style="color:red">' + dt[i].ORDERABC + dt[i].CONTENT + '</span>  </br>';
                            else
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
                        return '<span>' + vDapAn+ '</span>';
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
                        var strReturn = "<input type='checkbox' id='chkTINHDIEMTHEOSOY" + aData.ID + "' class='optcheckbox' name='chkTINHDIEMTHEOSOY" + aData.ID + " ' />";
                        if (aData.TINHDIEMTHEOSOY == "1")
                            strReturn = "<input type='checkbox'    id='chkTINHDIEMTHEOSOY" + aData.ID + "' checked class='optcheckbox' name='chkTINHDIEMTHEOSOY" + aData.ID + " ' />";
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var SOLUOTDATHI = aData.SOLUOTDATHI_CHUALUU + aData.SOLUOTDATHI_DALUU;
                        return '<span style="color:chocolate;">' + SOLUOTDATHI + '</span> </br>' +
                            '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Đã dùng"><i class="fa fa-eye color-active"></i>Đã dùng</a></span> </br> ' + 
                            '<span><a class="btn btn-default btnViewLichSu_CauHoi" id="' + aData.ID + '" title="Lịch sử câu hỏi"><i class="fa fa-eye color-active"></i>Lịch sử câu hỏi</a></span> </br>' +
                            '<span><a class="btn btn-default btnViewLichSu_DapAn" id="' + aData.ID + '" title="Lịch sử đáp án"><i class="fa fa-eye color-active"></i>Lịch sử đáp án</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit_Question" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblCauHoi']);
        MathJax.typesetPromise([document.getElementById('tblCauHoi')]);

    },
    getList_DapAn_All: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_DapAn_All',
            'versionAPI': 'v1.0',
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
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
     
    ThaoTac: function (strThaoTac) {
        var me = this;         
        if (strThaoTac == "btnThaoTac_Sua") {
            me.rewrite_ThaoTac_GroupQuestionDetail();
            me.toggle_edit_ThaoTac_GroupQuestionDetail();
            me.getDetail_GroupQuestionDetail(me.strGroupQuestionDetailId);
            return;
        }
        if (strThaoTac == "btnThaoTac_ThemMoi") {
            me.strGroupQuestionDetailId = "";
            me.rewrite_ThaoTac_GroupQuestionDetail();
            me.toggle_edit_ThaoTac_GroupQuestionDetail();
            getList_drpNhomCauHoiCha(me.strGroupQuestionDetailId);
            me.strGroupQuestionDetailId = "";
            me.getDetail_GroupQuestionDetail("");
            
            return;
        }
        if (strThaoTac == "btnThaoTac_Xoa") {
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                me.Xoa_NhomCauHoi(me.strGroupQuestionDetailId);

            }); 
            return;
        }


    },
    toggle_batdau_GroupQuestionDetail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneGroupQuestionDetail");
    },
    toggle_batdau_ThaoTac_GroupQuestionDetail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonebatdauGroupQuestionDetail");
    },
    toggle_batdau_ThaoTac_Move_CauHoi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonebatdauGroupQuestionDetail");
    },
    toggle_edit_ThaoTac_GroupQuestionDetail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneEditGroupQuestionDetail");

    },
    rewrite_ThaoTac_GroupQuestionDetail: function () {
        var me = this;
        edu.util.viewValById("txtMaNhomGroupQuestionDetail", "");
        edu.util.viewValById("txtTenNhomGroupQuestionDetail", "");
        edu.util.viewValById("drpNhomCauHoiChaGroupQuestionDetail", "");
        $("#chkTapHopCacCauHoi").attr("checked", false); 

    },
    getDetail_GroupQuestionDetail: function (strGroupQuestionDetailId) {
        var me = this;
        var data = edu.util.objGetDataInData(strGroupQuestionDetailId, me.dtGroupQuestionDetail, "ID");
        me.viewEdit_GroupQuestionDetail(data);
    },
    viewEdit_GroupQuestionDetail: function (data) {
        var me = this;
        //call popup --Edit 
        
        if (data.length >0 ) {
            edu.util.viewValById("txtTenNhomGroupQuestionDetail", data[0].NAME);
            edu.util.viewValById("txtMaNhomGroupQuestionDetail", data[0].CODE);
            edu.util.viewValById("drpNhomCauHoiChaGroupQuestionDetail", data[0].PARENTID);
            if (data[0].TAPHOPCACCAUHOI == "1")
                $("#chkTapHopCacCauHoi").prop("checked", true);
            else
                $("#chkTapHopCacCauHoi").prop("checked", false);

            me.getList_drpNhomCauHoiCha(data[0].PARENTID);
        }
        else {
            edu.util.viewValById("txtTenNhomGroupQuestionDetail", "");
            edu.util.viewValById("txtMaNhomGroupQuestionDetail","");
            edu.util.viewValById("drpNhomCauHoiChaGroupQuestionDetail", "");
           

            me.getList_drpNhomCauHoiCha("");
        }

    },
    save_GroupQuestionDetail: function (strGroupQuestionDetailId) {
        var me = this;        
        var strTapHopCacCauHoi = $("#chkTapHopCacCauHoi").is(":checked") == true ? "1" : "0";
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_GroupQuestionDetail',
            'versionAPI': 'v1.0',
            'strId': "",
            'strCode': edu.util.getValById('txtMaNhomGroupQuestionDetail'),
            'strName': edu.util.getValById('txtTenNhomGroupQuestionDetail'),
            'strParentId': edu.util.getValById('drpNhomCauHoiChaGroupQuestionDetail'),
            'strGroupQuestionId': me.strGroupQuestionId,            
            'strTapHopCacCauHoi': strTapHopCacCauHoi,     
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strGroupQuestionDetailId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/CapNhat_GroupQuestionDetail';
            obj_save.strId = strGroupQuestionDetailId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_GroupQuestionDetail();
                    //me.strGroupQuestionId = data.ID;
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
    Xoa_NhomCauHoi: function (strId) {
        var me = this;


        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_GroupQuestionDetail',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strGroupQuestionDetailId = '';
                    me.getList_GroupQuestionDetail();
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
                    
                    me.dtLoaiCauHoi = data.Data;
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


    getList_drpNhomCauHoiCha: function (strNhomcauHoiCha_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_TreeGroupQuestionDetail',          
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
                    me.gen_drpNhomCauHoiCha(data.Data, strNhomcauHoiCha_Id);

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
    gen_drpNhomCauHoiCha: function (data, strNhomcauHoiCha_Id) {
        var me = this;
        if (strNhomcauHoiCha_Id == undefined) strNhomcauHoiCha_Id = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder",
                default_val: strNhomcauHoiCha_Id
            },
            renderPlace: ["drpNhomCauHoiChaGroupQuestionDetail"],
            title: "--Chọn nhóm câu hỏi--"
        };
        edu.system.loadToCombo_data(obj);
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
                    me.gen_drpMucDoCauHoi(data.Data, strLevelQuestionId);

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


    toggle_edit_CauHoi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneCauHoiEdit");
    },
    toggle_edit_PreviewCauHoi: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
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
            "zonePreviewTableQuestion"
        );
        
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zonePreviewCauHoiEdit");
    },
    toggle_edit_Move_CauHoi: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
            return;
        }
        $("#lblSoCauChuyen").html("Tổng số câu thực hiện chuyển:" + arrChecked_Id.length);

         

        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneMove_CauHoi");
    },
    toggle_edit_ShowPreviewCauHoi: function () {
        var me = this; 
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneShowPreviewCauHoiEdit");
        //$("#divShowPreviewTableQuestion").html(CKEDITOR.instances['editor_nhomcauhoi'].getData());
      
        var dtQuestion = edu.util.objGetDataInData(me.strQuestionId, me.dtCauHoi, "ID");
        var dtAnswer1 = edu.util.objGetDataInData(me.strQuestionId, me.dtDapAn_All, "QUESTIONID");        
        var dtAnswer_Sencond = edu.util.objGetDataInData(me.strQuestionId, me.dtAnswer_Ve2, "QUESTIONID");         
        me.genTable_PreviewCauHoi(dtQuestion, dtAnswer1, dtAnswer_Sencond, "zoneShowPreviewTableQuestion");
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, '#zoneShowPreviewTableQuestion']);
        
         
    },
    rewrite_CauHoi: function () {
        var me = this;
        //edu.util.viewValById("txtNhomCauHoi", "");
        //CKEDITOR.instances['editor'].setData('');

        CKEDITOR.instances['editor_nhomcauhoi'].setData('');
        CKEDITOR.instances['editor_txtContent'].setData('');
        CKEDITOR.instances['editor_txtContent_Temp'].setData('');
        //edu.util.viewValById("drpTrangThaiCauHoi", "");
        edu.util.viewValById("txtDiemCong", "");
        edu.util.viewValById("txtDiemTru", "");
        edu.util.viewValById("txtThoiGian", "");
        $('#chkCachTinhDiemTheoSoY').prop('checked', false);

        
        edu.util.viewValById("txtOrder", "");
        edu.util.viewValById("txtOrderNumber", "");
        $("#drpDaoDapAn").val("").trigger("change");
        me.getList_drpLoaiCauHoi('');
     
        me.getList_drpMucDoCauHoi('');


    },
    viewEdit_CauHoi: function (data) {
        var me = this;
        //call popup --Edit     

        //edu.util.viewValById("txtNoiDungCauHoi", data.CONTENT);    
      
        setTimeout(function () {
            CKEDITOR.instances['editor_nhomcauhoi'].setData(data.CONTENT);

        }, 100);
        
        me.strQuestionId = data.ID;

        $("#drpTrangThaiCauHoi").val(data.STATUS).trigger("change");
        edu.util.viewValById("txtDiemCong", data.PLUSMARK);
        edu.util.viewValById("txtDiemTru", data.MINUSMARK);
        edu.util.viewValById("txtThoiGian", data.THOIGIAN);
        $('#chkCachTinhDiemTheoSoY').prop('checked', false);
        if (data.TINHDIEMTHEOSOY =="1")
            $('#chkCachTinhDiemTheoSoY').prop('checked', true);

        edu.util.viewValById("txtOrderNumber", data.ORDERNUMBER);
        $("#drpDaoDapAn").val(data.DAODAPAN).trigger("change");
        me.getList_drpLoaiCauHoi(data.QUESTIONTYPEID);
        me.getList_drpMucDoCauHoi(data.QUESTIONLEVELID); 
    },
    getandGenList_Answer: function () {
        var me = this;
        
        $("#txtContent2").hide();
        if (me.strQuestionId != "")
            $('#drpLoaiCauHoi').attr("disabled", true);
        $("#zoneDapAn_Ve2").hide();

        if (me.strQuestionTypeCode == "CROSSLINK") {
            $("#zoneDapAn_Ve2").show();
            me.getList_DapAn_Ve2(me.strQuestionId);
        }
        if (me.strQuestionTypeCode == "FILLTHEBLANK" || me.strQuestionTypeCode == "KEOTHAXUONGDAPAN") {
            $("#txtContent2").show();
        }
        

        var strcolHidden = "";
        if (me.strQuestionTypeCode == "BESTANSWER") {
           strcolHidden = "3,6,7,8";
        }
        if (me.strQuestionTypeCode == "MULTICHOICE" || me.strQuestionTypeCode == "TRUEFALSE" || me.strQuestionTypeCode == "TRUEFALSEONE" ) {
            strcolHidden = "4,6,7,8";
        }
        
        if (me.strQuestionTypeCode == "FREETEXT"   ) {
            strcolHidden = "2,3,4,6,7";
        }
        if (me.strQuestionTypeCode == "CROSSLINK") {
            strcolHidden = "3,4,7,8";
        }
        if (me.strQuestionTypeCode == "FILLTHEBLANK" || me.strQuestionTypeCode == "KEOTHAXUONGDAPAN") {
            strcolHidden = "3,4,6,8";
        }

        
        setTimeout(function () { 
            //Ẩn cột sử dụng đối với bảng không sử dụng colspan và rowspan
            var x = $("#tblDapAn")[0].rows; 

            for (var iCol = 0; iCol < x[0].cells.length; iCol++) {
                for (var i = 0; i < x.length; i++) {
                    if (x[i].cells[iCol])
                    x[i].cells[iCol].style.display = "";
                }
            } 
            var colHidden;
            if (strcolHidden) {
                var arrcolHidden = [strcolHidden];
                if (strcolHidden.indexOf(",") != -1) arrcolHidden = strcolHidden.split(','); 

                for (var iCol = 0; iCol < arrcolHidden.length; iCol++) {
                    colHidden = arrcolHidden[iCol];                   
                    for (var i = 0; i < x.length; i++) { 
                        if (x[i].cells[colHidden])
                            x[i].cells[colHidden].style.display = "none";
                    }
                }
            }
           // MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblDapAn']);
            MathJax.typesetPromise([document.getElementById('tblDapAn')]);

        }, 100);
        
    },
    getList_DapAn: function (strQuestionId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_AnswerByQuestionId',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDapAn = data.Data;
                    me.genTable_DapAn(data.Data, data.Pager);
                    
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
    genTable_DapAn: function (data, iPager) {
        var me = this; 
        var jsonForm = {
            strTable_Id: "tblDapAn",
            aaData: data, 
            colPos: { 
                left: [1] 
            },             
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtOrders' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='checkbox' id='chkFixViTri" + aData.ID + "' class='optcheckbox' name='chkFixViTri" + aData.ID + " ' />";
                        if (aData.FIXVITRI == "1")
                            strReturn = "<input type='checkbox'    id='chkFixViTri" + aData.ID + "' checked class='optcheckbox' name='chkFixViTri" + aData.ID + " ' />";
                        return strReturn;
                    }
                },
                {
                    //<!--3: MULTICHOICE-->
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='checkbox'    id='chkCorrect" + aData.ID + "' class='optcheckbox' name='chkCorrect" + aData.ID + " ' />";
                        if (aData.CORRECT == "1")
                            strReturn = "<input type='checkbox'    id='chkCorrect" + aData.ID + "' checked class='optcheckbox' name='chkCorrect" + aData.ID + " ' />";
                        return strReturn;

                    }
                },
                {
                     //<!--4: BESTANSWER-- >
                    "mRender": function (nRow, aData) {
                        var strReturn = "<input type='radio'    id='rdoCorrect" + aData.ID + "' class='optcheckbox' name='rdoCorrect" + me.strQuestionId + " ' />";
                        if (aData.CORRECT == "1")
                            strReturn = "<input type='radio'    id='rdoCorrect" + aData.ID + "' checked class='optcheckbox' name='rdoCorrect" + me.strQuestionId + " ' />";
                        return strReturn;

                    }
                },
                {
                    //<!--5: -- >
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CONTENT)  
                            + '<span><a class="btn btn-default btnEdit_NoiDungDapAn" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>'
                            + '<div id="zoneCK_NoiDungDapAn' + aData.ID +'"><textarea name="editor_DapAn' + aData.ID +'" id="editor_DapAn' + aData.ID +'"></textarea></div>';
                    }
                },
                {
                    //<!--6: CROSSLINK-- >
                    "mRender": function (nRow, aData) {
                        var lstVe2 = '<select id="lstVe2' + aData.ID +'" multiple="multiple" ></select>';                         
                        return lstVe2; 
                    }
                },
                {
                    //<!--7: FILLTHEBLANK-- >
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtNoiDungDapAn_Ve2' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.CONTENT2) + '" class="form-control" />';
                    }
                },
                {
                    //<!--8: Điểm tự luận-- >
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtDiemDapAn' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.MARK) + '" class="form-control" />';
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

            CKEDITOR.replace('editor_DapAn' + data[i].ID);
            $("#zoneCK_NoiDungDapAn" + data[i].ID).hide();           
            
            CKEDITOR.instances['editor_DapAn' + data[i].ID].setData(data[i].CONTENT);
            var strSelectId;
            if (data[i].ANSWER_SENCONDID != null)
                strSelectId = data[i].ANSWER_SENCONDID.split("#");
            me.getList_lstVe2(me.strQuestionId, 'lstVe2' + data[i].ID, strSelectId);
            
        }
        me.getandGenList_Answer();
    },

    getList_DapAn_Ve2: function (strQuestionId) {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_Answer_Sencond',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_DapAn_Ve2(data.Data, data.Pager);
                    
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
    genTable_DapAn_Ve2: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDapAn_Ve2",
            aaData: data,
            bHiddenOrder: true,
            colPos: {
                center: [0],
                left: [1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtOrders_Ve2' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtContent_Ve2' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.CONTENT) + '" class="form-control" />';
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
    },
    getList_lstVe2: function (strQuestionId, lstVe2Id, strSelectId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_Answer_Sencond',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtAnswer_Ve2 = data.Data;
                    me.genTable_lstVe2(data.Data, lstVe2Id, strSelectId);
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
    genTable_lstVe2: function (data, lstVe2Id, strSelectId) { 
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
        //if (strSelectId != undefined)
        //$("#" + lstVe2Id).select2();
        $("#"+lstVe2Id+" option[value='SELECTALL']").remove();

    },
    save_Question: function () {
        var me = this;
        var strTinhDiemTheoSoY = "0";
        if ($("#chkCachTinhDiemTheoSoY").is(":checked"))
            strTinhDiemTheoSoY = "1";
         var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_Question',
            'versionAPI': 'v1.0',
            'strId': "",    
            'strContent': CKEDITOR.instances['editor_nhomcauhoi'].getData(),
            'strStatus': edu.util.getValById('drpTrangThaiCauHoi'),
            'strPlusMark': edu.util.getValById('txtDiemCong'),
            'strMinusMark': edu.util.getValById('txtDiemTru'),
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi'),
            'strLevelId': edu.util.getValById('drpMucDoCauHoi'),
            'strDaoDapAn': edu.util.getValById('drpDaoDapAn'),
            'strTile': '',
            'strOrderNumber': edu.util.getValById('txtOrderNumber'),
            'strTinhDiemTheoSoY': strTinhDiemTheoSoY,
            'strThoiGian': edu.util.getValById('txtThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strQuestionId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_Question';
            obj_save.strId = me.strQuestionId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strQuestionId = data.Id;
                    me.getList_CauHoi();  
                    $('#drpLoaiCauHoi').attr("disabled", true);
                    me.strQuestionTypeCode = $("#drpLoaiCauHoi").find('option:selected').attr("name");  
                    //QuestionTypeCode = $("#drpLoaiCauHoi").find('option:selected').val()
                    me.getList_DapAn(me.strQuestionId);
                    edu.system.saveFiles("txt_Question_Audio", me.strQuestionId, "QLTTN_Files");
                    
                    setTimeout(function () {
                        me.getList_QuestionAudioFiles();

                    }, 500);
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
    save_Answer: function (
        strAnswerId,
        strContent,
        strCorrect,
        strQuestionId,
        strContent2,
        strAnswer_SencondId,
        strSymbol,
        strOrders,
        strFixViTri,
        strDiemDapAn

    ) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_Answer',
            'versionAPI': 'v1.0',
            'strId': "",
            'strContent': strContent,
            'strCorrect': strCorrect,
            'strQuestionId': strQuestionId,
            'strContent2': strContent2,
            'strAnswer_SencondId': strAnswer_SencondId,
            'strSymbol': strSymbol,
            'strOrders': strOrders, 
            'strFixViTri': strFixViTri,
            'strMark': strDiemDapAn,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strAnswerId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_Answer';
            obj_save.strId = strAnswerId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    edu.util.viewValById("txtOrder", "");
                    
                    CKEDITOR.instances['editor_txtContent'].setData('');
                    edu.util.viewValById("txtContent2", "");
                    edu.system.alert("Thực hiện thành công");
                    me.getList_DapAn(strQuestionId);
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
    save_Answer_Ve2: function (
        strAnswer_SencondId,
        strContent,
        strQuestionId,
        strSymbol, 
        strOrders

    ) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_Answer_Sencond',
            'versionAPI': 'v1.0',
            'strId': "",
            'strContent': strContent, 
            'strQuestionId': strQuestionId,  
            'strSymbol': strSymbol,
            'strOrders': strOrders,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strAnswer_SencondId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_Answer_Sencond';
            obj_save.strId = strAnswer_SencondId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    edu.util.viewValById("txtOrder_Ve2", "");
                    edu.util.viewValById("txtContent_Ve2", "");
                    edu.system.alert("Thực hiện thành công");
                    me.getList_DapAn(me.strQuestionId);
                    me.getList_DapAn_Ve2(me.strQuestionId);
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

    Xoa_Question: function (strId) {
        var me = this;


        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_Question',
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
            async: false,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    CapNhatTinhTrang_Question: function (strId, strStatus) {
        var me = this;


        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/CapNhatTinhTrang_Question',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strStatus': strStatus,
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
                    edu.system.alert("Cập nhật dữ liệu thành công!");
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
    Xoa_Answer: function (strId) {
        var me = this;


        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_Answer',
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
    Xoa_Answer_Sencond: function (strId) {
        var me = this; 
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_Answer_Sencond',
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
    //#endregion
    //#region cau hoi Temp
    toggle_edit_CauHoi_Temp: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneCauHoi_Temp");
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
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
            
            window.open(strUrl );
            return;
        }
        var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHoi", "checkX");
        var strChecked_Id = "";

        for (var i = 0; i < arrChecked_Id.length; i++) {
            strChecked_Id += arrChecked_Id[i] + "#";
        }
        strChecked_Id = strChecked_Id.substring(strChecked_Id, strChecked_Id.length - 1);
        
        var arrTuKhoa = [];
        var arrDuLieu = []; 
        addKeyValue("MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId", strMau_LoaiCauHoiId); 
        addKeyValue("QUANLYNHCH.GroupquestiondetailId", me.strGroupQuestionDetailId); 
        addKeyValue("QUANLYNHCH.strStatus", edu.util.getValById('drpStatus'));        

        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);

        addKeyValue("QUANLYNHCH.strQuestionId", strChecked_Id);

        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strQuestionId", me.strQuestionId);        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strExamRoomInfoId", edu.util.getValById('drpPhongThiDungCauHoi'));   
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strDotThi_Id", edu.util.getValById('drpDotThi'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strTrangThaiPhongThi", edu.util.getValById('drpTrangThaiPhongThi'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strStatus", edu.util.getValById('drpStatusPhongThi'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strHocPhanId", edu.util.getValById('drpHocPhan_DotThi'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strTuNgay", edu.util.getValById('txtTuNgay'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strDenNgay", edu.util.getValById('txtDenNgay'));        
        addKeyValue("QUANLYNHCH_CAUHOIDADUNG.strTuKhoa", edu.util.getValById('txtSearch_TuKhoa'));        


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
    getList_CauHoi_Temp: function () {
        var me = this;
       
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_CauHoi_Temp',
            'versionAPI': 'v1.0',
            'strTuKhoa': '',
            'strGroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strStatus': '',
            'strMucPheDuyetId': me.strMucPheDuyetId,
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
        $("#lblDanhSachNhomCauHoi_Temp_Tong").html(iPager);
        
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
                center:[4,5,6,7],
            },
            aoColumns: [
                { 
                    "mRender": function (nRow, aData) {
                        return '<input type = "text" id = "txtCauHoi_Temp_STT' + aData.ID + '" value="' + edu.util.returnEmpty(aData.ORDERNUMBER) + '" class="form-control " />';
                    }
                },
                {
                    "mDataProp": "CONTENT"
                },
                {
                    "mRender": function (nRow, aData) {

                        var dt = edu.util.objGetDataInData(aData.ID, me.dtDapAn_All_Temp, "QUESTIONID");
                        var row = "";
                        for (var i = 0; i < dt.length; i++) {
                            if (dt[i].ORDERS == "")
                                row += '<span style="color:red">' + dt[i].ORDERABC + dt[i].CONTENT + '</span>  </br>';
                            else
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
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblCauHoi_Temp']);
        MathJax.typesetPromise([document.getElementById('tblCauHoi_Temp')]);

    },
    import_DMIP_Doc: function (a, strPath) {
        var me = this;
        
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ImportNganHangCauHoi_Temp_Doc',
            'versionAPI': 'v1.0',
            'GroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Imp'),
            'MucPheDuyetId': me.strMucPheDuyetId,
            'NguoiThucHien_Id': edu.system.userId,            
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 

                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                    me.genTable_Import_View(data.Data.Table1, "tblImport_ThatBai");
                    me.genTable_Import_View(data.Data.Table2, "tblImport_ThanhCong");
                    me.toggle_import();
                    me.getList_DapAn_All_Temp();
                    setTimeout(function () {
                        me.getList_CauHoi_Temp();
                    }, 100); 
                  
                    edu.system.viewFiles("txtFile_DMIP", "");
                  

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
    toggle_batdau_Temp: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneCauHoi_Temp");
    },
    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneImport");



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

        me.strQuestionId = data.ID;

        $("#drpTrangThaiCauHoi_Temp").val(data.STATUS).trigger("change");
        edu.util.viewValById("txtDiemCong_Temp", data.PLUSMARK);
        edu.util.viewValById("txtDiemTru_Temp", data.MINUSMARK);
        edu.util.viewValById("txtThoiGian_Temp", data.THOIGIAN);
        edu.util.viewValById("txtOrderNumber_Temp", data.ORDERNUMBER);
        $("#drpDaoDapAn_Temp").val(data.DAODAPAN).trigger("change"); 
        $('#chkCachTinhDiemTheoSoY_Temp').prop('checked', false);
        if (data.TINHDIEMTHEOSOY == "1")
            $('#chkCachTinhDiemTheoSoY_Temp').prop('checked', true);
        me.getList_drpMucDoCauHoi_Temp(data.QUESTIONLEVELID);
        me.getList_drpLoaiCauHoi_Temp(data.QUESTIONTYPEID); 
    },
    getList_DapAn_Temp: function (strQuestionId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_AnswerTempByQuestionId',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionId,

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
                        var strReturn = "<input type='radio'    id='rdoCorrect_Temp" + aData.ID + "' class='optcheckbox' name='rdoCorrect_Temp" + me.strQuestionId + " ' />";
                        if (aData.CORRECT == "1")
                            strReturn = "<input type='radio'    id='rdoCorrect_Temp" + aData.ID + "' checked class='optcheckbox' name='rdoCorrect_Temp" + me.strQuestionId + " ' />";
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
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblDapAn_Temp']);
        MathJax.typesetPromise([document.getElementById('tblDapAn_Temp')]);
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
    save_Question_Temp: function () {
        var me = this;
        var strTinhDiemTheoSoY = "0";
        if ($("#chkCachTinhDiemTheoSoY_Temp").is(":checked"))
            strTinhDiemTheoSoY = "1";
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
            'strMucPheDuyetId': me.strMucPheDuyetId,
            'strThoiGian': edu.util.getValById('txtThoiGian_Temp'),
            'strTinhDiemTheoSoY': strTinhDiemTheoSoY,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strQuestionId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_QuestionTemp';
            obj_save.strId = me.strQuestionId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_CauHoi_Temp();
                    me.strQuestionTempId = data.Id;
                    var dt = edu.util.objGetDataInData(me.strQuestionTempId, me.dtCauHoi_Temp, "ID");
                    me.strQuestionTypeCodeTemp = dt[0].QUESTIONTYPECODE;
                    me.getandGenList_Answer_Temp();
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
        if (me.strQuestionTypeCodeTemp == "FILLTHEBLANK" || me.strQuestionTypeCodeTemp == "KEOTHAXUONGDAPAN") {
            $("#txtContent2_Temp").show();
        }
       
        var strcolHidden ="";
        if (me.strQuestionTypeCodeTemp == "BESTANSWER") {
            strcolHidden = "3,6,7,8";
        }
        if (me.strQuestionTypeCodeTemp == "MULTICHOICE" || me.strQuestionTypeCodeTemp == "TRUEFALSE" || me.strQuestionTypeCodeTemp == "TRUEFALSEONE") {
            strcolHidden = "4,6,7,8";
        }

        if (me.strQuestionTypeCodeTemp == "FREETEXT" ) {
            strcolHidden = "2,3,4,6,7";
        }
        if (me.strQuestionTypeCodeTemp == "CROSSLINK") {
            strcolHidden = "3,4,7,8";
        }
        if (me.strQuestionTypeCodeTemp == "FILLTHEBLANK" || me.strQuestionTypeCodeTemp == "KEOTHAXUONGDAPAN") {
            strcolHidden = "3,4,6,8";
        }
         
        /*
        var $tbl = $("#tblDapAn");
        var $tblhead = $("#tblDapAn th");
        
        if (colHidden != "") { 
            var colToHidden = $tbl.find(".col" + colHidden);
            //var colHeadToHidden = $tblhead.filter(".col" + colHidden);
            //var index = $(colHeadToHidden).index();
           // $tblhead.find('tr :nth-child(' + (index + 1) + ')').toggle(); 
            $(colToHidden).toggle(); 
        }
        */

       
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
    getList_DapAn_Ve2_Temp: function (strQuestionTempId) {
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
                    me.genTable_DapAn_Ve2_Temp(data.Data, data.Pager);
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
    genTable_DapAn_Ve2_Temp: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDapAn_Ve2_Temp",
            aaData: data,
            bHiddenOrder: true,
            colPos: {
                center: [0],
                left: [1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtOrders_Ve2' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.ORDERS) + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtContent_Ve2' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.CONTENT) + '" class="form-control" />';
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
    },
    save_Answer_Temp: function (
        strAnswerId,
        strContent,
        strCorrect,
        strQuestionId,
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
            'strQuestionId': strQuestionId,
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
                    me.getList_DapAn_Temp(strQuestionId);
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
    getList_lstVe2Temp: function (strQuestionId, lstVe2Id, strSelectId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_Answer_SencondTemp',
            'versionAPI': 'v1.0',
            'strQuestionId': strQuestionId,

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
    save_Answer_Ve2_Temp: function (
        strAnswer_SencondId,
        strContent,
        strQuestionId,
        strSymbol,
        strOrders

    ) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ThemMoi_Answer_SencondTemp',
            'versionAPI': 'v1.0',
            'strId': "",
            'strContent': strContent,
            'strQuestionId': strQuestionId,
            'strSymbol': strSymbol,
            'strOrders': strOrders,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strAnswer_SencondId != "") {
            obj_save.action = 'QLTTN_QuanLyNganHangCauHoi/Sua_Answer_SencondTemp';
            obj_save.strId = strAnswer_SencondId;
        }

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.util.viewValById("txtOrder_Ve2", "");
                    edu.util.viewValById("txtContent_Ve2", "");
                    edu.system.alert("Thực hiện thành công");
                    me.getList_DapAn_Ve2_Temp(me.strQuestionId);
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
    Xoa_Answer_Sencond_Temp: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Xoa_Answer_SencondTemp',
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
    rewrite_editor_GroupQuestionDetailContent: function () {
        var me = this;
        //edu.util.viewValById("txtNhomCauHoi", "");
        //CKEDITOR.instances['editor'].setData('');
      
        CKEDITOR.instances['editor_GroupQuestionDetailContent'].setData('');
        //edu.util.viewValById("drpTrangThaiCauHoi", "");
        var dt = edu.util.objGetDataInData(me.strGroupQuestionDetailId, me.dtGroupQuestionDetail, "ID");
        if (dt.length > 0) {
            $("#drpTrangThai_GroupQuestionDetailContent").val(dt[0].STATUS).trigger("change");
            setTimeout(function () {
                CKEDITOR.instances['editor_GroupQuestionDetailContent'].setData(dt[0].CONTENT);
            }, 100);
        }
        else {
            setTimeout(function () {
                CKEDITOR.instances['editor_GroupQuestionDetailContent'].setData("");
            }, 100);
        }

    },
    save_GroupQuestionDetailContent: function () {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Sua_ContentGroupQuestionDetail',
            'versionAPI': 'v1.0',
            'strId': me.strGroupQuestionDetailId, 
            'strStatus': edu.util.getValById('drpTrangThai_GroupQuestionDetailContent'),
            'strContent': CKEDITOR.instances['editor_GroupQuestionDetailContent'].getData(),         
            'strNguoiThucHien_Id': edu.system.userId
        };
        

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_GroupQuestionDetail();
                    edu.system.saveFiles("txt_File_Audio", me.strGroupQuestionDetailId, "QLTTN_Files");
                    

                    setTimeout(function () {
                        me.getList_AudioFiles();

                    }, 500);

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
    Xoa_AudioFiles: function (strId) {
        var me = this; 
        var obj_save = {
            'action': 'QLTTN_Files/Xoa',
            'versionAPI': 'v1.0',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                   
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
            type: "POST",
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
                        + "<input type='textbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='opttextbox' name='opttextbox" + dtQuestion[i].QUESTIONID
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
                if (dtQuestion[i].QUESTIONTYPECODE == "KEOTHAXUONGDAPAN") {
                    
                    strContentQuestion += "<div class='textbox'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "<input type='textbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='opttextbox' name='opttextbox" + dtQuestion[i].QUESTIONID
                        + "' value='" + edu.util.returnEmpty(dataTraLoi[j].CONTENT2) + "' /> "
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
       // MathJax.Hub.Queue(['Typeset', MathJax.Hub, strZone]);
        console.log(MathJax.version); // ví dụ: "3.2.2"
        //MathJax.typesetPromise([document.getElementById(strZone)])
        //    .then(() => console.log("MathJax done"))
        //    .catch(err => console.error("MathJax error", err));
       
        MathJax.typesetPromise([document.getElementById(strZone)]);
        
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
 
    toggle_batdau_ThaoTac_ShowPreview_CauHoi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-GroupQuestionDetail", "zoneCauHoiEdit");
    },
    printPhieu: function (table_id) {
        var me = this;
        edu.extend.remove_PhoiIn(table_id);
        edu.util.printHTML(table_id);
        //  me.closePhieu();
    },
    getList_MucPheDuyet: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_MucPheDuyetAdmin' 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.strMucPheDuyetId = data.Data;
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
    //#endregion
    toggle_edit_CauHoi_DaTaoDe: function () {
        var me = this;
        //$('#zonePreviewCauHoiDaTaoDe').css('display','');
        edu.util.toggle_overide("zone-bus", "zonePreviewCauHoiDaTaoDe");
    },
    getList_CauHoiDaTaoDe: function (strQuestionId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_CauHoiDaTaoDe',
            'versionAPI': 'v1.0',
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strTrangThaiPhongThi': edu.util.getValById('drpTrangThaiPhongThi'),
            'strStatus': edu.util.getValById('drpStatusPhongThi'),
            'strHocPhanId': edu.util.getValById('drpHocPhan_DotThi'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'), 
            'strQuestionId': strQuestionId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {  
                    me.genTable_CauHoiDaTaoDe(strQuestionId, data.Data.Table, data.Data.Table1, data.Pager);
                    
                    me.genList_drpPhongThiDungCauHoi(data.Data.Table2);

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
    genTable_CauHoiDaTaoDe: function (strQuestionId, data, dtDapAnTS, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCauHoi_DaTaoDe",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_CauHoiDaTaoDe('" + strQuestionId+"')",
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

                    "mDataProp": "MASINHVIEN"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                }, 
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = "<span>Chưa làm</span>";
                        
                        if (edu.util.returnEmpty(aData.FINISHED) == '1' || edu.util.returnEmpty(aData.TIMESTARTDOEXAM) != '' || edu.util.returnEmpty(aData.TIMEFINISHED) != ''
                            || edu.util.returnEmpty(aData.FINISHED_PART) == '1' || edu.util.returnEmpty(aData.TIMESTARTDOEXAM_PART) != '' || edu.util.returnEmpty(aData.TIMEFINISHED_PART) != '')
                            strReturn = "<span style='color:red'>Đã làm</span>";

                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var dt = edu.util.objGetDataInData(aData.STUDENTID, dtDapAnTS, "STUDENTID");
                        var strReturn = ""; 
                        for (var i = 0; i < dt.length; i++) {
                            if (i == dt.length - 1)
                                strReturn += "<span>" + edu.util.returnEmpty(dt[i].ORDERS) + "." + dt[i].CONTENT + "</span></br>";
                            else
                                strReturn += "<span>" + edu.util.returnEmpty(dt[i].ORDERS) + "." + dt[i].CONTENT +"<span>";
                        }
                        
                        return strReturn;
                    }
                } ,
                {
                    "mDataProp": "DiemCongNhan"
                }, 
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = ""; 
                        var strTextMarkId = aData.STUDENTEXAMROOMID;
                        strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + strTextMarkId + '" value ="' + edu.util.returnEmpty( aData.MARK) + '" class="form-control" />';                         
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" style="display:none" id="checkSTUDENTEXAMROOMID' + aData.STUDENTQUESTIONID + '" value="' + aData.STUDENTEXAMROOMID + '"/>' +
                            '<input type="checkbox" style="display:none" id="checkEXAMROOMINFOID' + aData.STUDENTQUESTIONID + '" value="' + aData.EXAMROOMINFOID + '"/>' +
                            '<input type="checkbox" style="display:none" id="checkSTUDENTID' + aData.STUDENTQUESTIONID + '" value="' + aData.STUDENTID + '"/>' +
                            '<input type="checkbox" id="checkX' + aData.STUDENTQUESTIONID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'tblCauHoi_DaTaoDe']);
        MathJax.typesetPromise([document.getElementById('tblCauHoi_DaTaoDe')]);
        /*III. Callback*/


         
    },
    Update_Question_Temp_STT: function (strId, strOrderNumber, strTinhDiemTheoSoY) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Update_Question_Temp_STT',
            'versionAPI': 'v1.0',
            'strId': strId,             
            'strOrderNumber': strOrderNumber,
            'strTinhDiemTheoSoY': strTinhDiemTheoSoY,
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
    Update_Question_STT: function (strId, strOrderNumber, strTinhDiemTheoSoY) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/Update_Question_STT',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strOrderNumber': strOrderNumber,
            'strTinhDiemTheoSoY': strTinhDiemTheoSoY,
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
    getList_drpNamHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_NamHoc',
            'strStatus': '1',

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data);
                    me.genList_drpNamHoc(data.Data);
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
    genList_drpNamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "SCHOOLYEAR",
                parentId: "",
                name: "SCHOOLYEAR",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNamHoc"],
            type: "",
            title: "Năm học"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_drpHocKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocKyBySchoolYear',
            'strStatus': '1',
            'strSchoolYear': $("#drpNamHoc :selected").val(),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genList_drpHocKy(data.Data);
                    me.getList_drpDotThi();
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
    genList_drpHocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "SEMESTER",
                parentId: "",
                name: "SEMESTER",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy"],
            type: "",
            title: "Học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_drpDotThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DoThiByHocKy',
            'strStatus': '1',
            'strHocKy': edu.util.getValById("drpHocKy"),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDotThi(data.Data);
                    
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
    genList_drpDotThi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotThi"],
            type: "",
            title: "Đợt thi"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    toggle_batdau_ThaoTac_CauHoiDaTaoDe: function () {
        var me = this;
        //$('#zonePreviewCauHoiDaTaoDe').hide();
        edu.util.toggle_overide("zone-bus", "zoneGroupQuestionDetail");
        
    },
     
    genList_drpPhongThiDungCauHoi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "ROOMNAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpPhongThiDungCauHoi"],
            type: "",
            title: "Phòng thi"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_drpHocPhan_TheoDotThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocPhan_TheoDotThi',
            'strDotThiId': edu.util.getValById("drpDotThi"),
            'strNamHoc': edu.util.getValById("drpNamHoc"),
            'strHocKy': edu.util.getValById("drpHocKy"),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genList_drpHocPhan_TheoDotThi(data.Data.Table);
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
    genList_drpHocPhan_TheoDotThi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: ""
            },
            renderPlace: ["drpHocPhan_DotThi"],
            type: "",
            title: "Học phần"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getListSeach_CauHoiDaTaoDe: function (strQuestionId) {
        var me = this;
        //Hàm này gióng getList_CauHoiDaTaoDe nhưng không Bind lại drpPhongThiDungCauHoi
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_CauHoiDaTaoDe',
            'versionAPI': 'v1.0',
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strTrangThaiPhongThi': edu.util.getValById('drpTrangThaiPhongThi'),
            'strStatus': edu.util.getValById('drpStatusPhongThi'),
            'strHocPhanId': edu.util.getValById('drpHocPhan_DotThi'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strQuestionId': strQuestionId,
            'strExamRoomInfoId': edu.util.getValById('drpPhongThiDungCauHoi'),
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_CauHoiDaTaoDe(strQuestionId, data.Data.Table, data.Data.Table1, data.Pager);
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
    getList_TinhLaiDiemThiSinh: function (strExamRoomInfoId, strStudentExamRoomId, strThiSinhId , strUserId ) {
        var me = this;
        //Hàm này gióng getList_CauHoiDaTaoDe nhưng không Bind lại drpPhongThiDungCauHoi
        //--Edit
        var obj_list = {
            'action': 'TTN_ThiSinh/get_TinhLaiDiemThiSinh',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': strExamRoomInfoId, 
            'strStudentExamRoomId': strStudentExamRoomId, 
            'strThiSinhId': strThiSinhId, 
            'strUserId': strUserId, 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#txtDiemDuocCongNhan" + strStudentExamRoomId).val(data.Data);
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
    save_DiemSuaCauHoi: function (strStudentExamRoomPartId, strMark) {
        var me = this;
        //--Edit 
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/save_DiemSuaCauHoi',
            'versionAPI': 'v1.0',
            'strId': strStudentExamRoomPartId,
            'strMark': strMark, 
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
            obj_delete = {
                'action': 'QLTTN_QuanLyThi/save_DiemSuaCauHoi',
                'versionAPI': 'v1.0',
                'strId': strStudentExamRoomPartId,
                'strMark': strMark, 
                'strNguoiThucHien_Id': edu.system.userId
            };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

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
    getList_tblCauHoi_LichSu: function () {
        var me = this;
        
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_LichSuCauHoi',
            'versionAPI': 'v1.0',
            
            'strQuestionId': me.strQuestionId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_tblCauHoi_LichSu(data.Data, data.Pager);
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
    genTable_tblCauHoi_LichSu: function (data, iPager) {
        var me = this;
        $("#lblSoBanGhiLichSu").html(iPager);
        console.log(data);
        console.log('iPager' + iPager);
      
        var jsonForm = {
            strTable_Id: "tblCauHoi_LichSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_tblCauHoi_LichSu()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                left: [0,] 
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.ORDERS;
                        if (aData.ORDERS != aData.ORDERS_LS)
                            strReturn = '<span style="color:red;">' + aData.ORDERS_LS + '</span>';
                        return strReturn;
                    }
                },
                { 
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.CONTENT;
                        if (aData.CONTENT != aData.CONTENT_LS)
                            strReturn = '<span style="color:red;">' + aData.CONTENT_LS + '</span>';
                        console.log(strReturn);
                        return strReturn;
                    }
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TENLOAICAUHOI;
                        if (aData.TENLOAICAUHOI != aData.TENLOAICAUHOI_LS)
                            strReturn = '<span style="color:red;">' + aData.TENLOAICAUHOI_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var strReturn = aData.TENMUCDOCAUHOI;
                        if (aData.TENMUCDOCAUHOI != aData.TENMUCDOCAUHOI_LS)
                            strReturn = '<span style="color:red;">' + aData.TENMUCDOCAUHOI_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.DIEMCONGTRU;
                        if (aData.DIEMCONGTRU != aData.DIEMCONGTRU_LS)
                            strReturn = '<span style="color:red;">' + aData.DIEMCONGTRU_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var vDapAn = aData.DAODAPAN == "1" ? "Có" : "Không";
                        var vDapAn_LS = aData.DAODAPAN_LS == "1" ? "Có" : "Không";
                        var strReturn = vDapAn;
                        if (vDapAn != vDapAn_LS)
                            strReturn = '<span style="color:red;">' + vDapAn_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strTrangThai = aData.STATUS == "1" ? "Đang dùng" : "Không dùng";
                        var strTrangThai_LS = aData.STATUS_LS == "1" ? "Đang dùng" : "Không dùng";
                        var strReturn = strTrangThai;
                        if (strTrangThai != strTrangThai_LS)
                            strReturn = '<span style="color:red;">' + strTrangThai_LS + '</span>';
                        return strReturn;
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.NGAYSUA;                     
                        return strReturn;
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TAIKHOANSUA;
                        return strReturn;
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.HANHDONG;
                        return strReturn;
                    }
                } 

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/ 
    },
    getList_tblDapAn_LichSu: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_LichSuDapAn',
            'versionAPI': 'v1.0',

            'strQuestionId': me.strQuestionId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_tblDapAn_LichSu(data.Data, data.Pager);
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
    genTable_tblDapAn_LichSu: function (data, iPager) {
        var me = this;
        $("#lblSoBanGhiLichSuDapAn").html(iPager);
        console.log(data);
        console.log('iPager' + iPager);

        var jsonForm = {
            strTable_Id: "tblDapAn_LichSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_tblDapAn_LichSu()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                left: [0,]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.ORDERS;
                        if (aData.ORDERS != aData.ORDERS_LS)
                            strReturn = '<span style="color:red;">' + aData.ORDERS_LS + '</span>';
                        return strReturn;
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.FIXVITRI;
                        if (aData.FIXVITRI != aData.FIXVITRI_LS)
                            strReturn = '<span style="color:red;">' + aData.FIXVITRI_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.CORRECT;
                        if (aData.CORRECT != aData.CORRECT_LS)
                            strReturn = '<span style="color:red;">' + aData.FIXVITRI_LS + '</span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.CONTENT;
                        if (aData.CONTENT != aData.CONTENT_LS)
                            strReturn = '<span style="color:red;">' + aData.CONTENT_LS + '</span>';
                        console.log(strReturn);
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.NGAYSUA;
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TAIKHOANSUA;
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.HANHDONG;
                        return strReturn;
                    }
                }

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_CheckCauHoi: function (strId, strZone) {

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


                    me.genTable_CheckCauHoi(dtQuestion, dtAnswer, dtAnswer_Sencond, strZone);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_CheckCauHoi: function (dtQuestion, dtAnswer, dtAnswer_Sencond, strZone) {

        $("#" + strZone + "").html('');

        //#region gen table  noi dung cau hoi
        var strContentQuestion = "";
        var table = document.getElementById('tblCauHoi_Temp');
        if (strZone == "zonePreviewTableQuestion")
            table = document.getElementById('tblCauHoi');

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
            var iDapAnCheck = 0;
            var bKiemTraKeoTha = true;
            // Dùng CSS.escape để tránh lỗi với ký tự đặc biệt
            if (dataTraLoi.length == 0) {
                const tr = table.querySelector(`tr#${CSS.escape(dtQuestion[i].QUESTIONID)}`);
                tr.classList.add('flash-red'); 
            }
            for (var j = 0; j < dataTraLoi.length; j++) {
                var ischecked = "";
                if (dataTraLoi[j].CORRECT == "1") {
                    ischecked = "checked";
                    iDapAnCheck++;
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
                        + "<input type='textbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='opttextbox' name='opttextbox" + dtQuestion[i].QUESTIONID
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
                if (dtQuestion[i].QUESTIONTYPECODE == "KEOTHAXUONGDAPAN") {
                    var text = dataTraLoi[j].CONTENT2;
                    // Dùng regex để lấy tất cả các đoạn giữa ký tự $ ... $
                    var matches = text.match(/\$([^$]+)\$/g); 
                    // Lấy ra nội dung đáp án  bên trong, loại bỏ dấu $
                    var results = text.split('$').filter(x => x.trim() !== "");
                    var temp = document.createElement('div');
                    temp.innerHTML = dtQuestion[i].CONTENT;
                    const dragWords = Array.from(temp.querySelectorAll('.draggable-word'))
                        .map(e => e.textContent.replace(/\s+/g, ' ').trim());

                    // Kiểm tra từng phần tử trong results có nằm trong dragWords không
                    if (!results.every(word => dragWords.includes(word)))
                        bKiemTraKeoTha = false;

                    console.log("results:", results);
                    console.log("dragWords:", dragWords);
                    console.log("bKiemTraKeoTha:", bKiemTraKeoTha);


                    console.log(results); // ['researcher', 'researcher1111']
                    strContentQuestion += "<div class='textbox'>"
                        + "<label for='" + dataTraLoi[j].ANSWERID + "' class='lbdapan' onmouseover=''>"
                        + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                        + "<input type='textbox' id='" + dataTraLoi[j].ANSWERID + "' " + "class='opttextbox' name='opttextbox" + dtQuestion[i].QUESTIONID
                        + "' value='" + edu.util.returnEmpty(dataTraLoi[j].CONTENT2) + "' /> "
                        + "</label>"
                        + "</div >"
                        + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                }

            }
            if (iDapAnCheck == 0 && dtQuestion[i].QUESTIONTYPECODE != "KEOTHAXUONGDAPAN"
                && dtQuestion[i].QUESTIONTYPECODE != "FILLTHEBLANK") {
                const tr = table.querySelector(`tr#${CSS.escape(dtQuestion[i].QUESTIONID)}`);
                tr.classList.add('flash-red'); // thêm class (tùy ý)
            }
             
            if (!bKiemTraKeoTha  && (dtQuestion[i].QUESTIONTYPECODE == "KEOTHAXUONGDAPAN"
                || dtQuestion[i].QUESTIONTYPECODE == "FILLTHEBLANK")) {

                const tr = table.querySelector(`tr#${CSS.escape(dtQuestion[i].QUESTIONID)}`);
                tr.classList.add('flash-red'); // thêm class (tùy ý)
            }
            //#endregioin Dap An

            strContentQuestion += "<hr style='border-color:#2a2727; width:98%; margin-bottom:20px; margin-top:30px;' />";
            strContentQuestion += "</div>";

        }



         
        // MathJax.Hub.Queue(['Typeset', MathJax.Hub, strZone]);
        console.log(MathJax.version); // ví dụ: "3.2.2"
        //MathJax.typesetPromise([document.getElementById(strZone)])
        //    .then(() => console.log("MathJax done"))
        //    .catch(err => console.error("MathJax error", err));
        MathJax.typesetPromise([document.getElementById(strZone)]);
        edu.system.alert("Đã kiểm tra xong");

    },
    import_DMIP_Latex: function (a, strPath) {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/ImportNganHangCauHoi_Temp_LaTeX',
            'versionAPI': 'v1.0',
            'GroupQuestionDetailId': me.strGroupQuestionDetailId,
            'strQuestionTypeId': edu.util.getValById('drpLoaiCauHoi_Imp'),
            'MucPheDuyetId': me.strMucPheDuyetId,
            'NguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                    me.genTable_Import_View(data.Data.Table1, "tblImport_ThatBai");
                    me.genTable_Import_View(data.Data.Table2, "tblImport_ThanhCong");
                    me.toggle_import();
                    me.getList_DapAn_All_Temp();
                    setTimeout(function () {
                        me.getList_CauHoi_Temp();
                    }, 100);

                    edu.system.viewFiles("txtFile_DMIP", "");


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
    getList_QuestionAudioFiles: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_Files/LayDanhSach',
            'versionAPI': 'v1.0',
            'strDuLieu_Id': me.strQuestionId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.viewFiles("txt_Question_Audio", "", "QLTTN_Files");
                    edu.system.viewFiles("txt_Question_Audio", me.strQuestionId, "QLTTN_Files");

                    me.genTable_QuestionAudioFiles(data.Data);
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

    genTable_QuestionAudioFiles: function (data) {
        var me = this;

        var rootPathUploadFile = edu.system.rootPathUpload;

        var jsonForm = {
            strTable_Id: "tblQuestionAudioFiles",
            aaData: data,
            sort: true,
            colPos: {
                left: [1, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<audio controls title="' + aData.TENHIENTHI + '"> ' +
                            '    <source src="' + rootPathUploadFile + '/' + aData.DUONGDAN + '" type="audio/mp3"> ' +

                            '</audio> ';
                    }
                },
                {
                    "mDataProp": "TENHIENTHI"
                },
                {
                    "mRender": function (nRow, aData) {

                        return '<a id="' + aData.ID + '" class="btn btn-default btnDelete_QuestionAudionFiles"><i class="fa fa-trash"></i> Xóa</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_PhanQuyenGroupQuestion: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_PhanQuyenGroupQuestion',
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
                    me.genTable_PhanQuyenGroupQuestion(data.Data, data.Pager);
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
    genTable_PhanQuyenGroupQuestion: function (data, iPager) {
        var me = this;
        $("#lblGroupQuestion_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGroupQuestion",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlynganhangcauhoi.getList_GroupQuestion()",
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
                        return '<span><a class="btn btn-default btnGroupQuestion_Edit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnGroupQuestion_Detail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
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

}


