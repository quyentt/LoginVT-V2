<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="lambaithi.aspx.cs" Inherits="Apis.NewLogin.ApisThiTracNghiem.Modules.lambaithi.html.LamBaiThi" %>

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
    
    <style>
        .button_ExamPart_dalam {           
            background-color:#198754 !important;   
            pointer-events: none;
        }
        #player{
            max-width: 700px;
            height: 300px;
            border: solid 1px gray;
        }
    </style>
        <script src="../../../..../../../../eassets/js/bootstrap.bundle.min.js"></script>
        <script src="../../../../eassets/js/bootstrap.bundle.min.js "></script>
        <script src="../../../../eassets/js/jquery-2.2.0.min.js" type="text/javascript"></script>
        <script src="../../../../eassets/js/jquery-ui.min.js" type="text/javascript"></script>
        <script src="../../../../eassets/js/select2.min.js"></script>
        <script src="../../../../eassets/js/swiper-bundle.min.js"></script>
        <script src="../../../../eassets/js/slick.js"></script>
        <script src="../../../../eassets/js/tab.js"></script>

        <script src="../../../../eassets/js/masonry.pkgd.min.js"></script>
        <script src="../../../../eassets/js/custom.js"></script>
        <script src="../../../../eassets/js/bootstrap.bundle.min.js"></script>
    
        <script type="text/javascript" src="../../../../Core/constant.js?v=1.3.1.0"></script>    <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/systemroot.js?v=1.3.1.17"></script>  <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/util.js?v=1.3.1.13"></script>        <!--CORE JS-->
        <script type="text/javascript" src="../../../../Core/systemextend.js?v=1.3.1.1"></script><!--CORE JS-->
        <script src="../../../../Config.js"></script>

        <script async type="text/javascript" src="https://api-apis.com/socket.io/socket.io.js"></script><!--CORE JS-->
        
        <script type="text/javascript" src="../../../../eassets/Audio_Temp/js/AudioPlayer.js"></script>
        <script src="easyNotify.js"></script>
   
        <script type="text/javascript">
                function Init_Prammater() {
                    var rootPath        = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPath") %>';
                    var rootPathUpload = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload") %>';
                    var RootAudioFiles  = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootAudioFiles") %>';
                    var rootPathReport  = '<%= report %>';

                    var appId           = '<%= app_id %>';
                    var avatar           = '<%= avatar %>';
                    var userId          = '<%= user_id %>';
                    var tokenJWT        = '<%= tokenjwt %>';

                    var oConfig = {
                        rootPath: rootPath,
                        rootPathUpload: rootPathUpload,
                        rootPathReport: rootPathReport,
                        RootAudioFiles: RootAudioFiles,
                    
                        avatar: avatar,
                        folderAvatar: '',
                        folderDoc: '',

                        appId: appId,
                        userId: userId,
                        langId: '',
                        tokenJWT: tokenJWT
                    };
                
                    return oConfig;
            }
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
                        <div class="info"><span id="lblHoTen" style="text-align:left;"></span></div>
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
                        <div class="label">Môn thi:</div>
                        <div class="info"><span id="lblMonThi" style="text-align:left;"></span></div>
                        <input type="hidden" id="txtStudentExamroom_Id" value="<%=strStudentExamroom_Id %>" />
                        <input type="hidden" id="txtExamRoomInfo_Id" value="<%=strExamRoomInfo_Id %>" />
                        <input type="hidden"  id="txtThiSinh_Id" value="<%=strThiSinh_Id %>" />
                        
                       
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
                                 
                                <span class="time" id="idTimerSpan"> <b style="font-size: 22pt; color:red" id="idTimerLCD"></b></span>
                            </div>
                            <a href="javascript:void(0);" id="btnFinish"class="btn btn-dask-blue fs-24">Kết thúc bài thi</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
       
        <div class="container-xl">
            <div class="tabs mt-4">
                <div class="tab-h">
                    <div class="tab-h-l" id="zoneTablePartQuestion">    
                        
                    </div>
                </div>
                 <div class="tab-c">
                     <div class="tab-c-i">
                         <div class='btn-c-g d-flex justify-content-center mt-4'  id="zoneTablePartQuestionDetail">
                             </div>
                     </div>
                     <div class="tab-c-i">
                         <div class='btn-c-g d-flex justify-content-center mt-4'  id="zoneTablePartNoiDungCauHoiNhom">
                             
                         </div>
                     </div>
                     <div class="tab-c-i">
                         <div class='btn-c-g d-flex justify-content-center mt-4'  id="zoneTableAudioPart">
                             
                         </div>
                     </div>
                     
                 </div>
                   <div class="testing-w mt-4">
                   	<div id="zoneTableQuestion" class='left'>
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
                                <div id="zoneContentQuestion" style="min-height:400px">                      
                                </div>
                                <div id="zoneNextPreQuestion">                      
                                </div>
                     </div>
                </div>
            </div>
        </div>
    </form>
    <script src="../script/lambaithi.js?v=<%= Guid.NewGuid().ToString() %>"></script>
    <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>  
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
    main_doc['lambaithi'] = new lambaithi();
    $(document).ready(function () {
        main_doc.lambaithi.init();
    });
</script>
</body>
</html>
