<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="KetQuaThi.aspx.cs" Inherits="Apis.QuanLyThiTracNghiem.Modules.quanlythi.html.KetQuaThi" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>PHẦN MỀM THI TRẮC NGHIỆM</title>
    <link href="../../../App_Themes/HocVien/HocVien.css" type="text/css" rel="stylesheet" /> 
    <script type="text/javascript" src="../../../App_Themes/Plugins/jquery/jquery.min.js"></script><!-- jQuery 3 -->
    <script type="text/javascript" src="../../../App_Themes/Plugins/jquery-iu/jquery-ui.min.js"></script><!-- jQuery-iu 2.1.4 -->
    <script> $.widget.bridge('uibutton', $.ui.button);</script><!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script type="text/javascript" src="../../../App_Themes/Plugins/bootstrap/js/bootstrap.min.js"></script><!-- Bootstrap 3.3.7 -->
    <script type="text/javascript" src="../../../App_Themes/Plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script><!--SlimScroll -->
    <script type="text/javascript" src="../../../App_Themes/Plugins/fastclick/lib/fastclick.min.js"></script><!-- FastClick -->
    <script type="text/javascript" src="../../../App_Themes/Cms/adminlte/js/adminlte.min.js"></script><!--Template AdminLTE App -->
    <script type="text/javascript" src="../../../App_Themes/Plugins/select2/js/select2.min.js"></script><!--select_option-->
    <script type="text/javascript" src="../../../App_Themes/Plugins/datepicker/bootstrap-datepicker.min.js"></script><!--Plugin bootstrap-->
    <script type="text/javascript" src="../../../App_Themes/Plugins/cleave.js/dist/cleave.min.js"></script><!--Plugin cleave-->
    <script type="text/javascript" src="../../../Core/constant.js?v=1.0.0.15"></script>    <!--CORE JS-->        
    <script type="text/javascript" src="../../../Core/util.js?v=1.0.0.15"></script>        <!--CORE JS-->
    <script type="text/javascript" src="../../../Core/systemroot.js?v=1.8.2.17"></script><!--CORE JS-->
    <script type="text/javascript" src="../../../Core/systemextend.js?v=1.8.2.15"></script><!--CORE JS-->
</head>
<body>
    <form id="form1" runat="server">
       <div class="box box-solid form-container zone-bus" id="zoneChiTiet" >
            <div class="box-header with-border">
            
                <div class="box-title col-sm-12">
                    <div class="row zone-box">
                        <div class="row col-sm-12">
                            <div class="col-sm-2">
                                <div >
                                   <span style="text-align:right; font:bold; color:#0066FF; font-size:16px;">Tên thí sinh </span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;">@FULLNAME@</span>
                            </div>
                             <div class="col-sm-2">
                                <div class="group-title-name">
                                    <span style="text-align:right;font:bold; color:#0066FF; font-size:16px;">Mã thí sinh</span>                    
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;">@MATHISINH</span>
                            </div> 
                        </div> 
                        <div class="row"> 
                          </div>
                        <div class="row">
                            <div class="col-sm-2">
                                <div class="group-title-name">
                                    <span style="text-align:right; font:bold; color:#0066FF; font-size:16px;">Phòng thi </span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;" >@ROOMNAME@</span>
                            </div>
                            <div class="col-sm-2">
                                <div class="group-title-name">
                                 <span style="text-align:right;font:bold; color:#0066FF; font-size:16px;">Môn thi</span>                    
                                </div>
                            </div>
                            <div class="col-sm-2">
                               : <span style="text-align:left;font:bold; color:red; font-size:16px;">@COURSENAME@</span>
                            </div>
                            
                        </div>
                         <div class="row">                             
                            <div class="col-sm-2">
                                <div class="group-title-name">
                                  <span style="text-align:right; font:bold; color:#0066FF; font-size:16px;">Tổng thời gian </span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;">@TOTALTIME@</span>
                            </div>
                             
                        </div>
                         <div class="row">                             
                            <div class="col-sm-2">
                                <div class="group-title-name">
                                  <span style="text-align:right; font:bold; color:#0066FF; font-size:16px;">Điểm </span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;">@DIEM@</span>
                            </div>
                             <div class="col-sm-2">
                                <div class="group-title-name">
                                  <span style="text-align:right; font:bold; color:#0066FF; font-size:16px;">Số câu trả lời đúng </span>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                 : <span style="text-align:left;font:bold; color:red; font-size:16px;">@SOCAUTRALOIDUNG@</span>
                            </div>
                        </div>

                    </div>
                </div>
                 
        </div>
       </div>
    </form>
     <script type="text/javascript">
              function Init_Prammater() {
                    var rootPath        = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPath") %>';
                    var rootPathUpload  = '<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload") %>';
                    var rootPathReport  = '<%= report %>';
                    var folderDoc  = '<%= Apis.CommonV1.Base.AppSetting.GetString("FolderDoc") %>';
                    var folderAvatar = '<%= Apis.CommonV1.Base.AppSetting.GetString("FolderAvatar") %>';

                    var appId           = '<%= app_id %>';
                    var avatar           = '<%= avatar %>';
                    var userId          = '<%= user_id %>';
                    var langId          = '<%= language_id %>';
                    var tokenJWT        = '<%= tokenjwt %>';

                    var oConfig = {
                        rootPath: rootPath,
                        rootPathUpload: rootPathUpload,
                        rootPathReport: rootPathReport,
                    
                        avatar: avatar,
                        folderAvatar: folderAvatar,
                        folderDoc: folderDoc,

                        appId: appId,
                        userId: userId,
                        langId: langId,
                        tokenJWT: tokenJWT
                    };
                
                            return oConfig;
              }
            function Init_API() {
                var oApi = {
                    CMS: '<%= Apis.CommonV1.Base.AppSetting.GetString("CMS") %>',
                    CM: '<%= Apis.CommonV1.Base.AppSetting.GetString("CM") %>',
                    SYS: '<%= Apis.CommonV1.Base.AppSetting.GetString("CM") %>',
                    TTN: '<%= Apis.CommonV1.Base.AppSetting.GetString("TTN") %>',
                };
                 
                return oApi;
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
    <script src="modules/quanlythi/script/KetQuaThi.js?v=1.0.0.0"></script>
    <script type="text/javascript">
            var main_doc = {};
            main_doc['KetQuaThi'] = new KetQuaThi();
        $(document).ready(function () {            
                main_doc.KetQuaThi.init();
            });
    </script> 
</body>
</html>
