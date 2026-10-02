function lambaithi() { };
lambaithi.prototype = {
    dtStudentFiles: [],
    dtExamStructPartAudioFiles: [],
    dtQuestion: [],
    dtQuestionPart: [],
    dtAnswer: [],
    dtAnswer_Sencond: [],
    dtExamStructPart: [],
    dtExamStructPartAll: [],
    arrStudentQuestion_Id: [],
    arrQuestionTypeCode: [],
    arrStudentAnswer_Id: [],
    arrCorrect: [],
    arrReview: [],
    arrDaTraLoi: [],
    arrContent2: [],
    arrAnswer_Second_Id: [],
    dtMatKhauPhanThi: [],
    rootPath: '',
    apiUrl: '',
    apiUrlTemp: '',
    rootPathUpload: '',
    rootPathReport: '',
    strThiSinh_Id: '',
    strExamRoomInfo_Id: '',
    strStudentExamRoom_Id: '',
    strStudentQuestion_Id: '',
    strQuestionTypeCode: '',
    strStudentExamRoomPartId: '',
    strStudentExamRoomPartOldId: '',
    strExamStructPartId: '',
    strExamStructPartDetailId: '',
    strExamStructPartOldId: '',
    strDaChuyenSangPhanThiKhac: '',
    strExamStructPartTempId: '',

    strDaGoiHamHetThoiGian: '',
    strTinhTheoTongThoiGian: '',
    iSoTTPhanThi: 0,
    strTolTalTimeStudent: '',
    iThoiGianCuaCauHoi: 0,
    _timerHandlerCauHoi: 0,

    init: function () {
        var me = this;
        me.strExamRoomInfo_Id = edu.util.getValById('txtExamRoomInfo_Id');
        me.strStudentExamRoom_Id = edu.util.getValById('txtStudentExamroom_Id');
        me.strThiSinh_Id = edu.util.getValById('txtThiSinh_Id');
        var pConfig = Init_Prammater();
        me.rootPathUploadFile = pConfig.RootAudioFiles;

        //B1: kiem tra trang thai @#

        me.KiemTraTrangThai();
        //Lay thong tin de thi
        me.LayDS_ThongTinDeThiCuaThiSinh();

        $(document).delegate('.button_xem', 'click', function (event) {
            //event.stopImmediatePropagation();
            //Lưu đáp án câu hỏi FillTheBlank  

            var dtCauHoi_1 = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            if (dtCauHoi_1[0].THOIGIAN != null)
                me.UpdateCurrentTimeCauHoi();
            $("#zoneTablePartNoiDungCauHoiNhom").html("");
            if (edu.util.returnEmpty(dtCauHoi_1[0].NOIDUNGNHOMCAUHOI) != '')
                $("#zoneTablePartNoiDungCauHoiNhom").html(dtCauHoi_1[0].NOIDUNGNHOMCAUHOI);
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'zoneTablePartNoiDungCauHoiNhom']);

            if (me.strStudentQuestion_Id != null)
                $("#zoneContentQuestion" + me.strStudentQuestion_Id).hide();


            me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);
            $("#zoneContentQuestion").show();


            var id = $(this).attr('id');

            me.strStudentQuestion_Id = id;

            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();
            var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            $('#idCauHoiTimerSpan').text('');
            //console.log(me._timerHandlerCauHoi);
            if (me._timerHandlerCauHoi != null)
                clearInterval(me._timerHandlerCauHoi);

            if (dtCauHoi[0].THOIGIAN != null) {
                if (dtCauHoi[0].FINISHED == "0")
                    me.GetTolTalTimeQuestion();
                else
                    me.KhongChoCapNhatDapAn();
            }


            //Lưu đáp án câu hỏi vừa làm                        
            //me.save(me.strStudentQuestion_Id,me.strQuestionTypeCode);
            var zoneContentQuestion = "zoneContentQuestion" + $(this).attr('id');
            //$('.bix-div-container').css('display', 'none');
            document.getElementById("lblThongBao").style.display = "none";

            $("#zoneContentQuestion" + me.strStudentQuestion_Id).show();
            var point = document.getElementById(zoneContentQuestion);
            if (point) point.style.display = "";
            //dtQuestion
            me.hienCauTraLoi(id);



        });
        $(document).delegate('.button_review', 'click', function () {
            //Lưu đáp án câu hỏi FillTheBlank   
            var dtCauHoi_1 = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            if (dtCauHoi_1[0].THOIGIAN != null)
                me.UpdateCurrentTimeCauHoi();
            if (me.strStudentQuestion_Id != null)
                $("#zoneContentQuestion" + me.strStudentQuestion_Id).hide();
            me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);
            $("#zoneContentQuestion").show();
            var id = $(this).attr('id');
            me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();
            var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            $('#idCauHoiTimerSpan').text('');
            //console.log(me._timerHandlerCauHoi);
            if (me._timerHandlerCauHoi != null)
                clearInterval(me._timerHandlerCauHoi);

            if (dtCauHoi[0].THOIGIAN != null) {
                if (dtCauHoi[0].FINISHED == "0")
                    me.GetTolTalTimeQuestion();
                else
                    me.KhongChoCapNhatDapAn();
            }
            //Lưu đáp án câu hỏi vừa làm                        
            //me.save(me.strStudentQuestion_Id,me.strQuestionTypeCode);
            var zoneContentQuestion = "zoneContentQuestion" + $(this).attr('id');
            //$('.bix-div-container').css('display', 'none');
            document.getElementById("lblThongBao").style.display = "none";
            $("#zoneContentQuestion" + me.strStudentQuestion_Id).show();
            var point = document.getElementById(zoneContentQuestion);
            if (point) point.style.display = "";
            //dtQuestion
            me.hienCauTraLoi(id);

        });

        $(document).delegate('.button_traloi', 'click', function () {
            //Lưu đáp án câu hỏi FillTheBlank   
            var dtCauHoi_1 = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            if (dtCauHoi_1[0].THOIGIAN != null)
                me.UpdateCurrentTimeCauHoi();
            $("#zoneTablePartNoiDungCauHoiNhom").html("");
            if (edu.util.returnEmpty(dtCauHoi_1[0].NOIDUNGNHOMCAUHOI) != '')
                $("#zoneTablePartNoiDungCauHoiNhom").html(dtCauHoi_1[0].NOIDUNGNHOMCAUHOI);
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'zoneTablePartNoiDungCauHoiNhom']);

                        //kiem tra file anh
            if (me.strStudentQuestion_Id != null)
                $("#zoneContentQuestion" + me.strStudentQuestion_Id).hide();
            me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);
            $("#zoneContentQuestion").show();
            var id = $(this).attr('id');
            me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();
            var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            $('#idCauHoiTimerSpan').text('');
            //console.log(me._timerHandlerCauHoi);
            if (me._timerHandlerCauHoi != null)
                clearInterval(me._timerHandlerCauHoi);

            if (dtCauHoi[0].THOIGIAN != null) {
                if (dtCauHoi[0].FINISHED == "0")
                    me.GetTolTalTimeQuestion();
                else
                    me.KhongChoCapNhatDapAn();
            }
            //Lưu đáp án câu hỏi vừa làm                        
            //me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);
            var zoneContentQuestion = "zoneContentQuestion" + $(this).attr('id');
            //$('.bix-div-container').css('display', 'none');
            document.getElementById("lblThongBao").style.display = "none";
            var point = document.getElementById(zoneContentQuestion);
            if (point) point.style.display = "";
            //dtQuestion

            me.hienCauTraLoi(id);
        });
        $(document).delegate('.optradio', 'click', function () {
            var strStudentAnswer_Id = $(this).attr('id');

            //Thay mầu nền
            // $('a[id="' + strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-success");
            //Lưu đáp án
            //me.save(strStudentQuestion_Id, strStudentAnswer_Id);
            var strCorrect = "1";
            var strReview = "0";
            if ($("#chkChuaChacChan").is(":checked") == true)
                strReview = "1";

            var strDaTraLoi = "1";
            var strContent2 = "";
            var strAnswer_Second_Id = "";
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();


            me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
        });
        $(document).delegate('.optcheckbox', 'click', function () {

            var strStudentAnswer_Id = $(this).attr('id');
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();
            //var strStudentQuestion_Id = $(this).attr('value');           
            if ($("#" + strStudentAnswer_Id).is(":checked"))
                $("#" + strStudentAnswer_Id).attr("checked", true);
            else
                $("#" + strStudentAnswer_Id).attr("checked", false);

            var strCorrect = "0";
            var strReview = "0";
            if ($("#chkChuaChacChan").is(":checked") == true)
                strReview = "1";

            var strDaTraLoi = "";
            var strContent2 = "";
            var strAnswer_Second_Id = "";

            var tblDapAn = $("#zoneContentQuestion" + me.strStudentQuestion_Id).find(".optcheckbox");

            for (var i = 0; i < tblDapAn.length; i++) {
                if ($(tblDapAn[i]).is(":checked") == true)
                    strDaTraLoi = "1";
            }
            strCorrect = ($("#" + strStudentAnswer_Id).is(":checked") == true ? '1' : '0');
            me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);

        });
        $(document).on('change', '.select-opt', function () {

            var strStudentAnswer_Id = $(this).attr('id');
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();
            //var strStudentQuestion_Id = $(this).attr('name');             
            var strCorrect = "";
            var strReview = "0";
            if ($("#chkChuaChacChan").is(":checked") == true)
                strReview = "1";
            var strDaTraLoi = 0;
            var strContent2 = "";
            var strAnswer_Second_Id = $(this).children(":selected").attr("id");

            var DapAnVe2 = $("#zoneContentQuestion" + me.strStudentQuestion_Id).find('.select-opt');
            //var DapAnVe2 = $("#zoneTableQuestion" + me.strStudentQuestion_Id + " div[class='answer fs-18'] div[class='radio'] label[class='lbdapan'] option");
            var DapAnVe1 = $("#zoneContentQuestion" + me.strStudentQuestion_Id + " label[class='lbdapan']");
            for (var iDapAnVe2 = 0; iDapAnVe2 < DapAnVe2.length; iDapAnVe2++) {
                if ($(DapAnVe2[iDapAnVe2]).find(":selected").val() != "")
                    strDaTraLoi = "1";
            }

            me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
            if (strDaTraLoi == "1")
                $('a[id="' + me.strStudentQuestion_Id + '"]').removeClass("button_xem btn-light border-99 ").addClass("button_traloi btn-success border-white");
            else
                $('a[id="' + me.strStudentQuestion_Id + '"]').removeClass("button_traloi btn-success border-white").addClass("button_xem btn-light border-99");

        });
        $("#chkChuaChacChan").click(function () {

            var strReview = "0";
            //var strStudentAnswer_Id = $(this).attr('id'); 

            //me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            //me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();

            if ($("#chkChuaChacChan").is(":checked") == true) {
                strReview = "1";
                $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-success").addClass("btn-orange");
                $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-orange");
            }
            else {
                var iIndex;
                for (var i = 0; i < me.dtQuestion.length; i++)
                    if (me.strStudentQuestion_Id === me.dtQuestion[i].STUDENTQUESTIONID) {
                        iIndex = i;
                        break;
                    }

                if (me.dtQuestion[iIndex].ANSWERED == "1") {
                    $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-orange").addClass("btn-success");
                    $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-success");
                }
                else {
                    $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-orange").addClass("btn-light");
                    $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-success").addClass("btn-light");
                }

            }


            me.saveReview(me.strStudentQuestion_Id, strReview);

            //$("#zoneBaoCao_TT button").trigger("click");
        });
        me.LayDS_MatKhauPhanThi();
        $(document).delegate('.button_ExamPart_chualam', 'click', function () {
            var id = $(this).attr('id');


            //var index = me.dtExamStructPart.findIndex(x => x.EXAMSTRUCTPARTID === id);
            //console.log(index);
            //console.log(me.iSoTTPhanThi);

            //if (index > me.iSoTTPhanThi)
            //    return;
            //else
            //    me.iSoTTPhanThi = index;
            //@phanh an phan thi
            $("#zoneTableAudioPart").html("");
            me.strExamStructPartTempId = id;
            if (me.dtMatKhauPhanThi.length > 0) {
                var dtKTExamStructPart = edu.util.objGetDataInData(id, me.dtMatKhauPhanThi, "EXAMSTRUCTPARTID");
                if (edu.util.returnEmpty(dtKTExamStructPart[0].MATKHAUPHANTHI) != '')
                    $('#zoneMatKhauPhongThi').modal('show');
                else
                    me.HienThiVaLamBai();
            }
            me.strExamStructPartOldId = me.strExamStructPartId;
            me.strStudentExamRoomPartOldId = me.strStudentExamRoomPartId;
            //me.strStudentExamRoomPartOldId = me.strStudentExamRoomPartId;


        });

        $(document).delegate('.button_ExamPartDetail_chualam', 'click', function () {
            var strExamStructPartOldDetailId = me.strExamStructPartDetailId;
            //var strStudentExamRoomPartOldId = me.strStudentExamRoomPartId;
            var id = $(this).attr('id');
            me.strExamStructPartDetailId = id;

            me.HienThiVaLamBai_PhanChiTiet();
        });


        $("#btnFinish").click(function (e) {
            var dtPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
            console.log(dtPart);
            console.log(dtPart[0].KIEULAMBAITHI);
            if (dtPart[0].KIEULAMBAITHI == "THITULUAN") {
                if (me.dtStudentFiles.length == 0) {
                    edu.system.alert("Bạn chưa đính kèm tệp bài làm?");
                    return;
                }

            }

            edu.system.confirm("Bạn có chắc chắn muốn nộp bài thi?");
            $("#btnYes").click(function (e) {
                if (me.strTinhTheoTongThoiGian != '1')
                    me.NopBaiThi_Part(dtPart);
                else
                    me.NopBaiThi(dtPart)

            });

        });

    },
    NopBaiThi: function (dtPart) {
        var me = this;
        me.CapNhatKetThucBaiThi(me.strStudentExamRoomPartId, me.strExamStructPartId);
        //me.gen_AnPhanThi(me.strExamStructPartId, "0");
        //#region An Phan thi part
        // var dtPartDetail = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");

        for (var i = 0; i < dtPartDetail.length; i++) {
            me.gen_AnPhanThi(dtPartDetail[i].EXAMSTRUCTPARTID, "1");
            $("#zoneTablePartQuestionDetail #" + dtPartDetail[i].EXAMSTRUCTPARTID).hide();
        }
        //#endregion

        //var TenPhanThi = dtPart[0].TITLE;
        edu.system.alert("Nộp bài thi  thành công");
        //$("#myModalAlert").modal("hide");
    },
    NopBaiThi_Part: function (dtPart) {
        var me = this;
        me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartId, me.strExamStructPartId);
        me.gen_AnPhanThi(me.strExamStructPartId, "0");
        //#region An Phan thi part
        var dtPartDetail = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");

        for (var i = 0; i < dtPartDetail.length; i++) {
            me.gen_AnPhanThi(dtPartDetail[i].EXAMSTRUCTPARTID, "1");
            $("#zoneTablePartQuestionDetail #" + dtPartDetail[i].EXAMSTRUCTPARTID).hide();
        }
        //#endregion

        var TenPhanThi = dtPart[0].TITLE;
        edu.system.alert("Nộp bài thi " + TenPhanThi + " thành công");
        //$("#myModalAlert").modal("hide");
    },
    gen_AnPhanThi: function (ExamStructPartId, strLaPhanDetail) {
        var me = this;
        if (strLaPhanDetail != "1")
            $('#btnFinish').css({ 'pointer-events': 'none' });
        if (ExamStructPartId != "") {
            //$(".zoneTableQuestionPart").hide();
            $("#zoneTableListQuestion" + ExamStructPartId).hide();





            //$("#zoneUpload").hide();
            // $(".zoneTableContentQuestionPart").hide();
            $("#zoneTableQuestion" + ExamStructPartId).hide();
            $("#zoneNextPreQuestion" + ExamStructPartId).hide();

            //$("#zoneNextPreQuestion #" + ExamStructPartId).hide();
        }

    },
    LayDS_ThongTinDeThiCuaThiSinh: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_ThongTinDeThiCuaThiSinh',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strStudent_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.dtQuestion = data.Data.rsQuestion;
                    me.dtAnswer = data.Data.rsAnswer;
                    me.dtAnswer_Sencond = data.Data.rsAnswerSecond;

                    me.dtExamStructPartAll = data.Data.rsExamStructPart;
                    me.strTinhTheoTongThoiGian = '';
                    if (edu.util.returnEmpty(me.dtExamStructPartAll[0]["TONGTHOIGIANEXAMSTRUCT"]) != '')
                        me.strTinhTheoTongThoiGian = '1';
                    me.dtExamStructPartAudioFiles = data.Data.rsExamStructPartAudioFiles;

                    me.dtExamStructPart = data.Data.rsExamStructPart.filter(e => e.EXAMSTRUCTPARTPARENTID === null);
                    var dtKTFinishExamStructPart = edu.util.objGetDataInData("1", me.dtExamStructPart, "FINISHED");


                    if (dtKTFinishExamStructPart.length == me.dtExamStructPart.length) {

                        var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                        window.open(strUrl, "_parent");
                    }

                    //Gen thong tin de thi
                    me.genTablePart();
                    me.genTableCauHoi();

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
    KiemTraTrangThai: function () {
        var me = this;
        // Thiet lap co che ket noi
        var obj_list = {
            'action': 'TTN_ThiSinh/KiemTraTrangThaiThiSinh',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strReturn = data.Data;
                    if (strReturn != "") {
                        var strUrl = "danhsachphongthi.aspx";
                        window.open(strUrl, "_parent");
                    }
                    else

                        me.LayDS_ThongTinBaiThiThiSinh();
                }
                else {

                    var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                    window.open(strUrl, "_parent");
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
    KiemTraTTLamBaiVaTTPT: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/KiemTraTTLamBaiVaTTPT',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strStudentExamRoomId': me.strStudentExamRoom_Id,
            'strStudentExamRoomPartId': me.strStudentExamRoomPartId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data[0];


                    if (dt.OPENSTATUS == null || dt.OPENSTATUS == "" || dt.OPENSTATUS == "0") {
                        alert("Phòng thi đã kết thúc, vui lòng liên hệ giám thị coi thi để biết thêm thông tin, hệ thống sẽ tự động đóng bài thi!");
                        var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                        window.open(strUrl, "_parent");                        //Chuyển tới Index

                    }
                    else if (parseInt(dt.OPENSTATUS) == "1")//Phòng thi đang mở
                    {
                        if (dt.FINISHED == "1") {

                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            // $(this).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                            $("#zoneTablePartQuestion #" + me.strExamStructPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                            //me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartId, me.strExamStructPartId);
                            var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                            window.open(strUrl, "_parent");
                            //me.KiemTraDaLamHetCacPhanThi();

                        }
                        if (dt.STUDENTEXAMROOMSTATUS == "TAMDUNGTHI") {
                            alert("Tạm dừng thi, vui lòng liên hệ Giám thị để biết thêm thông tin!");
                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            //me.CapNhatKetThucBaiThiPart();
                            var strUrl = "eIndex.aspx";
                            window.open(strUrl, "_parent");
                        }




                    }

                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    LayDS_ThongTinBaiThiThiSinh: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_ThongTinBaiThiThiSinh',
            'versionAPI': 'v1.0',
            'strThiSinhId': me.strThiSinh_Id,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    if (dt.length > 0) {

                        $("#lblMonThi").html(dt[0].COURSENAME);
                        $("#lblMaSinhVien").html(dt[0].MATHISINH);
                        $("#lblPhongThi").html(dt[0].ROOMNAME);
                        $("#lblHoTen").html(dt[0].FULLNAME);
                        $("#lblSBD").html(dt[0].SOBAODANH);
                    }

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
    genTablePart: function () {
        var me = this;


        //#region gen table Part
        $("#zoneTablePartQuestion").html("");
        var strTablePartQuestion = "";
        var SoPhanThiDaLamXong = 0;
        for (var i = 0; i < me.dtExamStructPart.length; i++) {
            var maunen = "button_ExamPart_chualam";
            var divclass = "<div class='tab-i'>";
            if (me.strTinhTheoTongThoiGian != '1')
                if (me.dtExamStructPart[i].FINISHED == "1") {
                    SoPhanThiDaLamXong += 1;
                    maunen = "button_ExamPart_dalam";
                    divclass = "<div class='tab-i active'>";
                    // $("#zoneTablePartQuestion #" + me.dtExamStructPart[i].EXAMSTRUCTPARTID).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                }

            if (me.dtExamStructPart[i].EXAMSTRUCTPARTPARENTID == null)
                strTablePartQuestion += divclass
                    + "<a class='" + maunen + "' id='" + me.dtExamStructPart[i].EXAMSTRUCTPARTID + "' href = 'javascript:void(0);' title = '' >" + me.dtExamStructPart[i].TITLE + "</a >"
                    + "</div>";


        }

        me.KiemTraDaLamHetCacPhanThi();
        if (me.dtKTExamStructPart > 1)
            $('#btnFinish').css({ 'pointer-events': 'none' });



        $("#zoneTablePartQuestion").html(strTablePartQuestion);

    },
    genTablePart1: function () {
        var me = this;
        $("#zoneTablePart").html("");

        var dtExamStructParent = edu.util.objGetDataInData(null, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
        var strTablePartQuestion = "";

        for (var i = 0; i < dtExamStructParent.length; i++) {
            var strTablePartQuestionParent = "<div class='tab-h'>"
                + "<div class='tab-h-l'>";


            var maunen = "btn_chualam tab-i";
            if (dtExamStructParent[i].FINISHED == "1") {
                SoPhanThiDaLamXong += 1;
                maunen = "btn_dalam tab-i";
                // $("#zoneTablePartQuestion #" + me.dtExamStructPart[i].EXAMSTRUCTPARTID).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
            }
            strTablePartQuestionParent += "<div id='divPartParent" + dtExamStructParent[i].EXAMSTRUCTPARTID + "' class='tab-i'>";
            strTablePartQuestionParent += "<a class='" + maunen + "' id='" + dtExamStructParent[i].EXAMSTRUCTPARTID + "' href = 'javascript:void(0);' title = '' >" + dtExamStructParent[i].TITLE + "</a >";

            var strTablePartQuestionChild = "<div class='tab-c'>"
                + " <div class='tab-c-i'> ";

            strTablePartQuestionChild += "<div id='divPartChild" + dtExamStructParent[i].EXAMSTRUCTPARTID + "' class='btn-c-g d-flex justify-content-center mt-4'>";

            var dtExamStructChild = edu.util.objGetDataInData(dtExamStructParent[i].EXAMSTRUCTPARTID, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
            for (var j = 0; j < dtExamStructChild.length; j++)
                strTablePartQuestionChild += "<a class='btn btn-lg btn-outline-white hover-dask-blue border-cc text-22 px-5 me-2' id='" + dtExamStructChild[j].EXAMSTRUCTPARTID + "' href = 'javascript:void(0);' title = '' > <span> " + dtExamStructChild[j].TITLE + " </span> </a>";
            strTablePartQuestionChild += "</div> </div> </div>";

            strTablePartQuestionParent += "</div> </div> </div>";
            strTablePartQuestion += strTablePartQuestionParent + strTablePartQuestionChild;
        }
        $("#zoneTablePart").html(strTablePartQuestion);

    },
    genTablePartDetail: function (strEXAMSTRUCTPARTID) {


        var me = this;
        //#region gen table Part

        $("#zoneTablePartQuestionDetail").html("");
        var strTablePartQuestion = "";
        for (var i = 0; i < me.dtExamStructPartAll.length; i++) {
            var maunen = "button_ExamPartDetail_chualam";

            if (me.dtExamStructPartAll[i].EXAMSTRUCTPARTPARENTID == strEXAMSTRUCTPARTID)
                strTablePartQuestion +=
                    "<a class='" + maunen + " btn btn-lg btn-outline-white hover-dask-blue border-cc text-22 px-5 me-2' id='" + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID + "' href = 'javascript:void(0);' title = '' >" + me.dtExamStructPartAll[i].TITLE + "</a >";

        }
        $("#zoneTablePartQuestionDetail").html(strTablePartQuestion);

    },

    genTableCauHoi: function () {
        var me = this;
        $("#zoneTableQuestion").html("");
        var strContentQuestion = "";
        var strTableQuestion = "";
        var strNextPreQuestion = "";

        var sl = 0;
        var arrId = "";
        var strKieuGiaoDienCauHoi = edu.util.getValById("hidKieuGiaoDienCauHoi");
        for (var iPart = 0; iPart < me.dtExamStructPartAll.length; iPart++) {
            //#region gen table cau hoi 
            var dataQuestionPart = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtQuestion, "EXAMSTRUCTPARTID");
            strTableQuestion += "<div class='testing-l zoneTableQuestionPart' id='zoneTableQuestionPart" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "' style='display:none'  >";
            strNextPreQuestion += "<div class='zoneNextPreQuestion btn-g  d-flex justify-content-center my-4 ' id='zoneNextPreQuestion" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "' style='display:none'>";


            for (var i = 0; i < dataQuestionPart.length; i++) {

                arrId = arrId + "," + dataQuestionPart[i].STUDENTQUESTIONID;
                var maunen = "button_xem";
                if (dataQuestionPart[i].ANSWERED == "0")
                    maunen = "button_xem btn-light border-99 ";
                if (dataQuestionPart[i].ANSWERED == "1")
                    maunen = "button_traloi btn-success border-white ";
                if (dataQuestionPart[i].REVIEW == "1")
                    maunen = "button_review btn-orange border-white ";
                sl++;
                var cauhoi = "";
                if (i < 9) {
                    cauhoi = "<b>Câu 0" + (i + 1) + "</b>";
                }
                else {
                    cauhoi = "<b>Câu " + (i + 1) + "</b>";
                }
                if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUAN") {
                    maunen = "button_tuluan";
                }
                if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI != "THITULUAN" && me.dtExamStructPartAll[iPart].KIEULAMBAITHI != "THINGOAINGU") {
                    strTableQuestion += "<a class='" + maunen + " question-i btn btn-sm' id='" + dataQuestionPart[i].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = '' >" + cauhoi + "</a >";
                    strNextPreQuestion += "<a class='" + maunen + " question-i btn btn-sm' id='" + dataQuestionPart[i].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = ''  style = 'display:none' >" + cauhoi + "</a >";
                }
                if (strKieuGiaoDienCauHoi == "1")
                    strTableQuestion += "<div class='clear'></div>";
                else {
                    if (sl == 4) {
                        sl = 0;
                        strTableQuestion += "<div class='clear'></div>";
                    }
                }
            }
            //var strCauDauTienNextPreQuestion = "";
            //var strCauCuoiCungNextPreQuestion = "";

            //if (dataQuestionPart.length > 0) {
            //    strCauDauTienNextPreQuestion = "<a class='" + maunen + "' id='CauDauTien" + dataQuestionPart[0].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = ''   >Câu đầu tiên </a >&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	";
            //    strCauCuoiCungNextPreQuestion = "&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	&nbsp;	<a class='" + maunen + "' id='CauCuoiCung" + dataQuestionPart[dataQuestionPart.length - 1].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = ''   >Câu cuối cùng </a >";
            //}
            strTableQuestion += "</div>";
            // strNextPreQuestion = strCauDauTienNextPreQuestion + strNextPreQuestion + strCauCuoiCungNextPreQuestion;
            strNextPreQuestion += "</div>";
            //#endregion 


            var strListQuestion = arrId.substring(1, arrId.length - 1);
            $("#txtListQuestion").val(strListQuestion);
            //#region gen table  noi dung cau hoi            
            strContentQuestion += "<div class='bix-div-container zoneTableContentQuestionPart' id='zoneTableContentQuestionPart" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "'  >";
            for (i = 0; i < dataQuestionPart.length; i++) {

                var ChiTietCauHoi = "";
                if (i < 9) {
                    ChiTietCauHoi = "<b>Câu 0" + (i + 1) + "</b>";
                }
                else {
                    ChiTietCauHoi = "<b>Câu " + (i + 1) + "</b>";
                }
                var dataTraLoi = edu.util.objGetDataInData(dataQuestionPart[i].STUDENTQUESTIONID, me.dtAnswer, "STUDENTQUESTIONID");

                var strHienThiCauTraLoi = "<label class='lbcauhoi' style='font-size: 16pt; color:#0066FF'><b>Câu trả lời:</b></label>";
                var strHienThiDiem = "";
                if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUAN") {
                    strHienThiCauTraLoi = "";
                    strHienThiDiem = "(" + dataQuestionPart[i].PLUSMARK + " điểm)";
                }
                strContentQuestion +=
                    "<div class='bix-div-container' id='zoneContentQuestion" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                    + "<label class='lbcauhoi' id='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'font-size: 16pt; color:Red' > <u><b>" + ChiTietCauHoi + ": </b></u></label >"
                    + "<span style='font-size: 16pt; color:Blue;'>" + dataQuestionPart[i].GUIDE + strHienThiDiem + "</span>"
                    + "<input type ='text'   id='QUESTIONTYPECODE" + dataQuestionPart[i].STUDENTQUESTIONID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                    + "<div class='clearQuestion'></div>"
                    + "<div class='clearQuestion'></div>"
                    + "<label class='lbcauhoi'><span style='font-size: 18pt; margin-top:10px'>" + dataQuestionPart[i].CONTENT + "</span></label>"
                    + "<div class='clearQuestion'></div>"
                    + "<div class='clearQuestion' style='margin-bottom:0px'></div>"
                    + strHienThiCauTraLoi
                    + "<div class='clearQuestion' style='margin-bottom:5px'></div>";

                //#region Dap An
                for (var j = 0; j < dataTraLoi.length; j++) {
                    var ischecked = "";
                    if (dataTraLoi[j].STUDENTCORRECT == "1") {
                        ischecked = "checked";
                    }
                    else {
                        ischecked = "";
                    }
                    if (dataQuestionPart[i].QUESTIONTYPECODE == "BESTANSWER" || dataQuestionPart[i].QUESTIONTYPECODE == "TRUEFALSEONE") {

                        strContentQuestion += "<div class='radio'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + "<input type='radio' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + " class='optradio' name='optradio" + dataQuestionPart[i].STUDENTQUESTIONID
                            + "' value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' " + ischecked + " /> "
                            + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                            + "</label>"
                            + "</div >"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                    }
                    if (dataQuestionPart[i].QUESTIONTYPECODE == "MULTICHOICE") {

                        strContentQuestion += "<div class='checkbox'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + "<input type='checkbox' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + "class='optcheckbox' name='optcheckbox" + dataQuestionPart[i].STUDENTQUESTIONID
                            + "' value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' " + ischecked + " /> "
                            + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                            + "</label>"
                            + "</div >"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                    }
                    if (dataQuestionPart[i].QUESTIONTYPECODE == "CROSSLINK") {
                        var dataTraLoi_Ve2 = edu.util.objGetDataInData(dataTraLoi[j].STUDENTQUESTIONID, me.dtAnswer_Sencond, "STUDENTQUESTIONID");

                        var optValues = '<select id="' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '" class="select-opt">' +
                            '<option id="" value="' + dataTraLoi[j].STUDENTANSWERID + '">--Chọn--</option>';
                        for (var iSTTCauVe2 = 0; iSTTCauVe2 < dataTraLoi_Ve2.length; iSTTCauVe2++) {
                            if (dataTraLoi[j].STUDENTANSWER_SENCOND_ID != "" &&
                                dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID == dataTraLoi[j].STUDENTANSWER_SENCOND_ID
                            )
                                optValues += '<option id="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" selected="' + dataTraLoi[j].STUDENTANSWER_SENCOND_ID + '">' + dataTraLoi_Ve2[iSTTCauVe2].CONTENT + '</option>';
                            else
                                optValues += '<option id="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="' + dataTraLoi_Ve2[iSTTCauVe2].ANSWER_SENCONDID + '" >' + dataTraLoi_Ve2[iSTTCauVe2].CONTENT + '</option>';
                        }
                        optValues += '</select>';

                        strContentQuestion += "<div class='radio'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' id='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                            + optValues
                            + "</label>"
                            + "</div >"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                    }
                    if (dataQuestionPart[i].QUESTIONTYPECODE == "TRUEFALSE") {

                        var strSelectTrueFalse = "";
                        var strSelectTrue = "";
                        var strSelectFalse = "";
                        if (dataTraLoi[j].STUDENTCORRECT == "1")
                            strSelectTrue = "selected";
                        else if (dataTraLoi[j].STUDENTCORRECT == "0")
                            strSelectFalse = "selected";
                        else
                            strSelectTrueFalse = "selected";
                        // cau hoi true/false mac dinh khi khoi tao la 2
                        var optValues = "";
                        optValues = '<select id="' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '" class="select-opt-truefalse">';
                        optValues += '<option id="CHON' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="2" ' + strSelectTrueFalse + ' >Chọn</option>';
                        optValues += '<option id="DUNG' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="1" ' + strSelectTrue + ' >Đúng</option>';
                        optValues += '<option id="SAI' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="0" ' + strSelectFalse + '>Sai</option>';
                        optValues += "</select>";


                        strContentQuestion += "<div class='radio'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' id='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + dataTraLoi[j].ORDERABC + optValues + dataTraLoi[j].CONTENT
                            + "</label>"
                            + "</div >"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                    }
                    if (dataQuestionPart[i].QUESTIONTYPECODE == "FI") {
                        strContentQuestion += "<div class='textbox'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + dataTraLoi[j].ORDERABC + dataTraLoi[j].CONTENT
                            + "<input type='textbox' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + "class='opttextbox' name='opttextbox" + dataQuestionPart[i].STUDENTQUESTIONID
                            + "' value='" + edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2) + "' /> "
                            + "</label>"
                            + "</div >"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                    }

                }

                strContentQuestion += "<hr margin-bottom:3px; margin-top:3px;' />";

                strContentQuestion += "</div>";
                //#endregioin Dap An
            }
            strContentQuestion += "</div>";
            //#endregion


        }

        $("#zoneContentQuestion").html(strContentQuestion);
        $("#zoneTableQuestion").html(strTableQuestion);
        $("#zoneNextPreQuestion").html(strNextPreQuestion);

        //#region Neu co 1 phan thi        
        if (me.dtExamStructPartAll.length == 1) {
            me.strExamStructPartId = me.dtExamStructPartAll[0].EXAMSTRUCTPARTID;


            dtQuestionPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");


            //#region Kieu Hien Thi moi moi hinh thuc thi
            var dataPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
            me.strStudentExamRoomPartId = dataPart[0].STUDENTEXAMROOM_PARTID;
            var strKieuLamBaiThi = dataPart[0].KIEULAMBAITHI;


            if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
                $("#zoneNextPreQuestion #" + me.strExamStructPartId).hide();


                me.getList_StudentFiles();
            }
            for (var i = 0; i < dtQuestionPart.length; i++) {
                if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU")
                    $("#zoneContentQuestion" + dtQuestionPart[i].STUDENTQUESTIONID).show();
                else
                    $("#zoneContentQuestion" + dtQuestionPart[i].STUDENTQUESTIONID).hide();
            }
            //#endregion

            $(".zoneNextPreQuestion").hide();
            $("#zoneNextPreQuestion #" + me.strExamStructPartId).show();
            $("#zoneTablePartQuestion #" + me.strExamStructPartId).hide();
            // genTablePartDetail(me.strExamStructPartId);
            $(".zoneTableQuestionPart").hide();
            $("#zoneTableQuestionPart" + me.strExamStructPartId).show();

            $(".zoneTableContentQuestionPart").hide();
            $("#zoneTableContentQuestionPart" + me.strExamStructPartId).show();

            //#region hien thi luon cau dau tien
            me.strStudentQuestion_Id = dtQuestionPart[0].STUDENTQUESTIONID;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
            //me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);

            // $(this).removeClass("button_chuaxem").addClass("button_xem");
            // me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
            var zoneContentQuestion = "zoneContentQuestion" + me.strStudentQuestion_Id;
            $('#' + zoneContentQuestion).css('display', 'none');

            var point = document.getElementById(zoneContentQuestion);
            if (point) point.style.display = "";
            me.hienCauTraLoi(me.strStudentQuestion_Id);
            var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            if (me._timerHandlerCauHoi != null)
                clearInterval(me._timerHandlerCauHoi);
            $('#idCauHoiTimerSpan').text('');
            if (dtCauHoi[0].THOIGIAN != null) {
                if (dtCauHoi[0].FINISHED == "0")
                    me.GetTolTalTimeQuestion();
                else
                    me.KhongChoCapNhatDapAn();
            }

            me.GetTolTalTimePart();
        }
        if (me.strTinhTheoTongThoiGian == "1")
            me.GetTolTalTime();
       
        //#endregion


    },
    saveDapAn: function (strStudentQuestion_Id, strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id) {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatDapAn',
            'versionAPI': 'v1.0',
            'strStudentQuestion_Id': strStudentQuestion_Id,
            'strQuestionTypeCode': strQuestionTypeCode,
            'strStudentAnswer_Id': strStudentAnswer_Id,
            'strCorrect': strCorrect,
            'strReview': strReview,//bỏ
            'strDaTraLoi': strDaTraLoi,
            'strContent2': strContent2,
            'strAnswer_Second_Id': strAnswer_Second_Id
        };

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {

                    if (data.Message == "DALUU") {
                        if (strDaTraLoi == "1")
                            $('a[id="' + strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-success");
                        else
                            $('a[id="' + strStudentQuestion_Id + '"]').removeClass("btn-success").addClass("btn-light");
                        /*
                        var iIndex;
                        for (var i = 0; i < me.dtQuestion.length; i++)
                            if (me.strStudentQuestion_Id === me.dtQuestion[i].STUDENTQUESTIONID) {
                                iIndex = i;
                                break;
                            }
                        me.dtQuestion[iIndex].ANSWERED = "1";
                        if (me.dtQuestion[iIndex].REVIEW == "1") {
                            $('a[id="' + strStudentQuestion_Id + '"]').removeClass("btn-success").addClass("btn-orange");
                            $('a[id="' + strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-orange");
                        }


                        var index = me.arrStudentAnswer_Id.indexOf(strStudentAnswer_Id);

                        if (index >= 0) {
                            me.arrStudentQuestion_Id[index] = strStudentQuestion_Id;
                            me.arrQuestionTypeCode[index] = strQuestionTypeCode;
                            me.arrStudentAnswer_Id[index] = strStudentAnswer_Id;
                            me.arrCorrect[index] = strCorrect;
                            me.arrReview[index] = strReview;
                            me.arrDaTraLoi[index] = strDaTraLoi;
                            me.arrContent2[index] = strContent2;
                            me.arrAnswer_Second_Id[index] = strAnswer_Second_Id;
                        }
                        else {
                            me.arrStudentQuestion_Id.push(strStudentQuestion_Id);
                            me.arrQuestionTypeCode.push(strQuestionTypeCode);
                            me.arrStudentAnswer_Id.push(strStudentAnswer_Id);
                            me.arrCorrect.push(strCorrect);
                            me.arrReview.push(strReview);
                            me.arrDaTraLoi.push(strDaTraLoi);
                            me.arrContent2.push(strContent2);
                            me.arrAnswer_Second_Id.push(strAnswer_Second_Id);
                        }
                        */

                    }
                    else {
                        var strUrl = "eIndex.aspx";
                        window.open(strUrl, "_parent");
                    }
                }
                else {
                    var strUrl = "eIndex.aspx";
                    window.open(strUrl, "_parent");

                }

            },
            error: function (er) {
                /*
                //Luu lai danh sach cau hoi va dap an ma hoc vien tra loi
                var index = me.arrStudentAnswer_Id.indexOf(strStudentAnswer_Id);
                if (index >= 0) {
                    me.arrStudentQuestion_Id[index] = strStudentQuestion_Id;
                    me.arrQuestionTypeCode[index] = strQuestionTypeCode;
                    me.arrStudentAnswer_Id[index] = strStudentAnswer_Id;
                    me.arrCorrect[index] = strCorrect;
                    me.arrReview[index] = strReview;
                    me.arrDaTraLoi[index] = strDaTraLoi;
                    me.arrContent2[index] = strContent2;
                    me.arrAnswer_Second_Id[index] = strAnswer_Second_Id;
                }
                else {

                    me.arrStudentQuestion_Id.push(strStudentQuestion_Id);
                    me.arrQuestionTypeCode.push(strQuestionTypeCode);
                    me.arrStudentAnswer_Id.push(strStudentAnswer_Id);
                    me.arrCorrect.push(strCorrect);
                    me.arrReview.push(strReview);
                    me.arrDaTraLoi.push(strDaTraLoi);
                    me.arrContent2.push(strContent2);
                    me.arrAnswer_Second_Id.push(strAnswer_Second_Id);
                }
                */
                var strUrl = "eIndex.aspx";
                window.open(strUrl, "_parent");

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
    UpdateCurrentTime: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/UpdateCurrentTime',
            'versionAPI': 'v1.0',
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id,
        };

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

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
    UpdateCurrentTimeCauHoi: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/UpdateCurrentTimeCauHoi',
            'versionAPI': 'v1.0',
            'strStudentQuestion_Id': me.strStudentQuestion_Id
        };

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

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
    hienCauTraLoi: function (strId) {
        var me = this;

        $("#zoneNextPreQuestion #" + dtQuestionPart[0].STUDENTQUESTIONID).show();

        dtQuestionPart.forEach(e => $("#zoneNextPreQuestion #" + e.STUDENTQUESTIONID).hide());

        for (var i = 0; i < dtQuestionPart.length; i++) {
            if (strId === dtQuestionPart[i].STUDENTQUESTIONID) {
                $("#chkChuaChacChan").prop("checked", false);
                if (dtQuestionPart[i].REVIEW == "1")
                    $("#chkChuaChacChan").prop("checked", true);

                if (i > 0) { $("#zoneNextPreQuestion #" + dtQuestionPart[i - 1].STUDENTQUESTIONID).show(); $("#zoneNextPreQuestion #" + dtQuestionPart[i - 1].STUDENTQUESTIONID).html('<b> <<-- </b>'); };
                if (i < dtQuestionPart.length - 1) { $("#zoneNextPreQuestion #" + dtQuestionPart[i + 1].STUDENTQUESTIONID).show(); $("#zoneNextPreQuestion #" + dtQuestionPart[i + 1].STUDENTQUESTIONID).html('<b> -->> </b>') };

                $("#zoneNextPreQuestion #" + dtQuestionPart[i].STUDENTQUESTIONID).show();
                $("#zoneNextPreQuestion #" + dtQuestionPart[i].STUDENTQUESTIONID).html($("#zoneTableQuestion #" + dtQuestionPart[i].STUDENTQUESTIONID).html());
            }
        }
    },
    GetTolTalTime: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/GetTolTalTime',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamStructPartId': me.strExamStructPartId,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var status = data.Message;
                    var dtRow = data.Data;
                    me.strTolTalTimeStudent = dtRow[0].TOLTALTIMESTUDENT;
                    var strFinished = dtRow[0].FINISHED;
                    if (parseFloat(me.strTolTalTimeStudent) <= 0 || strFinished == "1") {
                        me.CapNhatKetThucBaiThi();
                    }
                    else {
                        me.totaltime = me.strTolTalTimeStudent * 60;
                        var myVar;
                        var _timerHandler;
                        //Tự động cập nhật thời gian hiện tại
                        myVar = setInterval("main_doc.lambaithi.UpdateCurrentTime()", 180000);//180 giay

                        //Tự động kiểm tra trạng thái phòng thi
                        myVar = setInterval("main_doc.lambaithi.KiemTraTTLamBaiVaTTPT()", 30000);//30 giay

                        _timerHandler = setInterval("main_doc.lambaithi.MyTimer(" + me.totaltime + ")", 1000);
                    }


                    // me.LayDS_ThongTinDeThiCuaThiSinh();
                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    GetTolTalTimeQuestion: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/GetTolTalTimeQuestion',
            'versionAPI': 'v1.0',
            'strStudentQuestion_Id': me.strStudentQuestion_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var status = data.Message;
                    var dtRow = data.Data;


                    me.iThoiGianCuaCauHoi = dtRow[0].TOLTALTIMEQUESTION;
                    var strFinished = dtRow[0].FINISHED;

                    if (parseFloat(me.iThoiGianCuaCauHoi) <= 0 & strFinished == "0") {
                        me.CapNhatKetThucCauHoi();
                    }
                    else if (strFinished == "1") {
                        me.KhongChoCapNhatDapAn();
                    }
                    else {

                        var myVar;
                        //Tự động cập nhật thời gian hiện tại
                        //myVar = setInterval("main_doc.lambaithi.UpdateCurrentTimePart()", 180000);//180 giay

                        //Tự động kiểm tra trạng thái phòng thi
                        //  myVar = setInterval("main_doc.lambaithi.KiemTraTTLamBaiVaTTPTPart()", 30000);//30 giay

                        me._timerHandlerCauHoi = setInterval("main_doc.lambaithi.MyTimerCauHoi(" + me.iThoiGianCuaCauHoi + ")", 1000);

                    }
                    //  me.LayDS_ThongTinDeThiCuaThiSinh();
                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    KhongChoCapNhatDapAn: function () {
        var me = this;
        $('#idCauHoiTimerSpan').text('Hết thời gian trả lời câu hỏi');
        var dataTraLoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtAnswer, "STUDENTQUESTIONID");

        for (var j = 0; j < dataTraLoi.length; j++) {
            $("#" + dataTraLoi[j].STUDENTANSWERID).prop('disabled', true);
        }


    },
    GetTolTalTimePart: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/GetTolTalTimePart',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamStructPartId': me.strExamStructPartId,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var status = data.Message;
                    var dtRow = data.Data;


                    me.strTolTalTimeStudent = dtRow[0].TOLTALTIMESTUDENT;
                    var strFinished = dtRow[0].FINISHED;

                    if (parseFloat(me.strTolTalTimeStudent) <= 0) {
                        me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartId, me.strExamStructPartId);
                        // Nếu hết thời gian, người dùng F5 cũng không hiển thị ra thông tin gì
                        //Ẩn câu hỏi và đáp án
                        $('.zoneTableContentQuestionPart').attr("style", "display:none !important");
                        $("#zoneTableContentQuestionPart" + me.strExamStructPartDetailId).hide();
                        var dtPartDetail = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
                        // Ẩn phần Part Detail
                        for (var i = 0; i < dtPartDetail.length; i++) {
                            me.gen_AnPhanThi(dtPartDetail[i].EXAMSTRUCTPARTID, "1");
                            $("#zoneTablePartQuestionDetail #" + dtPartDetail[i].EXAMSTRUCTPARTID).hide();
                        }
                    }
                    else if (strFinished == "1") {
                        me.gen_AnPhanThi(me.strExamStructPartId, "0");
                    }
                    else {
                        me.totaltime = me.strTolTalTimeStudent * 60;
                        var myVar;
                        var _timerHandler;
                        //Tự động cập nhật thời gian hiện tại
                        myVar = setInterval("main_doc.lambaithi.UpdateCurrentTimePart()", 180000);//180 giay

                        //Tự động kiểm tra trạng thái phòng thi
                        myVar = setInterval("main_doc.lambaithi.KiemTraTTLamBaiVaTTPTPart()", 30000);//30 giay

                        _timerHandler = setInterval("main_doc.lambaithi.MyTimer(" + me.totaltime + ")", 1000);
                    }
                    // me.LayDS_ThongTinDeThiCuaThiSinh();
                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    MyTimerCauHoi: function (tongthoigian) {
        var me = this;

        var valueTimer = me.iThoiGianCuaCauHoi;
        var myFunction = function () {
        };



        if (tongthoigian == 0) {
            //Chua lam: An cau hoi
            me.KhongChoCapNhatDapAn();
            me.CapNhatKetThucCauHoi();
        }
        else {
            tongthoigian = tongthoigian - 1;
        }

        if (valueTimer > 0) {
            valueTimer = valueTimer - 1;
            var hours = (valueTimer / 3600).toString().split('.')[0];
            var mins = ((valueTimer % 3600) / 60).toString().split('.')[0];
            var secs = ((valueTimer % 3600) % 60).toString().split('.')[0]; //console.log(secs);

            if (hours > 0)
                hours = hours + ":";
            else
                hours = "     ";
            if (mins.length == 1) mins = '0' + mins;
            if (secs.length == 1) secs = '0' + secs;

            $('#idCauHoiTimerSpan').text('Thời gian còn lại: ' + hours + mins + ':' + secs);
            //$('#hdnTimer').val(valueTimer);
            me.iThoiGianCuaCauHoi = valueTimer;

        }
        else {
            var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
            if (dtCauHoi[0].FINISHED == "0")
                me.UpdateCurrentTimeCauHoi();//Chua lam: AN cau hoi
            me.KhongChoCapNhatDapAn();
            me.CapNhatKetThucCauHoi();
            clearInterval(me._timerHandlerCauHoi);


        }
    },
    MyTimer: function (tongthoigian) {
        var me = this;
        var valueTimer = me.totaltime;
        var myFunction = function () {
        };
        try {
            if (valueTimer == Math.round(me.strTolTalTimeStudent * 60 / 10)) {
                var myImg = "/Files/Finish.png";
                //-----> Them doan nay e.preventDefault();
                var options = {
                    title: "Thi online",
                    options: {
                        body: "Bạn sắp hết thời gian làm bài",
                        icon: myImg,
                        lang: 'en-US',
                        onClick: myFunction
                    }
                };
                $("#easyNotify").easyNotify(options);
            }
        }
        catch (Ex) {
        }


        if (tongthoigian == 0) {
            //var strUrl = "../../../../eIndex.aspx";
            //window.open(strUrl, "_parent");
            if (me.strTinhTheoTongThoiGian != "1")
                me.KiemTraDaLamHetCacPhanThi();
            else {
                var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                window.open(strUrl, "_parent");
            }
        }
        else {
            tongthoigian = tongthoigian - 1;
        }

        if (valueTimer > 0) {
            valueTimer = valueTimer - 1;
            var hours = (valueTimer / 3600).toString().split('.')[0];
            var mins = ((valueTimer % 3600) / 60).toString().split('.')[0];
            var secs = ((valueTimer % 3600) % 60).toString().split('.')[0]; //console.log(secs);

            if (hours > 0)
                hours = hours + ":";
            else
                hours = "     ";
            if (mins.length == 1) mins = '0' + mins;
            if (secs.length == 1) secs = '0' + secs;

            $('#idTimerLCD').text(hours + mins + ':' + secs);
            //$('#hdnTimer').val(valueTimer);
            me.totaltime = valueTimer;
            document.title = $('#idTimerLCD').text();
        }
        else {
            if (me.strTinhTheoTongThoiGian != "1") {
                $("#zoneTablePartQuestion #" + me.strStudentExamRoomPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                if (me.strDaGoiHamHetThoiGian != "1") {
                    me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartId, me.strExamStructPartId);
                    me.gen_AnPhanThi(me.strExamStructPartId, "0");
                    //#region An Phan thi part
                    var dtPartDetail = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
                    for (var i = 0; i < dtPartDetail.length; i++) {
                        me.gen_AnPhanThi(dtPartDetail[i].EXAMSTRUCTPARTID, "1");
                        $("#zoneTablePartQuestionDetail #" + dtPartDetail[i].EXAMSTRUCTPARTID).hide();
                    }
                    //#endregion

                }
                me.KiemTraDaLamHetCacPhanThi();
                me.strDaGoiHamHetThoiGian = "1";
            }
            else {
                var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                window.open(strUrl, "_parent");
            }


        }
    },
    CapNhatKetThucBaiThiPart: function (StudentExamRoomPartId, ExamStructPartId) {
        var me = this;

        var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === ExamStructPartId);

        if (index < 0 || me.dtExamStructPartAll[index].FINISHED == "1")
            return;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatKetThucBaiThiPart',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThisinh_Id': me.strThiSinh_Id,
            'strStudentExamRoomPartId': StudentExamRoomPartId
        };

        edu.system.makeRequest({
            success: function (data) {

                var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === ExamStructPartId);

                if (index >= 0)
                    me.dtExamStructPartAll[index].FINISHED = "1";


                me.KiemTraDaLamHetCacPhanThi();
                //me.gen_AnPhanThi(ExamStructPartId);
                // console.log(ExamStructPartId);



            },
            error: function (er) {

                var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                window.open(strUrl, "_parent");
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
    KiemTraTTLamBaiVaTTPTPart: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/KiemTraTTLamBaiVaTTPTPart',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strStudentExamRoomId': me.strStudentExamRoom_Id,
            'strStudentExamRoomPartId': me.strStudentExamRoomPartId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data[0];


                    if (dt.OPENSTATUS == null || dt.OPENSTATUS == "" || dt.OPENSTATUS == "0") {
                        alert("Phòng thi đã kết thúc, vui lòng liên hệ giám thị coi thi để biết thêm thông tin, hệ thống sẽ tự động đóng bài thi!");

                        var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                        window.open(strUrl, "_parent");                        //Chuyển tới Index

                    }
                    else if (parseInt(dt.OPENSTATUS) == "1")//Phòng thi đang mở
                    {
                        if (dt.FINISHED == "1") {
                            var dtKTExamStructPart = edu.util.objGetDataInData("1", me.dtExamStructPartAll, "FINISHED");

                            if (dtKTExamStructPart.length == me.dtExamStructPartAll.length) {
                                var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                                window.open(strUrl, "_parent");
                            }

                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            // $(this).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                            $("#zoneTablePartQuestion #" + me.strExamStructPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                            //me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartId, me.strExamStructPartId); 
                            $('.zoneTableContentQuestionPart').attr("style", "display:none !important");
                            $("#zoneTableContentQuestionPart" + me.strExamStructPartDetailId).hide();
                            $("#zoneTableAudioPart").hide();
                            //me.KiemTraDaLamHetCacPhanThi();

                        }
                        if (dt.STUDENTEXAMROOMSTATUS == "TAMDUNGTHI") {
                            alert("Tạm dừng thi, vui lòng liên hệ Giám thị để biết thêm thông tin!");
                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            //me.CapNhatKetThucBaiThiPart();
                            var strUrl = "eIndex.aspx";
                            window.open(strUrl, "_parent");
                        }




                    }

                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    getList_StudentFiles: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_StudentFiles/LayDanhSach',
            'versionAPI': 'v1.0',
            'strDuLieu_Id': me.strStudentExamRoomPartId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.viewFiles("txt_File_Student", "", "TTN_StudentFiles");
                    //edu.system.viewFiles("txt_File_Student", me.strStudentExamRoom_Id, "TTN_StudentFiles");
                    me.dtStudentFiles = data.Data;
                    me.genTable_StudentFiles(data.Data);
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
    genTable_StudentFiles: function (data) {
        var me = this;
        var pConfig = Init_Prammater();
        var rootPathUploadFile = pConfig.rootPathUpload;

        var jsonForm = {
            strTable_Id: "tblStudentFiles",
            aaData: data,
            sort: true,
            colPos: {
                left: [1],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a id="' + aData.ID + '" href="' + rootPathUploadFile + '/' + aData.DUONGDAN + '">' + aData.TENHIENTHI + '</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {

                        return '<a id="' + aData.ID + '" class="btn btn-default btnDelete_StudentFiles"><i class="fa fa-trash"></i> Xóa</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    Xoa_StudentFiles: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'TTN_StudentFiles/Xoa_FileName',
            'versionAPI': 'v1.0',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_StudentFiles();
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
    KiemTraDaLamHetCacPhanThi: function () {
        var me = this;
        var dtKTExamStructPart = edu.util.objGetDataInData("1", me.dtExamStructPartAll, "FINISHED");

        if (dtKTExamStructPart.length == me.dtExamStructPartAll.length) {

            var strUrl = "../../../../ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
            window.open(strUrl, "_parent");
        }

    },
    save: function (strStudentQuestionLuu_Id, strStudentQuestionLuu_LoaiCau) {
        var me = this;
        var strStudentAnswer_Id;
        var strCorrect = "";
        var strReview = "0";
        if ($("#chkChuaChacChan").is(":checked") == true)
            strReview = "1";
        var strDaTraLoi = 0;
        var strContent2 = "";
        var strAnswer_Second_Id = "";

        if (strStudentQuestionLuu_LoaiCau == "FILLTHEBLANK") {
            var tDapAn = $("#zoneContentQuestion" + strStudentQuestionLuu_Id + " label[class='lbdapan'] input");

            for (var i = 0; i < tDapAn.length; i++) {

                if (tDapAn[i].value != "")
                    strDaTraLoi = "1";
            }
            for (var i = 0; i < tDapAn.length; i++) {
                strStudentAnswer_Id = tDapAn[i].id;
                strContent2 = tDapAn[i].value;
                me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
            }
            if (strDaTraLoi == "1")
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-light").addClass("btn-success");
            else
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-success").addClass("btn-light");
            var iIndex;
            for (var i = 0; i < me.dtQuestion.length; i++)
                if (me.strStudentQuestion_Id === me.dtQuestion[i].STUDENTQUESTIONID) {
                    iIndex = i;
                    break;
                }
            if (me.dtQuestion[iIndex].REVIEW == "1") {
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-success").addClass("btn-orange");
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-light").addClass("btn-orange");
            }


        }


    },
    UpdateCurrentTimePart: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/UpdateCurrentTimePart',
            'versionAPI': 'v1.0',
            'strStudentExamRoomPartId': me.strStudentExamRoomPartId
        };

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

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
    saveReview: function (strStudentQuestion_Id, strReview) {
        var me = this;


        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatTrangThaiXemCauHoi',
            'versionAPI': 'v1.0',
            'strReview': strReview,
            'strStudentQuestion_Id': strStudentQuestion_Id
        };

        edu.system.makeRequest({
            success: function (data) {
                var iIndex;
                for (var i = 0; i < me.dtQuestion.length; i++)
                    if (strStudentQuestion_Id === me.dtQuestion[i].STUDENTQUESTIONID) {
                        iIndex = i;
                        break;
                    }
                me.dtQuestion[iIndex].REVIEW = strReview;
                me.hienCauTraLoi(strStudentQuestion_Id);


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
    LayDS_MatKhauPhanThi: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_MatKhauPhanThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMatKhauPhanThi = data.Data;
                }
                else {
                    var status = data.Message;

                }
            },
            error: function (er) {

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
    HienThiVaLamBai: function () {

        var me = this;
        me.strExamStructPartId = me.strExamStructPartTempId;
        if (me.strTinhTheoTongThoiGian != '1') {
            if (me.strExamStructPartOldId == me.strExamStructPartId && me.strExamStructPartOldId != undefined)
                return;

            var dtKTExamStructPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");


            // Kiem tra phan thi moi xem da ket thuc chua
            if (dtKTExamStructPart[0].FINISHED == "1") {
                me.gen_AnPhanThi(me.strExamStructPartId, "0");
                edu.system.alert("Phần thi này đã kết thúc làm bài");
                $('#btnFinish').css({ 'pointer-events': 'none' });
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn làm phần thi?");
            $("#btnYes").click(function (e) {
                me.HienThiVaLamBai_ThiSinhPart();
            });
        }
        else
            me.HienThiVaLamBai_ThiSinh();
    },
    HienThiVaLamBai_ThiSinhPart: function () {
        var me = this;

        me.strDaGoiHamHetThoiGian = "";
        if (me.strExamStructPartOldId != null)
            me.CapNhatKetThucBaiThiPart(me.strStudentExamRoomPartOldId, me.strExamStructPartOldId);


        var dataPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        me.strStudentExamRoomPartId = dataPart[0].STUDENTEXAMROOM_PARTID;

        $("#zoneTablePartQuestion #" + me.strExamStructPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
        $("#myModalAlert").modal("hide");

        me.gen_AnPhanThi(me.strExamStructPartOldId, "0");
        $('#btnFinish').css({ 'pointer-events': '' });
        dtQuestionPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");

        $(".zoneNextPreQuestion").hide();
        $("#zoneNextPreQuestion #" + me.strExamStructPartId).show();

        //#region Kieu Hien Thi moi moi hinh thuc thi

        var strKieuLamBaiThi = dataPart[0].KIEULAMBAITHI;
        $("#zoneUpload").hide();
        $("#lblDeThiThu").html("ĐỀ THI SỐ " + dataPart[0].DETHITHU);
        if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
            $("#zoneNextPreQuestion #" + me.strExamStructPartId).hide();
            $("#zoneUpload").show();
            $("#zoneDeThiThu").show();
            me.getList_StudentFiles();
        }
        else
            $("#zoneDeThiThu").hide();
        for (var i = 0; i < dtQuestionPart.length; i++) {
            if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
                $("#zoneNextPreQuestion #" + me.strExamStructPartId).hide();


                $("#tblDeThi tbody tr td:nth-child(1)").hide();
            }
            else {
                $("#zoneContentQuestion" + dtQuestionPart[i].STUDENTQUESTIONID).hide();
                $("#tblDeThi tbody tr td:nth-child(1)").show();
            }
        }


        //#endregion



        // $(this).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_danglam");

        me.genTablePartDetail(me.strExamStructPartId);
        if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
            me.genTableAudioPart(me.strExamStructPartDetailId);
        }

        $(".zoneTableQuestion").hide();
        $("#zoneTableQuestion" + me.strExamStructPartId).show();

        $(".zoneNextPreQuestion").hide();
        $("#zoneNextPreQuestion" + me.strExamStructPartId).show();

        $(".zoneTableContentQuestionPart").hide();
        $("#zoneTableContentQuestionPart" + me.strExamStructPartId).show();

        //#region hien thi luon cau dau tien
        $("#zoneTablePartNoiDungCauHoiNhom").html("");
        if (edu.util.returnEmpty(dtQuestionPart[0].NOIDUNGNHOMCAUHOI) != '')
            $("#zoneTablePartNoiDungCauHoiNhom").html(dtQuestionPart[0].NOIDUNGNHOMCAUHOI);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'zoneTablePartNoiDungCauHoiNhom']);


        me.strStudentQuestion_Id = dtQuestionPart[0].STUDENTQUESTIONID;
        me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
        //me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);

        // $(this).removeClass("button_chuaxem").addClass("button_xem");
        // me.strStudentQuestion_Id = id;
        me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
        var zoneContentQuestion = "zoneContentQuestion" + me.strStudentQuestion_Id;
        $('#' + zoneContentQuestion).css('display', 'none');
        document.getElementById("lblThongBao").style.display = "none";
        var point = document.getElementById(zoneContentQuestion);
        if (point) point.style.display = "";
        me.hienCauTraLoi(me.strStudentQuestion_Id);
        // Neu thi theo thoi gian tung phan
        me.GetTolTalTimePart();


        //#endregion 



        // me.genTableCauHoi();


    },
    HienThiVaLamBai_ThiSinh: function () {
        var me = this;

        me.strDaGoiHamHetThoiGian = "";


        //if (me.strExamStructPartOldId != null && me.strExamStructPartOldId != '')
        //    $("#zoneTablePartQuestion #" + me.strExamStructPartOldId).removeClass("button_ExamPart_view").addClass("button_ExamPart_chualam");

        var dataPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPart, "EXAMSTRUCTPARTID");
        me.strStudentExamRoomPartId = '';
        if (dataPart.length > 0) {
            me.strStudentExamRoomPartId = dataPart[0].STUDENTEXAMROOM_PARTID;
           // $("#zoneTablePartQuestion #" + me.strExamStructPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_view");
        }


        $("#myModalAlert").modal("hide");

        me.gen_AnPhanThi(me.strExamStructPartOldId, "0");
        $('#btnFinish').css({ 'pointer-events': '' });
        dtQuestionPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");
        $(".zoneNextPreQuestion").hide();
        if (me.strExamStructPartId != '')
            $("#zoneNextPreQuestion #" + me.strExamStructPartId).show();

        //#region Kieu Hien Thi moi moi hinh thuc thi

        var strKieuLamBaiThi = '';
        if (dataPart.length > 0) {
            strKieuLamBaiThi = dataPart[0].KIEULAMBAITHI;
            $("#lblDeThiThu").html("ĐỀ THI SỐ " + dataPart[0].DETHITHU);
        }
        $("#zoneUpload").hide();
         
        if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
            $("#zoneNextPreQuestion #" + me.strExamStructPartId).hide();
            $("#zoneUpload").show();
            $("#zoneDeThiThu").show();
            me.getList_StudentFiles();
        }
        else
            $("#zoneDeThiThu").hide();
        for (var i = 0; i < dtQuestionPart.length; i++) {
            if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
                $("#zoneContentQuestion" + dtQuestionPart[i].STUDENTQUESTIONID).show();


                $("#tblDeThi tbody tr td:nth-child(1)").hide();
            }
            else {
                $("#zoneContentQuestion" + dtQuestionPart[i].STUDENTQUESTIONID).hide();
                $("#tblDeThi tbody tr td:nth-child(1)").show();
            }
        }
        //#endregion

        me.genTablePartDetail(me.strExamStructPartId);
        $(".zoneTableQuestionPart").hide();
        $("#zoneTableQuestionPart" + me.strExamStructPartId).show();

        $(".zoneTableContentQuestionPart").hide();
        $("#zoneTableContentQuestionPart" + me.strExamStructPartId).show();
        $("#zoneTablePartNoiDungCauHoiNhom").html("");
        //#region hien thi luon cau dau tien
        if (dtQuestionPart.length > 0) {
            me.strStudentQuestion_Id = dtQuestionPart[0].STUDENTQUESTIONID;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
            //me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);            
            if (edu.util.returnEmpty(dtQuestionPart[0].NOIDUNGNHOMCAUHOI) != '')
                $("#zoneTablePartNoiDungCauHoiNhom").html(dtQuestionPart[0].NOIDUNGNHOMCAUHOI);
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'zoneTablePartNoiDungCauHoiNhom']);
        }
        else {
            me.strStudentQuestion_Id = '';
            me.strQuestionTypeCode = '';
        }
        // $(this).removeClass("button_chuaxem").addClass("button_xem");
        // me.strStudentQuestion_Id = id;
        //me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
        var zoneContentQuestion = "zoneContentQuestion" + me.strStudentQuestion_Id;
        $('#' + zoneContentQuestion).css('display', 'none');
        document.getElementById("lblThongBao").style.display = "none";
        var point = document.getElementById(zoneContentQuestion);
        if (point) point.style.display = "";
        if (me.strStudentQuestion_Id != '')
            me.hienCauTraLoi(me.strStudentQuestion_Id);

        if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
            me.genTableAudioPart(me.strExamStructPartDetailId);
        }



        //#endregion 

        //me.genTableAudioPart(); 

        // me.genTableCauHoi();




    },
    genTableAudioPart: function (strExamStructPartId) {
        var me = this;
        $("#zoneTableAudioPart").html("");
        var data = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
        var dtExamStruct = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        var xx = AP.destroy();
        if (data.length > 0 && dtExamStruct.length > 0) {
            console.log(dtExamStruct[0].SOLANNGHE);
            if (dtExamStruct[0].SOLANNGHE != '0')
                return;
            var dataFileAmThanh = [];
            for (var i = 0; i < data.length; i++) {

                var FileAmThanh = { 'icon': iconImage, 'title': data[i].TENHIENTHI, 'file': me.rootPathUploadFile + data[i].DUONGDAN };
                console.log("Audio link: " + me.rootPathUploadFile + data[i].DUONGDAN);
                console.log("Audio link 1: data[i].DUONGDAN" + data[i].DUONGDAN);
                console.log("Audio link 3: me.rootPathUploadFile" + me.rootPathUploadFile);
                dataFileAmThanh.push(FileAmThanh);
            }

            var iconImage = null;
            var xx = AP.destroy();
            var abc1 = AP.init({
                container: '#zoneTableAudioPart',//a string containing one CSS selector
                volume: 0.7,
                autoPlay: true,
                notification: false,
                playList: dataFileAmThanh
            });
            var dataAudio = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
            if (dataAudio.length > 0)
                me.CapNhatSoLanNghe(strExamStructPartId);

        }
        // $("#zoneTableAudioPart").html(strTablePartQuestion);

        //#endregion 

    },
    CapNhatSoLanNghe: function (strExamStructPartlId) {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatSoLanNghe',
            'versionAPI': 'v1.0',
            'strExamStructPartlId': strExamStructPartlId,
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {

                var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === strExamStructPartlId);

                console.log(index);
                console.log(strExamStructPartlId);
                console.log(me.dtExamStructPartAll);
                me.dtExamStructPartAll[index].SOLANNGHE = data.Data;

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
    HienThiVaLamBai_PhanChiTiet: function () {
        var me = this;

        var dataPartDetail = edu.util.objGetDataInData(me.strExamStructPartDetailId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        me.strStudentExamRoomPartId = dataPartDetail[0].STUDENTEXAMROOM_PARTID;

        dtQuestionPartDetail = edu.util.objGetDataInData(me.strExamStructPartDetailId, me.dtQuestion, "EXAMSTRUCTPARTID");
        //#region Kieu Hien Thi moi moi hinh thuc thi

        var strKieuLamBaiThi = dataPartDetail[0].KIEULAMBAITHI;

        if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
            me.genTableAudioPart(me.strExamStructPartDetailId);
        }


        for (var i = 0; i < dtQuestionPartDetail.length; i++) {
            if (strKieuLamBaiThi == "THITULUAN" || strKieuLamBaiThi == "THINGOAINGU") {
                //Nếu là thi ngoại ngữ thì hiển thị hết câu hỏi
                $("#zoneContentQuestion" + dtQuestionPartDetail[i].STUDENTQUESTIONID).show();

                $("#tblDeThi tbody tr td:nth-child(1)").hide();
            }
            else {
                $("#zoneContentQuestion" + dtQuestionPartDetail[i].STUDENTQUESTIONID).hide();
                $("#tblDeThi tbody tr td:nth-child(1)").show();
            }
        }
        //#endregion

        // Hiển thị phần bên phải chọn câu hỏi
        $(".zoneTableQuestion").hide();
        $("#zoneTableQuestion" + me.strExamStructPartDetailId).show();
        // Hiển thị phần footer chọn câu hỏi
        $(".zoneNextPreQuestion").hide();
        $("#zoneNextPreQuestion" + me.strExamStructPartDetailId).show();
        //Hiển thị phần câu hỏi +đáp án
        $(".zoneTableContentQuestionPart").hide();
        $("#zoneTableContentQuestionPart" + me.strExamStructPartDetailId).show();

        //#region hien thi luon cau dau tien đối với tất cả các hình thức thi
        me.strStudentQuestion_Id = "";
        me.strQuestionTypeCode = "";
        me.strQuestionTypeCode = "";
        if (dtQuestionPart.length > 0 && strKieuLamBaiThi == "THITULUAN" && strKieuLamBaiThi == "THINGOAINGU") {
            me.strStudentQuestion_Id = dtQuestionPartDetail[0].STUDENTQUESTIONID;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
            //me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);

            // $(this).removeClass("button_chuaxem").addClass("button_xem");
            // me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + me.strStudentQuestion_Id).val();
            var zoneContentQuestion = "zoneContentQuestion" + me.strStudentQuestion_Id;
            $('#' + zoneContentQuestion).css('display', 'none');
            var point = document.getElementById(zoneContentQuestion);
            if (point) point.style.display = "";
            me.hienCauTraLoi(me.strStudentQuestion_Id);
        }


    },
}