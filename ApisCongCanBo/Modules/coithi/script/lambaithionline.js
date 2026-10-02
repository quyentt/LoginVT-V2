function lambaithionline() { };
lambaithionline.prototype = {
    strExamRoomInfo_Id: '',
    strStudentExamRoom_Id: '',
    strStudentQuestion_Id: '',
    dtQuestion: [],
    dtAnswer: [],
    dtAnswer_Sencond: [],
    dtExamStructPartAll: [],// Cau truc bai thi
    strTinhTheoTongThoiGian: '',
    strTable_ExamStructPart: '',
    strExamStructPartId: '',
    strExamStructId: '',
    strExamStructPartId_Muc1: '',
    strExamStructPartId_Muc1_Cu: '',
    dtExamStructPartAudioFiles: [],
    dtExamQuestionAudioFiles: [],
    strStudentExamRoomPartId: '',
    strTolTalTimeStudent: '',
    rootPathUploadFile: '',
    strUrlKetQuaThi: '',
    strUrlLogout: '',
    strUrleIndex: '',
    strRandomTimerLCD: '',
    _timerHandler: 0,
    strTTN_FileId_DaNghe: '',
    csszoneTable_NoiDungNhomCauHoi: 'col-12 col-lg-6 tab-c mt-3',
    csszoneChonCauHoi_NoiDungCauHoiVaDapAn_50: 'col-12 col-lg-6 testing-w mt-3',
    csszoneChonCauHoi_NoiDungCauHoiVaDapAn_100: 'col-12 col-lg-12 testing-w mt-3',
    strKieuLamBaiThi: '',
    DoSau: 1,// Level, độ sâu, mức của các phần thi



    init: function () {
        var me = this;


        me.strExamRoomInfo_Id = edu.util.getValById('txtExamRoomInfo_Id');
        me.strStudentExamRoom_Id = edu.util.getValById('txtStudentExamroom_Id');
        me.strThiSinh_Id = edu.util.getValById('txtThiSinh_Id');

        me.rootPathUploadFile = edu.system.rootPathUpload + '/ApisQuanLyThiTracNghiem/Doc/Audio_temp/' + me.strExamRoomInfo_Id;
        var strsite = location.pathname.split('/');
        me.strUrlKetQuaThi = location.origin + "/" + strsite[1] + "/ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
        me.strUrleIndex = location.origin + "/" + strsite[1] + '/eIndex.aspx';
        me.strUrlLogout = location.origin + "/" + strsite[1] + "/Logout.aspx";
        if (location.hostname == 'localhost') {
            me.strUrlKetQuaThi = location.origin + "/" + "ketquathi.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
            me.strUrleIndex = location.origin + "/" + 'eIndex.aspx';
            me.strUrlLogout = location.origin + "/Logout.aspx";
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                window.open(me.strUrlLogout, "_parent");
                return false;
            }
        });
        if (me.strThiSinh_Id != edu.system.userId) {
            me.ThemTBL_EXA_TTNLOG();
            window.open(me.strUrlLogout, "_parent");
        }
        //B1: kiem tra trang thai
        me.KiemTraTrangThai();

        //Lay thong tin de thi
        me.LayDS_ThongTinDeThiCuaThiSinh();

        $(document).delegate('.button_ExamStructPart_chualam', 'click', function () {

            var strExamStructPartId_Cu = me.strExamStructPartId;
            var id = $(this).attr('id');
            me.strExamStructPartId = id;
            var data = edu.util.objGetDataInData(edu.util.returnEmpty(me.strExamStructPartId), me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
            // khi chọn phần thi khác nếu là mức 1 và tính theo thời gian từng phần thi reset strDaGoiHamHetThoiGian
            if (me.strExamStructPartId_Muc1 != me.strExamStructPartId_Muc1_Cu)
                me.strDaGoiHamHetThoiGian = '';
            me.KiemTraDaLamHetCacPhanThi();
            me.button_ExamStructPartClick(strExamStructPartId_Cu);
            me.genTableAudioPart(me.strExamStructPartId);

        });
        $(document).delegate('.button_ExamStructPart_dalam', 'click', function () {

            var strExamStructPartId_Cu = me.strExamStructPartId;
            var id = $(this).attr('id');
            me.strExamStructPartId = id;
            // khi chọn phần thi khác nếu là mức 1 và tính theo thời gian từng phần thi reset strDaGoiHamHetThoiGian
            if (me.strExamStructPartId_Muc1 != me.strExamStructPartId_Muc1_Cu)
                me.strDaGoiHamHetThoiGian = '';
            me.KiemTraDaLamHetCacPhanThi();
            me.button_ExamStructPartClick(strExamStructPartId_Cu);
            me.genTableAudioPart(me.strExamStructPartId);
        });
        $(document).delegate('.button_xem', 'click', function (event) {
            //event.stopImmediatePropagation();

            var strStudentQuestion_Id_Cu = me.strStudentQuestion_Id;
            var strQuestionTypeCode_Cu = me.strQuestionTypeCode;
            var id = $(this).attr('id');
            me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();

            if (me.strQuestionTypeCode == 'RECODER') {
                $("#zoneRecoder").removeClass('AnCSS');
                $("#zonePlayRecoder").removeClass('AnCSS');
                $("#guideRecoder").text("Nhấn vào đây để bắt đầu ghi âm");
                me.LayTT_FilesRecoderByDLId();
            }
            else {
                $("#zoneRecoder").addClass('AnCSS');
                $("#zonePlayRecoder").addClass('AnCSS');

                $("#zonePlayRecoder").html("");
            }
            me.button_CauHoiClick(strStudentQuestion_Id_Cu, strQuestionTypeCode_Cu);



        });
        $(document).on('change', '.select-opt-truefalse', function () {

            var strStudentAnswer_Id = $(this).attr('id');

            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();
            //var strStudentQuestion_Id = $(this).attr('name');             

            var strCorrect = $("#" + strStudentAnswer_Id).find(":selected").val();

            var strReview = "0";
            if ($("#chkChuaChacChan").is(":checked") == true)
                strReview = "1";
            var strDaTraLoi = 1;
            var strContent2 = "";
            var strAnswer_Second_Id = "";



            me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
            if (strDaTraLoi == "1")
                $('a[id="' + me.strStudentQuestion_Id + '"]').removeClass("button_xem btn-light border-99 ").addClass("button_traloi btn-success border-white");
            else
                $('a[id="' + me.strStudentQuestion_Id + '"]').removeClass("button_traloi btn-success border-white").addClass("button_xem btn-light border-99");

        });
        $(document).delegate('.button_traloi', 'click', function () {
            var strStudentQuestion_Id_Cu = me.strStudentQuestion_Id;
            var strQuestionTypeCode_Cu = me.strQuestionTypeCode;
            var id = $(this).attr('id');
            me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();
            me.button_CauHoiClick(strStudentQuestion_Id_Cu, strQuestionTypeCode_Cu);
        });
        $(document).delegate('.button_review', 'click', function () {
            var strStudentQuestion_Id_Cu = me.strStudentQuestion_Id;
            var strQuestionTypeCode_Cu = me.strQuestionTypeCode;
            var id = $(this).attr('id');
            me.strStudentQuestion_Id = id;
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + id).val();
            me.button_CauHoiClick(strStudentQuestion_Id_Cu, strQuestionTypeCode_Cu);
        });

        $(document).delegate('.optcheckbox', 'click', function () {
            var strStudentAnswer_Id = $(this).attr('id');
            me.strQuestionTypeCode = $('#QUESTIONTYPECODE' + strStudentAnswer_Id).val();
            me.strStudentQuestion_Id = $('#STUDENTQUESTIONID' + strStudentAnswer_Id).val();
            var strCorrect = "0";
            var strReview = "0";
            if ($("#chkChuaChacChan").is(":checked") == true)
                strReview = "1";

            var strDaTraLoi = "";
            var strContent2 = "";
            var strAnswer_Second_Id = "";
            var tblDapAn = $("#zoneContentQuestion" + me.strStudentQuestion_Id).find(".optcheckbox");
            for (var i = 0; i < tblDapAn.length; i++) {// Nếu đã check  trong các đáp là--> Câu đã trả lời
                if ($(tblDapAn[i]).is(":checked") == true)
                    strDaTraLoi = "1";
            }
            strCorrect = ($("#" + strStudentAnswer_Id).is(":checked") == true ? '1' : '0');
            me.saveDapAn(me.strStudentQuestion_Id, me.strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);

        });
        $(document).delegate('.optradio', 'click', function () {
            var strStudentAnswer_Id = $(this).attr('id');

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
            if ($("#chkChuaChacChan").is(":checked") == true) {
                strReview = "1";
                $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-success").addClass("btn-orange");
                $('a[id = "' + me.strStudentQuestion_Id + '"]').removeClass("btn-light").addClass("btn-orange");
            }
            else {

                var iIndex = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === me.strStudentQuestion_Id);

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




        $("#btnFinish").click(function (e) {
            edu.system.confirm("Bạn có chắc chắn muốn nộp bài thi?");
            $("#btnYes").click(function (e) {
                me.NopBaiThi();
            });

        });
        $(document).delegate('.button_Audio_chuanghe', 'click', function () {
            $('a[id="' + me.strTTN_FileId_DaNghe + '"]').removeClass("button_Audio_danghe").addClass("button_Audio_chuanghe");
            var id = $(this).attr('id');
            $('a[id="' + id + '"]').removeClass("button_Audio_chuanghe").addClass("button_Audio_danghe");
            me.strTTN_FileId_DaNghe = id;

            me.genAudioPlay(id);
        });
        $(document).delegate('.button_Audio_danghe', 'click', function () {
            $('a[id="' + me.strTTN_FileId_DaNghe + '"]').removeClass("button_Audio_danghe").addClass("button_Audio_chuanghe");
            var id = $(this).attr('id');
            $('a[id="' + id + '"]').removeClass("button_Audio_danghe").addClass("button_Audio_chuanghe");
            me.strTTN_FileId_DaNghe = id;


            me.genAudioPlay(id);
        });
        $("#btnLuuBaiThiTuLuan").click(function (e) {
            var dtCauHoi_Thuoc_ExamStructPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");
            var editor_ThiSinhTraLoi_Id = "";
            var strStudentQuestionLuu_Id = "";
            var strStudentQuestionLuu_LoaiCau = "";
            var strStudentAnswer_Id = "";
            var strCorrect = "";
            var strReview = "";
            var strDaTraLoi = "";
            var strContent2 = "";
            var strAnswer_Second_Id = "";
            for (var i = 0; i < dtCauHoi_Thuoc_ExamStructPart.length; i++) {
                var dataTraLoi = edu.util.objGetDataInData(dtCauHoi_Thuoc_ExamStructPart[i].STUDENTQUESTIONID, me.dtAnswer, "STUDENTQUESTIONID");
                strStudentQuestionLuu_Id = dtCauHoi_Thuoc_ExamStructPart[i].STUDENTQUESTIONID;
                strStudentQuestionLuu_LoaiCau = dtCauHoi_Thuoc_ExamStructPart[i].QUESTIONTYPECODE;
                for (var j = 0; j < dataTraLoi.length; j++) {

                    editor_ThiSinhTraLoi_Id = "editor_ThiSinhTraLoi" + dataTraLoi[j].STUDENTANSWERID;

                    strStudentAnswer_Id = dataTraLoi[j].STUDENTANSWERID;
                    strReview = "0";
                    strDaTraLoi = "1";
                    strCorrect = "1";
                    strContent2 = CKEDITOR.instances[editor_ThiSinhTraLoi_Id].getData();
                    me.saveDapAn_TuLuan(strStudentQuestionLuu_Id, strStudentQuestionLuu_LoaiCau, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
                }
            }

        });

        $("#tblStudentFiles").delegate(".btnDelete_StudentFiles", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa liệu không?");
            $("#btnYes").click(function (e) {
                me.Xoa_StudentFiles(strId);
            });
        });



        //$(document).delegate('#recorder', 'click', function () {
        //    console.log(111111111)
        //    if (document.getElementById("recorder").classList.contains("recording")) {
        //        console.log(222222222)
        //        document.getElementById("recorder").classList.remove("recording");
        //        document.getElementById("recorder").classList.add("download");
        //        record = false;
        //        setTimeout(function () {
        //            document.getElementById("recorder").classList.remove("download");
        //            document.getElementById("recorder").classList.add("out");
        //        }, 1000);

        //    } else if (

        //        !document.getElementById("recorder").classList.contains("recording") &&
        //        !document.getElementById("recorder").classList.contains("download")
        //    ) {
        //    console.log(4444444)
        //        document.getElementById("recorder").classList.remove("out");
        //        document.getElementById("recorder").classList.add("recording");
        //        record = true;
        //        startRecording();
        //        console.log(5555)
        //    }
        //});
        document.getElementById("recorder").addEventListener("click", (e) => {

            if (document.getElementById("recorder").classList.contains("recording")) {

                document.getElementById("recorder").classList.remove("recording");
                document.getElementById("recorder").classList.add("download");
                record = false;
                setTimeout(function () {
                    document.getElementById("recorder").classList.remove("download");
                    document.getElementById("recorder").classList.add("out");
                }, 1000);
            } else if (
                !document.getElementById("recorder").classList.contains("recording") &&
                !document.getElementById("recorder").classList.contains("download")
            ) {

                document.getElementById("recorder").classList.remove("out");
                document.getElementById("recorder").classList.add("recording");
                record = true;
                startRecording();
                $("#guideRecoder").text("Nhấn vào đây để kết thúc ghi âm");
            }
        });
        const recordAudio = () =>
            new Promise(async (resolve) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks = [];
                    mediaRecorder.addEventListener("dataavailable", (event) => {
                        audioChunks.push(event.data);
                    });

                    const start = () => mediaRecorder.start();

                    const stop = () =>
                        new Promise((resolve) => {
                            mediaRecorder.addEventListener("stop", () => {
                                const audioBlob = new Blob(audioChunks);
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                const play = () => audio.play();
                                resolve({ audioBlob, audioUrl, play });
                            });
                            mediaRecorder.stop();
                        });
                    resolve({ start, stop });
                } catch{
                    edu.system.alert("Bạn vui lòng kiểm tra lại micro");
                }
            });

        const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

        var record = true;

        const startRecording = async () => {

            const recording = await recordAudio();
            const recorder = document.getElementById("recorder");
            recorder.disabled = true;
            recording.start();
            while (record == true) {
                await sleep(1);
            }
            const audio = await recording.stop();
            await sleep(2000);

            // console.log(audio.src)

            me.uploadFilesRecoder(audio, me.strStudentQuestion_Id);


            // audio.play();
            recorder.disabled = false;
        };

        edu.system.uploadFiles(["txt_File_Student"], "THITRACNGHIEM", function () {
            edu.system.saveFiles("txt_File_Student", me.strStudentExamRoomPartId, "TTN_StudentFiles");
            setTimeout(function () {
                me.getList_StudentFiles();
            }, 1000);
        });
    },
    button_CauHoiClick: function (strStudentQuestion_Id_Cu, strQuestionTypeCode_Cu) {
        var me = this;

        //#region Câu hỏi cũ
        //Cập nhật thời gian kết thúc câu hỏi cũ nếu câu có tính thời gian
        var dtCauHoi_1 = edu.util.objGetDataInData(strStudentQuestion_Id_Cu, me.dtQuestion, "STUDENTQUESTIONID");
        if (dtCauHoi_1.length > 0) {
            if (dtCauHoi_1[0].THOIGIAN != null)
                me.UpdateCurrentTimeCauHoi(strStudentQuestion_Id_Cu);
        }
        if (strStudentQuestion_Id_Cu != null)
            $("#zoneContentQuestion" + strStudentQuestion_Id_Cu).hide();
        // lưu câu hỏi điền khuyết trước khi chuyển sang câu hỏi khác
        me.save(strStudentQuestion_Id_Cu, strQuestionTypeCode_Cu);
        //#endregion 

        $("#zoneContentQuestion").show();

        var dtCauHoi = edu.util.objGetDataInData(me.strStudentQuestion_Id, me.dtQuestion, "STUDENTQUESTIONID");
        // Hiển thị nội dung câu hỏi nhóm 
        $("#zoneTable_NoiDungCauHoiNhomPart").html("");

        if (edu.util.returnEmpty(dtCauHoi[0].NOIDUNGNHOMCAUHOI).trim() !== "") {
            $("#zoneTable_NoiDungCauHoiNhomPart").html(dtCauHoi[0].NOIDUNGNHOMCAUHOI);
            $("#zoneTable_NoiDungNhomCauHoi").removeClass(me.csszoneTable_NoiDungNhomCauHoi);
            $("#zoneTable_NoiDungNhomCauHoi").addClass(me.csszoneTable_NoiDungNhomCauHoi);
            $("#zoneTable_NoiDungNhomCauHoi").show();
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").removeClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_100);
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").removeClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_50);
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").addClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_50);
        }
        else {

            $("#zoneTable_NoiDungNhomCauHoi").removeClass(me.csszoneTable_NoiDungNhomCauHoi);
            $("#zoneTable_NoiDungNhomCauHoi").hide();
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").removeClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_100);
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").removeClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_50);
            $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").addClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_100);
        }
        //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'zoneTable_NoiDungCauHoiNhomPart']);
        MathJax.typesetPromise([document.getElementById('zoneTable_NoiDungCauHoiNhomPart')]);
        MathJax.typesetPromise([document.getElementById('zoneTable_NoiDungCauHoiVaDapAn')]);


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
        var zoneContentQuestion = "zoneContentQuestion" + $(this).attr('id');
        //$('.bix-div-container').css('display', 'none');
        document.getElementById("lblThongBao").style.display = "none";
        $("#zoneContentQuestion" + me.strStudentQuestion_Id).show();
        me.hienCauTraLoi(me.strStudentQuestion_Id);
         
        me.genTableQuestionAudio(me.strStudentQuestion_Id);
        
    },

    button_ExamStructPartClick: function (strExamStructPartId_Cu) {
        // Khi tất cả các ExamStructPartClick đều gọi button_ExamStructPartClick
        var me = this;
        $("#" + strExamStructPartId_Cu).removeClass("button_ExamStructPart_danglam");
        $("#" + strExamStructPartId_Cu).removeClass("button_ExamStructPart_chualam");
        $("#" + strExamStructPartId_Cu).addClass("button_ExamStructPart_dalam");
        $("#" + me.strExamStructPartId).removeClass("button_ExamStructPart_dalam");
        $("#" + me.strExamStructPartId).addClass("button_ExamStructPart_danglam");
        $("#zoneTable_NoiDungNhomCauHoi").removeClass(me.csszoneTable_NoiDungNhomCauHoi);
        $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").removeClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_50);
        $("#zoneChonCauHoi_NoiDungCauHoiVaDapAn").addClass(me.csszoneChonCauHoi_NoiDungCauHoiVaDapAn_100);
        document.getElementById("lblThongBao").style.display = '';

        me.genAnHien_ExamStructPart(strExamStructPartId_Cu);
        me.genAnHien_zoneTable_Chon_DanhSachCauHoi();

        if (me.dtExamStructPartAll.length > 1) {
            var dataExamStructPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, 'EXAMSTRUCTPARTID');
            // Nếu chọn mức con hoặc mức đang chọn thì không gọi tính thời gian
            if (dataExamStructPart[0].LEVEL_EXAMSTRUCTPART > 1 || me.strExamStructPartId_Muc1 == me.strExamStructPartId_Muc1_Cu)
                return;
            if (me.strTinhTheoTongThoiGian != "1") {
                me.GetTolTalTime();
            }
            me.strKieuLamBaiThi = dataExamStructPart[0].KIEULAMBAITHI;
            if (dataExamStructPart[0].KIEULAMBAITHI == "THITULUAN")
                $("#zoneUpload").show();
            else
                $("#zoneUpload").hide();
            if (me.strKieuLamBaiThi == "THITULUANVANBAN")
                $('#btnLuuBaiThiTuLuan').removeClass("AnCSS");
            else
                $('#btnLuuBaiThiTuLuan').addClass("AnCSS");
        }



    },
    genAnHien_ExamStructPart: function (strExamStructPartId_Cu) {
        var me = this;
        $("#zoneTable_NoiDungCauHoiNhomPart").html("");
        me.genAudioPlay('');
        /*Bước 1: ẩn tất cả, Hiển thị tới mức đang chọn 
         * Bước 2: Đệ quy hiển thị mức cha
         * Bước 3: Hiển thị mức hiện tại
         * Bước 4: Hiển thị mức con
         * Bước 5: Cập nhật kết thúc phần thi cũ nếu trường hợp tính giờ cho từng phần        
         */

        var data = edu.util.objGetDataInData(edu.util.returnEmpty(me.strExamStructPartId), me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        if (data[0].LEVEL_EXAMSTRUCTPART == 1) {
            me.strExamStructPartId_Muc1_Cu = me.strExamStructPartId_Muc1;
            me.strExamStructPartId_Muc1 = me.strExamStructPartId;
        }
        me.strStudentExamRoomPartId = data[0].STUDENTEXAMROOM_PARTID;
        var data_Cu = edu.util.objGetDataInData(edu.util.returnEmpty(strExamStructPartId_Cu), me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        var strStudentExamRoomPartId_Cu = '';

        if (data_Cu.length > 0)
            strStudentExamRoomPartId_Cu = data_Cu[0].STUDENTEXAMROOM_PARTID;

        //B1: ẩn tất cả       
        for (var i = 0; i < me.dtExamStructPartAll.length; i++) {
            if (me.dtExamStructPartAll[i].LEVEL_EXAMSTRUCTPART > 1) {
                $("#zoneEXAMSTRUCTPARTID" + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).removeClass("AnCSS");
                $("#zoneEXAMSTRUCTPARTID" + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).addClass("AnCSS");
            }

        }

        var data_Chon_Temp = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        if (data_Chon_Temp.length > 0) {
            //lấy data_Chon là dữ liệu mức hiện tại dựa vào cùng EXAMSTRUCTPARTPARENTID            
            var data_Chon = edu.util.objGetDataInData(data_Chon_Temp[0].EXAMSTRUCTPARTPARENTID, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
            if (data_Chon.length > 0) {
                //Bước 2: Đệ quy hiển thị mức cha
                me.TimVaHienThiMucCha(data_Chon_Temp[0].EXAMSTRUCTPARTPARENTID);
                //Bước 3: Hiển thị mức hiện tại
                for (var i = 0; i < data_Chon.length; i++)
                    $("#zoneEXAMSTRUCTPARTID" + data_Chon[i].EXAMSTRUCTPARTID).removeClass("AnCSS");
            }
        }
        var data_Child = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
        //Bước 4: Hiển thị mức con
        if (data_Child.length > 0)
            for (var i = 0; i < data_Child.length; i++) {// Hiển thị mức con
                $("#zoneEXAMSTRUCTPARTID" + data_Child[i].EXAMSTRUCTPARTID).removeClass("AnCSS");
            }
        var dtHuongDan_1 = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");

        $("#zoneTable_HuongDanLamBai_Part").html("");
        if (edu.util.returnEmpty(dtHuongDan_1[0].GUIDE) != '')
            $("#zoneTable_HuongDanLamBai_Part").html(dtHuongDan_1[0].GUIDE);

        // Bước 5: Cập nhật kết thúc phần thi cũ nếu trường hợp tính giờ cho từng phần
        if (me.strTinhTheoTongThoiGian != "1" && data[0].LEVEL_EXAMSTRUCTPART == 1)
            me.CapNhat_FinishPart(me.strExamStructPartId_Muc1_Cu);


    },
    TimVaHienThiMucCha: function (strExamStructPart_Id) {
        var me = this;
        // lấy ra mức hiện tại
        var data = edu.util.objGetDataInData(strExamStructPart_Id, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        if (data.length > 0) {
            var data_Child = edu.util.objGetDataInData(data[0].EXAMSTRUCTPARTPARENTID, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
            // data_Child chứa dữ liệu có cùng mức EXAMSTRUCTPARTPARENTID
            for (var i = 0; i < data_Child.length; i++) {
                var aa = data[0].TITLE;
                $("#zoneEXAMSTRUCTPARTID" + data_Child[i].EXAMSTRUCTPARTID).removeClass("AnCSS");
            }
            // kiểm tra xem data_Child còn mức cha nữa không
            if (data_Child.length > 0)
                me.TimVaHienThiMucCha(data_Child[0].EXAMSTRUCTPARTPARENTID);
        }
        else {
            //$("#zoneEXAMSTRUCTPARTID" + strExamStructPart_Id).removeClass("AnCSS");
            // me.strExamStructGocId = strExamStructPart_Id;
            return;
        }
    },

    genAnHien_zoneTable_Chon_DanhSachCauHoi: function () {
        /*
         * Ẩn toàn bộ phần chọn câu hỏi, sau đó hiển thị phần câu hỏi đang chọn
         * 
         * */
        var me = this;
        for (var i = 0; i < me.dtExamStructPartAll.length; i++) {
            $('#zoneChon_DanhSachCauHoiPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).removeClass('AnCSS');
            $('#zoneChon_DanhSachCauHoiPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).addClass('AnCSS');

            $('#zoneNextPreQuestionPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).removeClass('AnCSS');
            $('#zoneNextPreQuestionPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).addClass('AnCSS');

            $('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).removeClass('AnCSS');
            $('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.dtExamStructPartAll[i].EXAMSTRUCTPARTID).addClass('AnCSS');
        }

        //#region Nếu phần thi không có phần nghe thì hiển thị câu hỏi, đáp án....
        //Nếu có phần nghe thì khi chọn phần nghe mới hiển thị câu hỏi, đáp án
        //
        var dataFileAudio = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
        if (dataFileAudio.length == 0) {
            $('#zoneChon_DanhSachCauHoiPart' + me.strExamStructPartId).removeClass('AnCSS');
            $('#zoneNextPreQuestionPart' + me.strExamStructPartId).removeClass('AnCSS');
            $('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.strExamStructPartId).removeClass('AnCSS');
        }


        //#endregion

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
                    /*
                     * strReturn: 1 Phong thi dang dong
                     * strReturn: 2 Da ket thuc bai thi
                     * strReturn: 3 Het thoi gian lam bai
                     */
                    if (strReturn != "") {
                        var strsite = location.pathname.split('/');

                        var strUrl = location.origin + "/" + strsite[1] + "/danhsachphongthi.aspx";
                        window.open(strUrl, "_parent");
                    }
                    else {
                        me.LayDS_ThongTinBaiThiThiSinh();
                    }
                }
                else {
                    window.open(me.strUrlKetQuaThi, "_parent");
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
                        $("#lblHoTen").html(dt[0].FULLNAME.toUpperCase());
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
    CapNhat_FinishPart: function (strExamStructPartId) {
        var me = this;

        var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === strExamStructPartId);
        //Nếu đã update kết thúc dtExamStructPartAll thì không update dtExamStructPartAll nữa
        if (index < 0 || me.dtExamStructPartAll[index].FINISHED == "1")
            return;

        if (me.strExamStructPartId_Muc1 == me.strExamStructPartId_Muc1_Cu)
            return;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhat_FinishPart',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id,
            'strExamStructPartId': strExamStructPartId,
            'strExamStructId': me.strExamStructId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === strExamStructPartId);
                    //Sau khi update DB thì update tiếp kết thúc trong dtExamStructPartAll
                    if (index >= 0) {
                        me.dtExamStructPartAll[index].FINISHED = "1";
                    }

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {

                window.open(me.strUrlKetQuaThi, "_parent");
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
    KiemTraDaLamHetCacPhanThi: function () {
        var me = this;

        if (me.strTinhTheoTongThoiGian == '1')
            return;
        var dtKT1 = edu.util.objGetDataInData(null, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
        var dtKT2 = edu.util.objGetDataInData("1", dtKT1, "FINISHED");

        if (dtKT1.length == dtKT2.length) {

            alert('Đã kết thúc tất cả các phần');
            window.open(me.strUrlKetQuaThi, "_parent");
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
                    $("#lblTongSoCau").html(me.dtQuestion.length);
                    me.dtAnswer = data.Data.rsAnswer;
                    me.dtAnswer_Sencond = data.Data.rsAnswerSecond;

                    me.dtExamStructPartAll = data.Data.rsExamStructPart;
                    me.strTinhTheoTongThoiGian = '';
                    me.strExamStructId = me.dtExamStructPartAll[0]["EXAMSTRUCTID"];

                    if (edu.util.returnEmpty(me.dtExamStructPartAll[0]["TONGTHOIGIANEXAMSTRUCT"]) != '')
                        me.strTinhTheoTongThoiGian = '1';


                    me.dtExamStructPartAudioFiles = data.Data.rsExamStructPartAudioFiles;
                    me.dtExamQuestionAudioFiles = data.Data.rsExamQuestionAudioFiles;
                    me.KiemTraDaLamHetCacPhanThi();

                    // Gen thong tin ExamStructPart
                    me.gen_zoneTable_ExamStructPart();
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

    gen_zoneTable_ExamStructPart: function () {
        var me = this;
        //#region gen table Part
        $("#zoneTable_ExamStructPart").html("");
        var objren = {
            data: me.dtExamStructPartAll,
            renderInfor: {
                id: "EXAMSTRUCTPARTID",
                parentId: "EXAMSTRUCTPARTPARENTID",
                name: "TITLE",
                level: "LEVEL_EXAMSTRUCTPART",
                code: "TITLE",

            },
            renderPlaces: ["zoneTable_ExamStructPart"],
            style: "fa fa-user color-active"
        };
        // gen động phần thi vào đối tượng obj.renderPlaces
        me.loadGridTables(objren);
        $("#zoneTable_ExamStructPart").html("");
        me.DoSau = 1;
        for (var i = 0; i < objren.data.length; i++) {
            //console.log('Level: ' + objren.data[i].LEVEL_EXAMSTRUCTPART + " Noi dung:" + objren.data[i].TITLE);
            if (me.DoSau < objren.data[i].LEVEL_EXAMSTRUCTPART)
                me.DoSau = objren.data[i].LEVEL_EXAMSTRUCTPART;
        }
        var strzoneTable_ExamStructPart = "";
        var maunen = "button_ExamStructPart_chualam";
        var cssAnCSS = "";
        var iLevel = 1;
        for (var i = 1; i <= me.DoSau; i++) {
            if (i > 1)
                cssAnCSS = "AnCSS";
            var dataExamStructPart = edu.util.objGetDataInData(i, objren.data, "LEVEL_EXAMSTRUCTPART");
            if (dataExamStructPart[0].LEVEL_EXAMSTRUCTPART == 1)
                iLevel = 1;
            else// Gen giao diện các mức >1  cho nhỏ hơn
                iLevel = 2;
            strzoneTable_ExamStructPart += "<div class='tab-h LEVEL" + iLevel + "'> <div class='tab-h-l tab-i'>";
            for (var j = 0; j < dataExamStructPart.length; j++) {
                strzoneTable_ExamStructPart += "<div id='zoneEXAMSTRUCTPARTID" + dataExamStructPart[j].EXAMSTRUCTPARTID + "' class='" + cssAnCSS + "'>";
                strzoneTable_ExamStructPart += "<a class='" + maunen + "' id='" + dataExamStructPart[j].EXAMSTRUCTPARTID + "' href = 'javascript:void(0);' title = '' >" + dataExamStructPart[j].TITLE + "</a >";
                strzoneTable_ExamStructPart += "</div>";
            }

            strzoneTable_ExamStructPart += "</div> </div>";
        }
        $("#zoneTable_ExamStructPart").html(strzoneTable_ExamStructPart);
        if (objren.data.length == 1)// Nếu có 1 phần thì ẩn phần chọn Phần thi
            $("#zoneTable_ExamStructPart").html("");


    },
    genTableCauHoi: function () {
        var me = this;
        $("#zoneTable_Chon_DanhSachCauHoi").html("");
        $("#zoneTable_NextPreQuestion").html("");
        $("#zoneRecoder").addClass("AnCSS");
        $("#zonePlayRecoder").addClass("AnCSS");

        var strNoiDungCauHoi = "";
        var strTable_Chon_DanhSachCauHoi = "";
        var strNextPreQuestion = "";
        var strTable_NoiDungCauHoiVaDapAnPart = "";
        //@ chưa thêm phần hiển thị dạng câu theo Cấu trúc đề
        var strKieuHienThiCauHoi = "";
        for (var iPart = 0; iPart < me.dtExamStructPartAll.length; iPart++) {
            /**
             * B1: Gen zone zoneTable_Chon_DanhSachCauHoi và prenext Questioin bên trái
             * B2: Gen zone zoneTable_NoiDungCauHoiVaDapAn nội dung câu hỏi và đáp án
             * */
            //#region B1: Gen zone zoneTable_Chon_DanhSachCauHoi bên trái
            var dtCauHoi_Thuoc_ExamStructPart = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtQuestion, "EXAMSTRUCTPARTID");
            strTable_Chon_DanhSachCauHoi += "<div class='testing-l AnCSS' id='zoneChon_DanhSachCauHoiPart" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "' >";
            strNextPreQuestion += "<div class='zoneNextPreQuestionPart btn-g  d-flex justify-content-center my-4 AnCSS' id='zoneNextPreQuestionPart" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "'>";
            var dataFileAudio = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");

            strKieuHienThiCauHoi = "style = 'display:none'";
            if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "HIENTHITOANBOCAUHOI")
                strKieuHienThiCauHoi = "";

            for (var i = 0; i < dtCauHoi_Thuoc_ExamStructPart.length; i++) {
                var maunen = "button_xem";
                if (dtCauHoi_Thuoc_ExamStructPart[i].ANSWERED == "0")
                    maunen = "button_xem btn-light border-99 ";
                if (dtCauHoi_Thuoc_ExamStructPart[i].ANSWERED == "1")
                    maunen = "button_traloi btn-success border-white ";
                if (dtCauHoi_Thuoc_ExamStructPart[i].REVIEW == "1")
                    maunen = "button_review btn-orange border-white ";

                var cauhoi = "";

                if (dtCauHoi_Thuoc_ExamStructPart[i].SOTAPHOPCACCAUHOI < 2) {
                    if (i < 9) {
                        cauhoi = "<b>Câu 0" + (i + 1) + "</b>";
                    }
                    else {
                        cauhoi = "<b>Câu " + (i + 1) + "</b>";
                    }
                }
                else {
                    if (edu.util.returnEmpty(dtCauHoi_Thuoc_ExamStructPart[i].ORDERS) != '') {
                        if (dtCauHoi_Thuoc_ExamStructPart[i].ORDERS < 9) {
                            cauhoi = "<b>Câu 0" + (dtCauHoi_Thuoc_ExamStructPart[i].ORDERS) + "</b>";
                        }
                        else {
                            cauhoi = "<b>Câu " + (dtCauHoi_Thuoc_ExamStructPart[i].ORDERS) + "</b>";
                        }
                    }
                    else
                        cauhoi = "<b>Câu " + (i + 1) + "</b>";
                }
                strTable_Chon_DanhSachCauHoi += "<a class='" + maunen + " question-i btn btn-sm' id='" + dtCauHoi_Thuoc_ExamStructPart[i].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = '' >" + cauhoi + "</a >";
                strNextPreQuestion += "<a class='" + maunen + " question-i btn btn-sm' id='" + dtCauHoi_Thuoc_ExamStructPart[i].STUDENTQUESTIONID + "' href = 'javascript:void(0);' title = '' style='display:none;'>" + cauhoi + "</a >";

            }
            strTable_Chon_DanhSachCauHoi += "</div>";
            strTable_Chon_DanhSachCauHoi += "<div class='clear'></div>";
            strNextPreQuestion += "</div>";
            strNextPreQuestion += "<div class='clear'></div>";
            //#endregion            //#region B2: Gen zone zoneTable_NoiDungCauHoiVaDapAn nội dung câu hỏi và đáp án mỗi phần thi            var dataQuestionPart = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtQuestion, "EXAMSTRUCTPARTID");            strTable_NoiDungCauHoiVaDapAnPart += "<div class='bix-div-container AnCSS' id='zoneTable_NoiDungCauHoiVaDapAnPart" + me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID + "'  >";
            for (i = 0; i < dataQuestionPart.length; i++) {

                var ChiTietCauHoi = "";
                if (dataQuestionPart[i].SOTAPHOPCACCAUHOI < 2) {
                    if (i < 9) {
                        ChiTietCauHoi = "<b>Câu 0" + (i + 1) + "</b>";
                    }
                    else {
                        ChiTietCauHoi = "<b>Câu " + (i + 1) + "</b>";
                    }
                }
                else {
                    if (edu.util.returnEmpty(dataQuestionPart[i].ORDERS) != '') {
                        if (dataQuestionPart[i].ORDERS < 9) {
                            ChiTietCauHoi = "<b>Câu 0" + (dataQuestionPart[i].ORDERS) + "</b>";
                        }
                        else {
                            ChiTietCauHoi = "<b>Câu " + (dataQuestionPart[i].ORDERS) + "</b>";
                        }
                    }
                    else
                        ChiTietCauHoi = "<b>Câu " + (i + 1) + "</b>";
                }
                // ChiTietCauHoi += " question " + dataQuestionPart[i].ORDERS + " So Tap hop: " + dataQuestionPart[i].SOTAPHOPCACCAUHOI;
                var dataTraLoi = edu.util.objGetDataInData(dataQuestionPart[i].STUDENTQUESTIONID, me.dtAnswer, "STUDENTQUESTIONID");

                var strHienThiCauTraLoi = "<label class='lbcauhoi' style='font-size: 16pt; color:#0066FF'><b>Câu trả lời:</b></label>";
                var strHienThiDiem = "";
                //if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUAN" || me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUANVANBAN") {
                //    strHienThiCauTraLoi = "";
                    strHienThiDiem = "(" + dataQuestionPart[i].PLUSMARK + " điểm)";
                //}

                strTable_NoiDungCauHoiVaDapAnPart +=
                    "<div class='bix-div-container' id='zoneContentQuestion" + dataQuestionPart[i].STUDENTQUESTIONID + "' " + strKieuHienThiCauHoi + "  >"
                    + "<label class='lbcauhoi' id='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'font-size: 16pt; color:Red' > <u><b>" + ChiTietCauHoi + ": </b></u></label >"
                    + "<span style='font-size: 16pt; color:Blue;'>" + dataQuestionPart[i].GUIDE + strHienThiDiem + "</span>"
                    + "<input type ='text'   id='QUESTIONTYPECODE" + dataQuestionPart[i].STUDENTQUESTIONID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                    + "<div class='clearQuestion'></div>"
                    + "<label class='lbcauhoi'><span style='font-size: 18pt; margin-top:10px'>" + dataQuestionPart[i].CONTENT + "</span></label>"
                    + "<div class='clearQuestion'></div>"
                    + "<div class='clearQuestion' style='margin-bottom:0px'></div>"
                    + strHienThiCauTraLoi
                    + "<div class='clearQuestion' style='margin-bottom:5px'></div>";

                //#region Dap An
                if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI != "THITULUAN" && me.dtExamStructPartAll[iPart].KIEULAMBAITHI != "THITULUANVANBAN") {
                    for (var j = 0; j < dataTraLoi.length; j++) {
                        var ischecked = "";
                        if (dataTraLoi[j].STUDENTCORRECT == "1") {
                            ischecked = "checked";
                        }
                        else {
                            ischecked = "";
                        }
                        if (dataQuestionPart[i].QUESTIONTYPECODE == "BESTANSWER" || dataQuestionPart[i].QUESTIONTYPECODE == "TRUEFALSEONE") {

                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='radio'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + "<input type='radio' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + " class='optradio' name='optradio" + dataQuestionPart[i].STUDENTQUESTIONID
                                + "' value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' " + ischecked + " /> "
                                + dataTraLoi[j].ORDERABC + edu.util.returnEmpty(dataTraLoi[j].CONTENT) 
                                + "</label>"
                                + "</div >"
                                + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                        }
                        if (dataQuestionPart[i].QUESTIONTYPECODE == "MULTICHOICE") {

                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='checkbox'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + "<input type='checkbox' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + "class='optcheckbox' name='optcheckbox" + dataQuestionPart[i].STUDENTQUESTIONID
                                + "' value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' " + ischecked + " /> "
                                + dataTraLoi[j].ORDERABC + edu.util.returnEmpty(dataTraLoi[j].CONTENT)
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

                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='radio'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' id='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + dataTraLoi[j].ORDERABC + edu.util.returnEmpty(dataTraLoi[j].CONTENT)
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
                            optValues += '<option id="' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="2" ' + strSelectTrueFalse + ' >Chọn</option>';
                            optValues += '<option id="' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="1" ' + strSelectTrue + ' >Đúng</option>';
                            optValues += '<option id="' + dataTraLoi[j].STUDENTANSWERID + '" name="' + dataTraLoi[j].STUDENTQUESTIONID + '"  value="0" ' + strSelectFalse + '>Sai</option>';
                            optValues += "</select>";


                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='radio'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' id='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + dataTraLoi[j].ORDERABC + optValues + edu.util.returnEmpty(dataTraLoi[j].CONTENT)
                                + "</label>"
                                + "</div >"
                                + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                        }
                        if (dataQuestionPart[i].QUESTIONTYPECODE == "FILLTHEBLANK") {

                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='textbox'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + dataTraLoi[j].ORDERABC + edu.util.returnEmpty(dataTraLoi[j].CONTENT)
                                + "<input type='textbox' id='" + dataTraLoi[j].STUDENTANSWERID + "' " + "class='opttextbox' name='opttextbox" + dataQuestionPart[i].STUDENTQUESTIONID
                                + "' value='" + edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2) + "' /> "
                                + "</label>"
                                + "</div >"
                                + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                        }
                        if (dataQuestionPart[i].QUESTIONTYPECODE == "KEOTHAXUONGDAPAN") {

                            var strNoiDungDapAN = edu.util.returnEmpty(dataTraLoi[j].CONTENT); 
                            if (dataTraLoi[j].STUDENTANSWERCONTENT2 != '' && dataTraLoi[j].STUDENTANSWERCONTENT2 != ' ') {
                                var strTuThayThe = "<div class='drop-zone filled ui-droppable'>" +
                                    "    <span class='word-in-answer ui-draggable ui-draggable-handle' data-value='" + dataTraLoi[j].STUDENTANSWERCONTENT2 + "'>" + dataTraLoi[j].STUDENTANSWERCONTENT2 + "</span>" +
                                    "</div>";

                                strNoiDungDapAN = strNoiDungDapAN.replace(
                                    "<div class='drop-zone'>Kéo từ câu hỏi vào đây</div>",
                                    strTuThayThe
                                );
                            }
                            
                            strTable_NoiDungCauHoiVaDapAnPart += "<div class='textbox'>"
                                + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "'  class='QUESTIONTYPECODE_GIATRI' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' class='STUDENTQUESTIONID_GIATRI' style = 'display:none' >"
                                + "<input type ='text'   id='STUDENTANSWERID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataTraLoi[j].STUDENTANSWERID + "'  class='STUDENTANSWERID_GIATRI' style = 'display:none' >"
                                + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                                + dataTraLoi[j].ORDERABC + strNoiDungDapAN
                                + "</label>"
                                + "</div >"
                                + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                        }
                        if (dataQuestionPart[i].QUESTIONTYPECODE == "TAOCAUHOANCHINH") {
                            var strNoiDungDapAN =
                                '<div class="multi-drop-zone" data-answer-id="' + dataTraLoi[j].STUDENTANSWERID + '">' +
                                '   <div class="drop-container">' +
                                '       <span class="placeholder">Kéo các từ ở trên vào đây</span>' +
                                '   </div>' +
                                '</div>';

                            strTable_NoiDungCauHoiVaDapAnPart +=
                                "<div class='textbox'>" +
                                "   <input type='text' id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "' value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' class='QUESTIONTYPECODE_GIATRI' style='display:none'>" +
                                "   <input type='text' id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "' value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' class='STUDENTQUESTIONID_GIATRI' style='display:none'>" +
                                "   <input type='text' id='STUDENTANSWERID" + dataTraLoi[j].STUDENTANSWERID + "' value='" + dataTraLoi[j].STUDENTANSWERID + "' class='STUDENTANSWERID_GIATRI' style='display:none'>" +
                                "   <label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan'>" +
                                "       " + dataTraLoi[j].ORDERABC +
                                "   </label> " + strNoiDungDapAN +
                                "</div>" +
                                "<div class='clearQuestion' style='margin-bottom: 10px'></div>";
                        }

                    }
                }

                if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUANVANBAN") {
                    for (var j = 0; j < dataTraLoi.length; j++) {

                        strTable_NoiDungCauHoiVaDapAnPart += "<div class='textbox'>"
                            + "<input type ='text'   id='QUESTIONTYPECODE" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].QUESTIONTYPECODE + "' style = 'display:none' >"
                            + "<input type ='text'   id='STUDENTQUESTIONID" + dataTraLoi[j].STUDENTANSWERID + "'  value='" + dataQuestionPart[i].STUDENTQUESTIONID + "' style = 'display:none' >"
                            + "<label for='" + dataTraLoi[j].STUDENTANSWERID + "' class='lbdapan' onmouseover=''>"
                            + "<textarea name='editor_ThiSinhTraLoi" + dataTraLoi[j].STUDENTANSWERID + "' id = 'editor_ThiSinhTraLoi" + dataTraLoi[j].STUDENTANSWERID + "' >" + edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2) + "</textarea>"
                            + "</label>"
                            + "</div>"
                            + "<div class='clearQuestion' style='margin-bottom: 10px'></div>";

                    }
                }


                //#endregioin Dap An
                strTable_NoiDungCauHoiVaDapAnPart += "<hr margin-bottom:3px; margin-top:3px;' />";

                strTable_NoiDungCauHoiVaDapAnPart += "</div>";
            }
            strTable_NoiDungCauHoiVaDapAnPart += "</div>";            //#endregion

        }
        console.log(strTable_NoiDungCauHoiVaDapAnPart)
        $("#zoneTable_NoiDungCauHoiVaDapAn").html(strTable_NoiDungCauHoiVaDapAnPart);
        $("#zoneTable_Chon_DanhSachCauHoi").html(strTable_Chon_DanhSachCauHoi);
        $("#zoneTable_NextPreQuestion").html(strNextPreQuestion);
        $("#zoneUpload").hide();
        me.initDragDrop();
        setTimeout(function () {
            me.updateQuestionWordColors_All();
        }, 200);
        //Nếu chỉ có 1 phần thi
        if (me.dtExamStructPartAll.length == 1) {
            me.strExamStructPartId = me.dtExamStructPartAll[0].EXAMSTRUCTPARTID;
            // thực hiện hiển thị            
            me.button_ExamStructPartClick('');
            $('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.strExamStructPartId).removeClass('AnCSS');
            me.strKieuLamBaiThi = me.dtExamStructPartAll[0].KIEULAMBAITHI;
            if (me.strKieuLamBaiThi == "THITULUANVANBAN")
                $('#btnLuuBaiThiTuLuan').removeClass("AnCSS");
            else
                $('#btnLuuBaiThiTuLuan').addClass("AnCSS");

        }
        for (var iPart = 0; iPart < me.dtExamStructPartAll.length; iPart++) {
            var dtCauHoi_Thuoc_ExamStructPart = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtQuestion, "EXAMSTRUCTPARTID");
            if (me.dtExamStructPartAll[iPart].KIEULAMBAITHI == "THITULUANVANBAN") {
                var dataQuestionPart = edu.util.objGetDataInData(me.dtExamStructPartAll[iPart].EXAMSTRUCTPARTID, me.dtQuestion, "EXAMSTRUCTPARTID");
                for (i = 0; i < dataQuestionPart.length; i++) {
                    var dataTraLoi = edu.util.objGetDataInData(dataQuestionPart[i].STUDENTQUESTIONID, me.dtAnswer, "STUDENTQUESTIONID");
                    for (var j = 0; j < dataTraLoi.length; j++) {

                        CKEDITOR.replace('editor_ThiSinhTraLoi' + dataTraLoi[j].STUDENTANSWERID);
                        if (edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2) != "")
                            CKEDITOR.instances['editor_ThiSinhTraLoi' + dataTraLoi[j].STUDENTANSWERID].setData(edu.util.returnEmpty(dataTraLoi[j].STUDENTANSWERCONTENT2));

                    }
                }

            }
        }

        //Nếu chỉ có 1 phần thi, hoặc tính tổng thời gian thì gọi hàm tính thời gian
        if (me.dtExamStructPartAll.length == 1 || me.strTinhTheoTongThoiGian == "1")
            me.GetTolTalTime();


    },

    UpdateCurrentTimeCauHoi: function (strStudentQuestion_Id) {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/UpdateCurrentTimeCauHoi',
            'versionAPI': 'v1.0',
            'strStudentQuestion_Id': strStudentQuestion_Id
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
            if (me.strKieuLamBaiThi == "THITULUANVANBAN")
                tDapAn = $("#zoneContentQuestion" + strStudentQuestionLuu_Id + " label[class='lbdapan'] textarea");
            // Nếu điền khuyết khác trống --> Đã trả lời
            for (var i = 0; i < tDapAn.length; i++) {
                if (tDapAn[i].value != "")
                    strDaTraLoi = "1";
            }
            var editor_ThiSinhTraLoi_Id = "";
            for (var i = 0; i < tDapAn.length; i++) {
                strStudentAnswer_Id = tDapAn[i].id;
                if (me.strKieuLamBaiThi == "THITULUANVANBAN") {
                    editor_ThiSinhTraLoi_Id = tDapAn[i].id;
                    strStudentAnswer_Id = tDapAn[i].id.replace("editor_ThiSinhTraLoi", "");

                    strContent2 = CKEDITOR.instances[editor_ThiSinhTraLoi_Id].getData();
                }
                else
                    strContent2 = tDapAn[i].value;

                me.saveDapAn(strStudentQuestionLuu_Id, strStudentQuestionLuu_LoaiCau, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);
            }
            if (strDaTraLoi == "1")
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-light").addClass("btn-success");
            else
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-success").addClass("btn-light");
            // Nếu câu hỏi thí sinh đã đánh dấu là chưa chắc chắn --> xem chỉ số câu hỏi để lấy ID sau đó add class
            //var iIndex;
            //for (var i = 0; i < me.dtQuestion.length; i++)
            //    if (me.strStudentQuestion_Id === me.dtQuestion[i].STUDENTQUESTIONID) {
            //        iIndex = i;
            //        break;
            //    }
            var iIndex = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === strStudentQuestionLuu_Id);
            if (me.dtQuestion[iIndex].REVIEW == "1") {
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-success").addClass("btn-orange");
                $('a[id="' + strStudentQuestionLuu_Id + '"]').removeClass("btn-light").addClass("btn-orange");
            }


        }


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
                        var iIndex = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === me.strStudentQuestion_Id);
                        me.dtQuestion[iIndex].REVIEW = strReview;
                    }
                    else {
                        window.open(me.strUrleIndex, "_parent");
                    }
                }
                else {

                    window.open(me.strUrleIndex, "_parent");

                }

            },
            error: function (er) {
                window.open(me.strUrleIndex, "_parent");

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
    saveDapAn_TuLuan: function (strStudentQuestion_Id, strQuestionTypeCode, strStudentAnswer_Id, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id) {
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
                        var iIndex = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === me.strStudentQuestion_Id);
                        me.dtQuestion[iIndex].REVIEW = strReview;
                        edu.system.alert("Cập nhật thành công");
                    }
                    else {
                        window.open(me.strUrleIndex, "_parent");
                    }
                }
                else {

                    window.open(me.strUrleIndex, "_parent");

                }

            },
            error: function (er) {
                window.open(me.strUrleIndex, "_parent");

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
                        //myVar = setInterval("main_doc.lambaithionline.UpdateCurrentTimePart()", 180000);//180 giay

                        //Tự động kiểm tra trạng thái phòng thi
                        //  myVar = setInterval("main_doc.lambaithionline.KT_TTLamBaiPart()", 30000);//30 giay

                        me._timerHandlerCauHoi = setInterval("main_doc.lambaithionline.MyTimerCauHoi(" + me.iThoiGianCuaCauHoi + ")", 1000);

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
    CapNhatKetThucCauHoi: function () {
        var me = this;
        var index = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === me.strStudentQuestion_Id);


        if (index < 0 || me.dtQuestion[index].FINISHED == "1")
            return;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatKetThucCauHoi',
            'versionAPI': 'v1.0',
            'strStudentQuestion_Id': me.strStudentQuestion_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                var index = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === me.strStudentQuestion_Id);
                if (index >= 0)
                    me.dtQuestion[index].FINISHED = "1";


            },
            error: function (er) {
                //var strUrl = "../../../result.aspx?strExamRoomInfo_Id=" + me.strExamRoomInfo_Id + "&strStudentExamRoom_Id=" + me.strStudentExamRoom_Id + "&strThiSinh_Id=" + me.strThiSinh_Id;
                //window.open(strUrl, "_parent");
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
        var dtQuestionPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");
        dtQuestionPart.forEach(e => $("#zoneTable_NextPreQuestion #" + e.STUDENTQUESTIONID).hide());
        $("#zoneTable_NextPreQuestion #" + strId).show();
        $("#zoneTable_NextPreQuestion #" + strId).html($("#zoneTable_Chon_DanhSachCauHoi #" + strId).html());

        var index = dtQuestionPart.findIndex(x => x.STUDENTQUESTIONID === strId);
        $("#chkChuaChacChan").prop("checked", false);
        if (dtQuestionPart[index].REVIEW == "1")
            $("#chkChuaChacChan").prop("checked", true);
        if (index > 0) { $("#zoneTable_NextPreQuestion #" + dtQuestionPart[index - 1].STUDENTQUESTIONID).show(); $("#zoneTable_NextPreQuestion #" + dtQuestionPart[index - 1].STUDENTQUESTIONID).html('<b> <<-- </b>'); };
        if (index < dtQuestionPart.length - 1) { $("#zoneTable_NextPreQuestion #" + dtQuestionPart[index + 1].STUDENTQUESTIONID).show(); $("#zoneTable_NextPreQuestion #" + dtQuestionPart[index + 1].STUDENTQUESTIONID).html('<b> -->> </b>') };
        /*
        for (var i = 0; i < dtQuestionPart.length; i++) {
            if (strId === dtQuestionPart[i].STUDENTQUESTIONID) {
                $("#chkChuaChacChan").prop("checked", false);
                if (dtQuestionPart[i].REVIEW == "1")
                    $("#chkChuaChacChan").prop("checked", true);

                if (i > 0) { $("#zoneNextPreQuestionPart #" + dtQuestionPart[i - 1].STUDENTQUESTIONID).show(); $("#zoneNextPreQuestionPart #" + dtQuestionPart[i - 1].STUDENTQUESTIONID).html('<b> <<-- </b>'); };
                if (i < dtQuestionPart.length - 1) { $("#zoneNextPreQuestionPart #" + dtQuestionPart[i + 1].STUDENTQUESTIONID).show(); $("#zoneNextPreQuestionPart #" + dtQuestionPart[i + 1].STUDENTQUESTIONID).html('<b> -->> </b>') };

                $("#zoneNextPreQuestionPart #" + dtQuestionPart[i].STUDENTQUESTIONID).show();
                $("#zoneNextPreQuestionPart #" + dtQuestionPart[i].STUDENTQUESTIONID).html($("#zoneChon_DanhSachCauHoiPart #" + dtQuestionPart[i].STUDENTQUESTIONID).html());
            }
        }
        */
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

                var iIndex = me.dtQuestion.findIndex(x => x.STUDENTQUESTIONID === strStudentQuestion_Id);
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
    loadGridTables: function (obj) {
        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var render_places = obj.renderPlaces;
        if (render == undefined) render = {
            id: "ID",
            parentId: "CHUCNANGCHA_ID",
            name: "TITLE",
            level: "LEVEL_EXAMSTRUCTPART",
            code: "",
        };
        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;
        var level = render.level;
        var place = "";
        var maunen = "button_ExamStructPart_chualam";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            if (edu.util.checkId(render_places[p])) {// Xác định các zone cần gen
                place = "#" + render_places[p];
                $(place).html("");
            }
            if (data.length > 0) {
                node += userRender(data, null, 0);
            }
            else {
                node += 'Không tìm thấy dữ liệu!';
            }

            $(place).append(node);

        }
        //Thực hiện gen
        function userRender(obj, parentId, ilevel) {
            var row = "";
            for (var i = 0; i < obj.length; i++) {
                // Gen tất cả các khối cùng mức parentId                  
                if (obj[i][parent_id] == parentId) {
                    if (render.Render == undefined) {
                        row += "<a class='" + maunen + "' id='" + obj[i][id] + "' href = 'javascript:void(0);' title = '' >" + obj[i][name] + "</a >";
                    } else {
                        if (render.Render != undefined) {
                            row += render.Render(i, obj[i]);
                        }
                    }
                    obj[i][level] = ilevel + 1;
                    row += obj[i][level] + userRender(obj, obj[i][id], obj[i][level]);
                }

            }
            return row;
        }


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
    GetTolTalTime: function () {
        var me = this;
        me.strRandomTimerLCD = me.randomString(5, "");
        $("#idTimerSpan").html('<b style="font-size: 22pt; color:red" id="idTimerLCD' + me.strRandomTimerLCD + '"></b>');

        var obj_list = {
            'action': 'TTN_ThiSinh/GetTolTalTimePart',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamStructPartId': me.strExamStructPartId,
            'strStudentExamRoom_Id': me.strStudentExamRoom_Id
        };

        if (me.strTinhTheoTongThoiGian == "1")
            obj_list = {
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
                    var myVar;
                    clearInterval(me._timerHandler);
                    if (me.strTinhTheoTongThoiGian == "1") {    // Tính theo tổng thời gian  
                        if (strFinished == "1")
                            window.open(me.strUrlKetQuaThi, "_parent");
                        else if (parseFloat(me.strTolTalTimeStudent) <= 0) {
                            me.CapNhatKetThucBaiThi();
                        }
                        else {
                            me.totaltime = me.strTolTalTimeStudent * 60;

                            //Tự động cập nhật thời gian hiện tại
                            myVar = setInterval("main_doc.lambaithionline.UpdateCurrentTime()", 180000);//180 giay
                            //Tự động kiểm tra trạng thái phòng thi
                            myVar = setInterval("main_doc.lambaithionline.KT_TTLamBai()", 30000);//30 giay
                            me._timerHandler = setInterval("main_doc.lambaithionline.MyTimer(" + me.totaltime + ")", 1000);
                        }
                    }
                    else {// Tính thời gian theo từng phần

                        if (parseFloat(me.strTolTalTimeStudent) <= 0) {
                            me.CapNhat_FinishPart(me.strExamStructPartId_Muc1);
                            // Nếu hết thời gian, người dùng F5 cũng không hiển thị ra thông tin gì
                            me.gen_KhiHetThoiGian();
                            edu.system.alert('Bạn đã làm xong phần thi này');
                        }
                        else if (strFinished == "1") {
                            me.gen_KhiHetThoiGian();
                            $('#btnFinish').css({ 'pointer-events': 'none' });
                            edu.system.alert('Bạn đã làm xong phần thi này');
                        }
                        else {
                            me.totaltime = me.strTolTalTimeStudent * 60;
                            //Tự động cập nhật thời gian hiện tại
                            myVar = setInterval("main_doc.lambaithionline.UpdateCurrentTimePart()", 180000);//180 giay

                            //Tự động kiểm tra trạng thái phòng thi
                            myVar = setInterval("main_doc.lambaithionline.KT_TTLamBaiPart()", 30000);//30 giay

                            me._timerHandler = setInterval("main_doc.lambaithionline.MyTimer(" + me.totaltime + ")", 1000);
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
            //@ chua lam
            if (me.strTinhTheoTongThoiGian != "1") {// Tính thời gian theo từng phần thi
                me.gen_KhiHetThoiGian();
                me.CapNhat_FinishPart(me.strExamStructPartId_Muc1);
            }
            else {
                window.open(me.strUrlKetQuaThi, "_parent");
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

            $('#idTimerLCD' + me.strRandomTimerLCD).text(hours + mins + ':' + secs);
            //$('#hdnTimer').val(valueTimer);
            me.totaltime = valueTimer;
            document.title = $('#idTimerLCD' + me.strRandomTimerLCD).text();
        }
        else {

            if (me.strTinhTheoTongThoiGian != "1") {// Tính thời gian theo từng phần thi
                //$("#zoneTablePartQuestion #" + me.strStudentExamRoomPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                if (me.strDaGoiHamHetThoiGian != "1") {
                    //Cập nhật kết thúc phần thi
                    me.CapNhat_FinishPart(me.strExamStructPartId);
                    me.gen_KhiHetThoiGian();
                    $('#btnFinish').css({ 'pointer-events': 'none' });

                }
                me.strDaGoiHamHetThoiGian = "1";
            }
            else {// Không Tính thời gian theo từng phần thi
                var dtKTExamStructPart = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
                window.open(me.strUrlKetQuaThi, "_parent");
            }


        }
    },
    CapNhatKetThucBaiThi: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhatKetThucBaiThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThisinh_Id': me.strThiSinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                window.open(me.strUrlKetQuaThi, "_parent");
            },
            error: function (er) {

                window.open(me.strUrlKetQuaThi, "_parent");
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

    KT_TTLamBaiPart: function () {
        var me = this;
        var data = edu.util.objGetDataInData(edu.util.returnEmpty(me.strExamStructPartId), me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        // khi chọn phần thi khác nếu là mức 1 và tính theo thời gian từng phần thi reset strDaGoiHamHetThoiGian

        var obj_list = {
            'action': 'TTN_ThiSinh/KT_TTLamBaiPart',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strStudentExamRoomId': me.strStudentExamRoom_Id,
            'strExamStructPartId': me.strExamStructPartId_Muc1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data[0];
                    if (dt.OPENSTATUS == null || dt.OPENSTATUS == "" || dt.OPENSTATUS == "0") {
                        alert("Phòng thi đã kết thúc, vui lòng liên hệ giám thị coi thi để biết thêm thông tin, hệ thống sẽ tự động đóng bài thi!");

                        window.open(me.strUrlKetQuaThi, "_parent");                        //Chuyển tới Index

                    }
                    else if (parseInt(dt.OPENSTATUS) == "1")//Phòng thi đang mở
                    {

                        if (dt.FINISHED == "1") {

                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            //@ xem cho nay
                            //$("#zoneTablePartQuestion #" + me.strExamStructPartId).removeClass("button_ExamPart_chualam").addClass("button_ExamPart_dalam");
                            //me.CapNhat_FinishPart(me.strStudentExamRoomPartId, me.strExamStructPartId);
                            me.KiemTraDaLamHetCacPhanThi();
                            window.open(me.strUrlKetQuaThi, "_parent");

                        }
                        if (dt.THOIGIANCONLAI <= 0) {
                            me.CapNhat_FinishPart(me.strExamStructPartId_Muc1);
                            var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === me.strExamStructPartId_Muc1);
                            //Sau khi update DB thì update tiếp kết thúc trong dtExamStructPartAll
                            if (index >= 0) {
                                me.dtExamStructPartAll[index].FINISHED = "1";
                            }

                            me.KiemTraDaLamHetCacPhanThi();
                            me.gen_KhiHetThoiGian();
                        }
                        if (dt.STUDENTEXAMROOMSTATUS == "TAMDUNGTHI") {
                            alert("Tạm dừng thi, vui lòng liên hệ Giám thị để biết thêm thông tin!");
                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            //me.CapNhat_FinishPart(); 
                            window.open(strUrleIndex, "_parent");
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
    gen_KhiHetThoiGian: function () {
        var me = this;

        $("#zoneEXAMSTRUCTPARTID" + me.strExamStructPartId_Muc1 + " a").addClass('disableatag');
        $("#zoneChon_DanhSachCauHoiPart" + me.strExamStructPartId_Muc1).addClass('AnCSS');
        $("#zoneTable_NoiDungCauHoiVaDapAnPart" + me.strExamStructPartId_Muc1).addClass('AnCSS');
        $("#zoneNextPreQuestionPart" + me.strExamStructPartId_Muc1).addClass('AnCSS');


        var data = edu.util.objGetDataInData(me.strExamStructPartId_Muc1, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
        if (data.length == 0)
            return;
        for (var i = 0; i < data.length; i++) {
            if (data[i].EXAMSTRUCTPARTID != "") {
                me.gen_KhiHetThoiGianChiTiet(data[i].EXAMSTRUCTPARTID);
            }
        }
    },
    gen_KhiHetThoiGianChiTiet: function (ExamStructPartId) {
        var me = this;
        $("#zoneEXAMSTRUCTPARTID" + ExamStructPartId + " a").addClass('disableatag');
        $("#zoneChon_DanhSachCauHoiPart" + ExamStructPartId).addClass('AnCSS');
        $("#zoneTable_NoiDungCauHoiVaDapAnPart" + ExamStructPartId).addClass('AnCSS');
        $("#zoneNextPreQuestionPart" + ExamStructPartId).addClass('AnCSS');
        var data = edu.util.objGetDataInData(ExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTPARENTID");
        if (data.length == 0)
            return;
        for (var i = 0; i < data.length; i++) {
            if (data[i].EXAMSTRUCTPARTID != "") {
                me.gen_KhiHetThoiGianChiTiet(data[i].EXAMSTRUCTPARTID);
            }
        }
    },

    genTableAudioPart: function (strExamStructPartId) {
        var me = this;
        $('#zoneTable_AudioPart').html('');
        var data = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
        var dtExamStruct = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        var strDuongDanFiles = '';
        var strTenFile = '';
        var strTenFileDayDu = '';
        if (dtExamStruct.length > 0) {
            if (data.length == 1) {
                if (dtExamStruct[0].SOLANNGHE != '0')
                    return;
                me.genAudioPlay(data[0].FILEAUDIONID);

            }
            else {
                if (dtExamStruct[0].SOLANNGHE != '0')
                    return;
                var strdivFileNghe = "";
                for (var i = 0; i < data.length; i++) {
                    strDuongDanFiles = data[i].DUONGDAN.split('/');
                    strTenFileDayDu = strDuongDanFiles[strDuongDanFiles.length - 1];
                    strTenFile = strTenFileDayDu.substring(0, strTenFileDayDu.length - 4) + '.m3u8';
                    strdivFileNghe += "<a class='button_Audio_chuanghe fa fa-play-circle' id='" + data[i].FILEAUDIONID + "' href = 'javascript:void(0);' title = ''> Nghe " + i + "</a >";


                }
                strdivFileNghe = "<div class='tab-i '>" + strdivFileNghe + "</div>";
                $('#zoneTable_AudioPart').html(strdivFileNghe);

            }
        }
        //#region Rem nghe cu
        /*
        var xx = AP.destroy();
        if (data.length > 0 && dtExamStruct.length > 0) {
             if (dtExamStruct[0].SOLANNGHE != '0')
                return;
            var dataFileAmThanh = [];
            for (var i = 0; i < data.length; i++) {

                var FileAmThanh = { 'icon': iconImage, 'title': data[i].TENHIENTHI, 'file': me.rootPathUploadFile + data[i].DUONGDAN };
                //var FileAmThanh = { 'icon': iconImage, 'title': 'A', 'file': 'http://localhost/out.m3u8' };
                console.log("Audio link: " + me.rootPathUploadFile + data[i].DUONGDAN);
                console.log("Audio link 1: data[i].DUONGDAN" + data[i].DUONGDAN);
                console.log("Audio link 3: me.rootPathUploadFile" + me.rootPathUploadFile);
                dataFileAmThanh.push(FileAmThanh);
            }

            var iconImage = null;
            var xx = AP.destroy();
            var abc1 = AP.init({
                container: '#zoneTable_AudioPart',//a string containing one CSS selector
                volume: 0.7,
                autoPlay: true,
                notification: false,
                playList: dataFileAmThanh
            });
            var dataAudio = edu.util.objGetDataInData(strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
            //@ tạm rem lại
            //if (dataAudio.length > 0)
            //    me.CapNhatSoLanNghe(strExamStructPartId);

        }   
        */
        //#endregion

    },

    NopBaiThi: function () {
        var me = this;

        if (me.strQuestionTypeCode == "FILLTHEBLANK") {
            me.save(me.strStudentQuestion_Id, me.strQuestionTypeCode);
        }

        me.CapNhatKetThucBaiThi();
        edu.system.alert("Nộp bài thi  thành công");

    },
    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWYabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    KT_TTLamBai: function () {
        var me = this;

        // khi chọn phần thi khác nếu là mức 1 và tính theo thời gian từng phần thi reset strDaGoiHamHetThoiGian

        var obj_list = {
            'action': 'TTN_ThiSinh/KT_TTLamBai',
            'versionAPI': 'v1.0',
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strStudentExamRoomId': me.strStudentExamRoom_Id,
            'strExamStructPartId': me.strExamStructPartId_Muc1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var dt = data.Data[0];
                    if (dt.OPENSTATUS == null || dt.OPENSTATUS == "" || dt.OPENSTATUS == "0") {
                        alert("Phòng thi đã kết thúc, vui lòng liên hệ giám thị coi thi để biết thêm thông tin, hệ thống sẽ tự động đóng bài thi!");

                        window.open(me.strUrlKetQuaThi, "_parent");                        //Chuyển tới Index

                    }
                    else if (parseInt(dt.OPENSTATUS) == "1")//Phòng thi đang mở
                    {

                        if (dt.FINISHED == "1") {


                            window.open(me.strUrlKetQuaThi, "_parent");

                        }
                        if (dt.THOIGIANCONLAI <= 0) {

                            var index = me.dtExamStructPartAll.findIndex(x => x.EXAMSTRUCTPARTID === me.strExamStructPartId_Muc1);
                            //Sau khi update DB thì update tiếp kết thúc trong dtExamStructPartAll
                            if (index >= 0) {
                                me.dtExamStructPartAll[index].FINISHED = "1";
                            }

                            me.gen_KhiHetThoiGian();
                        }
                        if (dt.STUDENTEXAMROOMSTATUS == "TAMDUNGTHI") {
                            alert("Tạm dừng thi, vui lòng liên hệ Giám thị để biết thêm thông tin!");
                            //Gọi hàm kết thúc
                            //Kiem tra va luu danh sach cau hoi
                            //me.CapNhat_FinishPart(); 
                            window.open(strUrleIndex, "_parent");
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
    ThemTBL_EXA_TTNLOG: function () {
        var me = this;
        var strGhiChu = "DANH SACH PHONG THI: me.strThiSinh_Id=" + me.strThiSinh_Id
            + " edu.system.userId =" + edu.system.userId;
        var obj_list = {
            'action': 'TTN_ThiSinh/ThemTBL_EXA_TTNLOG',
            'versionAPI': 'v1.0',
            'type': 'POST',
            'strEXAMROOMINFOID': me.strExamRoomInfo_Id,
            'strUSERID': me.strThiSinh_Id,
            'strGHICHU': strGhiChu,
        };

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

            },
            type: obj_list.type,
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genAudioPlay: function (strFileAudionId) {
        var me = this;
        // Dừng và XÓA hoàn toàn audio cũ khỏi DOM
        document.querySelectorAll('audio').forEach(function (audio) {
            audio.pause();
            audio.currentTime = 0;
            // Xóa mọi event listener nếu có
            audio.src = '';
            audio.load();
            audio.remove();
        });
        $('audio').each(function () {
            this.pause();
            this.currentTime = 0;
            $(this).remove();
        });

        // Nếu có Plyr instance cũ, hãy destroy (tùy biến player của bạn)
        if (window.player) {
            window.player.destroy();
            window.player = null;
        }
        //var hls1 = new Hls();
        //hls1.destroy();
        $('#zoneTable_AudioPartFile').html('');

        setTimeout(function () {

            var data = edu.util.objGetDataInData(strFileAudionId, me.dtExamStructPartAudioFiles, "FILEAUDIONID");
            //@ Sua lai cho nay lay theo file da nghe
            var dtExamStruct = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");

            var strDuongDanFiles = '';
            var strTenFile = '';
            var strTenFileMP3 = '';

            var strTenFileDayDu = '';

            if (data.length == 1) {
                if (data[0].SOLANNGHE < 2) {

                    strDuongDanFiles = data[0].DUONGDAN.split('/');
                    strTenFileDayDu = strDuongDanFiles[strDuongDanFiles.length - 1];
                    strTenFile = strTenFileDayDu.substring(0, strTenFileDayDu.length - 4) + '.m3u8';
                    strTenFileMP3 = strTenFileDayDu;



                    var strAudio =
                        '<audio id="playerAudio" controls>' +
                        '<source src="' + me.rootPathUploadFile + "/" + strTenFileDayDu + '" type="audio/mp3" />' +
                        '</audio>';

                    $('#zoneTable_AudioPartFile').html(strAudio);

                    setTimeout(function () {
                        const player = new Plyr('#playerAudio', {
                            controls: [
                                'play',
                                'progress',
                                'current-time',
                                'duration',
                                'mute',
                                'volume'
                            ],
                            tooltips: { controls: true }
                        });

                        // Chặn tua trên progress bar
                        let lastTime = 0;
                        player.on('timeupdate', () => {
                            if (player.currentTime > lastTime) lastTime = player.currentTime;
                        });
                        player.on('seeking', () => {
                            if (Math.abs(player.currentTime - lastTime) > 0.2) {
                                player.currentTime = lastTime;
                            }
                        });

                        // Disable nút play/pause
                        $('.plyr__controls [data-plyr="play"]').css({
                            'pointer-events': 'none',
                            'opacity': 0.5
                        });

                        // Disable pointer events trên progress bar (chỉ cho chắc)
                        $('.plyr__progress').css({
                            'pointer-events': 'none',
                            'opacity': 0.7
                        });

                        // Tự động play khi load
                        player.play();

                        // Tự động play lại nếu bị pause
                        player.on('pause', () => {
                            player.play();
                        });

                        // Chặn phím tắt pause phổ biến
                        document.addEventListener('keydown', function (e) {
                            if (e.key === ' ' || e.key.toLowerCase() === 'k' || e.code === 'MediaPlayPause') {
                                e.preventDefault();
                                return false;
                            }
                        });
                    }, 200);
                    //$('#zoneTable_AudioPartFile').html('<audio preload="false" id="player"  controls crossorigin>');
                    //var audio = document.querySelector('#player');
                    ////console.log(window.MediaSource);
                    ////console.log(window.WebKitMediaSource);

                    ////console.log(window.MediaSource.isTypeSupported);
                    ////console.log(window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'));

                    //if (Hls.isSupported()) {
                    //    var hls = new Hls();
                    //    hls.loadSource(me.rootPathUploadFile + "/" + strTenFile);
                    //    hls.attachMedia(audio);
                    //}
                    //plyr.setup(audio);

                    ////audio.play();
                    ////const playPromise = audio.play();
                    ////if (playPromise !== null) {
                    ////    playPromise.catch(() => { audio.play(); })
                    ////}
                    //setTimeout(function () {
                    //    audio.play();
                    //}, 2000);

                    me.CapNhat_SoLanNghe(data[0].FILEAUDIONID);
                }
                var dataAudio = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
                //#region hiển thị câu hỏi theo phần nghe

                var strGroupQuestionDetailId = data[0].GROUPQUESTIONDETAILID;
                var dataCauHoiThuocPhanNghe = edu.util.objGetDataInData(strGroupQuestionDetailId, me.dtQuestion, "GROUPQUESTIONDETAILID");
                var dataCauHoiThuocNhom = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");
                $('#zoneChon_DanhSachCauHoiPart' + me.strExamStructPartId).removeClass('AnCSS');
                $('#zoneNextPreQuestionPart' + me.strExamStructPartId).removeClass('AnCSS');
                $('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.strExamStructPartId).removeClass('AnCSS');
                for (var i = 0; i < dataCauHoiThuocNhom.length; i++) {
                    $("#zoneChon_DanhSachCauHoiPart" + me.strExamStructPartId + " #" + dataCauHoiThuocNhom[i].STUDENTQUESTIONID).hide();


                }
                for (var i = 0; i < dataCauHoiThuocPhanNghe.length; i++) {
                    $("#zoneChon_DanhSachCauHoiPart" + me.strExamStructPartId + " #" + dataCauHoiThuocPhanNghe[i].STUDENTQUESTIONID).show();
                }
                //#endregion

            }

        }, 100);



    },
    CapNhat_SoLanNghe: function (strTTN_FILESID) {
        var me = this;

        var obj_list = {
            'action': 'TTN_ThiSinh/CapNhat_SoLanNghe',
            'versionAPI': 'v1.0',
            'strTTN_FILESID': strTTN_FILESID,
            'strExamRoomInfo_Id': me.strExamRoomInfo_Id,
            'strThiSinh_Id': me.strThiSinh_Id,
            'strExamStructPartId': me.strExamStructPartId,
        };
        edu.system.makeRequest({
            success: function (data) {
                 
                // neu la phan thi
                var index = me.dtExamStructPartAudioFiles.findIndex(x => x.FILEAUDIONID === strTTN_FILESID);
                if (index!=-1)
                    me.dtExamStructPartAudioFiles[index].SOLANNGHE = data.Data;
                // neu la cau hoi co am thanh
                var indexQuestion = me.dtExamQuestionAudioFiles.findIndex(x => x.FILEAUDIONID === strTTN_FILESID);
                if (indexQuestion != -1)
                    me.dtExamQuestionAudioFiles[indexQuestion].SOLANNGHE = data.Data;


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

        var rootPathUploadFile = edu.system.rootPathUpload;

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
    uploadFilesRecoder: function (audio, strDuLieu_Id) {
        var me = this;
        var strFileName = edu.util.uuid() + ".webm";
        var formData = new FormData();
        formData.append(strFileName, audio.audioBlob, strFileName);
        //var strApi = "SV_Files";
        //var strDuLieu_Id = me.strStudentExamRoomPartId;
        //edu.system.rootPathUpload = "https://daotao.utt.edu.vn/upload";
        strLinkUpFile = edu.system.rootPathUpload + "/Handler";
        //strLinkUpFile = "https://daotao.utt.edu.vn/upload/Handler";
        $.ajax
            ({
                url: strLinkUpFile + "/up_files_v2.ashx?outFolderPath=audio/&userId=" + edu.system.userId,
                method: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                success: function (response) {
                    //Cập nhật trạng thái load thành công

                    //Thông báo lỗi khi response trả về có chứa "Sys_error: "
                    if (response.includes('Sys_error: ')) {
                        edu.system.alert("Upload thất bại: " + response);
                        return;
                    } else {
                        //GetDirectories(strCurrentPath);
                        var obj_save = {
                            'action': 'TTN_StudentFiles/Them_StudentFilesRecoder',


                            'strDuLieu_Id': strDuLieu_Id,
                            'strTenHienThi': strFileName,
                            'strThongTinMinhChung': '',
                            'strFileMinhChung': edu.system.copyFile(response, strDuLieu_Id),
                            'strNguoiThucHien_Id': edu.system.userId,
                        };

                        edu.system.makeRequest({
                            success: function (data) {
                                if (data.Success) {
                                    me.LayTT_FilesRecoderByDLId();
                                    $("#guideRecoder").text("Nhấn vào đây để bắt đầu ghi âm");
                                }
                                else {
                                    edu.system.alert("Lỗi: " + data.Message, "w");
                                }

                            },
                            error: function (er) { },
                            type: "POST",
                            action: obj_save.action,

                            contentType: true,

                            data: obj_save,
                            fakedb: [
                            ]
                        }, false, false, false, null);
                        edu.system.alert("Upload thành công: ")
                    }

                    //Thông báo
                },
                error: function (err) {
                    alert(err.statusText);
                }
            });

    },
    playRecoder: function (strDuongDan) {
        var me = this;
        var iconImage = null;

        rootPath = edu.system.rootPathUpload;

        console.log(rootPath + strDuongDan)
        //var abc = AP.init({

        //    container: '#zonePlayRecoder',//a string containing one CSS selector
        //    volume: 0.7,
        //    autoPlay: false,
        //    notification: false,
        //    playList: [
        //        { 'icon': iconImage, 'title': 'Test', 'file': rootPath + '/audio' + strDuongDan },


        //    ]
        //});
        var strhtml = '<audio controls title="File ghi am"> ' +
            '    <source src="' + rootPath + "/" + strDuongDan + '" type="audio/webm"> ' +

            '</audio> ';
        $("#zonePlayRecoder").html(strhtml);
    },
    LayTT_FilesRecoderByDLId: function () {
        var me = this;

        var obj_list = {
            'action': 'TTN_StudentFiles/LayTT_FilesRecoderByDLId',
            'versionAPI': 'v1.0',
            'strDuLieu_Id': me.strStudentQuestion_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDuongDan = "";
                    if (data.Data.length > 0)
                        strDuongDan = data.Data[0].DUONGDAN;

                    me.playRecoder(strDuongDan)
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

    initDragDrop: function () {
        var me = this;

        // Khởi tạo draggable cho các từ trong câu hỏi
        $(".draggable-word").draggable({
            revert: "invalid",
            helper: "clone",
            start: function (event, ui) {
                $(this).addClass("ui-draggable-dragging");
            },
            stop: function (event, ui) {
                $(this).removeClass("ui-draggable-dragging");
            }
        });

        // Khởi tạo droppable cho các ô đáp án
        $(".drop-zone").droppable({
            accept: ".draggable-word",
            hoverClass: "highlight",
            drop: function (event, ui) {
                let draggedValue = ui.draggable.data("value");
                // Nếu không có data-value thì lấy từ text
                if (!draggedValue) {
                    draggedValue = $.trim(ui.draggable.text());
                }
                let wordId = ui.draggable.attr("data-word-id");

                // Xóa nội dung cũ và thêm từ mới vào đáp án (CHỈ 1 LẦN)
                $(this).empty().append('<span class="word-in-answer" data-value="' + draggedValue + '" data-word-id="' + wordId + '">' + draggedValue + '</span>');

                // Thêm class filled để đánh dấu đã có đáp án
                $(this).addClass("filled");

                // Cập nhật lại màu sắc cho tất cả các từ trong câu hỏi
                me.updateQuestionWordColors();

                // Lấy ID của ô đáp án từ input hidden
                var strQUESTIONTYPECODE_GIATRI = $(this).closest('.textbox').find('input.QUESTIONTYPECODE_GIATRI').val() || "";
                var strSTUDENTQUESTIONID = $(this).closest('.textbox').find('input.STUDENTQUESTIONID_GIATRI').val() || "";
                var strSTUDENTANSWERID = $(this).closest('.textbox').find('input.STUDENTANSWERID_GIATRI').val() || "";

                // Hiển thị alert với thông tin đầy đủ
                //console.log("strSTUDENTQUESTIONID  " + strSTUDENTQUESTIONID);
                //console.log("strSTUDENTANSWERID " + strSTUDENTANSWERID);
                //alert('STUDENTQUESTIONID: ' + STUDENTQUESTIONID + '\nstranswerId: ' + stranswerId + '\nGiá trị vừa kéo: ' + draggedValue);
                var strReview = "0";
                if ($("#chkChuaChacChan").is(":checked") == true)
                    strReview = "1";
                var strDaTraLoi = 1;
                var strCorrect = "0";
                var strContent2 = draggedValue;
                var strAnswer_Second_Id = "";

                me.saveDapAn(strSTUDENTQUESTIONID, strQUESTIONTYPECODE_GIATRI, strSTUDENTANSWERID, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);

            }
        });

        // Khởi tạo draggable cho các từ trong đáp án (để có thể kéo ra ngoài)
        $(document).on('mouseenter', '.word-in-answer', function () {
            if (!$(this).hasClass('ui-draggable')) {
                $(this).draggable({
                    revert: "invalid",
                    helper: "clone",
                    start: function (event, ui) {
                        $(this).addClass("ui-draggable-dragging");
                    },
                    stop: function (event, ui) {
                        $(this).removeClass("ui-draggable-dragging");
                    }
                });
            }
        });

        // Xử lý khi kéo từ đáp án ra ngoài
        $(document).on('dragstop', '.word-in-answer', function (event, ui) {
            let answerId = $(this).closest('.drop-zone').data("id");
            let wordValue = $(this).data("value");
            var strQUESTIONTYPECODE_GIATRI = $(this).closest('.textbox').find('input.QUESTIONTYPECODE_GIATRI').val() || "";
            var strSTUDENTQUESTIONID = $(this).closest('.textbox').find('input.STUDENTQUESTIONID_GIATRI').val() || "";
            var strSTUDENTANSWERID = $(this).closest('.textbox').find('input.STUDENTANSWERID_GIATRI').val() || "";

            // Kiểm tra xem có kéo ra ngoài vùng drop-zone không
            let dropZone = $(this).closest('.drop-zone');
            let dropZoneOffset = dropZone.offset();
            let dropZoneWidth = dropZone.outerWidth();
            let dropZoneHeight = dropZone.outerHeight();

            if (event.pageX < dropZoneOffset.left ||
                event.pageX > dropZoneOffset.left + dropZoneWidth ||
                event.pageY < dropZoneOffset.top ||
                event.pageY > dropZoneOffset.top + dropZoneHeight) {

                // Xóa từ khỏi đáp án
                $(this).remove();

                // Reset trạng thái drop-zone
                dropZone.removeClass("correct incorrect filled");
                dropZone.text("Kéo từ câu hỏi vào đây");

                // Cập nhật lại màu sắc cho tất cả các từ trong câu hỏi
                me.updateQuestionWordColors();
               
                // Hiển thị alert
                alert("Đã xóa từ: " + wordValue);
                var strReview = "0";
                if ($("#chkChuaChacChan").is(":checked") == true)
                    strReview = "1";
                var strDaTraLoi = 1;
                var strCorrect = "0";
                var strContent2 = "";
                var strAnswer_Second_Id = "";

                me.saveDapAn(strSTUDENTQUESTIONID, strQUESTIONTYPECODE_GIATRI, strSTUDENTANSWERID, strCorrect, strReview, strDaTraLoi, strContent2, strAnswer_Second_Id);

            }
        });
        //----------------- begin  TAOCAUHOANCHINH
        // =====================================================
        // MULTI-WORD cho TAOCAUHOANCHINH (Câu 1)
        // =====================================================

        (function () {
            if (typeof $ === "undefined" || !$.ui || !$.ui.droppable || !$.ui.sortable) {
                console.warn("⚠️ jQuery UI chưa sẵn sàng.");
                return;
            }

            // Kích hoạt draggable cho nguồn từ (các thẻ xanh phía trên)
            $(".draggable-word").draggable({
                helper: "clone",
                revert: "invalid",
                containment: "document",
                start: function () { $(this).css("opacity", ".6"); },
                stop: function () { $(this).css("opacity", "1"); }
            });

            // Kích hoạt sortable để đổi vị trí token trong vùng đáp án
            $(".multi-drop-zone .drop-container").sortable({
                items: ".answer-token",
                tolerance: "pointer",
                helper: "original",  // KHÔNG clone thêm
                revert: 150
            });

            // Cho phép kéo từ nguồn xuống vùng đáp án
            $(".multi-drop-zone").droppable({
                accept: ".draggable-word:not(.used)",
                tolerance: "pointer",
                drop: function (event, ui) {
                    var $zone = $(this);
                    var $cont = $zone.find(".drop-container");
                    var $token = $(ui.draggable).clone()
                        .removeAttr("style")
                        .removeClass("ui-draggable-dragging")
                        .addClass("answer-token");

                    // Xóa placeholder nếu có
                    $cont.find(".placeholder").remove();

                    // Thêm token
                    $cont.append($token);
                    $cont.sortable("refresh");

                    // Đánh dấu từ nguồn là đã dùng
                    ui.draggable.addClass("used");
                }
            });

            // Cho phép kéo token ra ngoài để xoá
            $(document).on("dblclick", ".multi-drop-zone .answer-token", function () {
                var $cont = $(this).closest(".drop-container");
                var text = $(this).text().trim();
                $(this).remove();

                // Giải phóng token nguồn tương ứng
                $(".draggable-word").filter(function () {
                    return $(this).text().trim() === text;
                }).removeClass("used");

                // Nếu trống, hiển thị lại placeholder
                if ($cont.children(".answer-token").length === 0 &&
                    $cont.find(".placeholder").length === 0) {
                    $cont.append('<span class="placeholder">Kéo các từ ở trên vào đây</span>');
                }
            });
        })();


        // end TAOCAUHOANCHINH
    },
    // Hàm cập nhật màu sắc cho các từ trong câu hỏi
    updateQuestionWordColors: function () {
        // Lấy tất cả các từ đang có trong đáp án
        let usedWords = [];
        $('.word-in-answer').each(function () {
            let wordText = $(this).text().trim();
            if (wordText && wordText !== "undefined") {
                usedWords.push(wordText);
            }
        });

        // Cập nhật màu sắc cho từng từ trong câu hỏi
        $('.draggable-word').each(function () {
            let wordText = $(this).text().trim();
            if (usedWords.includes(wordText)) {
                $(this).addClass('used');
            } else {
                $(this).removeClass('used');
            }
        });
    },
    
    updateQuestionWordColors_All: function() {
        var zoneRoot = document.getElementById('zoneTable_NoiDungCauHoiVaDapAn');
        var questionBlocks = zoneRoot.querySelectorAll('.bix-div-container[id^="zoneContentQuestion"]');
        for (var i = 0; i < questionBlocks.length; i++) {
            var qb = questionBlocks[i];
            // 1. Lấy tất cả từ đã được dùng (dưới dạng text thuần, lowercase)
            var usedTexts = Array.from(qb.querySelectorAll('.drop-zone.filled'))
                .map(e => (e.innerText || e.textContent).trim().toLowerCase())
                .filter(x => x); // loại bỏ rỗng
            // 2. Duyệt tất cả từ draggable ở trên
            var words = qb.querySelectorAll('.draggable-word');
            for (var j = 0; j < words.length; j++) {
                var w = words[j];
                var wText = (w.innerText || w.textContent).trim().toLowerCase();
                // so sánh bằng text
                if (usedTexts.indexOf(wText) >= 0) w.classList.add('used');
                else w.classList.remove('used');
            }
        }
    },
    genTableQuestionAudio: function (strStudentQuestionId) {
        var me = this;
        // Dừng và XÓA hoàn toàn audio cũ khỏi DOM
        document.querySelectorAll('audio').forEach(function (audio) {
            audio.pause();
            audio.currentTime = 0;
            // Xóa mọi event listener nếu có
            audio.src = '';
            audio.load();
            audio.remove();
        });
        $('audio').each(function () {
            this.pause();
            this.currentTime = 0;
            $(this).remove();
        });

        // Nếu có Plyr instance cũ, hãy destroy (tùy biến player của bạn)
        if (window.player) {
            window.player.destroy();
            window.player = null;
        }
        //var hls1 = new Hls();
        //hls1.destroy();
        $('#zoneTable_AudioPartFile').html('');
        $('#zoneTable_AudioPart').html('');
        var data = edu.util.objGetDataInData(strStudentQuestionId, me.dtExamQuestionAudioFiles, "STUDENTQUESTIONID");
        //var dtExamStruct = edu.util.objGetDataInData(strStudentQuestion, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");
        var strDuongDanFiles = '';
        var strTenFile = '';
        var strTenFileDayDu = '';
        if (data.length > 0) {
            if (data.length == 1) {
                if (data[0].SOLANNGHE != '0')
                    return;
                me.genQuestionAudioPlay(data[0].FILEAUDIONID);

            }
            else {
                if (data[0].SOLANNGHE != '0')
                    return;
                var strdivFileNghe = "";
                for (var i = 0; i < data.length; i++) {
                    strDuongDanFiles = data[i].DUONGDAN.split('/');
                    strTenFileDayDu = strDuongDanFiles[strDuongDanFiles.length - 1];
                    strTenFile = strTenFileDayDu.substring(0, strTenFileDayDu.length - 4) + '.m3u8';
                    strdivFileNghe += "<a class='button_Audio_chuanghe fa fa-play-circle' id='" + data[i].FILEAUDIONID + "' href = 'javascript:void(0);' title = ''> Nghe " + i + "</a >";


                }
                strdivFileNghe = "<div class='tab-i '>" + strdivFileNghe + "</div>";
                $('#zoneTable_AudioPart').html(strdivFileNghe);

            }

        }
    },

    genQuestionAudioPlay: function (strFileAudionId) {
        var me = this;
        
        // Dừng và XÓA hoàn toàn audio cũ khỏi DOM
        document.querySelectorAll('audio').forEach(function (audio) {
            audio.pause();
            audio.currentTime = 0;
            // Xóa mọi event listener nếu có
            audio.src = '';
            audio.load();
            audio.remove();
        });
        $('audio').each(function () {
            this.pause();
            this.currentTime = 0;
            $(this).remove();
        });

        // Nếu có Plyr instance cũ, hãy destroy (tùy biến player của bạn)
        if (window.player) {
            window.player.destroy();
            window.player = null;
        }
        //var hls1 = new Hls();
        //hls1.destroy();
        $('#zoneTable_AudioPartFile').html('');

        setTimeout(function () {

            var data = edu.util.objGetDataInData(strFileAudionId, me.dtExamQuestionAudioFiles, "FILEAUDIONID");
            //@ Sua lai cho nay lay theo file da nghe
            var dtExamStruct = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAll, "EXAMSTRUCTPARTID");

            var strDuongDanFiles = '';
            var strTenFile = '';
            var strTenFileMP3 = '';

            var strTenFileDayDu = '';

            if (data.length == 1) {
                if (data[0].SOLANNGHE < 2) {

                    strDuongDanFiles = data[0].DUONGDAN.split('/');
                    strTenFileDayDu = strDuongDanFiles[strDuongDanFiles.length - 1];
                    strTenFile = strTenFileDayDu.substring(0, strTenFileDayDu.length - 4) + '.m3u8';
                    strTenFileMP3 = strTenFileDayDu;



                    var strAudio =
                        '<audio id="playerAudio" controls>' +
                        '<source src="' + me.rootPathUploadFile + "/" + strTenFileDayDu + '" type="audio/mp3" />' +
                        '</audio>';

                    $('#zoneTable_AudioPartFile').html(strAudio);

                    setTimeout(function () {
                        const player = new Plyr('#playerAudio', {
                            controls: [
                                'play',
                                'progress',
                                'current-time',
                                'duration',
                                'mute',
                                'volume'
                            ],
                            tooltips: { controls: true }
                        });

                        // Chặn tua trên progress bar
                        let lastTime = 0;
                        player.on('timeupdate', () => {
                            if (player.currentTime > lastTime) lastTime = player.currentTime;
                        });
                        player.on('seeking', () => {
                            if (Math.abs(player.currentTime - lastTime) > 0.2) {
                                player.currentTime = lastTime;
                            }
                        });

                        // Disable nút play/pause
                        $('.plyr__controls [data-plyr="play"]').css({
                            'pointer-events': 'none',
                            'opacity': 0.5
                        });

                        // Disable pointer events trên progress bar (chỉ cho chắc)
                        $('.plyr__progress').css({
                            'pointer-events': 'none',
                            'opacity': 0.7
                        });

                        // Tự động play khi load
                        player.play();

                        // Tự động play lại nếu bị pause
                        player.on('pause', () => {
                            player.play();
                        });

                        // Chặn phím tắt pause phổ biến
                        document.addEventListener('keydown', function (e) {
                            if (e.key === ' ' || e.key.toLowerCase() === 'k' || e.code === 'MediaPlayPause') {
                                e.preventDefault();
                                return false;
                            }
                        });
                    }, 200);
                    //$('#zoneTable_AudioPartFile').html('<audio preload="false" id="player"  controls crossorigin>');
                    //var audio = document.querySelector('#player');
                    ////console.log(window.MediaSource);
                    ////console.log(window.WebKitMediaSource);

                    ////console.log(window.MediaSource.isTypeSupported);
                    ////console.log(window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'));

                    //if (Hls.isSupported()) {
                    //    var hls = new Hls();
                    //    hls.loadSource(me.rootPathUploadFile + "/" + strTenFile);
                    //    hls.attachMedia(audio);
                    //}
                    //plyr.setup(audio);

                    ////audio.play();
                    ////const playPromise = audio.play();
                    ////if (playPromise !== null) {
                    ////    playPromise.catch(() => { audio.play(); })
                    ////}
                    //setTimeout(function () {
                    //    audio.play();
                    //}, 2000);

                    me.CapNhat_SoLanNghe(data[0].FILEAUDIONID);
                }
                //var dataAudio = edu.util.objGetDataInData(me.strExamStructPartId, me.dtExamStructPartAudioFiles, "EXAMSTRUCTPARTID");
                ////#region hiển thị câu hỏi theo phần nghe

                //var strGroupQuestionDetailId = data[0].GROUPQUESTIONDETAILID;
                //var dataCauHoiThuocPhanNghe = edu.util.objGetDataInData(strGroupQuestionDetailId, me.dtQuestion, "GROUPQUESTIONDETAILID");
                //var dataCauHoiThuocNhom = edu.util.objGetDataInData(me.strExamStructPartId, me.dtQuestion, "EXAMSTRUCTPARTID");
                //$('#zoneChon_DanhSachCauHoiPart' + me.strExamStructPartId).removeClass('AnCSS');
                //$('#zoneNextPreQuestionPart' + me.strExamStructPartId).removeClass('AnCSS');
                //$('#zoneTable_NoiDungCauHoiVaDapAnPart' + me.strExamStructPartId).removeClass('AnCSS');
                //for (var i = 0; i < dataCauHoiThuocNhom.length; i++) {
                //    $("#zoneChon_DanhSachCauHoiPart" + me.strExamStructPartId + " #" + dataCauHoiThuocNhom[i].STUDENTQUESTIONID).hide();


                //}
                //for (var i = 0; i < dataCauHoiThuocPhanNghe.length; i++) {
                //    $("#zoneChon_DanhSachCauHoiPart" + me.strExamStructPartId + " #" + dataCauHoiThuocPhanNghe[i].STUDENTQUESTIONID).show();
                //}
                ////#endregion

            }

        }, 100);



    },
}