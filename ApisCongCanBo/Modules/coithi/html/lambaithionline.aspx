<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="lambaithionline.aspx.cs" Inherits="Apis.NewLogin.ApisThiTracNghiem.Modules.lambaithi.html.lambaithionline" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thi trắc nghiệm</title>
    <link rel="stylesheet" href="../../../../eassets/css/styles.css">
    <link rel="stylesheet" href="../../../../eassets/css/responsive.css">
    <link rel="stylesheet" href="../../../../eassets/Audio_Temp/css/AudioPlayer.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> 
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.css" />
    <script type="text/javascript" src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload") %>/Core/uploadfile.js"></script>        <!--CORE JS-->
        <script type="text/javascript" src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload") %>/Core/uploadavatar.js"></script>        <!--CORE JS-->

    <style>
         
        #player{
            max-width: 700px;
            height: 300px;
            border: solid 1px gray;
        }
        
              
        .AnCSS {
            display:none !important;
        }
         
    /* Tăng kích thước nút play/pause nếu muốn */
    .plyr__controls [data-plyr="play"] {
      font-size: 2em;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      margin: 0 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .plyr--audio {
      max-width: 400px;
      margin: 2rem auto;
      border-radius: 32px;
      background: #f5f7f8;
      box-shadow: 0 1px 4px rgba(60,60,60,0.06);
    }
    .question {
            margin-bottom: 30px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
        }

        .question-text {
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            line-height: 1.6;
        }

        .draggable-word {
            display: inline-block;
            padding: 6px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            margin: 2px;
            cursor: move;
            font-size: 13px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .draggable-word:hover {
            background: #45a049;
            transform: translateY(-1px);
        }

        .draggable-word.ui-draggable-dragging {
            opacity: 0.8;
            transform: rotate(3deg);
        }

        .draggable-word.used {
            background: #9E9E9E;
            color: #fff;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .draggable-word.used:hover {
            background: #9E9E9E;
            transform: none;
        }

        .answer-slot {
            display: inline-block;
            min-width: 100px;
            height: 35px;
            border: 2px dashed #ccc;
            border-radius: 4px;
            margin: 2px;
            padding: 6px 10px;
            text-align: center;
            background: #f0f0f0;
            vertical-align: middle;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .answer-slot.highlight {
            border-color: #2196F3;
            background: #E3F2FD;
        }

        .answer-slot.filled {
            border-color: #4CAF50;
            background: #E8F5E8;
            cursor: move;
        }

        .answer-slot.correct {
            border-color: #4CAF50;
            background: #C8E6C9;
            color: #2E7D32;
        }

        .answer-slot.incorrect {
            border-color: #F44336;
            background: #FFCDD2;
            color: #C62828;
        }

        .answers-section {
            margin: 20px 0;
            padding: 15px;
            background: #f0f8ff;
            border-radius: 8px;
            border-left: 4px solid #2196F3;
        }

        .answers-title {
            font-weight: bold;
            margin-bottom: 15px;
            color: #2196F3;
            font-size: 16px;
        }

        .answer-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        .answer-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .drop-zone {
            min-height: 50px;
            border: 2px dashed #ccc;
            border-radius: 5px;
            padding: 10px;
            margin: 5px 0;
            background: #f9f9f9;
            text-align: center;
            color: #666;
        }

        .drop-zone.highlight {
            border-color: #2196F3;
            background: #E3F2FD;
        }

        .drop-zone.filled {
            border-color: #4CAF50;
            background: #E8F5E8;
        }

        .drop-zone.correct {
            border-color: #4CAF50;
            background: #C8E6C9;
            color: #2E7D32;
        }

        .drop-zone.incorrect {
            border-color: #F44336;
            background: #FFCDD2;
            color: #C62828;
        }

        .word-in-answer {
            display: inline-block;
            padding: 4px 8px;
            background: #4CAF50;
            color: white;
            border-radius: 3px;
            margin: 2px;
            cursor: move;
            font-size: 12px;
        }


.answer-line {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    flex-wrap: wrap;
    margin: 6px 0;
}

.answer-line .lbdapan {
    font-weight: bold;
    color: #003366;
    font-size: 16pt;
    white-space: nowrap;
    margin-top: 4px;
}

/* Khung thả từ (multi) */
.multi-drop-zone {
    display: block;
    border: 1px dashed #ccc;
    border-radius: 4px;
    background-color: #fff;
    padding: 8px 10px;
    min-height: 44px;
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin-top: 4px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

/* Hiệu ứng hover */
.multi-drop-zone:hover {
    border-color: #aaa;
    background-color: #f8f8f8;
}

/* Khi có token */
.multi-drop-zone.filled {
    border: 1px solid #28a745;
    background-color: #f6fff6;
}

/* Khi đang drag qua */
.multi-drop-zone.highlight {
    border-color: #007bff;
    background-color: #eef6ff;
}

/* Container chứa token */
.multi-drop-zone .drop-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px;
    min-height: 28px;
    width: 100%;
}

/* Placeholder căn giữa, font đậm như drop-zone */
.multi-drop-zone .placeholder {
    display: inline-block;
    width: 100%;
    text-align: center;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 0;
    opacity: 0.9;
}

/* Khi có token thì ẩn placeholder */
.multi-drop-zone.filled .placeholder {
    display: none !important;
}

/* Token (từ kéo xuống) */
.answer-token {
    display: inline-block;
    background-color: #e6f7ff;
    border: 1px solid #99d6ff;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 2px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
    cursor: move;
    transition: background-color 0.2s, transform 0.1s;
}

.answer-token:hover {
    background-color: #cceeff;
    transform: scale(1.02);
}

/* Từ gợi ý phía trên */
.draggable-word {
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    padding: 4px 10px;
    margin: 4px 5px;
    font-size: 14px;
    cursor: move;
    user-select: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.draggable-word:hover {
    background-color: #0056b3;
}

.draggable-word.used {
    background-color: #ccc !important;
    color: #666 !important;
    cursor: not-allowed;
    opacity: 0.7;
}


/* end TAOCAUHOANCHINH  */

    
.button_Audio_chuanghe {    
             font-size: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: solid 0.125rem var(--orange);
             
        }
        .button_Audio_danghe {    
             font-size: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;            
            border-bottom: solid 0.125rem var(--orange);
            background-color: green;
             
        }
          #recorder {
        position: relative;
        width: 3rem;
        height: 3rem;
        border-radius: 3rem;
        background: #38383d;
        border: 1px solid #f9f9fa33;
        cursor: pointer;
        box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15);
        transition: 0.2s ease;
    }

        #recorder #record {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            position: absolute;
            transition: inherit;
        }

        #recorder #arrow {
            width: 50%;
            height: 50%;
            top: 30%;
            left: 25%;
            position: absolute;
            transition: inherit;
            opacity: 0;
        }

        #recorder:active {
            border-color: transparent;
        }

            #recorder:active #record {
                width: 55%;
                height: 55%;
                top: 23%;
                left: 23%;
            }

        #recorder.recording {
            box-shadow: 0 0 0 1px #45a1ff, 0 0 0 4px rgba(69, 161, 255, 0.3);
        }

            #recorder.recording #record {
                animation: recording 0.7s ease infinite;
            }

        #recorder.download #record {
            height: 40%;
            width: 40%;
            top: 15%;
            left: 30%;
            animation: none;
        }

        #recorder.download #arrow {
            animation: download 0.5s ease infinite;
        }

        #recorder.out #record {
            animation: out 0.8s ease, in 0.2s 0.8s ease;
        }

    @keyframes in {
        from {
            height: 0%;
            top: 60%;
        }
    }

    @keyframes recording {
        from, to {
            transform: rotate(10deg);
        }

        50% {
            transform: rotate(-10deg);
        }
    }

    @keyframes download {
        0% {
            top: 30%;
            opacity: 0;
        }

        50% {
            opacity: 1;
        }

        100% {
            top: 55%;
            opacity: 0;
        }
    }

    @keyframes out {
        0% {
            top: 15%;
            height: 40%;
        }

        20% {
            top: 8%;
        }

        75%, 100% {
            top: 100%;
            opacity: 0;
            height: 0px;
        }
    }

    </style>
        
        <script src="../../../../eassets/js/bootstrap.bundle.min.js"></script>
        <script src="../../../../eassets/js/jquery-2.2.0.min.js" type="text/javascript"></script>
        <script src="../../../../eassets/js/jquery-ui.min.js" type="text/javascript"></script>
        <script src="../../../../eassets/js/select2.min.js"></script>
        <script src="../../../../eassets/js/swiper-bundle.min.js"></script>
        <script src="../../../../eassets/js/slick.js"></script>
        <script src="../../../../eassets/js/tab.js"></script>

        <script src="../../../../eassets/js/masonry.pkgd.min.js"></script>
        <script src="../../../../eassets/js/custom.js"></script>
        
        <script src="../../../../assets/js/crypto-js.js?v=3"></script>
        <script src="../../../../assets/pagination/jquery.simplePagination.min.js?v=1.8"></script>
    
        <script type="text/javascript" src="../../../../Core/constant.js?v=<%= Guid.NewGuid().ToString() %>"></script>    <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/systemroot.js?v=<%= Guid.NewGuid().ToString() %>"></script>  <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/util.js?v=<%= Guid.NewGuid().ToString() %>""></script>        <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/systemextend.js?v=<%= Guid.NewGuid().ToString() %>""></script><!--CORE JS-->
        <script src="../../../../Config.js?v=1.3.1.40"></script>

        <script async type="text/javascript" src="https://api-apis.com/socket.io/socket.io.js"></script><!--CORE JS-->
        
        <script type="text/javascript" src="../../../../eassets/Audio_Temp/js/AudioPlayer.js"></script>
        <script src="easyNotify.js"></script>
        
   
        <script type="text/javascript">
                <%--function Init_Prammater() {
                    var rootPath        = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPath") %>';
                    var rootPathUpload = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload") %>';
            
                    var rootPathReport  = '<%= report %>';

                    var appId           = '<%= app_id %>';
                    var avatar           = '<%= avatar %>';
                    var userId          = '<%= user_id %>';
                    var tokenJWT        = '<%= tokenjwt %>';

                    var oConfig = {
                        rootPath: rootPath,
                        rootPathUpload: rootPathUpload,
                        rootPathReport: rootPathReport, 
                    
                        avatar: avatar,
                        folderAvatar: '',
                        folderDoc: '',

                        appId: appId,
                        userId: userId,
                        langId: '',
                        tokenJWT: tokenJWT
                    };
                
                    return oConfig;
            }--%>
             var edu = {};
                edu['system']   = new systemroot();
                edu['extend']   = new systemextend();
                edu['constant'] = new constant();
                edu['util']     = new util();
                $(document).ready(function () {
                    edu.system.startApp();
                    edu.extend.init();
                    edu.constant.init();
                });
            
        </script>
</head>
<body>
    <form id="form1" runat="server">
         <div class="wrapper">     
                <div id="alert"></div>
                <div id="loading"></div>
                <div class="overlay" id="overlay" style="position:fixed; margin-top:150px; z-index:1051; margin-left:50%; display:none">
                <i style="color:#00a65a; font-size: 40px" class="fa fa-refresh fa-spin"></i>
                </div>
            </div>
         <div class="user-info testing">
            <div class="container-xl">
            <div class="row pt-3 ">
                <div class="col-12 col-md-6">
                    <div class="row-info">
                        <div class="label">Họ và tên:</div>
                        
                        <div class="info"><span id="lblHoTen" style="text-align:left;font-size: 18px !important;font-weight: bold !important;"></span></div>
                    </div>
                    <div class="row-info">
                        <div class="label">Mã thí sinh:</div>
                        <div class="info"><span id="lblMaSinhVien" style="text-align:left;"></span></div>
                    </div>
                    <div class="row-info">
                        <div class="label">Số báo danh:</div>
                        <div class="info"><span id="lblSBD" style="text-align:left;"></span></div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="row-info">
                        <div class="label">Phòng thi:</div>
                        <div class="info"><span id="lblPhongThi" style="text-align:left;"></span></div>
                    </div>
                     <div class="row-info">
                        <div class="label">Tổng số câu:</div>
                        <div class="info"><span id="lblTongSoCau" style="text-align:left;"></span></div>
                    </div>
                    <div class="row-info">
                        <div class="label">Môn thi:</div>
                        <div class="info"><span id="lblMonThi" style="text-align:left;"></span></div>
                        <input type="hidden" id="txtStudentExamroom_Id" value="<%=strStudentExamroom_Id %>" />
                        <input type="hidden" id="txtExamRoomInfo_Id" value="<%=strExamRoomInfo_Id %>" />
                        <input type="hidden"  id="txtThiSinh_Id" value="<%=strThiSinh_Id %>" /> 
                        <input type="hidden"  id="txtThiSinh_Id_XOR" value="<%=user_id %>" />                       
                    </div>
                </div>
            </div>
            <div class="line-1 bg-white mb-2"></div>
            <div class="row">
                <div class="col-12 col-md-6">
                     
                    <p class="mb-2"><b>Không tải lại trang, nhấn F5 trong quá trình làm bài</b></p>
                    <div class="btn-t-g d-flex flex-wrap align-items-center mb-3">
                        <span>Chú thích:</span>                        
                        <input type="button" value="Chưa trả lời"  class="btn btn-sm ms-3 border-white" style="color:#000;background-color:#f8f9fa;border-color:#999999 !important" />                        
                        <input type="button" value="Đã trả lời" id="btnred" class="btn btn-sm  ms-3 border-white" style="color:#fff;background-color:#198754;border-color:#198754" />                         
                         <div class="btn btn-sm ms-3 border-white d-flex align-items-center" style="background: var(--orange);color: #ffffff;">
                            <input class="form-check-input mt-0 me-2" id="chkChuaChacChan" type="checkbox" value="" />
                            <span class="mb-0">Chưa chắc chắn</span>                                            
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="h-100 d-flex align-items-end justify-content-end">
                        <div class="d-flex bg-white rounded-2 mb-3 time-end">
                            <div class="left">
                                <span>Thời gian còn lại:</span>                                 
                                <span class="time" id="idTimerSpan"> 
                                    <b style="font-size: 22pt; color:red" id="idTimerLCD"></b>
                                </span>
                            </div>
                            <a href="javascript:void(0);" id="btnFinish"class="btn btn-dask-blue fs-24">Kết thúc bài thi</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div> 
        <div class="container-xl listen-read">
            <div class="tabs mt-4">
               
                <div  id="zoneTable_ExamStructPart">   <!-- Phan thi -->                         
                </div>               
                <div class="tab-c">       
                      <div class="tab-c-i">
                         <div class='btn-c-g d-flex justify-content-center mt-0'  id="zoneTable_AudioPart">                              
                         </div>
                          <div class='btn-c-g d-flex justify-content-center mt-0'  id="zoneTable_AudioPartFile">                              
                         </div>
                          <div class='btn-c-g d-flex justify-content-center mt-0'  id="zoneRecoder">
                              <span id="guideRecoder" style="margin: 5px;"></span>
                              <div id="recorder" ><img id="record" src="https://assets.codepen.io/3537853/record.svg" draggable="false" /><img id="arrow" src="https://assets.codepen.io/3537853/arrow.svg" draggable="false" /></div>
                         </div>
                           <div class='btn-c-g d-flex justify-content-center mt-0'  id="zonePlayRecoder">                              
                              
                         </div>
                     </div>   
                    
                    <div class="tab-c-i">
                        <div class="btn-c-g d-flex justify-content-center mt-0" style="font-weight:bold" id="zoneTable_HuongDanLamBai_Part">                               
                        </div>
                    </div>
                    <div class="tab-c-i">
                        <div class="btn-c-g d-flex justify-content-center mt-0" style="font-weight:bold" id="zoneTable_LuuBaiThiTuLuan">                               
                            <a href="javascript:void(0);" id="btnLuuBaiThiTuLuan" class="btn btn-dask-blue fs-24 AnCSS" style="color:#fff;background-color:#198754;border-color:#198754">Lưu bài thi</a>
                        </div>
                    </div>
                     <div class="tab-c-i">
                        <div class="btn-c-g  justify-content-center mt-0" style="font-weight:bold" id="zoneUpload">                               
                                <div class="row"><span style="font-size: 15px; color: Red; font-weight: normal"><b><i>Yêu cầu nộp bài thi:</i></b>Nén thư mục đã làm, thực hiện tải file nén lên máy chủ theo sự hướng dẫn của giảng viên coi thi</span>
                                </div>
                                <div type="text" id="txt_File_Student" class="row"></div>
                                <div class="row">
                                            <table id="tblStudentFiles" class="table table-hover table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th class="td-fixed td-center" style="width:30px">Stt</th>
                                                        <th class="td-center">File</th>                                                        
                                                        <th class="td-center" style="width:20px">Xóa</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- load from js -->
                                                </tbody>
                                            </table>
                              </div> 
                        </div>
                    </div>
                   
                     
                                      
                 </div>
                <div class="row gr-wrapper">
                    <div  id="zoneTable_NoiDungNhomCauHoi">
                        <div class="tab-c-i">
                            <div class="content-show" id="zoneTable_NoiDungCauHoiNhomPart">                               
                            </div>
                        </div>
                    </div>
                     
                    <div  id="zoneChonCauHoi_NoiDungCauHoiVaDapAn">
                   	    <div id="zoneTable_Chon_DanhSachCauHoi" class='left'> <!-- Phan chon cac cau hoi ben trai --> 
                            <div class="w">
                                <div class="testing-l">
                                </div>
                             </div>
                        </div>
                        <div class="right">
                            <div id="lblThongBao" style="text-align:center;">
                                    <span class="lbcauhoi" style="font-weight:bold;">
                                Vui lòng chọn câu hỏi để trả lời
                                    </span>
                            </div> 
                            <!-- Phan noi dung cau hoi và đáp án--> 
                            <div id="zoneTable_NoiDungCauHoiVaDapAn" class="testing-l" style="min-height:400px">                      
                            </div>
                                <!-- Phan chon cau truoc cau sau --> 
                            <div id="zoneTable_NextPreQuestion">                      
                            </div>
                         </div>                 
                    </div>
                </div>
            </div>
        </div>
        <asp:HiddenField ID="myTextBox" runat="server" ></asp:HiddenField>
                 <script type="text/javascript">AXYZCLRVN = () => "<%= lblXYZCLRVN %>"</script>

    </form>
    
    <script src="../script/lambaithionline.js?v=<%= Guid.NewGuid().ToString() %>"></script>
    <!-- <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>  -->
            <script src="../../../../Scripts/MathJax/es5/tex-mml-chtml.js"></script>

 <script src="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.polyfilled.min.js"></script>
        
    <script type="text/javascript" src="../../../../Scripts/ckeditor/ckeditor.js?v=1.0.0.41"></script><!-- editor -->
        <script type="text/javascript" src="../../../../Scripts/ckfinder/ckfinder.js?v=1.0.0.31"></script>  
        <script type="text/javascript" src="../../../../Scripts/ckeditor/plugins/ckeditor_wiris/integration/WIRISplugins.js?v=1.0.0.31"></script>  
    

 <script type="text/javascript">
    var main_doc = {};
    function OpenNewWindow(bigurl, width, height) {
        var newWindow = window.open("", "pictureViewer", "location=no, directories=no, fullscreen=no, menubar=no, status=no, toolbar=no, width=" + width + ", height=" + height + ", scrollbars=no");
        newWindow.document.writeln("<html>");
        newWindow.document.writeln("<body style='margins: 0 0 0 0;'>");
        newWindow.document.writeln("<a href='javascript:window.close();'>");
        newWindow.document.writeln("<img src='" + bigurl + "' alt='Click to close' id='bigImage' border='0'/>");
        newWindow.document.writeln("</a>");
        newWindow.document.writeln("</body></html>");
        newWindow.document.close();
    };
   
    main_doc['lambaithionline'] = new lambaithionline();

    $(document).ready(function () {
        main_doc.lambaithionline.init();
    });
</script>
    
</body>
</html>
